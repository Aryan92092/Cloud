import React from 'react';

export function GradeBadge({ grade }) {
  const styles = {
    'A+': 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    'A': 'bg-teal-50 text-teal-700 border-teal-200 font-bold',
    'B+': 'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
    'B': 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
    'C': 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
    'D': 'bg-orange-50 text-orange-700 border-orange-200 font-medium',
    'F': 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
  };
  return (
    <span className={'inline-flex items-center px-2 py-0.5 rounded text-xs border ' + (styles[grade] || 'bg-slate-100 text-slate-700 border-slate-200')}>
      {grade}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (status === 'PASS') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        PASS
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
      FAIL
    </span>
  );
}

export function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
        🥇 Rank 1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
        🥈 Rank 2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
        🥉 Rank 3
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      #{rank}
    </span>
  );
}
