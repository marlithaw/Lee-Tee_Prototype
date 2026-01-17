/**
 * Lee & Tee Episode Engine - Core Renderer
 *
 * Loads episode configuration and renders the complete episode.
 * This is the main entry point for the engine.
 */

// Engine state
let engineConfig = null;
let progressiveNav = null;

/**
 * Initialize the engine
 */
async function initEngine() {
  try {
    console.log('🚀 Lee & Tee Engine starting...');

    // 1. Get episode number from URL
    const params = new URLSearchParams(window.location.search);
    const episodeNum = parseInt(params.get('ep'), 10) || 1;
    window.currentEpisodeNumber = episodeNum;

    console.log(`📖 Loading Episode ${episodeNum}`);

    // 2. Load episode config
    await loadEpisodeConfig(episodeNum);

    if (!engineConfig) {
      throw new Error(`Episode ${episodeNum} config not found`);
    }

    // 3. Set up page metadata
    setupPageMetadata();

    // 4. Set up character assets
    setupCharacterAssets();

    // 5. Render SIOP banner
    renderSiopBanner();

    // 6. Render hero section
    renderHeroSection();

    // 7. Render learning objectives
    renderLearningObjectives();

    // 8. Render all content sections
    renderAllSections();

    // 9. Set up vocabulary data
    if (engineConfig.vocabulary) {
      window.vocabData = engineConfig.vocabulary;
    }

    // 10. Set up helper tips
    setupHelperTips();

    // 11. Initialize progressive navigation
    initProgressiveNav();

    // 12. Initialize translation system
    await initTranslation();

    // 13. Initialize adaptive helpers
    if (typeof adaptiveHelpers !== 'undefined') {
      adaptiveHelpers.init();
    }

    // 14. Load progress
    loadProgress();

    // 15. Initialize drag and drop
    initDragAndDrop();

    // 16. Initialize skills visualizer
    if (typeof renderSkillsVisualizer === 'function') {
      renderSkillsVisualizer(episodeNum);
    }

    // 17. Sync learning dashboard
    if (window.LearningShell && typeof window.LearningShell.refresh === 'function') {
      window.LearningShell.refresh();
    }

    console.log(`✅ Episode ${episodeNum} loaded successfully`);

  } catch (error) {
    console.error('❌ Engine initialization failed:', error);
    showErrorMessage(error.message);
  }
}

/**
 * Load episode configuration
 */
