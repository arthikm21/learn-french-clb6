// App router + state + profile system. Hash-based, no backend.
window.App = (function () {
  const state = {
    lessons: {}, // { 'vocab:greetings': true, ... }
  };

  function load() {
    state.lessons = {};
    try {
      const saved = JSON.parse(window.Storage.getItem('state'));
      if (saved && saved.lessons) state.lessons = saved.lessons;
    } catch {}
  }
  function save() {
    window.Storage.setItem('state', JSON.stringify({ lessons: state.lessons }));
  }

  // Kept as no-op for backwards compatibility with module addXP() calls.
  function addXP(_n) { /* XP removed per user request */ }

  function markLessonDone(key) {
    if (!state.lessons[key]) {
      state.lessons[key] = true;
      save();
    }
  }

  function refreshTopbar() {
    const u = window.Storage.getCurrentUser();
    const chip = document.getElementById('user-chip');
    if (chip) chip.textContent = '👤 ' + (u || 'anonymous');
    const doneEl = document.getElementById('progress-done');
    const totalEl = document.getElementById('progress-total');
    if (doneEl) doneEl.textContent = Object.keys(state.lessons).length;
    if (totalEl) totalEl.textContent = LESSON_PATH.length;
  }

  // -------- Routes --------
  const routes = {
    home: renderHome,
    path: (c) => PathModule.render(c),
    phonics: (c, p) => PhonicsModule.render(c, p),
    vocab: (c, p) => VocabModule.render(c, p),
    grammar: (c, p) => GrammarModule.render(c, p),
    listen: (c, p) => ListenModule.render(c, p),
    speak: (c, p) => SpeakModule.render(c, p),
    read: (c, p) => ReadModule.render(c, p),
    write: (c, p) => WriteModule.render(c, p),
    games: (c, p) => GamesModule.render(c, p),
    mistakes: (c) => MistakesModule.render(c),
    profile: (c) => ProfileModule.renderProfile(c),
    about: renderAbout,
    privacy: renderPrivacy,
  };

  function parseHash() {
    const h = location.hash.slice(1) || 'home';
    const [r, q] = h.split('?');
    const params = {};
    if (q) q.split('&').forEach(kv => { const [k, v] = kv.split('='); params[k] = decodeURIComponent(v || ''); });
    return { route: r, params };
  }

  function go(route, params) {
    let hash = '#' + route;
    if (params && Object.keys(params).length) {
      hash += '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    }
    // If hash didn't change, force re-render (hashchange event won't fire).
    if (location.hash === hash) renderActive();
    else location.hash = hash;
  }

  function renderActive() {
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
    container.scrollTop = 0;
    window.scrollTo(0, 0);
    const fn = routes[route] || routes.home;
    fn(container, params);
    document.querySelectorAll('.nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
    refreshTopbar();
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
  function renderHome(container) {
    const next = LESSON_PATH.find(n => !state.lessons[doneKey(n)]);
    const done = Object.keys(state.lessons).length;
    const total = LESSON_PATH.length;
    const pct = Math.round((done / total) * 100);

    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>Bonjour ${escapeHTML(window.Storage.getCurrentUser())} ! 🇨🇦🇫🇷</h1>
        <p>Learn French like a child — games, sounds, sights — with a professor's grammar rigor. Target: <b>CLB 6 in 3-4 months</b> at 30-45 min/day.</p>
        <div class="meter" style="background:rgba(255,255,255,.3);margin-top:14px;height:10px"><div style="width:${pct}%;background:white;height:100%;border-radius:999px"></div></div>
        <p style="margin-top:6px;font-size:14px;opacity:.9">${done} / ${total} milestones complete (${pct}%)</p>
      </div>

      <div class="card" style="background:linear-gradient(135deg,#fef3c7,#fff);border:2px solid var(--warn);cursor:default">
        <div class="row" style="justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <h3>👇 Your next step</h3>
            <p style="margin-top:6px">${next ? `<b>${next.title}</b> — ${next.desc}` : 'You completed every milestone. Time for a real CLB 6 mock test!'}</p>
          </div>
          ${next ? `<button class="btn big" onclick="App.continueNext()">Continue →</button>` : ''}
        </div>
      </div>
      <div class="spacer"></div>

      <h2 style="font-family:'Fredoka';color:var(--bleu);margin-bottom:12px">Explore</h2>
      <div class="grid">
        <div class="card" onclick="App.go('path')"><div class="icon">🗺️</div><h3>Learning Path</h3><p>92-step ordered path. Each milestone unlocks the next, building CLB 6 systematically.</p></div>
        <div class="card" onclick="App.go('phonics')"><div class="icon">🔊</div><h3>Phonics & Sounds</h3><p>Master French sounds first — vowels, nasals, R, liaison, elision. 7 units.</p></div>
        <div class="card" onclick="App.go('vocab')"><div class="icon">🃏</div><h3>Vocabulary Garden</h3><p>20 themed decks, ~365 cards. Spaced repetition schedules your reviews.</p></div>
        <div class="card" onclick="App.go('grammar')"><div class="icon">📐</div><h3>Grammar Quests</h3><p>22 units from articles to subjunctive. Patterns + rules + quizzes with explanations.</p></div>
        <div class="card" onclick="App.go('listen')"><div class="icon">🎧</div><h3>Listening Lab</h3><p>10 sets, native Canadian voice. Slow / normal / natural speed control.</p></div>
        <div class="card" onclick="App.go('speak')"><div class="icon">🎙️</div><h3>Speaking Mirror</h3><p>Mic + word-by-word feedback. See exactly which words to fix.</p></div>
        <div class="card" onclick="App.go('read')"><div class="icon">📖</div><h3>Reading Quests</h3><p>12 graded texts CLB 3 → 6. Realistic Canadian contexts.</p></div>
        <div class="card" onclick="App.go('write')"><div class="icon">✍️</div><h3>Writing Workshop</h3><p>8 prompts. Heuristic grader detects errors, estimates CLB band.</p></div>
        <div class="card" onclick="App.go('games')"><div class="icon">🎮</div><h3>Games</h3><p>Gender Sort, Conjugation Race, Sentence Builder, Memory, Quick Translate, Tense Picker.</p></div>
        <div class="card" onclick="App.go('mistakes')"><div class="icon">🎯</div><h3>Weak Spots</h3><p>Every wrong answer logged. Review until mastered, then dismissed.</p></div>
        <div class="card" onclick="App.go('profile')"><div class="icon">👤</div><h3>Profile</h3><p>Switch user, reset progress, manage your profile on this browser.</p></div>
      </div>

      <div class="spacer"></div>
      <div class="grammar-box">
        <h3>🎯 How CLB 6 is achieved here</h3>
        <p>4 CLB skills, each trained by a dedicated module:</p>
        <ul style="margin-left:20px;line-height:1.8;margin-top:6px">
          <li><b>Listening</b> → Listening Lab (dictation, dialogues, news, mock test)</li>
          <li><b>Speaking</b> → Speaking Mirror (word-level pronunciation diff)</li>
          <li><b>Reading</b> → Reading Quests (CLB 3 → 6 graded texts + Qs)</li>
          <li><b>Writing</b> → Writing Workshop (heuristic grader + CLB band estimate)</li>
        </ul>
        <p style="margin-top:10px"><b>Method:</b> 30-45 min daily. Phonics + vocab + grammar in the morning. Games at midday. Listen/speak/read/write rotation in the evening. Review <b>Weak Spots</b> twice a week.</p>
        <p style="margin-top:8px">
          <a onclick="App.go('about')" style="color:var(--bleu);cursor:pointer">About</a> ·
          <a onclick="App.go('privacy')" style="color:var(--bleu);cursor:pointer">Privacy</a> ·
          <a onclick="App.go('profile')" style="color:var(--bleu);cursor:pointer">Profile</a>
        </p>
      </div>
    `;
  }

  function renderAbout(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>À propos · About Bonjour!</h1>
        <p>An interactive French learning site engineered for one outcome: passing <b>CLB 6</b> in all four modules.</p>
      </div>
      <div class="grammar-box">
        <h3>🎯 What is CLB 6?</h3>
        <p>The Canadian Language Benchmark (CLB) is the national standard for adult second-language proficiency in Canada. CLB 6 is "Intermediate Initial" — equivalent to roughly B1 on the European CEFR scale. It is the threshold most commonly required for federal job competitions, professional licensing, and Express Entry immigration points.</p>
        <p>CLB 6 means you can:</p>
        <ul style="margin-left:20px;line-height:1.8;margin-top:6px">
          <li><b>Listen</b> — understand moderately complex routine instructions and short discussions on familiar topics.</li>
          <li><b>Speak</b> — communicate on routine social, work, and study situations; narrate past events and describe future plans.</li>
          <li><b>Read</b> — understand short routine business letters, advertisements, instructions, and short factual texts on familiar topics.</li>
          <li><b>Write</b> — write short, simple paragraphs (50-150 words) on familiar topics; fill out forms; write personal emails.</li>
        </ul>
      </div>
      <div class="grammar-box">
        <h3>📐 The method</h3>
        <p><b>Pattern first, rule second.</b> Each grammar unit shows examples with the pattern highlighted, THEN states the explicit rule. This matches how children acquire language while keeping the rigor adults need to self-correct.</p>
        <p><b>Spaced repetition (SM-2).</b> Vocabulary you struggle with is shown more often; mastered words drop into long intervals. No wasted time on what you already know.</p>
        <p><b>Audio-first vocabulary.</b> Every French word and phrase plays in a neural Canadian French voice (fr-CA-SylvieNeural). Hear it before you read it.</p>
        <p><b>Weak Spots tracking.</b> Every quiz error is logged. The Mistakes tab surfaces what you got wrong so you can review specifically those items.</p>
        <p><b>Calibrated to CLB 6 ceiling.</b> No subjunctive imparfait, no passé simple, no literary tenses. Everything in this site is what an immigrant in Quebec or a professional in a francophone workplace actually uses.</p>
      </div>
      <div class="grammar-box">
        <h3>🛤️ The path</h3>
        <p>The Path is ordered so that each step builds on the previous. Start at lesson 1, work through. If you already know early material, skim it — but the quizzes still need to pass to unlock further units.</p>
        <p>Daily 30-45 min on the Path → CLB 6 in 3-4 months. Faster if you also consume French media (Radio-Canada, France 24, Quebec series like <em>District 31</em>).</p>
      </div>
      <div class="grammar-box">
        <h3>🔧 Tech</h3>
        <p>Static site. No accounts. No tracking. All your progress lives in your browser's localStorage, keyed by the username you pick. Multiple users on the same browser supported. Clear browser data → progress resets.</p>
        <p>Source code on GitHub. Pull requests welcome.</p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" onclick="App.go('home')">← Home</button>
      </div>`;
  }

  function renderPrivacy(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🔒 Privacy</h1>
        <p>What we collect: nothing.</p>
      </div>
      <div class="grammar-box">
        <h3>No accounts. No tracking. No analytics.</h3>
        <p>This site does not require an account, email, or password. The "username" you pick is stored in your browser only — it never reaches any server.</p>
        <p>Your progress (lesson completion, SRS schedule, weak-spot mistakes, writing drafts) is stored entirely in your browser's <b>localStorage</b>, prefixed by your chosen username. It never leaves your device. If you clear your browser data, your progress resets — there is no backup, because there is no server.</p>
        <p>The audio MP3s for French pronunciation are served from the same domain (Vercel CDN). Standard request logs from the CDN apply per Vercel's privacy policy.</p>
        <p>Speech recognition for the Speaking module runs in your browser via the Web Speech API. Your microphone audio is processed by your browser's recognition service — usually Google's on Chrome/Edge, Apple's on Safari. We never see or store it.</p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" onclick="App.go('home')">← Home</button>
      </div>`;
  }

  function continueNext() {
    const next = LESSON_PATH.find(n => !state.lessons[doneKey(n)]);
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

  function escapeHTML(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // -------- Mobile nav toggle --------
  function setupMobileNav() {
    const ham = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const backdrop = document.getElementById('nav-backdrop');
    if (!ham || !nav || !backdrop) return;
    function close() {
      nav.classList.remove('open');
      backdrop.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
    }
    ham.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a[data-route]')) close();
    });
    window.addEventListener('hashchange', close);
  }

  // -------- Theme --------
  function loadTheme() {
    const t = localStorage.getItem('fr_theme_v1');
    if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark');
    }
  }
  function toggleTheme() {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('fr_theme_v1', dark ? 'dark' : 'light');
    return dark;
  }

  // -------- Init --------
  function init() {
    window.Storage.migrateLegacy();
    loadTheme();
    load();
    setupMobileNav();
    refreshTopbar();
    document.querySelectorAll('[data-route]').forEach(el => {
      el.onclick = () => go(el.dataset.route);
    });
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('#user-chip');
      if (chip) go('profile');
    });
    window.addEventListener('hashchange', renderActive);
    renderActive();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { state, go, addXP, markLessonDone, continueNext, reloadForUser, toggleTheme };
})();
