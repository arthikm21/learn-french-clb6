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
      // Log activity for the progress page heatmap + streak.
      if (window.ProgressModule && typeof ProgressModule.logActivity === 'function') {
        ProgressModule.logActivity();
      }
      // Reward sound — gate passes get the bigger fanfare, regular lessons
      // the standard complete chime.
      if (window.Sounds && typeof Sounds.play === 'function') {
        try { Sounds.play(key.startsWith('gate:') ? 'gate' : 'complete'); } catch {}
      }
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
    // Guard against module errors: a thrown render would otherwise leave the
    // PREVIOUS page's HTML on screen (silent regression). Surface the error
    // visibly + log it so users can recover and we can fix it.
    try {
      fn(container, params);
    } catch (err) {
      console.error(`[route ${route}] render failed:`, err);
      container.innerHTML = `
        <div class="lesson" style="margin-top:var(--sp-7)">
          <h2>⚠️ Page failed to load</h2>
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
    const user = escapeHTML(window.Storage.getCurrentUser());

    // Progress ring SVG
    const ringSize = 88;
    const ringStroke = 8;
    const ringR = (ringSize - ringStroke) / 2;
    const ringC = 2 * Math.PI * ringR;
    const ringOffset = ringC * (1 - pct / 100);

    container.innerHTML = `
      <section class="hero">
        <div class="flag-stripes"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--sp-6);flex-wrap:wrap">
          <div style="flex:1;min-width:260px">
            <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">Bonjour, ${user}</p>
            <h1>Score CLB 6.<br/>Built for it.</h1>
            <p style="margin-top:var(--sp-4)">A free, focused TCF Canada prep path. Phonics, vocab, grammar, listening, speaking, reading, writing. Calibrated to one outcome.</p>
          </div>
          <div class="ring" style="width:${ringSize}px;height:${ringSize}px;flex-shrink:0">
            <svg width="${ringSize}" height="${ringSize}">
              <circle class="bg" cx="${ringSize/2}" cy="${ringSize/2}" r="${ringR}" stroke-width="${ringStroke}"/>
              <circle class="fg" cx="${ringSize/2}" cy="${ringSize/2}" r="${ringR}" stroke-width="${ringStroke}"
                stroke-dasharray="${ringC.toFixed(2)}" stroke-dashoffset="${ringOffset.toFixed(2)}"/>
            </svg>
            <div class="ring-label">
              <span class="pct">${pct}<small style="font-size:.5em;font-weight:var(--fw-semi);color:var(--mute)">%</small></span>
              <span class="meta">${done}/${total}</span>
            </div>
          </div>
        </div>
      </section>

      ${done === 0 ? `
      <div class="spotlight" onclick="App.go('diagnostic')" style="cursor:pointer">
        <div>
          <p class="eyebrow">Recommended</p>
          <h2>Start with a 5-minute placement test</h2>
          <p>20 quick questions detect your level. Anything you already know gets auto-marked done so you skip ahead — no busywork.</p>
        </div>
        <button class="btn primary big" onclick="event.stopPropagation();App.go('diagnostic')">Take it<span class="arr">→</span></button>
      </div>` : ''}

      <div class="spotlight">
        <div>
          <p class="eyebrow">${next ? 'Continue where you left off' : 'You\'re ready'}</p>
          <h2>${next ? escapeHTML(next.title) : '🎯 Take the mock test'}</h2>
          <p>${next ? escapeHTML(next.desc) : 'You completed every milestone on the path. Time to simulate the real exam.'}</p>
        </div>
        <button class="btn big" onclick="App.${next ? 'continueNext' : 'go(\'mock\')'}()">${next ? 'Continue' : 'Start mock'}<span class="arr">→</span></button>
      </div>

      <div class="spotlight" onclick="App.go('scenario')" style="cursor:pointer;border:1px solid var(--accent)">
        <div>
          <p class="eyebrow" style="color:var(--accent)">🇨🇦 Real-life scenarios</p>
          <h2>Calling a landlord. Opening a bank account.</h2>
          <p>One Canadian life situation at a time. Listen → understand → repeat → speak it yourself. No textbooks. Just the conversations you'll actually have.</p>
        </div>
        <button class="btn primary big" onclick="event.stopPropagation();App.go('scenario')">Open scenarios<span class="arr">→</span></button>
      </div>

      <div class="spotlight" onclick="App.go('mock')" style="cursor:pointer">
        <div>
          <p class="eyebrow" style="color:var(--rouge)">CLB 6 Mock Test</p>
          <h2>Take the real-format exam</h2>
          <p>~90 minutes · 4 skills · CLB band estimate at the end. Simulates the TEF Canada exam structure end-to-end.</p>
        </div>
        <button class="btn big" onclick="event.stopPropagation();App.go('mock')" style="background:var(--rouge);color:white">Start mock<span class="arr">→</span></button>
      </div>

      <h2 class="section-h">Your phases</h2>
      <p class="section-sub">Eight phases. Seven gates. Each one ends in a mini-mock that unlocks the next.</p>
      <div class="phase-strip" id="phase-strip"></div>

      <div class="spacer"></div>
      <div class="row" style="justify-content:center;gap:var(--sp-3)">
        <button class="btn primary" onclick="App.go('progress')">View progress<span class="arr">→</span></button>
        <button class="btn ghost" onclick="App.go('gate')">All gates</button>
        <button class="btn ghost" onclick="App.go('path')">Full path</button>
      </div>

      <h2 class="section-h">Practice areas</h2>
      <p class="section-sub">Every module is open. Path orders them. Mistakes feed back into review.</p>
      <div class="grid">
        <div class="card" onclick="App.go('path')"><div class="icon">🗺️</div><h3>Learning Path</h3><p>Ordered path through 8 phases. Next step always highlighted.</p></div>
        <div class="card" onclick="App.go('phonics')"><div class="icon">🔊</div><h3>Phonics &amp; Sounds</h3><p>7 units plus minimal-pair ear drills — u vs ou, nasals, é vs è, liaison.</p></div>
        <div class="card" onclick="App.go('vocab')"><div class="icon">🃏</div><h3>Vocabulary</h3><p>28 themed decks, ~570 cards. SRS schedules your reviews automatically.</p></div>
        <div class="card" onclick="App.go('grammar')"><div class="icon">📐</div><h3>Grammar</h3><p>29 units, A1 to B1. From articles to subjunctive and connectors.</p></div>
        <div class="card" onclick="App.go('pcvsimp')"><div class="icon">⚔️</div><h3>Passé Composé vs Imparfait</h3><p>The #1 CLB 6 grammar trap. Dedicated decider drill with mixed contexts.</p></div>
        <div class="card" onclick="App.go('deepdive')"><div class="icon">🎯</div><h3>Deep Dives <span class="tag verb">New</span></h3><p>y vs en, pronoun order, si-clauses, qui/que/dont/où. Visual decision trees for the four CLB 6 traps.</p></div>
        <div class="card" onclick="App.go('listen')"><div class="icon">🎧</div><h3>Listening Lab</h3><p>15 dictation sets at slow, normal, and natural speed.</p></div>
        <div class="card" onclick="App.go('dialogue')"><div class="icon">💬</div><h3>Dialogues</h3><p>8 multi-speaker conversations with comprehension questions.</p></div>
        <div class="card" onclick="App.go('speak')"><div class="icon">🎙️</div><h3>Speaking Mirror</h3><p>Repeat the sentence with word-by-word pronunciation diff.</p></div>
        <div class="card" onclick="App.go('speaktasks')"><div class="icon">🎤</div><h3>Speaking Tasks</h3><p>Picture description, Q&amp;A, role-play. Open-ended speaking practice.</p></div>
        <div class="card" onclick="App.go('writetask3')"><div class="icon">✍️</div><h3>Writing Task 3 <span class="tag verb">TCF</span></h3><p>Compare 2 opinions and give your own view. The hardest TCF EE task.</p></div>
        <div class="card" onclick="App.go('speaktask2')"><div class="icon">❓</div><h3>Speaking Task 2 <span class="tag verb">TCF</span></h3><p>Ask the examiner questions to gather info. Unique to TCF Canada.</p></div>
        <div class="card" onclick="App.go('speaktask3')"><div class="icon">🎤</div><h3>Speaking Task 3 <span class="tag verb">TCF</span></h3><p>Argue your opinion for 3-5 minutes. Most-weighted EO task.</p></div>
        <div class="card" onclick="App.go('connectors')"><div class="icon">🔗</div><h3>Connector Drill <span class="tag verb">TCF</span></h3><p>30-second timed production: continue an idea using cependant, par conséquent, etc.</p></div>
        <div class="card" onclick="App.go('tcfguide')"><div class="icon">📚</div><h3>TCF Prep Guide <span class="tag verb">TCF</span></h3><p>Strategy, score conversion, test-day checklist, mock history.</p></div>
        <div class="card" onclick="App.go('read')"><div class="icon">📖</div><h3>Reading</h3><p>30 graded texts from CLB 3 to 6 — emails, ads, news, brochures, fiction.</p></div>
        <div class="card" onclick="App.go('write')"><div class="icon">✍️</div><h3>Writing Workshop</h3><p>8 prompts. Real grammar checker detects gender, tense, elision errors.</p></div>
        <div class="card" onclick="App.go('games')"><div class="icon">🎮</div><h3>Games</h3><p>Gender Sort, Conjugation Race, Sentence Builder, Memory, Quick Translate, and more.</p></div>
        <div class="card" onclick="App.go('mistakes')"><div class="icon">🎯</div><h3>Weak Spots</h3><p>Every wrong answer logged. Review until mastered, then dismissed.</p></div>
        <div class="card" onclick="App.go('profile')"><div class="icon">👤</div><h3>Profile</h3><p>Switch user, reset, dark mode, font size. All saved on this browser.</p></div>
      </div>

      <h2 class="section-h">How CLB 6 is achieved here</h2>
      <p class="section-sub">Four skills, each trained by a dedicated module. 30-45 minutes daily, ~3-4 months.</p>
      <div class="grid">
        <div class="card" style="cursor:default">
          <h3>Listening</h3>
          <p>Listening Lab + Dialogues. Dictation, multi-speaker, news brief, mock test.</p>
        </div>
        <div class="card" style="cursor:default">
          <h3>Speaking</h3>
          <p>Speaking Mirror with word-level pronunciation diff. Plus open-ended TCF tasks.</p>
        </div>
        <div class="card" style="cursor:default">
          <h3>Reading</h3>
          <p>Reading Quests with CLB 3 to 6 graded texts and comprehension questions.</p>
        </div>
        <div class="card" style="cursor:default">
          <h3>Writing</h3>
          <p>Writing Workshop with heuristic grader and CLB band estimate.</p>
        </div>
      </div>

      <div class="spacer lg"></div>
      <p style="text-align:center;color:var(--mute);font-size:var(--fs-13)">
        <a onclick="App.go('about')" style="color:var(--ink-2);cursor:pointer">About</a>
        &nbsp;·&nbsp;
        <a onclick="App.go('privacy')" style="color:var(--ink-2);cursor:pointer">Privacy</a>
        &nbsp;·&nbsp;
        <a onclick="App.go('profile')" style="color:var(--ink-2);cursor:pointer">Profile</a>
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
        const label = passed ? '✓ Passed' : !unlocked ? '🔒 Locked' : isCurrent ? '▶ Current' : 'Open';
        return `
          <div class="${cls.join(' ')}" data-ph="${ph.id}">
            <p class="eyebrow">Phase ${ph.id} · ${escapeHTML(ph.clb)}</p>
            <h4>${ph.icon} ${escapeHTML(ph.name)}</h4>
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
      });
    }
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

      <div class="grammar-box" style="background:#fef3c7;border-left-color:var(--warn)">
        <h3>🎓 Realistic expectations</h3>
        <p>This site provides roughly <b>70-80%</b> of what an immigrant or professional needs to pass CLB 6 on the TEF Canada / TCF Canada. For the remaining 20-30%:</p>
        <ul style="margin-left:20px;line-height:1.9;margin-top:6px">
          <li><b>Daily input</b>: 30 minutes of Radio-Canada news or Téléjournal. Free, native-speed, current affairs vocabulary.</li>
          <li><b>Weekly conversation</b>: an iTalki / Preply tutor (~$15-25/hr). One hour per week of pure speaking with a human is irreplaceable.</li>
          <li><b>Last month before exam</b>: buy the official TEF Canada or TCF Canada practice book. Familiarity with the exam format itself adds 1-2 CLB points on test day.</li>
          <li><b>Immersion</b>: change phone to French, watch a Quebec series (<em>District 31</em>, <em>STAT</em>) with French subtitles, listen to a French podcast on your commute.</li>
        </ul>
        <p style="margin-top:10px">This site replaces the textbook. It does NOT replace human conversation. Use both.</p>
      </div>

      <div class="grammar-box">
        <h3>💬 Found a typo or have a suggestion?</h3>
        <p>Open an issue on GitHub: <a href="https://github.com/arthikm21/learn-french-clb6/issues" target="_blank" rel="noopener" style="color:var(--bleu)">github.com/arthikm21/learn-french-clb6/issues</a></p>
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

  // -------- Author credit modal --------
  function setupCreditModal() {
    const link = document.getElementById('credit-link');
    const modal = document.getElementById('credit-modal');
    if (!link || !modal) return;
    function open() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
    link.addEventListener('click', (e) => { e.preventDefault(); open(); });
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
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
    setupCreditModal();
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
