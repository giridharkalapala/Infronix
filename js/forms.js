/**
 * INFRONIX GLOBAL SERVICES - CONTACT & INQUIRY FORM CONTROLLER
 * Handles interactive client-side form validation, real-time input filtering, and animated feedback states
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForms();
});

function initContactForms() {
  const forms = document.querySelectorAll('.contact-form');

  forms.forEach((form) => {
    const feedbackBox = form.querySelector('.form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const companyInput = form.querySelector('[name="company"]');
    const serviceSelect = form.querySelector('[name="service"]');
    const messageInput = form.querySelector('[name="message"]');

    // 1. Real-time Input Constraints & Formatting
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        // Remove numbers and special characters in real-time
        nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
      });
    }

    if (phoneInput) {
      phoneInput.setAttribute('maxlength', '10');
      phoneInput.setAttribute('inputmode', 'numeric');
      phoneInput.addEventListener('input', () => {
        // Allow digits only and restrict to max 10 digits
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    if (companyInput) {
      companyInput.addEventListener('input', () => {
        // Allow only alphabets and spaces
        companyInput.value = companyInput.value.replace(/[^a-zA-Z\s]/g, '');
      });
    }

    if (messageInput) {
      messageInput.setAttribute('maxlength', '250');

      // Add or connect character counter UI
      let charCounter = form.querySelector('.char-counter');
      if (!charCounter) {
        charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.fontSize = '0.8rem';
        charCounter.style.color = 'var(--text-muted, #94a3b8)';
        charCounter.style.textAlign = 'right';
        charCounter.style.marginTop = '4px';
        messageInput.parentNode.appendChild(charCounter);
      }

      const updateCounter = () => {
        const currentLen = messageInput.value.length;
        charCounter.textContent = `${currentLen} / 250 characters`;
        if (currentLen >= 250) {
          charCounter.style.color = '#f59e0b';
        } else {
          charCounter.style.color = 'var(--text-muted, #94a3b8)';
        }
      };

      messageInput.addEventListener('input', updateCounter);
      updateCounter();
    }

    // 2. Form Submission Handler with Rigorous Validations
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const companyVal = companyInput ? companyInput.value.trim() : '';
      const serviceVal = serviceSelect ? serviceSelect.value : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      let isValid = true;
      let errorMessage = '';

      // [Validation 1] Name: Only alphabets and spaces, no numbers or special symbols
      if (!nameVal) {
        isValid = false;
        errorMessage = 'Please enter your full name.';
        if (nameInput) nameInput.focus();
      } else if (!/^[a-zA-Z\s]+$/.test(nameVal)) {
        isValid = false;
        errorMessage = 'Name must contain only alphabets and spaces (no numbers or special characters allowed).';
        if (nameInput) nameInput.focus();
      } else if (nameVal.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long.';
        if (nameInput) nameInput.focus();
      }
      // [Validation 2] Email
      else if (!emailVal || !isValidEmail(emailVal)) {
        isValid = false;
        errorMessage = 'Please enter a valid work email address.';
        if (emailInput) emailInput.focus();
      }
      // [Validation 3] Phone / Mobile: Exactly 10 digits only
      else if (!phoneVal) {
        isValid = false;
        errorMessage = 'Please enter your 10-digit mobile number.';
        if (phoneInput) phoneInput.focus();
      } else if (!/^[0-9]{10}$/.test(phoneVal)) {
        isValid = false;
        errorMessage = 'Mobile number must be exactly 10 digits only (more than or less than 10 digits are not accepted).';
        if (phoneInput) phoneInput.focus();
      }
      // [Validation 4] Company: Alphabets and space only
      else if (companyVal && !/^[a-zA-Z\s]+$/.test(companyVal)) {
        isValid = false;
        errorMessage = 'Company name should contain only alphabets and spaces.';
        if (companyInput) companyInput.focus();
      }
      // [Validation 5] Service Selection
      else if (serviceSelect && !serviceVal) {
        isValid = false;
        errorMessage = 'Please select a domain / service area.';
        if (serviceSelect) serviceSelect.focus();
      }
      // [Validation 6] Project Overview / Scope: Required and max 250 characters
      else if (!messageVal) {
        isValid = false;
        errorMessage = 'Please enter your Project Overview / Scope.';
        if (messageInput) messageInput.focus();
      } else if (messageVal.length > 250) {
        isValid = false;
        errorMessage = 'Project Overview / Scope must not exceed 250 characters.';
        if (messageInput) messageInput.focus();
      }

      if (!isValid) {
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-error';
          feedbackBox.textContent = errorMessage;
          feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // 3. Clear previous errors and initiate transmission
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback';
        feedbackBox.textContent = '';
      }

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

        const submitUrl = form.getAttribute('action') || (
          window.location.pathname.includes('/services/') || window.location.pathname.includes('/portfolio/') 
            ? '../contact-submit.php' 
            : 'contact-submit.php'
        );
        const submitMethod = (form.getAttribute('method') || 'POST').toUpperCase();

        fetch(submitUrl, {
          method: submitMethod,
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(async (res) => {
          const data = await res.json().catch(() => ({ success: res.ok, message: res.statusText }));
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          if (feedbackBox) {
            if (data.success) {
              feedbackBox.className = 'form-feedback is-success';
              feedbackBox.innerHTML = `
                <strong>Inquiry Received Successfully!</strong><br>
                ${data.message || 'Thank you for contacting Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.'}
              `;
              form.reset();
              if (messageInput) {
                const charCounter = form.querySelector('.char-counter');
                if (charCounter) charCounter.textContent = '0 / 250 characters';
              }
            } else {
              feedbackBox.className = 'form-feedback is-error';
              feedbackBox.textContent = data.message || 'An error occurred while submitting your message.';
            }
          }
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          if (feedbackBox) {
            feedbackBox.className = 'form-feedback is-success';
            feedbackBox.innerHTML = `
              <strong>Inquiry Received Successfully!</strong><br>
              Thank you for contacting Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.
            `;
          }
          form.reset();
        });
      }
    });
  });
}

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

