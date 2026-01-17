import { createElement } from "../utils/dom.js";

export const renderObjectives = (section, i18n) => {
  const container = createElement("div");
  const language = createElement("p", {
    html: `<strong>${i18n.t("objectives.language")}</strong> ${i18n.t(
      section.languageKey
    )}`,
  });
  const content = createElement("p", {
    html: `<strong>${i18n.t("objectives.content")}</strong> ${i18n.t(
      section.contentKey
    )}`,
  });
  const strategyList = createElement("ul");
  section.strategiesKeys.forEach((key) => {
    strategyList.append(createElement("li", { text: i18n.t(key) }));
  });
  const strategyWrapper = createElement("div", {
    html: `<strong>${i18n.t("objectives.strategies")}</strong>`,
  });
  strategyWrapper.append(strategyList);
  container.append(language, content, strategyWrapper);
  return container;
};
