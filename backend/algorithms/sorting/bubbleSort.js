const { studentComparator } = require('../ranking/rankingAlgorithm');

/**
 * Bubble Sort Algorithm with Swap Tracking & Early Termination
 * Time Complexity: Best: O(n), Average: O(n^2), Worst: O(n^2)
 * Space Complexity: O(1)
 */
function bubbleSort(array, comparator = studentComparator) {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const startTime = process.hrtime.bigint();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (comparator(arr[j], arr[j + 1]) > 0) {
        // Swap arr[j] and arr[j + 1]
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swapped = true;
      }
    }
    // Optimization: If no two elements were swapped, array is already sorted
    if (!swapped) break;
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Bubble Sort',
    sortedData: arr,
    comparisons,
    swaps,
    executionTime: Number(executionTimeMs.toFixed(3)),
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)'
  };
}

module.exports = bubbleSort;
