import { Store, Alert, Task, AIRecommendation, InventoryItem, Camera } from '../types';

export const mockStores: Store[] = [
  { id: 'S1', name: 'Chennai Central', location: 'Chennai', status: 'online', capacity: 1200, occupancy: 850, inventoryHealth: 94, queueCount: 12, avgWaitTime: 6.2, cameraCount: 32, activeCameras: 31, employeeCount: 126 },
  { id: 'S2', name: 'Chennai North', location: 'Chennai', status: 'online', capacity: 800, occupancy: 420, inventoryHealth: 96, queueCount: 4, avgWaitTime: 1.5, cameraCount: 24, activeCameras: 24, employeeCount: 85 },
  { id: 'S3', name: 'Bangalore Central', location: 'Bangalore', status: 'online', capacity: 1500, occupancy: 1100, inventoryHealth: 91, queueCount: 5, avgWaitTime: 2.1, cameraCount: 48, activeCameras: 48, employeeCount: 150 },
  { id: 'S4', name: 'Coimbatore', location: 'Coimbatore', status: 'warning', capacity: 900, occupancy: 820, inventoryHealth: 88, queueCount: 8, avgWaitTime: 4.5, cameraCount: 28, activeCameras: 26, employeeCount: 92 },
  { id: 'S5', name: 'Madurai', location: 'Madurai', status: 'offline', capacity: 750, occupancy: 0, inventoryHealth: 0, queueCount: 0, avgWaitTime: 0, cameraCount: 20, activeCameras: 0, employeeCount: 78 },
];

export const mockAlerts: Alert[] = [
  { id: 'A1', type: 'critical', category: 'queue', title: 'Queue Congestion', description: 'Queue at Counter 2 exceeds optimal length.', storeId: 'S1', timestamp: new Date().toISOString(), actionable: true, actionText: 'Open Counter 4' },
  { id: 'A2', type: 'critical', category: 'inventory', title: 'Out of Stock', description: 'Milk (A12) is out of stock.', storeId: 'S1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), actionable: true, actionText: 'Assign Restock' },
  { id: 'A3', type: 'warning', category: 'camera', title: 'Camera Offline', description: 'CAM-05 (Electronics) went offline.', storeId: 'S1', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
];

export const mockTasks: Task[] = [
  { id: 'T1', priority: 'high', title: 'Restock Milk', description: 'Current Stock: 3', status: 'pending', location: 'Shelf: A12' },
  { id: 'T2', priority: 'medium', title: 'Fix Planogram', description: 'Items misplaced in bakery section', status: 'pending', location: 'Shelf: B04' },
  { id: 'T3', priority: 'normal', title: 'Check Grocery Section', description: 'Routine check for spills', status: 'pending', location: 'Aisle 3' },
];

export const mockAIRecommendations: AIRecommendation[] = [
  { id: 'R1', type: 'queue', prediction: 'Queue at Chennai Store predicted to reach 18 customers in 10 minutes.', recommendation: 'Open Counter 4.', actionText: 'Take Action' },
  { id: 'R2', type: 'inventory', prediction: 'Milk stock at Shelf A12 expected to reach zero within 2 hours.', recommendation: 'Restock approximately 20 units.', actionText: 'Assign Task' },
];

export const mockInventory: InventoryItem[] = [
  { id: 'I1', name: 'Milk', location: 'A12', currentStock: 3, maxStock: 20, status: 'out-of-stock' },
  { id: 'I2', name: 'Bread', location: 'A15', currentStock: 0, maxStock: 15, status: 'out-of-stock' },
  { id: 'I3', name: 'Juice', location: 'B04', currentStock: 5, maxStock: 30, status: 'low' },
];

export const mockCameras: Camera[] = [
  { id: 'C1', name: 'CAM-01', zone: 'Entrance', status: 'online', aiModel: 'Footfall Tracking v2' },
  { id: 'C2', name: 'CAM-02', zone: 'Grocery', status: 'online', aiModel: 'Inventory Monitor v1' },
  { id: 'C3', name: 'CAM-03', zone: 'Shelf A12', status: 'online', aiModel: 'Planogram Checker' },
  { id: 'C4', name: 'CAM-04', zone: 'Billing', status: 'online', aiModel: 'Queue Intelligence' },
  { id: 'C5', name: 'CAM-05', zone: 'Electronics', status: 'offline', aiModel: 'Dwell Time Tracker' },
];
