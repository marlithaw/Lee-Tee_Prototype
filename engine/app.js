import { getEpisodeId } from './router.js';
import { createStore } from './store.js';
import { createI18n } from './i18n.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderNav } from './ui/nav.js';
import { createModalManager } from './ui/modal.js';
import { createToastManager } from './ui/toast.js';
import { renderSettings } from './ui/settings.js';
import { renderObjectives } from './components/objectives.js';
import { renderSections } from './components/sectionRenderer.js';

const episodeId = getEpisodeId();
const store = createStore();
const modalManager = createModalManager(document.getElementById('modalRoot'));
const toast = createToastManager(document.getElementById('toastRoot'));

const languageSelect = document.getElementById('languageSelect');
const languageLabel = document.getElementById('languageLabel');

const appState = {
  episode: null,
  i18n: null,
};

function renderLanguageOptions() {
  const { episode, i18n } = appState;
  if (!episode || !i18n) return;
  languageSelect.innerHTML = '';
  episode.languages.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = i18n.t(`ui.language.${lang}`);
    languageSelect.appendChild(option);
  });
  languageSelect.value = i18n.getLanguage();
}

function updateProgressBar() {
  const progressFill = document.getElementById('progressFill');
  const total = appState.episode?.sections?.length || 0;
  const completed = store.getState().progress.completedSections.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressFill.style.width = `${percent}%`;
}

function updateHeader() {
  if (!appState.episode || !appState.i18n) return;
  const { i18n, episode } = appState;
  document.getElementById('episodeTitle').textContent = i18n.t(episode.titleKey);
  document.getElementById('episodeSubtitle').textContent = i18n.t(episode.subtitleKey);
  document.getElementById('episodeEyebrow').textContent = i18n.t(episode.eyebrowKey);
  languageLabel.textContent = i18n.t('ui.language.label');
  document.title = i18n.t('ui.page_title', { title: i18n.t(episode.titleKey) });
  renderLanguageOptions();
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }
}

function renderApp() {
  const { episode, i18n } = appState;
  if (!episode || !i18n) return;

  updateHeader();

  renderDashboard(document.getElementById('dashboard'), {
    episode,
    i18n,
    store,
    onContinue: () => {
      const next = store.getNextSection(episode.sections);
      if (next) {
        scrollToSection(next.id);
      }
    },
    onReset: () => {
      if (confirm(i18n.t('messages.reset_confirm'))) {
        store.reset();
        toast.show(i18n.t('messages.reset_done'));
        renderApp();
      }
    },
    onStopToggle: () => {
      const stopped = store.toggleStopped();
      toast.show(
        stopped ? i18n.t('messages.stopped') : i18n.t('messages.resumed')
      );
      renderApp();
    },
  });

  renderSettings(document.getElementById('settings'), {
    i18n,
    store,
    onChange: renderApp,
  });

  renderObjectives(document.getElementById('objectives'), {
    i18n,
    episode,
  });

  const helperRoot = document.getElementById('helpers');
  helperRoot.innerHTML = '';
  const helperCard = document.createElement('div');
  helperCard.className = 'card';
  const helperTitle = document.createElement('h3');
  helperTitle.textContent = i18n.t('ui.helpers.title');
  helperCard.appendChild(helperTitle);
  const helperButtons = document.createElement('div');
  helperButtons.className = 'helper-buttons';
  ['lee', 'tee'].forEach((characterId) => {
    const character = episode.characters[characterId];
    const button = document.createElement('button');
    button.className = 'button secondary';
    button.type = 'button';
    button.textContent = i18n.t(`ui.helpers.ask_${characterId}`);
    button.setAttribute('aria-label', i18n.t(`ui.helpers.ask_${characterId}`));
    button.addEventListener('click', () => {
      const tips = character.tips.map((tipKey) => `• ${i18n.t(tipKey)}`).join('\n');
      modalManager.open({
        title: i18n.t(character.nameKey),
        closeLabel: i18n.t('ui.modal.close'),
        content: `${i18n.t('ui.helpers.tips_intro')}\n\n${tips}`,
      });
    });
    helperButtons.appendChild(button);
  });
  helperCard.appendChild(helperButtons);
  helperRoot.appendChild(helperCard);

  renderNav(document.getElementById('quickJump'), {
    episode,
    i18n,
    store,
    onNavigate: (id) => scrollToSection(id),
  });

  renderSections(document.getElementById('sections'), {
    episode,
    i18n,
    store,
    modalManager,
    toast,
    onProgressChange: () => {
      updateProgressBar();
      renderNav(document.getElementById('quickJump'), {
        episode,
        i18n,
        store,
        onNavigate: (id) => scrollToSection(id),
      });
      renderDashboard(document.getElementById('dashboard'), {
        episode,
        i18n,
        store,
        onContinue: () => {
          const next = store.getNextSection(episode.sections);
          if (next) {
            scrollToSection(next.id);
          }
        },
        onReset: () => {
          if (confirm(i18n.t('messages.reset_confirm'))) {
            store.reset();
            toast.show(i18n.t('messages.reset_done'));
            renderApp();
          }
        },
        onStopToggle: () => {
          const stopped = store.toggleStopped();
          toast.show(
            stopped ? i18n.t('messages.stopped') : i18n.t('messages.resumed')
          );
          renderApp();
        },
      });
      updateProgressBar();
    },
  });

  updateProgressBar();
}

async function init() {
  const response = await fetch(`./episodes/${episodeId}/episode.json`);
  const episode = await response.json();
  const languages = episode.languages;
  const i18n = await createI18n({
    languages,
    defaultLang: store.getState().language,
    episodeId,
  });
  appState.episode = episode;
  appState.i18n = i18n;

  renderLanguageOptions();
  languageSelect.addEventListener('change', (event) => {
    store.setLanguage(event.target.value);
    i18n.setLanguage(event.target.value);
    renderApp();
  });

  i18n.onMissingKeys((keys) => {
    if (keys.length) {
      console.warn(`Missing i18n keys for ${i18n.getLanguage()}:`, keys);
    }
  });

  renderApp();
}

init();
