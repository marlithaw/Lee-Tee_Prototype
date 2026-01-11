/**
 * Episode 1 Configuration: The Recess Battle
 *
 * Subject: ELA (English Language Arts)
 * Theme: Argumentative Writing / Counter-Arguments
 */

window.episode1Config = {
  id: 1,
  title: 'Lee & Tee Episode 1: The Recess Battle',
  subtitle: 'Learning to counter arguments with evidence',
  subject: 'ELA',
  color: '#7C3AED',

  // Standard alignment
  standard: {
    code: 'CCSS.ELA-LITERACY.W.4.1',
    label: 'Write opinion pieces supporting a point of view'
  },

  // Learning objectives
  objectives: {
    language: 'Students will use claim, evidence, and counterclaim in complete sentences.',
    content: 'Students will analyze how to construct and counter an argument using evidence.'
  },

  // Progress tracking items
  progressItems: [
    { id: 'sel', label: 'Check-In' },
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'section1', label: 'Section 1' },
    { id: 'section2', label: 'Section 2' },
    { id: 'section3', label: 'Section 3' },
    { id: 'drag', label: 'Drag & Drop' },
    { id: 'essay', label: 'Model Essay' },
    { id: 'reflect', label: 'Reflection' }
  ],

  // Vocabulary definitions
  vocabulary: {
    claim: {
      word: 'Claim',
      def: "What you believe or what you are trying to prove. It's your main point.",
      example: 'Jayden made a claim that Tee "never wins at anything."',
      spanish: 'En español: afirmación',
      image: '📢'
    },
    evidence: {
      word: 'Evidence',
      def: 'Proof or facts that support your claim. Also called "receipts."',
      example: 'Tee brought evidence: "Ms. R checked attendance... I been on-time all quarter."',
      spanish: 'En español: evidencia, prueba',
      image: '📄'
    },
    counterclaim: {
      word: 'Counterclaim',
      def: "The other side's argument. Addressing a counterclaim means explaining why the opposing view is weak.",
      example: "Lee learned to address a counterclaim by watching Tee respond to Jayden's argument.",
      spanish: 'En español: contraargumento',
      image: '↔'
    }
  },

  // Media assets
  media: {
    header: 'header.png',
    leeAvatar: 'Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png',
    teeAvatar: 'Gemini_Generated_Image_bvzywpbvzywpbvzy.png',
    playgroundScene: 'Gemini_Generated_Image_cuhlvucuhlvucuhl.png',
    jaydenChallenge: 'Gemini_Generated_Image_ktkt54ktkt54ktkt.png',
    battleCircle: 'Gemini_Generated_Image_k7tn0nk7tn0nk7tn.png',
    teeTalking: 'Gemini_Generated_Image_v6x547v6x547v6x5.png',
    jaydenStunned: 'Gemini_Generated_Image_upyw6mupyw6mupyw.png',
    teeVictory: 'Gemini_Generated_Image_jhb8wijhb8wijhb8.png',
    videoPoster: 'Gemini_Generated_Image_fk641wfk641wfk64.png',
    jaydenRap: "jayden's_rap.mp4",
    teeBattleBack: 'tee_battle_back.mp4'
  },

  // Section configurations
  sections: [
    // Section 1: SEL Check-In + Character Choice
    {
      id: 'section-start',
      type: 'sel-checkin',
      title: 'Start & Check-In',
      icon: '🏁',
      navIndex: 1,
      layers: {
        core: {
          content: `
            <section id="sel-checkin" class="p-8 md:p-12 bg-gradient-to-b from-blue-50 to-white">
              <div class="max-w-4xl mx-auto">
                <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  <span id="progress-sel" class="progress-check">⬜</span>
                  How are you feeling today?
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="emotionGrid">
                  <button class="emotion-option p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition text-center"
                          onclick="selectEmotion(this, 'excited')">
                    <span class="text-4xl block mb-2">😊</span>
                    <span class="font-medium" data-translate="emotions.excited">Excited</span>
                  </button>
                  <button class="emotion-option p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition text-center"
                          onclick="selectEmotion(this, 'calm')">
                    <span class="text-4xl block mb-2">😌</span>
                    <span class="font-medium" data-translate="emotions.calm">Calm</span>
                  </button>
                  <button class="emotion-option p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition text-center"
                          onclick="selectEmotion(this, 'tired')">
                    <span class="text-4xl block mb-2">😴</span>
                    <span class="font-medium" data-translate="emotions.tired">Tired</span>
                  </button>
                  <button class="emotion-option p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition text-center"
                          onclick="selectEmotion(this, 'nervous')">
                    <span class="text-4xl block mb-2">😰</span>
                    <span class="font-medium" data-translate="emotions.nervous">Nervous</span>
                  </button>
                </div>
                <p id="selFeedback" class="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 hidden"></p>
              </div>
            </section>

            <section id="character-choice" class="p-8 md:p-12 bg-gradient-to-b from-purple-50 to-white">
              <div class="max-w-4xl mx-auto">
                <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-4" data-translate="character_choice.title">
                  Who do you want to learn with today?
                </h2>
                <p class="text-gray-600 mb-6" data-translate="character_choice.subtitle">Your choice affects what kind of help you'll see.</p>
                <div class="grid md:grid-cols-2 gap-6">
                  <button id="chooseLee" class="choice-card p-6 rounded-xl border-3 border-purple-200 hover:border-purple-400 transition text-left bg-white"
                          onclick="chooseCharacter('lee')">
                    <div class="flex items-center gap-4 mb-4">
                      <img src="Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png" alt="Lee" class="w-16 h-16 rounded-full object-cover">
                      <div>
                        <h3 class="font-bold text-xl text-purple-700" data-translate="character_choice.lee_name">Lee</h3>
                        <p class="text-purple-600" data-translate="character_choice.lee_subtitle">The Writer</p>
                      </div>
                    </div>
                    <p class="text-gray-600" data-translate="character_choice.lee_description">
                      Choose Lee for more sentence frames, word banks, and step-by-step guides.
                    </p>
                  </button>
                  <button id="chooseTee" class="choice-card p-6 rounded-xl border-3 border-amber-200 hover:border-amber-400 transition text-left bg-white"
                          onclick="chooseCharacter('tee')">
                    <div class="flex items-center gap-4 mb-4">
                      <img src="Gemini_Generated_Image_bvzywpbvzywpbvzy.png" alt="Tee" class="w-16 h-16 rounded-full object-cover">
                      <div>
                        <h3 class="font-bold text-xl text-amber-700" data-translate="character_choice.tee_name">Tee</h3>
                        <p class="text-amber-600" data-translate="character_choice.tee_subtitle">The Strategist</p>
                      </div>
                    </div>
                    <p class="text-gray-600" data-translate="character_choice.tee_description">
                      Choose Tee for strategy tips and thinking prompts.
                    </p>
                  </button>
                </div>
                <div id="characterFeedback" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg hidden">
                  <p class="text-green-800 font-medium" data-translate="character_choice.feedback">
                    Great choice! Your helper will appear throughout the lesson.
                  </p>
                </div>
              </div>
            </section>
          `
        }
      },
      activities: [
        {
          id: 'sel-emotion',
          type: 'emotion-select',
          progressKey: 'sel',
          points: 0
        },
        {
          id: 'character-select',
          type: 'character-select',
          progressKey: 'character',
          points: 5
        }
      ]
    },

    // Section 2: Vocabulary
    {
      id: 'section-vocab',
      type: 'vocabulary',
      title: 'Vocabulary',
      icon: '📚',
      navIndex: 2,
      layers: {
        core: {
          content: `
            <section class="p-8 md:p-12 bg-amber-50" id="section-vocab">
              <div class="max-w-4xl mx-auto">
                <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  <span id="progress-vocab" class="progress-check">⬜</span>
                  Key Vocabulary
                </h2>

                <!-- Word Bank -->
                <div class="word-bank mb-8">
                  <h3 class="font-bold text-purple-700 mb-3">📚 Word Bank</h3>
                  <div class="flex flex-wrap gap-3">
                    <button onclick="showVocab('claim')" class="vocab-word-btn px-4 py-2 bg-white rounded-full border-2 border-purple-200 hover:border-purple-400 transition">
                      📢 Claim
                    </button>
                    <button onclick="showVocab('evidence')" class="vocab-word-btn px-4 py-2 bg-white rounded-full border-2 border-purple-200 hover:border-purple-400 transition">
                      📄 Evidence
                    </button>
                    <button onclick="showVocab('counterclaim')" class="vocab-word-btn px-4 py-2 bg-white rounded-full border-2 border-purple-200 hover:border-purple-400 transition">
                      ↔️ Counterclaim
                    </button>
                  </div>
                </div>

                <!-- Fill-in-the-blank -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                  <h3 class="font-bold text-gray-800 mb-4" data-translate="vocab.fill_blanks_title">Fill in the blanks:</h3>

                  <!-- Blank 1 -->
                  <div class="mb-6">
                    <p class="text-gray-700 mb-2">
                      When Jayden said Tee "never wins at anything," he was making a
                      <span class="vocab-predict">
                        <span id="blank1" class="vocab-blank" onclick="showVocabChoices('blank1', 'claim')">_______</span>
                        <div id="choices1" class="vocab-choices">
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank1', 'choices1', 'claim', true)">claim</button>
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank1', 'choices1', 'evidence', false)">evidence</button>
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank1', 'choices1', 'counterclaim', false)">counterclaim</button>
                        </div>
                      </span>.
                    </p>
                    <p id="feedback1" class="text-green-600 text-sm mt-1 hidden">✓ Correct! A claim is someone's main argument.</p>
                  </div>

                  <!-- Blank 2 -->
                  <div class="mb-6">
                    <p class="text-gray-700 mb-2">
                      When Tee mentioned Ms. R's attendance record, he was using
                      <span class="vocab-predict">
                        <span id="blank2" class="vocab-blank" onclick="showVocabChoices('blank2', 'evidence')">_______</span>
                        <div id="choices2" class="vocab-choices">
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank2', 'choices2', 'claim', false)">claim</button>
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank2', 'choices2', 'evidence', true)">evidence</button>
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank2', 'choices2', 'counterclaim', false)">counterclaim</button>
                        </div>
                      </span>.
                    </p>
                    <p id="feedback2" class="text-green-600 text-sm mt-1 hidden">✓ Correct! Evidence is proof that supports your argument.</p>
                  </div>

                  <!-- Blank 3 -->
                  <div class="mb-6">
                    <p class="text-gray-700 mb-2">
                      When Tee responded to Jayden's argument by explaining why it was wrong, he was addressing the
                      <span class="vocab-predict">
                        <span id="blank3" class="vocab-blank" onclick="showVocabChoices('blank3', 'counterclaim')">_______</span>
                        <div id="choices3" class="vocab-choices">
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank3', 'choices3', 'claim', false)">claim</button>
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank3', 'choices3', 'evidence', false)">evidence</button>
                          <button class="vocab-choice-btn" onclick="checkVocabChoice('blank3', 'choices3', 'counterclaim', true)">counterclaim</button>
                        </div>
                      </span>.
                    </p>
                    <p id="feedback3" class="text-green-600 text-sm mt-1 hidden">✓ Correct! A counterclaim is when you respond to the other side's argument.</p>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      activities: [
        {
          id: 'vocab-blanks',
          type: 'vocab-fill-blank',
          progressKey: 'vocab',
          points: 10,
          badge: '🎯'
        }
      ]
    },

    // Section 3: Story (The Setup, The Challenge, The Battle)
    {
      id: 'section-story',
      type: 'story',
      title: 'The Story',
      icon: '📖',
      navIndex: 3,
      layers: {
        core: {
          content: `
            <!-- Story Section 1: The Setup -->
            <section class="p-8 md:p-12 bg-white" id="section-1">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <span id="progress-section1" class="progress-check">⬜</span>
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">The Setup</h2>
                </div>

                <!-- Audio Controls -->
                <div class="flex flex-wrap gap-2 mb-6">
                  <button onclick="toggleSectionAudio(this, 'section-1')" class="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition">
                    🔊 Listen
                  </button>
                  <button onclick="readAloudWithWordHighlight(this, 'section-1')" class="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition flex items-center gap-2">
                    <span>🎙️</span><span>Read Aloud</span>
                  </button>
                </div>

                <div class="story-text space-y-4 text-gray-700 leading-relaxed">
                  <p>The playground was loud. Not fun-loud. More like storm-loud. Static before lightning.</p>
                  <p>Lee stood near the basketball courts, notebook in hand, watching everything like always. Today felt different though. Today felt like something was about to happen.</p>
                  <p>And then it did.</p>
                </div>

                <!-- Story Image -->
                <img src="Gemini_Generated_Image_cuhlvucuhlvucuhl.png" alt="Playground setting" class="media-container rounded-lg mt-6 w-full">
              </div>
            </section>

            <!-- Story Section 2: The Challenge -->
            <section class="p-8 md:p-12 bg-slate-50" id="section-2">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <span id="progress-section2" class="progress-check">⬜</span>
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">The Challenge</h2>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                  <button onclick="toggleSectionAudio(this, 'section-2')" class="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition">
                    🔊 Listen
                  </button>
                  <button onclick="readAloudWithWordHighlight(this, 'section-2')" class="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition flex items-center gap-2">
                    <span>🎙️</span><span>Read Aloud</span>
                  </button>
                </div>

                <div class="story-text space-y-4 text-gray-700 leading-relaxed">
                  <p>Jayden stepped up to Tee, chest out, voice carrying across the whole yard.</p>

                  <div class="speech-bubble jayden bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-4">
                    <p class="font-bold text-red-700">Jayden:</p>
                    <p class="italic">"Yo Tee! You think you all that, but you NEVER win at anything. Not basketball. Not debates. Not nothing. You're just loud."</p>
                  </div>

                  <p>The crowd went "Oooooh."</p>
                  <p>Lee's pen froze mid-note. This wasn't just trash talk. This was a <span class="vocab-word" onclick="showVocab('claim')">claim</span>. And Jayden looked ready to prove it.</p>
                </div>

                <div class="grid md:grid-cols-2 gap-4 mt-6">
                  <img src="Gemini_Generated_Image_ktkt54ktkt54ktkt.png" alt="Jayden challenging" class="media-container rounded-lg">
                  <img src="Gemini_Generated_Image_k7tn0nk7tn0nk7tn.png" alt="Battle circle" class="media-container rounded-lg">
                </div>
              </div>
            </section>

            <!-- Story Section 3: The Battle -->
            <section class="p-8 md:p-12 bg-white" id="section-3">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <span id="progress-section3" class="progress-check">⬜</span>
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">The Battle</h2>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                  <button onclick="toggleSectionAudio(this, 'section-3')" class="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition">
                    🔊 Listen
                  </button>
                </div>

                <div class="story-text space-y-4 text-gray-700 leading-relaxed">
                  <p>But Tee? Tee didn't flinch. He just smiled and said:</p>

                  <div class="speech-bubble tee bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-4">
                    <p class="font-bold text-amber-700">Tee:</p>
                    <p class="italic">"Hold up. You said I never win at ANYTHING? Let's check the facts."</p>
                  </div>

                  <p>Tee pulled out his phone and showed a screenshot from the school's digital attendance board.</p>

                  <div class="speech-bubble tee bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-4">
                    <p class="font-bold text-amber-700">Tee:</p>
                    <p class="italic">"Ms. R checked attendance this morning. I been on-time ALL quarter. That's a WIN. Every. Single. Day."</p>
                  </div>

                  <p>The crowd murmured. Lee started writing faster.</p>

                  <p>Tee continued:</p>

                  <div class="speech-bubble tee bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-4">
                    <p class="font-bold text-amber-700">Tee:</p>
                    <p class="italic">"And last month? I won the class spelling bee. Mrs. Jackson announced it in front of everyone. You were there."</p>
                  </div>

                  <p>Jayden's face changed. The confidence was cracking.</p>
                </div>

                <img src="Gemini_Generated_Image_v6x547v6x547v6x5.png" alt="Tee and Lee talking" class="media-container rounded-lg mt-6 w-full">
              </div>
            </section>
          `
        },
        media: {
          content: `
            <!-- Video: Jayden's Rap -->
            <div class="bg-gray-900 rounded-lg overflow-hidden mt-6">
              <video controls playsinline preload="metadata" class="w-full">
                <source src="jayden's_rap.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          `
        },
        checks: {
          content: `
            <!-- Comprehension Check 1 -->
            <div class="bg-blue-50 p-6 rounded-xl mt-8">
              <h3 class="font-bold text-blue-800 mb-4">📝 Quick Check</h3>
              <p class="text-gray-700 mb-4">What did Jayden claim about Tee?</p>
              <div class="space-y-2">
                <button class="quiz-option w-full text-left p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition"
                        onclick="checkAnswer(this, true, 'comp1')">
                  A) Tee never wins at anything
                </button>
                <button class="quiz-option w-full text-left p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition"
                        onclick="checkAnswer(this, false, 'comp1')">
                  B) Tee is bad at basketball
                </button>
                <button class="quiz-option w-full text-left p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition"
                        onclick="checkAnswer(this, false, 'comp1')">
                  C) Tee is always late
                </button>
              </div>
              <p id="comp1-feedback" class="text-green-600 mt-3 hidden">✓ Correct! Jayden claimed Tee never wins at anything.</p>
            </div>
          `
        }
      },
      activities: [
        {
          id: 'comp-check-1',
          type: 'comprehension-quiz',
          progressKey: 'section1',
          points: 0
        }
      ]
    },

    // Section 4: Tee's 4-Step Strategy
    {
      id: 'section-strategy',
      type: 'strategy',
      title: "Tee's 4-Step Strategy",
      icon: '🧭',
      navIndex: 4,
      layers: {
        core: {
          content: `
            <section class="p-8 md:p-12 bg-gradient-to-b from-purple-50 to-white" id="section-4">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <span id="progress-drag" class="progress-check">⬜</span>
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">Tee's 4-Step Strategy</h2>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h3 class="font-bold text-purple-700 mb-4">🎤 How Tee Countered Jayden</h3>
                  <ol class="space-y-3">
                    <li class="flex items-start gap-3">
                      <span class="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full">1</span>
                      <span><strong>State what they said:</strong> "You said I never win at anything."</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full">2</span>
                      <span><strong>Bring your evidence:</strong> "Ms. R's attendance record shows I've been on-time all quarter."</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full">3</span>
                      <span><strong>Explain why they're wrong:</strong> "Being on-time every day IS a win."</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full">4</span>
                      <span><strong>Drop your conclusion:</strong> "So actually, I WIN every day."</span>
                    </li>
                  </ol>
                </div>

                <!-- Drag and Drop Activity -->
                <div class="bg-amber-50 p-6 rounded-xl">
                  <h3 class="font-bold text-amber-800 mb-4">🎯 Drag to Match: Put Tee's strategy in order!</h3>

                  <div class="grid md:grid-cols-2 gap-8">
                    <!-- Drag Items -->
                    <div class="space-y-3">
                      <p class="text-sm text-gray-600 mb-2">Drag these to the correct step:</p>
                      <div class="rap-line p-3 bg-white rounded-lg cursor-move border-2 border-amber-200" draggable="true" data-step="2">
                        📄 "Ms. R's attendance shows..."
                      </div>
                      <div class="rap-line p-3 bg-white rounded-lg cursor-move border-2 border-amber-200" draggable="true" data-step="4">
                        🎤 "So actually, I WIN every day."
                      </div>
                      <div class="rap-line p-3 bg-white rounded-lg cursor-move border-2 border-amber-200" draggable="true" data-step="1">
                        💬 "You said I never win..."
                      </div>
                      <div class="rap-line p-3 bg-white rounded-lg cursor-move border-2 border-amber-200" draggable="true" data-step="3">
                        🧠 "Being on-time IS a win."
                      </div>
                    </div>

                    <!-- Drop Zones -->
                    <div class="space-y-3">
                      <div class="drop-zone p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[50px] flex items-center justify-center text-gray-400"
                           data-target="1" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
                        Step 1: State what they said
                      </div>
                      <div class="drop-zone p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[50px] flex items-center justify-center text-gray-400"
                           data-target="2" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
                        Step 2: Bring evidence
                      </div>
                      <div class="drop-zone p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[50px] flex items-center justify-center text-gray-400"
                           data-target="3" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
                        Step 3: Explain why wrong
                      </div>
                      <div class="drop-zone p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[50px] flex items-center justify-center text-gray-400"
                           data-target="4" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
                        Step 4: Drop conclusion
                      </div>
                    </div>
                  </div>

                  <div id="strategyFeedback" class="mt-4 p-4 bg-green-100 rounded-lg hidden">
                    <p class="text-green-800 font-bold">🎉 You mastered Tee's 4-Step Strategy!</p>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      activities: [
        {
          id: 'drag-drop-strategy',
          type: 'drag-drop',
          progressKey: 'drag',
          points: 25,
          badge: '🎤'
        }
      ]
    },

    // Section 5: Lee's Essay Model
    {
      id: 'section-essay-model',
      type: 'essay-model',
      title: "Lee's Essay Model",
      icon: '✍️',
      navIndex: 5,
      layers: {
        core: {
          content: `
            <section class="p-8 md:p-12 bg-gradient-to-b from-amber-50 to-white" id="section-aha">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">Lee's "Aha!" Moment</h2>
                </div>

                <div class="story-text space-y-4 text-gray-700 leading-relaxed mb-8">
                  <p>Lee watched the whole thing unfold and started writing in their notebook:</p>
                </div>

                <!-- Lee's Notebook -->
                <div class="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-xl shadow-md transform -rotate-1">
                  <div class="flex items-center gap-3 mb-4">
                    <img src="Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png" alt="Lee's notebook" class="w-12 h-12 rounded-full">
                    <h3 class="font-display text-xl font-bold text-purple-700">📓 Lee's Notebook</h3>
                  </div>

                  <div class="space-y-4 font-mono text-sm">
                    <p class="border-b border-yellow-300 pb-2">
                      <span class="bg-purple-100 px-2 py-1 rounded text-purple-700 font-bold">Step 1</span>
                      Jayden claimed that Tee "never wins at anything."
                    </p>
                    <p class="border-b border-yellow-300 pb-2">
                      <span class="bg-purple-100 px-2 py-1 rounded text-purple-700 font-bold">Step 2</span>
                      Tee's evidence: Ms. R's attendance record showing perfect attendance all quarter.
                    </p>
                    <p class="border-b border-yellow-300 pb-2">
                      <span class="bg-purple-100 px-2 py-1 rounded text-purple-700 font-bold">Step 3</span>
                      Being on-time every single day IS winning - it takes discipline and effort.
                    </p>
                    <p>
                      <span class="bg-purple-100 px-2 py-1 rounded text-purple-700 font-bold">Step 4</span>
                      Conclusion: Tee DOES win. He wins every day just by showing up on time.
                    </p>
                  </div>

                  <div class="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                    <p class="text-yellow-800 text-sm italic">💡 Note to self: "Loud is not the same as true. Evidence beats volume."</p>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      }
    },

    // Section 6: Your Turn to Write
    {
      id: 'section-writing',
      type: 'writing',
      title: 'Your Turn to Write',
      icon: '📝',
      navIndex: 6,
      layers: {
        core: {
          content: `
            <section class="p-8 md:p-12 bg-slate-50" id="section-essay">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <span id="progress-essay" class="progress-check">⬜</span>
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">Your Turn: Counter an Argument</h2>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
                  <h3 class="font-bold text-gray-800 mb-4">📝 The Scenario:</h3>
                  <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <p class="text-gray-700 italic">
                      "Video games are a waste of time. Kids who play them never do anything productive."
                    </p>
                    <p class="text-sm text-gray-500 mt-2">— A parent at a school meeting</p>
                  </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                  <h3 class="font-bold text-gray-800 mb-4">✍️ Write Your Counter-Argument:</h3>
                  <p class="text-gray-600 mb-4">Use Tee's 4-Step Strategy to write back!</p>

                  <textarea id="studentResponse" rows="8" class="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                            placeholder="Step 1: They said that...&#10;Step 2: My evidence shows...&#10;Step 3: This is wrong because...&#10;Step 4: In conclusion..."
                            oninput="updateRubric()"></textarea>

                  <div class="flex flex-wrap gap-3 mt-4">
                    <button onclick="startDictation(this)" class="speech-btn">
                      🎤 Speak Answer
                    </button>
                    <button onclick="saveResponse()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                      💾 Save
                    </button>
                    <button onclick="shareResponse()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      🤝 Share with Partner
                    </button>
                  </div>

                  <!-- Rubric -->
                  <div class="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h4 class="font-bold text-purple-700 mb-3">📋 Self-Check Rubric:</h4>
                    <div class="space-y-2">
                      <div id="rubric1" class="rubric-item flex items-center gap-2 p-2 rounded hover:bg-purple-100">
                        <input type="checkbox" class="w-5 h-5">
                        <span>I stated what they said</span>
                      </div>
                      <div id="rubric2" class="rubric-item flex items-center gap-2 p-2 rounded hover:bg-purple-100">
                        <input type="checkbox" class="w-5 h-5">
                        <span>I included evidence</span>
                      </div>
                      <div id="rubric3" class="rubric-item flex items-center gap-2 p-2 rounded hover:bg-purple-100">
                        <input type="checkbox" class="w-5 h-5">
                        <span>I explained why they're wrong</span>
                      </div>
                      <div id="rubric4" class="rubric-item flex items-center gap-2 p-2 rounded hover:bg-purple-100">
                        <input type="checkbox" class="w-5 h-5">
                        <span>I gave a conclusion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        },
        supports: {
          content: `
            <!-- Helper Buttons -->
            <div class="flex justify-center gap-4 mt-6">
              <button onclick="openHelper('lee')" class="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition">
                📓 Lee's Tips
              </button>
              <button onclick="openHelper('tee')" class="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition">
                🎤 Tee's Check
              </button>
            </div>
          `
        }
      },
      activities: [
        {
          id: 'open-response',
          type: 'open-response',
          progressKey: 'essay',
          points: 30,
          badge: '✍️'
        }
      ]
    },

    // Section 7: Reflect & Celebrate
    {
      id: 'section-reflect',
      type: 'reflection',
      title: 'Reflect & Celebrate',
      icon: '💭',
      navIndex: 7,
      layers: {
        core: {
          content: `
            <section class="p-8 md:p-12 bg-gradient-to-b from-blue-50 to-purple-50" id="section-reflect">
              <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                  <span id="progress-reflect" class="progress-check">⬜</span>
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800">Reflect & Celebrate</h2>
                </div>

                <!-- Reflection Questions -->
                <div class="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h3 class="font-bold text-gray-800 mb-4">💭 Think About It:</h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-gray-700 mb-2">What did you learn about counter-arguments today?</label>
                      <textarea class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none" rows="3"
                                placeholder="I learned that..."></textarea>
                      <button onclick="startDictation(this)" class="mt-2 text-sm text-purple-600 hover:text-purple-800">
                        🎤 Speak Answer
                      </button>
                    </div>

                    <div>
                      <label class="block text-gray-700 mb-2">When might you use Tee's 4-Step Strategy in real life?</label>
                      <textarea class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none" rows="3"
                                placeholder="I could use this when..."></textarea>
                    </div>
                  </div>
                </div>

                <!-- Celebration -->
                <div class="bg-gradient-to-r from-purple-500 to-amber-500 p-8 rounded-xl text-white text-center">
                  <div class="text-6xl mb-4">🎉</div>
                  <h3 class="font-display text-2xl font-bold mb-2">Episode Complete!</h3>
                  <p class="text-lg opacity-90 mb-4">You've mastered the art of the counter-argument!</p>

                  <div class="flex justify-center gap-4 mb-6">
                    <div class="bg-white/20 px-4 py-2 rounded-full">
                      <span class="font-bold" id="finalPoints">0</span> Points
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-full">
                      Badges: <span id="finalBadges"></span>
                    </div>
                  </div>

                  <a href="episode2.html" class="inline-block bg-white text-purple-700 font-bold py-3 px-6 rounded-full hover:bg-purple-100 transition">
                    Continue to Episode 2 →
                  </a>
                </div>
              </div>
            </section>
          `
        }
      },
      activities: [
        {
          id: 'reflection',
          type: 'reflection',
          progressKey: 'reflect',
          points: 0
        }
      ]
    }
  ]
};

// Export for use in shell page
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { episode1Config };
}
