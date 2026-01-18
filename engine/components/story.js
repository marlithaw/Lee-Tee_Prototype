import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { renderListenButton } from "./media.js";

const buildInteractionMap = (interactions = []) =>
  interactions.reduce((acc, interaction) => {
    acc[interaction.id] = interaction;
    return acc;
  }, {});

const updateFeedback = (node, isCorrect) => {
  node.textContent = isCorrect ? t("story.correct") : t("story.incorrect");
  node.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
};

const renderEvidenceHighlight = ({ interaction, onComplete, isCompleted }) => {
  const wrapper = el("div", { className: "interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const list = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  interaction.choices.forEach((choice) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(choice.textKey),
      attrs: { type: "button", disabled: isCompleted ? "disabled" : null, "aria-label": t(choice.textKey) },
    });
    button.addEventListener("click", () => {
      if (isCompleted) return;
      const isCorrect = choice.correct;
      updateFeedback(feedback, isCorrect);
      if (isCorrect) {
        onComplete();
        button.classList.add("button--accent");
      }
    });
    list.appendChild(button);
  });

  wrapper.append(list, feedback);
  if (isCompleted) {
    updateFeedback(feedback, true);
  }
  return wrapper;
};

const renderSequenceEvents = ({ interaction, onComplete, isCompleted }) => {
  const wrapper = el("div", { className: "interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const list = el("div", { className: "list" });
  const orderList = el("ol", { className: "sequence-list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });
  const selected = [];

  const resetSelection = () => {
    selected.splice(0, selected.length);
    orderList.innerHTML = "";
    feedback.textContent = "";
    feedback.className = "feedback";
    list.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  };

  const maybeCheck = () => {
    if (selected.length !== interaction.steps.length) return;
    const isCorrect = selected.every((id, index) => id === interaction.correctOrder[index]);
    updateFeedback(feedback, isCorrect);
    if (isCorrect) {
      onComplete();
    }
  };

  interaction.steps.forEach((step) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(step.textKey),
      attrs: { type: "button", disabled: isCompleted ? "disabled" : null, "aria-label": t(step.textKey) },
    });
    button.addEventListener("click", () => {
      if (isCompleted || button.disabled) return;
      selected.push(step.id);
      const item = el("li", { text: t(step.textKey) });
      orderList.appendChild(item);
      button.disabled = true;
      maybeCheck();
    });
    list.appendChild(button);
  });

  if (!isCompleted) {
    const resetButton = el("button", { className: "button button--ghost", text: t("story.resetSequence"), attrs: { type: "button" } });
    resetButton.addEventListener("click", resetSelection);
    wrapper.append(resetButton);
  }

  wrapper.append(list, orderList, feedback);
  if (isCompleted) {
    updateFeedback(feedback, true);
  }
  return wrapper;
};

const renderClozeContext = ({ interaction, onComplete, isCompleted }) => {
  const wrapper = el("div", { className: "interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const sentence = el("p", { className: "cloze-sentence" });
  sentence.appendChild(el("span", { text: t(interaction.sentenceKey) }));
  wrapper.appendChild(sentence);

  const list = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  interaction.options.forEach((option, index) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(option.textKey),
      attrs: { type: "button", disabled: isCompleted ? "disabled" : null, "aria-label": t(option.textKey) },
    });
    button.addEventListener("click", () => {
      if (isCompleted) return;
      const isCorrect = index === interaction.correctIndex;
      updateFeedback(feedback, isCorrect);
      if (isCorrect) onComplete();
    });
    list.appendChild(button);
  });

  wrapper.append(list, feedback);
  if (isCompleted) {
    updateFeedback(feedback, true);
  }
  return wrapper;
};

const renderInteraction = ({ interaction, onComplete, progress }) => {
  if (!interaction) return null;
  const isCompleted = progress.completedInteractions?.includes(interaction.id);
  if (interaction.type === "evidence_highlight") {
    return renderEvidenceHighlight({ interaction, onComplete, isCompleted });
  }
  if (interaction.type === "sequence_events") {
    return renderSequenceEvents({ interaction, onComplete, isCompleted });
  }
  if (interaction.type === "cloze_context") {
    return renderClozeContext({ interaction, onComplete, isCompleted });
  }
  return null;
};

export const renderStory = ({ story, language, settings, onInteractionComplete, progress }) => {
  const wrapper = el("div", { className: "story" });
  wrapper.appendChild(el("h3", { text: t(story.titleKey) }));
  wrapper.appendChild(el("p", { className: "muted", text: t(story.introKey) }));
  const interactionsById = buildInteractionMap(story.interactions || []);

  story.segments.forEach((segment, index) => {
    const card = el("div", { className: "story__segment" });
    const header = el("div", { className: "story__segment-header" });
    header.appendChild(el("span", { className: "story__segment-number", text: t("story.segmentLabel").replace("{index}", index + 1) }));
    if (segment.purposeTag) {
      header.appendChild(el("span", { className: "story__tag", text: t(segment.purposeTag) }));
    }
    card.appendChild(header);
    const text = t(segment.textKey);
    card.appendChild(el("p", { text }));

    if (settings.readAloud) {
      card.appendChild(renderListenButton({ text, language, labelKey: "story.listen" }));
    }

    if (settings.showHints && segment.supports?.hintsKey) {
      card.appendChild(el("p", { className: "muted", text: t(segment.supports.hintsKey) }));
    }

    if (segment.supports?.framesKey) {
      const frame = el("p", { className: "muted", text: t(segment.supports.framesKey) });
      card.appendChild(frame);
    }

    const interaction = interactionsById[segment.interactionId];
    if (interaction) {
      const interactionNode = renderInteraction({
        interaction,
        progress,
        onComplete: () => onInteractionComplete?.(interaction.id),
      });
      if (interactionNode) card.appendChild(interactionNode);
    }

    wrapper.appendChild(card);
  });

  return wrapper;
};
