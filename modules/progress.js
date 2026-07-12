// Learner evidence page: capability record, mastery attempts, skill coverage,
// and phase progression. Course coverage is never presented as proficiency.

window.ProgressModule = (function () {
  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------- Skill rings ----------
  // Only L/S/R/W get rings — Foundation items (phonics, grammar, vocab, games)
  // unlock the four CLB skills but are not graded directly.
  function skillTotals() {
    const buckets = { L: { done: 0, total: 0 }, S: { done: 0, total: 0 }, R: { done: 0, total: 0 }, W: { done: 0, total: 0 } };
    for (const n of LESSON_PATH) {
      const sk = Path.skillOf(n);
      if (!sk || !buckets[sk]) continue; // skip 'F' (foundation) — not a CLB-graded skill
      buckets[sk].total++;
      if (Path.isItemDone(n)) buckets[sk].done++;
    }
    return buckets;
  }

  function ringSVG(pct, color, size, label, sub) {
    const stroke = Math.max(8, Math.round(size / 11));
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - pct / 100);
    return `
      <div class="ring" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}">
          <circle class="bg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}"/>
          <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}"
            fill="none" stroke-linecap="round"
            stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
            style="stroke:${color};transition:stroke-dashoffset var(--t-slower) var(--ease-out)"/>
        </svg>
        <div class="ring-label">
          <span class="pct">${pct}<small style="font-size:.5em;font-weight:var(--fw-semi);color:var(--mute)">%</small></span>
          <span class="meta">${label}${sub ? ' · ' + sub : ''}</span>
        </div>
      </div>`;
  }

  // ---------- Phase ladder ----------
  function phaseLadderHTML() {
    return PHASES.map(ph => {
      const passed = Path.gatePassed(ph.id);
      const unlocked = Path.phaseUnlocked(ph.id);
      const prog = Path.phaseProgress(ph.id);
      const statusGlyph = passed ? '✓' : unlocked ? '▶' : '🔒';
      const statusColor = passed ? 'var(--good)' : unlocked ? 'var(--accent)' : 'var(--mute)';
      const statusBg    = passed ? 'color-mix(in srgb, var(--good) 14%, transparent)' : unlocked ? 'color-mix(in srgb, var(--accent-fill) 14%, transparent)' : 'var(--surface-2)';
      const onclick = !unlocked
        ? `Toast.info('Locked — pass Phase ${ph.id - 1} first')`
        : `App.go('gate', { phase: '${ph.id}' })`;
      return `
        <div class="card" style="cursor:pointer;opacity:${unlocked ? '1' : '.55'}" onclick="${onclick}">
          <div class="row" style="justify-content:space-between;align-items:flex-start;gap:var(--sp-3)">
            <div style="display:flex;gap:var(--sp-3);min-width:0;flex:1">
              <span style="width:36px;height:36px;border-radius:var(--r-pill);background:${statusBg};color:${statusColor};display:grid;place-items:center;font-weight:var(--fw-bold);flex-shrink:0">${statusGlyph}</span>
              <div style="min-width:0">
                <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-11);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:2px">Phase ${ph.id} · ${escapeHTML(ph.clb)}</p>
                <h3>${ph.icon} ${escapeHTML(ph.name)}</h3>
                <p style="color:var(--ink-2);font-size:var(--fs-13);margin-top:2px">${escapeHTML(ph.subtitle)}</p>
              </div>
            </div>
            <span style="font-variant-numeric:tabular-nums;color:var(--mute);font-size:var(--fs-13);flex-shrink:0">${prog.done}/${prog.total}</span>
          </div>
          <div class="meter" style="margin-top:var(--sp-3)"><div style="width:${prog.pct}%"></div></div>
        </div>`;
    }).join('');
  }

  // ---------- Render ----------
  function render(container) {
    const buckets = skillTotals();
    const totalDone = LESSON_PATH.filter(Path.isItemDone).length;
    const totalPct = Math.round((totalDone / LESSON_PATH.length) * 100);
    const checkPhases = PHASES.filter(p => !p.final);
    const gatesPassedCount = checkPhases.filter(p => Path.gatePassed(p.id)).length;
    const passedPhases = PHASES.filter(p => Path.gatePassed(p.id));
    const currentPhase = PHASES.find(p => Path.phaseUnlocked(p.id) && !Path.gatePassed(p.id)) || PHASES[PHASES.length - 1];
    const nextItem = LESSON_PATH.find(item => !Path.isItemDone(item) && Path.phaseUnlocked(item.phase));
    let practiceRuns = 0;
    let weakSpots = 0;
    try { practiceRuns = (JSON.parse(window.Storage.getItem('mockHistory')) || []).length; } catch {}
    try { weakSpots = (JSON.parse(window.Storage.getItem('mistakes')) || []).length; } catch {}
    const masteryRecords = window.Mastery ? Object.values(Mastery.all()) : [];
    const assessedAttempts = masteryRecords.reduce((sum, record) => sum + (record.history || []).filter(attempt => typeof attempt.score === 'number').length, 0);
    const masteredCount = masteryRecords.filter(record => record.status === 'mastered').length;
    const demonstrated = passedPhases.flatMap(phase => phase.canDo || []);

    function pct(b) { return b.total === 0 ? 0 : Math.round((b.done / b.total) * 100); }

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Progress'] })}

      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Learning Evidence</p>
        <h1>See what changed.<br/>Know what comes next.</h1>
        <p style="margin-top:var(--sp-4)">Course completion shows coverage, not an official NCLC/CLB score. Phase checks and timed practice provide stronger evidence of what you can do.</p>
      </section>

      <h2 class="section-h">Your next milestone</h2>
      <section class="spotlight" style="border-color:var(--accent)">
        <div>
          <p class="eyebrow">Phase ${currentPhase.id} · ${escapeHTML(currentPhase.clb)}</p>
          <h2>${nextItem ? escapeHTML(nextItem.title) : escapeHTML(currentPhase.gateTitle)}</h2>
          <p>${nextItem ? escapeHTML(nextItem.desc) : 'The phase knowledge check is ready. Pass it to confirm taught material and unlock the next phase.'}</p>
          <div class="spacer"></div>
          <button class="btn primary big" id="progress-next">${nextItem ? 'Continue learning' : 'Take knowledge check'}<span class="arr">→</span></button>
        </div>
      </section>

      <h2 class="section-h">Capability record</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
        <div class="card" style="cursor:default">
          <p class="eyebrow" style="color:var(--good)">Demonstrated in course checks</p>
          ${demonstrated.length ? `<ul style="margin:var(--sp-3) 0 0 20px;color:var(--ink-2);line-height:1.7">${demonstrated.slice(-4).map(outcome => `<li>${escapeHTML(outcome)}</li>`).join('')}</ul>` : '<p style="margin-top:var(--sp-3);color:var(--ink-2)">Pass your first phase check to begin this record.</p>'}
        </div>
        <div class="card" style="cursor:default">
          <p class="eyebrow" style="color:var(--accent)">Building now</p>
          <ul style="margin:var(--sp-3) 0 0 20px;color:var(--ink-2);line-height:1.7">${(currentPhase.canDo || []).map(outcome => `<li>${escapeHTML(outcome)}</li>`).join('')}</ul>
        </div>
      </div>

      <h2 class="section-h">Evidence snapshot</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        <div class="card" style="cursor:default"><div style="font-size:var(--fs-34);font-weight:var(--fw-black)">${totalDone}/${LESSON_PATH.length}</div><p style="color:var(--ink-2);margin-top:6px">Course milestones covered</p></div>
        <div class="card" style="cursor:default"><div style="font-size:var(--fs-34);font-weight:var(--fw-black)">${gatesPassedCount}/${checkPhases.length}</div><p style="color:var(--ink-2);margin-top:6px">Phase checks passed</p></div>
        <div class="card" style="cursor:default"><div style="font-size:var(--fs-34);font-weight:var(--fw-black)">${practiceRuns}</div><p style="color:var(--ink-2);margin-top:6px">Four-skill simulations completed</p></div>
        <div class="card" style="cursor:default"><div style="font-size:var(--fs-34);font-weight:var(--fw-black)">${masteredCount}</div><p style="color:var(--ink-2);margin-top:6px">Mastery thresholds met · ${assessedAttempts} assessed attempts</p></div>
        <div class="card" style="cursor:default"><div style="font-size:var(--fs-34);font-weight:var(--fw-black)">${weakSpots}</div><p style="color:var(--ink-2);margin-top:6px">Active weak spots to resolve</p></div>
      </div>

      <h2 class="section-h">Course coverage by ability</h2>
      <p class="section-sub">These rings measure completed lessons in the path. They do not estimate an official language level.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(totalPct, 'var(--accent)', 132, totalDone + '/' + LESSON_PATH.length, 'lessons')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Overall coverage</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.L), 'var(--sk-listen)', 132, buckets.L.done + '/' + buckets.L.total, 'listen')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Listening</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.S), 'var(--sk-speak)', 132, buckets.S.done + '/' + buckets.S.total, 'speak')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Speaking</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.R), 'var(--sk-read)', 132, buckets.R.done + '/' + buckets.R.total, 'read')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Reading</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.W), 'var(--sk-write)', 132, buckets.W.done + '/' + buckets.W.total, 'write')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Writing</p>
        </div>
      </div>

      <h2 class="section-h">Phases</h2>
      <div class="grid">${phaseLadderHTML()}</div>

      <div class="spacer lg"></div>
      <div class="row" style="justify-content:center">
        <button class="btn primary big" onclick="App.go('path')">Open path<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('gate')">Open gates</button>
      </div>
    `;

    const nextButton = container.querySelector('#progress-next');
    if (nextButton) nextButton.onclick = () => {
      if (!nextItem) {
        App.go('gate', { phase: String(currentPhase.id) });
        return;
      }
      const params = {};
      if (nextItem.deck) params.deck = nextItem.deck;
      if (nextItem.unit) params.unit = nextItem.unit;
      if (nextItem.game) params.game = nextItem.game;
      if (nextItem.set) params.set = nextItem.set;
      if (nextItem.text) params.text = nextItem.text;
      if (nextItem.prompt) params.prompt = nextItem.prompt;
      App.go(nextItem.route, params);
    };
  }

  return { render };
})();
