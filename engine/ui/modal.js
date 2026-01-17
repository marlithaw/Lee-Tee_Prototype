import { qs, createEl } from '../utils/dom.js';

export function openModal({ title, content, ariaLabel, closeLabel }) {
  const root = qs('#modalRoot');
  root.innerHTML = '';
  const modal = createEl('div', { className: 'modal', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': ariaLabel || title } });
  const header = createEl('header');
  const titleEl = createEl('h3', { text: title });
  const closeBtn = createEl('button', { className: 'btn ghost', text: closeLabel || 'Close', attrs: { 'aria-label': closeLabel || 'Close' } });
  closeBtn.addEventListener('click', closeModal);
  header.append(titleEl, closeBtn);
  const body = createEl('div');
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else {
    body.appendChild(content);
  }
  modal.append(header, body);
  root.appendChild(modal);
  root.classList.add('active');
  root.addEventListener('click', (event) => {
    if (event.target === root) closeModal();
  });
}

export function closeModal() {
  const root = qs('#modalRoot');
  root.classList.remove('active');
  root.innerHTML = '';
}
