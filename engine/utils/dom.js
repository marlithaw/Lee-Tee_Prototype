export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const createEl = (tag, { className, text, attrs } = {}) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        el.setAttribute(key, value);
      }
    });
  }
  return el;
};

export const clearEl = (el) => {
  while (el.firstChild) el.removeChild(el.firstChild);
};
