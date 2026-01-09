/**
 * Adaptive Helper System for Lee & Tee
 * Suggests Lee (scaffolding) or Tee (strategy) based on student struggle patterns
 */

class AdaptiveHelpers {
  constructor() {
    this.stateKey = 'leeTee_adaptive_helper_state';
    this.characterChoice = null; // 'lee' or 'tee' - set by student
    this.strugglingActivities = [];
    this.helperSuggestions = [];
    this.suggestionDelay = 30000; // 30 seconds before suggesting help
    this.timers = {};

    // Struggle detection thresholds
    this.thresholds = {
      incorrectAttempts: 2,  // 2+ wrong answers = struggling
      timeOnTask: 60000,     // 60 seconds on same activity = struggling
      stalls: 3              // 3+ long pauses = struggling
    };
  }

  /**
   * Initialize the adaptive helper system
   */
  init() {
    try {
      this.loadState();
      this.attachActivityListeners();
      console.log('✓ Adaptive helpers initialized');
    } catch (error) {
      console.error('Failed to initialize adaptive helpers:', error);
    }
  }

  /**
   * Load saved state from localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem(this.stateKey);
      if (saved) {
        const state = JSON.parse(saved);
        this.characterChoice = state.characterChoice || null;
        this.strugglingActivities = state.strugglingActivities || [];
        console.log(`Character choice: ${this.characterChoice || 'not set'}`);
      }
    } catch (error) {
      console.error('Failed to load adaptive helper state:', error);
    }
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.stateKey, JSON.stringify({
        characterChoice: this.characterChoice,
        strugglingActivities: this.strugglingActivities,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save adaptive helper state:', error);
    }
  }

  /**
   * Set student's character choice (Lee or Tee)
   * @param {string} character - 'lee' or 'tee'
   */
  setCharacterChoice(character) {
    if (character !== 'lee' && character !== 'tee') {
      console.warn(`Invalid character choice: ${character}`);
      return;
    }

    this.characterChoice = character;
    this.saveState();

    console.log(`✓ Character choice set to: ${character}`);

    // Adjust UI based on choice
    this.applyCharacterPreferences();
  }

  /**
   * Apply UI/scaffold adjustments based on character choice
   */
  applyCharacterPreferences() {
    if (!this.characterChoice) return;

    const body = document.body;

    if (this.characterChoice === 'lee') {
      // Lee = more scaffolds, sentence frames, word banks
      body.classList.add('helper-mode-lee');
      body.classList.remove('helper-mode-tee');
      this.showScaffolds(true);
    } else {
      // Tee = strategic questions, minimal scaffolds
      body.classList.add('helper-mode-tee');
      body.classList.remove('helper-mode-lee');
      this.showScaffolds(false);
    }
  }

  /**
   * Show or hide scaffolding elements
   * @param {boolean} show - Show scaffolds (Lee mode) or hide (Tee mode)
   */
  showScaffolds(show) {
    const scaffolds = document.querySelectorAll('[data-scaffold]');
    scaffolds.forEach(scaffold => {
      scaffold.style.display = show ? 'block' : 'none';
    });
  }

  /**
   * Attach listeners to track activity engagement
   */
  attachActivityListeners() {
    // Track incorrect answers
    document.addEventListener('answer-incorrect', (e) => {
      this.trackIncorrectAttempt(e.detail.activityId);
    });

    // Track time on task (activity focus)
    document.addEventListener('activity-focus', (e) => {
      this.startTimeTracking(e.detail.activityId);
    });

    // Track activity blur (leaving activity)
    document.addEventListener('activity-blur', (e) => {
      this.stopTimeTracking(e.detail.activityId);
    });
  }

  /**
   * Track incorrect attempt on an activity
   * @param {string} activityId - Activity identifier
   */
  trackIncorrectAttempt(activityId) {
    const activity = this.strugglingActivities.find(a => a.id === activityId);

    if (activity) {
      activity.incorrectAttempts++;
    } else {
      this.strugglingActivities.push({
        id: activityId,
        incorrectAttempts: 1,
        timeOnTask: 0,
        stalls: 0
      });
    }

    // Check if should suggest help
    this.checkForStruggle(activityId);
    this.saveState();
  }

  /**
   * Start tracking time on activity
   * @param {string} activityId - Activity identifier
   */
  startTimeTracking(activityId) {
    this.timers[activityId] = {
      start: Date.now(),
      warningShown: false
    };

    // Set timer to check for prolonged struggle
    setTimeout(() => {
      if (this.timers[activityId] && !this.timers[activityId].warningShown) {
        this.checkForStruggle(activityId);
      }
    }, this.thresholds.timeOnTask);
  }

  /**
   * Stop tracking time on activity
   * @param {string} activityId - Activity identifier
   */
  stopTimeTracking(activityId) {
    if (this.timers[activityId]) {
      const elapsed = Date.now() - this.timers[activityId].start;
      delete this.timers[activityId];

      // Update activity record
      const activity = this.strugglingActivities.find(a => a.id === activityId);
      if (activity) {
        activity.timeOnTask += elapsed;
      }
    }
  }

