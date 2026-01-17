import { el, qs } from "../utils/dom.js";

export const showToast = (message) => {
  const root = qs("#toast-root");
  const toast = el("div", { className: "toast", text: message });
  root.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};
