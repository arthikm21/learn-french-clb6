// Learning path — soft-ordered (clickable anywhere, but recommends next).
window.PathModule = (function () {
  function render(container) {
    const lessons = App.state.lessons;
    const completed = LESSON_PATH.filter(n => isDone(n)).length;
    const nextIdx = LESSON_PATH.findIndex(n => !isDone(n));

    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🗺️ Your Path to CLB 6</h1>
        <p>${completed} / ${LESSON_PATH.length} milestones complete. Click any lesson — recommended next is highlighted.</p>
        <div class="meter" style="background:rgba(255,255,255,.3);margin-top:14px;height:10px"><div style="width:${(completed / LESSON_PATH.length) * 100}%;background:white;height:100%;border-radius:999px"></div></div>
      </div>
      <div id="phases"></div>`;

    const phases = container.querySelector('#phases');

    // Group lessons into 8 phases for readability
    const phaseRanges = [
      { name: '1. Foundation — Sounds & Greetings', start: 1, end: 8 },
      { name: '2. Core Grammar A1', start: 9, end: 19 },
      { name: '3. Communication Starts', start: 20, end: 30 },
      { name: '4. Past Tense & More Vocab', start: 31, end: 40 },
      { name: '5. Future & Intermediate', start: 41, end: 51 },
      { name: '6. Imparfait & CLB 4-5', start: 52, end: 61 },
      { name: '7. CLB 5 → 6 Push', start: 62, end: 84 },
      { name: '8. CLB 6 Mocks 🎯', start: 85, end: 92 },
    ];

    for (const ph of phaseRanges) {
      const items = LESSON_PATH.filter(n => n.id >= ph.start && n.id <= ph.end);
      if (items.length === 0) continue;
      const phDone = items.filter(isDone).length;
      const phSec = document.createElement('div');
      phSec.style.marginBottom = '20px';
      phSec.innerHTML = `
        <h3 style="font-family:'Fredoka';color:var(--bleu);margin:18px 0 10px;display:flex;justify-content:space-between;align-items:center">
          <span>${ph.name}</span>
          <span style="font-size:14px;color:var(--mute);font-family:'Nunito';font-weight:600">${phDone}/${items.length}</span>
        </h3>
        <div class="path-list"></div>`;
      const list = phSec.querySelector('.path-list');
      items.forEach((n) => {
        const done = isDone(n);
        const isNext = (LESSON_PATH[nextIdx] && LESSON_PATH[nextIdx].id === n.id);
        const node = document.createElement('div');
        node.className = `path-node ${done ? 'done' : (isNext ? 'unlocked' : '')}`;
        if (isNext) node.style.boxShadow = '0 0 0 3px var(--rouge), 0 6px 24px rgba(0,0,0,.08)';
        node.innerHTML = `
          <div class="num">${done ? '✓' : n.id}</div>
          <div class="info">
            <h4>${n.title} ${isNext ? '<span class="tag" style="background:var(--rouge);color:white">▶ NEXT</span>' : ''}</h4>
            <p>${n.desc}</p>
          </div>
          <div class="badge">+${n.xp} XP</div>`;
        node.onclick = () => {
          const params = {};
          if (n.deck) params.deck = n.deck;
          if (n.unit) params.unit = n.unit;
          if (n.game) params.game = n.game;
          if (n.set) params.set = n.set;
          if (n.text) params.text = n.text;
          if (n.prompt) params.prompt = n.prompt;
          App.go(n.route, params);
        };
        list.appendChild(node);
      });
      phases.appendChild(phSec);
    }
  }

  function isDone(n) {
    const keys = {
      vocab: `vocab:${n.deck}`,
      grammar: `grammar:${n.unit}`,
      phonics: `phonics:${n.unit}`,
      games: `games:${n.game}`,
      listen: `listen:${n.set}`,
      speak: `speak:${n.set}`,
      read: `read:${n.text}`,
      write: `write:${n.prompt}`,
    };
    return !!App.state.lessons[keys[n.route]];
  }

  return { render };
})();
