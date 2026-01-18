import { createEl } from "../utils/dom.js";
import { t, resolveContent, getLanguage } from "../i18n.js";
import { evaluateDragMatch } from "../utils/validate.js";

export const renderDragMatchSection = (container, activity) => {
  const lang = getLanguage();
  const block = createEl("div", { className: "card" });
  block.appendChild(createEl("h3", { text: resolveContent(activity.title, lang) }));
  block.appendChild(createEl("p", { text: resolveContent(activity.prompt, lang) }));

  const helper = createEl("p", { className: "notice", text: t("ui.clickToPlace") });
  block.appendChild(helper);

  const dragContainer = createEl("div", { className: "drag-container" });
  const itemContainer = createEl("div");
  const targetContainer = createEl("div");

  const placements = {};
  let selectedItem = null;

  const renderTargets = () => {
    targetContainer.innerHTML = "";
    activity.targets.forEach((target) => {
      const targetEl = createEl("div", {
        className: "drag-target",
        attrs: { "data-target": target.id, tabindex: 0, role: "button", "aria-label": resolveContent(target.label, lang) },
        text: resolveContent(target.label, lang),
      });

      const placeItem = () => {
        if (!selectedItem) return;
        placements[selectedItem.id] = target.id;
        targetEl.textContent = `${resolveContent(target.label, lang)}: ${resolveContent(selectedItem.label, lang)}`;
        selectedItem.el.classList.remove("selected");
        selectedItem = null;
      };

      targetEl.addEventListener("click", placeItem);
      targetEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          placeItem();
        }
      });

      targetContainer.appendChild(targetEl);
    });
  };

  activity.items.forEach((item) => {
    const itemEl = createEl("div", {
      className: "drag-item",
      attrs: { draggable: true, "data-item": item.id, tabindex: 0, role: "button" },
      text: resolveContent(item.label, lang),
    });

    itemEl.addEventListener("click", () => {
      if (selectedItem?.id === item.id) {
        itemEl.classList.remove("selected");
        selectedItem = null;
        return;
      }
      itemContainer.querySelectorAll(".drag-item").forEach((el) => el.classList.remove("selected"));
      itemEl.classList.add("selected");
      selectedItem = { id: item.id, label: item.label, el: itemEl };
    });

    itemEl.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", item.id);
    });

    itemContainer.appendChild(itemEl);
  });

  renderTargets();

  targetContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
    const target = event.target.closest(".drag-target");
    if (target) target.classList.add("active");
  });

  targetContainer.addEventListener("dragleave", (event) => {
    const target = event.target.closest(".drag-target");
    if (target) target.classList.remove("active");
  });

  targetContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    const target = event.target.closest(".drag-target");
    if (!target) return;
    const itemId = event.dataTransfer.getData("text/plain");
    const item = activity.items.find((i) => i.id === itemId);
    placements[itemId] = target.dataset.target;
    target.textContent = `${resolveContent(activity.targets.find((t) => t.id === target.dataset.target).label, lang)}: ${resolveContent(item.label, lang)}`;
    target.classList.remove("active");
  });

  dragContainer.appendChild(itemContainer);
  dragContainer.appendChild(targetContainer);
  block.appendChild(dragContainer);

  const feedback = createEl("div", { className: "feedback" });
  const checkBtn = createEl("button", { className: "button secondary", text: t("ui.checkAnswer") });
  checkBtn.addEventListener("click", () => {
    const correct = evaluateDragMatch(placements, activity.expected);
    feedback.textContent = correct ? t("ui.correct") : t("ui.tryAgain");
    feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
  });

  block.appendChild(checkBtn);
  block.appendChild(feedback);
  container.appendChild(block);
};
