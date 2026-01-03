/**
 * Episode 1: The Recess Battle - JavaScript
 * Phase management, state persistence, and activity logic
 */

// ===== STATE MANAGEMENT =====

const STATE_KEY = 'leeTee_ep1_state';

let state = {
  // Phase tracking
  currentPhase: 0,
  completedPhases: [],

  // Points and badges
  points: 0,
  badges: [],

  // Activity completion
  activities: {
    vocabFillIn: false,
    dragAndDrop: false,
    writingResponse: false,
    reflection: false
  },

  // Settings
  mode: 'guided', // 'guided' or 'explore'
  guideChoice: null, // 'lee' or 'tee'
  emotionalState: null,
  accessibility: {
    dyslexiaFont: false,
    highContrast: false,
    hintsEnabled: true
  }
};

// ===== BADGE DEFINITIONS =====

const BADGES = {
  vocab_builder: {
    id: 'vocab_builder',
    name: 'Vocabulary Builder',
    icon: '📚',
    description: 'Mastered key vocabulary terms'
  },
  strategy_star: {
    id: 'strategy_star',
    name: 'Strategy Star',
    icon: '⭐',
    description: 'Identified the 4-step strategy'
  },
  sequence_solver: {
    id: 'sequence_solver',
    name: 'Sequence Solver',
    icon: '🧩',
    description: 'Correctly ordered all steps'
  },
  writer_on_the_move: {
    id: 'writer_on_the_move',
    name: 'Writer on the Move',
    icon: '✍️',
    description: 'Wrote a complete response'
  },
  episode_complete: {
    id: 'episode_complete',
    name: 'Episode Champion',
    icon: '🏆',
    description: 'Completed Episode 1'
  }
};

// ===== POINT EVENTS =====

const POINT_EVENTS = {
  VOCAB_COMPLETE: 10,
  STRATEGY_PRACTICE: 10,
  DRAG_DROP_COMPLETE: 10,
  WRITING_SAVED: 20,
  REFLECTION_COMPLETE: 10
};

// ===== STATE PERSISTENCE =====

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      const loaded = JSON.parse(saved);
      Object.assign(state, loaded);
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
}

function resetState() {
  if (confirm('Are you sure you want to reset all progress? This will clear all points and badges.')) {
    localStorage.removeItem(STATE_KEY);
    location.reload();
  }
}

// ===== PHASE MANAGEMENT =====

function setActivePhase(phaseNum) {
  state.currentPhase = phaseNum;
  saveState();
  renderPhases();
  updateHeader();
  scrollToTop();
}

function completePhase(phaseNum) {
  // Mark phase complete
  if (!state.completedPhases.includes(phaseNum)) {
    state.completedPhases.push(phaseNum);
  }

  // Award phase completion points/badges
  awardPhaseRewards(phaseNum);

  // Move to next phase
  const nextPhase = phaseNum + 1;
  if (nextPhase <= 4) {
    setActivePhase(nextPhase);
  } else {
    // Episode complete
    showCompletionScreen();
  }
}

function awardPhaseRewards(phaseNum) {
  switch(phaseNum) {
    case 1:
      if (state.activities.vocabFillIn) {
        awardBadge('vocab_builder');
      }
      break;
    case 2:
      awardBadge('strategy_star');
      break;
    case 3:
      if (state.activities.writingResponse) {
        awardBadge('writer_on_the_move');
      }
      break;
    case 4:
      if (state.activities.reflection) {
        awardBadge('episode_complete');
      }
      break;
  }
}

function renderPhases() {
  const phases = document.querySelectorAll('.lesson-phase');

  if (state.mode === 'guided') {
    renderGuidedMode(phases);
  } else {
    renderExploreMode(phases);
  }
}

function renderGuidedMode(phases) {
  phases.forEach((phase, index) => {
    const phaseNum = parseInt(phase.dataset.phase);

    // Remove all state classes
    phase.classList.remove('is-active', 'is-completed', 'is-locked', 'is-expanded');

    if (phaseNum < state.currentPhase) {
      // Previous phase - collapsed but reviewable
      phase.classList.add('is-completed');

      // Add click handler to expand/collapse
      const header = phase.querySelector('.phase-header');
      if (header) {
        header.style.cursor = 'pointer';
        header.onclick = () => {
          phase.classList.toggle('is-expanded');
        };
      }
    } else if (phaseNum === state.currentPhase) {
      // Current phase - active and expanded
      phase.classList.add('is-active');
    } else {
      // Future phase - locked
      phase.classList.add('is-locked');
    }
  });
}

