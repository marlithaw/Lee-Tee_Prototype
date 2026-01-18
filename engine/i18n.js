import { store } from "./store.js";

const dictionaries = {};
const languageMeta = {};
const missingKeys = new Map();

const UI_PREFIXES = new Set([
  "ui",
  "dashboard",
  "settings",
  "objectives",
  "strategies",
  "helpers",
  "nav",
  "section",
  "vocab",
  "check",
  "practice",
  "writing",
  "reflect",
  "media",
  "i18n",
]);

const CRITICAL_UI_KEYS = [
  "ui.language",
  "ui.resetProgress",
  "ui.stop",
  "ui.resume",
  "ui.close",
  "ui.sectionNav",
  "dashboard.title",
  "settings.title",
  "objectives.title",
  "strategies.title",
  "section.complete",
  "section.completed",
  "section.simplified",
  "nav.vocab",
  "nav.story",
  "nav.practice",
  "nav.check",
  "nav.reflect",
];

const pseudoMap = {
  a: "á",
  b: "ƀ",
  c: "ç",
  d: "ď",
  e: "ë",
  f: "ƒ",
  g: "ğ",
  h: "ħ",
  i: "ï",
  j: "ĵ",
  k: "ķ",
  l: "ľ",
  m: "ṁ",
  n: "ñ",
  o: "ô",
  p: "þ",
  q: "ɋ",
  r: "ř",
  s: "ş",
  t: "ţ",
  u: "ü",
  v: "ṽ",
  w: "ŵ",
  x: "ẋ",
  y: "ÿ",
  z: "ž",
};

const localizeSegment = (segment) =>
  segment
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      const mapped = pseudoMap[lower];
      if (!mapped) return char;
      return char === lower ? mapped : mapped.toUpperCase();
    })
    .join("");

const pseudoLocalize = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => pseudoLocalize(entry));
  }
  if (typeof value !== "string") return value;
  const segments = value.split(/(\{[^}]+\})/g);
  const localized = segments
    .map((segment) => (segment.startsWith("{") && segment.endsWith("}") ? segment : localizeSegment(segment)))
    .join("");
  const expansion = Math.ceil(localized.length * 0.35);
  return `⟪${localized}${"ː".repeat(expansion)}⟫`;
};

const splitMeta = (raw) => {
  if (!raw || typeof raw !== "object") return { meta: {}, entries: {} };
  const { meta, ...entries } = raw;
  return { meta: meta || {}, entries };
};

const namespaceForKey = (key) => {
  const prefix = key.split(".")[0];
  return UI_PREFIXES.has(prefix) ? "ui" : "content";
};

const recordMissingKey = (language, key) => {
  if (!missingKeys.has(language)) {
    missingKeys.set(language, new Set());
  }
  const bucket = missingKeys.get(language);
  if (!bucket.has(key)) {
    bucket.add(key);
    console.warn(`Missing i18n keys for ${language}:`, Array.from(bucket).sort());
  }
};

export const loadLanguage = async (episodeId, language) => {
  const response = await fetch(`./episodes/${episodeId}/i18n/${language}.json`);
  if (!response.ok) {
    console.warn(`Missing translation file for ${language}`);
    dictionaries[language] = {};
    languageMeta[language] = { locale: language, languageName: language.toUpperCase() };
    return;
  }
  const data = await response.json();
  const { meta, entries } = splitMeta(data);
  dictionaries[language] = entries;
  languageMeta[language] = meta || { locale: language, languageName: language.toUpperCase() };
};

export const setAvailableLanguages = (languages) => {
  languages.forEach((language) => {
    if (!dictionaries[language]) {
      dictionaries[language] = {};
    }
    if (!languageMeta[language]) {
      languageMeta[language] = { locale: language, languageName: language.toUpperCase() };
    }
  });
};

export const ensurePseudoLocale = () => {
  if (dictionaries.ps && Object.keys(dictionaries.ps).length) return;
  const base = dictionaries.en || {};
  const pseudoDict = {};
  Object.entries(base).forEach(([key, value]) => {
    pseudoDict[key] = pseudoLocalize(value);
  });
  dictionaries.ps = pseudoDict;
  languageMeta.ps = languageMeta.ps || {
    locale: "ps",
    languageName: "Pseudo",
    version: "debug",
    translator: "Engine",
  };
};

export const getLanguageMeta = (language) => languageMeta[language] || {};

export const getLanguageLabel = (language) => {
  const meta = getLanguageMeta(language);
  return meta.languageName || language.toUpperCase();
};

const findTranslation = (language, key) => {
  const langDict = dictionaries[language] || {};
  if (key in langDict) return { value: langDict[key], source: language };
  const frDict = dictionaries.fr || {};
  if (key in frDict) return { value: frDict[key], source: "fr" };
  const enDict = dictionaries.en || {};
  if (key in enDict) return { value: enDict[key], source: "en" };
  return { value: key, source: "key" };
};

export const t = (key) => {
  const { language } = store.getState();
  const result = findTranslation(language, key);
  if (result.source === language) return result.value;
  recordMissingKey(language, key);
  return result.value;
};

export const tArray = (key) => {
  const value = t(key);
  return Array.isArray(value) ? value : [];
};

export const coverageReport = (language = store.getState().language) => {
  const baseline = dictionaries.en || {};
  const langDict = dictionaries[language] || {};
  const report = { language, ui: {}, content: {} };
  const totals = { ui: 0, content: 0 };
  const missing = { ui: 0, content: 0 };

  Object.keys(baseline).forEach((key) => {
    const namespace = namespaceForKey(key);
    totals[namespace] += 1;
    if (!(key in langDict)) {
      missing[namespace] += 1;
    }
  });

  ["ui", "content"].forEach((namespace) => {
    const total = totals[namespace];
    const missingCount = missing[namespace];
    report[namespace] = {
      total,
      missing: missingCount,
      coverage: total ? Math.round(((total - missingCount) / total) * 100) : 100,
    };
  });

  return report;
};

export const missingKeysReport = (language = store.getState().language) => {
  const baseline = dictionaries.en || {};
  const langDict = dictionaries[language] || {};
  const report = { ui: [], content: [] };

  Object.keys(baseline).forEach((key) => {
    if (key in langDict) return;
    const namespace = namespaceForKey(key);
    report[namespace].push(key);
  });

  report.ui.sort();
  report.content.sort();
  return report;
};

export const getMissingCriticalKeys = (language = store.getState().language) => {
  const langDict = dictionaries[language] || {};
  return CRITICAL_UI_KEYS.filter((key) => !(key in langDict));
};
