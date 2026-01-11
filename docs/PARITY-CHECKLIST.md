# Episode 1 Parity Checklist

## Deliverable D: Verification Checklist for episode.html?ep=1 vs episode1.html

This checklist verifies that `episode.html?ep=1` provides full parity with `episode1.html`.

---

## Script Load Order Proof

### episode1.html Script Load Order:
```
1. https://cdn.tailwindcss.com                    (line 7)
2. shared/learning-dashboard.css                  (line 9)
3. shared-header.js                               (line 1402)
4. shared-skills.js                               (line 1403)
5. shared/shared/learning-dashboard.js            (line 1404)
6. shared/progressive-nav.css                     (line 1407)
7. translations/translation-engine.js             (line 1408)
8. shared/progressive-nav.js                      (line 1409)
9. shared/adaptive-helpers.js                     (line 1410)
10. Inline <script> block                         (lines 2965-4964)
```

### episode.html?ep=1 Approach:
The lift-and-shift loader:
1. Fetches `episode1.html` via `fetch()`
2. Parses HTML with `DOMParser`
3. Injects all `<link rel="stylesheet">` elements from head
4. Injects all `<style>` elements from head
5. Replaces body with episode1.html's body content
6. Loads all `<script src="...">` elements in order (await each)
7. Executes inline `<script>` blocks by recreating them
8. Dispatches `DOMContentLoaded` event for initialization

**Result:** Same scripts load in same order with same content.

---

## Parity Verification Checklist

### Page Load
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Page loads without console errors | ✓ | Verify | [ ] |
| No 404s for assets | ✓ | Verify | [ ] |
| Title shows correctly | ✓ | Verify | [ ] |
| Body has data-episode="1" | ✓ | Verify | [ ] |

### Sticky UI (Top Navigation)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| #sticky-ui renders | ✓ | Verify | [ ] |
| Progress bar visible | ✓ | Verify | [ ] |
| Section nav tabs render | ✓ | Verify | [ ] |
| Language dropdown appears | ✓ | Verify | [ ] |
| Global header renders | ✓ | Verify | [ ] |

### Section Navigation
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| 7 section tabs display | ✓ | Verify | [ ] |
| Clicking tab switches section | ✓ | Verify | [ ] |
| Active tab highlighted | ✓ | Verify | [ ] |
| Sections show/hide correctly | ✓ | Verify | [ ] |

### SEL Check-In (Section 1)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| 4 emotion buttons display | ✓ | Verify | [ ] |
| Clicking emotion selects it | ✓ | Verify | [ ] |
| Feedback message appears | ✓ | Verify | [ ] |
| Progress checkmark updates | ✓ | Verify | [ ] |

### Character Choice (Section 1)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Lee card displays with image | ✓ | Verify | [ ] |
| Tee card displays with image | ✓ | Verify | [ ] |
| Clicking card selects it | ✓ | Verify | [ ] |
| Points awarded (+5) | ✓ | Verify | [ ] |
| Feedback message appears | ✓ | Verify | [ ] |

### Vocabulary Section (Section 2)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Word bank buttons render | ✓ | Verify | [ ] |
| Clicking word opens modal | ✓ | Verify | [ ] |
| Modal shows word, def, example | ✓ | Verify | [ ] |
| "Hear it" button speaks word | ✓ | Verify | [ ] |
| Fill-in-blank dropdowns work | ✓ | Verify | [ ] |
| Correct/incorrect feedback | ✓ | Verify | [ ] |
| Badge awarded when complete | ✓ | Verify | [ ] |

### Story Sections (Sections 3-4)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Story text renders | ✓ | Verify | [ ] |
| Speech bubbles display | ✓ | Verify | [ ] |
| Images load | ✓ | Verify | [ ] |
| Video plays (hip_hop_hook.mp4) | ✓ | Verify | [ ] |
| Listen button works | ✓ | Verify | [ ] |
| Read Aloud works with highlighting | ✓ | Verify | [ ] |
| Stop button stops narration | ✓ | Verify | [ ] |
| Comprehension quizzes work | ✓ | Verify | [ ] |

### Strategy Activity (Section 4)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Guided practice buttons work | ✓ | Verify | [ ] |
| Drag items are draggable | ✓ | Verify | [ ] |
| Drop zones accept items | ✓ | Verify | [ ] |
| Incorrect drops shake | ✓ | Verify | [ ] |
| Correct placements lock | ✓ | Verify | [ ] |
| Completion feedback shows | ✓ | Verify | [ ] |
| Badge and points awarded | ✓ | Verify | [ ] |

