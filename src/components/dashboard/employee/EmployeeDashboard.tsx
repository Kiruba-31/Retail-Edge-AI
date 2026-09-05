import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import TopNav from '../shared/TopNav';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import PlaceholderView from '../shared/PlaceholderView';
import { mockTasks, mockAlerts, mockInventory, mockCameras, mockStores } from '../../../data/mockData';
import { CheckSquare, BellRing, Users, Camera, Package, ShoppingCart } from 'lucide-react';

export default function EmployeeDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const store = mockStores[0];

  return (
    <div className="flex h-screen bg-background text-white font-body overflow-hidden">
      <Sidebar role="employee" onLogout={onLogout} activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav role="employee" storeName={store.name} />
        
        <main className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {activeItem === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-neon-blue/20 to-transparent p-6 rounded-2xl border border-neon-blue/20 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-1 text-white">Good Evening, Kiruba 👋</h2>
                  <p className="text-gray-400">Department: Store Operations</p>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard title="Pending Tasks" value="5" icon={CheckSquare} colorClass="text-neon-blue" />
                <KPICard title="Urgent Alerts" value="2" icon={BellRing} colorClass="text-neon-red" />
                <KPICard title="Queue Length" value="8" icon={Users} colorClass="text-neon-yellow" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Tasks & Alerts Column */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckSquare className="text-neon-blue w-5 h-5" />
                      My Tasks
                    </h3>
                    <div className="space-y-3">
                      {mockTasks.map(task => (
                        <AlertCard key={task.id} item={task} />
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BellRing className="text-neon-red w-5 h-5" />
                      Actionable Alerts
                    </h3>
                    <div className="space-y-3">
                      {mockAlerts.map(alert => (
                        <AlertCard key={alert.id} item={alert} />
                      ))}
                    </div>
                  </section>
                </div>

                {/* Inventory & Camera Column */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Package className="text-neon-green w-5 h-5" />
                      Restock Required
                    </h3>
                    <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-hover">
                          <tr>
                            <th className="px-4 py-3 font-medium text-gray-400">Item</th>
                            <th className="px-4 py-3 font-medium text-gray-400">Location</th>
                            <th className="px-4 py-3 font-medium text-gray-400">Stock</th>
                            <th className="px-4 py-3 font-medium text-gray-400 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {mockInventory.filter(i => i.status !== 'optimal').map(item => (
                            <tr key={item.id} className="hover:bg-surface-hover/50 transition-colors">
                              <td className="px-4 py-3 font-medium">{item.name}</td>
                              <td className="px-4 py-3 text-gray-400">{item.location}</td>
                              <td className="px-4 py-3">
                                <span className={item.status === 'out-of-stock' ? 'text-neon-red font-bold' : 'text-neon-yellow'}>
                                  {item.currentStock}/{item.maxStock}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button className="text-neon-blue hover:text-blue-400 font-medium">Restock</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Camera className="text-gray-400 w-5 h-5" />
                      Assigned Camera (Grocery)
                    </h3>
                    <div className="relative rounded-xl overflow-hidden border border-gray-800 aspect-video bg-black flex items-center justify-center">
                      {/* Placeholder for camera feed */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                        <span className="text-xs font-mono font-medium text-neon-green">LIVE</span>
                      </div>
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                        <p className="text-gray-500 font-mono text-sm">CAM-02 FEED</p>
                      </div>

                      {/* AI Overlay Mock */}
                      <div className="absolute bottom-4 left-4 border border-neon-red/50 bg-black/60 backdrop-blur-md p-3 rounded-lg flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-neon-red rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-neon-red" />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-neon-red font-bold">MILK SHELF (A12)</p>
                          <p className="text-[10px] text-white">Stock: 3 (Replenish Req.)</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          )}
          {activeItem !== 'dashboard' && (
            <PlaceholderView title={activeItem.charAt(0).toUpperCase() + activeItem.slice(1).replace('-', ' ')} />
          )}
        </main>
      </div>
    </div>
  );
}
