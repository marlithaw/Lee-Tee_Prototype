export function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

export function getProgress(completed, total) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}
