/**
 * Activities Module
 * Handles SEL, character choice, quizzes, drag-drop, essay hunt, and writing
 * Function-based to match Episode 1's original style
 */

// Activity state
let guidedStepsCompleted = 0;
let currentFinding = null;
let essayPartsFound = 0;
let draggedItem = null;
let correctPlacements = 0;
let matchCount = 0;

// ==================== SEL CHECK-IN ====================

/**
 * Select emotion in SEL check-in
 */
function selectEmotion(element, emotion) {
  document.querySelectorAll('.emotion-option').forEach(el => {
    el.classList.remove('selected');
  });
  element.classList.add('selected');
  learningState.emotion = emotion;
  saveProgress();

  // Mark progress
  markActivityComplete('sel');

  // Show feedback message
  const feedback = document.getElementById('selFeedback');
  if (feedback) {
    let message = '';
    if (emotion === 'tired') {
      message = '💙 Got it! Audio features are available to help you follow along.';
    } else if (emotion === 'nervous') {
      message = '💜 No worries! Extra help features are available in the settings menu.';
    } else if (emotion === 'excited') {
      message = '🎉 Love the energy! Let\'s dive in!';
    } else if (emotion === 'calm') {
      message = '🌟 Perfect mindset for learning. Let\'s get started!';
    }

    feedback.textContent = message;
    feedback.classList.remove('hidden');
  }
}

/**
 * Select final emotion (end of lesson)
 */
function selectFinalEmotion(element, emotion) {
  document.querySelectorAll('.emotion-option').forEach(el => {
    el.classList.remove('selected');
  });
  element.classList.add('selected');
}

// ==================== CHARACTER CHOICE ====================

/**
 * Choose character (Lee or Tee)
 */
function chooseCharacter(character) {
  document.querySelectorAll('.choice-card').forEach(card => {
    card.classList.remove('selected');
  });

  const selectedCard = document.getElementById('choose' + character.charAt(0).toUpperCase() + character.slice(1));
  if (selectedCard) selectedCard.classList.add('selected');

  learningState.characterChoice = character;
  learningState.completedActivities.push('character');
  saveProgress();

  const feedback = document.getElementById('characterFeedback');
  if (feedback) feedback.classList.remove('hidden');

  addPoints(5, 'Great choice!');

  // Set character choice in adaptive helpers if available
  if (typeof adaptiveHelpers !== 'undefined' && adaptiveHelpers.setCharacterChoice) {
    adaptiveHelpers.setCharacterChoice(character);
  }
}

// ==================== COMPREHENSION QUIZZES ====================

/**
 * Check quiz answer
 */
function checkAnswer(btn, correct, id) {
  const container = btn.parentElement;
  container.querySelectorAll('.quiz-option').forEach(b => {
    b.classList.remove('selected', 'correct', 'incorrect');
  });

  if (correct) {
    btn.classList.add('correct');
    const feedback = document.getElementById(id + '-feedback');
    if (feedback) feedback.classList.remove('hidden');

    // Mark section progress based on which quiz
    if (id === 'comp1') {
      markActivityComplete('section1');
    } else if (id === 'comp2') {
      markActivityComplete('section2');
    }
  } else {
    btn.classList.add('incorrect');
  }
}

/**
 * Check comprehension answer (alias)
 */
function checkComprehension(button, isCorrect, feedbackId) {
  checkAnswer(button, isCorrect, feedbackId);
}

// ==================== GUIDED PRACTICE ====================

/**
 * Check guided practice step
 */
function checkGuidedStep(button, isCorrect, feedbackId) {
  const container = button.parentElement;
  const feedback = document.getElementById(feedbackId + '-feedback');

  container.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('bg-green-100', 'bg-red-100', 'border-2', 'border-green-600');
  });

  if (isCorrect) {
    button.classList.add('bg-green-100', 'border-2', 'border-green-600');
    if (feedback) feedback.classList.remove('hidden');

    guidedStepsCompleted++;

    if (guidedStepsCompleted >= 3) {
      const complete = document.getElementById('guidedComplete');
      if (complete) complete.classList.remove('hidden');
    }
  } else {
    button.classList.add('bg-red-100');
    setTimeout(() => button.classList.remove('bg-red-100'), 500);
  }
}

// ==================== ESSAY HUNT ====================

/**
 * Highlight essay part button
 */
