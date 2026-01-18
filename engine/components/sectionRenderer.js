import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { renderVocab } from "./vocab.js";
import { renderMcq } from "./mcq.js";
import { renderMultiSelect } from "./multiSelect.js";
import { renderDragMatch } from "./dragMatch.js";
import { renderWriting } from "./writing.js";
import { renderListenButton, renderSectionMedia } from "./media.js";
import { renderStory } from "./story.js";
import { renderVideoSection } from "./video.js";
import { openModal } from "../ui/modal.js";

export const renderSection = ({ section, state, onComplete, language, onInteractionComplete }) => {
  const wrapper = el("article", { className: "section", attrs: { id: section.id } });
  const header = el("div", { className: "section__header" });
  const title = el("div");
  title.appendChild(el("h2", { text: t(section.titleKey) }));
  title.appendChild(el("p", { className: "muted", text: t(section.subtitleKey) }));

  const meta = el("div", { className: "section__meta" });
  if (section.helperTips && state.settings.showHints) {
    const askLee = el("button", {
      className: "button button--ghost",
      text: t("helpers.askLee"),
      attrs: { type: "button", "aria-label": t("helpers.askLee") },
    });
    askLee.addEventListener("click", () => {
      openModal({ title: t("helpers.askLee"), body: `<p>${t(section.helperTips.leeKey)}</p>` });
    });
    const askTee = el("button", {
      className: "button button--ghost",
      text: t("helpers.askTee"),
      attrs: { type: "button", "aria-label": t("helpers.askTee") },
    });
    askTee.addEventListener("click", () => {
      openModal({ title: t("helpers.askTee"), body: `<p>${t(section.helperTips.teeKey)}</p>` });
    });
    meta.append(askLee, askTee);
  }

  const actions = el("div", { className: "section__actions" });
  const simplifiedButton = el("button", {
    className: "button button--ghost",
    text: t("section.simplified"),
    attrs: { type: "button", "aria-label": t("section.simplified") },
  });
  simplifiedButton.addEventListener("click", () => {
    const isSimplified = wrapper.classList.toggle("simplified");
    simplifiedButton.setAttribute("aria-pressed", String(isSimplified));
    simplifiedButton.textContent = isSimplified ? t("section.full") : t("section.simplified");
  });
  actions.appendChild(simplifiedButton);

  header.append(title, meta, actions);

  const body = el("div", { className: "section__full" });
  const simplified = el("div", { className: "section__simplified" });
  if (section.simplifiedKey) {
    simplified.appendChild(el("p", { text: t(section.simplifiedKey) }));
  } else {
    simplified.appendChild(el("p", { text: t("section.noSimplified") }));
  }

  const completeSection = () => onComplete(section.id);
  let completionLocked = false;
  let completionButton;
  const mediaGallery = renderSectionMedia({ items: section.media || [] });
  if (mediaGallery) {
    body.appendChild(mediaGallery);
  }

  if (section.type === "vocab") {
    body.appendChild(renderVocab({ vocabItems: section.items, language }));
  }
  if (section.type === "story") {
    if (section.story) {
      body.appendChild(renderStory({
        story: section.story,
        language,
        settings: state.settings,
        onInteractionComplete,
        progress: state.progress,
      }));
    } else {
      const storyText = t(section.storyKey);
      body.appendChild(el("p", { text: storyText }));
      if (state.settings.readAloud) {
        const listenButton = renderListenButton({
          text: storyText,
          language,
          labelKey: "story.listen",
        });
        body.appendChild(listenButton);
      }
      body.appendChild(el("p", { className: "muted", text: t("story.readAloud").replace("{index}", section.index).replace("{total}", section.total) }));
    }
  }
  if (section.type === "video") {
    completionLocked = true;
    body.appendChild(renderVideoSection({
      section,
      onUnlocked: () => {
        completionLocked = false;
        if (completionButton) completionButton.disabled = false;
      },
    }));
  }
  if (section.type === "check") {
    body.appendChild(renderMcq({
      questionKey: section.questionKey,
      options: section.options,
      correctId: section.correctId,
      hintKey: section.hintKey,
      showHints: state.settings.showHints,
      onComplete: completeSection,
    }));
  }
  if (section.type === "practice") {
    body.appendChild(renderDragMatch({
      promptKey: section.promptKey,
      items: section.items,
      targets: section.targets,
      hintKey: section.hintKey,
      showHints: state.settings.showHints,
      onComplete: completeSection,
    }));
  }
  if (section.type === "reflect") {
    body.appendChild(renderMultiSelect({
      promptKey: section.promptKey,
      options: section.options,
      correctIds: section.correctIds,
      hintKey: section.hintKey,
      showHints: state.settings.showHints,
      onComplete: completeSection,
    }));
  }
  if (section.type === "writing") {
    body.appendChild(renderWriting({
      promptKey: section.promptKey,
      framesKeys: section.framesKeys,
      hintKey: section.hintKey,
      showHints: state.settings.showHints,
    }));
  }

  completionButton = el("button", {
    className: "button button--accent",
    text: t("section.complete"),
    attrs: { type: "button", "aria-label": t("section.complete") },
  });
  if (completionLocked) {
    completionButton.disabled = true;
  }
  if (state.progress.completedSections.includes(section.id)) {
    completionButton.textContent = t("section.completed");
    completionButton.disabled = true;
  }
  completionButton.addEventListener("click", () => completeSection());
  body.appendChild(completionButton);

  if (body.children.length <= 2) {
    wrapper.classList.add("section--compact");
  }

  wrapper.append(header, body, simplified);
  observeMedia(wrapper);
  return wrapper;
};
