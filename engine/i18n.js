import { updateState, getState } from './store.js';

let currentLang = 'en';
let dictionaries = {};
let missingKeys = new Set();

function getValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export async function loadI18n(episodeId, languages) {
  const requests = languages.map(async (lang) => {
    const response = await fetch(`episodes/${episodeId}/i18n/${lang}.json`);
    if (!response.ok) {
      console.warn(`Missing i18n file for ${lang}`);
      return [lang, {}];
    }
    return [lang, await response.json()];
  });
  const results = await Promise.all(requests);
  dictionaries = Object.fromEntries(results);
  const state = getState();
  currentLang = state.language in dictionaries ? state.language : 'en';
}

export function setLanguage(lang) {
  if (!dictionaries[lang]) return;
  currentLang = lang;
  updateState((state) => ({ ...state, language: lang }));
  missingKeys = new Set();
}

export function t(key) {
  const langValue = getValue(dictionaries[currentLang], key);
  if (langValue !== undefined) return langValue;
  const enValue = getValue(dictionaries.en, key);
  if (enValue !== undefined) {
    missingKeys.add(key);
    console.warn(`Missing i18n keys in ${currentLang}: ${Array.from(missingKeys).join(', ')}`);
    return enValue;
  }
  return key;
}

export function getLanguage() {
  return currentLang;
}
