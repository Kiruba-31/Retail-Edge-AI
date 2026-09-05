import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Alert as AlertType, Task } from '../../../types';

interface AlertCardProps {
  item: AlertType | Task;
  onAction?: (id: string) => void;
}

export default function AlertCard({ item, onAction }: AlertCardProps) {
  // Discriminate based on available fields
  const isAlert = 'type' in item;
  
  const getColors = () => {
    if (isAlert) {
      switch (item.type) {
        case 'critical': return 'border-neon-red/50 bg-neon-red/10 text-neon-red';
        case 'warning': return 'border-neon-yellow/50 bg-neon-yellow/10 text-neon-yellow';
        case 'info': return 'border-neon-blue/50 bg-neon-blue/10 text-neon-blue';
      }
    } else {
      switch (item.priority) {
        case 'high': return 'border-neon-red/50 bg-neon-red/10 text-neon-red';
        case 'medium': return 'border-neon-yellow/50 bg-neon-yellow/10 text-neon-yellow';
        case 'normal': return 'border-neon-blue/50 bg-neon-blue/10 text-neon-blue';
      }
    }
    return 'border-gray-800 bg-surface text-gray-400';
  };

  const Icon = isAlert 
    ? (item.type === 'critical' ? AlertCircle : item.type === 'warning' ? AlertTriangle : Info)
    : (item.priority === 'high' ? AlertCircle : item.priority === 'medium' ? AlertTriangle : CheckCircle2);

  return (
    <div className={`border rounded-xl p-4 mb-3 transition-colors ${getColors().split(' ')[0]} ${getColors().split(' ')[1]} backdrop-blur-sm`}>
      <div className="flex gap-4">
        <div className={`mt-1 ${getColors().split(' ')[2]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-white">{title(item)}</h4>
            {isAlert && <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
          </div>
          <p className="text-sm text-gray-300 mb-3">{item.description}</p>
          
          {(isAlert ? item.actionable : item.status === 'pending') && (
            <button 
              onClick={() => onAction && onAction(item.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                (isAlert ? item.type : item.priority) === 'critical' || (isAlert ? item.type : item.priority) === 'high'
                  ? 'bg-neon-red text-white hover:bg-red-600'
                  : 'bg-surface border border-gray-700 text-white hover:bg-gray-800'
              }`}
            >
              {isAlert ? item.actionText : 'Start Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function title(item: AlertType | Task) {
  if ('title' in item) return item.title;
  return '';
}
