/**
 * Episode Schema Definition
 *
 * Each episode config must conform to this schema structure.
 * Section layers: core, expanded, supports, checks, media
 */

const SECTION_TYPES = {
  SEL_CHECKIN: 'sel-checkin',
  CHARACTER_CHOICE: 'character-choice',
  VOCABULARY: 'vocabulary',
  STORY: 'story',
  STRATEGY: 'strategy',
  ESSAY_MODEL: 'essay-model',
  WRITING: 'writing',
  REFLECTION: 'reflection'
};

const ACTIVITY_TYPES = {
  EMOTION_SELECT: 'emotion-select',
  CHARACTER_SELECT: 'character-select',
  VOCAB_FILL_BLANK: 'vocab-fill-blank',
  COMPREHENSION_QUIZ: 'comprehension-quiz',
  DRAG_DROP: 'drag-drop',
  PROBLEM_ANALYSIS: 'problem-analysis',
  ESSAY_HUNT: 'essay-hunt',
  OPEN_RESPONSE: 'open-response',
  MATCHING: 'matching',
  REFLECTION: 'reflection'
};

/**
 * Episode Configuration Schema
 *
 * @typedef {Object} EpisodeConfig
 * @property {number} id - Episode number (1-4)
 * @property {string} title - Episode title
 * @property {string} subject - Subject area (ELA, Math, Social Studies, Science)
 * @property {string} color - Theme color hex
 * @property {Object} meta - Episode metadata
 * @property {Object} objectives - Learning objectives (language, content)
 * @property {Array<Section>} sections - Array of section configurations
 * @property {Object} vocabulary - Vocabulary definitions
 * @property {Object} media - Media asset references
 * @property {Object} translations - Translation keys for i18n
 */

/**
 * Section Schema
 *
 * @typedef {Object} Section
 * @property {string} id - Unique section identifier
 * @property {string} type - Section type from SECTION_TYPES
 * @property {string} title - Section title
 * @property {string} icon - Emoji icon
 * @property {number} navIndex - Navigation order (1-7)
 * @property {Object} layers - Section content layers
 * @property {Array<Activity>} activities - Section activities
 */

/**
 * Section Layers
 *
 * @typedef {Object} SectionLayers
 * @property {Object} core - Essential content (required)
 * @property {Object} expanded - Additional depth (optional)
 * @property {Object} supports - Scaffolding/helpers (optional)
 * @property {Object} checks - Comprehension checks (optional)
 * @property {Object} media - Media assets (optional)
 */

/**
 * Activity Schema
 *
 * @typedef {Object} Activity
 * @property {string} id - Activity identifier
 * @property {string} type - Activity type from ACTIVITY_TYPES
 * @property {Object} config - Activity-specific configuration
 * @property {number} points - Points awarded on completion
 * @property {string} badge - Badge emoji awarded (optional)
 * @property {string} progressKey - Key for progress tracking
 */

/**
 * Validates an episode configuration against the schema
 * @param {EpisodeConfig} config - Episode configuration to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateEpisodeConfig(config) {
  const errors = [];

  // Required top-level fields
  if (typeof config.id !== 'number') {
    errors.push('Missing or invalid episode id (must be number)');
  }
  if (typeof config.title !== 'string' || !config.title) {
    errors.push('Missing or invalid episode title');
  }
  if (!config.sections || !Array.isArray(config.sections)) {
    errors.push('Missing sections array');
  }

  // Validate sections
  if (config.sections) {
    config.sections.forEach((section, index) => {
      if (!section.id) {
        errors.push(`Section ${index}: missing id`);
      }
      if (!section.type || !Object.values(SECTION_TYPES).includes(section.type)) {
        errors.push(`Section ${index}: invalid type "${section.type}"`);
      }
      if (!section.layers || !section.layers.core) {
        errors.push(`Section ${index}: missing core layer`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Creates an empty section template
 * @param {string} type - Section type
 * @returns {Section}
 */
function createSectionTemplate(type) {
  return {
    id: '',
    type,
    title: '',
    icon: '',
    navIndex: 0,
    layers: {
      core: { content: '' },
      expanded: null,
      supports: null,
      checks: null,
      media: null
    },
    activities: []
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SECTION_TYPES, ACTIVITY_TYPES, validateEpisodeConfig, createSectionTemplate };
}
