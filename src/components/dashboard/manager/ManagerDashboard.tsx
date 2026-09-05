import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import TopNav from '../shared/TopNav';
import KPICard from '../shared/KPICard';
import PlaceholderView from '../shared/PlaceholderView';
import { mockStores, mockAIRecommendations } from '../../../data/mockData';
import { Users, Clock, Package, AlertTriangle, BrainCircuit, Activity } from 'lucide-react';

export default function ManagerDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const store = mockStores[0]; // Chennai Central

  return (
    <div className="flex h-screen bg-background text-white font-body overflow-hidden">
      <Sidebar role="manager" onLogout={onLogout} activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav role="manager" storeName={store.name} />
        
        <main className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {activeItem === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Store Operations</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-sm font-medium">
                  <Activity className="w-4 h-4" />
                  Store Status: Excellent
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <KPICard title="Footfall" value={store.occupancy} icon={Users} colorClass="text-neon-blue" trend="12%" trendUp={true} />
                <KPICard title="Capacity" value={`${Math.round((store.occupancy/store.capacity)*100)}%`} icon={Activity} colorClass="text-neon-purple" />
                <KPICard title="Inv. Health" value={`${store.inventoryHealth}%`} icon={Package} colorClass="text-neon-green" trend="2%" trendUp={false} />
                <KPICard title="Queues" value={store.queueCount} icon={Users} colorClass="text-neon-yellow" trend="3" trendUp={false} />
                <KPICard title="Wait Time" value={`${store.avgWaitTime}m`} icon={Clock} colorClass="text-neon-red" trend="1.2m" trendUp={false} />
                <KPICard title="Alerts" value="7" icon={AlertTriangle} colorClass="text-neon-red" trend="2" trendUp={true} />
              </div>

              {/* AI Decision Center */}
              <section className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-neon-purple/20">
                    <BrainCircuit className="w-6 h-6 text-neon-purple" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">AI Decision Center</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockAIRecommendations.map((rec) => (
                    <div key={rec.id} className={`border rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${
                      rec.type === 'queue' ? 'border-neon-red/30 bg-gradient-to-br from-neon-red/10 to-background hover:border-neon-red/60' 
                      : 'border-neon-yellow/30 bg-gradient-to-br from-neon-yellow/10 to-background hover:border-neon-yellow/60'
                    }`}>
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-32 h-32" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            rec.type === 'queue' ? 'bg-neon-red text-white' : 'bg-neon-yellow text-black'
                          }`}>
                            {rec.type === 'queue' ? 'QUEUE CONGESTION' : 'INVENTORY RISK'}
                          </span>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">AI Prediction</p>
                            <p className="text-lg font-medium text-white">{rec.prediction}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Recommendation</p>
                            <p className="text-lg font-medium text-white">{rec.recommendation}</p>
                          </div>
                        </div>

                        <button className={`w-full py-3 rounded-lg font-bold text-sm transition-colors shadow-lg ${
                          rec.type === 'queue' 
                            ? 'bg-neon-red text-white hover:bg-red-600 shadow-neon-red/20' 
                            : 'bg-neon-yellow text-black hover:bg-yellow-500 shadow-neon-yellow/20'
                        }`}>
                          [ {rec.actionText.toUpperCase()} ]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
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
