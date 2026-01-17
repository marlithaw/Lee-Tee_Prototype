import { createEl } from '../utils/dom.js';
import { renderVocab } from './vocab.js';
import { renderMcq } from './mcq.js';
import { renderMultiSelect } from './multiSelect.js';
import { renderDragMatch } from './dragMatch.js';
import { renderWriting } from './writing.js';
import { renderListenButton } from './media.js';

export function renderSection(section, { t, state, onComplete, language, index, total }) {
  const card = createEl('article', { className: 'section-card', attrs: { id: section.id } });
  const header = createEl('header');
  const title = createEl('div');
  title.appendChild(createEl('h3', { text: t(section.titleKey) }));
  title.appendChild(createEl('p', { className: 'section-meta', text: `${t('ui.section')} ${index + 1} ${t('ui.of')} ${total}` }));

  const actions = createEl('div', { className: 'section-actions' });
  const simplifiedToggle = createEl('label', { className: 'toggle' });
  const simplifiedInput = createEl('input', { attrs: { type: 'checkbox', 'aria-label': t('ui.simplifiedView') } });
  const simplifiedLabel = createEl('span', { text: t('ui.simplifiedView') });
  simplifiedToggle.append(simplifiedInput, simplifiedLabel);
  actions.appendChild(simplifiedToggle);
  header.append(title, actions);

  const content = createEl('div');
  const body = renderSectionBody(section, { t, state, onComplete, language, index, total, simplifiedInput });
  content.appendChild(body);

  simplifiedInput.addEventListener('change', () => {
    body.classList.toggle('simplified', simplifiedInput.checked);
    updateSimplified(body, section, t, simplifiedInput.checked);
  });

  card.append(header, content);
  return card;
}

function renderSectionBody(section, context) {
  const { t, state, onComplete, language, index, total } = context;
  const wrapper = createEl('div');

  if (section.type === 'vocab') {
    wrapper.appendChild(renderVocab(section, { t, language, onComplete, settings: state.settings }));
  }
  if (section.type === 'story') {
    const storyText = createEl('div', { className: 'story-text', attrs: { 'data-story': 'full' } });
    storyText.textContent = t(section.storyKey);
    const listenButton = renderListenButton({ label: t('ui.listen'), text: t(section.storyKey), language });
    const readAloud = renderListenButton({ label: t('ui.readAloudSection').replace('{current}', index + 1).replace('{total}', total), text: t(section.storyKey), language });
    listenButton.disabled = !state.settings.readAloud;
    readAloud.disabled = !state.settings.readAloud;
    wrapper.append(listenButton, readAloud, storyText);
    if (state.settings.showHints && section.hintKey) {
      wrapper.appendChild(createEl('p', { className: 'section-meta', text: t(section.hintKey) }));
    }
    const completeBtn = createEl('button', { className: 'btn secondary', text: t('ui.markComplete') });
    completeBtn.addEventListener('click', () => onComplete(section.id));
    wrapper.appendChild(completeBtn);
  }
  if (section.type === 'check') {
    wrapper.appendChild(renderMcq(section, { t, onComplete }));
  }
  if (section.type === 'multi') {
    wrapper.appendChild(renderMultiSelect(section, { t, onComplete }));
  }
  if (section.type === 'drag') {
    wrapper.appendChild(renderDragMatch(section, { t, onComplete }));
  }
  if (section.type === 'writing') {
    wrapper.appendChild(renderWriting(section, { t, onComplete }));
  }

  return wrapper;
}

function updateSimplified(wrapper, section, t, enabled) {
  if (!section.simplifiedKey) return;
  const storyBlock = wrapper.querySelector('[data-story]');
  if (!storyBlock) return;
  storyBlock.textContent = enabled ? t(section.simplifiedKey) : t(section.storyKey);
}
