import { createEl } from "../utils/dom.js";
import { t, resolveContent, getLanguage } from "../i18n.js";
import { getState } from "../store.js";

export const renderWritingSection = (container, section) => {
  const lang = getLanguage();
  const block = createEl("div", { className: "card" });
  block.appendChild(createEl("h3", { text: resolveContent(section.title, lang) }));
  block.appendChild(createEl("p", { text: resolveContent(section.prompt, lang) }));

  const textarea = createEl("textarea", {
    attrs: { "aria-label": t("ui.writingResponse") },
  });
  block.appendChild(textarea);

  if (section.frames?.length) {
    const state = getState();
    const frameWrap = createEl("div", { className: "notice" });
    frameWrap.appendChild(createEl("h4", { text: t("ui.sentenceFrames") }));
    if (state.settings.showHints) {
      section.frames.forEach((frame) => {
        frameWrap.appendChild(createEl("p", { text: resolveContent(frame, lang) }));
      });
    } else {
      frameWrap.appendChild(createEl("p", { text: t("ui.hintsHidden") }));
    }
    block.appendChild(frameWrap);
  }

  container.appendChild(block);
};
