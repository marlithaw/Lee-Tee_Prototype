import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { renderListenButton } from "./media.js";

const renderEvidenceHighlight = ({ interaction, completed, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const options = el("div", { className: "story-interaction__options" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  interaction.options.forEach((option) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(option.textKey),
      attrs: { type: "button", disabled: completed ? "true" : null },
    });
    button.addEventListener("click", () => {
      if (completed) return;
      const isCorrect = option.id === interaction.correctId;
      feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correctKey : interaction.feedbackKeys.incorrectKey);
      feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
      if (isCorrect) onComplete();
    });
    options.appendChild(button);
  });

  wrapper.append(options, feedback);
  return wrapper;
};

const renderClozeContext = ({ interaction, completed, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const sentence = el("p", { className: "story-cloze" });
  const select = el("select", { attrs: { "aria-label": t("story.chooseAnswer") } });
  select.appendChild(el("option", { text: t("story.chooseBlank"), attrs: { value: "" } }));

  interaction.choices.forEach((choice) => {
    select.appendChild(el("option", { text: t(choice.textKey), attrs: { value: choice.id } }));
  });
  if (completed) select.disabled = true;

  const sentenceText = t(interaction.sentenceKey).split("{blank}");
  sentence.append(sentenceText[0], select, sentenceText[1] || "");

  const checkButton = el("button", { className: "button", text: t("check.submit"), attrs: { type: "button" } });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  checkButton.addEventListener("click", () => {
    if (completed) return;
    const isCorrect = select.value === interaction.correctId;
    feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correctKey : interaction.feedbackKeys.incorrectKey);
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect) onComplete();
  });

  wrapper.append(sentence, checkButton, feedback);
  return wrapper;
};

const renderSequenceEvents = ({ interaction, completed, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));

  const selection = [];
  const chips = el("div", { className: "story-order__list" });
  const options = el("div", { className: "story-interaction__options" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  const refreshChips = () => {
    chips.innerHTML = "";
    selection.forEach((itemId, index) => {
      const labelKey = interaction.items.find((item) => item.id === itemId)?.textKey;
      chips.appendChild(el("span", { className: "story-order__chip", text: `${index + 1}. ${t(labelKey)}` }));
    });
  };

  const resetSelection = () => {
    selection.length = 0;
    refreshChips();
  };

  interaction.items.forEach((item) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(item.textKey),
      attrs: { type: "button", disabled: completed ? "true" : null },
    });
    button.addEventListener("click", () => {
      if (completed) return;
      if (selection.includes(item.id)) return;
      selection.push(item.id);
      refreshChips();
    });
    options.appendChild(button);
  });

  const actions = el("div", { className: "story-order" });
  const resetButton = el("button", { className: "button button--ghost", text: t("story.resetOrder"), attrs: { type: "button" } });
  const checkButton = el("button", { className: "button", text: t("story.checkOrder"), attrs: { type: "button" } });

  resetButton.addEventListener("click", () => {
    if (completed) return;
    resetSelection();
  });

  checkButton.addEventListener("click", () => {
    if (completed) return;
    if (selection.length !== interaction.correctOrder.length) {
      feedback.textContent = t("story.orderIncomplete");
      feedback.className = "feedback feedback--error";
      return;
    }
    const isCorrect = interaction.correctOrder.every((id, index) => selection[index] === id);
    feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correctKey : interaction.feedbackKeys.incorrectKey);
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect) onComplete();
  });

  actions.append(chips, resetButton, checkButton, feedback);
  wrapper.append(options, actions);
  if (completed) refreshChips();
  return wrapper;
};

const renderInteraction = ({ interaction, completed, onComplete }) => {
  if (!interaction) return null;
  switch (interaction.type) {
    case "evidence_highlight":
      return renderEvidenceHighlight({ interaction, completed, onComplete });
    case "cloze_context":
      return renderClozeContext({ interaction, completed, onComplete });
    case "sequence_events":
      return renderSequenceEvents({ interaction, completed, onComplete });
    default:
      return null;
  }
};

export const renderStory = ({ story, interactions, state, language, onInteractionComplete }) => {
  const wrapper = el("div", { className: "story" });
  if (story.introKey) {
    wrapper.appendChild(el("p", { className: "story__intro", text: t(story.introKey) }));
  }

  const interactionMap = new Map(interactions.map((interaction) => [interaction.id, interaction]));
  const total = story.segments.length;

  story.segments.forEach((segment, index) => {
    const segmentNode = el("div", { className: "story-segment" });
    const meta = el("div", { className: "story-segment__meta" });
    meta.appendChild(el("span", { text: t("story.segmentLabel").replace("{index}", index + 1).replace("{total}", total) }));
    if (segment.purposeTag) {
      meta.appendChild(el("span", { text: t(`story.purpose.${segment.purposeTag}`) }));
    }
    segmentNode.appendChild(meta);
    segmentNode.appendChild(el("p", { text: t(segment.textKey) }));

    if (state.settings.readAloud) {
      segmentNode.appendChild(renderListenButton({ text: t(segment.textKey), language, labelKey: "story.listen" }));
    }
    segmentNode.appendChild(
      el("p", { className: "muted", text: t("story.readAloud").replace("{index}", index + 1).replace("{total}", total) }),
    );

    if (segment.supports?.hintsKey && state.settings.showHints) {
      const hints = el("details");
      hints.appendChild(el("summary", { text: t("story.hintLabel") }));
      hints.appendChild(el("p", { text: t(segment.supports.hintsKey) }));
      segmentNode.appendChild(hints);
    }

    if (segment.supports?.framesKey && state.settings.showHints) {
      const frames = el("details");
      frames.appendChild(el("summary", { text: t("story.frameLabel") }));
      const list = el("ul");
      t(segment.supports.framesKey)
        .split("|")
        .forEach((frame) => list.appendChild(el("li", { text: frame.trim() })));
      frames.appendChild(list);
      segmentNode.appendChild(frames);
    }

    const interaction = interactionMap.get(segment.interactionId);
    if (interaction) {
      const completed = state.progress.completedInteractions.includes(interaction.id);
      const interactionNode = renderInteraction({
        interaction,
        completed,
        onComplete: () => onInteractionComplete(interaction.id),
      });
      if (interactionNode) segmentNode.appendChild(interactionNode);
    }

    wrapper.appendChild(segmentNode);
  });

  return wrapper;
};
