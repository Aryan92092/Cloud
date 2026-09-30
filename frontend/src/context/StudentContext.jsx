import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const DEFAULT_EXAM_CONFIG = {
  numSubjects: 6,
  maxMarksPerSubject: 100,
  passingMarksPerSubject: 40,
  maxTotalMarks: 600,
  passingRule: 'Students must score at least 40 marks in EVERY subject to be considered PASS.'
};

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [examConfig, setExamConfig] = useState(DEFAULT_EXAM_CONFIG);
  const [loading, setLoading] = useState(true);
  const [lastMetrics, setLastMetrics] = useState(null);
  const [activeAlgorithm, setActiveAlgorithm] = useState('merge-sort');
  const toast = useToast();

  const fetchStudentsAndAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [studRes, analRes, cfgRes] = await Promise.allSettled([
        api.getAllStudents(),
        api.getAnalytics(),
        api.getExamConfig()
      ]);

      if (studRes.status === 'fulfilled') {
        setStudents(studRes.value.data || []);
      }
      if (analRes.status === 'fulfilled') {
        setAnalytics(analRes.value || null);
      }
      if (cfgRes.status === 'fulfilled' && cfgRes.value?.data) {
        setExamConfig(cfgRes.value.data);
      } else if (analRes.status === 'fulfilled' && analRes.value?.examConfig) {
        setExamConfig(analRes.value.examConfig);
      }
    } catch (err) {
      toast.error('Could not reach backend. Make sure the Node server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStudentsAndAnalytics();
  }, [fetchStudentsAndAnalytics]);

  const updateExamConfig = async (newConfig) => {
    try {
      setLoading(true);
      const res = await api.updateExamConfig(newConfig);
      if (res.data) {
        setExamConfig(res.data);
      }
      toast.success(res.message || 'Marking scheme updated successfully!');
      await fetchStudentsAndAnalytics();
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.message || 'Failed to update marking configuration');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetExamConfig = async () => {
    try {
      setLoading(true);
      const res = await api.resetExamConfig();
      if (res.data) {
        setExamConfig(res.data);
      }
      toast.success(res.message || 'Reset to default scheme (100 Max / 40 Pass)');
      await fetchStudentsAndAnalytics();
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.message || 'Failed to reset configuration');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = async (count = 100) => {
    try {
      setLoading(true);
      const res = await api.loadDemoDataset(count);
      toast.success(res.message || ('Loaded ' + count + ' demo students!'));
      await fetchStudentsAndAnalytics();
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to load demo dataset');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processAndRank = async (algorithm = activeAlgorithm) => {
    try {
      setLoading(true);
      const res = await api.processAndRank(algorithm);
      setLastMetrics({
        algorithm: res.algorithm,
        ...res.metrics
      });
      if (res.examConfig) {
        setExamConfig(res.examConfig);
      }
      setActiveAlgorithm(algorithm);
      toast.success('Processed & Ranked ' + (res.metrics?.studentsCount || '') + ' students using ' + res.algorithm + ' in ' + (res.metrics?.executionTimeMs || 0) + 'ms!');
      await fetchStudentsAndAnalytics();
      return res;
    } catch (err) {
      toast.error(err.message || 'Result processing failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const res = await api.createStudent(studentData);
      toast.success(res.message || 'Student added successfully');
      await fetchStudentsAndAnalytics();
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.message || 'Failed to add student');
      return { success: false, error: err.message };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const res = await api.updateStudent(id, studentData);
      toast.success(res.message || 'Student updated successfully');
      await fetchStudentsAndAnalytics();
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.message || 'Failed to update student');
      return { success: false, error: err.message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await api.deleteStudent(id);
      toast.success(res.message || 'Student deleted successfully');
      await fetchStudentsAndAnalytics();
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
      return { success: false, error: err.message };
    }
  };

  const importStudents = async (studentsArray, customConfig = null) => {
    try {
      setLoading(true);
      const res = await api.importStudents(studentsArray, customConfig);
      if (res.examConfig) {
        setExamConfig(res.examConfig);
      }
      // Build a detailed toast message
      const parts = [`✅ Imported: ${res.imported}`];
      if (res.duplicates > 0) parts.push(`⚠️ Duplicates: ${res.duplicates}`);
      if (res.skipped > 0) parts.push(`⛔ Invalid: ${res.skipped}`);
      toast.success(parts.join('  |  '));
      await fetchStudentsAndAnalytics();
      return { success: true, ...res };
    } catch (err) {
      toast.error(err.message || 'CSV import failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider value={{
      students,
      analytics,
      examConfig,
      loading,
      lastMetrics,
      activeAlgorithm,
      setActiveAlgorithm,
      fetchStudentsAndAnalytics,
      updateExamConfig,
      resetExamConfig,
      loadDemoData,
      processAndRank,
      addStudent,
      updateStudent,
      deleteStudent,
      importStudents
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within StudentProvider');
  }
  return context;
}
