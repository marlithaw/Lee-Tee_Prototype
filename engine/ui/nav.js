import { createEl, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderQuickNav = ({ container, navItems }) => {
  clear(container);
  const title = createEl("h2", { text: t("nav.quickJump") });
  const list = createEl("div", { className: "quick-nav" });

  navItems.forEach((item) => {
    const btn = createEl("button", {
      className: "ghost",
      attrs: {
        type: "button",
        "aria-label": t(item.labelKey),
      },
    });
    const icon = createEl("span", { text: item.icon || "•" });
    const label = createEl("span", { text: t(item.labelKey) });
    btn.append(icon, label);
    btn.addEventListener("click", () => {
      document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
    });
    list.append(btn);
  });

  container.append(title, list);
};
