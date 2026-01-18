export const speakText = (text, lang = "en-US") => {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};
