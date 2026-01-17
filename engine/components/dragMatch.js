import { createEl } from '../utils/dom.js';

export function renderDragMatch(section, { t, onComplete }) {
  const wrapper = createEl('div');
  wrapper.appendChild(createEl('p', { text: t(section.promptKey) }));
  const modeToggle = createEl('button', { className: 'btn ghost', text: t('ui.enableClickMode') });
  const modeState = { clickMode: false, selectedItem: null };

  const area = createEl('div', { className: 'drag-area' });
  const draggableColumn = createEl('div');
  const dropColumn = createEl('div');

  const items = section.pairs.map((pair) => ({ id: pair.id, label: t(pair.answerKey) }));
  const shuffledItems = [...items].sort(() => Math.random() - 0.5);

  const dropzones = section.pairs.map((pair) => {
    const zone = createEl('div', { className: 'dropzone', attrs: { 'data-id': pair.id, tabindex: '0', 'aria-label': t(pair.promptKey) } });
    zone.appendChild(createEl('p', { text: t(pair.promptKey) }));
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('active');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('active'));
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('active');
      const id = event.dataTransfer.getData('text/plain');
      placeItem(id, zone);
    });
    zone.addEventListener('click', () => handleZoneSelection(zone));
    zone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleZoneSelection(zone);
      }
    });
    return zone;
  });

  shuffledItems.forEach((item) => {
    const draggable = createEl('div', { className: 'draggable', text: item.label, attrs: { draggable: 'true', 'data-id': item.id, tabindex: '0' } });
    draggable.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', item.id);
    });
    draggable.addEventListener('click', () => handleItemSelection(draggable));
    draggable.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleItemSelection(draggable);
      }
    });
    draggableColumn.appendChild(draggable);
  });

  dropzones.forEach((zone) => dropColumn.appendChild(zone));
  area.append(draggableColumn, dropColumn);

  const feedback = createEl('div');
  const submit = createEl('button', { className: 'btn secondary', text: t('ui.checkAnswer') });
  submit.addEventListener('click', () => {
    const answers = dropzones.map((zone) => ({ id: zone.dataset.id, placed: zone.querySelector('[data-id]')?.dataset.id }));
    const isCorrect = answers.every((answer) => answer.placed === answer.id);
    feedback.className = `feedback ${isCorrect ? '' : 'error'}`;
    feedback.textContent = isCorrect ? t(section.correctFeedbackKey) : t(section.incorrectFeedbackKey);
    if (isCorrect) onComplete(section.id);
  });

  modeToggle.addEventListener('click', () => {
    modeState.clickMode = !modeState.clickMode;
    modeToggle.textContent = modeState.clickMode ? t('ui.enableDragMode') : t('ui.enableClickMode');
  });

  function handleItemSelection(draggable) {
    if (!modeState.clickMode) return;
    if (modeState.selectedItem) {
      modeState.selectedItem.classList.remove('selected');
    }
    draggable.classList.add('selected');
    modeState.selectedItem = draggable;
  }

  function handleZoneSelection(zone) {
    if (!modeState.clickMode || !modeState.selectedItem) return;
    placeItem(modeState.selectedItem.dataset.id, zone);
    modeState.selectedItem.classList.remove('selected');
    modeState.selectedItem = null;
  }

  function placeItem(itemId, zone) {
    const draggable = draggableColumn.querySelector(`[data-id="${itemId}"]`) || zone.querySelector(`[data-id="${itemId}"]`);
    if (!draggable) return;
    zone.querySelectorAll('.draggable').forEach((el) => draggableColumn.appendChild(el));
    zone.appendChild(draggable);
  }

  wrapper.append(modeToggle, area, submit, feedback);
  return wrapper;
}
