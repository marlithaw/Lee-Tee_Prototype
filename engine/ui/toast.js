import { createElement } from "../utils/dom.js";

export const createToast = () => {
  const element = createElement("div", { className: "toast", attrs: { role: "status" } });
  let timeoutId;

  const show = (message, duration = 2400) => {
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      element.classList.remove("show");
    }, duration);
  };

  return { element, show };
};
