(function () {
  const EPISODE_TOTALS = {
    1: 18,
    2: 15,
    3: 18,
    4: 12
  };

  const EPISODE_FILES = {
    1: 'episode1.html',
    2: 'episode2.html',
    3: 'episode3.html',
    4: 'episode4.html'
  };

  function readProgress() {
    const fallback = {
      points: 0,
      badges: [],
      completedActivities: [],
      currentEpisode: 1,
      currentSection: 1
    };

    // Prefer global in-memory state when available (shared-header.js)
    if (typeof globalLearningState !== 'undefined') {
      const badgeEmojiMap = {
        'first-episode': '🎯',
        'two-episodes': '📚',
        'hundred-points': '⭐',
        'book-complete': '🌟'
      };

      const completedActivities = [];
      if (globalLearningState.episodes) {
        Object.keys(globalLearningState.episodes).forEach(epNum => {
          const ep = globalLearningState.episodes[epNum];
          const sections = ep?.sectionsComplete || [];
          sections.forEach((sectionId, idx) => {
            const safeId = sectionId || `section-${idx + 1}`;
            completedActivities.push(`ep${epNum}-${safeId}`);
          });
        });
      }

      return {
        points: globalLearningState.totalPoints || 0,
        badges: (globalLearningState.badges || []).map(id => badgeEmojiMap[id] || '🏅'),
        completedActivities,
        currentEpisode: globalLearningState.currentEpisode || 1,
        currentSection: 1
      };
    }

    try {
      const saved = localStorage.getItem('leeTeeLessonProgress');
      if (!saved) return fallback;
      return { ...fallback, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Unable to read stored progress, using defaults.', e);
      return fallback;
    }
  }

  function normalizeCompletion(progress) {
    const completedActivities = progress.completedActivities || [];
    const perEpisode = { 1: 0, 2: 0, 3: 0, 4: 0 };

    completedActivities.forEach(id => {
      const match = id.match(/^ep(\d)/);
      if (match) {
        const ep = Number(match[1]);
        if (perEpisode[ep] !== undefined) perEpisode[ep] += 1;
      }
    });

    const episodePercents = {};
    Object.keys(EPISODE_TOTALS).forEach(num => {
      const n = Number(num);
      const total = EPISODE_TOTALS[n];
      const done = Math.min(perEpisode[n], total);
      const percent = total ? Math.round((done / total) * 100) : 0;
      episodePercents[n] = percent;
    });

    const totalSections = Object.values(EPISODE_TOTALS).reduce((a, b) => a + b, 0);
    const completedSections = Object.keys(EPISODE_TOTALS).reduce((sum, key) => {
      const epNum = Number(key);
      const total = EPISODE_TOTALS[epNum];
      return sum + Math.min(perEpisode[epNum], total);
    }, 0);

    const episodesComplete = Object.keys(EPISODE_TOTALS).filter(num => {
      const ep = Number(num);
      return perEpisode[ep] >= EPISODE_TOTALS[ep];
    }).length;

    return {
      perEpisodeCounts: perEpisode,
      perEpisodePercents: episodePercents,
      episodesComplete,
      bookPercent: totalSections ? Math.round((completedSections / totalSections) * 100) : 0
    };
  }

  function setFill(id, percent) {
    const el = document.getElementById(id);
    if (el) {
      el.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderBadges(progress) {
    const row = document.getElementById('learningShellBadges');
    if (!row) return;
    row.innerHTML = '';

    const recent = (progress.badges || []).slice(-3).reverse();
    const toRender = recent.length ? recent : ['🎯', '📚', '🏆'];

    toRender.forEach((emoji, index) => {
      const badge = document.createElement('span');
      badge.className = `learning-shell__badge${recent.length ? '' : ' placeholder'}`;
      badge.textContent = emoji;
      badge.setAttribute('aria-label', `Badge ${index + 1}: ${emoji}`);
      row.appendChild(badge);
    });
  }

  function renderDashboard() {
    const progress = readProgress();
    const completion = normalizeCompletion(progress);
    const activeEpisode = progress.currentEpisode || 1;

    document.body.classList.add('has-learning-shell');

    setText('learningShellBookLabel', `Book 1: ${completion.episodesComplete}/4 Episodes`);
    setText('learningShellBookPercent', `${completion.bookPercent}%`);
    setFill('learningShellBookFill', completion.bookPercent);

    setText('learningShellEpisodeTitle', `Episode ${activeEpisode}`);
    setText('learningShellEpisodeLabel', `${completion.perEpisodeCounts[activeEpisode] || 0}/${EPISODE_TOTALS[activeEpisode]} sections`);
    setFill('learningShellEpisodeFill', completion.perEpisodePercents[activeEpisode] || 0);

    renderBadges(progress);

    const continueBtn = document.getElementById('learningShellContinue');
    if (continueBtn) {
      continueBtn.onclick = (e) => {
        e.preventDefault();
        const destination = EPISODE_FILES[activeEpisode] || 'index.html';
        window.location.href = destination;
      };
    }
  }

  function attachToggle() {
    const shell = document.getElementById('learningShell');
    const toggle = document.getElementById('learningShellToggle');
    if (!shell || !toggle) return;

    toggle.addEventListener('click', () => {
      shell.classList.toggle('learning-shell--expanded');
      toggle.setAttribute('aria-expanded', shell.classList.contains('learning-shell--expanded'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    attachToggle();
  });

  window.LearningShell = {
    refresh: renderDashboard
  };
})();
