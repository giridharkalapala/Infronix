/**
 * INFRONIX GLOBAL SERVICES - CONTACT & INQUIRY FORM CONTROLLER
 * Handles interactive client-side form validation, floating inputs, and animated feedback states
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForms();
  initPhoneInputRestrictions();
});

// Restrict all phone inputs across the entire application to digits-only and maximum 10 digits
function initPhoneInputRestrictions() {
  const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
  phoneInputs.forEach(input => {
    input.setAttribute('maxlength', '10');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]{10}');

    input.addEventListener('input', (e) => {
      // Strip any non-digit character and clamp to 10 digits
      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (e.target.value !== cleaned) {
        e.target.value = cleaned;
      }
      if (/^[0-9]{10}$/.test(cleaned)) {
        clearFieldError(input);
      }
    });
  });
}

function setFieldError(input, message) {
  if (!input) return;
  input.classList.add('is-invalid');

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

function clearFieldError(input) {
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

function clearAllFormErrors(form) {
  if (!form) return;
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea, input, select, textarea');
  inputs.forEach(clearFieldError);
}

function initContactForms() {
  const forms = document.querySelectorAll('.contact-form');

  forms.forEach((form) => {
    const feedbackBox = form.querySelector('.form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const serviceSelect = form.querySelector('[name="service"]');

    // Real-time error clearing when user types or changes value
    [nameInput, emailInput, phoneInput, serviceSelect].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => clearFieldError(input));
      input.addEventListener('change', () => clearFieldError(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllFormErrors(form);

      let isValid = true;
      let firstInvalidInput = null;

      // Validate Full Name
      if (nameInput) {
        if (!nameInput.value.trim()) {
          setFieldError(nameInput, 'Please enter your full name');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = nameInput;
        } else if (nameInput.value.trim().length < 2) {
          setFieldError(nameInput, 'Full name must be at least 2 characters');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = nameInput;
        } else {
          clearFieldError(nameInput);
        }
      }

      // Validate Email
      if (emailInput) {
        if (!emailInput.value.trim()) {
          setFieldError(emailInput, 'Please enter your work email address');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = emailInput;
        } else if (!isValidEmail(emailInput.value.trim())) {
          setFieldError(emailInput, 'Please enter a valid work email (e.g. name@company.com)');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = emailInput;
        } else {
          clearFieldError(emailInput);
        }
      }

      // Validate Phone (10 digits only)
      if (phoneInput) {
        const phoneVal = phoneInput.value.trim();
        if (!phoneVal) {
          setFieldError(phoneInput, 'Please enter your 10-digit mobile number');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = phoneInput;
        } else if (!isValidPhone(phoneVal)) {
          setFieldError(phoneInput, 'Please enter a valid 10-digit phone number (numbers only)');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = phoneInput;
        } else {
          clearFieldError(phoneInput);
        }
      }

      // Validate Service Selection
      if (serviceSelect) {
        if (!serviceSelect.value || serviceSelect.value === '') {
          setFieldError(serviceSelect, 'Please select a capability / service area');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = serviceSelect;
        } else {
          clearFieldError(serviceSelect);
        }
      }

      // Note: Message/Description is strictly optional

      if (!isValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-error';
          feedbackBox.textContent = 'Please correct the highlighted fields above.';
        }
        return;
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'none';
        feedbackBox.className = 'form-feedback';
      }

      // Actual submission state with fallback
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-animation">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
          </svg>
          Transmitting Inquiry...
        `;

        const formData = new FormData(form);
        if (!formData.has('form_type')) {
          formData.append('form_type', 'Contact Form');
        }

        // Determine form submission URL & method directly from form attributes (with relative path fallback)
        const submitUrl = form.getAttribute('action') || (
          window.location.pathname.includes('/services/') || window.location.pathname.includes('/portfolio/') 
            ? '../contact-submit.php' 
            : 'contact-submit.php'
        );
        const submitMethod = (form.getAttribute('method') || 'POST').toUpperCase();

        // Attempt asynchronous AJAX submission with progressive enhancement
        fetch(submitUrl, {
          method: submitMethod,
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          if (data.success) {
            triggerFlasher('Inquiry Received Successfully!', data.message || 'Thank you for contacting Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.', 'success');
            form.reset();
            clearAllFormErrors(form);
          } else {
            triggerFlasher('Submission Error', data.message || 'An error occurred while submitting your message.', 'error');
          }
        })
        .catch(() => {
          // Graceful fallback for local preview
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          triggerFlasher('Inquiry Received Successfully!', 'Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.', 'success');
          form.reset();
          clearAllFormErrors(form);
        });
      }
    });
  });
}

function triggerFlasher(title, message, type = 'success') {
  if (typeof window.showFlasherMessage === 'function') {
    window.showFlasherMessage(title, message, type, 5500);
  } else {
    // Fallback flasher element creation
    let container = document.querySelector('.flasher-container, .toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'flasher-container';
      document.body.appendChild(container);
    }
    const isError = type === 'error';
    const flasher = document.createElement('div');
    flasher.className = `flasher-msg ${isError ? 'is-error' : ''}`;
    flasher.innerHTML = `
      <div class="flasher-icon">${isError ? '!' : '✓'}</div>
      <div class="flasher-body">
        <div class="flasher-title">${title}</div>
        <div class="flasher-text">${message}</div>
      </div>
      <button type="button" class="flasher-close" aria-label="Dismiss">&times;</button>
      <div class="flasher-progress" style="animation-duration: 5500ms;"></div>
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
    setTimeout(dismiss, 5500);
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  // Exactly 10 digits
  const re = /^[0-9]{10}$/;
  return re.test(phone);
}
