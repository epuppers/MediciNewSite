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
// NAVIGATION SCROLL
// ============================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ============================================
// SCROLL REVEAL — INTERSECTION OBSERVER
// ============================================
const revealElements = document.querySelectorAll('.pain-card, .pillar-card, .usecase-item, .proof-quote');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// ANIMATED COUNTERS
// ============================================
const counterElements = document.querySelectorAll('.pain-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

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
const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => runDemo(0), 500);
      terminalObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

terminalObserver.observe(document.querySelector('.terminal-frame'));

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
  btn.style.borderColor = '#5aad5c #2a6b2c #2a6b2c #5aad5c';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.borderColor = '';
    input.value = '';
  }, 3000);
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// PARALLAX — subtle depth effect on hero
// ============================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector('.hero-content');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.15}px)`;
    hero.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
  }
});
