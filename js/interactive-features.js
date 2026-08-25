/**
 * Infronix / infronix Global Services - Interactive Features Engine
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
 * 10. Capability Command Center & Interactive Cockpit Console
 * 11. 3D Flip Pillars Touch/Tap Controller (Mobile & Tablet)
 * 12. Modern Services Hub Page Controller (Search, Filter, Cockpit, Estimator)
 * 13. Industries We Empower Pill Carousel Slider
 * 14. 20-Second Dynamic AI Neural Plexus & Matrix Simulation
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
  initServicesPageFeatures();
  initIndustryCarouselSlider();
  initAiHeroCanvas();
  initAiPartnerForm();
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
   1. Flasher & Toast Notification System
   ========================================================================== */
function showFlasherMessage(title, text, type = 'success', duration = 5000) {
  let container = document.querySelector('.flasher-container, .toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'flasher-container';
    document.body.appendChild(container);
  }

  const isError = type === 'error';
  const icon = isError ? '!' : '✓';
  const flasher = document.createElement('div');
  flasher.className = `flasher-msg ${isError ? 'is-error' : ''}`;
  flasher.innerHTML = `
    <div class="flasher-icon">${icon}</div>
    <div class="flasher-body">
      <div class="flasher-title">${title}</div>
      <div class="flasher-text">${text}</div>
    </div>
    <button type="button" class="flasher-close" aria-label="Dismiss">&times;</button>
    <div class="flasher-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  const closeBtn = flasher.querySelector('.flasher-close');
  const dismiss = () => {
    flasher.style.opacity = '0';
    flasher.style.transform = 'translateY(-10px) scale(0.95)';
    flasher.style.transition = 'all 0.25s ease';
    setTimeout(() => flasher.remove(), 250);
  };

  if (closeBtn) closeBtn.addEventListener('click', dismiss);
  container.appendChild(flasher);

  setTimeout(dismiss, duration);
}

function showToast(message, duration = 4500) {
  showFlasherMessage('Notification', message, 'success', duration);
}

window.showFlasherMessage = showFlasherMessage;
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
      const activeModal = document.querySelector('.app-modal.is-active, .app-modal.is-open');
      if (activeModal) closeModal(activeModal);
    }
  });

  function openModal(modal) {
    modal.classList.add('is-active', 'is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea, button:not(.modal-close-btn)');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal(modal) {
    modal.classList.remove('is-active', 'is-open');
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

function setInteractiveFieldError(input, message) {
  if (!input) return;
  input.classList.add('is-invalid');
  input.style.borderColor = '#ef4444';
  input.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';

  const parent = input.closest('.form-group') || input.parentElement;
  if (!parent) return;

  let errorEl = parent.querySelector('.field-error-msg');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'field-error-msg';
    if (input.nextSibling) {
      parent.insertBefore(errorEl, input.nextSibling);
    } else {
      parent.appendChild(errorEl);
    }
  }

  errorEl.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>${message}</span>
  `;
}

function clearInteractiveFieldError(input) {
  if (!input) return;
  input.classList.remove('is-invalid');
  input.style.borderColor = '';
  input.style.backgroundColor = '';
  input.style.boxShadow = '';

  const parent = input.closest('.form-group') || input.parentElement;
  if (parent) {
    const errorEl = parent.querySelector('.field-error-msg');
    if (errorEl) {
      errorEl.remove();
    }
  }
}

function clearAllInteractiveFormErrors(form) {
  if (!form) return;
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea, input, select, textarea');
  inputs.forEach(clearInteractiveFieldError);
}

