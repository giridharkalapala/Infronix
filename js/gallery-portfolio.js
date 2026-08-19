/**
 * TRYSOL GLOBAL SERVICES - GALLERY & PORTFOLIO ENGINE + ACCESSIBLE LIGHTBOX
 * Handles Client-Side Filtering and Modal Lightbox Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initFiltering();
  initLightbox();
});

/**
 * 1. Client-Side Filtering Tabs (Portfolio & Gallery)
 */
function initFiltering() {
  const filterContainers = document.querySelectorAll('.filter-tabs');

  filterContainers.forEach((container) => {
    const buttons = container.querySelectorAll('.filter-btn');
    const targetGridId = container.getAttribute('data-target-grid');
    const grid = document.getElementById(targetGridId);

    if (!grid) return;

    const items = grid.querySelectorAll('.filter-item');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle active button
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        items.forEach((item) => {
          const category = item.getAttribute('data-category');

          if (filterVal === 'all' || category === filterVal) {
            item.style.opacity = '0';
            item.style.display = 'block';
            setTimeout(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  });
}

/**
 * 2. Accessible Lightbox Modal
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
  const nextBtn = lightbox.querySelector('.lightbox-next-btn');

  let currentItems = [];
  let currentIndex = 0;

  function updateItemsList() {
    currentItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
      (item) => item.style.display !== 'none'
    );
  }

  function showImage(index) {
    if (index < 0) index = currentItems.length - 1;
    if (index >= currentItems.length) index = 0;
    currentIndex = index;

    const item = currentItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-title') || img.getAttribute('alt') || 'Trysol Gallery';

    lightboxImg.src = img.src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
  }

  function openLightbox(item) {
    updateItemsList();
    currentIndex = currentItems.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;

    showImage(currentIndex);
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  // Attach click listener to gallery items
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  // Backdrop click to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation (ESC, Left, Right)
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });
}
