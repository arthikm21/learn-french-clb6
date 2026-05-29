// Learning path — phases collapse when complete, expand current + remaining.
window.PathModule = (function () {
  function render(container) {
    const completed = LESSON_PATH.filter(n => isDone(n)).length;
    const total = LESSON_PATH.length;
    const nextIdx = LESSON_PATH.findIndex(n => !isDone(n));
    const pct = Math.round((completed / total) * 100);

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Path'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">Your Path to CLB 6</p>
        <h1>Eight phases.<br/>One path.</h1>
        <p style="margin-top:var(--sp-4)">${completed} of ${total} milestones complete · ${pct}%. Tap any unit. Next step is highlighted.</p>
        <div class="progress" style="height:6px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden;margin-top:var(--sp-5);max-width:480px">
          <div style="height:100%;width:${pct}%;background:var(--ink);border-radius:var(--r-pill);transition:width var(--t-slow) var(--ease-out)"></div>
        </div>
      </section>
      <div id="phases"></div>`;

    const phases = container.querySelector('#phases');

    const phaseRanges = [
      { name: 'Foundation — Sounds & Greetings', start: 1,  end: 8  },
      { name: 'Core Grammar A1',                 start: 9,  end: 19 },
      { name: 'Communication Starts',            start: 20, end: 30 },
      { name: 'Past Tense & More Vocab',         start: 31, end: 40 },
      { name: 'Future & Intermediate',           start: 41, end: 51 },
      { name: 'Imparfait & CLB 4-5',             start: 52, end: 61 },
      { name: 'CLB 5 → 6 Push',                  start: 62, end: 84 },
      { name: 'CLB 6 Mocks',                     start: 85, end: 92 },
    ];

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
      const collapsed = allDone && phIdx < currentPhaseIdx;

      const phSec = document.createElement('details');
      phSec.style.marginBottom = '12px';
      if (!collapsed) phSec.open = true;

      const statusGlyph = allDone ? '✓' : (isCurrent ? '▶' : phIdx + 1);
      const statusColor = allDone ? 'var(--good)' : (isCurrent ? 'var(--accent)' : 'var(--ink-2)');
      const statusBg    = allDone ? 'rgba(52,199,89,.12)' : (isCurrent ? 'rgba(94,92,230,.12)' : 'var(--surface-2)');

      phSec.innerHTML = `
        <summary style="cursor:pointer;list-style:none;padding:var(--sp-4) var(--sp-5);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);display:flex;justify-content:space-between;align-items:center;box-shadow:var(--e1);user-select:none;gap:var(--sp-3)">
          <span style="display:flex;align-items:center;gap:var(--sp-3);min-width:0">
            <span style="flex-shrink:0;width:32px;height:32px;border-radius:var(--r-pill);background:${statusBg};color:${statusColor};display:grid;place-items:center;font-weight:var(--fw-bold);font-size:var(--fs-14);font-variant-numeric:tabular-nums">${statusGlyph}</span>
            <span style="font-weight:var(--fw-semi);font-size:var(--fs-17);color:var(--ink);letter-spacing:var(--ls-snug);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Phase ${phIdx + 1} · ${ph.name}</span>
          </span>
          <span style="font-weight:var(--fw-semi);font-size:var(--fs-13);color:var(--mute);flex-shrink:0;font-variant-numeric:tabular-nums">${phDone}/${items.length}</span>
        </summary>
        <div class="path-list" style="padding:var(--sp-3) 0 0 0"></div>`;
      const list = phSec.querySelector('.path-list');
      items.forEach((n) => {
        const done = isDone(n);
        const isNext = (LESSON_PATH[nextIdx] && LESSON_PATH[nextIdx].id === n.id);
        const node = document.createElement('div');
        node.className = `path-node ${done ? 'done' : (isNext ? 'unlocked' : '')}`;
        if (isNext) {
          node.style.boxShadow = '0 0 0 2px var(--accent), var(--e2)';
        }
        const nextTag = isNext
          ? '<span class="tag" style="background:var(--accent);color:white">Next</span>'
          : '';
        node.innerHTML = `
          <div class="num">${done ? '✓' : n.id}</div>
          <div class="info">
            <h4>${escapeHTML(n.title)} ${nextTag}</h4>
            <p>${escapeHTML(n.desc)}</p>
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

  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  return { render };
})();
