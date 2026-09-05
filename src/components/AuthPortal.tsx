import React from 'react';
import { SignIn } from '@clerk/react';
import {
  LayoutDashboard,
  Store,
  Users,
  Camera,
  Layers,
  ShieldCheck,
  Settings,
  Flame,
  ShoppingCart,
  Package,
  Bell,
  BarChart3,
  CheckSquare,
  Activity,
  TrendingUp,
  UserCheck,
  Shield,
  UserCog,
  PackageCheck,
  Clock,
  AlertCircle,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
  subItems?: NavItem[];
}

export interface RoleConfig {
  id: string;
  title: string;
  email: string;
  avatar: string;
  subtitle: string;
  icon: LucideIcon;
  badgeColor: string;
  navItems: NavItem[];
}

export const ROLES_CONFIG: Record<string, RoleConfig> = {
  admin: {
    id: 'admin',
    title: 'Enterprise Admin',
    email: 'admin@retailedge.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    subtitle: 'Central HQ enterprise control, edge node topology & security audits',
    icon: Shield,
    badgeColor: 'bg-indigo-600',
    navItems: [
      { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'admin_stores', label: 'Stores', icon: Store },
      { id: 'admin_employees', label: 'Employees', icon: Users },
      { id: 'admin_cameras', label: 'Cameras', icon: Camera },
      { id: 'admin_shopper', label: 'Shopper Analytics', icon: UserCheck },
      { id: 'admin_inventory', label: 'Inventory', icon: Package },
      { id: 'admin_queue', label: 'Queue Intelligence', icon: ShoppingCart },
      { id: 'admin_ai', label: 'AI Insights', icon: Activity },
      { id: 'admin_alerts', label: 'Alerts', icon: Bell },
      { id: 'admin_reports', label: 'Reports', icon: BarChart3 },
      { id: 'admin_integrations', label: 'Integrations', icon: Layers },
      { id: 'admin_privacy', label: 'Privacy & Security', icon: ShieldCheck },
      { id: 'admin_settings', label: 'Settings', icon: Settings }
    ]
  },
  manager: {
    id: 'manager',
    title: 'Store Manager',
    email: 'manager.chennai@retailedge.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    subtitle: 'Floor operations, spatial heatmaps & checkout queue dispatching',
    icon: UserCog,
    badgeColor: 'bg-blue-600',
    navItems: [
      { id: 'manager_dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'manager_shopper', label: 'Shopper Analytics', icon: UserCheck },
      { id: 'manager_inventory', label: 'Inventory', icon: Package },
      { id: 'manager_queue', label: 'Queue Intelligence', icon: ShoppingCart },
      { id: 'manager_staff', label: 'Staff Management', icon: Users },
      { id: 'manager_ai', label: 'AI Recommendations', icon: Activity },
      { id: 'manager_alerts', label: 'Alerts', icon: Bell },
      { id: 'manager_reports', label: 'Reports', icon: BarChart3 },
      { id: 'manager_settings', label: 'Store Settings', icon: Settings },
    ]
  },
  employee: {
    id: 'employee',
    title: 'Floor Employee',
    email: 'employee@retailedge.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    subtitle: 'Shelf restock tickets, tracking & planogram alignment',
    icon: PackageCheck,
    badgeColor: 'bg-emerald-600',
    navItems: [
      { id: 'emp_dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'emp_tasks', label: 'My Tasks', icon: CheckSquare },
      { id: 'emp_inventory', label: 'Inventory', icon: Package },
      { id: 'emp_queue', label: 'Queue Status', icon: ShoppingCart },
      { id: 'emp_alerts', label: 'Alerts', icon: AlertCircle },
      { id: 'emp_cameras', label: 'Live Cameras', icon: Camera },
      { id: 'emp_notifications', label: 'Notifications', icon: Bell },
      { id: 'emp_performance', label: 'My Performance', icon: TrendingUp },
      { id: 'emp_profile', label: 'Profile', icon: UserCog },
    ]
  }
};

export function AuthPortal() {
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-center items-center p-4 font-sans text-slate-800 antialiased">
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 bg-[#0d1424] rounded-2xl flex items-center justify-center mb-3 shadow-md">
          <span className="text-amber-500 text-2xl font-bold">⚡</span>
        </div>
        <h1 className="text-2xl font-black text-[#0d1424] tracking-tight">Retail Edge</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Secure Authentication Portal</p>
      </div>

      <SignIn routing="hash" />
    </div>
  );
}
