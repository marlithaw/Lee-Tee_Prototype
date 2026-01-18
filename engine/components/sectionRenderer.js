import { clearEl, createEl } from "../utils/dom.js";
import { t, resolveContent, getLanguage } from "../i18n.js";
import { renderVocabSection } from "./vocab.js";
import { renderMcqSection } from "./mcq.js";
import { renderMultiSelectSection } from "./multiSelect.js";
import { renderDragMatchSection } from "./dragMatch.js";
import { renderWritingSection } from "./writing.js";
import { renderObjectives } from "./objectives.js";
import { speakText } from "../utils/speech.js";
import { getState, markSectionComplete } from "../store.js";

const createSectionShell = (section, { hasSimplified } = {}) => {
  const wrapper = createEl("section", { className: "section", attrs: { id: section.id } });
  const header = createEl("div", { className: "section-header" });
  const title = createEl("h2", { text: t(section.titleKey) });
  header.appendChild(title);

  const controls = createEl("div", { className: "section-controls" });
  const state = getState();
  const completeBtn = createEl("button", {
    className: "button secondary",
    text: state.progress.completedSections.includes(section.id)
      ? t("ui.completed")
      : t("ui.markComplete"),
  });
  completeBtn.disabled = state.progress.completedSections.includes(section.id) || state.progress.paused;
  completeBtn.addEventListener("click", () => {
    markSectionComplete(section.id);
    completeBtn.textContent = t("ui.completed");
    completeBtn.disabled = true;
  });
  controls.appendChild(completeBtn);

  if (hasSimplified) {
    const simplifiedBtn = createEl("button", { className: "button ghost", text: t("ui.simplifiedView") });
    simplifiedBtn.addEventListener("click", () => {
      wrapper.querySelectorAll(".simplified").forEach((simplified) => {
        simplified.hidden = !simplified.hidden;
      });
    });
    controls.appendChild(simplifiedBtn);
  }

  header.appendChild(controls);
  wrapper.appendChild(header);
  return wrapper;
};

export const renderSection = (container, section, episode) => {
  const hasSimplified = section.type === "story" && section.sections.some((story) => story.simplified);
  const wrapper = createSectionShell(section, { hasSimplified });
  const lang = getLanguage();

  switch (section.type) {
    case "objectives":
      wrapper.appendChild(renderObjectives(section));
      break;
    case "vocab":
      renderVocabSection(wrapper, section);
      break;
    case "story": {
      const storyWrap = createEl("div");
      section.sections.forEach((story, index) => {
        const storySection = createEl("div", { className: "story-section" });
        storySection.appendChild(createEl("h3", { text: t(story.titleKey) }));
        storySection.appendChild(createEl("p", { text: resolveContent(story.content, lang) }));

        if (story.simplified) {
          const simplified = createEl("p", {
            className: "simplified notice",
            text: resolveContent(story.simplified, lang),
          });
          simplified.hidden = true;
          storySection.appendChild(simplified);
        }

        const actions = createEl("div", { className: "story-actions" });
        const listenBtn = createEl("button", {
          className: "button secondary",
          text: t("ui.listen"),
        });
        listenBtn.addEventListener("click", () => {
          speakText(resolveContent(story.content, lang));
        });
        const readAloud = createEl("span", {
          text: `${t("ui.readAloudSection")} ${index + 1} ${t("ui.of")} ${section.sections.length}`,
        });
        actions.appendChild(listenBtn);
        actions.appendChild(readAloud);
        storySection.appendChild(actions);
        storyWrap.appendChild(storySection);
      });
      wrapper.appendChild(storyWrap);
      break;
    }
    case "practice":
      section.activities.forEach((activity) => {
        if (activity.type === "dragMatch") {
          renderDragMatchSection(wrapper, activity);
        }
        if (activity.type === "multiSelect") {
          renderMultiSelectSection(wrapper, activity);
        }
      });
      break;
    case "check":
      renderMcqSection(wrapper, section);
      break;
    case "writing":
      renderWritingSection(wrapper, section);
      break;
    case "reflect":
      wrapper.appendChild(createEl("p", { text: resolveContent(section.prompt, lang) }));
      break;
    default:
      wrapper.appendChild(createEl("p", { text: t("ui.missingSection") }));
  }

  container.appendChild(wrapper);
};

export const renderSections = (container, episode) => {
  clearEl(container);
  episode.sections.forEach((section) => renderSection(container, section, episode));
};
