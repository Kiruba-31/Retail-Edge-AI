import os
import queue
import threading
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

import cv2

try:
    from pymongo import ASCENDING, MongoClient
    from pymongo.errors import PyMongoError
except ImportError:  # MongoDB is optional unless --mongo-uri is provided.
    ASCENDING = None
    MongoClient = None

    class PyMongoError(Exception):
        pass


class VideoMetadataRecorder:
    """Write a recording to disk and its per-detection metadata to MongoDB."""

    def __init__(
        self,
        output_dir: str,
        camera_id: str,
        mongo_uri: str = "mongodb://localhost:27017",
        db_name: str = "retailedge",
        frame_width: int = 1280,
        frame_height: int = 720,
        fps: float = 20.0,
        batch_size: int = 30,
        flush_interval: float = 1.0,
    ):
        if MongoClient is None:
            raise RuntimeError(
                "MongoDB recording requires pymongo. Install dependencies with "
                "'python -m pip install -r requirements.txt'."
            )
        if batch_size < 1:
            raise ValueError("batch_size must be at least 1")
        if flush_interval <= 0:
            raise ValueError("flush_interval must be greater than 0")

        os.makedirs(output_dir, exist_ok=True)
        self.camera_id = camera_id
        self.video_id = str(uuid.uuid4())
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        self.video_path = os.path.join(
            output_dir, f"{camera_id}_{timestamp}_{self.video_id}.mp4"
        )

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        self.writer = cv2.VideoWriter(
            self.video_path, fourcc, fps, (frame_width, frame_height)
        )
        if not self.writer.isOpened():
            raise IOError(f"Could not open metadata video output: {self.video_path}")

        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.sessions = self.db["video_sessions"]
        self.events = self.db["frame_events"]
        self.events.create_index(
            [("video_id", ASCENDING), ("frame_number", ASCENDING)]
        )
        self.events.create_index(
            [("camera_id", ASCENDING), ("timestamp", ASCENDING)]
        )

        self.sessions.insert_one(
            {
                "video_id": self.video_id,
                "camera_id": camera_id,
                "video_path": self.video_path,
                "start_time": datetime.now(timezone.utc),
                "end_time": None,
                "fps": fps,
                "resolution": [frame_width, frame_height],
                "status": "recording",
            }
        )

        self._queue: queue.Queue[Dict[str, Any]] = queue.Queue()
        self._stop_event = threading.Event()
        self._worker = threading.Thread(
            target=self._drain_loop,
            name=f"mongo-recorder-{self.video_id[:8]}",
            daemon=True,
        )
        self._worker.start()
        self.frame_number = 0
        self._closed = False

    def log_frame(self, frame, detections: List[Dict[str, Any]]) -> None:
        """Write one frame and enqueue one MongoDB document per detection."""
        if self._closed:
            raise RuntimeError("VideoMetadataRecorder is already closed")

        self.frame_number += 1
        timestamp = datetime.now(timezone.utc)
        timestamp_ms = int(timestamp.timestamp() * 1000)
        self.writer.write(frame)

        for detection in detections:
            self._queue.put(
                {
                    "video_id": self.video_id,
                    "camera_id": self.camera_id,
                    "frame_number": self.frame_number,
                    "timestamp": timestamp,
                    "timestamp_ms": timestamp_ms,
                    "track_id": detection.get("track_id"),
                    "class": detection.get("class"),
                    "bbox": detection.get("bbox"),
                    "confidence": detection.get("conf"),
                }
            )

    def _drain_loop(self) -> None:
        buffer: List[Dict[str, Any]] = []
        last_flush = time.monotonic()
        while not self._stop_event.is_set() or not self._queue.empty():
            timeout = max(0.01, self.flush_interval - (time.monotonic() - last_flush))
            try:
                buffer.append(self._queue.get(timeout=timeout))
            except queue.Empty:
                pass

            if buffer and (
                len(buffer) >= self.batch_size
                or time.monotonic() - last_flush >= self.flush_interval
            ):
                self._flush(buffer)
                buffer = []
                last_flush = time.monotonic()

        if buffer:
            self._flush(buffer)

    def _flush(self, documents: List[Dict[str, Any]]) -> None:
        try:
            self.events.insert_many(documents, ordered=False)
        except PyMongoError as error:
            print(f"[VideoMetadataRecorder] Mongo insert_many failed: {error}")

    def close(self) -> None:
        """Flush pending metadata and mark the recording as completed."""
        if self._closed:
            return
        self._closed = True
        self._stop_event.set()
        self._worker.join(timeout=5)
        self.writer.release()
        self.sessions.update_one(
            {"video_id": self.video_id},
            {
                "$set": {
                    "end_time": datetime.now(timezone.utc),
                    "status": "completed",
                }
            },
        )
        self.client.close()