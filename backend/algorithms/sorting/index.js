const bubbleSort = require('./bubbleSort');
const selectionSort = require('./selectionSort');
const insertionSort = require('./insertionSort');
const mergeSort = require('./mergeSort');
const quickSort = require('./quickSort');
const heapSort = require('./heapSort');

const sortingAlgorithms = {
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'insertion-sort': insertionSort,
  'merge-sort': mergeSort,
  'quick-sort': quickSort,
  'heap-sort': heapSort,
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort
};

function getSortFunction(name) {
  const normalized = (name || 'merge-sort').toLowerCase().replace(/\s+/g, '-');
  return sortingAlgorithms[normalized] || mergeSort;
}

module.exports = {
  ...sortingAlgorithms,
  getSortFunction
};
