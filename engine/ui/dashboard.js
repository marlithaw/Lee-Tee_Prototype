import { createEl, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderDashboard = ({ container, episode, progress, onContinue }) => {
  clear(container);
  const completed = progress.completedSections?.length || 0;
  const total = episode.sections.length;
  const points = progress.points || 0;
  const badges = progress.badges || [];

  const title = createEl("h2", { text: t("dashboard.title") });
  const bookProgress = createEl("p", {
    text: t("dashboard.bookProgress").replace("{percent}", `${episode.bookProgress}%`),
  });
  const episodeProgress = createEl("p", {
    text: t("dashboard.episodeProgress").replace("{completed}", completed).replace("{total}", total),
  });
  const progressBar = createEl("div", { className: "progress-bar" });
  const progressFill = createEl("span");
  progressFill.style.width = `${Math.round((completed / total) * 100)}%`;
  progressBar.append(progressFill);

  const badgeTitle = createEl("h3", { text: t("dashboard.badges") });
  const badgeList = createEl("div", { className: "badge-list" });
  if (badges.length) {
    badges.forEach((badge) => badgeList.append(createEl("span", { className: "badge", text: badge })));
  } else {
    badgeList.append(createEl("span", { text: t("dashboard.noBadges") }));
  }

  const pointsEl = createEl("p", { text: t("dashboard.points").replace("{points}", points) });
  const continueBtn = createEl("button", {
    className: "primary",
    text: t("dashboard.continue"),
    attrs: { type: "button" },
  });
  continueBtn.addEventListener("click", onContinue);

  container.append(title, bookProgress, episodeProgress, progressBar, pointsEl, badgeTitle, badgeList, continueBtn);
};
