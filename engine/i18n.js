export async function createI18n({ languages, defaultLang, episodeId }) {
  const translations = {};
  const missingKeys = new Set();
  let language = defaultLang || 'en';
  let missingCallback = () => {};
  let reportScheduled = false;

  async function loadLanguage(lang) {
    if (translations[lang]) return;
    const response = await fetch(`./episodes/${episodeId}/i18n/${lang}.json`);
    translations[lang] = await response.json();
  }

  await Promise.all(languages.map((lang) => loadLanguage(lang)));

  function setLanguage(nextLang) {
    language = nextLang;
    missingKeys.clear();
    reportMissing();
  }

  function t(key, vars = {}) {
    const current = translations[language] || {};
    const fallback = translations.en || {};
    let value = current[key];
    if (value === undefined) {
      if (fallback[key] !== undefined) {
        value = fallback[key];
        missingKeys.add(key);
      } else {
        value = key;
        missingKeys.add(key);
      }
      if (!reportScheduled) {
        reportScheduled = true;
        setTimeout(() => {
          reportScheduled = false;
          reportMissing();
        }, 0);
      }
    }
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, token) => {
        return vars[token] ?? `{${token}}`;
      });
    }
    return value;
  }

  function reportMissing() {
    const keys = Array.from(missingKeys);
    missingKeys.clear();
    missingCallback(keys);
  }

  function onMissingKeys(callback) {
    missingCallback = callback;
    reportMissing();
  }

  return {
    t,
    setLanguage,
    getLanguage: () => language,
    onMissingKeys,
  };
}
