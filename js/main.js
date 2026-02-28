// ========== LENIS SMOOTH SCROLL ==========
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Integrate Lenis with GSAP
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Nav smooth scroll via Lenis
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) lenis.scrollTo(target);
  });
});

// ========== CUSTOM CURSOR ==========
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorRing = document.querySelector('.custom-cursor-ring');
let mouseX = 0, mouseY = 0;
let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!cursorVisible) {
    cursorVisible = true;
    gsap.to(cursorDot, { opacity: 1, duration: 0.3 });
    gsap.to(cursorRing, { opacity: 0.5, duration: 0.3 });
  }

  // Dot follows instantly
  gsap.set(cursorDot, { x: mouseX, y: mouseY });
  // Ring follows with lag
  gsap.to(cursorRing, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
});

document.addEventListener('mouseleave', () => {
  cursorVisible = false;
  gsap.to(cursorDot, { opacity: 0, duration: 0.3 });
  gsap.to(cursorRing, { opacity: 0, duration: 0.3 });
});

// Scale ring on interactive hover
document.querySelectorAll('a, button, .term-tab, .btn-main, .btn-line').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ========== HERO CURSOR EFFECTS ==========
const heroSection = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero-glow');
const heroParticles = document.querySelector('.hero-particles');
const particleColors = ['#74418F', '#9563AF', '#B084C8', '#5C2D7E'];

heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Radial glow follows cursor
  gsap.to(heroGlow, {
    left: x, top: y,
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out'
  });

  // Spawn particle
  if (Math.random() > 0.6) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = x + (Math.random() - 0.5) * 20 + 'px';
    particle.style.top = y + (Math.random() - 0.5) * 20 + 'px';
    particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
    heroParticles.appendChild(particle);

    gsap.to(particle, {
      opacity: 0,
      y: -30 + Math.random() * -20,
      x: (Math.random() - 0.5) * 30,
      scale: 0,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    });
  }
});

heroSection.addEventListener('mouseleave', () => {
  gsap.to(heroGlow, { opacity: 0, duration: 0.6 });
});

// ========== HERO TEXT ANIMATION (GSAP) ==========
const heroTl = gsap.timeline({ delay: 0.3 });

// Status bar fade in
heroTl.to('.hero-status', { opacity: 1, duration: 0.6, ease: 'power2.out' });

// Headline lines reveal
heroTl.to('.h-line:nth-child(1) span', {
  opacity: 1, y: 0, duration: 0.9,
  ease: 'power3.out'
}, '-=0.2');
heroTl.to('.h-line:nth-child(2) span', {
  opacity: 1, y: 0, duration: 0.9,
  ease: 'power3.out'
}, '-=0.6');

// Glitch on "intelligence." after it reveals
heroTl.add(() => {
  const italicSpan = document.querySelector('.h-italic');
  if (italicSpan) {
    italicSpan.classList.add('glitch-active');
    setTimeout(() => italicSpan.classList.remove('glitch-active'), 400);
  }
}, '-=0.1');

// Subtitle line
heroTl.to('.h-line:nth-child(3) span', {
  opacity: 1, y: 0, duration: 0.9,
  ease: 'power3.out'
}, '-=0.3');

// Hero bottom CTAs and scroll hint
heroTl.to('.hero-bottom', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');

// ========== HERO PARALLAX ==========
gsap.to('.hero-content', {
  y: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

gsap.to('.hero-glyph', {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// ========== GSAP SCROLL REVEALS (replaces IntersectionObserver) ==========
document.querySelectorAll('.reveal').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true
    }
  });
});

// Architecture cards stagger
gsap.from('.arch-card', {
  opacity: 0,
  y: 40,
  scale: 0.97,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.arch-grid',
    start: 'top 80%',
    once: true
  }
});

// Case cards stagger
gsap.from('.case-card', {
  opacity: 0,
  y: 40,
  scale: 0.97,
  stagger: 0.12,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.cases-grid',
    start: 'top 80%',
    once: true
  }
});

// Quote section elements
gsap.from('.quote-big-mark', {
  opacity: 0, scale: 0.8, duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.quote-section', start: 'top 75%', once: true }
});
gsap.from('.quote-text', {
  opacity: 0, y: 30, duration: 1, delay: 0.2,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.quote-section', start: 'top 75%', once: true }
});
gsap.from('.quote-attr', {
  opacity: 0, y: 20, duration: 0.8, delay: 0.4,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.quote-section', start: 'top 75%', once: true }
});

