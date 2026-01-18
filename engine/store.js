const STORAGE_KEY = "lee-tee-engine";
const VERSION = "v2";

const defaultState = {
  version: VERSION,
  language: "en",
  settings: {
    readAloud: false,
    dyslexia: false,
    contrast: false,
    showHints: true,
  },
  progress: {
    completedSections: [],
    badges: [],
    points: 0,
  },
  stopped: false,
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) {
      return { ...defaultState };
    }
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...parsed.settings },
      progress: { ...defaultState.progress, ...parsed.progress },
    };
  } catch (error) {
    console.warn("Failed to load stored state", error);
    return { ...defaultState };
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const state = loadState();
const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener({ ...state }));
  saveState(state);
};

export const store = {
  getState: () => ({ ...state }),
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setLanguage: (language) => {
    state.language = language;
    notify();
  },
  updateSettings: (settings) => {
    state.settings = { ...state.settings, ...settings };
    notify();
  },
  setProgress: (progress) => {
    state.progress = { ...state.progress, ...progress };
    notify();
  },
  resetProgress: () => {
    state.progress = { ...defaultState.progress };
    state.stopped = false;
    notify();
  },
  setStopped: (value) => {
    state.stopped = value;
    notify();
  },
};
