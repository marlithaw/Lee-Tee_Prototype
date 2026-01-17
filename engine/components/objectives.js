export function renderObjectives(container, { i18n, episode }) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = i18n.t('ui.objectives.title');
  card.appendChild(title);

  const siopTitle = document.createElement('h4');
  siopTitle.textContent = i18n.t('ui.siop.title');
  card.appendChild(siopTitle);

  const strategies = document.createElement('ul');
  episode.siop.strategies.forEach((key) => {
    const item = document.createElement('li');
    item.textContent = i18n.t(key);
    strategies.appendChild(item);
  });
  card.appendChild(strategies);

  const languageTitle = document.createElement('h4');
  languageTitle.textContent = i18n.t('ui.objectives.language');
  card.appendChild(languageTitle);

  const languageList = document.createElement('ul');
  episode.objectives.language.forEach((key) => {
    const item = document.createElement('li');
    item.textContent = i18n.t(key);
    languageList.appendChild(item);
  });
  card.appendChild(languageList);

  const contentTitle = document.createElement('h4');
  contentTitle.textContent = i18n.t('ui.objectives.content');
  card.appendChild(contentTitle);

  const contentList = document.createElement('ul');
  episode.objectives.content.forEach((key) => {
    const item = document.createElement('li');
    item.textContent = i18n.t(key);
    contentList.appendChild(item);
  });
  card.appendChild(contentList);

  container.appendChild(card);
}
