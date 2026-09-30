import React from 'react';
import { useStudents } from '../context/StudentContext';
import { Trophy, Award, GitMerge, Check, AlertCircle } from 'lucide-react';
import { RankBadge } from '../components/common/Badge';

export default function RankingEnginePage() {
  const { students } = useStudents();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Student Ranking Engine &amp; Tie-Breaker Logic</h1>
        <p className="text-xs text-slate-500 mt-0.5">Mathematical formulation of institutional competition ranking (1224 scheme).</p>
      </div>

      {/* Tie-Breaker Comparator Logic Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm mb-3 border border-teal-100">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Primary: Percentage &darr;</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students are strictly ordered by descending overall aggregate percentage. Higher score takes higher rank.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-3 border border-blue-100">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Secondary: Total Marks &darr;</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            If two students have identical percentage, the student with the higher absolute sum of subject marks is prioritized.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-3 border border-purple-100">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Tertiary: Name Alphabetical &uarr;</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In case of identical percentage and total marks, students are ordered lexicographically by full legal name.
          </p>
        </div>
      </div>

      {/* Top 20 Ranked Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Institutional Leaderboard (Top 20)</h3>
          <span className="text-xs font-medium text-slate-500">Standard Competition Ranking (1224)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-center">Assigned Rank</th>
                <th className="px-5 py-3">Roll Number</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3 text-center">Total Marks</th>
                <th className="px-5 py-3 text-center">Percentage</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice(0, 20).map(s => (
                <tr key={s.studentId} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3 text-center"><RankBadge rank={s.rank || 1} /></td>
                  <td className="px-5 py-3 font-mono font-medium text-slate-700">{s.rollNumber}</td>
                  <td className="px-5 py-3 font-bold text-slate-900">{s.name}</td>
                  <td className="px-5 py-3 text-slate-600">{s.department}</td>
                  <td className="px-5 py-3 text-center font-semibold text-slate-800">{s.total}</td>
                  <td className="px-5 py-3 text-center font-bold text-teal-600">{s.percentage}%</td>
                  <td className="px-5 py-3 text-center">
                    <span className={'px-2 py-0.5 rounded text-[11px] font-bold ' + (s.status === 'PASS' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50')}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
