import { getEpisodeId } from "./router.js";
import { loadI18n, applyI18n, setLanguage, getLanguage, t, logMissingKeys } from "./i18n.js";
import { renderDashboard } from "./ui/dashboard.js";
import { renderQuickJump } from "./ui/nav.js";
import { renderSettings } from "./ui/settings.js";
import { renderSections } from "./components/sectionRenderer.js";
import { getState } from "./store.js";
import { showModal } from "./ui/modal.js";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "ht", label: "Kreyòl ayisyen" },
];

const applySettings = () => {
  const { settings } = getState();
  document.body.classList.toggle("dyslexia", settings.dyslexiaFont);
  document.body.classList.toggle("high-contrast", settings.highContrast);
};

const renderCharacterHelpers = (episode) => {
  const root = document.getElementById("sections");
  const helper = document.createElement("div");
  helper.className = "section";
  helper.id = "helpers";
  const header = document.createElement("div");
  header.className = "section-header";
  header.innerHTML = `<h2>${t("ui.characterHelp")}</h2>`;
  helper.appendChild(header);

  const buttons = document.createElement("div");
  buttons.className = "section-controls";

  const leeBtn = document.createElement("button");
  leeBtn.className = "button secondary";
  leeBtn.textContent = t("ui.askLee");
  leeBtn.setAttribute("aria-label", t("ui.askLee"));
  leeBtn.addEventListener("click", () => {
    const content = document.createElement("div");
    episode.characterTips.lee.forEach((tip) => {
      const p = document.createElement("p");
      p.textContent = t(tip);
      content.appendChild(p);
    });
    showModal({ title: t("ui.askLee"), content, ariaLabel: t("ui.askLee") });
  });

  const teeBtn = document.createElement("button");
  teeBtn.className = "button secondary";
  teeBtn.textContent = t("ui.askTee");
  teeBtn.setAttribute("aria-label", t("ui.askTee"));
  teeBtn.addEventListener("click", () => {
    const content = document.createElement("div");
    episode.characterTips.tee.forEach((tip) => {
      const p = document.createElement("p");
      p.textContent = t(tip);
      content.appendChild(p);
    });
    showModal({ title: t("ui.askTee"), content, ariaLabel: t("ui.askTee") });
  });

  buttons.appendChild(leeBtn);
  buttons.appendChild(teeBtn);
  helper.appendChild(buttons);
  root.prepend(helper);
};

const renderApp = async () => {
  const episodeId = getEpisodeId();
  const episode = await fetch(`episodes/${episodeId}/episode.json`).then((res) => res.json());
  const lang = getLanguage();
  await loadI18n(episodeId, lang);

  document.getElementById("episode-title").textContent = t(episode.titleKey);
  document.getElementById("episode-subtitle").textContent = t(episode.subtitleKey);

  const languageSelect = document.getElementById("language-select");
  languageSelect.innerHTML = "";
  languageOptions.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    languageSelect.appendChild(opt);
  });
  languageSelect.value = lang;
  languageSelect.addEventListener("change", async () => {
    const newLang = languageSelect.value;
    await loadI18n(episodeId, newLang);
    setLanguage(newLang);
    render();
  });

  const render = () => {
    applyI18n(document);
    applySettings();
    renderQuickJump(document.getElementById("quick-jump"), episode.nav);
    renderSettings(document.getElementById("settings"), () => {
      applySettings();
      render();
    });
    renderSections(document.getElementById("sections"), episode);
    renderCharacterHelpers(episode);
    renderDashboard(document.getElementById("dashboard"), episode, () => {
      render();
      const { completedSections } = getState().progress;
      const next = episode.sections.find((section) => !completedSections.includes(section.id));
      if (next) {
        document.getElementById(next.id)?.scrollIntoView({ behavior: "smooth" });
      }
    });
    logMissingKeys(getLanguage());
  };

  render();
};

renderApp();
