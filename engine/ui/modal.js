export function createModalManager(root) {
  function close() {
    root.innerHTML = '';
  }

  function open({ title, content, closeLabel }) {
    root.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.tabIndex = -1;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal__content';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    header.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'button ghost';
    closeBtn.type = 'button';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', closeLabel);
    closeBtn.addEventListener('click', close);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.style.whiteSpace = 'pre-line';
    body.textContent = content;

    modalContent.appendChild(header);
    modalContent.appendChild(body);
    overlay.appendChild(modalContent);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        close();
      }
    });

    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        close();
      }
    });

    closeBtn.focus();

    root.appendChild(overlay);
  }

  return { open, close };
}
