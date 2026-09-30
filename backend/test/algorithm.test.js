const assert = require('assert');
const bubbleSort = require('../algorithms/sorting/bubbleSort');
const selectionSort = require('../algorithms/sorting/selectionSort');
const insertionSort = require('../algorithms/sorting/insertionSort');
const mergeSort = require('../algorithms/sorting/mergeSort');
const quickSort = require('../algorithms/sorting/quickSort');
const heapSort = require('../algorithms/sorting/heapSort');
const linearSearch = require('../algorithms/searching/linearSearch');
const binarySearch = require('../algorithms/searching/binarySearch');
const { assignRanks, studentComparator } = require('../algorithms/ranking/rankingAlgorithm');
const { calculateGrade, processStudentAcademicRecord } = require('../algorithms/utilities/gradeCalculator');

console.log('====================================================');
console.log('🧪 RUNNING DAA ALGORITHMS & ACADEMIC TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error('    Error:', err.message);
  }
}

// Sample Test Data
const sampleStudents = [
  { studentId: 'S001', rollNumber: 'R101', name: 'Zack Sharma', percentage: 85.5, total: 513 },
  { studentId: 'S002', rollNumber: 'R102', name: 'Alice Gupta', percentage: 92.0, total: 552 },
  { studentId: 'S003', rollNumber: 'R103', name: 'Bob Verma', percentage: 74.0, total: 444 },
  { studentId: 'S004', rollNumber: 'R104', name: 'Charlie Das', percentage: 85.5, total: 513 }, // Tied with Zack in % and total, but 'Charlie' < 'Zack' alphabetically
  { studentId: 'S005', rollNumber: 'R105', name: 'David Roy', percentage: 85.5, total: 510 }, // Tied % with Zack/Charlie, but lower total
];

// 1. Comparator & Tie-Breaking
test('TC-A: Multi-Key Tie-Breaker Comparator Logic', () => {
  // Alice (92%) vs Bob (74%) -> Alice higher rank (-1)
  assert.strictEqual(studentComparator(sampleStudents[1], sampleStudents[2]) < 0, true);
  
  // Charlie (85.5%, total 513) vs David (85.5%, total 510) -> Charlie higher rank (-1)
  assert.strictEqual(studentComparator(sampleStudents[3], sampleStudents[4]) < 0, true);
  
  // Charlie (85.5%, 513, 'Charlie') vs Zack (85.5%, 513, 'Zack') -> Charlie before Zack (-1)
  assert.strictEqual(studentComparator(sampleStudents[3], sampleStudents[0]) < 0, true);
});

// 2. All 6 Sorting Algorithms
const sortingAlgorithms = [
  { name: 'Bubble Sort', fn: bubbleSort },
  { name: 'Selection Sort', fn: selectionSort },
  { name: 'Insertion Sort', fn: insertionSort },
  { name: 'Merge Sort', fn: mergeSort },
  { name: 'Quick Sort', fn: quickSort },
  { name: 'Heap Sort', fn: heapSort }
];

sortingAlgorithms.forEach(({ name, fn }) => {
  test(`TC-SORT: ${name} ranks students correctly & measures metrics`, () => {
    const res = fn(sampleStudents);
    assert.strictEqual(res.sortedData.length, 5);
    // Highest percentage: Alice (92%)
    assert.strictEqual(res.sortedData[0].name, 'Alice Gupta');
    // Second: Charlie (85.5%, 513, Charlie)
    assert.strictEqual(res.sortedData[1].name, 'Charlie Das');
    // Third: Zack (85.5%, 513, Zack)
    assert.strictEqual(res.sortedData[2].name, 'Zack Sharma');
    // Fourth: David (85.5%, 510)
    assert.strictEqual(res.sortedData[3].name, 'David Roy');
    // Fifth: Bob (74%)
    assert.strictEqual(res.sortedData[4].name, 'Bob Verma');

    // Check instrumentation
    assert(res.comparisons >= 0, 'Comparisons must be tracked');
    assert(res.executionTime >= 0, 'Execution time must be measured');
    assert(res.timeComplexity.average, 'Time complexity metadata must be present');
  });
});

