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

// ========== TYPEWRITER ENGINE ==========
const topLines = [
  'Quarterly close.', 'K-1 packages.', 'Due diligence.',
  'LP reports.', 'Audit prep.', 'Rent roll extraction.',
  'Board prep.', 'Portfolio review.', 'Capital call notices.',
  'Waterfall calculations.', 'Compliance filings.', 'Investor onboarding.'
];

const bottomLines = [
  'Before lunch.', 'Before your coffee cools.',
  'Before the meeting.', 'Before anyone asks.',
  'Before you get home.', 'Before Monday.',
  'Before the partners ask.', 'Before your first call.'
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randBetween(min, max) {
  return min + Math.random() * (max - min);
}

// Shared coordinator — enforces a 3s quiet window where both lines are static
const typewriterCoord = {
  lastAnimEnd: 0,
  quietWindow: 3000,

  requestStart(callback) {
    const now = Date.now();
    const elapsed = now - this.lastAnimEnd;
    if (elapsed >= this.quietWindow) {
      callback();
    } else {
      setTimeout(callback, this.quietWindow - elapsed);
    }
  },

  reportLanded() {
    this.lastAnimEnd = Date.now();
  }
};

function createTypewriter(element, lines, cycleDuration, coord) {
  const shuffled = shuffleArray([...lines]);
  let index = 0;

  // If first shuffled item matches current text, swap with next
  if (shuffled[0] === element.textContent && shuffled.length > 1) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  function getNext() {
    const text = shuffled[index];
    index = (index + 1) % shuffled.length;
    if (index === 0) {
      const last = shuffled[shuffled.length - 1];
      shuffleArray(shuffled);
      if (shuffled[0] === last && shuffled.length > 1) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      }
    }
    return text;
  }

  function deleteText(callback) {
    element.classList.add('typewriter-cursor');
    const current = element.textContent;
    let i = current.length;

    function removeChar() {
      if (i <= 0) {
        element.textContent = '';
        setTimeout(callback, 200);
        return;
      }
      i--;
      element.textContent = current.slice(0, i);
      setTimeout(removeChar, randBetween(20, 40));
    }
    removeChar();
  }

  function typeText(text, callback) {
    let i = 0;

    function addChar() {
      if (i >= text.length) {
        element.classList.remove('typewriter-cursor');
        callback();
        return;
      }
      i++;
      element.textContent = text.slice(0, i);
      setTimeout(addChar, randBetween(40, 80));
    }
    addChar();
  }

  function cycle() {
    const next = getNext();
    const animStart = Date.now();

    deleteText(() => {
      typeText(next, () => {
        coord.reportLanded();
        const animTime = Date.now() - animStart;
        const holdTime = Math.max(1500, cycleDuration - animTime);
        setTimeout(() => {
          coord.requestStart(cycle);
        }, holdTime);
      });
    });
  }

  function start(initialDelay) {
    setTimeout(cycle, initialDelay);
  }

  return { start };
}

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

// Start typewriter after GSAP reveal completes
heroTl.call(() => {
  const topEl = document.getElementById('hero-top');
  const bottomEl = document.getElementById('hero-bottom');
  const topTw = createTypewriter(topEl, topLines, 8000, typewriterCoord);
  const bottomTw = createTypewriter(bottomEl, bottomLines, 11000, typewriterCoord);

  // Top starts after a 2s hold; bottom waits for top type-in (~1.5s) + 2s rest
  topTw.start(2000);
  bottomTw.start(5500);
});

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
gsap.set('.terminal-intro-right', { opacity: 0, y: 20 });
gsap.set('.terminal-stage', { opacity: 0, y: 30 });
ScrollTrigger.create({
  trigger: '.terminal-intro',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.terminal-intro-right', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }
});
ScrollTrigger.create({
  trigger: '.terminal-stage',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.terminal-stage', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
  }
});

