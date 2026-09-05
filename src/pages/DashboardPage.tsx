import React, { useEffect, useState } from 'react';
import { 
  AdminDashboard, 
  StoreManagerDashboard, 
  InventoryDashboard, 
  OperationsDashboard 
} from '../components/RoleDashboards';

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Read the role selected before login
    const savedRole = localStorage.getItem('user_role');
    setRole(savedRole);
  }, []);

  // While checking role
  if (!role) {
    return <div style={{ padding: '24px' }}>Loading your designated dashboard...</div>;
  }

  // Render ONLY the designated dashboard
  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'store_manager':
      return <StoreManagerDashboard />;
    case 'inventory_staff':
      return <InventoryDashboard />;
    case 'operations_manager':
      return <OperationsDashboard />;
    default:
      return (
        <div style={{ padding: '24px' }}>
          <h2>No designation assigned.</h2>
          <a href="/login">Go back and select role</a>
        </div>
      );
  }
}
