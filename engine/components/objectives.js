import { createEl, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderObjectivesPanel = ({ container, objectives }) => {
  clear(container);
  const title = createEl("h2", { text: t("objectives.title") });
  const strategyTitle = createEl("h3", { text: t("objectives.siop") });
  const strategyList = createEl("ul");
  objectives.siopStrategies.forEach((key) => {
    strategyList.append(createEl("li", { text: t(key) }));
  });

  const contentTitle = createEl("h3", { text: t("objectives.content") });
  const contentList = createEl("ul");
  objectives.contentObjectives.forEach((key) => {
    contentList.append(createEl("li", { text: t(key) }));
  });

  const languageTitle = createEl("h3", { text: t("objectives.language") });
  const languageList = createEl("ul");
  objectives.languageObjectives.forEach((key) => {
    languageList.append(createEl("li", { text: t(key) }));
  });

  container.append(title, strategyTitle, strategyList, contentTitle, contentList, languageTitle, languageList);
};
