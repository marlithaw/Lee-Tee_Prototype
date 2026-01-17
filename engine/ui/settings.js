import { createEl } from '../utils/dom.js';

export function renderSettings(root, { state, t, onToggle }) {
  root.innerHTML = '';
  const heading = createEl('h3', { text: t('ui.readingSettings') });
  const list = createEl('div');

  const settings = [
    { key: 'readAloud', label: t('ui.readAloud') },
    { key: 'dyslexia', label: t('ui.dyslexiaFont') },
    { key: 'contrast', label: t('ui.highContrast') },
    { key: 'showHints', label: t('ui.showHints') }
  ];

  settings.forEach((setting) => {
    const row = createEl('label', { className: 'toggle' });
    const input = createEl('input', { attrs: { type: 'checkbox', 'aria-label': setting.label } });
    input.checked = state.settings[setting.key];
    input.addEventListener('change', () => onToggle(setting.key, input.checked));
    const span = createEl('span', { text: setting.label });
    row.append(input, span);
    list.appendChild(row);
  });

  root.append(heading, list);
}
