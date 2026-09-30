/**
 * Linear Search Algorithm
 * Searches sequentially through array comparing target key
 * Time Complexity: Best: O(1), Average: O(n), Worst: O(n)
 * Space Complexity: O(1)
 */
function linearSearch(array, searchField, query) {
  if (!Array.isArray(array) || array.length === 0) {
    return {
      algorithm: 'Linear Search',
      found: false,
      results: [],
      comparisons: 0,
      executionTime: 0,
      timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      spaceComplexity: 'O(1)',
      searchField,
      query
    };
  }

  const startTime = process.hrtime.bigint();
  let comparisons = 0;
  const results = [];
  const normalizedQuery = String(query).trim().toLowerCase();

  for (let i = 0; i < array.length; i++) {
    comparisons++;
    const itemValue = String(array[i][searchField] || '').toLowerCase();
    if (itemValue === normalizedQuery || itemValue.includes(normalizedQuery)) {
      results.push({ item: array[i], index: i });
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Linear Search',
    found: results.length > 0,
    results: results.map(r => r.item),
    matchIndices: results.map(r => r.index),
    comparisons,
    executionTime: Number(executionTimeMs.toFixed(4)),
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    searchField,
    query
  };
}

module.exports = linearSearch;