function renderExploreMode(phases) {
  phases.forEach(phase => {
    phase.classList.remove('is-active', 'is-completed', 'is-locked', 'is-expanded');

    // All phases visible in explore mode
    const phaseNum = parseInt(phase.dataset.phase);
    if (state.completedPhases.includes(phaseNum)) {
      phase.classList.add('is-completed', 'is-expanded');
    }
  });
}

function toggleMode() {
  state.mode = state.mode === 'guided' ? 'explore' : 'guided';

  // Update body class
  document.body.classList.toggle('mode-explore', state.mode === 'explore');

  // Update mode button text
  const modeText = document.getElementById('mode-text');
  if (modeText) {
    modeText.textContent = state.mode === 'guided' ? 'Guided' : 'Explore';
  }

  saveState();
  renderPhases();
}

function goBack() {
  if (state.currentPhase > 0) {
    setActivePhase(state.currentPhase - 1);
  }
}

// ===== HEADER UPDATES =====

function updateHeader() {
  // Update phase display
  const phaseNum = document.getElementById('current-phase-num');
  const phaseTitle = document.getElementById('current-phase-title');

  if (phaseNum) {
    phaseNum.textContent = state.currentPhase;
  }

  if (phaseTitle) {
    const currentPhaseEl = document.querySelector(`[data-phase="${state.currentPhase}"]`);
    if (currentPhaseEl) {
      phaseTitle.textContent = currentPhaseEl.dataset.phaseTitle;
    }
  }

  // Update progress bar
  const progressFill = document.getElementById('phase-progress-bar');
  const progressText = document.getElementById('phase-progress-text');
  const progress = (state.completedPhases.length / 5) * 100;

  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `${Math.round(progress)}%`;
  }

  // Update points
  const pointsDisplay = document.getElementById('points-display');
  if (pointsDisplay) {
    pointsDisplay.textContent = state.points;
  }

  // Update badges
  const badgesDisplay = document.getElementById('badges-display');
  if (badgesDisplay) {
    badgesDisplay.textContent = state.badges.length;
  }
}

// ===== POINTS AND BADGES =====

function awardPoints(eventId) {
  const points = POINT_EVENTS[eventId];
  if (!points) return;

  state.points += points;

  // Animate points change
  if (typeof animatePointsChange === 'function') {
    animatePointsChange(points);
  }

  saveState();
  updateHeader();

  if (typeof showNotification === 'function') {
    showNotification(`+${points} points!`, 'success');
  }
}

function awardBadge(badgeId) {
  if (state.badges.includes(badgeId)) return;

  state.badges.push(badgeId);

  const badge = BADGES[badgeId];
  if (badge && typeof showBadgeNotification === 'function') {
    showBadgeNotification(badge);
  }

  saveState();
  updateHeader();
}

// ===== ACTIVITY HANDLERS =====

// Phase 0: Emotional check and guide choice
function selectEmotion(emotion) {
  state.emotionalState = emotion;
  saveState();

  // Highlight selected
  document.querySelectorAll('.emotion-choice').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.closest('.emotion-choice').classList.add('selected');

  // Enable continue if guide also chosen
  checkPhase0Complete();
}

function selectGuide(guide) {
  state.guideChoice = guide;
  saveState();

  // Highlight selected
  document.querySelectorAll('.guide-choice').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.closest('.guide-choice').classList.add('selected');

  // Enable continue if emotion also chosen
  checkPhase0Complete();
}

function checkPhase0Complete() {
  const continueBtn = document.querySelector('[data-phase="0"] .btn-continue');
  if (continueBtn) {
    continueBtn.disabled = !(state.emotionalState && state.guideChoice);
  }
}

// Phase 1: Vocabulary fill-in
const vocabAnswers = {
  blank1: 'claim',
  blank2: 'evidence',
  blank3: 'counterclaim'
};

function checkVocabAnswer(blankId, answer) {
  const correct = vocabAnswers[blankId] === answer.toLowerCase();
  const blank = document.getElementById(blankId);

  if (blank) {
    if (correct) {
      blank.classList.remove('incorrect');
      blank.classList.add('correct');
    } else {
      blank.classList.remove('correct');
      blank.classList.add('incorrect');
    }
  }

  // Check if all correct
  checkVocabComplete();
}

