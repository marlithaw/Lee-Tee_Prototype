/**
 * Translation Engine for Lee & Tee Episodes
 * Supports Spanish (es), French (fr), Haitian Creole (ht), and English (en)
 * Provides inline on-demand translations with error handling and bilingual story rendering
 */

class TranslationEngine {
  constructor() {
    this.currentLang = 'en';
    this.availableLangs = ['en', 'es', 'fr', 'ht'];
    this.uiTranslations = {};
    this.storyTranslations = {};
    this.fallbackLang = 'en';
    this.loading = false;
    this.mixConfig = {
      // Alternate every other sentence for bilingual display (50% mix)
      ratio: 0.5,
      strategy: 'alternate'
    };
    this.selectorTranslations = [
      { selector: '.language-objective h4', key: 'banners.language_objective_title' },
      { selector: '.language-objective p', key: 'banners.language_objective_body' },
      { selector: '.content-objective h4', key: 'banners.content_objective_title' },
      { selector: '.content-objective p', key: 'banners.content_objective_body' },
      { selector: '.hero-gradient .font-display', key: 'hero.title' },
      { selector: '.hero-gradient .text-lg', key: 'hero.subtitle' },
      { selector: '.standard-tag .standard-code', key: 'hero.standard_code' },
      { selector: '.standard-tag span:last-child', key: 'hero.standard_label' },
      { selector: '.language-toggle label', key: 'ui.language_label' }
    ];
  }

  async loadLanguage(lang) {
    if (!this.availableLangs.includes(lang)) {
      console.warn(`Language '${lang}' not supported. Using ${this.fallbackLang}`);
      lang = this.fallbackLang;
    }

    if (!this.uiTranslations[lang]) {
      this.uiTranslations[lang] = await this.fetchJson(`locales/${lang}.json`);
    }

    if (!this.storyTranslations[lang]) {
      this.storyTranslations[lang] = await this.fetchJson(`locales/story.${lang}.json`);
    }

    return this.uiTranslations[lang];
  }

  async fetchJson(path) {
    try {
      this.loading = true;
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      console.error(`Failed to load ${path}:`, error);
      return {};
    }
  }

  t(key, fallback = '') {
    const value = this.lookup(key, this.currentLang);
    if (value !== undefined) return value;
    const fallbackValue = this.lookup(key, this.fallbackLang);
    if (fallbackValue !== undefined) return fallbackValue;
    return fallback || key;
  }

  lookup(key, lang) {
    const translations = this.uiTranslations[lang];
    if (!translations) return undefined;
    return key.split('.').reduce((obj, part) => obj && obj[part], translations);
  }

  async applyLanguage(lang) {
    // Always ensure fallback is loaded for bilingual story mixing
    await this.loadLanguage(this.fallbackLang);
    await this.loadLanguage(lang);
    this.currentLang = lang;
    localStorage.setItem('preferred-language', lang);
    document.documentElement.setAttribute('lang', lang);
    this.translatePage();
    this.renderStoryLanguage(lang);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  async switchLanguage(lang) {
    await this.applyLanguage(lang);
  }

  translatePage() {
    const lang = this.currentLang;
    if (lang === 'en') {
      document.querySelectorAll('[data-original]').forEach(el => {
        const original = el.getAttribute('data-original');
        if (original) el.textContent = original;
      });
    }

    // Explicit data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key, el.textContent.trim());
      this.setText(el, translation);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key, el.getAttribute('placeholder') || '');
      el.setAttribute('placeholder', translation);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      const translation = this.t(key, el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', translation);
    });

    // Selector-based translations for existing markup
    this.selectorTranslations.forEach(({ selector, key }) => {
      document.querySelectorAll(selector).forEach(el => {
        this.setText(el, this.t(key, el.textContent.trim()));
      });
    });

    // Translate language selector options
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.setAttribute('aria-label', this.t('ui.language_label', langSelect.getAttribute('aria-label') || 'Language'));
      const optionMap = this.getAvailableLanguages().reduce((acc, lang) => {
        acc[lang.code] = this.t(`languages.${lang.code}`, lang.native);
        return acc;
      }, {});

      [...langSelect.options].forEach(option => {
        const code = option.value;
        if (optionMap[code]) {
          option.textContent = optionMap[code];
        }
      });
    }

    // Translate nav buttons if present
    const navKeys = ['nav.start', 'nav.vocab', 'nav.story', 'nav.strategy', 'nav.model', 'nav.write', 'nav.reflect'];
    document.querySelectorAll('.section-nav__item .section-title').forEach((button, index) => {
      this.setText(button, this.t(navKeys[index], button.textContent.trim()));
    });
  }

  setText(el, text) {
    if (!el.getAttribute('data-original')) {
      el.setAttribute('data-original', el.textContent.trim());
    }
    if (typeof text === 'string' && text.includes('<')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  }

  getStorySentence(section, id, lang) {
    const sectionData = this.storyTranslations[lang]?.sections?.[section];
    if (!sectionData) return undefined;
    return sectionData[id];
  }

  renderStoryLanguage(lang) {
    const englishStory = this.storyTranslations[this.fallbackLang]?.sections || {};
    const containers = document.querySelectorAll('[data-story-section]');
    containers.forEach(container => {
      const sectionId = container.getAttribute('data-story-section');
      const sentences = englishStory[sectionId];
      if (!sentences || !Array.isArray(sentences)) return;

      const fragment = document.createDocumentFragment();
      sentences.forEach((sentence, index) => {
        const paragraph = document.createElement('p');
        paragraph.className = 'story-sentence';
        const shouldTranslate = lang !== 'en' && this.shouldUseTranslation(index);
        const translated = shouldTranslate ? this.getStorySentence(sectionId, sentence.id, lang) : null;

        const content = translated || sentence.text || sentence.html || '';
        if (sentence.html || (translated && translated.includes('<'))) {
          paragraph.innerHTML = content;
        } else {
          paragraph.textContent = content;
        }

        fragment.appendChild(paragraph);
      });

      container.innerHTML = '';
      container.appendChild(fragment);
    });
  }

  shouldUseTranslation(index) {
    if (this.mixConfig.strategy === 'alternate') {
      return index % 2 === 0;
    }
    const interval = Math.max(1, Math.round(1 / this.mixConfig.ratio));
    return index % interval === 0;
  }

  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'es', name: 'Spanish', native: 'Español' },
      { code: 'fr', name: 'French', native: 'Français' },
      { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl Ayisyen' }
    ];
  }

  isReady() {
    return !this.loading && Object.keys(this.uiTranslations).length > 0;
  }
}

const translator = new TranslationEngine();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const stored = localStorage.getItem('preferred-language') || 'en';
      await translator.applyLanguage(stored);
      console.log('✓ Translation engine ready');
    } catch (error) {
      console.error('Failed to initialize translation engine:', error);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationEngine;
}
