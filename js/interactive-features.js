/**
 * Infronix / Trysol Global Services - Interactive Features Engine
 * Includes:
 * 1. Floating Speed-Dial Contact Hub
 * 2. Universal Modal System (Consultation & Video Modals)
 * 3. Consultation Form Validation & Toast Notification
 * 4. Technology Matrix Tab Filter
 * 5. Interactive Enterprise ROI & AI Assessment Calculator
 * 6. Testimonials Carousel / Slider
 * 7. FAQ Accordion
 * 8. Cookie Privacy Banner
 * 9. 3D Tilt Card Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideoControls();
  initFloatingSpeedDial();
  initUniversalModals();
  initConsultationForm();
  initTechMatrixTabs();
  initAboutTabs();
  initClientLogoCarousel();
  initRoiCalculator();
  initTestimonialsSlider();
  initFaqAccordion();
  initCookieBanner();
  init3DTilt();
  initCapabilityCockpit();
  initFlipPillars();
});

function initClientLogoCarousel() {
  const carousel = document.querySelector('.client-logo-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.children).filter(item => item.classList.contains('client-logo-item'));
  if (slides.length < 2) return;

  carousel.classList.add('client-logo-slider-ready');
  carousel.style.position = 'relative';
  carousel.style.overflow = 'hidden';

  const track = document.createElement('div');
  track.className = 'client-logo-track';
  track.style.display = 'flex';
  track.style.alignItems = 'center';
  track.style.gap = '1rem';
  track.style.width = 'max-content';
  track.style.transition = 'transform 650ms ease';

  const duplicatedSlides = [...slides, ...slides.map(item => item.cloneNode(true))];
  duplicatedSlides.forEach(item => {
    item.setAttribute('aria-hidden', 'true');
    track.appendChild(item);
  });

  carousel.innerHTML = '';
  carousel.appendChild(track);

  const allItems = Array.from(track.children);
  const itemWidth = () => {
    const first = allItems[0];
    if (!first) return 220;
    const firstStyles = window.getComputedStyle(first);
    const margin = parseFloat(firstStyles.marginLeft || 0) + parseFloat(firstStyles.marginRight || 0);
    return first.getBoundingClientRect().width + margin + 10;
  };

  let currentIndex = 0;
  const speed = 2000;
  const originalsCount = slides.length;
  const totalSlides = allItems.length;

  function slide() {
    const width = itemWidth();
    currentIndex += 1;

    if (currentIndex >= originalsCount) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${-originalsCount * width}px)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = 'transform 650ms ease';
          currentIndex = 0;
          track.style.transform = 'translateX(0)';
        });
      });
      return;
    }

    track.style.transform = `translateX(${-currentIndex * width}px)`;
  }

  track.style.transform = 'translateX(0)';
  setInterval(slide, speed);
}

/* ==========================================================================
   0. Hero Video Ambient Player Controls
   ========================================================================== */
function initHeroVideoControls() {
  const video = document.getElementById('hero-bg-video');
  const toggleBtn = document.getElementById('hero-video-toggle');
  const icon = document.getElementById('hero-video-icon');
  const text = document.getElementById('hero-video-text');

  if (!video || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      if (icon) icon.textContent = '⏸';
      if (text) text.textContent = 'Live Motion';
      toggleBtn.setAttribute('aria-label', 'Pause Background Video');
    } else {
      video.pause();
      if (icon) icon.textContent = '▶';
      if (text) text.textContent = 'Paused';
      toggleBtn.setAttribute('aria-label', 'Play Background Video');
    }
  });
}

/* ==========================================================================
   1. Toast Notification System
   ========================================================================== */