function highlightEssayPart(part) {
  currentFinding = part;

  // Reset all paragraphs
  const allParagraphs = ['paragraph-intro', 'paragraph-body', 'paragraph-counterclaim', 'paragraph-conclusion'];
  allParagraphs.forEach(id => {
    const para = document.getElementById(id);
    if (para) {
      para.classList.remove('border-purple-600', 'border-teal-600', 'border-rose-600', 'border-green-600',
                            'bg-purple-50', 'bg-teal-50', 'bg-rose-50', 'bg-green-50');
      para.classList.add('border-transparent');
    }
  });

  // Update button states
  const allButtons = ['btn-claim', 'btn-evidence', 'btn-counterclaim', 'btn-conclusion'];
  allButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.remove('opacity-50', 'ring-4', 'ring-purple-300');
  });

  // Highlight active button
  const activeButton = document.getElementById('btn-' + part);
  if (activeButton) activeButton.classList.add('ring-4', 'ring-purple-300');

  // Update instruction
  const instruction = document.getElementById('essay-instruction');
  const partNames = {
    'claim': 'the CLAIM',
    'evidence': 'the EVIDENCE',
    'counterclaim': 'the COUNTERCLAIM',
    'conclusion': 'the CONCLUSION'
  };
  if (instruction) {
    instruction.textContent = '👇 Now click the paragraph that contains ' + partNames[part] + '!';
  }
}

/**
 * Check essay part selection
 */
function checkEssayPart(paragraphId, correctPart) {
  if (!currentFinding) return;

  const paragraph = document.getElementById('paragraph-' + paragraphId);
  const button = document.getElementById('btn-' + currentFinding);
  const instruction = document.getElementById('essay-instruction');

  if (currentFinding === correctPart) {
    // CORRECT!
    const colors = {
      'claim': { border: 'border-purple-600', bg: 'bg-purple-50' },
      'evidence': { border: 'border-teal-600', bg: 'bg-teal-50' },
      'counterclaim': { border: 'border-rose-600', bg: 'bg-rose-50' },
      'conclusion': { border: 'border-green-600', bg: 'bg-green-50' }
    };

    if (paragraph) {
      paragraph.classList.remove('border-transparent');
      paragraph.classList.add(colors[correctPart].border, colors[correctPart].bg);
    }

    // Mark button as completed
    if (button) {
      button.disabled = true;
      button.classList.add('opacity-50');
      button.classList.remove('ring-4', 'ring-purple-300');

      const foundPrefix = typeof translator !== 'undefined'
        ? translator.t('essay_hunt.found_prefix', '✓ Found')
        : '✓ Found';
      const partName = button.dataset.partName || button.textContent.trim();
      button.textContent = `${foundPrefix} ${partName}`;
    }

    essayPartsFound++;

    if (essayPartsFound >= 4) {
      if (instruction) {
        instruction.textContent = typeof translator !== 'undefined'
          ? translator.t('essay_hunt.perfect', '🎉 Perfect! You found all four parts!')
          : '🎉 Perfect! You found all four parts!';
      }
      const complete = document.getElementById('essayComplete');
      if (complete) complete.classList.remove('hidden');
      updatePoints(20, 'Identified all essay parts!');
    } else {
      if (instruction) {
        instruction.textContent = typeof translator !== 'undefined'
          ? translator.t('essay_hunt.continue', '✓ Correct! Click another button to continue.')
          : '✓ Correct! Click another button to continue.';
      }
    }

    currentFinding = null;
  } else {
    // WRONG - shake animation
    if (paragraph) {
      paragraph.style.animation = 'shake 0.3s';
      setTimeout(() => { paragraph.style.animation = ''; }, 300);
    }
    if (instruction) {
      instruction.textContent = typeof translator !== 'undefined'
        ? translator.t('essay_hunt.not_quite', '❌ Not quite. Try again!')
        : '❌ Not quite. Try again!';
    }
  }
}

// ==================== DRAG AND DROP ====================

/**
 * Initialize drag and drop listeners
 */
function initDragAndDrop() {
  const rapLines = document.querySelectorAll('.rap-line');
  rapLines.forEach(line => {
    line.addEventListener('dragstart', dragStart);
    line.addEventListener('dragend', dragEnd);
  });
}

