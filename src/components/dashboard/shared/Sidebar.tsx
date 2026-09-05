import React from 'react';
import { Role } from '../../../types';
import { 
  Home, Store, Users, Camera, Package, 
  ShoppingCart, UserSquare, BrainCircuit, 
  BellRing, BarChart3, Link, Shield, Settings, LogOut, CheckSquare
} from 'lucide-react';

interface SidebarProps {
  role: Role;
  onLogout: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function Sidebar({ role, onLogout, activeItem, setActiveItem }: SidebarProps) {
  
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'stores', label: 'Stores', icon: Store },
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'cameras', label: 'Cameras', icon: Camera },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'queue', label: 'Queue Management', icon: ShoppingCart },
          { id: 'shopper', label: 'Shopper Analytics', icon: UserSquare },
          { id: 'ai', label: 'AI Insights', icon: BrainCircuit },
          { id: 'alerts', label: 'Alerts', icon: BellRing },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'integrations', label: 'Integrations', icon: Link },
          { id: 'privacy', label: 'Privacy & Security', icon: Shield },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'manager':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'ai-center', label: 'AI Decision Center', icon: BrainCircuit },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'queue', label: 'Queue Status', icon: ShoppingCart },
          { id: 'cameras', label: 'Cameras', icon: Camera },
          { id: 'reports', label: 'Store Reports', icon: BarChart3 },
        ];
      case 'employee':
        return [
          { id: 'dashboard', label: 'My Dashboard', icon: Home },
          { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'queue', label: 'Queue Status', icon: ShoppingCart },
          { id: 'alerts', label: 'Alerts', icon: BellRing },
          { id: 'cameras', label: 'Assigned Cameras', icon: Camera },
          { id: 'performance', label: 'My Performance', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const getRoleTitle = () => {
    if (role === 'admin') return 'RetailEdge AI';
    if (role === 'manager') return 'Manager Portal';
    return 'Employee Portal';
  };

  return (
    <div className="w-64 bg-surface border-r border-gray-800 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <BrainCircuit className="text-neon-blue w-8 h-8" />
        <h2 className="font-display font-bold text-lg">{getRoleTitle()}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeItem === item.id 
                    ? 'bg-neon-blue/10 text-neon-blue font-semibold' 
                    : 'text-gray-400 hover:bg-surface-hover hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeItem === item.id ? 'text-neon-blue' : ''}`} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
