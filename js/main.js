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
  // Re-read computed colors so scrub timelines pick up new theme values
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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

// Chat-body scroll trapping: scroll the chat instead of the page,
// but release when the chat hits the top/bottom so users scroll past easily.
const chatBody = document.getElementById('chat-body');
chatBody.addEventListener('wheel', (e) => {
  const { scrollTop, scrollHeight, clientHeight } = chatBody;
  const atTop = scrollTop <= 0 && e.deltaY < 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
  if (!atTop && !atBottom && scrollHeight > clientHeight) {
    e.preventDefault();
    chatBody.scrollTop += e.deltaY;
    lenis.stop();
    clearTimeout(chatBody._lenisRestart);
    chatBody._lenisRestart = setTimeout(() => lenis.start(), 100);
  }
}, { passive: false });

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
gsap.set('.terminal-stage', { opacity: 0, y: 30 });
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

  // Toll progression: values at each card threshold (build-up phase)
  var tollData = [
    { people: '—',  time: '—',        cycle: '—' },
    { people: '1',  time: '2 days',    cycle: '1' },
    { people: '1',  time: '4 days',    cycle: '2' },
    { people: '2',  time: '1 week',    cycle: '3' },
    { people: '2',  time: '2 weeks',   cycle: '4' },
    { people: '3',  time: '2.5 wks',   cycle: '5' },
    { people: '3',  time: '3 weeks',   cycle: '6' },
  ];

  // Countdown progression: values collapse from peak to Cosimo result
  var countdownData = [
    { people: '3',  time: '3 weeks',  cycle: '6' },
    { people: '3',  time: '2 weeks',  cycle: '5' },
    { people: '2',  time: '1 week',   cycle: '4' },
    { people: '2',  time: '3 days',   cycle: '3' },
    { people: '1',  time: '1 day',    cycle: '2' },
    { people: '1',  time: '1 hr',     cycle: '1' },
    { people: '1',  time: '15 min',   cycle: '0' },
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

  var currentCountdownIndex = -1;
  function updateCountdown(index) {
    if (index === currentCountdownIndex) return;
    currentCountdownIndex = index;
    var d = countdownData[index];
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

  // Scroll budget — increased to accommodate empty stage + countdown
  var scrollPerCard = 150;
  var totalScroll = (cardCount * scrollPerCard) + 500 + 400 + 900 + 800;

  // Timeline positions (in timeline units)
  var cardStagger = 1.2;
  var cardPhaseStart = 0;
  var cardPhaseEnd = cardPhaseStart + (cardCount - 1) * cardStagger + 1.0;
  var holdBeforeStart = cardPhaseEnd + 0.4;
  var collapseStart = holdBeforeStart + 2.5;       // long hold on "before" state
  var emptyStageStart = collapseStart + 1.0;       // after cards + headline clear
  var headlineReveal = emptyStageStart + 1.5;      // "But with Cosimo..." lands first
  var countdownStart = headlineReveal + 1.0;       // then numbers roll
  var countdownEnd = countdownStart + 2.5;         // countdown duration
  var revealStart = countdownEnd + 0.3;            // color shift + scale after numbers land
  var holdAfterStart = revealStart + 1.8;

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

  // Drive toll values from timeline progress (build-up phase only)
  tl.eventCallback('onUpdate', function() {
    var progress = tl.progress();
    var totalDur = tl.totalDuration();
    var cardStartNorm = cardPhaseStart / totalDur;
    var cardEndNorm = cardPhaseEnd / totalDur;
    // Only drive toll during card build-up, not during countdown
    var countdownStartNorm = countdownStart / totalDur;
    if (progress >= countdownStartNorm) return;
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

  // Cards collapse + headline fades out simultaneously — clear the stage
  tl.to(cards, {
    opacity: 0, y: 60,
    duration: 0.6, stagger: 0.04,
    ease: 'power2.in',
  }, collapseStart);
  tl.to(headlineBefore, {
    opacity: 0, y: -15,
    duration: 0.5,
    ease: 'power2.in',
  }, collapseStart);

  // ---- EMPTY STAGE: just toll labels + peak "before" numbers ----
  // The viewer sits with "3 people, 3 weeks, 6 steps" — nothing else
  tl.to({}, { duration: 1.5 }, emptyStageStart);

  // ---- HEADLINE: "But with Cosimo..." lands first ----
  tl.to(headlineAfter, {
    opacity: 1, y: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, headlineReveal);

  // ---- COUNTDOWN: numbers roll down, scroll-driven ----
  var countdownProxy = { progress: 0 };
  tl.to(countdownProxy, {
    progress: 1,
    duration: 2.5,
    ease: 'power1.in',
    onUpdate: function() {
      var p = countdownProxy.progress;
      var idx = Math.min(Math.floor(p * countdownData.length), countdownData.length - 1);
      updateCountdown(idx);
    }
  }, countdownStart);

  // ---- NUMBERS LAND: color shift + scale bump ----
  // Color transitions to accent purple
  tl.to(tollBefores, {
    color: '#74418F',
    textShadow: '0 0 60px rgba(116, 65, 143, 0.3), 0 0 120px rgba(116, 65, 143, 0.12)',
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out',
  }, revealStart);
  // Scale bump — numbers grow slightly as complexity shrinks
  tl.to(tollBefores, {
    fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
    duration: 0.8,
    ease: 'power3.out',
  }, revealStart);

  // Border shifts to accent
  tl.to(toll, {
    borderTopColor: 'rgba(116, 65, 143, 0.12)',
    duration: 0.3,
    ease: 'power2.out',
  }, revealStart + 0.2);

  // Result sub-line fades in after numbers confirmed
  tl.to(resultSub, {
    opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
  }, revealStart + 0.5);

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
          { file: 'LPA_AlpineIII_Final.pdf', ref: 'p.34, §4.2(b)' },
          { file: 'SideLetter_Meridian_2024.pdf', ref: 'p.7' },
          { file: 'IC_Memo_CoInvest_Policy.docx', ref: 'p.2' }
        ]
      },
      { role: 'user', text: 'Draft the co-invest notice for Meridian' },
      {
        role: 'cosimo',
        text: 'Done. I\'ve drafted the notice using the terms from their side letter and the LPA requirements. The 10-day notice window and pro-rata allocation are referenced with source citations.',
        citations: [
          { file: 'SideLetter_Meridian_2024.pdf', ref: 'p.7' },
          { file: 'LPA_AlpineIII_Final.pdf', ref: 'p.34' }
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
          { file: 'NAV_Q3_2025_Final.xlsx', ref: 'all tabs' },
          { file: 'CapitalAccounts_Master.xlsx', ref: 'Sheet "Fund III"' },
          { file: 'PortCo_Valuations_Q3.pdf', ref: 'p.1-12' }
        ]
      },
      { role: 'user', text: 'Format as LP letter using our standard template' },
      {
        role: 'cosimo',
        text: 'Formatted using your Q2 letter as a template. Performance metrics, portfolio company updates, and capital account summaries are included with full source citations.',
        citations: [
          { file: 'Q2_LP_Letter_Template.docx', ref: 'formatting reference' },
          { file: 'NAV_Q3_2025_Final.xlsx', ref: 'performance data' }
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
          { file: 'RentRoll_Parkview_Q3.pdf', ref: '312 units' },
          { file: 'RentRoll_Summit_Tower.pdf', ref: '204 units' },
          { file: 'LeaseAmendments_2024/', ref: '9 files' }
        ]
      },
      { role: 'user', text: 'Export to our underwriting model format' },
      {
        role: 'cosimo',
        text: 'Exported to your underwriting template. Discrepancy flags are included as a separate tab with source references for each issue.',
        citations: [
          { file: 'UW_Template_v3.xlsx', ref: 'format reference' },
          { file: 'Prior_Quarter_RentRolls/', ref: 'comparison baseline' }
        ],
        artifact: { name: 'portfolio_master_rentrolls.xlsx', meta: 'Rent roll extract · 1,847 units · 12 flags' }
      }
    ]
  }
];

