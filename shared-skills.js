/**
 * Lee & Tee Book 1 - Skills Growth Visualizer
 *
 * Tracks and visualizes skill development across episodes
 * Uses evidence-based measurement: auto-checks, task completion, self-rating
 */

// ===== SKILL DEFINITIONS BY EPISODE =====

const EPISODE_SKILLS = {
  1: [ // Episode 1: The Recess Battle (ELA)
    {
      id: 'claim-recognition',
      name: 'Recognizing Claims',
      description: 'I can identify the main claim in an argument',
      autoCheck: ['vocab-claim', 'quiz-structure'],
      keyTasks: ['progress-section6']
    },
    {
      id: 'evidence-support',
      name: 'Finding Evidence',
      description: 'I can find evidence that supports a claim',
      autoCheck: ['vocab-evidence', 'quiz-evidence'],
      keyTasks: ['progress-section10']
    },
    {
      id: 'argument-structure',
      name: 'Argument Structure',
      description: 'I understand how to build a strong argument',
      autoCheck: ['quiz-structure', 'quiz-complete'],
      keyTasks: ['progress-section14']
    },
    {
      id: 'reading-comprehension',
      name: 'Reading Comprehension',
      description: 'I can understand and remember what I read',
      autoCheck: ['vocab-complete'],
      keyTasks: ['progress-section18']
    }
  ],
  2: [ // Episode 2: Grandpa's Kitchen (Math)
    {
      id: 'ratio-understanding',
      name: 'Understanding Ratios',
      description: 'I can recognize and work with ratios',
      autoCheck: ['vocab-ratio', 'quiz-ratio'],
      keyTasks: ['progress-section6']
    },
    {
      id: 'scaling-calculations',
      name: 'Scaling Calculations',
      description: 'I can multiply and divide to scale recipes',
      autoCheck: ['calculator-correct', 'quiz-scaling'],
      keyTasks: ['progress-section9']
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      description: 'I can break down complex problems into steps',
      autoCheck: ['quiz-complete'],
      keyTasks: ['progress-section12']
    },
    {
      id: 'real-world-math',
      name: 'Real-World Math',
      description: 'I can apply math to everyday situations',
      autoCheck: ['reflection-complete'],
      keyTasks: ['progress-section15']
    }
  ],
  3: [ // Episode 3: The Dinner Table (Social Studies)
    {
      id: 'perspective-taking',
      name: 'Perspective Taking',
      description: 'I can understand different viewpoints',
      autoCheck: ['vocab-perspective', 'quiz-perspective'],
      keyTasks: ['progress-section8']
    },
    {
      id: 'evidence-analysis',
      name: 'Analyzing Evidence',
      description: 'I can evaluate sources and evidence',
      autoCheck: ['vocab-evidence', 'quiz-evidence'],
      keyTasks: ['progress-section12']
    },
    {
      id: 'complexity-thinking',
      name: 'Complex Thinking',
      description: 'I can see that issues have multiple sides',
      autoCheck: ['quiz-complete'],
      keyTasks: ['progress-section15']
    },
    {
      id: 'respectful-disagreement',
      name: 'Respectful Discussion',
      description: 'I can disagree respectfully with others',
      autoCheck: ['reflection-complete'],
      keyTasks: ['progress-section18']
    }
  ],
  4: [ // Episode 4: The Nighttime Question (Science)
    {
      id: 'observation-skills',
      name: 'Making Observations',
      description: 'I can notice patterns and details carefully',
      autoCheck: ['vocab-observation', 'quiz-method'],
      keyTasks: ['progress-section4']
    },
    {
      id: 'hypothesis-forming',
      name: 'Forming Hypotheses',
      description: 'I can make testable predictions',
      autoCheck: ['vocab-hypothesis', 'hypothesis-built'],
      keyTasks: ['progress-section7']
    },
    {
      id: 'scientific-method',
      name: 'Scientific Method',
      description: 'I can follow the scientific process',
      autoCheck: ['quiz-method', 'quiz-complete'],
      keyTasks: ['progress-section9']
    },
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition',
      description: 'I can see connections across different subjects',
      autoCheck: ['pattern-complete', 'capstone-complete'],
      keyTasks: ['progress-section8']
    },
    {
      id: 'critical-thinking',
      name: 'Critical Thinking',
      description: 'I can apply structured thinking to any problem',
      autoCheck: ['capstone-complete'],
      keyTasks: ['progress-section12']
    }
  ]
};

