export function renderSettings(container, { i18n, store, onChange }) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = i18n.t('ui.settings.title');
  card.appendChild(title);

  const state = store.getState();
  const settings = [
    {
      key: 'readAloud',
      label: i18n.t('ui.settings.read_aloud'),
    },
    {
      key: 'dyslexiaFont',
      label: i18n.t('ui.settings.dyslexia_font'),
    },
    {
      key: 'highContrast',
      label: i18n.t('ui.settings.high_contrast'),
    },
    {
      key: 'showHints',
      label: i18n.t('ui.settings.show_hints'),
    },
  ];

  settings.forEach((setting) => {
    const row = document.createElement('div');
    row.className = 'toggle';

    const label = document.createElement('label');
    label.textContent = setting.label;
    label.setAttribute('for', `setting-${setting.key}`);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `setting-${setting.key}`;
    input.checked = Boolean(state.settings[setting.key]);
    input.setAttribute('aria-label', setting.label);
    input.addEventListener('change', () => {
      store.updateSettings({ [setting.key]: input.checked });
      applySettings(store.getState().settings);
      onChange();
    });

    row.appendChild(label);
    row.appendChild(input);
    card.appendChild(row);
  });

  container.appendChild(card);
  applySettings(state.settings);
}

export function applySettings(settings) {
  document.body.classList.toggle('dyslexia-mode', settings.dyslexiaFont);
  document.body.classList.toggle('high-contrast', settings.highContrast);
}
