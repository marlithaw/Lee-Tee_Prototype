# Engine Integration Plan: Lift-and-Shift Approach

## Deliverable B: Strategy for Full Episode 1 Parity

This document outlines the lift-and-shift approach to make `episode.html?ep=1` functionally identical to `episode1.html`.

---

## Core Principle

**DO NOT rebuild Episode 1 features.** Instead:
1. Load the SAME scripts Episode 1 uses
2. Inject the SAME HTML content Episode 1 has
3. Apply the SAME CSS Episode 1 uses
4. Initialize the SAME way Episode 1 does

---

## Architecture Decision: Template Injection

### Option Selected: Include Original Content

Rather than recreating Episode 1's complex HTML in a config object, we:

1. **Extract** Episode 1's `<body>` content into a template file
2. **Load** that template via fetch in `episode.html`
3. **Inject** the content into the page
4. **Execute** the same initialization sequence

This preserves every DOM hook, class, attribute, and structure.

---

## Implementation Steps

### Step 1: Create Episode Content Templates

Extract the `<body>` content from `episode1.html` (lines ~1421-4965) into:
```
episodes/episode1.content.html
```

This file contains:
- All sections (SEL, character choice, vocabulary, story, etc.)
- All modals (vocabulary, helper, celebration)
- All interactive elements
- The inline `<script>` initialization code

### Step 2: Update episode.html Shell

The shell page structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="page-title">Lee & Tee</title>

  <!-- CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Episode-specific CSS (injected dynamically) -->
  <link rel="stylesheet" href="shared/learning-dashboard.css">
  <link rel="stylesheet" href="shared/progressive-nav.css">

  <!-- Episode inline styles (injected) -->
  <style id="episode-styles"></style>
</head>
<body data-episode="">
  <!-- Content injected here -->
  <div id="episode-content"></div>

  <!-- Scripts loaded after content injection -->
  <script src="shared-header.js"></script>
  <script src="shared-skills.js"></script>
  <script src="shared/shared/learning-dashboard.js"></script>
  <script src="translations/translation-engine.js"></script>
  <script src="shared/progressive-nav.js"></script>
  <script src="shared/adaptive-helpers.js"></script>

  <!-- Episode initialization -->
  <script>
    (async function() {
      // 1. Get episode number from URL
      const params = new URLSearchParams(window.location.search);
      const episodeNum = parseInt(params.get('ep')) || 1;

      // 2. Load episode content
      const response = await fetch(`episodes/episode${episodeNum}.content.html`);
      if (!response.ok) {
        throw new Error(`Failed to load episode ${episodeNum}`);
      }

      const content = await response.text();

      // 3. Parse and inject
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // 4. Inject styles
      const styles = doc.querySelector('#episode-inline-styles');
      if (styles) {
        document.getElementById('episode-styles').textContent = styles.textContent;
      }

      // 5. Inject body content
      const bodyContent = doc.querySelector('#episode-body-content');
      if (bodyContent) {
        document.getElementById('episode-content').innerHTML = bodyContent.innerHTML;
      }

      // 6. Set body data attribute
      document.body.setAttribute('data-episode', episodeNum);

      // 7. Update title
      const config = window[`episode${episodeNum}Config`];
      if (config) {
        document.getElementById('page-title').textContent = config.title;
      }

      // 8. Execute episode init script
      const initScript = doc.querySelector('#episode-init-script');
      if (initScript) {
        const script = document.createElement('script');
        script.textContent = initScript.textContent;
        document.body.appendChild(script);
      }

      console.log(`✅ Episode ${episodeNum} loaded successfully`);
    })().catch(error => {
      console.error('Failed to load episode:', error);
      document.getElementById('episode-content').innerHTML = `
        <div class="p-8 text-center">
          <h2 class="text-2xl font-bold text-red-600 mb-4">Failed to Load Episode</h2>
          <p class="text-gray-600">${error.message}</p>
          <a href="episode1.html" class="mt-4 inline-block px-6 py-3 bg-purple-600 text-white rounded-full">
            Go to Episode 1
          </a>
        </div>
      `;
    });
  </script>
