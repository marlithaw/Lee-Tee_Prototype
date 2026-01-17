import { createElement } from "../utils/dom.js";

export const renderDragMatch = (section, i18n, onComplete) => {
  const container = createElement("div");
  const controls = createElement("div", { className: "drag-controls" });
  const modeToggle = createElement("button", {
    className: "btn ghost",
    text: i18n.t("dragMatch.clickMode"),
    attrs: { type: "button" },
  });
  const modeLabel = createElement("span", { text: i18n.t("dragMatch.dragMode") });

  controls.append(modeLabel, modeToggle);

  const area = createElement("div", { className: "drag-area" });
  const itemsColumn = createElement("div");
  const targetsColumn = createElement("div");
  const itemsTitle = createElement("h4", { text: i18n.t("dragMatch.items") });
  const targetsTitle = createElement("h4", { text: i18n.t("dragMatch.targets") });
  itemsColumn.append(itemsTitle);
  targetsColumn.append(targetsTitle);

  const placements = {};
  let clickMode = false;
  let selectedItem = null;

  const checkCompletion = () => {
    const allPlaced = section.pairs.every(
      (pair) => placements[pair.targetId] === pair.itemId
    );
    if (allPlaced) {
      onComplete();
    }
  };

  const setFilled = (targetEl, itemLabel) => {
    targetEl.classList.add("filled");
    targetEl.querySelector(".drop-label").textContent = itemLabel;
  };

  const clearFilled = (targetEl) => {
    targetEl.classList.remove("filled");
    targetEl.querySelector(".drop-label").textContent = i18n.t("dragMatch.dropHere");
  };

  section.items.forEach((item) => {
    const itemEl = createElement("button", {
      className: "draggable-item",
      text: i18n.t(item.labelKey),
      attrs: {
        type: "button",
        draggable: "true",
        "data-item-id": item.id,
        "aria-pressed": "false",
      },
    });

    itemEl.addEventListener("dragstart", (event) => {
      if (clickMode) return;
      event.dataTransfer.setData("text/plain", item.id);
    });

    itemEl.addEventListener("click", () => {
      if (!clickMode) return;
      itemsColumn.querySelectorAll(".draggable-item").forEach((el) => {
        el.classList.remove("selected");
        el.setAttribute("aria-pressed", "false");
      });
      itemEl.classList.add("selected");
      itemEl.setAttribute("aria-pressed", "true");
      selectedItem = item;
    });

    itemsColumn.append(itemEl);
  });

  section.targets.forEach((target) => {
    const targetEl = createElement("div", {
      className: "drop-target",
      attrs: {
        "data-target-id": target.id,
        role: "button",
        tabindex: "0",
        "aria-label": i18n.t(target.labelKey),
      },
      html: `<strong>${i18n.t(target.labelKey)}</strong><div class="drop-label">${i18n.t(
        "dragMatch.dropHere"
      )}</div>`,
    });

    targetEl.addEventListener("dragover", (event) => {
      if (clickMode) return;
      event.preventDefault();
    });

    targetEl.addEventListener("drop", (event) => {
      if (clickMode) return;
      event.preventDefault();
      const itemId = event.dataTransfer.getData("text/plain");
      const item = section.items.find((entry) => entry.id === itemId);
      if (!item) return;
      placements[target.id] = itemId;
      setFilled(targetEl, i18n.t(item.labelKey));
      checkCompletion();
    });

    targetEl.addEventListener("click", () => {
      if (!clickMode || !selectedItem) return;
      placements[target.id] = selectedItem.id;
      setFilled(targetEl, i18n.t(selectedItem.labelKey));
      selectedItem = null;
      itemsColumn.querySelectorAll(".draggable-item").forEach((el) => {
        el.classList.remove("selected");
        el.setAttribute("aria-pressed", "false");
      });
      checkCompletion();
    });

    targetEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      targetEl.click();
    });

    targetsColumn.append(targetEl);
  });

  modeToggle.addEventListener("click", () => {
    clickMode = !clickMode;
    modeToggle.textContent = clickMode
      ? i18n.t("dragMatch.dragMode")
      : i18n.t("dragMatch.clickMode");
    modeLabel.textContent = clickMode
      ? i18n.t("dragMatch.clickInstructions")
      : i18n.t("dragMatch.dragInstructions");
    if (!clickMode) {
      selectedItem = null;
      itemsColumn.querySelectorAll(".draggable-item").forEach((el) => {
        el.classList.remove("selected");
        el.setAttribute("aria-pressed", "false");
      });
    }
  });

  const resetButton = createElement("button", {
    className: "btn ghost",
    text: i18n.t("dragMatch.reset"),
    attrs: { type: "button" },
  });

  resetButton.addEventListener("click", () => {
    section.targets.forEach((target) => {
      const targetEl = targetsColumn.querySelector(
        `[data-target-id="${target.id}"]`
      );
      clearFilled(targetEl);
    });
    Object.keys(placements).forEach((key) => delete placements[key]);
  });

  controls.append(resetButton);
  area.append(itemsColumn, targetsColumn);
  container.append(controls, area);

  return container;
};
