/**
 * Navigation Module
 * Handles progressive section navigation and scroll tracking
 */

class NavigationManager {
  constructor(episodeId, totalSections) {
    this.episodeId = episodeId;
    this.totalSections = totalSections;
    this.currentSection = 1;
    this.sections = new Map();
    this.stateKey = `leeTeeEpisode${episodeId}Nav`;

    this.callbacks = {
      onSectionChange: []
    };
  }

  /**
   * Initialize navigation
   */
  init() {
    this.load();
    this.renderNavBar();
    this.attachEventListeners();
    this.showSection(this.currentSection);
    return this;
  }

  /**
   * Register a section
   * @param {number} index - Section index (1-based)
   * @param {string} title - Section title
   * @param {string} icon - Section icon emoji
   * @param {boolean} locked - Whether section is locked
   */
  registerSection(index, title, icon, locked = false) {
    this.sections.set(index, { title, icon, locked });
  }

  /**
   * Load navigation state from localStorage
   */
  load() {
    const saved = localStorage.getItem(this.stateKey);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.currentSection = state.currentSection || 1;
      } catch (e) {
        console.error('Failed to load nav state:', e);
      }
    }
  }

  /**
   * Save navigation state to localStorage
   */
  save() {
    localStorage.setItem(this.stateKey, JSON.stringify({
      currentSection: this.currentSection
    }));
  }

  /**
   * Render the navigation bar
   */
  renderNavBar() {
    const nav = document.getElementById('section-nav');
    if (!nav) return;

    nav.innerHTML = '';

    this.sections.forEach((section, index) => {
      const btn = document.createElement('button');
      btn.className = 'section-nav-btn';
      btn.setAttribute('data-section', index);
      btn.setAttribute('aria-label', `Go to ${section.title}`);

      if (index === this.currentSection) {
        btn.classList.add('active');
      }

      if (section.locked) {
        btn.classList.add('locked');
        btn.disabled = true;
      }

      btn.innerHTML = `
        <span class="nav-icon">${section.icon}</span>
        <span class="nav-label">${section.title}</span>
      `;

      btn.addEventListener('click', () => this.goToSection(index));
      nav.appendChild(btn);
    });
  }

  /**
   * Navigate to a section
   * @param {number} index - Section index
   */
  goToSection(index) {
    if (index < 1 || index > this.totalSections) return;

    const section = this.sections.get(index);
    if (section && section.locked) return;

    this.currentSection = index;
    this.save();
    this.showSection(index);
    this.updateNavBar();

    // Trigger callbacks
    this.callbacks.onSectionChange.forEach(cb => cb(index));
  }

  /**
   * Show a specific section
   * @param {number} index - Section index
   */
  showSection(index) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
      section.style.display = 'none';
    });

    // Show target section
    const target = document.querySelector(`.section-content[data-section="${index}"]`);
    if (target) {
      target.style.display = 'block';

      // Scroll to top of section
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Update navigation bar active state
   */
  updateNavBar() {
    document.querySelectorAll('.section-nav-btn').forEach(btn => {
      const sectionIndex = parseInt(btn.getAttribute('data-section'), 10);
      btn.classList.toggle('active', sectionIndex === this.currentSection);
    });
  }

  /**
   * Navigate to next section
   */
  next() {
    if (this.currentSection < this.totalSections) {
      this.goToSection(this.currentSection + 1);
    }
  }

  /**
   * Navigate to previous section
   */
  prev() {
    if (this.currentSection > 1) {
      this.goToSection(this.currentSection - 1);
    }
  }

  /**
   * Unlock a section
   * @param {number} index - Section index
   */
  unlockSection(index) {
    const section = this.sections.get(index);
    if (section) {
      section.locked = false;
      this.renderNavBar();
    }
  }

  /**
   * Update progress bar based on scroll position
   */
  updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    const bar = document.getElementById('progressBar');
    if (bar) {
      bar.style.width = progress + '%';
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Scroll progress tracking
    window.addEventListener('scroll', () => {
      this.updateProgressBar();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && e.altKey) {
        this.next();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        this.prev();
      }
    });
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
  module.exports = { NavigationManager };
}
