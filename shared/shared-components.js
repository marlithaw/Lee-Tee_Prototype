/**
 * LEE & TEE BOOK 1 - SHARED COMPONENTS
 * Reusable JavaScript for all episodes
 * Version 1.0
 */

// ===== GLOBAL STATE =====
let learningState = {
  points: 0,
  badges: [],
  completedActivities: [],
  currentEpisode: 1,
  currentSection: 1
};

// ===== PROGRESS TRACKING =====

/**
 * Save progress to localStorage
 */
function saveProgress() {
  localStorage.setItem('leeTeeLessonProgress', JSON.stringify(learningState));
  updateProgressDisplay();
}

/**
 * Load progress from localStorage
 */
function loadProgress() {
  const saved = localStorage.getItem('leeTeeLessonProgress');
  if (saved) {
    try {
      learningState = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading progress:', e);
      learningState = {
        points: 0,
        badges: [],
        completedActivities: [],
        currentEpisode: 1,
        currentSection: 1
      };
    }
  }
  updateProgressDisplay();
  updateBadges();
}

/**
 * Update points display
 */
function updateProgressDisplay() {
  const pointsDisplay = document.getElementById('pointsDisplay');
  if (pointsDisplay) {
    pointsDisplay.textContent = learningState.points;
  }
}

/**
 * Add points with celebration
 */
function addPoints(amount, reason) {
  learningState.points += amount;
  saveProgress();

  // Check for badge unlocks
  checkBadgeUnlocks();

  // Show points earned animation (if element exists)
  showPointsEarned(amount, reason);
}

/**
 * Show points earned animation
 */
function showPointsEarned(amount, reason) {
  // Implementation depends on UI - can be customized per episode
  console.log(`+${amount} points: ${reason}`);
}

/**
 * Award badge
 */
function awardBadge(emoji) {
  if (!learningState.badges.includes(emoji)) {
    learningState.badges.push(emoji);
    saveProgress();
    showBadgeCelebration(emoji);
  }
}

/**
 * Check for badge unlocks
 */
function checkBadgeUnlocks() {
  // First Steps
  if (learningState.completedActivities.length >= 1 && !learningState.badges.includes('🎯')) {
    awardBadge('🎯');
  }

  // Super Reader
  if (learningState.points >= 50 && !learningState.badges.includes('⭐')) {
    awardBadge('⭐');
  }

  // Episode Champion (complete 100+ points)
  if (learningState.points >= 100 && !learningState.badges.includes('🏆')) {
    awardBadge('🏆');
  }
}

/**
 * Update badge display
 */
function updateBadges() {
  const badgeContainer = document.getElementById('badgeContainer');
  if (!badgeContainer) return;

  badgeContainer.innerHTML = '';

  const badgeNames = {
    '🎯': 'First Steps',
    '📚': 'Vocab Master',
    '🧠': 'Critical Thinker',
    '✍️': 'Response Writer',
    '🎤': 'Strategy Expert',
    '⭐': 'Super Reader',
    '🏆': 'Episode Champion',
    '🌟': 'Book 1 Complete'
  };

  learningState.badges.forEach(emoji => {
    const badge = document.createElement('span');
    badge.textContent = emoji;
    badge.title = badgeNames[emoji] || 'Badge Earned';
    badge.style.fontSize = '1.5rem';
    badge.style.cursor = 'pointer';
    badgeContainer.appendChild(badge);
  });
}

/**
 * Show badge celebration
 */
function showBadgeCelebration(emoji) {
  const badgeNames = {
    '🎯': 'First Steps',
    '📚': 'Vocab Master',
    '🧠': 'Critical Thinker',
    '✍️': 'Response Writer',
    '🎤': 'Strategy Expert',
    '⭐': 'Super Reader',
    '🏆': 'Episode Champion',
    '🌟': 'Book 1 Complete'
  };

  showCelebration(
    'Badge Earned!',
    `You earned the ${badgeNames[emoji] || 'Achievement'} badge!`,
    emoji
  );
}

/**
 * Reset progress (with confirmation)
 */
function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    learningState = {
      points: 0,
      badges: [],
      completedActivities: [],
      currentEpisode: 1,
      currentSection: 1
    };
    saveProgress();
    location.reload();
  }
}

