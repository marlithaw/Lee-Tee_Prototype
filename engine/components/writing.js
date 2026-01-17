import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";

export function renderWriting(section, onComplete) {
  const wrapper = createEl("div", { className: "question" });
  wrapper.append(createEl("p", { text: t(section.promptKey) }));

  if (section.frames?.length) {
    const frameList = createEl("ul");
    section.frames.forEach((frame) => {
      frameList.append(createEl("li", { text: t(frame) }));
    });
    wrapper.append(frameList);
  }

  const textarea = createEl("textarea", {
    attrs: {
      rows: "4",
      placeholder: t("ui.writeHere"),
      "aria-label": t("ui.writingResponse"),
    },
  });

  const submit = createEl("button", { className: "button", text: t("ui.saveResponse") });
  const feedback = createEl("div");
  onClick(submit, () => {
    if (textarea.value.trim().length > 0) {
      feedback.className = "feedback feedback--correct";
      feedback.textContent = t("ui.saved");
      onComplete();
    } else {
      feedback.className = "feedback feedback--incorrect";
      feedback.textContent = t("ui.addMore")
    }
  });

  wrapper.append(textarea, submit, feedback);
  return wrapper;
}
