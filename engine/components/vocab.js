import { createEl, onClick } from "../utils/dom.js";
import { openModal } from "../ui/modal.js";
import { t } from "../i18n.js";
import { renderListenButton } from "./media.js";

export function renderVocabSection(section, lang) {
  const wrapper = createEl("div", { className: "vocab-grid" });
  section.words.forEach((word) => {
    const card = createEl("button", {
      className: "vocab-card",
      text: t(word.termKey),
      attrs: { type: "button", "aria-label": t("ui.openVocabCard") },
    });
    onClick(card, () => openVocabModal(word, lang));
    wrapper.append(card);
  });
  return wrapper;
}

function openVocabModal(word, lang) {
  const content = createEl("div");
  content.append(
    createEl("p", { text: t(word.definitionKey) }),
    createEl("p", { text: t(word.spanishKey) }),
    createEl("p", { text: t(word.storyExampleKey) })
  );
  const listenButton = renderListenButton(t(word.termKey), lang, t(word.termKey), "ui.hearIt");
  content.append(listenButton);
  openModal({ title: t(word.termKey), content });
}
