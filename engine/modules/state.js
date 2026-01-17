/**
 * State Management Module
 * Handles learning progress persistence and state management
 */

// Learning state object
let learningState = {
  points: 0,
  badges: [],
  completedActivities: [],
  emotion: null,
  characterChoice: null,
  savedResponses: {}
};

// Current episode number (set by engine)
let currentEpisodeNumber = 1;

/**
 * Load saved progress from localStorage
 */
function loadProgress() {
  const storageKey = `leeTeeLessonProgress_ep${currentEpisodeNumber}`;
  const saved = localStorage.getItem(storageKey);

  if (saved) {
    try {
      learningState = JSON.parse(saved);
      // Keep only emotional and character choices if needed
      if (learningState.completedActivities.length > 0) {
        learningState.completedActivities = learningState.completedActivities.filter(
          activity => activity === 'sel' || activity === 'character'
        );
      }
    } catch (e) {
      console.error('Error loading progress:', e);
      resetProgressSilent();
    }
  } else {
    resetProgressSilent();
  }

  // Update UI
  const pointsDisplay = document.getElementById('pointsDisplay');
  if (pointsDisplay) pointsDisplay.textContent = learningState.points;

  const finalPoints = document.getElementById('finalPoints');
  if (finalPoints) finalPoints.textContent = learningState.points;

  updateBadges();

  // Restore checkmarks for completed activities
  learningState.completedActivities.forEach(activity => {
    const element = document.getElementById(`progress-${activity}`);
    if (element) {
      element.textContent = '✅';
      element.classList.add('completed');
    }
  });

  updateProgressPercentage();
  updateProgressChecklist();
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
  const storageKey = `leeTeeLessonProgress_ep${currentEpisodeNumber}`;
  localStorage.setItem(storageKey, JSON.stringify(learningState));
}

/**
 * Reset progress with confirmation
 */
function resetProgress() {
  const message = typeof translator !== 'undefined'
    ? translator.t('messages.reset_progress', 'Are you sure you want to reset all progress? This will clear all points and completed activities.')
    : 'Are you sure you want to reset all progress? This will clear all points and completed activities.';

  if (confirm(message)) {
    resetProgressSilent();

    // Reset UI
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) pointsDisplay.textContent = '0';

    const finalPoints = document.getElementById('finalPoints');
    if (finalPoints) finalPoints.textContent = '0';

    // Reset all progress checkmarks
    document.querySelectorAll('.progress-check').forEach(el => {
      el.textContent = '◻';
      el.classList.remove('completed');
    });

    // Reset badges
    const badgeContainer = document.getElementById('badgeContainer');
    if (badgeContainer) badgeContainer.innerHTML = '';

    updateProgressPercentage();
    alert('Progress reset! Starting fresh.');
  }
}

/**
 * Reset progress without confirmation (internal use)
 */
function resetProgressSilent() {
  const storageKey = `leeTeeLessonProgress_ep${currentEpisodeNumber}`;
  localStorage.removeItem(storageKey);

  learningState = {
    points: 0,
    badges: [],
    completedActivities: [],
    emotion: null,
    characterChoice: null,
    savedResponses: {}
  };
}

/**
 * Reset episode progress (called from left rail)
 */
function resetEpisodeProgress() {
  const message = typeof translator !== 'undefined'
    ? translator.t('messages.reset_global_progress', 'Reset all progress for this episode?')
    : 'Reset all progress for this episode?';

  if (confirm(message)) {
    const storageKey = `leeTeeLessonProgress_ep${currentEpisodeNumber}`;
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`episode${currentEpisodeNumber}SkillState`);
    location.reload();
  }
}

/**
 * Update progress percentage display
 */
function updateProgressPercentage() {
  const totalChecks = document.querySelectorAll('.progress-check').length;
  const completed = document.querySelectorAll('.progress-check.completed').length;
  const percentage = totalChecks > 0 ? Math.round((completed / totalChecks) * 100) : 0;

  const percentEl = document.getElementById('progress-percentage');
  if (percentEl) percentEl.textContent = `${percentage}%`;

  updateProgressChecklist();
}

/**
 * Update progress checklist in left rail
 */
function updateProgressChecklist() {
  const checklist = document.getElementById('progress-checklist');
  if (!checklist) return;

  const t = (key, fallback) => (typeof translator !== 'undefined' ? translator.t(key, fallback) : fallback);

  const items = [
    { id: 'progress-sel', key: 'progress_labels.sel', fallback: 'Check-In' },
    { id: 'progress-vocab', key: 'progress_labels.vocab', fallback: 'Vocabulary' },
    { id: 'progress-section1', key: 'progress_labels.section1', fallback: 'Section 1' },
    { id: 'progress-section2', key: 'progress_labels.section2', fallback: 'Section 2' },
    { id: 'progress-section3', key: 'progress_labels.section3', fallback: 'Section 3' },
    { id: 'progress-drag', key: 'progress_labels.drag', fallback: 'Drag & Drop' },
    { id: 'progress-essay', key: 'progress_labels.essay', fallback: 'Model Essay' },
    { id: 'progress-reflect', key: 'progress_labels.reflect', fallback: 'Reflection' }
  ];

  checklist.innerHTML = items.map(item => {
    const el = document.getElementById(item.id);
    const complete = el && el.classList.contains('completed');
    const label = t(item.key, item.fallback);
    return `
      <div class="flex items-center gap-2 px-3 py-2 rounded-lg ${complete ? 'bg-green-50' : 'bg-gray-50'}">
        <span class="text-lg">${complete ? '✅' : '⬜'}</span>
        <span class="text-gray-700 ${complete ? 'font-semibold' : ''}">${label}</span>
      </div>
    `;
  }).join('');
}

/**
 * Mark an activity as complete
 */
function markActivityComplete(activityId) {
  if (!learningState.completedActivities.includes(activityId)) {
    learningState.completedActivities.push(activityId);

    const progressElement = document.getElementById(`progress-${activityId}`);
    if (progressElement && !progressElement.classList.contains('completed')) {
      progressElement.textContent = '✅';
      progressElement.classList.add('completed');
    }

    saveProgress();
    updateProgressPercentage();
  }
}

/**
 * Toggle left rail on mobile
 */
function toggleLeftRail() {
  const rail = document.getElementById('left-rail');
  if (rail) {
    rail.classList.toggle('mobile-hidden');
    rail.classList.toggle('mobile-open');
  }
}

// Export for use in other modules
window.learningState = learningState;
window.loadProgress = loadProgress;
window.saveProgress = saveProgress;
window.resetProgress = resetProgress;
window.resetEpisodeProgress = resetEpisodeProgress;
window.updateProgressPercentage = updateProgressPercentage;
window.updateProgressChecklist = updateProgressChecklist;
window.markActivityComplete = markActivityComplete;
window.toggleLeftRail = toggleLeftRail;
window.currentEpisodeNumber = currentEpisodeNumber;
