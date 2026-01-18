export const renderWriting = ({ container, section, i18n, store }) => {
  const settings = store.get('settings');
  const framesHtml = settings.showHints && section.frames?.length
    ? `<div class="simplified">${section.frames.map((frame) => `<p>${i18n.t(frame)}</p>`).join('')}</div>`
    : '';
  const tipText = settings.showHints && section.tipKey ? i18n.t(section.tipKey) : '';

  container.innerHTML = `
    <p>${i18n.t(section.promptKey)}</p>
    ${framesHtml}
    <div class="write-area">
      <textarea aria-label="${i18n.t('ui.writingResponse')}"></textarea>
    </div>
    <div class="section-footer">
      <button class="primary" type="button" data-save>${i18n.t('ui.saveWriting')}</button>
      <span>${tipText}</span>
    </div>
  `;

  const textarea = container.querySelector('textarea');
  const saveButton = container.querySelector('[data-save]');
  const saved = store.get('progress').writing || {};
  textarea.value = saved[section.id] || '';

  saveButton.addEventListener('click', () => {
    const progress = store.get('progress');
    progress.writing = { ...(progress.writing || {}), [section.id]: textarea.value };
    store.set('progress', progress);
  });
};
