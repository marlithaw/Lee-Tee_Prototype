/**
 * Settings Persistence Module
 * Handles accessibility settings, learning mode, and preferences
 */

class SettingsManager {
  constructor(episodeId) {
    this.episodeId = episodeId;
    this.stateKey = `leeTeeEpisode${episodeId}Settings`;
    this.globalKey = 'leeTeeGlobalSettings';

    this.settings = {
      dyslexiaMode: false,
      highContrast: false,
      showHints: false,
      showSiopStrategies: false,
      learningMode: 'lee', // 'lee' or 'tee'
      speechRate: 0.9,
      language: 'en'
    };

    this.callbacks = [];
  }

  /**
   * Initialize settings from localStorage
   */
  init() {
    this.load();
    this.applyToDOM();
    return this;
  }

  /**
   * Load settings from localStorage
   */
  load() {
    // Load global settings first
    const globalSaved = localStorage.getItem(this.globalKey);
    if (globalSaved) {
      try {
        const global = JSON.parse(globalSaved);
        Object.assign(this.settings, global);
      } catch (e) {
        console.error('Failed to load global settings:', e);
      }
    }

    // Override with episode-specific settings
    const episodeSaved = localStorage.getItem(this.stateKey);
    if (episodeSaved) {
      try {
        const episode = JSON.parse(episodeSaved);
        Object.assign(this.settings, episode);
      } catch (e) {
        console.error('Failed to load episode settings:', e);
      }
    }
  }

  /**
   * Save settings to localStorage
   */
  save() {
    localStorage.setItem(this.stateKey, JSON.stringify(this.settings));

    // Also save global settings
    const globalSettings = {
      dyslexiaMode: this.settings.dyslexiaMode,
      highContrast: this.settings.highContrast,
      learningMode: this.settings.learningMode,
      speechRate: this.settings.speechRate,
      language: this.settings.language
    };
    localStorage.setItem(this.globalKey, JSON.stringify(globalSettings));

    this.notifyCallbacks();
  }

  /**
   * Apply settings to DOM
   */
  applyToDOM() {
    const body = document.body;

    // Dyslexia mode
    if (this.settings.dyslexiaMode) {
      body.classList.add('dyslexia-mode');
    } else {
      body.classList.remove('dyslexia-mode');
    }

    // High contrast
    if (this.settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Hints visibility
    document.querySelectorAll('.hint-text').forEach(el => {
      el.style.display = this.settings.showHints ? 'block' : 'none';
    });

    // SIOP strategies visibility
    document.querySelectorAll('.siop-strategy').forEach(el => {
      el.style.display = this.settings.showSiopStrategies ? 'inline-flex' : 'none';
    });
  }

  /**
   * Toggle a boolean setting
   * @param {string} key - Setting key
   * @returns {boolean} - New value
   */
  toggle(key) {
    if (typeof this.settings[key] === 'boolean') {
      this.settings[key] = !this.settings[key];
      this.save();
      this.applyToDOM();
      return this.settings[key];
    }
    return false;
  }

  /**
   * Get a setting value
   * @param {string} key - Setting key
   * @returns {*} - Setting value
   */
  get(key) {
    return this.settings[key];
  }

  /**
   * Set a setting value
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   */
  set(key, value) {
    this.settings[key] = value;
    this.save();
    this.applyToDOM();
  }

  /**
   * Register callback for settings changes
   * @param {Function} callback
   */
  onChange(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Notify all registered callbacks
   */
  notifyCallbacks() {
    this.callbacks.forEach(cb => cb(this.settings));
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SettingsManager };
}
