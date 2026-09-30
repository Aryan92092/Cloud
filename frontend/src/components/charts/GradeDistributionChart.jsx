import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const GRADE_COLORS = {
  'A+': '#059669', 'A': '#0d9488', 'B+': '#0284c7', 'B': '#3b82f6', 'C': '#f59e0b', 'D': '#f97316', 'F': '#e11d48'
};

export default function GradeDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-sm text-slate-400">No Grade Data Available</div>;
  }
  const chartData = data.map(item => ({ ...item, fill: GRADE_COLORS[item.grade] || '#64748b' }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="grade" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(value) => [value + ' Students', 'Count']}
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
