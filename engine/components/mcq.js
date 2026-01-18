import { createEl } from "../utils/dom.js";
import { t, resolveContent, getLanguage } from "../i18n.js";
import { evaluateMcq } from "../utils/validate.js";

export const renderMcqSection = (container, section) => {
  const wrapper = createEl("div", { className: "check-list" });
  const lang = getLanguage();

  section.questions.forEach((question, index) => {
    const block = createEl("div", { className: "card" });
    block.appendChild(createEl("p", { text: `${index + 1}. ${resolveContent(question.prompt, lang)}` }));
    const group = createEl("div");

    question.options.forEach((option) => {
      const label = createEl("label", { className: "toggle" });
      const input = createEl("input", {
        attrs: { type: "radio", name: `mcq-${section.id}-${index}`, value: option.id },
      });
      label.appendChild(input);
      label.appendChild(createEl("span", { text: resolveContent(option.label, lang) }));
      group.appendChild(label);
    });

    const feedback = createEl("div", { className: "feedback" });
    const checkBtn = createEl("button", { className: "button secondary", text: t("ui.checkAnswer") });
    checkBtn.addEventListener("click", () => {
      const selected = group.querySelector("input:checked");
      if (!selected) return;
      const correct = evaluateMcq(selected.value, question.correctId);
      feedback.textContent = correct ? t("ui.correct") : t("ui.tryAgain");
      feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
    });

    block.appendChild(group);
    block.appendChild(checkBtn);
    block.appendChild(feedback);
    wrapper.appendChild(block);
  });

  container.appendChild(wrapper);
};
