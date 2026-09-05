import React from 'react';
import { PackageOpen } from 'lucide-react';

interface Props {
  title: string;
}

export default function PlaceholderView({ title }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="p-4 rounded-full bg-surface-hover mb-4">
        <PackageOpen className="w-12 h-12 text-gray-500" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 max-w-md mx-auto">
        This module is currently under development or not fully integrated into the prototype.
      </p>
    </div>
  );
}
