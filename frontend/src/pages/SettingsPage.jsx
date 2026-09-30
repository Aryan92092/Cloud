import React, { useState, useEffect, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { Database, Sparkles, Sliders, CheckCircle2, RotateCcw, Save, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const {
    students,
    analytics,
    examConfig,
    updateExamConfig,
    resetExamConfig,
    loadDemoData,
    loading
  } = useStudents();
  const store = analytics?.storeStatus || {};

  const [numSubjects, setNumSubjects] = useState(6);
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState(100);
  const [passingMarksPerSubject, setPassingMarksPerSubject] = useState(40);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (examConfig) {
      setNumSubjects(examConfig.numSubjects || 6);
      setMaxMarksPerSubject(examConfig.maxMarksPerSubject || 100);
      setPassingMarksPerSubject(examConfig.passingMarksPerSubject || 40);
    }
  }, [examConfig]);

  const maxTotal = useMemo(() => {
    const s = Number(numSubjects) || 0;
    const m = Number(maxMarksPerSubject) || 0;
    return s * m;
  }, [numSubjects, maxMarksPerSubject]);

  const handleSave = async (e) => {
    e.preventDefault();
    const s = Number(numSubjects);
    const m = Number(maxMarksPerSubject);
    const p = Number(passingMarksPerSubject);

    if (isNaN(s) || s <= 0 || !Number.isInteger(s)) {
      setErrorMsg('Number of subjects must be an integer greater than 0');
      return;
    }
    if (isNaN(m) || m <= 0) {
      setErrorMsg('Maximum marks per subject must be greater than 0');
      return;
    }
    if (isNaN(p) || p < 0) {
      setErrorMsg('Passing marks must be greater than or equal to 0');
      return;
    }
    if (p > m) {
      setErrorMsg('Passing marks cannot be greater than maximum marks.');
      return;
    }

    setErrorMsg('');
    setSaving(true);
    await updateExamConfig({
      numSubjects: s,
      maxMarksPerSubject: m,
      passingMarksPerSubject: p
    });
    setSaving(false);
  };

  const handleReset = async () => {
    setErrorMsg('');
    setSaving(true);
    await resetExamConfig();
    setSaving(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">System Settings &amp; Marking Configuration</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure institutional marking rules, manage datasets, and inspect active engines.</p>
      </div>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* EXAMINATION MARKING CONFIGURATION                              */}
      {/* ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Examination Marking Configuration</h3>
              <p className="text-xs text-slate-500">Define course counts, maximum marks, and subject-wise passing thresholds.</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200/80 rounded-full">
            Active Scheme
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Subjects</label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={numSubjects}
                onChange={e => setNumSubjects(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum Marks Per Subject</label>
              <input
                type="number"
                min="1"
                required
                value={maxMarksPerSubject}
                onChange={e => setMaxMarksPerSubject(e.target.value)}
                placeholder="e.g. 50 or 100"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Passing Marks Per Subject</label>
              <input
                type="number"
                min="0"
                required
                value={passingMarksPerSubject}
                onChange={e => setPassingMarksPerSubject(e.target.value)}
                placeholder="e.g. 15 or 40"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Educational Calculation Preview Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-700">
              <span>Maximum Total Marks:</span>
              <strong className="text-slate-900 font-mono text-sm font-bold">
                {numSubjects} × {maxMarksPerSubject} = {maxTotal}
              </strong>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Current Passing Rule:</span>
              <span className="font-semibold text-teal-800 bg-teal-50/80 px-2 py-0.5 rounded border border-teal-200">
                Minimum {passingMarksPerSubject} marks required in every subject.
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading || saving}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset (100 / 40)</span>
            </button>
            <button
              type="submit"
              disabled={loading || saving}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving…' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* STORAGE ENGINE STATUS                                          */}
      {/* ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Active Storage Engine</h3>
            <p className="text-xs text-teal-600 font-semibold">{store.engine || 'Dual In-Memory JSON & MongoDB'}</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex justify-between">
            <span>Total Student Records:</span>
            <strong className="text-slate-900 font-mono">{students.length}</strong>
          </div>
          <div className="flex justify-between">
            <span>Database Mode:</span>
            <strong className="text-emerald-700">Auto-Fallback Active (Zero Config)</strong>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* GENERATE REALISTIC DATASET                                     */}
      {/* ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Generate Realistic Dataset</h3>
            <p className="text-xs text-slate-500">Instantly populate realistic student marks under current scheme.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button onClick={() => loadDemoData(100)} disabled={loading} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition">
            100 Students
          </button>
          <button onClick={() => loadDemoData(500)} disabled={loading} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition">
            500 Students
          </button>
          <button onClick={() => loadDemoData(1000)} disabled={loading} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition">
            1,000 Students
          </button>
          <button onClick={() => loadDemoData(5000)} disabled={loading} className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs font-bold text-teal-800 transition">
            5,000 Students
          </button>
        </div>
      </div>
    </div>
  );
}
