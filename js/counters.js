/**
 * TRYSOL GLOBAL SERVICES - ANIMATED COUNTERS ENGINE
 * Uses IntersectionObserver to trigger smooth numeric animations on viewport entry
 */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
});

function initCounters() {
  const counterElements = document.querySelectorAll('.counter-value');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  counterElements.forEach((el) => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000; // ms
  let startTimestamp = null;

  if (isNaN(target)) return;

  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Ease Out Expo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentVal = Math.floor(easeProgress * target);

    element.textContent = `${prefix}${currentVal}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${target}${suffix}`;
    }
  }

  window.requestAnimationFrame(step);
}
