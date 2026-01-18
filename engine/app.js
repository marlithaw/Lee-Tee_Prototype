import { getEpisodeId } from "./router.js";
import { store } from "./store.js";
import {
  ensurePseudoLocale,
  getLanguageLabel,
  getMissingCriticalKeys,
  loadLanguage,
  missingKeysReport,
  setAvailableLanguages,
  t,
  coverageReport,
} from "./i18n.js";
import { renderDashboard } from "./ui/dashboard.js";
import { renderNav } from "./ui/nav.js";
import { renderSettings } from "./ui/settings.js";
import { renderObjectives, renderStrategies } from "./components/objectives.js";
import { renderSection } from "./components/sectionRenderer.js";
import { clear, qs } from "./utils/dom.js";
import { showToast } from "./ui/toast.js";

const episodeId = getEpisodeId();
const languages = ["en", "es", "fr", "ht", "ps"];
const strictMode = new URLSearchParams(window.location.search).get("i18n") === "strict";

const applySettingsToBody = (settings) => {
  document.body.classList.toggle("contrast", settings.contrast);
  document.body.classList.toggle("dyslexia", settings.dyslexia);
  document.body.classList.toggle("show-hints", settings.showHints);
};

const applyStoppedState = (stopped) => {
  document.body.classList.toggle("stopped", stopped);
  const stopButton = qs("#stop-episode");
  stopButton.textContent = stopped ? t("ui.resume") : t("ui.stop");
  qs("#sections").querySelectorAll("button, textarea, select, input, audio, video").forEach((node) => {
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
  ensurePseudoLocale();

  const state = store.getState();
  const titleNode = qs("#episode-title");
  const subtitleNode = qs("#episode-subtitle");
  const heroTitle = qs("#hero-title");
  const heroSubtitle = qs("#hero-subtitle");
  const heroImage = qs("#hero-image");
  const header = qs("#app-header");
  const hero = qs("#hero");

  const languageSwitch = qs("#language-switch");
  clear(languageSwitch);
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = getLanguageLabel(lang);
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
    if (strictMode) {
      const missingCritical = getMissingCriticalKeys(currentState.language);
      if (missingCritical.length) {
        document.body.innerHTML = `
          <main class="i18n-error">
            <h1>${t("i18n.strictTitle")}</h1>
            <p>${t("i18n.strictMessage")}</p>
            <pre>${missingCritical.join("\n")}</pre>
            <p class="muted">${t("i18n.strictHint")}</p>
          </main>
        `;
        console.error("Critical i18n keys missing:", missingCritical);
        return;
      }
    }

    applySettingsToBody(currentState.settings);
    updateStaticLabels();
    document.documentElement.lang = currentState.language;
    titleNode.textContent = t(episode.titleKey);
    subtitleNode.textContent = t(episode.subtitleKey);
    heroTitle.textContent = t(episode.hero?.titleKey || episode.titleKey);
    heroSubtitle.textContent = t(episode.hero?.subtitleKey || episode.subtitleKey);
    if (episode.hero?.image?.src) {
      heroImage.src = episode.hero.image.src;
      heroImage.alt = t(episode.hero.image.altKey || "media.hero.alt");
      heroImage.style.display = "block";
    } else {
      heroImage.style.display = "none";
    }

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
            : ["badges.firstExplorer"];
          store.setProgress({
            completedSections: Array.from(completed),
            badges: updatedBadges,
            points: currentState.progress.points + 10,
          });
        },
        onInteractionComplete: (interactionId) => {
          const completed = new Set(currentState.progress.completedInteractions);
          completed.add(interactionId);
          store.setProgress({
            completedInteractions: Array.from(completed),
          });
        },
      });
      sectionsRoot.appendChild(sectionNode);
    });

    applyStoppedState(currentState.stopped);
  };

  renderAll(state);
  store.subscribe(renderAll);
  window.i18nDebug = { coverageReport, missingKeysReport };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-collapsed", !entry.isIntersecting);
    },
    { rootMargin: "-80px 0px 0px 0px" },
  );
  heroObserver.observe(hero);
};

init().catch((error) => {
  console.error(error);
  showToast(t("ui.loadFailed"));
});
