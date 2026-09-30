import React, { useState, useEffect, useRef } from 'react';
import { useStudents } from '../context/StudentContext';
import { VISUALIZER_ALGORITHMS } from '../algorithms/visualizer/stepGenerators';
import { ALGORITHM_METADATA } from '../data/algorithmMetadata';
import { Play, Pause, RotateCcw, SkipForward, Sliders, Cpu, Info, Sparkles } from 'lucide-react';

export default function AlgorithmVisualizerPage() {
  const { students } = useStudents();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble-sort');
  const [sampleSize, setSampleSize] = useState(15);
  const [speed, setSpeed] = useState(250);
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState({
    array: [],
    comparing: [],
    swapped: [],
    sorted: [],
    pivot: -1,
    message: 'Ready to begin simulation.',
    comparisons: 0,
    swaps: 0
  });

  const generatorRef = useRef(null);
  const timerRef = useRef(null);

  const initData = () => {
    const source = students.length > 0 ? students : [];
    const subset = source.slice(0, sampleSize).map((s, idx) => ({
      id: s.studentId || ('STU' + idx),
      name: s.name || ('Student ' + (idx + 1)),
      percentage: s.percentage || Math.floor(40 + Math.random() * 58),
      total: s.total || 450
    }));
    return subset;
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    const initialData = initData();
    const genFactory = VISUALIZER_ALGORITHMS[selectedAlgorithm] || VISUALIZER_ALGORITHMS['bubble-sort'];
    generatorRef.current = genFactory(initialData);
    const firstStep = generatorRef.current.next();
    if (!firstStep.done && firstStep.value) {
      setCurrentState(firstStep.value);
    } else {
      setCurrentState({
        array: initialData,
        comparing: [],
        swapped: [],
        sorted: [],
        pivot: -1,
        message: 'Initialized dataset for visualizer.',
        comparisons: 0,
        swaps: 0
      });
    }
  };

  useEffect(() => {
    reset();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [selectedAlgorithm, sampleSize, students]);

  const stepForward = () => {
    if (!generatorRef.current) return;
    const next = generatorRef.current.next();
    if (!next.done && next.value) {
      setCurrentState(next.value);
    } else {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        stepForward();
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, speed]);

  const meta = ALGORITHM_METADATA[selectedAlgorithm] || {};

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Interactive DAA Algorithm Visualizer</h1>
          <p className="text-xs text-slate-500 mt-0.5">Step-by-step visual execution of sorting algorithms on student percentage bars.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-lg">
            Time: {meta.avgTime} &bull; Space: {meta.space}
          </span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Algorithm</label>
            <select
              value={selectedAlgorithm}
              onChange={e => setSelectedAlgorithm(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
            >
              {Object.keys(ALGORITHM_METADATA).map(k => (
                <option key={k} value={k}>{ALGORITHM_METADATA[k].name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dataset Size</label>
            <select
              value={sampleSize}
              onChange={e => setSampleSize(parseInt(e.target.value, 10))}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value={10}>10 Students</option>
              <option value={15}>15 Students</option>
              <option value={25}>25 Students</option>
              <option value={40}>40 Students</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Speed ({speed}ms)</label>
            <input
              type="range"
              min="30"
              max="800"
              step="20"
              value={speed}
              onChange={e => setSpeed(parseInt(e.target.value, 10))}
              className="w-28 accent-teal-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={'px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 ' +
              (isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white')}
          >
            {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-white" /> Start</>}
          </button>
          <button
            onClick={stepForward}
            disabled={isRunning}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <SkipForward className="w-4 h-4" /> Step
          </button>
          <button
            onClick={reset}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6">
        {/* Metrics Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs border-b border-slate-800 pb-4 text-slate-300">
          <div className="flex items-center gap-4">
            <div>Algorithm: <span className="font-bold text-teal-400 font-mono">{meta.name}</span></div>
            <div>Comparisons: <span className="font-bold text-sky-400 font-mono">{currentState.comparisons}</span></div>
            <div>Swaps / Shifts: <span className="font-bold text-amber-400 font-mono">{currentState.swaps}</span></div>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-teal-500"></span> Default</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Comparing</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Swapped</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500"></span> Pivot</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Sorted</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="h-72 flex items-end justify-center gap-1.5 sm:gap-2 px-2 pt-6">
          {(currentState.array || []).map((item, idx) => {
            const isComparing = (currentState.comparing || []).includes(idx);
            const isSwapped = (currentState.swapped || []).includes(idx);
            const isSorted = (currentState.sorted || []).includes(idx);
            const isPivot = currentState.pivot === idx;

            let barColor = 'bg-teal-600/80 hover:bg-teal-500';
            if (isComparing) barColor = 'bg-amber-400 shadow-lg shadow-amber-500/50 scale-y-105';
            if (isSwapped) barColor = 'bg-rose-500 shadow-lg shadow-rose-500/50';
            if (isPivot) barColor = 'bg-purple-500 shadow-lg shadow-purple-500/50';
            if (isSorted) barColor = 'bg-emerald-500';

            const heightPercent = Math.max(12, item.percentage || 40);

            return (
              <div key={item.id || idx} className="flex-1 flex flex-col items-center h-full justify-end max-w-[48px] group transition-all duration-150">
                <span className="text-[10px] font-mono text-slate-300 mb-1 font-bold">{item.percentage}%</span>
                <div
                  style={{ height: heightPercent + '%' }}
                  className={'w-full rounded-t-md transition-all duration-150 ' + barColor}
                ></div>
                <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full text-center group-hover:text-white">
                  {item.name?.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Explanation Banner */}
        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-mono text-teal-300 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span className="truncate">{currentState.message}</span>
        </div>
      </div>
    </div>
  );
}
