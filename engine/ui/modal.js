import { el, qs } from "../utils/dom.js";

export const openModal = ({ title, body, ariaLabel }) => {
  const root = qs("#modal-root");
  const modal = el("div", { className: "modal", attrs: { role: "dialog", "aria-modal": "true", "aria-label": ariaLabel || title } });
  const content = el("div", { className: "modal__content" });
  const closeButton = el("button", { className: "button button--ghost modal__close", text: "×", attrs: { "aria-label": "Close" } });
  closeButton.addEventListener("click", () => modal.remove());
  const heading = el("h2", { text: title });
  const bodyWrapper = el("div");
  if (typeof body === "string") {
    bodyWrapper.innerHTML = body;
  } else if (body) {
    bodyWrapper.appendChild(body);
  }

  content.append(closeButton, heading, bodyWrapper);
  modal.appendChild(content);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.remove();
  });
  root.appendChild(modal);
  closeButton.focus();
};
