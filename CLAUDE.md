# CLAUDE.md - AI Assistant Guide for Lee-Tee Book1 Episode1

## Project Overview

**Lee & Tee Episode 1: The Recess Battle** is an interactive children's reading application designed to enhance literacy through engaging storytelling, gamification, and accessibility features.

### Project Type
Single-page web application focused on interactive educational content for early readers.

### Target Audience
Elementary school children (grades 1-4) learning to read, with special consideration for students with dyslexia or requiring accessibility accommodations.

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Custom styling with CSS variables and animations
- **Vanilla JavaScript** - No frameworks; pure DOM manipulation
- **Tailwind CSS** (v3.x via CDN) - Utility-first CSS framework
- **Web Speech API** - Text-to-speech narration functionality

### External Dependencies
- `cdn.tailwindcss.com` - Tailwind CSS framework
- Google Fonts:
  - **Lexend** - Primary reading font (high readability)
  - **Fredoka** - Display font for headers and accents
  - **OpenDyslexic** - Specialized font for dyslexia mode

### Browser APIs Used
- **localStorage** - Persistent state management for progress tracking
- **SpeechSynthesis API** - Text-to-speech narration with word highlighting
- **DOM API** - Dynamic content manipulation and event handling

## File Structure

```
Lee-Tee_Book1_Episode1/
├── README.md              # Basic project description (46 bytes)
├── CLAUDE.md             # This file - AI assistant guide
├── indexrecent.html      # Main application (132KB, self-contained)
├── header.png            # Visual header asset (1.96MB)
└── hip_hop_hook.mp4      # Video content for story (19.8MB)
```

### Key File Details

**indexrecent.html** (132KB)
- Self-contained single-page application
- Inline CSS styles and JavaScript
- All application logic in one file
- No build process required
- Can be opened directly in browser

## Architecture & Design Patterns

### Application Architecture
- **Single Page Application (SPA)** - No page reloads
- **Event-Driven** - User interactions trigger state changes
- **Component-Based UI** - Reusable modal and card patterns
- **Progressive Enhancement** - Works without JavaScript for basic content

### State Management
Uses `localStorage` for persistent state with the following structure:

```javascript
learningState = {
  points: 0,              // Total learning points earned
  badges: [],             // Array of earned badge IDs
  completedActivities: [] // Array of completed activity IDs
}
```

State is persisted to `localStorage.leeTeeLessonProgress` on every update.

### Key JavaScript Patterns
1. **Object Literal Pattern** - `learningState` object
2. **Module Pattern** - Scoped variables and functions
3. **Event Delegation** - Click handlers on parent elements
4. **Callback Pattern** - SpeechSynthesis event handlers

## Core Features

### 1. Interactive Reading Experience
- **Word-by-word highlighting** - Synchronized with text-to-speech
- **Sentence highlighting** - Visual tracking of current reading position
- **Speech bubbles** - Character dialogue with special styling
- **Pause/Resume** - Stop narration with visual feedback

### 2. Accessibility Features
- **Dyslexia Mode**
  - Switches to OpenDyslexic font
  - Increased letter-spacing (0.05em)
  - Increased word-spacing (0.1em)
  - Enhanced line-height (2.0)
