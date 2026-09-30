/**
 * Binary Search Algorithm
 * Requires array to be sorted by searchField prior to search.
 * Manually sorts the array by the search field (using Quick Sort) if not already sorted,
 * then executes iterative/recursive binary search.
 * Time Complexity: Best: O(1), Average: O(log n), Worst: O(log n)
 * Space Complexity: O(1)
 */
function binarySearch(array, searchField, query) {
  if (!Array.isArray(array) || array.length === 0) {
    return {
      algorithm: 'Binary Search',
      found: false,
      results: [],
      comparisons: 0,
      executionTime: 0,
      timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      spaceComplexity: 'O(1)',
      searchField,
      query
    };
  }

  const startTime = process.hrtime.bigint();
  
  // Sort dataset explicitly on the target field using manual comparator
  const sortedArray = [...array].sort((a, b) => {
    const valA = String(a[searchField] || '').toLowerCase();
    const valB = String(b[searchField] || '').toLowerCase();
    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });

  const normalizedQuery = String(query).trim().toLowerCase();
  let comparisons = 0;
  let low = 0;
  let high = sortedArray.length - 1;
  let foundIndex = -1;

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    const midVal = String(sortedArray[mid][searchField] || '').toLowerCase();

    if (midVal === normalizedQuery) {
      foundIndex = mid;
      break;
    } else if (midVal < normalizedQuery) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Collect all adjacent matches if duplicates exist
  const results = [];
  if (foundIndex !== -1) {
    // Scan left
    let l = foundIndex;
    while (l >= 0 && String(sortedArray[l][searchField] || '').toLowerCase() === normalizedQuery) {
      l--;
    }
    // Scan right
    let r = l + 1;
    while (r < sortedArray.length && String(sortedArray[r][searchField] || '').toLowerCase() === normalizedQuery) {
      results.push(sortedArray[r]);
      r++;
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Binary Search',
    found: results.length > 0,
    results,
    comparisons,
    executionTime: Number(executionTimeMs.toFixed(4)),
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    searchField,
    query,
    datasetSorted: true
  };
}

module.exports = binarySearch;
