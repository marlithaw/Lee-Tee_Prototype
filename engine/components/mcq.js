import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderMCQ = ({ item, onAnswered }) => {
  const wrapper = createEl("div");
  const question = createEl("p", { text: t(item.questionKey) });
  const options = createEl("div");
  const feedback = createEl("div", { className: "check-feedback", attrs: { role: "status" } });

  item.options.forEach((option) => {
    const btn = createEl("button", {
      className: "ghost",
      text: t(option.labelKey),
      attrs: {
        type: "button",
        "aria-label": t(option.labelKey),
      },
    });
    btn.addEventListener("click", () => {
      const correct = option.correct;
      feedback.textContent = correct ? t("checks.correct") : t("checks.incorrect");
      feedback.classList.toggle("success", correct);
      feedback.classList.toggle("error", !correct);
      onAnswered(correct);
    });
    options.append(btn);
  });

  wrapper.append(question, options, feedback);
  return wrapper;
};
