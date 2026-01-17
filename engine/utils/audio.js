export function playAudio(src) {
  if (!src) return;
  const audio = new Audio(src);
  audio.play().catch((error) => {
    console.warn("Audio playback failed", error);
  });
}
