export const renderQuickJump = ({ container, episode, i18n }) => {
  container.innerHTML = `
    <h2>${i18n.t('ui.quickJump')}</h2>
    <div class="quick-jump-list">
      ${episode.nav.map(
        (item) => `
          <button type="button" data-target="${item.target}">
            <span aria-hidden="true">${item.icon}</span>
            <span>${i18n.t(item.labelKey)}</span>
          </button>
        `
      ).join('')}
    </div>
  `;

  container.querySelectorAll('button[data-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        target.focus({ preventScroll: true });
      }
    });
  });
};
