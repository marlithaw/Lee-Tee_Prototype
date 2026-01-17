import { createEl, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderSettings = ({ container, settings, onToggle }) => {
  clear(container);
  const title = createEl("h2", { text: t("settings.title") });
  const grid = createEl("div", { className: "settings-grid" });

  const entries = [
    { key: "readAloud", label: t("settings.readAloud") },
    { key: "dyslexia", label: t("settings.dyslexia") },
    { key: "highContrast", label: t("settings.highContrast") },
    { key: "showHints", label: t("settings.showHints") },
  ];

  entries.forEach(({ key, label }) => {
    const wrapper = createEl("label", { className: "toggle" });
    const input = createEl("input", {
      attrs: {
        type: "checkbox",
        checked: settings[key] ? "checked" : null,
        "aria-label": label,
      },
    });
    input.checked = settings[key];
    input.addEventListener("change", () => onToggle(key, input.checked));
    wrapper.append(input, createEl("span", { text: label }));
    grid.append(wrapper);
  });

  container.append(title, grid);
};