// CTA section
gsap.from('.cta-label', {
  opacity: 0, y: 20, duration: 0.6,
  scrollTrigger: { trigger: '.cta-section', start: 'top 80%', once: true }
});
gsap.from('.cta-headline', {
  opacity: 0, y: 30, duration: 0.8, delay: 0.1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.cta-section', start: 'top 80%', once: true }
});
gsap.from('.cta-sub', {
  opacity: 0, y: 20, duration: 0.8, delay: 0.2,
  scrollTrigger: { trigger: '.cta-section', start: 'top 80%', once: true }
});
gsap.from('.cta-actions', {
  opacity: 0, y: 20, duration: 0.8, delay: 0.3,
  scrollTrigger: { trigger: '.cta-section', start: 'top 80%', once: true }
});

// ========== SECTION HEADERS — WORD-BY-WORD REVEAL ==========
function splitWordsAndAnimate(selector) {
  document.querySelectorAll(selector).forEach(heading => {
    // Skip if already processed
    if (heading.querySelector('.word-span')) return;

    const html = heading.innerHTML;
    // Split by words but preserve HTML tags like <em>, <br>
    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');
    temp.innerHTML = html;

    function processNode(node) {
      if (node.nodeType === 3) { // Text node
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement('span');
            span.className = 'word-span';
            span.textContent = word;
            fragment.appendChild(span);
          }
        });
      } else if (node.nodeName === 'BR') {
        fragment.appendChild(document.createElement('br'));
      } else if (node.nodeType === 1) { // Element node
        const clone = document.createElement(node.nodeName.toLowerCase());
        Array.from(node.attributes).forEach(attr => clone.setAttribute(attr.name, attr.value));
        const innerFrag = document.createDocumentFragment();
        node.childNodes.forEach(child => {
          const oldFragment = fragment;
          // Process into a temp fragment
          const tempFrag = document.createDocumentFragment();
          processNodeInto(child, tempFrag);
          // Append to clone
          clone.appendChild(tempFrag);
        });
        fragment.appendChild(clone);
      }
    }

    function processNodeInto(node, target) {
      if (node.nodeType === 3) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            target.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement('span');
            span.className = 'word-span';
            span.textContent = word;
            target.appendChild(span);
          }
        });
      } else if (node.nodeName === 'BR') {
        target.appendChild(document.createElement('br'));
      } else if (node.nodeType === 1) {
        const clone = document.createElement(node.nodeName.toLowerCase());
        Array.from(node.attributes).forEach(attr => clone.setAttribute(attr.name, attr.value));
        node.childNodes.forEach(child => processNodeInto(child, clone));
        target.appendChild(clone);
      }
    }

    heading.innerHTML = '';
    temp.childNodes.forEach(child => processNodeInto(child, heading));

    // Animate word spans on scroll
    const words = heading.querySelectorAll('.word-span');
    gsap.to(words, {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        once: true
      }
    });
  });
}

splitWordsAndAnimate('.terminal-intro-left h2');
splitWordsAndAnimate('.arch-header h2');
splitWordsAndAnimate('.cases-header h2');