// 3. Edge Cases for Sorting (Empty, Single, Already Sorted)
test('TC-EDGE: Sorting handles empty dataset and single element', () => {
  sortingAlgorithms.forEach(({ name, fn }) => {
    const emptyRes = fn([]);
    assert.strictEqual(emptyRes.sortedData.length, 0);

    const singleRes = fn([{ studentId: 'S1', rollNumber: 'R1', name: 'A', percentage: 90, total: 90 }]);
    assert.strictEqual(singleRes.sortedData.length, 1);
  });
});

// 4. Standard Competition Ranking (1224)
test('TC-RANK: Standard Competition Ranking assigns correct ranks and handles ties', () => {
  const sorted = [
    { name: 'A', percentage: 95, total: 570 },
    { name: 'B', percentage: 90, total: 540 },
    { name: 'C', percentage: 90, total: 540 }, // Tied with B
    { name: 'D', percentage: 80, total: 480 }  // Should be rank 4 (skip 3)
  ];
  const ranked = assignRanks(sorted);
  assert.strictEqual(ranked[0].rank, 1);
  assert.strictEqual(ranked[1].rank, 2);
  assert.strictEqual(ranked[2].rank, 2); // Tied
  assert.strictEqual(ranked[3].rank, 4); // Competition rank skip
});

// 5. Searching: Linear Search
test('TC-SEARCH-1: Linear Search by Roll Number, ID, and Name', () => {
  const resRoll = linearSearch(sampleStudents, 'rollNumber', 'R102');
  assert.strictEqual(resRoll.found, true);
  assert.strictEqual(resRoll.results[0].name, 'Alice Gupta');
  assert.strictEqual(resRoll.comparisons > 0, true);

  const resName = linearSearch(sampleStudents, 'name', 'zack');
  assert.strictEqual(resName.found, true);
  assert.strictEqual(resName.results[0].studentId, 'S001');

  const resNotFound = linearSearch(sampleStudents, 'rollNumber', 'NONEXISTENT');
  assert.strictEqual(resNotFound.found, false);
  assert.strictEqual(resNotFound.results.length, 0);
});

// 6. Searching: Binary Search
test('TC-SEARCH-2: Binary Search by Roll Number and Student ID', () => {
  const res = binarySearch(sampleStudents, 'rollNumber', 'R104');
  assert.strictEqual(res.found, true);
  assert.strictEqual(res.results[0].name, 'Charlie Das');
  assert.strictEqual(res.comparisons <= Math.ceil(Math.log2(sampleStudents.length)) + 2, true);

  const resNotFound = binarySearch(sampleStudents, 'rollNumber', 'INVALID999');
  assert.strictEqual(resNotFound.found, false);
});

// 7. Grade Calculation & Pass/Fail Criteria
test('TC-GRADE: Academic Grade calculation & Pass/Fail subject thresholds', () => {
  assert.strictEqual(calculateGrade(95), 'A+');
  assert.strictEqual(calculateGrade(85), 'A');
  assert.strictEqual(calculateGrade(75), 'B+');
  assert.strictEqual(calculateGrade(65), 'B');
  assert.strictEqual(calculateGrade(55), 'C');
  assert.strictEqual(calculateGrade(45), 'D');
  assert.strictEqual(calculateGrade(35), 'F');

  // Student passing all subjects
  const studentPass = {
    name: 'Pass Student',
    subjects: [
      { name: 'DS', marks: 80 },
      { name: 'DBMS', marks: 75 },
      { name: 'DAA', marks: 90 },
      { name: 'CN', marks: 70 },
      { name: 'Math', marks: 85 }
    ]
  };
  const processedPass = processStudentAcademicRecord(studentPass);
  assert.strictEqual(processedPass.total, 400);
  assert.strictEqual(processedPass.percentage, 80);
  assert.strictEqual(processedPass.status, 'PASS');
  assert.strictEqual(processedPass.grade, 'A');

  // Student having high average but failing one subject (<40)
  const studentFailOne = {
    name: 'Fail One Student',
    subjects: [
      { name: 'DS', marks: 95 },
      { name: 'DBMS', marks: 95 },
      { name: 'DAA', marks: 35 }, // Fail here (< 40)
      { name: 'CN', marks: 90 },
      { name: 'Math', marks: 90 }
    ]
  };
  const processedFail = processStudentAcademicRecord(studentFailOne, { maxMarksPerSubject: 100, passingMarksPerSubject: 40 });
  assert.strictEqual(processedFail.status, 'FAIL');
  assert.strictEqual(processedFail.grade, 'A'); // Grade based on 81% is 'A'
  assert.strictEqual(processedFail.failedSubjectsCount, 1);
});

