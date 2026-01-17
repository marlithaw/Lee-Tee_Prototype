import { createEl, onClick } from "../utils/dom.js";
import { speak } from "../utils/speech.js";
import { t } from "../i18n.js";

export function renderListenButton(label, lang, text, buttonLabelKey = "ui.listen") {
  const button = createEl("button", { className: "button button--ghost", text: t(buttonLabelKey) });
  const speechText = text || label;
  button.setAttribute("aria-label", label);
  onClick(button, () => speak(speechText, lang));
  return button;
}
