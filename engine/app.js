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

const initHeroObserver = () => {
  const hero = qs("#hero");
  if (!hero) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("hero-collapsed", !entry.isIntersecting);
      });
    },
    { threshold: 0.05 },
  );
  observer.observe(hero);
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

const renderI18nBlockingError = (missingKeys) => {
  document.body.innerHTML = `
    <main class="i18n-error">
      <h1>Missing critical translations</h1>
      <p>Strict i18n mode is enabled. Add the following keys before continuing:</p>
      <ul>
        ${missingKeys.map((key) => `<li>${key}</li>`).join("")}
      </ul>
    </main>
  `;
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
  const strictMode = new URLSearchParams(window.location.search).get("i18n") === "strict";
  if (strictMode) {
    const missingCritical = getCriticalMissingKeys(state.language);
    if (missingCritical.length) {
      renderI18nBlockingError(missingCritical);
      return;
    }
  }
  const titleNode = qs("#episode-title");
  const subtitleNode = qs("#episode-subtitle");
  const heroTitle = qs("#hero-title");
  const heroSubtitle = qs("#hero-subtitle");
  const heroImage = qs("#hero-image");

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
    heroTitle.textContent = t(episode.titleKey);
    heroSubtitle.textContent = t(episode.subtitleKey);
    if (episode.hero && heroImage) {
      heroImage.src = episode.hero.src;
      heroImage.alt = t(episode.hero.altKey);
      qs("#hero")?.classList.remove("is-hidden");
    } else {
      qs("#hero")?.classList.add("is-hidden");
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
        onInteractionComplete: (interactionId) => {
          const completed = new Set(currentState.progress.completedInteractions || []);
          completed.add(interactionId);
          store.setProgress({ completedInteractions: Array.from(completed) });
        },
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
      });
      sectionsRoot.appendChild(sectionNode);
    });

    applyStoppedState(currentState.stopped);
  };

  renderAll(state);
  store.subscribe(renderAll);
  window.i18nDebug = { coverageReport, missingKeysReport };
  initHeroObserver();
};

init().catch((error) => {
  console.error(error);
  showToast(t("ui.loadFailed"));
});
