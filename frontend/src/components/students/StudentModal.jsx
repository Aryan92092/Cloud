import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { DEFAULT_SUBJECTS, DEPARTMENTS } from '../../data/algorithmMetadata';
import { processStudentAcademicRecord } from '../../algorithms/utilities/gradeCalculator';
import { useStudents } from '../../context/StudentContext';

export default function StudentModal({ isOpen, onClose, onSubmit, initialStudent = null }) {
  const { examConfig } = useStudents();
  const maxMarks = examConfig?.maxMarksPerSubject || 100;
  const passingMarks = examConfig?.passingMarksPerSubject || 40;
  const numSubjects = examConfig?.numSubjects || 6;
  const defaultSubjectList = DEFAULT_SUBJECTS.slice(0, numSubjects);

  const [formData, setFormData] = useState({
    studentId: '',
    rollNumber: '',
    name: '',
    department: DEPARTMENTS[0],
    semester: 4,
    subjects: defaultSubjectList.map(name => ({ name, marks: Math.round(maxMarks * 0.75) }))
  });
  const [calcPreview, setCalcPreview] = useState({ total: 0, average: 0, percentage: 0, grade: 'A', status: 'PASS' });

  useEffect(() => {
    if (initialStudent) {
      setFormData({
        studentId: initialStudent.studentId || '',
        rollNumber: initialStudent.rollNumber || '',
        name: initialStudent.name || '',
        department: initialStudent.department || DEPARTMENTS[0],
        semester: initialStudent.semester || 4,
        subjects: initialStudent.subjects?.length
          ? initialStudent.subjects
          : defaultSubjectList.map(name => ({ name, marks: Math.round(maxMarks * 0.75) }))
      });
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        studentId: 'STU' + randomNum,
        rollNumber: 'CS2026' + randomNum,
        name: '',
        department: DEPARTMENTS[0],
        semester: 4,
        subjects: defaultSubjectList.map(name => ({ name, marks: Math.round(maxMarks * 0.75) }))
      });
    }
  }, [initialStudent, isOpen, maxMarks, numSubjects]);

  useEffect(() => {
    const processed = processStudentAcademicRecord(formData, examConfig);
    setCalcPreview({
      total: processed.total,
      average: processed.average,
      percentage: processed.percentage,
      grade: processed.grade,
      status: processed.status
    });
  }, [formData.subjects, examConfig]);

  const handleSubjectMarkChange = (index, val) => {
    const num = Math.min(maxMarks, Math.max(0, parseInt(val, 10) || 0));
    const updated = [...formData.subjects];
    updated[index] = { ...updated[index], marks: num };
    setFormData(prev => ({ ...prev, subjects: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const maxPossible = (formData.subjects.length || numSubjects) * maxMarks;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialStudent ? 'Edit Student Record' : 'Add New Student Record'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Student ID *</label>
            <input
              type="text"
              required
              value={formData.studentId}
              onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Roll Number *</label>
            <input
              type="text"
              required
              value={formData.rollNumber}
              onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Subject-Wise Marks (Max {maxMarks} each)
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Pass threshold: {passingMarks}/{maxMarks}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {formData.subjects.map((sub, idx) => {
              const isBelowPass = sub.marks < passingMarks;
              return (
                <div key={sub.name} className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <label className="block text-[11px] font-semibold text-slate-600 truncate mb-1" title={sub.name}>
                    {sub.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={maxMarks}
                    required
                    value={sub.marks}
                    onChange={e => handleSubjectMarkChange(idx, e.target.value)}
                    className={'w-full px-2 py-1 border rounded text-sm font-semibold ' +
                      (isBelowPass ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-300 text-slate-800')}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-teal-900 font-bold block">Live Computation</span>
            <span className="text-teal-700">Total: <strong>{calcPreview.total} / {maxPossible}</strong> &bull; Avg: <strong>{calcPreview.average}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-teal-900 font-bold block text-sm">{calcPreview.percentage}%</span>
              <span className="text-teal-700 font-medium">Grade: {calcPreview.grade}</span>
            </div>
            <span className={'px-2.5 py-1 rounded-full font-bold text-xs border ' +
              (calcPreview.status === 'PASS' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300')}>
              {calcPreview.status}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
          <button type="submit" className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition">
            {initialStudent ? 'Save Changes' : 'Create Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
