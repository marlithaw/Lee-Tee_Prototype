const STORAGE_KEY = "lee-tee-episode-engine";
const STORAGE_VERSION = 1;

const defaultState = {
  version: STORAGE_VERSION,
  language: "en",
  settings: {
    readAloud: false,
    dyslexiaFont: false,
    highContrast: false,
    showHints: true,
  },
  progress: {
    completedSections: [],
    badges: [],
    points: 0,
    lastSectionId: null,
  },
};

export function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...defaultState };
  try {
    const parsed = JSON.parse(saved);
    if (parsed.version !== STORAGE_VERSION) {
      return { ...defaultState };
    }
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...parsed.settings },
      progress: { ...defaultState.progress, ...parsed.progress },
    };
  } catch (error) {
    console.warn("Failed to parse saved state", error);
    return { ...defaultState };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateState(state, updates) {
  const nextState = {
    ...state,
    ...updates,
  };
  saveState(nextState);
  return nextState;
}

export function updateProgress(state, progressUpdates) {
  const nextState = {
    ...state,
    progress: {
      ...state.progress,
      ...progressUpdates,
    },
  };
  saveState(nextState);
  return nextState;
}

export function resetProgress(state) {
  const nextState = {
    ...state,
    progress: { ...defaultState.progress },
  };
  saveState(nextState);
  return nextState;
}

export function updateSettings(state, settingsUpdates) {
  const nextState = {
    ...state,
    settings: {
      ...state.settings,
      ...settingsUpdates,
    },
  };
  saveState(nextState);
  return nextState;
}