// Pain section: scroll-pinned stack with running toll
(function initPainStack() {
  var cards = gsap.utils.toArray('.pain-card');
  var toll = document.querySelector('.pain-toll');
  var tollPeople = document.getElementById('toll-people');
  var tollTime = document.getElementById('toll-time');
  var tollCycle = document.getElementById('toll-cycle');
  var tollBefores = gsap.utils.toArray('.pain-toll-before');
  var tollAfters = gsap.utils.toArray('.pain-toll-after');
  var headlineBefore = document.querySelector('.pain-headline');
  var headlineAfter = document.querySelector('.pain-headline-after');
  var resultSub = document.querySelector('.pain-result-sub');
  var cardsContainer = document.querySelector('.pain-stack-cards');
  var cardCount = cards.length;

  // Toll progression: values at each card threshold
  var tollData = [
    { people: '—',  time: '—',        cycle: '—' },
    { people: '1',  time: '2 days',    cycle: '1' },
    { people: '1',  time: '4 days',    cycle: '2' },
    { people: '2',  time: '1 week',    cycle: '3' },
    { people: '2',  time: '2 weeks',   cycle: '4' },
    { people: '3',  time: '2.5 wks',   cycle: '5' },
    { people: '3',  time: '3 weeks',   cycle: '6' },
  ];

  var currentTollIndex = -1;
  function updateToll(index) {
    if (index === currentTollIndex) return;
    currentTollIndex = index;
    var d = tollData[index];
    tollPeople.textContent = d.people;
    tollTime.textContent = d.time;
    tollCycle.textContent = d.cycle;
  }

  // Initial state
  gsap.set(cards, { opacity: 0, y: 100 });
  gsap.set(toll, { opacity: 0, y: 20 });
  gsap.set(tollAfters, { opacity: 0, y: 30 });
  gsap.set(headlineAfter, { opacity: 0, y: 10 });
  gsap.set(resultSub, { opacity: 0, y: 10 });

  // Scroll budget — generous for longer holds
  var scrollPerCard = 150;
  var totalScroll = (cardCount * scrollPerCard) + 500 + 400 + 500 + 800;

  // Timeline positions (in timeline units)
  var cardStagger = 1.2;
  var cardPhaseStart = 0;
  var cardPhaseEnd = cardPhaseStart + (cardCount - 1) * cardStagger + 1.0;
  var holdBeforeStart = cardPhaseEnd + 0.4;
  var collapseStart = holdBeforeStart + 2.5;   // long hold on "before" state
  var transformStart = collapseStart + 0.8;    // tighter gap — get to the punchline faster
  var holdAfterStart = transformStart + 1.8;

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.pain-stack-wrapper',
      start: 'top 5%',
      end: '+=' + totalScroll,
      pin: '.pain-stack-wrapper',
      scrub: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
    }
  });

  // Toll meter fades in with first card
  tl.to(toll, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
  }, cardPhaseStart);

  // Stack cards
  cards.forEach(function(card, i) {
    tl.to(card, {
      opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
    }, cardPhaseStart + i * cardStagger);
  });

  // Drive toll values from timeline progress
  tl.eventCallback('onUpdate', function() {
    var progress = tl.progress();
    var totalDur = tl.totalDuration();
    var cardStartNorm = cardPhaseStart / totalDur;
    var cardEndNorm = cardPhaseEnd / totalDur;
    if (progress < cardStartNorm) {
      updateToll(0);
    } else if (progress >= cardEndNorm) {
      updateToll(cardCount);
    } else {
      var cardProgress = (progress - cardStartNorm) / (cardEndNorm - cardStartNorm);
      updateToll(Math.min(Math.round(cardProgress * cardCount), cardCount));
    }
  });

  // ---- LONG HOLD on "before" state ----
  tl.to({}, { duration: 2.5 }, holdBeforeStart);

  // Cards collapse — fast exit, clear the stage for the punchline
  tl.to(cards, {
    opacity: 0, y: 60,
    duration: 0.6, stagger: 0.04,
    ease: 'power2.in',
  }, collapseStart);
  // Headline swap: "You already know..." fades out, "But with Cosimo." fades in
  tl.to(headlineBefore, {
    opacity: 0, y: -15,
    duration: 0.5,
    ease: 'power2.in',
  }, transformStart);
  tl.to(headlineAfter, {
    opacity: 1, y: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, transformStart + 0.3);

  // Toll numbers transform: before slides out, after slides in
  tl.to(tollBefores, {
    opacity: 0, y: -30,
    duration: 0.6, stagger: 0.1,
    ease: 'power2.in',
  }, transformStart + 0.2);
  tl.to(tollAfters, {
    opacity: 1, y: 0,
    duration: 1.0, stagger: 0.12,
    ease: 'power3.out',
  }, transformStart + 0.4);

  // Border shifts to accent
  tl.to(toll, {
    borderTopColor: 'rgba(116, 65, 143, 0.12)',
    duration: 0.3,
    ease: 'power2.out',
  }, transformStart + 0.5);

  // Result sub-line fades in
  tl.to(resultSub, {
    opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
  }, transformStart + 0.7);

  // ---- LONG HOLD on "after" state ----
  tl.to({}, { duration: 3.0 }, holdAfterStart);
})();

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

