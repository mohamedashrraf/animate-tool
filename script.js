const titleEl = document.getElementById('title');
const slideEl = document.getElementById('slide');
const captionEl = document.getElementById('caption');
const thumbsEl = document.getElementById('thumbs');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const slideCounter = document.getElementById('slideCounter');
const sourceLink = document.getElementById('sourceLink');
let slides = [];
let current = 0;

async function init() {
  try {
    const res = await fetch('data.json');
    const data = await res.json();

    document.documentElement.lang = data.lang || 'en';
    document.documentElement.dir = data.lang === 'ar' ? 'rtl' : 'ltr';

    titleEl.textContent = data.title || 'Presentation';

    slides = Array.isArray(data.slides) ? data.slides : [];
    if (slides.length === 0) {
      slideEl.innerHTML = '<div style="color:#fff;padding:20px">No slides found in data.json</div>';
      return;
    }

    buildThumbnails();
    showSlide(0);
  } catch (err) {
    console.error(err);
    slideEl.innerHTML = '<div style="color:#fff;padding:20px">خطأ في تحميل data.json</div>';
  }
}

function buildThumbnails() {
  thumbsEl.innerHTML = '';
  slides.forEach((s, idx) => {
    const t = document.createElement('div');
    t.className = 'thumb';
    t.dataset.index = idx;
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = s.src;
    img.alt = s.caption || `slide ${idx + 1}`;
    t.appendChild(img);
    t.addEventListener('click', () => showSlide(idx));
    thumbsEl.appendChild(t);
  });
}

function showSlide(idx) {
  if (idx < 0) idx = slides.length - 1;
  if (idx >= slides.length) idx = 0;
  current = idx;

  gsap.to(slideEl, {
    opacity: 0,
    duration: 0.22,
    onComplete: () => {
      slideEl.innerHTML = '';
      const img = document.createElement('img');
      img.src = slides[current].src;
      img.alt = slides[current].caption || `slide ${current + 1}`;
      slideEl.appendChild(img);
      gsap.fromTo(slideEl, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    },
  });

  captionEl.textContent = slides[current].caption || '';

  // إنشاء روابط المصدر
  const captionContainer = captionEl.parentElement;
  let oldSources = captionContainer.querySelector('.source-container');
  if (oldSources) oldSources.remove();

  const src = slides[current].source;
  const srcLabel = slides[current].sourceLabel || 'source';

  if (Array.isArray(src) && src.length > 0) {
    const container = document.createElement('div');
    container.className = 'source-container';
    src.forEach((link, i) => {
      const a = document.createElement('a');
      a.className = 'source-link';
      a.href = link;
      a.target = '_blank';
      a.textContent = srcLabel[i] || `source ${i + 1}`;
      container.appendChild(a);
    });
    captionContainer.appendChild(container);
  } else if (typeof src === 'string' && src.trim() !== '') {
    const container = document.createElement('div');
    container.className = 'source-container';
    const a = document.createElement('a');
    a.className = 'source-link';
    a.href = src;
    a.target = '_blank';
    a.textContent = 'source';
    container.appendChild(a);
    captionContainer.appendChild(container);
  }

  slideCounter.textContent = `${current + 1} / ${slides.length}`;

  document
    .querySelectorAll('.thumb')
    .forEach((t) => t.classList.toggle('active', Number(t.dataset.index) === current));
}

prevBtn.addEventListener('click', () => showSlide(current - 1));
nextBtn.addEventListener('click', () => showSlide(current + 1));

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') showSlide(current - 1);
  if (e.key === 'ArrowRight') showSlide(current + 1);
  if (e.key === 'f' || e.key === 'F') toggleFullscreen();
});

fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

init();
