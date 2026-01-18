export const createI18n = async ({ episodeId, defaultLang, supportedLangs, storedLang }) => {
  const dictionaries = {};
  const missingKeys = new Set();
  const loadLang = async (lang) => {
    const res = await fetch(`./episodes/${episodeId}/i18n/${lang}.json`);
    dictionaries[lang] = await res.json();
  };

  await Promise.all(supportedLangs.map(loadLang));

  const getValue = (lang, key) => {
    const value = key.split('.').reduce((acc, part) => acc && acc[part], dictionaries[lang]);
    return value;
  };

  const format = (text, vars = {}) => {
    if (typeof text !== 'string') return text;
    return Object.entries(vars).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
      text
    );
  };

  const i18n = {
    supportedLangs,
    language: supportedLangs.includes(storedLang) ? storedLang : defaultLang,
    setLanguage(lang) {
      i18n.language = supportedLangs.includes(lang) ? lang : defaultLang;
      missingKeys.clear();
    },
    t(key, vars) {
      const value = getValue(i18n.language, key);
      if (value !== undefined) return format(value, vars);
      const fallback = getValue(defaultLang, key);
      missingKeys.add(key);
      if (missingKeys.size) {
        console.warn('Missing translations:', Array.from(missingKeys));
      }
      return format(fallback || key, vars);
    },
    getLanguageLabel(lang) {
      return getValue(lang, 'ui.languageName') || lang.toUpperCase();
    },
  };

  return i18n;
};
