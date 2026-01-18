import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderVideoSection = ({ section, onUnlock }) => {
  const wrapper = el("div", { className: "video-section" });
  wrapper.appendChild(el("p", { text: t(section.promptKey) }));

  const video = el("video", {
    className: "media",
    attrs: { controls: "controls", preload: "metadata", src: section.src, "aria-label": t(section.titleKey) },
  });
  wrapper.appendChild(video);

  const transcript = el("details", { className: "media-transcript" });
  transcript.appendChild(el("summary", { text: t("media.transcriptLabel") }));
  transcript.appendChild(el("p", { text: t(section.transcriptKey) }));
  wrapper.appendChild(transcript);

  if (section.quickCheck?.type === "mcq") {
    const check = el("div", { className: "story-interaction" });
    check.appendChild(el("p", { text: t(section.quickCheck.questionKey) }));
    const choices = el("div", { className: "story-interaction__options" });
    const feedback = el("div", { className: "feedback", attrs: { role: "status" } });
    let unlocked = false;

    section.quickCheck.choicesKeys.forEach((choiceKey, index) => {
      const button = el("button", {
        className: "button button--ghost",
        text: t(choiceKey),
        attrs: { type: "button" },
      });
      button.addEventListener("click", () => {
        if (unlocked) return;
        const isCorrect = index === section.quickCheck.correctIndex;
        feedback.textContent = t(isCorrect ? section.quickCheck.feedbackKeys.correctKey : section.quickCheck.feedbackKeys.incorrectKey);
        feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
        if (isCorrect && onUnlock) {
          unlocked = true;
          onUnlock();
        }
      });
      choices.appendChild(button);
    });

    check.append(choices, feedback);
    wrapper.appendChild(check);
  }

  return wrapper;
};
