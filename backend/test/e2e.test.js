const assert = require('assert');

(async () => {
  console.log('🧪 Starting End-to-End API and Business Logic Verification...\n');

  // 1. Test GET /api/config
  const res1 = await fetch('http://localhost:5000/api/config');
  const json1 = await res1.json();
  console.log('1. GET /api/config:', json1.data);
  assert.strictEqual(json1.success, true);

  // 2. Test PUT /api/config with 50 Max / 15 Pass
  const res2 = await fetch('http://localhost:5000/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numSubjects: 6, maxMarksPerSubject: 50, passingMarksPerSubject: 15 })
  });
  const json2 = await res2.json();
  console.log('2. PUT /api/config (50/15):', json2.data);
  assert.strictEqual(json2.success, true);
  assert.strictEqual(json2.data.maxTotalMarks, 300);

  // 3. Test Invalid Config (passing > max)
  const res3 = await fetch('http://localhost:5000/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numSubjects: 6, maxMarksPerSubject: 50, passingMarksPerSubject: 60 })
  });
  const json3 = await res3.json();
  console.log('3. PUT invalid config (passing > max rejected):', json3.success === false, json3.message);
  assert.strictEqual(json3.success, false);

  // 4. Test Batch Import under 50 Max / 15 Pass
  const testStudents = [
    {
      rollNumber: 'TEST50_001',
      name: 'Aarav Kumar',
      department: 'Computer Science and Engineering',
      subjects: [
        { name: 'sub1', marks: 45 },
        { name: 'sub2', marks: 38 },
        { name: 'sub3', marks: 42 },
        { name: 'sub4', marks: 29 },
        { name: 'sub5', marks: 47 },
        { name: 'sub6', marks: 40 }
      ]
    },
    {
      rollNumber: 'TEST50_002',
      name: 'Aditi Sharma',
      department: 'Information Technology',
      subjects: [
        { name: 'sub1', marks: 45 },
        { name: 'sub2', marks: 38 },
        { name: 'sub3', marks: 14 }, // < 15 Fail
        { name: 'sub4', marks: 29 },
        { name: 'sub5', marks: 47 },
        { name: 'sub6', marks: 40 }
      ]
    }
  ];

  const res4 = await fetch('http://localhost:5000/api/students/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      students: testStudents,
      examConfig: { numSubjects: 6, maxMarksPerSubject: 50, passingMarksPerSubject: 15 }
    })
  });
  const json4 = await res4.json();
  console.log('4. Batch import result:', json4.imported, 'imported, errors:', json4.errors);
  assert.strictEqual(json4.success, true);
  assert.strictEqual(json4.imported, 2);

  // Check imported student records in store
  const resStu1 = await fetch('http://localhost:5000/api/students/TEST50_001');
  const s1 = (await resStu1.json()).data;
  console.log('   Student 1 (Aarav Kumar):', { total: s1.total, pct: s1.percentage, grade: s1.grade, status: s1.status, failed: s1.failedSubjects });
  assert.strictEqual(s1.total, 241);
  assert.strictEqual(s1.percentage, 80.33);
  assert.strictEqual(s1.status, 'PASS');
  assert.strictEqual(s1.failedSubjects, 0);

  const resStu2 = await fetch('http://localhost:5000/api/students/TEST50_002');
  const s2 = (await resStu2.json()).data;
  console.log('   Student 2 (Aditi Sharma):', { total: s2.total, pct: s2.percentage, grade: s2.grade, status: s2.status, failed: s2.failedSubjects });
  assert.strictEqual(s2.status, 'FAIL');
  assert.strictEqual(s2.failedSubjects, 1);

  // 5. Test Invalid Marks during Import (mark 55 when max = 50)
  const res5 = await fetch('http://localhost:5000/api/students/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      students: [{
        rollNumber: 'TEST_INVALID_MARKS',
        name: 'Invalid Mark Student',
        department: 'CSE',
        subjects: [{ name: 'sub1', marks: 55 }]
      }],
      examConfig: { numSubjects: 1, maxMarksPerSubject: 50, passingMarksPerSubject: 15 }
    })
  });
  const json5 = await res5.json();
  console.log('5. Invalid mark import rejected:', json5.imported === 0, json5.errors);
  assert.strictEqual(json5.imported, 0);

  // 6. Test Merit List API reflects dynamic maxTotal
  const resMerit = await fetch('http://localhost:5000/api/results/merit-list?limit=5');
  const jsonMerit = await resMerit.json();
  console.log('6. Merit list maxTotalMarks:', jsonMerit.examConfig.maxTotalMarks);
  assert.strictEqual(jsonMerit.examConfig.maxTotalMarks, 300);

  // 7. Test Analytics API reflects dynamic config & failing subjects
  const resAnal = await fetch('http://localhost:5000/api/analytics');
  const jsonAnal = await resAnal.json();
  console.log('7. Analytics stats:', {
    totalStudents: jsonAnal.stats.totalStudents,
    passedStudents: jsonAnal.stats.passedStudents,
    failedStudents: jsonAnal.stats.failedStudents,
    totalFailingSubjects: jsonAnal.stats.totalFailingSubjects,
    config: jsonAnal.examConfig
  });
  assert.strictEqual(jsonAnal.examConfig.maxTotalMarks, 300);

  // 8. Test Result Processing with Merge Sort
  const resProcess = await fetch('http://localhost:5000/api/results/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm: 'merge-sort' })
  });
  const jsonProcess = await resProcess.json();
  console.log('8. Result processing with Merge Sort:', {
    algorithm: jsonProcess.algorithm,
    comparisons: jsonProcess.metrics.comparisons,
    executionTimeMs: jsonProcess.metrics.executionTimeMs,
    studentsCount: jsonProcess.metrics.studentsCount
  });
  assert.strictEqual(jsonProcess.success, true);

  console.log('\n🎉 ALL END-TO-END REST APIS AND BUSINESS LOGIC VERIFIED SUCCESSFULLY!');
})();
