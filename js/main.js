// ============================================
// LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });

// ============================================
// MOUSE-REACTIVE GRID BACKGROUND
// ============================================
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let mouseX = -1000, mouseY = -1000;
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spacing = 40;
  const maxDist = 200;

  for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / maxDist);

      const size = 1 + influence * 3;
      const alpha = 0.04 + influence * 0.25;

      const r = 116 + influence * 23;
      const g = 65 - influence * 15;
      const b = 143 + influence * 10;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }

  animFrame = requestAnimationFrame(drawGrid);
}

drawGrid();

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorRing = document.querySelector('.custom-cursor-ring');

let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
  if (!cursorVisible) {
    cursorVisible = true;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '0.6';
  }
  gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
  gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
});

document.addEventListener('mouseleave', () => {
  cursorVisible = false;
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});

// Scale ring on interactive element hover
document.querySelectorAll('a, button, .prompt-btn, .nav-cta, .btn-primary, .btn-secondary, .usecase-header, input').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// Initially hidden until mouse moves
cursorDot.style.opacity = '0';
cursorRing.style.opacity = '0';

// ============================================
// HERO GLOW FOLLOW
// ============================================
const heroSection = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero-glow');

heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  gsap.to(heroGlow, {
    x: e.clientX,
    y: e.clientY - rect.top + window.scrollY,
    duration: 0.3,
    ease: 'power2.out'
  });
});

// ============================================
// HERO PARTICLE TRAIL
// ============================================
const heroParticles = document.querySelector('.hero-particles');
let particleThrottle = 0;

