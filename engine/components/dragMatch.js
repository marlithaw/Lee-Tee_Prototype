import { createEl, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderDragMatch = ({ activity, onCompleted }) => {
  const wrapper = createEl("div");
  const title = createEl("p", { text: t(activity.promptKey) });
  const modeToggle = createEl("button", { className: "ghost", text: t("practice.clickMode"), attrs: { type: "button" } });
  const status = createEl("div", { className: "check-feedback", attrs: { role: "status" } });
  const area = createEl("div", { className: "drag-area" });

  let clickMode = false;
  let selectedItemId = null;

  const renderArea = () => {
    clear(area);
    const itemsCol = createEl("div");
    const targetsCol = createEl("div");
    const itemsTitle = createEl("h4", { text: t("practice.itemsTitle") });
    const targetsTitle = createEl("h4", { text: t("practice.targetsTitle") });
    itemsCol.append(itemsTitle);
    targetsCol.append(targetsTitle);

    activity.items.forEach((item) => {
      const itemEl = createEl("div", {
        className: "drag-item",
        text: t(item.labelKey),
        attrs: {
          draggable: !clickMode,
          "data-id": item.id,
          role: "button",
          tabindex: "0",
          "aria-grabbed": selectedItemId === item.id ? "true" : "false",
        },
      });

      itemEl.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", item.id);
      });

      itemEl.addEventListener("click", () => {
        if (!clickMode) return;
        selectedItemId = item.id;
        renderArea();
      });

      itemsCol.append(itemEl);
    });

    activity.targets.forEach((target) => {
      const targetEl = createEl("div", {
        className: "drag-target",
        text: t(target.labelKey),
        attrs: {
          "data-id": target.id,
          role: "button",
          tabindex: "0",
        },
      });

      targetEl.addEventListener("dragover", (event) => {
        event.preventDefault();
        targetEl.classList.add("active");
      });

      targetEl.addEventListener("dragleave", () => targetEl.classList.remove("active"));

      targetEl.addEventListener("drop", (event) => {
        event.preventDefault();
        targetEl.classList.remove("active");
        const itemId = event.dataTransfer.getData("text/plain");
        checkMatch(itemId, target.id);
      });

      targetEl.addEventListener("click", () => {
        if (!clickMode || !selectedItemId) return;
        checkMatch(selectedItemId, target.id);
        selectedItemId = null;
        renderArea();
      });

      targetsCol.append(targetEl);
    });

    area.append(itemsCol, targetsCol);
  };

  const checkMatch = (itemId, targetId) => {
    const item = activity.items.find((entry) => entry.id === itemId);
    const correct = item?.targetId === targetId;
    status.textContent = correct ? t("practice.correct") : t("practice.incorrect");
    status.classList.toggle("success", correct);
    status.classList.toggle("error", !correct);
    if (correct) onCompleted(itemId);
  };

  modeToggle.addEventListener("click", () => {
    clickMode = !clickMode;
    modeToggle.textContent = clickMode ? t("practice.dragMode") : t("practice.clickMode");
    selectedItemId = null;
    renderArea();
  });

  renderArea();
  wrapper.append(title, modeToggle, area, status);
  return wrapper;
};
