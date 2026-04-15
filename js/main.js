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
  // Clear GSAP inline styles so CSS theme colors reassert before refresh
  document.querySelectorAll('.pain-toll-before').forEach(el => {
    el.style.removeProperty('color');
    el.style.removeProperty('text-shadow');
    el.style.removeProperty('font-size');
  });
  const tollEl = document.querySelector('.pain-toll');
  if (tollEl) tollEl.style.removeProperty('border-top-color');
  // Re-read computed colors so scrub timelines pick up new theme values
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

// ========== MOBILE NAV TOGGLE ==========
const navToggle = document.getElementById('nav-toggle');
const navRight = document.querySelector('.nav-right');

navToggle.addEventListener('click', () => {
  const isOpen = navRight.classList.toggle('open');
  navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', isOpen);
  if (typeof lenis !== 'undefined') {
    if (isOpen) lenis.stop(); else { lenis.start(); ScrollTrigger.refresh(); }
  }
});

// Close on link click
navRight.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navRight.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (typeof lenis !== 'undefined') { lenis.start(); ScrollTrigger.refresh(); }
  });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navRight.classList.contains('open')) {
    navToggle.click();
  }
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

// Debounced ScrollTrigger refresh on resize (handles mobile address bar changes)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});

// Scroll trapping: when cursor is resting on the demo, scroll the element
// instead of the page. Bypass trapping when the page is already mid-scroll
// (coast-through). Only engage trapping after wheel events settle (~150ms gap).
let demoScrollBypass = false;
let bypassTimer = null;

const chatFrame = document.querySelector('.chat-frame');
chatFrame.addEventListener('mouseenter', () => {
  demoScrollBypass = true;
  clearTimeout(bypassTimer);
  bypassTimer = setTimeout(() => { demoScrollBypass = false; }, 150);
});
chatFrame.addEventListener('mouseleave', () => {
  demoScrollBypass = false;
  clearTimeout(bypassTimer);
});

function trapScroll(el) {
  let prevWheelTime = 0;

  el.addEventListener('wheel', (e) => {
    const now = Date.now();

    // First wheel event on this element after a gap while the page is
    // already scrolling — cursor just arrived via coast-through.
    // Engage bypass even if mouseenter hasn't fired yet (race condition).
    if (now - prevWheelTime > 200 && lenis.isScrolling) {
      demoScrollBypass = true;
      clearTimeout(bypassTimer);
      bypassTimer = setTimeout(() => { demoScrollBypass = false; }, 150);
    }
    prevWheelTime = now;

    if (demoScrollBypass) return;
    const { scrollHeight, clientHeight } = el;
    if (scrollHeight > clientHeight) {
      e.preventDefault();
      el.scrollTop += e.deltaY;
      lenis.stop();
      clearTimeout(el._lenisRestart);
      el._lenisRestart = setTimeout(() => lenis.start(), 100);
    }
  }, { passive: false });
}

trapScroll(document.getElementById('chat-body'));

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

  // Scroll budget — responsive tiers for mobile/tablet/desktop
  var isMobile = window.innerWidth <= 640;
  var isTablet = window.innerWidth <= 1024 && !isMobile;
  var scrollPerCard = isMobile ? 80 : isTablet ? 120 : 150;
  var totalScroll = (cardCount * scrollPerCard) + (isMobile ? 900 : isTablet ? 1800 : 2600);

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
      pinType: 'transform',
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
  var revealFontSize = isMobile ? 'clamp(1.4rem, 5vw, 2rem)'
                     : isTablet ? 'clamp(1.8rem, 4vw, 2.8rem)'
                     : 'clamp(2.4rem, 5.5vw, 4.2rem)';
  tl.to(tollBefores, {
    fontSize: revealFontSize,
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

var inevMobile = window.innerWidth <= 640;
var inevTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.inevitability-section',
    start: 'top top',
    end: inevMobile ? '+=700' : '+=1200',
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
    const temp = document.createElement('div');
    temp.innerHTML = html;

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

// ========== ARTIFACT PANEL ==========

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
trapScroll(artifactPanelBody);

let currentDemoId = 0;

function runChatDemo(index) {
  closeArtifactPanel();
  const myId = ++currentDemoId;
  const cancelled = () => myId !== currentDemoId;

  document.querySelectorAll('.chat-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
    btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
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