// ========== ARTIFACT PANEL ==========

const artifactDocuments = {
  'meridian_coinvest_notice.pdf': {
    pageCount: 2,
    content: getMeridianCoInvestHTML
  },
  'Q3_2025_LP_Letter.pdf': {
    pageCount: 8,
    content: getLPLetterHTML
  },
  'portfolio_master_rentrolls.xlsx': {
    pageCount: null,
    content: getRentRollHTML
  }
};

function getMeridianCoInvestHTML() {
  return '<div class="doc-page">' +
    '<div class="doc-letterhead">' +
      '<div class="doc-letterhead-name">Alpine Capital Management</div>' +
      '<div class="doc-letterhead-sub">320 Park Avenue, 22nd Floor &middot; New York, NY 10022</div>' +
    '</div>' +
    '<div class="doc-date">January 15, 2026</div>' +
    '<div class="doc-addressee">' +
      'Meridian Partners, LP<br>' +
      'Attn: Sarah Chen, Director of Investments<br>' +
      '1 Financial Center, Suite 4200<br>' +
      'Boston, MA 02111' +
    '</div>' +
    '<div class="doc-re-line">Re: Alpine Capital Fund III \u2014 Co-Investment Opportunity (NovaTech Solutions, Inc.)</div>' +
    '<div class="doc-body-text">Dear Ms. Chen,</div>' +
    '<div class="doc-body-text">' +
      'Pursuant to <span class="doc-section-ref">Section 4.2(b) of the LPA</span> and the co-investment provisions of your side letter dated March 12, 2024 ' +
      '(<span class="doc-section-ref">Side Letter \u00A77</span>), we are pleased to notify Meridian Partners of a co-investment opportunity in ' +
      'NovaTech Solutions, Inc. (\u201CTarget\u201D), a leading enterprise workflow automation platform.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'The Investment Committee has approved a total co-investment allocation of <strong>$12,500,000</strong> alongside the Fund\u2019s primary commitment. ' +
      'Pursuant to the first-look provision in your side letter, Meridian is entitled to participate on a priority basis prior to allocation to other eligible LPs.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'Based on Meridian\u2019s 24.8% pro-rata share of Fund III commitments, your indicative allocation is <strong>$3,100,000</strong>. ' +
      'This allocation is subject to the terms outlined below.' +
    '</div>' +
    '<div class="doc-section-title">Key Terms</div>' +
    '<table class="doc-table">' +
      '<tr><td>Target Company</td><td>NovaTech Solutions, Inc.</td></tr>' +
      '<tr><td>Transaction Type</td><td>Series C Preferred Equity</td></tr>' +
      '<tr><td>Pre-Money Valuation</td><td>$480M</td></tr>' +
      '<tr><td>Total Co-Invest Pool</td><td>$12,500,000</td></tr>' +
      '<tr><td>Meridian Pro-Rata</td><td class="num">$3,100,000 (24.8%)</td></tr>' +
      '<tr><td>Notice Period</td><td>10 business days from date of this notice</td></tr>' +
      '<tr><td>Response Deadline</td><td>January 29, 2026</td></tr>' +
      '<tr><td>Anticipated Closing</td><td>February 14, 2026</td></tr>' +
    '</table>' +
  '</div>' +
  '<div class="doc-page">' +
    '<div class="doc-body-text">' +
      'To elect participation, please deliver written notice to the undersigned on or before the Response Deadline. ' +
      'Your election must specify the desired commitment amount (up to your pro-rata allocation). ' +
      'Failure to respond by the deadline will be deemed a waiver of this opportunity per <span class="doc-section-ref">Section 4.2(b)(iii)</span>.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'Participating co-investors will receive the same terms, pricing, and protections as the Fund\u2019s primary investment. ' +
      'A detailed term sheet and data room access credentials will be provided upon election.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'This notice and its contents are confidential and intended solely for the addressee. ' +
      'Distribution or disclosure to any third party without the prior written consent of Alpine Capital Management is strictly prohibited.' +
    '</div>' +
    '<div class="doc-signature-block">' +
      '<div class="doc-signature-line"></div>' +
      '<div class="doc-signature-name">James R. Whitfield</div>' +
      '<div class="doc-signature-title">Managing Partner, Alpine Capital Management</div>' +
    '</div>' +
    '<div class="doc-footer">' +
      'CONFIDENTIAL \u2014 This communication is privileged and confidential, intended solely for the use of the addressee. ' +
      'Any unauthorized review, use, disclosure, or distribution is prohibited. Alpine Capital Management LLC is a registered investment adviser.' +
    '</div>' +
  '</div>';
}

