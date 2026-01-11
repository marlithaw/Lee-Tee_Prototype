/**
 * Activities Module
 * Handles activity initialization, interaction, and state
 */

class ActivitiesManager {
  constructor(progressManager) {
    this.progress = progressManager;
    this.activities = new Map();
    this.currentNarration = null;
    this.isPlaying = false;
  }

  /**
   * Initialize all activities
   */
  init() {
    this.initVocabulary();
    this.initDragDrop();
    this.initSpeechSynthesis();
    return this;
  }

  /**
   * Register an activity
   * @param {string} id - Activity identifier
   * @param {Object} config - Activity configuration
   */
  register(id, config) {
    this.activities.set(id, {
      ...config,
      complete: false
    });
  }

  // ========================================
  // VOCABULARY ACTIVITIES
  // ========================================

  /**
   * Initialize vocabulary activities
   */
  initVocabulary() {
    // Vocabulary modal handlers are set up by the renderer
  }

  /**
   * Show vocabulary modal
   * @param {string} word - Word key
   * @param {Object} vocabData - Vocabulary definitions
   */
  showVocabModal(word, vocabData) {
    // Stop any current narration
    this.stopNarration();

    const data = vocabData[word];
    if (!data) return;

    const modal = document.getElementById('vocabModal');
    if (!modal) return;

    document.getElementById('vocabWord').textContent = data.word;
    document.getElementById('vocabDef').textContent = data.def;
    document.getElementById('vocabExample').textContent = data.example;
    document.getElementById('vocabSpanish').textContent = data.spanish || '';
    document.getElementById('vocabImage').textContent = data.image || '';

    modal.classList.add('open');
  }

  /**
   * Close vocabulary modal
   * @param {Event} e - Click event
   */
  closeVocabModal(e) {
    if (e.target.classList.contains('vocab-modal')) {
      document.getElementById('vocabModal').classList.remove('open');
      this.stopNarration();
    }
  }

  /**
   * Check vocabulary choice
   * @param {string} blankId - Blank element ID
   * @param {string} choicesId - Choices element ID
   * @param {string} selectedWord - Selected word
   * @param {boolean} isCorrect - Whether selection is correct
   */
  checkVocabChoice(blankId, choicesId, selectedWord, isCorrect) {
    const choices = document.getElementById(choicesId);
    const blank = document.getElementById(blankId);
    const feedbackId = blankId.replace('blank', 'feedback');

    // Hide choices
    if (choices) choices.classList.remove('show');

    if (isCorrect) {
      blank.textContent = selectedWord;
      blank.classList.add('text-green-700', 'font-bold');

      const feedback = document.getElementById(feedbackId);
      if (feedback) feedback.classList.remove('hidden');

      // Complete activity
      if (!this.progress.isComplete(blankId)) {
        this.progress.completeActivity(blankId);
        this.progress.addPoints(10, 'Vocab correct!');
      }
    } else {
      // Incorrect feedback
      blank.style.background = '#FEE2E2';
      setTimeout(() => {
        blank.style.background = '';
      }, 500);
    }
  }

  // ========================================
  // DRAG AND DROP
  // ========================================

  /**
   * Initialize drag and drop activities
   */
  initDragDrop() {
    this.draggedItem = null;
    this.correctPlacements = 0;
  }

