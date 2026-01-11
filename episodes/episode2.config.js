/**
 * Episode 2 Configuration: Grandpa's Kitchen
 *
 * Subject: Math
 * Theme: Fractions and Proportional Reasoning
 *
 * STATUS: STUB - Content not yet implemented
 * Wait for engine parity confirmation before adding content.
 */

const episode2Config = {
  id: 2,
  title: "Lee & Tee Episode 2: Grandpa's Kitchen",
  subtitle: 'Learning fractions through cooking',
  subject: 'Math',
  color: '#F59E0B',

  // Standard alignment
  standard: {
    code: 'CCSS.MATH.4.NF.B.3',
    label: 'Understand fractions as a sum of unit fractions'
  },

  // Learning objectives
  objectives: {
    language: 'Students will explain fraction operations using cooking vocabulary.',
    content: 'Students will add and subtract fractions with like denominators.'
  },

  // Progress tracking items
  progressItems: [
    { id: 'sel', label: 'Check-In' },
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'section1', label: 'The Setup' },
    { id: 'section2', label: 'The Challenge' },
    { id: 'section3', label: 'The Solution' },
    { id: 'practice', label: 'Practice' },
    { id: 'reflect', label: 'Reflection' }
  ],

  // Vocabulary definitions (placeholder)
  vocabulary: {
    numerator: {
      word: 'Numerator',
      def: 'The top number in a fraction. It tells you how many parts you have.',
      example: 'In 3/4, the numerator is 3.',
      spanish: 'En español: numerador',
      image: '🔢'
    },
    denominator: {
      word: 'Denominator',
      def: 'The bottom number in a fraction. It tells you how many equal parts make up the whole.',
      example: 'In 3/4, the denominator is 4.',
      spanish: 'En español: denominador',
      image: '📊'
    },
    equivalent: {
      word: 'Equivalent',
      def: 'Fractions that represent the same amount, even if they look different.',
      example: '1/2 and 2/4 are equivalent fractions.',
      spanish: 'En español: equivalente',
      image: '='
    }
  },

  // Media assets (placeholder)
  media: {
    header: 'header.png',
    leeAvatar: 'Gemini_Generated_Image_8qgtlc8qgtlc8qgt.png',
    teeAvatar: 'Gemini_Generated_Image_bvzywpbvzywpbvzy.png'
    // Additional media TBD
  },

  // Section configurations (placeholder structure)
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
            <section class="p-8 md:p-12 bg-gradient-to-b from-blue-50 to-white">
              <div class="max-w-4xl mx-auto text-center">
                <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  Episode 2 Coming Soon
                </h2>
                <p class="text-gray-600 mb-4">
                  This episode is under development. Please wait for engine parity confirmation.
                </p>
                <div class="text-6xl mb-4">🚧</div>
                <a href="episode.html?ep=1" class="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                  ← Back to Episode 1
                </a>
              </div>
            </section>
          `
        }
      },
      activities: []
    }

    // Additional sections TBD
    // {
    //   id: 'section-vocab',
    //   type: 'vocabulary',
    //   title: 'Vocabulary',
    //   icon: '📚',
    //   navIndex: 2,
    //   layers: { core: { content: '' } },
    //   activities: []
    // },
    // {
    //   id: 'section-story',
    //   type: 'story',
    //   title: 'The Story',
    //   icon: '📖',
    //   navIndex: 3,
    //   layers: { core: { content: '' } },
    //   activities: []
    // },
    // ... more sections
  ]
};

// Export for use in shell page
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { episode2Config };
}
