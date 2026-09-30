import React from 'react';
import Modal from '../common/Modal';
import { GradeBadge, StatusBadge, RankBadge } from '../common/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStudents } from '../../context/StudentContext';

export default function StudentDetailsModal({ isOpen, onClose, student }) {
  const { examConfig } = useStudents();
  if (!student) return null;

  const maxMarks = examConfig?.maxMarksPerSubject || 100;
  const passingMarks = examConfig?.passingMarksPerSubject || 40;
  const numSubs = student.subjects?.length || examConfig?.numSubjects || 6;
  const maxPossibleTotal = numSubs * maxMarks;

  const chartData = (student.subjects || []).map(s => ({ name: s.name, marks: s.marks }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Academic Profile & Performance Card" maxWidth="max-w-2xl">
      <div className="space-y-5">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">{student.rollNumber}</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-xs text-slate-300">{student.studentId}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{student.name}</h2>
            <p className="text-xs text-slate-300 mt-0.5">{student.department}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1.5">
            <RankBadge rank={student.rank || 1} />
            <div className="text-2xl font-black text-teal-400">{student.percentage}%</div>
            <div className="flex items-center gap-1.5">
              <GradeBadge grade={student.grade} />
              <StatusBadge status={student.status} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium uppercase">Total Marks</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{student.total} / {maxPossibleTotal}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium uppercase">Subject Average</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{student.average} / {maxMarks}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium uppercase">Institutional Rank</span>
            <p className="text-lg font-bold text-teal-600 mt-0.5">#{student.rank || 'N/A'}</p>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Subject Performance Analysis</h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, maxMarks]} tickLine={false} />
                <Tooltip
                  formatter={(val) => [val + ' / ' + maxMarks, 'Marks Obtained']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="marks" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Subject</th>
                <th className="px-4 py-2.5 text-center">Max Marks</th>
                <th className="px-4 py-2.5 text-center">Obtained Marks</th>
                <th className="px-4 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(student.subjects || []).map((sub, i) => {
                const isFailing = sub.marks < passingMarks;
                return (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{sub.name}</td>
                    <td className="px-4 py-2.5 text-center text-slate-500 font-mono">{maxMarks}</td>
                    <td className={'px-4 py-2.5 text-center font-bold font-mono ' + (isFailing ? 'text-rose-600' : 'text-slate-900')}>
                      {sub.marks}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {!isFailing ? (
                        <span className="text-emerald-600 font-semibold">Pass (&ge;{passingMarks})</span>
                      ) : (
                        <span className="text-rose-600 font-bold">Fail (&lt;{passingMarks})</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
