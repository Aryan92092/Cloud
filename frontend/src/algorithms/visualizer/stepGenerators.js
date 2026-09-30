/**
 * Visualizer Step Generators
 * Each generator yields step snapshots containing:
 * {
 *   array: [...],
 *   comparing: [i, j],
 *   swapped: [i, j],
 *   sorted: [...indices],
 *   pivot: index,
 *   message: "...",
 *   comparisons: count,
 *   swaps: count
 * }
 */

// Helper clone
const clone = (arr) => arr.map(item => ({ ...item }));

// 1. Bubble Sort Generator
export function* bubbleSortVisualizer(inputArray) {
  const arr = clone(inputArray);
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = [];

  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: [],
    pivot: -1,
    message: 'Starting Bubble Sort. Adjacent elements will be compared sequentially.',
    comparisons,
    swaps
  };

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield {
        array: clone(arr),
        comparing: [j, j + 1],
        swapped: [],
        sorted: [...sorted],
        pivot: -1,
        message: `Comparing ${arr[j].name} (${arr[j].percentage}%) with ${arr[j + 1].name} (${arr[j + 1].percentage}%)`,
        comparisons,
        swaps
      };

      // In ranking: higher percentage comes first. If arr[j] < arr[j+1], swap them
      if (arr[j].percentage < arr[j + 1].percentage) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swappedAny = true;

        yield {
          array: clone(arr),
          comparing: [],
          swapped: [j, j + 1],
          sorted: [...sorted],
          pivot: -1,
          message: `Swapped ${arr[j].name} and ${arr[j + 1].name} to bring higher percentage ahead.`,
          comparisons,
          swaps
        };
      }
    }
    sorted.push(n - i - 1);
    if (!swappedAny) break;
  }

  // All sorted
  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: allSorted,
    pivot: -1,
    message: `Bubble Sort Complete! Sorted ${n} students with ${comparisons} comparisons and ${swaps} swaps.`,
    comparisons,
    swaps
  };
}

