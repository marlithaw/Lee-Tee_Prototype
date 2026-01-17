import { createElement } from "../utils/dom.js";
import { speak } from "../utils/speech.js";

export const renderVocab = (section, i18n, modal, language) => {
  const container = createElement("div");
  const grid = createElement("div", { className: "vocab-grid" });

  section.items.forEach((item) => {
    const card = createElement("button", {
      className: "vocab-card",
      attrs: {
        type: "button",
        "aria-label": i18n.t(item.termKey),
      },
      html: `<strong>${i18n.t(item.termKey)}</strong><div>${i18n.t(
        item.definitionKey
      )}</div>`,
    });

    card.addEventListener("click", () => {
      modal.show({
        title: i18n.t(item.termKey),
        content: `
          <p><strong>${i18n.t("vocab.definition")}</strong> ${i18n.t(
            item.definitionKey
          )}</p>
          <p><strong>${i18n.t("vocab.spanish")}</strong> ${i18n.t(
            item.spanishKey
          )}</p>
          <p><strong>${i18n.t("vocab.example")}</strong> ${i18n.t(
            item.storyExampleKey
          )}</p>
        `,
        actions: [
          {
            label: i18n.t("vocab.hearIt"),
            variant: "secondary",
            onClick: () => speak(i18n.t(item.termKey), language),
          },
          { label: i18n.t("common.close"), variant: "ghost" },
        ],
      });
    });
    grid.append(card);
  });

  container.append(grid);
  return container;
};
