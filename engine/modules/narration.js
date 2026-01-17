/**
 * Narration Module
 * Handles text-to-speech with word and sentence highlighting
 */

let currentPlayback = null;

/**
 * Toggle section audio (sentence highlighting mode)
 */
function toggleSectionAudio(btn, sectionId) {
  const floatingBtn = document.getElementById('floatingStopBtn');

  if (btn.classList.contains('playing')) {
    // Stop playback
    speechSynthesis.cancel();
    btn.classList.remove('playing');
    btn.textContent = '🔊 Listen';
    removeAllHighlights();

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

    startSentencePlayback(sectionId, btn);
  }
}

/**
 * Read aloud with word highlighting
 */
function readAloudWithWordHighlight(btn, sectionId) {
  const floatingBtn = document.getElementById('floatingStopBtn');

  if (btn.classList.contains('btn-playing')) {
    // Stop playback
    speechSynthesis.cancel();
    btn.classList.remove('btn-playing');
    btn.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
    removeAllHighlights();

    if (floatingBtn) floatingBtn.classList.remove('active');
  } else {
    // Stop any existing playback
    speechSynthesis.cancel();
    document.querySelectorAll('.btn-playing').forEach(b => {
      b.classList.remove('btn-playing');
      b.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
    });

    // Start playback
    btn.classList.add('btn-playing');
    btn.innerHTML = '<span>⏹️</span><span>Stop</span>';

    if (floatingBtn) floatingBtn.classList.add('active');

    startWordPlayback(sectionId, btn);
  }
}

/**
 * Stop all narration
 */
function stopAllNarration() {
  speechSynthesis.cancel();

  document.querySelectorAll('.btn-playing').forEach(b => {
    b.classList.remove('btn-playing');
    b.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
  });

  document.querySelectorAll('.playing').forEach(b => {
    b.classList.remove('playing');
    b.textContent = '🔊 Listen';
  });

  removeAllHighlights();

  const floatingBtn = document.getElementById('floatingStopBtn');
  if (floatingBtn) floatingBtn.classList.remove('active');
}

/**
 * Start sentence-by-sentence playback
 */
function startSentencePlayback(sectionId, btn) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const storyText = section.querySelector('.story-text');
  if (!storyText) return;

  // Save original state
  if (!storyText.dataset.original) {
    storyText.dataset.original = storyText.innerHTML;
  }

  // Get paragraphs and speech bubbles
  const paragraphs = storyText.querySelectorAll('p');
  const speechBubbles = storyText.querySelectorAll('.speech-bubble p:not(:first-child)');

  let allSentences = [];
  paragraphs.forEach(p => {
    if (!p.parentElement.classList.contains('speech-bubble') ||
        (p.parentElement.classList.contains('speech-bubble') && !p.previousElementSibling)) {
      allSentences.push(p);
    }
  });
  speechBubbles.forEach(p => allSentences.push(p));

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
        currentSentence.style.padding = '8px 12px';
        currentSentence.style.margin = '8px 0';
        currentSentence.style.borderRadius = '4px';
        currentSentence.style.borderLeft = '3px solid #7C3AED';
        currentSentence.style.borderRight = '3px solid #7C3AED';

        const rect = currentSentence.getBoundingClientRect();
        const isOffScreen = (rect.bottom < 0 || rect.top > window.innerHeight);

        if (isOffScreen) {
          currentSentence.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
      }
    }
  };

  utterance.onend = () => {
    btn.classList.remove('playing');
    btn.textContent = '🔊 Listen';
    removeAllHighlights();
    if (storyText.dataset.original) {
      storyText.innerHTML = storyText.dataset.original;
      delete storyText.dataset.original;
    }
  };

  utterance.onerror = () => {
    btn.classList.remove('playing');
    btn.textContent = '🔊 Listen';
    removeAllHighlights();
    if (storyText.dataset.original) {
      storyText.innerHTML = storyText.dataset.original;
      delete storyText.dataset.original;
    }
  };

  speechSynthesis.speak(utterance);
}

/**
 * Start word-by-word playback
 */
