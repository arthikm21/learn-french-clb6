// App router + state + profile system. Hash-based, no backend.
window.App = (function () {
  const state = {
    lessons: {}, // { 'vocab:greetings': true, ... }
  };

  // -------- Icon system --------
  // One coherent 24×24 stroke set (Lucide/Feather geometry, MIT), inherits
  // currentColor so each card tints its icon to the section accent. Replaces
  // the OS-rendered emoji that read inconsistent and off-brand.
  const ICONS = {
    map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    ruler: '<path d="M16 3 21 8 8 21 3 16 16 3z"/><path d="M9 8l2 2"/><path d="M13 4l2 2"/><path d="M6 11l2 2"/>',
    compare: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    waveform: '<polyline points="2 12 5 12 8 4 12 20 15 8 18 14 22 12"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    bookOpen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    gamepad: '<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="4"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    history: '<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    gradcap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  };
  // Phase strip glyphs — same stroke set as the practice grid, replacing the
  // per-phase emoji from data (emoji render OS-dependent and off-brand).
  const PHASE_ICONS = { 1: 'volume', 2: 'ruler', 3: 'message', 4: 'history', 5: 'briefcase', 6: 'layers', 7: 'trendingUp', 8: 'target' };
  function svgIcon(key) {
    const inner = ICONS[key] || ICONS.target;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }
  // Phase glyph markup for other modules (path.js) — same stroke set.
  function phaseIcon(id) {
    return svgIcon(PHASE_ICONS[id] || 'target');
  }

  function load() {
    state.lessons = {};
    try {
      const saved = JSON.parse(window.Storage.getItem('state'));
      if (saved && saved.lessons) state.lessons = saved.lessons;
    } catch {}
  }
  function save() {
    // localStorage can throw on quota-exceeded (lots of progress) or in private
    // mode. Never let a failed progress write throw out of markLessonDone and
    // break the page mid-lesson — degrade gracefully instead.
    try {
      window.Storage.setItem('state', JSON.stringify({ lessons: state.lessons }));
    } catch (e) {
      console.warn('Could not save progress:', e && e.name);
      if (window.Toast && typeof Toast.info === 'function') {
        try { Toast.info('Storage full — progress may not save. Free up space in your browser.'); } catch {}
      }
    }
  }

  // Kept as no-op for backwards compatibility with module addXP() calls.
  function addXP(_n) { /* XP removed per user request */ }

  function markLessonDone(key) {
    // Ungraded/self-checked sessions still produce evidence, but are labelled
    // “practiced” rather than assigned an invented proficiency score.
    if (window.Mastery && !Mastery.get(key)) {
      try { Mastery.recordPractice(key); } catch {}
    }
    if (!state.lessons[key]) {
      state.lessons[key] = true;
      save();
      // Reward sound — gate passes get the bigger fanfare, regular lessons
      // the standard complete chime.
      if (window.Sounds && typeof Sounds.play === 'function') {
        try { Sounds.play(key.startsWith('gate:') ? 'gate' : 'complete'); } catch {}
      }
      // Mascot wing flap — visual confirmation in the topbar
      if (window.Settings && Settings.isMascotOn && Settings.isMascotOn()) {
        const logo = document.querySelector('.logo');
        if (logo) {
          logo.classList.remove('celebrating');
          // Force reflow so the next add restarts the animation
          void logo.offsetWidth;
          logo.classList.add('celebrating');
          setTimeout(() => logo.classList.remove('celebrating'), 800);
        }
      }
      // Confetti burst — bigger for a gate pass, modest for regular lessons
      if (window.Celebrate && typeof Celebrate.confetti === 'function') {
        try { Celebrate.confetti({ intensity: key.startsWith('gate:') ? 'large' : 'small' }); } catch {}
      }
    }
  }

  function recordAttempt(key, score, threshold = 70, kind = 'assessed') {
    if (!window.Mastery) {
      if (score >= threshold) markLessonDone(key);
      return { last: score, best: score, threshold, status: score >= threshold ? 'mastered' : 'building' };
    }
    const record = Mastery.recordAttempt(key, { score, threshold, kind });
    if (record.status === 'mastered') markLessonDone(key);
    return record;
  }

  function refreshTopbar() {
    const u = window.Storage.getCurrentUser();
    const chip = document.getElementById('user-chip');
    if (chip) {
      let name = chip.querySelector('#user-name');
      if (!name) {
        chip.innerHTML = `${svgIcon('user')}<span id="user-name"></span>`;
        name = chip.querySelector('#user-name');
      }
      name.textContent = u || 'anonymous';
    }
    const doneEl = document.getElementById('progress-done');
    const totalEl = document.getElementById('progress-total');
    if (doneEl) doneEl.textContent = pathDoneCount();
    if (totalEl) totalEl.textContent = LESSON_PATH.length;
  }

  // -------- Routes --------
  const routes = {
    home: renderHome,
    path: (c) => PathModule.render(c),
    progress: (c) => ProgressModule.render(c),
    gate: (c, p) => PhaseGateModule.render(c, p),
    deepdive: (c, p) => DeepDiveModule.render(c, p),
    scenario: (c, p) => ScenarioModule.render(c, p),
    listenmastery: (c, p) => ListenMasteryModule.render(c, p),
    connectormastery: (c, p) => ConnectorMasteryModule.render(c, p),
    phonics: (c, p) => PhonicsModule.render(c, p),
    vocab: (c, p) => VocabModule.render(c, p),
    grammar: (c, p) => GrammarModule.render(c, p),
    listen: (c, p) => ListenModule.render(c, p),
    dialogue: (c, p) => DialogueModule.render(c, p),
    speak: (c, p) => SpeakModule.render(c, p),
    speaktasks: (c, p) => SpeakTasksModule.render(c, p),
    writetask3: (c, p) => WriteTask3Module.render(c, p),
    speaktask2: (c, p) => SpeakTask2Module.render(c, p),
    speaktask3: (c, p) => SpeakTask3Module.render(c, p),
    connectors: (c) => ConnectorsModule.render(c),
    mock: (c) => MockModule.render(c),
    tcfguide: (c, p) => TCFGuideModule.render(c, p),
    pcvsimp: (c) => PCvsImpModule.render(c),
    diagnostic: (c) => DiagnosticModule.render(c),
    read: (c, p) => ReadModule.render(c, p),
    write: (c, p) => WriteModule.render(c, p),
    games: (c, p) => GamesModule.render(c, p),
    mistakes: (c) => MistakesModule.render(c),
    profile: (c) => ProfileModule.renderProfile(c),
    about: renderAbout,
    privacy: renderPrivacy,
  };

  function parseHash() {
    return Router.parse(location.hash);
  }

  function go(route, params) {
    const hash = Router.build(route, params);
    // If hash didn't change, force re-render (hashchange event won't fire).
    if (location.hash === hash) renderActive();
    else location.hash = hash;
  }

  function renderActive() {
    // Stop any audio from the page we're leaving — TTS clips, sequenced
    // dialogues, and scheduled auto-plays — so nothing keeps playing in the
    // background after navigation. Safe to call even if nothing is playing.
    if (window.TTS && typeof TTS.stop === 'function') TTS.stop();
    // Same idea for any active microphone recording — without this the mic
    // capture indicator stays on after the user navigates mid-record.
    if (window.Record && typeof Record.stopAll === 'function') Record.stopAll();
    // Gate everything behind welcome screen if no current user.
    const cur = window.Storage.getCurrentUser();
    const container = document.getElementById('app');
    if (!cur) {
      ProfileModule.renderWelcome(container);
      hideNav();
      return;
    }
    showNav();
    const { route, params } = parseHash();
    // Per-route styling hook: styles.css re-tints --accent by section
    // (listen=blue, read=green, write=amber, mock=rouge, …).
    document.body.dataset.route = route;
    container.scrollTop = 0;
    window.scrollTo(0, 0);
    const fn = routes[route] || routes.home;
    const paint = () => paintRoute(fn, route, params, container);
    // Native page transition (crossfade + slide, defined in styles.css) when
    // the browser supports it and animations are at full tier. The DOM update
    // itself is identical either way.
    if (document.startViewTransition && document.body.dataset.anim === 'full') {
      const transition = document.startViewTransition(paint);
      // Rapid navigation legitimately skips an in-flight transition. Its
      // `finished` promise rejects with AbortError; consume that expected
      // rejection so normal navigation never pollutes the console.
      if (transition && transition.finished) transition.finished.catch(() => {});
    } else {
      paint();
    }
  }

  function paintRoute(fn, route, params, container) {
    // Guard against module errors: a thrown render would otherwise leave the
    // PREVIOUS page's HTML on screen (silent regression). Surface the error
    // visibly + log it so users can recover and we can fix it.
    try {
      fn(container, params);
    } catch (err) {
      console.error(`[route ${route}] render failed:`, err);
      container.innerHTML = `
        <div class="lesson" style="margin-top:var(--sp-7)">
          <h2 class="h3-icon" style="--h3i:var(--warn)">${svgIcon('alert')}Page failed to load</h2>
          <p style="color:var(--ink-2);margin-top:var(--sp-3)">Something went wrong rendering this page. The error has been logged.</p>
          <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-2)"><code>${(err && err.message ? err.message : 'Unknown error').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</code></p>
          <div class="spacer"></div>
          <div class="row" style="justify-content:center">
            <button class="btn primary" onclick="App.go('home')">Back to Home</button>
            <button class="btn ghost" onclick="location.reload()">Reload page</button>
          </div>
        </div>`;
    }
    document.querySelectorAll('.nav a').forEach(a => {
      const active = a.dataset.route === route;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.nav-sect').forEach(s => {
      const btn = s.querySelector('.nav-sect-btn');
      if (btn) btn.classList.toggle('active', !!s.querySelector(`a[data-route="${route}"]`));
    });
    // Accessibility: move focus to the new page's heading and announce the
    // route, so keyboard and screen-reader users aren't stranded on stale focus.
    focusHeading(container);
    const h = container.querySelector('h1, h2');
    announceRoute((h ? h.textContent.trim() : route) + ' — page loaded');
    refreshTopbar();
  }

  // Polite live region for route changes. Created once, reused.
  function announceRoute(msg) {
    let a = document.getElementById('route-announcer');
    if (!a) {
      a = document.createElement('div');
      a.id = 'route-announcer';
      a.className = 'sr-only';
      a.setAttribute('aria-live', 'polite');
      a.setAttribute('aria-atomic', 'true');
      document.body.appendChild(a);
    }
    a.textContent = '';
    // Clear then set on the next tick so repeat routes still re-announce.
    setTimeout(() => { a.textContent = msg; }, 50);
  }

  function focusHeading(container) {
    // Don't steal focus from an element a module just autofocused (e.g. the
    // welcome username field).
    const active = document.activeElement;
    if (active && active !== document.body && container.contains(active)) return;
    const h = container.querySelector('h1, h2');
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  }

  function hideNav() {
    const nav = document.querySelector('.nav');
    const stats = document.querySelector('.stats');
    if (nav) nav.style.display = 'none';
    if (stats) stats.style.display = 'none';
  }
  function showNav() {
    const nav = document.querySelector('.nav');
    const stats = document.querySelector('.stats');
    if (nav) nav.style.display = '';
    if (stats) stats.style.display = '';
  }

  // Called when user is switched/created/reset. Reload state from storage and re-render.
  function reloadForUser() {
    load();
    if (location.hash.startsWith('#profile')) {
      // Stay on profile if there's a user; otherwise welcome.
      if (!window.Storage.getCurrentUser()) location.hash = '#home';
    } else {
      location.hash = '#home';
    }
    renderActive();
  }

  // -------- Home --------
  // Grouped, icon-tinted practice grid. Each group carries a category color
  // (data-cat) that CSS maps to the icon tile + stroke, so the wall of cards
  // reads as sections instead of one undifferentiated block.
  function renderPracticeAreas() {
    const groups = [
      { cat: 'oral', label: 'Oral focus', cards: [
        ['scenario', 'users', 'Scenarios', 'Oral', '50 real Canadian life situations. Listen → vocab → shadow → speak it yourself.'],
        ['listenmastery', 'headphones', 'Listen Mastery', 'Oral', '120 clips, 5 exercise types. Speed ramps from 0.7x to 1.2x.'],
        ['connectormastery', 'link', 'Connector Mastery', 'Oral', '22 connectors that move you from CLB 4-5 to CLB 6. Library + 4 drill types.'],
        ['speak', 'mic', 'Speaking Shadow', '', 'Hear Canadian French neural audio, repeat it aloud, self-rate. Hard lines come back via SRS.'],
        ['speaktasks', 'mic', 'Speaking Practice', '', 'Record yourself, listen back, self-rate. Picture description, Q&A, role-play.'],
      ]},
      { cat: 'found', label: 'Foundations', cards: [
        ['path', 'map', 'Learning Path', '', 'Ordered path through 8 phases. Next step always highlighted.'],
        ['phonics', 'volume', 'Phonics & Sounds', '', '7 units plus minimal-pair ear drills — u vs ou, nasals, é vs è, liaison.'],
        ['vocab', 'layers', 'Vocabulary', '', '35 themed decks, ~680 cards. SRS schedules your reviews automatically.'],
        ['grammar', 'ruler', 'Grammar', '', '29 units, A1 to B1. From articles to subjunctive and connectors.'],
        ['pcvsimp', 'compare', 'Passé Composé vs Imparfait', '', 'The #1 CLB 6 grammar trap. Dedicated decider drill with mixed contexts.'],
        ['deepdive', 'target', 'Deep Dives', 'New', 'y vs en, pronoun order, si-clauses, qui/que/dont/où. Visual decision trees for the four CLB 6 traps.'],
      ]},
      { cat: 'input', label: 'Listening, reading & writing', cards: [
        ['listen', 'waveform', 'Listening Lab', '', '15 dictation sets at slow, normal, and natural speed.'],
        ['dialogue', 'message', 'Dialogues', '', '8 multi-speaker conversations with comprehension questions.'],
        ['read', 'bookOpen', 'Reading', '', '30 graded texts from CLB 3 to 6 — emails, ads, news, brochures, fiction.'],
        ['write', 'pen', 'Writing Workshop', '', '8 prompts. Real grammar checker detects gender, tense, elision errors.'],
      ]},
      { cat: 'exam', label: 'TCF tasks & review', cards: [
        ['writetask3', 'pen', 'Writing Task 3', 'TCF', 'Compare 2 opinions and give your own view. The hardest TCF EE task.'],
        ['speaktask2', 'help', 'Speaking Task 2', 'TCF', 'Ask the examiner questions to gather info. Unique to TCF Canada.'],
        ['speaktask3', 'mic', 'Speaking Task 3', 'TCF', 'Argue your opinion for 3-5 minutes. Most-weighted EO task.'],
        ['tcfguide', 'book', 'TCF Prep Guide', 'TCF', 'Strategy, score conversion, test-day checklist, mock history.'],
        ['games', 'gamepad', 'Games', '', 'Gender Sort, Conjugation Race, Sentence Builder, Memory, Quick Translate, and more.'],
        ['mistakes', 'target', 'Weak Spots', '', 'Every wrong answer logged. Review until mastered, then dismissed.'],
        ['profile', 'user', 'Profile', '', 'Switch user, reset, dark mode, font size. All saved on this browser.'],
      ]},
    ];
    return groups.map(g => `
      <h3 class="card-group-h" data-cat="${g.cat}">${g.label}</h3>
      <div class="grid" data-cat="${g.cat}">
        ${g.cards.map(([route, icon, title, tag, desc]) => `
          <div class="card" onclick="App.go('${route}')">
            <div class="icon">${svgIcon(icon)}</div>
            <h3>${title}${tag ? ` <span class="tag verb">${tag}</span>` : ''}</h3>
            <p>${desc}</p>
          </div>`).join('')}
      </div>`).join('');
  }

  // The daily plan: one card, ordered steps, ~15 minutes. Replaces the old
  // separate "Continue" + "Review due" spotlights — a stack of pitches read
  // as a menu; a numbered plan tells the learner exactly what today is.
  // Order mirrors the pedagogy: clear reviews first (retention), then new
  // material, then one speaking rep (oral is half the outcome).
  function renderTodayCard(next, nextGate, srsDue, weakDue, topDueDeck) {
    const reviewCount = srsDue.total + weakDue;
    const steps = [];
    if (reviewCount > 0) {
      steps.push({
        title: `Clear ${reviewCount} review${reviewCount === 1 ? '' : 's'}`,
        sub: 'Due today — 5 minutes now protects everything already learned.',
        btn: 'Review',
        onclick: srsDue.total > 0
          ? `App.go('vocab'${topDueDeck ? `, { deck: '${topDueDeck[0]}' }` : ''})`
          : `App.go('mistakes')`,
      });
    }
    steps.push(next ? {
      title: `Continue: ${escapeHTML(next.title)}`,
      sub: escapeHTML(next.desc),
      btn: 'Continue',
      onclick: 'App.continueNext()',
    } : nextGate ? {
      title: `Confirm Phase ${nextGate.id}: ${escapeHTML(nextGate.gateTitle)}`,
      sub: 'Your phase checkpoint is ready. Pass it to unlock the next stage.',
      btn: 'Take check',
      onclick: `App.go('gate', { phase: '${nextGate.id}' })`,
    } : {
      title: 'Run the four-skill simulation',
      sub: 'Every path milestone is done. Rehearse the four skills together and identify final practice priorities.',
      btn: 'Start simulation',
      onclick: `App.go('mock')`,
    });
    steps.push({
      title: 'One speaking rep',
      sub: 'Shadow a few lines aloud — oral skills are half your score.',
      btn: 'Speak',
      onclick: `App.go('speak')`,
    });
    return `
      <div class="spotlight today-card">
        <div style="flex:1;min-width:0">
          <p class="eyebrow">Today · ~15 min</p>
          <h2>Your plan</h2>
          <div class="today-steps">
            ${steps.map((s, i) => `
              <div class="today-step">
                <span class="today-num">${i + 1}</span>
                <div class="today-step-info">
                  <h4>${s.title}</h4>
                  <p>${s.sub}</p>
                </div>
                <button class="btn ${i === 0 ? 'primary' : 'secondary'}" onclick="${s.onclick}">${s.btn}<span class="arr">→</span></button>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderHome(container) {
    const next = nextPathItem();
    const nextGate = PHASES.find(ph => Path.phaseUnlocked(ph.id) && !Path.gatePassed(ph.id) && Path.gateEligible(ph.id));
    // Daily review pressure: SRS cards due (vocab/shadow lines already seen)
    // + weak spots due. Retention comes from clearing these, so they get a
    // spotlight the moment any exist.
    const srsDue = (window.SRS && SRS.dueSummary) ? SRS.dueSummary() : { total: 0, byDeck: {} };
    const weakDue = (window.MistakesModule && MistakesModule.getDue) ? MistakesModule.getDue().length : 0;
    const topDueDeck = Object.entries(srsDue.byDeck)
      .filter(([k]) => window.VOCAB && VOCAB[k])
      .sort((a, b) => b[1] - a[1])[0];
    const done = pathDoneCount();
    const total = LESSON_PATH.length;
    const pct = Math.round((done / total) * 100);
    const user = escapeHTML(window.Storage.getCurrentUser());

    // Progress ring SVG. The drawn arc never drops below a sliver — a true
    // 0-1% otherwise renders as an empty circle and reads as "broken".
    const ringSize = 132;
    const ringStroke = 10;
    const ringR = (ringSize - ringStroke) / 2;
    const ringC = 2 * Math.PI * ringR;
    const arcPct = Math.max(pct, done > 0 ? 2.5 : 1.25);
    const ringOffset = ringC * (1 - arcPct / 100);

    container.innerHTML = `
      <section class="hero">
        <div class="flag-stripes"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--sp-6);flex-wrap:wrap">
          <div style="flex:1;min-width:260px">
            <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">Bonjour, ${user}</p>
            <h1>Build toward NCLC 6.<br/>See the evidence.</h1>
            <p style="margin-top:var(--sp-4)">A focused TCF Canada learning path across listening, speaking, reading, and writing—with a clear next step and visible capability milestones.</p>
          </div>
          <div class="ring" style="width:${ringSize}px;height:${ringSize}px;flex-shrink:0">
            <svg width="${ringSize}" height="${ringSize}">
              <circle class="bg" cx="${ringSize/2}" cy="${ringSize/2}" r="${ringR}" stroke-width="${ringStroke}"/>
              <circle class="fg" cx="${ringSize/2}" cy="${ringSize/2}" r="${ringR}" stroke-width="${ringStroke}"
                stroke-dasharray="${ringC.toFixed(2)}" stroke-dashoffset="${ringOffset.toFixed(2)}"/>
            </svg>
            <div class="ring-label">
              <span class="pct"><span data-pct>${pct}</span><small style="font-size:.5em;font-weight:var(--fw-semi);color:var(--mute)">%</small></span>
              <span class="meta">${done}/${total}</span>
            </div>
          </div>
        </div>
      </section>

      ${done === 0 ? `
      <div class="spotlight" onclick="App.go('diagnostic')" style="cursor:pointer">
        <div>
          <p class="eyebrow">Recommended</p>
          <h2>Start with a 5-minute knowledge sample</h2>
          <p>20 quick questions reveal likely focus areas before you begin. It does not invent a language level or mark full lessons complete.</p>
        </div>
        <span class="btn primary big" aria-hidden="true">Take it<span class="arr">→</span></span>
      </div>` : ''}

      ${renderTodayCard(next, nextGate, srsDue, weakDue, topDueDeck)}

      <div class="spotlight" onclick="App.go('scenario')" style="cursor:pointer;border:1px solid var(--accent)">
        <div>
          <p class="eyebrow" style="color:var(--accent)">Real-life scenarios</p>
          <h2>Calling a landlord. Opening a bank account.</h2>
          <p>One Canadian life situation at a time. Listen → understand → repeat → speak it yourself. No textbooks. Just the conversations you'll actually have.</p>
        </div>
        <span class="btn primary big" aria-hidden="true">Open scenarios<span class="arr">→</span></span>
      </div>

      <div class="spotlight" onclick="App.go('mock')" style="cursor:pointer">
        <div>
          <p class="eyebrow" style="color:var(--rouge)">TCF Canada Practice Simulation</p>
          <h2>Practise all four skills together</h2>
          <p>~2h47 · 39 listening and 39 reading questions · all three writing and speaking task types · practice priorities at the end.</p>
        </div>
        <span class="btn big" aria-hidden="true" style="background:var(--rouge);color:white">Start simulation<span class="arr">→</span></span>
      </div>

      <h2 class="section-h">Your phases</h2>
      <p class="section-sub">Eight phases. Seven course checks unlock the path; the final phase combines timed four-skill practice and evidence review.</p>
      <div class="phase-strip" id="phase-strip"></div>

      <div class="spacer"></div>
      <div class="row" style="justify-content:center;gap:var(--sp-3)">
        <button class="btn primary" onclick="App.go('progress')">View progress<span class="arr">→</span></button>
        <button class="btn ghost" onclick="App.go('gate')">All gates</button>
        <button class="btn ghost" onclick="App.go('path')">Full path</button>
      </div>

      <h2 class="section-h">Practice areas</h2>
      <p class="section-sub">Every module is open. Path orders them. Mistakes feed back into review.</p>
      ${renderPracticeAreas()}

      <h2 class="section-h">How CLB 6 is achieved here</h2>
      <p class="section-sub">Four abilities, each trained deliberately. Preparation time depends on starting ability, practice quality, authentic input, feedback, and the weakest skill.</p>
      <div class="grid">
        <div class="card" style="cursor:default">
          <h3>Listening</h3>
          <p>Listening Lab + Dialogues. Dictation, multi-speaker, news brief, mock test.</p>
        </div>
        <div class="card" style="cursor:default">
          <h3>Speaking</h3>
          <p>Shadowing drills with Canadian French neural audio and self-rating. Plus open-ended TCF tasks recorded on-device.</p>
        </div>
        <div class="card" style="cursor:default">
          <h3>Reading</h3>
          <p>Reading Quests with CLB 3 to 6 graded texts and comprehension questions.</p>
        </div>
        <div class="card" style="cursor:default">
          <h3>Writing</h3>
          <p>Writing Workshop with models, word-count discipline, common-slip checks, and task rubrics.</p>
        </div>
      </div>

      <div class="spacer lg"></div>
      <p style="text-align:center;color:var(--mute);font-size:var(--fs-13)">
        <a href="#about" style="color:var(--ink-2)">About</a>
        &nbsp;·&nbsp;
        <a href="#privacy" style="color:var(--ink-2)">Privacy</a>
        &nbsp;·&nbsp;
        <a href="#profile" style="color:var(--ink-2)">Profile</a>
      </p>
    `;
    // Hydrate phase strip
    const strip = container.querySelector('#phase-strip');
    if (strip && window.PHASES) {
      const currentPhaseId = (LESSON_PATH.find(n => !Path.isItemDone(n)) || {}).phase || PHASES[PHASES.length - 1].id;
      strip.innerHTML = PHASES.map(ph => {
        const prog = Path.phaseProgress(ph.id);
        const passed = Path.gatePassed(ph.id);
        const unlocked = Path.phaseUnlocked(ph.id);
        const isCurrent = ph.id === currentPhaseId;
        const cls = ['phase-chip'];
        if (passed) cls.push('done');
        if (!unlocked) cls.push('locked');
        const label = passed ? '✓ Passed' : !unlocked ? 'Locked' : isCurrent ? '<b style="color:var(--accent)">Current</b>' : 'Open';
        return `
          <div class="${cls.join(' ')}" data-ph="${ph.id}">
            <p class="eyebrow">Phase ${ph.id} · ${escapeHTML(ph.clb)}</p>
            <h4><span class="phase-glyph">${svgIcon(PHASE_ICONS[ph.id] || 'target')}</span>${escapeHTML(ph.name)}</h4>
            <p class="meta">${escapeHTML(ph.subtitle)}</p>
            <div class="meter"><div style="width:${prog.pct}%"></div></div>
            <p class="meta" style="font-variant-numeric:tabular-nums;display:flex;justify-content:space-between"><span>${label}</span><span>${prog.done}/${prog.total}</span></p>
          </div>`;
      }).join('');
      strip.querySelectorAll('[data-ph]').forEach(el => {
        el.onclick = () => {
          const id = parseInt(el.dataset.ph);
          const ph = PHASES.find(p => p.id === id);
          if (!Path.phaseUnlocked(id)) {
            Toast.info(`Pass Phase ${id - 1}'s gate first.`);
            return;
          }
          App.go('gate', { phase: String(id) });
        };
        el.setAttribute('aria-disabled', String(!Path.phaseUnlocked(parseInt(el.dataset.ph, 10))));
        if (window.Keyboard) Keyboard.enhanceClickableSurface(el);
      });
    }
    // Ring entrance: arc sweeps in from empty, label counts up. Full tier
    // only — other tiers render the final state immediately.
    if (document.body.dataset.anim === 'full') {
      const fg = container.querySelector('.ring circle.fg');
      if (fg) {
        fg.style.strokeDashoffset = ringC.toFixed(2);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          fg.style.strokeDashoffset = ringOffset.toFixed(2);
        }));
      }
      const pctEl = container.querySelector('[data-pct]');
      if (pctEl && pct > 0) {
        const t0 = performance.now(), dur = 900;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          pctEl.textContent = Math.round(pct * (1 - Math.pow(1 - k, 3)));
          if (k < 1 && pctEl.isConnected) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }
  }

  function renderAbout(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>À propos · About Bonjour!</h1>
        <p>An interactive French learning site engineered for one outcome: passing <b>CLB 6</b> in all four modules.</p>
      </div>
      <div class="grammar-box">
        <h3 class="h3-icon">${svgIcon('target')}What is CLB 6?</h3>
        <p>The Canadian Language Benchmarks describe adult English proficiency in Canada; the corresponding French framework is the Niveaux de compétence linguistique canadiens (NCLC). This course uses “CLB 6” in its familiar product name while training toward an NCLC 6 French target. Immigration, employment, and licensing requirements vary, so learners should verify the standard required for their specific goal.</p>
        <p>CLB 6 means you can:</p>
        <ul style="margin-left:20px;line-height:1.8;margin-top:6px">
          <li><b>Listen</b> — understand moderately complex routine instructions and short discussions on familiar topics.</li>
          <li><b>Speak</b> — communicate on routine social, work, and study situations; narrate past events and describe future plans.</li>
          <li><b>Read</b> — understand short routine business letters, advertisements, instructions, and short factual texts on familiar topics.</li>
          <li><b>Write</b> — write short, simple paragraphs (50-150 words) on familiar topics; fill out forms; write personal emails.</li>
        </ul>
      </div>
      <div class="grammar-box">
        <h3 class="h3-icon">${svgIcon('ruler')}The method</h3>
        <p><b>Pattern first, rule second.</b> Each grammar unit shows examples with the pattern highlighted, THEN states the explicit rule. This matches how children acquire language while keeping the rigor adults need to self-correct.</p>
        <p><b>Spaced repetition (SM-2).</b> Vocabulary you struggle with is shown more often; mastered words drop into long intervals. No wasted time on what you already know.</p>
        <p><b>Audio-first vocabulary.</b> Every French word and phrase plays in a neural Canadian French voice (fr-CA-SylvieNeural). Hear it before you read it.</p>
        <p><b>Weak Spots tracking.</b> Every quiz error is logged. The Mistakes tab surfaces what you got wrong so you can review specifically those items.</p>
        <p><b>Calibrated to CLB 6 ceiling.</b> No subjunctive imparfait, no passé simple, no literary tenses. Everything in this site is what an immigrant in Quebec or a professional in a francophone workplace actually uses.</p>
      </div>
      <div class="grammar-box">
        <h3 class="h3-icon">${svgIcon('map')}The path</h3>
        <p>The Path is ordered so that each step builds on the previous. Start at lesson 1, work through. If you already know early material, skim it — but the quizzes still need to pass to unlock further units.</p>
        <p>There is no universal preparation calendar. Beginners often need many months; learners already near the target may need a shorter focused period. Authentic French media, regular conversation, and corrective feedback remain essential.</p>
      </div>
      <div class="grammar-box">
        <h3 class="h3-icon">${svgIcon('wrench')}Tech</h3>
        <p>Static site. No accounts. No tracking. All your progress lives in your browser's localStorage, keyed by the username you pick. Multiple users on the same browser supported. Clear browser data → progress resets.</p>
        <p>Source code on GitHub. Pull requests welcome.</p>
      </div>

      <div class="grammar-box" style="background:color-mix(in srgb, var(--warn) 10%, var(--surface));border-left-color:var(--warn)">
        <h3 class="h3-icon" style="--h3i:var(--warn)">${svgIcon('gradcap')}Realistic expectations</h3>
        <p>This site provides the structured course, deliberate practice, and exam-task familiarity. It does not replace authentic listening input or feedback from another French speaker:</p>
        <ul style="margin-left:20px;line-height:1.9;margin-top:6px">
          <li><b>Daily input</b>: 30 minutes of Radio-Canada news or Téléjournal. Free, native-speed, current affairs vocabulary.</li>
          <li><b>Weekly conversation</b>: an iTalki / <a href="https://preply.sjv.io/c/7425774/1987575/24422" target="_blank" rel="sponsored noopener" style="color:var(--bleu)">Preply tutor</a> (~$15-25/hr). One hour per week of pure speaking with a human is irreplaceable.</li>
          <li><b>Last month before the exam</b>: use current official sample material and timed practice to remove format surprises. Do not treat format familiarity as a guaranteed score increase.</li>
          <li><b>Immersion</b>: change phone to French, watch a Quebec series (<em>District 31</em>, <em>STAT</em>) with French subtitles, listen to a French podcast on your commute.</li>
        </ul>
        <p style="margin-top:10px">This site replaces the textbook. It does NOT replace human conversation. Use both.</p>
      </div>

      <div class="grammar-box">
        <h3 class="h3-icon">${svgIcon('message')}Found a typo or have a suggestion?</h3>
        <p>Open an issue on GitHub: <a href="https://github.com/arthikm21/learn-french-clb6/issues" target="_blank" rel="noopener" style="color:var(--bleu)">github.com/arthikm21/learn-french-clb6/issues</a></p>
      </div>

      <div class="grammar-box">
        <h3 class="h3-icon" style="--h3i:var(--warn)">${svgIcon('heart')}If Bonjour! helped you</h3>
        <p>This site is free, and it stays free — no paywall, no accounts, no ads. It's built and paid for by one person. If it moved your French even a little closer to CLB 6, a small one-time gift keeps the audio flowing and the lights on. No pressure, ever — honestly, just using it and telling one friend already means a lot.</p>
        <div class="center" style="margin-top:12px">
          <a class="btn primary" href="https://buymeacoffee.com/frenchclb6" target="_blank" rel="noopener">Help keep Bonjour! free<span class="arr">→</span></a>
        </div>
        <p style="color:var(--mute);font-size:13px;margin-top:12px">Some outbound links to tutors and tools (for example Preply) are affiliate links: if you sign up through them, we may earn a small commission at no extra cost to you. There's also the optional <b>Bonjour! Exam Kit</b> — CA$1.99 bilingual printable PDF packs (speaking model answers, writing templates, cheat sheets) sold via Gumroad from the TCF guide and task pages. That's part of how this free site stays online.</p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" onclick="App.go('home')">← Home</button>
      </div>`;
  }

  function renderPrivacy(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>Privacy</h1>
        <p>What we collect: nothing.</p>
      </div>
      <div class="grammar-box">
        <h3>No accounts. No tracking. No analytics.</h3>
        <p>This site does not require an account, email, or password. The "username" you pick is stored in your browser only — it never reaches any server.</p>
        <p>Your progress (lesson completion, SRS schedule, weak-spot mistakes, writing drafts) is stored entirely in your browser's <b>localStorage</b>, prefixed by your chosen username. It never leaves your device. If you clear your browser data, your progress resets — there is no server-side copy. You can download a backup file from your Profile page and restore it on any device.</p>
        <p>The audio MP3s for French pronunciation are served from the same domain (Cloudflare Pages CDN). Standard request logs from the CDN apply per Cloudflare's privacy policy.</p>
        <p>Speaking practice recordings are made locally with your browser's MediaRecorder — the audio stays on your device for you to play back and self-rate. Nothing is uploaded, sent to a speech-recognition service, or stored after you leave the page.</p>
        <p><b>Outbound links.</b> Some links leave this site — to language tutors or tools (for example Preply), to Gumroad (where the optional exam-kit PDFs are sold), and to a voluntary support page. A few are affiliate links: if you sign up through them we may earn a small commission, at no extra cost to you. Those destination sites track your visit and process payments under their own policies. This site itself still adds no tracking, analytics, or ads.</p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" onclick="App.go('home')">← Home</button>
      </div>`;
  }

  // Next undone path item — used by Home's Today card and by
  // Chrome.finishScreen's "Next on your path" strip.
  function nextPathItem() {
    return LESSON_PATH.find(n => !state.lessons[doneKey(n)] && (!window.Path || Path.phaseUnlocked(n.phase))) || null;
  }

  function continueNext() {
    const next = nextPathItem();
    if (!next) return;
    const params = {};
    if (next.deck) params.deck = next.deck;
    if (next.unit) params.unit = next.unit;
    if (next.game) params.game = next.game;
    if (next.set) params.set = next.set;
    if (next.text) params.text = next.text;
    if (next.prompt) params.prompt = next.prompt;
    go(next.route, params);
  }

  function doneKey(n) {
    return ({
      vocab: `vocab:${n.deck}`,
      grammar: `grammar:${n.unit}`,
      phonics: `phonics:${n.unit}`,
      games: `games:${n.game}`,
      listen: `listen:${n.set}`,
      speak: `speak:${n.set}`,
      read: `read:${n.text}`,
      write: `write:${n.prompt}`,
    })[n.route];
  }

  // Optional practice (scenarios, mastery drills, writing models, gates) also
  // records completion in state.lessons. Course progress must count only the
  // 92 ordered path items or a motivated learner can exceed 100%.
  function pathDoneCount() {
    return LESSON_PATH.filter(n => !!state.lessons[doneKey(n)]).length;
  }

  function escapeHTML(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // -------- Mobile nav toggle --------
  function setupMobileNav() {
    const ham = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const backdrop = document.getElementById('nav-backdrop');
    const closeBtn = document.getElementById('nav-close');
    if (!ham || !nav || !backdrop) return;
    function close() {
      nav.classList.remove('open');
      backdrop.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
    function toggle() {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    }
    ham.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a[data-route]')) close();
    });
    window.addEventListener('hashchange', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) close();
    });
  }

  // -------- Desktop nav dropdowns (Practice / Exam) --------
  function setupNavSections() {
    const sects = document.querySelectorAll('.nav-sect');
    if (!sects.length) return;
    function closeAll(except) {
      sects.forEach(s => {
        if (s === except) return;
        s.classList.remove('open');
        const b = s.querySelector('.nav-sect-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
    sects.forEach(s => {
      const btn = s.querySelector('.nav-sect-btn');
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = !s.classList.contains('open');
        closeAll(s);
        s.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });
    document.addEventListener('click', () => closeAll());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });
    window.addEventListener('hashchange', () => closeAll());
  }

  // -------- Author credit modal --------
  function setupCreditModal() {
    const link = document.getElementById('credit-link');
    const modal = document.getElementById('credit-modal');
    if (!link || !modal) return;
    let lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      // Move focus into the dialog so keyboard/SR users aren't stranded behind it.
      const closeBtn = modal.querySelector('#credit-modal-close');
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }
    link.addEventListener('click', (e) => { e.preventDefault(); open(); });
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') { close(); return; }
      // Trap Tab inside the dialog while it's open.
      if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll('button, a[href]');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // -------- Liquid glass: pointer-tracked specular sheen --------
  // One delegated rAF-throttled listener feeds --mx/--my to whichever glass
  // card the cursor is over; styles.css paints the highlight (full anim tier,
  // fine pointers only — the media query there gates visibility, so this
  // stays cheap: one closest() + two setProperty per frame at most.
  function setupLiquidPointer() {
    if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, last = null;
    document.addEventListener('pointermove', (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = last.target && last.target.closest ? last.target.closest('.card, .spotlight') : null;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (last.clientX - r.left).toFixed(1) + 'px');
        el.style.setProperty('--my', (last.clientY - r.top).toFixed(1) + 'px');
      });
    }, { passive: true });
  }

  // -------- Topbar condenses on scroll --------
  function setupTopbarScroll() {
    const tb = document.querySelector('.topbar');
    if (!tb) return;
    let raf = 0;
    const update = () => { raf = 0; tb.classList.toggle('scrolled', window.scrollY > 6); };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  // -------- Theme --------
  function applyThemeMeta(dark) {
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#0D1016' : '#2948B8');
  }
  function loadTheme() {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const t = localStorage.getItem('fr_theme_v1');
    const dark = t === 'dark' || (!t && mq && mq.matches);
    document.body.classList.toggle('dark', dark);
    applyThemeMeta(dark);
    // System mode (no explicit choice saved): follow live OS theme changes.
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', (e) => {
        if (!localStorage.getItem('fr_theme_v1')) {
          document.body.classList.toggle('dark', e.matches);
          applyThemeMeta(e.matches);
        }
      });
    }
  }
  // mode: 'system' | 'light' | 'dark'. 'system' clears the saved pref so the
  // pre-paint bootstrap + OS listener follow the OS. Light/dark are explicit.
  function setTheme(mode) {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mode === 'system') localStorage.removeItem('fr_theme_v1');
    else localStorage.setItem('fr_theme_v1', mode);
    const dark = mode === 'dark' || (mode === 'system' && mq && mq.matches);
    document.body.classList.toggle('dark', dark);
    applyThemeMeta(dark);
    return dark;
  }
  function currentThemeMode() {
    return localStorage.getItem('fr_theme_v1') || 'system';
  }

  // -------- Init --------
  function init() {
    window.Storage.migrateLegacy();
    loadTheme();
    load();
    setupMobileNav();
    setupNavSections();
    setupCreditModal();
    setupLiquidPointer();
    setupTopbarScroll();
    refreshTopbar();
    document.querySelectorAll('[data-route]').forEach(el => {
      if (el.tagName === 'A') el.setAttribute('href', Router.build(el.dataset.route));
      el.onclick = (event) => {
        if (event) event.preventDefault();
        go(el.dataset.route);
      };
    });
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('#user-chip');
      if (chip) go('profile');
    });
    window.addEventListener('hashchange', renderActive);
    renderActive();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { state, go, addXP, markLessonDone, recordAttempt, continueNext, nextPathItem, pathDoneCount, svgIcon, phaseIcon, reloadForUser, setTheme, currentThemeMode };
})();
