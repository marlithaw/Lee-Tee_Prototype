import { createEl } from "../utils/dom.js";
import { speakText, stopSpeech } from "../utils/speech.js";
import { t } from "../i18n.js";
import { getCurrentLang } from "../i18n.js";

export const createListenButton = (text, labelKey = "story.listen") => {
  const btn = createEl("button", { text: t(labelKey), className: "ghost", attrs: { type: "button" } });
  btn.addEventListener("click", () => speakText(text, getCurrentLang()));
  return btn;
};

export const createStopAudioButton = () => {
  const btn = createEl("button", { text: t("story.stop"), className: "ghost", attrs: { type: "button" } });
  btn.addEventListener("click", () => stopSpeech());
  return btn;
};
