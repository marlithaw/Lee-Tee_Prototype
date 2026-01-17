import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderDragMatch = ({ promptKey, items, targets, onComplete }) => {
  const wrapper = el("div");
  wrapper.appendChild(el("p", { text: t(promptKey) }));

  const modeToggle = el("button", { className: "button button--ghost", text: t("practice.clickMode") });
  const board = el("div", { className: "match-board" });
  const itemColumn = el("div", { className: "list" });
  const targetColumn = el("div", { className: "list" });
  const feedback = el("div", { className: "feedback", attrs: { role: "status" } });

  let clickMode = false;
  let selectedItemId = null;
  const placements = new Map();

  const updateCompletion = () => {
    if (placements.size !== items.length) return;
    const isCorrect = items.every((item) => placements.get(item.id) === item.targetId);
    feedback.textContent = isCorrect ? t("check.correct") : t("check.incorrect");
    feedback.className = `feedback ${isCorrect ? "feedback--success" : "feedback--error"}`;
    if (isCorrect && onComplete) onComplete();
  };

  modeToggle.addEventListener("click", () => {
    clickMode = !clickMode;
    modeToggle.textContent = clickMode ? t("practice.dragMode") : t("practice.clickMode");
    itemColumn.querySelectorAll(".match-item").forEach((item) => {
      item.setAttribute("draggable", String(!clickMode));
    });
  });

  items.forEach((item) => {
    const itemEl = el("div", {
      className: "match-item",
      text: t(item.labelKey),
      attrs: { draggable: "true", tabindex: "0", "data-id": item.id, role: "button" },
    });
    itemEl.addEventListener("dragstart", (event) => {
      if (clickMode) return;
      event.dataTransfer.setData("text/plain", item.id);
    });
    itemEl.addEventListener("click", () => {
      if (!clickMode) return;
      selectedItemId = item.id;
      itemColumn.querySelectorAll(".match-item").forEach((node) => node.classList.remove("active"));
      itemEl.classList.add("active");
    });
    itemColumn.appendChild(itemEl);
  });

  targets.forEach((target) => {
    const targetEl = el("div", {
      className: "match-target",
      text: t(target.labelKey),
      attrs: { "data-id": target.id, tabindex: "0", role: "button" },
    });
    targetEl.addEventListener("dragover", (event) => {
      if (clickMode) return;
      event.preventDefault();
      targetEl.classList.add("active");
    });
    targetEl.addEventListener("dragleave", () => targetEl.classList.remove("active"));
    targetEl.addEventListener("drop", (event) => {
      if (clickMode) return;
      event.preventDefault();
      const itemId = event.dataTransfer.getData("text/plain");
      placements.set(itemId, target.id);
      targetEl.classList.add("filled");
      targetEl.textContent = `${t(target.labelKey)}: ${t(items.find((item) => item.id === itemId).labelKey)}`;
      updateCompletion();
    });
    targetEl.addEventListener("click", () => {
      if (!clickMode || !selectedItemId) return;
      placements.set(selectedItemId, target.id);
      targetEl.classList.add("filled");
      targetEl.textContent = `${t(target.labelKey)}: ${t(items.find((item) => item.id === selectedItemId).labelKey)}`;
      selectedItemId = null;
      itemColumn.querySelectorAll(".match-item").forEach((node) => node.classList.remove("active"));
      updateCompletion();
    });
    targetColumn.appendChild(targetEl);
  });

  board.append(itemColumn, targetColumn);
  wrapper.append(modeToggle, board, feedback);
  return wrapper;
};
