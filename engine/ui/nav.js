import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";

const ICONS = {
  vocabulary: "📚",
  story: "📖",
  practice: "🎯",
  check: "✅",
  reflect: "🪞",
};

export function renderNav(sections, onNavigate) {
  const nav = createEl("nav", { className: "card" });
  const title = createEl("h3", { text: t("ui.quickJump") });
  const list = createEl("div", { className: "nav" });
  sections.forEach((section) => {
    const item = createEl("button", {
      className: "nav__item",
      attrs: { type: "button", "aria-label": `${t(section.labelKey)} ${t("ui.section")}` },
    });
    const icon = createEl("span", { text: ICONS[section.type] || "⭐" });
    const label = createEl("span", { text: t(section.labelKey) });
    item.append(icon, label);
    onClick(item, () => onNavigate(section.id));
    list.append(item);
  });
  nav.append(title, list);
  return nav;
}
