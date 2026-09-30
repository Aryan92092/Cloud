const { processStudentAcademicRecord, resolveConfig } = require('./gradeCalculator');

function processBatchResults(students, examConfig = null) {
  if (!Array.isArray(students)) return [];
  return students.map(student => processStudentAcademicRecord(student, examConfig));
}

function validateStudentInput(data, customConfig = null) {
  const config = resolveConfig(customConfig);
  const maxMarks = config.maxMarksPerSubject;
  const errors = [];

  if (!data.studentId || String(data.studentId).trim() === '') {
    errors.push('Student ID is required');
  }
  if (!data.rollNumber || String(data.rollNumber).trim() === '') {
    errors.push('Roll Number is required');
  }
  if (!data.name || String(data.name).trim() === '') {
    errors.push('Student Name is required');
  }
  if (!data.department || String(data.department).trim() === '') {
    errors.push('Department is required');
  }

  if (Array.isArray(data.subjects)) {
    data.subjects.forEach((sub, idx) => {
      const marks = Number(sub.marks);
      if (isNaN(marks) || typeof sub.marks === 'undefined' || sub.marks === null || sub.marks === '') {
        errors.push(`Subject '${sub.name || 'Subject ' + (idx + 1)}' marks must be numeric`);
      } else if (marks < 0 || marks > maxMarks) {
        errors.push(`Invalid marks: ${marks}. Marks must be between 0 and ${maxMarks}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  processBatchResults,
  validateStudentInput
};
