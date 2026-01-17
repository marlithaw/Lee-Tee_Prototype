import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";
import { isCompleteMatch } from "../utils/validate.js";

export function renderDragMatch(section, onComplete) {
  const wrapper = createEl("div", { className: "drag-area" });
  const modeToggle = createEl("button", { className: "button button--ghost", text: t("ui.clickToPlace") });
  let clickMode = false;
  let activeItem = null;
  const placements = {};

  onClick(modeToggle, () => {
    clickMode = !clickMode;
    modeToggle.textContent = clickMode ? t("ui.dragToPlace") : t("ui.clickToPlace");
  });

  const itemsRow = createEl("div", { className: "drag-items" });
  section.items.forEach((item) => {
    const chip = createEl("div", {
      className: "drag-item",
      text: t(item.labelKey),
      attrs: { draggable: "true", tabindex: "0" },
    });

    chip.addEventListener("dragstart", (event) => {
      if (clickMode) return;
      event.dataTransfer.setData("text/plain", item.id);
    });

    onClick(chip, () => {
      if (!clickMode) return;
      activeItem = item.id;
      document.querySelectorAll(".drag-item").forEach((el) => el.classList.remove("drag-item--active"));
      chip.classList.add("drag-item--active");
    });

    itemsRow.append(chip);
  });

  const targetsRow = createEl("div", { className: "drag-targets" });
  section.targets.forEach((target) => {
    const targetEl = createEl("div", {
      className: "drag-target",
      attrs: { "data-target": target.id, tabindex: "0", role: "button", "aria-label": t("ui.placeItem") },
    });
    targetEl.append(createEl("strong", { text: t(target.labelKey) }));

    targetEl.addEventListener("dragover", (event) => {
      if (clickMode) return;
      event.preventDefault();
    });

    targetEl.addEventListener("drop", (event) => {
      if (clickMode) return;
      event.preventDefault();
      const itemId = event.dataTransfer.getData("text/plain");
      placeItem(itemId, target.id, targetEl);
    });

    onClick(targetEl, () => {
      if (!clickMode || !activeItem) return;
      placeItem(activeItem, target.id, targetEl);
      activeItem = null;
      document.querySelectorAll(".drag-item").forEach((el) => el.classList.remove("drag-item--active"));
    });

    targetsRow.append(targetEl);
  });

  const feedback = createEl("div");
  const checkButton = createEl("button", { className: "button", text: t("ui.checkAnswers") });
  onClick(checkButton, () => {
    const correct = isCompleteMatch(section.correctMatches, placements);
    feedback.className = `feedback ${correct ? "feedback--correct" : "feedback--incorrect"}`;
    feedback.textContent = correct ? t("ui.correct") : t("ui.tryAgain");
    if (correct) onComplete();
  });

  wrapper.append(modeToggle, itemsRow, targetsRow, checkButton, feedback);
  return wrapper;

  function placeItem(itemId, targetId, targetEl) {
    if (!itemId) return;
    placements[itemId] = targetId;
    targetEl.classList.add("drag-target--filled");
    targetEl.setAttribute("data-filled", itemId);
    const label = section.items.find((item) => item.id === itemId);
    const existing = targetEl.querySelector(".drag-target__item");
    if (existing) existing.remove();
    targetEl.append(createEl("div", { className: "drag-target__item", text: t(label.labelKey) }));
  }
}
