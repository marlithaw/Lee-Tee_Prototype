import { createEl } from '../utils/dom.js';
import { getProgress } from '../utils/validate.js';

export function renderDashboard(root, { episode, state, t, onContinue, onResume }) {
  root.innerHTML = '';
  const heading = createEl('h2', { text: t('ui.learningDashboard') });
  const grid = createEl('div', { className: 'dashboard-grid' });

  const sectionTotal = episode.sections.length;
  const completedCount = state.progress.completedSections.length;
  const episodeProgress = getProgress(completedCount, sectionTotal);

  const episodeCard = createEl('div', { className: 'dashboard-card' });
  episodeCard.innerHTML = `
    <h3>${t('ui.episodeProgress')}</h3>
    <p>${completedCount}/${sectionTotal} ${t('ui.sectionsComplete')}</p>
    <div class="progress-bar"><span style="width:${episodeProgress}%"></span></div>
  `;

  const bookCard = createEl('div', { className: 'dashboard-card' });
  const bookProgress = getProgress(episode.bookProgress.completedEpisodes, episode.bookProgress.totalEpisodes);
  bookCard.innerHTML = `
    <h3>${t('ui.bookProgress')}</h3>
    <p>${episode.bookProgress.completedEpisodes}/${episode.bookProgress.totalEpisodes} ${t('ui.episodesComplete')}</p>
    <div class="progress-bar"><span style="width:${bookProgress}%"></span></div>
  `;

  const badgeCard = createEl('div', { className: 'dashboard-card' });
  badgeCard.innerHTML = `
    <h3>${t('ui.badges')}</h3>
    <p>${state.progress.badges.length} ${t('ui.badgesEarned')}</p>
    <ul>${state.progress.badges.map((badge) => `<li>${badge}</li>`).join('') || `<li>${t('ui.noBadges')}</li>`}</ul>
  `;

  const actionCard = createEl('div', { className: 'dashboard-card' });
  const button = createEl('button', { className: 'btn secondary', text: state.progress.stopped ? t('ui.resume') : t('ui.continue') });
  button.addEventListener('click', () => {
    if (state.progress.stopped) {
      onResume();
      return;
    }
    onContinue();
  });
  const points = createEl('p', { text: `${t('ui.points')}: ${state.progress.points}` });
  actionCard.append(points, button);

  grid.append(episodeCard, bookCard, badgeCard, actionCard);
  root.append(heading, grid);
}
