import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('user_role');

    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'store_manager':
        navigate('/store-manager/dashboard');
        break;
      case 'inventory_staff':
        navigate('/inventory/dashboard');
        break;
      case 'operations_manager':
        navigate('/operations/dashboard');
        break;
      default:
        navigate('/dashboard'); // fallback
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <p style={{ fontSize: '18px', color: '#4b5563' }}>Routing to your dashboard...</p>
    </div>
  );
}
