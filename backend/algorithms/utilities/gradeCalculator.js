/**
 * Grade Calculator Utility
 * Grading Scale:
 * 90-100: A+
 * 80-89:  A
 * 70-79:  B+
 * 60-69:  B
 * 50-59:  C
 * 40-49:  D
 * < 40:   F (Fail)
 */

let examConfigStore = null;
try {
  examConfigStore = require('../../models/examConfigStore');
} catch (e) {
  // Graceful fallback if models not loaded
}

const DEFAULT_PASSING_MARK_PER_SUBJECT = 40;
const DEFAULT_MAX_MARKS_PER_SUBJECT = 100;

function calculateGrade(percentage) {
  const rounded = Number(percentage.toFixed(2));
  if (rounded >= 90) return 'A+';
  if (rounded >= 80) return 'A';
  if (rounded >= 70) return 'B+';
  if (rounded >= 60) return 'B';
  if (rounded >= 50) return 'C';
  if (rounded >= 40) return 'D';
  return 'F';
}

function resolveConfig(customConfig) {
  if (customConfig && typeof customConfig.maxMarksPerSubject !== 'undefined') {
    return {
      numSubjects: Number(customConfig.numSubjects) || 6,
      maxMarksPerSubject: Number(customConfig.maxMarksPerSubject) || DEFAULT_MAX_MARKS_PER_SUBJECT,
      passingMarksPerSubject: typeof customConfig.passingMarksPerSubject !== 'undefined'
        ? Number(customConfig.passingMarksPerSubject)
        : DEFAULT_PASSING_MARK_PER_SUBJECT
    };
  }

  if (examConfigStore && typeof examConfigStore.getExamConfig === 'function') {
    try {
      const active = examConfigStore.getExamConfig();
      return {
        numSubjects: active.numSubjects,
        maxMarksPerSubject: active.maxMarksPerSubject,
        passingMarksPerSubject: active.passingMarksPerSubject
      };
    } catch {
      // Fallback
    }
  }

  return {
    numSubjects: 6,
    maxMarksPerSubject: DEFAULT_MAX_MARKS_PER_SUBJECT,
    passingMarksPerSubject: DEFAULT_PASSING_MARK_PER_SUBJECT
  };
}

function processStudentAcademicRecord(student, customConfig = null) {
  const config = resolveConfig(customConfig);
  const subjects = student.subjects || [];

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return {
      ...student,
      total: 0,
      average: 0,
      percentage: 0,
      grade: 'F',
      status: 'FAIL',
      failedSubjects: 0,
      failedSubjectsCount: 0
    };
  }

  let totalMarks = 0;
  let hasFailedSubject = false;
  let failedSubjectsCount = 0;

  for (let i = 0; i < subjects.length; i++) {
    const marks = Number(subjects[i].marks) || 0;
    totalMarks += marks;
    if (marks < config.passingMarksPerSubject) {
      hasFailedSubject = true;
      failedSubjectsCount++;
    }
  }

  const numSubjects = subjects.length || config.numSubjects || 6;
  const maxPossibleTotal = numSubjects * config.maxMarksPerSubject;
  const average = Number((totalMarks / numSubjects).toFixed(2));
  const percentage = maxPossibleTotal > 0
    ? Number(((totalMarks / maxPossibleTotal) * 100).toFixed(2))
    : 0;

  // Grade is calculated strictly from percentage
  const grade = calculateGrade(percentage);

  // Status is determined strictly by the subject-wise passing rule
  const minPassingPercentage = config.maxMarksPerSubject > 0
    ? (config.passingMarksPerSubject / config.maxMarksPerSubject) * 100
    : 40;
  const status = (hasFailedSubject || percentage < minPassingPercentage) ? 'FAIL' : 'PASS';

  return {
    ...student,
    total: totalMarks,
    average,
    percentage,
    grade,
    status,
    failedSubjects: failedSubjectsCount,
    failedSubjectsCount
  };
}

module.exports = {
  calculateGrade,
  processStudentAcademicRecord,
  PASSING_MARK_PER_SUBJECT: DEFAULT_PASSING_MARK_PER_SUBJECT,
  resolveConfig
};
