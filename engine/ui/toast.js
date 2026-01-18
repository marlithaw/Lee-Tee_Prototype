export const createToast = (message) => {
  const root = document.getElementById('toast-root');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  root.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};
