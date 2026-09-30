import React from 'react';
import { useStudents } from '../context/StudentContext';
import GradeDistributionChart from '../components/charts/GradeDistributionChart';
import PassFailPieChart from '../components/charts/PassFailPieChart';
import SubjectAverageBarChart from '../components/charts/SubjectAverageBarChart';

export default function AnalyticsPage() {
  const { analytics } = useStudents();
  const deptStats = analytics?.departmentStats || [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Academic Statistical Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">Cohort performance metrics and departmental distributions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {deptStats.map(d => (
          <div key={d.department} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate block mb-1" title={d.department}>
              {d.department}
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1">{d.passRate}% Pass Rate</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Avg: <strong>{d.averagePercentage}%</strong></span>
              <span>{d.passed} / {d.total} Passed</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Grade Distribution</h3>
          <GradeDistributionChart data={analytics?.gradeDistribution || []} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Pass vs Fail Ratio</h3>
          <PassFailPieChart passedCount={analytics?.stats?.passedStudents || 0} failedCount={analytics?.stats?.failedStudents || 0} />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Course Average Marks</h3>
        <SubjectAverageBarChart data={analytics?.subjectAverages || []} />
      </div>
    </div>
  );
}
