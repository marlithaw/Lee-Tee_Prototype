export function playAudio(url) {
  if (!url) return;
  const audio = new Audio(url);
  audio.play();
}
