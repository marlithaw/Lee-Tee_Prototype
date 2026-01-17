import { createElement, qs } from "../utils/dom.js";

const updateBadges = (episode, store) => {
  const { completedSections, badges: earned } = store.getState().progress;
  const next = episode.badges
    .filter((badge) => completedSections.length >= badge.threshold)
    .map((badge) => badge.id);
  const allBadges = Array.from(new Set([...earned, ...next]));
  if (allBadges.length !== earned.length) {
    store.setBadges(allBadges);
  }
};

export const renderDashboard = (
  episode,
  i18n,
  store,
  toast,
  updateOnly = false
) => {
  updateBadges(episode, store);
  const state = store.getState();
  const totalSections = episode.sections.length;
  const completed = state.progress.completedSections.length;
  const progressPercent = Math.round((completed / totalSections) * 100);

  const existing = qs("#dashboard-panel");
  if (updateOnly && existing) {
    existing.querySelector("[data-progress-count]").textContent = `${completed}/${totalSections}`;
    existing.querySelector("[data-progress-bar]").style.width = `${progressPercent}%`;
    existing.querySelector("[data-points]").textContent = state.progress.points;
    const badges = existing.querySelector("[data-badges]");
    badges.innerHTML = episode.badges
      .filter((badge) => state.progress.badges.includes(badge.id))
      .map((badge) => `<span class="badge">${i18n.t(badge.labelKey)}</span>`)
      .join("") || `<span>${i18n.t("dashboard.noBadges")}</span>`;
    const stopButton = existing.querySelector("[data-stop]");
    stopButton.textContent = state.progress.stopPosition
      ? i18n.t("dashboard.resume")
      : i18n.t("dashboard.stop");
    return existing;
  }

  const panel = createElement("section", { className: "panel dashboard" });
  panel.id = "dashboard-panel";
  panel.innerHTML = `
    <h2>${i18n.t("dashboard.title")}</h2>
    <div class="progress-summary">
      <div>${i18n.t("dashboard.bookProgress")}</div>
      <div><strong data-progress-count>${completed}/${totalSections}</strong> ${i18n.t("dashboard.sections")}</div>
      <div class="progress-bar" aria-hidden="true"><span data-progress-bar style="width: ${progressPercent}%"></span></div>
      <div>${i18n.t("dashboard.points")}: <strong data-points>${state.progress.points}</strong></div>
    </div>
    <div>
      <h3>${i18n.t("dashboard.badges")}</h3>
      <div class="badges" data-badges>
        ${episode.badges
          .filter((badge) => state.progress.badges.includes(badge.id))
          .map((badge) => `<span class="badge">${i18n.t(badge.labelKey)}</span>`)
          .join("") || `<span>${i18n.t("dashboard.noBadges")}</span>`}
      </div>
    </div>
    <div class="button-row">
      <button class="btn" data-continue>${i18n.t("dashboard.continue")}</button>
      <button class="btn secondary" data-stop>${
        state.progress.stopPosition ? i18n.t("dashboard.resume") : i18n.t("dashboard.stop")
      }</button>
      <button class="btn ghost" data-reset>${i18n.t("dashboard.reset")}</button>
    </div>
  `;

  panel.querySelector("[data-continue]").addEventListener("click", () => {
    const currentState = store.getState();
    const nextSection = episode.sections.find(
      (section) => !currentState.progress.completedSections.includes(section.id)
    );
    if (nextSection) {
      document.dispatchEvent(
        new CustomEvent("nav-jump", { detail: { id: nextSection.id } })
      );
    } else {
      toast.show(i18n.t("dashboard.allDone"));
    }
  });

  panel.querySelector("[data-reset]").addEventListener("click", () => {
    store.resetProgress();
    toast.show(i18n.t("dashboard.resetDone"));
    document.dispatchEvent(new CustomEvent("progress-reset"));
  });

  panel.querySelector("[data-stop]").addEventListener("click", (event) => {
    const stopPosition = store.getState().progress.stopPosition;
    if (stopPosition !== null) {
      window.scrollTo({ top: stopPosition, behavior: "smooth" });
      store.setStopPosition(null);
    } else {
      store.setStopPosition(window.scrollY);
      toast.show(i18n.t("dashboard.stopSaved"));
    }
    event.currentTarget.textContent = store.getState().progress.stopPosition
      ? i18n.t("dashboard.resume")
      : i18n.t("dashboard.stop");
  });

  return panel;
};
