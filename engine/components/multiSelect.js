import { createEl } from "../utils/dom.js";
import { t, resolveContent, getLanguage } from "../i18n.js";
import { evaluateMultiSelect } from "../utils/validate.js";

export const renderMultiSelectSection = (container, activity) => {
  const lang = getLanguage();
  const block = createEl("div", { className: "card" });
  block.appendChild(createEl("h3", { text: resolveContent(activity.title, lang) }));
  block.appendChild(createEl("p", { text: resolveContent(activity.prompt, lang) }));

  const options = createEl("div", { className: "check-list" });
  activity.options.forEach((option) => {
    const label = createEl("label", { className: "toggle" });
    const input = createEl("input", { attrs: { type: "checkbox", value: option.id } });
    label.appendChild(input);
    label.appendChild(createEl("span", { text: resolveContent(option.label, lang) }));
    options.appendChild(label);
  });

  const feedback = createEl("div", { className: "feedback" });
  const checkBtn = createEl("button", { className: "button secondary", text: t("ui.checkAnswer") });
  checkBtn.addEventListener("click", () => {
    const selected = Array.from(options.querySelectorAll("input:checked")).map((el) => el.value);
    const correct = evaluateMultiSelect(selected, activity.correctIds);
    feedback.textContent = correct ? t("ui.correct") : t("ui.tryAgain");
    feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
  });

  block.appendChild(options);
  block.appendChild(checkBtn);
  block.appendChild(feedback);
  container.appendChild(block);
};
