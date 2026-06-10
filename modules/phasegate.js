// Phase gate — a mini-mock that decides whether the next phase unlocks.
// Routes:
//   #gate              → list of all gates with status (locked / available / passed)
//   #gate?phase=N      → intro card for the gate
//   #gate?phase=N&run=1 → run the quiz
//
// Phase 8 is the final readiness battery — redirects to mock test.

window.PhaseGateModule = (function () {
  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function status(phase) {
    const passed = Path.gatePassed(phase.id);
    const eligible = Path.gateEligible(phase.id);
    const unlocked = Path.phaseUnlocked(phase.id);
    if (passed) return 'passed';
    if (!unlocked) return 'locked';
    if (eligible) return 'available';
    return 'prep';
  }

  function statusBadge(s) {
    const map = {
      passed:    { label: '✓ Passed',   bg: 'rgba(52,199,89,.12)',  fg: 'var(--good)' },
      available: { label: 'Ready',      bg: 'rgba(94,92,230,.12)',  fg: 'var(--accent)' },
      prep:      { label: 'In progress',bg: 'var(--surface-2)',     fg: 'var(--ink-2)' },
      locked:    { label: 'Locked',     bg: 'var(--surface-2)',     fg: 'var(--mute)' },
    };
    const v = map[s];
    return `<span class="tag" style="background:${v.bg};color:${v.fg}">${v.label}</span>`;
  }

  function renderList(container) {
    const cards = PHASES.map(ph => {
      const s = status(ph);
      const prog = Path.phaseProgress(ph.id);
      const final = ph.final;
      return `
        <div class="card" data-phase="${ph.id}" style="cursor:${s === 'locked' ? 'not-allowed' : 'pointer'};opacity:${s === 'locked' ? '.55' : '1'}">
          <div class="row" style="justify-content:space-between;align-items:flex-start;gap:var(--sp-3)">
            <div style="flex:1;min-width:0">
              <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-11);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:6px">Phase ${ph.id} · ${escapeHTML(ph.clb)}</p>
              <h3>${ph.icon} ${escapeHTML(ph.name)} ${final ? '<span class="tag verb">Final</span>' : ''}</h3>
              <p style="margin-top:4px">${escapeHTML(ph.gateTitle)}</p>
            </div>
            ${statusBadge(s)}
          </div>
          <div class="meter" style="margin-top:var(--sp-4)"><div style="width:${prog.pct}%"></div></div>
          <p style="margin-top:6px;color:var(--mute);font-size:var(--fs-13);font-variant-numeric:tabular-nums">${prog.done}/${prog.total} lessons · ${prog.pct}%</p>
        </div>`;
    }).join('');

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Gates'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Phase Gates</p>
        <h1>Eight gates.<br/>One CLB 6.</h1>
        <p style="margin-top:var(--sp-4)">Each phase ends in a mini-mock. Pass at 80% to unlock the next phase. Wrong answers feed your Weak Spots automatically.</p>
      </section>
      <div class="grid">${cards}</div>
    `;

    container.querySelectorAll('[data-phase]').forEach(el => {
      el.onclick = () => {
        const phId = parseInt(el.dataset.phase);
        const ph = PHASES.find(p => p.id === phId);
        if (status(ph) === 'locked') {
          Toast.info(`Pass Phase ${phId - 1}'s gate first.`);
          return;
        }
        App.go('gate', { phase: String(phId) });
      };
    });
  }

  function renderIntro(container, phase) {
    const s = status(phase);
    const prog = Path.phaseProgress(phase.id);
    const gate = GATES[phase.gateId];

    // Phase 8 = final readiness → redirect to mock
    if (phase.final) {
      container.innerHTML = `
        ${Chrome.render({ back: 'gate', crumbs: ['Gates', `Phase ${phase.id}`] })}
        <section class="hero accent">
          <div class="flag-stripes"></div>
          <p class="eyebrow-h" style="color:rgba(255,255,255,.7)">Final Readiness Battery</p>
          <h1>${phase.icon} ${escapeHTML(phase.name)}</h1>
          <p style="margin-top:var(--sp-4)">${escapeHTML(phase.desc)}</p>
        </section>
        <div class="grammar-box">
          <h3>What this is</h3>
          <p>This is the full TCF Canada Mock Test. 4 skills, ~90 minutes, real exam structure. You get a CLB band per skill.</p>
          <p style="margin-top:var(--sp-2)"><b>Pass criterion:</b> CLB 6 or higher across all 4 skills.</p>
        </div>
        <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
          <button class="btn primary big" onclick="App.go('mock')">Start mock test<span class="arr">→</span></button>
          <button class="btn ghost big" onclick="App.go('gate')">Back to Gates</button>
        </div>`;
      return;
    }

    if (!gate) {
      container.innerHTML = `
        ${Chrome.render({ back: 'gate', crumbs: ['Gates', `Phase ${phase.id}`] })}
        <div class="lesson"><h2>Gate not configured yet.</h2></div>`;
      return;
    }

    const passed = s === 'passed';
    const eligible = s === 'available' || s === 'passed';
    const locked = s === 'locked';

    container.innerHTML = `
      ${Chrome.render({ back: 'gate', crumbs: ['Gates', `Phase ${phase.id} · ${phase.name}`] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">${phase.icon} Phase ${phase.id} · ${escapeHTML(phase.clb)}</p>
        <h1>${escapeHTML(phase.gateTitle)}</h1>
        <p style="margin-top:var(--sp-4)">${Math.min(gate.draw || 20, gate.questions.length)} questions drawn at random from a pool of ${gate.questions.length} · ${Math.round(gate.pass * 100)}% to pass · wrong answers → Weak Spots.</p>
      </section>

      <div class="grammar-box">
        <h3>Phase progress</h3>
        <p>${prog.done} of ${prog.total} lessons complete (${prog.pct}%).</p>
        <div class="meter" style="margin-top:var(--sp-3);height:6px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden">
          <div style="height:100%;width:${prog.pct}%;background:var(--ink);border-radius:var(--r-pill);transition:width var(--t-slow) var(--ease-out)"></div>
        </div>
        ${prog.pct < 80 ? `<p style="margin-top:var(--sp-3);color:var(--warn)">⚠️ You can attempt the gate now, but completing the lessons first gives you the best shot.</p>` : ''}
      </div>

      <div class="grammar-box">
        <h3>What to expect</h3>
        <p>${escapeHTML(gate.title)}.</p>
        <p style="margin-top:var(--sp-2)">${escapeHTML(phase.gateDesc)}</p>
      </div>

      ${passed ? `
        <div class="grammar-box" style="border-left-color:var(--good)">
          <h3>✓ You already passed this gate</h3>
          <p>You can retake it any time — it won't lock you out.</p>
        </div>` : ''}

      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        ${locked
          ? `<button class="btn ghost big" disabled>Locked — pass Phase ${phase.id - 1} first</button>`
          : `<button class="btn primary big" id="start-gate">${passed ? 'Retake gate' : 'Start gate'}<span class="arr">→</span></button>`}
        <button class="btn ghost big" onclick="App.go('gate')">Back to Gates</button>
      </div>
    `;

    const startBtn = container.querySelector('#start-gate');
    if (startBtn) startBtn.onclick = () => App.go('gate', { phase: String(phase.id), run: '1' });
  }

  function renderQuiz(container, phase) {
    const gate = GATES[phase.gateId];
    if (!gate) { App.go('gate'); return; }
    // Random draw per attempt — retakes get different questions.
    const drawN = Math.min(gate.draw || 20, gate.questions.length);
    const quiz = gate.questions
      .map((q, poolIdx) => ({ q, poolIdx }))
      .sort(() => Math.random() - 0.5)
      .slice(0, drawN);
    let qi = 0, correct = 0;

    function show() {
      if (qi >= quiz.length) return finish();
      const q = quiz[qi].q;
      container.innerHTML = `
        ${Chrome.render({
          back: () => `App.go('gate', { phase: '${phase.id}' })`,
          crumbs: ['Gates', `Phase ${phase.id}`, 'Quiz'],
          progress: { current: qi, total: quiz.length }
        })}
        <div class="lesson">
          <h2>${phase.icon} ${escapeHTML(gate.title)}</h2>
          <div class="q-prompt">${q.q}</div>
          <div class="options" id="opts">
            ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${escapeHTML(o)}</div>`).join('')}
          </div>
          <div id="fb"></div>
        </div>`;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const i = parseInt(el.dataset.i);
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const right = (i === q.a);
          if (right) {
            el.classList.add('correct');
            correct++;
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! ${q.why ? '<small>' + q.why + '</small>' : ''}</div><div class="adv-host"></div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[q.a].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Right answer: <b>${escapeHTML(q.opts[q.a])}</b>. ${q.why ? '<small>' + q.why + '</small>' : ''}</div><div class="adv-host"></div>`;
            MistakesModule.record({
              type: 'gate',
              sig: `gate:${phase.id}:${quiz[qi].poolIdx}`,
              prompt: `[Phase ${phase.id} gate] ${q.q}`,
              correct: q.opts[q.a],
              your: q.opts[i],
            });
          }
          Chrome.advance({
            host: container.querySelector('.adv-host'),
            onNext: () => { qi++; show(); },
            seconds: right ? 3 : 4,
            result: right ? 'correct' : 'wrong',
          });
        };
      });
    }

    function finish() {
      const pct = Math.round((correct / quiz.length) * 100);
      const pass = (correct / quiz.length) >= gate.pass;
      if (pass) App.markLessonDone(`gate:phase-${phase.id}`);
      const nextPh = PHASES.find(p => p.id === phase.id + 1);

      container.innerHTML = `
        ${Chrome.render({ back: 'gate', crumbs: ['Gates', `Phase ${phase.id}`, 'Result'] })}
        <section class="hero ${pass ? 'accent' : ''}">
          <div class="flag-stripes"></div>
          <p class="eyebrow-h" style="${pass ? 'color:rgba(255,255,255,.7)' : ''}">Gate Result</p>
          <h1>${pass ? '🏆 Gate passed.' : '💪 Almost there.'}</h1>
          <p style="margin-top:var(--sp-4)">Score: <b>${correct}/${quiz.length}</b> (${pct}%) · Threshold: ${Math.round(gate.pass * 100)}%</p>
        </section>

        ${pass ? `
          <div class="grammar-box" style="border-left-color:var(--good)">
            <h3>✓ You unlocked Phase ${nextPh ? nextPh.id : '—'}${nextPh ? `: ${escapeHTML(nextPh.name)}` : ''}</h3>
            <p>${nextPh ? `<b>${escapeHTML(nextPh.subtitle)}.</b> ${escapeHTML(nextPh.desc)}` : 'You completed every gate. Time for the final mock.'}</p>
          </div>` : `
          <div class="grammar-box" style="border-left-color:var(--warn)">
            <h3>Review and retry</h3>
            <p>You need ${Math.round(gate.pass * 100)}% to pass. Your misses were recorded to <a onclick="App.go('mistakes')" style="color:var(--accent);cursor:pointer">Weak Spots</a> — review them, then retry the gate.</p>
          </div>
        `}

        <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
          ${pass && nextPh
            ? `<button class="btn primary big" onclick="App.go('gate', { phase: '${nextPh.id}' })">Phase ${nextPh.id} preview<span class="arr">→</span></button>`
            : pass
              ? `<button class="btn primary big" onclick="App.go('mock')">Begin final mock<span class="arr">→</span></button>`
              : `<button class="btn primary big" onclick="App.go('gate', { phase: '${phase.id}', run: '1' })">Retake gate</button>`}
          <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
        </div>
      `;
    }

    show();
  }

  return {
    render(container, params) {
      const phaseId = params && params.phase ? parseInt(params.phase) : null;
      if (!phaseId) return renderList(container);
      const ph = PHASES.find(p => p.id === phaseId);
      if (!ph) return renderList(container);
      if (params.run === '1') return renderQuiz(container, ph);
      return renderIntro(container, ph);
    }
  };
})();
