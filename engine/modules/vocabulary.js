/**
 * Vocabulary Module
 * Handles vocabulary modal, word definitions, and fill-in-blank activities
 */

// Vocabulary data (populated by episode config)
let vocabData = {};

// Current narration state
let currentNarration = null;
let isPlaying = false;

/**
 * Show vocabulary modal for a word
 */
function showVocab(word) {
  // Stop any current narration
  if (currentNarration) {
    speechSynthesis.cancel();
    currentNarration = null;
    isPlaying = false;
  }

  const data = vocabData[word];
  if (!data) {
    console.warn(`Vocabulary word "${word}" not found`);
    return;
  }

  const vocabWord = document.getElementById('vocabWord');
  const vocabDef = document.getElementById('vocabDef');
  const vocabExample = document.getElementById('vocabExample');
  const vocabSpanish = document.getElementById('vocabSpanish');
  const vocabImage = document.getElementById('vocabImage');
  const vocabModal = document.getElementById('vocabModal');

  if (vocabWord) vocabWord.textContent = data.word;
  if (vocabDef) vocabDef.textContent = data.def;
  if (vocabExample) vocabExample.textContent = data.example;
  if (vocabSpanish) vocabSpanish.textContent = data.spanish;
  if (vocabImage) vocabImage.textContent = data.image;
  if (vocabModal) vocabModal.classList.add('open');

  // Track vocab learning for skills
  if (typeof onVocabLearned === 'function') {
    onVocabLearned(currentEpisodeNumber, word);
  }
}

/**
 * Close vocabulary modal
 */
function closeVocabModal(e) {
  if (e.target.classList.contains('vocab-modal')) {
    const vocabModal = document.getElementById('vocabModal');
    if (vocabModal) vocabModal.classList.remove('open');

    // Stop any current narration
    if (currentNarration) {
      speechSynthesis.cancel();
      currentNarration = null;
      isPlaying = false;
    }
  }
}

/**
 * Speak the current vocabulary word
 */
function speakWord() {
  // Stop any existing narration
  if (currentNarration) {
    speechSynthesis.cancel();
  }

  // Get the vocabulary word text from the modal
  const vocabWord = document.getElementById('vocabWord');
  if (!vocabWord) return;

  const word = vocabWord.textContent;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.9;

  // Store the current narration
  currentNarration = utterance;

  // Clear narration when done
  utterance.onend = () => {
    currentNarration = null;
    isPlaying = false;
  };

  utterance.onerror = () => {
    currentNarration = null;
    isPlaying = false;
  };

  speechSynthesis.cancel();

  const speakNow = () => {
    const voices = speechSynthesis.getVoices();
    const v = voices.find(x => x.name === "Google US English") ||
              voices.find(x => x.lang === "en-US") ||
              voices[0];

    if (v) {
      utterance.voice = v;
      utterance.lang = 'en-US';
    }
    speechSynthesis.speak(utterance);
  };

  if (speechSynthesis.getVoices().length) {
    speakNow();
  } else {
    speechSynthesis.onvoiceschanged = () => speakNow();
  }
}

/**
 * Show vocabulary choices dropdown
 */
function showVocabChoices(blankId, correctWord) {
  // Close all other choice menus
  document.querySelectorAll('.vocab-choices').forEach(menu => {
    menu.classList.remove('show');
  });

  // Show this one
  const choicesId = blankId.replace('blank', 'choices');
  const choices = document.getElementById(choicesId);
  if (choices) choices.classList.add('show');
}

/**
 * Check vocabulary choice answer
 */
function checkVocabChoice(blankId, choicesId, selectedWord, isCorrect) {
  const choices = document.getElementById(choicesId);
  const blank = document.getElementById(blankId);
  const feedbackId = blankId.replace('blank', 'feedback');

  // Hide choices
  if (choices) choices.classList.remove('show');

  if (isCorrect) {
    if (blank) {
      blank.textContent = selectedWord;
      blank.classList.add('text-green-700', 'font-bold');
    }

    const feedback = document.getElementById(feedbackId);
    if (feedback) feedback.classList.remove('hidden');

    // Award points
    if (!learningState.completedActivities.includes(blankId)) {
      learningState.completedActivities.push(blankId);
      addPoints(10, 'Vocab correct!');

      // Check if all vocab done
      const allBlanks = document.querySelectorAll('[id^="blank"]');
      const vocabCompleted = Array.from(allBlanks).every(b =>
        learningState.completedActivities.includes(b.id)
      );

      if (vocabCompleted) {
        markActivityComplete('vocab');
        awardBadge('🎯');
      }
    }
  } else {
    // Incorrect feedback
    if (blank) {
      blank.style.background = '#FEE2E2';
      setTimeout(() => {
        blank.style.background = '';
      }, 500);
    }
  }

  saveProgress();
}

/**
 * Set vocabulary data from config
 */
function setVocabData(data) {
  vocabData = data;
}

// Export functions
window.vocabData = vocabData;
window.showVocab = showVocab;
window.closeVocabModal = closeVocabModal;
window.speakWord = speakWord;
window.showVocabChoices = showVocabChoices;
window.checkVocabChoice = checkVocabChoice;
window.setVocabData = setVocabData;
