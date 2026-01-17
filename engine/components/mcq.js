import { createElement } from "../utils/dom.js";

export const renderMcq = (section, i18n, onComplete) => {
  const container = createElement("div");
  const question = createElement("p", { text: i18n.t(section.questionKey) });
  const optionsWrapper = createElement("div", { className: "check-options" });
  const feedback = createElement("div", { className: "feedback", attrs: { role: "status" } });
  feedback.style.display = "none";

  let selectedIndex = null;

  section.options.forEach((optionKey, index) => {
    const option = createElement("button", {
      className: "option",
      text: i18n.t(optionKey),
      attrs: { type: "button" },
    });
    option.addEventListener("click", () => {
      selectedIndex = index;
      optionsWrapper
        .querySelectorAll(".option")
        .forEach((el) => el.classList.remove("selected"));
      option.classList.add("selected");
    });
    optionsWrapper.append(option);
  });

  const checkButton = createElement("button", {
    className: "btn",
    text: i18n.t("checks.submit"),
    attrs: { type: "button" },
  });

  checkButton.addEventListener("click", () => {
    if (selectedIndex === null) return;
    const correct = selectedIndex === section.answerIndex;
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
