import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { openModal } from "../ui/modal.js";
import { createListenButton } from "./media.js";

export const renderVocab = ({ words }) => {
  const wrapper = createEl("div");
  const title = createEl("h3", { text: t("vocab.title") });
  const grid = createEl("div", { className: "vocab-grid" });

  words.forEach((word) => {
    const card = createEl("button", {
      className: "vocab-card",
      attrs: {
        type: "button",
        "aria-label": t(word.termKey),
      },
    });
    card.append(createEl("strong", { text: t(word.termKey) }));
    card.append(createEl("p", { text: t(word.shortDefKey) }));
    card.addEventListener("click", () => {
      const content = createEl("div");
      content.append(
        createEl("p", { text: t(word.definitionKey) }),
        createEl("p", { text: t(word.spanishKey) }),
        createEl("p", { text: t(word.exampleKey) })
      );
      const actions = createEl("div", { className: "vocab-actions" });
      actions.append(createListenButton(t(word.termKey), "vocab.hearIt"));
      content.append(actions);
      openModal({
        title: t(word.termKey),
        content,
        ariaLabel: t("vocab.modalLabel").replace("{word}", t(word.termKey)),
      });
    });
    grid.append(card);
  });

  wrapper.append(title, grid);
  return wrapper;
};
