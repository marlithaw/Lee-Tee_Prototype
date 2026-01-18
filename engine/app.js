import { loadEpisode } from './router.js';
import { createStore } from './store.js';
import { createI18n } from './i18n.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderQuickJump } from './ui/nav.js';
import { renderSettingsPanel } from './ui/settings.js';
import { renderObjectives } from './components/objectives.js';
import { renderSections } from './components/sectionRenderer.js';
import { applyReadingSettings } from './ui/settings.js';

const state = {
  episode: null,
  i18n: null,
  store: null,
};

const init = async () => {
  state.store = createStore();
  const episodeId = loadEpisode();
  const episode = await fetch(`./episodes/${episodeId}/episode.json`).then((res) => res.json());
  const i18n = await createI18n({
    episodeId,
    defaultLang: 'en',
    supportedLangs: episode.languages,
    storedLang: state.store.get('language'),
  });

  state.episode = episode;
  state.i18n = i18n;

  const languageSelect = document.getElementById('language-select');
  const languageLabel = document.getElementById('language-label');
  const subtitle = document.getElementById('app-subtitle');
  const settingsButton = document.getElementById('open-settings');

  i18n.setLanguage(i18n.language);

  const renderAll = () => {
    languageLabel.textContent = i18n.t('ui.languageLabel');
    subtitle.textContent = i18n.t(episode.meta.subtitleKey);
    settingsButton.textContent = i18n.t('ui.readingSettings');
    renderDashboard({
      container: document.getElementById('dashboard'),
      episode,
      i18n,
      store: state.store,
    });
    renderQuickJump({
      container: document.getElementById('quick-jump'),
      episode,
      i18n,
    });
    renderObjectives({
      container: document.getElementById('objectives'),
      episode,
      i18n,
    });
    renderSections({
      container: document.getElementById('sections'),
      episode,
      i18n,
      store: state.store,
    });
  };

  languageSelect.innerHTML = '';
  i18n.supportedLangs.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = i18n.getLanguageLabel(lang);
    if (lang === i18n.language) option.selected = true;
    languageSelect.appendChild(option);
  });

  languageSelect.addEventListener('change', (event) => {
    const nextLang = event.target.value;
    i18n.setLanguage(nextLang);
    state.store.set('language', nextLang);
    renderAll();
  });

  renderSettingsPanel({
    trigger: settingsButton,
    i18n,
    store: state.store,
  });

  window.addEventListener('settings:updated', renderAll);
  window.addEventListener('progress:updated', renderAll);

  applyReadingSettings(state.store.get('settings'));
  renderAll();
};

init();
