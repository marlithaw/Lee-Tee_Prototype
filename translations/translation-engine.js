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
   * Switch entire page to a language (full page mode with automatic detection)
   * @param {string} lang - Language code
   */
  async switchLanguage(lang) {
    await this.loadLanguage(lang);
    this.currentLang = lang;

    if (lang === 'en') {
      // Restore all original text
      document.querySelectorAll('[data-original]').forEach(el => {
        const original = el.getAttribute('data-original');
        if (original) {
          el.textContent = original;
        }
      });
      document.documentElement.setAttribute('lang', 'en');
      console.log('✓ Restored to English');
      return;
    }

    // Automatic translation: Find and translate common UI elements
    this.translateNavigationButtons(lang);
    this.translateCommonButtons(lang);
    this.translateSectionTitles(lang);
    this.translateVocabularyCards(lang);
    this.translateReflectionElements(lang);
    this.translateCelebrationElements(lang);

    // Update language attribute
    document.documentElement.setAttribute('lang', lang);
    console.log(`✓ Page language switched to ${lang}`);
  }

  /**
   * Automatically translate navigation buttons
   */
  translateNavigationButtons(lang) {
    const navButtons = document.querySelectorAll('.section-nav__item .section-title');
    const navKeys = ['nav.start', 'nav.vocab', 'nav.story', 'nav.strategy', 'nav.model', 'nav.write', 'nav.reflect'];

    navButtons.forEach((button, index) => {
      if (navKeys[index]) {
        if (!button.getAttribute('data-original')) {
          button.setAttribute('data-original', button.textContent);
        }
        const translation = this.translate(navKeys[index], lang);
        button.textContent = translation;
      }
    });
  }

  /**
   * Automatically translate common buttons by text matching
   */
  translateCommonButtons(lang) {
    const buttonMap = {
      '🔊 Listen': 'buttons.listen',
      'Read Aloud': 'buttons.read_aloud',
      '⏹️ Stop': 'buttons.stop',
      '🎤 Speak Answer': 'buttons.speak_answer',
      '🗑️ Clear': 'buttons.clear',
      'Try Again': 'buttons.try_again',
      'Next Episode': 'celebration.next_episode'
    };

    document.querySelectorAll('button, a').forEach(el => {
      const text = el.textContent.trim();
      if (buttonMap[text]) {
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', text);
        }
        const translation = this.translate(buttonMap[text], lang);
        if (translation !== buttonMap[text]) {
          el.textContent = translation;
        }
      }
    });
  }

  /**
   * Automatically translate section titles by pattern matching
   */
  translateSectionTitles(lang) {
    const titleMap = {
      'Words You\'ll Need': 'vocab.title',
      'How are you feeling today?': 'sel.question',
      'Choose Your Learning Guide': 'character.title',
      'Reflect on Your Learning': 'reflection.title',
      'Lesson Complete!': 'ui.lesson_complete'
    };

    document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
      const text = el.textContent.trim();
      if (titleMap[text]) {
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', text);
        }
        const translation = this.translate(titleMap[text], lang);
        if (translation !== titleMap[text]) {
          el.textContent = translation;
        }
      }
    });
  }

  /**
   * Automatically translate vocabulary cards
   */
  translateVocabularyCards(lang) {
    const vocabWords = ['Claim', 'Evidence', 'Counterclaim'];
    const vocabKeys = ['vocab.claim', 'vocab.evidence', 'vocab.counterclaim'];

    document.querySelectorAll('.vocab-word, .font-bold.text-purple-700, .font-bold.text-teal-700, .font-bold.text-amber-700').forEach(el => {
      const text = el.textContent.trim();
      const index = vocabWords.indexOf(text);
      if (index !== -1) {
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', text);
        }
        const translation = this.translate(vocabKeys[index], lang);
        if (translation !== vocabKeys[index]) {
          el.textContent = translation;
        }
      }
    });
  }

  /**
   * Automatically translate reflection elements
   */
  translateReflectionElements(lang) {
    const emotionMap = {
      'Excited': 'sel.excited',
      'Calm': 'sel.calm',
      'Nervous': 'sel.nervous',
      'Tired': 'sel.tired',
      'Confident': 'reflection.confident',
      'Curious': 'reflection.curious',
      'Ready!': 'reflection.ready_emotion',
      'Still Unsure': 'reflection.still_unsure'
    };

    document.querySelectorAll('.emotion-option .font-semibold, .emotion-option .text-sm').forEach(el => {
      const text = el.textContent.trim();
      if (emotionMap[text]) {
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', text);
        }
        const translation = this.translate(emotionMap[text], lang);
        if (translation !== emotionMap[text]) {
          el.textContent = translation;
        }
      }
    });
  }

  /**
   * Automatically translate celebration section
   */
  translateCelebrationElements(lang) {
    const celebrationMap = {
      '🔑 Key Takeaway:': 'celebration.key_takeaway',
      '"Loud is not the same as true."': 'celebration.quote',
      '— From Lee\'s notebook': 'celebration.from_notebook',
      'Your Learning Points:': 'celebration.your_points',
      'Great work today!': 'ui.great_work'
    };

    document.querySelectorAll('p, span').forEach(el => {
      const text = el.textContent.trim();
      if (celebrationMap[text]) {
        if (!el.getAttribute('data-original')) {
          el.setAttribute('data-original', text);
        }
        const translation = this.translate(celebrationMap[text], lang);
        if (translation !== celebrationMap[text]) {
          el.textContent = translation;
        }
      }
    });
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
