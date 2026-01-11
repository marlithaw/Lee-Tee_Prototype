# Episode 1 Dependency and Hook Map

## Deliverable A: Full Dependency Analysis for Engine Parity

This document provides a complete inventory of Episode 1's dependencies, DOM hooks, and initialization order. The engine's `episode.html?ep=1` must preserve ALL of these to achieve parity.

---

## 1. Script Load Order (Critical)

Episode 1 loads scripts in this EXACT order:

```
1. CDN:       https://cdn.tailwindcss.com
2. CSS:       shared/learning-dashboard.css
3. CSS:       shared/progressive-nav.css
4. JS:        shared-header.js          → Global state, header rendering
5. JS:        shared-skills.js          → Skills growth visualizer
6. JS:        shared/shared/learning-dashboard.js → Left rail dashboard
7. JS:        translations/translation-engine.js → translator object
8. JS:        shared/progressive-nav.js  → ProgressiveNav class
9. JS:        shared/adaptive-helpers.js → AdaptiveHelpers class
10. INLINE:   <script> block at end     → Episode-specific logic + init
```

### Script Dependencies Graph:
```
shared-header.js
  └─ depends on: translator (optional, graceful fallback)
  └─ provides: globalLearningState, loadGlobalState, saveGlobalState,
               addGlobalPoints, markSectionComplete, markEpisodeComplete,
               toggleLearningMode, toggleDyslexiaMode, toggleHighContrast,
               updateHeaderDisplay, showPointsModal, closePointsModal

shared-skills.js
  └─ depends on: globalLearningState (from shared-header.js)
  └─ provides: EPISODE_SKILLS, getSkillState, renderSkillsVisualizer,
               onVocabLearned, onQuizCorrect, onSectionComplete

learning-dashboard.js
  └─ depends on: globalLearningState (from shared-header.js)
  └─ provides: LearningShell.refresh

translation-engine.js
  └─ provides: translator (global instance of TranslationEngine)
  └─ methods: loadLanguage, applyLanguage, switchLanguage, translatePage,
              renderStoryLanguage, t(key, fallback), getAvailableLanguages

progressive-nav.js
  └─ depends on: translator (optional, graceful fallback)
  └─ provides: ProgressiveNav class
  └─ methods: init, loadState, saveState, registerSection, renderNavigation,
              showSection, completeSection, nextSection, previousSection

adaptive-helpers.js
  └─ provides: adaptiveHelpers (global instance of AdaptiveHelpers)
  └─ methods: init, setCharacterChoice, applyCharacterPreferences, showScaffolds
```

---

## 2. CSS Dependencies

### External CSS Files:
| File | Purpose |
|------|---------|
| `shared/learning-dashboard.css` | Left rail dashboard, progress shell |
| `shared/progressive-nav.css` | Section navigation bar, sticky UI |

### Inline CSS (in episode1.html `<style>` block):
- CSS Custom Properties (`:root` variables)
- Body modes: `.dyslexia-mode`, `.high-contrast`
- Word/sentence highlighting: `.word-highlight`, `.sentence-highlight`, `.active-word`, `.active-sentence`
- Progress tracking: `.progress-container`, `.progress-bar`
- Points display: `.points-display`, `.points-number`, `.badge-earned`
- Celebration overlay: `.celebration-overlay`, `.celebration-card`, `.confetti`
- Vocabulary: `.vocab-predict`, `.vocab-blank`, `.vocab-choices`, `.vocab-word`, `.vocab-modal`
- Story text: `.story-text`, `.speech-bubble`
- Helper modals: `.helper-modal`, `.helper-btn`
- Section navigation: `.section-nav`, `.section-nav__item`, `.section-content`
- Accessibility: `.a11y-menu`, `.siop-strategies`
- Drag & drop: `.rap-line`, `.drop-zone`

---

## 3. Required DOM Hooks (IDs)

### Navigation & Progress
| ID | Purpose | Used By |
|----|---------|---------|
| `sticky-ui` | Sticky container for progress + nav | progressive-nav.js |
| `section-progress-bar` | Progress bar container | ProgressiveNav |
| `progress-fill` | Progress bar fill element | ProgressiveNav |
| `section-nav` | Navigation tab container | ProgressiveNav |
| `section-display` | Container for section content | ProgressiveNav |
| `global-header` | Header mount point | shared-header.js |

### Points & Gamification
| ID | Purpose | Used By |
|----|---------|---------|
| `pointsDisplay` | Points counter | addPoints(), loadProgress() |
| `finalPoints` | Final score display | addPoints(), loadProgress() |
| `badgeContainer` | Badge display area | updateBadges() |
| `celebrationOverlay` | Celebration modal | celebrate() |
| `celebrationEmoji` | Celebration emoji | celebrate() |
| `celebrationTitle` | Celebration title | celebrate() |
| `celebrationMessage` | Celebration message | celebrate() |

