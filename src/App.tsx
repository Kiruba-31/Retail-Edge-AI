import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Store, Users, Camera, Package, 
  ShoppingCart, UserCheck, Sparkles, Bell, BarChart3, 
  Link2, ShieldCheck, Settings, LogOut, Search, Lock,
  ChevronRight, AlertTriangle, CheckCircle2, Clock, 
  Flame, User, RefreshCw, Download, Sliders, ExternalLink,
  UserPlus, Edit2, Trash2, X, UploadCloud, CheckCircle, FileText, Phone, Shield, MapPin,
  AlertCircle, XCircle, Calendar, ArrowRight, Award, Check,
  Eye, Filter, Layers, UserCog, Mail, ArrowLeft, CheckSquare,
  ShoppingBag, Activity, Cpu, Smile, Frown, BarChart2, ShieldAlert, ChevronLeft, ArrowUpDown, TrendingUp, Zap, ArrowUpRight, ArrowDownRight, EyeOff, Loader2, Key, ChevronDown
} from 'lucide-react';
import { authService, inventoryService } from './services/retailServices';
import { AuthPortal, ROLES_CONFIG } from './components/AuthPortal';
import { useUser, useClerk } from '@clerk/react';
import { generate500Products } from './data/mock500Inventory';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/RoleDashboards';

export default function RetailEdgeCompleteApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><ClerkAuthWrapper /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function ClerkAuthWrapper() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [searchParams] = useSearchParams();

  const urlRole = searchParams.get('role');
  const rawRole = urlRole || localStorage.getItem('user_role') || 'admin';

  if (urlRole) {
    localStorage.setItem('user_role', urlRole);
  }

  // Map the frontend role strings to the actual ROLES_CONFIG keys
  let finalRole = rawRole;
  if (rawRole === 'store_manager') finalRole = 'manager';
  if (rawRole === 'inventory_staff') finalRole = 'employee';
  if (rawRole === 'operations_manager') finalRole = 'manager';

  const mappedUser = {
    name: user?.fullName || user?.firstName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || '',
    role: finalRole,
    store: 'Store Chennai-01'
  };

  return <MainApp user={mappedUser} onLogout={() => signOut()} />;
}

export function MainApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const currentRoleConfig = ROLES_CONFIG[user.role as keyof typeof ROLES_CONFIG] || ROLES_CONFIG['admin'];
  const initialActiveTab = currentRoleConfig.navItems[0]?.subItems ? currentRoleConfig.navItems[0].subItems[0].id : currentRoleConfig.navItems[0].id;
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [openNavGroupId, setOpenNavGroupId] = useState<string | null>(currentRoleConfig.navItems[0]?.subItems ? currentRoleConfig.navItems[0].id : null);
  const [selectedStore, setSelectedStore] = useState('Store Chennai-01');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = currentRoleConfig.navItems;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      alert(`Search action triggered for: ${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION                                            */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-3 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-[#0c1322] flex items-center justify-center font-bold text-white shadow-sm">
              ⚡
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-900 capitalize">Retail Shop</h1>
              <p className="text-[10px] text-slate-400 font-medium">● Manager Portal</p>
            </div>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-190px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0c1322] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />}
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-xs font-bold text-slate-900 capitalize">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.store}</p>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 text-white rounded ${currentRoleConfig.badgeColor}`}>
              {currentRoleConfig.title}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-slate-900 capitalize">
              {(() => {
                for (const item of navItems) {
                  if (item.id === activeTab) return item.label;
                  if (item.subItems) {
                    const found = item.subItems.find(sub => sub.id === activeTab);
                    if (found) return `${item.label} / ${found.label}`;
                  }
                }
                return 'Dashboard';
              })()}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              ● {selectedStore}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search... (Press Enter)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white w-56 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 capitalize">{user.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentRoleConfig.title}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {activeTab.includes('dash') && <DashboardView />}
          {activeTab.includes('store') && !activeTab.includes('manager') && <StoresView onSelect={() => setActiveTab('admin_dash_footfall')} />}
          {activeTab.includes('task') && <TasksView />}
          {activeTab.includes('emp_add') && <AddEmployeeFormView onSave={() => {}} onCancel={() => {}} />}
          {activeTab.includes('emp_tasks') && <AssignTasksView />}
          {activeTab.includes('emp_perf') && <EmployeesPerformanceView employees={[]} />}
          {(activeTab.includes('emp_list') || activeTab.includes('employees') || activeTab.includes('manager_staff') || activeTab.includes('emp_profile')) && <EmployeesListView />}
          {activeTab.includes('cam') && <CamerasView />}
          {activeTab.includes('inv') && <InventoryView />}
          {activeTab.includes('queue') && <QueueView />}
          {(activeTab.includes('shopper') || activeTab.includes('analytics')) && <AnalyticsView />}
          {(activeTab.includes('ai') || activeTab.includes('insights')) && <AIInsightsView />}
          {(activeTab.includes('alert') || activeTab.includes('notification')) && <AlertsView />}
          {activeTab.includes('report') && <ReportsView />}
          {(activeTab.includes('int_') || activeTab.includes('integrations')) && <IntegrationsView />}
          {activeTab.includes('priv') && <PrivacyView />}
          {activeTab.includes('setting') && <SettingsView />}
          
          {/* Fallback if nothing matches just show Dashboard */}
          {![
            'dash', 'store', 'task', 'emp_list', 'employees', 'emp_add', 'emp_tasks', 'emp_perf', 'manager_staff', 'emp_profile', 'cam', 'inv', 'queue', 'shopper', 'analytics', 'ai', 'insights', 'alert', 'notification', 'report', 'int_', 'integrations', 'priv', 'setting'
          ].some(v => activeTab.includes(v)) && <DashboardView />}
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. DASHBOARD VIEW & HEATMAP COMPONENT
   ========================================================================== */
