export function renderNav(container, { episode, i18n, store, onNavigate }) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = i18n.t('ui.nav.title');
  card.appendChild(title);

  const progress = document.createElement('p');
  progress.textContent = i18n.t('ui.nav.section_progress', {
    completed: store.getState().progress.completedSections.length,
    total: episode.sections.length,
  });
  card.appendChild(progress);

  const list = document.createElement('div');
  list.className = 'quick-jump';

  episode.sections.forEach((section) => {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'quick-jump__item';
    link.innerHTML = `<span aria-hidden="true">${section.icon}</span>${i18n.t(section.titleKey)}`;
    link.setAttribute(
      'aria-label',
      i18n.t('ui.nav.jump_to', { title: i18n.t(section.titleKey) })
    );
    link.addEventListener('click', () => onNavigate(section.id));
    list.appendChild(link);
  });

  card.appendChild(list);
  container.appendChild(card);
}
