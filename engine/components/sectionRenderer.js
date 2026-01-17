import { renderVocab } from './vocab.js';
import { renderMcq } from './mcq.js';
import { renderDragMatch } from './dragMatch.js';
import { renderWriting } from './writing.js';
import { speakText } from '../utils/speech.js';

export function renderSections(container, { episode, i18n, store, modalManager, toast, onProgressChange }) {
  container.innerHTML = '';
  const state = store.getState();

  episode.sections.forEach((section, index) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'card section';
    sectionEl.id = section.id;
    sectionEl.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'section__header';

    const titleWrap = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = i18n.t(section.titleKey);
    titleWrap.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'section__meta';
    meta.textContent = state.progress.completedSections.includes(section.id)
      ? i18n.t('ui.section.complete')
      : i18n.t('ui.section.incomplete');
    titleWrap.appendChild(meta);

    header.appendChild(titleWrap);

    if (section.simplifiedKey) {
      const simplifiedToggle = document.createElement('button');
      simplifiedToggle.type = 'button';
      simplifiedToggle.className = 'simplified-toggle';
      const toggleState = state.simplifiedSections[section.id]
        ? i18n.t('ui.simplified.on')
        : i18n.t('ui.simplified.off');
      simplifiedToggle.textContent = `${i18n.t('ui.simplified.toggle')}: ${toggleState}`;
      simplifiedToggle.addEventListener('click', () => {
        store.toggleSimplified(section.id);
        renderSections(container, { episode, i18n, store, modalManager, toast, onProgressChange });
      });
      header.appendChild(simplifiedToggle);
    }

    sectionEl.appendChild(header);

    const content = document.createElement('div');
    content.className = 'section__content';

    const isSimplified = Boolean(state.simplifiedSections[section.id]);

    if (section.summaryKey) {
      const summary = document.createElement('p');
      summary.textContent = isSimplified && section.simplifiedKey
        ? i18n.t(section.simplifiedKey)
        : i18n.t(section.summaryKey);
      content.appendChild(summary);
    }

    if (section.type === 'vocabulary') {
      renderVocab(content, { section, i18n, modalManager });
    }

    if (section.type === 'story') {
      const storyBlock = document.createElement('div');
      storyBlock.className = 'story-block';
      const paragraphs = section.paragraphs || [];
      const total = paragraphs.length;
      paragraphs.forEach((para, idx) => {
        const p = document.createElement('p');
        p.textContent = isSimplified && para.simplifiedKey
          ? i18n.t(para.simplifiedKey)
          : i18n.t(para.textKey);
        storyBlock.appendChild(p);

        const controlRow = document.createElement('div');
        controlRow.style.display = 'flex';
        controlRow.style.gap = '0.5rem';
        controlRow.style.flexWrap = 'wrap';

        const listenBtn = document.createElement('button');
        listenBtn.className = 'button secondary';
        listenBtn.type = 'button';
        listenBtn.textContent = i18n.t('ui.story.listen');
        listenBtn.setAttribute('aria-label', i18n.t('ui.story.listen'));
        listenBtn.disabled = !state.settings.readAloud;
        listenBtn.addEventListener('click', () => {
          speakText(p.textContent, i18n.getLanguage());
        });
        controlRow.appendChild(listenBtn);

        const readAloud = document.createElement('span');
        readAloud.textContent = i18n.t('ui.story.read_aloud', {
          current: idx + 1,
          total,
        });
        controlRow.appendChild(readAloud);
        storyBlock.appendChild(controlRow);
      });
      content.appendChild(storyBlock);
    }

    if (section.type === 'dragMatch') {
      renderDragMatch(content, {
        section,
        i18n,
        showHints: state.settings.showHints,
        onComplete: () => {
          store.markSectionComplete(section.id);
          toast.show(i18n.t('ui.section.completed_toast'));
          onProgressChange();
        },
      });
    }

    if (section.type === 'mcq') {
      renderMcq(content, {
        section,
        i18n,
        onComplete: () => {
          store.markSectionComplete(section.id);
          toast.show(i18n.t('ui.section.completed_toast'));
          onProgressChange();
        },
      });
    }

    if (section.type === 'writing') {
      renderWriting(content, {
        section,
        i18n,
        onSave: () => {
          store.markSectionComplete(section.id);
          toast.show(i18n.t('ui.writing.saved'));
          onProgressChange();
        },
      });
    }

    const completeButton = document.createElement('button');
    completeButton.className = 'button ghost';
    completeButton.type = 'button';
    completeButton.textContent = i18n.t('ui.section.mark_complete');
    completeButton.addEventListener('click', () => {
      store.markSectionComplete(section.id);
      onProgressChange();
    });
    content.appendChild(completeButton);

    if (state.stopped) {
      const paused = document.createElement('div');
      paused.className = 'status-message error';
      paused.textContent = i18n.t('ui.section.paused');
      content.prepend(paused);
      content.setAttribute('aria-disabled', 'true');
    }

    sectionEl.appendChild(content);
    container.appendChild(sectionEl);
  });

  if (state.stopped) {
    container.querySelectorAll('button, input, textarea, select').forEach((el) => {
      el.disabled = true;
    });
  }
}
