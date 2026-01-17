import { getEpisodeId } from "./router.js";
import { loadTranslations, t } from "./i18n.js";
import { getState, setLanguage, updateSettings, updateProgress, resetProgress } from "./store.js";
import { qs, qsa, clear } from "./utils/dom.js";
import { renderDashboard } from "./ui/dashboard.js";
import { renderQuickNav } from "./ui/nav.js";
import { renderSettings } from "./ui/settings.js";
import { renderObjectivesPanel } from "./components/objectives.js";
import { renderSection } from "./components/sectionRenderer.js";
import { showToast } from "./ui/toast.js";
import { validateEpisode } from "./utils/validate.js";

const episodeId = getEpisodeId();
const languageSelect = qs("#language-select");
const sectionsRoot = qs("#sections");
const episodeTitle = qs("#episode-title");

const loadEpisode = async () => {
  const response = await fetch(`episodes/${episodeId}/episode.json`);
  return response.json();
};

const applySettings = (settings) => {
  document.body.classList.toggle("dyslexia", settings.dyslexia);
  document.body.classList.toggle("high-contrast", settings.highContrast);
};

const render = async () => {
  const state = getState();
  const episode = await loadEpisode();
  const errors = validateEpisode(episode);
  if (errors.length) {
    showToast(errors.join(", "));
  }

  await loadTranslations(episode.id, state.language);
  updateStaticText();
  episodeTitle.textContent = t(episode.titleKey);

  const progress = state.progress[episode.id] || {
    completedSections: [],
    points: 0,
    badges: [],
    stopped: false,
  };

  qs("#stop-episode").textContent = progress.stopped ? t("ui.resume") : t("ui.stop");

  renderDashboard({
    container: qs("#dashboard"),
    episode,
    progress,
    onContinue: () => {
      if (progress.stopped) {
        progress.stopped = false;
        updateProgress(episode.id, progress);
      }
      const nextId = episode.sections.find((section) => !progress.completedSections.includes(section.id))?.id;
      if (nextId) {
        document.getElementById(nextId)?.scrollIntoView({ behavior: "smooth" });
      }
    },
  });

  renderQuickNav({ container: qs("#quick-nav"), navItems: episode.nav });
  renderSettings({
    container: qs("#settings-panel"),
    settings: state.settings,
    onToggle: (key, value) => {
      updateSettings({ [key]: value });
      applySettings(getState().settings);
      render();
    },
  });
  renderObjectivesPanel({ container: qs("#objectives-panel"), objectives: episode.objectives });

  clear(sectionsRoot);
  episode.sections.forEach((section, index) => {
    const sectionEl = renderSection({
      section,
      index,
      total: episode.sections.length,
      progress,
      settings: state.settings,
      onComplete: (sectionId) => {
        if (!progress.completedSections.includes(sectionId)) {
          progress.completedSections.push(sectionId);
          progress.points += 5;
          if (progress.completedSections.length === episode.sections.length) {
            progress.badges = [...new Set([...(progress.badges || []), t("dashboard.finishBadge")])];
          }
          updateProgress(episode.id, progress);
          render();
        }
      },
    });
    sectionsRoot.append(sectionEl);
  });

  applySettings(state.settings);
  updateLanguageOptions();
};

const updateStaticText = () => {
  qsa("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  qsa("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
};

const updateLanguageOptions = () => {
  const languages = [
    { id: "en", label: "English" },
    { id: "es", label: "Español" },
    { id: "fr", label: "Français" },
    { id: "ht", label: "Kreyòl Ayisyen" },
  ];
  clear(languageSelect);
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.id;
    option.textContent = lang.label;
    if (lang.id === getState().language) option.selected = true;
    languageSelect.append(option);
  });
};

languageSelect.addEventListener("change", () => {
  setLanguage(languageSelect.value);
  render();
});

qs("#reset-progress").addEventListener("click", () => {
  resetProgress(episodeId);
  showToast(t("dashboard.progressReset"));
  render();
});

qs("#stop-episode").addEventListener("click", () => {
  const state = getState();
  const progress = state.progress[episodeId] || {};
  progress.stopped = !progress.stopped;
  updateProgress(episodeId, progress);
  showToast(progress.stopped ? t("dashboard.stopped") : t("dashboard.resumed"));
  render();
});

render();
