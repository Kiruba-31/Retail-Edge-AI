import { useState, useEffect } from "react";

const kpis = [
  { label: "Today's Footfall", value: "1,248", sub: "+12.4% vs yesterday", trend: "up", icon: "👥", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { label: "Current Occupancy", value: "62 / 100", sub: "62% capacity", trend: "neutral", icon: "🧍", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { label: "Active Queue", value: "13", sub: "Across 4 counters", trend: "up", icon: "🛒", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { label: "Stock Availability", value: "94%", sub: "13 low / 3 out-of-stock", trend: "down", icon: "📦", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { label: "Avg Dwell Time", value: "7.4 min", sub: "+0.8 min vs yesterday", trend: "up", icon: "⏱", color: "bg-rose-50 border-rose-200 text-rose-700" },
  { label: "Active Alerts", value: "7", sub: "2 critical · 5 warnings", trend: "alert", icon: "🚨", color: "bg-red-50 border-red-200 text-red-700" },
];

const zones = [
  { name: "Grocery", people: 42, max: 60, traffic: "high" },
  { name: "Beverages", people: 21, max: 40, traffic: "medium" },
  { name: "Fresh Produce", people: 31, max: 40, traffic: "high" },
  { name: "Cosmetics", people: 8, max: 30, traffic: "low" },
  { name: "Promotional", people: 18, max: 25, traffic: "high" },
  { name: "Electronics", people: 12, max: 30, traffic: "low" },
];

const aiRecs = [
  { type: "critical", icon: "🔴", title: "Open Counter 4", desc: "Queue predicted to reach 15 in 8 minutes. Current: 13 customers." },
  { type: "warning", icon: "🟠", title: "Restock Milk — Shelf A12", desc: "Current stock: 3/20. Below minimum threshold." },
  { type: "info", icon: "🟡", title: "Move 1 Staff: Electronics → Billing", desc: "Electronics demand low (12 people). Billing under pressure." },
];

export default function Overview() {
  const [footfall, setFootfall] = useState(1248);
  const [queue, setQueue] = useState(13);

  useEffect(() => {
    const t = setInterval(() => {
      setFootfall(f => f + Math.floor(Math.random() * 3));
      setQueue(q => Math.max(8, Math.min(18, q + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k, i) => (
          <div key={k.label} className={`rounded-2xl border p-4 ${k.color} transition-all`}>
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className="font-display font-800 text-2xl text-gray-900">
              {i === 0 ? footfall.toLocaleString() : i === 2 ? queue : k.value}
            </div>
            <div className="font-medium text-xs text-gray-600 mt-0.5">{k.label}</div>
            <div className="text-[11px] text-gray-500 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-700 text-gray-900">Live Store Heatmap</h3>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">● Live</span>
          </div>
          <div className="space-y-2">
            {zones.map(z => {
              const pct = Math.round((z.people / z.max) * 100);
              return (
                <div key={z.name} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium text-gray-700 shrink-0">{z.name}</div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-xl overflow-hidden relative">
                    <div
                      className={`h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-3 ${pct >= 70 ? "bg-red-400" : pct >= 40 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${pct}%` }}
                    >
                      {pct > 25 && <span className="text-white text-xs font-bold">{z.people}</span>}
                    </div>
                    {pct <= 25 && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-medium">{z.people} people</span>}
                  </div>
                  <div className="w-12 text-right text-xs text-gray-500 shrink-0">{pct}%</div>
                  <span className="text-sm shrink-0">{z.traffic === "high" ? "🔥" : z.traffic === "medium" ? "🟡" : "🟢"}</span>
                </div>
              );
            })}
          </div>

          {/* Mini store SVG */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-medium mb-2">Zone occupancy map</div>
            <svg viewBox="0 0 200 80" className="w-full" style={{ maxHeight: 100 }}>
              {zones.map((z, i) => {
                const cols = 3;
                const col = i % cols, row = Math.floor(i / cols);
                const x = col * 67 + 2, y = row * 38 + 2, w = 63, h = 34;
                const pct = z.people / z.max;
                const fill = pct >= 0.7 ? "#fca5a5" : pct >= 0.4 ? "#fcd34d" : "#6ee7b7";
                return (
                  <g key={z.name}>
                    <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke="#e5e7eb" strokeWidth="0.5" />
                    <text x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle" fill="#374151" fontSize="5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">{z.name}</text>
                    <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill="#6b7280" fontSize="4" fontFamily="Inter, sans-serif">{z.people} shoppers</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#0F4C3A] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <div className="font-display font-700 text-gray-900 text-sm">AI Recommendations</div>
              <div className="text-[10px] text-gray-500">Predict · Decide · Act</div>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            {aiRecs.map(r => (
              <div key={r.title} className={`rounded-xl p-4 border ${r.type === "critical" ? "bg-red-50 border-red-200" : r.type === "warning" ? "bg-amber-50 border-amber-200" : "bg-yellow-50 border-yellow-200"}`}>
                <div className="flex gap-2 items-start">
                  <span className="text-base mt-0.5">{r.icon}</span>
                  <div>
                    <div className="font-display font-700 text-gray-900 text-sm">{r.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{r.desc}</div>
                    <button className={`mt-2 text-xs font-medium px-3 py-1 rounded-lg transition-colors ${r.type === "critical" ? "bg-red-600 text-white hover:bg-red-700" : r.type === "warning" ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-700 text-white hover:bg-gray-800"}`}>
                      Take Action
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Queue summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-display font-700 text-gray-900 mb-4">Queue Status</h3>
          <div className="space-y-3">
            {[
              { id: 1, queue: 3, cashier: "Priya R." },
              { id: 2, queue: queue - 8, cashier: "Arjun K." },
              { id: 3, queue: 2, cashier: "Meena S." },
              { id: 4, queue: 0, cashier: "—", closed: true },
            ].map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-20 text-sm font-medium text-gray-700 shrink-0">Counter {c.id}</div>
                <div className="flex gap-1 flex-wrap flex-1">
                  {Array.from({ length: Math.max(0, c.queue) }).map((_, i) => <span key={i} className="text-sm">🧍</span>)}
                  {c.closed && <span className="text-gray-400 text-xs">Closed</span>}
                  {!c.closed && c.queue === 0 && <span className="text-gray-400 text-xs">No queue</span>}
                </div>
                <div className="text-xs text-gray-500 shrink-0 w-8 text-right">{c.queue > 0 ? c.queue : "—"}</div>
              </div>
            ))}
          </div>
          {queue >= 10 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
              ⚠️ Congestion predicted in 8 minutes — Open Counter 4
            </div>
          )}
        </div>

        {/* Inventory summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-display font-700 text-gray-900 mb-4">Inventory Status</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Total Products", value: "500", icon: "📦" },
              { label: "Available", value: "462", icon: "✅" },
              { label: "Low Stock", value: "25", icon: "⚠️" },
              { label: "Out of Stock", value: "13", icon: "🔴" },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="text-lg">{s.icon}</div>
                <div className="font-display font-700 text-gray-900 text-xl mt-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { product: "Milk", shelf: "A12", stock: 3, max: 20, status: "low" },
              { product: "Bread", shelf: "A15", stock: 0, max: 15, status: "out" },
              { product: "Biscuits", shelf: "B03", stock: 5, max: 30, status: "low" },
            ].map(r => (
              <div key={r.product} className="flex items-center gap-3 text-sm">
                <div className="flex-1 font-medium text-gray-800">{r.product}</div>
                <div className="text-gray-500 text-xs font-mono">{r.shelf}</div>
                <div className="text-xs text-gray-500">{r.stock}/{r.max}</div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "out" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {r.status === "out" ? "🔴 Out" : "⚠️ Low"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edge & Privacy status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-display font-700 text-gray-900 mb-4">Edge Device & Privacy Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Edge Device</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">NVIDIA Jetson Orin</span><span className="text-emerald-600 font-medium">● Active</span></div>
              <div className="flex justify-between"><span className="text-gray-600">AI Inference</span><span className="text-emerald-600 font-medium">● Running</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Local Database</span><span className="text-emerald-600 font-medium">● Online</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Cloud Sync</span><span className="text-emerald-600 font-medium">● Active</span></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Privacy Controls</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Face Recognition</span><span className="text-red-500 font-medium">● OFF</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Personal Identity</span><span className="text-red-500 font-medium">NOT STORED</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Raw Video Upload</span><span className="text-red-500 font-medium">● OFF</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Anonymous Track</span><span className="text-emerald-600 font-medium">● ON</span></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Camera Health</div>
            <div className="space-y-2 text-sm">
              {["CAM-01 Entrance", "CAM-02 Store Floor", "CAM-03 Shelf A", "CAM-04 Billing"].map(c => (
                <div key={c} className="flex justify-between"><span className="text-gray-600">{c}</span><span className="text-emerald-600 font-medium">● Online</span></div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">AI Models Active</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">YOLO v8</span><span className="text-emerald-600 font-medium">Running</span></div>
              <div className="flex justify-between"><span className="text-gray-600">ByteTrack</span><span className="text-emerald-600 font-medium">Running</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shelf Engine</span><span className="text-emerald-600 font-medium">Running</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Queue Engine</span><span className="text-emerald-600 font-medium">Running</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
