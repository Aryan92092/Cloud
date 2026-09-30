import React from 'react';
import {
  LayoutDashboard, Users, Cpu, Trophy, Eye, BarChart3, Search, Award, PieChart, BookOpen, Settings, GraduationCap, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudents } from '../../context/StudentContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'results', label: 'Result Processing', icon: Cpu, badge: 'DAA' },
  { id: 'ranking', label: 'Ranking Engine', icon: Trophy },
  { id: 'visualizer', label: 'Algorithm Visualizer', icon: Eye, highlight: true },
  { id: 'comparison', label: 'Algorithm Benchmark', icon: BarChart3 },
  { id: 'search', label: 'Student Search', icon: Search },
  { id: 'merit', label: 'Merit List', icon: Award },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'about-daa', label: 'About DAA', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const { students } = useStudents();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none h-screen sticky top-0">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 font-bold">
          <GraduationCap className="w-6 h-6 text-slate-950" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight">RankMaster DAA</h1>
          <p className="text-xs text-teal-400 font-medium">Result &amp; Ranking Suite</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Academic Management
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ' +
                (isActive
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                )}
            >
              <div className="flex items-center gap-3">
                <Icon className={'w-4 h-4 ' + (isActive ? 'text-teal-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                  {item.badge}
                </span>
              )}
              {item.highlight && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-semibold text-xs flex-shrink-0">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-teal-400/80 truncate">{students.length} Records Loaded</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
