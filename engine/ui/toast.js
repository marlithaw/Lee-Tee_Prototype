import { createEl } from "../utils/dom.js";

export const showToast = (message) => {
  const root = document.getElementById("toast-root");
  const toast = createEl("div", { className: "toast", text: message });
  root.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  }, 2500);
};
