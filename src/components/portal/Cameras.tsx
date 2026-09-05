import { useState, useEffect } from "react";

const cameraFeeds = [
  {
    id: "CAM-01", location: "Entrance / Exit", zone: "Entrance", status: "online",
    metric: "People Count", value: "12 entering", img: "photo-1601628828688-632f38a5a7d0",
    detections: ["Person count: 12", "Entry rate: 3/min", "Exit rate: 1/min"],
    ai: "Shopper Detection · Zone Tracking",
  },
  {
    id: "CAM-02", location: "Store Floor", zone: "Grocery", status: "online",
    metric: "Occupancy", value: "62% (62/100)", img: "photo-1578916171728-46686eac8d58",
    detections: ["People: 42 in Grocery", "Dwell avg: 8.2 min", "Traffic: HIGH 🔥"],
    ai: "Zone Engine · Heatmap",
  },
  {
    id: "CAM-03", location: "Shelf A — Milk, Bread", zone: "Grocery Shelves", status: "online",
    metric: "Shelf Stock", value: "15% ⚠️ Low",
    img: "photo-1534452203293-494d7ddbf7e0",
    detections: ["Milk: 3/20 detected", "Bread: 0/15 ⚠️ OUT", "Juice: 28/30 ✅"],
    ai: "Shelf Engine · Object Detection",
  },
  {
    id: "CAM-04", location: "Billing / Checkout", zone: "Billing Area", status: "online",
    metric: "Queue Length", value: "8 customers",
    img: "photo-1556742049-0cfed4f6a45d",
    detections: ["Counter 2: 8 in queue", "Wait time: 5.1 min", "Congestion: PREDICTED"],
    ai: "Queue Engine · Prediction",
  },
];

export default function Cameras() {
  const [selected, setSelected] = useState<string | null>(null);
  const [aiBoxes, setAiBoxes] = useState(true);
  const [count, setCount] = useState(12);

  useEffect(() => {
    const t = setInterval(() => setCount(c => Math.max(8, Math.min(20, c + (Math.random() > 0.5 ? 1 : -1)))), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display font-700 text-gray-900">Live Camera Monitor</h3>
          <p className="text-sm text-gray-500 mt-0.5">4/4 cameras online · AI detection active · No raw video stored</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setAiBoxes(!aiBoxes)}
              className={`relative w-10 h-5 rounded-full transition-colors ${aiBoxes ? "bg-emerald-500" : "bg-gray-300"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${aiBoxes ? "left-5.5" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-gray-600 font-medium">AI Overlay</span>
          </label>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            All 4 Live
          </div>
        </div>
      </div>

      {/* Camera grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cameraFeeds.map((cam, idx) => (
          <div key={cam.id}
            onClick={() => setSelected(selected === cam.id ? null : cam.id)}
            className={`bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all ${selected === cam.id ? "border-emerald-400 ring-2 ring-emerald-100" : "border-gray-200 hover:border-gray-300"}`}>
            {/* Camera image */}
            <div className="relative h-48 bg-gray-900 overflow-hidden">
              <img
                src={`https://images.unsplash.com/${cam.img}?w=600&h=300&fit=crop&auto=format`}
                alt={cam.location}
                className="w-full h-full object-cover opacity-80"
              />
              {/* Simulated AI bounding boxes */}
              {aiBoxes && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {idx === 0 && <>
                    <rect x="20" y="30" width="15" height="40" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <text x="20" y="28" fill="#22c55e" fontSize="4" fontFamily="JetBrains Mono">person</text>
                    <rect x="45" y="25" width="13" height="42" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="65" y="35" width="14" height="38" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                  </>}
                  {idx === 1 && <>
                    <rect x="10" y="20" width="12" height="35" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="30" y="25" width="11" height="32" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="55" y="15" width="13" height="40" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="75" y="30" width="12" height="35" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                  </>}
                  {idx === 2 && <>
                    <rect x="5" y="40" width="25" height="30" rx="1" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
                    <text x="5" y="38" fill="#f59e0b" fontSize="3.5" fontFamily="JetBrains Mono">milk 3/20</text>
                    <rect x="35" y="40" width="25" height="30" rx="1" fill="none" stroke="#ef4444" strokeWidth="0.8" />
                    <text x="35" y="38" fill="#ef4444" fontSize="3.5" fontFamily="JetBrains Mono">bread 0/15</text>
                    <rect x="65" y="40" width="25" height="30" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <text x="65" y="38" fill="#22c55e" fontSize="3.5" fontFamily="JetBrains Mono">juice 28/30</text>
                  </>}
                  {idx === 3 && <>
                    <rect x="8" y="50" width="10" height="30" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="20" y="48" width="10" height="32" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="32" y="52" width="10" height="28" rx="1" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <rect x="44" y="47" width="10" height="33" rx="1" fill="none" stroke="#ef4444" strokeWidth="0.8" />
                    <text x="44" y="45" fill="#ef4444" fontSize="3.5" fontFamily="JetBrains Mono">congestion</text>
                  </>}
                </svg>
              )}
              {/* HUD */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">📷 {cam.id}</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">● LIVE</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">{cam.location}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${cam.value.includes("⚠️") ? "bg-amber-500 text-white" : "bg-black/70 text-white"}`}>
                  {idx === 0 ? `${count} entering` : cam.value}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-display font-700 text-gray-900 text-sm">{cam.zone}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{cam.ai}</div>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>Online
                </span>
              </div>
              <div className="space-y-1.5">
                {cam.detections.map(d => (
                  <div key={d} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>{d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-blue-800">
          <strong>Privacy-First Processing:</strong> All video analysis happens on-device (NVIDIA Jetson Orin Nano). No raw video is stored or transmitted. Only anonymized JSON events (count, zone, dwell) are sent to the cloud. No faces, names, or biometric identifiers are generated.
        </div>
      </div>
    </div>
  );
}
