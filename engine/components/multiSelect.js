import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderMultiSelect = ({ item, onAnswered }) => {
  const wrapper = createEl("div");
  const question = createEl("p", { text: t(item.questionKey) });
  const options = createEl("div");
  const feedback = createEl("div", { className: "check-feedback", attrs: { role: "status" } });

  const selections = new Set();

  item.options.forEach((option) => {
    const label = createEl("label", { className: "toggle" });
    const input = createEl("input", {
      attrs: {
        type: "checkbox",
        "aria-label": t(option.labelKey),
      },
    });
    input.addEventListener("change", () => {
      if (input.checked) selections.add(option.id);
      else selections.delete(option.id);
    });
    label.append(input, createEl("span", { text: t(option.labelKey) }));
    options.append(label);
  });

  const checkBtn = createEl("button", { className: "primary", text: t("checks.checkAnswer"), attrs: { type: "button" } });
  checkBtn.addEventListener("click", () => {
    const correct = item.correctIds.every((id) => selections.has(id)) && selections.size === item.correctIds.length;
    feedback.textContent = correct ? t("checks.correct") : t("checks.incorrect");
    feedback.classList.toggle("success", correct);
    feedback.classList.toggle("error", !correct);
    onAnswered(correct);
  });

  wrapper.append(question, options, checkBtn, feedback);
  return wrapper;
};
