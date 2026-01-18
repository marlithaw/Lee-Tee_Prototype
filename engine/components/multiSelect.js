import { createToast } from '../ui/toast.js';

export const renderMultiSelect = ({ container, section, i18n }) => {
  container.innerHTML = `
    <p>${i18n.t(section.promptKey)}</p>
    <div>
      ${section.options
        .map(
          (option) => `
          <label class="toggle">
            <input type="checkbox" value="${option.id}" />
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
    const selected = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(
      (input) => input.value
    );
    if (!selected.length) {
      createToast(i18n.t('ui.selectAnswer'));
      return;
    }
    const correct = section.correct.sort().join(',');
    const current = selected.sort().join(',');
    if (correct === current) {
      feedback.className = 'feedback success';
      feedback.textContent = i18n.t('ui.correct');
    } else {
      feedback.className = 'feedback error';
      feedback.textContent = i18n.t('ui.incorrect');
    }
  });
};
