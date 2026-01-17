import { getEpisodeId } from "./router.js";
import { createStore } from "./store.js";
import { createI18n } from "./i18n.js";
import { renderDashboard } from "./ui/dashboard.js";
import { renderNav } from "./ui/nav.js";
import { createModalHost } from "./ui/modal.js";
import { createToast } from "./ui/toast.js";
import { renderSettings } from "./ui/settings.js";
import { renderSections } from "./components/sectionRenderer.js";
import { qs } from "./utils/dom.js";

const appRoot = document.getElementById("app");

const state = {
  episode: null,
  i18n: null,
  store: null,
  toast: null,
  modalHost: null,
};

const applySettings = (settings) => {
  document.body.classList.toggle("dyslexia-mode", settings.dyslexiaFont);
  document.body.classList.toggle("high-contrast", settings.highContrast);
};

const renderApp = () => {
  const { episode, i18n, store, toast, modalHost } = state;
  if (!episode || !i18n || !store) return;

  applySettings(store.getState().settings);

  appRoot.innerHTML = "";
  const wrapper = document.createElement("div");
  const header = document.createElement("header");
  header.className = "hero";
  header.innerHTML = `
    <h1>${i18n.t(episode.titleKey)}</h1>
    <p>${i18n.t(episode.subtitleKey)}</p>
  `;

  const main = document.createElement("main");
  main.id = "main";

  const sidebar = document.createElement("aside");
  sidebar.className = "stack";
  sidebar.append(
    renderDashboard(episode, i18n, store, toast),
    renderSettings(i18n, store, () => renderApp())
  );

  const navPanel = renderNav(episode, i18n);
  sidebar.append(navPanel);

  const content = document.createElement("div");
  content.append(renderSections(episode, i18n, store, toast, modalHost));

  main.append(sidebar, content);
  wrapper.append(header, main);

  appRoot.append(wrapper, modalHost.element, toast.element);

  document.dispatchEvent(new CustomEvent("app-rendered"));
};

const init = async () => {
  const episodeId = getEpisodeId();
  const episodeResponse = await fetch(`./episodes/${episodeId}/episode.json`);
  const episode = await episodeResponse.json();
  const store = createStore(episodeId);
  const i18n = await createI18n({
    episodeId,
    defaultLanguage: "en",
    initialLanguage: store.getState().language,
  });

  state.episode = episode;
  state.store = store;
  state.i18n = i18n;
  state.toast = createToast();
  state.modalHost = createModalHost();

  renderApp();

  store.subscribe(() => {
    applySettings(store.getState().settings);
    renderDashboard(episode, i18n, store, state.toast, true);
  });

  document.addEventListener("language-change", () => {
    renderApp();
  });

  document.addEventListener("nav-jump", (event) => {
    const id = event.detail?.id;
    if (!id) return;
    const target = qs(`[data-section-id="${id}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};

init();
