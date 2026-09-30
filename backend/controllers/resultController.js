const dataStore = require('../models/dataStore');
const examConfigStore = require('../models/examConfigStore');
const { getSortFunction } = require('../algorithms/sorting');
const { assignRanks } = require('../algorithms/ranking/rankingAlgorithm');
const { processBatchResults } = require('../algorithms/utilities/resultProcessor');
const { generateStudentRecords } = require('../seed/dataGenerator');

exports.processAndRankResults = async (req, res) => {
  try {
    const algorithmName = req.body.algorithm || 'merge-sort';
    const students = await dataStore.getAllStudents();

    if (students.length === 0) {
      return res.status(400).json({ success: false, message: 'No student records available to process.' });
    }

    const activeConfig = examConfigStore.getExamConfig();

    // 1. Process academic marks & compute total, average, percentage, grade, status using activeConfig
    const processedStudents = processBatchResults(students, activeConfig);

    // 2. Execute selected DAA Sorting Algorithm
    const sortFn = getSortFunction(algorithmName);
    const sortResult = sortFn(processedStudents);

    // 3. Assign Competition Ranks with tie-breaker logic
    const rankedStudents = assignRanks(sortResult.sortedData);

    // 4. Update data store with new ranked dataset
    await dataStore.replaceAllStudents(rankedStudents);

    res.json({
      success: true,
      algorithm: sortResult.algorithm,
      examConfig: activeConfig,
      metrics: {
        studentsCount: rankedStudents.length,
        executionTimeMs: sortResult.executionTime,
        comparisons: sortResult.comparisons,
        swaps: sortResult.swaps,
        timeComplexity: sortResult.timeComplexity,
        spaceComplexity: sortResult.spaceComplexity
      },
      data: rankedStudents
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.loadDemoDataset = async (req, res) => {
  try {
    const count = parseInt(req.body.count, 10) || 100;
    const activeConfig = examConfigStore.getExamConfig();
    const rawStudents = generateStudentRecords(count);

    // Process records under activeConfig
    const processed = processBatchResults(rawStudents, activeConfig);

    // Process & Rank with Merge Sort as default standard
    const sortResult = require('../algorithms/sorting/mergeSort')(processed);
    const ranked = assignRanks(sortResult.sortedData);
    await dataStore.replaceAllStudents(ranked);

    res.json({
      success: true,
      message: `Loaded ${count} realistic demo student records successfully.`,
      count: ranked.length,
      examConfig: activeConfig,
      data: ranked
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMeritList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 0;
    const students = await dataStore.getAllStudents();
    const activeConfig = examConfigStore.getExamConfig();
    
    // Merit list is already ranked 1..N
    const sorted = [...students].sort((a, b) => a.rank - b.rank);
    const meritList = limit > 0 ? sorted.slice(0, limit) : sorted;

    res.json({
      success: true,
      total: students.length,
      count: meritList.length,
      examConfig: activeConfig,
      data: meritList
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
