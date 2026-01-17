export function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
  return audio;
}
