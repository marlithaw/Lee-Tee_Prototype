import { createToast } from './toast.js';

export const renderDashboard = ({ container, episode, i18n, store }) => {
  const progress = store.getProgress(episode.id);
  const completed = Object.values(progress).filter(Boolean).length;
  const total = episode.sections.length;
  const percent = Math.round((completed / total) * 100);
  const paused = store.get('progress').paused;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h2>${i18n.t('ui.dashboardTitle')}</h2>
        <p>${i18n.t(episode.meta.descriptionKey)}</p>
      </div>
      <div class="section-tools">
        <button class="secondary" id="reset-progress">${i18n.t('ui.resetProgress')}</button>
        <button class="secondary" id="pause-progress">${paused ? i18n.t('ui.resume') : i18n.t('ui.stop')}</button>
      </div>
    </div>
    <div class="dashboard-grid">
      <div class="progress-card">
        <h3>${i18n.t('ui.bookProgress')}</h3>
        <p>${completed}/${total} ${i18n.t('ui.sections')}</p>
        <div class="progress-track"><span style="width:${percent}%"></span></div>
      </div>
      <div class="progress-card">
        <h3>${i18n.t('ui.episodeProgress')}</h3>
        <p>${percent}% ${i18n.t('ui.complete')}</p>
      </div>
      <div class="progress-card">
        <h3>${i18n.t('ui.badges')}</h3>
        <div>${episode.badges.map((badge) => `<span class="badge">${i18n.t(badge.labelKey)}</span>`).join(' ')}</div>
      </div>
      <div class="progress-card">
        <h3>${i18n.t('ui.continueTitle')}</h3>
        <p>${i18n.t('ui.continueDescription')}</p>
        <button class="primary" id="continue-btn">${i18n.t('ui.continue')}</button>
      </div>
    </div>
  `;

  const resetButton = container.querySelector('#reset-progress');
  const pauseButton = container.querySelector('#pause-progress');
  const continueButton = container.querySelector('#continue-btn');

  resetButton.addEventListener('click', () => {
    store.resetProgress();
    createToast(i18n.t('ui.progressReset'));
    renderDashboard({ container, episode, i18n, store });
  });

  pauseButton.addEventListener('click', () => {
    store.setPaused(!paused);
    renderDashboard({ container, episode, i18n, store });
  });

  continueButton.addEventListener('click', () => {
    const next = episode.sections.find((section) => !progress[section.id]);
    const target = document.getElementById(next ? `section-${next.id}` : `section-${episode.sections[0].id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      target.focus({ preventScroll: true });
    }
  });
};
