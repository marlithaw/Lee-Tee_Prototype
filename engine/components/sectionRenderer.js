import { createElement } from "../utils/dom.js";
import { renderVocab } from "./vocab.js";
import { renderMcq } from "./mcq.js";
import { renderMultiSelect } from "./multiSelect.js";
import { renderDragMatch } from "./dragMatch.js";
import { renderWriting } from "./writing.js";
import { renderListenControls } from "./media.js";
import { renderObjectives } from "./objectives.js";

const renderStory = (section, i18n, store, storyMeta) => {
  const wrapper = createElement("div");
  const text = i18n.t(section.textKey);
  const simplified = section.simplifiedKey ? i18n.t(section.simplifiedKey) : null;
  const readLabel = storyMeta
    ? createElement("p", {
        text: i18n.t("story.readAloudLabel", storyMeta),
      })
    : null;
  const controls = renderListenControls(
    text,
    i18n,
    store.getState().language,
    store.getState().settings.readAloud
  );

  const textEl = createElement("p", { className: "story-text", text });
  const simplifiedEl = simplified
    ? createElement("p", { className: "story-text", text: simplified })
    : null;

  if (simplifiedEl) simplifiedEl.style.display = "none";

  if (readLabel) wrapper.append(readLabel);
  wrapper.append(controls, textEl);
  if (simplifiedEl) wrapper.append(simplifiedEl);
  return { wrapper, textEl, simplifiedEl };
};

const createSection = (section, i18n, store, toast, modal, storyMeta) => {
  const container = createElement("section", {
    className: "section",
    attrs: { "data-section-id": section.id },
  });
  const completed = store.getState().progress.completedSections.includes(section.id);
  const header = createElement("header");
  const meta = createElement("div", { className: "section-meta" });
  const status = createElement("span", {
    className: "status",
    text: completed ? i18n.t("section.complete") : i18n.t("section.incomplete"),
  });
  meta.append(status);

  const simplifiedToggle = section.simplifiedKey
    ? createElement("button", {
        className: "btn ghost simplified-toggle",
        text: i18n.t("section.simplified"),
        attrs: { type: "button", "aria-pressed": "false" },
      })
    : null;

  if (simplifiedToggle) {
    meta.append(simplifiedToggle);
  }

  header.innerHTML = `
    <h2>${i18n.t(section.titleKey)}</h2>
    <p>${section.descriptionKey ? i18n.t(section.descriptionKey) : ""}</p>
  `;
  header.append(meta);

  const markComplete = () => {
    store.markSectionComplete(section.id, section.points || 5);
    status.textContent = i18n.t("section.complete");
    status.classList.add("completed");
    toast.show(i18n.t("section.completedToast"));
  };

  let content;
  let simplifiedEl = null;
  let mainTextEl = null;

  switch (section.type) {
    case "vocab":
      content = renderVocab(section, i18n, modal, store.getState().language);
      break;
    case "story": {
      const story = renderStory(section, i18n, store, storyMeta);
      content = story.wrapper;
      simplifiedEl = story.simplifiedEl;
      mainTextEl = story.textEl;
      break;
    }
    case "mcq":
      content = renderMcq(section, i18n, markComplete);
      break;
    case "multiSelect":
      content = renderMultiSelect(section, i18n, markComplete);
      break;
    case "dragMatch":
      content = renderDragMatch(section, i18n, markComplete);
      break;
    case "writing":
      content = renderWriting(section, i18n, store, markComplete);
      break;
    case "objectives":
      content = renderObjectives(section, i18n);
      break;
    default:
      content = createElement("p", { text: i18n.t("section.unsupported") });
  }

  if (simplifiedToggle && simplifiedEl && mainTextEl) {
    simplifiedToggle.addEventListener("click", () => {
      const isPressed = simplifiedToggle.getAttribute("aria-pressed") === "true";
      simplifiedToggle.setAttribute("aria-pressed", String(!isPressed));
      if (isPressed) {
        mainTextEl.style.display = "";
        simplifiedEl.style.display = "none";
      } else {
        mainTextEl.style.display = "none";
        simplifiedEl.style.display = "";
      }
    });
  }

  container.append(header, content);

  document.addEventListener("progress-reset", () => {
    status.textContent = i18n.t("section.incomplete");
    status.classList.remove("completed");
  });
  return container;
};

export const renderSections = (episode, i18n, store, toast, modal) => {
  const wrapper = createElement("div");
  const storySections = episode.sections.filter((section) => section.type === "story");

  const helpers = createElement("div", { className: "panel" });
  helpers.innerHTML = `
    <h2>${i18n.t("helpers.title")}</h2>
    <div class="helper-buttons"></div>
  `;

  const helperButtons = helpers.querySelector(".helper-buttons");
  episode.helpers.forEach((helper) => {
    const button = createElement("button", {
      className: "btn secondary",
      text: i18n.t(helper.labelKey),
      attrs: { type: "button", "aria-label": i18n.t(helper.labelKey) },
    });
    button.addEventListener("click", () => {
      const tips = createElement("ul");
      helper.tipsKeys.forEach((key) => {
        tips.append(createElement("li", { text: i18n.t(key) }));
      });
      modal.show({
        title: i18n.t(helper.labelKey),
        content: tips,
        actions: [{ label: i18n.t("common.close"), variant: "ghost" }],
      });
    });
    helperButtons.append(button);
  });

  wrapper.append(helpers);

  episode.sections.forEach((section) => {
    const storyIndex = storySections.findIndex((item) => item.id === section.id);
    const storyMeta = storyIndex >= 0
      ? { current: storyIndex + 1, total: storySections.length }
      : null;
    wrapper.append(createSection(section, i18n, store, toast, modal, storyMeta));
  });

  return wrapper;
};
