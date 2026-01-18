import { clearEl, createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderQuickJump = (container, navItems) => {
  clearEl(container);
  navItems.forEach((item) => {
    const link = createEl("a", {
      attrs: { href: `#${item.target}`, "aria-label": t(item.labelKey) },
    });
    link.appendChild(createEl("span", { text: item.icon }));
    link.appendChild(createEl("span", { text: t(item.labelKey) }));
    container.appendChild(link);
  });
};
