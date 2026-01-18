import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { renderVocab } from "./vocab.js";
import { renderMcq } from "./mcq.js";
import { renderMultiSelect } from "./multiSelect.js";
import { renderDragMatch } from "./dragMatch.js";
import { renderWriting } from "./writing.js";
import { renderSectionMedia } from "./media.js";
import { openModal } from "../ui/modal.js";
import { renderStory } from "./story.js";
import { renderVideoSection } from "./video.js";

export const renderSection = ({ section, state, onComplete, onInteractionComplete, language }) => {
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
    wrapper.classList.toggle("simplified");
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
  const mediaGallery = renderSectionMedia({ items: section.media || [] });
  if (mediaGallery) {
    body.appendChild(mediaGallery);
  }

  if (section.type === "vocab") {
    body.appendChild(renderVocab({ vocabItems: section.items, language }));
  }
  if (section.type === "story") {
    if (section.story?.segments?.length) {
      body.appendChild(
        renderStory({
          story: section.story,
          interactions: section.interactions || [],
          state,
          language,
          onInteractionComplete,
        }),
      );
    } else {
      body.appendChild(el("p", { text: t("story.missing") }));
    }
  }
  if (section.type === "check") {
    body.appendChild(renderMcq({
      questionKey: section.questionKey,
      options: section.options,
      correctId: section.correctId,
      onComplete: completeSection,
    }));
  }
  if (section.type === "practice") {
    body.appendChild(renderDragMatch({
      promptKey: section.promptKey,
      items: section.items,
      targets: section.targets,
      onComplete: completeSection,
    }));
  }
  if (section.type === "reflect") {
    body.appendChild(renderMultiSelect({
      promptKey: section.promptKey,
      options: section.options,
      correctIds: section.correctIds,
      onComplete: completeSection,
    }));
  }
  if (section.type === "writing") {
    body.appendChild(renderWriting({
      promptKey: section.promptKey,
      framesKeys: section.framesKeys,
    }));
  }
  let completionLocked = section.type === "video";
  const completionButton = el("button", {
    className: "button button--accent",
    text: t("section.complete"),
    attrs: { type: "button", "aria-label": t("section.complete") },
  });
  if (state.progress.completedSections.includes(section.id)) {
    completionButton.textContent = t("section.completed");
    completionButton.disabled = true;
  }
  if (completionLocked && !state.progress.completedSections.includes(section.id)) {
    completionButton.disabled = true;
  }
  if (section.type === "video") {
    body.appendChild(
      renderVideoSection({
        section,
        onUnlock: () => {
          completionLocked = false;
          completionButton.disabled = false;
        },
      }),
    );
  }
  completionButton.addEventListener("click", () => completeSection());
  body.appendChild(completionButton);

  if (body.textContent.trim().length < 140 && !(section.media || []).length) {
    wrapper.classList.add("section--compact");
  }

  wrapper.append(header, body, simplified);
  return wrapper;
};