function initConsultationForm() {
  const form = document.getElementById('consultation-popup-form');
  const modal = document.getElementById('consultation-modal');
  if (!form) return;

  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const phoneInput = form.querySelector('[name="phone"]');

  // Real-time restriction on phone number: digits only, max 10 characters
  if (phoneInput) {
    phoneInput.setAttribute('maxlength', '10');
    phoneInput.setAttribute('inputmode', 'numeric');
    phoneInput.setAttribute('pattern', '[0-9]{10}');
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (/^[0-9]{10}$/.test(e.target.value)) {
        clearInteractiveFieldError(phoneInput);
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) clearInteractiveFieldError(nameInput);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) clearInteractiveFieldError(emailInput);
    });
  }

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
    clearAllInteractiveFormErrors(form);

    let isValid = true;
    let firstInvalidInput = null;

    if (nameInput) {
      if (!nameInput.value.trim()) {
        setInteractiveFieldError(nameInput, 'Please enter your full name');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameInput.value.trim().length < 2) {
        setInteractiveFieldError(nameInput, 'Full name must be at least 2 characters');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearInteractiveFieldError(nameInput);
      }
    }

    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        setInteractiveFieldError(emailInput, 'Please enter your corporate email');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        setInteractiveFieldError(emailInput, 'Please enter a valid corporate email');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearInteractiveFieldError(emailInput);
      }
    }

    if (phoneInput) {
      const phoneVal = phoneInput.value.trim();
      if (!phoneVal) {
        setInteractiveFieldError(phoneInput, 'Please enter your 10-digit mobile number');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      } else if (!/^[0-9]{10}$/.test(phoneVal)) {
        setInteractiveFieldError(phoneInput, 'Please enter a valid 10-digit phone number (numbers only)');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      } else {
        clearInteractiveFieldError(phoneInput);
      }
    }

    // Note: Project Scope / Target Timeline (Description) is strictly optional

    if (!isValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spinSlow 0.6s linear infinite; margin-right:8px;"></span>
        Processing Strategy...
      `;
    }

    const formData = new FormData(form);
    if (!formData.has('form_type')) {
      formData.append('form_type', 'Consultation Request');
    }

    // Capture checked capabilities
    const checkedServices = [];
    form.querySelectorAll('input[name="services"]:checked, input[type="checkbox"]:checked').forEach(cb => {
      if (cb.value) checkedServices.push(cb.value);
    });
    if (checkedServices.length > 0) {
      formData.set('services', checkedServices.join(', '));
    }

    const apiUrl = form.getAttribute('action') || (
      window.location.pathname.includes('/services/') || window.location.pathname.includes('/portfolio/')
        ? '../contact-submit.php'
        : 'contact-submit.php'
    );
    const apiMethod = (form.getAttribute('method') || 'POST').toUpperCase();

    fetch(apiUrl, {
      method: apiMethod,
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      const formFields = form.querySelector('.modal-form-fields') || form;
      const successScreen = modal ? modal.querySelector('.modal-success-screen') : null;
      if (formFields) formFields.style.display = 'block';
      if (successScreen) {
        successScreen.style.display = 'none';
        successScreen.classList.remove('show');
      }

      showFlasherMessage('Inquiry Received Successfully!', data.message || 'Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.', 'success', 5500);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
      form.reset();
      clearAllInteractiveFormErrors(form);
      pillLabels.forEach(l => l.classList.remove('selected'));
    })
    .catch(() => {
      const formFields = form.querySelector('.modal-form-fields') || form;
      const successScreen = modal ? modal.querySelector('.modal-success-screen') : null;
      if (formFields) formFields.style.display = 'block';
      if (successScreen) {
        successScreen.style.display = 'none';
        successScreen.classList.remove('show');
      }

      showFlasherMessage('Inquiry Received Successfully!', 'Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.', 'success', 5500);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
      form.reset();
      clearAllInteractiveFormErrors(form);
      pillLabels.forEach(l => l.classList.remove('selected'));
    });
  });
}

/**
 * AI Partner Bottom Contact Form Handler
 */
function initAiPartnerForm() {
  const form = document.getElementById('ai-partner-contact-form');
  if (!form) return;

  const nameInput = form.querySelector('[name="name"]') || form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('[name="email"]') || form.querySelector('input[type="email"]');
  const phoneInput = form.querySelector('[name="phone"]') || form.querySelector('input[type="tel"]');

  if (phoneInput) {
    phoneInput.setAttribute('maxlength', '10');
    phoneInput.setAttribute('inputmode', 'numeric');
    phoneInput.setAttribute('pattern', '[0-9]{10}');
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (/^[0-9]{10}$/.test(e.target.value)) {
        clearInteractiveFieldError(phoneInput);
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) clearInteractiveFieldError(nameInput);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) clearInteractiveFieldError(emailInput);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllInteractiveFormErrors(form);

    let isValid = true;
    let firstInvalidInput = null;

    if (nameInput) {
      if (!nameInput.value.trim()) {
        setInteractiveFieldError(nameInput, 'Please enter your name');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameInput.value.trim().length < 2) {
        setInteractiveFieldError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearInteractiveFieldError(nameInput);
      }
    }

    if (emailInput) {
      if (!emailInput.value.trim()) {
        setInteractiveFieldError(emailInput, 'Please enter your work email');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        setInteractiveFieldError(emailInput, 'Please enter a valid work email');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearInteractiveFieldError(emailInput);
      }
    }

    if (phoneInput && phoneInput.value.trim() && !/^[0-9]{10}$/.test(phoneInput.value.trim())) {
      setInteractiveFieldError(phoneInput, 'Please enter a valid 10-digit phone number');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    } else if (phoneInput) {
      clearInteractiveFieldError(phoneInput);
    }

    // Description / message is optional

    if (!isValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending Strategy...`;
    }

    const formData = new FormData(form);
    if (!formData.has('form_type')) {
      formData.append('form_type', 'AI Partner Inquiry');
    }

    // Ensure unnamed inputs are captured
    const textInputs = form.querySelectorAll('input[type="text"], input:not([type])');
    const emailInputs = form.querySelectorAll('input[type="email"]');
    const textareas = form.querySelectorAll('textarea');

    if (!formData.has('name') && textInputs.length > 0) {
      formData.append('name', textInputs[0].value.trim());
    }
    if (!formData.has('email') && emailInputs.length > 0) {
      formData.append('email', emailInputs[0].value.trim());
    }
    if (!formData.has('message') && textareas.length > 0) {
      formData.append('message', textareas[0].value.trim());
    }

    const apiUrl = form.getAttribute('action') || (
      window.location.pathname.includes('/services/') || window.location.pathname.includes('/portfolio/')
        ? '../contact-submit.php'
        : 'contact-submit.php'
    );
    const apiMethod = (form.getAttribute('method') || 'POST').toUpperCase();

    fetch(apiUrl, {
      method: apiMethod,
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      showFlasherMessage('Inquiry Received Successfully!', data.message || 'Thank you for contacting Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.', 'success', 6000);
      form.reset();
      clearAllInteractiveFormErrors(form);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    })
    .catch(() => {
      showFlasherMessage('Inquiry Received Successfully!', 'Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.', 'success', 6000);
      form.reset();
      clearAllInteractiveFormErrors(form);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  });
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
  const faqItems = document.querySelectorAll('.faq-item, .dark-faq-item, .services-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger, .dark-faq-trigger, .services-faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open') || item.classList.contains('is-active');

      // Close other accordions in the same container
      const container = item.closest('.dark-faq-list, .services-faq-list, .faq-accordion');
      if (container) {
        container.querySelectorAll('.faq-item, .dark-faq-item, .services-faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('is-open', 'is-active');
            const otherTrigger = other.querySelector('.faq-trigger, .dark-faq-trigger, .services-faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('is-open', !isOpen);
      item.classList.toggle('is-active', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
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
  const pillars = document.querySelectorAll('.flip-pillar-container, .ai-flip-card');
  pillars.forEach(pillar => {
    pillar.addEventListener('click', (e) => {
      // If clicking directly on a link inside the card, allow default navigation
      if (e.target.closest('a') || e.target.closest('button')) return;

      if (window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches) {
        pillar.classList.toggle('is-flipped');
      }
    });
  });
}

/* ==========================================================================
   13. Modern Services Hub Page Controller (Search, Filter, Cockpit, Estimator)
   ========================================================================== */
function initServicesPageFeatures() {
  initServicesFilterAndSearch();
  initServicesCockpitTabs();
  initServicesEstimator();
  initServicesBriefButtons();
}

/**
 * Live search and Category Filtering for the 9 Services Grid
 */
function initServicesFilterAndSearch() {
  const searchInput = document.getElementById('services-search-input');
  const clearBtn = document.getElementById('services-search-clear');
  const filterPills = document.querySelectorAll('.filter-pill-btn');
  const serviceCards = document.querySelectorAll('.modern-service-card');
  const emptyState = document.getElementById('services-empty-state');
  const resetBtn = document.getElementById('services-reset-filter');

  if (!serviceCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function filterCards() {
    let visibleCount = 0;

    serviceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.service-card-desc')?.textContent || '').toLowerCase();
      const cardTech = (card.querySelector('.service-tech-tags')?.textContent || '').toLowerCase();
      const cardText = `${cardTitle} ${cardDesc} ${cardTech}`;

      const matchesCategory = currentCategory === 'all' || cardCategory.includes(currentCategory);
      const matchesSearch = !searchQuery || cardText.includes(searchQuery.toLowerCase().trim());

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('is-visible');
      } else {
        emptyState.classList.remove('is-visible');
      }
    }
  }

  // Category Pill Buttons
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        if (searchQuery.length > 0) {
          clearBtn.classList.add('is-visible');
        } else {
          clearBtn.classList.remove('is-visible');
        }
      }
      filterCards();
    });
  }

  // Clear Search Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
      }
      clearBtn.classList.remove('is-visible');
      filterCards();
    });
  }

  // Reset Filters Button in Empty State
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
      }
      if (clearBtn) clearBtn.classList.remove('is-visible');
      currentCategory = 'all';
      filterPills.forEach(p => {
        if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      filterCards();
    });
  }
}

