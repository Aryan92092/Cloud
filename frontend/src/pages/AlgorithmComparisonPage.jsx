import React, { useState } from 'react';
import { api } from '../services/api';
import BenchmarkChart from '../components/charts/BenchmarkChart';
import { Play, BarChart3, Clock, ArrowRight, Download, ShieldCheck } from 'lucide-react';

export default function AlgorithmComparisonPage() {
  const [loading, setLoading] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([10, 50, 100, 500, 1000, 5000]);

  const runBenchmarks = async () => {
    try {
      setLoading(true);
      const res = await api.runBenchmark(selectedSizes);
      setBenchmarkData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const matrix = benchmarkData?.theoreticalMatrix || [
    { id: 'bubble-sort', name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { id: 'selection-sort', name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { id: 'insertion-sort', name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { id: 'merge-sort', name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { id: 'quick-sort', name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    { id: 'heap-sort', name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Empirical Algorithm Benchmarking &amp; Comparison</h1>
          <p className="text-xs text-slate-500 mt-0.5">Analyze measured execution timings vs. theoretical Big-O algorithmic complexity.</p>
        </div>
        <button
          onClick={runBenchmarks}
          disabled={loading}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
        >
          <Play className={'w-4 h-4 fill-white ' + (loading ? 'animate-spin' : '')} />
          <span>{loading ? 'Running Live Benchmarks...' : 'Run Full Benchmark Suite'}</span>
        </button>
      </div>

      {/* Theoretical Complexity Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Theoretical Asymptotic Complexity Master Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Algorithm Name</th>
                <th className="px-5 py-3 text-center">Best Case Time</th>
                <th className="px-5 py-3 text-center">Average Case Time</th>
                <th className="px-5 py-3 text-center">Worst Case Time</th>
                <th className="px-5 py-3 text-center">Auxiliary Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{row.name}</td>
                  <td className="px-5 py-3.5 text-center font-mono font-semibold text-emerald-600">{row.best}</td>
                  <td className="px-5 py-3.5 text-center font-mono font-semibold text-blue-600">{row.avg}</td>
                  <td className="px-5 py-3.5 text-center font-mono font-semibold text-rose-600">{row.worst}</td>
                  <td className="px-5 py-3.5 text-center font-mono font-semibold text-purple-600">{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Benchmark Execution Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Empirical Execution Time (ms) vs. Dataset Size (N)</h3>
          <p className="text-xs text-slate-500">Real-time execution duration measured on client &amp; server processors.</p>
        </div>
        <BenchmarkChart benchmarkResults={benchmarkData?.benchmarkResults || []} />
      </div>

      {/* Detailed Empirical Results Table */}
      {benchmarkData?.benchmarkResults && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800">Measured Benchmark Results (Execution Time in ms)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Input Size (N)</th>
                  <th className="px-4 py-3 text-center">Bubble Sort</th>
                  <th className="px-4 py-3 text-center">Selection Sort</th>
                  <th className="px-4 py-3 text-center">Insertion Sort</th>
                  <th className="px-4 py-3 text-center">Merge Sort</th>
                  <th className="px-4 py-3 text-center">Quick Sort</th>
                  <th className="px-4 py-3 text-center">Heap Sort</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {benchmarkData.benchmarkResults.map(r => (
                  <tr key={r.size} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-900 font-sans">N = {r.size}</td>
                    <td className="px-4 py-3 text-center text-rose-600">{r.algorithms['bubble-sort']?.executionTime} ms</td>
                    <td className="px-4 py-3 text-center text-orange-600">{r.algorithms['selection-sort']?.executionTime} ms</td>
                    <td className="px-4 py-3 text-center text-amber-600">{r.algorithms['insertion-sort']?.executionTime} ms</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">{r.algorithms['merge-sort']?.executionTime} ms</td>
                    <td className="px-4 py-3 text-center text-cyan-600 font-bold">{r.algorithms['quick-sort']?.executionTime} ms</td>
                    <td className="px-4 py-3 text-center text-purple-600 font-bold">{r.algorithms['heap-sort']?.executionTime} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
