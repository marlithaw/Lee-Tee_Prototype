import { qs, createEl } from '../utils/dom.js';

export function showToast(message) {
  const root = qs('#toastRoot');
  const toast = createEl('div', { className: 'toast', text: message, attrs: { role: 'status' } });
  root.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
