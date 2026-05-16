// Listening: TTS plays, user types what they hear. Levenshtein-tolerant.
window.ListenModule = (function () {
  function lev(a, b) {
    a = a.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/gi, '').trim();
    b = b.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/gi, '').trim();
    const m = [];
    for (let i = 0; i <= b.length; i++) m[i] = [i];
    for (let j = 0; j <= a.length; j++) m[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : 1 + Math.min(m[i-1][j-1], m[i][j-1], m[i-1][j]);
      }
    }
    return m[b.length][a.length];
  }
  function similar(a, b) {
    const d = lev(a, b);
    const max = Math.max(a.length, b.length);
    return max === 0 ? 1 : 1 - d / max;
  }

  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎧 Listening Lab</h1>
        <p>Hear native-style French. Type what you hear. Improves ear training for CLB Listening.</p>
      </div>
      <div class="grid" id="l-grid"></div>`;
    const grid = container.querySelector('#l-grid');
    for (const k of Object.keys(LISTENING)) {
      const s = LISTENING[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">🔊</div><h3>${s.title}</h3><p><span class="tag">${s.level}</span></p><p style="margin-top:8px">${s.items.length} items</p>`;
      card.onclick = () => renderSet(container, k);
      grid.appendChild(card);
    }
  }

  function renderSet(container, setKey) {
    const s = LISTENING[setKey];
    let i = 0, correct = 0;
    function show() {
      if (i >= s.items.length) return finish();
      const it = s.items[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🎧 ${s.title}</h2>
          <div class="progress"><div style="width:${(i / s.items.length) * 100}%"></div></div>
          <div class="center">
            <button class="btn big" id="play">🔊 Play (again)</button>
            <button class="btn ghost" id="slow">🐢 Slow</button>
          </div>
          <div class="spacer"></div>
          <label>Type what you hear:</label>
          <input class="input" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('listen')">← Quit</button>
            <div class="row">
              <button class="btn secondary" id="skip">Show answer</button>
              <button class="btn" id="submit">Check</button>
            </div>
          </div>
        </div>`;
      const inp = container.querySelector('#ans');
      const fb = container.querySelector('#fb');
      container.querySelector('#play').onclick = () => TTS.speak(it.audio, 0.9);
      container.querySelector('#slow').onclick = () => TTS.speak(it.audio, 0.6);
      setTimeout(() => { TTS.speak(it.audio, 0.9); inp.focus(); }, 300);
      const check = () => {
        const ans = inp.value.trim();
        if (!ans) return;
        const ok = it.accept.some(a => similar(ans, a) >= 0.85);
        if (ok) {
          correct++;
          App.addXP(8);
          fb.innerHTML = `<div class="feedback good">✓ Correct! <small>${it.audio}</small></div>`;
        } else {
          fb.innerHTML = `<div class="feedback bad">✗ Not quite. <small>You wrote: <b>${ans}</b><br>Correct: <b>${it.audio}</b></small></div>`;
        }
        setTimeout(() => { i++; show(); }, 1800);
      };
      container.querySelector('#submit').onclick = check;
      container.querySelector('#skip').onclick = () => {
        fb.innerHTML = `<div class="feedback bad">Answer: <b>${it.audio}</b></div>`;
        setTimeout(() => { i++; show(); }, 1800);
      };
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    }
    function finish() {
      App.markLessonDone(`listen:${setKey}`);
      const pct = Math.round((correct / s.items.length) * 100);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 70 ? '🎯' : '👂'}</div>
            <h2>Listening Done</h2>
            <p>Score: <b>${correct}/${s.items.length}</b> (${pct}%)</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('listen')">More Listening</button>
            <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
          </div>
        </div>`;
    }
    show();
  }

  return {
    render(container, params) {
      if (params && params.set) renderSet(container, params.set);
      else renderList(container);
    }
  };
})();
