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
  }

  return {
    render(container, params) {
      if (params && params.unit) renderUnit(container, params.unit);
      else renderList(container);
    }
  };
})();
