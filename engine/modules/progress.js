/**
 * Progress Tracking Module
 * Handles points, badges, activity completion, and progress UI updates
 */

class ProgressManager {
  constructor(episodeId) {
    this.episodeId = episodeId;
    this.stateKey = `leeTeeEpisode${episodeId}Progress`;
    this.globalKey = 'leeTeeGlobalProgress';

    this.state = {
      points: 0,
      badges: [],
      completedActivities: [],
      savedResponses: {},
      emotion: null,
      characterChoice: null,
      currentSection: 1
    };

    this.callbacks = {
      onPointsChange: [],
      onBadgeEarned: [],
      onActivityComplete: []
    };

    this.progressItems = [];
  }

  /**
   * Initialize progress from localStorage
   */
  init() {
    this.load();
    this.updateUI();
    return this;
  }

  /**
   * Load progress from localStorage
   */
  load() {
    const saved = localStorage.getItem(this.stateKey);
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        Object.assign(this.state, loaded);
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }

  /**
   * Save progress to localStorage
   */
  save() {
    localStorage.setItem(this.stateKey, JSON.stringify(this.state));
    this.updateGlobalState();
  }

  /**
   * Update global state with episode progress
   */
  updateGlobalState() {
    let global = {};
    const saved = localStorage.getItem(this.globalKey);
    if (saved) {
      try {
        global = JSON.parse(saved);
      } catch (e) {
        global = {};
      }
    }

    if (!global.episodes) {
      global.episodes = {};
    }

    global.episodes[this.episodeId] = {
      points: this.state.points,
      badges: this.state.badges,
      completedActivities: this.state.completedActivities.length,
      currentSection: this.state.currentSection
    };

    // Update total points
    global.totalPoints = Object.values(global.episodes || {})
      .reduce((sum, ep) => sum + (ep.points || 0), 0);

    localStorage.setItem(this.globalKey, JSON.stringify(global));
  }

  /**
   * Add points and trigger celebration
   * @param {number} amount - Points to add
   * @param {string} reason - Reason for points
   * @returns {number} - New total points
   */
  addPoints(amount, reason) {
    this.state.points += amount;
    this.save();

    // Update UI
    this.updatePointsDisplay();

    // Trigger callbacks
    this.callbacks.onPointsChange.forEach(cb => cb(this.state.points, amount, reason));

    // Show celebration
    this.showCelebration(amount, reason);

    return this.state.points;
  }

  /**
   * Award a badge
   * @param {string} badge - Badge emoji
   * @returns {boolean} - True if newly awarded
   */
  awardBadge(badge) {
    if (!this.state.badges.includes(badge)) {
      this.state.badges.push(badge);
      this.save();
      this.updateBadgesDisplay();

      // Trigger callbacks
      this.callbacks.onBadgeEarned.forEach(cb => cb(badge));

      return true;
    }
    return false;
  }

  /**
   * Mark an activity as complete
   * @param {string} activityId - Activity identifier
   * @returns {boolean} - True if newly completed
   */
  completeActivity(activityId) {
    if (!this.state.completedActivities.includes(activityId)) {
      this.state.completedActivities.push(activityId);
      this.save();

      // Update progress UI
      this.updateProgressItem(activityId, true);

      // Trigger callbacks
      this.callbacks.onActivityComplete.forEach(cb => cb(activityId));

      // Update percentage
      this.updateProgressPercentage();

      return true;
    }
    return false;
  }

  /**
   * Check if an activity is complete
   * @param {string} activityId - Activity identifier
   * @returns {boolean}
   */
  isComplete(activityId) {
    return this.state.completedActivities.includes(activityId);
  }

  /**
   * Register progress items for tracking
   * @param {Array<{id: string, label: string}>} items
   */
  registerProgressItems(items) {
    this.progressItems = items;
  }

  /**
   * Update all progress UI elements
   */
  updateUI() {
    this.updatePointsDisplay();
    this.updateBadgesDisplay();
    this.updateProgressPercentage();

    // Update individual progress items
    this.state.completedActivities.forEach(activityId => {
      this.updateProgressItem(activityId, true);
    });
  }

