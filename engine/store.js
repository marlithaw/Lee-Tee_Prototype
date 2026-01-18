const STORAGE_KEY = "lee_tee_episode_engine";
const STORAGE_VERSION = "1.0";

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
    paused: false,
  },
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      settings: { ...defaultState.settings, ...parsed.settings },
      progress: { ...defaultState.progress, ...parsed.progress },
    };
  } catch (error) {
    console.warn("Failed to load state", error);
    return structuredClone(defaultState);
  }
};

let state = loadState();

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getState = () => state;

export const updateState = (updater) => {
  state = typeof updater === "function" ? updater(state) : updater;
  saveState();
};

export const resetProgress = () => {
  updateState((current) => ({
    ...current,
    progress: { ...defaultState.progress },
  }));
};

export const updateSetting = (key, value) => {
  updateState((current) => ({
    ...current,
    settings: { ...current.settings, [key]: value },
  }));
};

export const updateLanguage = (language) => {
  updateState((current) => ({
    ...current,
    language,
  }));
};

export const markSectionComplete = (sectionId) => {
  updateState((current) => {
    const completed = new Set(current.progress.completedSections);
    completed.add(sectionId);
    return {
      ...current,
      progress: {
        ...current.progress,
        completedSections: Array.from(completed),
        points: current.progress.points + 10,
      },
    };
  });
};

export const togglePause = () => {
  updateState((current) => ({
    ...current,
    progress: { ...current.progress, paused: !current.progress.paused },
  }));
};
