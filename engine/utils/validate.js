export function isCompleteMatch(expected, placements) {
  return Object.entries(expected).every(([itemId, targetId]) => placements[itemId] === targetId);
}

export function hasAllSelections(expectedCount, selections) {
  return selections.length === expectedCount;
}
