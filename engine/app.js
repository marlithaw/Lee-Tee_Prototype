import { getEpisodeId } from "./router.js";
import { store } from "./store.js";
import { loadLanguage, setAvailableLanguages, t } from "./i18n.js";
import { renderDashboard } from "./ui/dashboard.js";
import { renderNav } from "./ui/nav.js";
import { renderSettings } from "./ui/settings.js";
import { renderObjectives, renderStrategies } from "./components/objectives.js";
import { renderSection } from "./components/sectionRenderer.js";
import { clear, qs } from "./utils/dom.js";
import { showToast } from "./ui/toast.js";

const episodeId = getEpisodeId();
const languages = ["en", "es", "fr", "ht"];

const applySettingsToBody = (settings) => {
  document.body.classList.toggle("contrast", settings.contrast);
  document.body.classList.toggle("dyslexia", settings.dyslexia);
  document.body.classList.toggle("hide-hints", !settings.showHints);
};

const applyStoppedState = (stopped) => {
  document.body.classList.toggle("stopped", stopped);
  const stopButton = qs("#stop-episode");
  stopButton.textContent = stopped ? t("ui.resume") : t("ui.stop");
  qs("#sections").querySelectorAll("button, textarea, select").forEach((node) => {
    if (node.id === "stop-episode" || node.id === "reset-progress" || node.id === "language-switch") return;
    node.disabled = stopped;
  });
};

const updateStaticLabels = () => {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
};

const loadEpisode = async () => {
  const response = await fetch(`./episodes/${episodeId}/episode.json`);
  if (!response.ok) throw new Error("Episode not found");
  return response.json();
};

const init = async () => {
  const episode = await loadEpisode();
  setAvailableLanguages(languages);
  await Promise.all(languages.map((lang) => loadLanguage(episodeId, lang)));

  const state = store.getState();
  const titleNode = qs("#episode-title");
  const subtitleNode = qs("#episode-subtitle");

  const languageSwitch = qs("#language-switch");
  clear(languageSwitch);
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.toUpperCase();
    languageSwitch.appendChild(option);
  });
  languageSwitch.value = state.language;
  languageSwitch.addEventListener("change", () => store.setLanguage(languageSwitch.value));

  const resetButton = qs("#reset-progress");
  resetButton.addEventListener("click", () => {
    store.resetProgress();
    showToast(t("ui.resetProgress"));
  });

  const stopButton = qs("#stop-episode");
  stopButton.addEventListener("click", () => {
    store.setStopped(!store.getState().stopped);
  });

  const renderAll = (currentState) => {
    applySettingsToBody(currentState.settings);
    updateStaticLabels();
    document.documentElement.lang = currentState.language;
    titleNode.textContent = t(episode.titleKey);
    subtitleNode.textContent = t(episode.subtitleKey);

    renderDashboard({
      container: qs("#dashboard"),
      episode,
      progress: currentState.progress,
      sectionCount: episode.sections.length,
    });

    renderSettings({
      container: qs("#settings"),
      settings: currentState.settings,
      onChange: (settings) => store.updateSettings(settings),
    });

    renderObjectives({ container: qs("#objectives"), objectives: episode.objectives });
    renderStrategies({ container: qs("#strategies"), strategies: episode.strategies });

    renderNav({ container: qs("#quick-jump"), sections: episode.sections });

    const sectionsRoot = qs("#sections");
    clear(sectionsRoot);
    episode.sections.forEach((section, index) => {
      const sectionNode = renderSection({
        section: { ...section, index: index + 1, total: episode.sections.length },
        state: currentState,
        language: currentState.language,
        onComplete: (sectionId) => {
          const completed = new Set(currentState.progress.completedSections);
          completed.add(sectionId);
          const updatedBadges = currentState.progress.badges.length
            ? currentState.progress.badges
            : [t("dashboard.noBadges")];
          store.setProgress({
            completedSections: Array.from(completed),
            badges: updatedBadges,
            points: currentState.progress.points + 10,
          });
        },
      });
      sectionsRoot.appendChild(sectionNode);
    });

    applyStoppedState(currentState.stopped);
  };

  renderAll(state);
  store.subscribe(renderAll);
};

init().catch((error) => {
  console.error(error);
  const fallback = "Failed to load episode.";
  const message = t("errors.loadEpisode");
  showToast(message === "errors.loadEpisode" ? fallback : message);
});
