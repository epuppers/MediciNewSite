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

// ========== CHAT DEMOS ==========
const chatDemos = [
  {
    context: 'Alpine Capital III · 847 documents · 2.4GB indexed',
    messages: [
      { role: 'user', text: 'What are our co-invest obligations to LPs?' },
      {
        role: 'cosimo',
        text: 'Co-investment rights are offered pro-rata to LPs committing ≥$25M, with a 10 business day notice period per Section 4.2(b) of the LPA. Meridian has an additional first-look provision in their side letter.',
        citations: [
          'LPA_AlpineIII_Final.pdf — p.34, §4.2(b)',
          'SideLetter_Meridian_2024.pdf — p.7',
          'IC_Memo_CoInvest_Policy.docx — p.2'
        ]
      },
      { role: 'user', text: 'Draft the co-invest notice for Meridian' },
      {
        role: 'cosimo',
        text: 'Done. I\'ve drafted the notice using the terms from their side letter and the LPA requirements. The 10-day notice window and pro-rata allocation are referenced with source citations.',
        citations: [
          'SideLetter_Meridian_2024.pdf — p.7',
          'LPA_AlpineIII_Final.pdf — p.34'
        ],
        artifact: { name: 'meridian_coinvest_notice.pdf', meta: 'Co-invest notice · 2 pages · source-cited' }
      }
    ]
  },
  {
    context: 'Alpine Capital III · Q3 2025 reporting cycle',
    messages: [
      { role: 'user', text: 'Generate the quarterly performance summary for all LPs' },
      {
        role: 'cosimo',
        text: 'Aggregated across 12 portfolio companies. Net IRR: 18.3% | TVPI: 1.42x | DPI: 0.31x. All figures cross-referenced against capital account statements and NAV reports.',
        citations: [
          'NAV_Q3_2025_Final.xlsx — all tabs',
          'CapitalAccounts_Master.xlsx — Sheet "Fund III"',
          'PortCo_Valuations_Q3.pdf — p.1-12'
        ]
      },
      { role: 'user', text: 'Format as LP letter using our standard template' },
      {
        role: 'cosimo',
        text: 'Formatted using your Q2 letter as a template. Performance metrics, portfolio company updates, and capital account summaries are included with full source citations.',
        citations: [
          'Q2_LP_Letter_Template.docx — formatting reference',
          'NAV_Q3_2025_Final.xlsx — performance data'
        ],
        artifact: { name: 'Q3_2025_LP_Letter.pdf', meta: 'Quarterly LP letter · 8 pages · 47 data points validated' }
      }
    ]
  },
  {
    context: 'Summit RE Holdings · 8 properties · 23 rent roll PDFs uploaded',
    messages: [
      { role: 'user', text: 'Extract and standardize all rent rolls into one view' },
      {
        role: 'cosimo',
        text: 'Extracted 1,847 unit records across 8 properties. Standardized fields: unit #, tenant, lease dates, base rent, recoveries. Flagged 12 discrepancies vs. prior quarter — 3 expired leases with active tenants, 9 rent amounts inconsistent with amendments.',
        citations: [
          'RentRoll_Parkview_Q3.pdf — 312 units',
          'RentRoll_Summit_Tower.pdf — 204 units',
          'LeaseAmendments_2024/ — 9 files'
        ]
      },
      { role: 'user', text: 'Export to our underwriting model format' },
      {
        role: 'cosimo',
        text: 'Exported to your underwriting template. Discrepancy flags are included as a separate tab with source references for each issue.',
        citations: [
          'UW_Template_v3.xlsx — format reference',
          'Prior_Quarter_RentRolls/ — comparison baseline'
        ],
        artifact: { name: 'portfolio_master_rentrolls.xlsx', meta: 'Rent roll extract · 1,847 units · 12 flags' }
      }
    ]
  }
];

let chatRunning = false;

function runChatDemo(index) {
  if (chatRunning) return;
  chatRunning = true;

  document.querySelectorAll('.chat-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  const body = document.getElementById('chat-body');
  body.innerHTML = '';

  const demo = chatDemos[index];

  // Show context indicator
  const ctxEl = document.createElement('div');
  ctxEl.className = 'chat-context';
  ctxEl.textContent = demo.context;
  body.appendChild(ctxEl);
  requestAnimationFrame(() => ctxEl.classList.add('visible'));

  let msgIndex = 0;
  let delay = 600;

  function playNext() {
    if (msgIndex >= demo.messages.length) {
      chatRunning = false;
      return;
    }

    const msg = demo.messages[msgIndex];
    msgIndex++;

    if (msg.role === 'user') {
      const msgEl = createChatMsg(msg);
      body.appendChild(msgEl);
      body.scrollTop = body.scrollHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          msgEl.classList.add('visible');
        });
      });
      setTimeout(playNext, 800);
    } else {
      // Show thinking dots first
      const thinkEl = document.createElement('div');
      thinkEl.className = 'chat-thinking';
      thinkEl.innerHTML = '<div class="chat-thinking-dot"></div><div class="chat-thinking-dot"></div><div class="chat-thinking-dot"></div>';
      body.appendChild(thinkEl);
      body.scrollTop = body.scrollHeight;

      setTimeout(() => {
        thinkEl.remove();
        const msgEl = createChatMsg(msg);
        body.appendChild(msgEl);
        body.scrollTop = body.scrollHeight;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            msgEl.classList.add('visible');
          });
        });
        setTimeout(playNext, 1000);
      }, 1200);
    }
  }

  setTimeout(playNext, delay);
}

function createChatMsg(msg) {
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg ' + msg.role;

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar ' + msg.role;
  avatar.textContent = msg.role === 'cosimo' ? 'C' : 'U';
  msgEl.appendChild(avatar);

  // Bubble
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = msg.text;
  msgEl.appendChild(bubble);

  // Citations (cosimo only)
  if (msg.citations && msg.citations.length) {
    const citeWrap = document.createElement('div');
    citeWrap.className = 'chat-citations';
    msg.citations.forEach(c => {
      const cite = document.createElement('div');
      cite.className = 'chat-cite';
      cite.textContent = '↳ ' + c;
      citeWrap.appendChild(cite);
    });
    msgEl.appendChild(citeWrap);
  }

  // Artifact (cosimo only)
  if (msg.artifact) {
    const art = document.createElement('div');
    art.className = 'chat-artifact';
    art.innerHTML =
      '<div class="chat-artifact-icon">✓</div>' +
      '<div class="chat-artifact-info">' +
        '<div class="chat-artifact-name">' + msg.artifact.name + '</div>' +
        '<div class="chat-artifact-meta">' + msg.artifact.meta + '</div>' +
      '</div>';
    msgEl.appendChild(art);
  }

  return msgEl;
}

// Tab click handlers
document.querySelectorAll('.chat-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const index = parseInt(btn.getAttribute('data-demo'), 10);
    runChatDemo(index);
  });
});

// Auto-start first demo when chat frame scrolls into view
ScrollTrigger.create({
  trigger: '.chat-frame',
  start: 'top 70%',
  once: true,
  onEnter: () => setTimeout(() => runChatDemo(0), 500)
});
