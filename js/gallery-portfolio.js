/**
 * infronix GLOBAL SERVICES - GALLERY & PORTFOLIO ENGINE + ACCESSIBLE LIGHTBOX
 * Handles Client-Side Filtering and Modal Lightbox Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

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
  const zoomInBtn = lightbox.querySelector('.lightbox-zoom-in');
  const zoomOutBtn = lightbox.querySelector('.lightbox-zoom-out');
  const resetZoomBtn = lightbox.querySelector('.lightbox-zoom-reset');
  const fullscreenBtn = lightbox.querySelector('.lightbox-fullscreen');
  const shareBtn = lightbox.querySelector('.lightbox-share-btn');

  let currentItems = [];
  let currentIndex = 0;
  let zoomLevel = 1;
  const minZoom = 1;
  const maxZoom = 3;

  function updateItemsList() {
    currentItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
      (item) => item.style.display !== 'none'
    );
  }

  function setZoom(nextZoom) {
    zoomLevel = Math.min(maxZoom, Math.max(minZoom, Number(nextZoom.toFixed(2))));
    lightboxImg.style.transform = `scale(${zoomLevel})`;
    if (resetZoomBtn) {
      resetZoomBtn.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  }

  function resetZoom() {
    setZoom(1);
  }

  async function shareCurrentImage() {
    const imageUrl = lightboxImg.src;
    const title = lightboxCaption.textContent || 'infronix Gallery Image';

    try {
      if (navigator.share) {
        await navigator.share({ title, url: imageUrl });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(imageUrl);
        if (shareBtn) {
          const originalText = shareBtn.innerHTML;
          shareBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
          setTimeout(() => { shareBtn.innerHTML = originalText; }, 1200);
        }
        return;
      }

      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (error && error.name !== 'AbortError') {
        window.open(imageUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }

  function showImage(index) {
    if (index < 0) index = currentItems.length - 1;
    if (index >= currentItems.length) index = 0;
    currentIndex = index;

    const item = currentItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-title') || img.getAttribute('alt') || 'infronix Gallery';

    lightboxImg.src = img.src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    resetZoom();
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
    resetZoom();
  }

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + 0.2));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - 0.2));
  if (resetZoomBtn) resetZoomBtn.addEventListener('click', resetZoom);
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        lightbox.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }
  if (shareBtn) shareBtn.addEventListener('click', shareCurrentImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(zoomLevel + 0.1);
    } else {
      setZoom(zoomLevel - 0.1);
    }
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    } else if (e.key === '+' || e.key === '=') {
      setZoom(zoomLevel + 0.2);
    } else if (e.key === '-' || e.key === '_') {
      setZoom(zoomLevel - 0.2);
    }
  });
}
