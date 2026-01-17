# Lee-Tee_Book1_Episode1
interactive reading 

## Translation system

Episode 1 now supports English (`en`), Spanish (`es`), French (`fr`), and Haitian Creole (`ht`) using JSON dictionaries in `locales/` plus story sentence data in `locales/story.<lang>.json`.

- Add UI strings by creating a key in `locales/en.json` (and other language files) and applying it via `data-i18n="key.path"` in the HTML or `translator.t('key.path')` in JS.
- For runtime or modal text, prefer grouping related strings (for example, `messages.*`, `header.*`, `global_badges.*`) so the `translator.t` calls in JS can fall back to English if a key is missing.
- Story text renders from sentence data on elements with `data-story-section="<id>"`. Each section uses an array of `{ id, text }` sentences. For bilingual rendering, roughly every other sentence is replaced with the target language while the rest stay in English. Adjust the mix rule in `translations/translation-engine.js` (`mixConfig`) if you need a different ratio or strategy.
- Language choice persists in `localStorage` (`preferred-language`) and is applied on load. Missing translations fall back to English safely.

---

## How to Add Episode 2 and Episode 3

The engine is now config-driven. To add new episodes:

### Step 1: Create the Config File

Create `episodes/episode<N>.config.js` following the schema in `engine/schema.js`:

```javascript
const episode<N>Config = {
  id: <N>,
  title: 'Lee & Tee Episode <N>: <Title>',
  subtitle: '<Subtitle>',
  subject: '<Subject>', // ELA, Math, Science, Social Studies
  color: '#<HexColor>',

  standard: {
    code: '<StandardCode>',
    label: '<StandardLabel>'
  },

  objectives: {
    language: '<LanguageObjective>',
    content: '<ContentObjective>'
  },

  progressItems: [
    { id: 'sel', label: 'Check-In' },
    { id: 'vocab', label: 'Vocabulary' },
    // ... add your progress tracking items
  ],

  vocabulary: {
    word1: { word: 'Word', def: '...', example: '...', spanish: '...', image: '📚' },
    // ... add vocabulary
  },

  media: {
    // Asset paths relative to root
  },

  sections: [
    // See Section Schema below
  ]
};
```

### Step 2: Define Sections with Layers

Each section has 5 possible layers:

| Layer | Required | Purpose |
|-------|----------|---------|
| `core` | ✓ | Essential content and activities |
| `expanded` | | Additional depth, extensions |
| `supports` | | Scaffolding, helpers, hints |
| `checks` | | Comprehension quizzes |
| `media` | | Images, videos, audio |

Example section:

```javascript
{
  id: 'section-vocab',
  type: 'vocabulary', // sel-checkin, vocabulary, story, strategy, writing, reflection
  title: 'Vocabulary',
  icon: '📚',
  navIndex: 2,
  layers: {
    core: {
      content: `<section class="...">...</section>`
    },
    supports: {
      content: `<div class="word-bank">...</div>`
    }
  },
  activities: [
    { id: 'vocab-blanks', type: 'vocab-fill-blank', progressKey: 'vocab', points: 10, badge: '🎯' }
  ]
}
```

### Step 3: Test with the Shell Page

Access your episode via:
```
episode.html?ep=<N>
```

### Step 4: Verify Parity

Use the parity checklist below to confirm full functionality.

---

## Engine-Driven Episode Parity Checklist

When testing `episode.html?ep=1` against the original `episode1.html`:

### Core Functionality
- [ ] Page loads without console errors
- [ ] No 404s for required assets (images, videos, CSS, JS)
- [ ] Progress bar tracks scroll position
- [ ] Points display shows and updates
- [ ] Badges appear when earned

### Navigation
- [ ] Section nav bar renders correctly
- [ ] Clicking nav buttons switches sections
- [ ] Active section is highlighted
- [ ] Sections show/hide correctly

### SEL Check-In
- [ ] Emotion buttons work
- [ ] Feedback message appears
- [ ] Progress item updates

### Character Choice
- [ ] Lee/Tee selection works
- [ ] Feedback appears
- [ ] Points awarded

### Vocabulary
- [ ] Word bank buttons open modal
- [ ] Modal shows definition, example, Spanish
- [ ] "Hear it" button speaks word
- [ ] Fill-in-blank dropdowns work
- [ ] Correct/incorrect feedback shows
- [ ] Badge awarded when all complete

### Story Sections
- [ ] Listen button plays audio with sentence highlighting
- [ ] Read Aloud button plays with word highlighting
- [ ] Stop button works
- [ ] Images display correctly
- [ ] Videos play correctly
- [ ] Comprehension quizzes work

### Strategy (Drag & Drop)
- [ ] Drag items are draggable
- [ ] Drop zones accept correct items
- [ ] Incorrect drops show shake animation
- [ ] Completion feedback shows
- [ ] Badge and points awarded

### Writing Section
- [ ] Textarea accepts input
- [ ] Voice dictation works (Chrome)
- [ ] Save button works
- [ ] Rubric auto-checks
- [ ] Helper modals open

### Reflection
- [ ] Text inputs work
- [ ] Voice dictation works
- [ ] Final celebration shows
- [ ] Points and badges display

### Accessibility
- [ ] Dyslexia mode toggles
- [ ] High contrast mode toggles
- [ ] Keyboard navigation works

---

## File Structure

```
├── engine/
│   ├── schema.js           # Episode config schema
│   ├── renderer.js         # renderEpisode(config) entry point
│   └── modules/
│       ├── settings.js     # Settings persistence
│       ├── progress.js     # Progress tracking
│       ├── navigation.js   # Section navigation
│       └── activities.js   # Activity handlers
├── episodes/
│   ├── episode1.config.js  # Episode 1 configuration
│   └── episode2.config.js  # Episode 2 stub
├── episode.html            # Shell page (?ep=1, ?ep=2, etc.)
├── episode1.html           # Original Episode 1 (reference)
└── archive/                # Quarantined unused files
```
