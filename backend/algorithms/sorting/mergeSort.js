const { studentComparator } = require('../ranking/rankingAlgorithm');

/**
 * Merge Sort Algorithm (Divide & Conquer)
 * Time Complexity: Best: O(n log n), Average: O(n log n), Worst: O(n log n)
 * Space Complexity: O(n)
 */
function mergeSort(array, comparator = studentComparator) {
  const arr = [...array];
  let comparisons = 0;
  let swaps = 0; // Merging / element write operations
  const startTime = process.hrtime.bigint();

  function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      if (comparator(left[i], right[j]) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
      swaps++;
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
      swaps++;
    }

    while (j < right.length) {
      result.push(right[j]);
      j++;
      swaps++;
    }

    return result;
  }

  function sort(list) {
    if (list.length <= 1) return list;
    const mid = Math.floor(list.length / 2);
    const left = sort(list.slice(0, mid));
    const right = sort(list.slice(mid));
    return merge(left, right);
  }

  const sortedData = sort(arr);
  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Merge Sort',
    sortedData,
    comparisons,
    swaps,
    executionTime: Number(executionTimeMs.toFixed(3)),
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)'
  };
}

module.exports = mergeSort;
