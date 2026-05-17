// Learning path — phases collapse when complete, expand current + remaining.
window.PathModule = (function () {
  function render(container) {
    const completed = LESSON_PATH.filter(n => isDone(n)).length;
    const nextIdx = LESSON_PATH.findIndex(n => !isDone(n));

    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🗺️ Your Path to CLB 6</h1>
        <p>${completed} / ${LESSON_PATH.length} milestones complete. Click any lesson — your next recommended step is highlighted.</p>
        <div class="meter" style="background:rgba(255,255,255,.3);margin-top:14px;height:10px"><div style="width:${(completed / LESSON_PATH.length) * 100}%;background:white;height:100%;border-radius:999px"></div></div>
      </div>
      <div id="phases"></div>`;

    const phases = container.querySelector('#phases');

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

    // Find current phase (contains next lesson)
    const currentPhaseIdx = (() => {
      if (nextIdx < 0) return phaseRanges.length - 1;
      const id = LESSON_PATH[nextIdx].id;
      return phaseRanges.findIndex(p => id >= p.start && id <= p.end);
    })();

    phaseRanges.forEach((ph, phIdx) => {
      const items = LESSON_PATH.filter(n => n.id >= ph.start && n.id <= ph.end);
      if (items.length === 0) return;
      const phDone = items.filter(isDone).length;
      const isCurrent = phIdx === currentPhaseIdx;
      const allDone = phDone === items.length;
      // Collapse phases that are complete AND before current. Keep current and future expanded.
      const collapsed = allDone && phIdx < currentPhaseIdx;

      const phSec = document.createElement('details');
      phSec.style.marginBottom = '14px';
      if (!collapsed) phSec.open = true;
      phSec.innerHTML = `
        <summary style="cursor:pointer;list-style:none;padding:12px 16px;background:${allDone ? '#dcfce7' : (isCurrent ? '#fef3c7' : 'var(--card)')};border-radius:12px;font-family:'Fredoka',sans-serif;color:${allDone ? 'var(--good)' : 'var(--bleu)'};font-size:17px;display:flex;justify-content:space-between;align-items:center;box-shadow:var(--shadow);user-select:none">
          <span>${allDone ? '✅' : (isCurrent ? '▶' : '◯')} ${ph.name}</span>
          <span style="font-family:'Nunito';font-weight:700;font-size:14px;color:var(--mute)">${phDone}/${items.length}</span>
        </summary>
        <div class="path-list" style="padding-top:10px"></div>`;
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
          </div>`;
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
    });
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
