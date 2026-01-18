import { clearEl, createEl } from "../utils/dom.js";
import { getState, updateSetting } from "../store.js";
import { t } from "../i18n.js";

const toggleConfig = [
  { key: "readAloud", label: "ui.readAloud" },
  { key: "dyslexiaFont", label: "ui.dyslexiaFont" },
  { key: "highContrast", label: "ui.highContrast" },
  { key: "showHints", label: "ui.showHints" },
];

export const renderSettings = (container, onToggle) => {
  clearEl(container);
  const card = createEl("div", { className: "card" });
  card.appendChild(createEl("h3", { text: t("ui.readingSettings") }));

  const grid = createEl("div", { className: "settings-grid" });
  const state = getState();

  toggleConfig.forEach(({ key, label }) => {
    const wrapper = createEl("label", { className: "toggle" });
    const checkbox = createEl("input", {
      attrs: { type: "checkbox", "aria-label": t(label) },
    });
    checkbox.checked = state.settings[key];
    checkbox.addEventListener("change", () => {
      updateSetting(key, checkbox.checked);
      onToggle?.(key, checkbox.checked);
    });
    wrapper.appendChild(checkbox);
    wrapper.appendChild(createEl("span", { text: t(label) }));
    grid.appendChild(wrapper);
  });

  card.appendChild(grid);
  container.appendChild(card);
};
