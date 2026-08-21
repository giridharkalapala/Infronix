/**
 * infronix GLOBAL SERVICES - NAVIGATION & HEADER CONTROLLER
 * Handles Sticky Glassmorphism Header, Mobile Drawer Menu, Dropdown Accordions, and Route Highlights
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initMobileDropdowns();
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
  const navLinks = document.querySelectorAll('.mobile-nav-drawer a');
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
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  // Close drawer on any navigation link click (with a brief delay for tactile feedback)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
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
 * 3. Mobile Navigation Dropdown & Sub-Dropdown Accordions
 */
function initMobileDropdowns() {
  // Level 1 Dropdowns (e.g. Services)
  const dropdownContainers = document.querySelectorAll('.mobile-nav-dropdown');
  dropdownContainers.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector('.mobile-nav-dropdown-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Level 2 Sub-Dropdowns (e.g. Product & App Engineering sub-services)
  const subDropdownContainers = document.querySelectorAll('.mobile-nav-subdropdown');
  subDropdownContainers.forEach((subDropdown) => {
    const toggleBtn = subDropdown.querySelector('.mobile-nav-subdropdown-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = subDropdown.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}

/**
 * 4. Highlight Current Active Route in Header & Mobile Nav
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const currentFile = currentPath.split('/').filter(Boolean).pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .mobile-nav-sublink, .mobile-nav-nested-link, .subdropdown-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.split('/').filter(Boolean).pop()?.toLowerCase();

    if (linkFile && (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // Auto-expand mobile subdropdowns if any child nested link is active
  document.querySelectorAll('.mobile-nav-subdropdown').forEach((subDropdown) => {
    const hasActiveChild = subDropdown.querySelector('.mobile-nav-nested-link.active, .mobile-nav-sublink.active');
    if (hasActiveChild) {
      subDropdown.classList.add('is-open');
      const toggleBtn = subDropdown.querySelector('.mobile-nav-subdropdown-btn');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Auto-expand main mobile dropdowns if any child link is active
  document.querySelectorAll('.mobile-nav-dropdown').forEach((dropdown) => {
    const hasActiveChild = dropdown.querySelector('.mobile-nav-sublink.active, .mobile-nav-nested-link.active, .mobile-nav-link.active');
    if (hasActiveChild) {
      dropdown.classList.add('is-open');
      const toggleBtn = dropdown.querySelector('.mobile-nav-dropdown-btn');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });
}
