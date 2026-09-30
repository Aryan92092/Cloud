const { studentComparator } = require('../ranking/rankingAlgorithm');

/**
 * Selection Sort Algorithm
 * Time Complexity: Best: O(n^2), Average: O(n^2), Worst: O(n^2)
 * Space Complexity: O(1)
 */
function selectionSort(array, comparator = studentComparator) {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const startTime = process.hrtime.bigint();

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      if (comparator(arr[j], arr[minIndex]) < 0) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      swaps++;
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Selection Sort',
    sortedData: arr,
    comparisons,
    swaps,
    executionTime: Number(executionTimeMs.toFixed(3)),
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)'
  };
}

module.exports = selectionSort;
