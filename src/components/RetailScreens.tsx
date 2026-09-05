import React, { useState } from 'react';
import { 
  Users, User, ShoppingCart, Package, Clock, Bell, 
  Flame, Lock, Video, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function RetailScreens({ activeTab = 'analytics' }) {
  return (
    <div className="bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* Top Header matching all screens */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">
            {activeTab === 'analytics' && 'Shopper Analytics'}
            {activeTab === 'inventory' && 'Inventory'}
            {activeTab === 'queue' && 'Queue Intelligence'}
            {activeTab === 'cameras' && 'Live Cameras'}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Thu, 27 Aug, 2026 · 09:34:28 am</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#E8F8F0] border border-[#B7EBD0] text-[#0E7043] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            EDGE ONLINE · 4/4 Cameras
          </div>
          <div className="flex items-center gap-2 bg-[#EEF4FF] border border-[#C7D9FE] text-[#1E40AF] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
            Privacy: ACTIVE
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0F362F] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AD
          </div>
        </div>
      </header>

      {/* View Router */}
      <main className="max-w-[1600px] mx-auto space-y-6">
        {activeTab === 'analytics' && <ShopperAnalyticsView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'queue' && <QueueIntelligenceView />}
        {activeTab === 'cameras' && <LiveCamerasView />}
      </main>
    </div>
  );
}

/* ==========================================================================
   1. SHOPPER ANALYTICS VIEW
   ========================================================================== */
