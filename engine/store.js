const VERSION = 'lt-engine-v1';
const STORAGE_KEY = 'lt-episode-engine';

const defaultState = {
  version: VERSION,
  language: 'en',
  settings: {
    readAloud: false,
    dyslexiaFont: false,
    highContrast: false,
    showHints: true,
  },
  progress: {
    completedSections: {},
    badges: [],
    points: 0,
    paused: false,
  },
};

export const createStore = () => {
  const readStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      if (parsed.version !== VERSION) return { ...defaultState };
      return {
        ...defaultState,
        ...parsed,
        settings: { ...defaultState.settings, ...parsed.settings },
        progress: { ...defaultState.progress, ...parsed.progress },
      };
    } catch (error) {
      console.warn('Failed to read storage', error);
      return { ...defaultState };
    }
  };

  let state = readStorage();

  const persist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  return {
    get: (key) => state[key],
    set: (key, value) => {
      state = { ...state, [key]: value };
      persist();
    },
    updateProgress: (episodeId, update) => {
      const current = state.progress.completedSections[episodeId] || {};
      state.progress.completedSections[episodeId] = { ...current, ...update };
      persist();
    },
    getProgress: (episodeId) => state.progress.completedSections[episodeId] || {},
    setSettings: (settings) => {
      state.settings = { ...state.settings, ...settings };
      persist();
    },
    resetProgress: () => {
      state.progress = { ...defaultState.progress };
      persist();
    },
    setPaused: (paused) => {
      state.progress.paused = paused;
      persist();
    },
  };
};
