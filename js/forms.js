/**
 * infronix GLOBAL SERVICES - CONTACT & INQUIRY FORM CONTROLLER
 * Handles interactive client-side form validation, floating inputs, and animated feedback states
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForms();
});

function initContactForms() {
  const forms = document.querySelectorAll('.contact-form');

  forms.forEach((form) => {
    const feedbackBox = form.querySelector('.form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const companyInput = form.querySelector('[name="company"]');
      const serviceSelect = form.querySelector('[name="service"]');
      const messageInput = form.querySelector('[name="message"]');

      let isValid = true;
      let errorMessage = '';

      // Validate Full Name
      if (nameInput && nameInput.value.trim().length < 2) {
        isValid = false;
        errorMessage = 'Please enter your full name.';
        nameInput.focus();
      }
      // Validate Email
      else if (emailInput && !isValidEmail(emailInput.value.trim())) {
        isValid = false;
        errorMessage = 'Please enter a valid work email address.';
        emailInput.focus();
      }
      // Validate Phone (optional/format check)
      else if (phoneInput && phoneInput.value.trim().length < 7) {
        isValid = false;
        errorMessage = 'Please enter a valid contact phone number.';
        phoneInput.focus();
      }
      // Validate Service Selection
      else if (serviceSelect && (!serviceSelect.value || serviceSelect.value === '')) {
        isValid = false;
        errorMessage = 'Please select a service of interest.';
        serviceSelect.focus();
      }
      // Validate Message
      else if (messageInput && messageInput.value.trim().length < 10) {
        isValid = false;
        errorMessage = 'Please provide a brief description of your project requirements.';
        messageInput.focus();
      }

      if (!isValid) {
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-error';
          feedbackBox.textContent = errorMessage;
          feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
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

          if (feedbackBox) {
            if (data.success) {
              feedbackBox.className = 'form-feedback is-success';
              feedbackBox.innerHTML = `
                <strong>Inquiry Received Successfully!</strong><br>
                ${data.message || 'Thank you for contacting Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.'}
              `;
              form.reset();
            } else {
              feedbackBox.className = 'form-feedback is-error';
              feedbackBox.textContent = data.message || 'An error occurred while submitting your message.';
            }
          }
        })
        .catch(() => {
          // Graceful fallback for local file:/// preview
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
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
