/**
 * Progressive Navigation System for Lee & Tee Episodes
 * Manages section-by-section reveal, navigation, and progress tracking
 */

const navTr = (key, fallback) => (typeof translator !== 'undefined' ? translator.t(key, fallback) : fallback);

class ProgressiveNav {
  constructor(episodeId, totalSections) {
    this.episodeId = episodeId;
    this.totalSections = totalSections;
    this.currentSection = 1;
    this.completedSections = [];
    this.stateKey = `leeTee_ep${episodeId}_progressive_state`;

    // Section configuration
    this.sections = [];

    // UI elements (populated after init)
    this.progressBar = null;
    this.progressFill = null;
    this.navContainer = null;
    this.sectionContainer = null;
    this.prevBtn = null;
    this.nextBtn = null;
  }

  /**
   * Initialize the navigation system
   * Must be called after DOM is ready
   */
  init() {
    try {
      this.loadState();
      this.cacheElements();
      this.renderNavigation();
      this.showSection(this.currentSection);
      this.attachEventListeners();
      this.updateProgressBar();

      console.log(`✓ Progressive navigation initialized for Episode ${this.episodeId}`);
    } catch (error) {
      console.error('Failed to initialize progressive navigation:', error);
      // Graceful degradation: show all sections if nav fails
      this.showAllSections();
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
        this.currentSection = state.currentSection || 1;
        this.completedSections = state.completedSections || [];
        console.log(`Loaded state: Section ${this.currentSection}, Completed: ${this.completedSections.length}`);
      }
    } catch (error) {
      console.error('Failed to load navigation state:', error);
      // Continue with defaults
    }
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.stateKey, JSON.stringify({
        currentSection: this.currentSection,
        completedSections: this.completedSections,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save navigation state:', error);
      // Non-critical error, continue without saving
    }
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.progressBar = document.getElementById('section-progress-bar');
    this.progressFill = document.getElementById('progress-fill');
    this.navContainer = document.getElementById('section-nav');
    this.sectionContainer = document.getElementById('section-display');
    this.prevBtn = document.getElementById('btn-prev');
    this.nextBtn = document.getElementById('btn-next');

    // Validate required elements exist
    if (!this.sectionContainer) {
      throw new Error('Section container not found');
    }
  }

  /**
   * Register section configuration
   * @param {number} id - Section number
   * @param {string} title - Section title
   * @param {string} emoji - Section emoji
   * @param {boolean} locked - Is section locked initially
   */
  registerSection(id, title, emoji = '📖', locked = false) {
    this.sections.push({ id, title, emoji, locked });
  }

  /**
   * Render navigation buttons
   */
  renderNavigation() {
    if (!this.navContainer) return;

    this.navContainer.innerHTML = '';

    this.sections.forEach(section => {
      const isActive = section.id === this.currentSection;
      const isCompleted = this.completedSections.includes(section.id);
      const isLocked = section.locked && !isCompleted && !isActive;

      const navItem = document.createElement('button');
      navItem.className = 'section-nav__item';
      navItem.setAttribute('data-section', section.id);

      // Add translation keys for section titles
      const translationKeys = {
        1: 'nav.start',
        2: 'nav.vocab',
        3: 'nav.story',
        4: 'nav.strategy',
        5: 'nav.model',
        6: 'nav.write',
        7: 'nav.reflect'
      };

      const titleSpan = `<span class="section-title" data-translate="${translationKeys[section.id]}" data-original="${section.title}">${section.title}</span>`;
      navItem.innerHTML = `<span class="section-emoji">${section.emoji}</span>${titleSpan}`;

      if (isActive) navItem.classList.add('active');
      if (isCompleted) navItem.classList.add('completed');
      if (isLocked) {
        navItem.classList.add('locked');
        navItem.disabled = true;
      }

      if (!isLocked) {
        navItem.addEventListener('click', () => this.showSection(section.id));
      }

      this.navContainer.appendChild(navItem);
    });
  }

