const cache = {};
let currentLang = "en";
let translations = {};
let missingKeys = new Set();

const flattenKeys = (obj, prefix = "") => {
  const entries = {};
  Object.entries(obj || {}).forEach(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(entries, flattenKeys(value, nextKey));
    } else {
      entries[nextKey] = value;
    }
  });
  return entries;
};

const mergeDeep = (base, override) => {
  const output = { ...base };
  Object.entries(override || {}).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      output[key] = mergeDeep(base?.[key] || {}, value);
    } else {
      output[key] = value;
    }
  });
  return output;
};

export const loadTranslations = async (episodeId, lang) => {
  currentLang = lang;
  const baseUrl = `episodes/${episodeId}/i18n`;
  const [en, langPack] = await Promise.all([
    fetch(`${baseUrl}/en.json`).then((res) => res.json()),
    lang === "en" ? Promise.resolve({}) : fetch(`${baseUrl}/${lang}.json`).then((res) => res.json()),
  ]);

  translations = mergeDeep(en, langPack);
  const flatEn = flattenKeys(en);
  const flatCurrent = flattenKeys(translations);
  missingKeys = new Set();
  Object.keys(flatEn).forEach((key) => {
    if (flatCurrent[key] === undefined) missingKeys.add(key);
  });
  if (missingKeys.size) {
    console.warn(`Missing i18n keys for ${lang}:`, Array.from(missingKeys));
  }
  cache[lang] = translations;
  return translations;
};

export const t = (key) => {
  const parts = key.split(".");
  let cursor = translations;
  for (const part of parts) {
    cursor = cursor?.[part];
  }
  if (cursor === undefined) {
    missingKeys.add(key);
    console.warn(`Missing i18n key: ${key}`);
    return key;
  }
  return cursor;
};

export const getCurrentLang = () => currentLang;