function checkVocabComplete() {
  const allCorrect = Object.keys(vocabAnswers).every(blankId => {
    const blank = document.getElementById(blankId);
    return blank && blank.classList.contains('correct');
  });

  if (allCorrect && !state.activities.vocabFillIn) {
    state.activities.vocabFillIn = true;
    awardPoints('VOCAB_COMPLETE');
    saveState();

    // Enable continue button
    const continueBtn = document.querySelector('[data-phase="1"] .btn-continue');
    if (continueBtn) {
      continueBtn.disabled = false;
    }
  }
}

// Phase 2: Drag and drop sequencing
let draggedElement = null;

function initDragAndDrop() {
  const draggables = document.querySelectorAll('.drag-item');
  const container = document.getElementById('drag-container');

  if (!draggables.length || !container) return;

  draggables.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });

  container.addEventListener('dragover', handleDragOver);
  container.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (draggedElement !== this) {
    const allItems = [...document.querySelectorAll('.drag-item')];
    const draggedIndex = allItems.indexOf(draggedElement);
    const targetIndex = allItems.indexOf(e.target.closest('.drag-item'));

    if (targetIndex !== -1) {
      const container = document.getElementById('drag-container');
      if (draggedIndex < targetIndex) {
        container.insertBefore(draggedElement, allItems[targetIndex].nextSibling);
      } else {
        container.insertBefore(draggedElement, allItems[targetIndex]);
      }
    }
  }

  return false;
}

function checkDragOrder() {
  const items = document.querySelectorAll('.drag-item');
  const correctOrder = ['notice', 'think', 'support', 'conclude'];
  const currentOrder = [...items].map(item => item.dataset.step);

  const correct = JSON.stringify(correctOrder) === JSON.stringify(currentOrder);

  if (correct && !state.activities.dragAndDrop) {
    state.activities.dragAndDrop = true;
    awardPoints('DRAG_DROP_COMPLETE');
    awardBadge('sequence_solver');
    saveState();

    if (typeof showNotification === 'function') {
      showNotification('Perfect! All steps are in the correct order!', 'success');
    }

    // Enable continue button
    const continueBtn = document.querySelector('[data-phase="2"] .btn-continue');
    if (continueBtn) {
      continueBtn.disabled = false;
    }
  } else if (!correct) {
    if (typeof showNotification === 'function') {
      showNotification('Not quite right. Try again!', 'error');
    }
  }
}

// Phase 3: Writing response
function saveWriting() {
  const textarea = document.getElementById('writing-response');
  if (!textarea) return;

  const text = textarea.value.trim();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount >= 50 && !state.activities.writingResponse) {
    state.activities.writingResponse = true;
    awardPoints('WRITING_SAVED');
    saveState();

    if (typeof showNotification === 'function') {
      showNotification('Writing saved! Great work!', 'success');
    }

    // Enable continue button
    const continueBtn = document.querySelector('[data-phase="3"] .btn-continue');
    if (continueBtn) {
      continueBtn.disabled = false;
    }
  } else if (wordCount < 50) {
    if (typeof showNotification === 'function') {
      showNotification(`You need at least 50 words. Current: ${wordCount}`, 'info');
    }
  }
}

function updateWordCount() {
  const textarea = document.getElementById('writing-response');
  const counter = document.getElementById('word-count');

  if (!textarea || !counter) return;

  const text = textarea.value.trim();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  counter.textContent = `${wordCount} words`;

  // Change color based on count
  if (wordCount >= 50) {
    counter.style.color = '#10b981';
  } else {
    counter.style.color = '#6b7280';
  }
}

// Phase 4: Reflection
function saveReflection() {
  const q1 = document.getElementById('reflection-q1');
  const q2 = document.getElementById('reflection-q2');
  const q3 = document.getElementById('reflection-q3');

  if (!q1 || !q2 || !q3) return;

  const allAnswered = q1.value.trim() && q2.value.trim() && q3.value.trim();

  if (allAnswered && !state.activities.reflection) {
    state.activities.reflection = true;
    awardPoints('REFLECTION_COMPLETE');
    saveState();

    // Enable continue button (which will show completion)
    const continueBtn = document.querySelector('[data-phase="4"] .btn-continue');
    if (continueBtn) {
      continueBtn.disabled = false;
    }
  }
}

// ===== CONTEXTUAL HELP =====