async function loadEpisodeConfig(episodeNum) {
  const configName = `episode${episodeNum}Config`;

  // Check if config is already loaded (via script tag)
  if (window[configName]) {
    engineConfig = window[configName];
    return;
  }

  // Try to load config dynamically
  try {
    const script = document.createElement('script');
    script.src = `../episodes/episode${episodeNum}.config.js`;

    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load config for Episode ${episodeNum}`));
      document.head.appendChild(script);
    });

    // Wait a tick for the script to execute
    await new Promise(resolve => setTimeout(resolve, 50));

    if (window[configName]) {
      engineConfig = window[configName];
    }
  } catch (e) {
    console.error('Config load error:', e);
  }
}

/**
 * Set up page metadata
 */
function setupPageMetadata() {
  document.title = engineConfig.title || 'Lee & Tee';
  document.body.setAttribute('data-episode', engineConfig.episodeNumber || 1);

  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = engineConfig.title;

  // Update episode title in dashboard
  const episodeTitleEl = document.getElementById('learningShellEpisodeTitle');
  if (episodeTitleEl) episodeTitleEl.textContent = `Episode ${engineConfig.episodeNumber}`;
}

/**
 * Set up character assets (Lee and Tee images)
 */
function setupCharacterAssets() {
  const assets = engineConfig.assets || {};

  // Helper buttons
  const leeAvatar = document.getElementById('lee-avatar');
  const teeAvatar = document.getElementById('tee-avatar');
  if (leeAvatar) leeAvatar.src = assets.leeImage || '../Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png';
  if (teeAvatar) teeAvatar.src = assets.teeImage || '../Gemini_Generated_Image_bvzywpbvzywpbvzy.png';

  // Modal avatars
  const leeModalAvatar = document.getElementById('lee-modal-avatar');
  const teeModalAvatar = document.getElementById('tee-modal-avatar');
  if (leeModalAvatar) leeModalAvatar.src = assets.leeImage || '../Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png';
  if (teeModalAvatar) teeModalAvatar.src = assets.teeImage || '../Gemini_Generated_Image_bvzywpbvzywpbvzy.png';
}

/**
 * Render SIOP objectives banner
 */
function renderSiopBanner() {
  const banner = document.getElementById('siop-banner');
  if (!banner || !engineConfig.siop) return;

  const siop = engineConfig.siop;
  banner.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <h3 class="font-bold text-teal-800 mb-2 flex items-center gap-2" data-i18n="banners.heading">
        <span>🏫</span>
        <span>SIOP Language & Content Objectives</span>
      </h3>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="language-objective">
          <h4 class="font-bold text-green-800 mb-1" data-i18n="banners.language_objective_title">Language Objective:</h4>
          <p data-i18n="banners.language_objective_body">${siop.languageObjective}</p>
        </div>
        <div class="content-objective">
          <h4 class="font-bold text-amber-800 mb-1" data-i18n="banners.content_objective_title">Content Objective:</h4>
          <p data-i18n="banners.content_objective_body">${siop.contentObjective}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render hero section
 */
function renderHeroSection() {
  const hero = document.getElementById('hero-section');
  if (!hero || !engineConfig.hero) return;

  const h = engineConfig.hero;
  const assets = engineConfig.assets || {};

  hero.innerHTML = `
    <img src="${assets.headerImage || '../header.png'}" alt="${h.imageAlt || 'Lee and Tee'}" class="w-full">
    <div class="hero-gradient text-white p-8 md:p-12 text-center">
      <div class="inline-block bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold mb-4" data-i18n="story.title">
        ${h.badge || '📚 Episode 1 • ELA: Argumentative Writing'}
      </div>
      <h1 class="font-display text-4xl md:text-5xl font-bold mb-3" data-i18n="hero.title">${h.title}</h1>
      <p class="text-lg opacity-90 max-w-md mx-auto" data-i18n="hero.subtitle">
        ${h.subtitle}
      </p>

      ${h.introVideo ? `
      <div class="mt-6 max-w-sm mx-auto">
        <div class="video-block">
          <iframe src="${h.introVideo}"
                  style="width: 100%; height: 315px; border: none; border-radius: 8px;"
                  title="Meet Lee & Tee"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
          </iframe>
          <div class="video-caption">
            <p class="font-semibold">${h.introVideoCaption || 'Meet Lee & Tee'}</p>
          </div>
        </div>
      </div>
      ` : ''}

      <div class="mt-8 bg-white/10 backdrop-blur rounded-xl p-4 max-w-md mx-auto">
        <div class="standard-tag bg-white/20 backdrop-blur border-white/30 text-white mb-2">
          <span class="standard-code" data-i18n="hero.standard_code">${h.standardCode || 'CCSS.ELA.W.5.1'}</span>
          <span data-i18n="hero.standard_label">${h.standardLabel || 'Opinion Writing with Reasons'}</span>
        </div>
        <p class="font-semibold mb-2" data-i18n="ui.goal_label">🎯 Today's Goal:</p>
        <p class="text-sm" data-i18n="ui.goal_text">${h.goal}</p>
      </div>
    </div>
  `;
}

/**
 * Render learning objectives
 */
function renderLearningObjectives() {
  const container = document.getElementById('learning-objectives');
  if (!container || !engineConfig.learningObjectives) return;

  const objectives = engineConfig.learningObjectives;
  container.innerHTML = `
    <div class="flex flex-wrap gap-3 justify-center">
      ${objectives.map(obj => `
        <div class="section-marker">
          <span class="${obj.colorClass || 'text-purple-600'}">${obj.icon}</span>
          <span>${obj.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render all content sections
 */
function renderAllSections() {
  const sectionDisplay = document.getElementById('section-display');
  if (!sectionDisplay || !engineConfig.sections) return;

  engineConfig.sections.forEach((section, index) => {
    const sectionNum = index + 1;
    const sectionEl = document.createElement('div');
    sectionEl.className = 'section-content';
    sectionEl.setAttribute('data-section', sectionNum);

    // Check for layers.core.content first (lift-and-shift HTML approach)
    if (section.layers && section.layers.core && section.layers.core.content) {
      let html = section.layers.core.content;

      // Also include media layer if available
      if (section.layers.media && section.layers.media.content) {
        html += section.layers.media.content;
      }

      // Also include checks layer if available
      if (section.layers.checks && section.layers.checks.content) {
        html += section.layers.checks.content;
      }

      // Also include supports layer if available
      if (section.layers.supports && section.layers.supports.content) {
        html += section.layers.supports.content;
      }

      sectionEl.innerHTML = html;
    } else {
      // Render section based on type (structured data approach)
      switch (section.type) {
        case 'sel-checkin':
          sectionEl.innerHTML = renderSELSection(section);
          break;
        case 'character-choice':
          sectionEl.innerHTML = renderCharacterChoice(section);
          break;
        case 'vocabulary':
          sectionEl.innerHTML = renderVocabularySection(section);
          break;
        case 'story':
          sectionEl.innerHTML = renderStorySection(section);
          break;
        case 'strategy':
          sectionEl.innerHTML = renderStrategySection(section);
          break;
        case 'essay-model':
          sectionEl.innerHTML = renderEssayModelSection(section);
          break;
        case 'writing':
          sectionEl.innerHTML = renderWritingSection(section);
          break;
        case 'reflection':
          sectionEl.innerHTML = renderReflectionSection(section);
          break;
        case 'combined':
          // Combined section contains multiple subsections
          sectionEl.innerHTML = section.content.map(sub => {
            switch (sub.type) {
              case 'sel-checkin': return renderSELSection(sub);
              case 'character-choice': return renderCharacterChoice(sub);
              default: return '';
            }
          }).join('');
          break;
        default:
          // Custom HTML content
          sectionEl.innerHTML = section.html || '';
      }
    }

    sectionDisplay.appendChild(sectionEl);
  });
}

/**
 * Render SEL check-in section
 */
function renderSELSection(config) {
  const emotions = config.emotions || [
    { emoji: '😄', label: 'Excited', value: 'excited' },
    { emoji: '😊', label: 'Calm', value: 'calm' },
    { emoji: '😰', label: 'Nervous', value: 'nervous' },
    { emoji: '😴', label: 'Tired', value: 'tired' }
  ];

  return `
    <section id="sel-checkin" class="p-8 md:p-12 bg-gradient-to-b from-blue-50 to-white">
      <h2 class="font-display text-2xl font-bold mb-4 text-center" data-translate="sel.question">${config.title || 'How are you feeling today?'}</h2>
      <p class="text-center text-gray-600 mb-6" data-translate="instructions.select_emotion">${config.instruction || 'Choose what describes you best right now:'}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        ${emotions.map(e => `
          <div class="emotion-option bg-white" onclick="selectEmotion(this, '${e.value}')">
            <div class="text-4xl mb-2">${e.emoji}</div>
            <div class="font-semibold" data-translate="sel.${e.value}">${e.label}</div>
          </div>
        `).join('')}
      </div>

      <div id="selFeedback" class="mt-6 text-center text-purple-700 font-semibold hidden"></div>
    </section>
  `;
}

/**
 * Render character choice section
 */
function renderCharacterChoice(config) {
  return `
    <section id="character-choice" class="p-8 md:p-12 bg-gradient-to-b from-purple-50 to-white">
      <h2 class="font-display text-3xl font-bold mb-4 text-purple-700" data-translate="character.title">${config.title || 'Choose Your Learning Guide'}</h2>
      <p class="text-lg mb-6" data-translate="instructions.select_character">${config.instruction || 'Which character do you want to help first? You\'ll learn from both, but you choose where to start!'}</p>

      <div class="grid md:grid-cols-2 gap-6">
        <div id="chooseLee" class="choice-card bg-white p-6 rounded-xl shadow" onclick="chooseCharacter('lee')">
          <div class="text-6xl mb-4 text-center">${config.leeEmoji || '📓'}</div>
          <h3 class="font-display text-2xl font-bold mb-2 text-center" data-translate="character.lee_name">${config.leeName || 'Start with Lee'}</h3>
          <p class="text-gray-600 text-center" data-translate="character.lee_desc">${config.leeDesc || 'The analytical thinker who loves to write everything down'}</p>
        </div>

        <div id="chooseTee" class="choice-card bg-white p-6 rounded-xl shadow" onclick="chooseCharacter('tee')">
          <div class="text-6xl mb-4 text-center">${config.teeEmoji || '🎤'}</div>
          <h3 class="font-display text-2xl font-bold mb-2 text-center" data-translate="character.tee_name">${config.teeName || 'Start with Tee'}</h3>
          <p class="text-gray-600 text-center" data-translate="character.tee_desc">${config.teeDesc || 'The strategic speaker who thinks on her feet'}</p>
        </div>
      </div>

      <div id="characterFeedback" class="hidden mt-6 p-4 bg-purple-100 rounded-lg text-center">
        <p class="font-bold text-purple-800">Great choice! Let's begin the story...</p>
      </div>
    </section>
  `;
}

/**
 * Render vocabulary section
 */
function renderVocabularySection(config) {
  const words = config.words || [];
  const blanks = config.blanks || [];

  return `
    <section class="p-8 md:p-12 bg-amber-50" id="section-vocab">
      <div class="ritual-marker ritual-stir mb-4" data-translate="vocab.ritual_marker">${config.ritualMarker || '🥄 Stir It — Gather the Ingredients'}</div>

      <h2 class="font-display text-3xl font-bold mb-4 text-purple-700" data-translate="vocab.title">${config.title || 'Words You\'ll Need'}</h2>

      ${config.standardCode ? `
      <div class="standard-tag mb-6">
        <span class="standard-code">${config.standardCode}</span>
        <span>${config.standardLabel || ''}</span>
      </div>
      ` : ''}

      <div class="flex flex-wrap gap-2 mb-4">
        <div class="siop-strategy" data-translate="vocab.siop_vocab">📚 Vocabulary Pre-teaching</div>
        <div class="siop-strategy" data-translate="vocab.siop_visual">🖼️ Visual Supports</div>
        <div class="siop-strategy" data-translate="vocab.siop_frames">🗣️ Sentence Frames</div>
      </div>

      <p class="text-lg mb-6" data-translate="vocab.intro">${config.intro || 'Let\'s learn these important words.'}</p>

      <!-- Word Bank -->
      <div class="word-bank">
        <p class="font-semibold text-purple-700 mb-2" data-translate="vocab.word_bank">📖 Word Bank:</p>
        <div class="flex flex-wrap gap-2">
          ${words.map(w => `
            <span class="bg-white px-3 py-1 rounded-full text-sm font-medium border border-purple-200">${w.word}</span>
          `).join('')}
        </div>
      </div>

      <!-- Vocabulary Gallery -->
      <div class="grid md:grid-cols-3 gap-4 mb-8">
        ${words.map(w => `
          <div class="bg-white p-4 rounded-xl shadow-sm border border-${w.colorClass || 'purple'}-100 cursor-pointer hover:shadow-md transition group"
               onclick="showVocab('${w.key}')">
            <div class="flex items-center gap-3 mb-3">
              <div class="vocab-image">${w.image}</div>
              <div>
                <h4 class="font-bold text-${w.colorClass || 'purple'}-700">${w.word}</h4>
                <p class="text-xs text-gray-500">${w.subtitle || ''}</p>
              </div>
            </div>
            <p class="text-sm text-gray-700 mb-3">${w.shortDef}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs bg-${w.colorClass || 'purple'}-50 text-${w.colorClass || 'purple'}-700 px-2 py-1 rounded">${w.example || ''}</span>
              <span class="text-xs text-gray-400">Tap to learn</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Fill in the blanks -->
      ${blanks.length > 0 ? `
      <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h3 class="font-bold text-lg mb-4">Fill in the blanks:</h3>
        ${blanks.map((blank, i) => `
          <div class="mb-4">
            <p class="mb-2">${blank.sentence.replace('___', `<span id="blank${i+1}" class="vocab-blank cursor-pointer bg-purple-100 px-3 py-1 rounded" onclick="showVocabChoices('blank${i+1}', '${blank.correctWord}')">[click to choose]</span>`)}</p>
            <div id="choices${i+1}" class="vocab-choices hidden mt-2 flex flex-wrap gap-2">
              ${blank.choices.map(choice => `
                <button onclick="checkVocabChoice('blank${i+1}', 'choices${i+1}', '${choice}', ${choice === blank.correctWord})"
                        class="px-3 py-1 rounded-full border border-purple-300 hover:bg-purple-100">${choice}</button>
              `).join('')}
            </div>
            <div id="feedback${i+1}" class="hidden mt-2 text-green-600 text-sm font-semibold">✓ ${blank.feedback || 'Correct!'}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </section>
  `;
}

/**
 * Render story section
 */
function renderStorySection(config) {
  const parts = config.parts || [];

  return `
    <section class="p-8 md:p-12" id="${config.id || 'story-section'}">
      <h2 class="font-display text-3xl font-bold mb-4 text-purple-700">${config.title || 'The Story'}</h2>

      ${parts.map((part, i) => `
        <div class="story-text mb-6" id="story-part-${i+1}" data-story-section="part-${i+1}">
          ${part.heading ? `<h3 class="font-bold text-xl mb-3">${part.heading}</h3>` : ''}

          ${part.content.map(block => {
            if (block.type === 'paragraph') {
              return `<p class="mb-4">${block.text}</p>`;
            } else if (block.type === 'speech-bubble') {
              return `
                <div class="speech-bubble ${block.position || ''}">
                  <p class="font-bold text-${block.characterColor || 'purple'}-700">${block.character}</p>
                  <p>${block.text}</p>
                </div>
              `;
            } else if (block.type === 'image') {
              return `<img src="${block.src}" alt="${block.alt || ''}" class="rounded-lg my-4">`;
            } else if (block.type === 'video') {
              return `
                <div class="video-block">
                  <video controls>
                    <source src="${block.src}" type="video/mp4">
                  </video>
                  ${block.caption ? `<div class="video-caption"><p>${block.caption}</p></div>` : ''}
                </div>
              `;
            }
            return '';
          }).join('')}

          ${part.audioButton ? `
            <button class="audio-btn" onclick="toggleSectionAudio(this, 'story-part-${i+1}')">
              🔊 Listen
            </button>
          ` : ''}
        </div>

        ${part.comprehensionCheck ? `
          <div class="bg-purple-50 p-4 rounded-lg mb-6">
            <p class="font-bold mb-3">${part.comprehensionCheck.question}</p>
            <div class="space-y-2">
              ${part.comprehensionCheck.options.map((opt, j) => `
                <button class="quiz-option w-full text-left" onclick="checkAnswer(this, ${opt.correct}, 'comp${i+1}')">
                  ${opt.text}
                </button>
              `).join('')}
            </div>
            <div id="comp${i+1}-feedback" class="hidden mt-3 text-green-600 font-semibold">
              ✓ ${part.comprehensionCheck.feedback || 'Correct!'}
            </div>
          </div>
        ` : ''}
      `).join('')}
    </section>
  `;
}

/**
 * Render strategy section (with drag-drop)
 */
function renderStrategySection(config) {
  const steps = config.steps || [];

  return `
    <section class="p-8 md:p-12 bg-gradient-to-b from-amber-50 to-white" id="section-strategy">
      <h2 class="font-display text-3xl font-bold mb-4 text-amber-700">${config.title || "Tee's 4-Step Strategy"}</h2>
      <p class="text-lg mb-6">${config.intro || ''}</p>

      <!-- Steps Display -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 class="font-bold mb-4">The Steps:</h3>
          ${steps.map((step, i) => `
            <div class="flex items-start gap-3 mb-3">
              <span class="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">${i+1}</span>
              <div>
                <p class="font-bold">${step.title}</p>
                <p class="text-sm text-gray-600">${step.description}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Drag and Drop Activity -->
        ${config.dragDropActivity ? `
        <div>
          <h3 class="font-bold mb-4">Put the steps in order:</h3>
          <div id="rapLines" class="space-y-2 mb-4">
            ${config.dragDropActivity.items.map(item => `
              <div class="rap-line" draggable="true" data-step="${item.step}">
                ${item.text}
              </div>
            `).join('')}
          </div>

          <h3 class="font-bold mb-4">Drop zones:</h3>
          <div class="space-y-2">
            ${steps.map((_, i) => `
              <div class="drop-zone" data-target="${i+1}" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
                <span class="text-gray-400">Step ${i+1}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <div id="strategyFeedback" class="hidden p-4 bg-green-100 rounded-lg text-center">
        <p class="font-bold text-green-700">🎉 You mastered the strategy!</p>
      </div>
    </section>
  `;
}

/**
 * Render essay model section
 */
function renderEssayModelSection(config) {
  const paragraphs = config.paragraphs || [];

  return `
    <section class="p-8 md:p-12" id="section-essay">
      <h2 class="font-display text-3xl font-bold mb-4 text-purple-700">${config.title || "Lee's Essay Model"}</h2>
      <p class="text-lg mb-6">${config.intro || ''}</p>

      <!-- Essay Hunt Buttons -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button id="btn-claim" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold" onclick="highlightEssayPart('claim')" data-part-name="Claim">
          Find the Claim
        </button>
        <button id="btn-evidence" class="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-bold" onclick="highlightEssayPart('evidence')" data-part-name="Evidence">
          Find the Evidence
        </button>
        <button id="btn-counterclaim" class="px-4 py-2 bg-rose-100 text-rose-700 rounded-full font-bold" onclick="highlightEssayPart('counterclaim')" data-part-name="Counterclaim">
          Find the Counterclaim
        </button>
        <button id="btn-conclusion" class="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold" onclick="highlightEssayPart('conclusion')" data-part-name="Conclusion">
          Find the Conclusion
        </button>
      </div>

      <p id="essay-instruction" class="text-gray-600 mb-4">Click a button above, then find that part in the essay.</p>

      <!-- Essay Paragraphs -->
      <div class="bg-white p-6 rounded-xl shadow-sm space-y-4">
        ${paragraphs.map(p => `
          <div id="paragraph-${p.id}" class="p-4 rounded-lg border-2 border-transparent cursor-pointer hover:border-gray-300 transition" onclick="checkEssayPart('${p.id}', '${p.correctPart}')">
            <p>${p.text}</p>
          </div>
        `).join('')}
      </div>

      <div id="essayComplete" class="hidden mt-6 p-4 bg-green-100 rounded-lg text-center">
        <p class="font-bold text-green-700">🎉 Excellent! You found all the essay parts!</p>
      </div>
    </section>
  `;
}

/**
 * Render writing section
 */
function renderWritingSection(config) {
  return `
    <section class="p-8 md:p-12 bg-gradient-to-b from-purple-50 to-white" id="section-writing">
      <h2 class="font-display text-3xl font-bold mb-4 text-purple-700">${config.title || 'Your Turn to Write'}</h2>
      <p class="text-lg mb-6">${config.prompt || ''}</p>

      <div class="response-area">
        <textarea id="studentResponse" class="response-textarea" placeholder="${config.placeholder || 'Write your response here...'}" oninput="updateRubric()"></textarea>

        <div class="flex gap-2 mt-4">
          <button onclick="startDictation(this)" class="speech-btn">
            🎤 Speak Answer
          </button>
          <button onclick="saveResponse()" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
            💾 Save
          </button>
          <button onclick="shareResponse()" class="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600">
            🤝 Share
          </button>
        </div>
      </div>

      <!-- Rubric -->
      ${config.rubric ? `
      <div class="mt-6">
        <h3 class="font-bold mb-3">Self-Check Rubric:</h3>
        <div class="space-y-2">
          ${config.rubric.map((item, i) => `
            <div id="rubric${i+1}" class="rubric-item">
              <input type="checkbox" class="rubric-checkbox" onchange="toggleRubricItem('rubric${i+1}')">
              <span>${item}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </section>
  `;
}

/**
 * Render reflection section
 */
function renderReflectionSection(config) {
  return `
    <section class="p-8 md:p-12" id="section-reflect">
      <h2 class="font-display text-3xl font-bold mb-4 text-purple-700">${config.title || 'Reflect on Your Learning'}</h2>

      ${config.questions ? config.questions.map((q, i) => `
        <div class="mb-6">
          <p class="font-bold mb-2">${q.question}</p>
          <textarea class="response-textarea" placeholder="${q.placeholder || 'Your answer...'}"></textarea>
          <div class="mt-2">
            <button onclick="startDictation(this)" class="speech-btn">
              🎤 Speak Answer
            </button>
          </div>
        </div>
      `).join('') : ''}

      <!-- Final Emotion Check -->
      <div class="mt-8">
        <h3 class="font-bold text-xl mb-4">How do you feel now?</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div class="emotion-option bg-white" onclick="selectFinalEmotion(this, 'confident')">
            <div class="text-4xl mb-2">😎</div>
            <div class="font-semibold">Confident</div>
          </div>
          <div class="emotion-option bg-white" onclick="selectFinalEmotion(this, 'curious')">
            <div class="text-4xl mb-2">🤔</div>
            <div class="font-semibold">Curious</div>
          </div>
          <div class="emotion-option bg-white" onclick="selectFinalEmotion(this, 'proud')">
            <div class="text-4xl mb-2">🌟</div>
            <div class="font-semibold">Proud</div>
          </div>
          <div class="emotion-option bg-white" onclick="selectFinalEmotion(this, 'ready')">
            <div class="text-4xl mb-2">💪</div>
            <div class="font-semibold">Ready</div>
          </div>
        </div>
      </div>

      <!-- Final Points Display -->
      <div class="mt-8 text-center">
        <p class="text-2xl font-bold">Final Score: <span id="finalPoints">0</span> points</p>
        <div id="badgeContainer" class="flex justify-center gap-2 mt-4"></div>
      </div>

      <!-- Skills Visualizer -->
      <div id="skills-visualizer" class="mt-8"></div>
    </section>
  `;
}

/**
 * Set up helper tips from config
 */
function setupHelperTips() {
  if (!engineConfig.helpers) return;

  const leeTips = document.getElementById('lee-tips');
  const teeTips = document.getElementById('tee-tips');

  if (leeTips && engineConfig.helpers.lee) {
    leeTips.innerHTML = engineConfig.helpers.lee.tips.map(tip => `
      <li class="flex items-start gap-2">
        <span class="text-purple-500">📝</span>
        <span>"${tip}"</span>
      </li>
    `).join('');
  }

  if (teeTips && engineConfig.helpers.tee) {
    teeTips.innerHTML = engineConfig.helpers.tee.tips.map((tip, i) => `
      <li class="flex items-start gap-3">
        <span class="bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">${i+1}</span>
        <span>${tip}</span>
      </li>
    `).join('');
  }
}

/**
 * Initialize progressive navigation
 */
function initProgressiveNav() {
  if (typeof ProgressiveNav === 'undefined') {
    console.warn('ProgressiveNav not available');
    return;
  }

  const numSections = engineConfig.sections ? engineConfig.sections.length : 7;
  progressiveNav = new ProgressiveNav(engineConfig.episodeNumber || 1, numSections);

  // Register sections
  if (engineConfig.navigation) {
    engineConfig.navigation.forEach((nav, i) => {
      progressiveNav.registerSection(i + 1, nav.label, nav.icon, false);
    });
  } else {
    // Default navigation
    progressiveNav.registerSection(1, 'Start', '🏁', false);
    progressiveNav.registerSection(2, 'Vocabulary', '📚', false);
    progressiveNav.registerSection(3, 'Story', '📖', false);
    progressiveNav.registerSection(4, 'Strategy', '🧭', false);
    progressiveNav.registerSection(5, 'Model', '✍️', false);
    progressiveNav.registerSection(6, 'Write', '📝', false);
    progressiveNav.registerSection(7, 'Reflect', '💭', false);
  }

  progressiveNav.init();

  // Show section 1 by default
  setTimeout(() => {
    progressiveNav.currentSection = 1;
    progressiveNav.showSection(1);
  }, 100);
}

/**
 * Initialize translation system
 */
async function initTranslation() {
  if (typeof translator === 'undefined') {
    console.warn('Translator not available');
    return;
  }

  try {
    await translator.loadLanguage('en');
    await translator.loadLanguage('es');
    await translator.loadLanguage('fr');
    await translator.loadLanguage('ht');

    addTranslationUI();
    translator.translatePage();

    if (typeof translator.renderStoryLanguage === 'function') {
      translator.renderStoryLanguage(translator.currentLang);
    }
  } catch (e) {
    console.warn('Translation init error:', e);
  }
}

/**
 * Add translation UI toggle
 */
function addTranslationUI() {
  const stickyContainer = document.getElementById('sticky-ui');
  if (!stickyContainer) return;

  // Check if already added
  if (document.querySelector('.language-toggle')) return;

  const langToggle = document.createElement('div');
  langToggle.className = 'language-toggle';
  langToggle.innerHTML = `
    <label for="lang-select" data-i18n="ui.language_label">Language:</label>
    <select id="lang-select">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="ht">Kreyòl</option>
    </select>
  `;

  stickyContainer.appendChild(langToggle);

  const storedLang = localStorage.getItem('preferred-language') || 'en';
  const selectEl = document.getElementById('lang-select');
  if (selectEl) {
    selectEl.value = storedLang;
    selectEl.addEventListener('change', async (e) => {
      if (typeof translator !== 'undefined' && translator.applyLanguage) {
        await translator.applyLanguage(e.target.value);
      }
      updateProgressChecklist();
    });
  }
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <div class="p-8 text-center">
        <div class="text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-bold text-red-600 mb-4">Failed to Load Episode</h2>
        <p class="text-gray-600 mb-6">${message}</p>
        <a href="../episode1.html" class="inline-block px-6 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700">
          Go to Episode 1 (Original)
        </a>
      </div>
    `;
  }
}

// Export functions
window.initEngine = initEngine;
window.engineConfig = engineConfig;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initEngine);
