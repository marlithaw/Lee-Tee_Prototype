export function renderDragMatch(container, { section, i18n, onComplete, showHints }) {
  const modeToggle = document.createElement('div');
  modeToggle.className = 'toggle';

  const label = document.createElement('span');
  label.textContent = i18n.t('ui.dragMatch.mode_label');
  modeToggle.appendChild(label);

  const modeSelect = document.createElement('select');
  const dragOption = document.createElement('option');
  dragOption.value = 'drag';
  dragOption.textContent = i18n.t('ui.dragMatch.mode_drag');
  const clickOption = document.createElement('option');
  clickOption.value = 'click';
  clickOption.textContent = i18n.t('ui.dragMatch.mode_click');
  modeSelect.appendChild(dragOption);
  modeSelect.appendChild(clickOption);
  modeSelect.setAttribute('aria-label', i18n.t('ui.dragMatch.mode_label'));
  modeToggle.appendChild(modeSelect);

  container.appendChild(modeToggle);

  if (showHints) {
    const instructions = document.createElement('p');
    instructions.textContent = i18n.t('ui.dragMatch.instructions');
    container.appendChild(instructions);
  }

  const dragArea = document.createElement('div');
  dragArea.className = 'drag-area';

  const itemsColumn = document.createElement('div');
  const targetsColumn = document.createElement('div');

  const assignments = {};
  let selectedItemId = null;

  function updateStatus(message, isSuccess) {
    status.className = isSuccess ? 'status-message success' : 'status-message error';
    status.textContent = message;
  }

  function checkComplete() {
    const allPlaced = section.targets.every((target) => assignments[target.id]);
    if (!allPlaced) return;
    const allCorrect = section.targets.every((target) => {
      const assigned = assignments[target.id];
      return assigned === target.correctItemId;
    });
    if (allCorrect) {
      updateStatus(i18n.t('ui.dragMatch.correct'), true);
      onComplete();
    } else {
      updateStatus(i18n.t('ui.dragMatch.incorrect'), false);
    }
  }

  function render() {
    itemsColumn.innerHTML = '';
    targetsColumn.innerHTML = '';

    section.items.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'drag-item';
      itemEl.textContent = i18n.t(item.labelKey);
      itemEl.setAttribute('role', 'button');
      itemEl.tabIndex = 0;
      itemEl.setAttribute('aria-label', i18n.t(item.labelKey));

      if (modeSelect.value === 'drag') {
        itemEl.setAttribute('draggable', 'true');
        itemEl.addEventListener('dragstart', (event) => {
          event.dataTransfer.setData('text/plain', item.id);
        });
      }

      itemEl.addEventListener('click', () => {
        if (modeSelect.value === 'click') {
          selectedItemId = item.id;
          document.querySelectorAll('.drag-item').forEach((el) => {
            el.classList.toggle('is-selected', el.textContent === itemEl.textContent);
          });
        }
      });

      itemEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          itemEl.click();
        }
      });

      itemsColumn.appendChild(itemEl);
    });

    section.targets.forEach((target) => {
      const targetEl = document.createElement('div');
      targetEl.className = 'drag-target';
      targetEl.setAttribute('role', 'button');
      targetEl.tabIndex = 0;
      targetEl.setAttribute('aria-label', i18n.t(target.labelKey));

      const label = document.createElement('strong');
      label.textContent = i18n.t(target.labelKey);
      targetEl.appendChild(label);

      const assigned = document.createElement('p');
      assigned.textContent = assignments[target.id]
        ? i18n.t(section.items.find((item) => item.id === assignments[target.id]).labelKey)
        : i18n.t('ui.dragMatch.empty');
      targetEl.appendChild(assigned);

      targetEl.addEventListener('dragover', (event) => {
        if (modeSelect.value === 'drag') {
          event.preventDefault();
        }
      });

      targetEl.addEventListener('drop', (event) => {
        if (modeSelect.value !== 'drag') return;
        const itemId = event.dataTransfer.getData('text/plain');
        assignments[target.id] = itemId;
        render();
        checkComplete();
      });

      targetEl.addEventListener('click', () => {
        if (modeSelect.value !== 'click') return;
        if (!selectedItemId) {
          updateStatus(i18n.t('ui.dragMatch.select_item'), false);
          return;
        }
        assignments[target.id] = selectedItemId;
        selectedItemId = null;
        render();
        checkComplete();
      });

      targetEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          targetEl.click();
        }
      });

      targetsColumn.appendChild(targetEl);
    });
  }

  dragArea.appendChild(itemsColumn);
  dragArea.appendChild(targetsColumn);
  container.appendChild(dragArea);

  const status = document.createElement('div');
  status.setAttribute('role', 'status');
  container.appendChild(status);

  modeSelect.addEventListener('change', () => {
    selectedItemId = null;
    render();
  });

  render();
}
