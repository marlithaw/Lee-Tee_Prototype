import { createEl, onClick } from "../utils/dom.js";
import { t } from "../i18n.js";

export function renderDashboard({ episode, progress, onContinue, onReset }) {
  const wrapper = createEl("section", { className: "card dashboard" });
  const title = createEl("h2", { text: t("ui.learningDashboard") });
  const subtitle = createEl("p", { text: t("ui.dashboardSubtitle") });
  wrapper.append(title, subtitle);

  const grid = createEl("div", { className: "dashboard__grid" });

  const bookCard = createProgressCard(t("ui.bookProgress"), progress.bookPercent);
  const episodeCard = createProgressCard(t("ui.episodeProgress"), progress.episodePercent);
  const sectionCard = createEl("div", { className: "card card--tight" });
  const sectionTitle = createEl("h4", { text: t("ui.sectionProgress") });
  const sectionMeta = createEl("p", { text: `${progress.completedSections}/${progress.totalSections} ${t("ui.sections")}` });
  sectionCard.append(sectionTitle, sectionMeta);

  const badgesCard = createEl("div", { className: "card card--tight" });
  const badgesTitle = createEl("h4", { text: t("ui.badges") });
  const badgesList = createEl("div", { className: "badge-list" });
  if (progress.badges.length === 0) {
    badgesList.append(createEl("span", { className: "badge", text: t("ui.noBadges") }));
  } else {
    progress.badges.forEach((badge) => badgesList.append(createEl("span", { className: "badge", text: badge })));
  }
  badgesCard.append(badgesTitle, badgesList);

  grid.append(bookCard, episodeCard, sectionCard, badgesCard);
  wrapper.append(grid);

  const actions = createEl("div", { className: "section__actions" });
  const continueButton = createEl("button", { className: "button", text: t("ui.continue") });
  onClick(continueButton, onContinue);
  const resetButton = createEl("button", { className: "button button--danger", text: t("ui.resetProgress") });
  onClick(resetButton, onReset);
  actions.append(continueButton, resetButton);
  wrapper.append(actions);

  return wrapper;
}

function createProgressCard(label, percent) {
  const card = createEl("div", { className: "card card--tight" });
  const title = createEl("h4", { text: label });
  const bar = createEl("div", { className: "progress-bar" });
  const fill = createEl("div", { className: "progress-bar__fill" });
  fill.style.width = `${percent}%`;
  const meta = createEl("p", { text: `${percent}%` });
  bar.append(fill);
  card.append(title, bar, meta);
  return card;
}
