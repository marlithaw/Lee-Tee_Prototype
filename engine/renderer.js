/**
 * Episode Renderer
 *
 * Renders an episode from configuration into the DOM.
 * Entry point: renderEpisode(config)
 */

class EpisodeRenderer {
  constructor() {
    this.config = null;
    this.settings = null;
    this.progress = null;
    this.navigation = null;
    this.activities = null;
    this.mountPoint = null;
  }

  /**
   * Render an episode from configuration
   * @param {Object} config - Episode configuration
   * @param {string} mountId - Mount point element ID (default: 'episode-root')
   */
  async render(config, mountId = 'episode-root') {
    this.config = config;
    this.mountPoint = document.getElementById(mountId);

    if (!this.mountPoint) {
      throw new Error(`Mount point #${mountId} not found`);
    }

    // Validate config
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid config: ${validation.errors.join(', ')}`);
    }

    // Initialize managers
    this.initManagers(config.id);

    // Render structure
    this.renderLayout();
    this.renderSections();

    // Initialize behaviors
    await this.initBehaviors();

    // Apply saved state
    this.applyState();

    console.log(`✅ Episode ${config.id} rendered successfully`);
  }

  /**
   * Validate episode configuration
   * @param {Object} config
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validateConfig(config) {
    const errors = [];

    if (typeof config.id !== 'number') {
      errors.push('Missing episode id');
    }
    if (!config.title) {
      errors.push('Missing episode title');
    }
    if (!config.sections || !Array.isArray(config.sections)) {
      errors.push('Missing sections array');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Initialize all managers
   * @param {number} episodeId
   */
  initManagers(episodeId) {
    // Create managers
    this.settings = new SettingsManager(episodeId);
    this.progress = new ProgressManager(episodeId);
    this.navigation = new NavigationManager(episodeId, this.config.sections.length);
    this.activities = new ActivitiesManager(this.progress);

    // Make globally accessible for inline handlers
    window.engineSettings = this.settings;
    window.engineProgress = this.progress;
    window.engineNav = this.navigation;
    window.engineActivities = this.activities;
  }

  /**
   * Render the main layout structure
   */
  renderLayout() {
    const { config } = this;

    this.mountPoint.innerHTML = `
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
      </div>

      <!-- Points Display -->
      <div class="points-display">
        <div class="text-sm text-gray-600">Points</div>
        <div class="points-number" id="pointsDisplay">0</div>
        <div id="badgeContainer" class="flex gap-1"></div>
      </div>

      <!-- Main Header -->
      <header class="hero-gradient text-white py-8 px-4 text-center">
        <h1 class="font-display text-3xl md:text-4xl font-bold mb-2">${config.title}</h1>
        <p class="text-lg opacity-90">${config.subtitle || ''}</p>
        ${config.standard ? `
          <div class="standard-tag inline-flex items-center gap-2 mt-4 bg-white/20 px-4 py-2 rounded-full">
            <span class="font-bold">${config.standard.code}</span>
            <span>${config.standard.label}</span>
          </div>
        ` : ''}
      </header>

      <!-- Learning Objectives -->
      ${this.renderObjectives(config.objectives)}

      <!-- Navigation -->
      <div id="section-progress-bar" class="section-progress-bar" role="progressbar">
        <div class="section-progress-fill" id="sectionProgressFill"></div>
      </div>
      <nav id="section-nav" class="section-nav" aria-label="Section navigation"></nav>

      <!-- Section Display -->
      <div id="section-display" class="section-display"></div>

      <!-- Celebration Overlay -->
      ${this.renderCelebrationOverlay()}

      <!-- Vocabulary Modal -->
      ${this.renderVocabModal()}

      <!-- Helper Modals -->
      ${this.renderHelperModals()}

      <!-- Floating Stop Button -->
      <button id="floatingStopBtn" class="floating-stop-btn" onclick="engineActivities.stopNarration()">
        ⏹️ Stop
      </button>
    `;
  }

  /**
   * Render learning objectives
   * @param {Object} objectives
   * @returns {string}
   */
  renderObjectives(objectives) {
    if (!objectives) return '';

    return `
      <div class="bg-white border-b py-6 px-4">
        <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          ${objectives.language ? `
            <div class="language-objective">
              <h4 class="font-bold text-green-800 mb-1">🗣️ Language Objective</h4>
              <p class="text-green-900">${objectives.language}</p>
            </div>
          ` : ''}
          ${objectives.content ? `
            <div class="content-objective">
              <h4 class="font-bold text-amber-800 mb-1">📚 Content Objective</h4>
              <p class="text-amber-900">${objectives.content}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render celebration overlay
   * @returns {string}
   */
  renderCelebrationOverlay() {
    return `
      <div id="celebrationOverlay" class="celebration-overlay" onclick="engineProgress.closeCelebration()">
        <div class="celebration-card" onclick="event.stopPropagation()">
          <div id="celebrationEmoji" class="text-6xl mb-4">⭐</div>
          <h3 id="celebrationTitle" class="text-2xl font-bold text-purple-700 mb-2"></h3>
          <p id="celebrationMessage" class="text-lg text-gray-600"></p>
          <button onclick="engineProgress.closeCelebration()" class="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700">
            Continue
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render vocabulary modal
   * @returns {string}
   */
  renderVocabModal() {
    return `
      <div id="vocabModal" class="vocab-modal" onclick="closeVocabModal(event)">
        <div class="vocab-modal-content" onclick="event.stopPropagation()">
          <div class="flex items-start gap-4 mb-4">
            <div id="vocabImage" class="text-4xl"></div>
            <div>
              <h3 id="vocabWord" class="text-2xl font-bold text-purple-700"></h3>
              <p id="vocabSpanish" class="text-sm text-gray-500 italic"></p>
            </div>
          </div>
          <p id="vocabDef" class="text-gray-700 mb-4"></p>
          <div class="bg-purple-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-gray-600">📝 Example:</p>
            <p id="vocabExample" class="text-purple-800 italic"></p>
          </div>
          <button onclick="engineActivities.speakWord(document.getElementById('vocabWord').textContent)"
                  class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            🔊 Hear it
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render helper modals (Lee and Tee)
   * @returns {string}
   */
  renderHelperModals() {
    return `
      <!-- Lee Helper Modal -->
      <div id="lee-modal" class="helper-modal" onclick="closeHelper(event, 'lee')">
        <div class="helper-modal-content bg-purple-50 border-purple-200" onclick="event.stopPropagation()">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">📓</span>
            <h3 class="text-xl font-bold text-purple-700">Lee's Writing Tips</h3>
          </div>
          <div class="space-y-3 text-gray-700">
            <p>Try these sentence starters:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>"They said that..."</li>
              <li>"My evidence shows..."</li>
              <li>"This is wrong because..."</li>
              <li>"In conclusion..."</li>
            </ul>
          </div>
          <button onclick="document.getElementById('lee-modal').classList.remove('open')"
                  class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Got it!
          </button>
        </div>
      </div>

      <!-- Tee Helper Modal -->
      <div id="tee-modal" class="helper-modal" onclick="closeHelper(event, 'tee')">
        <div class="helper-modal-content bg-amber-50 border-amber-200" onclick="event.stopPropagation()">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">🎤</span>
            <h3 class="text-xl font-bold text-amber-700">Tee's Strategy Check</h3>
          </div>
          <div class="space-y-3 text-gray-700">
            <p>Ask yourself:</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Did I state what they claimed?</li>
              <li>Did I bring my evidence?</li>
              <li>Did I explain why they're wrong?</li>
              <li>Did I give my conclusion?</li>
            </ul>
          </div>
          <button onclick="document.getElementById('tee-modal').classList.remove('open')"
                  class="mt-4 w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600">
            Got it!
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render all sections
   */
  renderSections() {
    const sectionDisplay = document.getElementById('section-display');

    this.config.sections.forEach((section, index) => {
      // Register with navigation
      this.navigation.registerSection(
        section.navIndex || index + 1,
        section.title,
        section.icon,
        false
      );

      // Render section container
      const sectionEl = document.createElement('div');
      sectionEl.className = 'section-content';
      sectionEl.setAttribute('data-section', section.navIndex || index + 1);
      sectionEl.style.display = 'none';

      // Render section content
      sectionEl.innerHTML = this.renderSectionContent(section);

      sectionDisplay.appendChild(sectionEl);
    });
  }

  /**
   * Render section content
   * @param {Object} section - Section configuration
   * @returns {string}
   */
  renderSectionContent(section) {
    const { layers, type, title, id } = section;

    // Get base CSS classes for section type
    const bgClass = this.getSectionBgClass(type);

    let html = `<section id="${id}" class="p-8 md:p-12 ${bgClass}">`;

    // Render section header
    if (title) {
      html += `
        <div class="max-w-4xl mx-auto mb-8">
          <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-2">${title}</h2>
        </div>
      `;
    }

    // Render core layer (required)
    if (layers.core) {
      html += `<div class="max-w-4xl mx-auto section-core">${layers.core.content}</div>`;
    }

    // Render supports layer (optional scaffolding)
    if (layers.supports) {
      html += `<div class="max-w-4xl mx-auto section-supports mt-6">${layers.supports.content}</div>`;
    }

    // Render expanded layer (optional depth)
    if (layers.expanded) {
      html += `<div class="max-w-4xl mx-auto section-expanded mt-6">${layers.expanded.content}</div>`;
    }

    // Render checks layer (optional comprehension)
    if (layers.checks) {
      html += `<div class="max-w-4xl mx-auto section-checks mt-8">${layers.checks.content}</div>`;
    }

    // Render media layer (optional media)
    if (layers.media) {
      html += `<div class="max-w-4xl mx-auto section-media mt-6">${layers.media.content}</div>`;
    }

    // Render activities
    if (section.activities && section.activities.length > 0) {
      section.activities.forEach(activity => {
        html += this.renderActivity(activity);
      });
    }

    html += '</section>';

    return html;
  }

  /**
   * Get background class for section type
   * @param {string} type
   * @returns {string}
   */
  getSectionBgClass(type) {
    const bgMap = {
      'sel-checkin': 'bg-gradient-to-b from-blue-50 to-white',
      'character-choice': 'bg-gradient-to-b from-purple-50 to-white',
      'vocabulary': 'bg-amber-50',
      'story': 'bg-white',
      'strategy': 'bg-gradient-to-b from-purple-50 to-white',
      'essay-model': 'bg-gradient-to-b from-amber-50 to-white',
      'writing': 'bg-slate-50',
      'reflection': 'bg-gradient-to-b from-blue-50 to-purple-50'
    };
    return bgMap[type] || 'bg-white';
  }

  /**
   * Render an activity
   * @param {Object} activity
   * @returns {string}
   */
  renderActivity(activity) {
    // Activities are rendered as part of layers.core or layers.checks content
    // This method can be extended to render activity templates
    return '';
  }

  /**
   * Initialize all behaviors
   */
  async initBehaviors() {
    // Initialize managers
    this.settings.init();
    this.progress.init();
    this.navigation.init();
    this.activities.init();

    // Register progress items
    if (this.config.progressItems) {
      this.progress.registerProgressItems(this.config.progressItems);
    }

    // Load translations if translator is available
    if (typeof translator !== 'undefined') {
      await translator.loadLanguage('en');
      await translator.loadLanguage('es');
      await translator.loadLanguage('fr');
      await translator.loadLanguage('ht');
      translator.translatePage();
    }

    // Initialize adaptive helpers if available
    if (typeof adaptiveHelpers !== 'undefined') {
      adaptiveHelpers.init();
    }
  }

  /**
   * Apply saved state
   */
  applyState() {
    // Progress state is applied automatically by progress manager
    this.progress.updateUI();

    // Navigate to last section
    this.navigation.showSection(this.navigation.currentSection);
  }
}

// Global helper functions for inline handlers
function closeVocabModal(e) {
  if (e.target.classList.contains('vocab-modal')) {
    document.getElementById('vocabModal').classList.remove('open');
    if (window.engineActivities) {
      window.engineActivities.stopNarration();
    }
  }
}

function closeHelper(e, character) {
  if (e.target.classList.contains('helper-modal')) {
    document.getElementById(character + '-modal').classList.remove('open');
  }
}

function openHelper(character) {
  document.getElementById(character + '-modal').classList.add('open');
}

/**
 * Main entry point - render an episode from configuration
 * @param {Object} config - Episode configuration
 */
async function renderEpisode(config) {
  const renderer = new EpisodeRenderer();
  await renderer.render(config);
  return renderer;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EpisodeRenderer, renderEpisode };
}