heroSection.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - particleThrottle < 30) return; // throttle to ~33fps
  particleThrottle = now;

  const rect = heroSection.getBoundingClientRect();

  for (let i = 0; i < 2; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';

    const colors = ['rgba(116,65,143,0.8)', 'rgba(139,79,141,0.7)', 'rgba(196,166,197,0.6)', 'rgba(163,131,180,0.7)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 2 + Math.random() * 3;

    particle.style.cssText = `
      left: ${e.clientX - rect.left + (Math.random() - 0.5) * 20}px;
      top: ${e.clientY - rect.top + (Math.random() - 0.5) * 20}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

    heroParticles.appendChild(particle);

    gsap.to(particle, {
      opacity: 0,
      y: -(20 + Math.random() * 30),
      x: (Math.random() - 0.5) * 30,
      scale: 0,
      duration: 0.5 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    });
  }
});

// ============================================
// HERO MAGNETIC TEXT DISTORTION
// ============================================
const heroWords = document.querySelectorAll('.hero-headline .hero-word');
const magneticThreshold = 150;

heroSection.addEventListener('mousemove', (e) => {
  heroWords.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordCenterX = rect.left + rect.width / 2;
    const wordCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - wordCenterX;
    const dy = e.clientY - wordCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < magneticThreshold) {
      const force = (1 - dist / magneticThreshold) * 8;
      const pushX = -(dx / dist) * force;
      const pushY = -(dy / dist) * force;
      gsap.to(word, { x: pushX, y: pushY, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(word, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    }
  });
});

heroSection.addEventListener('mouseleave', () => {
  heroWords.forEach(word => {
    gsap.to(word, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

// ============================================
// HERO TEXT ANIMATION (on page load)
// ============================================
const heroTimeline = gsap.timeline({ delay: 0.3 });

// Set initial state
gsap.set('.hero-badge', { opacity: 0, y: 20 });
gsap.set('.hero-word', { opacity: 0, y: 30 });
gsap.set('.hero-sub', { opacity: 0 });
gsap.set('.hero-description', { opacity: 0, y: 20 });
gsap.set('.hero-ctas', { opacity: 0, y: 20 });
gsap.set('.scroll-indicator', { opacity: 0, y: 10 });

// Badge fades in
heroTimeline.to('.hero-badge', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

// Words animate in staggered
heroTimeline.to('.hero-word', {
  opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
}, '-=0.1');

// Glitch the word "Answers"
heroTimeline.call(() => {
  const glitchEl = document.querySelector('[data-glitch="true"]');
  if (glitchEl) {
    glitchEl.classList.add('glitch-active');
    setTimeout(() => glitchEl.classList.remove('glitch-active'), 400);
  }
}, null, '+=0.1');

// Typewriter for subtitle
const heroSub = document.querySelector('.hero-sub');
const subtitleText = heroSub.textContent;
heroSub.textContent = '';

heroTimeline.to('.hero-sub', { opacity: 1, duration: 0.1 }, '+=0.2');
heroTimeline.call(() => {
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 't-cursor';
  cursor.style.cssText = 'display:inline-block;width:8px;height:14px;background:var(--berry-2);animation:blink 1s infinite;vertical-align:middle;margin-left:2px;';
  heroSub.appendChild(cursor);

  function typeChar() {
    if (i < subtitleText.length) {
      cursor.before(subtitleText[i]);
      i++;
      setTimeout(typeChar, 30 + Math.random() * 20);
    } else {
      setTimeout(() => cursor.remove(), 1500);
    }
  }
  typeChar();
});

// Fade in rest
heroTimeline.to('.hero-description', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '+=0.3');
heroTimeline.to('.hero-ctas', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
heroTimeline.to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

// ============================================
// NAVIGATION SCROLL
// ============================================
const nav = document.getElementById('nav');
lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 50);
});

// ============================================
// GSAP SCROLL REVEAL — replacing IntersectionObserver
// ============================================

// Section title word-by-word animation
document.querySelectorAll('.section-title').forEach(title => {
  // Skip if already in hero (handled by hero animation)
  if (title.closest('.hero')) return;

  const html = title.innerHTML;
  // Split text nodes into words, preserving <br> and other tags
  const wrapped = html.replace(/([^\s<>]+)/g, '<span class="word" style="display:inline-block;opacity:0;transform:translateY(20px)">$1</span>');
  title.innerHTML = wrapped;

  ScrollTrigger.create({
    trigger: title,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(title.querySelectorAll('.word'), {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out'
      });
    }
  });
});

// Cards and elements — scroll reveal with scale
const revealSelectors = '.pain-card, .pillar-card, .step-item, .integration-item, .usecase-item, .proof-quote';

document.querySelectorAll(revealSelectors).forEach(el => {
  const delay = parseInt(el.dataset.delay || '0') / 1000;

  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.fromTo(el,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: delay, ease: 'power2.out',
          onStart: () => el.classList.add('visible')
        }
      );
    }
  });
});

// Section labels and descriptions
document.querySelectorAll('.section-label, .section-desc').forEach(el => {
  if (el.closest('.hero') || el.closest('.demo-header')) return;

  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  });
});

// ============================================
// ANIMATED COUNTERS (via ScrollTrigger)
// ============================================
const counterElements = document.querySelectorAll('.pain-number[data-target]');

counterElements.forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter: () => animateCounter(el)
  });
});

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// Pain number parallax float
document.querySelectorAll('.pain-number').forEach(el => {
  gsap.to(el, {
    y: -10,
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
});

// ============================================
// PARALLAX — GSAP ScrollTrigger based
// ============================================
const heroContent = document.querySelector('.hero-content');

gsap.to(heroContent, {
  y: 120,
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

// Section background parallax
document.querySelectorAll('.pain-section, .usecases-section').forEach(section => {
  gsap.to(section, {
    backgroundPosition: '50% 30%',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
});

// ============================================
// INTERACTIVE TERMINAL DEMO
// ============================================
const demos = [
  {
    title: 'Due Diligence',
    lines: [
      { type: 'system', text: '◈ Connected to fund data room — 347 files indexed' },
      { type: 'prompt', text: '▸ ' },
      { type: 'user', text: 'Pull the key financial metrics from the Riverside CIM and compare against our underwriting assumptions.' },
      { type: 'system', text: '⟳ Searching 347 documents... 3 sources identified' },
      { type: 'response', text: 'Revenue: $24.3M (CIM) vs $22.8M (our model) — <span class="t-accent">+6.6% variance</span>' },
      { type: 'response', text: 'EBITDA margin: 31.2% (CIM) vs 28.5% (model) — CIM includes one-time licensing revenue of $890K' },
      { type: 'response', text: 'Net debt: $8.1M — within covenant threshold of $12M' },
      { type: 'source', text: '⌇ Sources: Riverside_CIM_Q3.pdf (p.14, 27), Fund_III_Model_v4.xlsx (tab: Assumptions), LP_Side_Letter_2024.docx (§4.2)' },
      { type: 'system', text: '✓ Comparison table exported to Fund_III_Riverside_Analysis.xlsx' },
    ]
  },
  {
    title: 'LP Reporting',
    lines: [
      { type: 'system', text: '◈ Connected to fund entity — 812 files indexed' },
      { type: 'prompt', text: '▸ ' },
      { type: 'user', text: 'Draft the Q4 LP letter for Fund II. Include performance summary, notable exits, and pipeline commentary.' },
      { type: 'system', text: '⟳ Analyzing portfolio data, prior LP letters, and exit memos...' },
      { type: 'response', text: 'Fund II returned <span class="t-accent">18.4% net IRR</span> for Q4, driven by the Apex Health exit at 3.2x MOIC.' },
      { type: 'response', text: 'Two follow-on investments closed: Sterling Logistics ($4.2M) and Novus Data ($2.8M).' },
      { type: 'response', text: 'Pipeline includes 6 active opportunities — 2 at term sheet stage.' },
      { type: 'source', text: '⌇ Sources: Fund_II_NAV_Q4.xlsx, Apex_Exit_Memo.pdf, Pipeline_Tracker.xlsx, Q3_LP_Letter.docx (for tone/format)' },
      { type: 'system', text: '✓ Draft exported to Fund_II_Q4_LP_Letter.docx — formatted per prior quarter template' },
    ]
  },
  {
    title: 'Rent Roll',
    lines: [
      { type: 'system', text: '◈ Connected to property portfolio — 156 files indexed' },
      { type: 'prompt', text: '▸ ' },
      { type: 'user', text: 'Extract and standardize rent rolls for the 42nd Street property. Match format from last quarter.' },
      { type: 'system', text: '⟳ Processing 42ndSt_RentRoll_Raw.pdf... running extraction workflow "Rent Roll Standardization"' },
      { type: 'response', text: '<span class="t-accent">47 units</span> extracted. 3 vacant. Avg rent: $4,280/mo. Occupancy: 93.6%.' },
      { type: 'response', text: 'Floor assignments inferred from unit numbering scheme (1xx = Floor 1, etc.)' },
      { type: 'response', text: 'Lease expiration clustering: 18 units expire Q2 2026 — flagged for renewal planning.' },
      { type: 'source', text: '⌇ Sources: 42ndSt_RentRoll_Raw.pdf, Previous: 42ndSt_Q3_Standardized.xlsx (format template)' },
      { type: 'system', text: '✓ Exported to 42ndSt_Q4_RentRoll_Standardized.xlsx — 47 rows, 14 columns, format matched' },
    ]
  }
];

let currentDemo = 0;
let demoRunning = false;

function runDemo(index) {
  if (demoRunning) return;

  // Update active button
  document.querySelectorAll('.prompt-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  currentDemo = index;
  demoRunning = true;

  const body = document.getElementById('terminal-body');
  body.innerHTML = '';

  const demo = demos[index];
  let lineIndex = 0;

  function addLine() {
    if (lineIndex >= demo.lines.length) {
      demoRunning = false;
      return;
    }

    const line = demo.lines[lineIndex];
    const el = document.createElement('div');
    el.className = 'terminal-line';

    if (line.type === 'prompt') {
      el.innerHTML = `<span class="t-prompt">${line.text}</span>`;
      el.classList.add('visible');
      body.appendChild(el);
      lineIndex++;
      // Next line is user input — type it out
      if (lineIndex < demo.lines.length && demo.lines[lineIndex].type === 'user') {
        const userLine = demo.lines[lineIndex];
        const userEl = body.lastElementChild;
        typeText(userEl, userLine.text, () => {
          lineIndex++;
          setTimeout(addLine, 400);
        });
      } else {
        setTimeout(addLine, 200);
      }
      return;
    }

    if (line.type === 'user') {
      // Should be handled by prompt case above
      lineIndex++;
      setTimeout(addLine, 200);
      return;
    }

    let cls = 't-' + line.type;
    el.innerHTML = `<span class="${cls}">${line.text}</span>`;
    body.appendChild(el);

    // Scroll terminal
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      el.classList.add('visible');
      lineIndex++;
      const nextDelay = line.type === 'system' ? 600 : 350;
      setTimeout(addLine, nextDelay);
    }, 50);
  }

  addLine();
}

function typeText(container, text, callback) {
  const span = document.createElement('span');
  span.className = 't-user';
  container.appendChild(span);

  const cursor = document.createElement('span');
  cursor.className = 't-cursor';
  container.appendChild(cursor);

  let i = 0;
  const speed = 25;

  function type() {
    if (i < text.length) {
      span.textContent += text[i];
      i++;
      setTimeout(type, speed + Math.random() * 20);
    } else {
      cursor.remove();
      if (callback) setTimeout(callback, 300);
    }
  }

  type();
}

// Auto-start first demo when in view
ScrollTrigger.create({
  trigger: '.terminal-frame',
  start: 'top 70%',
  once: true,
  onEnter: () => setTimeout(() => runDemo(0), 500)
});

// ============================================
// USE CASE ACCORDION
// ============================================
function toggleUsecase(header) {
  const item = header.parentElement;
  const body = item.querySelector('.usecase-body');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.usecase-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.usecase-body').style.maxHeight = '0';
  });

  // Open clicked (if it was closed)
  if (!isOpen) {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

// ============================================
// CTA FORM
// ============================================
function handleSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('.cta-input');
  const btn = e.target.querySelector('.cta-submit');
  const originalText = btn.textContent;

  btn.textContent = 'Sent ✓';
  btn.style.background = 'var(--green)';
  btn.style.borderColor = '#39FF14 #1A7A0A #1A7A0A #39FF14';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.borderColor = '';
    input.value = '';
  }, 3000);
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS (via Lenis)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    }
  });
});