</body>
</html>
```

### Step 3: Create Episode Content File

Extract from `episode1.html`:

```html
<!-- episodes/episode1.content.html -->

<!-- Inline styles from episode1.html -->
<template id="episode-inline-styles">
  :root {
    --bg-primary: #FFF8F0;
    /* ... all CSS from episode1.html <style> block ... */
  }
  /* ... rest of inline CSS ... */
</template>

<!-- Body content from episode1.html -->
<template id="episode-body-content">
  <div id="sticky-ui">
    <!-- ... exact content from episode1.html body ... -->
  </div>

  <!-- All sections, modals, helpers, etc. -->
  <!-- EXACT HTML from episode1.html lines 1422-2960 -->
</template>

<!-- Initialization script from episode1.html -->
<template id="episode-init-script">
  // ===== FIXED: LEARNING PROGRESS TRACKING =====
  let learningState = { ... };

  /* ... all inline JavaScript from episode1.html ... */

  document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    wrapExistingSections();
    // ... rest of init ...
  });
</template>
```

---

## Why This Approach Works

### 1. Preserves All DOM Hooks
- Every `id="..."` attribute stays intact
- Every `data-*` attribute stays intact
- Every `class="..."` stays intact
- Every `onclick="..."` stays intact

### 2. Preserves Script Dependencies
- Same scripts loaded in same order
- Same global objects created
- Same initialization sequence

### 3. Preserves Translation System
- All `data-translate` attributes present
- All `data-story-section` attributes present
- `translator.translatePage()` finds all elements

### 4. Preserves Navigation
- `wrapExistingSections()` creates section containers
- `ProgressiveNav` finds all sections
- Navigation works identically

### 5. Zero Rebuilding
- No attempt to recreate complex HTML in JavaScript
- No config-driven rendering of HTML
- Original HTML preserved exactly

---

## File Structure After Implementation

```
Lee-Tee_Prototype/
├── episode.html                    # Shell page (loads any episode)
├── episode1.html                   # Original (kept for reference/fallback)
├── episodes/
│   ├── episode1.content.html       # Episode 1 body content
│   ├── episode1.config.js          # Episode 1 metadata (optional)
│   ├── episode2.config.js          # Episode 2 stub
│   └── episode2.content.html       # Episode 2 (when ready)
├── shared/
│   ├── learning-dashboard.css
│   ├── progressive-nav.css
│   ├── progressive-nav.js
│   ├── adaptive-helpers.js
│   └── shared/
│       └── learning-dashboard.js
├── translations/
│   └── translation-engine.js
├── shared-header.js
├── shared-skills.js
└── locales/
    ├── en.json
    ├── es.json
    ├── fr.json
    ├── ht.json
    └── story.en.json (etc.)
```

---

## Testing Checklist

After implementation, verify:

### Script Loading
- [ ] Tailwind CSS loads (no styling breaks)
- [ ] shared-header.js loads (global header renders)
- [ ] shared-skills.js loads (skills visualizer works)
- [ ] learning-dashboard.js loads (left rail works)
- [ ] translation-engine.js loads (translator ready)
- [ ] progressive-nav.js loads (navigation works)
- [ ] adaptive-helpers.js loads (helpers work)

### DOM Verification
- [ ] All IDs from dependency map exist
- [ ] All data-section wrappers created
- [ ] All data-translate elements present
- [ ] All onclick handlers work

### Feature Verification
- [ ] SEL check-in works
- [ ] Character choice works
- [ ] Vocabulary modal works
- [ ] Fill-in-blank works
- [ ] Story narration works
- [ ] Drag & drop works
- [ ] Essay hunt works
- [ ] Writing section works
- [ ] Reflection works
- [ ] Points/badges work
- [ ] Translation switching works

---

## Fallback Strategy

If `episode.html?ep=1` fails:
1. Show error with link to `episode1.html`
2. Original `episode1.html` remains functional
3. Users can always access content

---

## Future Episodes

For Episode 2 (when ready):
1. Create `episodes/episode2.content.html`
2. `episode.html?ep=2` loads it automatically
3. Same structure, different content
4. Config file provides metadata for thumbnails/menus

---

*Document Version: 1.0*
*Created for Parity Restore Sprint*
