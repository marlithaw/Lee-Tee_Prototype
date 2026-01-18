import { store } from "./store.js";

const dictionaries = {};
const missingKeys = new Set();
const UI_PREFIXES = ["ui.", "dashboard.", "settings.", "nav.", "section."];
const CONTENT_PREFIXES = [
  "episode.",
  "objectives.",
  "strategies.",
  "helpers.",
  "sections.",
  "vocab.",
  "story.",
  "practice.",
  "check.",
  "reflect.",
  "writing.",
  "media.",
];
const CRITICAL_UI_KEYS = [
  "ui.language",
  "ui.resetProgress",
  "ui.stop",
  "ui.resume",
  "ui.close",
  "ui.loadFailed",
  "ui.i18nErrorTitle",
  "ui.i18nErrorMessage",
  "ui.i18nErrorMissing",
  "dashboard.title",
  "settings.title",
  "nav.ariaLabel",
  "section.complete",
  "section.completed",
  "check.correct",
  "check.incorrect",
];

const getKeys = (dictionary) => Object.keys(dictionary || {}).filter((key) => key !== "meta");

const pseudoLocalize = (value) => {
  if (Array.isArray(value)) return value.map((item) => pseudoLocalize(item));
  if (typeof value !== "string") return value;
  const accents = {
    a: "à",
    b: "ƀ",
    c: "ç",
    d: "đ",
    e: "ë",
    f: "ƒ",
    g: "ğ",
    h: "ħ",
    i: "ï",
    j: "ĵ",
    k: "ķ",
    l: "ľ",
    m: "ɱ",
    n: "ñ",
    o: "ô",
    p: "þ",
    q: "ɋ",
    r: "ř",
    s: "š",
    t: "ŧ",
    u: "ü",
    v: "ṽ",
    w: "ŵ",
    x: "ẋ",
    y: "ÿ",
    z: "ž",
  };
  const expanded = value.replace(/[A-Za-z]/g, (char) => {
    const lower = char.toLowerCase();
    const mapped = accents[lower] || char;
    return char === lower ? mapped : mapped.toUpperCase();
  });
  const padLength = Math.ceil(expanded.length * 0.35);
  const padding = "·".repeat(padLength);
  return `⟦${expanded}${padding}⟧`;
};

const getNamespace = (key) => {
  if (UI_PREFIXES.some((prefix) => key.startsWith(prefix))) return "ui";
  if (CONTENT_PREFIXES.some((prefix) => key.startsWith(prefix))) return "content";
  return "content";
};

const logMissingKeys = (language, keys) => {
  keys.forEach((key) => missingKeys.add(`${language}:${key}`));
  console.warn(`Missing i18n keys for ${language}:`, Array.from(missingKeys).sort());
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

export const getLanguageMeta = (language) => dictionaries[language]?.meta || {};
export const getBaseString = (key) => dictionaries.en?.[key] || key;

export const t = (key) => {
  const { language } = store.getState();
  const langDict = dictionaries[language] || {};
  const frDict = dictionaries.fr || {};
  const enDict = dictionaries.en || {};

  if (language === "ps") {
    if (key in langDict) return langDict[key];
    if (key in enDict) {
      logMissingKeys(language, [key]);
      return pseudoLocalize(enDict[key]);
    }
    logMissingKeys("baseline", [key]);
    return key;
  }
  if (key in langDict) return langDict[key];
  if (key in frDict) {
    logMissingKeys(language, [key]);
    return frDict[key];
  }
  if (key in enDict) {
    logMissingKeys(language, [key]);
    logMissingKeys("fr", [key]);
    return enDict[key];
  }
  logMissingKeys("baseline", [key]);
  return key;
};

export const tArray = (key) => {
  const value = t(key);
  return Array.isArray(value) ? value : [];
};

export const missingKeysReport = (language = store.getState().language) => {
  const baseline = dictionaries.en || {};
  const comparison = dictionaries[language] || {};
  const report = { ui: [], content: [] };

  getKeys(baseline).forEach((key) => {
    if (key in comparison) return;
    const namespace = getNamespace(key);
    report[namespace].push(key);
  });

  Object.keys(report).forEach((namespace) => report[namespace].sort());
  return report;
};

export const coverageReport = (language = store.getState().language) => {
  const baseline = dictionaries.en || {};
  const comparison = dictionaries[language] || {};
  const totals = { ui: 0, content: 0 };
  const covered = { ui: 0, content: 0 };

  getKeys(baseline).forEach((key) => {
    const namespace = getNamespace(key);
    totals[namespace] += 1;
    if (key in comparison) covered[namespace] += 1;
  });

  return {
    ui: {
      covered: covered.ui,
      total: totals.ui,
      percent: totals.ui ? Math.round((covered.ui / totals.ui) * 100) : 100,
    },
    content: {
      covered: covered.content,
      total: totals.content,
      percent: totals.content ? Math.round((covered.content / totals.content) * 100) : 100,
    },
  };
};

export const getMissingCriticalKeys = (language = store.getState().language) => {
  const comparison = dictionaries[language] || {};
  return CRITICAL_UI_KEYS.filter((key) => !(key in comparison));
};
