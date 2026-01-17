import { createElement } from "../utils/dom.js";

export const renderNav = (episode, i18n) => {
  const panel = createElement("section", { className: "panel" });
  panel.innerHTML = `
    <h2>${i18n.t("nav.title")}</h2>
    <div class="nav-tabs" role="navigation"></div>
  `;

  const navList = panel.querySelector(".nav-tabs");
  episode.nav.forEach((item) => {
    const button = createElement("button", {
      attrs: {
        type: "button",
        "aria-label": i18n.t(item.labelKey),
        "data-target": item.targetId,
      },
      html: `<span>${item.icon}</span><span>${i18n.t(item.labelKey)}</span>`,
    });
    button.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("nav-jump", { detail: { id: item.targetId } })
      );
    });
    navList.append(button);
  });

  return panel;
};
