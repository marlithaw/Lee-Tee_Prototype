export function createToastManager(root) {
  function show(message) {
    root.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    root.appendChild(toast);
    setTimeout(() => {
      root.innerHTML = '';
    }, 3000);
  }

  return { show };
}
