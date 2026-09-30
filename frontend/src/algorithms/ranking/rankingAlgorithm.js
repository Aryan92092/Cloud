export function studentComparator(a, b) {
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

export function assignRanks(sortedStudents) {
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
      const isTied = (curr.percentage === prev.percentage && curr.total === prev.total);
      if (!isTied) {
        currentRank = i + 1; // Standard competition rank (1224 scheme)
      }
    }

    ranked.push({
      ...sortedStudents[i],
      rank: currentRank
    });
  }

  return ranked;
}
