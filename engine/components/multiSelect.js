export function renderMultiSelect(container, { section, i18n, onComplete }) {
  const prompt = document.createElement('p');
  prompt.textContent = i18n.t(section.promptKey);
  container.appendChild(prompt);

  const selected = new Set();
  const list = document.createElement('div');
  list.style.display = 'grid';
  list.style.gap = '0.5rem';

  const feedback = document.createElement('div');
  feedback.setAttribute('role', 'status');

  section.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'button secondary';
    button.type = 'button';
    button.textContent = i18n.t(option.labelKey);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (selected.has(option.id)) {
        selected.delete(option.id);
        button.setAttribute('aria-pressed', 'false');
      } else {
        selected.add(option.id);
        button.setAttribute('aria-pressed', 'true');
      }
    });
    list.appendChild(button);
  });

  const checkButton = document.createElement('button');
  checkButton.className = 'button';
  checkButton.type = 'button';
  checkButton.textContent = i18n.t('ui.multiselect.check');
  checkButton.addEventListener('click', () => {
    const correctIds = section.options.filter((opt) => opt.correct).map((opt) => opt.id);
    const isCorrect = correctIds.length === selected.size && correctIds.every((id) => selected.has(id));
    feedback.className = isCorrect ? 'status-message success' : 'status-message error';
    feedback.textContent = isCorrect ? i18n.t('ui.multiselect.correct') : i18n.t('ui.multiselect.incorrect');
    if (isCorrect) {
      onComplete();
    }
  });

  container.appendChild(list);
  container.appendChild(checkButton);
  container.appendChild(feedback);
}