### Left Rail Dashboard
| ID | Purpose | Used By |
|----|---------|---------|
| `left-rail` | Left sidebar container | CSS |
| `learningShell` | Dashboard shell | learning-dashboard.js |
| `learningShellToggle` | Mobile toggle button | learning-dashboard.js |
| `learningShellBookLabel` | Book progress label | learning-dashboard.js |
| `learningShellBookPercent` | Book progress percent | learning-dashboard.js |
| `learningShellBookFill` | Book progress bar fill | learning-dashboard.js |
| `learningShellEpisodeTitle` | Episode title | learning-dashboard.js |
| `learningShellEpisodeLabel` | Episode progress label | learning-dashboard.js |
| `learningShellEpisodeFill` | Episode progress bar fill | learning-dashboard.js |
| `learningShellBadges` | Badge row | learning-dashboard.js |
| `learningShellContinue` | Continue button | learning-dashboard.js |
| `progress-checklist` | Checklist container | updateProgressChecklist() |

### Progress Checkmarks
| ID | Purpose | Used By |
|----|---------|---------|
| `progress-sel` | SEL check-in checkmark | selectEmotion() |
| `progress-vocab` | Vocabulary checkmark | allVocabCorrect() |
| `progress-section1` | Section 1 checkmark | section completion |
| `progress-section2` | Section 2 checkmark | section completion |
| `progress-section3` | Section 3 checkmark | section completion |
| `progress-drag` | Drag activity checkmark | drag/drop complete |
| `progress-essay` | Essay checkmark | essay activity |
| `progress-reflect` | Reflection checkmark | reflection complete |
| `progress-percentage` | Overall percentage | updateProgressPercentage() |

### Vocabulary Modal
| ID | Purpose | Used By |
|----|---------|---------|
| `vocabModal` | Modal container | showVocab(), closeVocabModal() |
| `vocabWord` | Word display | showVocab() |
| `vocabDef` | Definition display | showVocab() |
| `vocabExample` | Example display | showVocab() |
| `vocabSpanish` | Spanish translation | showVocab() |
| `vocabImage` | Word emoji/image | showVocab() |

### Vocabulary Fill-in-the-Blank
| ID | Purpose | Used By |
|----|---------|---------|
| `blank1`, `blank2`, `blank3` | Blank slots | showVocabChoices() |
| `choices1`, `choices2`, `choices3` | Choice menus | showVocabChoices(), checkVocabChoice() |
| `feedback1`, `feedback2`, `feedback3` | Feedback areas | checkVocabChoice() |

### Helper Modals
| ID | Purpose | Used By |
|----|---------|---------|
| `lee-modal` | Lee helper modal | openHelper(), closeHelper() |
| `tee-modal` | Tee helper modal | openHelper(), closeHelper() |
| `helper-lee` | Lee helper button | onclick |
| `helper-tee` | Tee helper button | onclick |

### Context Helper (Adaptive)
| ID | Purpose | Used By |
|----|---------|---------|
| `contextHelper` | Context helper container | adaptive-helpers.js |
| `contextHelperAvatar` | Helper avatar image | adaptive-helpers.js |
| `contextHelperName` | Helper name | adaptive-helpers.js |
| `contextHelperMessage` | Helper message | adaptive-helpers.js |

### Accessibility
| ID | Purpose | Used By |
|----|---------|---------|
| `a11yMenu` | Accessibility menu | CSS toggle |
| `toggleAudio` | Audio toggle | toggleSetting('audio') |
| `toggleDyslexia` | Dyslexia toggle | toggleSetting('dyslexia') |
| `toggleContrast` | Contrast toggle | toggleSetting('contrast') |
| `toggleHints` | Hints toggle | toggleSetting('hints') |
| `toggleSiop` | SIOP toggle | toggleSiopStrategies() |
| `siopModal` | SIOP modal | closeSiopModal() |

### Audio/Narration
| ID | Purpose | Used By |
|----|---------|---------|
| `floatingStopBtn` | Stop narration button | stopAllNarration() |

### SEL & Character Choice
| ID | Purpose | Used By |
|----|---------|---------|
| `sel-checkin` | SEL section | section wrapper |
| `selFeedback` | SEL feedback area | selectEmotion() |
| `character-choice` | Character choice section | section wrapper |
| `chooseLee` | Lee choice card | chooseCharacter() |
| `chooseTee` | Tee choice card | chooseCharacter() |
| `characterFeedback` | Character feedback | chooseCharacter() |

### Story Sections
| ID | Purpose | Used By |
|----|---------|---------|
| `section-1`, `section-2`, `section-3`, `section-4` | Story sections | navigation |
| `section-vocab` | Vocabulary section | navigation |
| `section-aha` | Aha moment section | navigation |
| `section-essay` | Essay section | navigation |
| `section-reflect` | Reflection section | navigation |

