const { studentComparator } = require('../ranking/rankingAlgorithm');

/**
 * Insertion Sort Algorithm
 * Time Complexity: Best: O(n), Average: O(n^2), Worst: O(n^2)
 * Space Complexity: O(1)
 */
function insertionSort(array, comparator = studentComparator) {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let shifts = 0; // Number of element shifts (equivalent to inner movements)
  const startTime = process.hrtime.bigint();

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      comparisons++;
      if (comparator(arr[j], key) > 0) {
        arr[j + 1] = arr[j];
        shifts++;
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Insertion Sort',
    sortedData: arr,
    comparisons,
    swaps: shifts,
    executionTime: Number(executionTimeMs.toFixed(3)),
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)'
  };
}

module.exports = insertionSort;
