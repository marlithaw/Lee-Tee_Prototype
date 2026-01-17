import { createEl } from '../utils/dom.js';
import { speakText } from '../utils/speech.js';

export function renderListenButton({ label, text, language }) {
  const button = createEl('button', { className: 'btn secondary', text: label });
  button.addEventListener('click', () => speakText(text, language));
  return button;
}
