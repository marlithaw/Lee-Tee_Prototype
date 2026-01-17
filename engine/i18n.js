let translations = {};
let fallback = {};
let missingKeys = new Set();

export async function loadTranslations(episodeId, lang) {
  missingKeys = new Set();
  const [fallbackRes, langRes] = await Promise.all([
    fetch(`episodes/${episodeId}/i18n/en.json`).then((res) => res.json()),
    fetch(`episodes/${episodeId}/i18n/${lang}.json`).then((res) => res.json()),
  ]);
  fallback = fallbackRes;
  translations = langRes;
  return { fallback: fallbackRes, translations: langRes };
}

export function t(key) {
  if (translations && key in translations) {
    return translations[key];
  }
  if (fallback && key in fallback) {
    if (!missingKeys.has(key)) {
      missingKeys.add(key);
      console.warn(`Missing i18n key: ${key}`);
    }
    return fallback[key];
  }
  if (!missingKeys.has(key)) {
    missingKeys.add(key);
    console.warn(`Missing i18n key: ${key}`);
  }
  return key;
}

export function getMissingKeys() {
  return Array.from(missingKeys);
}

export function applyI18n(root = document) {
  const nodes = root.querySelectorAll("[data-i18n]");
  nodes.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });
}
