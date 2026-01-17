import { createEl } from '../utils/dom.js';

export function renderWriting(section, { t, onComplete }) {
  const wrapper = createEl('div');
  wrapper.appendChild(createEl('p', { text: t(section.promptKey) }));
  if (section.frames?.length) {
    const frameHeader = createEl('h4', { text: t('ui.sentenceFrames') });
    const frameList = createEl('ul');
    section.frames.forEach((frameKey) => frameList.appendChild(createEl('li', { text: t(frameKey) })));
    wrapper.append(frameHeader, frameList);
  }
  const textarea = createEl('textarea', { attrs: { rows: '4', 'aria-label': t('ui.writeResponse') } });
  const completeBtn = createEl('button', { className: 'btn secondary', text: t('ui.saveWriting') });
  completeBtn.addEventListener('click', () => onComplete(section.id));
  wrapper.append(textarea, completeBtn);
  return wrapper;
}