function getLPLetterHTML() {
  return '<div class="doc-page">' +
    '<div class="doc-letterhead">' +
      '<div class="doc-letterhead-name">Alpine Capital Fund III</div>' +
      '<div class="doc-letterhead-sub">Quarterly Report &middot; Q3 2025</div>' +
    '</div>' +
    '<div class="doc-body-text">Dear Limited Partners,</div>' +
    '<div class="doc-body-text">' +
      'We are pleased to present the quarterly performance update for Alpine Capital Fund III for the period ending September 30, 2025. ' +
      'The portfolio continues to perform in line with our underwriting expectations, with several positions showing meaningful appreciation.' +
    '</div>' +
    '<div class="doc-section-title">Fund Performance Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Metric</th><th>Q3 2025</th><th>YTD</th><th>Since Inception</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Net IRR</td><td class="num">18.3%</td><td class="num">16.7%</td><td class="num">22.1%</td></tr>' +
        '<tr><td>TVPI</td><td class="num">1.42x</td><td class="num">1.42x</td><td class="num">1.42x</td></tr>' +
        '<tr><td>DPI</td><td class="num">0.31x</td><td class="num">0.31x</td><td class="num">0.31x</td></tr>' +
        '<tr><td>RVPI</td><td class="num">1.11x</td><td class="num">1.11x</td><td class="num">1.11x</td></tr>' +
        '<tr><td>Committed Capital</td><td class="num" colspan="3">$485,000,000</td></tr>' +
        '<tr><td>Drawn Capital</td><td class="num" colspan="3">$342,400,000</td></tr>' +
        '<tr><td>Distributions to Date</td><td class="num" colspan="3">$106,100,000</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-section-title">Portfolio Company Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Company</th><th>Sector</th><th>Entry</th><th>Cost Basis</th><th>Fair Value</th><th>MOIC</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>NovaTech Solutions</td><td>Enterprise SaaS</td><td>Q2 2023</td><td class="num">$42.0M</td><td class="num">$117.6M</td><td class="num">2.80x</td></tr>' +
        '<tr><td>Meridian Health</td><td>Healthcare IT</td><td>Q4 2023</td><td class="num">$38.5M</td><td class="num">$65.5M</td><td class="num">1.70x</td></tr>' +
        '<tr><td>Summit Logistics</td><td>Supply Chain</td><td>Q1 2024</td><td class="num">$51.0M</td><td class="num">$71.4M</td><td class="num">1.40x</td></tr>' +
        '<tr><td>Apex Manufacturing</td><td>Industrial</td><td>Q3 2024</td><td class="num">$35.0M</td><td class="num">$36.8M</td><td class="num">1.05x</td></tr>' +
        '<tr><td>Greenfield Energy</td><td>Renewables</td><td>Q1 2025</td><td class="num">$44.0M</td><td class="num">$39.6M</td><td class="num">0.90x</td></tr>' +
        '<tr><td>Coastal Properties</td><td>Real Estate</td><td>Q2 2024</td><td class="num">$28.5M</td><td class="num">$44.5M</td><td class="num">1.56x</td></tr>' +
      '</tbody>' +
    '</table>' +
  '</div>' +
  '<div class="doc-page">' +
    '<div class="doc-section-title">Capital Account Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Item</th><th>Amount</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Beginning Balance (Q2 2025)</td><td class="num">$451,200,000</td></tr>' +
        '<tr><td>Capital Contributions</td><td class="num">$18,700,000</td></tr>' +
        '<tr><td>Distributions</td><td class="num">($12,400,000)</td></tr>' +
        '<tr><td>Net Investment Income</td><td class="num">$3,100,000</td></tr>' +
        '<tr><td>Unrealized Gains / (Losses)</td><td class="num">$25,300,000</td></tr>' +
        '<tr><td style="font-weight:500;">Ending Balance (Q3 2025)</td><td class="num" style="font-weight:500;">$485,900,000</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-body-text">' +
      'The macro environment remains constructive for our core thesis in operationally-intensive middle market businesses. ' +
      'We continue to see attractive entry points in industrial technology and healthcare services, where our operating playbook ' +
      'generates differentiated value. The team is actively evaluating two new platform opportunities for Q4 deployment.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'We appreciate your continued partnership and welcome any questions at your convenience.' +
    '</div>' +
    '<div class="doc-signature-block">' +
      '<div class="doc-signature-name">Alpine Capital Management</div>' +
      '<div class="doc-signature-title">General Partner</div>' +
    '</div>' +
    '<div class="doc-footer">' +
      'This report is confidential and intended solely for the limited partners of Alpine Capital Fund III. ' +
      'Past performance is not indicative of future results. All valuations reflect fair market value estimates as of the reporting date.' +
    '</div>' +
  '</div>';
}

