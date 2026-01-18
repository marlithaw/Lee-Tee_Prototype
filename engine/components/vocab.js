import { openModal } from '../ui/modal.js';
import { speak } from '../utils/speech.js';

export const renderVocab = ({ container, section, i18n }) => {
  container.innerHTML = `
    <p>${i18n.t(section.bodyKey)}</p>
    <div class="vocab-grid">
      ${section.words
        .map(
          (word) => `
            <button class="vocab-card" type="button" data-word="${word.id}">
              <strong>${i18n.t(word.wordKey)}</strong>
              <p>${i18n.t(word.shortKey)}</p>
            </button>
          `
        )
        .join('')}
    </div>
  `;

  container.querySelectorAll('[data-word]').forEach((card) => {
    card.addEventListener('click', () => {
      const word = section.words.find((entry) => entry.id === card.dataset.word);
      openModal({
        title: i18n.t(word.wordKey),
        content: `
          <p><strong>${i18n.t('ui.definition')}:</strong> ${i18n.t(word.definitionKey)}</p>
          <p><strong>${i18n.t('ui.spanishLine')}:</strong> ${i18n.t(word.spanishKey)}</p>
          <p><strong>${i18n.t('ui.example')}:</strong> ${i18n.t(word.exampleKey)}</p>
          <button class="primary" id="hear-word">${i18n.t('ui.hearIt')}</button>
        `,
        onClose: () => {},
      });
      const modalRoot = document.getElementById('modal-root');
      const hearButton = modalRoot.querySelector('#hear-word');
      hearButton?.addEventListener('click', () => {
        speak(i18n.t(word.wordKey));
      });
    });
  });
};
