import { createElement } from "../utils/dom.js";

export const renderSettings = (i18n, store, rerender) => {
  const panel = createElement("section", { className: "panel" });
  panel.innerHTML = `
    <h2>${i18n.t("settings.title")}</h2>
    <div class="settings-grid">
      <label class="toggle">
        <span>${i18n.t("settings.readAloud")}</span>
        <input type="checkbox" data-setting="readAloud" />
      </label>
      <label class="toggle">
        <span>${i18n.t("settings.dyslexiaFont")}</span>
        <input type="checkbox" data-setting="dyslexiaFont" />
      </label>
      <label class="toggle">
        <span>${i18n.t("settings.highContrast")}</span>
        <input type="checkbox" data-setting="highContrast" />
      </label>
      <label class="toggle">
        <span>${i18n.t("settings.showHints")}</span>
        <input type="checkbox" data-setting="showHints" />
      </label>
      <label class="toggle">
        <span>${i18n.t("settings.language")}</span>
        <select data-setting="language" aria-label="${i18n.t("settings.language")}"></select>
      </label>
    </div>
  `;

  const state = store.getState();
  panel.querySelectorAll("input[data-setting]").forEach((input) => {
    const key = input.dataset.setting;
    input.checked = state.settings[key];
    input.addEventListener("change", () => {
      store.setSettings({ [key]: input.checked });
      rerender();
    });
  });

  const select = panel.querySelector("select[data-setting='language']");
  i18n.getLanguages().forEach((lang) => {
    const option = createElement("option", { text: lang.toUpperCase(), attrs: { value: lang } });
    if (lang === state.language) option.selected = true;
    select.append(option);
  });

  select.addEventListener("change", () => {
    store.setLanguage(select.value);
    i18n.setLanguage(select.value);
    rerender();
  });

  return panel;
};