function getRentRollHTML() {
  return '<div class="doc-spreadsheet">' +
    '<table>' +
      '<thead><tr>' +
        '<th>Property</th><th>Unit</th><th>Tenant</th><th>Lease Start</th><th>Lease End</th>' +
        '<th>Sq Ft</th><th>Base Rent</th><th>CAM/NNN</th><th>Total</th><th>Status</th>' +
      '</tr></thead>' +
      '<tbody>' +
        '<tr><td>Parkview Apts</td><td>101</td><td>Martinez, Elena</td><td>03/01/2024</td><td>02/28/2026</td><td>850</td><td>$1,425</td><td>$185</td><td>$1,610</td><td>Active</td></tr>' +
        '<tr><td>Parkview Apts</td><td>102</td><td>Johnson, Michael</td><td>07/15/2023</td><td>07/14/2025</td><td>850</td><td>$1,380</td><td>$185</td><td>$1,565</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Parkview Apts</td><td>215</td><td>Okafor, David</td><td>01/15/2024</td><td>01/14/2026</td><td>975</td><td>$1,650</td><td>$185</td><td>$1,835</td><td><span class="flag-icon">\u25CF</span> AMT MISMATCH</td></tr>' +
        '<tr><td>Parkview Apts</td><td>310</td><td>Liu, Jennifer</td><td>09/01/2024</td><td>08/31/2026</td><td>1,100</td><td>$1,875</td><td>$210</td><td>$2,085</td><td>Active</td></tr>' +
        '<tr><td>Parkview Apts</td><td>412</td><td>Thompson, Robert</td><td>11/01/2023</td><td>10/31/2025</td><td>650</td><td>$1,200</td><td>$165</td><td>$1,365</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Summit Tower</td><td>201</td><td>Patel, Anita</td><td>04/01/2023</td><td>03/31/2025</td><td>1,200</td><td>$2,400</td><td>$310</td><td>$2,710</td><td><span class="flag-icon">\u25CF</span> EXPIRED</td></tr>' +
        '<tr><td>Summit Tower</td><td>205</td><td>Garcia, Carlos</td><td>06/01/2024</td><td>05/31/2026</td><td>1,050</td><td>$2,100</td><td>$290</td><td>$2,390</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Summit Tower</td><td>304</td><td>Reeves, Thomas</td><td>06/01/2023</td><td>05/31/2025</td><td>1,100</td><td>$2,200</td><td>$310</td><td>$2,510</td><td><span class="flag-icon">\u25CF</span> EXPIRED</td></tr>' +
        '<tr><td>Summit Tower</td><td>410</td><td>Williams, Dana</td><td>02/01/2025</td><td>01/31/2027</td><td>1,400</td><td>$2,950</td><td>$340</td><td>$3,290</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Summit Tower</td><td>510</td><td>Nguyen, Kim</td><td>08/01/2024</td><td>07/31/2026</td><td>900</td><td>$1,800</td><td>$275</td><td>$2,075</td><td><span class="flag-icon">\u25CF</span> AMT MISMATCH</td></tr>' +
        '<tr><td>Harborview</td><td>103</td><td>Brown, Jessica</td><td>05/15/2024</td><td>05/14/2026</td><td>780</td><td>$1,560</td><td>$195</td><td>$1,755</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Harborview</td><td>207</td><td>Schmidt, Paul</td><td>12/01/2022</td><td>11/30/2024</td><td>1,050</td><td>$1,890</td><td>$220</td><td>$2,110</td><td><span class="flag-icon">\u25CF</span> EXPIRED</td></tr>' +
        '<tr><td>Harborview</td><td>315</td><td>Adebayo, Tolu</td><td>10/01/2024</td><td>09/30/2026</td><td>920</td><td>$1,750</td><td>$205</td><td>$1,955</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Lakeside</td><td>108</td><td>Cooper, Amanda</td><td>03/01/2024</td><td>02/28/2026</td><td>875</td><td>$1,490</td><td>$190</td><td>$1,680</td><td><span class="flag-icon">\u25CF</span> AMT MISMATCH</td></tr>' +
        '<tr><td>Lakeside</td><td>204</td><td>Fernandez, Maria</td><td>01/01/2025</td><td>12/31/2026</td><td>1,150</td><td>$2,070</td><td>$245</td><td>$2,315</td><td>Active</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="sheet-tabs">' +
      '<div class="sheet-tab active">All Properties</div>' +
      '<div class="sheet-tab">Parkview Apts</div>' +
      '<div class="sheet-tab">Summit Tower</div>' +
      '<div class="sheet-tab">Harborview</div>' +
      '<div class="sheet-tab">Lakeside</div>' +
      '<div class="sheet-tab">Flags (6)</div>' +
    '</div>' +
  '</div>';
}

