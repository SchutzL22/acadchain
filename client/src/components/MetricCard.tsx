import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-brand-900 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-brand-50 rounded-lg text-brand-700">
          {icon}
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3">{description}</p>
    </div>
  );
};
