import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { ALGORITHM_METADATA } from '../data/algorithmMetadata';
import { Cpu, Play, Clock, ArrowRightLeft, Layers, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

export default function ResultProcessingPage() {
  const { students, examConfig, processAndRank, lastMetrics, loading } = useStudents();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('merge-sort');

  const handleProcess = async () => {
    await processAndRank(selectedAlgorithm);
  };

  const currentMeta = ALGORITHM_METADATA[selectedAlgorithm] || {};

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">DAA Result Processing &amp; Ranking Engine</h1>
        <p className="text-xs text-slate-500 mt-0.5">Select an algorithm to sort academic scores and compute institutional ranks.</p>
      </div>

      {/* Current Marking Scheme Educational Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Current Marking Scheme</h3>
              <p className="text-xs text-slate-300">Active rules applied during result calculation and ranking</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 w-fit">
            Active Examination Model
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block mb-0.5">Number of Subjects</span>
            <span className="text-lg font-bold font-mono text-white">{examConfig?.numSubjects || 6}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block mb-0.5">Maximum Marks / Subject</span>
            <span className="text-lg font-bold font-mono text-teal-400">{examConfig?.maxMarksPerSubject || 100}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block mb-0.5">Passing Marks / Subject</span>
            <span className="text-lg font-bold font-mono text-amber-400">{examConfig?.passingMarksPerSubject || 40}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block mb-0.5">Maximum Total</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{examConfig?.maxTotalMarks || 600}</span>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-300">
            <strong className="text-teal-300">Passing Rule:</strong> Minimum <strong>{examConfig?.passingMarksPerSubject || 40}</strong> marks in every subject.
          </span>
          <span className="text-[11px] text-slate-400">
            Editable in <strong>Settings</strong> or when clicking <strong>Import CSV</strong>
          </span>
        </div>
      </div>

      {/* Selection Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Choose Sorting Algorithm</label>
            <select
              value={selectedAlgorithm}
              onChange={e => setSelectedAlgorithm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/50"
            >
              {Object.keys(ALGORITHM_METADATA).map(key => (
                <option key={key} value={key}>
                  {ALGORITHM_METADATA[key].name} ({ALGORITHM_METADATA[key].category})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleProcess}
              disabled={loading || students.length === 0}
              className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Process &amp; Rank {students.length} Records</span>
            </button>
          </div>
        </div>

        {/* Selected Algorithm Educational Specs */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">{currentMeta.name} Theoretical Specification</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              {currentMeta.category}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">{currentMeta.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Best Case</span>
              <span className="font-bold font-mono text-emerald-600">{currentMeta.bestTime}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Average Case</span>
              <span className="font-bold font-mono text-blue-600">{currentMeta.avgTime}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Worst Case</span>
              <span className="font-bold font-mono text-rose-600">{currentMeta.worstTime}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Auxiliary Space</span>
              <span className="font-bold font-mono text-purple-600">{currentMeta.space}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Performance Telemetry */}
      {lastMetrics && (
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Last Execution Metrics: {lastMetrics.algorithm}</h3>
                <p className="text-xs text-teal-400 font-mono">Measured on {lastMetrics.studentsCount} Student Records</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Complete
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Execution Time</span>
              <span className="text-xl font-bold font-mono text-teal-400">{lastMetrics.executionTimeMs} ms</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Comparisons Count</span>
              <span className="text-xl font-bold font-mono text-blue-400">{(lastMetrics.comparisons || 0).toLocaleString()}</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Swaps / Shifts</span>
              <span className="text-xl font-bold font-mono text-amber-400">{(lastMetrics.swaps || 0).toLocaleString()}</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Space Overhead</span>
              <span className="text-xl font-bold font-mono text-purple-400">{lastMetrics.spaceComplexity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
