import { createElement } from "../utils/dom.js";

export const renderWriting = (section, i18n, store, onComplete) => {
  const container = createElement("div", { className: "writing-area" });
  const prompt = createElement("p", { text: i18n.t(section.promptKey) });
  const textarea = createElement("textarea", {
    attrs: {
      placeholder: i18n.t("writing.placeholder"),
      "aria-label": i18n.t("writing.placeholder"),
    },
  });

  const hints = createElement("div");
  const hintTitle = createElement("strong", { text: i18n.t("writing.frames") });
  const hintList = createElement("ul");
  section.framesKeys.forEach((key) => {
    hintList.append(createElement("li", { text: i18n.t(key) }));
  });
  hints.append(hintTitle, hintList);

  const completeButton = createElement("button", {
    className: "btn",
    text: i18n.t("writing.complete"),
    attrs: { type: "button" },
  });

  completeButton.addEventListener("click", () => {
    if (textarea.value.trim().length < 5) return;
    onComplete();
  });

  const shouldShowHints = store.getState().settings.showHints;
  if (!shouldShowHints) {
    hints.style.display = "none";
  }

  container.append(prompt, textarea, hints, completeButton);
  return container;
};
