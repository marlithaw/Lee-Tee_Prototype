/**
 * Lee & Tee Book 1 - Global Header & State Management
 *
 * This component provides:
 * - Global state management across all episodes
 * - Persistent header with book progress, points, badges
 * - Lee/Tee mode toggle
 * - Accessibility controls
 * - Navigation
 */

// Only define tr if not already defined
if (typeof tr === 'undefined') {
  var tr = (key, fallback) => (typeof translator !== 'undefined' ? translator.t(key, fallback) : fallback);
}

// ===== GLOBAL STATE MANAGEMENT =====

const GLOBAL_STATE_KEY = 'leeTeeBook1GlobalState';
const EPISODE_CONFIGS = {
  1: { title: 'The Recess Battle', subject: 'ELA', color: '#7C3AED', totalSections: 18 },
  2: { title: "Grandpa's Kitchen", subject: 'Math', color: '#F59E0B', totalSections: 15 },
  3: { title: 'The Dinner Table', subject: 'Social Studies', color: '#0D9488', totalSections: 18 },
  4: { title: 'The Nighttime Question', subject: 'Science', color: '#2563EB', totalSections: 12 }
};

// Initialize global state
let globalLearningState = {
  totalPoints: 0,
  badges: [],
  learningMode: 'lee', // 'lee' or 'tee'
  accessibility: {
    dyslexiaMode: false,
    highContrast: false
  },
  episodes: {
    1: { complete: false, sectionsComplete: [], points: 0, currentSection: 0 },
    2: { complete: false, sectionsComplete: [], points: 0, currentSection: 0 },
    3: { complete: false, sectionsComplete: [], points: 0, currentSection: 0 },
    4: { complete: false, sectionsComplete: [], points: 0, currentSection: 0 }
  }
};

// Load global state from localStorage
function loadGlobalState() {
  const saved = localStorage.getItem(GLOBAL_STATE_KEY);
  if (saved) {
    try {
      globalLearningState = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load global state:', e);
    }
  }
  // Apply accessibility preferences
  applyAccessibilitySettings();
  return globalLearningState;
}

// Save global state to localStorage
function saveGlobalState() {
  localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(globalLearningState));
}

// Apply accessibility settings to body
function applyAccessibilitySettings() {
  if (globalLearningState.accessibility.dyslexiaMode) {
    document.body.classList.add('dyslexia-mode');
  } else {
    document.body.classList.remove('dyslexia-mode');
  }

  if (globalLearningState.accessibility.highContrast) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
}

// ===== GLOBAL STATE UPDATERS =====

// Add points to current episode and global total
function addGlobalPoints(episodeNum, amount, reason) {
  globalLearningState.episodes[episodeNum].points += amount;
  globalLearningState.totalPoints += amount;
  saveGlobalState();
  updateHeaderDisplay();

  // Check for global badges
  checkGlobalBadges();
}

// Mark section complete in current episode
function markSectionComplete(episodeNum, sectionId) {
  if (!globalLearningState.episodes[episodeNum].sectionsComplete.includes(sectionId)) {
    globalLearningState.episodes[episodeNum].sectionsComplete.push(sectionId);

    // Update current section number
    const sectionCount = globalLearningState.episodes[episodeNum].sectionsComplete.length;
    globalLearningState.episodes[episodeNum].currentSection = sectionCount;

    saveGlobalState();
    updateHeaderDisplay();
  }
}

// Mark episode complete
function markEpisodeComplete(episodeNum) {
  globalLearningState.episodes[episodeNum].complete = true;
  saveGlobalState();
  updateHeaderDisplay();
  checkGlobalBadges();
}