function startWordPlayback(sectionId, btn) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const storyText = section.querySelector('.story-text');
  if (!storyText) return;

  // Save original state
  if (!storyText.dataset.original) {
    storyText.dataset.original = storyText.innerHTML;
  }

  // Get all paragraphs to wrap
  const paragraphs = storyText.querySelectorAll('p');
  const allWordSpans = [];

  paragraphs.forEach(p => {
    if (p.classList.contains('font-bold') && p.parentElement.classList.contains('speech-bubble')) {
      return;
    }

    function wrapTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text.trim().length === 0) return;

        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
          if (word.trim().length > 0) {
            const span = document.createElement('span');
            span.className = 'word-highlight';
            span.textContent = word;
            allWordSpans.push(span);
            fragment.appendChild(span);
          } else if (word.length > 0) {
            fragment.appendChild(document.createTextNode(word));
          }
        });

        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList && (node.classList.contains('vocab-word') || node.tagName === 'BUTTON')) {
          return;
        }
        Array.from(node.childNodes).forEach(child => wrapTextNodes(child));
      }
    }

    const clone = p.cloneNode(true);
    wrapTextNodes(clone);
    p.innerHTML = clone.innerHTML;
  });

  const wordSpans = storyText.querySelectorAll('.word-highlight');
  const cleanText = Array.from(wordSpans).map(span => span.textContent).join(' ');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.85;
  utterance.pitch = 0.9;

  let currentWordIdx = 0;
  let boundaryFired = false;
  let fallbackTimer = null;

  function highlightWord(index) {
    wordSpans.forEach(span => span.classList.remove('active-word'));

    if (index < wordSpans.length) {
      const currentWord = wordSpans[index];
      currentWord.classList.add('active-word');

      const rect = currentWord.getBoundingClientRect();
      const isVisible = (rect.top >= 150 && rect.bottom <= (window.innerHeight - 200));

      if (!isVisible && (rect.bottom < 0 || rect.top > window.innerHeight)) {
        currentWord.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
      }
    }
  }

  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      boundaryFired = true;
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      highlightWord(currentWordIdx);
      currentWordIdx++;
    }
  };

  utterance.onstart = () => {
    setTimeout(() => {
      if (!boundaryFired && speechSynthesis.speaking) {
        currentWordIdx = 0;
        highlightNextWord();
      }
    }, 100);
  };

  function highlightNextWord() {
    if (currentWordIdx >= wordSpans.length || !speechSynthesis.speaking) return;

    highlightWord(currentWordIdx);

    const word = wordSpans[currentWordIdx].textContent;
    const wordLength = word.length;
    const baseWordDuration = 60000 / (utterance.rate * 165);
    const lengthFactor = wordLength / 5;
    const adjustedDuration = baseWordDuration * (0.6 + (lengthFactor * 0.4));
    const hasPunctuation = /[.,!?;:]/.test(word);
    const punctuationPause = hasPunctuation ? 100 : 0;
    const totalDuration = adjustedDuration + punctuationPause;

    currentWordIdx++;
    fallbackTimer = setTimeout(highlightNextWord, totalDuration);
  }

  utterance.onend = () => {
    clearTimeout(fallbackTimer);
    btn.classList.remove('btn-playing');
    btn.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
    removeAllHighlights();
    if (storyText.dataset.original) {
      storyText.innerHTML = storyText.dataset.original;
      delete storyText.dataset.original;
    }
  };

  utterance.onerror = () => {
    clearTimeout(fallbackTimer);
    btn.classList.remove('btn-playing');
    btn.innerHTML = '<span>🎙️</span><span>Read Aloud</span>';
    removeAllHighlights();
    if (storyText.dataset.original) {
      storyText.innerHTML = storyText.dataset.original;
      delete storyText.dataset.original;
    }
  };

  speechSynthesis.speak(utterance);
}

/**
 * Remove all highlights
 */
function removeAllHighlights() {
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

// Export functions
window.toggleSectionAudio = toggleSectionAudio;
window.readAloudWithWordHighlight = readAloudWithWordHighlight;
window.stopAllNarration = stopAllNarration;
window.removeAllHighlights = removeAllHighlights;
