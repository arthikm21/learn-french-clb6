// Reading: graded text + multiple-choice comprehension.
window.ReadModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>📖 Reading Quests</h1>
        <p>Short authentic-style French texts with comprehension questions. CLB 4 → 6.</p>
      </div>
      <div class="grid" id="r-grid"></div>`;
    const grid = container.querySelector('#r-grid');
    for (const k of Object.keys(READINGS)) {
      const t = READINGS[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">📖</div><h3>${t.title}</h3><p><span class="tag">${t.level}</span></p><p style="margin-top:8px">${t.questions.length} questions</p>`;
      card.onclick = () => renderText(container, k);
      grid.appendChild(card);
    }
  }

  function renderText(container, key) {
    const t = READINGS[key];
    let phase = 'read', qi = 0, correct = 0;

    function showText() {
      container.innerHTML = `
        <div class="lesson">
          <h2>📖 ${t.title} <span class="tag">${t.level}</span></h2>
          <div style="background:#fffdf7;border:2px solid #fcd34d;padding:20px;border-radius:12px;line-height:1.8;font-size:17px;white-space:pre-wrap">${t.text}</div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('read')">← Texts</button>
            <button class="btn big" id="start">Comprehension →</button>
          </div>
        </div>`;
      container.querySelector('#start').onclick = () => { phase = 'quiz'; showQ(); };
    }

    function showQ() {
      const q = t.questions[qi];
      container.innerHTML = `
        <div class="lesson">
          <h2>📖 ${t.title}</h2>
          <div class="progress"><div style="width:${(qi / t.questions.length) * 100}%"></div></div>
          <details style="margin-bottom:14px"><summary style="cursor:pointer;color:var(--bleu);font-weight:700">Show text again</summary>
            <div style="background:#fffdf7;padding:14px;border-radius:10px;margin-top:8px;white-space:pre-wrap;font-size:15px;line-height:1.6">${t.text}</div>
          </details>
          <div class="q-prompt">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${o}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('read')">← Quit</button>
            <span style="color:var(--mute)">Q ${qi + 1} / ${t.questions.length}</span>
          </div>
        </div>`;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const i = parseInt(el.dataset.i);
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          if (i === q.a) {
            el.classList.add('correct');
            correct++;
            App.addXP(8);
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct!</div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[q.a].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Right answer: <b>${q.opts[q.a]}</b></div>`;
          }
          setTimeout(() => { qi++; qi >= t.questions.length ? finish() : showQ(); }, 1300);
        };
      });
    }

    function finish() {
      const pct = Math.round((correct / t.questions.length) * 100);
      if (pct >= 70) App.markLessonDone(`read:${key}`);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 70 ? '📜' : '📖'}</div>
            <h2>${pct >= 70 ? 'Read & Understood!' : 'Re-read & Retry'}</h2>
            <p>Score: <b>${correct}/${t.questions.length}</b> (${pct}%)</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('read')">More Texts</button>
            <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
          </div>
        </div>`;
    }

    showText();
  }

  return {
    render(container, params) {
      if (params && params.text) renderText(container, params.text);
      else renderList(container);
    }
  };
})();
