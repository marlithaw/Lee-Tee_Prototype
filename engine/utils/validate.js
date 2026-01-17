export const isComplete = (items, completedIds) =>
  items.every((item) => completedIds.includes(item));