function dragStart(e) {
  draggedItem = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.target.dataset.step);
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function drop(e) {
  e.preventDefault();
  const dropZone = e.currentTarget;
  dropZone.classList.remove('drag-over');

  const targetStep = dropZone.dataset.target;
  const itemStep = draggedItem.dataset.step;

  if (targetStep === itemStep) {
    // Correct!
    dropZone.innerHTML = '';
    const clone = draggedItem.cloneNode(true);
    clone.classList.add('correct');
    clone.draggable = false;
    dropZone.appendChild(clone);
    dropZone.classList.add('filled');

    draggedItem.style.display = 'none';
    correctPlacements++;

    if (correctPlacements >= 4) {
      const feedback = document.getElementById('strategyFeedback');
      if (feedback) feedback.classList.remove('hidden');

      if (!learningState.completedActivities.includes('dragDrop')) {
        learningState.completedActivities.push('dragDrop');
        addPoints(25, 'Strategy mastered!');
        awardBadge('🎤');
        markActivityComplete('drag');
      }
    }
  } else {
    // Incorrect - shake animation
    draggedItem.classList.add('incorrect');
    setTimeout(() => draggedItem.classList.remove('incorrect'), 300);
  }

  saveProgress();
}

// ==================== PROBLEM ANALYSIS ====================

/**
 * Check problem analysis answers
 */
function checkProblemAnswers() {
  const checkboxes = document.querySelectorAll('.problem-check');
  let allCorrect = true;
  let correctCount = 0;
  let incorrectCount = 0;

  checkboxes.forEach(checkbox => {
    const isCorrect = checkbox.dataset.correct === 'true';
    const isChecked = checkbox.checked;

    if (isCorrect && isChecked) correctCount++;
    if (!isCorrect && isChecked) incorrectCount++;
    if ((isCorrect && !isChecked) || (!isCorrect && isChecked)) allCorrect = false;
  });

  if (allCorrect) {
    const feedback = document.getElementById('problemFeedback');
    if (feedback) feedback.classList.remove('hidden');

    if (!learningState.completedActivities.includes('problemAnalysis')) {
      learningState.completedActivities.push('problemAnalysis');
      const reason = typeof translator !== 'undefined'
        ? translator.t('rewards.critical_thinking', 'Critical thinking!')
        : 'Critical thinking!';
      addPoints(15, reason);
      awardBadge('🧠');
    }
  } else {
    let message = typeof translator !== 'undefined'
      ? translator.t('feedback.problem_not_quite', 'Not quite! ')
      : 'Not quite! ';

    if (incorrectCount > 0) {
      message += typeof translator !== 'undefined'
        ? translator.t('feedback.problem_behavior', "Remember: we're looking for what makes the ARGUMENT weak, not just behavior issues. ")
        : "Remember: we're looking for what makes the ARGUMENT weak, not just behavior issues. ";
    }

    if (correctCount < 2) {
      message += typeof translator !== 'undefined'
        ? translator.t('feedback.problem_two_answers', 'There are TWO correct answers - make sure you select both!')
        : 'There are TWO correct answers - make sure you select both!';
    }

    alert(message);
  }

  saveProgress();
}

// ==================== WRITING RESPONSE ====================

/**
 * Toggle rubric item
 */
function toggleRubricItem(itemId) {
  const item = document.getElementById(itemId);
  if (!item) return;

  const checkbox = item.querySelector('input');
  if (checkbox && checkbox.checked) {
    item.classList.add('checked');
  } else {
    item.classList.remove('checked');
  }
}

/**
 * Auto-update rubric based on text content
 */
function updateRubric() {
  const textarea = document.getElementById('studentResponse');
  if (!textarea) return;

  const text = textarea.value.toLowerCase();
  const rubricItems = document.querySelectorAll('.rubric-item');

  rubricItems.forEach((item, index) => {
    const checkbox = item.querySelector('input');
    let isIncluded = false;

    if (index === 0 && (text.includes('they said') || text.includes('you claim') || text.includes('argument is'))) {
      isIncluded = true;
    } else if (index === 1 && (text.includes('evidence') || text.includes('proof') || text.includes('facts') || text.includes('research') || text.includes('study'))) {
      isIncluded = true;
    } else if (index === 2 && (text.includes('wrong') || text.includes('incorrect') || text.includes('mistaken') || text.includes('however') || text.includes('but'))) {
      isIncluded = true;
    } else if (index === 3 && (text.includes('conclusion') || text.includes('therefore') || text.includes('position') || text.includes('believe') || text.includes('think'))) {
      isIncluded = true;
    }

    if (checkbox) checkbox.checked = isIncluded;
    toggleRubricItem(item.id);
  });
}

