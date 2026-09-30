import React, { useState, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { GradeBadge, StatusBadge, RankBadge } from '../components/common/Badge';
import { Award, Printer, Download, GraduationCap } from 'lucide-react';

export default function MeritListPage() {
  const { students, examConfig } = useStudents();
  const [limit, setLimit] = useState(20);

  const meritStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
    return limit === 0 ? sorted : sorted.slice(0, limit);
  }, [students, limit]);

  const handlePrint = () => {
    window.print();
  };

  const maxTotal = examConfig?.maxTotalMarks || 600;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Institutional Academic Merit List</h1>
          <p className="text-xs text-slate-500 mt-0.5">Official merit roster formatted for institutional publishing and printing.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={limit}
            onChange={e => setLimit(parseInt(e.target.value, 10))}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-teal-500"
          >
            <option value={10}>Top 10 Students</option>
            <option value={20}>Top 20 Students</option>
            <option value={50}>Top 50 Students</option>
            <option value={0}>All Ranked Students</option>
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Merit List</span>
          </button>
        </div>
      </div>

      {/* Printable Merit Sheet Area */}
      <div id="printable-merit-area" className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">Department of Computer Science &amp; Engineering</h2>
          <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase">Annual Academic Merit Board &bull; DAA Semester Evaluation</p>
          <p className="text-[11px] text-slate-500">Published Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Merit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 text-center">Rank</th>
                <th className="py-2.5 px-3">Roll Number</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Total (Max {maxTotal})</th>
                <th className="py-2.5 px-3 text-center">Percentage</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {meritStudents.map(s => (
                <tr key={s.studentId} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-center font-bold font-mono">#{s.rank || 1}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{s.rollNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{s.department}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-800 font-mono">{s.total}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">{s.percentage}%</td>
                  <td className="py-2.5 px-3 text-center font-bold">{s.grade}</td>
                  <td className="py-2.5 px-3 text-center"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Signatures Footer (Visible on Print) */}
        <div className="pt-12 grid grid-cols-3 gap-8 text-center text-xs font-semibold text-slate-700 border-t border-slate-200">
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <span>DAA Lab Evaluator</span>
          </div>
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <span>Head of Department</span>
          </div>
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <span>Dean of Academic Affairs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
