import { createEl } from "../utils/dom.js";
import { t, resolveContent, getLanguage } from "../i18n.js";
import { showModal } from "../ui/modal.js";
import { speakText } from "../utils/speech.js";

export const renderVocabSection = (container, section) => {
  const grid = createEl("div", { className: "vocab-grid" });
  const lang = getLanguage();

  section.items.forEach((item) => {
    const card = createEl("div", { className: "vocab-card" });
    card.appendChild(createEl("h3", { text: resolveContent(item.word, lang) }));
    card.appendChild(createEl("p", { text: resolveContent(item.definition, lang) }));
    const openBtn = createEl("button", { className: "button secondary", text: t("ui.more") });
    openBtn.addEventListener("click", () => {
      const content = createEl("div");
      content.appendChild(createEl("p", { text: resolveContent(item.definition, lang) }));
      content.appendChild(createEl("p", { text: resolveContent(item.spanish, lang) }));
      content.appendChild(createEl("p", { text: resolveContent(item.example, lang) }));
      const hearBtn = createEl("button", { className: "button", text: t("ui.hearIt") });
      hearBtn.addEventListener("click", () => speakText(resolveContent(item.word, lang)));
      content.appendChild(hearBtn);
      showModal({ title: resolveContent(item.word, lang), content, ariaLabel: t("ui.vocabModal") });
    });
    card.appendChild(openBtn);
    grid.appendChild(card);
  });

  container.appendChild(grid);
};
