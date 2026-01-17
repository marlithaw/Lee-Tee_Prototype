const LANGUAGE_LIST = ["en", "es", "fr", "ht"];

const interpolate = (template, params) => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");
};

export const createI18n = async ({ episodeId, defaultLanguage, initialLanguage }) => {
  const dictionaries = {};
  const missingKeys = {};

  await Promise.all(
    LANGUAGE_LIST.map(async (lang) => {
      const response = await fetch(`./episodes/${episodeId}/i18n/${lang}.json`);
      dictionaries[lang] = await response.json();
      missingKeys[lang] = new Set();
    })
  );

  let currentLanguage = LANGUAGE_LIST.includes(initialLanguage)
    ? initialLanguage
    : defaultLanguage;
  document.documentElement.lang = currentLanguage;

  const warnMissing = (lang) => {
    if (!missingKeys[lang] || missingKeys[lang].size === 0) return;
    console.warn(
      `Missing translations for ${lang}: ${[...missingKeys[lang]].join(", ")}`
    );
    missingKeys[lang].clear();
  };

  const t = (key, params) => {
    const langDict = dictionaries[currentLanguage] || {};
    const fallbackDict = dictionaries[defaultLanguage] || {};
    if (key in langDict) {
      return interpolate(langDict[key], params);
    }
    if (currentLanguage !== defaultLanguage && key in fallbackDict) {
      missingKeys[currentLanguage].add(key);
      warnMissing(currentLanguage);
      return interpolate(fallbackDict[key], params);
    }
    missingKeys[currentLanguage].add(key);
    warnMissing(currentLanguage);
    return key;
  };

  const setLanguage = (lang) => {
    if (!LANGUAGE_LIST.includes(lang)) return;
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent("language-change"));
  };

  return {
    t,
    setLanguage,
    getLanguage: () => currentLanguage,
    getLanguages: () => [...LANGUAGE_LIST],
  };
};
