const dataStore = require('../models/dataStore');
const examConfigStore = require('../models/examConfigStore');
const { processStudentAcademicRecord } = require('../algorithms/utilities/gradeCalculator');
const { validateStudentInput } = require('../algorithms/utilities/resultProcessor');
const { assignRanks } = require('../algorithms/ranking/rankingAlgorithm');
const mergeSort = require('../algorithms/sorting/mergeSort');
const { DEFAULT_SUBJECTS } = require('../seed/dataGenerator');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await dataStore.getAllStudents();
    res.json({
      success: true,
      count: students.length,
      data: students,
      examConfig: examConfigStore.getExamConfig()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await dataStore.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student, examConfig: examConfigStore.getExamConfig() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const activeConfig = examConfigStore.getExamConfig();
    const validation = validateStudentInput(req.body, activeConfig);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const processed = processStudentAcademicRecord(req.body, activeConfig);
    const created = await dataStore.createStudent(processed);

    // Re-rank all students to maintain consistent rankings
    const all = await dataStore.getAllStudents();
    const sorted = mergeSort(all).sortedData;
    const ranked = assignRanks(sorted);
    await dataStore.replaceAllStudents(ranked);

    res.status(201).json({ success: true, data: created, message: 'Student added and rankings updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const existing = await dataStore.getStudentById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const activeConfig = examConfigStore.getExamConfig();
    const merged = { ...existing, ...req.body };
    const validation = validateStudentInput(merged, activeConfig);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const processed = processStudentAcademicRecord(merged, activeConfig);
    const updated = await dataStore.updateStudent(req.params.id, processed);

    // Re-rank all
    const all = await dataStore.getAllStudents();
    const sorted = mergeSort(all).sortedData;
    const ranked = assignRanks(sorted);
    await dataStore.replaceAllStudents(ranked);

    res.json({ success: true, data: updated, message: 'Student updated and rankings recalculated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────
// Import Students from CSV (batch endpoint)
// ─────────────────────────────────────────────
exports.importStudents = async (req, res) => {
  try {
    const rows = req.body.students;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No student records provided.' });
    }

    // If custom examination configuration was submitted with the import, check and use it
    let activeConfig = examConfigStore.getExamConfig();
    let tentativeConfig = null;
    if (req.body.examConfig) {
      const validation = examConfigStore.validateConfig(req.body.examConfig);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.errors.join('; '),
          errors: validation.errors
        });
      }
      tentativeConfig = {
        numSubjects: parseInt(req.body.examConfig.numSubjects, 10),
        maxMarksPerSubject: Number(req.body.examConfig.maxMarksPerSubject),
        passingMarksPerSubject: Number(req.body.examConfig.passingMarksPerSubject)
      };
      activeConfig = {
        ...tentativeConfig,
        maxTotalMarks: tentativeConfig.numSubjects * tentativeConfig.maxMarksPerSubject,
        passingRule: `Students must score at least ${tentativeConfig.passingMarksPerSubject} marks in EVERY subject to be considered PASS.`
      };
    }

    const maxMarks = activeConfig.maxMarksPerSubject;

    // Fetch existing students to detect duplicates
    const existingStudents = await dataStore.getAllStudents();
    const existingRollNos = new Set(existingStudents.map(s => s.rollNumber));

    const importedList = [];
    const errors = [];
    let duplicateCount = 0;
    const seenRollNosInFile = new Set();

    rows.forEach((row, index) => {
      const rowNum = index + 2; // 1-based, accounting for header row

      // Skip completely empty rows
      if (!row || Object.keys(row).length === 0) return;

      // Validate required fields
      const missingFields = [];
      if (!row.rollNumber || String(row.rollNumber).trim() === '') missingFields.push('rollNumber');
      if (!row.name || String(row.name).trim() === '') missingFields.push('name');
      if (!row.department || String(row.department).trim() === '') missingFields.push('department');
      if (missingFields.length > 0) {
        errors.push(`Row ${rowNum}: missing required field(s): ${missingFields.join(', ')}`);
        return;
      }

      const rollNumber = String(row.rollNumber).trim();
      const name = String(row.name).trim();
      const department = String(row.department).trim();

      // Duplicate within file
      if (seenRollNosInFile.has(rollNumber)) {
        errors.push(`Row ${rowNum}: duplicate rollNumber '${rollNumber}' in file — skipped`);
        duplicateCount++;
        return;
      }
      seenRollNosInFile.add(rollNumber);

      // Duplicate in existing store
      if (existingRollNos.has(rollNumber)) {
        errors.push(`Row ${rowNum}: rollNumber '${rollNumber}' already exists in store — skipped`);
        duplicateCount++;
        return;
      }

      // Build subjects array
      let subjects = [];
      let marksValid = true;

      if (Array.isArray(row.subjects) && row.subjects.length > 0) {
        for (let si = 0; si < row.subjects.length; si++) {
          const s = row.subjects[si];
          const val = Number(s.marks);
          if (isNaN(val) || s.marks === '' || s.marks === null || typeof s.marks === 'undefined') {
            errors.push(`Row ${rowNum}: Invalid marks for '${s.name || `Subject ${si + 1}`}': value must be numeric.`);
            marksValid = false;
            break;
          }
          if (val < 0 || val > maxMarks) {
            errors.push(`Row ${rowNum}: Invalid marks: ${val}. Marks must be between 0 and ${maxMarks}.`);
            marksValid = false;
            break;
          }
          subjects.push({
            name: s.name || DEFAULT_SUBJECTS[si] || `Subject ${si + 1}`,
            marks: val
          });
        }
      } else if (row.subjectMarks && Array.isArray(row.subjectMarks)) {
        for (let si = 0; si < row.subjectMarks.length; si++) {
          const m = row.subjectMarks[si];
          const val = Number(m);
          if (isNaN(val) || m === '' || m === null || typeof m === 'undefined') {
            errors.push(`Row ${rowNum}: Invalid marks for Subject ${si + 1}: value must be numeric.`);
            marksValid = false;
            break;
          }
          if (val < 0 || val > maxMarks) {
            errors.push(`Row ${rowNum}: Invalid marks: ${val}. Marks must be between 0 and ${maxMarks}.`);
            marksValid = false;
            break;
          }
          subjects.push({
            name: DEFAULT_SUBJECTS[si] || `Subject ${si + 1}`,
            marks: val
          });
        }
      } else if (typeof row.marks !== 'undefined') {
        const totalMarks = Number(row.marks);
        if (isNaN(totalMarks) || totalMarks < 0) {
          errors.push(`Row ${rowNum}: Invalid marks: value must be numeric.`);
          marksValid = false;
        } else {
          const numSubs = activeConfig.numSubjects || DEFAULT_SUBJECTS.length;
          const perSubject = Math.min(maxMarks, Math.max(0, Math.round(totalMarks / numSubs)));
          subjects = DEFAULT_SUBJECTS.slice(0, numSubs).map(subName => ({ name: subName, marks: perSubject }));
        }
      } else {
        errors.push(`Row ${rowNum}: Required subject column is missing.`);
        return;
      }

      if (!marksValid) {
        return;
      }

      // Generate studentId if not provided
      const studentId = row.studentId && String(row.studentId).trim() !== ''
        ? String(row.studentId).trim()
        : 'IMP_' + rollNumber.replace(/\s+/g, '_');

      const semester = parseInt(row.semester, 10) || 1;

      const rawStudent = { studentId, rollNumber, name, department, semester, subjects, rank: 0 };

      // Validate using existing validator
      const validation = validateStudentInput(rawStudent, activeConfig);
      if (!validation.isValid) {
        errors.push(`Row ${rowNum}: ${validation.errors.join('; ')}`);
        return;
      }

      // Process academic record (grade, status, total, average, percentage, failedSubjects)
      const processed = processStudentAcademicRecord(rawStudent, activeConfig);
      importedList.push(processed);
      existingRollNos.add(rollNumber);
    });

    // Batch insert all valid records
    for (const student of importedList) {
      await dataStore.createStudent(student);
    }

    // Re-rank entire dataset with Merge Sort (reuses existing pipeline)
    if (importedList.length > 0) {
      const allStudents = await dataStore.getAllStudents();
      const sorted = mergeSort(allStudents).sortedData;
      const ranked = assignRanks(sorted);
      await dataStore.replaceAllStudents(ranked);
    }

    return res.status(200).json({
      success: true,
      imported: importedList.length,
      skipped: errors.length - duplicateCount,
      duplicates: duplicateCount,
      totalProcessed: rows.length,
      examConfig: activeConfig,
      errors,
      message: `Imported ${importedList.length} student record${importedList.length !== 1 ? 's' : ''} successfully.${
        errors.length > 0 ? ` ${errors.length} row${errors.length !== 1 ? 's' : ''} skipped.` : ''
      }`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await dataStore.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Re-rank remaining students
    const all = await dataStore.getAllStudents();
    if (all.length > 0) {
      const sorted = mergeSort(all).sortedData;
      const ranked = assignRanks(sorted);
      await dataStore.replaceAllStudents(ranked);
    }

    res.json({ success: true, message: 'Student deleted and rankings updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
