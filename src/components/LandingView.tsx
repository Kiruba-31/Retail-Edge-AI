import React from 'react';
import { Role } from '../types';
import { ShieldAlert, Users, Store, UserCircle } from 'lucide-react';

interface Props {
  onSelectRole: (role: Role) => void;
}

export default function LandingView({ onSelectRole }: Props) {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 font-body">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
          RetailEdge AI System
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          NVIDIA Jetson Orin Nano powered Retail Intelligence. Select your role to access the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        <RoleCard 
          title="Admin" 
          description="Complete store management, full analytics, and system configuration." 
          icon={<ShieldAlert className="w-8 h-8 text-neon-blue" />} 
          onClick={() => onSelectRole('admin')}
          borderColor="border-neon-blue/30"
          hoverColor="hover:border-neon-blue"
        />
        <RoleCard 
          title="Store Manager" 
          description="Store KPIs, alerts, and AI decision center." 
          icon={<Store className="w-8 h-8 text-neon-purple" />} 
          onClick={() => onSelectRole('manager')}
          borderColor="border-neon-purple/30"
          hoverColor="hover:border-neon-purple"
        />
        <RoleCard 
          title="Employee" 
          description="Daily operational tasks, inventory actions, and alerts." 
          icon={<Users className="w-8 h-8 text-neon-green" />} 
          onClick={() => onSelectRole('employee')}
          borderColor="border-neon-green/30"
          hoverColor="hover:border-neon-green"
        />
        <RoleCard 
          title="Consumer (Legacy)" 
          description="View the original consumer-facing application." 
          icon={<UserCircle className="w-8 h-8 text-gray-400" />} 
          onClick={() => onSelectRole('consumer')}
          borderColor="border-gray-700"
          hoverColor="hover:border-gray-500"
        />
      </div>
    </div>
  );
}

function RoleCard({ title, description, icon, onClick, borderColor, hoverColor }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-surface border ${borderColor} ${hoverColor} rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center group`}
    >
      <div className="mb-4 p-4 rounded-full bg-surface-hover group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