// ===== SKILL TRACKING STATE =====

function getSkillState(episodeNum) {
  const stateKey = `episode${episodeNum}SkillState`;
  const saved = localStorage.getItem(stateKey);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load skill state:', e);
    }
  }

  // Initialize skill state
  const skills = EPISODE_SKILLS[episodeNum];
  const state = {};

  skills.forEach(skill => {
    state[skill.id] = {
      autoCheckComplete: [],
      keyTasksComplete: [],
      selfRating: 0
    };
  });

  return state;
}

function saveSkillState(episodeNum, state) {
  const stateKey = `episode${episodeNum}SkillState`;
  localStorage.setItem(stateKey, JSON.stringify(state));
}

// ===== SKILL TRACKING FUNCTIONS =====

// Mark auto-check item complete
function markAutoCheckComplete(episodeNum, checkId) {
  const state = getSkillState(episodeNum);
  const skills = EPISODE_SKILLS[episodeNum];

  skills.forEach(skill => {
    if (skill.autoCheck.includes(checkId)) {
      if (!state[skill.id].autoCheckComplete.includes(checkId)) {
        state[skill.id].autoCheckComplete.push(checkId);
      }
    }
  });

  saveSkillState(episodeNum, state);
  updateSkillsDisplay(episodeNum);
}

// Mark key task complete
function markKeyTaskComplete(episodeNum, taskId) {
  const state = getSkillState(episodeNum);
  const skills = EPISODE_SKILLS[episodeNum];

  skills.forEach(skill => {
    if (skill.keyTasks.includes(taskId)) {
      if (!state[skill.id].keyTasksComplete.includes(taskId)) {
        state[skill.id].keyTasksComplete.push(taskId);
      }
    }
  });

  saveSkillState(episodeNum, state);
  updateSkillsDisplay(episodeNum);
}

// Set self-rating for a skill
function setSkillSelfRating(episodeNum, skillId, rating) {
  const state = getSkillState(episodeNum);
  state[skillId].selfRating = rating;
  saveSkillState(episodeNum, state);
  updateSkillsDisplay(episodeNum);
}

// Calculate skill progress (0-100)
function calculateSkillProgress(episodeNum, skillId) {
  const state = getSkillState(episodeNum);
  const skills = EPISODE_SKILLS[episodeNum];
  const skill = skills.find(s => s.id === skillId);

  if (!skill) return 0;

  const skillState = state[skillId];

  // Auto-checks: 40% weight
  const autoCheckProgress = (skillState.autoCheckComplete.length / skill.autoCheck.length) * 40;

  // Key tasks: 40% weight
  const keyTaskProgress = (skillState.keyTasksComplete.length / skill.keyTasks.length) * 40;

  // Self-rating: 20% weight
  const selfRatingProgress = (skillState.selfRating / 5) * 20;

  const total = Math.round(autoCheckProgress + keyTaskProgress + selfRatingProgress);
  return Math.min(100, Math.max(0, total));
}

// ===== SKILL VISUALIZATION =====

