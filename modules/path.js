// Learning path — ordered, unlock previous-required.
window.PathModule = (function () {
  function render(container) {
    const lessons = App.state.lessons;
    const completed = LESSON_PATH.filter(n => isDone(n)).length;

    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🗺️ Your Path to CLB 6</h1>
        <p>${completed} / ${LESSON_PATH.length} milestones complete. Daily 30-45 min → CLB 6 in 3-4 months.</p>
        <div class="meter" style="background:rgba(255,255,255,.3);margin-top:14px;height:10px"><div style="width:${(completed / LESSON_PATH.length) * 100}%;background:white;height:100%;border-radius:999px"></div></div>
      </div>
      <div class="path-list" id="path"></div>`;

    const list = container.querySelector('#path');
    let unlockNext = true;
    LESSON_PATH.forEach((n, idx) => {
      const done = isDone(n);
      const unlocked = done || unlockNext;
      if (!done) unlockNext = false; // only one new unlocked
      const node = document.createElement('div');
      node.className = `path-node ${done ? 'done' : (unlocked ? 'unlocked' : 'locked')}`;
      node.innerHTML = `
        <div class="num">${done ? '✓' : idx + 1}</div>
        <div class="info">
          <h4>${n.title}</h4>
          <p>${n.desc}</p>
        </div>
        <div class="badge">+${n.xp} XP</div>`;
      if (unlocked) {
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
      }
      list.appendChild(node);
    });
  }

  function isDone(n) {
    const keys = {
      vocab: `vocab:${n.deck}`,
      grammar: `grammar:${n.unit}`,
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
