export type Role = 'admin' | 'manager' | 'employee' | 'consumer';

export interface Store {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'warning' | 'offline';
  capacity: number;
  occupancy: number;
  inventoryHealth: number; // percentage
  queueCount: number;
  avgWaitTime: number; // in minutes
  cameraCount: number;
  activeCameras: number;
  employeeCount: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'inventory' | 'queue' | 'camera' | 'system';
  title: string;
  description: string;
  storeId?: string;
  timestamp: string;
  actionable?: boolean;
  actionText?: string;
}

export interface Task {
  id: string;
  priority: 'high' | 'medium' | 'normal';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  location: string; // e.g., "Shelf A12"
}

export interface AIRecommendation {
  id: string;
  type: 'queue' | 'inventory' | 'staffing';
  prediction: string;
  recommendation: string;
  actionText: string;
  storeId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  location: string;
  currentStock: number;
  maxStock: number;
  status: 'optimal' | 'low' | 'out-of-stock';
}

export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: 'online' | 'offline';
  aiModel: string;
}
