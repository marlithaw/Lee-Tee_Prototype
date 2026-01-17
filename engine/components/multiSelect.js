import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";
import { hasAllSelections } from "../utils/validate.js";

export function renderMultiSelect(section, onComplete) {
  const wrapper = createEl("div", { className: "question" });
  wrapper.append(createEl("p", { text: t(section.promptKey) }));
  const list = createEl("div", { className: "section__body" });
  const selections = new Set();
  const feedback = createEl("div");

  section.options.forEach((option) => {
    const button = createEl("button", {
      className: "button button--ghost",
      text: t(option.labelKey),
      attrs: { type: "button", "aria-label": t("ui.selectAnswer") },
    });
    onClick(button, () => {
      if (selections.has(option.id)) {
        selections.delete(option.id);
        button.classList.remove("button--selected");
      } else {
        selections.add(option.id);
        button.classList.add("button--selected");
      }
    });
    list.append(button);
  });

  const checkButton = createEl("button", { className: "button", text: t("ui.checkAnswers") });
  onClick(checkButton, () => {
    const correct = section.correctOptionIds.every((id) => selections.has(id));
    const complete = correct && hasAllSelections(section.correctOptionIds.length, Array.from(selections));
    feedback.className = `feedback ${complete ? "feedback--correct" : "feedback--incorrect"}`;
    feedback.textContent = complete ? t("ui.correct") : t("ui.tryAgain");
    if (complete) onComplete();
  });

  wrapper.append(list, checkButton, feedback);
  return wrapper;
}
