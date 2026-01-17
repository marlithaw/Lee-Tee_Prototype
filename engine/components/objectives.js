import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export function renderObjectives(objectives) {
  const wrapper = createEl("section", { className: "card" });
  const title = createEl("h3", { text: t("ui.objectives") });
  wrapper.append(title);

  const list = createEl("div", { className: "dashboard__grid" });
  const languageCard = createEl("div", { className: "card card--tight" });
  const languageTitle = createEl("h4", { text: t("ui.languageObjectives") });
  const languageList = createEl("ul");
  objectives.language.forEach((item) => {
    const li = createEl("li", { text: t(item) });
    languageList.append(li);
  });
  languageCard.append(languageTitle, languageList);

  const contentCard = createEl("div", { className: "card card--tight" });
  const contentTitle = createEl("h4", { text: t("ui.contentObjectives") });
  const contentList = createEl("ul");
  objectives.content.forEach((item) => {
    const li = createEl("li", { text: t(item) });
    contentList.append(li);
  });
  contentCard.append(contentTitle, contentList);

  list.append(languageCard, contentCard);
  wrapper.append(list);

  if (objectives.strategies?.length) {
    const strategies = createEl("div", { className: "card card--tight" });
    const strategiesTitle = createEl("h4", { text: t("ui.siopStrategies") });
    const strategyList = createEl("ul");
    objectives.strategies.forEach((item) => {
      strategyList.append(createEl("li", { text: t(item) }));
    });
    strategies.append(strategiesTitle, strategyList);
    wrapper.append(strategies);
  }

  return wrapper;
}
