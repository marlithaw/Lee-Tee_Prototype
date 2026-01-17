const VERSION = "v1";
const STORAGE_KEY = "lee-tee-engine";

const defaultState = {
  version: VERSION,
  language: "en",
  settings: {
    readAloud: false,
    dyslexia: false,
    highContrast: false,
    showHints: true,
  },
  progress: {},
};

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) return structuredClone(defaultState);
    return { ...defaultState, ...parsed };
  } catch (error) {
    console.warn("Failed to load state", error);
    return structuredClone(defaultState);
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const state = loadState();

export const getState = () => state;

export const setState = (partial) => {
  Object.assign(state, partial);
  saveState(state);
};

export const updateSettings = (settings) => {
  state.settings = { ...state.settings, ...settings };
  saveState(state);
};

export const updateProgress = (episodeId, progress) => {
  state.progress[episodeId] = { ...state.progress[episodeId], ...progress };
  saveState(state);
};

export const resetProgress = (episodeId) => {
  delete state.progress[episodeId];
  saveState(state);
};

export const setLanguage = (language) => {
  state.language = language;
  saveState(state);
};