  /**
   * Handle drag start
   * @param {DragEvent} e
   */
  dragStart(e) {
    this.draggedItem = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.step);
  }

  /**
   * Handle drag end
   * @param {DragEvent} e
   */
  dragEnd(e) {
    e.target.classList.remove('dragging');
  }

  /**
   * Handle drag over
   * @param {DragEvent} e
   */
  dragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }

  /**
   * Handle drag leave
   * @param {DragEvent} e
   */
  dragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  /**
   * Handle drop
   * @param {DragEvent} e
   * @param {number} totalSteps - Total steps for completion
   * @param {string} activityId - Activity identifier
   * @param {number} points - Points to award
   * @param {string} badge - Badge to award
   */
  drop(e, totalSteps = 4, activityId = 'dragDrop', points = 25, badge = '🎤') {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('drag-over');

    const targetStep = dropZone.dataset.target;
    const itemStep = this.draggedItem.dataset.step;

    if (targetStep === itemStep) {
      // Correct!
      dropZone.innerHTML = '';
      const clone = this.draggedItem.cloneNode(true);
      clone.classList.add('correct');
      clone.draggable = false;
      dropZone.appendChild(clone);
      dropZone.classList.add('filled');

      this.draggedItem.style.display = 'none';
      this.correctPlacements++;

      if (this.correctPlacements >= totalSteps) {
        const feedback = document.getElementById('strategyFeedback');
        if (feedback) feedback.classList.remove('hidden');

        if (!this.progress.isComplete(activityId)) {
          this.progress.completeActivity(activityId);
          this.progress.addPoints(points, 'Strategy mastered!');
          this.progress.awardBadge(badge);
        }
      }
    } else {
      // Incorrect - shake animation
      this.draggedItem.classList.add('incorrect');
      setTimeout(() => this.draggedItem.classList.remove('incorrect'), 300);
    }
  }

  // ========================================
  // SPEECH SYNTHESIS
  // ========================================

  /**
   * Initialize speech synthesis
   */
  initSpeechSynthesis() {
    // Pre-load voices
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }

  /**
   * Speak a word
   * @param {string} text - Text to speak
   */
  speakWord(text) {
    this.stopNarration();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;

    this.currentNarration = utterance;

    utterance.onend = () => {
      this.currentNarration = null;
      this.isPlaying = false;
    };

    utterance.onerror = () => {
      this.currentNarration = null;
      this.isPlaying = false;
    };

    const speakNow = () => {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === 'Google US English') ||
                    voices.find(v => v.lang === 'en-US') ||
                    voices[0];

      if (voice) {
        utterance.voice = voice;
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
   * Toggle section audio (sentence highlighting)
   * @param {HTMLElement} btn - Button element
   * @param {string} sectionId - Section ID
   */
  toggleSectionAudio(btn, sectionId) {
    const floatingBtn = document.getElementById('floatingStopBtn');

    if (btn.classList.contains('playing')) {
      // Stop playback
      speechSynthesis.cancel();
      btn.classList.remove('playing');
      btn.textContent = '🔊 Listen';
      this.removeAllHighlights();

      if (floatingBtn) floatingBtn.classList.remove('active');
    } else {
      // Stop any existing playback
      speechSynthesis.cancel();
      document.querySelectorAll('.playing').forEach(b => {
        b.classList.remove('playing');
        b.textContent = '🔊 Listen';
      });

      // Start playback
      btn.classList.add('playing');
      btn.textContent = '⏹️ Stop';

      if (floatingBtn) floatingBtn.classList.add('active');

      this.startSentencePlayback(sectionId, btn);
    }
  }

  /**
   * Start sentence-level playback
   * @param {string} sectionId - Section ID
   * @param {HTMLElement} btn - Button element
   */
  startSentencePlayback(sectionId, btn) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const storyText = section.querySelector('.story-text');
    if (!storyText) return;

    // Save original state
    if (!storyText.dataset.original) {
      storyText.dataset.original = storyText.innerHTML;
    }

    // Get paragraphs
    const paragraphs = storyText.querySelectorAll('p');
    let allSentences = [];
    paragraphs.forEach(p => {
      if (!p.parentElement.classList.contains('speech-bubble') ||
          (p.parentElement.classList.contains('speech-bubble') && !p.previousElementSibling)) {
        allSentences.push(p);
      }
    });

    // Create combined text
    let fullText = '';
    allSentences.forEach((p, i) => {
      p.dataset.sentenceIndex = i;
      fullText += p.textContent + ' ';
    });

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.85;

    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        let charCount = 0;
        let currentSentence = null;

        for (let i = 0; i < allSentences.length; i++) {
          const sentence = allSentences[i];
          const textLength = sentence.textContent.length;

          if (event.charIndex >= charCount && event.charIndex < charCount + textLength) {
            currentSentence = sentence;
            break;
          }
          charCount += textLength + 1;
        }

        if (currentSentence) {
          allSentences.forEach(s => {
            s.classList.remove('active-sentence');
            s.style.backgroundColor = '';
          });

          currentSentence.classList.add('active-sentence');
          currentSentence.style.backgroundColor = 'rgba(253, 230, 138, 0.5)';

          const rect = currentSentence.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            currentSentence.scrollIntoView({ behavior: 'auto', block: 'nearest' });
          }
        }
      }
    };

    utterance.onend = () => {
      btn.classList.remove('playing');
      btn.textContent = '🔊 Listen';
      this.removeAllHighlights();
      if (storyText.dataset.original) {
        storyText.innerHTML = storyText.dataset.original;
        delete storyText.dataset.original;
      }
    };

    utterance.onerror = () => {
      btn.classList.remove('playing');
      btn.textContent = '🔊 Listen';
      this.removeAllHighlights();
    };

    speechSynthesis.speak(utterance);
  }

  /**
   * Stop all narration
   */
  stopNarration() {
    speechSynthesis.cancel();
    this.currentNarration = null;
    this.isPlaying = false;

    document.querySelectorAll('.btn-playing').forEach(b => {
      b.classList.remove('btn-playing');
      b.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
    });

    document.querySelectorAll('.playing').forEach(b => {
      b.classList.remove('playing');
      b.textContent = '🔊 Listen';
    });

    this.removeAllHighlights();

    const floatingBtn = document.getElementById('floatingStopBtn');
    if (floatingBtn) floatingBtn.classList.remove('active');
  }

  /**
   * Remove all highlighting
   */
  removeAllHighlights() {
    document.querySelectorAll('.active-sentence, .active-word').forEach(el => {
      el.classList.remove('active-sentence', 'active-word');
      el.style.backgroundColor = '';
      el.style.padding = '';
      el.style.margin = '';
      el.style.borderRadius = '';
      el.style.borderLeft = '';
      el.style.borderRight = '';
    });
  }

  // ========================================
  // COMPREHENSION CHECKS
  // ========================================

  /**
   * Check answer for comprehension quiz
   * @param {HTMLElement} btn - Answer button
   * @param {boolean} correct - Whether answer is correct
   * @param {string} id - Question ID
   * @param {string} progressKey - Progress key
   * @param {number} points - Points to award
   */
  checkAnswer(btn, correct, id, progressKey = null, points = 0) {
    const container = btn.parentElement;
    container.querySelectorAll('.quiz-option').forEach(b => {
      b.classList.remove('selected', 'correct', 'incorrect');
    });

    if (correct) {
      btn.classList.add('correct');
      const feedback = document.getElementById(id + '-feedback');
      if (feedback) feedback.classList.remove('hidden');

      if (progressKey && !this.progress.isComplete(progressKey)) {
        this.progress.completeActivity(progressKey);
        if (points > 0) {
          this.progress.addPoints(points, 'Correct answer!');
        }
      }
    } else {
      btn.classList.add('incorrect');
    }
  }

  // ========================================
  // OPEN RESPONSE
  // ========================================

  /**
   * Save open response
   * @param {string} responseKey - Response key
   * @param {string} textareaId - Textarea element ID
   * @param {number} minLength - Minimum length required
   * @param {string} progressKey - Progress key
   * @param {number} points - Points to award
   * @param {string} badge - Badge to award
   */
  saveResponse(responseKey, textareaId, minLength = 50, progressKey = null, points = 30, badge = '✍️') {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    const response = textarea.value;
    if (response.trim().length < minLength) {
      alert(`Try writing a bit more! Aim for at least ${minLength} characters.`);
      return;
    }

    this.progress.saveResponse(responseKey, response);

    if (progressKey && !this.progress.isComplete(progressKey)) {
      this.progress.completeActivity(progressKey);
      this.progress.addPoints(points, 'Response written!');
      if (badge) this.progress.awardBadge(badge);
    }

    alert('💾 Your response has been saved!');
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ActivitiesManager };
}
