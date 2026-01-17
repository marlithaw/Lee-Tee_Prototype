import { getEpisodeId } from './router.js';
import { getState, updateState, getDefaultProgress } from './store.js';
import { loadI18n, setLanguage, t, getLanguage } from './i18n.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderNav } from './ui/nav.js';
import { renderSettings } from './ui/settings.js';
import { renderObjectives } from './components/objectives.js';
import { renderSection } from './components/sectionRenderer.js';
import { openModal } from './ui/modal.js';
import { showToast } from './ui/toast.js';
import { qs, qsa, createEl } from './utils/dom.js';

const episodeId = getEpisodeId();
const languageSelect = qs('#languageSelect');

const episodeResponse = await fetch(`episodes/${episodeId}/episode.json`);
const episode = await episodeResponse.json();

await loadI18n(episodeId, episode.languages);

function applyLanguageOptions() {
  languageSelect.innerHTML = '';
  episode.languages.forEach((lang) => {
    const option = createEl('option', { attrs: { value: lang }, text: lang.toUpperCase() });
    languageSelect.appendChild(option);
  });
  languageSelect.value = getLanguage();
  languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
    render();
  });
}

function applyI18n() {
  qsa('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

function updateSettingsClasses(state) {
  document.body.classList.toggle('dyslexia-mode', state.settings.dyslexia);
  document.body.classList.toggle('high-contrast', state.settings.contrast);
}

function renderHelpers(root, state) {
  root.innerHTML = '';
  const leeButton = createEl('button', { className: 'btn secondary', text: t('ui.askLee') });
  leeButton.addEventListener('click', () => {
    openModal({
      title: t('ui.askLee'),
      content: `<p>${t(episode.helpers.leeKey)}</p>`,
      ariaLabel: t('ui.askLee'),
      closeLabel: t('ui.close')
    });
  });
  const teeButton = createEl('button', { className: 'btn ghost', text: t('ui.askTee') });
  teeButton.addEventListener('click', () => {
    openModal({
      title: t('ui.askTee'),
      content: `<p>${t(episode.helpers.teeKey)}</p>`,
      ariaLabel: t('ui.askTee'),
      closeLabel: t('ui.close')
    });
  });
  const status = createEl('p', { className: 'section-meta', text: `${t('ui.sectionProgress')}: ${state.progress.completedSections.length}/${episode.sections.length}` });
  root.append(leeButton, teeButton, status);
}

function renderSections(root, state) {
  root.innerHTML = '';
  episode.sections.forEach((section, index) => {
    const card = renderSection(section, {
      t,
      state,
      language: getLanguage(),
      index,
      total: episode.sections.length,
      onComplete: (id) => {
        const nextState = updateState((current) => {
          if (current.progress.completedSections.includes(id)) return current;
          const completedSections = [...current.progress.completedSections, id];
          const earnedBadge = completedSections.length === episode.sections.length;
          const episodeBadge = t('episode.title');
          return {
            ...current,
            progress: {
              ...current.progress,
              completedSections,
              points: current.progress.points + 10,
              badges: earnedBadge && !current.progress.badges.includes(episodeBadge)
                ? [...current.progress.badges, episodeBadge]
                : current.progress.badges
            }
          };
        });
        showToast(t('ui.sectionComplete'));
        render();
        return nextState;
      }
    });
    root.appendChild(card);
  });
}

function getNextSectionId(state) {
  const remaining = episode.sections.find((section) => !state.progress.completedSections.includes(section.id));
  return remaining?.id || episode.sections[0]?.id;
}

function render() {
  const state = getState();
  applyI18n();
  updateSettingsClasses(state);

  renderDashboard(qs('#dashboard'), {
    episode,
    state,
    t,
    onContinue: () => {
      const id = getNextSectionId(state);
      document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
    },
    onResume: () => {
      updateState((current) => ({ ...current, progress: { ...current.progress, stopped: false } }));
      showToast(t('ui.resumed'));
      render();
    }
  });

  renderNav(qs('#quickNav'), { navItems: episode.navItems, t });
  renderSettings(qs('#settingsPanel'), {
    state,
    t,
    onToggle: (key, value) => {
      updateState((current) => ({
        ...current,
        settings: { ...current.settings, [key]: value }
      }));
      render();
    }
  });

  renderObjectives(qs('#objectivesPanel'), { episode, t });
  renderHelpers(qs('#helpers'), state);
  renderSections(qs('#sections'), state);
}

qs('#resetProgress').addEventListener('click', () => {
  updateState((current) => ({
    ...current,
    progress: getDefaultProgress()
  }));
  showToast(t('ui.progressReset'));
  render();
});

qs('#stopEpisode').addEventListener('click', () => {
  updateState((current) => ({ ...current, progress: { ...current.progress, stopped: true } }));
  showToast(t('ui.stopped'));
  render();
});

applyLanguageOptions();
render();