// ===== VOCABULARY SYSTEM =====

/**
 * Show vocabulary modal
 * @param {string} word - The vocabulary word
 * @param {Object} vocabData - Data object with word definitions
 */
function showVocab(word, vocabData) {
  const modal = document.getElementById('vocabModal');
  if (!modal) return;

  const data = vocabData[word];
  if (!data) return;

  document.getElementById('vocabWord').textContent = word;
  document.getElementById('vocabPronunciation').textContent = data.pronunciation || '';
  document.getElementById('vocabDefinition').textContent = data.definition;
  document.getElementById('vocabExample').textContent = data.example;

  modal.classList.remove('hidden');
  modal.style.display = 'flex';

  // Speak the word if text-to-speech is available
  if ('speechSynthesis' in window) {
    const speakBtn = document.getElementById('vocabSpeak');
    if (speakBtn) {
      speakBtn.onclick = function() {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      };
    }
  }
}

/**
 * Close vocabulary modal
 */
function closeVocabModal(event) {
  const modal = document.getElementById('vocabModal');
  if (!modal) return;

  // Close if clicking outside the modal content
  if (event.target === modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

// ===== QUIZ ENGINE =====

/**
 * Check multiple choice answer
 * @param {string} questionId - The question identifier
 * @param {string} selectedAnswer - The selected answer
 * @param {string} correctAnswer - The correct answer
 * @param {string} feedbackId - ID of feedback element
 */
function checkAnswer(questionId, selectedAnswer, correctAnswer, feedbackId) {
  const feedback = document.getElementById(feedbackId);
  if (!feedback) return;

  const isCorrect = selectedAnswer === correctAnswer;

  if (isCorrect) {
    feedback.classList.remove('hidden');
    feedback.innerHTML = `
      <div class="bg-green-100 border-2 border-green-500 rounded-xl p-4">
        <p class="font-bold text-green-800 text-lg mb-2">✓ Correct!</p>
        <p class="text-green-700">Great job! You got it right.</p>
      </div>
    `;

    // Award points if not already completed
    if (!learningState.completedActivities.includes(questionId)) {
      learningState.completedActivities.push(questionId);
      addPoints(10, 'Correct answer!');
    }
  } else {
    feedback.classList.remove('hidden');
    feedback.innerHTML = `
      <div class="bg-red-100 border-2 border-red-500 rounded-xl p-4">
        <p class="font-bold text-red-800 text-lg mb-2">✗ Not quite</p>
        <p class="text-red-700">Try again! Review the text and think about the evidence.</p>
      </div>
    `;
  }

  saveProgress();
}

// ===== CELEBRATION SYSTEM =====

/**
 * Show celebration overlay
 */
function showCelebration(title, message, emoji) {
  const overlay = document.getElementById('celebrationOverlay');
  if (!overlay) return;

  document.getElementById('celebrationEmoji').textContent = emoji;
  document.getElementById('celebrationTitle').textContent = title;
  document.getElementById('celebrationMessage').textContent = message;

  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';

  // Create confetti
  createConfetti();

  // Auto-close after 3 seconds
  setTimeout(() => {
    closeCelebration();
  }, 3000);
}

/**
 * Close celebration overlay
 */
function closeCelebration() {
  const overlay = document.getElementById('celebrationOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }

  // Remove confetti
  const confetti = document.querySelectorAll('.confetti');
  confetti.forEach(c => c.remove());
}

/**
 * Create confetti animation
 */
function createConfetti() {
  const colors = ['#7C3AED', '#F59E0B', '#0D9488', '#E11D48', '#3B82F6'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.opacity = Math.random();
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.animation = `confettiRain ${2 + Math.random() * 3}s linear forwards`;
    confetti.style.zIndex = '9999';

    document.body.appendChild(confetti);

    // Remove after animation
    setTimeout(() => confetti.remove(), 5000);
  }
}

// ===== TEXT-TO-SPEECH SYSTEM =====

let currentUtterance = null;
let isNarrating = false;

/**
 * Stop all narration
 */
function stopAllNarration() {
  speechSynthesis.cancel();
  isNarrating = false;

  // Reset all play buttons
  document.querySelectorAll('.btn-playing, .playing').forEach(btn => {
    btn.classList.remove('btn-playing', 'playing');
    if (btn.innerHTML.includes('Stop') || btn.innerHTML.includes('⏹️')) {
      if (btn.innerHTML.includes('Read Aloud')) {
        btn.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
      } else {
        btn.textContent = '🔊 Listen';
      }
    }
  });

  // Remove highlights
  removeAllHighlights();

  // Hide floating stop button
  const floatingBtn = document.getElementById('floatingStopBtn');
  if (floatingBtn) floatingBtn.classList.remove('active');
}

/**
 * Remove all text highlights
 */
function removeAllHighlights() {
  document.querySelectorAll('.active-word, .active-sentence').forEach(el => {
    el.classList.remove('active-word', 'active-sentence');
    el.style.backgroundColor = '';
    el.style.padding = '';
    el.style.borderRadius = '';
    el.style.borderLeft = '';
    el.style.borderRight = '';
  });
}

// ===== ACCESSIBILITY FEATURES =====

/**
 * Toggle dyslexia mode
 */
function toggleDyslexia() {
  document.body.classList.toggle('dyslexia-mode');
  const toggle = document.querySelector('#dyslexiaToggle .toggle');
  if (toggle) {
    toggle.classList.toggle('on');
  }

  // Save preference
  localStorage.setItem('dyslexiaMode', document.body.classList.contains('dyslexia-mode'));
}

/**
 * Toggle high contrast mode
 */
function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const toggle = document.querySelector('#contrastToggle .toggle');
  if (toggle) {
    toggle.classList.toggle('on');
  }

  // Save preference
  localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

/**
 * Load accessibility preferences
 */
function loadAccessibilityPreferences() {
  if (localStorage.getItem('dyslexiaMode') === 'true') {
    document.body.classList.add('dyslexia-mode');
    const toggle = document.querySelector('#dyslexiaToggle .toggle');
    if (toggle) toggle.classList.add('on');
  }

  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
    const toggle = document.querySelector('#contrastToggle .toggle');
    if (toggle) toggle.classList.add('on');
  }
}

// ===== HELPER MODALS =====

/**
 * Open helper modal
 */
function openHelper(character) {
  const modal = document.getElementById(`helper-${character}-modal`);
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

/**
 * Close helper modal
 */
function closeHelper(event, character) {
  const modal = document.getElementById(`helper-${character}-modal`);
  if (!modal) return;

  // Close if clicking outside the modal content
  if (event.target === modal || event.target.closest('.close-btn')) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

// ===== NAVIGATION =====

/**
 * Navigate to episode
 */
function goToEpisode(episodeNum) {
  const episodeFiles = {
    1: 'index.html',
    2: 'episode2.html',
    3: 'episode3.html',
    4: 'episode4.html'
  };

  learningState.currentEpisode = episodeNum;
  learningState.currentSection = 1;
  saveProgress();

  window.location.href = episodeFiles[episodeNum];
}

/**
 * Return to landing page
 */
function goToLanding() {
  window.location.href = 'index_landing.html';
}

// ===== INITIALIZATION =====

/**
 * Initialize shared components
 */
function initializeSharedComponents() {
  // Load progress
  loadProgress();

  // Load accessibility preferences
  loadAccessibilityPreferences();

  // Set up modal close handlers
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('vocab-modal') || e.target.classList.contains('helper-modal')) {
      e.target.classList.add('hidden');
      e.target.style.display = 'none';
    }
  });

  // Prevent modal content clicks from closing modal
  document.querySelectorAll('.modal-content, .helper-content, .vocab-content').forEach(el => {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  console.log('📚 Lee & Tee shared components initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSharedComponents);
} else {
  initializeSharedComponents();
}

// ===== EXPORTS (for module usage) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    learningState,
    saveProgress,
    loadProgress,
    addPoints,
    awardBadge,
    showVocab,
    checkAnswer,
    showCelebration,
    stopAllNarration,
    toggleDyslexia,
    toggleHighContrast,
    goToEpisode,
    goToLanding
  };
}