function showToast(message, duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `
    <span style="font-size: 1.25rem; color: var(--color-accent);">✓</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

/* ==========================================================================
   2. Floating Speed-Dial Contact Hub
   ========================================================================== */
function initFloatingSpeedDial() {
  const widget = document.getElementById('floating-contact-widget');
  const trigger = document.getElementById('speed-dial-trigger');
  if (!widget || !trigger) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('is-open');
    const isOpen = widget.classList.contains('is-open');
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      widget.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. Universal Modal System
   ========================================================================== */
function initUniversalModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modals = document.querySelectorAll('.app-modal');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  modals.forEach(modal => {
    const closeBtns = modal.querySelectorAll('.modal-close-btn, [data-close-modal]');
    const backdrop = modal.querySelector('.modal-backdrop');

    closeBtns.forEach(btn => btn.addEventListener('click', () => closeModal(modal)));
    if (backdrop) {
      backdrop.addEventListener('click', () => closeModal(modal));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.app-modal.is-active');
      if (activeModal) closeModal(activeModal);
    }
  });

  function openModal(modal) {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea, button:not(.modal-close-btn)');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal(modal) {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    // If video modal, stop video playback
    const iframe = modal.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src;
    }
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
    }
  }

  window.openModalById = function (id) {
    const target = document.getElementById(id);
    if (target) openModal(target);
  };
}

/* ==========================================================================
   4. Consultation Popup Form Validation
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultation-popup-form');
  const modal = document.getElementById('consultation-modal');
  if (!form) return;

  // Service pill selections
  const pillLabels = form.querySelectorAll('.service-pill-label');
  pillLabels.forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          label.classList.add('selected');
        } else {
          label.classList.remove('selected');
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');

    let isValid = true;

    if (!nameInput.value.trim()) {
      showInputError(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      clearInputError(nameInput);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showInputError(emailInput, 'Please enter a valid work email');
      isValid = false;
    } else {
      clearInputError(emailInput);
    }

    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
      showInputError(phoneInput, 'Please enter a valid phone number');
      isValid = false;
    } else {
      clearInputError(phoneInput);
    }

    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="btn-spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spinSlow 0.6s linear infinite; margin-right:8px;"></span>
      Processing Strategy...
    `;

    setTimeout(() => {
      const formFields = form.querySelector('.modal-form-fields');
      const successScreen = modal.querySelector('.modal-success-screen');

      if (formFields) formFields.style.display = 'none';
      if (successScreen) successScreen.classList.add('show');

      showToast('✓ Consultation request received! Our enterprise architects will contact you within 2 hours.');

      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      form.reset();
      pillLabels.forEach(l => l.classList.remove('selected'));
    }, 1200);
  });

  function showInputError(input, msg) {
    input.style.borderColor = '#ef4444';
    input.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
  }

  function clearInputError(input) {
    input.style.borderColor = '';
    input.style.backgroundColor = '';
  }

  // Reset screen handler
  const resetBtn = modal ? modal.querySelector('.modal-reset-btn') : null;
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const formFields = form.querySelector('.modal-form-fields');
      const successScreen = modal.querySelector('.modal-success-screen');
      if (formFields) formFields.style.display = 'block';
      if (successScreen) successScreen.classList.remove('show');
    });
  }
}

/* ==========================================================================
   5. Technology Matrix Tabs Controller
   ========================================================================== */