// Quotes framing line
gsap.set('.quotes-framing', { opacity: 0, y: 20 });
ScrollTrigger.create({
  trigger: '.quotes-section',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.quotes-framing', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
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


// Inevitability section — pinned scroll-hold
gsap.set('.inevitability-line-1', { opacity: 0, y: 30 });
gsap.set('.inevitability-line-2', { opacity: 0, y: 20 });

var inevTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.inevitability-section',
    start: 'top top',
    end: '+=1200',
    pin: true,
    scrub: true,
    pinSpacing: true,
    pinType: 'transform',
  }
});

// Line 1 fades in
inevTl.to('.inevitability-line-1', {
  opacity: 1, y: 0, duration: 1, ease: 'power3.out'
}, 0);

// Hold on line 1 alone
inevTl.to({}, { duration: 1.5 }, 1);

// Line 2 fades in
inevTl.to('.inevitability-line-2', {
  opacity: 1, y: 0, duration: 1, ease: 'power3.out'
}, 2.5);

// Hold both lines together
inevTl.to({}, { duration: 2 }, 3.5);

// CTA section — single coordinated timeline
gsap.set('.cta-label', { opacity: 0, y: 20 });
gsap.set('.cta-headline', { opacity: 0, y: 30 });
gsap.set('.pilot-step', { opacity: 0, y: 40 });
gsap.set('.cta-actions', { opacity: 0, y: 20 });
ScrollTrigger.create({
  trigger: '.cta-section',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    var ctaTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    ctaTl.to('.cta-label', { opacity: 1, y: 0, duration: 0.6 });
    ctaTl.to('.cta-headline', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
    ctaTl.to('.pilot-step', { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }, '-=0.4');
    ctaTl.to('.cta-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
  }
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

requestAnimationFrame(() => {
  splitWordsAndAnimate('.terminal-intro-left h2');
  splitWordsAndAnimate('.pain-headline');
  splitWordsAndAnimate('.arch-header h2');
  splitWordsAndAnimate('.cases-header h2');
});

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

let currentDemoId = 0;

function runChatDemo(index) {
  const myId = ++currentDemoId;
  const cancelled = () => myId !== currentDemoId;

  document.querySelectorAll('.chat-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  const body = document.getElementById('chat-body');
  body.innerHTML = '';

  const demo = chatDemos[index];

  // Show context indicator immediately
  const ctxEl = document.createElement('div');
  ctxEl.className = 'chat-context visible';
  ctxEl.textContent = demo.context;
  body.appendChild(ctxEl);

  let msgIndex = 0;

  function playNext() {
    if (cancelled() || msgIndex >= demo.messages.length) return;

    const msg = demo.messages[msgIndex];
    msgIndex++;

    if (msg.role === 'user') {
      const msgEl = createChatMsg(msg);
      body.appendChild(msgEl);
      gsap.to(body, { scrollTop: body.scrollHeight, duration: 0.4, ease: 'power2.out' });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          msgEl.classList.add('visible');
        });
      });
      setTimeout(() => { if (!cancelled()) playNext(); }, 600);
    } else {
      // Show thinking dots first
      const thinkEl = document.createElement('div');
      thinkEl.className = 'chat-thinking';
      thinkEl.innerHTML = '<div class="chat-thinking-dot"></div><div class="chat-thinking-dot"></div><div class="chat-thinking-dot"></div>';
      body.appendChild(thinkEl);
      gsap.to(body, { scrollTop: body.scrollHeight, duration: 0.4, ease: 'power2.out' });

      setTimeout(() => {
        if (cancelled()) return;
        thinkEl.remove();
        const msgEl = createChatMsg(msg);
        body.appendChild(msgEl);
        gsap.to(body, { scrollTop: body.scrollHeight, duration: 0.4, ease: 'power2.out' });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            msgEl.classList.add('visible');
          });
        });
        setTimeout(() => { if (!cancelled()) playNext(); }, 700);
      }, 800);
    }
  }

  setTimeout(() => { if (!cancelled()) playNext(); }, 600);
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
