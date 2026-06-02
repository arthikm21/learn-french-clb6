// Listening Mastery — short clips, 5 exercise types, speed progression.
//
// Routes:
//   #listenmastery                    → category picker
//   #listenmastery?cat=Medical        → run all exercises in this category as a session
//   #listenmastery?cat=All            → run a shuffled mix across all categories
//
// Speed defaults per level (LISTENING_LEVEL_SPEED), overridable per click.
// All 5 exercise types share the same "play-clip + answer + feedback" flow;
// only the answer widget differs (renderTypeA/B/C/D/E).

window.ListenMasteryModule = (function () {
  const escapeHTML = Chrome.escapeHTML;
  const SPEEDS = [
    { rate: 0.7,  icon: '🐢', label: 'Slow' },
    { rate: 0.85, icon: '🚶', label: 'Easy' },
    { rate: 1.0,  icon: '🔊', label: 'Normal' },
    { rate: 1.2,  icon: '🐇', label: 'Fast' },
  ];

  const TYPE_LABEL = {
    A: 'Listen + choose',
    B: 'Fill the blank',
    C: 'Reorder lines',
    D: 'Speaker intent',
    E: 'Best summary',
  };

  // ─────────────── LIST ───────────────
  function renderList(container) {
    const all = window.LISTENING_MASTERY || [];
    // Group by category
    const byCat = {};
    for (const ex of all) (byCat[ex.category] = byCat[ex.category] || []).push(ex);

    const cards = Object.keys(byCat).sort().map(cat => {
      const items = byCat[cat];
      const done = items.filter(ex => App.state.lessons[`listenmastery:${ex.id}`]).length;
      const typeCounts = {};
      for (const ex of items) typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;
      const typeBadges = Object.keys(typeCounts).sort().map(t => `<span class="tag">${t}·${typeCounts[t]}</span>`).join(' ');
      return `
        <div class="card" data-cat="${escapeHTML(cat)}">
          <div class="icon">🎧</div>
          <h3>${escapeHTML(cat)}</h3>
          <p style="color:var(--ink-2);font-size:var(--fs-14);margin-top:4px">${items.length} clip${items.length === 1 ? '' : 's'} · ${done}/${items.length} done</p>
          <p style="margin-top:var(--sp-3)">${typeBadges}</p>
        </div>`;
    }).join('');

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Listening Mastery'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Listening Mastery</p>
        <h1>Short clips.<br/>Five drill types.</h1>
        <p style="margin-top:var(--sp-4)">Real Canadian-life clips at four speeds. Listen, choose, fill, reorder, identify intent, or pick the best summary. Build the ear that CLB 6 demands.</p>
      </section>

      <div class="spotlight" style="cursor:pointer" data-cat="__all__">
        <div>
          <p class="eyebrow">Mixed practice</p>
          <h2>All categories, shuffled</h2>
          <p>${all.length} clips across 5 exercise types. The closest thing to the real exam.</p>
        </div>
        <button class="btn primary big">Start mixed<span class="arr">→</span></button>
      </div>

      <h2 class="section-h">By category</h2>
      <div class="grid">${cards}</div>

      <div class="spacer lg"></div>
      <div class="grammar-box">
        <h3>The 5 exercise types</h3>
        <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
          <li><b>A · Listen + choose</b> — hear the clip, pick what was said or what happens next.</li>
          <li><b>B · Fill the blank</b> — same sentence with one missing word, identify it.</li>
          <li><b>C · Reorder lines</b> — 4 jumbled sentences from a mini-conversation.</li>
          <li><b>D · Speaker intent</b> — what is the speaker trying to do? (request / complain / decline…)</li>
          <li><b>E · Best summary</b> — pick the option that best summarizes what you heard.</li>
        </ul>
      </div>
    `;
    container.querySelectorAll('[data-cat]').forEach(el => {
      el.onclick = () => App.go('listenmastery', { cat: el.dataset.cat });
    });
  }

  // ─────────────── SESSION ───────────────
  function renderSession(container, cat) {
    const all = window.LISTENING_MASTERY || [];
    let queue = cat === '__all__'
      ? all.slice().sort(() => Math.random() - 0.5)
      : all.filter(ex => ex.category === cat);
    if (queue.length === 0) { App.go('listenmastery'); return; }

    let i = 0, correct = 0;

    function defaultSpeed(level) { return (window.LISTENING_LEVEL_SPEED && window.LISTENING_LEVEL_SPEED[level]) || 1.0; }

    function speedButtonsHTML(currentRate) {
      return SPEEDS.map(s => {
        const active = Math.abs(s.rate - currentRate) < 0.01;
        return `<button class="btn ${active ? 'primary' : 'secondary'} sm" data-rate="${s.rate}">${s.icon} ${s.label}</button>`;
      }).join('');
    }

    function commonChrome() {
      return Chrome.render({
        back: 'listenmastery',
        crumbs: ['Listening Mastery', cat === '__all__' ? 'Mixed' : cat],
        progress: { current: i, total: queue.length },
      });
    }

    function show() {
      if (i >= queue.length) return finish();
      const ex = queue[i];
      const initialRate = defaultSpeed(ex.level);

      container.innerHTML = `
        ${commonChrome()}
        <div class="lesson">
          <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">${escapeHTML(ex.category)} · Type ${ex.type} · ${escapeHTML(TYPE_LABEL[ex.type] || '')} · ${escapeHTML(ex.level)}</p>

          <div class="center" style="margin:var(--sp-5) 0">
            <button class="btn primary big" id="play" data-rate="${initialRate}">🔊 Play clip</button>
            <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-3)">Listen all the way through before answering.</p>
            <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-3)" id="speed-row">
              ${speedButtonsHTML(initialRate)}
            </div>
          </div>

          <div id="exercise-host"></div>
          <div id="fb"></div>
        </div>`;

      // Auto-play once at level-appropriate speed on first appearance
      setTimeout(() => TTS.speak(ex.audio, initialRate), 300);
      let currentRate = initialRate;

      function rebindSpeeds() {
        container.querySelectorAll('[data-rate]').forEach(b => {
          b.onclick = () => {
            currentRate = parseFloat(b.dataset.rate);
            TTS.speak(ex.audio, currentRate);
            // Refresh active state without re-rendering the whole exercise
            const row = container.querySelector('#speed-row');
            if (row) row.innerHTML = speedButtonsHTML(currentRate);
            rebindSpeeds();
            const playBtn = container.querySelector('#play');
            if (playBtn) {
              playBtn.dataset.rate = String(currentRate);
              playBtn.onclick = () => TTS.speak(ex.audio, currentRate);
            }
          };
        });
        const playBtn = container.querySelector('#play');
        if (playBtn) playBtn.onclick = () => TTS.speak(ex.audio, currentRate);
      }
      rebindSpeeds();

      // Render the type-specific answer widget
      const host = container.querySelector('#exercise-host');
      const fb   = container.querySelector('#fb');
      if (ex.type === 'A' || ex.type === 'D' || ex.type === 'E') renderMC(host, fb, ex);
      else if (ex.type === 'B') renderBlank(host, fb, ex);
      else if (ex.type === 'C') renderReorder(host, fb, ex);
    }

    // ── Common MC handler — works for A, D, E
    function renderMC(host, fb, ex) {
      // Type B shows the sentence-with-blank above the options. The English
      // gloss of the full clip is intentionally withheld here — revealing it
      // would give away the missing word. The transcript+gloss appears after
      // the user picks an answer (see `transcript` below).
      const promptHTML = ex.type === 'B'
        ? `<p class="q-prompt">${escapeHTML(ex.prompt)}</p><p style="font-size:var(--fs-22);text-align:center;color:var(--ink);font-weight:var(--fw-semi);margin:var(--sp-3) 0">${escapeHTML(ex.blank)}</p>`
        : `<p class="q-prompt">${escapeHTML(ex.prompt)}</p>`;

      host.innerHTML = `
        ${promptHTML}
        <div class="options">
          ${ex.opts.map((o, idx) => `<div class="option" data-i="${idx}">${escapeHTML(o)}</div>`).join('')}
        </div>`;
      host.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const picked = parseInt(el.dataset.i, 10);
          host.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const right = picked === ex.a;
          // After answering, reveal the audio transcript + English gloss so the
          // learner can see what they heard. Critical for beginners who picked
          // by ear and want to confirm what they actually understood.
          const transcript = `<div style="background:var(--surface-2);padding:var(--sp-3);border-radius:var(--r-md);margin-top:var(--sp-3)"><p style="font-size:var(--fs-13);color:var(--mute);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:6px">What you heard</p><p style="color:var(--ink);font-weight:var(--fw-semi)">${escapeHTML(ex.audio)}</p>${Chrome.gloss(ex.audioEn)}</div>`;
          if (right) {
            el.classList.add('correct');
            correct++;
            fb.innerHTML = `<div class="feedback good">✓ Correct! ${ex.why ? '<small>' + ex.why + '</small>' : ''}</div>${transcript}<div class="adv-host"></div>`;
          } else {
            el.classList.add('wrong');
            host.querySelectorAll('.option')[ex.a].classList.add('correct');
            fb.innerHTML = `<div class="feedback bad">✗ Right answer: <b>${escapeHTML(ex.opts[ex.a])}</b>. ${ex.why ? '<small>' + ex.why + '</small>' : ''}</div>${transcript}<div class="adv-host"></div>`;
            MistakesModule.record({
              type: 'listenmastery',
              sig: `listenmastery:${ex.id}`,
              prompt: `[${ex.category} · Type ${ex.type}] ${ex.prompt}`,
              correct: ex.opts[ex.a],
              your: ex.opts[picked],
            });
          }
          App.markLessonDone(`listenmastery:${ex.id}`);
          Chrome.advance({ host: fb.querySelector('.adv-host'), onNext: advance, seconds: right ? 3 : 4 });
        };
      });
    }

    // ── Type B is also MC under the hood — reuse renderMC
    function renderBlank(host, fb, ex) { renderMC(host, fb, ex); }

    // ── Type C — reorder
    function renderReorder(host, fb, ex) {
      const ordered = ex.ordered;
      // Shuffle (ensure not identical to ordered)
      let pool;
      do {
        pool = ordered.slice().sort(() => Math.random() - 0.5);
      } while (pool.every((s, idx) => s === ordered[idx]) && ordered.length > 1);

      const placed = []; // chosen order
      const remaining = pool.slice();

      function repaint() {
        host.innerHTML = `
          <p class="q-prompt">${escapeHTML(ex.prompt)}</p>
          <div style="background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-md);padding:var(--sp-3);min-height:60px;margin-bottom:var(--sp-4)">
            <p style="font-size:var(--fs-12);color:var(--mute);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-2)">Your order</p>
            ${placed.length === 0
              ? '<p style="color:var(--mute);font-size:var(--fs-14)">Tap lines below to place them in order.</p>'
              : placed.map((s, idx) => `<div style="background:var(--surface);padding:10px 14px;border-radius:var(--r-sm);margin:4px 0;display:flex;align-items:center;gap:var(--sp-2)"><span style="font-variant-numeric:tabular-nums;color:var(--mute);font-size:var(--fs-13);flex-shrink:0;width:24px">${idx + 1}.</span><span style="flex:1">${escapeHTML(s)}</span></div>`).join('')}
          </div>

          <p style="font-size:var(--fs-12);color:var(--mute);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-2)">Lines to place</p>
          <div class="row" style="flex-direction:column;gap:var(--sp-2);align-items:stretch">
            ${remaining.map((s, idx) => `<button class="btn ghost" style="text-align:left;justify-content:flex-start" data-pool="${idx}">${escapeHTML(s)}</button>`).join('')}
          </div>

          ${placed.length > 0 ? `<div class="row" style="justify-content:space-between;margin-top:var(--sp-4)">
            <button class="btn ghost sm" id="undo">↶ Undo last</button>
            ${remaining.length === 0 ? '<button class="btn primary" id="check-order">Check order</button>' : ''}
          </div>` : ''}
        `;
        host.querySelectorAll('[data-pool]').forEach(b => {
          b.onclick = () => {
            const idx = parseInt(b.dataset.pool, 10);
            placed.push(remaining.splice(idx, 1)[0]);
            repaint();
          };
        });
        const undo = host.querySelector('#undo');
        if (undo) undo.onclick = () => { if (placed.length) { remaining.push(placed.pop()); repaint(); } };
        const check = host.querySelector('#check-order');
        if (check) check.onclick = () => {
          const right = placed.every((s, idx) => s === ordered[idx]);
          if (right) {
            correct++;
            fb.innerHTML = `<div class="feedback good">✓ Perfect order!</div><div class="adv-host"></div>`;
          } else {
            fb.innerHTML = `<div class="feedback bad">✗ Not quite. Correct order:<br><small>${ordered.map((s, idx) => (idx + 1) + '. ' + escapeHTML(s)).join('<br>')}</small></div><div class="adv-host"></div>`;
            MistakesModule.record({
              type: 'listenmastery',
              sig: `listenmastery:${ex.id}`,
              prompt: `[${ex.category} · Reorder] ${ex.prompt}`,
              correct: ordered.join(' / '),
              your: placed.join(' / '),
            });
          }
          App.markLessonDone(`listenmastery:${ex.id}`);
          // disable further interaction
          host.querySelectorAll('button').forEach(b => b.disabled = true);
          Chrome.advance({ host: fb.querySelector('.adv-host'), onNext: advance, seconds: right ? 3 : 5 });
        };
      }
      repaint();
    }

    function advance() { i++; show(); }

    function finish() {
      const pct = Math.round((correct / queue.length) * 100);
      container.innerHTML = `
        ${Chrome.render({ back: 'listenmastery', crumbs: ['Listening Mastery', cat === '__all__' ? 'Mixed' : cat, 'Result'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 80 ? '🎯' : pct >= 60 ? '👂' : '🔁'}</div>
            <h2>Session done</h2>
            <p>Score: <b>${correct}/${queue.length}</b> (${pct}%)</p>
            <p style="color:var(--mute);margin-top:var(--sp-2)">${pct >= 80 ? 'Sharp ear. Move up a speed.' : pct >= 60 ? 'Solid. Replay the missed clips at slow speed.' : 'Slow it down. Listen with intent. Repetition wins.'}</p>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('listenmastery', { cat: '${cat}' })">Run it again</button>
              <button class="btn ghost big" onclick="App.go('listenmastery')">Other categories</button>
            </div>
          </div>
        </div>`;
    }

    show();
  }

  return {
    render(container, params) {
      const cat = params && params.cat;
      if (cat) return renderSession(container, cat);
      return renderList(container);
    }
  };
})();
