export function renderWriting(container, { section, i18n, onSave }) {
  const prompt = document.createElement('p');
  prompt.textContent = i18n.t(section.promptKey);
  container.appendChild(prompt);

  if (section.frames?.length) {
    const frameTitle = document.createElement('p');
    frameTitle.textContent = i18n.t('ui.writing.frames');
    container.appendChild(frameTitle);

    const list = document.createElement('ul');
    section.frames.forEach((frameKey) => {
      const item = document.createElement('li');
      item.textContent = i18n.t(frameKey);
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  const textarea = document.createElement('textarea');
  textarea.className = 'textarea';
  textarea.setAttribute('aria-label', i18n.t('ui.writing.response_label'));
  container.appendChild(textarea);

  const saveButton = document.createElement('button');
  saveButton.className = 'button';
  saveButton.type = 'button';
  saveButton.textContent = i18n.t('ui.writing.save');
  saveButton.addEventListener('click', () => {
    if (textarea.value.trim().length === 0) return;
    onSave();
  });
  container.appendChild(saveButton);
}
