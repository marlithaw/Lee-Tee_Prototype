import { createToast } from '../ui/toast.js';

export const renderMcq = ({ container, section, i18n, store, episodeId }) => {
  container.innerHTML = `
    <p>${i18n.t(section.promptKey)}</p>
    <div>
      ${section.options
        .map(
          (option) => `
          <label class="toggle">
            <input type="radio" name="${section.id}" value="${option.id}" />
            ${i18n.t(option.labelKey)}
          </label>
        `
        )
        .join('')}
    </div>
    <button class="primary" type="button" data-submit>${i18n.t('ui.checkAnswer')}</button>
    <div class="feedback" aria-live="polite"></div>
  `;

  const submit = container.querySelector('[data-submit]');
  const feedback = container.querySelector('.feedback');

  submit.addEventListener('click', () => {
    const selected = container.querySelector('input[type="radio"]:checked');
    if (!selected) {
      createToast(i18n.t('ui.selectAnswer'));
      return;
    }
    if (selected.value === section.correct) {
      feedback.className = 'feedback success';
      feedback.textContent = i18n.t('ui.correct');
      store.updateProgress(episodeId, { [section.id]: true });
      window.dispatchEvent(new CustomEvent('progress:updated'));
    } else {
      feedback.className = 'feedback error';
      feedback.textContent = i18n.t('ui.incorrect');
    }
  });
};