const HELP_CONTENT = {
  'vocab-lee': {
    title: '📝 Lee: Word Help',
    type: 'lee',
    bullets: [
      'A claim is what someone believes',
      'Evidence is proof that supports the claim',
      'Try this frame: "I claim that ___ because ___"'
    ],
    example: 'Example: "I claim that recess is important because students need exercise."'
  },
  'vocab-tee': {
    title: '🤔 Tee: Strategy Check',
    type: 'tee',
    bullets: [
      'What is the writer trying to prove?',
      'What facts or examples support their point?',
      'Could someone disagree? What would they say?'
    ]
  },
  'sequence-tee': {
    title: '🤔 Tee: How to Order the Steps',
    type: 'tee',
    bullets: [
      'First, what does Tee do? (Repeats Jayden\'s claim)',
      'Then what? (Points out the weakness)',
      'Next? (Gives proof/evidence)',
      'Finally? (Wraps it up with impact)'
    ]
  },
  'sequence-lee': {
    title: '📝 Lee: Sentence Frame Reminder',
    type: 'lee',
    bullets: [
      'Step 1: "You said ___"',
      'Step 2: "But that doesn\'t work because ___"',
      'Step 3: "For example, ___"',
      'Step 4: "So really, ___"'
    ]
  },
  'writing-lee': {
    title: '📝 Lee: Writing Frame',
    type: 'lee',
    bullets: [
      'Paragraph 1: State your claim → "I believe that ___"',
      'Paragraph 2: Give evidence → "For example, ___" → "This shows that ___"',
      'Paragraph 3: Address counterclaim → "Some might say ___, but ___"',
      'Paragraph 4: Conclude → "Therefore, ___"'
    ]
  },
  'writing-tee': {
    title: '🤔 Tee: Quality Check',
    type: 'tee',
    bullets: [
      '☐ Did you clearly state what you believe?',
      '☐ Did you give at least 2 pieces of evidence?',
      '☐ Did you explain WHY your evidence matters?',
      '☐ Did you address what someone might disagree with?',
      '☐ Does your conclusion tie it all together?'
    ]
  }
};

function openHelp(helpId) {
  const help = HELP_CONTENT[helpId];
  if (!help) return;

  const modal = document.createElement('div');
  modal.className = 'help-modal';
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  const content = document.createElement('div');
  content.className = `help-content ${help.type}`;
  content.onclick = (e) => e.stopPropagation();

  let html = `<h3>${help.title}</h3><ul>`;
  help.bullets.forEach(bullet => {
    html += `<li>${bullet}</li>`;
  });
  html += '</ul>';

  if (help.example) {
    html += `<div class="example">${help.example}</div>`;
  }

  html += '<button class="btn btn-primary close-btn" onclick="this.closest(\'.help-modal\').remove()">Got it!</button>';

  content.innerHTML = html;
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// ===== COMPLETION SCREEN =====

function showCompletionScreen() {
  scrollToTop();

  // The completion content is already in Phase 4
  // Just make sure it's visible
  if (typeof showNotification === 'function') {
    showNotification('🎉 Episode Complete! Well done!', 'success');
  }
}

// ===== INITIALIZATION =====

function init() {
  // Load saved state
  loadState();

  // Apply accessibility settings
  if (state.accessibility.dyslexiaFont) {
    document.body.classList.add('dyslexia-mode');
  }
  if (state.accessibility.highContrast) {
    document.body.classList.add('high-contrast');
  }

  // Set mode class on body
  if (state.mode === 'explore') {
    document.body.classList.add('mode-explore');
  }

  // Render phases based on current state
  renderPhases();

  // Update header
  updateHeader();

  // Initialize drag and drop
  initDragAndDrop();

  // Check Phase 0 completion status
  checkPhase0Complete();

  // Scroll to current phase if not at the start
  if (state.currentPhase > 0) {
    setTimeout(() => {
      const currentPhaseEl = document.querySelector(`[data-phase="${state.currentPhase}"]`);
      if (currentPhaseEl) {
        currentPhaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for global access
if (typeof window !== 'undefined') {
  window.state = state;
  window.saveState = saveState;
  window.loadState = loadState;
  window.resetState = resetState;
  window.setActivePhase = setActivePhase;
  window.completePhase = completePhase;
  window.toggleMode = toggleMode;
  window.goBack = goBack;
  window.selectEmotion = selectEmotion;
  window.selectGuide = selectGuide;
  window.checkVocabAnswer = checkVocabAnswer;
  window.checkDragOrder = checkDragOrder;
  window.saveWriting = saveWriting;
  window.updateWordCount = updateWordCount;
  window.saveReflection = saveReflection;
  window.openHelp = openHelp;
}
