export const ALGORITHM_METADATA = {
  'merge-sort': {
    name: 'Merge Sort',
    category: 'Divide and Conquer',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    description: 'Divides the dataset into two equal halves, recursively sorts them, and merges the sorted halves with guaranteed O(n log n) stability.',
    recommendedFor: 'Large student cohorts where consistent sorting time and stability are essential.'
  },
  'quick-sort': {
    name: 'Quick Sort',
    category: 'Divide and Conquer (Partitioning)',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    description: 'Selects a pivot element and partitions the array into lower and higher subsets. Features exceptional cache locality and low constant factors.',
    recommendedFor: 'General in-memory ranking with minimal auxiliary memory overhead.'
  },
  'heap-sort': {
    name: 'Heap Sort',
    category: 'Selection / Binary Heap',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    description: 'Builds a binary max-heap over the student array and extracts top elements repeatedly. Completely in-place with zero heap allocation.',
    recommendedFor: 'Strict memory-constrained environments requiring guaranteed O(n log n) bounds.'
  },
  'insertion-sort': {
    name: 'Insertion Sort',
    category: 'Incremental',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description: 'Constructs the ranked list element by element. Achieves O(n) linear performance when processing nearly-sorted student records.',
    recommendedFor: 'Small batches (< 50 students) or updating existing merit lists with a few new admissions.'
  },
  'selection-sort': {
    name: 'Selection Sort',
    category: 'Selection',
    bestTime: 'O(n²)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: false,
    description: 'Iteratively scans for the highest percentage student in the unsorted suffix. Executes at most n-1 memory swaps regardless of inputs.',
    recommendedFor: 'Educational demonstrations and hardware scenarios where memory writes are costly.'
  },
  'bubble-sort': {
    name: 'Bubble Sort',
    category: 'Exchange',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description: 'Continuously swaps adjacent out-of-order records until no inversions remain. Includes early termination if no swaps are made.',
    recommendedFor: 'Educational visualization and detecting whether results are already in sorted order.'
  }
};

export const DEFAULT_SUBJECTS = [
  'Data Structures',
  'DBMS',
  'DAA',
  'Computer Networks',
  'Mathematics',
  'Artificial Intelligence'
];

export const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering'
];
