import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';
import { Role } from '../../../types';

interface TopNavProps {
  role: Role;
  storeName?: string;
}

export default function TopNav({ role, storeName }: TopNavProps) {
  return (
    <header className="h-16 border-b border-gray-800 bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {storeName ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Location:</span>
            <span className="font-semibold text-white">{storeName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Global Overview</span>
            <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse"></span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-background border border-gray-800 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-neon-blue transition-colors w-64"
          />
        </div>
        
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-red rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-gray-800">
          <UserCircle className="w-8 h-8 text-gray-400" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium capitalize leading-tight">{role}</p>
            <p className="text-xs text-gray-500 leading-tight">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
}
