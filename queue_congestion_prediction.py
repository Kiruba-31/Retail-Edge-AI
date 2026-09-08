import argparse
import csv
import json
import time
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np
from video_metadata_recorder import VideoMetadataRecorder

# ----------------------------------------------------------------------------
# Constants for the people-queue version
# ----------------------------------------------------------------------------

# Fixed-spacing estimate for an angled CCTV shot: this is a rough approximation,
# not a floor-calibrated measurement. It assumes people stand at near-uniform
# spacing, which is imperfect for crowded scenes and people near/far from camera.
PEOPLE_QUEUE_SPACING_M = 0.55

# People naturally shift weight, move slightly, and turn while standing in line.
STATIONARY_FRAMES_REQUIRED = 6
MOVEMENT_THRESHOLD_PX = 8.0

# COCO person class id.
COCO_PERSON_CLASS = {0: "person"}

# How many past per-second queue-length readings to keep for the trend
# forecast (extension beyond the paper).
TREND_WINDOW_SECONDS = 20

# Window used for Little's Law throughput estimate.
EXIT_WINDOW_SECONDS = 30

# Trend threshold (m/s) for classifying a forecast as RISING/FALLING/STABLE.
TREND_EPSILON_M_PER_SEC = 0.15
TRACK_DEDUP_IOU_THRESHOLD = 0.6


# ----------------------------------------------------------------------------
# Lane configuration
# ----------------------------------------------------------------------------

@dataclass
class Lane:
    """A people queue lane, defined manually:
    a polygon bounding the queueing area from the stop line backwards
    so anything past the stop line is naturally excluded from the queue.
    """
    name: str
    polygon: np.ndarray               # Nx2 int32 array, queueing area only
    stop_line: Optional[Tuple[Tuple[int, int], Tuple[int, int]]] = None  # for drawing only
    max_queue_length_m: float = 60.0  # used to normalize congestion severity

    def contains(self, point: Tuple[float, float]) -> bool:
        return cv2.pointPolygonTest(self.polygon, point, False) >= 0


def load_lanes(config_path: str) -> List[Lane]:
    with open(config_path, "r") as f:
        cfg = json.load(f)
    lanes = []
    for lane_cfg in cfg["lanes"]:
        poly = np.array(lane_cfg["polygon"], dtype=np.int32)
        stop_line = None
        if "stop_line" in lane_cfg:
            p1, p2 = lane_cfg["stop_line"]
            stop_line = (tuple(p1), tuple(p2))
        lanes.append(
            Lane(
                name=lane_cfg["name"],
                polygon=poly,
                stop_line=stop_line,
                max_queue_length_m=lane_cfg.get("max_queue_length_m", 60.0),
            )
        )
    return lanes


def load_exclusion_zones(config_path: str) -> List[np.ndarray]:
    with open(config_path, "r") as f:
        cfg = json.load(f)
    return [np.array(zone["polygon"], dtype=np.int32) for zone in cfg.get("exclusion_zones", [])]


# ----------------------------------------------------------------------------
# Per-track motion state (drives the "queued person" rule)
# ----------------------------------------------------------------------------

@dataclass
class TrackState:
    centroid_history: deque = field(default_factory=lambda: deque(maxlen=5))
    stationary_streak: int = 0
    movement_threshold_px: float = MOVEMENT_THRESHOLD_PX
    still_frames_required: int = STATIONARY_FRAMES_REQUIRED

    def update(self, centroid: Tuple[float, float]) -> bool:
        """Update motion history with a new centroid, return True if the
        track is currently classified as 'still' / queued per the configured rule."""
        if self.centroid_history:
            prev = self.centroid_history[-1]
            disp = np.hypot(centroid[0] - prev[0], centroid[1] - prev[1])
            if disp <= self.movement_threshold_px:
                self.stationary_streak += 1
            else:
                self.stationary_streak = 0
        self.centroid_history.append(centroid)
        return self.stationary_streak >= self.still_frames_required


# ----------------------------------------------------------------------------
# Congestion classification + trend forecast (extension beyond the paper)
# ----------------------------------------------------------------------------

