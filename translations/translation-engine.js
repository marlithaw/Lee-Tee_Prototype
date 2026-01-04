/**
 * Translation Engine for Lee & Tee Episodes
 * Supports Spanish (es), French (fr), Haitian Creole (ht), and English (en)
 * Provides inline on-demand translations with error handling
 */

class TranslationEngine {
  constructor() {
    this.currentLang = 'en';
    this.availableLangs = ['en', 'es', 'fr', 'ht'];
    this.translations = {};
    this.fallbackLang = 'en';
    this.loading = false;
  }

  /**
   * Load translation file for a specific language
   * @param {string} lang - Language code (es, fr, ht, en)
   * @returns {Promise<Object>} Translation data
   */
  async loadLanguage(lang) {
    // Validate language code
    if (!this.availableLangs.includes(lang)) {
      console.warn(`Language '${lang}' not supported. Using ${this.fallbackLang}`);
      lang = this.fallbackLang;
    }

    // English is always available (no file needed)
    if (lang === 'en') {
      this.translations.en = {}; // Empty object means use original text
      return this.translations.en;
    }

    try {
      // Return cached translation if already loaded
      if (this.translations[lang]) {
        return this.translations[lang];
      }

      this.loading = true;
      const response = await fetch(`translations/${lang}.json`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.translations[lang] = await response.json();
      this.loading = false;

      console.log(`✓ Loaded ${lang} translations`);
      return this.translations[lang];

    } catch (error) {
      this.loading = false;
      console.error(`Failed to load translation for '${lang}':`, error);

      // Fallback to English if not already trying English
      if (lang !== this.fallbackLang) {
        console.warn(`Falling back to ${this.fallbackLang}`);
        return await this.loadLanguage(this.fallbackLang);
      }

      return {}; // Return empty object to prevent crashes
    }
  }

  /**
   * Translate a key to target language
   * @param {string} key - Dot-notation key (e.g., "nav.start")
   * @param {string} targetLang - Target language code
   * @returns {string} Translated text or original key if not found
   */
  translate(key, targetLang = this.currentLang) {
    // English always returns original text
    if (targetLang === 'en') {
      return null; // Caller should use original HTML text
    }

    // Check if language is loaded
    if (!this.translations[targetLang]) {
      console.warn(`Language '${targetLang}' not loaded yet`);
      return key; // Return key as fallback
    }

    // Navigate through nested keys
    const keys = key.split('.');
    let value = this.translations[targetLang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: '${key}' in '${targetLang}'`);
        return key; // Fallback to key if path not found
      }
    }

    return value || key;
  }

  /**
   * Show inline translation tooltip on element
   * @param {HTMLElement} element - Element with data-translate attribute
   * @param {string} targetLang - Language to show
   */
  showInlineTranslation(element, targetLang) {
    const key = element.getAttribute('data-translate');
    if (!key) {
      console.warn('Element missing data-translate attribute');
      return;
    }

    const translation = this.translate(key, targetLang);

    // Create or update tooltip
    let tooltip = element.querySelector('.translation-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'translation-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      element.style.position = 'relative'; // Ensure parent is positioned
      element.appendChild(tooltip);
    }

    tooltip.textContent = translation;
    tooltip.classList.add('visible');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      tooltip.classList.remove('visible');
    }, 5000);
  }

  /**
   * Hide inline translation tooltip
   * @param {HTMLElement} element - Element containing tooltip
   */
  hideInlineTranslation(element) {
    const tooltip = element.querySelector('.translation-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  /**
   * Switch entire page to a language (full page mode)
   * @param {string} lang - Language code
   */
  async switchLanguage(lang) {
    await this.loadLanguage(lang);
    this.currentLang = lang;

    // Update all elements with data-translate
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
      const key = el.getAttribute('data-translate');
      const translation = this.translate(key, lang);

      if (lang === 'en') {
        // Restore original text (stored in data-original)
        const original = el.getAttribute('data-original');
        if (original) {
          el.textContent = original;
        }
      } else {
        // Store original if not already stored
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', el.textContent);
        }
        el.textContent = translation;
      }
    });

    // Update language selector UI
    document.documentElement.setAttribute('lang', lang);
    console.log(`✓ Page language switched to ${lang}`);
  }

  /**
   * Get all available languages with display names
   * @returns {Array<Object>} Language options
   */
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'es', name: 'Spanish', native: 'Español' },
      { code: 'fr', name: 'French', native: 'Français' },
      { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl Ayisyen' }
    ];
  }

  /**
   * Check if translation engine is ready
   * @returns {boolean}
   */
  isReady() {
    return !this.loading && Object.keys(this.translations).length > 0;
  }
}

// Initialize global translator instance
const translator = new TranslationEngine();

// Load default language on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await translator.loadLanguage('en');
      console.log('✓ Translation engine ready');
    } catch (error) {
      console.error('Failed to initialize translation engine:', error);
    }
  });
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationEngine;
}
