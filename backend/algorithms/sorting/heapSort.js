const { studentComparator } = require('../ranking/rankingAlgorithm');

/**
 * Heap Sort Algorithm (Binary Heap)
 * For descending academic rank (best rank at index 0), we maintain a heap where the root
 * is the element that belongs at the highest array index (i.e. lowest ranking student).
 * Time Complexity: Best: O(n log n), Average: O(n log n), Worst: O(n log n)
 * Space Complexity: O(1)
 */
function heapSort(array, comparator = studentComparator) {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const startTime = process.hrtime.bigint();

  function heapify(length, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < length) {
      comparisons++;
      if (comparator(arr[left], arr[largest]) > 0) {
        largest = left;
      }
    }

    if (right < length) {
      comparisons++;
      if (comparator(arr[right], arr[largest]) > 0) {
        largest = right;
      }
    }

    if (largest !== i) {
      const swap = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swap;
      swaps++;

      heapify(length, largest);
    }
  }

  // Build max heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    swaps++;

    // call max heapify on the reduced heap
    heapify(i, 0);
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  return {
    algorithm: 'Heap Sort',
    sortedData: arr,
    comparisons,
    swaps,
    executionTime: Number(executionTimeMs.toFixed(3)),
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)'
  };
}

module.exports = heapSort;