def classify_congestion(queue_length_m: float, lane: Lane) -> str:
    ratio = queue_length_m / max(lane.max_queue_length_m, 1e-6)
    if ratio < 0.4:
        return "LOW"
    elif ratio < 0.75:
        return "MEDIUM"
    else:
        return "HIGH"


def estimate_wait_time(queue_count: int, exit_times: deque, window_seconds: float = EXIT_WINDOW_SECONDS) -> float:
    """Little's Law wait-time estimate using observed departures from the queue."""
    if queue_count <= 0:
        return 0.0
    cutoff = time.monotonic() - window_seconds
    recent_exits = [ts for ts in exit_times if ts >= cutoff]
    if not recent_exits:
        return 0.0
    service_rate = len(recent_exits) / max(window_seconds, 1e-6)
    return queue_count / max(service_rate, 1e-6)


def forecast_trend(history: deque) -> Tuple[float, str]:
    """Fit a simple linear trend to the recent per-second queue-length
    readings and extrapolate one step ahead. This is a lightweight
    stand-in for a full predictive model -- swap in an ARIMA/LSTM model
    here later if you want a stronger forecast."""
    if len(history) < 3:
        last = history[-1] if history else 0.0
        return last, "STABLE"

    y = np.array(history, dtype=np.float64)
    x = np.arange(len(y), dtype=np.float64)
    slope, intercept = np.polyfit(x, y, 1)
    predicted_next = float(slope * len(y) + intercept)
    predicted_next = max(predicted_next, 0.0)

    if slope > 0.15:
        trend = "RISING"
    elif slope < -0.15:
        trend = "FALLING"
    else:
        trend = "STABLE"
    return predicted_next, trend


# ----------------------------------------------------------------------------
# Main predictor
# ----------------------------------------------------------------------------

