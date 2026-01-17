import { createEl } from "../utils/dom.js";
import { t, getCurrentLang } from "../i18n.js";
import { renderVocab } from "./vocab.js";
import { renderMCQ } from "./mcq.js";
import { renderMultiSelect } from "./multiSelect.js";
import { renderDragMatch } from "./dragMatch.js";
import { renderWriting } from "./writing.js";
import { createListenButton, createStopAudioButton } from "./media.js";
import { speakText } from "../utils/speech.js";
import { openModal } from "../ui/modal.js";

export const renderSection = ({ section, index, total, progress, settings, onComplete }) => {
  const wrapper = createEl("article", {
    className: "section",
    attrs: { id: section.id, "data-section-id": section.id },
  });
  const header = createEl("div", { className: "section-header" });
  const title = createEl("h2", { text: t(section.titleKey) });
  const meta = createEl("span", { text: t("sections.count").replace("{index}", index + 1).replace("{total}", total) });
  header.append(title, meta);

  const controls = createEl("div");
  const simplifiedBtn = createEl("button", {
    className: "ghost",
    text: t("sections.simplified"),
    attrs: { type: "button", "aria-pressed": "false" },
  });
  let simplified = false;
  simplifiedBtn.addEventListener("click", () => {
    simplified = !simplified;
    simplifiedBtn.setAttribute("aria-pressed", simplified ? "true" : "false");
    simplifiedBtn.textContent = simplified ? t("sections.fullView") : t("sections.simplified");
    renderBody();
  });
  controls.append(simplifiedBtn);

  const body = createEl("div");

  const renderBody = () => {
    body.innerHTML = "";
    if (section.helperButtons?.length && settings.showHints) {
      const helperRow = createEl("div", { className: "story-actions" });
      section.helperButtons.forEach((helper) => {
        const btn = createEl("button", {
          className: "ghost",
          text: t(helper.labelKey),
          attrs: { type: "button" },
        });
        btn.addEventListener("click", () => {
          openModal({ title: t(helper.labelKey), content: `<p>${t(helper.tipKey)}</p>` });
        });
        helperRow.append(btn);
      });
      body.append(helperRow);
    }

    if (section.type === "vocab") {
      body.append(renderVocab({ words: section.words }));
    }

    if (section.type === "story") {
      const actions = createEl("div", { className: "story-actions" });
      actions.append(createListenButton(t(section.storyKey)));
      actions.append(createStopAudioButton());
      actions.append(createEl("span", { text: t("story.readAloud").replace("{index}", index + 1).replace("{total}", total) }));
      const text = simplified && section.simplifiedKey ? t(section.simplifiedKey) : t(section.storyKey);
      const story = createEl("p", { className: "story-text", text });
      body.append(actions, story);
      if (settings.readAloud) {
        speakText(text, getCurrentLang());
      }
    }

    if (section.type === "check") {
      section.items.forEach((item) => {
        const renderer = item.type === "multi" ? renderMultiSelect : renderMCQ;
        body.append(
          renderer({
            item,
            onAnswered: (correct) => {
              if (correct) onComplete(section.id, item.id);
            },
          })
        );
      });
    }

    if (section.type === "practice") {
      body.append(
        renderDragMatch({
          activity: section.activity,
          onCompleted: (itemId) => onComplete(section.id, itemId),
        })
      );
    }

    if (section.type === "writing") {
      body.append(renderWriting({ promptKey: section.promptKey, frames: section.frames }));
    }

    if (section.type === "reflect") {
      body.append(createEl("p", { text: t(section.promptKey) }));
    }
  };

  renderBody();

  const completed = progress.completedSections?.includes(section.id);
  const completeBtn = createEl("button", {
    className: "primary",
    text: completed ? t("sections.completed") : t("sections.markComplete"),
    attrs: { type: "button" },
  });
  completeBtn.disabled = completed;
  completeBtn.addEventListener("click", () => onComplete(section.id));

  wrapper.append(header, controls, body, completeBtn);
  return wrapper;
};
