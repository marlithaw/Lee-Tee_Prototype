import { createEl } from "../utils/dom.js";

export const showModal = ({ title, content, ariaLabel }) => {
  const root = document.getElementById("modal-root");
  const backdrop = createEl("div", { className: "modal-backdrop" });
  const modal = createEl("div", { className: "modal", attrs: { role: "dialog", "aria-modal": "true" } });
  if (ariaLabel) modal.setAttribute("aria-label", ariaLabel);

  const header = createEl("header");
  header.appendChild(createEl("h3", { text: title }));
  const closeBtn = createEl("button", { className: "button secondary", text: "✕" });
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.addEventListener("click", () => root.removeChild(backdrop));
  header.appendChild(closeBtn);

  modal.appendChild(header);
  if (typeof content === "string") {
    modal.appendChild(createEl("p", { text: content }));
  } else if (content instanceof Node) {
    modal.appendChild(content);
  }

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) root.removeChild(backdrop);
  });

  backdrop.appendChild(modal);
  root.appendChild(backdrop);
};
