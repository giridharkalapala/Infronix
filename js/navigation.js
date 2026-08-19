/**
 * TRYSOL GLOBAL SERVICES - NAVIGATION & HEADER CONTROLLER
 * Handles Sticky Glassmorphism Header, Mobile Drawer Menu, and Route Highlights
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  highlightActiveNav();
});

/**
 * 1. Sticky Glassmorphism Header
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * 2. Mobile Hamburger & Slide-in Drawer Menu
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const closeBtns = document.querySelectorAll('.mobile-nav-close-btn, [data-close-nav]');

  if (!hamburger || !drawer) return;

  function openMenu() {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', closeMenu);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Small delay to allow visual click feedback before close
      setTimeout(closeMenu, 120);
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Clean up if resized back to desktop (> 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  }, { passive: true });
}

/**
 * 3. Highlight Current Active Route in Header
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const cleanHref = href.replace('./', '').replace('../', '').replace('/', '').toLowerCase();
    const cleanCurrent = currentPath.split('/').pop() || 'index.html';

    if (cleanHref === cleanCurrent || (cleanHref === 'index.html' && (cleanCurrent === '' || cleanCurrent === '/'))) {
      link.classList.add('active');
    }
  });
}

