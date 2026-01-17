import { createEl } from '../utils/dom.js';
import { openModal } from '../ui/modal.js';
import { speakText } from '../utils/speech.js';

export function renderVocab(section, { t, language, onComplete, settings }) {
  const wrapper = createEl('div');
  const intro = createEl('p', { text: t(section.introKey) });
  const grid = createEl('div', { className: 'card-grid' });

  section.words.forEach((word) => {
    const card = createEl('div', { className: 'card' });
    card.appendChild(createEl('h4', { text: t(word.wordKey) }));
    card.appendChild(createEl('p', { text: t(word.definitionKey) }));

    const button = createEl('button', { className: 'btn ghost', text: t('ui.openCard') });
    button.addEventListener('click', () => {
      const content = createEl('div');
      content.appendChild(createEl('p', { text: t(word.definitionKey) }));
      content.appendChild(createEl('p', { text: t(word.spanishKey) }));
      content.appendChild(createEl('p', { text: `${t('ui.exampleInStory')}: ${t(word.exampleKey)}` }));
      const hearBtn = createEl('button', { className: 'btn secondary', text: t('ui.hearIt') });
      hearBtn.disabled = !settings.readAloud;
      hearBtn.addEventListener('click', () => speakText(t(word.wordKey), language));
      content.appendChild(hearBtn);
      openModal({ title: t(word.wordKey), content, ariaLabel: t('ui.vocabDetails'), closeLabel: t('ui.close') });
    });
    card.appendChild(button);
    grid.appendChild(card);
  });

  const completeBtn = createEl('button', { className: 'btn secondary', text: t('ui.markComplete') });
  completeBtn.addEventListener('click', () => onComplete(section.id));
  wrapper.append(intro, grid, completeBtn);
  return wrapper;
}
