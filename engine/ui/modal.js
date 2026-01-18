export const openModal = ({ title, content, onClose }) => {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal" role="document">
        <header>
          <h3>${title}</h3>
          <button class="secondary" id="close-modal" aria-label="Close">×</button>
        </header>
        <div>${content}</div>
      </div>
    </div>
  `;
  const overlay = root.querySelector('.modal-overlay');
  const closeButton = root.querySelector('#close-modal');

  const close = () => {
    root.innerHTML = '';
    if (onClose) onClose();
  };

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
};