// Panel open/close
function openArtifactPanel(artifactName) {
  const chatFrame = document.querySelector('.chat-frame');
  const panelTitle = document.getElementById('artifact-panel-title');
  const panelPage = document.getElementById('artifact-panel-page');
  const panelBody = document.getElementById('artifact-panel-body');

  const doc = artifactDocuments[artifactName];
  if (!doc) return;

  panelTitle.textContent = artifactName;
  panelPage.textContent = doc.pageCount ? 'Page 1 of ' + doc.pageCount : '';
  panelBody.innerHTML = doc.content();
  panelBody.scrollTop = 0;

  chatFrame.classList.add('panel-open');

  // Re-scroll chat body after width transition
  const chatBody = document.getElementById('chat-body');
  setTimeout(() => { chatBody.scrollTop = chatBody.scrollHeight; }, 450);
}

function closeArtifactPanel() {
  document.querySelector('.chat-frame').classList.remove('panel-open');
}

document.getElementById('artifact-panel-close').addEventListener('click', closeArtifactPanel);

// Scroll trapping for panel body
const artifactPanelBody = document.getElementById('artifact-panel-body');
artifactPanelBody.addEventListener('wheel', (e) => {
  const { scrollTop, scrollHeight, clientHeight } = artifactPanelBody;
  const atTop = scrollTop <= 0 && e.deltaY < 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
  if (!atTop && !atBottom && scrollHeight > clientHeight) {
    e.preventDefault();
    artifactPanelBody.scrollTop += e.deltaY;
    lenis.stop();
    clearTimeout(artifactPanelBody._lenisRestart);
    artifactPanelBody._lenisRestart = setTimeout(() => lenis.start(), 100);
  }
}, { passive: false });

