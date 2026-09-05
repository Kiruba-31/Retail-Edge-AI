import { useState } from "react";

const products = [
  { id: "P001", name: "Amul Full Cream Milk 1L", shelf: "A12", expected: 20, detected: 3, status: "low", camera: "CAM-03", category: "Dairy" },
  { id: "P002", name: "Britannia Whole Wheat Bread", shelf: "A15", expected: 15, detected: 0, status: "out", camera: "CAM-03", category: "Bakery" },
  { id: "P003", name: "Tropicana Orange Juice 1L", shelf: "B04", expected: 30, detected: 28, status: "ok", camera: "CAM-03", category: "Beverages" },
  { id: "P004", name: "Britannia Good Day Cookies", shelf: "B03", expected: 30, detected: 5, status: "low", camera: "CAM-03", category: "Snacks" },
  { id: "P005", name: "Surf Excel 1kg Detergent", shelf: "C08", expected: 25, detected: 22, status: "ok", camera: "CAM-04", category: "Household" },
  { id: "P006", name: "Coca-Cola 2L PET Bottle", shelf: "B07", expected: 24, detected: 4, status: "low", camera: "CAM-03", category: "Beverages" },
  { id: "P007", name: "Dove Moisturising Bar Soap", shelf: "C11", expected: 40, detected: 0, status: "out", camera: "CAM-04", category: "Personal Care" },
  { id: "P008", name: "Aashirvaad Atta 5kg", shelf: "A02", expected: 12, detected: 10, status: "ok", camera: "CAM-02", category: "Grocery" },
  { id: "P009", name: "Lay's Classic Salted 90g", shelf: "B06", expected: 36, detected: 7, status: "low", camera: "CAM-03", category: "Snacks" },
  { id: "P010", name: "Kissan Mixed Fruit Jam", shelf: "A09", expected: 20, detected: 18, status: "ok", camera: "CAM-02", category: "Grocery" },
];

const planogramIssues = [
  { shelf: "B04", expected: "Juice | Juice | Cola", actual: "Cola | Juice | Juice", issue: "Product order mismatch" },
  { shelf: "A12", expected: "Milk | Milk | Milk", actual: "Milk | Empty | Empty", issue: "Empty slots detected" },
  { shelf: "C08", expected: "Detergent | Detergent | Softener", actual: "Softener | Detergent | Empty", issue: "Misplaced + empty slot" },
];

export default function Inventory() {
  const [filter, setFilter] = useState<"all" | "low" | "out" | "ok">("all");
  const [tab, setTab] = useState<"stock" | "planogram">("stock");

  const filtered = filter === "all" ? products : products.filter(p => p.status === filter);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Products", value: "500", icon: "📦", color: "bg-blue-50 border-blue-200" },
          { label: "Available", value: "462", icon: "✅", color: "bg-emerald-50 border-emerald-200" },
          { label: "Low Stock", value: "25", icon: "⚠️", color: "bg-amber-50 border-amber-200" },
          { label: "Out of Stock", value: "13", icon: "🔴", color: "bg-red-50 border-red-200" },
          { label: "Planogram Issues", value: "7", icon: "📐", color: "bg-purple-50 border-purple-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-800 text-2xl text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("stock")} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${tab === "stock" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Stock Status</button>
        <button onClick={() => setTab("planogram")} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${tab === "planogram" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Planogram Compliance</button>
      </div>

      {tab === "stock" && (
        <>
          {/* Shelf camera preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { cam: "CAM-03 — Shelf A12", product: "Milk", detected: 3, expected: 20, status: "low", img: "photo-1550583724-b2692b85b150" },
              { cam: "CAM-03 — Shelf A15", product: "Bread", detected: 0, expected: 15, status: "out", img: "photo-1574323347407-f5e1ad6d020b" },
              { cam: "CAM-03 — Shelf B04", product: "Juice", detected: 28, expected: 30, status: "ok", img: "photo-1621506289937-a8e4df240d0b" },
            ].map(c => (
              <div key={c.cam} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="relative h-36">
                  <img src={`https://images.unsplash.com/${c.img}?w=400&h=180&fit=crop&auto=format`} alt={c.product} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                    <span className="text-white text-xs font-mono font-medium bg-black/50 px-2 py-1 rounded">📷 {c.cam}</span>
                  </div>
                  {c.status !== "ok" && (
                    <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-lg ${c.status === "out" ? "bg-red-600 text-white" : "bg-amber-500 text-white"}`}>
                      {c.status === "out" ? "🔴 OUT OF STOCK" : "⚠️ LOW STOCK"}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-display font-600 text-gray-900 text-sm">{c.product}</div>
                  <div className="text-xs text-gray-500 mt-1">AI Detection: {c.detected} / {c.expected}</div>
                  <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${c.status === "out" ? "bg-red-500" : c.status === "low" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${(c.detected / c.expected) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {[["all", "All Products"], ["low", "⚠️ Low Stock"], ["out", "🔴 Out of Stock"], ["ok", "✅ Available"]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v as any)}
                className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${filter === v ? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Shelf</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Detected</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fill %</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const fill = Math.round((p.detected / p.expected) * 100);
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{p.id} · {p.category}</div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-sm text-gray-700">{p.shelf}</td>
                        <td className="px-4 py-3.5 text-center text-sm text-gray-700">{p.expected}</td>
                        <td className="px-4 py-3.5 text-center text-sm font-medium text-gray-900">{p.detected}</td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 mx-auto overflow-hidden">
                            <div className={`h-full rounded-full ${fill < 20 ? "bg-red-500" : fill < 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${fill}%` }} />
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{fill}%</div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === "out" ? "bg-red-100 text-red-700" : p.status === "low" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {p.status === "out" ? "🔴 Out" : p.status === "low" ? "⚠️ Low" : "✅ OK"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.status !== "ok" ? (
                            <button className="text-xs font-medium text-white bg-[#0F4C3A] hover:bg-emerald-800 px-3 py-1 rounded-lg transition-colors">Restock</button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "planogram" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
            <strong>7 planogram violations</strong> detected across 3 shelves. Camera AI has compared expected vs actual product arrangement.
          </div>
          {planogramIssues.map(issue => (
            <div key={issue.shelf} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-sm font-bold text-gray-700">Shelf {issue.shelf}</span>
                  <span className="ml-3 text-xs text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">⚠️ Planogram Violation</span>
                </div>
                <button className="text-xs font-medium text-white bg-[#0F4C3A] hover:bg-emerald-800 px-3 py-1 rounded-lg transition-colors">Verify Placement</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Expected Arrangement</div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 font-mono text-sm text-emerald-800">{issue.expected}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Actual (AI Detected)</div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 font-mono text-sm text-red-800">{issue.actual}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                <strong>Issue:</strong> {issue.issue}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
