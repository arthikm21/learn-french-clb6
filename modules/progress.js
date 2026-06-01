// Progress page — Apple Activity-inspired rings + GitHub-style heatmap + phase ladder.
// Pulls all data from localStorage via App.state + lesson activity log.

window.ProgressModule = (function () {
  // Activity log: persisted list of timestamps when a lesson was marked done.
  // Stored under the user namespace so each profile has its own log.
  const LOG_KEY = 'activity_log';

  function loadLog() {
    try { return JSON.parse(window.Storage.getItem(LOG_KEY)) || []; }
    catch { return []; }
  }

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
            fill="none" stroke="${color}" stroke-linecap="round"
            stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
            style="transition:stroke-dashoffset var(--t-slower) var(--ease-out)"/>
        </svg>
        <div class="ring-label">
          <span class="pct">${pct}<small style="font-size:.5em;font-weight:var(--fw-semi);color:var(--mute)">%</small></span>
          <span class="meta">${label}${sub ? ' · ' + sub : ''}</span>
        </div>
      </div>`;
  }

  // ---------- Heatmap ----------
  // 12-week GitHub-style heatmap. Counts lessons completed per day.
  function heatmapHTML() {
    const log = loadLog();
    const buckets = new Map();
    for (const ts of log) {
      const d = new Date(ts);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = 84; // 12 weeks × 7
    const cells = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const n = buckets.get(key) || 0;
      const level = n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 6 ? 3 : 4;
      const colors = [
        'var(--surface-2)',
        'rgba(94,92,230,.25)',
        'rgba(94,92,230,.5)',
        'rgba(94,92,230,.75)',
        'rgba(94,92,230,1)',
      ];
      cells.push(`<div class="hm-cell" title="${key} · ${n} lesson${n === 1 ? '' : 's'}" style="background:${colors[level]}"></div>`);
    }

    return `
      <div class="hm-wrap">
        <div class="hm-grid">${cells.join('')}</div>
        <div class="hm-legend">
          <span>Less</span>
          <div class="hm-cell" style="background:var(--surface-2)"></div>
          <div class="hm-cell" style="background:rgba(94,92,230,.25)"></div>
          <div class="hm-cell" style="background:rgba(94,92,230,.5)"></div>
          <div class="hm-cell" style="background:rgba(94,92,230,.75)"></div>
          <div class="hm-cell" style="background:rgba(94,92,230,1)"></div>
          <span>More</span>
        </div>
      </div>`;
  }

  // ---------- Streak ----------
  function streakInfo() {
    const log = loadLog();
    if (log.length === 0) return { current: 0, longest: 0, daysActive: 0 };
    const days = new Set(log.map(ts => new Date(ts).toISOString().slice(0, 10)));

    const today = new Date(); today.setHours(0,0,0,0);
    let cur = 0;
    let d = new Date(today);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (days.has(key)) { cur++; d.setDate(d.getDate() - 1); }
      else break;
    }
    // Allow yesterday-only streak if today not yet logged
    if (cur === 0) {
      const y = new Date(today); y.setDate(y.getDate() - 1);
      if (days.has(y.toISOString().slice(0, 10))) {
        let dd = new Date(y); let n = 0;
        while (days.has(dd.toISOString().slice(0, 10))) { n++; dd.setDate(dd.getDate() - 1); }
        cur = n;
      }
    }

    // Longest
    const sorted = [...days].sort();
    let longest = 0, run = 0, prev = null;
    for (const k of sorted) {
      if (prev) {
        const p = new Date(prev); p.setDate(p.getDate() + 1);
        if (p.toISOString().slice(0, 10) === k) run++; else run = 1;
      } else run = 1;
      if (run > longest) longest = run;
      prev = k;
    }
    return { current: cur, longest, daysActive: days.size };
  }

  // ---------- Phase ladder ----------
  function phaseLadderHTML() {
    return PHASES.map(ph => {
      const passed = Path.gatePassed(ph.id);
      const unlocked = Path.phaseUnlocked(ph.id);
      const prog = Path.phaseProgress(ph.id);
      const statusGlyph = passed ? '✓' : unlocked ? '▶' : '🔒';
      const statusColor = passed ? 'var(--good)' : unlocked ? 'var(--accent)' : 'var(--mute)';
      const statusBg    = passed ? 'rgba(52,199,89,.12)' : unlocked ? 'rgba(94,92,230,.12)' : 'var(--surface-2)';
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

  // ---------- ETA ----------
  function etaSentence() {
    const log = loadLog();
    const totalDone = Object.keys((App.state || {}).lessons || {}).filter(k => !k.startsWith('gate:')).length;
    if (totalDone === 0) return 'Start your first lesson to see your projected ETA.';
    const days = new Set(log.map(ts => new Date(ts).toISOString().slice(0, 10))).size || 1;
    const perDay = totalDone / days;
    const remaining = LESSON_PATH.length - totalDone;
    if (perDay <= 0 || remaining <= 0) {
      return remaining <= 0 ? 'You completed the whole path. Take the readiness battery!' : '';
    }
    const eta = Math.ceil(remaining / Math.max(perDay, 0.3)); // floor at 0.3 lessons/day
    return `At your current pace (${perDay.toFixed(1)} lessons/day) you reach CLB 6 readiness in <b>~${eta} days</b>.`;
  }

  // ---------- Render ----------
  function render(container) {
    const buckets = skillTotals();
    const totalDone = LESSON_PATH.filter(Path.isItemDone).length;
    const totalPct = Math.round((totalDone / LESSON_PATH.length) * 100);
    const streak = streakInfo();
    const gatesPassedCount = PHASES.filter(p => Path.gatePassed(p.id)).length;

    function pct(b) { return b.total === 0 ? 0 : Math.round((b.done / b.total) * 100); }

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Progress'] })}

      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Progress</p>
        <h1>You vs.<br/>CLB 6.</h1>
        <p style="margin-top:var(--sp-4)">${etaSentence()}</p>
      </section>

      <h2 class="section-h">Today</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(totalPct, 'var(--accent)', 132, totalDone + '/' + LESSON_PATH.length, 'lessons')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Overall</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.L), '#0A84FF', 132, buckets.L.done + '/' + buckets.L.total, 'listen')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Listening</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.S), '#FF453A', 132, buckets.S.done + '/' + buckets.S.total, 'speak')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Speaking</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.R), '#FF9F0A', 132, buckets.R.done + '/' + buckets.R.total, 'read')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Reading</p>
        </div>
        <div class="card" style="cursor:default;display:flex;flex-direction:column;align-items:center;gap:var(--sp-3)">
          ${ringSVG(pct(buckets.W), '#30D158', 132, buckets.W.done + '/' + buckets.W.total, 'write')}
          <p style="font-weight:var(--fw-semi);color:var(--ink)">Writing</p>
        </div>
      </div>

      <h2 class="section-h">Streak</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        <div class="card" style="cursor:default;text-align:center">
          <div style="font-size:var(--fs-44);font-weight:var(--fw-black);color:var(--ink);font-variant-numeric:tabular-nums;letter-spacing:var(--ls-tight)">${streak.current}</div>
          <p style="color:var(--ink-2);margin-top:var(--sp-2)">Current streak (days)</p>
        </div>
        <div class="card" style="cursor:default;text-align:center">
          <div style="font-size:var(--fs-44);font-weight:var(--fw-black);color:var(--ink);font-variant-numeric:tabular-nums;letter-spacing:var(--ls-tight)">${streak.longest}</div>
          <p style="color:var(--ink-2);margin-top:var(--sp-2)">Longest streak</p>
        </div>
        <div class="card" style="cursor:default;text-align:center">
          <div style="font-size:var(--fs-44);font-weight:var(--fw-black);color:var(--ink);font-variant-numeric:tabular-nums;letter-spacing:var(--ls-tight)">${streak.daysActive}</div>
          <p style="color:var(--ink-2);margin-top:var(--sp-2)">Total active days</p>
        </div>
        <div class="card" style="cursor:default;text-align:center">
          <div style="font-size:var(--fs-44);font-weight:var(--fw-black);color:var(--ink);font-variant-numeric:tabular-nums;letter-spacing:var(--ls-tight)">${gatesPassedCount}/${PHASES.length}</div>
          <p style="color:var(--ink-2);margin-top:var(--sp-2)">Gates passed</p>
        </div>
      </div>

      <h2 class="section-h">Last 12 weeks</h2>
      <div class="card" style="cursor:default">
        ${heatmapHTML()}
      </div>

      <h2 class="section-h">Phases</h2>
      <div class="grid">${phaseLadderHTML()}</div>

      <div class="spacer lg"></div>
      <div class="row" style="justify-content:center">
        <button class="btn primary big" onclick="App.go('path')">Open path<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('gate')">Open gates</button>
      </div>
    `;
  }

  // Public: log a lesson completion. Called from app.js markLessonDone.
  function logActivity() {
    const log = loadLog();
    log.push(Date.now());
    if (log.length > 5000) log.splice(0, log.length - 5000);
    window.Storage.setItem(LOG_KEY, JSON.stringify(log));
  }

  return { render, logActivity };
})();