// 8. User Required Test Cases (Configurable Examination Schemes)
test('TC-CUSTOM-1: Scheme 50 Max / 15 Pass (Pass All)', () => {
  const config = { numSubjects: 6, maxMarksPerSubject: 50, passingMarksPerSubject: 15 };
  const student = {
    name: 'Student 1',
    subjects: [
      { name: 'Sub1', marks: 45 },
      { name: 'Sub2', marks: 38 },
      { name: 'Sub3', marks: 42 },
      { name: 'Sub4', marks: 29 },
      { name: 'Sub5', marks: 47 },
      { name: 'Sub6', marks: 40 }
    ]
  };
  const res = processStudentAcademicRecord(student, config);
  assert.strictEqual(res.total, 241);
  assert.strictEqual(6 * config.maxMarksPerSubject, 300);
  assert.strictEqual(res.percentage, 80.33);
  assert.strictEqual(res.failedSubjects, 0);
  assert.strictEqual(res.status, 'PASS');
});

test('TC-CUSTOM-2: Scheme 50 Max / 15 Pass (1 Failing Subject: 14 < 15)', () => {
  const config = { numSubjects: 6, maxMarksPerSubject: 50, passingMarksPerSubject: 15 };
  const student = {
    name: 'Student 2',
    subjects: [
      { name: 'Sub1', marks: 45 },
      { name: 'Sub2', marks: 38 },
      { name: 'Sub3', marks: 14 },
      { name: 'Sub4', marks: 29 },
      { name: 'Sub5', marks: 47 },
      { name: 'Sub6', marks: 40 }
    ]
  };
  const res = processStudentAcademicRecord(student, config);
  assert.strictEqual(res.status, 'FAIL');
  assert.strictEqual(res.failedSubjects, 1);
});

test('TC-CUSTOM-3: Scheme 100 Max / 40 Pass (1 Failing Subject: 39 < 40)', () => {
  const config = { numSubjects: 6, maxMarksPerSubject: 100, passingMarksPerSubject: 40 };
  const student = {
    name: 'Student 3',
    subjects: [
      { name: 'Sub1', marks: 80 },
      { name: 'Sub2', marks: 75 },
      { name: 'Sub3', marks: 39 },
      { name: 'Sub4', marks: 90 },
      { name: 'Sub5', marks: 88 },
      { name: 'Sub6', marks: 70 }
    ]
  };
  const res = processStudentAcademicRecord(student, config);
  assert.strictEqual(res.status, 'FAIL');
  assert.strictEqual(res.failedSubjects, 1);
});

test('TC-CUSTOM-4: Scheme 50 Max / 25 Pass (1 Failing Subject: 24 < 25)', () => {
  const config = { numSubjects: 6, maxMarksPerSubject: 50, passingMarksPerSubject: 25 };
  const student = {
    name: 'Student 4',
    subjects: [
      { name: 'Sub1', marks: 45 },
      { name: 'Sub2', marks: 38 },
      { name: 'Sub3', marks: 24 },
      { name: 'Sub4', marks: 29 },
      { name: 'Sub5', marks: 47 },
      { name: 'Sub6', marks: 40 }
    ]
  };
  const res = processStudentAcademicRecord(student, config);
  assert.strictEqual(res.status, 'FAIL');
  assert.strictEqual(res.failedSubjects, 1);
});

console.log('\n====================================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round(passedTests/totalTests*100)}%)`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL DAA ALGORITHM & RESULT PROCESSING TESTS PASSED!\n');
} else {
  process.exit(1);
}
