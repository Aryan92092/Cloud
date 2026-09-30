export const DEFAULT_PASSING_MARK_PER_SUBJECT = 40;
export const DEFAULT_MAX_MARKS_PER_SUBJECT = 100;

export function calculateGrade(percentage) {
  const rounded = Number(percentage.toFixed(2));
  if (rounded >= 90) return 'A+';
  if (rounded >= 80) return 'A';
  if (rounded >= 70) return 'B+';
  if (rounded >= 60) return 'B';
  if (rounded >= 50) return 'C';
  if (rounded >= 40) return 'D';
  return 'F';
}

export function processStudentAcademicRecord(student, customConfig = null) {
  const maxMarks = Number(customConfig?.maxMarksPerSubject) || DEFAULT_MAX_MARKS_PER_SUBJECT;
  const passingMarks = typeof customConfig?.passingMarksPerSubject !== 'undefined'
    ? Number(customConfig.passingMarksPerSubject)
    : DEFAULT_PASSING_MARK_PER_SUBJECT;

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
    if (marks < passingMarks) {
      hasFailedSubject = true;
      failedSubjectsCount++;
    }
  }

  const numSubjects = subjects.length || Number(customConfig?.numSubjects) || 6;
  const maxPossibleTotal = numSubjects * maxMarks;
  const average = Number((totalMarks / numSubjects).toFixed(2));
  const percentage = maxPossibleTotal > 0
    ? Number(((totalMarks / maxPossibleTotal) * 100).toFixed(2))
    : 0;

  const grade = calculateGrade(percentage);
  const minPassingPercentage = maxMarks > 0 ? (passingMarks / maxMarks) * 100 : 40;
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