let currentDemoId = 0;

function runChatDemo(index) {
  closeArtifactPanel();
  const myId = ++currentDemoId;
  const cancelled = () => myId !== currentDemoId;

  document.querySelectorAll('.chat-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  const body = document.getElementById('chat-body');
  body.innerHTML = '';

  const demo = chatDemos[index];

  // Show context status bar
  const ctxEl = document.createElement('div');
  ctxEl.className = 'chat-context visible';
  const ctxParts = demo.context.split(' \u00B7 ');
  let ctxHTML = '<span class="chat-context-dot"></span>';
  ctxHTML += '<span class="chat-context-text">' + ctxParts[0] + '</span>';
  for (let i = 1; i < ctxParts.length; i++) {
    ctxHTML += '<span class="chat-context-sep">\u00B7</span>';
    ctxHTML += '<span class="chat-context-stat">' + ctxParts[i] + '</span>';
  }
  ctxEl.innerHTML = ctxHTML;
  body.appendChild(ctxEl);

  let msgIndex = 0;

  function playNext() {
    if (cancelled() || msgIndex >= demo.messages.length) return;

    const msg = demo.messages[msgIndex];
    msgIndex++;

    const scroll = () => gsap.to(body, { scrollTop: body.scrollHeight, duration: 0.3, ease: 'power2.out' });

    if (msg.role === 'user') {
      const msgEl = createChatMsg(msg);
      body.appendChild(msgEl);
      scroll();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { msgEl.classList.add('visible'); });
      });
      // Type out user message, then pause before next
      setTimeout(() => {
        if (cancelled()) return;
        typeText(msgEl._bubble, msg.text, 40, cancelled, scroll, () => {
          setTimeout(() => { if (!cancelled()) playNext(); }, 800);
        });
      }, 200);
    } else {
      // Show thinking indicator
      const thinkEl = document.createElement('div');
      thinkEl.className = 'chat-thinking';
      thinkEl.innerHTML = '<span class="chat-thinking-icon">\u25C7</span><span class="chat-thinking-label">Cosimo</span><span class="chat-thinking-cursor"></span>';
      body.appendChild(thinkEl);
      scroll();

      setTimeout(() => {
        if (cancelled()) return;
        thinkEl.remove();
        const msgEl = createChatMsg(msg);
        body.appendChild(msgEl);
        scroll();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { msgEl.classList.add('visible'); });
        });
        // Stream out Cosimo response, then reveal extras (sources/artifact)
        setTimeout(() => {
          if (cancelled()) return;
          typeText(msgEl._bubble, msg.text, 18, cancelled, scroll, () => {
            if (cancelled()) return;
            // Reveal sources and artifact with staggered fade-in
            msgEl._extras.forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
                scroll();
              }, 300 + i * 250);
            });
            const extrasDelay = msgEl._extras.length ? 300 + msgEl._extras.length * 250 + 400 : 0;
            setTimeout(() => { if (!cancelled()) playNext(); }, 800 + extrasDelay);
          });
        }, 150);
      }, 1800);
    }
  }

  setTimeout(() => { if (!cancelled()) playNext(); }, 1000);
}

