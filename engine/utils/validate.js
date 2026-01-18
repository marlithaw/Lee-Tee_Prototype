export const evaluateMcq = (selected, correct) => selected === correct;

export const evaluateMultiSelect = (selectedIds, correctIds) => {
  if (selectedIds.length !== correctIds.length) return false;
  return selectedIds.every((id) => correctIds.includes(id));
};

export const evaluateDragMatch = (placements, expected) => {
  return expected.every((pair) => placements[pair.itemId] === pair.targetId);
};
