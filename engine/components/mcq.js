import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderMcq = ({ questionKey, options, correctId, hintKey, showHints, onComplete }) => {
  const wrapper = el("div");
  wrapper.appendChild(el("p", { text: t(questionKey) }));
  if (hintKey) {
    wrapper.appendChild(el("p", { className: `hint muted${showHints ? "" : " hint--hidden"}`, text: t(hintKey) }));
  }
  const list = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status", "aria-live": "polite" } });

  options.forEach((option) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(option.labelKey),
      attrs: { type: "button", "aria-label": t(option.labelKey) },
    });
    button.addEventListener("click", () => {
      const isCorrect = option.id === correctId;
      feedback.textContent = isCorrect ? t("check.correct") : t("check.incorrect");
      feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
      if (isCorrect && onComplete) onComplete();
    });
    list.appendChild(button);
  });

  wrapper.append(list, feedback);
  return wrapper;
};
