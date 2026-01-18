export const renderObjectives = ({ container, episode, i18n }) => {
  const strategies = episode.objectives.siopStrategies
    .map((strategy) => `<li>${i18n.t(strategy)}</li>`)
    .join('');
  container.innerHTML = `
    <h2>${i18n.t('ui.objectivesTitle')}</h2>
    <div class="objective-grid">
      <div class="objective-card">
        <h3>${i18n.t('ui.languageObjectives')}</h3>
        <ul>${episode.objectives.language.map((item) => `<li>${i18n.t(item)}</li>`).join('')}</ul>
      </div>
      <div class="objective-card">
        <h3>${i18n.t('ui.contentObjectives')}</h3>
        <ul>${episode.objectives.content.map((item) => `<li>${i18n.t(item)}</li>`).join('')}</ul>
      </div>
      <div class="objective-card">
        <h3>${i18n.t('ui.siopStrategies')}</h3>
        <ul>${strategies}</ul>
      </div>
    </div>
  `;
};
