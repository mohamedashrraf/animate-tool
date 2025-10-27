const slidesEl = document.getElementById('slides');
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsEl = document.getElementById('dots');
const actionButtons = document.getElementById('actionButtons');
const title = document.getElementById('title');
const desc = document.getElementById('desc');

let current = 0;
const total = slides.length;
let autoplay = true;
let timer = null;
const autoplayDelay = 4500;

const slideConfig = [
  {
    title: 'Construct3',
    desc: '',
    buttons: [
      { text: 'Visit Pronoun Construct', href: 'https://pronoun-construct.vercel.app/' },
      { text: 'Visit Game Construct', href: 'https://game-construct.vercel.app/', secondary: true }
    ]
  },
  {
    title: 'GSAP',
    desc: '',
    buttons: [
      { text: 'Visit Pronoun GSAP', href: 'https://pronoun-gsap.vercel.app/' }
    ]
  },
  {
    title: 'Adobe Captivate ',
    desc: '    ',
    buttons: []
  }
];


function buildDots() {
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.dataset.index = i;
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }
}

function renderButtonsFor(idx) {
  actionButtons.innerHTML = '';
  const cfg = slideConfig[idx];
  title.textContent = cfg.title;
  desc.textContent = cfg.desc;
  cfg.buttons.forEach(b => {
    const btn = document.createElement('a');
    btn.className = 'btn' + (b.secondary ? ' secondary' : '');
    btn.textContent = b.text;
    btn.href = b.href;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    actionButtons.appendChild(btn);
  });
}

function updateActive() {
  // إزالة وتفعيل الكلاس active لكل سلايد
  slides.forEach((s, i) => s.classList.toggle('active', i === current));

  // تحريك السلايد الحالية إلى منتصف العرض
  slidesEl.style.transform = `translateX(${-current * 100}%)`;

  // تحديث النقاط
  Array.from(dotsEl.children).forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );

  // عرض الأزرار والعنوان والوصف المناسبين
  renderButtonsFor(current);
}


function goTo(i) {
  current = (i + total) % total;
  updateActive();
}

// الأسهم
document.getElementById('prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('next').addEventListener('click', () => goTo(current + 1));

// المؤشرات
buildDots();
updateActive();