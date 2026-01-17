import { createEl, qs } from "../utils/dom.js";

export const showToast = (message, timeout = 2500) => {
  const toast = createEl("div", { className: "toast", text: message });
  qs("#toast-root").append(toast);
  setTimeout(() => toast.remove(), timeout);
};
