import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderVideoSection = ({ section, onUnlock }) => {
  const wrapper = el("div", { className: "video-section" });
  wrapper.appendChild(el("p", { text: t(section.promptKey) }));

  const video = el("video", {
    className: "video-player",
    attrs: { controls: "controls", preload: "metadata", "aria-label": t(section.titleKey) },
  });
  const source = el("source", { attrs: { src: section.src, type: "video/mp4" } });
  video.appendChild(source);

  const transcript = el("details", { className: "video-transcript" });
  transcript.appendChild(el("summary", { text: t("video.transcriptLabel") }));
  transcript.appendChild(el("p", { text: t(section.transcriptKey) }));

  const quickCheck = section.quickCheck;
  const checkWrapper = el("div", { className: "card" });
  checkWrapper.appendChild(el("p", { text: t(quickCheck.questionKey) }));
  const options = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });
  let unlocked = false;

  quickCheck.choicesKeys.forEach((choiceKey, index) => {
    const button = el("button", {
      className: "button button--ghost",
      text: t(choiceKey),
      attrs: { type: "button", "aria-label": t(choiceKey) },
    });
    button.addEventListener("click", () => {
      const isCorrect = index === quickCheck.correctIndex;
      feedback.textContent = t(isCorrect ? quickCheck.feedbackKeys.correct : quickCheck.feedbackKeys.incorrect);
      feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
      if (isCorrect && !unlocked) {
        unlocked = true;
        onUnlock();
      }
    });
    options.appendChild(button);
  });

  checkWrapper.append(options, feedback);
  wrapper.append(video, transcript, checkWrapper);
  return wrapper;
};
