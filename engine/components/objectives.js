import { createEl } from '../utils/dom.js';

export function renderObjectives(root, { episode, t }) {
  root.innerHTML = '';
  const heading = createEl('h3', { text: t('ui.objectives') });
  const langHeader = createEl('h4', { text: t('ui.languageObjectives') });
  const langList = createEl('ul');
  episode.objectives.language.forEach((key) => {
    langList.appendChild(createEl('li', { text: t(key) }));
  });

  const contentHeader = createEl('h4', { text: t('ui.contentObjectives') });
  const contentList = createEl('ul');
  episode.objectives.content.forEach((key) => {
    contentList.appendChild(createEl('li', { text: t(key) }));
  });

  const siopHeader = createEl('h4', { text: t('ui.siopStrategies') });
  const siopList = createEl('ul');
  episode.siopStrategies.forEach((key) => {
    siopList.appendChild(createEl('li', { text: t(key) }));
  });

  root.append(heading, langHeader, langList, contentHeader, contentList, siopHeader, siopList);
}