function createChatMsg(msg) {
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg ' + msg.role;
  const extras = []; // elements to reveal after typing finishes

  if (msg.role === 'user') {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    msgEl.appendChild(bubble);
    msgEl._bubble = bubble;
  } else {
    const sender = document.createElement('div');
    sender.className = 'chat-sender';
    sender.innerHTML = '<span class="chat-sender-icon">\u25C7</span><span class="chat-sender-name">Cosimo</span>';
    msgEl.appendChild(sender);

    const response = document.createElement('div');
    response.className = 'chat-response';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    response.appendChild(bubble);
    msgEl._bubble = bubble;

    // Sources panel (hidden initially)
    if (msg.citations && msg.citations.length) {
      const sources = document.createElement('div');
      sources.className = 'chat-sources';
      sources.style.opacity = '0';
      sources.style.transform = 'translateY(6px)';
      sources.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

      const label = document.createElement('div');
      label.className = 'chat-sources-label';
      label.innerHTML = '<span class="chat-sources-icon">\u25C8</span><span>' + msg.citations.length + ' source' + (msg.citations.length > 1 ? 's' : '') + '</span>';
      sources.appendChild(label);

      const list = document.createElement('div');
      list.className = 'chat-sources-list';
      msg.citations.forEach(c => {
        const item = document.createElement('div');
        item.className = 'chat-source-item';
        item.innerHTML = '<span class="chat-source-file">' + c.file + '</span><span class="chat-source-ref">' + c.ref + '</span>';
        list.appendChild(item);
      });
      sources.appendChild(list);
      response.appendChild(sources);
      extras.push(sources);
    }

    // Artifact card (hidden initially)
    if (msg.artifact) {
      const card = document.createElement('div');
      card.className = 'chat-artifact-card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(6px) scale(0.97)';
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      card.innerHTML =
        '<div class="chat-artifact-card-header">' +
          '<div class="chat-artifact-file-icon"></div>' +
          '<div class="chat-artifact-card-info">' +
            '<div class="chat-artifact-card-name">' + msg.artifact.name + '</div>' +
            '<div class="chat-artifact-card-meta">' + msg.artifact.meta + '</div>' +
          '</div>' +
        '</div>' +
        '<span class="chat-artifact-ready">Ready</span>';
      card.dataset.artifact = msg.artifact.name;
      card.addEventListener('click', function() {
        openArtifactPanel(this.dataset.artifact);
      });
      response.appendChild(card);
      extras.push(card);
    }

    msgEl.appendChild(response);
  }

  msgEl._extras = extras;
  return msgEl;
}

// Type text into an element character by character.
// User messages: ~40ms/char (human typing). Cosimo: ~18ms/char (streaming tokens).
// Calls onTick after each char (for auto-scroll) and onDone when finished.
function typeText(el, text, speed, cancelled, onTick, onDone) {
  let i = 0;
  el.classList.add('typing');
  function next() {
    if (cancelled()) { el.classList.remove('typing'); return; }
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      if (onTick) onTick();
      setTimeout(next, speed);
    } else {
      el.classList.remove('typing');
      if (onDone) onDone();
    }
  }
  next();
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
