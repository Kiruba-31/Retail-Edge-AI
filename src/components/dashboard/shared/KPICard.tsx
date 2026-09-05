import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function KPICard({ title, value, icon: Icon, trend, trendUp, colorClass = "text-neon-blue" }: KPICardProps) {
  return (
    <div className="bg-surface border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg bg-background ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-display font-bold text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trendUp ? 'text-neon-green' : 'text-neon-red'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
