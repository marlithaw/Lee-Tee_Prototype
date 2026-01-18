import { el, clear } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderDashboard = ({ container, episode, progress, sectionCount }) => {
  clear(container);
  const title = el("h2", { text: t("dashboard.title") });
  const book = el("div", { className: "card" });
  const bookTitle = el("h3", { text: t("dashboard.bookProgress") });
  const bookProgress = el("p", { className: "muted", text: t("dashboard.bookProgressDetail") });
  book.append(bookTitle, bookProgress);

  const episodeCard = el("div", { className: "card" });
  const episodeTitle = el("h3", { text: t("dashboard.episodeProgress") });
  const completedCount = progress.completedSections.length;
  const progressLabel = el("p", { className: "muted", text: t("dashboard.sectionCount").replace("{completed}", completedCount).replace("{total}", sectionCount) });
  const progressBar = el("div", { className: "progress" });
  const bar = el("div", { className: "progress__bar" });
  bar.style.width = `${sectionCount ? (completedCount / sectionCount) * 100 : 0}%`;
  progressBar.appendChild(bar);
  episodeCard.append(episodeTitle, progressLabel, progressBar);

  const badgeCard = el("div", { className: "card" });
  badgeCard.appendChild(el("h3", { text: t("dashboard.badges") }));
  const badges = el("div", { className: "badges" });
  const badgeMap = new Map((episode.badges || []).map((badge) => [badge.id, badge]));
  if (!progress.badges.length) {
    badges.appendChild(el("span", { className: "badge", text: t("dashboard.noBadges") }));
  } else {
    progress.badges.forEach((badgeId) => {
      const badge = badgeMap.get(badgeId);
      if (!badge) return;
      const badgeNode = el("div", { className: "badge-card" });
      badgeNode.appendChild(el("span", { className: "badge", text: t(badge.nameKey) }));
      badgeNode.appendChild(el("p", { className: "muted", text: t(badge.descriptionKey) }));
      badges.appendChild(badgeNode);
    });
  }
  badgeCard.appendChild(badges);

  const continueButton = el("button", { className: "button", text: t("dashboard.continue") });
  continueButton.addEventListener("click", () => {
    const firstIncomplete = episode.sections.find((section) => !progress.completedSections.includes(section.id));
    if (firstIncomplete) {
      document.getElementById(firstIncomplete.id)?.scrollIntoView({ behavior: "smooth" });
    }
  });

  container.append(title, book, episodeCard, badgeCard, continueButton);
};
