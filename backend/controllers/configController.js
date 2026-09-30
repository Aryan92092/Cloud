const examConfigStore = require('../models/examConfigStore');
const dataStore = require('../models/dataStore');
const { processBatchResults } = require('../algorithms/utilities/resultProcessor');
const mergeSort = require('../algorithms/sorting/mergeSort');
const { assignRanks } = require('../algorithms/ranking/rankingAlgorithm');

exports.getConfig = (req, res) => {
  try {
    const config = examConfigStore.getExamConfig();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const updated = examConfigStore.setExamConfig(req.body);

    // If there are existing students, re-process their scores and ranks using the new scheme
    const all = await dataStore.getAllStudents();
    if (all.length > 0) {
      const processed = processBatchResults(all, updated);
      const sorted = mergeSort(processed).sortedData;
      const ranked = assignRanks(sorted);
      await dataStore.replaceAllStudents(ranked);
    }

    res.json({
      success: true,
      message: 'Examination marking configuration updated and records recalculated.',
      data: updated
    });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({
      success: false,
      message: err.message,
      errors: err.validationErrors || [err.message]
    });
  }
};

exports.resetConfig = async (req, res) => {
  try {
    const defaultConfig = examConfigStore.resetExamConfig();

    const all = await dataStore.getAllStudents();
    if (all.length > 0) {
      const processed = processBatchResults(all, defaultConfig);
      const sorted = mergeSort(processed).sortedData;
      const ranked = assignRanks(sorted);
      await dataStore.replaceAllStudents(ranked);
    }

    res.json({
      success: true,
      message: 'Examination marking configuration reset to default (100 Max / 40 Pass).',
      data: defaultConfig
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
