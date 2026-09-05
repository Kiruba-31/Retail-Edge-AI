import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import TopNav from '../shared/TopNav';
import KPICard from '../shared/KPICard';
import { mockStores, mockAlerts } from '../../../data/mockData';
import { Store, Users, Package, AlertTriangle, Clock, Camera, Activity, Server } from 'lucide-react';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const totalStores = mockStores.length;
  const totalFootfall = mockStores.reduce((acc, store) => acc + store.occupancy, 0);
  const avgInventory = Math.round(mockStores.reduce((acc, store) => acc + store.inventoryHealth, 0) / totalStores);
  const totalAlerts = mockAlerts.length + 20; 
  const totalQueues = mockStores.reduce((acc, store) => acc + store.queueCount, 0);
  const avgWait = (mockStores.reduce((acc, store) => acc + store.avgWaitTime, 0) / totalStores).toFixed(1);
  const totalStaff = mockStores.reduce((acc, store) => acc + store.employeeCount, 0);
  const totalCameras = mockStores.reduce((acc, store) => acc + store.cameraCount, 0);
  const activeCameras = mockStores.reduce((acc, store) => acc + store.activeCameras, 0);

  // -------------------------------------------------------------
  // VIEW 1: DASHBOARD (ADMIN OVERVIEW) - Keeping our original with enhancements
  // -------------------------------------------------------------
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Admin Overview</h2>
          <p className="text-gray-400 mt-1">Global Retail Intelligence Status</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface border border-gray-800">
          <Server className="w-5 h-5 text-neon-green" />
          <span className="text-sm font-medium">SYSTEM ONLINE</span>
          <span className="relative flex h-3 w-3 ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPICard title="Total Stores" value={totalStores} icon={Store} colorClass="text-neon-purple" />
        <KPICard title="Total Footfall" value={totalFootfall.toLocaleString()} icon={Users} colorClass="text-neon-blue" trend="8.4%" trendUp={true} />
        <KPICard title="Avg. Inventory" value={`${avgInventory}%`} icon={Package} colorClass="text-neon-green" trend="1.2%" trendUp={true} />
        <KPICard title="Active Alerts" value={totalAlerts} icon={AlertTriangle} colorClass="text-neon-red" />
        <KPICard title="Total Queues" value={totalQueues} icon={Users} colorClass="text-neon-yellow" />
        <KPICard title="Avg Wait Time" value={`${avgWait}m`} icon={Clock} colorClass="text-neon-red" trend="0.5m" trendUp={false} />
        <KPICard title="Total Staff" value={totalStaff} icon={Users} colorClass="text-blue-400" />
        <KPICard title="Cameras" value={`${activeCameras}/${totalCameras}`} icon={Camera} colorClass="text-gray-400" />
      </div>

      <div className="bg-[#101726] border border-gray-800 p-5 rounded-xl mt-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">🖥️ Edge Hardware & Node Fleet Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#162032] p-3 rounded-lg border border-gray-800">
            <span className="text-gray-400">Edge Processing Nodes</span>
            <p className="text-base font-bold text-white mt-1">16 / 16 Clustered (100%)</p>
          </div>
          <div className="bg-[#162032] p-3 rounded-lg border border-gray-800">
            <span className="text-gray-400">GPU Utilization (Orin AGX)</span>
            <p className="text-base font-bold text-neon-green mt-1">44% Average Load</p>
          </div>
          <div className="bg-[#162032] p-3 rounded-lg border border-gray-800">
            <span className="text-gray-400">Inference Rate</span>
            <p className="text-base font-bold text-neon-blue mt-1">30.0 FPS / Channel</p>
          </div>
          <div className="bg-[#162032] p-3 rounded-lg border border-gray-800">
            <span className="text-gray-400">Privacy Ring Buffer</span>
            <p className="text-base font-bold text-neon-purple mt-1">2.0s Auto-Purge | Zero PII</p>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 2: STORES
  // -------------------------------------------------------------
  const renderStores = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-white">Active Retail Store Nodes (8 Locations)</h2>
        <button className="bg-neon-blue hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-all">
          + Add New Store Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { id: 'Chennai-01', region: 'TN - Flagship', footfall: 2184, occ: '74/110', osa: '96.4%', queues: 4, wait: '3.8m', status: 'Optimal' },
          { id: 'Chennai-02', region: 'TN - South', footfall: 1420, occ: '45/90', osa: '95.0%', queues: 3, wait: '3.2m', status: 'Optimal' },
          { id: 'Bengaluru-01', region: 'KA - Central', footfall: 2110, occ: '88/120', osa: '91.2%', queues: 5, wait: '5.1m', status: 'Queue Surge' },
          { id: 'Bengaluru-02', region: 'KA - East', footfall: 1840, occ: '62/100', osa: '94.8%', queues: 4, wait: '4.0m', status: 'Optimal' },
          { id: 'Mumbai-01', region: 'MH - West', footfall: 2450, occ: '92/150', osa: '95.5%', queues: 6, wait: '4.4m', status: 'Optimal' },
          { id: 'Mumbai-02', region: 'MH - Suburb', footfall: 1120, occ: '38/80', osa: '97.0%', queues: 3, wait: '2.9m', status: 'Optimal' },
          { id: 'Delhi-01', region: 'DL - North', footfall: 1980, occ: '96/120', osa: '88.5%', queues: 5, wait: '5.8m', status: 'Stock & Queue' },
          { id: 'Hyderabad-01', region: 'TS - Central', footfall: 1436, occ: '52/100', osa: '96.2%', queues: 4, wait: '3.5m', status: 'Optimal' },
        ].map((st, i) => (
          <div key={i} className="bg-[#101726] border border-gray-800 rounded-xl p-4 hover:border-neon-blue/50 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base">{st.id}</h3>
                <p className="text-xs text-gray-400">{st.region}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                st.status === 'Optimal' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30'
              }`}>
                ● {st.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-800 text-xs">
              <div>
                <span className="text-gray-500">Live Occupancy:</span>
                <p className="font-semibold text-gray-200">{st.occ}</p>
              </div>
              <div>
                <span className="text-gray-500">Stock Availability:</span>
                <p className="font-semibold text-gray-200">{st.osa}</p>
              </div>
              <div>
                <span className="text-gray-500">Active Queues:</span>
                <p className="font-semibold text-gray-200">{st.queues} Lanes</p>
              </div>
              <div>
                <span className="text-gray-500">Avg Wait:</span>
                <p className="font-semibold text-gray-200">{st.wait}</p>
              </div>
            </div>

            <button className="w-full mt-4 bg-[#162032] hover:bg-neon-blue/20 hover:text-neon-blue text-gray-300 text-xs py-1.5 rounded border border-gray-700 transition-all">
              Manage Store Telemetry ➔
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 3: EMPLOYEES
  // -------------------------------------------------------------
  const renderEmployees = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Staff Roster & Live Floor Allocation</h2>
        <span className="text-xs text-neon-green bg-neon-green/10 px-3 py-1 rounded border border-neon-green/30">126 Clocked In</span>
      </div>
      <div className="bg-[#101726] border border-gray-800 rounded-xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#162032] text-gray-400 border-b border-gray-800">
            <tr>
              <th className="p-3">Staff Member</th>
              <th className="p-3">Store</th>
              <th className="p-3">Role</th>
              <th className="p-3">Assigned Zone</th>
              <th className="p-3">Current Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-200">
            {[
              { name: 'R. Kumar', store: 'Chennai-01', role: 'Cashier Lead', zone: 'Checkout Counter 01', status: 'Active (3.1m avg)' },
              { name: 'S. Priya', store: 'Chennai-01', role: 'Cashier', zone: 'Checkout Counter 02', status: 'Active (Heavy Cart)' },
              { name: 'A. Sharma', store: 'Chennai-01', role: 'Floor Associate', zone: 'Grocery Bay 02-04', status: 'Restocking Atta 5kg' },
              { name: 'M. Patel', store: 'Mumbai-01', role: 'Store Supervisor', zone: 'Floor All', status: 'On Shift' },
              { name: 'D. Singh', store: 'Delhi-01', role: 'Cashier Standby', zone: 'Counter 04', status: '⚡ Dispatch Requested' },
            ].map((emp, i) => (
              <tr key={i} className="hover:bg-gray-800/40">
                <td className="p-3 font-semibold text-white">{emp.name}</td>
                <td className="p-3">{emp.store}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">{emp.zone}</td>
                <td className="p-3"><span className="text-neon-blue">{emp.status}</span></td>
                <td className="p-3"><button className="text-neon-blue hover:underline">Reassign</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 4: CAMERAS
  // -------------------------------------------------------------
  const renderCameras = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Camera Topologies & AI Vision Pipelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'CAM-01', loc: 'Main Entrance Ingress', model: 'Centroid Ingress/Egress', fps: '30.0', privacy: 'UUID Hash', status: 'Online' },
          { id: 'CAM-02', loc: 'Grocery Bay 01-04', model: 'YOLO Planogram & OSA', fps: '29.8', privacy: 'Face Blur Masked', status: 'Online' },
          { id: 'CAM-03', loc: 'Promotional Endcap A', model: 'Dwell & Shopper Engagement', fps: '30.0', privacy: 'Centroid Only', status: 'Online' },
          { id: 'CAM-04', loc: 'Billing Row (Lanes 1-4)', model: 'Queue Length & Wait Estimation', fps: '30.0', privacy: 'Keypad Masked', status: 'Online' },
          { id: 'CAM-05', loc: 'Beverage Chillers', model: 'Shelf Facing & Void Detection', fps: '29.9', privacy: 'Face Blur Masked', status: 'Online' },
          { id: 'CAM-08', loc: 'Delhi Lane 3 Backup', model: 'Queue Density', fps: '0.0', privacy: 'N/A', status: 'Offline' },
        ].map((cam, i) => (
          <div key={i} className="bg-[#101726] border border-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white text-sm">{cam.id}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${cam.status === 'Online' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'}`}>
                ● {cam.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">{cam.loc}</p>
            <div className="mt-3 bg-[#162032] p-2 rounded border border-gray-800 text-[11px] space-y-1">
              <div className="flex justify-between"><span className="text-gray-400">AI Task:</span><span className="text-neon-blue">{cam.model}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Inference Rate:</span><span className="text-white">{cam.fps} FPS</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Privacy Mask:</span><span className="text-neon-purple">{cam.privacy}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 5: INVENTORY
  // -------------------------------------------------------------
  const renderInventory = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Shelf Compliance & Real-Time Stock Health</h2>
      <div className="bg-[#101726] border border-gray-800 rounded-xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#162032] text-gray-400 border-b border-gray-800">
            <tr>
              <th className="p-3">Aisle / Bay</th>
              <th className="p-3">Product SKU</th>
              <th className="p-3">Target Facings</th>
              <th className="p-3">Detected Stock</th>
              <th className="p-3">OSA Status</th>
              <th className="p-3">Triggered Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-200">
            {[
              { bay: 'Bay 02 - Grocery', sku: 'Whole Wheat Atta 5kg', target: '8 Facings', det: '2 Facings (25%)', status: '⚠️ LOW STOCK', act: 'Restock Ticket #1042' },
              { bay: 'Bay 04 - Snacks', sku: 'Brand-X Potato Chips', target: '12 Facings', det: '12 / 12 (100%)', status: '✔ NOMINAL', act: 'None' },
              { bay: 'Bay 07 - Drinks', sku: 'Cold Cola 2L Bottle', target: '6 Facings', det: '3 Cold / 3 Misplaced', status: '⚠️ PLANOGRAM MISMATCH', act: 'Align Facings Ticket' },
              { bay: 'Endcap A - Promo', sku: 'Dark Roast Coffee 100g', target: '10 Facings', det: '3 Facings (30%)', status: '⚠️ RUN-RATE DEPLETION', act: 'Refill Ticket #1044' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-gray-800/40">
                <td className="p-3 font-medium text-white">{item.bay}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.target}</td>
                <td className="p-3">{item.det}</td>
                <td className="p-3 font-semibold text-neon-yellow">{item.status}</td>
                <td className="p-3 text-neon-blue font-medium">{item.act}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 6: QUEUE MANAGEMENT
  // -------------------------------------------------------------
  const renderQueue = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Live Queue Intelligence & Lane Allocation</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { lane: 'Lane 01', type: 'Standard', queue: '4 Shoppers', wait: '03m 10s', status: 'Optimal Flow', bg: 'border-neon-green/40' },
          { lane: 'Lane 02', type: 'Bulk Cart', queue: '5 Shoppers', wait: '04m 20s', status: 'Heavy Load', bg: 'border-neon-yellow/40' },
          { lane: 'Lane 03', type: 'Express (≤5)', queue: '2 Shoppers', wait: '01m 15s', status: 'Fast Clear', bg: 'border-neon-green/40' },
          { lane: 'Lane 04', type: 'Standby', queue: '0 Shoppers', wait: '--', status: '⚡ Recommendation: Open in <3m', bg: 'border-neon-blue/40' },
        ].map((q, i) => (
          <div key={i} className={`bg-[#101726] border ${q.bg} p-4 rounded-xl`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">{q.lane}</span>
              <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{q.type}</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{q.queue}</p>
            <p className="text-xs text-gray-400">Estimated Wait: <span className="text-neon-blue font-medium">{q.wait}</span></p>
            <div className="mt-3 pt-2 border-t border-gray-800 text-xs text-neon-yellow font-medium">{q.status}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 7: SHOPPER ANALYTICS
  // -------------------------------------------------------------
  const renderAnalytics = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Shopper Journey & Zone Dwell Heatmap</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#101726] border border-gray-800 p-4 rounded-xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase">Grocery & Staples</h3>
          <p className="text-xl font-bold text-white mt-1">42 Shoppers 🔥</p>
          <p className="text-xs text-gray-400 mt-2">Avg Dwell Time: <span className="text-neon-green font-semibold">6m 12s</span></p>
          <p className="text-xs text-gray-400">Conversion Correlation: 78%</p>
        </div>
        <div className="bg-[#101726] border border-gray-800 p-4 rounded-xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase">Promotional Endcaps</h3>
          <p className="text-xl font-bold text-white mt-1">31 Shoppers 🔥</p>
          <p className="text-xs text-gray-400 mt-2">Avg Dwell Time: <span className="text-neon-blue font-semibold">4m 50s</span></p>
          <p className="text-xs text-gray-400">Conversion Correlation: 64%</p>
        </div>
        <div className="bg-[#101726] border border-gray-800 p-4 rounded-xl">
          <h3 className="text-xs font-semibold text-gray-400 uppercase">Personal Care & Beauty</h3>
          <p className="text-xl font-bold text-white mt-1">8 Shoppers</p>
          <p className="text-xs text-gray-400 mt-2">Avg Dwell Time: <span className="text-neon-yellow font-semibold">3m 40s</span></p>
          <p className="text-xs text-gray-400">Conversion Correlation: 28%</p>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 8: AI INSIGHTS
  // -------------------------------------------------------------
  const renderInsights = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Predictive AI Recommendations & Optimization Engine</h2>
      <div className="space-y-3">
        {[
          { title: 'Predictive Queue Surge Ahead (18:30 IST)', desc: 'Historical footfall pattern indicates a +35% surge at Chennai-01 in 40 minutes. Pre-assign 2 cashier associates now.', badge: 'ACTIONABLE', color: 'border-neon-blue/40 text-neon-blue' },
          { title: 'Dwell-to-Conversion Anomaly in Bay 06 (Personal Care)', desc: 'Shoppers dwell >5 minutes but purchase conversion is low (14%). Vision inspection flags missing price tags.', badge: 'MERCHANDISING', color: 'border-neon-yellow/40 text-neon-yellow' },
          { title: 'High Stock Run-Rate on Promotional Coffee', desc: 'Depletion rate is 3.2x above baseline due to endcap positioning. Expected stockout within 45 mins without refill.', badge: 'RESTOCK', color: 'border-neon-red/40 text-neon-red' },
        ].map((ins, i) => (
          <div key={i} className={`bg-[#101726] border ${ins.color.split(' ')[0]} p-4 rounded-xl`}>
            <div className="flex justify-between">
              <h3 className="text-sm font-bold text-white">{ins.title}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${ins.color}`}>{ins.badge}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{ins.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 9: ALERTS
  // -------------------------------------------------------------
  const renderAlerts = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Real-Time Operational Alerts (23 Active)</h2>
      <div className="space-y-2">
        {[
          { severity: 'CRITICAL', text: 'Queue Spillover: Delhi-01 average checkout wait time exceeded 5.8 mins.', time: '2 mins ago' },
          { severity: 'CRITICAL', text: 'Camera Stream Disconnected: CAM-08 (Delhi Lane 3). Fallback enabled.', time: '8 mins ago' },
          { severity: 'WARNING', text: 'Low Shelf Availability: Bay 02 Whole Wheat Atta at 25% facings.', time: '14 mins ago' },
          { severity: 'WARNING', text: 'Planogram Violation: Cold Cola encroaching Sparkling Water slot on Bay 07.', time: '22 mins ago' },
        ].map((alt, i) => (
          <div key={i} className="bg-[#101726] border border-gray-800 p-3 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${alt.severity === 'CRITICAL' ? 'bg-neon-red/20 text-neon-red' : 'bg-neon-yellow/20 text-neon-yellow'}`}>
                {alt.severity}
              </span>
              <span className="text-gray-200">{alt.text}</span>
            </div>
            <span className="text-gray-500">{alt.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 10: REPORTS
  // -------------------------------------------------------------
  const renderReports = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Daily & Weekly Business Intelligence Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#101726] border border-gray-800 p-4 rounded-xl">
          <h3 className="font-bold text-white mb-2">Weekly Footfall vs Revenue Correlation</h3>
          <p className="text-gray-400">Analyzes ingress count across all 8 branches against final POS checkout revenue totals.</p>
          <button className="mt-4 bg-[#162032] text-neon-blue hover:bg-neon-blue/20 px-3 py-1.5 rounded border border-gray-700">Export CSV / PDF Report</button>
        </div>
        <div className="bg-[#101726] border border-gray-800 p-4 rounded-xl">
          <h3 className="font-bold text-white mb-2">Planogram & Merchandising Compliance Audit</h3>
          <p className="text-gray-400">Supplier facing compliance report confirming contracted shelf allocations for FMCG partners.</p>
          <button className="mt-4 bg-[#162032] text-neon-blue hover:bg-neon-blue/20 px-3 py-1.5 rounded border border-gray-700">Generate Vendor Audit</button>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 11: INTEGRATIONS
  // -------------------------------------------------------------
  const renderIntegrations = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Enterprise ERP & POS Middleware Pipelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {[
          { name: 'SAP S/4HANA ERP', type: 'Inventory Master Sync', status: '● Connected (12ms sync)', desc: 'Real-time stock balance & restock webhook trigger.' },
          { name: 'Oracle Retail POS', type: 'Billing Lane Feed', status: '● Connected (Active)', desc: 'Transaction departure sync matching camera queue exits.' },
          { name: 'MQTT Edge Message Broker', type: 'Edge Telemetry Gateway', status: '● Clustered', desc: 'Metadata payload synchronization for all 16 Orin nodes.' },
        ].map((int, i) => (
          <div key={i} className="bg-[#101726] border border-gray-800 p-4 rounded-xl">
            <h3 className="font-bold text-white text-sm">{int.name}</h3>
            <p className="text-gray-400 mt-1">{int.type}</p>
            <p className="text-neon-green font-semibold mt-2">{int.status}</p>
            <p className="text-gray-500 mt-2 text-[11px]">{int.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 12: PRIVACY & SECURITY
  // -------------------------------------------------------------
  const renderPrivacy = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">Privacy-by-Design & Zero-PII Compliance Engine</h2>
      <div className="bg-[#101726] border border-gray-800 p-5 rounded-xl space-y-3 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <p className="font-semibold text-white">100% On-Premises Edge Computer Vision</p>
            <p className="text-gray-400">Raw video frames NEVER leave physical store edge servers. Only numeric counts & centroids are sent upstream.</p>
          </div>
          <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded font-bold">VERIFIED</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <p className="font-semibold text-white">Zero Facial Biometric Vectors</p>
            <p className="text-gray-400">Centroid tracking utilizes transient UUID hashes that are automatically dropped upon exit.</p>
          </div>
          <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded font-bold">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">Local Ring Buffer Lifecycle</p>
            <p className="text-gray-400">Frames stored strictly in volatile RAM with automatic 2.0-second FIFO purge cycle.</p>
          </div>
          <span className="bg-neon-purple/20 text-neon-purple px-3 py-1 rounded font-bold">2.0s PURGE</span>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 13: SETTINGS
  // -------------------------------------------------------------
  const renderSettings = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-white">System Configuration & Thresholds</h2>
      <div className="bg-[#101726] border border-gray-800 p-5 rounded-xl space-y-4 text-xs max-w-2xl">
        <div>
          <label className="text-gray-300 font-semibold block mb-1">Queue Congestion Wait Time Alert Threshold (Minutes)</label>
          <input type="number" defaultValue={4.5} className="bg-[#162032] border border-gray-700 px-3 py-1.5 rounded text-white w-full focus:border-neon-blue focus:outline-none" />
        </div>
        <div>
          <label className="text-gray-300 font-semibold block mb-1">Low-Stock Shelf Facing Threshold (%)</label>
          <input type="number" defaultValue={30} className="bg-[#162032] border border-gray-700 px-3 py-1.5 rounded text-white w-full focus:border-neon-blue focus:outline-none" />
        </div>
        <div>
          <label className="text-gray-300 font-semibold block mb-1">Edge Node Heartbeat Timeout (Seconds)</label>
          <input type="number" defaultValue={10} className="bg-[#162032] border border-gray-700 px-3 py-1.5 rounded text-white w-full focus:border-neon-blue focus:outline-none" />
        </div>
        <button className="bg-neon-blue hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-all">Save System Thresholds</button>
      </div>
    </div>
  );

  const renderActiveTabContent = () => {
    switch (activeItem) {
      case 'dashboard': return renderDashboard();
      case 'stores': return renderStores();
      case 'employees': return renderEmployees();
      case 'cameras': return renderCameras();
      case 'inventory': return renderInventory();
      case 'queue': return renderQueue();
      case 'shopper': return renderAnalytics();
      case 'ai': return renderInsights();
      case 'alerts': return renderAlerts();
      case 'reports': return renderReports();
      case 'integrations': return renderIntegrations();
      case 'privacy': return renderPrivacy();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-background text-white font-body overflow-hidden">
      <Sidebar role="admin" onLogout={onLogout} activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav role="admin" />
        
        <main className="flex-1 overflow-y-auto p-6 hide-scrollbar bg-[#070b14]">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}
