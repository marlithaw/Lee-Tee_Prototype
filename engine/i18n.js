import { store } from "./store.js";

const dictionaries = {};
const missingKeys = new Set();

const UI_PREFIXES = new Set([
  "ui",
  "dashboard",
  "settings",
  "nav",
  "section",
  "media",
  "toast",
]);
const CONTENT_PREFIXES = new Set([
  "episode",
  "objectives",
  "strategies",
  "helpers",
  "sections",
  "story",
  "vocab",
  "practice",
  "check",
  "reflect",
  "writing",
  "badges",
]);

const CRITICAL_UI_KEYS = [
  "ui.language",
  "ui.resetProgress",
  "ui.stop",
  "ui.resume",
  "ui.close",
  "ui.loadFailed",
  "dashboard.title",
  "dashboard.bookProgress",
  "dashboard.episodeProgress",
  "dashboard.sectionCount",
  "dashboard.badges",
  "dashboard.continue",
  "settings.title",
  "settings.readAloud",
  "settings.dyslexia",
  "settings.contrast",
  "settings.showHints",
  "nav.sectionNavigation",
  "nav.vocab",
  "nav.story",
  "nav.practice",
  "nav.check",
  "nav.reflect",
  "section.complete",
  "section.completed",
];

const stripMeta = (dictionary = {}) => {
  const { meta, ...strings } = dictionary;
  return strings;
};

export const loadLanguage = async (episodeId, language) => {
  const response = await fetch(`./episodes/${episodeId}/i18n/${language}.json`);
  if (!response.ok) {
    console.warn(`Missing translation file for ${language}`);
    dictionaries[language] = {};
    return;
  }
  dictionaries[language] = await response.json();
};

export const setAvailableLanguages = (languages) => {
  languages.forEach((language) => {
    if (!dictionaries[language]) {
      dictionaries[language] = {};
    }
  });
};

export const getLanguageMeta = (language) => {
  const dict = dictionaries[language];
  return dict?.meta || null;
};

const registerMissingKey = (tag) => {
  if (!missingKeys.has(tag)) {
    missingKeys.add(tag);
    console.warn("Missing i18n keys:", Array.from(missingKeys).sort());
  }
};

export const t = (key) => {
  const { language } = store.getState();
  const langDict = stripMeta(dictionaries[language]);
  const frDict = stripMeta(dictionaries.fr);
  const enDict = stripMeta(dictionaries.en);
  if (key in langDict) return langDict[key];
  registerMissingKey(`${language}:${key}`);
  if (key in frDict) return frDict[key];
  if (key in enDict) {
    registerMissingKey(`fr:${key}`);
    return enDict[key];
  }
  registerMissingKey(`en:${key}`);
  return key;
};

export const tArray = (key) => {
  const value = t(key);
  return Array.isArray(value) ? value : [];
};

const getNamespace = (key) => key.split(".")[0];

export const coverageReport = () => {
  const { language } = store.getState();
  const baseline = stripMeta(dictionaries.en);
  const current = stripMeta(dictionaries[language]);
  const baselineKeys = Object.keys(baseline);
  const currentKeys = new Set(Object.keys(current));

  const computeCoverage = (prefixes) => {
    const keys = baselineKeys.filter((key) => prefixes.has(getNamespace(key)));
    const covered = keys.filter((key) => currentKeys.has(key)).length;
    const total = keys.length;
    return {
      total,
      covered,
      percent: total ? Math.round((covered / total) * 100) : 100,
    };
  };

  return {
    language,
    ui: computeCoverage(UI_PREFIXES),
    content: computeCoverage(CONTENT_PREFIXES),
  };
};

export const missingKeysReport = () => {
  const { language } = store.getState();
  const baseline = stripMeta(dictionaries.en);
  const current = stripMeta(dictionaries[language]);
  const currentKeys = new Set(Object.keys(current));
  return Object.keys(baseline).reduce((report, key) => {
    if (currentKeys.has(key)) return report;
    const namespace = getNamespace(key);
    if (!report[namespace]) report[namespace] = [];
    report[namespace].push(key);
    return report;
  }, {});
};

export const getCriticalMissingKeys = (language) => {
  const current = stripMeta(dictionaries[language]);
  return CRITICAL_UI_KEYS.filter((key) => !(key in current));
};
