// Phonics module — sounds, mouth tips, audio examples.
window.PhonicsModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🔊 Phonics & Sounds</h1>
        <p>Pronunciation is the foundation. Master these 7 lessons and your speaking score jumps a full CLB band.</p>
      </div>
      <div class="grid" id="p-grid"></div>`;
    const grid = container.querySelector('#p-grid');
    for (const u of PHONICS) {
      const done = App.state.lessons[`phonics:${u.id}`] || false;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${u.icon}</div>
        <h3>${u.title}</h3>
        <p>${u.sounds.length} sounds${done ? ' · <span class="tag" style="background:#dcfce7;color:var(--good)">✓ Done</span>' : ''}</p>`;
      card.onclick = () => App.go('phonics', { unit: u.id });
      grid.appendChild(card);
    }
  }

  function renderUnit(container, id) {
    const u = PHONICS.find(x => x.id === id);
    container.innerHTML = `
      <div class="lesson">
        <h2>${u.icon} ${u.title}</h2>
        <p style="font-size:16px;line-height:1.6;margin:10px 0 16px">${u.intro}</p>
        ${u.warn ? `<div class="feedback bad" style="margin:10px 0">${u.warn}</div>` : ''}
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
          ${u.sounds.map((s, i) => `
            <div class="card" style="cursor:default" data-i="${i}">
              <div class="row" style="justify-content:space-between;align-items:flex-start">
                <div>
                  <div style="font-family:'Fredoka';font-size:32px;color:var(--bleu)">${s.ipa}</div>
                  <div style="color:var(--mute);font-size:13px">spelling: <b>${s.spell}</b></div>
                </div>
                <button class="btn secondary" data-play="${i}">🔊</button>
              </div>
              <div style="margin-top:10px;font-size:20px;font-family:'Fredoka';color:var(--ink)">${s.word}</div>
              <div style="color:var(--mute);font-style:italic">${s.mean}</div>
              <p style="margin-top:10px;font-size:14px;line-height:1.5">${s.tip}</p>
            </div>`).join('')}
        </div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('phonics')">← Phonics</button>
          <button class="btn big" id="done">I practiced this →</button>
        </div>
      </div>`;
    container.querySelectorAll('[data-play]').forEach(b => {
      b.onclick = () => {
        const i = parseInt(b.dataset.play);
        TTS.speak(u.sounds[i].word, 0.85);
      };
    });
    container.querySelector('#done').onclick = () => {
      App.markLessonDone(`phonics:${u.id}`);
      App.go('phonics');
    };
    // If this unit has a minimal-pair drill, add a button to launch it
    const mp = window.MIN_PAIRS && window.MIN_PAIRS[u.id];
    if (mp) {
      const btnRow = container.querySelector('.row:last-child');
      const btn = document.createElement('button');
      btn.className = 'btn secondary';
      btn.textContent = '🎧 Minimal-pair ear drill';
      btn.onclick = () => renderMinPairDrill(container, u.id);
      btnRow.insertBefore(btn, btnRow.querySelector('#done'));
    }
  }

  // Minimal-pair ear drill: hear one word, pick which one.
  function renderMinPairDrill(container, unitId) {
    const mp = window.MIN_PAIRS[unitId];
    let i = 0, correct = 0;
    let queue = [...mp.pairs].sort(() => Math.random() - 0.5);
    function show() {
      if (i >= queue.length) return finish();
      const p = queue[i];
      const isA = Math.random() < 0.5;
      const target = isA ? p.a : p.b;
      container.innerHTML = `
        <div class="lesson">
          <h2>🎧 ${mp.title}</h2>
          <p style="color:var(--mute);font-size:14px">${mp.desc}</p>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${i + 1}/${queue.length}</span></div>
          <div class="spacer"></div>
          <p class="center" style="color:var(--mute);font-size:14px">Which word do you hear?</p>
          <div class="center">
            <button class="btn big" id="replay">🔊 Hear again</button>
          </div>
          <div class="spacer"></div>
          <div class="options" style="grid-template-columns:1fr 1fr">
            <div class="option" data-pick="a">
              <div style="font-family:'Fredoka',sans-serif;font-size:26px;color:var(--bleu)">${p.a}</div>
              <div style="font-size:12px;color:var(--mute);margin-top:4px">${p.meanA}</div>
            </div>
            <div class="option" data-pick="b">
              <div style="font-family:'Fredoka',sans-serif;font-size:26px;color:var(--rouge)">${p.b}</div>
              <div style="font-size:12px;color:var(--mute);margin-top:4px">${p.meanB}</div>
            </div>
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row"><button class="btn ghost" onclick="App.go('phonics', { unit: '${unitId}' })">← Back</button></div>
        </div>`;
      container.querySelector('#replay').onclick = () => TTS.speak(target, 0.85);
      setTimeout(() => TTS.speak(target, 0.85), 300);
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const pick = el.dataset.pick;
          const right = (pick === 'a' && isA) || (pick === 'b' && !isA);
          if (right) {
            el.classList.add('correct');
            correct++;
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct: <b>${target}</b></div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option').forEach(x => { if ((x.dataset.pick === 'a' && isA) || (x.dataset.pick === 'b' && !isA)) x.classList.add('correct'); });
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Was actually <b>${target}</b></div>`;
          }
          setTimeout(() => { i++; show(); }, 1700);
        };
      });
    }
    function finish() {
      const pct = Math.round((correct / queue.length) * 100);
      if (pct >= 75) App.markLessonDone(`phonics:${unitId}-minpairs`);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 75 ? '👂' : '🔁'}</div>
            <h2>${pct >= 75 ? 'Sharp ear!' : 'More practice needed'}</h2>
            <p>${correct}/${queue.length} correct (${pct}%)</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('phonics', { unit: '${unitId}' })">Back to unit</button>
            <button class="btn ghost big" onclick="App.go('phonics')">All phonics</button>
          </div>
        </div>`;
    }
    show();
  }

  return {
    render(container, params) {
      if (params && params.unit) renderUnit(container, params.unit);
      else renderList(container);
    }
  };
})();