// Check for global badges
function checkGlobalBadges() {
  const badges = globalLearningState.badges;

  // First Steps - Complete Episode 1
  if (globalLearningState.episodes[1].complete && !badges.includes('first-episode')) {
    badges.push('first-episode');
    showBadgeNotification('🎯 First Steps', 'Completed your first episode!');
  }

  // Book Explorer - Complete 2 episodes
  const episodesComplete = Object.values(globalLearningState.episodes).filter(ep => ep.complete).length;
  if (episodesComplete >= 2 && !badges.includes('two-episodes')) {
    badges.push('two-episodes');
    showBadgeNotification('📚 Book Explorer', 'Completed 2 episodes!');
  }

  // Super Learner - 100+ points
  if (globalLearningState.totalPoints >= 100 && !badges.includes('hundred-points')) {
    badges.push('hundred-points');
    showBadgeNotification('⭐ Super Learner', 'Earned 100+ points!');
  }

  // Book Champion - Complete all 4 episodes
  if (episodesComplete === 4 && !badges.includes('book-complete')) {
    badges.push('book-complete');
    showBadgeNotification('🏆 Book Champion', 'Completed Book 1!');
  }

  saveGlobalState();
  updateHeaderDisplay();
}

// Toggle learning mode
function toggleLearningMode() {
  globalLearningState.learningMode = globalLearningState.learningMode === 'lee' ? 'tee' : 'lee';
  saveGlobalState();
  updateHeaderDisplay();
  updateHelpContent();
}

// Toggle dyslexia mode
function toggleDyslexiaMode() {
  globalLearningState.accessibility.dyslexiaMode = !globalLearningState.accessibility.dyslexiaMode;
  applyAccessibilitySettings();
  saveGlobalState();
}

// Toggle high contrast mode
function toggleHighContrast() {
  globalLearningState.accessibility.highContrast = !globalLearningState.accessibility.highContrast;
  applyAccessibilitySettings();
  saveGlobalState();
}

// Update help content based on learning mode (to be implemented by each episode)
function updateHelpContent() {
  // This will be implemented in each episode to swap help text
  const event = new CustomEvent('learningModeChanged', {
    detail: { mode: globalLearningState.learningMode }
  });
  document.dispatchEvent(event);
}

// ===== HEADER RENDERING =====

