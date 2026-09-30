import React from 'react';
import { useStudents } from '../context/StudentContext';
import StatCard from '../components/common/StatCard';
import GradeDistributionChart from '../components/charts/GradeDistributionChart';
import PassFailPieChart from '../components/charts/PassFailPieChart';
import SubjectAverageBarChart from '../components/charts/SubjectAverageBarChart';
import TopRankersChart from '../components/charts/TopRankersChart';
import { Users, CheckCircle, XCircle, Percent, Trophy, Sparkles, ArrowRight, Zap, Award } from 'lucide-react';
import { ALGORITHM_METADATA } from '../data/algorithmMetadata';

export default function DashboardPage({ setCurrentPage }) {
  const { students, analytics, examConfig, loading, lastMetrics, activeAlgorithm, loadDemoData } = useStudents();
  const stats = analytics?.stats || {};
  const passingMarks = examConfig?.passingMarksPerSubject ?? 40;
  const numSubs = examConfig?.numSubjects ?? 6;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 mb-3">
            <Zap className="w-3.5 h-3.5" /> Design &amp; Analysis of Algorithms Subject Project
          </div>
          <h1 className="text-2xl font-black tracking-tight">Student Ranking &amp; Result Processing Engine</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Demonstrating divide-and-conquer, logarithmic search, multi-key tie breakers, and asymptotic complexity verification.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 flex-shrink-0">
          <button
            onClick={() => setCurrentPage('results')}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
          >
            <span>Run Result Processing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage('visualizer')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition flex items-center gap-2"
          >
            <span>Visualizer</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents || 0} icon={Users} color="teal" subtitle="Cohort Size" />
        <StatCard title="Passed Students" value={stats.passedStudents || 0} icon={CheckCircle} color="emerald" subtitle={(stats.passPercentage || 0) + '% Pass Rate'} />
        <StatCard
          title="Failed Students"
          value={stats.failedStudents || 0}
          icon={XCircle}
          color="rose"
          subtitle={`Subject Marks < ${passingMarks}`}
        />
        <StatCard title="Average %" value={(stats.averagePercentage || 0) + '%'} icon={Percent} color="blue" subtitle="Cohort Mean" />
        <StatCard title="Highest %" value={(stats.highestPercentage || 0) + '%'} icon={Trophy} color="amber" subtitle="Top Score" />
        <StatCard title="Lowest %" value={(stats.lowestPercentage || 0) + '%'} icon={Percent} color="purple" subtitle="Lowest Score" />
      </div>

      {/* Top Ranker Highlight Card */}
      {stats.topRanker && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
              🥇
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Top Institutional Ranker</span>
              <h3 className="text-lg font-black text-slate-900">{stats.topRanker.name}</h3>
              <p className="text-xs text-slate-600">{stats.topRanker.rollNumber} &bull; {stats.topRanker.department}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-amber-600">{stats.topRanker.percentage}%</div>
            <span className="text-xs font-semibold text-slate-500">Rank #1</span>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Grade Distribution</h3>
              <p className="text-xs text-slate-500">Count of students across A+, A, B+, B, C, D, F</p>
            </div>
          </div>
          <GradeDistributionChart data={analytics?.gradeDistribution || []} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pass vs Fail Ratio</h3>
              <p className="text-xs text-slate-500">Passing requirement: &ge; {passingMarks} in each subject</p>
            </div>
          </div>
          <PassFailPieChart passedCount={stats.passedStudents || 0} failedCount={stats.failedStudents || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Subject Average Marks</h3>
              <p className="text-xs text-slate-500">Mean score across all {numSubs} examination courses</p>
            </div>
          </div>
          <SubjectAverageBarChart data={analytics?.subjectAverages || []} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top Academic Rankers</h3>
              <p className="text-xs text-slate-500">Leaderboard of highest scoring students</p>
            </div>
          </div>
          <TopRankersChart data={analytics?.topStudents || students.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
}
