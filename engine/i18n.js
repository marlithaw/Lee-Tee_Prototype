import { updateLanguage, getState } from "./store.js";

let translations = {};
let fallbackTranslations = {};
let missingKeys = new Set();

export const loadI18n = async (episodeId, lang) => {
  const [fallback, current] = await Promise.all([
    fetch(`episodes/${episodeId}/i18n/en.json`).then((res) => res.json()),
    fetch(`episodes/${episodeId}/i18n/${lang}.json`).then((res) => res.json()),
  ]);
  fallbackTranslations = fallback;
  translations = current;
  missingKeys = new Set();
};

const readKey = (obj, key) => {
  return key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

export const t = (key, fallback) => {
  const value = readKey(translations, key);
  if (value !== undefined) return value;
  const fallbackValue = readKey(fallbackTranslations, key) ?? fallback ?? key;
  missingKeys.add(key);
  return fallbackValue;
};

export const resolveContent = (content, lang) => {
  if (content === null || content === undefined) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    return content[lang] || content.en || "";
  }
  return String(content);
};

export const applyI18n = (root = document) => {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key, el.textContent);
  });
};

export const setLanguage = (lang) => {
  updateLanguage(lang);
};

export const logMissingKeys = (lang) => {
  if (missingKeys.size) {
    console.warn(`Missing i18n keys for ${lang}:`, Array.from(missingKeys));
  }
};

export const getLanguage = () => getState().language;
