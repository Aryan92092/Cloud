const bubbleSort = require('../algorithms/sorting/bubbleSort');
const selectionSort = require('../algorithms/sorting/selectionSort');
const insertionSort = require('../algorithms/sorting/insertionSort');
const mergeSort = require('../algorithms/sorting/mergeSort');
const quickSort = require('../algorithms/sorting/quickSort');
const heapSort = require('../algorithms/sorting/heapSort');
const { generateStudentRecords } = require('../seed/dataGenerator');

const algorithms = [
  { id: 'bubble-sort', name: 'Bubble Sort', fn: bubbleSort, theoretical: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' } },
  { id: 'selection-sort', name: 'Selection Sort', fn: selectionSort, theoretical: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' } },
  { id: 'insertion-sort', name: 'Insertion Sort', fn: insertionSort, theoretical: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' } },
  { id: 'merge-sort', name: 'Merge Sort', fn: mergeSort, theoretical: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' } },
  { id: 'quick-sort', name: 'Quick Sort', fn: quickSort, theoretical: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' } },
  { id: 'heap-sort', name: 'Heap Sort', fn: heapSort, theoretical: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' } }
];

exports.runBenchmark = async (req, res) => {
  try {
    const requestedSizes = req.body.sizes || [10, 50, 100, 500, 1000, 5000];
    const results = [];

    // Filter out huge n for quadratic algorithms if requested size > 5000 to prevent timeouts
    for (const size of requestedSizes) {
      const dataset = generateStudentRecords(size);
      const sizeResult = { size, algorithms: {} };

      for (const alg of algorithms) {
        // Skip O(n^2) for 10000+ in interactive response
        if (size > 5000 && (alg.id === 'bubble-sort' || alg.id === 'selection-sort')) {
          sizeResult.algorithms[alg.id] = {
            name: alg.name,
            executionTime: 'Skipped (>5k)',
            comparisons: 'N/A',
            swaps: 'N/A',
            theoretical: alg.theoretical
          };
          continue;
        }

        const run = alg.fn([...dataset]);
        sizeResult.algorithms[alg.id] = {
          name: alg.name,
          executionTime: run.executionTime,
          comparisons: run.comparisons,
          swaps: run.swaps,
          theoretical: alg.theoretical
        };
      }

      results.push(sizeResult);
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      benchmarkResults: results,
      theoreticalMatrix: algorithms.map(a => ({
        id: a.id,
        name: a.name,
        ...a.theoretical
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
