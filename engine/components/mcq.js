import { createEl } from '../utils/dom.js';

export function renderMcq(section, { t, onComplete }) {
  const wrapper = createEl('div');
  wrapper.appendChild(createEl('p', { text: t(section.promptKey) }));
  const list = createEl('div');
  const feedback = createEl('div');
  section.options.forEach((option) => {
    const label = createEl('label', { className: 'toggle' });
    const input = createEl('input', { attrs: { type: section.multi ? 'checkbox' : 'radio', name: section.id } });
    const span = createEl('span', { text: t(option.labelKey) });
    label.append(input, span);
    list.appendChild(label);
  });
  const submit = createEl('button', { className: 'btn secondary', text: t('ui.checkAnswer') });
  submit.addEventListener('click', () => {
    const selected = Array.from(list.querySelectorAll('input')).filter((input) => input.checked);
    const selectedIds = selected.map((input, index) => section.options[index].id);
    const isCorrect = section.correct.every((id) => selectedIds.includes(id)) && selectedIds.length === section.correct.length;
    feedback.className = `feedback ${isCorrect ? '' : 'error'}`;
    feedback.textContent = isCorrect ? t(section.correctFeedbackKey) : t(section.incorrectFeedbackKey);
    if (isCorrect) {
      onComplete(section.id);
    }
  });
  wrapper.append(list, submit, feedback);
  return wrapper;
}
