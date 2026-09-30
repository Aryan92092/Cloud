const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Advait', 'Akash', 'Ananya', 'Aryan', 'Ayush', 'Bhavya', 'Chirag', 'Deepak',
  'Dev', 'Divya', 'Diya', 'Gaurav', 'Harsh', 'Isha', 'Ishaan', 'Kabir', 'Karan', 'Khushi',
  'Kiran', 'Kunal', 'Manish', 'Meera', 'Mohit', 'Neha', 'Nikhil', 'Nisha', 'Pooja', 'Pranav',
  'Priya', 'Rahul', 'Rhea', 'Rishabh', 'Riya', 'Rohan', 'Sakshi', 'Sameer', 'Sanvi', 'Shreya',
  'Siddharth', 'Sneha', 'Tanvi', 'Tarun', 'Utkarsh', 'Vaibhav', 'Varun', 'Vidhi', 'Yash', 'Zoya'
];

const LAST_NAMES = [
  'Agarwal', 'Bansal', 'Bhatia', 'Chauhan', 'Chopra', 'Das', 'Deshmukh', 'Dubey', 'Gupta', 'Iyer',
  'Jain', 'Joshi', 'Kapoor', 'Khan', 'Kumar', 'Mehta', 'Mishra', 'Mukherjee', 'Nair', 'Patel',
  'Reddy', 'Roy', 'Saxena', 'Shah', 'Sharma', 'Singh', 'Soni', 'Verma', 'Yadav', 'Rao'
];

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering'
];

const DEFAULT_SUBJECTS = [
  'Data Structures',
  'DBMS',
  'DAA',
  'Computer Networks',
  'Mathematics',
  'Artificial Intelligence'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomMarks(academicProfile = 'average') {
  // Profiles: 'topper' (80-99), 'good' (65-88), 'average' (45-75), 'struggling' (28-55)
  let min = 40, max = 80;
  if (academicProfile === 'topper') { min = 80; max = 99; }
  else if (academicProfile === 'good') { min = 65; max = 88; }
  else if (academicProfile === 'average') { min = 45; max = 75; }
  else if (academicProfile === 'struggling') { min = 25; max = 58; }

  return getRandomInt(min, max);
}

function generateStudentRecords(count = 100) {
  const students = [];
  const profiles = ['topper', 'good', 'good', 'average', 'average', 'average', 'struggling'];

  for (let i = 1; i <= count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const rollNumber = `CS2026${String(i).padStart(4, '0')}`;
    const studentId = `STU${String(i).padStart(4, '0')}`;
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const semester = (i % 8) + 1;

    // Pick profile
    const profile = profiles[i % profiles.length];

    const subjects = DEFAULT_SUBJECTS.map(subjName => ({
      name: subjName,
      marks: generateRandomMarks(profile)
    }));

    // Calculate preliminary stats
    let total = 0;
    let failedCount = 0;
    subjects.forEach(sub => {
      total += sub.marks;
      if (sub.marks < 40) failedCount++;
    });

    const average = Number((total / subjects.length).toFixed(2));
    const percentage = Number(((total / (subjects.length * 100)) * 100).toFixed(2));
    
    let grade = 'F';
    let status = failedCount > 0 || percentage < 40 ? 'FAIL' : 'PASS';
    if (status === 'PASS') {
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else grade = 'D';
    }

    students.push({
      studentId,
      rollNumber,
      name,
      department,
      semester,
      subjects,
      total,
      average,
      percentage,
      grade,
      status,
      rank: 0
    });
  }

  return students;
}

module.exports = {
  generateStudentRecords,
  DEFAULT_SUBJECTS,
  DEPARTMENTS
};
