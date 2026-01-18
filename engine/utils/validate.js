export const requireKeys = (data, keys) => {
  const missing = keys.filter((key) => !(key in data));
  if (missing.length) {
    console.warn('Missing keys:', missing);
  }
  return missing.length === 0;
};