class QueueCongestionPredictor:
    def __init__(self, model_path: str, lanes: List[Lane], conf_thresh: float = 0.3,
                 still_frames_required: int = STATIONARY_FRAMES_REQUIRED,
                 movement_threshold_px: float = MOVEMENT_THRESHOLD_PX,
                 queue_spacing_m: float = PEOPLE_QUEUE_SPACING_M,
                 trend_window_seconds: int = TREND_WINDOW_SECONDS,
                 exit_window_seconds: float = EXIT_WINDOW_SECONDS,
                 exclusion_zones: Optional[List[np.ndarray]] = None,
                 track_dedup_iou_threshold: float = TRACK_DEDUP_IOU_THRESHOLD):
        from ultralytics import YOLO
        from deep_sort_realtime.deepsort_tracker import DeepSort

        self.model = YOLO(model_path)
        self.tracker = DeepSort(
            max_age=30,
            n_init=3,
            max_cosine_distance=0.2,
            nn_budget=100,
        )
        self.lanes = lanes
        self.conf_thresh = conf_thresh
        self.still_frames_required = still_frames_required
        self.movement_threshold_px = movement_threshold_px
        self.queue_spacing_m = queue_spacing_m
        self.trend_window_seconds = trend_window_seconds
        self.exit_window_seconds = exit_window_seconds
        self.exclusion_zones = exclusion_zones or []
        self.track_dedup_iou_threshold = track_dedup_iou_threshold

        # per-track motion state, keyed by Deep SORT track id
        self.track_states: Dict[str, TrackState] = {}

        # per-lane rolling history of queue-length readings (for forecast)
        self.lane_history: Dict[str, deque] = {
            lane.name: deque(maxlen=self.trend_window_seconds) for lane in lanes
        }

        # per-lane, per-second frame buffer for Q1/Q2/Q3 (paper Eq. 1-3)
        self.lane_second_buffer: Dict[str, List[float]] = {lane.name: [] for lane in lanes}

        # per-lane recent exits used by Little's Law wait-time estimate
        self.lane_exit_times: Dict[str, deque] = {lane.name: deque() for lane in lanes}

        # last known lane for each track to compute exits
        self.track_last_lane: Dict[int, str] = {}

    # -- detection -------------------------------------------------------

    def _detect(self, frame: np.ndarray) -> List[Tuple[List[float], float, int]]:
        """Returns detections for person class only, in the format deep-sort-realtime expects."""
        results = self.model.predict(frame, conf=self.conf_thresh, classes=list(COCO_PERSON_CLASS.keys()), verbose=False)[0]
        detections = []
        for box in results.boxes:
            cls_id = int(box.cls[0])
            if cls_id not in COCO_PERSON_CLASS:
                continue
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            centroid = ((x1 + x2) / 2.0, (y1 + y2) / 2.0)
            if any(cv2.pointPolygonTest(zone, centroid, False) >= 0 for zone in self.exclusion_zones):
                continue
            detections.append(([x1, y1, x2 - x1, y2 - y1], conf, cls_id))
        return detections

    @staticmethod
    def _box_iou(first: Tuple[float, float, float, float],
                 second: Tuple[float, float, float, float]) -> float:
        x1 = max(first[0], second[0])
        y1 = max(first[1], second[1])
        x2 = min(first[2], second[2])
        y2 = min(first[3], second[3])
        intersection = max(0.0, x2 - x1) * max(0.0, y2 - y1)
        first_area = max(0.0, first[2] - first[0]) * max(0.0, first[3] - first[1])
        second_area = max(0.0, second[2] - second[0]) * max(0.0, second[3] - second[1])
        union = first_area + second_area - intersection
        return intersection / union if union > 0.0 else 0.0

    def _deduplicate_tracks(self, tracks):
        kept = []
        for track in sorted(tracks, key=lambda item: item["confidence"], reverse=True):
            if any(self._box_iou(track["bbox"], other["bbox"]) > self.track_dedup_iou_threshold
                   for other in kept):
                continue
            kept.append(track)
        return kept

    # -- per-frame update --------------------------------------------------

    def _update_tracks(self, detections, frame):
        tracks = self.tracker.update_tracks(detections, frame=frame)
        live_tracks = []
        for t in tracks:
            if not t.is_confirmed():
                continue
            x1, y1, x2, y2 = t.to_ltrb()
            centroid = ((x1 + x2) / 2.0, (y1 + y2) / 2.0)
            confidence = float(t.det_conf) if t.det_conf is not None else 0.0
            state = self.track_states.setdefault(
                str(t.track_id),
                TrackState(
                    movement_threshold_px=self.movement_threshold_px,
                    still_frames_required=self.still_frames_required,
                ),
            )
            state.movement_threshold_px = self.movement_threshold_px
            state.still_frames_required = self.still_frames_required
            is_stopped = state.update(centroid)
            live_tracks.append(
                {"id": t.track_id, "bbox": (x1, y1, x2, y2), "centroid": centroid,
                 "stopped": is_stopped, "confidence": confidence}
            )
        return self._deduplicate_tracks(live_tracks)

    def _lane_queue_length(self, lane: Lane, tracks) -> Tuple[int, float]:
        """Count-based queue length for people using average standing spacing."""
        stopped_in_lane = [
            trk for trk in tracks if trk["stopped"] and lane.contains(trk["centroid"])
        ]
        count = len(stopped_in_lane)
        queue_length_m = count * self.queue_spacing_m
        return count, queue_length_m

    def _update_lane_exit_events(self, tracks):
        """Track distinct IDs leaving a zone to support Little's Law wait-time estimation."""
        current_lane_by_track: Dict[int, str] = {}
        for trk in tracks:
            lane_name = None
            for lane in self.lanes:
                if lane.contains(trk["centroid"]):
                    lane_name = lane.name
                    break
            if lane_name is not None:
                current_lane_by_track[trk["id"]] = lane_name

        for track_id, prev_lane in list(self.track_last_lane.items()):
            current_lane = current_lane_by_track.get(track_id)
            if current_lane is None or current_lane != prev_lane:
                self.lane_exit_times[prev_lane].append(time.monotonic())

        for track_id, current_lane in current_lane_by_track.items():
            self.track_last_lane[track_id] = current_lane

        for track_id in list(self.track_last_lane.keys()):
            if track_id not in current_lane_by_track:
                self.track_last_lane.pop(track_id, None)

    # -- drawing -----------------------------------------------------------

    def _draw(self, frame, tracks, lane_results):
        for zone in self.exclusion_zones:
            cv2.polylines(frame, [zone], True, (0, 165, 255), 2)
        for lane in self.lanes:
            cv2.polylines(frame, [lane.polygon], True, (0, 255, 0), 2)
            if lane.stop_line:
                cv2.line(frame, lane.stop_line[0], lane.stop_line[1], (0, 0, 255), 2)
            res = lane_results.get(lane.name)
            if res:
                anchor = tuple(lane.polygon[0])
                text = f"{lane.name}: {res['count']} people | {res['queue_length_m']:.1f} m | {res['level']}"
                cv2.putText(frame, text, (anchor[0], max(anchor[1] - 10, 15)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 0), 2)

        for trk in tracks:
            x1, y1, x2, y2 = [int(v) for v in trk["bbox"]]
            in_lane = any(lane.contains(trk["centroid"]) for lane in self.lanes)
            if in_lane:
                color = (0, 0, 255) if trk["stopped"] else (0, 255, 0)
                thickness = 2
                label = f"ID {trk['id']} {'STOP' if trk['stopped'] else 'MOVE'}"
            else:
                color = (128, 128, 128)
                thickness = 1
                label = f"ID {trk['id']}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)
            cv2.putText(frame, label, (x1, max(y1 - 5, 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
        return frame

    # -- main loop -----------------------------------------------------------

    def process_video(self, video_path: str, output_csv: str,
                       output_video: Optional[str] = None,
                       metadata_recorder: Optional[VideoMetadataRecorder] = None):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise IOError(f"Could not open video: {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        frames_per_second = max(int(round(fps)), 1)

        writer = None
        if output_video:
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            writer = cv2.VideoWriter(output_video, fourcc, fps, (width, height))

        csv_file = open(output_csv, "w", newline="")
        csv_writer = csv.writer(csv_file)
        csv_writer.writerow([
            "timestamp", "video_second", "lane", "queued_people_count",
            "Q1_first_frame_m", "Q2_avg_m", "Q3_max_m",
            "congestion_level", "predicted_next_second_m", "trend",
            "estimated_wait_seconds"
        ])

        frame_idx = 0
        video_second = 0
        t0 = time.time()

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                detections = self._detect(frame)
                tracks = self._update_tracks(detections, frame)
                self._update_lane_exit_events(tracks)

                if metadata_recorder:
                    metadata_recorder.log_frame(
                        frame,
                        [
                            {
                                "track_id": track["id"],
                                "class": "person",
                                "bbox": [float(value) for value in track["bbox"]],
                                "conf": track["confidence"],
                            }
                            for track in tracks
                        ],
                    )

                lane_results = {}
                for lane in self.lanes:
                    count, q_len = self._lane_queue_length(lane, tracks)
                    self.lane_second_buffer[lane.name].append(q_len)
                    lane_results[lane.name] = {
                        "count": count,
                        "queue_length_m": q_len,
                        "level": classify_congestion(q_len, lane),
                    }

                if output_video:
                    frame = self._draw(frame, tracks, lane_results)
                    writer.write(frame)

                frame_idx += 1

                # Flush per-second aggregates: paper Eq. (1)-(3)
                if frame_idx % frames_per_second == 0:
                    for lane in self.lanes:
                        buf = self.lane_second_buffer[lane.name]
                        if not buf:
                            continue
                        q1 = buf[0]                       # Eq 1: first frame of the second
                        q2 = float(np.mean(buf))           # Eq 2: average of the second
                        q3 = float(np.max(buf))            # Eq 3: max of the second

                        history = self.lane_history[lane.name]
                        history.append(q3)  # use the conservative (max) estimate to drive the forecast
                        predicted_next, trend = forecast_trend(history)
                        level = classify_congestion(q3, lane)
                        wait_seconds = estimate_wait_time(
                            lane_results[lane.name]["count"],
                            self.lane_exit_times[lane.name],
                            self.exit_window_seconds,
                        )

                        csv_writer.writerow([
                            datetime.now().isoformat(timespec="seconds"),
                            video_second, lane.name,
                            lane_results[lane.name]["count"],
                            round(q1, 2), round(q2, 2), round(q3, 2),
                            level, round(predicted_next, 2), trend,
                            round(wait_seconds, 2),
                        ])

                        print(f"[t={video_second:>5}s] {lane.name:>10} | "
                              f"queued={lane_results[lane.name]['count']:>2} | "
                              f"Q1={q1:5.1f}m Q2={q2:5.1f}m Q3={q3:5.1f}m | "
                              f"{level:<6} | next~{predicted_next:5.1f}m ({trend}) | wait~{wait_seconds:5.1f}s")

                        self.lane_second_buffer[lane.name] = []
                    video_second += 1

        finally:
            cap.release()
            if writer:
                writer.release()
            if metadata_recorder:
                metadata_recorder.close()
            csv_file.close()

        elapsed = time.time() - t0
        print(f"\nDone. Processed {frame_idx} frames in {elapsed:.1f}s "
              f"({frame_idx / max(elapsed, 1e-6):.1f} FPS). Log saved to {output_csv}")


# ----------------------------------------------------------------------------
# CLI
# ----------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="People queue length estimation & congestion prediction "
                                                   "(YOLO + Deep SORT, retail/checkout queue variant)")
    parser.add_argument("--video", required=True, help="Path to input queue video (or 0 for webcam)")
    parser.add_argument("--lanes", required=True, help="Path to lanes_config.json")
    parser.add_argument("--model", default="yolov8n.pt",
                         help="YOLO weights. Use the standard COCO person model unless you have a custom queue model.")
    parser.add_argument("--conf", type=float, default=0.25, help="Detection confidence threshold")
    parser.add_argument("--still-frames", type=int, default=STATIONARY_FRAMES_REQUIRED,
                        help="How many consecutive frames a person must remain still to count as queued")
    parser.add_argument("--move-threshold", type=float, default=MOVEMENT_THRESHOLD_PX,
                        help="Pixel displacement threshold below which a person counts as still")
    parser.add_argument("--spacing", type=float, default=PEOPLE_QUEUE_SPACING_M,
                        help="Estimated standing spacing in meters per queued person")
    parser.add_argument("--exit-window", type=float, default=EXIT_WINDOW_SECONDS,
                        help="Trailing window in seconds for Little's Law throughput estimate")
    parser.add_argument("--output", default="queue_log.csv", help="Output CSV log path")
    parser.add_argument("--save-video", default=None, help="Optional path to save annotated video")
    parser.add_argument("--mongo-uri", default=None,
                        help="MongoDB URI; enables video metadata recording when provided")
    parser.add_argument("--mongo-db", default="retailedge", help="MongoDB database name")
    parser.add_argument("--camera-id", default="queue-camera", help="Camera identifier stored in MongoDB")
    parser.add_argument("--metadata-output-dir", default="recordings",
                        help="Directory for videos linked to MongoDB metadata")
    args = parser.parse_args()

    lanes = load_lanes(args.lanes)
    exclusion_zones = load_exclusion_zones(args.lanes)
    predictor = QueueCongestionPredictor(
        model_path=args.model,
        lanes=lanes,
        conf_thresh=args.conf,
        still_frames_required=args.still_frames,
        movement_threshold_px=args.move_threshold,
        queue_spacing_m=args.spacing,
        exit_window_seconds=args.exit_window,
        exclusion_zones=exclusion_zones,
    )
    metadata_recorder = None
    if args.mongo_uri:
        metadata_cap = cv2.VideoCapture(args.video)
        if not metadata_cap.isOpened():
            raise IOError(f"Could not open video: {args.video}")
        metadata_recorder = VideoMetadataRecorder(
            output_dir=args.metadata_output_dir,
            camera_id=args.camera_id,
            mongo_uri=args.mongo_uri,
            db_name=args.mongo_db,
            frame_width=int(metadata_cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1280,
            frame_height=int(metadata_cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 720,
            fps=metadata_cap.get(cv2.CAP_PROP_FPS) or 25.0,
        )
        metadata_cap.release()

    predictor.process_video(
        args.video,
        args.output,
        output_video=args.save_video,
        metadata_recorder=metadata_recorder,
    )


if __name__ == "__main__":
    main()
