import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";

export function renderMcq(section, onComplete) {
  const wrapper = createEl("div", { className: "question" });
  wrapper.append(createEl("p", { text: t(section.promptKey) }));
  const options = createEl("div", { className: "section__body" });
  const feedback = createEl("div");
  section.options.forEach((option) => {
    const button = createEl("button", {
      className: "button button--ghost",
      text: t(option.labelKey),
      attrs: { type: "button", "aria-label": t("ui.selectAnswer") },
    });
    onClick(button, () => {
      const isCorrect = option.id === section.correctOptionId;
      feedback.className = `feedback ${isCorrect ? "feedback--correct" : "feedback--incorrect"}`;
      feedback.textContent = isCorrect ? t("ui.correct") : t("ui.tryAgain");
      if (isCorrect) {
        onComplete();
      }
    });
    options.append(button);
  });
  wrapper.append(options, feedback);
  return wrapper;
}
