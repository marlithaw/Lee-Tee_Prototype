import { createEl, clearChildren, onClick } from "../utils/dom.js";

const modalRoot = document.getElementById("modal-root");

export function openModal({ title, content, onClose }) {
  clearChildren(modalRoot);
  const overlay = createEl("div", { className: "modal", attrs: { role: "dialog", "aria-modal": "true" } });
  const modal = createEl("div", { className: "modal__content" });
  const header = createEl("div", { className: "modal__header" });
  const heading = createEl("h3", { text: title });
  const closeBtn = createEl("button", {
    className: "button button--ghost",
    text: "×",
    attrs: { "aria-label": "Close" },
  });
  onClick(closeBtn, () => closeModal(onClose));
  header.append(heading, closeBtn);
  const body = createEl("div", { className: "modal__body" });
  if (typeof content === "string") {
    body.textContent = content;
  } else if (content) {
    body.append(content);
  }
  modal.append(header, body);
  overlay.append(modal);
  modalRoot.append(overlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal(onClose);
    }
  });
  document.addEventListener("keydown", handleEscape);
}

function handleEscape(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

export function closeModal(onClose) {
  clearChildren(modalRoot);
  document.removeEventListener("keydown", handleEscape);
  if (onClose) onClose();
}