// 2. Selection Sort Generator
export function* selectionSortVisualizer(inputArray) {
  const arr = clone(inputArray);
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = [];

  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: [],
    pivot: -1,
    message: 'Starting Selection Sort. Finding student with maximum percentage for each rank position.',
    comparisons,
    swaps
  };

  for (let i = 0; i < n - 1; i++) {
    let maxIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield {
        array: clone(arr),
        comparing: [j, maxIdx],
        swapped: [],
        sorted: [...sorted],
        pivot: maxIdx,
        message: `Checking if ${arr[j].name} (${arr[j].percentage}%) > current max ${arr[maxIdx].name} (${arr[maxIdx].percentage}%)`,
        comparisons,
        swaps
      };

      if (arr[j].percentage > arr[maxIdx].percentage) {
        maxIdx = j;
      }
    }

    if (maxIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[maxIdx];
      arr[maxIdx] = temp;
      swaps++;

      yield {
        array: clone(arr),
        comparing: [],
        swapped: [i, maxIdx],
        sorted: [...sorted, i],
        pivot: -1,
        message: `Placed ${arr[i].name} at Rank position ${i + 1}.`,
        comparisons,
        swaps
      };
    }
    sorted.push(i);
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: allSorted,
    pivot: -1,
    message: `Selection Sort Complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    comparisons,
    swaps
  };
}

// 3. Insertion Sort Generator
export function* insertionSortVisualizer(inputArray) {
  const arr = clone(inputArray);
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = [0];

  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: [0],
    pivot: -1,
    message: 'Starting Insertion Sort. Progressively building sorted merit prefix.',
    comparisons,
    swaps
  };

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield {
      array: clone(arr),
      comparing: [i],
      swapped: [],
      sorted: [...sorted],
      pivot: i,
      message: `Inserting student ${key.name} (${key.percentage}%) into sorted prefix.`,
      comparisons,
      swaps
    };

    while (j >= 0) {
      comparisons++;
      if (arr[j].percentage < key.percentage) {
        arr[j + 1] = arr[j];
        swaps++;
        yield {
          array: clone(arr),
          comparing: [j, j + 1],
          swapped: [j + 1],
          sorted: [...sorted],
          pivot: -1,
          message: `Shifted ${arr[j].name} rightwards to make space for higher percentage ${key.name}.`,
          comparisons,
          swaps
        };
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    sorted.push(i);
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: allSorted,
    pivot: -1,
    message: `Insertion Sort Complete! Comparisons: ${comparisons}, Shifts: ${swaps}.`,
    comparisons,
    swaps
  };
}

// 4. Merge Sort Generator
export function* mergeSortVisualizer(inputArray) {
  const arr = clone(inputArray);
  let comparisons = 0;
  let swaps = 0;

  function* merge(low, mid, high) {
    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
      comparisons++;
      yield {
        array: clone(arr),
        comparing: [low + i, mid + 1 + j],
        swapped: [],
        sorted: [],
        pivot: -1,
        message: `Merging subarrays: Comparing ${left[i].name} (${left[i].percentage}%) with ${right[j].name} (${right[j].percentage}%)`,
        comparisons,
        swaps
      };

      if (left[i].percentage >= right[j].percentage) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      swaps++;
      k++;
      yield {
        array: clone(arr),
        comparing: [],
        swapped: [k - 1],
        sorted: [],
        pivot: -1,
        message: `Merged ${arr[k - 1].name} into merged index ${k - 1}`,
        comparisons,
        swaps
      };
    }

    while (i < left.length) {
      arr[k] = left[i];
      i++; k++; swaps++;
    }
    while (j < right.length) {
      arr[k] = right[j];
      j++; k++; swaps++;
    }
  }

  function* sort(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      yield* sort(low, mid);
      yield* sort(mid + 1, high);
      yield* merge(low, mid, high);
    }
  }

  yield* sort(0, arr.length - 1);

  const allSorted = Array.from({ length: arr.length }, (_, idx) => idx);
  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: allSorted,
    pivot: -1,
    message: `Merge Sort Complete! Comparisons: ${comparisons}, Merge Writes: ${swaps}.`,
    comparisons,
    swaps
  };
}

// 5. Quick Sort Generator
export function* quickSortVisualizer(inputArray) {
  const arr = clone(inputArray);
  let comparisons = 0;
  let swaps = 0;
  const sorted = [];

  function* partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    yield {
      array: clone(arr),
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      pivot: high,
      message: `Selected pivot student ${pivot.name} (${pivot.percentage}%) at index ${high}`,
      comparisons,
      swaps
    };

    for (let j = low; j < high; j++) {
      comparisons++;
      yield {
        array: clone(arr),
        comparing: [j, high],
        swapped: [],
        sorted: [...sorted],
        pivot: high,
        message: `Comparing ${arr[j].name} (${arr[j].percentage}%) against pivot ${pivot.name} (${pivot.percentage}%)`,
        comparisons,
        swaps
      };

      // For descending rank: higher percentage comes before pivot
      if (arr[j].percentage >= pivot.percentage) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;

        yield {
          array: clone(arr),
          comparing: [],
          swapped: [i, j],
          sorted: [...sorted],
          pivot: high,
          message: `Swapped ${arr[i].name} to left partition (higher percentage).`,
          comparisons,
          swaps
        };
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    swaps++;
    sorted.push(i + 1);

    yield {
      array: clone(arr),
      comparing: [],
      swapped: [i + 1, high],
      sorted: [...sorted],
      pivot: i + 1,
      message: `Placed pivot ${arr[i + 1].name} into final partition position ${i + 1}`,
      comparisons,
      swaps
    };

    return i + 1;
  }

  function* sort(low, high) {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* sort(low, pi - 1);
      yield* sort(pi + 1, high);
    }
  }

  yield* sort(0, arr.length - 1);

  const allSorted = Array.from({ length: arr.length }, (_, idx) => idx);
  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: allSorted,
    pivot: -1,
    message: `Quick Sort Complete! Total Comparisons: ${comparisons}, Total Swaps: ${swaps}.`,
    comparisons,
    swaps
  };
}

// 6. Heap Sort Generator
export function* heapSortVisualizer(inputArray) {
  const arr = clone(inputArray);
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = [];

  function* heapify(length, i) {
    let smallest = i; // Root should hold the smallest % to be placed at end of descending array
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < length) {
      comparisons++;
      if (arr[left].percentage < arr[smallest].percentage) {
        smallest = left;
      }
    }

    if (right < length) {
      comparisons++;
      if (arr[right].percentage < arr[smallest].percentage) {
        smallest = right;
      }
    }

    if (smallest !== i) {
      const temp = arr[i];
      arr[i] = arr[smallest];
      arr[smallest] = temp;
      swaps++;

      yield {
        array: clone(arr),
        comparing: [i, smallest],
        swapped: [i, smallest],
        sorted: [...sorted],
        pivot: -1,
        message: `Heapify: Swapped ${arr[i].name} with child ${arr[smallest].name} to maintain min-heap property.`,
        comparisons,
        swaps
      };

      yield* heapify(length, smallest);
    }
  }

  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: [],
    pivot: -1,
    message: 'Starting Heap Sort. Building binary heap structure.',
    comparisons,
    swaps
  };

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    swaps++;
    sorted.push(i);

    yield {
      array: clone(arr),
      comparing: [],
      swapped: [0, i],
      sorted: [...sorted],
      pivot: i,
      message: `Extracted root ${arr[i].name} to position ${i}.`,
      comparisons,
      swaps
    };

    yield* heapify(i, 0);
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  yield {
    array: clone(arr),
    comparing: [],
    swapped: [],
    sorted: allSorted,
    pivot: -1,
    message: `Heap Sort Complete! Comparisons: ${comparisons}, Swaps: ${swaps}.`,
    comparisons,
    swaps
  };
}

export const VISUALIZER_ALGORITHMS = {
  'bubble-sort': bubbleSortVisualizer,
  'selection-sort': selectionSortVisualizer,
  'insertion-sort': insertionSortVisualizer,
  'merge-sort': mergeSortVisualizer,
  'quick-sort': quickSortVisualizer,
  'heap-sort': heapSortVisualizer
};
