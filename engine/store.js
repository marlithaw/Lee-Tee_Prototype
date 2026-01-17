const STORAGE_KEY = 'lee-tee-episode-engine';
const VERSION = '1.0.0';

const defaultState = {
  version: VERSION,
  language: 'en',
  settings: {
    readAloud: true,
    dyslexia: false,
    contrast: false,
    showHints: true
  },
  progress: {
    completedSections: [],
    points: 0,
    badges: [],
    currentSection: null,
    stopped: false
  }
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaultState };
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) {
      return { ...defaultState };
    }
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...parsed.settings },
      progress: { ...defaultState.progress, ...parsed.progress }
    };
  } catch (error) {
    console.warn('Failed to parse stored state', error);
    return { ...defaultState };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return loadState();
}

export function updateState(updater) {
  const state = loadState();
  const next = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  saveState(next);
  return next;
}

export function resetState() {
  saveState({ ...defaultState });
  return { ...defaultState };
}

export function getDefaultProgress() {
  return { ...defaultState.progress };
}
