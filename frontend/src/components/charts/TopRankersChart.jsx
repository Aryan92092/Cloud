import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function TopRankersChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-sm text-slate-400">No Rank Data</div>;
  }
  const chartData = data.slice(0, 8).map(s => ({
    name: s.name.split(' ')[0],
    percentage: s.percentage,
    fullName: s.name,
    rollNumber: s.rollNumber,
    rank: s.rank
  }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" domain={[50, 100]} stroke="#64748b" fontSize={11} />
          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip
            formatter={(value, name, props) => [value + '% (Rank #' + props.payload.rank + ')', props.payload.fullName]}
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
          />
          <Bar dataKey="percentage" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