function renderGlobalHeader(currentEpisode = null) {
  const header = document.getElementById('global-header');
  if (!header) return;

  const state = globalLearningState;
  const episodeProgress = currentEpisode ? state.episodes[currentEpisode] : null;
  const episodeConfig = currentEpisode ? EPISODE_CONFIGS[currentEpisode] : null;

  const homeLabel = tr('header.home', 'Home');
  const bookProgressLabel = tr('header.book_progress', 'Book Progress');
  const episodeProgressLabel = tr('header.episode_progress', 'Episode Progress');
  const pointsLabel = tr('header.points', 'Points');
  const learningGuideLabel = tr('header.learning_guide', 'Learning Guide');
  const accessibilityLabel = tr('header.accessibility', 'Accessibility');
  const leeModeLabel = tr('header.lee_mode', 'Lee');
  const teeModeLabel = tr('header.tee_mode', 'Tee');
  const dyslexiaLabel = tr('header.dyslexia_font', 'Dyslexia-friendly font');
  const highContrastLabel = tr('header.high_contrast', 'High contrast mode');
  const pointsShort = tr('header.points_short', 'points');
  const episodeLabel = tr('header.episode_label', 'Episode');

  // Calculate book progress
  const totalEpisodes = 4;
  const completedEpisodes = Object.values(state.episodes).filter(ep => ep.complete).length;
  const bookProgressPercent = Math.round((completedEpisodes / totalEpisodes) * 100);

  // Calculate episode progress
  let episodeProgressPercent = 0;
  if (episodeProgress && episodeConfig) {
    episodeProgressPercent = Math.round(
      (episodeProgress.sectionsComplete.length / episodeConfig.totalSections) * 100
    );
  }

  header.innerHTML = `
    <!-- Desktop Header -->
    <div class="hidden lg:flex items-center justify-between px-6 py-4 bg-white shadow-md border-b-2 border-gray-200">
      <!-- Left: Navigation -->
      <div class="flex items-center gap-4">
        <a href="index.html" class="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span class="font-semibold">${homeLabel}</span>
        </a>

        ${currentEpisode ? `
          <div class="pl-4 border-l-2 border-gray-300">
            <div class="text-sm text-gray-500">${episodeConfig.subject}</div>
            <div class="font-bold text-gray-800">${episodeLabel} ${currentEpisode}: ${episodeConfig.title}</div>
          </div>
        ` : ''}
      </div>

      <!-- Center: Progress -->
      <div class="flex items-center gap-6">
        <!-- Book Progress -->
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">${bookProgressLabel}</div>
          <div class="flex items-center gap-2">
            <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                   style="width: ${bookProgressPercent}%"></div>
            </div>
            <span class="text-sm font-semibold text-gray-700">${completedEpisodes}/4</span>
          </div>
        </div>

        <!-- Episode Progress (if on an episode page) -->
        ${currentEpisode ? `
          <div class="text-center">
            <div class="text-xs text-gray-500 mb-1">${episodeProgressLabel}</div>
            <div class="flex items-center gap-2">
              <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-500"
                     style="width: ${episodeProgressPercent}%; background-color: ${episodeConfig.color}"></div>
              </div>
              <span class="text-sm font-semibold text-gray-700">
                ${episodeProgress.sectionsComplete.length}/${episodeConfig.totalSections}
              </span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Right: Points, Badges, Learning Mode, Accessibility -->
      <div class="flex items-center gap-4">
        <!-- Points & Badges -->
        <button onclick="showPointsModal()"
                class="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors">
          <span class="text-2xl">⭐</span>
          <div class="text-left">
            <div class="text-xs text-amber-700">${pointsLabel}</div>
            <div class="text-lg font-bold text-amber-900">${state.totalPoints}</div>
          </div>
          ${state.badges.length > 0 ? `
            <div class="ml-2 px-2 py-1 bg-amber-200 rounded-full text-xs font-semibold text-amber-900">
              ${state.badges.length} 🏆
            </div>
          ` : ''}
        </button>

        <!-- Learning Mode Toggle -->
        <div class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <button onclick="toggleLearningMode()"
                  class="flex items-center gap-2 px-3 py-2 rounded-md transition-all ${state.learningMode === 'lee' ? 'bg-purple-500 text-white' : 'bg-white text-gray-700'}">
            <span class="text-lg">📝</span>
            <span class="font-semibold text-sm">${leeModeLabel}</span>
          </button>
          <button onclick="toggleLearningMode()"
                  class="flex items-center gap-2 px-3 py-2 rounded-md transition-all ${state.learningMode === 'tee' ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}">
            <span class="text-lg">🎯</span>
            <span class="font-semibold text-sm">${teeModeLabel}</span>
          </button>
        </div>

        <!-- Accessibility -->
        <div class="flex items-center gap-2">
          <button onclick="toggleDyslexiaMode()"
                  class="p-2 rounded-lg transition-colors ${state.accessibility.dyslexiaMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}"
                  title="${dyslexiaLabel}">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
            </svg>
          </button>
          <button onclick="toggleHighContrast()"
                  class="p-2 rounded-lg transition-colors ${state.accessibility.highContrast ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}"
                  title="${highContrastLabel}">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 0a10 10 0 110 20 10 10 0 010-20zm0 4v12a6 6 0 000-12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Header -->
    <div class="lg:hidden flex flex-col bg-white shadow-md border-b-2 border-gray-200">
      <!-- Top row: Back button and Menu -->
      <div class="flex items-center justify-between px-4 py-3">
        <a href="index.html" class="flex items-center gap-2 text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span class="font-semibold">${homeLabel}</span>
        </a>

        <button onclick="toggleMobileMenu()" class="p-2 text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Progress bars -->
      <div class="px-4 pb-3 space-y-2">
        ${currentEpisode ? `
          <div>
            <div class="text-xs text-gray-500 mb-1">${episodeLabel} ${currentEpisode}: ${episodeConfig.title}</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-500"
                     style="width: ${episodeProgressPercent}%; background-color: ${episodeConfig.color}"></div>
              </div>
              <span class="text-xs font-semibold text-gray-700">
                ${episodeProgress.sectionsComplete.length}/${episodeConfig.totalSections}
              </span>
            </div>
          </div>
        ` : ''}

        <div>
          <div class="text-xs text-gray-500 mb-1">${bookProgressLabel}</div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                   style="width: ${bookProgressPercent}%"></div>
            </div>
            <span class="text-xs font-semibold text-gray-700">${completedEpisodes}/4</span>
          </div>
        </div>

        <!-- Points display -->
        <button onclick="showPointsModal()"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 rounded-lg">
          <span class="text-xl">⭐</span>
          <span class="font-bold text-amber-900">${state.totalPoints} ${pointsShort}</span>
          ${state.badges.length > 0 ? `
            <span class="px-2 py-1 bg-amber-200 rounded-full text-xs font-semibold text-amber-900">
              ${state.badges.length} 🏆
            </span>
          ` : ''}
        </button>
      </div>

      <!-- Mobile menu (hidden by default) -->
      <div id="mobile-menu" class="hidden border-t border-gray-200 px-4 py-3 space-y-3">
        <!-- Learning Mode -->
        <div>
          <div class="text-xs text-gray-500 mb-2">${learningGuideLabel}</div>
          <div class="flex gap-2">
            <button onclick="toggleLearningMode()"
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${state.learningMode === 'lee' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}">
              <span>📝</span>
              <span class="font-semibold text-sm">${leeModeLabel}</span>
            </button>
            <button onclick="toggleLearningMode()"
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${state.learningMode === 'tee' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}">
              <span>🎯</span>
              <span class="font-semibold text-sm">${teeModeLabel}</span>
            </button>
          </div>
        </div>

        <!-- Accessibility -->
        <div>
          <div class="text-xs text-gray-500 mb-2">${accessibilityLabel}</div>
          <div class="flex gap-2">
            <button onclick="toggleDyslexiaMode()"
                    class="flex-1 px-3 py-2 rounded-lg transition-colors ${state.accessibility.dyslexiaMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}">
              <div class="text-sm font-semibold">${dyslexiaLabel}</div>
            </button>
            <button onclick="toggleHighContrast()"
                    class="flex-1 px-3 py-2 rounded-lg transition-colors ${state.accessibility.highContrast ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}">
              <div class="text-sm font-semibold">${highContrastLabel}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Update header display
function updateHeaderDisplay() {
  const currentEpisode = getCurrentEpisodeNumber();
  renderGlobalHeader(currentEpisode);
}

document.addEventListener('languageChanged', () => {
  updateHeaderDisplay();
  const pointsModal = document.getElementById('points-modal');
  if (pointsModal) {
    pointsModal.remove();
    createPointsModal();
  }
});

// Get current episode number from URL or data attribute
function getCurrentEpisodeNumber() {
  // Try to get from body data attribute
  const episodeAttr = document.body.getAttribute('data-episode');
  if (episodeAttr) return parseInt(episodeAttr);

  // Try to get from URL
  const path = window.location.pathname;
  if (path.includes('episode1')) return 1;
  if (path.includes('episode2')) return 2;
  if (path.includes('episode3')) return 3;
  if (path.includes('episode4')) return 4;

  return null;
}

// ===== POINTS & BADGES MODAL =====

function showPointsModal() {
  const modal = document.getElementById('points-modal');
  if (modal) {
    modal.classList.remove('hidden');
  } else {
    createPointsModal();
  }
}

function createPointsModal() {
  const state = globalLearningState;
  const badgeInfo = {
    'first-episode': { emoji: '🎯', title: tr('global_badges.first_episode.title', 'First Steps'), description: tr('global_badges.first_episode.description', 'Completed Episode 1') },
    'two-episodes': { emoji: '📚', title: tr('global_badges.two_episodes.title', 'Book Explorer'), description: tr('global_badges.two_episodes.description', 'Completed 2 episodes') },
    'hundred-points': { emoji: '⭐', title: tr('global_badges.hundred_points.title', 'Super Learner'), description: tr('global_badges.hundred_points.description', 'Earned 100+ points') },
    'book-complete': { emoji: '🏆', title: tr('global_badges.book_complete.title', 'Book Champion'), description: tr('global_badges.book_complete.description', 'Completed Book 1') }
  };

  const modalTitle = tr('header.points_badges', 'Points & Badges');
  const totalPointsLabel = tr('header.total_points', 'Total Points');
  const episodePointsLabel = tr('header.episode_progress', 'Episode Progress');
  const badgesEarnedLabel = tr('header.badges_earned', 'Badges Earned');
  const episodeLabel = tr('header.episode_label', 'Episode');
  const pointsShort = tr('header.points_short', 'points');

  const modalHTML = `
    <div id="points-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         onclick="closePointsModal(event)">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">${modalTitle}</h2>
          <button onclick="closePointsModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Total Points -->
        <div class="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4 mb-4">
          <div class="text-center">
            <div class="text-4xl mb-2">⭐</div>
            <div class="text-3xl font-bold text-amber-900">${state.totalPoints}</div>
            <div class="text-sm text-amber-700">${totalPointsLabel}</div>
          </div>
        </div>

        <!-- Episode Breakdown -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">${episodePointsLabel}</h3>
          <div class="space-y-2">
            ${Object.entries(EPISODE_CONFIGS).map(([num, config]) => {
              const ep = state.episodes[num];
              return `
                <div class="flex items-center justify-between py-2 px-3 rounded-lg ${ep.complete ? 'bg-green-50' : 'bg-gray-50'}">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" style="background-color: ${config.color}"></div>
                    <span class="text-sm font-medium text-gray-700">${episodeLabel} ${num}: ${config.subject}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-gray-800">${ep.points} ${pointsShort}</span>
                    ${ep.complete ? '<span class="text-green-600">✓</span>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Badges -->
        ${state.badges.length > 0 ? `
          <div>
            <h3 class="text-sm font-semibold text-gray-600 mb-2">${badgesEarnedLabel}</h3>
            <div class="grid grid-cols-2 gap-3">
              ${state.badges.map(badgeId => {
                const badge = badgeInfo[badgeId];
                if (!badge) return '';
                return `
                  <div class="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-3 text-center">
                    <div class="text-3xl mb-1">${badge.emoji}</div>
                    <div class="text-xs font-bold text-gray-800">${badge.title}</div>
                    <div class="text-xs text-gray-600">${badge.description}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : `
          <div class="text-center py-4 text-gray-500 text-sm">
            Keep learning to earn badges! 🏆
          </div>
        `}
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closePointsModal(event) {
  if (event && event.target.id !== 'points-modal') return;
  const modal = document.getElementById('points-modal');
  if (modal) {
    modal.remove();
  }
}

// Show badge notification
function showBadgeNotification(title, message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-2xl p-4 z-50 animate-slide-in-right max-w-sm';
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="text-3xl">🎉</div>
      <div>
        <div class="font-bold">${title}</div>
        <div class="text-sm opacity-90">${message}</div>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ===== INITIALIZATION =====

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadGlobalState();
  updateHeaderDisplay();
});

// Export functions for use in episodes
if (typeof window !== 'undefined') {
  window.globalLearningState = globalLearningState;
  window.loadGlobalState = loadGlobalState;
  window.saveGlobalState = saveGlobalState;
  window.addGlobalPoints = addGlobalPoints;
  window.markSectionComplete = markSectionComplete;
  window.markEpisodeComplete = markEpisodeComplete;
  window.toggleLearningMode = toggleLearningMode;
  window.toggleDyslexiaMode = toggleDyslexiaMode;
  window.toggleHighContrast = toggleHighContrast;
  window.updateHeaderDisplay = updateHeaderDisplay;
  window.showPointsModal = showPointsModal;
  window.closePointsModal = closePointsModal;
  window.toggleMobileMenu = toggleMobileMenu;
}
