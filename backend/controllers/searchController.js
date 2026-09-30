const dataStore = require('../models/dataStore');
const linearSearch = require('../algorithms/searching/linearSearch');
const binarySearch = require('../algorithms/searching/binarySearch');

exports.searchStudents = async (req, res) => {
  try {
    const { algorithm = 'linear', searchField = 'rollNumber', query = '' } = req.body;
    
    if (!query || String(query).trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const students = await dataStore.getAllStudents();
    let result;

    if (algorithm.toLowerCase() === 'binary') {
      result = binarySearch(students, searchField, query);
    } else {
      result = linearSearch(students, searchField, query);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