function initTechMatrixTabs() {
  const tabs = document.querySelectorAll('.tech-tab-btn');
  const cards = document.querySelectorAll('.tech-card-item');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tech-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-tech-category') || '';
        if (filter === 'all' || categories.split(' ').includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initAboutTabs() {
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutPanels = document.querySelectorAll('.about-tab-panel');

  if (!aboutTabs.length || !aboutPanels.length) return;

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      aboutTabs.forEach(item => {
        const isActive = item === tab;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });

      aboutPanels.forEach(panel => {
        const isActive = panel.id === `panel-${target}`;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Enterprise ROI & AI Assessment Calculator
   ========================================================================== */
function initRoiCalculator() {
  const teamSlider = document.getElementById('calc-team-size');
  const spendSlider = document.getElementById('calc-monthly-spend');
  const autoSlider = document.getElementById('calc-automation-target');

  const teamDisplay = document.getElementById('calc-team-display');
  const spendDisplay = document.getElementById('calc-spend-display');
  const autoDisplay = document.getElementById('calc-auto-display');

  const savingsDisplay = document.getElementById('calc-savings-result');
  const speedDisplay = document.getElementById('calc-speed-result');
  const efficiencyDisplay = document.getElementById('calc-efficiency-result');

  if (!teamSlider || !spendSlider || !autoSlider) return;

  function updateCalculations() {
    const team = parseInt(teamSlider.value, 10);
    const spend = parseInt(spendSlider.value, 10);
    const auto = parseInt(autoSlider.value, 10);

    if (teamDisplay) teamDisplay.textContent = team + ' Engineers';
    if (spendDisplay) spendDisplay.textContent = '$' + spend.toLocaleString() + '/mo';
    if (autoDisplay) autoDisplay.textContent = auto + '%';

    // Formula calculation
    const annualSpend = spend * 12;
    const savingsPercent = 0.20 + (auto / 100) * 0.28;
    const totalSavings = Math.round(annualSpend * savingsPercent);
    const speedMult = (1.5 + (auto / 100) * 2.8).toFixed(1);
    const efficiency = Math.min(96, Math.round(35 + (auto * 0.5) + (team * 0.08)));

    if (savingsDisplay) savingsDisplay.textContent = '$' + totalSavings.toLocaleString();
    if (speedDisplay) speedDisplay.textContent = speedMult + 'x Accelerated';
    if (efficiencyDisplay) efficiencyDisplay.textContent = '+' + efficiency + '%';
  }

  [teamSlider, spendSlider, autoSlider].forEach(slider => {
    slider.addEventListener('input', updateCalculations);
  });

  updateCalculations();
}

/* ==========================================================================
   7. Enterprise Testimonials Carousel
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide-item');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  const dotsContainer = document.getElementById('testimonial-dots-list');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoTimer = null;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); resetTimer(); });

  function startAutoPlay() {
    autoTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    startAutoPlay();
  }

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', () => startAutoPlay());

  // Touch Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      goToSlide(currentIndex + 1);
      resetTimer();
    } else if (touchEndX - touchStartX > 50) {
      goToSlide(currentIndex - 1);
      resetTimer();
    }
  }, { passive: true });

  startAutoPlay();
}

/* ==========================================================================
   8. Enterprise FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close all other accordions for clean single accordion state
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-active');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-active', !isActive);
      trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });
}

/* ==========================================================================
   9. Cookie Consent & Privacy Banner
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookie-consent-bar');
  if (!banner) return;

  const isAccepted = localStorage.getItem('infronix_cookies_accepted');
  if (!isAccepted) {
    setTimeout(() => {
      banner.classList.add('is-shown');
    }, 1800);
  }

  const acceptBtn = document.getElementById('cookie-accept-btn');
  const declineBtn = document.getElementById('cookie-decline-btn');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('infronix_cookies_accepted', 'all');
      banner.classList.remove('is-shown');
      showToast('Cookie preferences saved.');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('infronix_cookies_accepted', 'essential');
      banner.classList.remove('is-shown');
    });
  }
}

/* ==========================================================================
   10. 3D Card Tilt & Glare Effects
   ========================================================================== */
function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   11. Capability Command Center & Interactive Cockpit Console
   ========================================================================== */
function initCapabilityCockpit() {
  const navItems = document.querySelectorAll('.cockpit-nav-item');
  const stagePanels = document.querySelectorAll('.stage-panel');

  if (!navItems.length || !stagePanels.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-stage-target');

      navItems.forEach(nav => {
        nav.classList.remove('is-active');
        nav.setAttribute('aria-selected', 'false');
      });
      stagePanels.forEach(panel => panel.classList.remove('is-active'));

      item.classList.add('is-active');
      item.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('is-active');
      }
    });

    // Also support smooth hover preview on desktop devices
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(min-width: 1025px)').matches) {
        const targetId = item.getAttribute('data-stage-target');
        navItems.forEach(nav => nav.classList.remove('is-active'));
        stagePanels.forEach(panel => panel.classList.remove('is-active'));

        item.classList.add('is-active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('is-active');
      }
    });
  });
}

/* ==========================================================================
   12. 3D Flip Pillars Touch/Tap Controller (Mobile & Tablet)
   ========================================================================== */
function initFlipPillars() {
  const pillars = document.querySelectorAll('.flip-pillar-container');
  pillars.forEach(pillar => {
    pillar.addEventListener('click', (e) => {
      // If clicking directly on a link inside the card, allow default navigation
      if (e.target.closest('a')) return;

      if (window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches) {
        pillar.classList.toggle('is-flipped');
      }
    });
  });
}


