import { speakText } from '../utils/speech.js';

export function createListenButton(label, text, language) {
  const button = document.createElement('button');
  button.className = 'button secondary';
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => {
    speakText(text, language);
  });
  return button;
}
