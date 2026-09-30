import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Upload, FileText, X, CheckCircle2, AlertTriangle,
  AlertCircle, ChevronDown, ChevronUp, Loader2, Settings2, Sliders, Check
} from 'lucide-react';
import { DEFAULT_SUBJECTS, DEPARTMENTS } from '../../data/algorithmMetadata';
import { calculateGrade } from '../../algorithms/utilities/gradeCalculator';
import { useStudents } from '../../context/StudentContext';

// ─────────────────────────────────────────────────────────────────────────────
// CSV PARSER (Native browser JS)
// ─────────────────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) return { headers: [], rawHeaders: [], rows: [] };

  const parseRow = (line) => {
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    fields.push(cur.trim());
    return fields;
  };

  const rawHeaders = parseRow(lines[0]);
  const headers = rawHeaders.map(h => h.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = parseRow(line);
    if (fields.every(f => f === '')) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = fields[idx] ?? ''; });
    rows.push(obj);
  }

  return { headers, rawHeaders, rows };
}

const ROLL_ALIASES     = new Set(['rollno', 'rollnumber', 'roll', 'rno', 'studentroll']);
const NAME_ALIASES     = new Set(['name', 'studentname', 'fullname']);
const DEPT_ALIASES     = new Set(['department', 'dept', 'branch', 'stream']);
const SEMESTER_ALIASES = new Set(['semester', 'sem', 'year']);
const ID_ALIASES       = new Set(['studentid', 'id', 'sid']);
const MARKS_ALIASES    = new Set(['marks', 'totalmarks', 'total', 'score', 'totalscore']);
const SKIP_ALIASES     = new Set(['rank', 'average', 'avg', 'percentage', 'grade', 'status', 'percent', 'failedsubjects', 'failedsubjectscount']);

