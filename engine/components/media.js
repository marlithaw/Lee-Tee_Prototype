import { createElement } from "../utils/dom.js";
import { speak, stopSpeaking } from "../utils/speech.js";

export const renderListenControls = (text, i18n, language, enabled) => {
  const wrapper = createElement("div", { className: "story-controls" });
  if (!enabled) {
    wrapper.append(
      createElement("p", { text: i18n.t("story.readAloudOff") })
    );
    return wrapper;
  }
  const listenButton = createElement("button", {
    className: "btn secondary",
    text: i18n.t("story.listen"),
    attrs: { type: "button" },
  });
  const stopButton = createElement("button", {
    className: "btn ghost",
    text: i18n.t("story.stop"),
    attrs: { type: "button" },
  });

  listenButton.addEventListener("click", () => speak(text, language));
  stopButton.addEventListener("click", () => stopSpeaking());

  wrapper.append(listenButton, stopButton);
  return wrapper;
};
