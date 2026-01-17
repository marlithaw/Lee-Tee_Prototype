/**
 * Gamification Module
 * Handles points, badges, and celebrations
 */

/**
 * Add points to the learning state
 */
function addPoints(amount, reason) {
  learningState.points += amount;

  // Update global state if available
  if (typeof addGlobalPoints === 'function') {
    addGlobalPoints(currentEpisodeNumber, amount, reason);
  }

  // Update displays
  const pointsDisplay = document.getElementById('pointsDisplay');
  if (pointsDisplay) pointsDisplay.textContent = learningState.points;

  const finalPoints = document.getElementById('finalPoints');
  if (finalPoints) finalPoints.textContent = learningState.points;

  saveProgress();

  // Show celebration
  celebrate(amount, reason);

  // Create confetti
  createConfetti();
}

/**
 * Alternative name for addPoints (used in some places)
 */
function updatePoints(amount, reason) {
  addPoints(amount, reason);
}

/**
 * Show celebration overlay
 */
function celebrate(points, reason) {
  const overlay = document.getElementById('celebrationOverlay');
  if (!overlay) return;

  const emoji = document.getElementById('celebrationEmoji');
  const title = document.getElementById('celebrationTitle');
  const message = document.getElementById('celebrationMessage');

  if (emoji) emoji.textContent = points >= 25 ? '🎉' : '⭐';
  if (title) title.textContent = reason;
  if (message) message.textContent = `+${points} points!`;

  overlay.classList.add('show');

  setTimeout(() => {
    overlay.classList.remove('show');
  }, 3000);
}

/**
 * Close celebration overlay
 */
function closeCelebration() {
  const overlay = document.getElementById('celebrationOverlay');
  if (overlay) overlay.classList.remove('show');
}

/**
 * Create confetti effect
 */
function createConfetti() {
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
 * Award a badge
 */
function awardBadge(badge) {
  if (!learningState.badges.includes(badge)) {
    learningState.badges.push(badge);
    updateBadges();
    saveProgress();
  }
}

/**
 * Update badges display
 */
function updateBadges() {
  const container = document.getElementById('badgeContainer');
  if (!container) return;

  container.innerHTML = '';

  learningState.badges.forEach(badge => {
    const badgeEl = document.createElement('div');
    badgeEl.className = 'text-2xl badge-earned';
    badgeEl.textContent = badge;
    badgeEl.title = getBadgeName(badge);
    container.appendChild(badgeEl);
  });
}

/**
 * Get human-readable badge name
 */
function getBadgeName(emoji) {
  const badges = {
    '🎯': 'Vocab Master',
    '🧠': 'Critical Thinker',
    '✍️': 'Response Writer',
    '🎤': 'Strategy Expert',
    '🏆': 'Lesson Complete'
  };
  return badges[emoji] || 'Badge Earned';
}

// Export functions
window.addPoints = addPoints;
window.updatePoints = updatePoints;
window.celebrate = celebrate;
window.closeCelebration = closeCelebration;
window.createConfetti = createConfetti;
window.awardBadge = awardBadge;
window.updateBadges = updateBadges;
window.getBadgeName = getBadgeName;
