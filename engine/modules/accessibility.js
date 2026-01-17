/**
 * Accessibility Module
 * Handles dyslexia mode, high contrast, SIOP strategies, and settings
 */

let siopStrategiesVisible = false;

/**
 * Toggle accessibility menu
 */
function toggleA11yMenu() {
  const menu = document.getElementById('a11yMenu');
  if (menu) menu.classList.toggle('open');
}

/**
 * Toggle accessibility setting
 */
function toggleSetting(setting) {
  const toggle = document.getElementById('toggle' + setting.charAt(0).toUpperCase() + setting.slice(1));
  if (toggle) toggle.classList.toggle('on');

  if (setting === 'dyslexia') {
    document.body.classList.toggle('dyslexia-mode');
  } else if (setting === 'contrast') {
    document.body.classList.toggle('high-contrast');
  } else if (setting === 'hints') {
    document.querySelectorAll('.hint-text').forEach(el => {
      el.style.display = toggle && toggle.classList.contains('on') ? 'block' : 'none';
    });
  }
}

/**
 * Toggle SIOP strategies visibility
 */
function toggleSiopStrategies() {
  const toggle = document.getElementById('toggleSiop');
  if (toggle) toggle.classList.toggle('on');

  siopStrategiesVisible = toggle && toggle.classList.contains('on');

  // Show/hide SIOP strategy indicators
  document.querySelectorAll('.siop-strategy').forEach(el => {
    el.style.display = siopStrategiesVisible ? 'inline-flex' : 'none';
  });
}

/**
 * Toggle SIOP modal
 */
function toggleSiopModal() {
  const modal = document.getElementById('siopModal');
  if (modal) modal.classList.toggle('open');
}

/**
 * Close SIOP modal
 */
function closeSiopModal(e) {
  if (e.target.classList.contains('helper-modal')) {
    const modal = document.getElementById('siopModal');
    if (modal) modal.classList.remove('open');
  }
}

/**
 * Show simplified text view
 */
function showSimplifiedText(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const storyText = section.querySelector('.story-text');
  if (!storyText) return;

  // Toggle between original and simplified
  if (storyText.dataset.original) {
    storyText.innerHTML = storyText.dataset.original;
    delete storyText.dataset.original;
  } else {
    // Save original and create simplified version
    storyText.dataset.original = storyText.innerHTML;

    // Simple text simplification
    let simplified = storyText.innerHTML
      .replace(/<strong>(.*?)<\/strong>/g, '<strong class="text-purple-700">$1</strong>')
      .replace(/<em>(.*?)<\/em>/g, '<em class="font-bold text-amber-700">$1</em>')
      .replace(/\.\s/g, '.<br><br>')
      .replace(/\,\s/g, ',<br>');

    storyText.innerHTML = simplified;
  }
}

// Export functions
window.toggleA11yMenu = toggleA11yMenu;
window.toggleSetting = toggleSetting;
window.toggleSiopStrategies = toggleSiopStrategies;
window.toggleSiopModal = toggleSiopModal;
window.closeSiopModal = closeSiopModal;
window.showSimplifiedText = showSimplifiedText;
