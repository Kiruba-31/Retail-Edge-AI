import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const ranges = ["Today", "Yesterday", "7 Days", "30 Days"];

const footfallData = [
  { day: "Mon", visitors: 892, transactions: 238 },
  { day: "Tue", visitors: 1024, transactions: 284 },
  { day: "Wed", visitors: 874, transactions: 196 },
  { day: "Thu", visitors: 1156, transactions: 312 },
  { day: "Fri", visitors: 1380, transactions: 390 },
  { day: "Sat", visitors: 1842, transactions: 524 },
  { day: "Sun", visitors: 1248, transactions: 351 },
];

const queueData = [
  { day: "Mon", wait: 3.2, max: 8 },
  { day: "Tue", wait: 4.1, max: 12 },
  { day: "Wed", wait: 2.8, max: 7 },
  { day: "Thu", wait: 4.8, max: 15 },
  { day: "Fri", wait: 6.1, max: 18 },
  { day: "Sat", wait: 7.4, max: 22 },
  { day: "Sun", wait: 4.2, max: 13 },
];

const inventoryPie = [
  { name: "Available", value: 462 },
  { name: "Low Stock", value: 25 },
  { name: "Out of Stock", value: 13 },
];
const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const storeComparison = [
  { store: "Chennai-01", footfall: 8742, stock: 94, queue: 4.2, status: "online" },
  { store: "Chennai-02", footfall: 5420, stock: 97, queue: 2.1, status: "online" },
  { store: "Bangalore", footfall: 10280, stock: 91, queue: 5.8, status: "online" },
  { store: "Coimbatore", footfall: 3840, stock: 88, queue: 3.4, status: "warning" },
  { store: "Madurai", footfall: 0, stock: 0, queue: 0, status: "offline" },
  { store: "Hyderabad", footfall: 6910, stock: 93, queue: 4.0, status: "online" },
  { store: "Mumbai", footfall: 12450, stock: 90, queue: 6.7, status: "online" },
  { store: "Delhi", footfall: 9870, stock: 89, queue: 5.5, status: "online" },
];

export default function Reports() {
  const [range, setRange] = useState("7 Days");

  return (
    <div className="space-y-6">
      {/* Range selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${range === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{r}</button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Report
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Footfall", value: "7,416", sub: "Week total", change: "+8.2%" },
          { label: "Avg Daily Visitors", value: "1,059", sub: "Per store day", change: "+8.2%" },
          { label: "Stock-out Events", value: "14", sub: "This week", change: "-3 vs last" },
          { label: "Avg Queue Wait", value: "4.7 min", sub: "Store avg", change: "+0.4 min" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="font-display font-800 text-2xl text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">{k.sub}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{k.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Footfall + Transactions */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-700 text-gray-900">Footfall vs Transactions</h3>
            <div className="text-xs text-gray-500">Conversion rate avg: <strong className="text-gray-900">28.4%</strong></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={footfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="visitors" fill="#0F4C3A" radius={[3, 3, 0, 0]} name="Visitors" />
              <Bar dataKey="transactions" fill="#34d399" radius={[3, 3, 0, 0]} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory pie */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-display font-700 text-gray-900 mb-4">Inventory Health</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={inventoryPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={false} labelLine={false} fontSize={10}>
                {inventoryPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {inventoryPie.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />{item.name}</div>
                <span className="font-mono font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queue chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-display font-700 text-gray-900 mb-4">Queue Waiting Time Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={queueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(v: any) => [`${v} min`]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="wait" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} name="Avg Wait (min)" />
            <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" dot={{ fill: "#ef4444", r: 3 }} name="Peak Queue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Multi-store rollup */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-700 text-gray-900">Multi-Store Overview</h3>
            <p className="text-xs text-gray-500 mt-0.5">8-store chain · 100% Zero-PII compliance across all edge nodes</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            7/8 Stores Online
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Store", "Status", "Weekly Footfall", "Stock Health", "Avg Queue Wait", "Edge Node"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {storeComparison.map(s => (
                <tr key={s.store} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900 text-sm">{s.store}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "online" ? "bg-emerald-100 text-emerald-700" : s.status === "warning" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                      {s.status === "online" ? "🟢 Online" : s.status === "warning" ? "🟡 Warning" : "🔴 Offline"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-700">{s.footfall > 0 ? s.footfall.toLocaleString() : "—"}</td>
                  <td className="px-5 py-3.5">
                    {s.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${s.stock >= 92 ? "bg-emerald-500" : s.stock >= 85 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${s.stock}%` }} />
                        </div>
                        <span className="text-xs font-mono text-gray-700">{s.stock}%</span>
                      </div>
                    ) : <span className="text-gray-400 text-sm">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{s.queue > 0 ? `${s.queue} min` : "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-mono font-medium ${s.status === "online" ? "text-emerald-600" : s.status === "warning" ? "text-amber-600" : "text-red-600"}`}>
                      {s.status === "offline" ? "● Offline" : "● EDGE ONLINE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
