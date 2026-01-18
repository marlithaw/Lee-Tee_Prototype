import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderMultiSelect = ({ promptKey, options, correctIds, onComplete }) => {
  const wrapper = el("div");
  wrapper.appendChild(el("p", { text: t(promptKey) }));
  const list = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });
  const selected = new Set();

  options.forEach((option) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(option.labelKey),
      attrs: { type: "button", "aria-label": t(option.labelKey) },
    });
    button.addEventListener("click", () => {
      if (selected.has(option.id)) {
        selected.delete(option.id);
        button.classList.remove("button--accent");
      } else {
        selected.add(option.id);
        button.classList.add("button--accent");
      }
    });
    list.appendChild(button);
  });

  const checkButton = el("button", { className: "button", text: t("check.submit"), attrs: { type: "button" } });
  checkButton.addEventListener("click", () => {
    const isCorrect = correctIds.every((id) => selected.has(id)) && selected.size === correctIds.length;
    feedback.textContent = isCorrect ? t("check.correct") : t("check.incorrect");
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect && onComplete) onComplete();
  });

  wrapper.append(list, checkButton, feedback);
  return wrapper;
};
