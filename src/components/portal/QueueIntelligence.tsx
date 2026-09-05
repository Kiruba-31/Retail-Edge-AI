import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const timelineData = [
  { t: "9:00", queue: 2, predicted: null },
  { t: "9:30", queue: 3, predicted: null },
  { t: "10:00", queue: 5, predicted: null },
  { t: "10:30", queue: 8, predicted: null },
  { t: "11:00", queue: 6, predicted: null },
  { t: "11:30", queue: 4, predicted: null },
  { t: "12:00", queue: 9, predicted: null },
  { t: "12:30", queue: 12, predicted: null },
  { t: "13:00", queue: 13, predicted: null },
  { t: "13:08", queue: null, predicted: 15 },
  { t: "13:16", queue: null, predicted: 18 },
  { t: "13:24", queue: null, predicted: 14 },
];

export default function QueueIntelligence() {
  const [counters, setCounters] = useState([
    { id: 1, queue: 3, cashier: "Priya R.", open: true, wait: 1.8, service: 2.1, utilization: 62 },
    { id: 2, queue: 8, cashier: "Arjun K.", open: true, wait: 5.1, service: 2.3, utilization: 88 },
    { id: 3, queue: 2, cashier: "Meena S.", open: true, wait: 1.2, service: 1.9, utilization: 45 },
    { id: 4, queue: 0, cashier: "—", open: false, wait: 0, service: 0, utilization: 0 },
    { id: 5, queue: 5, cashier: "Ravi M.", open: true, wait: 3.4, service: 2.0, utilization: 74 },
    { id: 6, queue: 0, cashier: "—", open: false, wait: 0, service: 0, utilization: 0 },
  ]);

  const [predicted, setPredicted] = useState(15);

  useEffect(() => {
    const t = setInterval(() => {
      setCounters(prev => prev.map(c => c.open ? { ...c, queue: Math.max(0, c.queue + (Math.random() > 0.5 ? 1 : -1)) } : c));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const totalQueue = counters.reduce((s, c) => s + c.queue, 0);
  const avgWait = (counters.filter(c => c.open).reduce((s, c) => s + c.wait, 0) / counters.filter(c => c.open).length).toFixed(1);

  const openCounter4 = () => {
    setCounters(prev => prev.map(c => c.id === 4 ? { ...c, open: true, cashier: "Kumar V.", queue: 0, wait: 0, service: 2.0, utilization: 0 } : c));
    setPredicted(7);
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Queue", value: totalQueue, icon: "🛒", sub: "All counters", alert: totalQueue >= 12 },
          { label: "Avg Waiting Time", value: `${avgWait} min`, icon: "⏱", sub: "Per customer", alert: parseFloat(avgWait) >= 4 },
          { label: "Avg Service Time", value: "2.1 min", icon: "⚡", sub: "Per cashier" },
          { label: "Counter Utilization", value: "72%", icon: "📊", sub: "4 of 6 active" },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border p-4 ${k.alert ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`font-display font-800 text-2xl ${k.alert ? "text-red-700" : "text-gray-900"}`}>{k.value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{k.label}</div>
            <div className="text-[11px] text-gray-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Prediction alert */}
      <div className={`rounded-2xl border p-5 ${predicted >= 12 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{predicted >= 12 ? "🔴" : "🟢"}</span>
              <span className={`font-display font-700 text-base ${predicted >= 12 ? "text-red-800" : "text-emerald-800"}`}>
                {predicted >= 12 ? "Queue Congestion Predicted" : "Queue Under Control"}
              </span>
            </div>
            <div className={`text-sm ${predicted >= 12 ? "text-red-700" : "text-emerald-700"}`}>
              {predicted >= 12
                ? `Current: ${totalQueue} → AI predicts ${predicted} customers in 8 minutes. Arrival rate increasing.`
                : `Current queue is manageable. Continue monitoring.`}
            </div>
          </div>
          {predicted >= 12 && (
            <div className="flex gap-2 shrink-0">
              <button onClick={openCounter4} className="bg-red-600 hover:bg-red-700 text-white font-display font-600 text-sm px-5 py-2.5 rounded-xl transition-colors">
                👉 Open Counter 4
              </button>
              <button className="bg-white border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Request Staff
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Counters + chart */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Counters */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-display font-700 text-gray-900 mb-4">Live Counter Status</h3>
          <div className="space-y-4">
            {counters.map(c => (
              <div key={c.id} className={`rounded-xl border p-4 transition-all ${c.open ? (c.queue >= 7 ? "border-red-200 bg-red-50" : "border-gray-200 bg-white") : "border-dashed border-gray-200 bg-gray-50"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-display font-700 text-sm text-gray-900">Counter {c.id}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.open ? (c.queue >= 7 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700") : "bg-gray-100 text-gray-500"}`}>
                    {c.open ? `● Open` : "● Closed"}
                  </span>
                </div>
                {c.open ? (
                  <>
                    <div className="flex gap-0.5 flex-wrap mb-2 min-h-5">
                      {Array.from({ length: c.queue }).map((_, i) => <span key={i} className="text-base">🧍</span>)}
                      {c.queue === 0 && <span className="text-xs text-gray-400 self-center">No queue</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div><div className="font-mono font-bold text-gray-900">{c.queue}</div><div>Queue</div></div>
                      <div><div className="font-mono font-bold text-gray-900">{c.wait.toFixed(1)}m</div><div>Wait</div></div>
                      <div><div className="font-mono font-bold text-gray-900">{c.utilization}%</div><div>Util.</div></div>
                    </div>
                    {c.cashier !== "—" && <div className="text-xs text-gray-400 mt-1">Cashier: {c.cashier}</div>}
                  </>
                ) : (
                  <div className="text-xs text-gray-400 text-center py-1">Not in service</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline chart */}
        <div className="xl:col-span-3 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-700 text-gray-900">Queue Timeline & Prediction</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#0F4C3A] inline-block"></span>Actual</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block border-dashed"></span>Predicted</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Max threshold", position: "right", fontSize: 10, fill: "#ef4444" }} />
              <Line type="monotone" dataKey="queue" stroke="#0F4C3A" strokeWidth={2.5} dot={{ fill: "#0F4C3A", r: 3 }} connectNulls={false} name="Actual Queue" />
              <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: "#ef4444", r: 3 }} connectNulls={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>

          {/* Prediction flow */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs overflow-x-auto hide-scrollbar">
              {[
                { label: "Current Queue", value: `${totalQueue}`, color: "bg-gray-100 text-gray-700" },
                { sep: true },
                { label: "Arrival Rate", value: "Increasing", color: "bg-amber-100 text-amber-700" },
                { sep: true },
                { label: "AI Prediction", value: `${predicted} in 8 min`, color: "bg-red-100 text-red-700" },
                { sep: true },
                { label: "Risk Level", value: predicted >= 12 ? "HIGH" : "LOW", color: predicted >= 12 ? "bg-red-600 text-white" : "bg-emerald-100 text-emerald-700" },
                { sep: true },
                { label: "Recommendation", value: predicted >= 12 ? "Open Counter 4" : "Monitor", color: "bg-[#0F4C3A] text-white" },
              ].map((item, i) => (
                item.sep ? <span key={i} className="text-gray-300 font-bold shrink-0">→</span> : (
                  <div key={i} className={`rounded-xl px-3 py-2 font-medium shrink-0 ${item.color}`}>
                    <div className="text-[10px] opacity-70">{item.label}</div>
                    <div className="text-sm">{item.value}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
