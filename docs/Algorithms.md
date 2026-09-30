# DAA ALGORITHMS SPECIFICATION & PSEUDOCODE GUIDE

## 1. Multi-Key Student Comparator
```text
Algorithm StudentComparator(Student A, Student B):
1. if A.percentage != B.percentage then:
       return (A.percentage > B.percentage) ? -1 : 1
2. if A.total != B.total then:
       return (A.total > B.total) ? -1 : 1
3. if A.name.toLowerCase() < B.name.toLowerCase() then return -1
4. if A.name.toLowerCase() > B.name.toLowerCase() then return 1
5. return 0
```

## 2. Merge Sort Pseudocode
```text
Algorithm MergeSort(A, low, high):
1. if low < high then:
2.     mid = floor((low + high) / 2)
3.     MergeSort(A, low, mid)
4.     MergeSort(A, mid + 1, high)
5.     Merge(A, low, mid, high)
```

## 3. Quick Sort Pseudocode
```text
Algorithm QuickSort(A, low, high):
1. if low < high then:
2.     pi = Partition(A, low, high)
3.     QuickSort(A, low, pi - 1)
4.     QuickSort(A, pi + 1, high)
```

## 4. Binary Search Pseudocode
```text
Algorithm BinarySearch(A, n, key):
1. low = 0, high = n - 1
2. while low <= high do:
3.     mid = floor((low + high) / 2)
4.     if A[mid].field == key then return mid
5.     else if A[mid].field < key then low = mid + 1
6.     else high = mid - 1
7. return -1
```
