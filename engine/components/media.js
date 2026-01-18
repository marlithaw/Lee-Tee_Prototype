import { createEl } from "../utils/dom.js";
import { playAudio } from "../utils/audio.js";
import { t } from "../i18n.js";

export const renderAudioButton = (label, src) => {
  const button = createEl("button", { className: "button secondary", text: label || t("ui.listen") });
  button.addEventListener("click", () => playAudio(src));
  return button;
};
