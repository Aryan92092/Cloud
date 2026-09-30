import React from 'react';
import { Sparkles, RefreshCw, PlusCircle } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export default function Navbar({ currentPage, onOpenAddStudent }) {
  const { loading, loadDemoData, fetchStudentsAndAnalytics } = useStudents();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Academic Performance Dashboard';
      case 'students': return 'Student Directory & Records';
      case 'results': return 'DAA Result Processing & Ranking';
      case 'ranking': return 'Student Ranking Engine & Tie Breakers';
      case 'visualizer': return 'DAA Sorting Algorithm Visualizer';
      case 'comparison': return 'Empirical Algorithm Benchmarking';
      case 'search': return 'Student Search (Linear vs Binary)';
      case 'merit': return 'Official Institutional Merit List';
      case 'analytics': return 'Statistical Analytics & Distributions';
      case 'about-daa': return 'Design & Analysis of Algorithms Reference';
      case 'settings': return 'System Settings & Dataset Generator';
      default: return 'Student Ranking System';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800">{getPageTitle()}</h2>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
          DAA Lab Standard
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
          <span className="px-2 text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Demo Data:
          </span>
          <button
            onClick={() => loadDemoData(100)}
            disabled={loading}
            className="px-2 py-1 rounded hover:bg-white text-slate-700 font-medium transition shadow-xs"
          >
            100
          </button>
          <button
            onClick={() => loadDemoData(500)}
            disabled={loading}
            className="px-2 py-1 rounded hover:bg-white text-slate-700 font-medium transition shadow-xs"
          >
            500
          </button>
          <button
            onClick={() => loadDemoData(1000)}
            disabled={loading}
            className="px-2 py-1 rounded hover:bg-white text-slate-700 font-medium transition shadow-xs"
          >
            1,000
          </button>
        </div>

        <button
          onClick={fetchStudentsAndAnalytics}
          disabled={loading}
          title="Refresh Data from Server"
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <RefreshCw className={'w-4 h-4 ' + (loading ? 'animate-spin text-teal-600' : '')} />
        </button>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm shadow-teal-600/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden md:inline">Add Student</span>
        </button>
      </div>
    </header>
  );
}
