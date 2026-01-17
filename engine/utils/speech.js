export const speak = (text, lang = "en") => {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};
