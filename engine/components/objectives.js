import { clear, el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderObjectives = ({ container, objectives }) => {
  clear(container);
  container.appendChild(el("h2", { text: t("objectives.title") }));
  const language = el("div", { className: "card" });
  language.appendChild(el("h3", { text: t("objectives.language") }));
  language.appendChild(el("p", { className: "muted", text: t(objectives.languageKey) }));

  const content = el("div", { className: "card" });
  content.appendChild(el("h3", { text: t("objectives.content") }));
  content.appendChild(el("p", { className: "muted", text: t(objectives.contentKey) }));

  container.append(language, content);
};

export const renderStrategies = ({ container, strategies }) => {
  clear(container);
  container.appendChild(el("h2", { text: t("strategies.title") }));
  const list = el("ul", { className: "section__checklist" });
  strategies.forEach((strategyKey) => {
    list.appendChild(el("li", { text: t(strategyKey) }));
  });
  container.appendChild(list);
};
