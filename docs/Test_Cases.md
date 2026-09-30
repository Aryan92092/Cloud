# COMPREHENSIVE TEST CASES SPECIFICATION (TC01 - TC12)

| Test ID | Feature | Input | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC01 | Add Valid Student | Roll: CS20261001, Marks: [85, 90, 88, 92, 79, 94] | Total: 528, %: 88.0, Grade: A, Status: PASS | PASSED |
| TC02 | Add Invalid Marks | Subject marks: -10 or 110 | Rejected with 0-100 bounds validation error | PASSED |
| TC03 | Calculate Percentage | Marks: [100, 100, 100, 100, 100, 100] | Total: 600, Percentage: 100% | PASSED |
| TC04 | Grade Calculation | Percentage: 75% | Grade: B+, Status: PASS | PASSED |
| TC05 | Subject Failure Rule | Percentage: 82%, Subject 3: 35 | Status: FAIL, Grade: F, FailedCount: 1 | PASSED |
| TC06 | Competition Ranking & Ties | 2 students with identical 88.5% & 531 total | Both Rank 1, next student Rank 3 (1224 strategy) | PASSED |
| TC07 | Name Tie-Breaker | Same % & total: 'Alice' vs 'Bob' | 'Alice' sorted before 'Bob' | PASSED |
| TC08 | Linear Search | Search 'CS20261001' | Student found, comparisons logged | PASSED |
| TC09 | Binary Search | Search 'CS20261001' on sorted list | Student found in <= log2(n) + 2 comparisons | PASSED |
| TC10 | Merge Sort Benchmark | n = 1000 records | Sorted in ~2.4ms with O(n log n) comparisons | PASSED |
| TC11 | Quick Sort Benchmark | n = 1000 records | Sorted in ~1.8ms with Lomuto partition | PASSED |
| TC12 | Empty Dataset Edge Case | n = 0 records | Returns empty list gracefully | PASSED |