  /**
   * Update points display
   */
  updatePointsDisplay() {
    const pointsEl = document.getElementById('pointsDisplay');
    if (pointsEl) {
      pointsEl.textContent = this.state.points;
    }

    const finalPointsEl = document.getElementById('finalPoints');
    if (finalPointsEl) {
      finalPointsEl.textContent = this.state.points;
    }
  }

  /**
   * Update badges display
   */
  updateBadgesDisplay() {
    const container = document.getElementById('badgeContainer');
    if (!container) return;

    container.innerHTML = '';

    const badgeNames = {
      '🎯': 'Vocab Master',
      '🧠': 'Critical Thinker',
      '✍️': 'Response Writer',
      '🎤': 'Strategy Expert',
      '🏆': 'Lesson Complete'
    };

    this.state.badges.forEach(badge => {
      const badgeEl = document.createElement('div');
      badgeEl.className = 'text-2xl badge-earned';
      badgeEl.textContent = badge;
      badgeEl.title = badgeNames[badge] || 'Badge Earned';
      container.appendChild(badgeEl);
    });
  }

  /**
   * Update a progress item checkbox
   * @param {string} activityId - Activity identifier
   * @param {boolean} complete - Completion status
   */
  updateProgressItem(activityId, complete) {
    const el = document.getElementById(`progress-${activityId}`);
    if (el) {
      if (complete) {
        el.textContent = '✅';
        el.classList.add('completed');
      } else {
        el.textContent = '⬜';
        el.classList.remove('completed');
      }
    }
  }

  /**
   * Update progress percentage
   */
  updateProgressPercentage() {
    if (this.progressItems.length === 0) return;

    const completed = this.progressItems.filter(item =>
      this.state.completedActivities.includes(item.id)
    ).length;

    const percentage = Math.round((completed / this.progressItems.length) * 100);

    const percentEl = document.getElementById('progressPercent');
    if (percentEl) {
      percentEl.textContent = `${percentage}%`;
    }
  }

  /**
   * Show celebration overlay
   * @param {number} points - Points earned
   * @param {string} reason - Reason text
   */
  showCelebration(points, reason) {
    const overlay = document.getElementById('celebrationOverlay');
    if (!overlay) return;

    const emojiEl = document.getElementById('celebrationEmoji');
    const titleEl = document.getElementById('celebrationTitle');
    const messageEl = document.getElementById('celebrationMessage');

    if (emojiEl) emojiEl.textContent = points >= 25 ? '🎉' : '⭐';
    if (titleEl) titleEl.textContent = reason;
    if (messageEl) messageEl.textContent = `+${points} points!`;

    overlay.classList.add('show');

    // Create confetti
    this.createConfetti();

    // Auto-hide after 3 seconds
    setTimeout(() => {
      overlay.classList.remove('show');
    }, 3000);
  }

  /**
   * Create confetti effect
   */
  createConfetti() {
    const colors = ['#7C3AED', '#F59E0B', '#0D9488', '#E11D48'];
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }

  /**
   * Close celebration overlay
   */
  closeCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    if (overlay) {
      overlay.classList.remove('show');
    }
  }

  /**
   * Save a response
   * @param {string} key - Response key
   * @param {string} value - Response value
   */
  saveResponse(key, value) {
    this.state.savedResponses[key] = value;
    this.save();
  }

  /**
   * Get a saved response
   * @param {string} key - Response key
   * @returns {string}
   */
  getResponse(key) {
    return this.state.savedResponses[key] || '';
  }

  /**
   * Set emotion
   * @param {string} emotion - Emotion value
   */
  setEmotion(emotion) {
    this.state.emotion = emotion;
    this.save();
  }

  /**
   * Set character choice
   * @param {string} character - 'lee' or 'tee'
   */
  setCharacterChoice(character) {
    this.state.characterChoice = character;
    this.save();
  }

  /**
   * Reset all progress
   */
  reset() {
    if (confirm('Reset all progress for this episode?')) {
      localStorage.removeItem(this.stateKey);
      location.reload();
    }
  }

  /**
   * Register callback
   * @param {string} event - Event name
   * @param {Function} callback
   */
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProgressManager };
}
