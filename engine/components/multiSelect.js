import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderMultiSelect = ({ promptKey, options, correctIds, hintKey, showHints, onComplete }) => {
  const wrapper = el("div");
  wrapper.appendChild(el("p", { text: t(promptKey) }));
  if (hintKey) {
    wrapper.appendChild(el("p", { className: `hint muted${showHints ? "" : " hint--hidden"}`, text: t(hintKey) }));
  }
  const list = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status", "aria-live": "polite" } });
  const selected = new Set();

  options.forEach((option) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(option.labelKey),
      attrs: { "aria-pressed": "false" },
    });
    button.addEventListener("click", () => {
      if (selected.has(option.id)) {
        selected.delete(option.id);
        button.classList.remove("button--accent");
        button.setAttribute("aria-pressed", "false");
      } else {
        selected.add(option.id);
        button.classList.add("button--accent");
        button.setAttribute("aria-pressed", "true");
      }
    });
    list.appendChild(button);
  });

  const checkButton = el("button", { className: "button", text: t("check.submit") });
  checkButton.addEventListener("click", () => {
    const isCorrect = correctIds.every((id) => selected.has(id)) && selected.size === correctIds.length;
    feedback.textContent = isCorrect ? t("check.correct") : t("check.incorrect");
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect && onComplete) onComplete();
  });

  wrapper.append(list, checkButton, feedback);
  return wrapper;
};
