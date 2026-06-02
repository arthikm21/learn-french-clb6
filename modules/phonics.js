// Phonics module — sounds, mouth tips, audio examples.
window.PhonicsModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Phonics'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Phonics & Sounds</p>
        <h1>Sounds first.<br/>Words later.</h1>
        <p style="margin-top:var(--sp-4)">Pronunciation is the foundation. Master these 7 lessons and speaking jumps a full CLB band.</p>
      </section>
      <div class="grid" id="p-grid"></div>`;
    const grid = container.querySelector('#p-grid');
    for (const u of PHONICS) {
      const done = App.state.lessons[`phonics:${u.id}`] || false;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${u.icon}</div>
        <h3>${u.title}</h3>
        <p>${u.sounds.length} sounds${done ? ' · <span class="tag" style="color:var(--good)">✓ Done</span>' : ''}</p>`;
      card.onclick = () => App.go('phonics', { unit: u.id });
      grid.appendChild(card);
    }
  }

  function renderUnit(container, id) {
    const u = PHONICS.find(x => x.id === id);
    container.innerHTML = `
      ${Chrome.render({ back: 'phonics', crumbs: ['Phonics', u.title] })}
      <div class="lesson">
        <h2>${u.icon} ${u.title}</h2>
        <p style="font-size:var(--fs-17);line-height:var(--lh-loose);margin:var(--sp-3) 0 var(--sp-5);color:var(--ink-2)">${u.intro}</p>
        ${u.warn ? `<div class="feedback bad" style="margin:var(--sp-3) 0">${u.warn}</div>` : ''}
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--sp-3)">
          ${u.sounds.map((s, i) => `
            <div class="card" style="cursor:default" data-i="${i}">
              <div class="row" style="justify-content:space-between;align-items:flex-start">
                <div>
                  <div style="font-size:var(--fs-34);font-weight:var(--fw-bold);color:var(--accent);letter-spacing:var(--ls-snug)">${s.ipa}</div>
                  <div style="color:var(--mute);font-size:var(--fs-13);margin-top:4px">spelling: <b>${s.spell}</b></div>
                </div>
                <button class="btn secondary sm" data-play="${i}">🔊</button>
              </div>
              <div style="margin-top:var(--sp-3);font-size:var(--fs-22);font-weight:var(--fw-bold);color:var(--ink);letter-spacing:var(--ls-snug)">${s.word}</div>
              <div style="color:var(--mute);font-style:italic">${s.mean}</div>
              <p style="margin-top:var(--sp-3);font-size:var(--fs-14);line-height:var(--lh-base);color:var(--ink-2)">${s.tip}</p>
            </div>`).join('')}
        </div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:flex-end">
          <button class="btn primary big" id="done">I practiced this<span class="arr">→</span></button>
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
        ${Chrome.render({
          back: () => `App.go('phonics', { unit: '${unitId}' })`,
          crumbs: ['Phonics', mp.title, 'Ear drill'],
          progress: { current: i, total: queue.length }
        })}
        <div class="lesson">
          <h2>🎧 ${mp.title}</h2>
          <p style="color:var(--mute);font-size:var(--fs-14)">${mp.desc}</p>
          <div class="spacer"></div>
          <p class="center" style="color:var(--mute);font-size:var(--fs-14)">Which word do you hear?</p>
          <div class="center">
            <button class="btn primary big" id="replay">🔊 Hear again</button>
          </div>
          <div class="spacer"></div>
          <div class="options" style="grid-template-columns:1fr 1fr">
            <div class="option" data-pick="a">
              <div style="font-size:var(--fs-28);font-weight:var(--fw-bold);color:var(--bleu);letter-spacing:var(--ls-snug)">${p.a}</div>
              <div style="font-size:var(--fs-12);color:var(--mute);margin-top:4px">${p.meanA}</div>
            </div>
            <div class="option" data-pick="b">
              <div style="font-size:var(--fs-28);font-weight:var(--fw-bold);color:var(--rouge);letter-spacing:var(--ls-snug)">${p.b}</div>
              <div style="font-size:var(--fs-12);color:var(--mute);margin-top:4px">${p.meanB}</div>
            </div>
          </div>
          <div id="fb"></div>
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
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct: <b>${target}</b></div><div class="adv-host"></div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option').forEach(x => { if ((x.dataset.pick === 'a' && isA) || (x.dataset.pick === 'b' && !isA)) x.classList.add('correct'); });
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Was actually <b>${target}</b></div><div class="adv-host"></div>`;
          }
          Chrome.advance({
            host: container.querySelector('.adv-host'),
            onNext: () => { i++; show(); },
            seconds: right ? 3 : 4,
          });
        };
      });
    }
    function finish() {
      const pct = Math.round((correct / queue.length) * 100);
      if (pct >= 75) App.markLessonDone(`phonics:${unitId}-minpairs`);
      container.innerHTML = `
        ${Chrome.render({ back: 'phonics', crumbs: ['Phonics', 'Ear drill', 'Result'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 75 ? '👂' : '🔁'}</div>
            <h2>${pct >= 75 ? 'Sharp ear' : 'More practice needed'}</h2>
            <p>${correct}/${queue.length} correct (${pct}%)</p>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('phonics', { unit: '${unitId}' })">Back to unit</button>
              <button class="btn ghost big" onclick="App.go('phonics')">All phonics</button>
            </div>
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