  /**
   * Show specific section
   * @param {number} sectionNum - Section number to show
   */
  showSection(sectionNum) {
    // Validate section number
    if (sectionNum < 1 || sectionNum > this.totalSections) {
      console.warn(`Invalid section number: ${sectionNum}`);
      return;
    }

    // Hide all sections
    const allSections = this.sectionContainer.querySelectorAll('.section-content');
    allSections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Show target section
    console.log(`DEBUG: Looking for section ${sectionNum} in container:`, this.sectionContainer);
    const targetSection = this.sectionContainer.querySelector(`[data-section="${sectionNum}"]`);
    console.log(`DEBUG: Found target section:`, targetSection);

    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';

      // Scroll to top of section
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update current section
      this.currentSection = sectionNum;
      this.saveState();

      // Update navigation UI
      this.updateNavigationUI();

      // Update control buttons
      this.updateControlButtons();

      console.log(`✓ Showing section ${sectionNum}`);
    } else {
      console.error(`❌ Section ${sectionNum} not found in DOM`);
      console.error(`Available sections:`, this.sectionContainer.querySelectorAll('[data-section]'));
    }
  }

  /**
   * Mark section as complete and optionally move to next
   * @param {number} sectionNum - Section to mark complete
   * @param {boolean} autoAdvance - Automatically show next section
   */
  completeSection(sectionNum, autoAdvance = true) {
    if (!this.completedSections.includes(sectionNum)) {
      this.completedSections.push(sectionNum);
      this.saveState();
      this.updateProgressBar();
      this.renderNavigation();

      console.log(`✓ Section ${sectionNum} completed`);

      // Show celebration or feedback
      this.showCompletionFeedback(sectionNum);
    }

    if (autoAdvance && sectionNum < this.totalSections) {
      setTimeout(() => {
        this.showSection(sectionNum + 1);
      }, 1000);
    }
  }

  /**
   * Update progress bar visual
   */
  updateProgressBar() {
    if (!this.progressFill) return;

    const progressPercent = (this.completedSections.length / this.totalSections) * 100;
    this.progressFill.style.width = `${progressPercent}%`;
    this.progressFill.setAttribute('aria-valuenow', Math.round(progressPercent));
  }

  /**
   * Update navigation UI (active/completed states)
   */
  updateNavigationUI() {
    if (!this.navContainer) return;

    const navItems = this.navContainer.querySelectorAll('.section-nav__item');
    navItems.forEach(item => {
      const sectionId = parseInt(item.getAttribute('data-section'));

      item.classList.remove('active');
      if (sectionId === this.currentSection) {
        item.classList.add('active');
      }
    });
  }

  /**
   * Update prev/next button states
   */
  updateControlButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSection === 1;
      this.prevBtn.textContent = navTr('controls.previous', '← Previous');
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSection === this.totalSections;

      // Change text if on last section
      if (this.currentSection === this.totalSections) {
        this.nextBtn.textContent = navTr('controls.finish', '🎉 Finish');
        this.nextBtn.dataset.state = 'finish';
      } else {
        this.nextBtn.textContent = navTr('controls.next', 'Next →');
        this.nextBtn.dataset.state = 'next';
      }
    }
  }

  /**
   * Attach event listeners to control buttons
   */
  attachEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSection());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSection());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && !this.prevBtn?.disabled) {
        this.previousSection();
      } else if (e.key === 'ArrowRight' && !this.nextBtn?.disabled) {
        this.nextSection();
      }
    });

    document.addEventListener('languageChanged', () => {
      this.updateControlButtons();
    });
  }

  /**
   * Navigate to previous section
   */
  previousSection() {
    if (this.currentSection > 1) {
      this.showSection(this.currentSection - 1);
    }
  }

  /**
   * Navigate to next section
   */
  nextSection() {
    if (this.currentSection < this.totalSections) {
      this.showSection(this.currentSection + 1);
    } else {
      // Last section - show completion
      this.showEpisodeCompletion();
    }
  }

  /**
   * Show completion feedback for a section
   * @param {number} sectionNum
   */
  showCompletionFeedback(sectionNum) {
    // To be implemented: Show subtle checkmark or animation
    console.log(`Show completion feedback for section ${sectionNum}`);
  }

  /**
   * Show episode completion screen
   */
  showEpisodeCompletion() {
    console.log('Episode complete!');
    // To be implemented: Show celebration modal
  }

  /**
   * Graceful degradation: Show all sections if navigation fails
   */
  showAllSections() {
    console.warn('Showing all sections (navigation system failed)');
    const allSections = this.sectionContainer?.querySelectorAll('.section-content');
    allSections?.forEach(section => {
      section.style.display = 'block';
    });
  }

  /**
   * Get completion percentage
   * @returns {number} Percentage (0-100)
   */
  getCompletionPercentage() {
    return Math.round((this.completedSections.length / this.totalSections) * 100);
  }

  /**
   * Check if section is completed
   * @param {number} sectionNum
   * @returns {boolean}
   */
  isSectionCompleted(sectionNum) {
    return this.completedSections.includes(sectionNum);
  }

  /**
   * Reset all progress (for testing or restart)
   */
  resetProgress() {
    if (confirm(navTr('messages.reset_nav_confirm', 'Are you sure you want to reset all progress? This cannot be undone.'))) {
      this.currentSection = 1;
      this.completedSections = [];
      this.saveState();
      this.showSection(1);
      this.updateProgressBar();
      this.renderNavigation();
      console.log('Progress reset');
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressiveNav;
}