/**
 * Save student response
 */
function saveResponse() {
  const textarea = document.getElementById('studentResponse');
  if (!textarea) return;

  const response = textarea.value;
  if (response.trim().length < 50) {
    alert('Try writing a bit more! Use all 4 steps of Tee\'s strategy.');
    return;
  }

  learningState.savedResponses.videoGames = response;
  saveProgress();

  if (!learningState.completedActivities.includes('openResponse')) {
    learningState.completedActivities.push('openResponse');
    addPoints(30, 'Response written!');
    awardBadge('✍️');
    markActivityComplete('essay');
  }

  alert('💾 Your response has been saved!');
}

/**
 * Share response prompt
 */
function shareResponse() {
  const textarea = document.getElementById('studentResponse');
  if (!textarea || textarea.value.trim().length < 50) {
    alert('Write your response first, then you can share with a partner!');
    return;
  }

  alert('🤝 Great! Now share your screen or read your response to your partner. Ask them:\n\n1. Did I use all 4 steps?\n2. Was my evidence strong?\n3. What could make it better?');
}

// ==================== MATCHING ACTIVITY ====================

/**
 * Check match answer
 */
function checkMatch(select, correctValue) {
  if (select.value === correctValue) {
    select.style.background = '#DCFCE7';
    select.style.borderColor = '#16A34A';
    matchCount++;

    if (matchCount >= 4) {
      const feedback = document.getElementById('matchFeedback');
      if (feedback) feedback.classList.remove('hidden');

      if (!learningState.completedActivities.includes('matching')) {
        learningState.completedActivities.push('matching');
        addPoints(15, 'Perfect match!');
      }
    }
  } else if (select.value !== '') {
    select.style.background = '#FEE2E2';
    select.style.borderColor = '#E11D48';
  }
  saveProgress();
}

// ==================== VOICE DICTATION ====================

/**
 * Start voice dictation
 */
function startDictation(button) {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice typing requires Chrome browser. Please use Chrome for this feature.');
    return;
  }

  const textarea = button.parentElement.previousElementSibling;
  const recognition = new webkitSpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    button.textContent = '🎤 Listening...';
    button.classList.add('bg-red-100', 'text-red-700');
  };

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    textarea.value += (textarea.value ? ' ' : '') + transcript;

    if (textarea.value.trim().length > 10) {
      markActivityComplete('reflect');
    }
  };

  recognition.onend = function() {
    button.textContent = '🎤 Speak Answer';
    button.classList.remove('bg-red-100', 'text-red-700');
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error', event.error);
    button.textContent = '🎤 Speak Answer';
    button.classList.remove('bg-red-100', 'text-red-700');
  };

  recognition.start();
}

// ==================== HELPER MODALS ====================

/**
 * Open helper modal
 */
function openHelper(character) {
  const modal = document.getElementById(character + '-modal');
  if (modal) modal.classList.add('open');
}

/**
 * Close helper modal
 */
function closeHelper(e, character) {
  if (e.target.classList.contains('helper-modal')) {
    const modal = document.getElementById(character + '-modal');
    if (modal) modal.classList.remove('open');
  }
}

// Export functions
window.selectEmotion = selectEmotion;
window.selectFinalEmotion = selectFinalEmotion;
window.chooseCharacter = chooseCharacter;
window.checkAnswer = checkAnswer;
window.checkComprehension = checkComprehension;
window.checkGuidedStep = checkGuidedStep;
window.highlightEssayPart = highlightEssayPart;
window.checkEssayPart = checkEssayPart;
window.initDragAndDrop = initDragAndDrop;
window.dragStart = dragStart;
window.dragEnd = dragEnd;
window.dragOver = dragOver;
window.dragLeave = dragLeave;
window.drop = drop;
window.checkProblemAnswers = checkProblemAnswers;
window.toggleRubricItem = toggleRubricItem;
window.updateRubric = updateRubric;
window.saveResponse = saveResponse;
window.shareResponse = shareResponse;
window.checkMatch = checkMatch;
window.startDictation = startDictation;
window.openHelper = openHelper;
window.closeHelper = closeHelper;
