import { createElement } from "../utils/dom.js";

export const createModalHost = () => {
  const backdrop = createElement("div", {
    className: "modal-backdrop",
    attrs: { role: "dialog", "aria-modal": "true" },
  });
  const modal = createElement("div", { className: "modal" });
  backdrop.append(modal);

  const close = () => {
    backdrop.classList.remove("active");
    modal.innerHTML = "";
    document.body.style.overflow = "";
  };

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      close();
    }
  });

  const show = ({ title, content, actions = [] }) => {
    modal.innerHTML = "";
    const heading = createElement("h2", { text: title });
    modal.append(heading);
    if (typeof content === "string") {
      modal.insertAdjacentHTML("beforeend", content);
    } else if (content) {
      modal.append(content);
    }
    const footer = createElement("div", { className: "button-row" });
    actions.forEach((action) => {
      const btn = createElement("button", {
        className: `btn ${action.variant || ""}`,
        text: action.label,
        attrs: { type: "button" },
      });
      btn.addEventListener("click", () => {
        if (action.onClick) action.onClick();
        close();
      });
      footer.append(btn);
    });
    if (actions.length) modal.append(footer);
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  return { element: backdrop, show, close };
};