function renderSkillsVisualizer(episodeNum, containerId = 'skills-visualizer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const skills = EPISODE_SKILLS[episodeNum];
  const state = getSkillState(episodeNum);

  const html = `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">📊 Your Skills Growth</h2>
        <p class="text-gray-600 text-sm">See how much you've learned in this episode!</p>
      </div>

      <div class="space-y-6">
        ${skills.map(skill => {
          const progress = calculateSkillProgress(episodeNum, skill.id);
          const skillState = state[skill.id];

          return `
            <div class="border border-gray-200 rounded-lg p-4">
              <!-- Skill Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800 mb-1">${skill.name}</h3>
                  <p class="text-sm text-gray-600">${skill.description}</p>
                </div>
                <div class="ml-4 text-right">
                  <div class="text-2xl font-bold text-gray-800">${progress}%</div>
                  <div class="text-xs text-gray-500">Progress</div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 rounded-full"
                       style="width: ${progress}%"></div>
                </div>
              </div>

              <!-- Evidence Breakdown -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-xs">
                <!-- Auto-checks -->
                <div class="bg-blue-50 rounded p-2">
                  <div class="font-semibold text-blue-700 mb-1">✓ Auto-checks</div>
                  <div class="text-blue-600">
                    ${skillState.autoCheckComplete.length} / ${skill.autoCheck.length} complete
                  </div>
                </div>

                <!-- Key Tasks -->
                <div class="bg-purple-50 rounded p-2">
                  <div class="font-semibold text-purple-700 mb-1">📝 Key Tasks</div>
                  <div class="text-purple-600">
                    ${skillState.keyTasksComplete.length} / ${skill.keyTasks.length} complete
                  </div>
                </div>

                <!-- Self-rating -->
                <div class="bg-amber-50 rounded p-2">
                  <div class="font-semibold text-amber-700 mb-1">⭐ Self-rating</div>
                  <div class="text-amber-600">
                    ${skillState.selfRating} / 5 stars
                  </div>
                </div>
              </div>

              <!-- Self-Rating Widget -->
              <div class="border-t border-gray-200 pt-3">
                <div class="text-sm text-gray-600 mb-2">How confident do you feel?</div>
                <div class="flex gap-2">
                  ${[1, 2, 3, 4, 5].map(rating => `
                    <button onclick="setSkillSelfRating(${episodeNum}, '${skill.id}', ${rating})"
                            class="w-10 h-10 rounded-lg transition-all ${
                              skillState.selfRating >= rating
                                ? 'bg-amber-400 text-white scale-110'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }">
                      ⭐
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Overall Summary -->
      <div class="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
        <div class="text-center">
          <div class="text-lg font-bold text-gray-800 mb-2">Overall Episode Progress</div>
          <div class="text-4xl font-bold text-purple-700">
            ${calculateOverallProgress(episodeNum)}%
          </div>
          <div class="text-sm text-gray-600 mt-1">
            Average across all skills
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function calculateOverallProgress(episodeNum) {
  const skills = EPISODE_SKILLS[episodeNum];
  const total = skills.reduce((sum, skill) => {
    return sum + calculateSkillProgress(episodeNum, skill.id);
  }, 0);

  return Math.round(total / skills.length);
}

function updateSkillsDisplay(episodeNum) {
  renderSkillsVisualizer(episodeNum);
}

// ===== INTEGRATION HELPERS =====

// Call this when a vocabulary word is learned
function onVocabLearned(episodeNum, vocabId) {
  markAutoCheckComplete(episodeNum, `vocab-${vocabId}`);
}

// Call this when a quiz question is answered correctly
function onQuizCorrect(episodeNum, quizId) {
  markAutoCheckComplete(episodeNum, `quiz-${quizId}`);
}

// Call this when a major section/activity is completed
function onSectionComplete(episodeNum, sectionId) {
  markKeyTaskComplete(episodeNum, sectionId);
}

// Call this when a special activity is completed (calculator, hypothesis builder, etc.)
function onActivityComplete(episodeNum, activityId) {
  markAutoCheckComplete(episodeNum, activityId);
}

// ===== EXPORT FUNCTIONS =====

if (typeof window !== 'undefined') {
  window.getSkillState = getSkillState;
  window.saveSkillState = saveSkillState;
  window.markAutoCheckComplete = markAutoCheckComplete;
  window.markKeyTaskComplete = markKeyTaskComplete;
  window.setSkillSelfRating = setSkillSelfRating;
  window.calculateSkillProgress = calculateSkillProgress;
  window.renderSkillsVisualizer = renderSkillsVisualizer;
  window.updateSkillsDisplay = updateSkillsDisplay;
  window.onVocabLearned = onVocabLearned;
  window.onQuizCorrect = onQuizCorrect;
  window.onSectionComplete = onSectionComplete;
  window.onActivityComplete = onActivityComplete;
  window.EPISODE_SKILLS = EPISODE_SKILLS;
}
