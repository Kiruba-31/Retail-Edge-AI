import React, { useState, useEffect } from 'react';
import { 
  Users, User, ShoppingCart, Package, Clock, Bell, 
  Lightbulb, AlertTriangle, CheckCircle2, ShieldCheck,
  Flame, Lock, Video, Cpu, Database, Cloud
} from 'lucide-react';

export default function OverviewDashboard() {
  const [currentTime, setCurrentTime] = useState('Thu, 27 Aug, 2026  •  09:25:36 am');

  // Heatmap Data matching the screenshot exactly
  const heatmapData = [
    { zone: 'Grocery', count: 42, percentage: 70, color: 'bg-[#ff5555]', icon: '🔥' },
    { zone: 'Beverages', count: 21, percentage: 53, color: 'bg-[#f59e0b]', icon: '🟡' },
    { zone: 'Fresh Produce', count: 31, percentage: 78, color: 'bg-[#ff5555]', icon: '🔥' },
    { zone: 'Cosmetics', count: 8, percentage: 27, color: 'bg-[#10b981]', icon: '🟢' },
    { zone: 'Promotional', count: 18, percentage: 72, color: 'bg-[#ff5555]', icon: '🔥' },
    { zone: 'Electronics', count: 12, percentage: 40, color: 'bg-[#f59e0b]', icon: '🟢' },
  ];

  // Queue Status Data
  const queueCounters = [
    { name: 'Counter 1', count: 3, people: [1, 2, 3], closed: false },
    { name: 'Counter 2', count: 6, people: [1, 2, 3, 4, 5, 6], closed: false },
    { name: 'Counter 3', count: 2, people: [1, 2], closed: false },
    { name: 'Counter 4', count: 0, people: [], closed: true },
  ];

  // Inventory Stock Table
  const inventoryItems = [
    { name: 'Milk', shelf: 'A12', stock: '3/20', status: 'Low', statusColor: 'bg-amber-100 text-amber-800 border-amber-300' },
    { name: 'Bread', shelf: 'A15', stock: '0/15', status: 'Out', statusColor: 'bg-rose-100 text-rose-800 border-rose-300' },
    { name: 'Biscuits', shelf: 'B03', stock: '5/30', status: 'Low', statusColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & TELEMETRY PILLS                               */}
      {/* ------------------------------------------------------------- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{currentTime}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Edge Status Pill */}
          <div className="flex items-center gap-2 bg-[#E8F8F0] border border-[#B7EBD0] text-[#0E7043] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            EDGE ONLINE · 4/4 Cameras
          </div>

          {/* Privacy Pill */}
          <div className="flex items-center gap-2 bg-[#EEF4FF] border border-[#C7D9FE] text-[#1E40AF] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
            Privacy: ACTIVE
          </div>

          {/* Avatar Badge */}
          <div className="w-8 h-8 rounded-full bg-[#0F362F] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AD
          </div>
        </div>
      </header>

      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* ------------------------------------------------------------- */}
        {/* 2. TOP 6 KPI METRIC CARDS                                     */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Footfall */}
          <div className="bg-[#EEF4FF] border border-[#D0E0FF] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1,257</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Today's Footfall</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">+12.4% vs yesterday</p>
          </div>

          {/* Card 2: Current Occupancy */}
          <div className="bg-[#EAFBF3] border border-[#C6F3DE] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-2">
              <User className="w-4 h-4 text-[#059669]" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">62 / 100</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Current Occupancy</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">62% capacity</p>
          </div>

          {/* Card 3: Active Queue */}
          <div className="bg-[#FEF9E7] border border-[#FDE68A] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-2">
              <ShoppingCart className="w-4 h-4 text-[#D97706]" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">14</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Active Queue</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Across 4 counters</p>
          </div>

          {/* Card 4: Stock Availability */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center mb-2">
              <Package className="w-4 h-4 text-[#7C3AED]" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">94%</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Stock Availability</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">13 low / 3 out-of-stock</p>
          </div>

          {/* Card 5: Avg Dwell Time */}
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F43F5E]/10 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-[#E11D48]" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">7.4 min</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Avg Dwell Time</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">+0.8 min vs yesterday</p>
          </div>

          {/* Card 6: Active Alerts */}
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F43F5E]/10 flex items-center justify-center mb-2">
              <Bell className="w-4 h-4 text-[#E11D48]" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">7</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Active Alerts</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">2 critical · 5 warnings</p>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. MIDDLE SECTION: LIVE STORE HEATMAP & AI RECOMMENDATIONS    */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Live Store Heatmap */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900">Live Store Heatmap</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#0E7043] border border-[#B7EBD0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                ● Live
              </span>
            </div>

            {/* Zone Horizontal Progress Bars */}
            <div className="space-y-4">
              {heatmapData.map((zone) => (
                <div key={zone.zone} className="flex items-center gap-4 text-xs font-medium">
                  <span className="w-24 text-slate-700 font-semibold">{zone.zone}</span>
                  <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden relative flex items-center">
                    <div 
                      className={`h-full ${zone.color} rounded-lg flex items-center justify-end pr-3 text-white font-bold transition-all duration-500`}
                      style={{ width: `${zone.percentage}%` }}
                    >
                      {zone.count}
                    </div>
                  </div>
                  <span className="w-12 text-slate-500 font-mono text-right">{zone.percentage}%</span>
                  <span className="w-6 text-sm">{zone.icon}</span>
                </div>
              ))}
            </div>

            {/* Bottom: Zone Occupancy Visual Blueprint */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium mb-3">Zone occupancy map</p>
              <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
                <div className="bg-[#FCA5A5]/40 border border-[#F87171] p-2.5 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-800">Grocery</p>
                  <p className="text-[9px] text-slate-500">42 shoppers</p>
                </div>
                <div className="bg-[#FDE68A]/50 border border-[#FBBF24] p-2.5 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-800">Beverages</p>
                  <p className="text-[9px] text-slate-500">21 shoppers</p>
                </div>
                <div className="bg-[#FCA5A5]/40 border border-[#F87171] p-2.5 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-800">Fresh Produce</p>
                  <p className="text-[9px] text-slate-500">31 shoppers</p>
                </div>
                <div className="bg-[#A7F3D0]/40 border border-[#34D399] p-2.5 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-800">Cosmetics</p>
                  <p className="text-[9px] text-slate-500">8 shoppers</p>
                </div>
                <div className="bg-[#FCA5A5]/40 border border-[#F87171] p-2.5 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-800">Promotional</p>
                  <p className="text-[9px] text-slate-500">18 shoppers</p>
                </div>
                <div className="bg-[#FDE68A]/50 border border-[#FBBF24] p-2.5 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-800">Electronics</p>
                  <p className="text-[9px] text-slate-500">12 shoppers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: AI Recommendations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-md bg-[#0F362F] text-emerald-400 flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">AI Recommendations</h2>
              </div>
              <p className="text-xs text-slate-400 mb-5 ml-8">Predict · Decide · Act</p>

              <div className="space-y-3.5">
                {/* Recommendation 1: Open Counter 4 */}
                <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                    <h3 className="text-xs font-bold text-slate-900">Open Counter 4</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 ml-4.5">
                    Queue predicted to reach 15 in 8 minutes. Current: 13 customers.
                  </p>
                  <button className="ml-4.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Take Action
                  </button>
                </div>

                {/* Recommendation 2: Restock Milk */}
                <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
                    <h3 className="text-xs font-bold text-slate-900">Restock Milk — Shelf A12</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 ml-4.5">
                    Current stock: 3/20. Below minimum threshold.
                  </p>
                  <button className="ml-4.5 px-3 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Take Action
                  </button>
                </div>

                {/* Recommendation 3: Move Staff */}
                <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></span>
                    <h3 className="text-xs font-bold text-slate-900">Move 1 Staff: Electronics → Billing</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 ml-4.5">
                    Electronics demand low (12 people). Billing under pressure.
                  </p>
                  <button className="ml-4.5 px-3 py-1.5 bg-[#334155] hover:bg-[#1E293B] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. BOTTOM ROW: QUEUE STATUS & INVENTORY STATUS                */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Card: Queue Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4">Queue Status</h2>
              <div className="space-y-4">
                {queueCounters.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="w-24 font-bold text-slate-700">{c.name}</span>
                    <div className="flex-1 flex items-center gap-1.5">
                      {c.closed ? (
                        <span className="text-xs text-slate-400 font-medium">Closed</span>
                      ) : (
                        c.people.map((p) => (
                          <span key={p} className="text-sm">🧍</span>
                        ))
                      )}
                    </div>
                    <span className="font-bold text-slate-800 text-right w-6">
                      {c.closed ? '—' : c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Alert Banner in Queue Card */}
            <div className="mt-6 p-3 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl flex items-center gap-2 text-xs text-amber-900 font-semibold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>⚠️ Congestion predicted in 8 minutes — Open Counter 4</span>
            </div>
          </div>

          {/* Right Card: Inventory Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Inventory Status</h2>
            
            {/* 4 Stat Boxes */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <span className="text-base">📦</span>
                <p className="text-xl font-black text-slate-900 mt-1">500</p>
                <p className="text-xs text-slate-500 font-medium">Total Products</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <span className="text-base">✅</span>
                <p className="text-xl font-black text-slate-900 mt-1">462</p>
                <p className="text-xs text-slate-500 font-medium">Available</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <span className="text-base">⚠️</span>
                <p className="text-xl font-black text-slate-900 mt-1">25</p>
                <p className="text-xs text-slate-500 font-medium">Low Stock</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <span className="text-base">🔴</span>
                <p className="text-xl font-black text-slate-900 mt-1">13</p>
                <p className="text-xs text-slate-500 font-medium">Out of Stock</p>
              </div>
            </div>

            {/* Inventory List Items */}
            <div className="space-y-2 text-xs">
              {inventoryItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="text-slate-400 font-mono">{item.shelf}</span>
                  <span className="font-semibold text-slate-700 font-mono">{item.stock}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.statusColor}`}>
                    {item.status === 'Low' ? '⚠️ Low' : '🔴 Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. FOOTER: EDGE DEVICE & PRIVACY STATUS MATRIX                */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Edge Device & Privacy Status</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
            
            {/* Column 1: Edge Device */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Edge Device</p>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">NVIDIA Jetson Orin</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">AI Inference</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Local Database</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Cloud Sync</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Active</span>
                </div>
              </div>
            </div>

            {/* Column 2: Privacy Controls */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Privacy Controls</p>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Face Recognition</span>
                  <span className="text-rose-600 font-semibold flex items-center gap-1">● OFF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Personal Identity</span>
                  <span className="text-rose-600 font-bold uppercase text-[10px]">NOT STORED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Raw Video Upload</span>
                  <span className="text-rose-600 font-semibold flex items-center gap-1">● OFF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Anonymous Track</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● ON</span>
                </div>
              </div>
            </div>

            {/* Column 3: Camera Health */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Camera Health</p>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">CAM-01 Entrance</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">CAM-02 Store Floor</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">CAM-03 Shelf A</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">CAM-04 Billing</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Online</span>
                </div>
              </div>
            </div>

            {/* Column 4: AI Models Active */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">AI Models Active</p>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">YOLO v8</span>
                  <span className="text-emerald-600 font-semibold">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">ByteTrack</span>
                  <span className="text-emerald-600 font-semibold">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Shelf Engine</span>
                  <span className="text-emerald-600 font-semibold">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Queue Engine</span>
                  <span className="text-emerald-600 font-semibold">Running</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