### Essay Model (Section 5)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Essay hunt buttons work | ✓ | Verify | [ ] |
| Clicking paragraphs responds | ✓ | Verify | [ ] |
| Correct matches highlight | ✓ | Verify | [ ] |
| Wrong matches shake | ✓ | Verify | [ ] |
| Completion feedback shows | ✓ | Verify | [ ] |

### Writing Section (Section 6)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Textarea accepts input | ✓ | Verify | [ ] |
| Voice dictation works (Chrome) | ✓ | Verify | [ ] |
| Save button works | ✓ | Verify | [ ] |
| Rubric auto-checks | ✓ | Verify | [ ] |
| Helper buttons open modals | ✓ | Verify | [ ] |

### Reflection (Section 7)
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Text inputs work | ✓ | Verify | [ ] |
| Voice dictation works | ✓ | Verify | [ ] |
| Final emotion selection works | ✓ | Verify | [ ] |
| Celebration section displays | ✓ | Verify | [ ] |
| Final points display | ✓ | Verify | [ ] |
| Skills visualizer renders | ✓ | Verify | [ ] |

### Translation System
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Language dropdown works | ✓ | Verify | [ ] |
| Switching to Spanish translates | ✓ | Verify | [ ] |
| Switching to French translates | ✓ | Verify | [ ] |
| Switching to Kreyòl translates | ✓ | Verify | [ ] |
| Story text updates bilingually | ✓ | Verify | [ ] |
| Preference persists in localStorage | ✓ | Verify | [ ] |

### Accessibility
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Dyslexia mode toggles | ✓ | Verify | [ ] |
| High contrast mode toggles | ✓ | Verify | [ ] |
| Keyboard navigation works | ✓ | Verify | [ ] |

### Gamification
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Points display updates | ✓ | Verify | [ ] |
| Badges appear when earned | ✓ | Verify | [ ] |
| Celebration overlay shows | ✓ | Verify | [ ] |
| Confetti animation works | ✓ | Verify | [ ] |
| Progress persists on reload | ✓ | Verify | [ ] |

### Left Rail Dashboard
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Book progress shows | ✓ | Verify | [ ] |
| Episode progress shows | ✓ | Verify | [ ] |
| Badge row displays | ✓ | Verify | [ ] |
| Continue button works | ✓ | Verify | [ ] |

### Helper System
| Test | episode1.html | episode.html?ep=1 | Pass? |
|------|---------------|-------------------|-------|
| Lee helper button visible | ✓ | Verify | [ ] |
| Tee helper button visible | ✓ | Verify | [ ] |
| Clicking opens helper modal | ✓ | Verify | [ ] |
| Modal content displays | ✓ | Verify | [ ] |
| Modal closes properly | ✓ | Verify | [ ] |

---

## How to Test

1. Open `episode1.html` in browser (reference)
2. Open `episode.html?ep=1` in another tab
3. For each row, verify feature works identically in both
4. Mark [ ] with [x] when verified
5. Note any discrepancies

---

## Expected Console Output

### episode.html?ep=1 should show:
```
✓ Translation engine ready
✓ Progressive navigation initialized for Episode 1
✓ Adaptive helpers initialized
✅ Episode 1 loaded via lift-and-shift
✓ DOMContentLoaded dispatched for episode initialization
```

### No errors should appear for:
- 404 (missing files)
- Script errors
- CSS parsing errors
- Undefined function calls

---

## Fallback Behavior

If `episode.html?ep=1` fails:
1. Error message displays with links to direct episode files
2. Users can click "Episode 1: The Recess Battle" link
3. `episode1.html` loads directly (always works)

---

## Known Limitations

1. **Double DOMContentLoaded**: Some handlers may fire twice (once native, once dispatched). This is intentional to ensure all initialization runs.

2. **Script timing**: There may be slight timing differences vs. native page load. The 100ms delay before dispatching DOMContentLoaded helps mitigate this.

3. **CORS on local file://**: The fetch approach requires a web server. Opening `episode.html` via `file://` won't work due to CORS restrictions.

---

*Document Version: 1.0*
*Created for Parity Restore Sprint*
