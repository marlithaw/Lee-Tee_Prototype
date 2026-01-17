export function renderMcq(container, { section, i18n, onComplete }) {
  const question = document.createElement('p');
  question.textContent = i18n.t(section.promptKey);
  container.appendChild(question);

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
    button.setAttribute('aria-label', i18n.t(option.labelKey));
    button.addEventListener('click', () => {
      if (option.correct) {
        feedback.className = 'status-message success';
        feedback.textContent = i18n.t('ui.mcq.correct');
        onComplete();
      } else {
        feedback.className = 'status-message error';
        feedback.textContent = i18n.t('ui.mcq.incorrect');
      }
    });
    list.appendChild(button);
  });

  container.appendChild(list);
  container.appendChild(feedback);
}
