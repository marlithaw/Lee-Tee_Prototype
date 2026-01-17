import { clear, el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderNav = ({ container, sections }) => {
  clear(container);
  sections.forEach((section) => {
    const link = el("a", {
      className: "quick-jump__item",
      attrs: {
        href: `#${section.id}`,
        "aria-label": t(section.navLabelKey),
      },
    });
    const icon = el("span", { text: section.icon || "★" });
    const label = el("span", { text: t(section.navLabelKey) });
    link.append(icon, label);
    container.appendChild(link);
  });
};
