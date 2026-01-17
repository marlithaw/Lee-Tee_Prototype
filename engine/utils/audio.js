export const playAudio = (src) => {
  if (!src) return;
  const audio = new Audio(src);
  audio.play().catch(() => {
    console.warn("Audio playback blocked.");
  });
};
