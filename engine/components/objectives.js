import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderObjectives = (section) => {
  const wrapper = createEl("div");

  const siop = createEl("div", { className: "card" });
  siop.appendChild(createEl("h3", { text: t("ui.siopStrategies") }));
  const list = createEl("ul");
  section.siopStrategies.forEach((strategy) => {
    const item = createEl("li", { text: t(strategy) });
    list.appendChild(item);
  });
  siop.appendChild(list);

  const objectives = createEl("div", { className: "card" });
  objectives.appendChild(createEl("h3", { text: t("ui.objectives") }));
  const langList = createEl("div");
  langList.appendChild(createEl("h4", { text: t("ui.languageObjectives") }));
  section.objectives.language.forEach((obj) => {
    langList.appendChild(createEl("p", { text: t(obj) }));
  });
  const contentList = createEl("div");
  contentList.appendChild(createEl("h4", { text: t("ui.contentObjectives") }));
  section.objectives.content.forEach((obj) => {
    contentList.appendChild(createEl("p", { text: t(obj) }));
  });

  objectives.appendChild(langList);
  objectives.appendChild(contentList);

  wrapper.appendChild(siop);
  wrapper.appendChild(objectives);
  return wrapper;
};
