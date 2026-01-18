import { store } from "./store.js";

const dictionaries = {};
const missingKeys = new Set();

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

export const t = (key) => {
  const { language } = store.getState();
  const langDict = dictionaries[language] || {};
  const enDict = dictionaries.en || {};
  if (key in langDict) return langDict[key];
  if (!(key in enDict)) {
    if (!missingKeys.has(key)) {
      missingKeys.add(key);
      console.warn("Missing i18n keys:", Array.from(missingKeys).sort());
    }
    return key;
  }
  const missingTag = `${language}:${key}`;
  if (!missingKeys.has(missingTag)) {
    missingKeys.add(missingTag);
    console.warn("Missing i18n keys:", Array.from(missingKeys).sort());
  }
  return enDict[key];
};

export const tArray = (key) => {
  const value = t(key);
  return Array.isArray(value) ? value : [];
};
