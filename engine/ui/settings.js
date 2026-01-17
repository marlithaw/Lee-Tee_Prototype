import { clear, el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderSettings = ({ container, settings, onChange }) => {
  clear(container);
  container.appendChild(el("h2", { text: t("settings.title") }));

  const toggles = [
    { key: "readAloud", label: t("settings.readAloud") },
    { key: "dyslexia", label: t("settings.dyslexia") },
    { key: "contrast", label: t("settings.contrast") },
    { key: "showHints", label: t("settings.showHints") },
  ];

  const list = el("div", { className: "list" });
  toggles.forEach((toggle) => {
    const wrapper = el("label", { className: "toggle" });
    const label = el("span", { text: toggle.label });
    const input = el("input", {
      attrs: {
        type: "checkbox",
        checked: settings[toggle.key] ? "checked" : null,
        "aria-label": toggle.label,
      },
    });
    if (settings[toggle.key]) {
      input.checked = true;
    }
    input.addEventListener("change", () => {
      onChange({ [toggle.key]: input.checked });
    });
    wrapper.append(label, input);
    list.appendChild(wrapper);
  });

  container.appendChild(list);
};