function ShopperAnalyticsView() {
  const zones = [
    { name: 'Grocery & Staples', visitors: 420, entry: '+680', exit: '-260', dwell: '8.2 min', badge: 'High', color: 'bg-rose-100 text-rose-700' },
    { name: 'Electronics', visitors: 120, entry: '+190', exit: '-70', dwell: '5.1 min', badge: 'Low', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Clothing / Fashion', visitors: 280, entry: '+430', exit: '-150', dwell: '6.4 min', badge: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { name: 'Cosmetics & Care', visitors: 195, entry: '+310', exit: '-115', dwell: '9.1 min', badge: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { name: 'Beverages', visitors: 310, entry: '+490', exit: '-180', dwell: '4.8 min', badge: 'High', color: 'bg-rose-100 text-rose-700' },
    { name: 'Fresh Produce', visitors: 380, entry: '+605', exit: '-225', dwell: '7.3 min', badge: 'High', color: 'bg-rose-100 text-rose-700' },
    { name: 'Promotional Endcap', visitors: 185, entry: '+290', exit: '-105', dwell: '3.2 min', badge: 'Medium', color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <Users className="w-5 h-5 text-indigo-600 mb-2" />
          <p className="text-3xl font-bold text-slate-900">1,248</p>
          <p className="text-xs text-slate-500 mt-1">Total Footfall</p>
          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Today +12.4%</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <User className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-3xl font-bold text-slate-900">62</p>
          <p className="text-xs text-slate-500 mt-1">Current Occupancy</p>
          <p className="text-xs text-slate-400 mt-2">of 100 max <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">62%</span></p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <Clock className="w-5 h-5 text-rose-500 mb-2" />
          <p className="text-3xl font-bold text-slate-900">7 PM</p>
          <p className="text-xs text-slate-500 mt-1">Peak Hour</p>
          <p className="text-xs text-slate-400 mt-2">203 visitors/hr</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <Clock className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-slate-900">7.4 min</p>
          <p className="text-xs text-slate-500 mt-1">Avg Dwell Time</p>
          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">All zones +0.8 min</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-slate-900">Footfall Trend</h2>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button className="bg-white text-slate-800 px-3 py-1 rounded shadow-sm">Today (Hourly)</button>
              <button className="text-slate-500 px-3 py-1">This Week</button>
            </div>
          </div>
          {/* SVG Line Chart Representation */}
          <div className="h-52 w-full flex items-end">
            <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible">
              <path
                d="M 0,160 Q 150,110 250,120 T 450,70 T 550,40 T 700,130"
                fill="none"
                stroke="#115E59"
                strokeWidth="3"
              />
              <path
                d="M 0,160 Q 150,110 250,120 T 450,70 T 550,40 T 700,130 L 700,180 L 0,180 Z"
                fill="url(#gradient-teal)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="gradient-teal" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#115E59" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-3 border-t border-slate-100 pt-2">
            <span>9AM</span><span>10AM</span><span>11AM</span><span>12PM</span><span>1PM</span><span>2PM</span><span>3PM</span><span>4PM</span><span>5PM</span><span>6PM</span><span>7PM</span><span>8PM</span><span>9PM</span>
          </div>
        </div>

        {/* Avg Dwell by Hour */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Avg Dwell by Hour</h2>
          <div className="h-52 flex items-end">
            <svg viewBox="0 0 350 180" className="w-full h-full overflow-visible">
              <path
                d="M 0,130 Q 80,70 140,80 T 220,50 T 290,20 T 350,120"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-3 border-t border-slate-100 pt-2">
            <span>9AM</span><span>11AM</span><span>1PM</span><span>3PM</span><span>5PM</span><span>7PM</span><span>9PM</span>
          </div>
        </div>
      </div>

      {/* Zone-Wise Analytics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Zone-Wise Analytics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="pb-3 font-semibold">Zone</th>
                <th className="pb-3 font-semibold">Visitors</th>
                <th className="pb-3 font-semibold">Entry</th>
                <th className="pb-3 font-semibold">Exit</th>
                <th className="pb-3 font-semibold">Avg Dwell</th>
                <th className="pb-3 font-semibold">Traffic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {zones.map((z) => (
                <tr key={z.name} className="hover:bg-slate-50">
                  <td className="py-3.5 font-bold text-slate-800">{z.name}</td>
                  <td className="py-3.5 font-medium">{z.visitors}</td>
                  <td className="py-3.5 text-emerald-600 font-semibold">{z.entry}</td>
                  <td className="py-3.5 text-rose-600 font-semibold">{z.exit}</td>
                  <td className="py-3.5">{z.dwell}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${z.color}`}>
                      ● {z.badge}
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

/* ==========================================================================
   2. INVENTORY VIEW
   ========================================================================== */
function InventoryView() {
  const inventoryList = [
    { name: 'Amul Full Cream Milk 1L', sku: 'P001 · Dairy', shelf: 'A12', exp: 20, det: 3, fill: 15, status: 'Low', color: 'bg-amber-100 text-amber-800' },
    { name: 'Britannia Whole Wheat Bread', sku: 'P002 · Bakery', shelf: 'A15', exp: 15, det: 0, fill: 0, status: 'Out', color: 'bg-rose-100 text-rose-800' },
    { name: 'Tropicana Orange Juice 1L', sku: 'P003 · Beverages', shelf: 'B04', exp: 30, det: 28, fill: 93, status: 'OK', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Britannia Good Day Cookies', sku: 'P004 · Snacks', shelf: 'B03', exp: 30, det: 5, fill: 17, status: 'Low', color: 'bg-amber-100 text-amber-800' },
    { name: 'Surf Excel 1kg Detergent', sku: 'P005 · Household', shelf: 'C08', exp: 25, det: 22, fill: 88, status: 'OK', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Coca-Cola 2L PET Bottle', sku: 'P006 · Beverages', shelf: 'B07', exp: 24, det: 4, fill: 17, status: 'Low', color: 'bg-amber-100 text-amber-800' },
    { name: 'Dove Moisturising Bar Soap', sku: 'P007 · Personal Care', shelf: 'C11', exp: 40, det: 0, fill: 0, status: 'Out', color: 'bg-rose-100 text-rose-800' },
    { name: 'Aashirvaad Atta 5kg', sku: 'P008 · Grocery', shelf: 'A02', exp: 12, det: 10, fill: 83, status: 'OK', color: 'bg-emerald-100 text-emerald-800' },
    { name: "Lay's Classic Salted 90g", sku: 'P009 · Snacks', shelf: 'B06', exp: 36, det: 7, fill: 19, status: 'Low', color: 'bg-amber-100 text-amber-800' },
    { name: 'Kissan Mixed Fruit Jam', sku: 'P010 · Grocery', shelf: 'A09', exp: 20, det: 18, fill: 90, status: 'OK', color: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="space-y-6">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#EEF4FF] border border-[#D0E0FF] rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">500</p>
          <p className="text-xs text-slate-600 mt-1">Total Products</p>
        </div>
        <div className="bg-[#EAFBF3] border border-[#C6F3DE] rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">462</p>
          <p className="text-xs text-slate-600 mt-1">Available</p>
        </div>
        <div className="bg-[#FEF9E7] border border-[#FDE68A] rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">25</p>
          <p className="text-xs text-slate-600 mt-1">Low Stock</p>
        </div>
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">13</p>
          <p className="text-xs text-slate-600 mt-1">Out of Stock</p>
        </div>
        <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">7</p>
          <p className="text-xs text-slate-600 mt-1">Planogram Issues</p>
        </div>
      </div>

      {/* Camera Shelf Snapshots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
          <div className="h-32 rounded-xl bg-slate-900 relative overflow-hidden flex items-center justify-center">
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">⚠️ LOW STOCK</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">CAM-03 · Shelf A12</span>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-800">Milk <span className="font-normal text-slate-400 text-[10px] block">AI Detection: 3 / 20</span></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
          <div className="h-32 rounded-xl bg-slate-800 relative overflow-hidden flex items-center justify-center">
            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">🔴 OUT OF STOCK</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">CAM-03 · Shelf A15</span>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-800">Bread <span className="font-normal text-slate-400 text-[10px] block">AI Detection: 0 / 15</span></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
          <div className="h-32 rounded-xl bg-amber-950/80 relative overflow-hidden flex items-center justify-center">
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">CAM-03 · Shelf B04</span>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-800">Juice <span className="font-normal text-slate-400 text-[10px] block">AI Detection: 28 / 30</span></div>
        </div>
      </div>

      {/* Master Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-100">
            <tr>
              <th className="pb-3 font-semibold">Product</th>
              <th className="pb-3 font-semibold">Shelf</th>
              <th className="pb-3 font-semibold">Expected</th>
              <th className="pb-3 font-semibold">Detected</th>
              <th className="pb-3 font-semibold">Fill %</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {inventoryList.map((item) => (
              <tr key={item.name} className="hover:bg-slate-50">
                <td className="py-3 font-bold text-slate-800">{item.name} <span className="block text-[10px] text-slate-400 font-normal">{item.sku}</span></td>
                <td className="py-3 font-mono text-slate-600">{item.shelf}</td>
                <td className="py-3">{item.exp}</td>
                <td className="py-3 font-bold text-slate-900">{item.det}</td>
                <td className="py-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.fill > 50 ? 'bg-emerald-500' : item.fill > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${item.fill}%` }}></div>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.color}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3">
                  {item.status !== 'OK' ? (
                    <button className="px-2.5 py-1 bg-[#0F362F] hover:bg-slate-800 text-white rounded text-[10px] font-bold">Restock</button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. QUEUE INTELLIGENCE VIEW
   ========================================================================== */
function QueueIntelligenceView() {
  return (
    <div className="space-y-6">
      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">14</p>
          <p className="text-xs text-slate-600 mt-1">Total Queue (All counters)</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">2.9 min</p>
          <p className="text-xs text-slate-600 mt-1">Avg Waiting Time (Per customer)</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">2.1 min</p>
          <p className="text-xs text-slate-600 mt-1">Avg Service Time (Per cashier)</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">72%</p>
          <p className="text-xs text-slate-600 mt-1">Counter Utilization (4 of 6 active)</p>
        </div>
      </div>

      {/* Red Congestion Alert Box */}
      <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          <div>
            <h3 className="text-xs font-bold text-rose-900">Queue Congestion Predicted</h3>
            <p className="text-xs text-rose-700">Current: 14 → AI predicts 15 customers in 8 minutes. Arrival rate increasing.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm">👉 Open Counter 4</button>
          <button className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold">Request Staff</button>
        </div>
      </div>

      {/* Live Counter Cards & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Live Counter Status</h2>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">Counter 1</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">● Open</span>
              </div>
              <p className="text-sm mt-1">🧍 🧍 <span className="text-xs font-bold text-slate-900 ml-2">2 Queue</span></p>
              <p className="text-[10px] text-slate-400">Cashier: Priya R.</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">1.8m <span className="font-normal text-slate-400 text-[10px]">Wait</span></p>
              <p className="font-bold text-slate-900">62% <span className="font-normal text-slate-400 text-[10px]">Util.</span></p>
            </div>
          </div>

          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">Counter 2</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">● Open</span>
              </div>
              <p className="text-sm mt-1">🧍 🧍 🧍 🧍 🧍 🧍 🧍 <span className="text-xs font-bold text-slate-900 ml-2">7 Queue</span></p>
              <p className="text-[10px] text-slate-400">Cashier: Arjun K.</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">5.1m <span className="font-normal text-slate-400 text-[10px]">Wait</span></p>
              <p className="font-bold text-slate-900">88% <span className="font-normal text-slate-400 text-[10px]">Util.</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">Counter 3</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">● Open</span>
              </div>
              <p className="text-sm mt-1">🧍 <span className="text-xs font-bold text-slate-900 ml-2">1 Queue</span></p>
              <p className="text-[10px] text-slate-400">Cashier: Meena S.</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">1.2m <span className="font-normal text-slate-400 text-[10px]">Wait</span></p>
              <p className="font-bold text-slate-900">45% <span className="font-normal text-slate-400 text-[10px]">Util.</span></p>
            </div>
          </div>
        </div>

        {/* Prediction Pipeline Flow */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Queue Timeline & Prediction</h2>
          
          <div className="h-44 flex items-end">
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <line x1="0" y1="60" x2="400" y2="60" stroke="#F87171" strokeDasharray="4" />
              <path d="M 0,130 Q 100,120 200,90 T 300,40" fill="none" stroke="#0F766E" strokeWidth="2.5" />
              <path d="M 300,40 Q 350,20 400,60" fill="none" stroke="#EF4444" strokeDasharray="3" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex items-center gap-2 text-xs mt-6">
            <div className="bg-slate-100 px-3 py-2 rounded-lg text-center font-bold">14 <span className="text-[10px] text-slate-400 block font-normal">Current</span></div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-lg text-center font-bold">Increasing <span className="text-[10px] text-amber-600 block font-normal">Arrival Rate</span></div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="bg-rose-50 text-rose-900 px-3 py-2 rounded-lg text-center font-bold">15 in 8m <span className="text-[10px] text-rose-600 block font-normal">AI Prediction</span></div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="bg-[#0F362F] text-white px-3 py-2 rounded-lg text-center font-bold">Open Counter 4 <span className="text-[10px] text-emerald-300 block font-normal">Action</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. LIVE CAMERAS VIEW
   ========================================================================== */
function LiveCamerasView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Live Camera Monitor</h2>
          <p className="text-xs text-slate-500">4/4 cameras online · AI detection active · No raw video stored</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span>AI Overlay</span>
          <div className="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
        </div>
      </div>

      {/* 4 Camera Feeds with Green/Red/Amber Bounding Box Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Cam 01 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="h-56 bg-slate-800 relative flex items-center justify-center">
            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">CAM-01 · ● LIVE</span>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">14 entering</span>
            {/* Simulated Bounding Boxes */}
            <div className="border-2 border-emerald-400 absolute w-16 h-24 left-16 top-10"></div>
            <div className="border-2 border-emerald-400 absolute w-20 h-28 left-48 top-12"></div>
            <div className="border-2 border-emerald-400 absolute w-16 h-20 right-20 top-14"></div>
          </div>
          <div className="p-3 text-xs">
            <p className="font-bold text-slate-800">Entrance <span className="text-[10px] text-slate-400 block font-normal">Shopper Detection · Zone Tracking</span></p>
            <p className="text-[10px] text-slate-500 mt-1">● Person count: 12 · Entry: 3/min · Exit: 1/min</p>
          </div>
        </div>

        {/* Cam 02 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="h-56 bg-slate-900 relative flex items-center justify-center">
            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">CAM-02 · ● LIVE</span>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">62% (62/100)</span>
            <div className="border-2 border-emerald-400 absolute w-16 h-16 left-12 top-8"></div>
            <div className="border-2 border-emerald-400 absolute w-20 h-20 left-44 top-10"></div>
            <div className="border-2 border-emerald-400 absolute w-24 h-24 right-16 top-6"></div>
          </div>
          <div className="p-3 text-xs">
            <p className="font-bold text-slate-800">Grocery <span className="text-[10px] text-slate-400 block font-normal">Zone Engine · Heatmap</span></p>
            <p className="text-[10px] text-slate-500 mt-1">● People: 42 in Grocery · Dwell: 8.2 min · Traffic: HIGH 🔥</p>
          </div>
        </div>

        {/* Cam 03 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="h-56 bg-slate-800 relative flex items-center justify-center">
            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">CAM-03 · ● LIVE</span>
            <span className="absolute bottom-2 right-2 bg-amber-500 text-white text-[10px] font-mono px-2 py-0.5 rounded">15% ⚠️ Low</span>
            <div className="border-2 border-amber-400 absolute w-32 h-14 left-8 top-16"><span className="text-[9px] text-amber-400 font-mono pl-1">Milk: 3/20</span></div>
            <div className="border-2 border-rose-500 absolute w-32 h-14 left-44 top-16"><span className="text-[9px] text-rose-500 font-mono pl-1">Bread: 0/15</span></div>
          </div>
          <div className="p-3 text-xs">
            <p className="font-bold text-slate-800">Grocery Shelves <span className="text-[10px] text-slate-400 block font-normal">Shelf Engine · Object Detection</span></p>
            <p className="text-[10px] text-slate-500 mt-1">● Milk: 3/20 detected · Bread: 0/15 OUT · Juice: 28/30 ✔</p>
          </div>
        </div>

        {/* Cam 04 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="h-56 bg-slate-900 relative flex items-center justify-center">
            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">CAM-04 · ● LIVE</span>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">8 customers</span>
            <div className="border-2 border-emerald-400 absolute w-14 h-16 left-12 top-20"></div>
            <div className="border-2 border-emerald-400 absolute w-14 h-16 left-32 top-20"></div>
            <div className="border-2 border-rose-500 absolute w-16 h-18 left-52 top-18"><span className="text-[9px] text-rose-400 font-mono pl-1">congestion</span></div>
          </div>
          <div className="p-3 text-xs">
            <p className="font-bold text-slate-800">Billing Area <span className="text-[10px] text-slate-400 block font-normal">Queue Engine · Prediction</span></p>
            <p className="text-[10px] text-slate-500 mt-1">● Counter 2: 8 in queue · Wait: 5.1 min · Congestion: PREDICTED</p>
          </div>
        </div>

      </div>

      {/* Blue Privacy Banner */}
      <div className="p-3 bg-[#EEF4FF] border border-[#C7D9FE] rounded-xl flex items-center gap-2 text-xs text-[#1E40AF]">
        <Lock className="w-4 h-4 text-[#2563EB] shrink-0" />
        <span><strong>Privacy-First Processing:</strong> All video analysis happens on-device (NVIDIA Jetson Orin Nano). No raw video is stored or transmitted. Only anonymized JSON events (count, zone, dwell) are sent to the cloud. No faces, names, or biometric identifiers are generated.</span>
      </div>
    </div>
  );
}