// ========== ARCH HEADER NUM PARALLAX ==========
gsap.to('.arch-header-num', {
  y: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.arch-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// ========== TERMINAL DEMOS (preserved) ==========
const demos = [
  {
    lines: [
      { type: 'cmd', text: 'load --fund "Alpine Capital III"' },
      { type: 'dim', text: '▸ 847 documents indexed · 2.4GB · ready' },
      { type: 'gap' },
      { type: 'cmd', text: '"What are our co-invest obligations to LPs?"' },
      { type: 'r', text: 'Searching LP agreements, side letters, partnership docs...' },
      { type: 'g', text: '■ Found 3 relevant provisions' },
      { type: 'r', text: 'Co-investment rights offered pro-rata to LPs committing ≥$25M,' },
      { type: 'r', text: 'with 10 business day notice period per Section 4.2(b) of the LPA.' },
      { type: 's', text: '↳ LPA_AlpineIII_Final.pdf — p.34, §4.2(b)' },
      { type: 's', text: '↳ SideLetter_Meridian_2024.pdf — p.7' },
      { type: 's', text: '↳ IC_Memo_CoInvest_Policy.docx — p.2' },
      { type: 'gap' },
      { type: 'cmd', text: '"Draft the co-invest notice for Meridian"' },
      { type: 'g', text: '✓ Generated → /output/notices/meridian_coinvest.pdf', final: true },
    ]
  },
  {
    lines: [
      { type: 'cmd', text: 'context --scope "Q3 2025 LP Report"' },
      { type: 'dim', text: '▸ Loaded: NAV statements, capital accounts, portfolio data' },
      { type: 'gap' },
      { type: 'cmd', text: '"Generate quarterly performance summary for all LPs"' },
      { type: 'r', text: 'Aggregating across 12 portfolio companies...' },
      { type: 'r', text: 'Cross-referencing capital account statements...' },
      { type: 'g', text: '■ Report compiled — 47 data points validated' },
      { type: 'r', text: 'Net IRR: 18.3% | TVPI: 1.42x | DPI: 0.31x' },
      { type: 's', text: '↳ NAV_Q3_2025_Final.xlsx — all tabs' },
      { type: 's', text: '↳ CapitalAccounts_Master.xlsx — Sheet "Fund III"' },
      { type: 'gap' },
      { type: 'cmd', text: '"Format as LP letter using our standard template"' },
      { type: 'g', text: '✓ Generated → /output/reports/Q3_LP_Letter.pdf', final: true },
    ]
  },
  {
    lines: [
      { type: 'cmd', text: 'ingest ./uploads/portfolio_rentrolls/*.pdf' },
      { type: 'dim', text: '▸ Processing 23 rent roll PDFs across 8 properties...' },
      { type: 'dim', text: '▸ OCR complete · Extracting unit-level data...' },
      { type: 'gap' },
      { type: 'g', text: '■ Extracted 1,847 unit records' },
      { type: 'r', text: 'Standardized: unit #, tenant, lease dates, base rent, recoveries' },
      { type: 'r', text: 'Flagged 12 discrepancies vs. prior quarter data' },
      { type: 's', text: '↳ 3 expired leases with active tenants' },
      { type: 's', text: '↳ 9 rent amounts inconsistent with amendments' },
      { type: 'gap' },
      { type: 'cmd', text: '"Export to our underwriting model format"' },
      { type: 'g', text: '✓ Exported → /output/rentrolls/portfolio_master.xlsx' },
      { type: 'g', text: '✓ Discrepancy report → /output/rentrolls/flags.pdf', final: true },
    ]
  }
];

let demoRunning = false;

function runDemo(index) {
  if (demoRunning) return;
  demoRunning = true;

  document.querySelectorAll('.term-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  const body = document.getElementById('terminal-body');
  body.innerHTML = '';

  const demo = demos[index];
  let i = 0;

  function addLine() {
    if (i >= demo.lines.length) {
      demoRunning = false;
      return;
    }

    const line = demo.lines[i];
    i++;

    if (line.type === 'gap') {
      const gap = document.createElement('div');
      gap.className = 'gap';
      body.appendChild(gap);
      setTimeout(addLine, 100);
      return;
    }

    if (line.type === 'cmd') {
      const el = document.createElement('div');
      el.className = 'term-line visible';
      const prompt = document.createElement('span');
      prompt.className = 'p';
      prompt.textContent = 'medici λ ';
      el.appendChild(prompt);

      const cmdSpan = document.createElement('span');
      cmdSpan.className = 'c';
      el.appendChild(cmdSpan);

      const cursor = document.createElement('span');
      cursor.className = 't-cursor';
      el.appendChild(cursor);

      body.appendChild(el);
      body.scrollTop = body.scrollHeight;

      let ci = 0;
      function typeChar() {
        if (ci < line.text.length) {
          cmdSpan.textContent += line.text[ci];
          ci++;
          setTimeout(typeChar, 22 + Math.random() * 18);
        } else {
          cursor.remove();
          setTimeout(addLine, 400);
        }
      }
      typeChar();
      return;
    }

    const el = document.createElement('div');
    el.className = 'term-line';

    if (line.type === 'dim') {
      el.innerHTML = '<span class="d">' + line.text + '</span>';
    } else if (line.type === 'g') {
      const inner = '<span class="g">' + line.text + '</span>';
      if (line.final) {
        el.innerHTML = '<span class="r">' + inner + '<span class="cursor-blink"></span></span>';
      } else {
        el.innerHTML = '<span class="r">' + inner + '</span>';
      }
    } else if (line.type === 's') {
      el.innerHTML = '<span class="r"><span class="s">' + line.text + '</span></span>';
    } else {
      el.innerHTML = '<span class="r">' + line.text + '</span>';
    }

    body.appendChild(el);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      el.classList.add('visible');
      const delay = line.type === 'dim' ? 500 : 300;
      setTimeout(addLine, delay);
    }, 50);
  }

  addLine();
}

// Auto-start first demo when terminal scrolls into view (ScrollTrigger)
ScrollTrigger.create({
  trigger: '.terminal-frame',
  start: 'top 70%',
  once: true,
  onEnter: () => setTimeout(() => runDemo(0), 500)
});
