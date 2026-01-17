export function renderDashboard(container, { episode, i18n, store, onContinue, onReset, onStopToggle }) {
  container.innerHTML = '';
  const state = store.getState();
  const totalSections = episode.sections.length;
  const completed = state.progress.completedSections.length;

  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = i18n.t('ui.dashboard.title');
  card.appendChild(title);

  const progress = document.createElement('p');
  progress.textContent = i18n.t('ui.dashboard.section_progress', {
    completed,
    total: totalSections,
  });
  card.appendChild(progress);

  const stats = document.createElement('div');
  stats.className = 'section__meta';
  stats.textContent = i18n.t('ui.dashboard.points_badges', {
    points: state.progress.points,
    badges: state.progress.badges.length,
  });
  card.appendChild(stats);

  const bookProgress = document.createElement('div');
  bookProgress.className = 'badge';
  bookProgress.textContent = i18n.t('ui.dashboard.book_progress', {
    current: episode.bookProgress.current,
    total: episode.bookProgress.total,
  });
  card.appendChild(bookProgress);

  const buttonRow = document.createElement('div');
  buttonRow.style.display = 'flex';
  buttonRow.style.flexWrap = 'wrap';
  buttonRow.style.gap = '0.5rem';
  buttonRow.style.marginTop = '1rem';

  const continueButton = document.createElement('button');
  continueButton.className = 'button';
  continueButton.type = 'button';
  continueButton.textContent = i18n.t('ui.dashboard.continue');
  continueButton.addEventListener('click', onContinue);
  buttonRow.appendChild(continueButton);

  const stopButton = document.createElement('button');
  stopButton.className = 'button secondary';
  stopButton.type = 'button';
  stopButton.textContent = state.stopped
    ? i18n.t('ui.dashboard.resume')
    : i18n.t('ui.dashboard.stop');
  stopButton.addEventListener('click', onStopToggle);
  buttonRow.appendChild(stopButton);

  const resetButton = document.createElement('button');
  resetButton.className = 'button ghost';
  resetButton.type = 'button';
  resetButton.textContent = i18n.t('ui.dashboard.reset');
  resetButton.addEventListener('click', onReset);
  buttonRow.appendChild(resetButton);

  card.appendChild(buttonRow);
  container.appendChild(card);
}
