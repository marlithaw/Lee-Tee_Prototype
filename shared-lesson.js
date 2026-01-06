/**
 * Lee & Tee - Shared Lesson Functions
 * Common functions used across all episode lessons
 */

// ===== UTILITY FUNCTIONS =====

/**
 * Smooth scroll to element
 */
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Show badge earned notification
 */
function showBadgeNotification(badge) {
  const modal = document.createElement('div');
  modal.className = 'badge-modal';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 400px;
      text-align: center;
      animation: pulse 0.5s ease;
    ">
      <div style="font-size: 4rem; margin-bottom: 1rem;">${badge.icon}</div>
      <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; color: #7C3AED;">
        Badge Earned!
      </h3>
      <p style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">
        ${badge.name}
      </p>
      <p style="color: #6b7280; margin-bottom: 1.5rem;">
        ${badge.description}
      </p>
      <button onclick="this.closest('.badge-modal').remove()" style="
        background: #7C3AED;
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 600;
        cursor: pointer;
      ">
        Awesome!
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Auto-close after 5 seconds
  setTimeout(() => {
    if (modal.parentNode) {
      modal.remove();
    }
  }, 5000);
}

/**
 * Animate points change
 */
function animatePointsChange(pointsAdded) {
  const display = document.getElementById('points-display');
  if (!display) return;

  // Create floating +points indicator
  const floater = document.createElement('div');
  floater.textContent = `+${pointsAdded}`;
  floater.style.cssText = `
    position: fixed;
    top: 60px;
    right: 120px;
    color: #f59e0b;
    font-weight: bold;
    font-size: 1.5rem;
    z-index: 1000;
    animation: floatUp 1s ease forwards;
  `;

  document.body.appendChild(floater);

  setTimeout(() => floater.remove(), 1000);

  // Pulse the points display
  display.style.animation = 'pulse 0.5s ease';
  setTimeout(() => {
    display.style.animation = '';
  }, 500);
}

// Add floatUp animation to page
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-50px);
    }
  }
`;
document.head.appendChild(style);

/**
 * Toggle accessibility menu
 */
function toggleAccessibilityMenu() {
  let menu = document.getElementById('accessibility-menu');

  if (!menu) {
    menu = createAccessibilityMenu();
    document.body.appendChild(menu);
  } else {
    menu.remove();
  }
}

/**
 * Create accessibility menu
 */
function createAccessibilityMenu() {
  const menu = document.createElement('div');
  menu.id = 'accessibility-menu';
  menu.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    padding: 1rem;
    z-index: 1000;
    min-width: 200px;
  `;

  menu.innerHTML = `
    <h4 style="font-weight: bold; margin-bottom: 0.75rem;">Accessibility</h4>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="dyslexia-toggle" onchange="toggleDyslexiaMode(this.checked)">
        <span>Dyslexia-friendly font</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="contrast-toggle" onchange="toggleHighContrast(this.checked)">
        <span>High contrast</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="hints-toggle" onchange="toggleHints(this.checked)" checked>
        <span>Show hints</span>
      </label>
    </div>
  `;

  return menu;
}

/**
 * Toggle dyslexia mode
 */
function toggleDyslexiaMode(enabled) {
  if (enabled) {
    document.body.classList.add('dyslexia-mode');
  } else {
    document.body.classList.remove('dyslexia-mode');
  }

  // Save preference if state management exists
  if (typeof saveState === 'function') {
    saveState();
  }
}

/**
 * Toggle high contrast mode
 */
function toggleHighContrast(enabled) {
  if (enabled) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }

  // Save preference if state management exists
  if (typeof saveState === 'function') {
    saveState();
  }
}

/**
 * Toggle hints visibility
 */
function toggleHints(enabled) {
  const hints = document.querySelectorAll('.hint, .help-buttons');
  hints.forEach(hint => {
    hint.style.display = enabled ? '' : 'none';
  });

  // Save preference if state management exists
  if (typeof saveState === 'function') {
    saveState();
  }
}

/**
 * Close modal on outside click
 */
function closeOnOutsideClick(event, modalClass) {
  if (event.target.classList.contains(modalClass)) {
    event.target.remove();
  }
}

/**
 * Format date/time
 */
function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.scrollToElement = scrollToElement;
  window.scrollToTop = scrollToTop;
  window.showNotification = showNotification;
  window.showBadgeNotification = showBadgeNotification;
  window.animatePointsChange = animatePointsChange;
  window.toggleAccessibilityMenu = toggleAccessibilityMenu;
  window.toggleDyslexiaMode = toggleDyslexiaMode;
  window.toggleHighContrast = toggleHighContrast;
  window.toggleHints = toggleHints;
  window.closeOnOutsideClick = closeOnOutsideClick;
  window.formatDateTime = formatDateTime;
  window.debounce = debounce;
}