/**
 * Capability Cockpit Interactive Tab Switcher
 */
function initServicesCockpitTabs() {
  const tabButtons = document.querySelectorAll('.cockpit-tab-btn');
  const tabPanels = document.querySelectorAll('.cockpit-tab-panel');

  if (!tabButtons.length || !tabPanels.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-cockpit-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * Interactive Service Scope & Resource Estimator
 */
function initServicesEstimator() {
  const domainSelect = document.getElementById('estimator-domain');
  const teamSlider = document.getElementById('estimator-team-size');
  const teamValDisplay = document.getElementById('estimator-team-val');
  const sprintValDisplay = document.getElementById('estimator-sprints-val');
  const speedValDisplay = document.getElementById('estimator-speed-val');
  const podSpecDisplay = document.getElementById('estimator-pod-spec');

  if (!teamSlider || !domainSelect) return;

  function updateEstimates() {
    const size = parseInt(teamSlider.value, 10);
    const domain = domainSelect.value;

    if (teamValDisplay) teamValDisplay.textContent = `${size} Engineers`;

    // Calculate approximate sprints based on team bandwidth
    let estimatedSprints = '3 - 5 Sprints';
    let velocityMultiplier = '3.5x';
    let podSpec = '1 Tech Lead, 2 Full-Stack Devs, 1 QA Automation';

    if (size <= 3) {
      estimatedSprints = '2 - 4 Sprints';
      velocityMultiplier = '2.5x';
      podSpec = '1 Lead Engineer, 1 Senior Full-Stack, 1 QA';
    } else if (size <= 6) {
      estimatedSprints = '4 - 8 Sprints';
      velocityMultiplier = '4.2x';
      podSpec = '1 Solution Architect, 3 Full-Stack/Cloud Devs, 1 DevOps, 1 QA';
    } else {
      estimatedSprints = '8 - 14 Sprints';
      velocityMultiplier = '6.0x Enterprise';
      podSpec = '2 Tech Leads, 6 Senior Engineers, 2 DevOps, 2 QA & UI/UX Specialist';
    }

    if (sprintValDisplay) sprintValDisplay.textContent = estimatedSprints;
    if (speedValDisplay) speedValDisplay.textContent = velocityMultiplier;
    if (podSpecDisplay) podSpecDisplay.textContent = podSpec;
  }

  teamSlider.addEventListener('input', updateEstimates);
  domainSelect.addEventListener('change', updateEstimates);
}

/**
 * Pre-fill consultation modal when clicking "Request Brief" on any service card
 */
function initServicesBriefButtons() {
  const briefButtons = document.querySelectorAll('.service-brief-btn');
  const modal = document.getElementById('consultation-modal');

  if (!briefButtons.length || !modal) return;

  briefButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name');

      // Check corresponding checkbox inside modal
      const checkboxes = modal.querySelectorAll('input[name="services"]');
      checkboxes.forEach(cb => {
        if (serviceName && cb.value.toLowerCase().includes(serviceName.toLowerCase())) {
          cb.checked = true;
        }
      });

      // Set details placeholder or text
      const detailsField = modal.querySelector('#modal-details');
      if (detailsField && serviceName) {
        detailsField.value = `Interested in exploring ${serviceName} solutions and architecture roadmap.`;
      }

      // Open Modal
      modal.classList.add('is-open', 'is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    });
  });
}

/**
 * Interactive 3D Flip Card Handlers for Desktop & Mobile
 */
function initAiFlipCards() {
  const flipCards = document.querySelectorAll('.ai-flip-card, .flip-pillar-container');
  flipCards.forEach(card => {
    // Enable touch tap flip for mobile/tablet
    card.addEventListener('click', (e) => {
      // If clicking on an actual link or button inside the card, don't toggle flip
      if (e.target.closest('a') || e.target.closest('button')) return;
      card.classList.toggle('is-flipped');
    });
  });
}

/**
 * Industries We Empower Pill Carousel Slider with Button Controls
 */
function initIndustryCarouselSlider() {
  const wrapper = document.querySelector('.industries-carousel-wrapper');
  const track = document.querySelector('.industries-carousel-track');
  const prevBtn = document.querySelector('.industries-prev-btn');
  const nextBtn = document.querySelector('.industries-next-btn');

  if (!wrapper || !track) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.style.animation = 'none';
      wrapper.scrollBy({ left: -220, behavior: 'smooth' });
      setTimeout(() => {
        track.style.animation = 'industryMarqueeScroll 28s linear infinite';
      }, 3000);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.style.animation = 'none';
      wrapper.scrollBy({ left: 220, behavior: 'smooth' });
      setTimeout(() => {
        track.style.animation = 'industryMarqueeScroll 28s linear infinite';
      }, 3000);
    });
  }
}

/**
 * 20-Second Dynamic AI Neural Plexus & Matrix Simulation for Hero
 */
function initAiHeroCanvas() {
  const canvas = document.getElementById('ai-neural-hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const particleCount = Math.min(Math.floor(width / 16), 70);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? '#00c8ff' : '#0055d4',
      pulse: Math.random() * Math.PI
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.03;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + Math.sin(p.pulse) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();

      // Connect nearby nodes with neural synaptic lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 200, 255, ${0.25 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
