import { createEl } from "../utils/dom.js";

let toastTimeout;

export function showToast(message) {
  const toast = createEl("div", { className: "toast", text: message, attrs: { role: "status" } });
  document.body.appendChild(toast);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 2500);
}
