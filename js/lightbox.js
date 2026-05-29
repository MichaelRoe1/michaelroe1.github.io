(() => {
  const galleries = document.querySelectorAll('.gallery');
  if (!galleries.length) return;

  let overlay, figure, imgEl, btnPrev, btnNext, btnClose;
  let items = [];
  let index = 0;
  let lastTrigger = null;
  let touchStartX = null;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Photo viewer');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.tabIndex = -1;

    figure = document.createElement('figure');
    figure.className = 'lightbox-figure';
    imgEl = document.createElement('img');
    imgEl.alt = '';
    figure.appendChild(imgEl);

    btnClose = makeBtn('lightbox-close', 'Close', '×');
    btnPrev = makeBtn('lightbox-prev', 'Previous photo', '‹');
    btnNext = makeBtn('lightbox-next', 'Next photo', '›');

    overlay.append(figure, btnPrev, btnNext, btnClose);
    document.body.appendChild(overlay);

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => step(-1));
    btnNext.addEventListener('click', () => step(1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.addEventListener('touchstart', onTouchStart, { passive: true });
    overlay.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  function makeBtn(cls, label, glyph) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lightbox-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.textContent = glyph;
    return b;
  }

  function collectItems(gallery) {
    return Array.from(gallery.querySelectorAll('button[data-full]')).map((btn) => ({
      btn,
      src: btn.dataset.full,
      alt: btn.dataset.alt || '',
    }));
  }

  function open(gallery, startBtn) {
    if (!overlay) buildOverlay();
    items = collectItems(gallery);
    index = items.findIndex((it) => it.btn === startBtn);
    if (index < 0) index = 0;
    lastTrigger = startBtn;

    show(index);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    btnClose.focus();
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', trapFocus);
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('focusin', trapFocus);
    if (lastTrigger) lastTrigger.focus();
  }

  function show(i) {
    const it = items[i];
    imgEl.src = it.src;
    imgEl.alt = it.alt;
    preload(i + 1);
    preload(i - 1);
    const single = items.length <= 1;
    btnPrev.style.display = single ? 'none' : '';
    btnNext.style.display = single ? 'none' : '';
  }

  function preload(i) {
    if (i < 0 || i >= items.length) return;
    const p = new Image();
    p.src = items[i].src;
  }

  function step(delta) {
    index = (index + delta + items.length) % items.length;
    show(index);
  }

  function onKey(e) {
    switch (e.key) {
      case 'Escape': e.preventDefault(); close(); break;
      case 'ArrowLeft': e.preventDefault(); step(-1); break;
      case 'ArrowRight': e.preventDefault(); step(1); break;
      case 'Tab': /* trap handled in focusin */ break;
    }
  }

  function trapFocus(e) {
    if (!overlay.contains(e.target)) {
      e.stopPropagation();
      btnClose.focus();
    }
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }

  galleries.forEach((gallery) => {
    gallery.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-full]');
      if (btn) open(gallery, btn);
    });
  });
})();
