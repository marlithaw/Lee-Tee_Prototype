const STORAGE_VERSION = '1';
const STORAGE_KEY = `leeTeeEngine_v${STORAGE_VERSION}`;

const defaultState = {
  version: STORAGE_VERSION,
  language: 'en',
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
  },
  stopped: false,
  lastSectionId: null,
  simplifiedSections: {},
};

export function createStore() {
  let state = loadState();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version !== STORAGE_VERSION) {
        return structuredClone(defaultState);
      }
      return { ...structuredClone(defaultState), ...parsed };
    } catch (error) {
      console.warn('Failed to parse saved state', error);
      return structuredClone(defaultState);
    }
  }

  function update(partial) {
    state = { ...state, ...partial };
    save();
  }

  function updateSettings(partial) {
    state.settings = { ...state.settings, ...partial };
    save();
  }

  function toggleStopped() {
    state.stopped = !state.stopped;
    save();
    return state.stopped;
  }

  function markSectionComplete(sectionId) {
    if (!state.progress.completedSections.includes(sectionId)) {
      state.progress.completedSections.push(sectionId);
      state.lastSectionId = sectionId;
      save();
    }
  }

  function reset() {
    state = structuredClone(defaultState);
    save();
  }

  function toggleSimplified(sectionId) {
    const current = Boolean(state.simplifiedSections[sectionId]);
    state.simplifiedSections = {
      ...state.simplifiedSections,
      [sectionId]: !current,
    };
    save();
  }

  function getNextSection(sections) {
    return sections.find(
      (section) => !state.progress.completedSections.includes(section.id)
    );
  }

  function setLanguage(language) {
    state.language = language;
    save();
  }

  return {
    getState: () => state,
    update,
    updateSettings,
    toggleStopped,
    markSectionComplete,
    reset,
    toggleSimplified,
    getNextSection,
    setLanguage,
  };
}
