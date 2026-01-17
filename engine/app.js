import { loadState, updateState, updateProgress, updateSettings, resetProgress } from "./store.js";
import { loadTranslations, applyI18n, t } from "./i18n.js";
import { getEpisodeId, scrollToSection, getSectionFromHash } from "./router.js";
import { renderDashboard } from "./ui/dashboard.js";
import { renderNav } from "./ui/nav.js";
import { renderSettingsPanel, renderSettingsToggle } from "./ui/settings.js";
import { renderSection } from "./components/sectionRenderer.js";
import { renderObjectives } from "./components/objectives.js";
import { openModal } from "./ui/modal.js";
import { createEl, clearChildren, onClick } from "./utils/dom.js";
import { showToast } from "./ui/toast.js";

const appRoot = document.getElementById("main");
const languageSelect = document.getElementById("language-select");
const settingsToggle = document.getElementById("settings-toggle");

let state = loadState();
let episodeData;
let currentLang = state.language;

init();

async function init() {
  const episodeId = getEpisodeId();
  episodeData = await fetch(`episodes/${episodeId}/episode.json`).then((res) => res.json());
  await loadTranslations(episodeId, currentLang);

  renderLanguageOptions();
  applySettingsClasses();
  renderApp();
  applyI18n();

  languageSelect.addEventListener("change", async (event) => {
    currentLang = event.target.value;
    state = updateState(state, { language: currentLang });
    await loadTranslations(episodeId, currentLang);
    renderApp();
    applyI18n();
  });
}

function renderLanguageOptions() {
  clearChildren(languageSelect);
  episodeData.languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.toUpperCase();
    option.selected = lang === currentLang;
    languageSelect.append(option);
  });
}

function renderApp() {
  clearChildren(appRoot);
  document.getElementById("episode-title").textContent = t(episodeData.titleKey);
  document.getElementById("episode-label").textContent = t(episodeData.labelKey);

  const dashboard = renderDashboard({
    episode: episodeData,
    progress: getProgressSummary(),
    onContinue: handleContinue,
    onReset: handleReset,
  });

  const nav = renderNav(episodeData.nav, (sectionId) => scrollToSection(sectionId));
  const objectives = renderObjectives(episodeData.objectives);

  const helperButtons = renderHelperButtons();

  const sectionsWrapper = createEl("div", { className: "section__body" });
  episodeData.sections.forEach((section) => {
    sectionsWrapper.append(
      renderSection(section, {
        lang: currentLang,
        onComplete: handleSectionComplete,
        onStop: handleStop,
        showHints: state.settings.showHints,
        readAloud: state.settings.readAloud,
      })
    );
  });

  const settingsPanel = renderSettingsPanel(state, handleSettingsToggle);
  settingsPanel.classList.add("hidden");
  renderSettingsToggle(settingsToggle, settingsPanel);

  appRoot.append(dashboard, nav, objectives, helperButtons, sectionsWrapper, settingsPanel);
  applyI18n(appRoot);

  const hashSection = getSectionFromHash();
  if (hashSection) {
    scrollToSection(hashSection);
  }
}

function renderHelperButtons() {
  const wrapper = createEl("section", { className: "card" });
  const title = createEl("h3", { text: t("ui.characterHelp") });
  const buttons = createEl("div", { className: "helper-buttons" });

  const leeButton = createEl("button", { className: "button button--ghost", text: t("ui.askLee"), attrs: { type: "button" } });
  onClick(leeButton, () => openModal({ title: t("ui.askLee"), content: t(episodeData.helpers.leeKey) }));
  const teeButton = createEl("button", { className: "button button--ghost", text: t("ui.askTee"), attrs: { type: "button" } });
  onClick(teeButton, () => openModal({ title: t("ui.askTee"), content: t(episodeData.helpers.teeKey) }));

  buttons.append(leeButton, teeButton);
  wrapper.append(title, buttons);
  return wrapper;
}

function handleSectionComplete(sectionId) {
  if (!state.progress.completedSections.includes(sectionId)) {
    const updated = [...state.progress.completedSections, sectionId];
    state = updateProgress(state, { completedSections: updated, points: state.progress.points + 10 });
    showToast(t("ui.sectionComplete"));
    renderApp();
  }
}

function handleContinue() {
  const nextId = state.progress.lastSectionId || episodeData.sections[0].id;
  scrollToSection(nextId);
}

function handleStop(sectionId) {
  state = updateProgress(state, { lastSectionId: sectionId });
  showToast(t("ui.progressSaved"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleReset() {
  state = resetProgress(state);
  showToast(t("ui.progressReset"));
  renderApp();
}

function handleSettingsToggle(key, value) {
  state = updateSettings(state, { [key]: value });
  applySettingsClasses();
  renderApp();
}

function applySettingsClasses() {
  document.body.classList.toggle("dyslexia-font", state.settings.dyslexiaFont);
  document.body.classList.toggle("high-contrast", state.settings.highContrast);
}

function getProgressSummary() {
  const totalSections = episodeData.sections.length;
  const completedSections = state.progress.completedSections.length;
  const episodePercent = Math.round((completedSections / totalSections) * 100);
  const bookPercent = Math.min(100, Math.round((state.progress.points / 200) * 100));
  return {
    totalSections,
    completedSections,
    episodePercent,
    bookPercent,
    badges: state.progress.badges,
  };
}
