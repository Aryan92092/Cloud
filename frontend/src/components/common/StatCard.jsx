import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'teal' }) {
  const colorStyles = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={'w-9 h-9 rounded-lg flex items-center justify-center border ' + (colorStyles[color] || colorStyles.teal)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {subtitle}
        </div>
      )}
    </div>
  );
}
