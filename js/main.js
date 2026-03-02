// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('medici-theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}
themeToggle.innerHTML = document.documentElement.getAttribute('data-theme') === 'light' ? '&#9728;' : '&#9790;';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('medici-theme', next);
  themeToggle.innerHTML = next === 'light' ? '&#9728;' : '&#9790;';
});

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

// ========== GSAP SCROLL REVEALS ==========

// Terminal section
gsap.from('.terminal-intro-right', {
  opacity: 0, y: 20, duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.terminal-intro', start: 'top 80%', once: true }
});
gsap.from('.terminal-stage', {
  opacity: 0, y: 30, duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.terminal-stage', start: 'top 85%', once: true }
});

// Pain section
gsap.from('.pain-label', {
  opacity: 0, y: 20, duration: 0.6,
  scrollTrigger: { trigger: '.pain-section', start: 'top 80%', once: true }
});
gsap.set('.pain-item', { opacity: 0, y: 30 });
ScrollTrigger.create({
  trigger: '.pain-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.to('.pain-item', {
      opacity: 1, y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

// Architecture cards stagger
gsap.set('.arch-card', { opacity: 0, y: 40 });
ScrollTrigger.create({
  trigger: '.arch-grid',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.arch-card', {
      opacity: 1, y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

// Case cards stagger
gsap.set('.case-card', { opacity: 0, y: 40 });
ScrollTrigger.create({
  trigger: '.cases-grid',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.case-card', {
      opacity: 1, y: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

// Quote cards stagger
gsap.set('.quote-card', { opacity: 0, y: 30 });
ScrollTrigger.create({
  trigger: '.quotes-grid',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.quote-card', {
      opacity: 1, y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
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
splitWordsAndAnimate('.pain-headline');
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
