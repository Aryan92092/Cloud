import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function PassFailPieChart({ passedCount = 0, failedCount = 0 }) {
  const data = [
    { name: 'Passed', value: passedCount, color: '#10b981' },
    { name: 'Failed', value: failedCount, color: '#f43f5e' }
  ];
  if (passedCount === 0 && failedCount === 0) {
    return <div className="h-64 flex items-center justify-center text-sm text-slate-400">No Student Records</div>;
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={'cell-' + index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val, name) => [val + ' Students', name]}
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
