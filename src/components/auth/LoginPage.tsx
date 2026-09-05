import React, { useState } from 'react';
import { SignIn } from '@clerk/react';

const roles = [
  { id: 'admin', label: 'Admin' },
  { id: 'store_manager', label: 'Store Manager' },
  { id: 'inventory_staff', label: 'Inventory Staff' },
  { id: 'operations_manager', label: 'Operations Manager' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    localStorage.setItem('user_role', roleId);
    setSelectedRole(roleId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      
      {!selectedRole ? (
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '380px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Select Your Role</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>Please choose your designation to continue</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#f9fafb',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#f9fafb')}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedRole(null)} 
            style={{ marginBottom: '12px', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}
          >
            ← Change Role ({roles.find(r => r.id === selectedRole)?.label})
          </button>
          
          <SignIn forceRedirectUrl={`/dashboard?role=${selectedRole}`} fallbackRedirectUrl={`/dashboard?role=${selectedRole}`} />
        </div>
      )}

    </div>
  );
}
