# Gold Baseline - Lee-Tee Prototype
**Created:** 2026-01-10
**Commit:** 88f8da9 (Merge PR #23 - align Episode 2 with Episode 1 architecture)
**Purpose:** Safe rollback point before cleanup and engine extraction

---

## Current Working State

This baseline represents a **confirmed working state** of the Lee-Tee interactive reading application. Before deleting any files or restructuring, always ensure you can return to this commit.

### How to Restore This Baseline
```bash
git checkout 88f8da9  # Returns to exact baseline state
# OR
git checkout main     # If main hasn't been modified
```

---

## Episode 1 Dependency Inventory

### Core HTML File
- `episode1.html` (191KB) - Main Episode 1 application

### JavaScript Dependencies (Used by Episode 1)
| File | Size | Purpose |
|------|------|---------|
| `shared-header.js` | 25KB | Header functionality |
| `shared-skills.js` | 13KB | Skills/gamification system |
| `shared/shared/learning-dashboard.js` | part of shared/ | Learning progress tracking |
| `shared/progressive-nav.js` | part of shared/ | Progressive navigation |
| `shared/adaptive-helpers.js` | part of shared/ | Adaptive helper system |
| `translations/translation-engine.js` | part of translations/ | i18n support |

### CSS Dependencies (Used by Episode 1)
| File | Purpose |
|------|---------|
| `shared/learning-dashboard.css` | Dashboard styling |
| `shared/progressive-nav.css` | Navigation styling |
| CDN: Tailwind CSS | Utility classes |
| Google Fonts: Lexend, Fredoka | Typography |

### Image Assets (Used by Episode 1)
| File | Size | Description |
|------|------|-------------|
| `header.png` | 1.9MB | Main header image |
| `Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png` | 5.4MB | Lee with notebook |
| `Gemini_Generated_Image_bvzywpbvzywpbvzy.png` | 5.4MB | Tee gesturing |
| `Gemini_Generated_Image_cuhlvucuhlvucuhl.png` | 6.4MB | Playground scene |
| `Gemini_Generated_Image_ktkt54ktkt54ktkt.png` | 6.0MB | Jayden challenging |
| `Gemini_Generated_Image_k7tn0nk7tn0nk7tn.png` | 5.3MB | Battle circle |
| `Gemini_Generated_Image_v6x547v6x547v6x5.png` | 5.5MB | Tee and Lee talking |
| `Gemini_Generated_Image_upyw6mupyw6mupyw.png` | 5.2MB | Jayden stunned |
| `Gemini_Generated_Image_jhb8wijhb8wijhb8.png` | 5.7MB | Tee walking away |

### Video Assets (Used by Episode 1)
| File | Size | Description |
|------|------|-------------|
| `jayden's_rap.mp4` | 9.5MB | Jayden's rap battle |
| `tee_battle_back.mp4` | 512B | Tee battle response |

---

## Files NOT Used by Episode 1 (Safe to Quarantine)

### Unused Images
These images are NOT referenced in episode1.html:
- `Gemini_Generated_Image_wlhn8qwlhn8qwlhn.png` (6.2MB)
- `Gemini_Generated_Image_dkilh4dkilh4dkil.png` (5.2MB)
- `Gemini_Generated_Image_a8rfxja8rfxja8rf.png` (5.4MB)
- `Gemini_Generated_Image_fk641wfk641wfk64.png` (5.4MB)
- `Gemini_Generated_Image_qlq1cvqlq1cvqlq1.png` (5.4MB)
- `Gemini_Generated_Image_w9knlnw9knlnw9kn.png` (5.4MB)
- `Gemini_Generated_Image_s4u8bds4u8bds4u8.png` (6.0MB)
- `Gemini_Generated_Image_hqkjx6hqkjx6hqkj.png` (6.1MB)
- `Gemini_Generated_Image_ku9paqku9paqku9p.png` (1.4MB)

### Unused Videos
- `Video_Generation_Based_on_Image.mp4` (1.6MB)
- `Video_Generation_Tee_Builds_His_Case.mp4` (1.6MB)
- `tee's_battle_back.mp4` (3.9MB) - Note: different from `tee_battle_back.mp4`

### Potentially Unused Files
These may be used by other episodes but not Episode 1:
- `episode1.css` (9KB) - External CSS (Episode 1 uses inline)
- `episode1.js` (20KB) - External JS (Episode 1 uses inline)
- `episode1-new.html` (27KB) - Alternate version?
- `episode1_backup_20260103_160351.html` (163KB) - Backup file
- `shared-styles.css` (4KB) - Shared styles
- `shared-lesson.js` (8.5KB) - Lesson functionality
- `episode-shell-template.html` (15KB) - Template file

### Other Episode Files (Keep for future)
- `episode2.html`, `episode2.css`
- `episode3.html`
- `episode4.html`
- `index.html` (episode selector)

---

## Quarantine Strategy

### Step 1: Create Archive Folder
```bash
mkdir -p archive/unused-images
mkdir -p archive/unused-videos
mkdir -p archive/legacy-files
```

### Step 2: Move Unused Images (46.1MB total)
```bash
mv Gemini_Generated_Image_wlhn8qwlhn8qwlhn.png archive/unused-images/
mv Gemini_Generated_Image_dkilh4dkilh4dkil.png archive/unused-images/
mv Gemini_Generated_Image_a8rfxja8rfxja8rf.png archive/unused-images/
mv Gemini_Generated_Image_fk641wfk641wfk64.png archive/unused-images/
mv Gemini_Generated_Image_qlq1cvqlq1cvqlq1.png archive/unused-images/
mv Gemini_Generated_Image_w9knlnw9knlnw9kn.png archive/unused-images/
mv Gemini_Generated_Image_s4u8bds4u8bds4u8.png archive/unused-images/
mv Gemini_Generated_Image_hqkjx6hqkjx6hqkj.png archive/unused-images/
mv Gemini_Generated_Image_ku9paqku9paqku9p.png archive/unused-images/
```

### Step 3: Move Unused Videos (7.1MB total)
```bash
mv Video_Generation_Based_on_Image.mp4 archive/unused-videos/
mv Video_Generation_Tee_Builds_His_Case.mp4 archive/unused-videos/
mv "tee's_battle_back.mp4" archive/unused-videos/
```

### Step 4: Move Legacy Files
```bash
mv episode1_backup_20260103_160351.html archive/legacy-files/
mv episode1-new.html archive/legacy-files/
```

### Step 5: Test Episode 1
1. Open episode1.html in browser
2. Verify all images load
3. Verify all videos play
4. Verify text-to-speech works
5. Verify progress saves/loads
6. Check console for errors

---

## Verification Checklist

After any cleanup, verify these all work:

- [ ] Episode 1 loads without console errors
- [ ] All images visible in story
- [ ] Videos play correctly
- [ ] Narration/text-to-speech works
- [ ] Progress bar updates
- [ ] Badges unlock
- [ ] Helper modals open/close
- [ ] Accessibility modes toggle
- [ ] localStorage saves progress

---

## Git Tags (Recommended)

To create permanent baseline markers:
```bash
# Tag current main as gold baseline
git tag -a v1.0-baseline -m "Gold baseline before cleanup - Episode 1 working"
git push origin v1.0-baseline
```

---

## Notes

- **Total repo size:** ~150MB (mostly images/videos)
- **Episode 1 required assets:** ~56MB
- **Potentially removable:** ~53MB
- **Main branch commit:** 88f8da9

This baseline was created to support the "engine-reset" refactoring workflow.
