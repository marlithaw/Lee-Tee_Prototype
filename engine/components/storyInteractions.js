import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

const feedbackNode = () => el("div", { className: "feedback", attrs: { role: "status" } });

const markComplete = ({ progress, interactionId, onComplete }) => {
  if (progress.completedInteractions.includes(interactionId)) return false;
  onComplete(interactionId);
  return true;
};

const renderEvidenceHighlight = ({ interaction, progress, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const options = el("div", { className: "list" });
  const feedback = feedbackNode();
  const isCompleted = progress.completedInteractions.includes(interaction.id);

  interaction.optionsKeys.forEach((optionKey, index) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(optionKey),
      attrs: { type: "button", "aria-label": t(optionKey) },
    });
    button.addEventListener("click", () => {
      if (isCompleted) return;
      const isCorrect = index === interaction.correctIndex;
      feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correct : interaction.feedbackKeys.incorrect);
      feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
      if (isCorrect) markComplete({ progress, interactionId: interaction.id, onComplete });
    });
    if (isCompleted) button.disabled = true;
    options.appendChild(button);
  });

  if (isCompleted) {
    feedback.textContent = t(interaction.feedbackKeys.correct);
    feedback.className = "feedback feedback--success";
  }
  wrapper.append(options, feedback);
  return wrapper;
};

const renderSequenceEvents = ({ interaction, progress, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const isCompleted = progress.completedInteractions.includes(interaction.id);

  const list = el("ol", { className: "sequence-list" });
  const items = interaction.items.map((item) => ({ ...item }));

  const renderList = () => {
    list.innerHTML = "";
    items.forEach((item, idx) => {
      const row = el("li", { className: "sequence-item" });
      row.appendChild(el("span", { text: t(item.textKey) }));
      const controls = el("div", { className: "sequence-controls" });
      const up = el("button", { className: "button button--ghost", text: "↑", attrs: { type: "button", "aria-label": t("story.moveUp") } });
      const down = el("button", { className: "button button--ghost", text: "↓", attrs: { type: "button", "aria-label": t("story.moveDown") } });
      up.disabled = idx === 0;
      down.disabled = idx === items.length - 1;
      up.addEventListener("click", () => {
        if (isCompleted) return;
        if (idx === 0) return;
        [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
        renderList();
      });
      down.addEventListener("click", () => {
        if (isCompleted) return;
        if (idx === items.length - 1) return;
        [items[idx + 1], items[idx]] = [items[idx], items[idx + 1]];
        renderList();
      });
      controls.append(up, down);
      row.appendChild(controls);
      list.appendChild(row);
    });
  };

  renderList();
  const feedback = feedbackNode();
  const checkButton = el("button", { className: "button", text: t("story.checkOrder"), attrs: { type: "button" } });
  checkButton.addEventListener("click", () => {
    if (isCompleted) return;
    const currentOrder = items.map((item) => item.id);
    const isCorrect = interaction.correctOrder.every((id, idx) => currentOrder[idx] === id);
    feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correct : interaction.feedbackKeys.incorrect);
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect) markComplete({ progress, interactionId: interaction.id, onComplete });
  });
  if (isCompleted) {
    feedback.textContent = t(interaction.feedbackKeys.correct);
    feedback.className = "feedback feedback--success";
    checkButton.disabled = true;
  }

  wrapper.append(list, checkButton, feedback);
  return wrapper;
};

const renderClozeContext = ({ interaction, progress, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  const sentence = el("p", { className: "muted", text: t(interaction.sentenceKey) });
  const select = el("select", { attrs: { "aria-label": t("story.chooseWord") } });
  const isCompleted = progress.completedInteractions.includes(interaction.id);
  select.appendChild(el("option", { text: t("story.selectPlaceholder"), attrs: { value: "" } }));
  interaction.choicesKeys.forEach((choiceKey, index) => {
    select.appendChild(el("option", { text: t(choiceKey), attrs: { value: String(index) } }));
  });
  const feedback = feedbackNode();
  const checkButton = el("button", { className: "button", text: t("story.checkAnswer"), attrs: { type: "button" } });
  checkButton.addEventListener("click", () => {
    if (isCompleted) return;
    const isCorrect = Number(select.value) === interaction.correctIndex;
    feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correct : interaction.feedbackKeys.incorrect);
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect) markComplete({ progress, interactionId: interaction.id, onComplete });
  });
  if (isCompleted) {
    feedback.textContent = t(interaction.feedbackKeys.correct);
    feedback.className = "feedback feedback--success";
    select.disabled = true;
    checkButton.disabled = true;
  }

  wrapper.append(sentence, select, checkButton, feedback);
  return wrapper;
};

const renderShortResponse = ({ interaction, progress, onComplete }) => {
  const wrapper = el("div", { className: "story-interaction" });
  wrapper.appendChild(el("p", { text: t(interaction.promptKey) }));
  if (interaction.frameKey) {
    wrapper.appendChild(el("p", { className: "muted", text: t(interaction.frameKey) }));
  }
  const textarea = el("textarea", { attrs: { rows: "3", "aria-label": t("story.shortResponse") } });
  const feedback = feedbackNode();
  const checkButton = el("button", { className: "button", text: t("story.submitResponse"), attrs: { type: "button" } });
  const isCompleted = progress.completedInteractions.includes(interaction.id);
  checkButton.addEventListener("click", () => {
    if (isCompleted) return;
    const response = textarea.value.trim().toLowerCase();
    const meetsLength = response.length >= (interaction.minLength || 12);
    const keywords = interaction.expectedKeywords || [];
    const hasKeywords = keywords.every((keyword) => response.includes(keyword.toLowerCase()));
    const isCorrect = meetsLength && (keywords.length ? hasKeywords : true);
    feedback.textContent = t(isCorrect ? interaction.feedbackKeys.correct : interaction.feedbackKeys.incorrect);
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect) markComplete({ progress, interactionId: interaction.id, onComplete });
  });
  if (isCompleted) {
    feedback.textContent = t(interaction.feedbackKeys.correct);
    feedback.className = "feedback feedback--success";
    textarea.disabled = true;
    checkButton.disabled = true;
  }

  wrapper.append(textarea, checkButton, feedback);
  return wrapper;
};

const INTERACTION_RENDERERS = {
  evidence_highlight: renderEvidenceHighlight,
  sequence_events: renderSequenceEvents,
  cloze_context: renderClozeContext,
  short_response: renderShortResponse,
};

export const renderStoryInteraction = ({ interaction, progress, onComplete }) => {
  const renderer = INTERACTION_RENDERERS[interaction.type];
  if (!renderer) {
    const fallback = el("div", { className: "feedback feedback--error" });
    fallback.textContent = t("story.unsupportedInteraction");
    return fallback;
  }
  return renderer({ interaction, progress, onComplete });
};
