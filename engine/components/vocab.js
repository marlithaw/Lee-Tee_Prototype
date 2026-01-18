import { el } from "../utils/dom.js";
import { openModal } from "../ui/modal.js";
import { t } from "../i18n.js";
import { speakText } from "../utils/speech.js";

export const renderVocab = ({ vocabItems, language }) => {
  const wrapper = el("div", { className: "card-grid" });
  vocabItems.forEach((item) => {
    const card = el("button", {
      className: "card button--ghost",
      attrs: {
        type: "button",
        "aria-label": t(item.termKey),
      },
    });
    card.appendChild(el("h4", { text: t(item.termKey) }));
    card.appendChild(el("p", { className: "muted", text: t(item.shortDefKey) }));
    card.addEventListener("click", () => {
      const body = el("div");
      body.appendChild(el("p", { text: t(item.definitionKey) }));
      body.appendChild(el("p", { className: "muted", text: t(item.spanishKey) }));
      body.appendChild(el("p", { text: t(item.exampleKey) }));
      const hearButton = el("button", {
        className: "button button--outline",
        text: t("vocab.hearIt"),
        attrs: { type: "button", "aria-label": t("vocab.hearIt") },
      });
      hearButton.addEventListener("click", () => speakText(t(item.termKey), language));
      body.appendChild(hearButton);
      openModal({ title: t(item.termKey), body, ariaLabel: t("vocab.modalLabel") });
    });
    wrapper.appendChild(card);
  });
  return wrapper;
};
