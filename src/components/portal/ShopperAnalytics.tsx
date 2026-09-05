import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const hourlyData = [
  { hour: "9AM", footfall: 38, dwell: 5.2 },
  { hour: "10AM", footfall: 72, dwell: 6.1 },
  { hour: "11AM", footfall: 95, dwell: 7.4 },
  { hour: "12PM", footfall: 118, dwell: 8.3 },
  { hour: "1PM", footfall: 105, dwell: 7.9 },
  { hour: "2PM", footfall: 82, dwell: 6.5 },
  { hour: "3PM", footfall: 94, dwell: 7.1 },
  { hour: "4PM", footfall: 127, dwell: 8.8 },
  { hour: "5PM", footfall: 148, dwell: 9.2 },
  { hour: "6PM", footfall: 186, dwell: 10.4 },
  { hour: "7PM", footfall: 203, dwell: 11.1 },
  { hour: "8PM", footfall: 162, dwell: 8.7 },
  { hour: "9PM", footfall: 92, dwell: 6.2 },
];

const weeklyData = [
  { day: "Mon", visitors: 892 },
  { day: "Tue", visitors: 1024 },
  { day: "Wed", visitors: 874 },
  { day: "Thu", visitors: 1156 },
  { day: "Fri", visitors: 1380 },
  { day: "Sat", visitors: 1842 },
  { day: "Sun", visitors: 1248 },
];

const zoneData = [
  { zone: "Grocery & Staples", visitors: 420, dwell: 8.2, traffic: "high", entry: 680, exit: 260 },
  { zone: "Electronics", visitors: 120, dwell: 5.1, traffic: "low", entry: 190, exit: 70 },
  { zone: "Clothing / Fashion", visitors: 280, dwell: 6.4, traffic: "medium", entry: 430, exit: 150 },
  { zone: "Cosmetics & Care", visitors: 195, dwell: 9.1, traffic: "medium", entry: 310, exit: 115 },
  { zone: "Beverages", visitors: 310, dwell: 4.8, traffic: "high", entry: 490, exit: 180 },
  { zone: "Fresh Produce", visitors: 380, dwell: 7.3, traffic: "high", entry: 605, exit: 225 },
  { zone: "Promotional Endcap", visitors: 185, dwell: 3.2, traffic: "medium", entry: 290, exit: 105 },
];

export default function ShopperAnalytics() {
  const [timeRange, setTimeRange] = useState<"today" | "week">("today");

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Footfall", value: "1,248", sub: "Today", icon: "👥", badge: "+12.4%", up: true },
          { label: "Current Occupancy", value: "62", sub: "of 100 max", icon: "🧍", badge: "62%", up: false },
          { label: "Peak Hour", value: "7 PM", sub: "203 visitors/hr", icon: "⏰", badge: null },
          { label: "Avg Dwell Time", value: "7.4 min", sub: "All zones", icon: "⏱", badge: "+0.8 min", up: true },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className="font-display font-800 text-2xl text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">{k.sub}</span>
              {k.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${k.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{k.badge}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-700 text-gray-900">Footfall Trend</h3>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {(["today", "week"] as const).map(t => (
                <button key={t} onClick={() => setTimeRange(t)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-colors ${timeRange === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t === "today" ? "Today (Hourly)" : "This Week"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            {timeRange === "today" ? (
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="footfall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C3A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F4C3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="footfall" stroke="#0F4C3A" strokeWidth={2} fill="url(#footfall)" name="Visitors" />
              </AreaChart>
            ) : (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Bar dataKey="visitors" fill="#0F4C3A" radius={[4, 4, 0, 0]} name="Visitors" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Dwell time chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-display font-700 text-gray-900 mb-5">Avg Dwell by Hour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="dwell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(v: any) => [`${v} min`, "Dwell"]} />
              <Area type="monotone" dataKey="dwell" stroke="#10b981" strokeWidth={2} fill="url(#dwell)" name="Avg Dwell (min)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-display font-700 text-gray-900">Zone-Wise Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Zone</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Visitors</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Entry</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Exit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Dwell</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Traffic</th>
              </tr>
            </thead>
            <tbody>
              {zoneData.map((z, i) => (
                <tr key={z.zone} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-5 py-3.5 font-medium text-gray-900 text-sm">{z.zone}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-gray-700 font-mono">{z.visitors.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-emerald-600 font-mono">+{z.entry}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-red-500 font-mono">-{z.exit}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-gray-700">{z.dwell} min</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${z.traffic === "high" ? "bg-red-100 text-red-700" : z.traffic === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {z.traffic === "high" ? "🔥 High" : z.traffic === "medium" ? "🟡 Medium" : "🟢 Low"}
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
