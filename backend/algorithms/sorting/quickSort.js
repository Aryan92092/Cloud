const { studentComparator } = require('../ranking/rankingAlgorithm');

/**
 * Quick Sort Algorithm (Divide & Conquer with Lomuto Partitioning)
 * Time Complexity: Best: O(n log n), Average: O(n log n), Worst: O(n^2)
 * Space Complexity: Average: O(log n), Worst: O(n)
 */
function quickSort(array, comparator = studentComparator) {
  const arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  const startTime = process.hrtime.bigint();

  function partition(low, high) {
    // Median-of-three or middle pivot to avoid worst-case on already sorted
    const mid = Math.floor((low + high) / 2);
    const tempMid = arr[mid];
    arr[mid] = arr[high];
    arr[high] = tempMid;
    swaps++;

    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      if (comparator(arr[j], pivot) <= 0) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;
      }
    }

    const tempFinal = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = tempFinal;
    swaps++;

    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  if (arr.length > 0) {
    sort(0, arr.length - 1);
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Quick Sort',
    sortedData: arr,
    comparisons,
    swaps,
    executionTime: Number(executionTimeMs.toFixed(3)),
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)'
  };
}

module.exports = quickSort;