### Comprehension & Quizzes
| ID | Purpose | Used By |
|----|---------|---------|
| `comp1-feedback`, `comp2-feedback` | Comprehension feedback | checkComprehension() |
| `problemFeedback` | Problem identification feedback | checkProblem() |
| `guided1-feedback`, `guided2-feedback`, `guided3-feedback` | Guided practice feedback | checkGuidedStep() |
| `guidedComplete` | Guided practice complete | checkGuidedStep() |

### Essay Hunt Activity
| ID | Purpose | Used By |
|----|---------|---------|
| `btn-claim`, `btn-evidence`, `btn-counterclaim`, `btn-conclusion` | Essay part buttons | highlightEssayPart() |
| `paragraph-intro`, `paragraph-body`, `paragraph-counterclaim`, `paragraph-conclusion` | Essay paragraphs | checkEssayPart() |
| `essay-instruction` | Essay hunt instruction | highlightEssayPart(), checkEssayPart() |
| `essayComplete` | Essay hunt complete | checkEssayPart() |

### Drag & Drop Activity
| ID | Purpose | Used By |
|----|---------|---------|
| `rapLines` | Draggable lines container | drag handlers |
| `strategyFeedback` | Strategy activity feedback | drag complete |

### Writing Section
| ID | Purpose | Used By |
|----|---------|---------|
| `studentResponse` | Writing textarea | writing activity |
| `rubric1`, `rubric2`, `rubric3`, `rubric4` | Rubric checkboxes | auto-rubric |

### Skills Visualizer
| ID | Purpose | Used By |
|----|---------|---------|
| `skills-visualizer` | Skills display container | renderSkillsVisualizer() |

### Translation
| ID | Purpose | Used By |
|----|---------|---------|
| `lang-select` | Language dropdown | translation UI |

---

## 4. Required Data Attributes

### Section Navigation
| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-section="1"` through `data-section="7"` | Section wrappers | ProgressiveNav.showSection() |
| `data-episode="1"` | On `<body>` | getCurrentEpisodeNumber() |

### Translation
| Attribute | Example | Purpose |
|-----------|---------|---------|
| `data-translate="key"` | `data-translate="sel.question"` | TranslationEngine.translatePage() |
| `data-i18n="key"` | `data-i18n="feedback.comp1"` | TranslationEngine.translatePage() |
| `data-original="text"` | Stores original text | Language revert |

### Story Sections
| Attribute | Example | Purpose |
|-----------|---------|---------|
| `data-story-section="section-1"` | Story text containers | renderStoryLanguage() |

### Drag & Drop
| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-step="1"` through `data-step="4"` | Rap lines | Drag ordering |
| `data-target="1"` through `data-target="4"` | Drop zones | Drop validation |

### Checkboxes
| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-correct="true/false"` | Problem checkboxes | Answer validation |

### Essay Hunt
| Attribute | Example | Purpose |
|-----------|---------|---------|
| `data-part-name="Claim"` | Essay buttons | Button labeling |

---

## 5. Global Objects & Functions

### Required Globals (window.*)
```javascript
// From inline script
learningState           // Episode progress state
currentNarration        // Current speech utterance
isPlaying               // Audio playing flag
vocabData               // Vocabulary definitions

// Functions
loadProgress()
saveProgress()
resetProgress()
updateProgressPercentage()
addPoints(amount, reason)
awardBadge(badge)
updateBadges()
selectEmotion(element, emotion)
chooseCharacter(character)
showVocab(word)
closeVocabModal(event)
speakWord()
showVocabChoices(blankId, correctWord)
checkVocabChoice(blankId, choicesId, selectedWord, isCorrect)
checkComprehension(button, isCorrect, feedbackId)
checkGuidedStep(button, isCorrect, feedbackId)
highlightEssayPart(part)
checkEssayPart(paragraphId, correctPart)
celebrate(points, reason)
closeCelebration()
createConfetti()
openHelper(character)
closeHelper(event, character)
toggleSetting(setting)
toggleSiopStrategies()
closeSiopModal(event)
toggleSectionAudio(button, sectionId)
stopAllNarration()
updateProgressChecklist()

