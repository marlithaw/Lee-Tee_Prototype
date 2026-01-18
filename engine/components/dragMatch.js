import { createToast } from '../ui/toast.js';

export const renderDragMatch = ({ container, section, i18n }) => {
  container.innerHTML = `
    <p>${i18n.t(section.promptKey)}</p>
    <div class="section-tools">
      <button class="secondary" type="button" data-mode="drag">${i18n.t('ui.dragMode')}</button>
      <button class="secondary" type="button" data-mode="click">${i18n.t('ui.clickMode')}</button>
    </div>
    <div class="match-grid" data-match-grid></div>
    <button class="primary" type="button" data-submit>${i18n.t('ui.checkAnswer')}</button>
    <div class="feedback" aria-live="polite"></div>
  `;

  const grid = container.querySelector('[data-match-grid]');
  const feedback = container.querySelector('.feedback');
  const matches = {};
  let selectedItem = null;
  let mode = 'drag';

  const renderGrid = () => {
    grid.innerHTML = `
      <div>
        <h4>${i18n.t('ui.items')}</h4>
        ${section.items
          .map(
            (item) => `
          <div class="match-item" draggable="true" data-item="${item.id}" tabindex="0">
            ${i18n.t(item.labelKey)}
          </div>
        `
          )
          .join('')}
      </div>
      <div>
        <h4>${i18n.t('ui.targets')}</h4>
        ${section.targets
          .map(
            (target) => `
          <div class="match-target" data-target="${target.id}" tabindex="0">
            <strong>${i18n.t(target.labelKey)}</strong>
            <div>${matches[target.id] ? i18n.t(section.items.find((item) => item.id === matches[target.id]).labelKey) : ''}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    grid.querySelectorAll('.match-item').forEach((item) => {
      item.addEventListener('dragstart', (event) => {
        if (mode !== 'drag') return;
        event.dataTransfer.setData('text/plain', item.dataset.item);
      });
      item.addEventListener('click', () => {
        if (mode !== 'click') return;
        selectedItem = item.dataset.item;
        grid.querySelectorAll('.match-item').forEach((el) => el.classList.remove('active'));
        item.classList.add('active');
      });
    });

    grid.querySelectorAll('.match-target').forEach((target) => {
      target.addEventListener('dragover', (event) => {
        if (mode !== 'drag') return;
        event.preventDefault();
        target.classList.add('active');
      });
      target.addEventListener('dragleave', () => target.classList.remove('active'));
      target.addEventListener('drop', (event) => {
        if (mode !== 'drag') return;
        event.preventDefault();
        const itemId = event.dataTransfer.getData('text/plain');
        matches[target.dataset.target] = itemId;
        renderGrid();
      });
      target.addEventListener('click', () => {
        if (mode !== 'click') return;
        if (!selectedItem) {
          createToast(i18n.t('ui.selectItemFirst'));
          return;
        }
        matches[target.dataset.target] = selectedItem;
        selectedItem = null;
        renderGrid();
      });
    });
  };

  const setMode = (nextMode) => {
    mode = nextMode;
    grid.querySelectorAll('.match-item, .match-target').forEach((el) => el.classList.remove('active'));
  };

  container.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode);
      createToast(
        button.dataset.mode === 'drag' ? i18n.t('ui.dragModeEnabled') : i18n.t('ui.clickModeEnabled')
      );
    });
  });

  container.querySelector('[data-submit]').addEventListener('click', () => {
    const isComplete = section.targets.every((target) => matches[target.id]);
    if (!isComplete) {
      createToast(i18n.t('ui.completeMatching'));
      return;
    }
    const allCorrect = section.matches.every((match) => matches[match.targetId] === match.itemId);
    feedback.className = `feedback ${allCorrect ? 'success' : 'error'}`;
    feedback.textContent = allCorrect ? i18n.t('ui.correct') : i18n.t('ui.incorrect');
  });

  renderGrid();
};
