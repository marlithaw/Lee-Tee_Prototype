import { speak } from '../utils/speech.js';

export const renderMedia = ({ container, section, i18n, store }) => {
  const settings = store.get('settings');
  container.innerHTML = `
    <p>${i18n.t(section.bodyKey)}</p>
    <div class="section-tools">
      <button class="secondary" type="button" data-listen>${i18n.t('ui.listen')}</button>
      <span>${i18n.t('ui.readAloudSection', { current: section.order, total: section.total })}</span>
    </div>
  `;

  if (settings.readAloud) {
    speak(i18n.t(section.bodyKey));
  }

  container.querySelector('[data-listen]').addEventListener('click', () => {
    speak(i18n.t(section.bodyKey));
  });
};
