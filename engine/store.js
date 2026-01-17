const STORE_VERSION = "1.0.0";

const getStorageKey = (episodeId) => `lee-tee-engine-${STORE_VERSION}-${episodeId}`;

const defaultState = {
  language: "en",
  settings: {
    readAloud: false,
    dyslexiaFont: false,
    highContrast: false,
    showHints: true,
  },
  progress: {
    completedSections: [],
    points: 0,
    badges: [],
    stopPosition: null,
  },
};

export const createStore = (episodeId) => {
  const storageKey = getStorageKey(episodeId);
  let state = structuredClone(defaultState);
  const listeners = new Set();

  const load = () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      state = { ...state, ...parsed };
    } catch (error) {
      localStorage.removeItem(storageKey);
    }
  };

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const notify = () => {
    listeners.forEach((listener) => listener(state));
  };

  const setState = (updater) => {
    const next = typeof updater === "function" ? updater(state) : updater;
    state = { ...state, ...next };
    save();
    notify();
  };

  const updateProgress = (update) => {
    state = {
      ...state,
      progress: {
        ...state.progress,
        ...update,
      },
    };
    save();
    notify();
  };

  const markSectionComplete = (sectionId, points = 0) => {
    if (state.progress.completedSections.includes(sectionId)) return;
    updateProgress({
      completedSections: [...state.progress.completedSections, sectionId],
      points: state.progress.points + points,
    });
  };

  const resetProgress = () => {
    updateProgress({
      completedSections: [],
      points: 0,
      badges: [],
      stopPosition: null,
    });
  };

  const setLanguage = (language) => {
    setState({ language });
  };

  const setSettings = (settings) => {
    setState({ settings: { ...state.settings, ...settings } });
  };

  const setBadges = (badges) => {
    updateProgress({ badges });
  };

  const setStopPosition = (position) => {
    updateProgress({ stopPosition: position });
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  load();

  return {
    getState: () => state,
    setLanguage,
    setSettings,
    markSectionComplete,
    resetProgress,
    setBadges,
    setStopPosition,
    subscribe,
  };
};
