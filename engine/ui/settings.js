import { openModal } from './modal.js';

export const applyReadingSettings = (settings) => {
  document.body.classList.toggle('dyslexia', settings.dyslexiaFont);
  document.body.classList.toggle('high-contrast', settings.highContrast);
};

export const renderSettingsPanel = ({ trigger, i18n, store }) => {
  trigger.addEventListener('click', () => {
    const settings = store.get('settings');
    const content = `
      <div class="setting-grid">
        <div class="setting-row">
          <div>
            <strong>${i18n.t('ui.readAloud')}</strong>
            <p>${i18n.t('ui.readAloudDescription')}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" data-setting="readAloud" ${settings.readAloud ? 'checked' : ''} />
          </label>
        </div>
        <div class="setting-row">
          <div>
            <strong>${i18n.t('ui.dyslexiaFont')}</strong>
            <p>${i18n.t('ui.dyslexiaFontDescription')}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" data-setting="dyslexiaFont" ${settings.dyslexiaFont ? 'checked' : ''} />
          </label>
        </div>
        <div class="setting-row">
          <div>
            <strong>${i18n.t('ui.highContrast')}</strong>
            <p>${i18n.t('ui.highContrastDescription')}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" data-setting="highContrast" ${settings.highContrast ? 'checked' : ''} />
          </label>
        </div>
        <div class="setting-row">
          <div>
            <strong>${i18n.t('ui.showHints')}</strong>
            <p>${i18n.t('ui.showHintsDescription')}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" data-setting="showHints" ${settings.showHints ? 'checked' : ''} />
          </label>
        </div>
      </div>
    `;

    openModal({
      title: i18n.t('ui.readingSettings'),
      content,
      onClose: () => {
        applyReadingSettings(store.get('settings'));
      },
    });

    const modalRoot = document.getElementById('modal-root');
    modalRoot.querySelectorAll('input[data-setting]').forEach((input) => {
      input.addEventListener('change', () => {
        store.setSettings({ [input.dataset.setting]: input.checked });
        applyReadingSettings(store.get('settings'));
        window.dispatchEvent(new CustomEvent('settings:updated'));
      });
    });
  });
};
