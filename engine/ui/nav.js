import { createEl } from '../utils/dom.js';

export function renderNav(root, { navItems, t }) {
  root.innerHTML = '';
  navItems.forEach((item) => {
    const link = createEl('a', { attrs: { href: `#${item.target}` } });
    link.innerHTML = `<span aria-hidden="true">${item.icon}</span><span>${t(item.labelKey)}</span>`;
    root.appendChild(link);
  });
}
