// Connector Mastery — the 14 most-tested CLB 6 connectors, presented as a
// library + 4 drill exercise types.
//
// Routes:
//   #connectormastery                  → library (14 connectors grouped by category)
//   #connectormastery?focus=<id>       → deep view of one connector
//   #connectormastery?drill=mixed      → 12-question shuffled drill across all 4 types
//   #connectormastery?drill=complete   → fill-the-blank only
//   #connectormastery?drill=recognize  → listening recognition only
//   #connectormastery?drill=shadow     → shadow / repeat-after-me only
//
// Exercise types (all built from the connector data — no separate authoring):
//   COMPLETE   — read a context with a blank, pick which connector fits
//   RECOGNIZE  — hear a sentence, identify the connector that was used
//   SHADOW     — see a lead sentence + target connector, hear a model, repeat aloud, self-rate
//   FOCUS      — pick a connector and see all its examples + when-to-use

window.ConnectorMasteryModule = (function () {
  const escapeHTML = Chrome.escapeHTML;

  // Quick lookup by id
  function byId(id) { return CONNECTORS.find(c => c.id === id); }

  // ───────────── LIBRARY ─────────────
  function renderLibrary(container) {
    const byCat = {};
    for (const c of CONNECTORS) (byCat[c.category] = byCat[c.category] || []).push(c);

    const CAT_ICON = {
      Cause: '⬅️',
      Consequence: '➡️',
      Contrast: '⚔️',
      Addition: '➕',
      Reinforcement: '✓',
    };

    const blocks = Object.keys(byCat).map(cat => {
      const cards = byCat[cat].map(c => `
        <div class="card" data-id="${escapeHTML(c.id)}">
          <h3>${escapeHTML(c.word)}</h3>
          <p style="color:var(--ink-2);font-size:var(--fs-14);margin-top:4px"><b>${escapeHTML(c.gloss)}</b></p>
          <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-2)">${c.when}</p>
        </div>`).join('');
      return `
        <h2 class="section-h">${CAT_ICON[cat] || '•'} ${escapeHTML(cat)}</h2>
        <div class="grid">${cards}</div>`;
    }).join('');

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Connector Mastery'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Connector Mastery</p>
        <h1>Fourteen words.<br/>One CLB 6 marker.</h1>
        <p style="margin-top:var(--sp-4)">Using connectors automatically is one of the strongest predictors of CLB 6 speaking and writing. Learn the 14 below — when each one fits, then drill until they appear in your output without thinking.</p>
      </section>

      <div class="spotlight" style="cursor:pointer" data-drill="mixed">
        <div>
          <p class="eyebrow">Drill</p>
          <h2>Mixed practice — 12 questions, all 4 types</h2>
          <p>Fill blanks · listen + identify · shadow + repeat. Drawn at random from all 14 connectors.</p>
        </div>
        <button class="btn primary big">Start drill<span class="arr">→</span></button>
      </div>

      <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap;margin-bottom:var(--sp-7)">
        <button class="btn secondary" data-drill="complete">📝 Fill blanks only</button>
        <button class="btn secondary" data-drill="recognize">🎧 Listening only</button>
        <button class="btn secondary" data-drill="shadow">🎙 Shadow only</button>
      </div>

      ${blocks}

      <div class="spacer lg"></div>
      <div class="grammar-box">
        <h3>Why these 14?</h3>
        <p>TCF graders score speaking and writing on <b>structuration du discours</b> — how organized your ideas are. Connectors are the visible signal of organization. Using <i>cependant</i> instead of <i>mais</i>, <i>par conséquent</i> instead of <i>donc</i>, <i>en effet</i> to back up a claim — these single-word swaps move you from CLB 4-5 to CLB 6 in the rater's ear.</p>
      </div>
    `;

    container.querySelectorAll('[data-id]').forEach(el => {
      el.onclick = () => App.go('connectormastery', { focus: el.dataset.id });
    });
    container.querySelectorAll('[data-drill]').forEach(el => {
      el.onclick = () => App.go('connectormastery', { drill: el.dataset.drill });
    });
  }

  // ───────────── FOCUS (one connector deep) ─────────────
  function renderFocus(container, c) {
    container.innerHTML = `
      ${Chrome.render({ back: 'connectormastery', crumbs: ['Connector Mastery', c.word] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">${escapeHTML(c.category)}</p>
        <h1>${escapeHTML(c.word)}</h1>
        <p style="margin-top:var(--sp-3);font-size:var(--fs-22);color:var(--ink-2)">${escapeHTML(c.gloss)}</p>
      </section>

      <div class="grammar-box" style="border-left-color:var(--accent)">
        <h3>When to use</h3>
        <p>${c.when}</p>
      </div>

      <div class="grammar-box">
        <h3>Examples (tap any to hear)</h3>
        ${c.examples.map((ex, i) => {
          // Accept both legacy string and { fr, en } shapes
          const fr = typeof ex === 'string' ? ex : ex.fr;
          const en = typeof ex === 'string' ? null : ex.en;
          return `<div class="example" data-ex="${i}" style="cursor:pointer">${fr}${Chrome.gloss(en)}</div>`;
        }).join('')}
      </div>

      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" onclick="App.go('connectormastery', { drill: 'mixed' })">Drill all 14<span class="arr">→</span></button>
        <button class="btn ghost" onclick="App.go('connectormastery')">Back to library</button>
      </div>
    `;
    container.querySelectorAll('[data-ex]').forEach(el => {
      el.onclick = () => {
        const idx = parseInt(el.dataset.ex, 10);
        const ex = c.examples[idx];
        const fr = typeof ex === 'string' ? ex : ex.fr;
        // strip HTML tags for TTS
        TTS.speak(fr.replace(/<[^>]+>/g, ''));
      };
    });
  }

  // ───────────── DRILL SESSION ─────────────
  // Builds a queue of mixed-type items, runs one at a time, scores.
  function renderDrill(container, mode) {
    // Build a queue depending on mode
    const all = CONNECTORS;
    const items = [];
    for (const c of all) {
      if (mode === 'mixed' || mode === 'complete') items.push({ kind: 'complete', c });
      if (mode === 'mixed' || mode === 'recognize') items.push({ kind: 'recognize', c });
      if (mode === 'mixed' || mode === 'shadow')    items.push({ kind: 'shadow', c });
    }
    // Shuffle, take 12 for mixed / 8 for type-specific
    const target = mode === 'mixed' ? 12 : Math.min(items.length, 8);
    const queue = items.sort(() => Math.random() - 0.5).slice(0, target);

    let i = 0, correct = 0;

    function commonChrome() {
      return Chrome.render({
        back: 'connectormastery',
        crumbs: ['Connector Mastery', mode === 'mixed' ? 'Mixed drill' : `${mode} drill`],
        progress: { current: i, total: queue.length },
      });
    }

    function show() {
      if (i >= queue.length) return finish();
      const item = queue[i];
      if (item.kind === 'complete')  return showComplete(item.c);
      if (item.kind === 'recognize') return showRecognize(item.c);
      if (item.kind === 'shadow')    return showShadow(item.c);
    }

    function advance(rightAnswer) {
      if (rightAnswer) correct++;
      i++; show();
    }

    // ── COMPLETE: fill-the-blank, pick from 4 connector options
    function showComplete(c) {
      // Build distractors from other connectors (prefer different categories for clearer wrong answers)
      const others = CONNECTORS.filter(x => x.id !== c.id);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [c, ...distractors].sort(() => Math.random() - 0.5);
      const correctIdx = options.findIndex(o => o.id === c.id);
      const contextWithBlank = c.complete.context.replace('___', '<span style="color:var(--accent);font-weight:var(--fw-bold)">______</span>');

      container.innerHTML = `
        ${commonChrome()}
        <div class="lesson">
          <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">📝 Fill the blank · ${escapeHTML(c.category)}</p>
          <p class="q-prompt" style="font-style:italic">${contextWithBlank}</p>
          <p style="text-align:center;color:var(--mute);font-size:var(--fs-13);margin-bottom:var(--sp-3)">Pick the connector that fits.</p>
          <div class="options">
            ${options.map((o, idx) => `<div class="option" data-i="${idx}">${escapeHTML(o.word)}</div>`).join('')}
          </div>
          <div id="fb"></div>
        </div>`;

      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const picked = parseInt(el.dataset.i, 10);
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const right = picked === correctIdx;
          // Reveal full sentence with the answer filled in + English gloss
          const filled = c.complete.context.replace('___', `<b style="color:var(--accent)">${escapeHTML(c.word)}</b>`);
          const filledEn = c.complete.contextEn ? c.complete.contextEn.replace('___', `<b>${escapeHTML(c.gloss.split('/')[0].trim())}</b>`) : null;
          const reveal = `<div style="background:var(--surface-2);padding:var(--sp-3);border-radius:var(--r-md);margin-top:var(--sp-3)"><p style="color:var(--ink);font-weight:var(--fw-semi)">${filled}</p>${filledEn ? Chrome.gloss(filledEn) : ''}</div>`;
          if (right) {
            el.classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ <b>${escapeHTML(c.word)}</b> — ${escapeHTML(c.gloss)}. <small>${c.when}</small></div>${reveal}<div class="adv-host"></div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[correctIdx].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Right answer: <b>${escapeHTML(c.word)}</b>. <small>${c.when}</small></div>${reveal}<div class="adv-host"></div>`;
            MistakesModule.record({
              type: 'connector',
              sig: `connector-complete:${c.id}`,
              prompt: `[Connector · fill blank] ${c.complete.context}`,
              correct: c.word,
              your: options[picked].word,
            });
          }
          App.markLessonDone(`connectormastery:${c.id}`);
          Chrome.advance({
            host: container.querySelector('.adv-host'),
            onNext: () => advance(right),
            seconds: right ? 3 : 4,
          });
        };
      });
    }

    // ── RECOGNIZE: hear sentence, pick the connector that was used
    function showRecognize(c) {
      const others = CONNECTORS.filter(x => x.id !== c.id);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [c, ...distractors].sort(() => Math.random() - 0.5);
      const correctIdx = options.findIndex(o => o.id === c.id);

      container.innerHTML = `
        ${commonChrome()}
        <div class="lesson">
          <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">🎧 Listening recognition · ${escapeHTML(c.category)}</p>
          <p class="q-prompt">Which connector did you hear?</p>
          <div class="center" style="margin:var(--sp-4) 0">
            <button class="btn primary big" id="play">🔊 Play clip</button>
            <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-3)">
              <button class="btn secondary" data-rate="0.7">🐢 Slow</button>
              <button class="btn secondary" data-rate="1.0">🔊 Normal</button>
            </div>
          </div>
          <div class="options">
            ${options.map((o, idx) => `<div class="option" data-i="${idx}">${escapeHTML(o.word)}</div>`).join('')}
          </div>
          <div id="fb"></div>
        </div>`;

      setTimeout(() => TTS.speak(c.recognize, 1.0), 300);
      container.querySelector('#play').onclick = () => TTS.speak(c.recognize, 1.0);
      container.querySelectorAll('[data-rate]').forEach(b => {
        b.onclick = () => TTS.speak(c.recognize, parseFloat(b.dataset.rate));
      });

      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const picked = parseInt(el.dataset.i, 10);
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const right = picked === correctIdx;
          // Reveal the full clip + translation after answer — same accessibility
          // pattern as listening mastery, so beginners can verify what they heard.
          const transcript = `<div style="background:var(--surface-2);padding:var(--sp-3);border-radius:var(--r-md);margin-top:var(--sp-3)"><p style="color:var(--ink);font-weight:var(--fw-semi)">${escapeHTML(c.recognize)}</p>${Chrome.gloss(c.recognizeEn)}</div>`;
          if (right) {
            el.classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Heard it.</div>${transcript}<div class="adv-host"></div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[correctIdx].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ It was <b>${escapeHTML(c.word)}</b>.</div>${transcript}<div class="adv-host"></div>`;
            MistakesModule.record({
              type: 'connector',
              sig: `connector-recognize:${c.id}`,
              prompt: `[Connector · listen] heard: "${c.recognize}"`,
              correct: c.word,
              your: options[picked].word,
            });
          }
          App.markLessonDone(`connectormastery:${c.id}`);
          Chrome.advance({
            host: container.querySelector('.adv-host'),
            onNext: () => advance(right),
            seconds: right ? 3 : 4,
          });
        };
      });
    }

    // ── SHADOW: hear a model continuation with the connector, repeat aloud, self-rate
    function showShadow(c) {
      const s = c.shadow;
      container.innerHTML = `
        ${commonChrome()}
        <div class="lesson">
          <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">🎙 Shadow · ${escapeHTML(c.category)}</p>
          <p class="q-prompt">${escapeHTML(s.prompt)} <b style="color:var(--accent)">${escapeHTML(c.word)}</b></p>

          <div class="grammar-box">
            <h3>Lead sentence</h3>
            <p style="font-size:var(--fs-19);color:var(--ink)">${escapeHTML(s.lead)}</p>
          </div>

          <div class="center" style="margin:var(--sp-5) 0">
            <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">Hear the full model</p>
            <p style="font-size:var(--fs-22);font-weight:var(--fw-bold);color:var(--ink);line-height:var(--lh-snug);max-width:680px;margin:0 auto var(--sp-3)">${escapeHTML(s.model)}</p>
            ${s.modelEn ? `<p class="gloss-lg" style="text-align:center;max-width:680px;margin:0 auto var(--sp-4)">${escapeHTML(s.modelEn)}</p>` : ''}
            <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
              <button class="btn secondary" data-rate="0.7">🐢 Slow</button>
              <button class="btn primary big" data-rate="1.0">🔊 Hear it</button>
              <button class="btn secondary" data-rate="1.2">🐇 Fast</button>
            </div>
            <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-3)">Now repeat aloud. Use <b style="color:var(--accent)">${escapeHTML(c.word)}</b>.</p>
          </div>

          <p style="color:var(--mute);text-align:center;font-size:var(--fs-13);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-3)">How did it feel?</p>
          <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
            <button class="btn danger" data-rate-self="0">Hard, again</button>
            <button class="btn" data-rate-self="3">Got it</button>
            <button class="btn success" data-rate-self="5">Easy</button>
          </div>
          <div class="row" style="justify-content:center;margin-top:var(--sp-4)">
            <button class="btn ghost sm" id="skip">Skip — don't grade</button>
          </div>
        </div>`;

      setTimeout(() => TTS.speak(s.model, 1.0), 350);
      container.querySelectorAll('[data-rate]').forEach(b => {
        b.onclick = () => TTS.speak(s.model, parseFloat(b.dataset.rate));
      });
      container.querySelectorAll('[data-rate-self]').forEach(b => {
        b.onclick = () => {
          const q = parseInt(b.dataset.rateSelf, 10);
          SRS.review(`connector:${c.id}`, s.model, q);
          if (q === 0) {
            MistakesModule.record({
              type: 'connector',
              sig: `connector-shadow:${c.id}`,
              prompt: `Continue with <b>${c.word}</b>: "${s.lead}"`,
              correct: s.model,
              your: '(rated hard)',
            });
          }
          App.markLessonDone(`connectormastery:${c.id}`);
          // Shadow is self-graded; treat "Got it"/"Easy" as right
          advance(q >= 3);
        };
      });
      container.querySelector('#skip').onclick = () => { i++; show(); };
    }

    function finish() {
      const pct = Math.round((correct / queue.length) * 100);
      container.innerHTML = `
        ${Chrome.render({ back: 'connectormastery', crumbs: ['Connector Mastery', 'Result'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 80 ? '🔗' : pct >= 60 ? '👍' : '🔁'}</div>
            <h2>Drill done</h2>
            <p>Score: <b>${correct}/${queue.length}</b> (${pct}%)</p>
            <p style="color:var(--mute);margin-top:var(--sp-2)">${pct >= 80 ? 'Connectors are locking in. Use them in your next speaking task.' : pct >= 60 ? 'Solid progress. Re-run the drill — the random sample varies.' : 'Browse the library, read the "when to use" notes, then drill again.'}</p>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('connectormastery', { drill: '${mode}' })">Run it again</button>
              <button class="btn ghost big" onclick="App.go('connectormastery')">Back to library</button>
            </div>
          </div>
        </div>`;
    }

    show();
  }

  return {
    render(container, params) {
      if (!params) return renderLibrary(container);
      if (params.focus) {
        const c = byId(params.focus);
        if (c) return renderFocus(container, c);
      }
      if (params.drill) {
        return renderDrill(container, params.drill);
      }
      return renderLibrary(container);
    }
  };
})();
