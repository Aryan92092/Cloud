import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const ALG_COLORS = {
  'bubble-sort': '#ef4444',
  'selection-sort': '#f97316',
  'insertion-sort': '#eab308',
  'merge-sort': '#10b981',
  'quick-sort': '#06b6d4',
  'heap-sort': '#8b5cf6'
};

export default function BenchmarkChart({ benchmarkResults }) {
  if (!benchmarkResults || benchmarkResults.length === 0) {
    return <div className="h-72 flex items-center justify-center text-sm text-slate-400">Run benchmark to generate charts</div>;
  }
  const chartData = benchmarkResults.map(r => {
    const point = { size: 'N=' + r.size };
    Object.keys(r.algorithms).forEach(algKey => {
      const val = r.algorithms[algKey].executionTime;
      point[algKey] = typeof val === 'number' ? val : null;
    });
    return point;
  });
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="size" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit="ms" />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }} />
          <Legend />
          <Line type="monotone" dataKey="bubble-sort" name="Bubble Sort" stroke={ALG_COLORS['bubble-sort']} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="selection-sort" name="Selection Sort" stroke={ALG_COLORS['selection-sort']} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="insertion-sort" name="Insertion Sort" stroke={ALG_COLORS['insertion-sort']} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="merge-sort" name="Merge Sort" stroke={ALG_COLORS['merge-sort']} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="quick-sort" name="Quick Sort" stroke={ALG_COLORS['quick-sort']} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="heap-sort" name="Heap Sort" stroke={ALG_COLORS['heap-sort']} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
