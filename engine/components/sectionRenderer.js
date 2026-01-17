import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";
import { renderVocabSection } from "./vocab.js";
import { renderListenButton } from "./media.js";
import { renderMcq } from "./mcq.js";
import { renderMultiSelect } from "./multiSelect.js";
import { renderDragMatch } from "./dragMatch.js";
import { renderWriting } from "./writing.js";

export function renderSection(section, { lang, onComplete, onStop, showHints, readAloud }) {
  const wrapper = createEl("section", {
    className: "card section",
    attrs: { id: `section-${section.id}`, "data-section-id": section.id },
  });
  const header = createEl("div", { className: "section__header" });
  const titleWrap = createEl("div");
  const title = createEl("h3", { text: t(section.titleKey) });
  const progress = createEl("p", { className: "eyebrow", text: t(section.labelKey) });
  titleWrap.append(progress, title);

  const actions = createEl("div", { className: "section__actions" });
  const simplifiedButton = createEl("button", {
    className: "button button--ghost",
    text: t("ui.simplifiedView"),
    attrs: { type: "button" },
  });
  const stopButton = createEl("button", { className: "button button--ghost", text: t("ui.stop") });
  onClick(stopButton, () => onStop(section.id));
  actions.append(simplifiedButton, stopButton);
  header.append(titleWrap, actions);

  const body = createEl("div", { className: "section__body" });

  if (section.simplifiedKey) {
    const simplified = createEl("div", { className: "section__simplified hidden", text: t(section.simplifiedKey) });
    onClick(simplifiedButton, () => simplified.classList.toggle("hidden"));
    body.append(simplified);
  }

  let content;
  switch (section.type) {
    case "vocabulary":
      content = renderVocabSection(section, lang);
      break;
    case "story":
      content = renderStorySection(section, lang, readAloud);
      break;
    case "check":
      content = renderMcq(section, () => onComplete(section.id));
      break;
    case "practice":
      content = renderDragMatch(section, () => onComplete(section.id));
      break;
    case "multiSelect":
      content = renderMultiSelect(section, () => onComplete(section.id));
      break;
    case "writing":
      content = renderWriting(section, () => onComplete(section.id));
      break;
    default:
      content = createEl("p", { text: t(section.bodyKey) });
  }

  body.append(content);

  if (showHints && section.hintKey) {
    body.append(createEl("div", { className: "section__simplified", text: t(section.hintKey) }));
  }

  if (["vocabulary", "story", "reflect"].includes(section.type)) {
    const completeButton = createEl("button", { className: "button", text: t("ui.markComplete") });
    onClick(completeButton, () => onComplete(section.id));
    body.append(completeButton);
  }

  wrapper.append(header, body);
  return wrapper;
}

function renderStorySection(section, lang, readAloud) {
  const wrapper = createEl("div", { className: "story-card" });
  if (readAloud) {
    const allText = section.paragraphKeys.map((paragraphKey) => t(paragraphKey)).join(" ");
    const readAllButton = renderListenButton(t("ui.readAloud"), lang, allText, "ui.readAloud");
    wrapper.append(readAllButton);
  }
  section.paragraphKeys.forEach((paragraphKey, index) => {
    const paragraphText = t(paragraphKey);
    const paragraph = createEl("p", { text: paragraphText });
    const listen = renderListenButton(
      `${t("ui.readAloudSection")} ${index + 1} ${t("ui.of")} ${section.paragraphKeys.length}`,
      lang,
      paragraphText
    );
    wrapper.append(paragraph, listen);
  });
  return wrapper;
}
