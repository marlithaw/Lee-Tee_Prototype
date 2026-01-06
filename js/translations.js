// js/translations.js
class TranslationEngine {
  constructor() {
    this.currentLang = 'en';
    this.translations = {};
    this.translatableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'li', 'td', 'th',
      'button', 'a', 'label',
      '[data-translate]', '[data-i18n]'
    ];
  }

  async loadLanguage(lang) {
    console.log(`Loading language: ${lang}`);
    
    // Try to load from external file first
    try {
      const response = await fetch(`translations/${lang}.json`);
      if (response.ok) {
        this.translations[lang] = await response.json();
        console.log(`Loaded translations for ${lang}`);
      } else {
        // Fallback to embedded translations
        await this.loadFallbackTranslations(lang);
      }
    } catch (error) {
      console.warn(`Could not load ${lang}.json, using fallback`);
      await this.loadFallbackTranslations(lang);
    }
  }

  async loadFallbackTranslations(lang) {
    // Basic fallback translations for key terms
    this.translations[lang] = {
      // Episode titles and headers
      "Lee & Tee Episode 1: The Recess Battle": this.getTranslatedTitle(lang),
      "The Recess Battle": this.getTranslatedTitle(lang),
      "How to win an argument without yelling": this.getTranslatedSubtitle(lang),
      "Words You'll Need": this.getTranslatedSection(lang, "vocab"),
      "The Story Begins": this.getTranslatedSection(lang, "story"),
      "Tee's 4-Step Strategy": this.getTranslatedSection(lang, "strategy"),
      
      // Key vocabulary
      "Claim": this.translateWord(lang, "claim"),
      "Evidence": this.translateWord(lang, "evidence"),
      "Counterclaim": this.translateWord(lang, "counterclaim"),
      
      // Buttons and UI
      "Listen": this.translateUI(lang, "listen"),
      "Read Aloud": this.translateUI(lang, "read_aloud"),
      "Continue": this.translateUI(lang, "continue"),
      "Vocabulary": this.translateUI(lang, "vocabulary"),
      "Practice": this.translateUI(lang, "practice"),
      "Check": this.translateUI(lang, "check"),
      "Reflect": this.translateUI(lang, "reflect")
    };
  }

  getTranslatedTitle(lang) {
    const titles = {
      'es': 'Lee y Tee Episodio 1: La Batalla del Recreo',
      'fr': 'Lee & Tee Épisode 1 : La Bataille de la Récréation',
      'ht': 'Lee & Tee Episode 1: Batay Rekreyasyon an',
      'zh': '李与蒂 第一集：课间休息之战',
      'ar': 'لي وتي الحلقة 1: معركة الفسحة'
    };
    return titles[lang] || "Lee & Tee Episode 1: The Recess Battle";
  }

  translateWord(lang, word) {
    const dictionary = {
      'claim': {
        'es': 'Afirmación',
        'fr': 'Revendication',
        'ht': 'Reklamasyon',
        'zh': '主张',
        'ar': 'ادعاء'
      },
      'evidence': {
        'es': 'Evidencia',
        'fr': 'Preuve',
        'ht': 'Prèv',
        'zh': '证据',
        'ar': 'دليل'
      },
      'counterclaim': {
        'es': 'Contraargumento',
        'fr': 'Contre-argument',
        'ht': 'Kontre-argument',
        'zh': '反诉',
        'ar': 'ادعاء مضاد'
      }
    };
    return dictionary[word]?.[lang] || word;
  }

  translateUI(lang, key) {
    const uiTranslations = {
      'listen': {
        'es': 'Escuchar',
        'fr': 'Écouter',
        'ht': 'Koute',
        'zh': '听',
        'ar': 'استمع'
      },
      'read_aloud': {
        'es': 'Leer en voz alta',
        'fr': 'Lire à haute voix',
        'ht': 'Li byen fò',
        'zh': '朗读',
        'ar': 'اقرأ بصوت عال'
      }
    };
    return uiTranslations[key]?.[lang] || key;
  }

  async switchLanguage(lang) {
    try {
      // If language not loaded, load it first
      if (!this.translations[lang]) {
        await this.loadLanguage(lang);
      }
      
      this.currentLang = lang;
      document.documentElement.lang = lang;
      
      // Save preference
      localStorage.setItem('preferred-language', lang);
      
      // Update all translatable elements
      this.updatePageContent(lang);
      
      // Update direction for RTL languages
      if (['ar', 'he', 'fa'].includes(lang)) {
        document.body.style.direction = 'rtl';
        document.body.style.textAlign = 'right';
      } else {
        document.body.style.direction = 'ltr';
        document.body.style.textAlign = 'left';
      }
      
      console.log(`Switched to ${lang}`);
      return true;
    } catch (error) {
      console.error('Language switch failed:', error);
      return false;
    }
  }

  updatePageContent(lang) {
    // Update all text nodes
    this.translatableSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.hasAttribute('data-no-translate')) return;
        
        const originalText = element.textContent.trim();
        if (originalText && this.translations[lang]?.[originalText]) {
          element.textContent = this.translations[lang][originalText];
        }
        
        // Also update placeholder and title attributes
        if (element.placeholder) {
          const translatedPlaceholder = this.translations[lang]?.[element.placeholder];
          if (translatedPlaceholder) {
            element.placeholder = translatedPlaceholder;
          }
        }
        
        if (element.title) {
          const translatedTitle = this.translations[lang]?.[element.title];
          if (translatedTitle) {
            element.title = translatedTitle;
          }
        }
      });
    });
    
    // Update images with alt text
    document.querySelectorAll('img[alt]').forEach(img => {
      const translatedAlt = this.translations[lang]?.[img.alt];
      if (translatedAlt) {
        img.alt = translatedAlt;
      }
    });
  }

  t(key, defaultValue = '') {
    return this.translations[this.currentLang]?.[key] || defaultValue || key;
  }
}

// Create global instance
window.translator = new TranslationEngine();
