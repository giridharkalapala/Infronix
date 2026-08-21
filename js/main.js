/**
 * infronix GLOBAL SERVICES - MAIN JAVASCRIPT CONTROLLER
 * Handles Page Preloader, Top Scroll Progress, Back-to-Top, and Desktop Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initBackToTop();
  initCustomCursor();
});

/**
 * 1. Page Preloader
 */
function initPreloader() {
  const preloader = document.getElementById('page-preloader');
  const barFill = document.querySelector('.preloader-bar-fill');
  
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if (progress > 100) progress = 100;
    
    if (barFill) {
      barFill.style.width = `${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('is-loaded');
      }, 300);
    }
  }, 60);

  // Fallback timeout
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('is-loaded');
    }, 600);
  });
}

/**
 * 2. Top Scroll Progress Indicator
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });
}

/**
 * 3. Back To Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 4. Desktop Custom Cursor
 */
function initCustomCursor() {
  // Only activate for fine pointers (desktops/laptops)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.querySelector('.custom-cursor-dot');
  const aura = document.querySelector('.custom-cursor-aura');

  if (!dot || !aura) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  function renderAura() {
    auraX += (mouseX - auraX) * 0.18;
    auraY += (mouseY - auraY) * 0.18;
    aura.style.transform = `translate(${auraX}px, ${auraY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderAura);
  }
  requestAnimationFrame(renderAura);

  // Hover triggers for interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .service-card, .highlight-card, .portfolio-card, .industry-card, .gallery-item');
  
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      aura.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      aura.classList.remove('cursor-hover');
    });
  });
}
