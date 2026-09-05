import React, { useEffect, useState } from 'react';

// 1. ADMIN DASHBOARD
export function AdminDashboard() {
  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
            Logged in as: Administrator
          </span>
          <h1 style={{ marginTop: '8px', fontSize: '24px' }}>System Administration & Governance</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>User Accounts</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>148 Active</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Platform Security</h4>
          <p style={{ color: '#16a34a', fontWeight: 'bold' }}>Optimal (0 Breaches)</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Audit Trail</h4>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>Last config changed 14m ago</p>
        </div>
      </div>
    </div>
  );
}

// 2. STORE MANAGER DASHBOARD
export function StoreManagerDashboard() {
  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
            Logged in as: Store Manager
          </span>
          <h1 style={{ marginTop: '8px', fontSize: '24px' }}>Store Floor & Counter Performance</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Today's Counter Sales</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹84,320</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Active Billing Terminals</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>4 / 5 Online</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Cashier Shift Attendance</h4>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>8 on duty, 1 leave</p>
        </div>
      </div>
    </div>
  );
}

// 3. INVENTORY STAFF DASHBOARD
export function InventoryDashboard() {
  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#d1fae5', color: '#047857', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
            Logged in as: Inventory Staff
          </span>
          <h1 style={{ marginTop: '8px', fontSize: '24px' }}>Warehouse Stock & Scanning</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Low Stock Alerts</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>19 Items Critical</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Inbound Shipments</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>3 Trucks Pending Entry</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Barcode Inward Tool</h4>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>Ready for scanner input</p>
        </div>
      </div>
    </div>
  );
}

// 4. OPERATIONS MANAGER DASHBOARD
export function OperationsDashboard() {
  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
            Logged in as: Operations Manager
          </span>
          <h1 style={{ marginTop: '8px', fontSize: '24px' }}>Logistics, Supply Chain & Dispatches</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Fleet In-Transit</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>11 En Route</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Pending Purchase Orders (POs)</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>6 Approvals Required</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4>Store Replenishment Routes</h4>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>North Sector fully cleared</p>
        </div>
      </div>
    </div>
  );
}

// MAIN CONTROLLER
export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Read the role selected prior to Clerk Google authentication
    const activeRole = localStorage.getItem('user_role');
    setRole(activeRole);
  }, []);

  if (!role) {
    return <div style={{ padding: '32px' }}>Authenticating user permissions...</div>;
  }

  // Renders strictly the matched interface; no cross-role overlap
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
        <div style={{ padding: '32px' }}>
          <h2>Unrecognized designation assigned.</h2>
          <a href="/login">Return to role selection</a>
        </div>
      );
  }
}
