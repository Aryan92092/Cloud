import React, { useState } from 'react';
import { api } from '../services/api';
import { GradeBadge, StatusBadge, RankBadge } from '../components/common/Badge';
import { Search, Zap, CheckCircle2, Clock, Layers, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState('rollNumber');
  const [algorithm, setAlgorithm] = useState('linear');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await api.searchStudents({ algorithm, searchField, query });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Student Record Search (Linear vs Binary)</h1>
        <p className="text-xs text-slate-500 mt-0.5">Compare sequential scanning O(n) against pre-sorted binary search O(log n).</p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Search Attribute</label>
              <select
                value={searchField}
                onChange={e => setSearchField(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                <option value="rollNumber">Roll Number</option>
                <option value="studentId">Student ID</option>
                <option value="name">Student Full Name</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAlgorithm('linear')}
                  className={'py-2.5 px-3 rounded-xl text-xs font-bold border transition ' +
                    (algorithm === 'linear' ? 'bg-teal-500 text-slate-950 border-teal-500' : 'bg-slate-50 text-slate-700 border-slate-200')}
                >
                  Linear Search O(n)
                </button>
                <button
                  type="button"
                  onClick={() => setAlgorithm('binary')}
                  className={'py-2.5 px-3 rounded-xl text-xs font-bold border transition ' +
                    (algorithm === 'binary' ? 'bg-teal-500 text-slate-950 border-teal-500' : 'bg-slate-50 text-slate-700 border-slate-200')}
                >
                  Binary Search O(log n)
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Search Term</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. CS20260001 or Aarav"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Search Result Telemetry */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium uppercase">Algorithm Used</span>
              <p className="text-base font-bold text-teal-700 mt-1">{result.algorithm}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium uppercase">Comparisons</span>
              <p className="text-base font-bold text-blue-600 font-mono mt-1">{result.comparisons}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium uppercase">Execution Time</span>
              <p className="text-base font-bold text-amber-600 font-mono mt-1">{result.executionTime} ms</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium uppercase">Time Complexity</span>
              <p className="text-base font-bold text-purple-600 font-mono mt-1">{result.timeComplexity?.average}</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Found {result.results?.length || 0} Student Match(es)</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-center">Rank</th>
                  <th className="px-4 py-2.5">Roll No</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Department</th>
                  <th className="px-4 py-2.5 text-center">Total</th>
                  <th className="px-4 py-2.5 text-center">%</th>
                  <th className="px-4 py-2.5 text-center">Grade</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(!result.results || result.results.length === 0) ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-slate-400">No students found matching your query.</td>
                  </tr>
                ) : (
                  result.results.map(s => (
                    <tr key={s.studentId} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-center"><RankBadge rank={s.rank || 1} /></td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-700">{s.rollNumber}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 text-slate-600">{s.department}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800">{s.total}</td>
                      <td className="px-4 py-3 text-center font-bold text-teal-600">{s.percentage}%</td>
                      <td className="px-4 py-3 text-center"><GradeBadge grade={s.grade} /></td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
