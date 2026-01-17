import { createElement } from "../utils/dom.js";

export const renderMultiSelect = (section, i18n, onComplete) => {
  const container = createElement("div");
  const question = createElement("p", { text: i18n.t(section.questionKey) });
  const optionsWrapper = createElement("div", { className: "check-options" });
  const feedback = createElement("div", { className: "feedback", attrs: { role: "status" } });
  feedback.style.display = "none";

  const selected = new Set();

  section.options.forEach((optionKey, index) => {
    const option = createElement("button", {
      className: "option",
      text: i18n.t(optionKey),
      attrs: { type: "button", "aria-pressed": "false" },
    });
    option.addEventListener("click", () => {
      if (selected.has(index)) {
        selected.delete(index);
        option.classList.remove("selected");
        option.setAttribute("aria-pressed", "false");
      } else {
        selected.add(index);
        option.classList.add("selected");
        option.setAttribute("aria-pressed", "true");
      }
    });
    optionsWrapper.append(option);
  });

  const checkButton = createElement("button", {
    className: "btn",
    text: i18n.t("checks.submit"),
    attrs: { type: "button" },
  });

  checkButton.addEventListener("click", () => {
    const correct = section.answerIndices.length === selected.size &&
      section.answerIndices.every((index) => selected.has(index));
    feedback.style.display = "block";
    feedback.textContent = correct
      ? i18n.t(section.correctKey)
      : i18n.t(section.incorrectKey);
    if (correct) {
      onComplete();
    }
  });

  container.append(question, optionsWrapper, checkButton, feedback);
  return container;
};
