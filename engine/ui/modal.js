import { createEl, qs, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

const modalRoot = () => qs("#modal-root");

export const openModal = ({ title, content, ariaLabel }) => {
  const overlay = createEl("div", { className: "modal-overlay" });
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", ariaLabel || title || "Modal");

  const modal = createEl("div", { className: "modal" });
  const header = createEl("div");
  const titleEl = createEl("h2", { text: title });
  const closeBtn = createEl("button", {
    text: "×",
    attrs: { "aria-label": t("ui.closeModal") },
  });

  closeBtn.addEventListener("click", () => closeModal());
  header.append(titleEl, closeBtn);
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  if (typeof content === "string") {
    const body = createEl("div", { html: content });
    modal.append(header, body);
  } else {
    modal.append(header, content);
  }

  overlay.append(modal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  clear(modalRoot());
  modalRoot().append(overlay);
  closeBtn.focus();
};

export const closeModal = () => {
  clear(modalRoot());
};