- **High Contrast Mode**
  - Black background (#000000)
  - White text (#FFFFFF)
  - Enhanced border visibility
- **Text-to-Speech**
  - Full narration support
  - Adjustable speech rate (default: 0.9x)
  - Word synchronization

### 3. Gamification System
- **Progress Tracking** - Visual progress bar for completion
- **Learning Points** - Earned through completing activities
- **Badge System** - Achievements for milestones
  - 🎯 First Steps (Complete first activity)
  - ⭐ Super Reader (50+ points)
  - 🏆 Champion (100+ points)
- **Celebration Animations** - Confetti effects on achievements

### 4. Interactive Learning Activities
- **Vocabulary Exercises**
  - Fill-in-the-blank questions
  - Multiple choice options
  - Instant feedback (correct/incorrect)
  - Audio pronunciation support
- **Vocabulary Modal**
  - Word definitions
  - Example sentences
  - Text-to-speech for vocabulary words
- **Character Selection**
  - Choose perspective (Lee or Tee)
  - Affects story interpretation exercises

### 5. Helper System
Two character-based helpers provide contextual support:

**Lee's Writing Tips** (Purple theme)
- Sentence starters for writing exercises
- Creative prompts and suggestions
- Accessible via floating button

**Tee's Strategy Check** (Amber theme)
- Critical thinking questions
- Strategic decision-making guidance
- Problem-solving prompts

## CSS Architecture

### CSS Custom Properties (Variables)
```css
--bg-primary: #FFF8F0;      /* Cream background */
--bg-secondary: #FEF3E2;    /* Light secondary background */
--accent-purple: #7C3AED;   /* Lee's color */
--accent-amber: #F59E0B;    /* Tee's color */
--accent-teal: #0D9488;     /* Supporting accent */
--accent-rose: #E11D48;     /* Alert/error color */
--text-primary: #1C1917;    /* Dark text */
--text-secondary: #57534E;  /* Muted text */
--success: #16A34A;         /* Success feedback */
--border-light: #E7E5E4;    /* Subtle borders */
```

### Animation System
1. **gradientShift** - Animated header background (8s infinite)
2. **wordPulse** - Highlights active words (0.3s ease)
3. **confettiRain** - Celebration confetti effect
4. **Smooth transitions** - 0.3s ease on interactive elements

### Responsive Design
- Mobile-first approach with Tailwind utilities
- Flexible layouts using Flexbox and Grid
- Touch-friendly button sizes (min 44px hit areas)
- Viewport-aware typography

## JavaScript Architecture

### Main Functions by Category

#### State Management
- `saveProgress()` - Persists state to localStorage
- `loadProgress()` - Restores state from localStorage
- `resetProgress()` - Clears all progress (with confirmation)
- `updateProgressBar()` - Recalculates completion percentage
- `updatePoints(amount, reason)` - Awards points and checks badges

#### Narration System
- `togglePlay(sectionId)` - Starts/stops text-to-speech
- `playStorySection(sectionId)` - Word-by-word narration with highlighting
- `playStoryAudio(sectionId)` - Sentence-level narration (simpler mode)
- `stopNarration()` - Stops all active narration

#### Interactive Activities
- `checkAnswer(blankId, selectedAnswer)` - Validates vocabulary answers
- `makeChoice(character)` - Records character selection
- `showVocabModal(word)` - Opens vocabulary definition modal
- `closeVocabModal(event)` - Closes modal (click outside)

#### UI Management
- `showCelebration(title, message, emoji)` - Displays achievement overlay
- `closeCelebration()` - Dismisses celebration
- `createConfetti()` - Generates particle effects
- `updateBadges()` - Renders badge icons
- `openHelper(character)` - Shows Lee/Tee helper modal
- `closeHelper(event, character)` - Dismisses helper modal

### Event Handling Patterns
```javascript
// Modal close on outside click
onclick="closeModal(event)"
// Inside modal content, stop propagation
onclick="event.stopPropagation()"
```

## Development Workflows

### Local Development
1. **No build process required** - Open `indexrecent.html` directly in browser
2. **Live reload** - Use browser dev tools or a simple HTTP server
3. **Testing** - Manual testing in modern browsers (Chrome, Firefox, Safari, Edge)

```bash
# Optional: Serve with Python for cleaner URLs
python3 -m http.server 8000
# Then open http://localhost:8000/indexrecent.html
```

### Browser Compatibility
**Required Features:**
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript (const, let, arrow functions, template literals)
- Web Speech API (SpeechSynthesis)
- localStorage API

**Target Browsers:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Not Supported:**
- Internet Explorer (any version)
- Older mobile browsers pre-2020

### Testing Checklist
- [ ] All narration sections play correctly
- [ ] Word highlighting syncs with speech
- [ ] Progress persists across page reloads
- [ ] Vocabulary modals display correctly
- [ ] Badges unlock at correct thresholds
- [ ] Dyslexia mode applies proper fonts
- [ ] High contrast mode is readable
- [ ] Mobile touch interactions work smoothly
- [ ] All helper modals open/close properly

## Key Conventions

### Code Style
1. **Indentation** - 2 spaces (HTML, CSS, JS)
2. **Naming Conventions**
   - camelCase for JavaScript variables/functions
   - kebab-case for CSS classes and IDs
   - PascalCase for constants (e.g., badge data)
3. **String Quotes** - Single quotes for JavaScript, double quotes for HTML attributes
4. **Comments** - Descriptive comments for complex logic sections

### HTML Conventions
- Semantic HTML5 elements (`<section>`, `<article>`, `<button>`)
- Accessibility: ARIA labels where appropriate
- ID naming: `progress-{activity}` for progress checkpoints
- Modal pattern: `{name}-modal` for modal overlays

### CSS Conventions
- Tailwind utilities first, custom classes for complex components
- Mobile-first responsive design
- CSS variables for theme colors
- BEM-like naming for custom components (e.g., `.speech-bubble__character`)

### JavaScript Conventions
- Pure functions where possible
- Avoid global pollution - use IIFE or scoped variables
- Event listeners on static elements (avoid memory leaks)
- Graceful degradation for unsupported APIs

## Content Structure

### Story Sections
Stories are divided into sections with unique IDs:
- `introduction` - Story setup
- `scene-1`, `scene-2`, etc. - Main narrative sections
- `conflict` - Story climax
- `resolution` - Story conclusion
- `reflection` - Learning reflection

### Activity Types
1. **Vocabulary Practice** - Fill-in-the-blank exercises
2. **Character Selection** - Choice-based activities
3. **Reflection Questions** - Open-ended thinking prompts
4. **Listening Comprehension** - Audio/video with questions

## Performance Considerations

### File Sizes
- HTML file: 132KB (acceptable for single-page app)
- header.png: 1.96MB (consider optimization)
- hip_hop_hook.mp4: 19.8MB (large; ensure proper loading strategy)

### Optimization Opportunities
1. **Image optimization**
   - Compress header.png (use WebP format)
   - Lazy load images below the fold
2. **Video optimization**
   - Consider streaming or chunked loading for video
   - Add loading="lazy" attribute
3. **Code splitting**
   - Extract CSS to external file for caching
   - Extract JavaScript to external file
   - Consider minification for production

### Loading Strategy
- Critical CSS inlined
- Fonts loaded asynchronously
- Tailwind loaded from CDN (cached across sites)

## Accessibility Best Practices

### Current Implementation
✅ Semantic HTML structure
✅ Keyboard navigation support
✅ Screen reader compatible text
✅ High contrast mode
✅ Dyslexia-friendly fonts
✅ Text-to-speech narration

### Improvements to Consider
- [ ] Add ARIA live regions for dynamic content updates
- [ ] Implement focus management in modals
- [ ] Add keyboard shortcuts (space to play/pause, arrows to navigate)
- [ ] Improve color contrast ratios (check WCAG AA compliance)
- [ ] Add skip-to-content link
- [ ] Provide transcripts for video content

## Educational Design Principles

### Learning Objectives
1. **Reading fluency** - Word recognition and comprehension
2. **Vocabulary building** - Context-based learning
3. **Critical thinking** - Character analysis and decision-making
4. **Engagement** - Gamification maintains interest

### Pedagogical Approach
- **Scaffolded learning** - Support available but not forced
- **Multiple modalities** - Visual, auditory, kinesthetic
- **Immediate feedback** - Positive reinforcement for correct answers
- **Choice and agency** - Students select characters and paths

## Common Tasks for AI Assistants

### Adding New Story Content
1. Create new `<section>` with unique ID
2. Add story text with `.story-text` class
3. Add progress checkpoint: `<div id="progress-{name}" class="progress-check">`
4. Update progress tracking in `updateProgressBar()` function
5. Test narration with `playStorySection('new-section-id')`

### Creating New Vocabulary Exercises
1. Add word definition to `vocabData` object
2. Create fill-in-the-blank HTML structure
3. Add answer choices with `onclick="checkAnswer('blank-id', 'answer')"`
4. Add feedback element with ID `feedback-{name}`
5. Update completion tracking in `checkAnswer()` function

### Customizing Theme
1. Modify CSS custom properties in `:root`
2. Update Tailwind color classes throughout HTML
3. Ensure high contrast mode overrides are updated
4. Test color combinations for accessibility

### Adding New Badges
1. Add badge definition to `badges` object in `updateBadges()`
2. Define unlock condition in `updatePoints()` function
3. Test unlock animation and persistence

### Debugging Common Issues

**Narration not playing:**
- Check browser SpeechSynthesis support: `'speechSynthesis' in window`
- Verify section ID matches function call
- Check for JavaScript errors in console
- Ensure text content is properly formatted

**Progress not saving:**
- Check localStorage availability
- Verify `saveProgress()` is called after state changes
- Check browser privacy settings (localStorage enabled)
- Clear localStorage and test fresh: `localStorage.clear()`

**Styling issues:**
- Verify Tailwind CDN is loading
- Check CSS custom properties are defined
- Test in different browsers for compatibility
- Use browser DevTools to inspect computed styles

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `claude/*` - Feature branches for AI-assisted development

### Commit Message Format
```
<type>: <description>

[optional body]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```
feat: add vocabulary modal with audio pronunciation
fix: resolve narration sync issue on slow connections
docs: update CLAUDE.md with accessibility guidelines
```

### Current Branch
`claude/claude-md-miz2zq90tem2chww-01Vgg3cymvPDrmwQbpHVeMbX`

## Security Considerations

### Current Implementation
✅ No server-side code (static HTML/JS)
✅ No external API calls
✅ localStorage only (no sensitive data)
✅ No user authentication required
✅ No form submissions or data collection

### Safe Practices
- Never add external scripts without verification
- Avoid `eval()` or `Function()` constructors
- Sanitize any user-generated content (if added in future)
- Keep CDN dependencies updated
- Use Content Security Policy (CSP) headers if deployed

## Deployment

### Static Hosting Options
- **GitHub Pages** - Free, simple deployment
- **Netlify** - Automatic deploys from git
- **Vercel** - Fast global CDN
- **AWS S3 + CloudFront** - Scalable static hosting

### Deployment Checklist
- [ ] Test in all target browsers
- [ ] Optimize images (compress, convert to WebP)
- [ ] Minify HTML/CSS/JS (optional for current size)
- [ ] Configure proper caching headers
- [ ] Test on real mobile devices
- [ ] Verify video streaming works
- [ ] Check localStorage functionality on domain
- [ ] Test text-to-speech across browsers

### Current Deployment Status
Not currently deployed - local development only.

## Future Enhancement Ideas

### Short-term Improvements
1. Extract inline CSS/JS to external files
2. Add print stylesheet for offline reading
3. Implement progress export/import
4. Add parent dashboard for tracking progress
5. Create additional episodes with same framework

### Long-term Enhancements
1. Backend API for cross-device progress sync
2. Teacher dashboard with student analytics
3. Adaptive difficulty based on performance
4. Speech recognition for reading aloud
5. Multiplayer reading sessions
6. Translation support for multiple languages
7. Offline PWA functionality

## Resources & References

### Documentation Links
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [OpenDyslexic Font](https://opendyslexic.org/)

### Educational Resources
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Dyslexia Design Guidelines](https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide)
- [Reading Fluency Research](https://www.readingrockets.org/topics/fluency)

## Contact & Support

For questions about this codebase or to report issues, please refer to the repository's issue tracker or contact the repository maintainer.

---

**Last Updated:** 2025-12-09
**Document Version:** 1.0.0
**Maintained by:** AI Assistant (Claude)
