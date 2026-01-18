import { createEl, clearEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { getState, resetProgress, togglePause } from "../store.js";
import { showToast } from "./toast.js";

export const renderDashboard = (container, episode, onContinue) => {
  clearEl(container);
  const state = getState();
  const progressCount = state.progress.completedSections.length;
  const totalSections = episode.sections.length;
  const progressPercent = Math.round((progressCount / totalSections) * 100);

  const header = createEl("div", { className: "card" });
  const title = createEl("h3", { text: t("ui.learningDashboard") });
  header.appendChild(title);
  header.appendChild(createEl("p", { text: t("ui.bookProgress") }));
  header.appendChild(createEl("p", { text: `${episode.dashboard.bookProgress.current}/${episode.dashboard.bookProgress.total}` }));

  header.appendChild(createEl("p", { text: t("ui.episodeProgress") }));
  const bar = createEl("div", { className: "progress-bar" });
  const fill = createEl("span");
  fill.style.width = `${progressPercent}%`;
  bar.appendChild(fill);
  header.appendChild(bar);
  header.appendChild(createEl("p", { text: `${progressCount}/${totalSections} ${t("ui.sectionsComplete")}` }));

  const badges = createEl("div", { className: "card" });
  badges.appendChild(createEl("h3", { text: t("ui.badges") }));
  const badgesWrap = createEl("div", { className: "badges" });
  episode.dashboard.badges.forEach((badge) => {
    badgesWrap.appendChild(createEl("span", { className: "badge", text: t(badge) }));
  });
  badges.appendChild(badgesWrap);

  const actions = createEl("div", { className: "card" });
  actions.appendChild(createEl("h3", { text: t("ui.controls") }));

  const continueBtn = createEl("button", { className: "button", text: t("ui.continue") });
  continueBtn.addEventListener("click", onContinue);

  const resetBtn = createEl("button", { className: "button secondary", text: t("ui.resetProgress") });
  resetBtn.addEventListener("click", () => {
    resetProgress();
    showToast(t("ui.progressReset"));
    onContinue();
  });

  const pauseBtn = createEl("button", {
    className: "button ghost",
    text: state.progress.paused ? t("ui.resume") : t("ui.stop"),
  });
  pauseBtn.addEventListener("click", () => {
    togglePause();
    const paused = getState().progress.paused;
    pauseBtn.textContent = paused ? t("ui.resume") : t("ui.stop");
    showToast(paused ? t("ui.paused") : t("ui.resumed"));
    onContinue();
  });

  actions.appendChild(continueBtn);
  actions.appendChild(resetBtn);
  actions.appendChild(pauseBtn);

  const progressCard = createEl("div", { className: "card" });
  progressCard.appendChild(createEl("h3", { text: t("ui.sectionProgress") }));
  progressCard.appendChild(
    createEl("p", { text: `${t("ui.sectionProgressCount")} ${progressCount}/${totalSections}` })
  );

  container.appendChild(header);
  container.appendChild(badges);
  container.appendChild(actions);
  container.appendChild(progressCard);
};
