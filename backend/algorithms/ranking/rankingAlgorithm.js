/**
 * Multi-Key Tie-Breaker Comparator:
 * 1. Percentage Descending (Higher percentage comes first)
 * 2. Total Marks Descending (Higher total marks comes first)
 * 3. Student Name Ascending (Alphabetical order for tie-breaking)
 * 
 * Returns negative if studentA should come before studentB (higher rank)
 * Returns positive if studentB should come before studentA
 * Returns 0 if identical in all 3 criteria
 */
function studentComparator(a, b) {
  // 1. Percentage descending
  if (b.percentage !== a.percentage) {
    return b.percentage - a.percentage;
  }
  // 2. Total marks descending
  if (b.total !== a.total) {
    return b.total - a.total;
  }
  // 3. Student Name ascending (lexicographical)
  const nameA = (a.name || '').toLowerCase();
  const nameB = (b.name || '').toLowerCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
}

/**
 * Standard Competition Ranking (1224 Ranking Strategy):
 * If two or more students share identical percentage & total marks, they receive the SAME rank.
 * The subsequent rank skips by the number of tied students.
 * e.g., Tied for 1st (2 students) -> 1, 1, 3, 4
 */
function assignRanks(sortedStudents) {
  if (!Array.isArray(sortedStudents) || sortedStudents.length === 0) {
    return [];
  }

  const ranked = [];
  let currentRank = 1;

  for (let i = 0; i < sortedStudents.length; i++) {
    if (i === 0) {
      currentRank = 1;
    } else {
      const prev = sortedStudents[i - 1];
      const curr = sortedStudents[i];

      // Check if current is tied with previous on academic performance (percentage and total)
      const isTied = (curr.percentage === prev.percentage && curr.total === prev.total);
      if (!isTied) {
        currentRank = i + 1; // Standard competition rank skip
      }
    }

    ranked.push({
      ...sortedStudents[i],
      rank: currentRank
    });
  }

  return ranked;
}

module.exports = {
  studentComparator,
  assignRanks
};
