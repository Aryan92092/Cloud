const dataStore = require('../models/dataStore');
const examConfigStore = require('../models/examConfigStore');
const { DEFAULT_SUBJECTS } = require('../seed/dataGenerator');

exports.getAnalytics = async (req, res) => {
  try {
    const students = await dataStore.getAllStudents();
    const activeConfig = examConfigStore.getExamConfig();
    const totalStudents = students.length;

    if (totalStudents === 0) {
      return res.json({
        success: true,
        examConfig: activeConfig,
        stats: {
          totalStudents: 0,
          passedStudents: 0,
          failedStudents: 0,
          passPercentage: 0,
          failPercentage: 0,
          averagePercentage: 0,
          highestPercentage: 0,
          lowestPercentage: 0,
          totalFailingSubjects: 0,
          topRanker: null
        },
        gradeDistribution: [],
        subjectAverages: [],
        departmentStats: [],
        topStudents: []
      });
    }

    let passedCount = 0;
    let totalPercentageSum = 0;
    let highestPercentage = -Infinity;
    let lowestPercentage = Infinity;
    let topRanker = null;
    let totalFailingSubjects = 0;

    const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    const subjectSums = {};
    const subjectCounts = {};
    const deptStats = {};

    students.forEach(s => {
      if (s.status === 'PASS') passedCount++;
      totalPercentageSum += s.percentage;

      if (s.percentage > highestPercentage) {
        highestPercentage = s.percentage;
      }
      if (s.percentage < lowestPercentage) {
        lowestPercentage = s.percentage;
      }
      if (s.rank === 1 && !topRanker) {
        topRanker = { name: s.name, rollNumber: s.rollNumber, percentage: s.percentage, department: s.department };
      }

      // Grade count
      if (gradeCounts[s.grade] !== undefined) {
        gradeCounts[s.grade]++;
      } else {
        gradeCounts['F']++;
      }

      // Subject stats & failing subjects count
      if (Array.isArray(s.subjects)) {
        s.subjects.forEach(sub => {
          const m = Number(sub.marks) || 0;
          subjectSums[sub.name] = (subjectSums[sub.name] || 0) + m;
          subjectCounts[sub.name] = (subjectCounts[sub.name] || 0) + 1;
          if (m < activeConfig.passingMarksPerSubject) {
            totalFailingSubjects++;
          }
        });
      }

      // Department stats
      if (!deptStats[s.department]) {
        deptStats[s.department] = { count: 0, passed: 0, totalPercentage: 0 };
      }
      deptStats[s.department].count++;
      if (s.status === 'PASS') deptStats[s.department].passed++;
      deptStats[s.department].totalPercentage += s.percentage;
    });

    // Fallback for top ranker if rank wasn't assigned yet
    if (!topRanker && students.length > 0) {
      const best = [...students].sort((a, b) => b.percentage - a.percentage)[0];
      topRanker = { name: best.name, rollNumber: best.rollNumber, percentage: best.percentage, department: best.department };
    }

    const failedCount = totalStudents - passedCount;
    const avgPercentage = Number((totalPercentageSum / totalStudents).toFixed(2));
    const passPercentage = Number(((passedCount / totalStudents) * 100).toFixed(2));
    const failPercentage = Number(((failedCount / totalStudents) * 100).toFixed(2));

    const gradeDistribution = Object.keys(gradeCounts).map(grade => ({
      grade,
      count: gradeCounts[grade],
      percentage: Number(((gradeCounts[grade] / totalStudents) * 100).toFixed(1))
    }));

    const subjectAverages = Object.keys(subjectSums).map(name => ({
      subject: name,
      average: Number((subjectSums[name] / (subjectCounts[name] || 1)).toFixed(2))
    }));

    const departmentStats = Object.keys(deptStats).map(dept => ({
      department: dept,
      total: deptStats[dept].count,
      passed: deptStats[dept].passed,
      passRate: Number(((deptStats[dept].passed / deptStats[dept].count) * 100).toFixed(1)),
      averagePercentage: Number((deptStats[dept].totalPercentage / deptStats[dept].count).toFixed(2))
    }));

    const topStudents = [...students]
      .sort((a, b) => (a.rank || 9999) - (b.rank || 9999))
      .slice(0, 10);

    res.json({
      success: true,
      examConfig: activeConfig,
      stats: {
        totalStudents,
        passedStudents: passedCount,
        failedStudents: failedCount,
        passPercentage,
        failPercentage,
        averagePercentage: avgPercentage,
        highestPercentage: highestPercentage === -Infinity ? 0 : highestPercentage,
        lowestPercentage: lowestPercentage === Infinity ? 0 : lowestPercentage,
        totalFailingSubjects,
        topRanker
      },
      gradeDistribution,
      subjectAverages,
      departmentStats,
      topStudents,
      storeStatus: dataStore.getStoreStatus()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
