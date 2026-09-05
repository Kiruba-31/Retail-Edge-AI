import { useState } from "react";

const employees = [
  { id: "E001", name: "Priya Rajan", dept: "Billing", role: "Cashier", status: "active", shift: "09:00–18:00", task: "Counter 2", attendance: "Present", perf: 94, tasks: 8, pending: 1 },
  { id: "E002", name: "Arjun Kumar", dept: "Billing", role: "Cashier", status: "active", shift: "09:00–18:00", task: "Counter 1", attendance: "Present", perf: 88, tasks: 6, pending: 0 },
  { id: "E003", name: "Meena Sundaram", dept: "Grocery", role: "Floor Staff", status: "active", shift: "10:00–19:00", task: "Restocking Aisle A", attendance: "Present", perf: 91, tasks: 12, pending: 2 },
  { id: "E004", name: "Ravi Mohan", dept: "Electronics", role: "Sales Associate", status: "idle", shift: "10:00–19:00", task: "—", attendance: "Present", perf: 76, tasks: 5, pending: 0 },
  { id: "E005", name: "Kavitha Nair", dept: "Cosmetics", role: "Floor Staff", status: "active", shift: "11:00–20:00", task: "Product Display", attendance: "Present", perf: 89, tasks: 9, pending: 1 },
  { id: "E006", name: "Suresh Anand", dept: "Fresh Produce", role: "Inventory Staff", status: "active", shift: "08:00–17:00", task: "Quality Check", attendance: "Present", perf: 95, tasks: 14, pending: 0 },
  { id: "E007", name: "Divya Krishnan", dept: "Electronics", role: "Sales Associate", status: "idle", shift: "10:00–19:00", task: "—", attendance: "Late", perf: 72, tasks: 4, pending: 1 },
  { id: "E008", name: "Muthu Raja", dept: "Grocery", role: "Floor Staff", status: "break", shift: "09:00–18:00", task: "On Break", attendance: "Present", perf: 84, tasks: 7, pending: 3 },
  { id: "E009", name: "Ananya Sharma", dept: "Billing", role: "Cashier", status: "active", shift: "14:00–23:00", task: "Counter 3", attendance: "Present", perf: 90, tasks: 5, pending: 0 },
];

const deptDemand: Record<string, { level: string; color: string; staff: number }> = {
  Billing: { level: "HIGH", color: "text-red-700 bg-red-100", staff: 3 },
  Grocery: { level: "HIGH", color: "text-red-700 bg-red-100", staff: 2 },
  "Fresh Produce": { level: "MEDIUM", color: "text-amber-700 bg-amber-100", staff: 1 },
  Electronics: { level: "LOW", color: "text-green-700 bg-green-100", staff: 2 },
  Cosmetics: { level: "LOW", color: "text-green-700 bg-green-100", staff: 1 },
};

export default function Staff() {
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = filter === "all" ? employees : employees.filter(e => e.dept === filter || e.status === filter);

  const depts = Array.from(new Set(employees.map(e => e.dept)));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: employees.length, icon: "👥", color: "bg-blue-50 border-blue-200" },
          { label: "Active", value: employees.filter(e => e.status === "active").length, icon: "🟢", color: "bg-emerald-50 border-emerald-200" },
          { label: "Idle", value: employees.filter(e => e.status === "idle").length, icon: "🟡", color: "bg-amber-50 border-amber-200" },
          { label: "On Break", value: employees.filter(e => e.status === "break").length, icon: "☕", color: "bg-gray-50 border-gray-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-800 text-2xl text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-[#0F4C3A] rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="font-display font-700 text-gray-900">AI Staff Recommendation</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(deptDemand).map(([dept, d]) => (
            <div key={dept} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <div className="font-medium text-sm text-gray-900">{dept}</div>
                <div className="text-xs text-gray-500">{d.staff} staff assigned</div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${d.color}`}>{d.level}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="text-sm text-amber-800">
            🤖 <strong>Recommendation:</strong> Move 1–2 staff from Electronics to Billing area. Electronics demand is LOW (12 visitors), Billing is under HIGH pressure.
          </div>
          <button className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Assign Task</button>
        </div>
      </div>

      {/* Filter + table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter("all")} className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${filter === "all" ? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white text-gray-600 border-gray-200"}`}>All</button>
            {depts.map(d => (
              <button key={d} onClick={() => setFilter(d)} className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${filter === d ? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white text-gray-600 border-gray-200"}`}>{d}</button>
            ))}
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="text-sm font-medium text-white bg-[#0F4C3A] hover:bg-emerald-800 px-4 py-2 rounded-lg transition-colors">
            + Add Employee
          </button>
        </div>

        {showAdd && (
          <div className="p-5 border-b border-gray-100 bg-emerald-50">
            <div className="font-display font-600 text-gray-900 mb-3 text-sm">Add New Employee</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Full Name", "Employee ID", "Department", "Role"].map(f => (
                <input key={f} type="text" placeholder={f} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500" />
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="text-sm font-medium text-white bg-[#0F4C3A] px-4 py-2 rounded-lg">Add Employee</button>
              <button onClick={() => setShowAdd(false)} className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Employee", "Department", "Status", "Current Task", "Attendance", "Performance", "Tasks"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0F4C3A] rounded-full flex items-center justify-center text-white text-xs font-display font-700 shrink-0">
                        {e.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{e.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{e.id} · {e.shift}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{e.dept}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${e.status === "active" ? "bg-emerald-100 text-emerald-700" : e.status === "idle" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                      {e.status === "active" ? "● Active" : e.status === "idle" ? "● Idle" : "☕ Break"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{e.task}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium ${e.attendance === "Present" ? "text-emerald-700" : e.attendance === "Late" ? "text-amber-700" : "text-red-700"}`}>
                      {e.attendance}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${e.perf >= 90 ? "bg-emerald-500" : e.perf >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${e.perf}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 font-mono">{e.perf}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className="text-gray-900 font-medium">{e.tasks}</span>
                    {e.pending > 0 && <span className="text-amber-600 ml-1">({e.pending} pending)</span>}
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
