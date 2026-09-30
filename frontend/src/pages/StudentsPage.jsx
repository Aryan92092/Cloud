import React, { useState, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { GradeBadge, StatusBadge, RankBadge } from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import StudentModal from '../components/students/StudentModal';
import StudentDetailsModal from '../components/students/StudentDetailsModal';
import DeleteConfirmModal from '../components/students/DeleteConfirmModal';
import ImportCSVModal from '../components/students/ImportCSVModal';
import { Search, Filter, Plus, Edit2, Trash2, Eye, Download, ArrowUpDown, Upload } from 'lucide-react';
import { DEPARTMENTS } from '../data/algorithmMetadata';

export default function StudentsPage() {
  const { students, examConfig, addStudent, updateStudent, deleteStudent, importStudents } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.rollNumber.toLowerCase().includes(q) || 
        s.studentId.toLowerCase().includes(q);
      const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
      const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [students, searchQuery, selectedDept, selectedStatus]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  const handleExportCSV = () => {
    const headers = ['Rank', 'Student ID', 'Roll Number', 'Name', 'Department', 'Total', 'Average', 'Percentage', 'Grade', 'Failed Subjects', 'Status'];
    const rows = filteredStudents.map(s => [
      s.rank || '',
      s.studentId,
      s.rollNumber,
      '"' + s.name + '"',
      '"' + s.department + '"',
      s.total,
      s.average,
      s.percentage,
      s.grade,
      s.failedSubjects ?? s.failedSubjectsCount ?? 0,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, inspect, and update academic records.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            id="btn-import-csv"
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <Upload className="w-4 h-4 text-slate-500" /> Import CSV
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition">
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search name, roll no, student ID..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={e => { setSelectedDept(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Status</option>
            <option value="PASS">Passed Only</option>
            <option value="FAIL">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th className="px-5 py-3 text-center">Rank</th>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3 text-center">Total (Max {examConfig?.maxTotalMarks || 600})</th>
                <th className="px-5 py-3 text-center">%</th>
                <th className="px-5 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Failed Subs</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-slate-400">No matching student records found.</td>
                </tr>
              ) : (
                paginatedStudents.map(student => {
                  const failedCount = student.failedSubjects ?? student.failedSubjectsCount ?? 0;
                  return (
                    <tr key={student.studentId} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 text-center font-bold"><RankBadge rank={student.rank || 1} /></td>
                      <td className="px-5 py-3.5 font-mono text-slate-700 font-medium">{student.rollNumber}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{student.name}</td>
                      <td className="px-5 py-3.5 text-slate-600 truncate max-w-xs">{student.department}</td>
                      <td className="px-5 py-3.5 text-center font-semibold text-slate-800 font-mono">{student.total}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-teal-600 font-mono">{student.percentage}%</td>
                      <td className="px-5 py-3.5 text-center"><GradeBadge grade={student.grade} /></td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          failedCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {failedCount}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center"><StatusBadge status={student.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setViewingStudent(student)} title="View Details" className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => setEditingStudent(student)} title="Edit Record" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeletingStudent(student)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={filteredStudents.length} pageSize={pageSize} onPageChange={setCurrentPage} />
      </div>

      <StudentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={async (data) => { await addStudent(data); setIsAddOpen(false); }} />
      <StudentModal isOpen={!!editingStudent} onClose={() => setEditingStudent(null)} initialStudent={editingStudent} onSubmit={async (data) => { await updateStudent(editingStudent.studentId, data); setEditingStudent(null); }} />
      <StudentDetailsModal isOpen={!!viewingStudent} onClose={() => setViewingStudent(null)} student={viewingStudent} />
      <DeleteConfirmModal isOpen={!!deletingStudent} onClose={() => setDeletingStudent(null)} studentName={deletingStudent?.name} onConfirm={async () => { await deleteStudent(deletingStudent.studentId); setDeletingStudent(null); }} />
      <ImportCSVModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={async (validStudents, activeScheme) => {
          await importStudents(validStudents, activeScheme);
          setIsImportOpen(false);
        }}
      />
    </div>
  );
}