// From external scripts
translator              // TranslationEngine instance
progressiveNav          // ProgressiveNav instance
adaptiveHelpers         // AdaptiveHelpers instance
globalLearningState     // Global book state
addGlobalPoints()
markSectionComplete()
markEpisodeComplete()
```

---

## 6. Initialization Sequence

The inline `<script>` in episode1.html performs this initialization:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load progress from localStorage
  loadProgress();

  // 2. Wrap existing sections into data-section containers
  wrapExistingSections();  // Moves DOM elements into section containers

  // 3. Initialize Progressive Navigation
  progressiveNav = new ProgressiveNav(1, 7);
  progressiveNav.registerSection(1, 'Start', '🏁');
  progressiveNav.registerSection(2, 'Vocabulary', '📚');
  progressiveNav.registerSection(3, 'Story', '📖');
  progressiveNav.registerSection(4, 'Strategy', '🧠');
  progressiveNav.registerSection(5, 'Model', '📝');
  progressiveNav.registerSection(6, 'Write', '✍️');
  progressiveNav.registerSection(7, 'Reflect', '🎉');
  progressiveNav.init();

  // 4. Add translation UI (language dropdown)
  addTranslationUI();

  // 5. Connect character choice to adaptive helpers
  connectCharacterChoice();

  // 6. Update progress checklist
  updateProgressChecklist();

  // 7. Initialize skill visualizer
  renderSkillsVisualizer(1);
});
```

### Critical: wrapExistingSections()

This function moves existing HTML sections into `data-section` wrappers:
- Creates 7 `<div class="section-content" data-section="N">` containers
- Moves existing `<section>` elements into these containers
- Required because ProgressiveNav.showSection() looks for `[data-section="N"]`

---

## 7. Event Handlers (onclick, ondragover, etc.)

### Section Navigation
- Progressive navigation buttons trigger `progressiveNav.showSection(N)`

### SEL Check-in
- `.emotion-option` buttons: `onclick="selectEmotion(this, 'emotion')"`

### Character Choice
- `#chooseLee`: `onclick="chooseCharacter('lee')"`
- `#chooseTee`: `onclick="chooseCharacter('tee')"`

### Vocabulary
- Word bank buttons: `onclick="showVocab('word')"`
- Modal: `onclick="closeVocabModal(event)"`
- Speak button: `onclick="speakWord()"`
- Blank slots: `onclick="showVocabChoices('blankId', 'correctWord')"`
- Choice buttons: `onclick="checkVocabChoice(...)"`

### Drag & Drop
- `.rap-line`: `draggable="true"`, JS handlers for drag events
- `.drop-zone`: `ondragover="dragOver(event)"`, `ondragleave="dragLeave(event)"`, `ondrop="drop(event)"`

### Essay Hunt
- Essay buttons: `onclick="highlightEssayPart('part')"`
- Essay paragraphs: `onclick="checkEssayPart('paragraphId', 'correctPart')"`

### Helpers
- `#helper-lee`: `onclick="openHelper('lee')"`
- `#helper-tee`: `onclick="openHelper('tee')"`
- Helper modals: `onclick="closeHelper(event, 'character')"`

### Accessibility
- Toggle buttons: `onclick="toggleSetting('setting')"`
- SIOP toggle: `onclick="toggleSiopStrategies()"`

### Audio
- Section audio: `onclick="toggleSectionAudio(this, 'sectionId')"`
- Stop button: `onclick="stopAllNarration()"`

### Celebration
- Continue button: `onclick="closeCelebration()"`

---

## 8. LocalStorage Keys

| Key | Purpose | Used By |
|-----|---------|---------|
| `leeTeeLessonProgress` | Episode 1 progress | loadProgress(), saveProgress() |
| `leeTeeBook1GlobalState` | Book-wide state | shared-header.js |
| `leeTee_ep1_progressive_state` | Navigation state | progressive-nav.js |
| `leeTee_adaptive_helper_state` | Helper state | adaptive-helpers.js |
| `episode1SkillState` | Skills tracking | shared-skills.js |
| `preferred-language` | Language preference | translation-engine.js |

---

## 9. Parity Requirements Summary

For `episode.html?ep=1` to have FULL parity with `episode1.html`:

1. **Load same scripts in same order** (lines 7-1410 of episode1.html)
2. **Include all inline CSS** (lines 10-1400 of episode1.html)
3. **Render identical HTML structure** with all DOM IDs listed above
4. **Preserve all data-* attributes** exactly
5. **Initialize in same sequence** (DOMContentLoaded handler)
6. **wrapExistingSections() or equivalent** to create section containers
7. **All onclick handlers** must work identically
8. **Translation system** must find all `data-translate` elements
9. **Story sections** must have `data-story-section` attributes

---

## 10. Quick Reference: Files to Include

```html
<!-- Head -->
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="shared/learning-dashboard.css">
<link rel="stylesheet" href="shared/progressive-nav.css">

<!-- Before closing body -->
<script src="shared-header.js"></script>
<script src="shared-skills.js"></script>
<script src="shared/shared/learning-dashboard.js"></script>
<script src="translations/translation-engine.js"></script>
<script src="shared/progressive-nav.js"></script>
<script src="shared/adaptive-helpers.js"></script>
```

Plus ALL inline CSS and JavaScript from episode1.html.

---

*Document Version: 1.0*
*Created for Parity Restore Sprint*
