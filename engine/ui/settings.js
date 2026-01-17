import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";

export function renderSettingsPanel(state, onToggle) {
  const panel = createEl("div", { className: "settings-panel", attrs: { role: "region", "aria-label": t("ui.readingSettings") } });
  const heading = createEl("h3", { text: t("ui.readingSettings") });
  panel.append(heading);

  const toggles = [
    { key: "readAloud", label: t("ui.readAloud") },
    { key: "dyslexiaFont", label: t("ui.dyslexiaFont") },
    { key: "highContrast", label: t("ui.highContrast") },
    { key: "showHints", label: t("ui.showHints") },
  ];

  toggles.forEach((toggle) => {
    const row = createEl("div", { className: "settings-panel__item" });
    const label = createEl("span", { text: toggle.label });
    const toggleWrap = createEl("label", { className: "toggle" });
    const input = createEl("input", {
      attrs: {
        type: "checkbox",
        role: "switch",
        "aria-label": toggle.label,
      },
    });
    input.checked = Boolean(state.settings[toggle.key]);
    input.addEventListener("change", () => onToggle(toggle.key, input.checked));
    const slider = createEl("span");
    toggleWrap.append(input, slider);
    row.append(label, toggleWrap);
    panel.append(row);
  });

  const hint = createEl("p", { text: t("ui.settingsHint"), className: "eyebrow" });
  panel.append(hint);

  return panel;
}

export function renderSettingsToggle(button, panel) {
  let open = false;
  onClick(button, () => {
    open = !open;
    panel.classList.toggle("hidden", !open);
    if (open) {
      panel.focus?.();
    }
  });
}
