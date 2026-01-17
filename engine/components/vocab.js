import { speakText } from '../utils/speech.js';

export function renderVocab(container, { section, i18n, modalManager }) {
  const grid = document.createElement('div');
  grid.className = 'vocab-grid';

  section.items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    const term = document.createElement('strong');
    term.textContent = i18n.t(item.termKey);
    card.appendChild(term);

    const definition = document.createElement('p');
    definition.textContent = i18n.t(item.definitionKey);
    card.appendChild(definition);

    const openBtn = document.createElement('button');
    openBtn.className = 'button secondary';
    openBtn.type = 'button';
    openBtn.textContent = i18n.t('ui.vocab.open');
    openBtn.setAttribute('aria-label', i18n.t('ui.vocab.open'));
    openBtn.addEventListener('click', () => {
      modalManager.open({
        title: i18n.t(item.termKey),
        closeLabel: i18n.t('ui.modal.close'),
        content: [
          i18n.t(item.definitionKey),
          i18n.t(item.spanishKey),
          i18n.t(item.exampleKey),
        ].join('\n\n'),
      });
    });
    card.appendChild(openBtn);

    const hearBtn = document.createElement('button');
    hearBtn.className = 'button ghost';
    hearBtn.type = 'button';
    hearBtn.textContent = i18n.t('ui.vocab.hear');
    hearBtn.setAttribute('aria-label', i18n.t('ui.vocab.hear'));
    hearBtn.addEventListener('click', () => {
      speakText(i18n.t(item.termKey), i18n.getLanguage());
    });
    card.appendChild(hearBtn);

    grid.appendChild(card);
  });

  container.appendChild(grid);
}