  /**
   * Check if student is struggling and suggest help
   * @param {string} activityId - Activity identifier
   */
  checkForStruggle(activityId) {
    const activity = this.strugglingActivities.find(a => a.id === activityId);
    if (!activity) return;

    const isStruggling =
      activity.incorrectAttempts >= this.thresholds.incorrectAttempts ||
      activity.timeOnTask >= this.thresholds.timeOnTask ||
      activity.stalls >= this.thresholds.stalls;

    if (isStruggling) {
      // Decide which helper to suggest
      const suggestedHelper = this.decideSuggestedHelper(activity);
      this.suggestHelper(suggestedHelper, activityId);
    }
  }

  /**
   * Decide which helper to suggest based on struggle type
   * @param {Object} activity - Activity struggle data
   * @returns {string} 'lee' or 'tee'
   */
  decideSuggestedHelper(activity) {
    // If student chose Lee but struggling = suggest Tee (try different approach)
    // If student chose Tee but struggling = suggest Lee (needs more support)
    // If no choice yet = suggest based on struggle type

    if (this.characterChoice === 'lee') {
      // Lee student struggling = try Tee's strategy
      return 'tee';
    } else if (this.characterChoice === 'tee') {
      // Tee student struggling = try Lee's scaffolds
      return 'lee';
    } else {
      // No choice = multiple incorrect attempts = suggest Lee (more support)
      //           = taking long time = suggest Tee (strategic approach)
      return activity.incorrectAttempts >= this.thresholds.incorrectAttempts ? 'lee' : 'tee';
    }
  }

  /**
   * Suggest helper to student
   * @param {string} helper - 'lee' or 'tee'
   * @param {string} activityId - Activity identifier
   */
  suggestHelper(helper, activityId) {
    // Check if suggestion already shown for this activity
    if (this.helperSuggestions.includes(activityId)) {
      return;
    }

    this.helperSuggestions.push(activityId);

    // Show suggestion UI
    this.showHelperSuggestion(helper, activityId);

    console.log(`Suggesting ${helper} helper for activity ${activityId}`);
  }

  /**
   * Show helper suggestion UI
   * @param {string} helper - 'lee' or 'tee'
   * @param {string} activityId - Activity identifier
   */
  showHelperSuggestion(helper, activityId) {
    // Create suggestion notification
    const suggestion = document.createElement('div');
    suggestion.className = `helper-suggestion helper-suggestion--${helper}`;
    suggestion.setAttribute('role', 'alert');
    suggestion.innerHTML = `
      <div class="helper-suggestion__avatar">
        <img src="${helper === 'lee' ? 'images/lee-avatar.png' : 'images/tee-avatar.png'}" alt="${helper}">
      </div>
      <div class="helper-suggestion__content">
        <p class="helper-suggestion__title">
          ${helper === 'lee' ? 'Lee says:' : 'Tee says:'}
        </p>
        <p class="helper-suggestion__message">
          ${this.getHelperMessage(helper, activityId)}
        </p>
      </div>
      <button class="helper-suggestion__accept" onclick="adaptiveHelpers.acceptHelper('${helper}', '${activityId}')">
        Yes, help me!
      </button>
      <button class="helper-suggestion__dismiss" onclick="adaptiveHelpers.dismissSuggestion('${activityId}')">
        No thanks
      </button>
    `;

    // Add to page
    document.body.appendChild(suggestion);

    // Auto-dismiss after 10 seconds if no response
    setTimeout(() => {
      if (suggestion.parentNode) {
        this.dismissSuggestion(activityId);
      }
    }, 10000);
  }

  /**
   * Get context-appropriate helper message
   * @param {string} helper - 'lee' or 'tee'
   * @param {string} activityId - Activity identifier
   * @returns {string} Message to display
   */
  getHelperMessage(helper, activityId) {
    if (helper === 'lee') {
      return "I can help you get started with sentence frames and word banks!";
    } else {
      return "Let me ask you some questions to help you think through this strategically.";
    }
  }

  /**
   * Accept helper suggestion
   * @param {string} helper - 'lee' or 'tee'
   * @param {string} activityId - Activity identifier
   */
  acceptHelper(helper, activityId) {
    this.dismissSuggestion(activityId);

    // Open helper modal with context
    this.openHelperModal(helper, activityId);

    // Track acceptance
    console.log(`Student accepted ${helper} helper for ${activityId}`);
  }

  /**
   * Dismiss helper suggestion
   * @param {string} activityId - Activity identifier
   */
  dismissSuggestion(activityId) {
    const suggestion = document.querySelector(`.helper-suggestion[data-activity="${activityId}"]`);
    if (suggestion) {
      suggestion.remove();
    }
  }

  /**
   * Open helper modal with contextual content
   * @param {string} helper - 'lee' or 'tee'
   * @param {string} activityId - Activity identifier
   */
  openHelperModal(helper, activityId) {
    // This would trigger the existing helper modal system
    // with context-specific content for the activity

    const event = new CustomEvent('open-helper', {
      detail: { helper, activityId }
    });
    document.dispatchEvent(event);
  }

  /**
   * Reset struggle tracking (for new attempt)
   */
  resetStruggleTracking() {
    this.strugglingActivities = [];
    this.helperSuggestions = [];
    this.saveState();
  }

  /**
   * Get current struggle data (for debugging/analytics)
   * @returns {Array} Struggle data
   */
  getStruggleData() {
    return this.strugglingActivities;
  }
}

// Initialize global adaptive helpers instance
const adaptiveHelpers = new AdaptiveHelpers();

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    adaptiveHelpers.init();
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdaptiveHelpers;
}
