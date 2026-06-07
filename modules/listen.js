// Listening Lab: TTS plays, user types. Variable speed (slow/normal/fast).
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
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Listen'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Listening Lab</p>
        <h1>Hear it.<br/>Then type it.</h1>
        <p style="margin-top:var(--sp-4)">Native Canadian French. Start slow. Build to natural pace.</p>
      </section>
      <div class="grid" id="l-grid"></div>`;
    const grid = container.querySelector('#l-grid');
    for (const k of Object.keys(LISTENING)) {
      const s = LISTENING[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">🔊</div><h3>${s.title}</h3><p><span class="tag">${s.level}</span></p><p style="margin-top:8px">${s.items.length} items</p>`;
      card.onclick = () => App.go('listen', { set: k });
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
        ${Chrome.render({
          back: 'listen',
          crumbs: ['Listen', s.title],
          progress: { current: i, total: s.items.length }
        })}
        <div class="lesson">
          <h2>🎧 ${s.title}</h2>
          <div class="center">
            <div class="row" style="justify-content:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
              <button class="btn secondary" data-rate="0.6">🐢 Slow</button>
              <button class="btn big" data-rate="0.85">🔊 Normal</button>
              <button class="btn secondary" data-rate="1.0">🐇 Natural</button>
            </div>
            <p style="color:var(--mute);font-size:13px">Press a speed to replay the audio.</p>
          </div>
          <div class="spacer"></div>
          <label style="font-weight:600">Type what you hear:</label>
          <input class="input" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="..." />
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:flex-end">
            <button class="btn secondary" id="skip">Show answer</button>
            <button class="btn primary" id="submit">Check</button>
          </div>
        </div>`;
      const inp = container.querySelector('#ans');
      const fb = container.querySelector('#fb');
      container.querySelectorAll('[data-rate]').forEach(b => {
        b.onclick = () => TTS.speak(it.audio, parseFloat(b.dataset.rate));
      });
      setTimeout(() => { TTS.speak(it.audio, 0.85); inp.focus(); }, 300);
      const check = () => {
        const ans = inp.value.trim();
        if (!ans) return;
        const ok = it.accept.some(a => similar(ans, a) >= 0.85);
        if (ok) {
          correct++;
          App.addXP(8);
          fb.innerHTML = `<div class="feedback good">✓ Correct! <small>${it.audio}</small></div><div class="adv-host"></div>`;
        } else {
          fb.innerHTML = `<div class="feedback bad">✗ Not quite. <small>You wrote: <b>${escapeHTML(ans)}</b><br>Correct: <b>${escapeHTML(it.audio)}</b></small></div><div class="adv-host"></div>`;
          MistakesModule.record({
            type: 'listen',
            sig: `listen:${setKey}:${i}`,
            prompt: `Listen and type: <em>(audio)</em>`,
            correct: it.audio,
            your: ans,
          });
        }
        Chrome.advance({
          host: container.querySelector('.adv-host'),
          onNext: () => { i++; show(); },
          seconds: ok ? 3 : 5,
          result: ok ? 'correct' : 'wrong',
        });
      };
      container.querySelector('#submit').onclick = check;
      container.querySelector('#skip').onclick = () => {
        fb.innerHTML = `<div class="feedback bad">Answer: <b>${escapeHTML(it.audio)}</b></div><div class="adv-host"></div>`;
        Chrome.advance({
          host: container.querySelector('.adv-host'),
          onNext: () => { i++; show(); },
          seconds: 4,
          result: 'wrong',
        });
      };
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    }
    function finish() {
      App.markLessonDone(`listen:${setKey}`);
      const pct = Math.round((correct / s.items.length) * 100);
      container.innerHTML = `
        ${Chrome.render({ back: 'listen', crumbs: ['Listen', s.title, 'Result'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 70 ? '🎯' : '👂'}</div>
            <h2>Listening done</h2>
            <p>Score: <b>${correct}/${s.items.length}</b> (${pct}%)</p>
            <p style="color:var(--mute);margin-top:var(--sp-2)">${pct >= 80 ? 'Your ear is sharp. Try the natural-speed sets next.' : pct >= 50 ? 'Re-listen to the misses at slow speed, then natural.' : 'Slow it down. Build up. Repetition wins this.'}</p>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('listen')">More listening</button>
              <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
            </div>
          </div>
        </div>`;
    }
    show();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  return {
    render(container, params) {
      if (params && params.set) renderSet(container, params.set);
      else renderList(container);
    }
  };
})();