export function RealStoreHeatmapCard() {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [viewMode, setViewMode] = useState('density'); // 'density' | 'centroid'

  const zones = [
    { id: 'grocery', name: 'Grocery & Staples', count: 42, color: '#ef4444', intensity: '95%', dwell: '8.2 min', x: '18%', y: '28%', w: '26%', h: '32%' },
    { id: 'produce', name: 'Fresh Produce', count: 31, color: '#f97316', intensity: '82%', dwell: '7.3 min', x: '48%', y: '28%', w: '24%', h: '32%' },
    { id: 'beverages', name: 'Beverages & Chillers', count: 21, color: '#eab308', intensity: '60%', dwell: '4.8 min', x: '76%', y: '28%', w: '20%', h: '32%' },
    { id: 'promo', name: 'Promotional Endcap', count: 18, color: '#ef4444', intensity: '74%', dwell: '3.2 min', x: '18%', y: '65%', w: '26%', h: '24%' },
    { id: 'electronics', name: 'Electronics', count: 12, color: '#eab308', intensity: '42%', dwell: '5.1 min', x: '48%', y: '65%', w: '24%', h: '24%' },
    { id: 'cosmetics', name: 'Cosmetics & Care', count: 8, color: '#10b981', intensity: '26%', dwell: '9.1 min', x: '76%', y: '65%', w: '20%', h: '24%' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col">
      {/* ------------------------------------------------------------- */}
      {/* CARD HEADER & CONTROLS                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Live Spatial Store Heatmap</h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#0E7043] border border-[#B7EBD0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
              ● Real-Time Vision Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Overhead camera thermal projection & shopper trajectory tracking</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('density')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'density' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Thermal Density
            </button>
            <button
              onClick={() => setViewMode('centroid')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'centroid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Centroid Dots
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* REAL ARCHITECTURAL 2D BLUEPRINT WITH RADIAL THERMAL GLOWS     */}
      {/* ------------------------------------------------------------- */}
      <div className="relative mt-5 w-full flex-1 min-h-[420px] bg-[#0c121e] rounded-2xl overflow-hidden border border-slate-800 shadow-inner select-none">
        
        {/* Subtle Architectural Grid Background */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Store Perimeter Walls & Entrance/Exit Ingress Labels */}
        <div className="absolute top-2 left-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Ingress / Main Turnstile Entrance (14 In/min)
        </div>
        <div className="absolute bottom-2 right-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Emergency & Checkout Egress Lanes
        </div>

        {/* ------------------------------------------------------------- */}
        {/* THERMAL GRADIENT BLOBS (REAL HEATMAP ENGINE SIMULATION)        */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'density' && (
          <div className="absolute inset-0 pointer-events-none filter blur-2xl opacity-75">
            {/* Hotspot 1: Grocery (Peak Red Glow - 42 People) */}
            <div className="absolute top-[20%] left-[16%] w-60 h-44 rounded-full bg-rose-600 mix-blend-screen opacity-90 animate-pulse"></div>
            <div className="absolute top-[24%] left-[20%] w-36 h-28 rounded-full bg-yellow-400 mix-blend-screen opacity-95"></div>

            {/* Hotspot 2: Fresh Produce (High Orange Glow - 31 People) */}
            <div className="absolute top-[22%] left-[46%] w-52 h-36 rounded-full bg-orange-600 mix-blend-screen opacity-85"></div>
            <div className="absolute top-[25%] left-[50%] w-28 h-24 rounded-full bg-yellow-300 mix-blend-screen opacity-90"></div>

            {/* Hotspot 3: Beverages (Moderate Yellow Glow - 21 People) */}
            <div className="absolute top-[22%] left-[74%] w-44 h-36 rounded-full bg-amber-500 mix-blend-screen opacity-70"></div>

            {/* Hotspot 4: Promotional Endcap (High Red Glow - 18 People) */}
            <div className="absolute top-[58%] left-[18%] w-48 h-32 rounded-full bg-rose-500 mix-blend-screen opacity-80"></div>
            <div className="absolute top-[62%] left-[22%] w-28 h-20 rounded-full bg-yellow-400 mix-blend-screen opacity-85"></div>

            {/* Hotspot 5: Electronics (Warm Amber Glow - 12 People) */}
            <div className="absolute top-[60%] left-[48%] w-40 h-32 rounded-full bg-amber-600 mix-blend-screen opacity-65"></div>

            {/* Hotspot 6: Cosmetics (Low Green/Teal Glow - 8 People) */}
            <div className="absolute top-[62%] left-[75%] w-36 h-28 rounded-full bg-emerald-500 mix-blend-screen opacity-55"></div>

            {/* Hotspot 7: Checkout Counters Row (14 People) */}
            <div className="absolute bottom-[4%] left-[30%] w-80 h-16 rounded-full bg-orange-500 mix-blend-screen opacity-75"></div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE STORE SECTIONS & SHELF RACKS                      */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          
          {/* Top Row Zones: Grocery | Produce | Beverages */}
          <div className="grid grid-cols-3 gap-4 h-[44%]">
            {/* Zone 1: Grocery */}
            <div 
              onClick={() => setSelectedZone(zones[0])}
              className={`rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                selectedZone?.id === 'grocery' 
                  ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white tracking-wide">Grocery & Staples</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-1.5 py-0.5 rounded">
                  🔥 42 People
                </span>
              </div>
              {/* Shelf Layout Indicators */}
              <div className="space-y-1.5 opacity-60">
                <div className="h-1.5 bg-slate-600 rounded-full w-full"></div>
                <div className="h-1.5 bg-slate-600 rounded-full w-5/6"></div>
                <div className="h-1.5 bg-slate-600 rounded-full w-4/6"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dwell: 8.2m</span>
                <span className="text-rose-400 font-bold">70% Cap</span>
              </div>
            </div>

            {/* Zone 2: Fresh Produce */}
            <div 
              onClick={() => setSelectedZone(zones[1])}
              className={`rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                selectedZone?.id === 'produce' 
                  ? 'bg-orange-500/20 border-orange-400 shadow-lg shadow-orange-500/20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white tracking-wide">Fresh Produce</span>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-950/80 border border-orange-800 px-1.5 py-0.5 rounded">
                  🔥 31 People
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 opacity-60">
                <div className="h-4 bg-slate-600 rounded"></div>
                <div className="h-4 bg-slate-600 rounded"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dwell: 7.3m</span>
                <span className="text-orange-400 font-bold">78% Cap</span>
              </div>
            </div>

            {/* Zone 3: Beverages */}
            <div 
              onClick={() => setSelectedZone(zones[2])}
              className={`rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                selectedZone?.id === 'beverages' 
                  ? 'bg-yellow-500/20 border-yellow-400 shadow-lg shadow-yellow-500/20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white tracking-wide">Beverages & Chillers</span>
                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950/80 border border-yellow-800 px-1.5 py-0.5 rounded">
                  🟡 21 People
                </span>
              </div>
              <div className="space-y-1.5 opacity-60">
                <div className="h-1.5 bg-slate-600 rounded-full w-full"></div>
                <div className="h-1.5 bg-slate-600 rounded-full w-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dwell: 4.8m</span>
                <span className="text-yellow-400 font-bold">53% Cap</span>
              </div>
            </div>
          </div>

          {/* Bottom Row Zones: Promotional | Electronics | Cosmetics */}
          <div className="grid grid-cols-3 gap-4 h-[38%] mt-3">
            {/* Zone 4: Promotional Endcap */}
            <div 
              onClick={() => setSelectedZone(zones[3])}
              className={`rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                selectedZone?.id === 'promo' 
                  ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white tracking-wide">Promotional Endcaps</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-1.5 py-0.5 rounded">
                  🔥 18 People
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dwell: 3.2m</span>
                <span className="text-rose-400 font-bold">72% Cap</span>
              </div>
            </div>

            {/* Zone 5: Electronics */}
            <div 
              onClick={() => setSelectedZone(zones[4])}
              className={`rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                selectedZone?.id === 'electronics' 
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white tracking-wide">Electronics</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded">
                  🟢 12 People
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dwell: 5.1m</span>
                <span className="text-amber-400 font-bold">40% Cap</span>
              </div>
            </div>

            {/* Zone 6: Cosmetics */}
            <div 
              onClick={() => setSelectedZone(zones[5])}
              className={`rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                selectedZone?.id === 'cosmetics' 
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white tracking-wide">Cosmetics & Care</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded">
                  🟢 8 People
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dwell: 9.1m</span>
                <span className="text-emerald-400 font-bold">27% Cap</span>
              </div>
            </div>
          </div>

          {/* Checkout Counter Row Strip */}
          <div className="h-9 bg-slate-900/90 border border-slate-700/80 rounded-lg px-4 flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-mono tracking-wider">
              Cashier Row: Lanes 1 - 4
            </span>
            <div className="flex items-center gap-4 text-[11px] font-semibold font-mono">
              <span>Lane 1: 3 👤</span>
              <span className="text-rose-400 font-bold">Lane 2: 7 👤 (Bottleneck)</span>
              <span>Lane 3: 2 👤</span>
              <span className="text-amber-400">Lane 4: [Standby]</span>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THERMAL LEGEND & METRIC FOOTER                                */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Thermal Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span> Critical / High Congestion (&gt;30)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span> Heavy Traffic (20-30)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span> Moderate Traffic (10-20)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> Low Transit (&lt;10)</span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Sensor Resolution: <strong>4K Overhead Optical Centroid Grid</strong>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [currentTime, setCurrentTime] = useState('');
  const [action1, setAction1] = useState(false);
  const [action2, setAction2] = useState(false);
  const [action3, setAction3] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const weekday = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' });
      const day = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: '2-digit' });
      const month = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short' });
      const year = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric' });
      
      const timePart = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).toLowerCase();

      setCurrentTime(`${weekday}, ${day} ${month}, ${year} · ${timePart}`);
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const heatmapData = [
    { zone: 'Grocery', count: 42, percentage: 70, color: 'bg-[#ff5555]', icon: '🔥' },
    { zone: 'Beverages', count: 21, percentage: 53, color: 'bg-[#f59e0b]', icon: '🟡' },
    { zone: 'Fresh Produce', count: 31, percentage: 78, color: 'bg-[#ff5555]', icon: '🔥' },
    { zone: 'Cosmetics', count: 8, percentage: 27, color: 'bg-[#10b981]', icon: '🟢' },
    { zone: 'Promotional', count: 18, percentage: 72, color: 'bg-[#ff5555]', icon: '🔥' },
    { zone: 'Electronics', count: 12, percentage: 40, color: 'bg-[#f59e0b]', icon: '🟢' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Telemetry Pills */}
      <div className="flex justify-between items-center text-xs">
        <p className="text-slate-500 font-mono">{currentTime || 'Thu, 27 Aug, 2026 · 09:25:36 am'}</p>
        <div className="flex gap-3">
          <span className="bg-[#E8F8F0] border border-[#B7EBD0] text-[#0E7043] px-3.5 py-1 rounded-full font-semibold">
            ● EDGE ONLINE · 4/4 Cameras
          </span>
          <span className="bg-[#EEF4FF] border border-[#C7D9FE] text-[#1E40AF] px-3.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Privacy: ACTIVE
          </span>
        </div>
      </div>

      {/* 6 Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#EEF4FF] border border-[#D0E0FF] rounded-2xl p-4 shadow-sm">
          <Users className="w-4 h-4 text-[#2563EB] mb-2" />
          <p className="text-2xl font-black text-slate-900">1,257</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Today's Footfall</p>
          <p className="text-[11px] text-slate-500 mt-1">+12.4% vs yesterday</p>
        </div>
        <div className="bg-[#EAFBF3] border border-[#C6F3DE] rounded-2xl p-4 shadow-sm">
          <User className="w-4 h-4 text-[#059669] mb-2" />
          <p className="text-2xl font-black text-slate-900">62 / 100</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Current Occupancy</p>
          <p className="text-[11px] text-slate-500 mt-1">62% capacity</p>
        </div>
        <div className="bg-[#FEF9E7] border border-[#FDE68A] rounded-2xl p-4 shadow-sm">
          <ShoppingCart className="w-4 h-4 text-[#D97706] mb-2" />
          <p className="text-2xl font-black text-slate-900">14</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Active Queue</p>
          <p className="text-[11px] text-slate-500 mt-1">Across 4 counters</p>
        </div>
        <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 shadow-sm">
          <Package className="w-4 h-4 text-[#7C3AED] mb-2" />
          <p className="text-2xl font-black text-slate-900">94%</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Stock Availability</p>
          <p className="text-[11px] text-slate-500 mt-1">13 low / 3 out-of-stock</p>
        </div>
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm">
          <Clock className="w-4 h-4 text-[#E11D48] mb-2" />
          <p className="text-2xl font-black text-slate-900">7.4 min</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Avg Dwell Time</p>
          <p className="text-[11px] text-slate-500 mt-1">+0.8 min vs yesterday</p>
        </div>
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm">
          <Bell className="w-4 h-4 text-[#E11D48] mb-2" />
          <p className="text-2xl font-black text-slate-900">7</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Active Alerts</p>
          <p className="text-[11px] text-slate-500 mt-1">2 critical · 5 warnings</p>
        </div>
      </div>

      {/* Middle Row: Heatmap & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RealStoreHeatmapCard />

        {/* AI Recommendations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">AI Recommendations</h2>
            <p className="text-xs text-slate-400 mb-4">Predict · Decide · Act</p>
            <div className="space-y-3">
              <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-3.5">
                <p className="text-xs font-bold text-slate-900">Open Counter 4</p>
                <p className="text-xs text-slate-600 my-2">Queue predicted to reach 15 in 8 minutes. Current: 13 customers.</p>
                <button onClick={() => setAction1(true)} disabled={action1} className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg ${action1 ? 'bg-emerald-600' : 'bg-[#EF4444]'}`}>{action1 ? 'Action Started' : 'Take Action'}</button>
              </div>
              <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-3.5">
                <p className="text-xs font-bold text-slate-900">Restock Milk — Shelf A12</p>
                <p className="text-xs text-slate-600 my-2">Current stock: 3/20. Below minimum threshold.</p>
                <button onClick={() => setAction2(true)} disabled={action2} className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg ${action2 ? 'bg-emerald-600' : 'bg-[#EA580C]'}`}>{action2 ? 'Task Assigned' : 'Take Action'}</button>
              </div>
              <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-xl p-3.5">
                <p className="text-xs font-bold text-slate-900">Move 1 Staff: Electronics → Billing</p>
                <p className="text-xs text-slate-600 my-2">Electronics demand low (12 people). Billing under pressure.</p>
                <button onClick={() => setAction3(true)} disabled={action3} className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg ${action3 ? 'bg-emerald-600' : 'bg-slate-800'}`}>{action3 ? 'Staff Notified' : 'Take Action'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Status Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Edge Device & Privacy Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <p className="font-bold text-slate-400 mb-2">EDGE DEVICE</p>
            <p className="text-slate-700">NVIDIA Jetson Orin: <strong className="text-emerald-600">Active</strong></p>
            <p className="text-slate-700 mt-1">AI Inference: <strong className="text-emerald-600">Running</strong></p>
          </div>
          <div>
            <p className="font-bold text-slate-400 mb-2">PRIVACY CONTROLS</p>
            <p className="text-slate-700">Face Recognition: <strong className="text-rose-600">OFF</strong></p>
            <p className="text-slate-700 mt-1">Personal Identity: <strong className="text-rose-600 font-bold">NOT STORED</strong></p>
          </div>
          <div>
            <p className="font-bold text-slate-400 mb-2">CAMERA HEALTH</p>
            <p className="text-slate-700">4/4 Cameras: <strong className="text-emerald-600">Online (30 FPS)</strong></p>
          </div>
          <div>
            <p className="font-bold text-slate-400 mb-2">AI MODELS ACTIVE</p>
            <p className="text-slate-700">YOLO v8 / ByteTrack: <strong className="text-emerald-600">Running</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. STORES VIEW
   ========================================================================== */
function StoresView({ onSelect }: { onSelect: () => void }) {
  const stores = [
    { id: 'Chennai-01', region: 'TN-South', footfall: '2,184', occ: '74/110', stock: '96.4%', wait: '3.8m', staff: 18, cams: '4/4', status: 'Optimal' },
    { id: 'Chennai-02', region: 'TN-South', footfall: '1,420', occ: '45/90', stock: '95.0%', wait: '3.2m', staff: 14, cams: '4/4', status: 'Optimal' },
    { id: 'Bengaluru-01', region: 'KA-Central', footfall: '2,110', occ: '88/120', stock: '91.2%', wait: '5.1m', staff: 20, cams: '4/4', status: 'High Wait' },
    { id: 'Mumbai-01', region: 'MH-West', footfall: '2,450', occ: '92/150', stock: '95.5%', wait: '4.4m', staff: 22, cams: '4/4', status: 'Optimal' },
    { id: 'Delhi-01', region: 'DL-North', footfall: '1,980', occ: '96/120', stock: '88.5%', wait: '5.8m', staff: 14, cams: '3/4', status: 'Critical' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900">Physical Store Network (8 Locations)</h2>
          <p className="text-xs text-slate-500">Live operational sync across branches</p>
        </div>
        <button onClick={onSelect} className="px-3 py-1.5 bg-[#0c1322] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
          View Chennai-01 Dashboard
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Store ID</th>
              <th className="p-4">Region</th>
              <th className="p-4">Footfall</th>
              <th className="p-4">Occupancy</th>
              <th className="p-4">On-Shelf Stock</th>
              <th className="p-4">Wait Time</th>
              <th className="p-4">Cameras</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {stores.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{s.id}</td>
                <td className="p-4 text-slate-500">{s.region}</td>
                <td className="p-4 font-semibold text-slate-900">{s.footfall}</td>
                <td className="p-4">{s.occ}</td>
                <td className="p-4 font-bold text-slate-900">{s.stock}</td>
                <td className="p-4">{s.wait}</td>
                <td className="p-4">{s.cams}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800">
                    {s.status}
                  </span>
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
   3. EMPLOYEES VIEW
   ========================================================================== */
function EmployeesListView() {
  // Master Employee State with Attendance & Role History
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-101',
      name: 'Arun Sharma',
      age: '28',
      phone: '+91 98401 23456',
      certificate: 'Aadhaar_PoliceClearance.pdf',
      role: 'Floor Lead',
      shift: '08:00 AM - 04:00 PM',
      zone: 'Grocery & Staples',
      activeTask: 'Restocking Bay 02',
      status: 'On Shift',
      joinDate: '12 Jan 2025',
      experience: '3.5 yrs retail ops',
      skills: ['Inventory Audit', 'Staff Allocation', 'Planogram QA'],
      attendanceStats: { present: 22, late: 2, leave: 1, totalWorkDays: 25 },
      // 1-27 Aug 2026 daily log: 'P'=Present, 'L'=Late, 'A'=Leave/Absent, 'O'=Off/Holiday
      attendanceLog: {
        1: 'P', 2: 'P', 3: 'O', 4: 'P', 5: 'P', 6: 'P', 7: 'L', 8: 'P', 9: 'O', 10: 'P',
        11: 'P', 12: 'P', 13: 'P', 14: 'A', 15: 'O', 16: 'P', 17: 'P', 18: 'P', 19: 'L', 20: 'P',
        21: 'P', 22: 'O', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P'
      }
    },
    {
      id: 'EMP-102',
      name: 'Priya Sundaram',
      age: '24',
      phone: '+91 98402 34567',
      certificate: 'Govt_ID_Proof.pdf',
      role: 'POS Cashier',
      shift: '09:00 AM - 05:00 PM',
      zone: 'Counter 02',
      activeTask: 'Express Checkout',
      status: 'On Shift',
      joinDate: '04 Mar 2025',
      experience: '1.5 yrs billing POS',
      skills: ['Fast Billing', 'Cash Reconciliation', 'Customer Care'],
      attendanceStats: { present: 24, late: 1, leave: 0, totalWorkDays: 25 },
      attendanceLog: {
        1: 'P', 2: 'P', 3: 'O', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'O', 10: 'P',
        11: 'P', 12: 'L', 13: 'P', 14: 'P', 15: 'O', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P',
        21: 'P', 22: 'O', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P'
      }
    },
    {
      id: 'EMP-103',
      name: 'Rahul Kumar',
      age: '26',
      phone: '+91 98403 45678',
      certificate: 'Verification_Cert.pdf',
      role: 'Replenishment',
      shift: '07:30 AM - 03:30 PM',
      zone: 'Promotional Endcap A',
      activeTask: 'Planogram Realignment',
      status: 'On Shift',
      joinDate: '18 Nov 2024',
      experience: '2 yrs logistics & stocking',
      skills: ['Heavy Restocking', 'Forklift / Pallet', 'Barcode Scanner'],
      attendanceStats: { present: 20, late: 3, leave: 2, totalWorkDays: 25 },
      attendanceLog: {
        1: 'P', 2: 'L', 3: 'O', 4: 'P', 5: 'P', 6: 'A', 7: 'P', 8: 'P', 9: 'O', 10: 'P',
        11: 'L', 12: 'P', 13: 'P', 14: 'P', 15: 'O', 16: 'P', 17: 'A', 18: 'P', 19: 'P', 20: 'L',
        21: 'P', 22: 'O', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P'
      }
    },
    {
      id: 'EMP-104',
      name: 'Meena Ali',
      age: '25',
      phone: '+91 98404 56789',
      certificate: 'Police_Clearance.pdf',
      role: 'POS Cashier',
      shift: '09:00 AM - 05:00 PM',
      zone: 'Counter 01',
      activeTask: 'Billing Flow',
      status: 'On Shift',
      joinDate: '10 Feb 2025',
      experience: '2 yrs retail cashiering',
      skills: ['UPI/POS Terminals', 'Loyalty Program Ops'],
      attendanceStats: { present: 23, late: 1, leave: 1, totalWorkDays: 25 },
      attendanceLog: {
        1: 'P', 2: 'P', 3: 'O', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'O', 10: 'P',
        11: 'P', 12: 'P', 13: 'A', 14: 'P', 15: 'O', 16: 'P', 17: 'P', 18: 'P', 19: 'L', 20: 'P',
        21: 'P', 22: 'O', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P'
      }
    }
  ]);

  // Modals & Active Selections
  const [selectedEmp, setSelectedEmp] = useState<any>(null); // When clicking an employee row
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [newSelectedRole, setNewSelectedRole] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    phone: '',
    certificate: null as any,
    role: 'Floor Lead',
    shift: '08:00 AM - 04:00 PM',
    zone: 'Grocery & Staples',
    activeTask: 'General Floor Monitoring',
    status: 'On Shift'
  });

  const availableRolesList = [
    { role: 'Floor Lead', desc: 'Aisle queue monitoring, customer guidance, and restock prioritization' },
    { role: 'POS Cashier', desc: 'Operating billing counters, managing lane throughput, payment scanning' },
    { role: 'Replenishment Specialist', desc: 'Shelf stock replenishment, backroom inventory transfers, void fixes' },
    { role: 'Planogram Auditor', desc: 'Visual alignment check, facing correction, compliance reporting' },
    { role: 'Store Assistant Manager', desc: 'Comprehensive floor delegation, supervisor overrides, staff rosters' }
  ];

  // Open Details Modal
  const handleSelectEmployee = (emp: any) => {
    setSelectedEmp(emp);
    setNewSelectedRole(emp.role);
  };

  // Update Role from Profile
  const handleRoleChange = () => {
    if (!newSelectedRole || newSelectedRole === selectedEmp.role) return;
    const updated = employees.map(e => {
      if (e.id === selectedEmp.id) {
        return { ...e, role: newSelectedRole };
      }
      return e;
    });
    setEmployees(updated);
    setSelectedEmp({ ...selectedEmp, role: newSelectedRole });
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      id: '',
      name: '',
      age: '',
      phone: '',
      certificate: null,
      role: 'Floor Lead',
      shift: '08:00 AM - 04:00 PM',
      zone: 'Grocery & Staples',
      activeTask: 'General Floor Monitoring',
      status: 'On Shift'
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (e: any, emp: any) => {
    e.stopPropagation(); // prevent row click
    setModalMode('edit');
    setFormData(emp);
    setIsFormModalOpen(true);
  };

  // Handle Remove Employee
  const handleDeleteEmployee = (e: any, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this employee record?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      if (selectedEmp?.id === id) setSelectedEmp(null);
    }
  };

  // Submit Add / Edit Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newEmp = {
        ...formData,
        id: `EMP-${100 + employees.length + 1}`,
        certificate: formData.certificate ? (typeof formData.certificate === 'string' ? formData.certificate : formData.certificate.name) : 'ID_Verified.pdf',
        joinDate: '27 Aug 2026',
        experience: 'New Associate',
        skills: ['General Ops'],
        attendanceStats: { present: 1, late: 0, leave: 0, totalWorkDays: 1 },
        attendanceLog: {
          1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P',
          11: 'P', 12: 'P', 13: 'P', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P',
          21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P'
        }
      };
      setEmployees([...employees, newEmp]);
    } else {
      setEmployees(employees.map(emp => emp.id === formData.id ? { ...emp, ...formData } : emp));
      if (selectedEmp?.id === formData.id) setSelectedEmp({ ...selectedEmp, ...formData });
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP METRICS CARDS                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">TOTAL STAFF CLOCKED</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{employees.length} / 22</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">ACTIVE AI TASKS</p>
          <p className="text-3xl font-black text-slate-900 mt-2">5 Dispatched</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">AVG RESOLUTION SPEED</p>
          <p className="text-3xl font-black text-slate-900 mt-2">4.8 min</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">STAFF RATIO</p>
          <p className="text-3xl font-black text-slate-900 mt-2">1 : 4.1</p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. EMPLOYEE TABLE (Click any row to open Profile)             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Floor Associates & Cashiers</h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any employee row to view full profile, attendance calendar & role controls</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#0c1322] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            + Add Employee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">NAME & ID</th>
                <th className="p-4">CURRENT ROLE</th>
                <th className="p-4">ASSIGNED ZONE</th>
                <th className="p-4">SHIFT</th>
                <th className="p-4">ACTIVE TASK</th>
                <th className="p-4">AUG ATTENDANCE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {employees.map((emp) => (
                <tr 
                  key={emp.id} 
                  onClick={() => handleSelectEmployee(emp)}
                  className="hover:bg-slate-50/90 cursor-pointer transition-colors group"
                >
                  <td className="p-4">
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      {emp.name}
                      <span className="text-[10px] text-slate-400 font-mono">({emp.id})</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Age: {emp.age} • {emp.phone}
                    </p>
                  </td>
                  <td className="p-4 font-semibold text-slate-900">{emp.role}</td>
                  <td className="p-4 text-slate-700">{emp.zone}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{emp.shift}</td>
                  <td className="p-4 font-medium text-slate-800">{emp.activeTask}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold text-[11px]">✔ {emp.attendanceStats?.present || 22}P</span>
                      <span className="text-amber-600 font-bold text-[11px]">⚠️ {emp.attendanceStats?.late || 1}L</span>
                      <span className="text-rose-600 font-bold text-[11px]">❌ {emp.attendanceStats?.leave || 0}A</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0c1322] text-white">
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleOpenEditModal(e, emp)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteEmployee(e, emp.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. DETAILED PROFILE, ATTENDANCE CALENDAR & ROLE SWITCH MODAL  */}
      {/* ------------------------------------------------------------- */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0c1322] text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedEmp.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedEmp.name}</h2>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-mono font-bold">
                      {selectedEmp.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#0c1322] text-white text-[10px] font-bold">
                      {selectedEmp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Joined {selectedEmp.joinDate} • Experience: {selectedEmp.experience} • Age: {selectedEmp.age}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmp(null)}
                className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
              
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact & Proof</p>
                  <p className="font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedEmp.phone}
                  </p>
                  <p className="text-slate-600 mt-1 flex items-center gap-1.5 font-mono text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> {selectedEmp.certificate}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shift & Zone</p>
                  <p className="font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {selectedEmp.shift}
                  </p>
                  <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {selectedEmp.zone}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Skills</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedEmp.skills?.map((s: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* DYNAMIC ATTENDANCE CALENDAR                                   */}
              {/* ------------------------------------------------------------- */}
              <AttendanceCalendar attendanceData={selectedEmp.attendanceLog || {}} />
              
              {/* ROLE MANAGEMENT: CURRENT ROLE VS AVAILABLE ROLES             */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Role Progression & Re-Assignment</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  
                  {/* Current Active Role Box */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT DESIGNATION</p>
                    <p className="text-lg font-black mt-1">{selectedEmp.role}</p>
                    <p className="text-xs text-slate-300 mt-1">Floor Zone: {selectedEmp.zone}</p>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[10px] text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5" /> Eligible for Assistant Manager Promotion
                    </div>
                  </div>

                  {/* Switch to Available Roles */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Select Available Store Role:
                    </label>
                    <select
                      value={newSelectedRole}
                      onChange={(e) => setNewSelectedRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      {availableRolesList.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.role} {r.role === selectedEmp.role ? '(Current)' : ''}
                        </option>
                      ))}
                    </select>

                    <p className="text-[11px] text-slate-500 italic">
                      {availableRolesList.find(r => r.role === newSelectedRole)?.desc}
                    </p>

                    <button
                      onClick={handleRoleChange}
                      disabled={newSelectedRole === selectedEmp.role}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                        newSelectedRole !== selectedEmp.role
                          ? 'bg-[#0c1322] hover:bg-slate-800 text-white cursor-pointer'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {newSelectedRole === selectedEmp.role ? 'Current Role Active' : `Confirm Role Change to "${newSelectedRole}"`}
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEmp(null)}
                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 transition-all shadow-sm"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. ADD / EDIT EMPLOYEE MODAL (Standard Form)                  */}
      {/* ------------------------------------------------------------- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base">
                {modalMode === 'add' ? 'Add New Employee' : `Update Employee: ${formData.name}`}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Employee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Proof / ID *</label>
                  <label className="flex items-center justify-between border border-dashed border-slate-300 bg-slate-50 rounded-lg px-3 py-1.5 cursor-pointer">
                    <span className="text-slate-600 truncate max-w-[140px] text-[11px]">
                      {formData.certificate ? (typeof formData.certificate === 'string' ? formData.certificate : formData.certificate.name) : 'Upload File'}
                    </span>
                    <UploadCloud className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, certificate: e.target.files ? e.target.files[0] : null })}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  >
                    <option value="Floor Lead">Floor Lead</option>
                    <option value="POS Cashier">POS Cashier</option>
                    <option value="Replenishment">Replenishment</option>
                    <option value="Planogram Auditor">Planogram Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Shift *</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  >
                    <option value="08:00 AM - 04:00 PM">08:00 AM - 04:00 PM</option>
                    <option value="09:00 AM - 05:00 PM">09:00 AM - 05:00 PM</option>
                    <option value="02:00 PM - 10:00 PM">02:00 PM - 10:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c1322] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. CAMERAS VIEW
   ========================================================================== */
export function CamerasView() {
  const [selectedCam, setSelectedCam] = useState('all'); // 'all' | 'CAM-01' | 'CAM-02' | 'CAM-03' | 'CAM-04'
  const [showAIOverlay, setShowAIOverlay] = useState(true);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-800">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP CONTROLS & STREAM TELEMETRY BAR                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Edge Optical Vision Cluster</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#0E7043] border border-[#B7EBD0]">
              ● 4/4 RTSP Streams Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">NVIDIA Jetson AGX Orin On-Device Inference • 30.0 FPS Sync</p>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Bounding Box Layer Toggle */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>AI Bounding Box Overlay</span>
            <button
              onClick={() => setShowAIOverlay(!showAIOverlay)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ml-1 ${
                showAIOverlay ? 'bg-[#0c1322]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${
                showAIOverlay ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Camera Filter Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['all', 'CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'].map((cam) => (
              <button
                key={cam}
                onClick={() => setSelectedCam(cam)}
                className={`px-3 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                  selectedCam === cam ? 'bg-[#0c1322] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cam === 'all' ? 'All 4 Cameras' : cam}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4 LIVE CAMERA FEEDS GRID                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ============================================================= */}
        {/* CAMERA 1: ENTRANCE CAMERA                                     */}
        {/* People Count | Height | Crowd Density | Face Re-ID | Reports  */}
        {/* ============================================================= */}
        {(selectedCam === 'all' || selectedCam === 'CAM-01') && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              {/* Live Video Feed Simulation */}
              <div className="h-64 bg-[#0a0f1d] relative overflow-hidden select-none border-b border-slate-200 flex items-center justify-center">
                {/* Header Pills inside video */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur">
                    CAM-01 · ENTRANCE OVERHEAD
                  </span>
                  <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> 30.0 FPS
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-black/75 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  CROWD DENSITY: 68% (NORMAL)
                </div>

                {/* AI Overlays: People detection, height estimation & face re-id */}
                {showAIOverlay && (
                  <>
                    {/* Person 1 */}
                    <div className="absolute left-[20%] top-[18%] w-24 h-44 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                      <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[9px] font-bold font-mono px-1 py-0.5 whitespace-nowrap rounded-t">
                        ID:#8402 · H: 174cm · FACE_MATCH: 98%
                      </div>
                      <div className="absolute top-2 left-6 w-10 h-10 border border-emerald-300 rounded-full bg-emerald-300/20" />
                    </div>

                    {/* Person 2 */}
                    <div className="absolute left-[52%] top-[22%] w-24 h-40 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                      <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[9px] font-bold font-mono px-1 py-0.5 whitespace-nowrap rounded-t">
                        ID:#8403 · H: 162cm · FACE_MATCH: 94%
                      </div>
                      <div className="absolute top-2 left-6 w-10 h-10 border border-emerald-300 rounded-full bg-emerald-300/20" />
                    </div>
                  </>
                )}

                <div className="absolute bottom-3 left-3 bg-black/75 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  MODEL: YOLOv8-Pose + InsightFace Re-ID
                </div>
                <div className="absolute bottom-3 right-3 bg-[#0c1322] text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  14 entering / min
                </div>
              </div>

              {/* Camera Analytics & Telemetry Breakdown */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Store Entrance & Turnstile Ingress</h3>
                    <p className="text-[11px] text-slate-500">Shopper Footfall Counter, Height Analytics & Face Recognition Engine</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ● Online (Uptime: 99.98%)
                  </span>
                </div>

                {/* 4 Sub-metric Tiles */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Today Footfall</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">1,257</p>
                    <p className="text-[9px] text-emerald-600 font-bold">+12.4% vs yday</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Height</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">168.4 cm</p>
                    <p className="text-[9px] text-slate-500">Adult / Child Class</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Flow Velocity</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">14 In / 4 Out</p>
                    <p className="text-[9px] text-slate-500">Net: +10 / min</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Face Vector Match</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">96.8%</p>
                    <p className="text-[9px] text-slate-500">VIP / Returnee ID</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <span>Alerts: <strong>0 Entrance Bottlenecks</strong></span>
              <span className="font-mono">Usage Trend: Peak expected at 06:00 PM</span>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* CAMERA 2: SHELF & PLANOGRAM MONITORING CAMERA                 */}
        {/* Stock Count | Low/OOS | Misplaced SKU | Empty Slot Detection  */}
        {/* ============================================================= */}
        {(selectedCam === 'all' || selectedCam === 'CAM-02') && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              {/* Video Feed */}
              <div className="h-64 bg-[#0a0f1d] relative overflow-hidden select-none border-b border-slate-200 flex items-center justify-center">
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur">
                    CAM-02 · SHELF BAY A12-A15
                  </span>
                  <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> 29.8 FPS
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  ⚠️ RESTOCK ALERT TRIGGERED
                </div>

                {/* AI Overlays: Shelf bounding boxes & stock levels */}
                {showAIOverlay && (
                  <>
                    {/* Shelf 1: Low Stock Box */}
                    <div className="absolute left-[10%] top-[30%] w-36 h-28 border-2 border-amber-400 bg-amber-400/15 rounded-sm">
                      <div className="absolute -top-6 left-0 bg-amber-400 text-black text-[9px] font-bold font-mono px-1 py-0.5 whitespace-nowrap rounded-t">
                        MILK 1L (SKU #P001) · 3/20 LOW STOCK
                      </div>
                    </div>

                    {/* Shelf 2: Out of stock void box */}
                    <div className="absolute left-[44%] top-[30%] w-32 h-28 border-2 border-rose-500 bg-rose-500/20 rounded-sm">
                      <div className="absolute -top-6 left-0 bg-rose-500 text-white text-[9px] font-bold font-mono px-1 py-0.5 whitespace-nowrap rounded-t">
                        EMPTY SLOT · BREAD (0/15 OUT)
                      </div>
                    </div>

                    {/* Shelf 3: Misplaced Product Box */}
                    <div className="absolute right-[8%] top-[30%] w-32 h-28 border-2 border-purple-500 bg-purple-500/15 rounded-sm">
                      <div className="absolute -top-6 left-0 bg-purple-500 text-white text-[9px] font-bold font-mono px-1 py-0.5 whitespace-nowrap rounded-t">
                        MISPLACED · COLA IN JUICE BAY
                      </div>
                    </div>
                  </>
                )}

                <div className="absolute bottom-3 left-3 bg-black/75 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  MODEL: ResNet Planogram Engine + VoidNet
                </div>
                <div className="absolute bottom-3 right-3 bg-amber-500 text-black text-[10px] font-bold px-2.5 py-1 rounded">
                  15% Fill Rate
                </div>
              </div>

              {/* Shelf Camera Analytics */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Grocery & Dairy Shelf Monitoring</h3>
                    <p className="text-[11px] text-slate-500">Live Object Detection, Stock Count & Planogram Misplacement QA</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    ● 2 Shelf Actions Needed
                  </span>
                </div>

                {/* 4 Sub-metric Tiles */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Available Units</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">31 / 65</p>
                    <p className="text-[9px] text-amber-600 font-bold">47% Bay Fill</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Empty Slots</p>
                    <p className="text-base font-black text-rose-600 mt-0.5">1 Slot Void</p>
                    <p className="text-[9px] text-slate-500">Shelf A15 (Bread)</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Misplaced SKUs</p>
                    <p className="text-base font-black text-purple-600 mt-0.5">1 Detected</p>
                    <p className="text-[9px] text-slate-500">Cola on Shelf B04</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Restock Urgency</p>
                    <p className="text-base font-black text-rose-600 mt-0.5">HIGH</p>
                    <p className="text-[9px] text-slate-500">&lt; 15 mins to runout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <span>Restock Ticket: <strong>Dispatched to Arun Sharma (Bay 02)</strong></span>
              <span className="font-mono">Planogram Compliance: 89.2%</span>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* CAMERA 3: BILLING COUNTER & QUEUE PREDICTION CAMERA           */}
        {/* Queue Length | Drop-off | Wait Time | Cashier Speed | Basket  */}
        {/* ============================================================= */}
        {(selectedCam === 'all' || selectedCam === 'CAM-03') && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              {/* Video Feed */}
              <div className="h-64 bg-[#0a0f1d] relative overflow-hidden select-none border-b border-slate-200 flex items-center justify-center">
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur">
                    CAM-03 · BILLING & CHECKOUT LANES
                  </span>
                  <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> 30.0 FPS
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow animate-pulse">
                  🚨 CONGESTION PREDICTED (+6 in 8m)
                </div>

                {/* AI Overlays: Queue Centroids, Cart Bounding Boxes & Line Tracking */}
                {showAIOverlay && (
                  <>
                    <div className="absolute left-[12%] top-[25%] w-64 h-32 border-2 border-rose-500 bg-rose-500/10 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-rose-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 whitespace-nowrap rounded-t">
                        LANE 2 QUEUE · 7 SHOPPERS · AVG BASKET: 14 ITEMS
                      </div>
                      <div className="flex gap-2 p-2 pt-4">
                        <div className="w-7 h-16 border border-rose-400 bg-rose-400/20 rounded text-[9px] text-center text-rose-300">Q1</div>
                        <div className="w-7 h-16 border border-rose-400 bg-rose-400/20 rounded text-[9px] text-center text-rose-300">Q2</div>
                        <div className="w-7 h-16 border border-rose-400 bg-rose-400/20 rounded text-[9px] text-center text-rose-300">Q3</div>
                        <div className="w-7 h-16 border border-rose-400 bg-rose-400/20 rounded text-[9px] text-center text-rose-300">Q4</div>
                        <div className="w-7 h-16 border border-rose-400 bg-rose-400/20 rounded text-[9px] text-center text-rose-300">Q5</div>
                      </div>
                    </div>

                    <div className="absolute right-[8%] top-[25%] w-36 h-32 border-2 border-emerald-400 bg-emerald-500/10 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[9px] font-bold font-mono px-1.5 py-0.5 whitespace-nowrap rounded-t">
                        LANE 1 · 2 SHOPPERS (OK)
                      </div>
                    </div>
                  </>
                )}

                <div className="absolute bottom-3 left-3 bg-black/75 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  MODEL: ByteTrack Queue + CartVolumeNet
                </div>
                <div className="absolute bottom-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  Wait: 5.1 min
                </div>
              </div>

              {/* Queue Analytics */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">POS Billing Counters & Queue Intelligence</h3>
                    <p className="text-[11px] text-slate-500">Wait/Service Time Modeling, Cart Item Estimation & Drop-off Prevention</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    ⚡ Open Counter 4 Advised
                  </span>
                </div>

                {/* 4 Sub-metric Tiles */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Active In Line</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">14 Shoppers</p>
                    <p className="text-[9px] text-slate-500">Across 3 POS</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Wait Time</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">2.9 min</p>
                    <p className="text-[9px] text-rose-600 font-bold">Lane 2: 5.1 min ⚠️</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cashier Service</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">48s / cust</p>
                    <p className="text-[9px] text-emerald-600 font-bold">Optimal Speed</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Drop-Off Risk</p>
                    <p className="text-base font-black text-amber-600 mt-0.5">2.4%</p>
                    <p className="text-[9px] text-slate-500">Walkout Threshold</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <span>Automated Action: <strong>Notify Backup Cashier (Meena Ali)</strong></span>
              <span className="font-mono">Lane Capacity: 72% Utilized</span>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* CAMERA 4: CUSTOMER REACTION & ENGAGEMENT CAMERA               */}
        {/* Reaction Analysis | Dwell Gaze | Product Interaction | Sentiment */}
        {/* ============================================================= */}
        {(selectedCam === 'all' || selectedCam === 'CAM-04') && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              {/* Video Feed */}
              <div className="h-64 bg-[#0a0f1d] relative overflow-hidden select-none border-b border-slate-200 flex items-center justify-center">
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur">
                    CAM-04 · PROMO DISPLAY & AISLE REACTION
                  </span>
                  <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> 30.0 FPS
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  PROMO ENGAGEMENT: 74%
                </div>

                {/* AI Overlays: Gaze Vector, Sentiment Bounding Box & Interaction */}
                {showAIOverlay && (
                  <>
                    {/* Customer 1: High Interest Reaction */}
                    <div className="absolute left-[24%] top-[20%] w-28 h-40 border-2 border-indigo-400 bg-indigo-400/10 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-indigo-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 whitespace-nowrap rounded-t">
                        😊 INTERESTED · GAZE: ENDCAP A (18s)
                      </div>
                      <div className="absolute top-4 right-2 text-xs">✨</div>
                    </div>

                    {/* Customer 2: Confused Reaction */}
                    <div className="absolute right-[28%] top-[24%] w-28 h-40 border-2 border-amber-400 bg-amber-400/10 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-amber-500 text-black text-[9px] font-bold font-mono px-1.5 py-0.5 whitespace-nowrap rounded-t">
                        🤔 CONFUSED / PRICE LOOKUP (42s)
                      </div>
                      <div className="absolute top-4 right-2 text-xs">❓</div>
                    </div>
                  </>
                )}

                <div className="absolute bottom-3 left-3 bg-black/75 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  MODEL: RetailGaze-3D + EmotionNet (Local Edge Only)
                </div>
                <div className="absolute bottom-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  Avg Dwell: 4m 50s
                </div>
              </div>

              {/* Engagement Analytics */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Shopper Behavioral & Product Reaction AI</h3>
                    <p className="text-[11px] text-slate-500">Gaze Tracking, Interaction Dwell & Product Interest Sentiment</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    ● High Product Affinity
                  </span>
                </div>

                {/* 4 Sub-metric Tiles */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Positive Sentiment</p>
                    <p className="text-base font-black text-emerald-600 mt-0.5">68%</p>
                    <p className="text-[9px] text-slate-500">Interested / Buying</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Hesitation / Confusion</p>
                    <p className="text-base font-black text-amber-600 mt-0.5">18%</p>
                    <p className="text-[9px] text-slate-500">Price tag friction</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Product Touch Rate</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">42 / hr</p>
                    <p className="text-[9px] text-slate-500">Cart pick conversions</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pass-Through Velocity</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">14%</p>
                    <p className="text-[9px] text-slate-500">Non-engaging flow</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <span>Merchandising Insight: <strong>Endcap A (Coffee Promo) generates 2.4x standard bay dwell</strong></span>
              <span className="font-mono">Privacy: Zero facial media stored</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
   5. INVENTORY & TASKS VIEW
   ========================================================================== */
// -------------------------------------------------------------
// 500 STRUCTURED PRODUCTS DATASET (SEQUENTIAL SKU & AISLES A -> H)
// -------------------------------------------------------------
const generate500OrderedProducts = () => {
  const categoriesConfig = [
    {
      id: 'vegetables',
      name: 'Vegetables',
      bayPrefix: 'A', // Aisle A (Shelves A01 - A15)
      items: [
        'Fresh Red Onions 1kg', 'Potato Farm Fresh 1kg', 'Hybrid Tomatoes 1kg', 'Green Capsicum 500g', 
        'Carrot Ooty Fresh 500g', 'Cauliflower Medium 1pc', 'Cabbage Green 1pc', 'Fresh Ginger 250g', 
        'Garlic Pearls 250g', 'Green Chillies 100g', 'Fresh Coriander Bunch', 'Mint Leaves Bunch', 
        'Palak (Spinach) 250g', 'Ladies Finger 500g', 'Bottle Gourd 1pc', 'Cucumber Green 500g', 
        'Beetroot Local 500g', 'Lemon Yellow 6pc', 'Raw Banana 3pc', 'Bitter Gourd 500g'
      ]
    },
    {
      id: 'fruits',
      name: 'Fruits',
      bayPrefix: 'B', // Aisle B (Shelves B01 - B15)
      items: [
        'Royal Gala Apples 4pc', 'Robusta Banana 1kg', 'Nagpur Oranges 1kg', 'Pomegranate Kabuli 500g', 
        'Papaya Semi-Ripe 1pc', 'Watermelon Kiran 1pc', 'Sweet Lime (Mosambi) 1kg', 'Pineapple Queen 1pc', 
        'Green Grapes Seedless 500g', 'Guava White 500g', 'Alphonso Mango 1kg', 'Kiwi Green Pack 3pc', 
        'Dragon Fruit Red 1pc', 'Plum Red Indian 500g', 'Sapota (Chikoo) 500g', 'Pear Green 500g', 
        'Imported Red Cherries 250g', 'Custard Apple 500g', 'Avocado Hass 2pc', 'Muskmelon 1pc'
      ]
    },
    {
      id: 'bakeries',
      name: 'Bakeries',
      bayPrefix: 'C', // Aisle C (Shelves C01 - C15)
      items: [
        'Britannia Whole Wheat Bread 400g', 'Modern White Sandwich Bread 400g', 'Bonn Pav Buns 6-Pack', 
        'English Oven Garlic Bread 200g', 'Britannia Fruit Cake 150g', 'Winkies Swiss Roll Chocolate', 
        'Sunfeast Marie Light 250g', 'Oreo Vanilla Creme Biscuits 120g', 'Hide & Seek Choco Chip 120g', 
        'Parle-G Gold Glucose 1kg', 'Good Day Cashew Cookies 200g', 'Bourbon Chocolate Biscuits 150g', 
        'Unibic Choco Ripple Cookies 150g', 'Karachi Bakery Fruit Biscuits 400g', 'Bonn Burger Buns 4-Pack', 
        'Brown Bread Multi-Grain 400g', 'Pillsbury Chocolate Cake Mix 250g', 'Fresh Butter Croissant 2pc'
      ]
    },
    {
      id: 'juices',
      name: 'Juices & Beverages',
      bayPrefix: 'D', // Aisle D (Shelves D01 - D15)
      items: [
        'Tropicana 100% Orange Juice 1L', 'Real Fruit Power Mixed Fruit 1L', 'Coca-Cola 2L PET Bottle', 
        'Pepsi 2.25L Bottle', 'Thums Up Charged 2L', 'Sprite Lemon Lime 750ml', 'Paper Boat Aamras 1L', 
        'Red Bull Energy Drink 250ml', 'Tata Tea Gold 500g', 'Red Label Tea 500g', 'Taj Mahal Pure Tea 250g', 
        'Nescafe Classic Instant Coffee 100g', 'Bru Gold Roasted Coffee 100g', 'Bournvita Health Drink 500g', 
        'Horlicks Classic Malt 500g', 'Amul Kool Kesar Badam Can 200ml', 'Frooti Mango Drink 1.2L', 'Maaza Mango 1.2L'
      ]
    },
    {
      id: 'snacks',
      name: 'Snacks & Packaged',
      bayPrefix: 'E', // Aisle E (Shelves E01 - E15)
      items: [
        "Lay's Classic Salted Potato Chips 90g", "Lay's India's Magic Masala 90g", 'Kurkure Masala Munch 100g', 
        'Bingo Mad Angles Tomato 80g', 'Doritos Cheese Supreme 100g', 'Haldiram Bhujia Sev 400g', 
        'Haldiram Khatta Meetha 400g', 'Pringles Sour Cream & Onion 107g', 'Act II Butter Popcorn 150g', 
        'Maggi 2-Minute Masala Noodles 12-Pack', 'Yippee Magic Masala Noodles 4-Pack', 'Knorr Tomato Soup 50g', 
        'Ching Secret Hakka Veg Noodles 150g', 'Uncle Chipps Spicy Treat 90g', 'Bikaji Bhujia 1kg'
      ]
    },
    {
      id: 'groceries',
      name: 'Groceries & Staples',
      bayPrefix: 'F', // Aisle F (Shelves F01 - F15)
      items: [
        'Aashirvaad Superior Shudh Atta 5kg', 'Fortune Sunlite Refined Sunflower Oil 1L', 'India Gate Basmati Rice Feast 5kg', 
        'Tata Salt Vacuum Evaporated 1kg', 'Tata Sampann Unpolished Toor Dal 1kg', 'Madhur Pure & Hygienic Sugar 5kg', 
        'Fortune Premium Kachi Ghani Mustard Oil 1L', 'Everest Turmeric Powder 200g', 'Catch Red Chilli Powder 200g', 
        'Everest Garam Masala 100g', 'Kissan Mixed Fruit Jam 500g', 'Patanjali Pure Natural Honey 500g', 
        'Saffola Gold Pro Healthy Heart Oil 1L', 'Daawat Super Basmati Rice 5kg', 'Tata Sampann Moong Dal 1kg'
      ]
    },
    {
      id: 'dairy',
      name: 'Dairy & Chilled',
      bayPrefix: 'G', // Aisle G (Shelves G01 - G15)
      items: [
        'Amul Full Cream Fresh Milk 1L', 'Nandini Toned Fresh Milk 500ml', 'Amul Pasteurized Salted Butter 500g', 
        'Mother Dairy Classic Paneer 200g', 'Milky Mist Set Curd 1kg', 'Britannia Processed Cheese Slices 200g', 
        'Amul Fresh Cream 250ml', 'Yakult Probiotic Health Drink 5-Pack', 'Amul Cheese Block 500g', 
        'Milky Mist Greek Yogurt Blueberry 100g', 'Gowardhan Pure Cow Ghee 1L', 'Amul Salted Maska Butter 100g'
      ]
    },
    {
      id: 'household',
      name: 'Household & Personal Care',
      bayPrefix: 'H', // Aisle H (Shelves H01 - H15)
      items: [
        'Surf Excel Easy Wash Detergent 1kg', 'Ariel Matic Front Load Liquid 2L', 'Vim Lemon Dishwash Gel 750ml', 
        'Harpic Disinfectant Toilet Cleaner 1L', 'Colin Glass & Multi-Surface Cleaner 500ml', 'Good Knight Gold Flash Liquid Refill', 
        'Dove Deep Moisture Bar Soap 125g', 'Dettol Original Germ Protection Soap 4x125g', 'Colgate MaxFresh Spicy Fresh 150g', 
        'Head & Shoulders Smooth & Silky 340ml', 'Nivea Soft Light Moisturizer 200ml', 'Parachute 100% Pure Coconut Oil 500ml'
      ]
    }
  ];

  const totalProducts: any[] = [];
  let skuIndex = 1;

  categoriesConfig.forEach((cat) => {
    // Generate ~62-63 products per category sequentially
    for (let i = 0; i < 63; i++) {
      if (skuIndex > 500) break;

      const baseItem = cat.items[i % cat.items.length];
      const shelfNum = String((i % 15) + 1).padStart(2, '0');
      const shelf = `${cat.bayPrefix}${shelfNum}`; // A01 - A15, B01 - B15, etc.
      const sku = `SKU-${String(skuIndex).padStart(3, '0')}`;
      
      const expected = 12 + (skuIndex * 3) % 28;
      let detected = expected;
      let status = 'OK';
      let isPlanogramIssue = false;

      // Realistic stock conditions matching the overview counts (25 Low, 13 Out, 7 Planogram)
      if (skuIndex === 1 || skuIndex === 4 || skuIndex === 6 || skuIndex === 9 || (skuIndex % 20 === 0 && skuIndex <= 380)) {
        detected = Math.min(Math.floor(expected * 0.2), 3);
        status = 'Low';
      } else if (skuIndex === 2 || skuIndex === 7 || (skuIndex % 38 === 0 && skuIndex <= 460)) {
        detected = 0;
        status = 'Out';
      } else if (skuIndex % 70 === 0) {
        isPlanogramIssue = true;
      }

      totalProducts.push({
        id: skuIndex,
        sku: sku,
        name: i >= cat.items.length ? `${baseItem} (Batch #${Math.floor(i / cat.items.length) + 1})` : baseItem,
        category: cat.name,
        categoryId: cat.id,
        shelf: shelf,
        expected: expected,
        detected: detected,
        fill: Math.round((detected / expected) * 100),
        status: status,
        isPlanogramIssue: isPlanogramIssue
      });

      skuIndex++;
    }
  });

  return totalProducts;
};

const MASTER_DATA = generate500OrderedProducts();

export function InventoryView() {
  const [products, setProducts] = useState<any[]>(generate500Products());
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' or category id
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'OUT' | 'OK' | 'PLANOGRAM'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [restockToast, setRestockToast] = useState<any>(null);

  const categories = [
    { id: 'ALL', name: 'All Categories (500)', icon: '🏬' },
    { id: 'Vegetables', name: 'Vegetables (Aisle A)', icon: '🥦' },
    { id: 'Fruits', name: 'Fruits (Aisle B)', icon: '🍎' },
    { id: 'Bakeries', name: 'Bakeries (Aisle C)', icon: '🍞' },
    { id: 'Juices & Beverages', name: 'Juices & Beverages (Aisle D)', icon: '🧃' },
    { id: 'Snacks & Packaged Foods', name: 'Snacks (Aisle E)', icon: '🍿' },
    { id: 'Groceries & Staples', name: 'Groceries & Staples (Aisle F)', icon: '🌾' },
    { id: 'Dairy & Chilled', name: 'Dairy & Chilled (Aisle G)', icon: '🥛' },
    { id: 'Household & Cleaning', name: 'Household & Personal (Aisle H)', icon: '🧼' }
  ];

  // Dynamic KPI Stats Calculation
  const stats = useMemo(() => {
    const total = products.length;
    const low = products.filter(p => p.status === 'Low Stock').length;
    const out = products.filter(p => p.status === 'Out of Stock').length;
    const ok = products.filter(p => p.status === 'Optimal').length;
    const planogram = products.filter(p => p.status === 'Planogram Issues').length;
    return { total, ok, low, out, planogram };
  }, [products]);

  // Filtered & Searched Dataset
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      // 1. Category Filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // 2. Stock Health Status Filter
      if (stockStatusFilter === 'LOW' && item.status !== 'Low Stock') return false;
      if (stockStatusFilter === 'OUT' && item.status !== 'Out of Stock') return false;
      if (stockStatusFilter === 'OK' && item.status !== 'Optimal') return false;
      if (stockStatusFilter === 'PLANOGRAM' && item.status !== 'Planogram Issues') return false;

      // 3. Search query (SKU, Name, Shelf)
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.bay.toLowerCase().includes(q)
      );
    });
  }, [products, selectedCategory, stockStatusFilter, searchQuery]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Restock Action Handler
  const handleRestock = (product: any) => {
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, detected: p.expected, status: 'OK', fill: 100 };
      }
      return p;
    }));
    setRestockToast(`Restock task dispatched: ${product.name} (Shelf ${product.shelf})`);
    setTimeout(() => setRestockToast(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-800">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP METRICS TILES                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div 
          onClick={() => { setStockStatusFilter('ALL'); setCurrentPage(1); }}
          className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
            stockStatusFilter === 'ALL' ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Total SKUs (001-500)</p>
        </div>

        <div 
          onClick={() => { setStockStatusFilter('OK'); setCurrentPage(1); }}
          className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
            stockStatusFilter === 'OK' ? 'border-emerald-600 ring-2 ring-emerald-600/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-3xl font-black text-slate-900">{stats.ok}</p>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Available (Optimal)</p>
        </div>

        <div 
          onClick={() => { setStockStatusFilter('LOW'); setCurrentPage(1); }}
          className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
            stockStatusFilter === 'LOW' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-3xl font-black text-slate-900">{stats.low}</p>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Low Stock Threshold</p>
        </div>

        <div 
          onClick={() => { setStockStatusFilter('OUT'); setCurrentPage(1); }}
          className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
            stockStatusFilter === 'OUT' ? 'border-rose-600 ring-2 ring-rose-600/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-3xl font-black text-slate-900">{stats.out}</p>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Out of Stock Void</p>
        </div>

        <div 
          onClick={() => { setStockStatusFilter('PLANOGRAM'); setCurrentPage(1); }}
          className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
            stockStatusFilter === 'PLANOGRAM' ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-3xl font-black text-slate-900">{stats.planogram}</p>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Planogram Mismatches</p>
        </div>
      </div>

      {/* Toast Alert */}
      {restockToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{restockToast}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Camera Shelf Synced</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CATEGORY HORIZONTAL SELECTOR (Vegetables -> Household)     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0c1322] text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SEARCH & HEALTH FILTER CONTROLS                            */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Health Status' },
            { id: 'LOW', label: '⚠️ Low Stock' },
            { id: 'OUT', label: '🔴 Out of Stock' },
            { id: 'OK', label: '✅ Optimal' },
            { id: 'PLANOGRAM', label: '📐 Planogram Issues' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setStockStatusFilter(tab.id); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                stockStatusFilter === tab.id 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Page Sizer */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU (e.g. SKU-042), item, or shelf..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
          >
            <option value={15}>15 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. MASTER ORDERED PRODUCTS TABLE (Aisle A -> H, SKU-001 -> 500) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 w-24">SKU NO.</th>
                <th className="p-4">PRODUCT NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">BAY / SHELF</th>
                <th className="p-4">EXPECTED</th>
                <th className="p-4">DETECTED</th>
                <th className="p-4">FILL %</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{item.sku}</td>
                    <td className="p-4 font-bold text-slate-900 text-xs">{item.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      <span className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-900">
                        {item.bay}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{item.expected}</td>
                    <td className="p-4 font-bold text-slate-900">{item.detected}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.fill > 60 ? 'bg-emerald-500' : item.fill > 20 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${item.fill}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono">{item.fill}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        item.status === 'Optimal' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        item.status === 'Out of Stock' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {item.status}
                      </span>
                      {item.isPlanogramIssue && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          📐 Misplaced
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.status !== 'OK' ? (
                        <button
                          onClick={() => handleRestock(item)}
                          className="px-3 py-1 bg-[#0c1322] hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all"
                        >
                          Restock
                        </button>
                      ) : (
                        <span className="text-slate-300 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No products found matching your current category or search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. SEQUENTIAL PAGINATION FOOTER                               */}
        {/* ------------------------------------------------------------- */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> of{' '}
            <strong className="text-slate-900">{filteredProducts.length}</strong> items
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum 
                      ? 'bg-[#0c1322] text-white shadow-sm' 
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-slate-400 px-1">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === totalPages 
                      ? 'bg-[#0c1322] text-white shadow-sm' 
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   6. QUEUE MANAGEMENT VIEW
   ========================================================================== */
function QueueView() {
  // State for Counters
  const [counters, setCounters] = useState([
    { 
      id: 1, 
      name: 'Counter 1', 
      type: 'Standard Lane',
      status: 'Open', 
      cashier: 'Priya R.', 
      queueCount: 2, 
      avgWait: '1.8 min', 
      serviceSpeed: '42s / cust', 
      avgBasket: '8 items',
      utilization: '62%', 
      risk: 'Normal' 
    },
    { 
      id: 2, 
      name: 'Counter 2', 
      type: 'Heavy Basket Lane',
      status: 'Open', 
      cashier: 'Arjun K.', 
      queueCount: 7, 
      avgWait: '5.1 min', 
      serviceSpeed: '58s / cust', 
      avgBasket: '22 items',
      utilization: '88%', 
      risk: 'Critical' 
    },
    { 
      id: 3, 
      name: 'Counter 3', 
      type: 'Express Lane (≤ 5 items)',
      status: 'Open', 
      cashier: 'Meena S.', 
      queueCount: 1, 
      avgWait: '1.2 min', 
      serviceSpeed: '25s / cust', 
      avgBasket: '4 items',
      utilization: '45%', 
      risk: 'Normal' 
    },
    { 
      id: 4, 
      name: 'Counter 4', 
      type: 'Flexible Standby',
      status: 'Closed', 
      cashier: 'Unassigned', 
      queueCount: 0, 
      avgWait: '--', 
      serviceSpeed: '--', 
      avgBasket: '--',
      utilization: '0%', 
      risk: 'AI Advised: Open' 
    },
    { 
      id: 5, 
      name: 'Counter 5', 
      type: 'Self-Checkout Pod',
      status: 'Open', 
      cashier: 'Automated (Ravi M. Overseeing)', 
      queueCount: 4, 
      avgWait: '3.4 min', 
      serviceSpeed: '48s / cust', 
      avgBasket: '9 items',
      utilization: '74%', 
      risk: 'Moderate' 
    },
    { 
      id: 6, 
      name: 'Counter 6', 
      type: 'Assisted Billing',
      status: 'Closed', 
      cashier: 'Unassigned', 
      queueCount: 0, 
      avgWait: '--', 
      serviceSpeed: '--', 
      avgBasket: '--',
      utilization: '0%', 
      risk: 'Idle' 
    }
  ]);

  // Modal / Action State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCounterForAssign, setSelectedCounterForAssign] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState('Kavitha R. (Floor)');
  const [actionAlert, setActionAlert] = useState<any>(null);

  // Available staff from floor that can be dispatched
  const standbyStaff = [
    { name: 'Kavitha R.', currentZone: 'Personal Care', currentRole: 'Floor Associate' },
    { name: 'Suresh V.', currentZone: 'Backroom', currentRole: 'Inventory Specialist' },
    { name: 'Rahul Kumar', currentZone: 'Promotional Endcap', currentRole: 'Replenishment' }
  ];

  // Open Lane 4 Action
  const handleOpenCounter4 = () => {
    setCounters(prev => prev.map(c => {
      if (c.id === 4) {
        return {
          ...c,
          status: 'Open',
          cashier: 'Kavitha R. (Dispatched)',
          queueCount: 1,
          avgWait: '1.0 min',
          serviceSpeed: '40s / cust',
          avgBasket: '6 items',
          utilization: '35%',
          risk: 'Normal'
        };
      }
      return c;
    }));
    setActionAlert('Counter 4 is now ACTIVE! Kavitha R. has been reassigned from Personal Care to POS Counter 4.');
    setTimeout(() => setActionAlert(null), 5000);
  };

  // Toggle Any Counter Status
  const handleToggleCounter = (counterId: number) => {
    setCounters(prev => prev.map(c => {
      if (c.id === counterId) {
        const isNowOpen = c.status === 'Closed';
        return {
          ...c,
          status: isNowOpen ? 'Open' : 'Closed',
          cashier: isNowOpen ? 'Floor Staff Assigned' : 'Unassigned',
          queueCount: isNowOpen ? 1 : 0,
          avgWait: isNowOpen ? '1.5 min' : '--',
          utilization: isNowOpen ? '40%' : '0%',
          risk: 'Normal'
        };
      }
      return c;
    }));
  };

  // Assign Staff Modal Trigger
  const handleOpenAssignModal = (counter: any) => {
    setSelectedCounterForAssign(counter);
    setAssignModalOpen(true);
  };

  const handleConfirmStaffAssign = () => {
    setCounters(prev => prev.map(c => {
      if (c.id === selectedCounterForAssign.id) {
        return {
          ...c,
          status: 'Open',
          cashier: selectedStaff,
          risk: 'Normal'
        };
      }
      return c;
    }));
    setAssignModalOpen(false);
    setActionAlert(`Staff member "${selectedStaff}" has been deployed to ${selectedCounterForAssign.name}!`);
    setTimeout(() => setActionAlert(null), 4500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-800 antialiased">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP 6 QUEUE INTELLIGENCE KPI METRIC CARDS                  */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Queue */}
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center mb-2">
            <ShoppingCart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">14</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Total In Queue</p>
          <p className="text-[11px] text-slate-500 mt-1">Across 4 active lanes</p>
        </div>

        {/* Avg Customer Wait Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">2.9 min</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Avg Customer Wait</p>
          <p className="text-[11px] text-slate-500 mt-1">Target: ≤ 3.5 min</p>
        </div>

        {/* Avg Cashier Service Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <Zap className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">2.1 min</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Avg Service Time</p>
          <p className="text-[11px] text-slate-500 mt-1">Scan & billing speed</p>
        </div>

        {/* Customer Drop-off / Walkout Risk */}
        <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900">2.4%</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Drop-off Risk</p>
          <p className="text-[11px] text-rose-600 font-bold mt-1">Elevated on Counter 2</p>
        </div>

        {/* Total Basket Product Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">118 Items</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Basket Items in Line</p>
          <p className="text-[11px] text-slate-500 mt-1">~8.4 items / shopper</p>
        </div>

        {/* Counter Utilization */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <Activity className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">72%</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">Lane Utilization</p>
          <p className="text-[11px] text-slate-500 mt-1">4 of 6 lanes active</p>
        </div>

      </div>

      {/* Action Notification Toast */}
      {actionAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Real-time POS Broadcasted</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. RED CONGESTION ALERT & INSTANT DISPATCH BANNER             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
          <div>
            <h3 className="text-xs font-bold text-rose-900">Queue Congestion Predicted by Computer Vision</h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Current: 14 shoppers → AI predicts <strong>15 customers in 8 minutes</strong> due to promotional aisle surges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCounter4}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>👉</span>
            <span>Open Counter 4</span>
          </button>
          <button
            onClick={() => handleOpenAssignModal(counters[1])}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Assign Floor Staff
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. LIVE BILLING COUNTERS GRID (Counters 1 to 6)               */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Live Checkout Counters & Queue Depth</h2>
            <p className="text-xs text-slate-400">Overhead Camera CAM-03 ByteTrack Centroid & Cart Volume Tracking</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Camera FPS: <strong>30.0 FPS</strong></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters.map((c) => {
            const isCritical = c.risk === 'Critical';
            const isOpen = c.status === 'Open';

            return (
              <div 
                key={c.id} 
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-sm ${
                  isCritical 
                    ? 'bg-[#FFF1F2]/60 border-[#FECDD3] ring-1 ring-rose-300' 
                    : isOpen 
                    ? 'bg-white border-slate-200' 
                    : 'bg-slate-50 border-slate-200/80 opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar of Counter Card */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                        }`}>
                          ● {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.type}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCritical ? 'bg-rose-600 text-white font-mono animate-pulse' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.risk}
                    </span>
                  </div>

                  {/* Customer Queue Visual Line */}
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600">Shoppers In Line:</span>
                      <span className="font-black text-slate-900 text-sm">{c.queueCount} {c.queueCount === 1 ? 'Person' : 'People'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 min-h-[28px] flex-wrap">
                      {c.queueCount > 0 ? (
                        [...Array(c.queueCount)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shadow-sm ${
                              isCritical ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900 text-white'
                            }`}
                            title={`Customer #${i + 1}`}
                          >
                            🧍
                          </div>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono italic">No customers waiting</span>
                      )}
                    </div>
                  </div>

                  {/* Operational Metrics Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50/70 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Wait</p>
                      <p className={`font-black text-xs mt-0.5 ${isCritical ? 'text-rose-600 font-mono' : 'text-slate-900'}`}>
                        {c.avgWait}
                      </p>
                    </div>
                    <div className="bg-slate-50/70 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Cart Size</p>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">{c.avgBasket}</p>
                    </div>
                    <div className="bg-slate-50/70 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Cashier Assigned</p>
                      <p className="font-bold text-slate-900 text-xs truncate mt-0.5">{c.cashier}</p>
                    </div>
                    <div className="bg-slate-50/70 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Throughput Speed</p>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">{c.serviceSpeed}</p>
                    </div>
                  </div>
                </div>

                {/* Counter Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleCounter(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isOpen 
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                        : 'bg-[#0c1322] hover:bg-slate-800 text-white shadow-sm'
                    }`}
                  >
                    {isOpen ? 'Close Lane' : 'Open Lane'}
                  </button>

                  <button
                    onClick={() => handleOpenAssignModal(c)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Reassign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. PREDICTIVE QUEUE TIMELINE & BASKET ANALYSIS SECTION        */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Predictive Graph & AI Pipeline Stages */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Predictive Arrival Curve & Queue Threshold</h2>
              <p className="text-xs text-slate-400">ByteTrack Centroid Queue Model + Arrival Rate Estimator</p>
            </div>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full">
              ● Red Line: Bottleneck Threshold (10 shoppers)
            </span>
          </div>

          {/* SVG Prediction Graph */}
          <div className="h-48 w-full flex items-end">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              {/* Threshold Red Dashed Line at count 10 (Y=60) */}
              <line x1="0" y1="60" x2="600" y2="60" stroke="#F87171" strokeDasharray="5 5" strokeWidth="1.5" />
              <text x="10" y="52" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">SLA THRESHOLD LIMIT (10 CUST)</text>

              {/* Historical Past Curve */}
              <path
                d="M 0,140 Q 100,125 180,105 T 320,85 T 420,50"
                fill="none"
                stroke="#0F766E"
                strokeWidth="3"
              />

              {/* Forecast Surge Dotted Curve */}
              <path
                d="M 420,50 Q 480,25 540,32 T 600,65"
                fill="none"
                stroke="#EF4444"
                strokeDasharray="4 4"
                strokeWidth="3"
              />

              {/* Current Time Point Dot */}
              <circle cx="420" cy="50" r="5" fill="#0c1322" stroke="#FFFFFF" strokeWidth="2" />
              <text x="400" y="35" fill="#0c1322" fontSize="10" fontWeight="bold">NOW (14 In Line)</text>
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-3 border-t border-slate-100 pt-2">
            <span>09:00 AM</span><span>09:15 AM</span><span>09:30 AM</span><span>09:45 AM</span><span>10:00 AM (Forecast Surge)</span><span>10:15 AM</span>
          </div>

          {/* 5-Step AI Action Pipeline */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="bg-slate-100 px-3 py-2 rounded-xl text-center font-bold">
              14 Shoppers
              <span className="text-[10px] text-slate-400 block font-normal">Current Queue</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-2 rounded-xl text-center font-bold">
              +3 / min
              <span className="text-[10px] text-amber-700 block font-normal">Arrival Rate</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="bg-rose-50 text-rose-900 border border-rose-200 px-3 py-2 rounded-xl text-center font-bold">
              15 in 8m
              <span className="text-[10px] text-rose-700 block font-normal">AI Forecast</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="bg-[#0c1322] text-white px-3.5 py-2 rounded-xl text-center font-bold shadow-sm">
              Open Lane 4
              <span className="text-[10px] text-emerald-400 block font-normal">Automated Advice</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Basket Size vs Wait Time Correlation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Basket Size & Queue Correlation</h2>
            <p className="text-xs text-slate-400 mb-4">Cart item volume impact on lane checkout throughput</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Express Items (1 - 5 units)</span>
                  <span className="text-emerald-700 font-bold">Avg: 1.2 min</span>
                </div>
                <p className="text-[11px] text-slate-500">Fast scan throughput. Low walkout probability (&lt;0.5%).</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Medium Basket (6 - 15 units)</span>
                  <span className="text-amber-700 font-bold">Avg: 2.8 min</span>
                </div>
                <p className="text-[11px] text-slate-500">Standard grocery load. Normal scan and card billing time.</p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-rose-950">Heavy Basket (&gt; 15 units)</span>
                  <span className="text-rose-700 font-bold">Avg: 5.1 min ⚠️</span>
                </div>
                <p className="text-[11px] text-rose-800">High friction. Triggers drop-off walkout risk if queue &gt; 5.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-mono text-slate-500">
              ⚡ Recommendation: Deploy bagging assistant to Counter 2 to reduce wait by <strong>35%</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. ASSIGN STAFF MODAL DIALOG                                  */}
      {/* ------------------------------------------------------------- */}
      {assignModalOpen && selectedCounterForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Assign Staff to {selectedCounterForAssign.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Reallocate idle or floor staff to manage checkout surge</p>
              </div>
              <button 
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  Select Available Associate from Sales Floor:
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                >
                  {standbyStaff.map((st) => (
                    <option key={st.name} value={`${st.name} (${st.currentZone})`}>
                      {st.name} — Current: {st.currentZone} ({st.currentRole})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 space-y-1">
                <p>📍 Destination: <strong>{selectedCounterForAssign.name} ({selectedCounterForAssign.type})</strong></p>
                <p>⏱ Estimated Ramp-up: <strong>&lt; 90 seconds</strong></p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStaffAssign}
                  className="px-5 py-2 bg-[#0c1322] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Dispatch Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ==========================================================================
   7. SHOPPER ANALYTICS VIEW
   ========================================================================== */
function AnalyticsView() {
  // Timeframe selector for Footfall (Hourly, Daily, Weekly)
  const [timeframe, setTimeframe] = useState('hourly'); // 'hourly' | 'daily' | 'weekly'
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // 1. Zone-Wise Real Data (Occupancy, Entry/Exit, Dwell)
  const zoneData = [
    { zone: 'Grocery & Staples', visitors: 420, entry: '+680', exit: '-260', dwell: '8.2 min', traffic: 'High', color: 'bg-rose-100 text-rose-700' },
    { zone: 'Electronics', visitors: 120, entry: '+190', exit: '-70', dwell: '5.1 min', traffic: 'Low', color: 'bg-emerald-100 text-emerald-700' },
    { zone: 'Clothing / Fashion', visitors: 280, entry: '+430', exit: '-150', dwell: '6.4 min', traffic: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { zone: 'Cosmetics & Care', visitors: 195, entry: '+310', exit: '-115', dwell: '9.1 min', traffic: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { zone: 'Beverages', visitors: 310, entry: '+490', exit: '-180', dwell: '4.8 min', traffic: 'High', color: 'bg-rose-100 text-rose-700' },
    { zone: 'Fresh Produce', visitors: 380, entry: '+605', exit: '-225', dwell: '7.3 min', traffic: 'High', color: 'bg-rose-100 text-rose-700' },
    { zone: 'Promotional Endcap', visitors: 185, entry: '+290', exit: '-105', dwell: '3.2 min', traffic: 'Medium', color: 'bg-amber-100 text-amber-700' },
  ];

  // 2. Product-Level Engagement Data (Product - Visitors, Average Dwell Time, Traffic)
  const productAnalyticsData = [
    { id: 1, product: 'Amul Full Cream Fresh Milk 1L', category: 'Dairy', shelf: 'G01', visitorsPerHour: 84, avgDwell: '1m 15s', traffic: 'High', conversion: '82%' },
    { id: 2, product: 'Aashirvaad Superior Shudh Atta 5kg', category: 'Groceries', shelf: 'F02', visitorsPerHour: 62, avgDwell: '3m 40s', traffic: 'High', conversion: '76%' },
    { id: 3, product: 'Tropicana 100% Orange Juice 1L', category: 'Juices & Beverages', shelf: 'D04', visitorsPerHour: 45, avgDwell: '2m 10s', traffic: 'Medium', conversion: '64%' },
    { id: 4, product: "Lay's Classic Salted Chips 90g", category: 'Snacks', shelf: 'E03', visitorsPerHour: 78, avgDwell: '1m 50s', traffic: 'High', conversion: '88%' },
    { id: 5, product: 'Britannia Whole Wheat Bread 400g', category: 'Bakeries', shelf: 'C01', visitorsPerHour: 56, avgDwell: '1m 20s', traffic: 'Medium', conversion: '70%' },
    { id: 6, product: 'Dove Deep Moisture Bar Soap 125g', category: 'Personal Care', shelf: 'H05', visitorsPerHour: 28, avgDwell: '4m 30s', traffic: 'Low', conversion: '35%' },
    { id: 7, product: 'Royal Gala Apples 4pc Pack', category: 'Fruits', shelf: 'B02', visitorsPerHour: 68, avgDwell: '3m 15s', traffic: 'High', conversion: '79%' },
    { id: 8, product: 'Fresh Red Onions 1kg', category: 'Vegetables', shelf: 'A01', visitorsPerHour: 92, avgDwell: '2m 45s', traffic: 'High', conversion: '91%' },
  ];

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'ALL') return productAnalyticsData;
    return productAnalyticsData.filter(p => p.category.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [categoryFilter]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-800 antialiased font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP 4 KPI METRICS CARDS                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Footfall (1,248) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">1,248</p>
          <p className="text-xs font-bold text-slate-600 mt-0.5">Total Footfall</p>
          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            Today +12.4% vs baseline
          </span>
        </div>

        {/* Current Occupancy (62 / 100) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">62</p>
          <p className="text-xs font-bold text-slate-600 mt-0.5">Current Occupancy</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            of 100 max safe capacity <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">62%</span>
          </p>
        </div>

        {/* Peak Hour Traffic (7 PM) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">7 PM</p>
          <p className="text-xs font-bold text-slate-600 mt-0.5">Peak Traffic Window</p>
          <p className="text-xs text-slate-400 mt-2 font-mono">203 visitors / hour peak</p>
        </div>

        {/* Avg Dwell Time (7.4 min) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">7.4 min</p>
          <p className="text-xs font-bold text-slate-600 mt-0.5">Avg Store Dwell Time</p>
          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            All zones +0.8 min engagement
          </span>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. FOOTFALL TREND (HOURLY / DAILY / WEEKLY) & DWELL TIME      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Footfall Trend Curve (Left 2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Footfall Trend Analysis</h2>
              <p className="text-xs text-slate-400">Total customer traffic volume across physical entrance sensors</p>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeframe('hourly')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === 'hourly' ? 'bg-[#0c1322] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hourly (Today)
              </button>
              <button
                onClick={() => setTimeframe('daily')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === 'daily' ? 'bg-[#0c1322] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily (This Week)
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === 'weekly' ? 'bg-[#0c1322] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly (Past Month)
              </button>
            </div>
          </div>

          {/* SVG Smooth Curve Representation */}
          <div className="h-52 w-full flex items-end">
            <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible">
              <path
                d={
                  timeframe === 'hourly'
                    ? "M 0,160 Q 150,110 250,120 T 450,70 T 550,40 T 700,130"
                    : timeframe === 'daily'
                    ? "M 0,140 Q 120,90 240,110 T 460,50 T 600,30 T 700,80"
                    : "M 0,150 Q 180,100 360,60 T 540,40 T 700,90"
                }
                fill="none"
                stroke="#115E59"
                strokeWidth="3"
              />
              <path
                d={
                  timeframe === 'hourly'
                    ? "M 0,160 Q 150,110 250,120 T 450,70 T 550,40 T 700,130 L 700,180 L 0,180 Z"
                    : timeframe === 'daily'
                    ? "M 0,140 Q 120,90 240,110 T 460,50 T 600,30 T 700,80 L 700,180 L 0,180 Z"
                    : "M 0,150 Q 180,100 360,60 T 540,40 T 700,90 L 700,180 L 0,180 Z"
                }
                fill="url(#footfall-gradient)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="footfall-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#115E59" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Timeline labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-3 border-t border-slate-100 pt-2">
            {timeframe === 'hourly' ? (
              <>
                <span>9AM</span><span>10AM</span><span>11AM</span><span>12PM</span><span>1PM</span><span>2PM</span><span>3PM</span><span>4PM</span><span>5PM</span><span>6PM</span><span>7PM (Peak)</span><span>8PM</span><span>9PM</span>
              </>
            ) : timeframe === 'daily' ? (
              <>
                <span>Mon (1,120)</span><span>Tue (1,080)</span><span>Wed (1,210)</span><span>Thu (1,248 Today)</span><span>Fri (Proj 1,450)</span><span>Sat (Proj 1,920)</span><span>Sun (Proj 2,100)</span>
              </>
            ) : (
              <>
                <span>Week 1 (8,200)</span><span>Week 2 (8,950)</span><span>Week 3 (9,400)</span><span>Week 4 (Current)</span>
              </>
            )}
          </div>
        </div>

        {/* Avg Dwell by Hour (Right 1 Col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Avg Dwell by Hour</h2>
            <p className="text-xs text-slate-400 mb-4">Customer in-store shopping duration curve</p>
            
            <div className="h-44 flex items-end">
              <svg viewBox="0 0 350 160" className="w-full h-full overflow-visible">
                <path
                  d="M 0,120 Q 80,60 140,70 T 220,40 T 290,15 T 350,110"
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

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <p>Peak engagement reached at <strong>07:30 PM (11.2 min)</strong></p>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. ZONE-WISE ANALYTICS (Entry & Exit People Count)           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Zone-Wise Movement & Ingress/Egress</h2>
            <p className="text-xs text-slate-400">Centroid tracking for live area occupancy, entry count, exit count and dwell</p>
          </div>
          <span className="text-xs font-mono text-slate-500">7 Active Floor Zones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">ZONE NAME</th>
                <th className="p-3.5">CURRENT OCCUPANTS</th>
                <th className="p-3.5">ENTRY COUNT</th>
                <th className="p-3.5">EXIT COUNT</th>
                <th className="p-3.5">AVG DWELL TIME</th>
                <th className="p-3.5">TRAFFIC LEVEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {zoneData.map((z) => (
                <tr key={z.zone} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{z.zone}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{z.visitors} shoppers</td>
                  <td className="p-3.5 text-emerald-600 font-bold">{z.entry} in</td>
                  <td className="p-3.5 text-rose-600 font-bold">{z.exit} out</td>
                  <td className="p-3.5 font-mono font-semibold">{z.dwell}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${z.color}`}>
                      ● {z.traffic}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. PRODUCT-LEVEL ENGAGEMENT (Product - Visitors, Dwell, Traffic)*/}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Product-Level Shopper Engagement</h2>
            <p className="text-xs text-slate-400">Shelf camera optical gaze & interaction dwell time per product</p>
          </div>

          {/* Quick Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="ALL">All Products</option>
              <option value="Dairy">Dairy</option>
              <option value="Groceries">Groceries</option>
              <option value="Snacks">Snacks</option>
              <option value="Juices">Juices & Beverages</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">PRODUCT NAME</th>
                <th className="p-3.5">CATEGORY</th>
                <th className="p-3.5">SHELF LOCATION</th>
                <th className="p-3.5">VISITORS / HOUR</th>
                <th className="p-3.5">AVG DWELL TIME</th>
                <th className="p-3.5">CART CONVERSION</th>
                <th className="p-3.5">TRAFFIC LEVEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{p.product}</td>
                  <td className="p-3.5 text-slate-500 font-medium">{p.category}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900">
                      {p.shelf}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{p.visitorsPerHour} shoppers / hr</td>
                  <td className="p-3.5 font-mono font-semibold text-slate-800">{p.avgDwell}</td>
                  <td className="p-3.5">
                    <span className="text-emerald-700 font-bold">{p.conversion}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.traffic === 'High' ? 'bg-rose-100 text-rose-700' :
                      p.traffic === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      ● {p.traffic}
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
   8-13. OTHER SUPPORTING VIEWS
   ========================================================================== */
function AIInsightsView() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <p className="font-bold text-sm text-slate-900">⚡ Footfall Surge Projection</p>
        <p className="text-xs text-slate-600 mt-1">Model predicts a +28% surge between 05:30 PM – 07:00 PM IST.</p>
      </div>
    </div>
  );
}

function AlertsView() {
  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex justify-between items-center text-xs">
        <div>
          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">CRITICAL</span>
          <span className="font-bold text-slate-900 ml-2">Queue Bottleneck on Counter 2</span>
        </div>
        <span className="text-slate-400">2 mins ago</span>
      </div>
    </div>
  );
}

function ReportsView() {
  return <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-600">Reports and compliance audit export center.</div>;
}

function IntegrationsView() {
  return <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-600">ERP (SAP S/4HANA) and POS Webhooks connected.</div>;
}

function PrivacyView() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-700 space-y-2 shadow-sm">
      <p>✔ 100% of video frame inference executes locally on on-premise edge hardware.</p>
      <p>✔ Zero raw video frames stream to HQ cloud storage.</p>
      <p>✔ Anonymous centroid tracking with UUID-v4 hashes.</p>
    </div>
  );
}

function SettingsView() {
  return <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-600">Enterprise edge cluster configuration and threshold settings.</div>;
}
function TasksView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-base font-bold text-slate-900">My Action Tasks</h2>
        <p className="text-xs text-slate-500">Direct Restock & Planogram Task Tickets</p>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-600 shadow-sm">
        <p>You have 3 pending tasks assigned to you. Please check inventory shelves.</p>
      </div>
    </div>
  );
}

export function AddEmployeeFormView({ onSave, onCancel }: { onSave: (emp: any) => void, onCancel: () => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Replenishment Associate');
  const [zone, setZone] = useState('Aisle A & B (Produce)');
  const [shift, setShift] = useState('08:00 AM - 04:00 PM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSave({
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name,
      role,
      zone,
      shift,
      status: 'Active',
      performance: '100%'
    });
  };

  return (
    <div className="max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-1">Add New Store Employee</h2>
      <p className="text-xs text-slate-400 mb-6">Create credentials and assign a retail zone.</p>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Varma"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Role Designation</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option>Floor Lead</option>
            <option>POS Cashier</option>
            <option>Replenishment Associate</option>
            <option>Inventory QA</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assigned Bay / Zone</label>
          <input
            type="text"
            value={zone}
            onChange={e => setZone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="px-6 py-2.5 bg-[#0c1322] hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors">
            Save Employee
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function AssignTasksView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <CheckSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Task Dispatch Engine</h2>
          <p className="text-xs text-slate-500 font-medium">Manage and assign tasks to employees.</p>
        </div>
      </div>
      <div className="p-6 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 shadow-sm">
        <p>4 restock tickets open. Auto-assigned to Floor Lead.</p>
        <p className="text-xs text-slate-400 font-normal mt-2">More granular task management features coming soon.</p>
      </div>
    </div>
  );
}

export function EmployeesPerformanceView({ employees }: { employees: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Staff Performance Metrics</h2>
          <p className="text-xs text-slate-500 font-medium">KPIs and SLA resolutions across the team.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Average Staff Resolution SLA</p>
          <p className="text-3xl font-black text-slate-900 mt-1">4.2 min</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Industry Top 5%</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Overall Store Efficiency</p>
          <p className="text-3xl font-black text-slate-900 mt-1">96.4%</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Target: 95.0%</p>
        </div>
      </div>
    </div>
  );
}


// --- NEW DYNAMIC ATTENDANCE CALENDAR COMPONENT ---
export function AttendanceCalendar({ attendanceData = {} }: { attendanceData: any }) {
  const [currentYear, setCurrentYear] = React.useState(2026);
  const [currentMonth, setCurrentMonth] = React.useState(7); // 0 = Jan, 7 = Aug

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const offset = (firstDayOfWeek + 6) % 7;

  const today = new Date(); // Current date

  const getDayStatus = (day: number, dayOfWeekIndex: number) => {
    const cellDate = new Date(currentYear, currentMonth, day);
    
    // Strip time for exact date comparison
    const isFuture = cellDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0);

    // 1. Future dates must be blank/unmarked
    if (isFuture) {
      return 'FUTURE';
    }

    // 2. Check if it's a weekend (Sunday = 6, Saturday = 5 in Mon-start index)
    if (dayOfWeekIndex === 5 || dayOfWeekIndex === 6) {
      return 'OFF';
    }

    // 3. Past or current days: use recorded data, or default to OFF/UNMARKED
    if (currentYear === 2026 && currentMonth === 7) {
        const status = attendanceData[day];
        if (status === 'P') return 'PRES';
        if (status === 'L') return 'LATE';
        if (status === 'A') return 'LEAVE';
        if (status === 'O') return 'OFF';
        return 'PRES'; // fallback
    }
    return 'PRES';
  };

  const navBtnStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center'
  };

  const selectStyle = {
    fontWeight: '600' as const,
    padding: '4px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    background: '#fff',
    fontSize: '13px',
    cursor: 'pointer'
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevMonth} style={navBtnStyle}><ChevronLeft size={16} /></button>
          
          <select 
            value={currentMonth} 
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            style={selectStyle}
          >
            {MONTHS.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>

          <select 
            value={currentYear} 
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            style={selectStyle}
          >
            {[2024, 2025, 2026, 2027].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>

          <button onClick={handleNextMonth} style={navBtnStyle}><ChevronRight size={16} /></button>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: '600' }}>
          <span style={{ color: '#059669' }}>● Present</span>
          <span style={{ color: '#d97706' }}>● Late</span>
          <span style={{ color: '#dc2626' }}>● Leave</span>
          <span style={{ color: '#64748b' }}>● Off / Rest</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} style={{ height: '48px' }} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayOfWeekIndex = (offset + i) % 7; // 0 = Mon, 6 = Sun
          const status = getDayStatus(day, dayOfWeekIndex);

          // Styles based on status
          const isFuture = status === 'FUTURE';
          const isPres = status === 'PRES';
          const isOff = status === 'OFF';
          const isLate = status === 'LATE';
          const isLeave = status === 'LEAVE';

          return (
            <div
              key={day}
              style={{
                height: '48px',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4px 6px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: isFuture ? '#ffffff' : isPres ? '#f0fdf4' : isOff ? '#f8fafc' : isLate ? '#fefce8' : '#fef2f2',
                color: isFuture ? '#94a3b8' : isPres ? '#16a34a' : isOff ? '#64748b' : isLate ? '#ca8a04' : '#dc2626',
                opacity: isFuture ? 0.45 : 1 // Dim future dates
              }}
            >
              <span>{day}</span>
              <span style={{ fontSize: '9px', textAlign: 'center' }}>
                {isFuture ? '' : isPres ? '✓ PRES' : isOff ? 'OFF' : isLate ? '⚠ LATE' : '✕ LEAVE'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