export default function ImportCSVModal({ isOpen, onClose, onImport }) {
  const { examConfig: globalExamConfig } = useStudents();
  const fileInputRef = useRef(null);

  // Configuration state
  const [numSubjects, setNumSubjects] = useState(6);
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState(50);
  const [passingMarksPerSubject, setPassingMarksPerSubject] = useState(15);
  const [configError, setConfigError] = useState('');

  // File & parse state
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [rawText, setRawText] = useState('');
  const [fileError, setFileError] = useState('');
  const [importing, setImporting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Initialize with context config or sensible 50/15 default
  useEffect(() => {
    if (isOpen) {
      if (globalExamConfig) {
        setNumSubjects(globalExamConfig.numSubjects || 6);
        setMaxMarksPerSubject(globalExamConfig.maxMarksPerSubject || 50);
        setPassingMarksPerSubject(globalExamConfig.passingMarksPerSubject || 15);
      }
      setConfigError('');
    }
  }, [isOpen, globalExamConfig]);

  // Derived configuration metrics
  const maxTotalMarks = useMemo(() => {
    const s = Number(numSubjects) || 0;
    const m = Number(maxMarksPerSubject) || 0;
    return s * m;
  }, [numSubjects, maxMarksPerSubject]);

  // Validate configuration in real-time
  useEffect(() => {
    const s = Number(numSubjects);
    const m = Number(maxMarksPerSubject);
    const p = Number(passingMarksPerSubject);

    if (isNaN(s) || s <= 0 || !Number.isInteger(s)) {
      setConfigError('Number of subjects must be an integer greater than 0.');
    } else if (isNaN(m) || m <= 0) {
      setConfigError('Maximum marks per subject must be greater than 0.');
    } else if (isNaN(p) || p < 0) {
      setConfigError('Passing marks must be greater than or equal to 0.');
    } else if (p > m) {
      setConfigError('Passing marks cannot be greater than maximum marks.');
    } else {
      setConfigError('');
    }
  }, [numSubjects, maxMarksPerSubject, passingMarksPerSubject]);

  // Parse and validate rows whenever rawText or configuration changes
  const validationResult = useMemo(() => {
    if (!rawText) return null;

    const { headers, rawHeaders, rows } = parseCSV(rawText);
    if (rows.length === 0) {
      return { totalRows: 0, valid: [], invalid: [], totalMarksChecked: 0, duplicateRollCount: 0, subjectHeaders: [] };
    }

    const maxMarks = Number(maxMarksPerSubject) || 50;
    const passingMarks = Number(passingMarksPerSubject) || 15;
    const expectedSubjectsCount = Number(numSubjects) || 6;

    // Detect subject columns: columns not matching standard identity fields
    const subjectColKeys = [];
    const subjectColNames = [];

    headers.forEach((h, idx) => {
      const norm = h.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      if (
        !ROLL_ALIASES.has(norm) &&
        !NAME_ALIASES.has(norm) &&
        !DEPT_ALIASES.has(norm) &&
        !SEMESTER_ALIASES.has(norm) &&
        !ID_ALIASES.has(norm) &&
        !MARKS_ALIASES.has(norm) &&
        !SKIP_ALIASES.has(norm)
      ) {
        subjectColKeys.push(h);
        subjectColNames.push(rawHeaders[idx] || `Sub ${subjectColKeys.length}`);
      }
    });

    const valid = [];
    const invalid = [];
    const seenRolls = new Set();
    let duplicateRollCount = 0;
    let totalMarksChecked = 0;

    const getField = (row, aliasSet) => {
      for (const h of headers) {
        const norm = h.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
        if (aliasSet.has(norm)) return row[h] ?? '';
      }
      return '';
    };

    rows.forEach((rawRow, i) => {
      const rowNum = i + 2;
      const rollNumber = String(getField(rawRow, ROLL_ALIASES)).trim();
      const name = String(getField(rawRow, NAME_ALIASES)).trim();
      const department = String(getField(rawRow, DEPT_ALIASES)).trim();
      const semRaw = getField(rawRow, SEMESTER_ALIASES);
      const semester = parseInt(semRaw, 10) || 1;
      const studentIdRaw = getField(rawRow, ID_ALIASES);
      const studentId = studentIdRaw ? String(studentIdRaw).trim() : `IMP_${rollNumber || i + 1}`;
      const totalMarksRaw = getField(rawRow, MARKS_ALIASES);

      const errs = [];
      if (!rollNumber) errs.push('Missing roll number');
      if (!name) errs.push('Missing student name');
      if (!department) errs.push('Missing department');

      if (rollNumber) {
        if (seenRolls.has(rollNumber)) {
          errs.push(`Duplicate roll number detected: '${rollNumber}'`);
          duplicateRollCount++;
        } else {
          seenRolls.add(rollNumber);
        }
      }

      // Extract subject marks
      let subjects = [];
      if (subjectColKeys.length > 0) {
        for (let si = 0; si < subjectColKeys.length; si++) {
          const colKey = subjectColKeys[si];
          const subName = subjectColNames[si] || DEFAULT_SUBJECTS[si] || `Subject ${si + 1}`;
          const rawVal = rawRow[colKey];

          if (rawVal === '' || rawVal === null || typeof rawVal === 'undefined') {
            errs.push(`Missing mark for '${subName}'`);
            continue;
          }

          const markNum = Number(rawVal);
          totalMarksChecked++;

          if (isNaN(markNum)) {
            errs.push(`Invalid marks for '${subName}': value must be numeric`);
          } else if (markNum < 0 || markNum > maxMarks) {
            errs.push(`Invalid marks for '${subName}': ${markNum}. Must be between 0 and ${maxMarks}`);
          } else {
            subjects.push({ name: subName, marks: markNum });
          }
        }
      } else if (totalMarksRaw !== '') {
        const total = Number(totalMarksRaw);
        totalMarksChecked++;
        if (isNaN(total) || total < 0) {
          errs.push('Invalid marks: value must be numeric and non-negative');
        } else {
          const count = expectedSubjectsCount;
          const perSub = Math.min(maxMarks, Math.max(0, Math.round(total / count)));
          subjects = DEFAULT_SUBJECTS.slice(0, count).map(sn => ({ name: sn, marks: perSub }));
        }
      } else {
        errs.push('Required subject column is missing');
      }

      // Academic calculations
      let total = 0;
      let failedSubjects = 0;
      subjects.forEach(s => {
        total += s.marks;
        if (s.marks < passingMarks) {
          failedSubjects++;
        }
      });

      const numSubs = subjects.length || expectedSubjectsCount;
      const maxPossible = numSubs * maxMarks;
      const percentage = maxPossible > 0 ? Number(((total / maxPossible) * 100).toFixed(2)) : 0;
      const grade = calculateGrade(percentage);
      const minPassPct = maxMarks > 0 ? (passingMarks / maxMarks) * 100 : 40;
      const status = (failedSubjects === 0 && percentage >= minPassPct) ? 'PASS' : 'FAIL';

      if (errs.length > 0) {
        invalid.push({
          rowNum,
          rollNumber: rollNumber || '—',
          name: name || '—',
          department: department || '—',
          errors: errs,
          rawMarks: subjects
        });
      } else {
        valid.push({
          studentId,
          rollNumber,
          name,
          department,
          semester,
          subjects,
          total,
          percentage,
          grade,
          failedSubjects,
          failedSubjectsCount: failedSubjects,
          status,
          rank: 0
        });
      }
    });

    return {
      totalRows: rows.length,
      valid,
      invalid,
      totalMarksChecked,
      duplicateRollCount,
      subjectHeaders: subjectColNames.length > 0 ? subjectColNames : DEFAULT_SUBJECTS.slice(0, expectedSubjectsCount)
    };
  }, [rawText, numSubjects, maxMarksPerSubject, passingMarksPerSubject]);

  const reset = () => {
    setFileName('');
    setRawText('');
    setFileError('');
    setImporting(false);
    setShowErrors(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processFile = useCallback((file) => {
    setFileError('');
    setRawText('');
    setShowErrors(false);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileError('Invalid file type. Please select a .csv file.');
      return;
    }
    if (file.size === 0) {
      setFileError('The selected file is empty.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File is too large (max 10 MB).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        setRawText(text);
      } catch {
        setFileError('Could not parse the CSV file. Please check file format.');
      }
    };
    reader.onerror = () => setFileError('File reading failed. Please try again.');
    reader.readAsText(file);
  }, []);

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = async () => {
    if (configError) return;
    if (!validationResult || validationResult.valid.length === 0) return;

    setImporting(true);
    try {
      const activeScheme = {
        numSubjects: Number(numSubjects),
        maxMarksPerSubject: Number(maxMarksPerSubject),
        passingMarksPerSubject: Number(passingMarksPerSubject)
      };
      await onImport(validationResult.valid, activeScheme);
      handleClose();
    } catch (err) {
      setFileError(err.message || 'Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  const validCount   = validationResult?.valid.length   ?? 0;
  const invalidCount = validationResult?.invalid.length ?? 0;
  const totalRows    = validationResult?.totalRows      ?? 0;
  const passingMarksNum = Number(passingMarksPerSubject) || 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col my-auto border border-slate-200 overflow-hidden max-h-[92vh]">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center">
              <Upload className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Import CSV &amp; Configure Examination Scheme</h2>
              <p className="text-xs text-slate-500">Configure passing thresholds, upload CSV, and review live calculations.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1 text-xs">

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION A: EXAMINATION / MARKING CONFIGURATION                 */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Examination Marking Configuration
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                Scheme: {maxMarksPerSubject} Max / {passingMarksPerSubject} Pass
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Number of Subjects */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Number of Subjects *
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={numSubjects}
                  onChange={e => setNumSubjects(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Maximum Marks Per Subject */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Maximum Marks Per Subject *
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxMarksPerSubject}
                  onChange={e => setMaxMarksPerSubject(e.target.value)}
                  placeholder="e.g. 50 or 100"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Passing Marks Per Subject */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Passing Marks Per Subject *
                </label>
                <input
                  type="number"
                  min="0"
                  value={passingMarksPerSubject}
                  onChange={e => setPassingMarksPerSubject(e.target.value)}
                  placeholder="e.g. 15 or 40"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Scheme Summary & Educational Rule */}
            <div className="pt-1 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="text-teal-800 font-medium">
                Maximum Total Marks: <strong className="font-bold text-teal-950 font-mono">{numSubjects} × {maxMarksPerSubject} = {maxTotalMarks}</strong>
              </div>
              <div className="text-slate-600 bg-amber-50/80 border border-amber-200/70 px-2.5 py-1 rounded-md text-amber-900 font-medium">
                ⚠️ Students must score at least <strong>{passingMarksPerSubject}</strong> marks in <strong>EVERY</strong> subject to be considered PASS.
              </div>
            </div>

            {configError && (
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs mt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{configError}</span>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION B: CSV UPLOAD / DRAG & DROP                            */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition
              ${dragging
                ? 'border-teal-400 bg-teal-50'
                : rawText
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/40'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            {rawText ? (
              <FileText className="w-7 h-7 text-teal-600" />
            ) : (
              <Upload className="w-7 h-7 text-slate-400" />
            )}
            <div className="text-center">
              {fileName ? (
                <>
                  <p className="text-xs font-bold text-slate-800">{fileName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Click to choose a different CSV file</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-slate-700">Drag &amp; drop student CSV here, or click to browse</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Supports rollNo, name, department, sub1, sub2, sub3... (.csv files)</p>
                </>
              )}
            </div>
          </div>

          {/* File Error */}
          {fileError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION C: VALIDATION SUMMARY METRICS                          */}
          {/* ────────────────────────────────────────────────────────────── */}
          {validationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                  <p className="text-base font-black text-slate-900">{totalRows}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Students Found</p>
                </div>
                <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-3 text-center">
                  <p className="text-base font-black text-teal-700">{validationResult.totalMarksChecked}</p>
                  <p className="text-[11px] text-teal-700 mt-0.5">Subject Marks Checked</p>
                </div>
                <div className={`rounded-xl border p-3 text-center ${invalidCount > 0 ? 'border-rose-200 bg-rose-50/60' : 'border-emerald-200 bg-emerald-50/60'}`}>
                  <p className={`text-base font-black ${invalidCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{invalidCount}</p>
                  <p className={`text-[11px] mt-0.5 ${invalidCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    Invalid / Errored Rows
                  </p>
                </div>
                <div className={`rounded-xl border p-3 text-center ${validationResult.duplicateRollCount > 0 ? 'border-amber-200 bg-amber-50/60' : 'border-slate-200 bg-white'}`}>
                  <p className={`text-base font-black ${validationResult.duplicateRollCount > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                    {validationResult.duplicateRollCount}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${validationResult.duplicateRollCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                    Duplicate Roll Numbers
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              {validCount > 0 && invalidCount === 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Ready to Import:</strong> All <strong>{validCount}</strong> student records validated successfully under scheme ({maxMarksPerSubject} Max / {passingMarksPerSubject} Pass).
                  </span>
                </div>
              )}

              {/* Errored Rows Collapsible */}
              {invalidCount > 0 && (
                <div className="rounded-lg border border-rose-200 overflow-hidden">
                  <button
                    onClick={() => setShowErrors(v => !v)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-rose-50 text-xs font-bold text-rose-800 hover:bg-rose-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      {invalidCount} row{invalidCount !== 1 ? 's' : ''} have validation errors (will be skipped)
                    </span>
                    {showErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showErrors && (
                    <ul className="divide-y divide-rose-100 max-h-40 overflow-y-auto bg-white">
                      {validationResult.invalid.map((inv, i) => (
                        <li key={i} className="px-3.5 py-2 text-[11px] text-rose-800 flex items-start justify-between gap-3">
                          <div>
                            <span className="font-bold">Row {inv.rowNum}</span>
                            {inv.name !== '—' && <span> · {inv.name}</span>}
                            {inv.rollNumber !== '—' && <span className="font-mono"> ({inv.rollNumber})</span>}:&nbsp;
                            <span className="text-rose-700">{inv.errors.join('; ')}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* SECTION D: CSV IMPORT PREVIEW TABLE                        */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Live Calculated Preview Table ({validCount} Valid Records)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Failing marks (&lt; {passingMarksNum}) highlighted in red
                  </span>
                </div>

                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2">Roll No</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Department</th>
                        {validationResult.subjectHeaders.map((subName, si) => (
                          <th key={si} className="px-2.5 py-2 text-center whitespace-nowrap">{subName}</th>
                        ))}
                        <th className="px-2.5 py-2 text-center font-bold text-slate-800">Total</th>
                        <th className="px-2.5 py-2 text-center font-bold text-slate-800">%</th>
                        <th className="px-2 py-2 text-center font-bold">Grade</th>
                        <th className="px-2.5 py-2 text-center font-bold">Failed Subs</th>
                        <th className="px-3 py-2 text-center font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {validCount === 0 ? (
                        <tr>
                          <td colSpan={8 + validationResult.subjectHeaders.length} className="px-4 py-8 text-center text-slate-400">
                            No valid records available to preview.
                          </td>
                        </tr>
                      ) : (
                        validationResult.valid.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition">
                            <td className="px-3 py-2 font-mono font-medium text-slate-700 whitespace-nowrap">{s.rollNumber}</td>
                            <td className="px-3 py-2 font-bold text-slate-900 whitespace-nowrap">{s.name}</td>
                            <td className="px-3 py-2 text-slate-600 truncate max-w-[120px]" title={s.department}>{s.department}</td>

                            {/* Dynamic Subject Marks with Pass/Fail Highlight */}
                            {s.subjects.map((sub, si) => {
                              const isFailing = sub.marks < passingMarksNum;
                              return (
                                <td
                                  key={si}
                                  className={`px-2.5 py-2 text-center font-mono font-semibold ${
                                    isFailing ? 'text-rose-700 bg-rose-50/80 font-bold' : 'text-slate-800'
                                  }`}
                                  title={`${sub.name}: ${sub.marks}/${maxMarksPerSubject}`}
                                >
                                  {sub.marks}
                                </td>
                              );
                            })}

                            <td className="px-2.5 py-2 text-center font-bold font-mono text-slate-900">{s.total}</td>
                            <td className="px-2.5 py-2 text-center font-bold font-mono text-teal-600">{s.percentage}%</td>
                            <td className="px-2 py-2 text-center font-bold">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                                {s.grade}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-center font-mono">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                s.failedSubjects > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {s.failedSubjects}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                s.status === 'PASS'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!validationResult || validCount === 0 || !!configError || importing}
            className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            {importing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</>
            ) : (
              <><Upload className="w-4 h-4" /> Validate &amp; Import {validCount > 0 ? `${validCount} Records` : ''}</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
