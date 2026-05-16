// App router + state. Hash-based.
window.App = (function () {
  const STATE_KEY = 'fr_app_state_v1';
  const state = {
    xp: 0,
    lessons: {}, // { 'vocab:greetings': true, ... }
  };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STATE_KEY));
      if (saved) Object.assign(state, saved);
    } catch {}
  }
  function save() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }

  function levelFor(xp) {
    if (xp >= 2500) return 'B2 · CLB 6+';
    if (xp >= 1500) return 'B1 · CLB 5';
    if (xp >= 800) return 'A2 · CLB 4';
    if (xp >= 250) return 'A1+ · CLB 3';
    return 'A1';
  }

  function refreshTopbar() {
    const x = document.getElementById('xp'); if (x) x.textContent = state.xp;
    const l = document.getElementById('level'); if (l) l.textContent = levelFor(state.xp);
  }

  function addXP(n) {
    state.xp += n;
    save();
    refreshTopbar();
  }

  function markLessonDone(key) {
    if (!state.lessons[key]) {
      state.lessons[key] = true;
      addXP(10);
      save();
    }
  }

  // -------- Router --------
  const routes = {
    home: renderHome,
    path: (c) => PathModule.render(c),
    vocab: (c, p) => VocabModule.render(c, p),
    grammar: (c, p) => GrammarModule.render(c, p),
    listen: (c, p) => ListenModule.render(c, p),
    speak: (c, p) => SpeakModule.render(c, p),
    read: (c, p) => ReadModule.render(c, p),
    write: (c, p) => WriteModule.render(c, p),
    games: (c, p) => GamesModule.render(c, p),
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
    location.hash = hash;
  }

  function renderActive() {
    const { route, params } = parseHash();
    const container = document.getElementById('app');
    container.scrollTop = 0;
    window.scrollTo(0, 0);
    const fn = routes[route] || routes.home;
    fn(container, params);
    document.querySelectorAll('.nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
    refreshTopbar();
  }

  // -------- Home --------
  function renderHome(container) {
    const next = LESSON_PATH.find(n => !App.state.lessons[doneKey(n)]);
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>Bonjour ! 🇨🇦🇫🇷</h1>
        <p>Learn French like a child — through games, sights, sounds, and play — with a professor's grammar rigor behind the scenes. Target: <b>CLB 6 in 3-4 months</b> at 30-45 min/day.</p>
      </div>

      <div class="card" style="background:linear-gradient(135deg,#fef3c7,#fff);border:2px solid var(--warn);cursor:default">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div>
            <h3>👇 Your next step</h3>
            <p style="margin-top:6px">${next ? `<b>${next.title}</b> — ${next.desc}` : 'You completed the whole path. Time for a real CLB test!'}</p>
          </div>
          ${next ? `<button class="btn big" onclick="App.continueNext()">Continue →</button>` : ''}
        </div>
      </div>
      <div class="spacer"></div>

      <h2 style="font-family:'Fredoka';color:var(--bleu);margin-bottom:12px">Explore</h2>
      <div class="grid">
        <div class="card" onclick="App.go('path')"><div class="icon">🗺️</div><h3>Learning Path</h3><p>Follow the 38-step path designed for CLB 6 mastery in 3-4 months.</p></div>
        <div class="card" onclick="App.go('vocab')"><div class="icon">🃏</div><h3>Vocabulary Garden</h3><p>Themed decks with spaced repetition. The system schedules your reviews.</p></div>
        <div class="card" onclick="App.go('grammar')"><div class="icon">📐</div><h3>Grammar Quests</h3><p>From articles to subjunctive — explicit rules + practice.</p></div>
        <div class="card" onclick="App.go('listen')"><div class="icon">🎧</div><h3>Listening Lab</h3><p>Hear, then type. CLB Listening prep.</p></div>
        <div class="card" onclick="App.go('speak')"><div class="icon">🎙️</div><h3>Speaking Mirror</h3><p>Mic + pronunciation scoring. CLB Speaking prep.</p></div>
        <div class="card" onclick="App.go('read')"><div class="icon">📖</div><h3>Reading Quests</h3><p>Graded French texts + comprehension Qs.</p></div>
        <div class="card" onclick="App.go('write')"><div class="icon">✍️</div><h3>Writing Workshop</h3><p>Prompts with rubric feedback. Builds CLB Writing.</p></div>
        <div class="card" onclick="App.go('games')"><div class="icon">🎮</div><h3>Games</h3><p>Gender Sort · Conjugation Race · Sentence Builder · Memory Match.</p></div>
      </div>

      <div class="spacer"></div>
      <div class="grammar-box">
        <h3>🎯 How CLB 6 is achieved here</h3>
        <p><b>4 skills tracked.</b> Each module of the path strengthens one or more CLB modules:</p>
        <ul style="margin-left:20px;line-height:1.8;margin-top:6px">
          <li><b>Listening</b> → Listening Lab (dictation, dialogues, mock test)</li>
          <li><b>Speaking</b> → Speaking Mirror (pronunciation scoring against target)</li>
          <li><b>Reading</b> → Reading Quests (graded CLB 4 → 6 texts + Qs)</li>
          <li><b>Writing</b> → Writing Workshop (prompts checked against a rubric)</li>
        </ul>
        <p style="margin-top:10px"><b>Method:</b> 30-45 min daily. Vocab + grammar in the morning. Games at midday. Listen/speak/read/write rotation in the evening. Streaks reinforce habit.</p>
      </div>
    `;
  }

  function continueNext() {
    const next = LESSON_PATH.find(n => !App.state.lessons[doneKey(n)]);
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
      games: `games:${n.game}`,
      listen: `listen:${n.set}`,
      speak: `speak:${n.set}`,
      read: `read:${n.text}`,
      write: `write:${n.prompt}`,
    })[n.route];
  }

  // -------- Init --------
  function init() {
    load();
    refreshTopbar();
    document.querySelectorAll('[data-route]').forEach(el => {
      el.onclick = () => go(el.dataset.route);
    });
    window.addEventListener('hashchange', renderActive);
    renderActive();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { state, go, addXP, markLessonDone, continueNext };
})();
