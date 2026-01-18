export const playAudio = (src) => {
  if (!src) return null;
  const audio = new Audio(src);
  audio.play().catch(() => {
    console.warn("Audio playback blocked.");
  });
  return audio;
};
