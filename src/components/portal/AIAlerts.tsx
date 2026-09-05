import { useState } from "react";

type Alert = {
  id: number; severity: "critical" | "warning" | "info";
  type: string; title: string; desc: string; time: string;
  action?: string; location?: string; resolved?: boolean;
};

const initialAlerts: Alert[] = [
  { id: 1, severity: "critical", type: "OUT_OF_STOCK", title: "Out of Stock: Britannia Bread", desc: "Shelf A15 — AI detected 0 of 15 expected facings. Immediate restock required.", time: "2 min ago", action: "Dispatch Restock Ticket", location: "Shelf A15", resolved: false },
  { id: 2, severity: "critical", type: "QUEUE_CONGESTION", title: "Queue Congestion Predicted", desc: "Counter 2 — Predicted 15 customers in 8 minutes. Arrival rate increasing rapidly.", time: "3 min ago", action: "Open Counter 4", location: "Billing Area", resolved: false },
  { id: 3, severity: "warning", type: "LOW_STOCK", title: "Low Stock: Amul Milk", desc: "Shelf A12 — AI detected 3 of 20 expected units. Stock below minimum threshold.", time: "8 min ago", action: "Schedule Restock", location: "Shelf A12", resolved: false },
  { id: 4, severity: "warning", type: "LOW_STOCK", title: "Low Stock: Lay's Classic", desc: "Shelf B06 — 7 of 36 facings detected. Restock recommended.", time: "15 min ago", action: "Schedule Restock", location: "Shelf B06", resolved: false },
  { id: 5, severity: "warning", type: "PLANOGRAM_VIOLATION", title: "Planogram Violation: Shelf B04", desc: "Expected juice-juice-cola arrangement. Detected cola-juice-juice. Please verify.", time: "22 min ago", action: "Verify Placement", location: "Shelf B04", resolved: false },
  { id: 6, severity: "warning", type: "HIGH_OCCUPANCY", title: "High Zone Traffic: Grocery", desc: "42 shoppers in grocery zone. Peak traffic detected. Consider floor staff allocation.", time: "25 min ago", location: "Grocery Zone", resolved: false },
  { id: 7, severity: "info", type: "STAFF_RECOMMENDATION", title: "Staff Reallocation Suggested", desc: "Electronics zone: 12 shoppers (low). Billing zone: high pressure. Move 1 staff member.", time: "28 min ago", action: "Assign Task", resolved: false },
  { id: 8, severity: "info", type: "SYNC_COMPLETED", title: "Cloud Sync Completed", desc: "137 anonymized events synchronized to cloud. Local queue cleared.", time: "32 min ago", resolved: true },
  { id: 9, severity: "info", type: "DEVICE_ONLINE", title: "Edge Device Online", desc: "NVIDIA Jetson Orin Nano — AI inference resumed. All 4 cameras reconnected.", time: "1 hr ago", resolved: true },
];

const severityConfig = {
  critical: { label: "Critical", color: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-500", icon: "🔴" },
  warning: { label: "Warning", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500", icon: "🟠" },
  info: { label: "Info", color: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400", icon: "🔵" },
};

export default function AIAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const [showResolved, setShowResolved] = useState(false);

  const resolve = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));

  const visible = alerts.filter(a => {
    if (!showResolved && a.resolved) return false;
    if (filter !== "all" && a.severity !== filter) return false;
    return true;
  });

  const counts = { critical: alerts.filter(a => !a.resolved && a.severity === "critical").length, warning: alerts.filter(a => !a.resolved && a.severity === "warning").length, info: alerts.filter(a => !a.resolved && a.severity === "info").length };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["critical", "warning", "info"] as const).map(s => {
          const cfg = severityConfig[s];
          return (
            <div key={s} className={`rounded-2xl border p-4 ${cfg.color}`}>
              <div className="text-xl mb-1">{cfg.icon}</div>
              <div className="font-display font-800 text-2xl text-gray-900">{counts[s]}</div>
              <div className="text-sm font-medium text-gray-600 mt-0.5">{cfg.label} Alerts</div>
              <div className="text-xs text-gray-400 mt-1">Active / unresolved</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(["all", "critical", "warning", "info"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border capitalize transition-colors ${filter === f ? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
              {f === "all" ? "All Alerts" : f}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)} className="accent-emerald-600" />
          Show resolved
        </label>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {visible.map(a => {
          const cfg = severityConfig[a.severity];
          return (
            <div key={a.id} className={`rounded-2xl border p-5 transition-all ${a.resolved ? "opacity-60 bg-gray-50 border-gray-100" : cfg.color}`}>
              <div className="flex items-start gap-4">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${cfg.dot} ${!a.resolved ? "animate-pulse" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${cfg.badge}`}>{a.type}</span>
                        {a.location && <span className="text-[10px] text-gray-500 font-mono">{a.location}</span>}
                        {a.resolved && <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">✓ Resolved</span>}
                      </div>
                      <h4 className="font-display font-700 text-gray-900 mt-1.5 text-sm">{a.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
                      <div className="text-xs text-gray-400 mt-1.5">{a.time}</div>
                    </div>
                    {!a.resolved && (
                      <div className="flex gap-2 shrink-0">
                        {a.action && (
                          <button onClick={() => resolve(a.id)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors ${a.severity === "critical" ? "bg-red-600 hover:bg-red-700" : a.severity === "warning" ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                            {a.action}
                          </button>
                        )}
                        <button onClick={() => resolve(a.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">✅</div>
            <div className="font-medium">No alerts matching this filter</div>
          </div>
        )}
      </div>
    </div>
  );
}
