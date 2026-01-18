import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { speakText } from "../utils/speech.js";

export const renderListenButton = ({ text, language, labelKey, onClick }) => {
  const button = el("button", { className: "button button--outline", text: t(labelKey) });
  button.addEventListener("click", () => {
    speakText(text, language);
    if (onClick) onClick();
  });
  return button;
};
