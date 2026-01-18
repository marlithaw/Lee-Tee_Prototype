import { renderVocab } from './vocab.js';
import { renderMcq } from './mcq.js';
import { renderMultiSelect } from './multiSelect.js';
import { renderDragMatch } from './dragMatch.js';
import { renderWriting } from './writing.js';
import { renderMedia } from './media.js';
import { openModal } from '../ui/modal.js';
import { createToast } from '../ui/toast.js';

const componentMap = {
  vocab: renderVocab,
  mcq: renderMcq,
  multiSelect: renderMultiSelect,
  dragMatch: renderDragMatch,
  writing: renderWriting,
  media: renderMedia,
};

export const renderSections = ({ container, episode, i18n, store }) => {
  const progress = store.getProgress(episode.id);
  const paused = store.get('progress').paused;
  const settings = store.get('settings');
  container.innerHTML = '';

  episode.sections.forEach((section, index) => {
    const sectionEl = document.createElement('article');
    sectionEl.className = 'section';
    sectionEl.id = `section-${section.id}`;
    sectionEl.tabIndex = -1;

    const completed = progress[section.id];
    const helpers = episode.helpers
      .map(
        (helper) => `
        <button class="secondary" type="button" data-helper="${helper.id}">
          ${i18n.t(helper.labelKey)}
        </button>
      `
      )
      .join('');

    sectionEl.innerHTML = `
      <div class="section-header">
        <div>
          <h3>${i18n.t(section.titleKey)}</h3>
          <p>${i18n.t(section.subtitleKey)}</p>
        </div>
        <div class="section-tools">
          <button class="secondary" type="button" data-toggle="simplified">${i18n.t('ui.simplifiedView')}</button>
          ${completed ? `<span class="badge">${i18n.t('ui.completed')}</span>` : ''}
        </div>
      </div>
      <div class="section-body"></div>
      <div class="simplified hidden" data-simplified>
        ${settings.showHints && section.simplifiedKey ? i18n.t(section.simplifiedKey) : ''}
      </div>
      <div class="helper-buttons">${helpers}</div>
      <div class="section-footer">
        <button class="primary" type="button" data-complete ${paused ? 'disabled' : ''}>
          ${completed ? i18n.t('ui.markedComplete') : i18n.t('ui.markComplete')}
        </button>
        <span>${i18n.t('ui.sectionCount', { current: index + 1, total: episode.sections.length })}</span>
      </div>
    `;

    const body = sectionEl.querySelector('.section-body');
    const renderer = componentMap[section.type];
    if (renderer) {
      renderer({ container: body, section, i18n, store, episodeId: episode.id });
    }

    const simplified = sectionEl.querySelector('[data-simplified]');
    const toggle = sectionEl.querySelector('[data-toggle="simplified"]');
    if (!settings.showHints || !section.simplifiedKey) {
      toggle.disabled = true;
      simplified.classList.add('hidden');
    }

    toggle.addEventListener('click', () => {
      if (toggle.disabled) return;
      simplified.classList.toggle('hidden');
      toggle.setAttribute('aria-pressed', simplified.classList.contains('hidden') ? 'false' : 'true');
    });

    sectionEl.querySelectorAll('button[data-helper]').forEach((button) => {
      button.addEventListener('click', () => {
        const helper = episode.helpers.find((item) => item.id === button.dataset.helper);
        openModal({
          title: i18n.t(helper.titleKey),
          content: `<p>${i18n.t(helper.contentKey)}</p>`,
        });
      });
    });

    const completeButton = sectionEl.querySelector('button[data-complete]');
    completeButton.addEventListener('click', () => {
      if (paused) {
        createToast(i18n.t('ui.resumeToContinue'));
        return;
      }
      store.updateProgress(episode.id, { [section.id]: true });
      createToast(i18n.t('ui.sectionCompleted'));
      window.dispatchEvent(new CustomEvent('progress:updated'));
    });

    if (paused) {
      sectionEl.querySelectorAll('button, input, textarea, select').forEach((el) => {
        if (!el.closest('.section-footer')) {
          el.disabled = true;
        }
      });
    }

    container.appendChild(sectionEl);
  });
};
