import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderVideoSection = ({ section, onUnlocked }) => {
  const wrapper = el("div", { className: "video-section" });
  wrapper.appendChild(el("p", { className: "muted", text: t(section.promptKey) }));

  const video = el("video", {
    className: "media",
    attrs: { controls: "controls", preload: "metadata", src: section.src, "aria-label": t(section.titleKey) },
  });
  wrapper.appendChild(video);

  const transcript = el("details", { className: "media-transcript" });
  transcript.appendChild(el("summary", { text: t("media.transcriptLabel") }));
  transcript.appendChild(el("p", { text: t(section.transcriptKey) }));
  wrapper.appendChild(transcript);

  const check = section.quickCheck;
  const checkWrapper = el("div", { className: "interaction" });
  checkWrapper.appendChild(el("p", { text: t(check.questionKey) }));
  const list = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  check.choicesKeys.forEach((choiceKey, index) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(choiceKey),
      attrs: { type: "button", "aria-label": t(choiceKey) },
    });
    button.addEventListener("click", () => {
      const isCorrect = index === check.correctIndex;
      feedback.textContent = t(isCorrect ? check.feedbackKeys.correct : check.feedbackKeys.incorrect);
      feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
      if (isCorrect) {
        list.querySelectorAll("button").forEach((btn) => {
          btn.disabled = true;
        });
        onUnlocked?.();
      }
    });
    list.appendChild(button);
  });

  checkWrapper.append(list, feedback);
  wrapper.appendChild(checkWrapper);
  return wrapper;
};
