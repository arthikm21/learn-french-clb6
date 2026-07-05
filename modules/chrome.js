// Module chrome — breadcrumb + back button + progress bar.
// Sticky-friendly. Drop into any module page above its content.
//
// Usage:
//   container.innerHTML = Chrome.render({
//     back: 'path',                       // route to go back to, or () => fn
//     crumbs: ['Grammar', 'Passé Composé'],
//     progress: { current: 3, total: 12 },
//     actions: [{ icon: '🔁', label: 'Restart', onclick: 'MyModule.restart()' }],
//   }) + `<your content>`;
//
// All fields optional.

window.Chrome = (function () {
  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function render(opts) {
    opts = opts || {};
    const back = opts.back;
    const crumbs = Array.isArray(opts.crumbs) ? opts.crumbs : [];
    const progress = opts.progress;
    const actions = Array.isArray(opts.actions) ? opts.actions : [];

    let backHTML = '';
    if (back) {
      const target = typeof back === 'string' ? `App.go('${back}')` : back;
      backHTML = `
        <button class="chrome-back" onclick="${target}" aria-label="Back">
          <svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13L5 8L10 3"/>
          </svg>
          <span>Back</span>
        </button>`;
    }

    let crumbsHTML = '';
    if (crumbs.length) {
      crumbsHTML = '<div class="chrome-crumbs">' + crumbs.map((c, i) => {
        const safe = escapeHTML(c);
        const last = i === crumbs.length - 1;
        const sep = i < crumbs.length - 1 ? '<span class="sep">›</span>' : '';
        return (last ? `<b>${safe}</b>` : `<span>${safe}</span>`) + sep;
      }).join('') + '</div>';
    }

    let actionsHTML = '';
    if (actions.length) {
      actionsHTML = '<div class="chrome-actions">' + actions.map(a => {
        const label = escapeHTML(a.label || '');
        return `<button class="icon-btn" onclick="${a.onclick || ''}" aria-label="${label}" title="${label}">${a.icon || ''}</button>`;
      }).join('') + '</div>';
    }

    let progressHTML = '';
    if (progress && typeof progress.current === 'number' && typeof progress.total === 'number' && progress.total > 0) {
      const pct = Math.min(100, Math.max(0, (progress.current / progress.total) * 100));
      progressHTML = `
        <div style="margin-bottom:var(--sp-5)">
          <div class="progress" style="height:4px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden">
            <div style="height:100%;width:${pct.toFixed(1)}%;background:var(--ink);border-radius:var(--r-pill);transition:width var(--t-slow) var(--ease-out)"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:var(--fs-12);color:var(--mute);font-variant-numeric:tabular-nums">
            <span>${escapeHTML(progress.label || '')}</span>
            <span>${progress.current} / ${progress.total}</span>
          </div>
        </div>`;
    }

    return `
      <div class="chrome">
        ${backHTML}
        ${crumbsHTML}
        ${actionsHTML}
      </div>
      ${progressHTML}
    `;
  }

  // Unified end-of-session screen — ONE consistent completion signal across
  // every module. Always shows the "✓ Session complete" kicker, then a flavor
  // title, score, coaching line, and clear next actions. Plays the completion
  // sound and (for strong runs) fires confetti.
  //
  // Usage:
  //   container.innerHTML = Chrome.finishScreen({
  //     back: 'listen', crumbs: ['Listen', title, 'Result'],
  //     icon: '🎯', title: 'Sharp ear',
  //     score: { correct, total },        // renders "Score: c/t (pct%)"
  //     sub: 'Coaching line…',            // muted paragraph
  //     extra: Support.winNudge(),        // raw HTML block (optional)
  //     actions: [
  //       { label: 'Run it again', onclick: "App.go('listen')", primary: true },
  //       { label: 'Back to Path', onclick: "App.go('path')" },
  //     ],
  //   });
  function finishScreen(opts) {
    opts = opts || {};
    const icon = opts.icon || '🎉';
    const title = opts.title || 'Well done';
    const score = opts.score;
    let scoreHTML = '';
    let pct = null;
    if (score && typeof score.correct === 'number' && typeof score.total === 'number' && score.total > 0) {
      pct = Math.round((score.correct / score.total) * 100);
      scoreHTML = `<p>Score: <b>${score.correct}/${score.total}</b> (${pct}%)</p>`;
    } else if (opts.scoreLine) {
      scoreHTML = `<p>${opts.scoreLine}</p>`;
    }
    const subHTML = opts.sub ? `<p style="color:var(--mute);margin-top:var(--sp-2)">${opts.sub}</p>` : '';
    const actions = Array.isArray(opts.actions) ? opts.actions : [];
    const actionsHTML = actions.map(a =>
      `<button class="btn ${a.primary ? 'primary' : 'ghost'} big" onclick="${a.onclick || ''}">${escapeHTML(a.label || '')}${a.arrow ? '<span class="arr">→</span>' : ''}</button>`
    ).join('');

    // Completion feedback — sound always, confetti on strong runs (or when the
    // caller says so). Rendering the finish screen IS the completion moment.
    const celebrate = (opts.celebrate !== undefined) ? opts.celebrate : (pct === null || pct >= 70);
    try { if (window.Sounds) Sounds.play('complete'); } catch {}
    if (celebrate && window.Celebrate) {
      try { setTimeout(() => Celebrate.confetti({ intensity: pct !== null && pct >= 90 ? 'large' : 'small' }), 200); } catch {}
    }

    return `
      ${render({ back: opts.back, crumbs: opts.crumbs })}
      <div class="lesson center">
        <div class="empty">
          <div class="big-icon">${icon}</div>
          <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--good);margin-bottom:var(--sp-2)">✓ Session complete</p>
          <h2>${title}</h2>
          ${scoreHTML}
          ${subHTML}
          ${opts.extra || ''}
          <div class="spacer"></div>
          <div class="row" style="justify-content:center;flex-wrap:wrap">${actionsHTML}</div>
        </div>
      </div>`;
  }

  // Render a small English gloss under French content. The CSS class is
  // controlled by the Settings toggle (body.no-gloss hides all .gloss).
  // Pass `en` (the English string) and an optional `cls` ('gloss' or 'gloss-lg').
  function gloss(en, cls) {
    if (!en) return '';
    return `<div class="${cls || 'gloss'}">${escapeHTML(en)}</div>`;
  }

  // Auto-advance row used after quiz answers. Shows a "Wait" button (pauses the
  // countdown so the user can study the feedback) and a "Next →" button with a
  // live countdown that fires onNext at zero.
  //
  // Usage:
  //   Chrome.advance({ host: element, onNext: () => i++, seconds: 3 });
  //
  // Returns a disposer fn. The helper also disposes on hashchange so the
  // pending timer doesn't fire after the user navigated away.
  function advance(opts) {
    const host = opts && opts.host;
    const onNext = opts && opts.onNext;
    const seconds = (opts && opts.seconds) || 3;
    const result = opts && opts.result; // 'correct' | 'wrong' | undefined
    // Auto-advance on correct answers (keeps the flow snappy), but on a WRONG
    // answer wait for an explicit click — so the learner actually reads the
    // explanation instead of being yanked to the next question. Callers can
    // override with opts.auto.
    const auto = (opts && opts.auto !== undefined) ? opts.auto : (result !== 'wrong');
    if (!host || typeof onNext !== 'function') return () => {};

    // SINGLETON — only one advance instance may be live at a time. Modules can
    // accidentally mount twice (e.g. re-submitting while a countdown is up):
    // the stale instance's interval would then fire onNext a second time and
    // silently SKIP a question. Destroy any previous instance first.
    if (advance._destroy) { try { advance._destroy(); } catch {} }
    // Time origin shared with KeyboardEvent.timeStamp — used below to tell the
    // committing keystroke (in-flight during mount) from a fresh, deliberate one.
    const mountedPerf = (window.performance && performance.now) ? performance.now() : 0;

    // Reward / acknowledgement sound — fires once on render.
    if (result && window.Sounds && typeof Sounds.play === 'function') {
      try { Sounds.play(result); } catch {}
    }
    // Visual celebrations on correct answers — sparkle from the picked option,
    // speed lines on a 3+ hot streak (across this session).
    if (result === 'correct' && window.Celebrate) {
      try {
        const picked = document.querySelector('.option.correct');
        if (picked) Celebrate.sparkle(picked);
        // Hot streak across the page lifetime
        advance._streak = (advance._streak || 0) + 1;
        if (advance._streak >= 3 && picked) Celebrate.speedLines(picked);
      } catch {}
    } else if (result === 'wrong') {
      advance._streak = 0;
    }

    let remaining = seconds;
    let timer = null;
    let paused = false;
    let fired = false;

    host.innerHTML = auto ? `
      <div class="advance-row" role="group" aria-label="Continue or wait">
        <button type="button" class="btn ghost advance-wait" data-act="wait">Wait</button>
        <button type="button" class="btn primary advance-next" data-act="next" aria-live="polite">
          Next <span class="advance-arrow">→</span> <span class="advance-cd">(${remaining})</span>
        </button>
      </div>
    ` : `
      <div class="advance-row" role="group" aria-label="Continue">
        <button type="button" class="btn primary advance-next" data-act="next">
          Got it — Next <span class="advance-arrow">→</span>
        </button>
      </div>
    `;

    const waitBtn = host.querySelector('[data-act="wait"]');
    const nextBtn = host.querySelector('[data-act="next"]');
    const cdSpan  = host.querySelector('.advance-cd');

    function paint() {
      if (paused) {
        waitBtn.textContent = 'Resume';
        if (cdSpan) cdSpan.textContent = '';
      } else {
        waitBtn.textContent = 'Wait';
        if (cdSpan) cdSpan.textContent = `(${remaining})`;
      }
    }
    function tick() {
      if (paused || fired) return;
      remaining -= 1;
      if (remaining <= 0) { fire(); return; }
      paint();
      if (window.Sounds) try { Sounds.play('tickCountdown'); } catch {}
    }
    function fire() {
      if (fired) return;
      fired = true;
      clearInterval(timer);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', destroy);
      if (advance._destroy === destroy) advance._destroy = null;
      onNext();
    }
    function pause() { paused = true; paint(); }
    function resume() { paused = false; paint(); }
    function destroy() {
      if (fired) return;
      fired = true;
      clearInterval(timer);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', destroy);
      if (advance._destroy === destroy) advance._destroy = null;
    }

    function onKey(e) {
      // Don't hijack typing — only act when focus isn't in a form field
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      // A held key auto-repeats keydown every ~35ms — one press must mean ONE
      // action, so ignore repeats entirely.
      if (e.repeat) return;
      if (e.key === 'Enter') {
        // Swallow ONLY the keystroke that committed the answer — it may still be
        // bubbling to us (a module that forgot stopPropagation) or was in-flight
        // when this row mounted. That event was created BEFORE mount, so its
        // timeStamp predates mountedPerf. A deliberately re-pressed Enter always
        // post-dates the mount and passes straight through, so fast keyboard
        // users are never forced to press twice.
        if (e.timeStamp && mountedPerf && e.timeStamp < mountedPerf) { e.preventDefault(); return; }
        e.preventDefault(); fire();
      }
      else if ((e.key === ' ' || e.code === 'Space') && auto) { e.preventDefault(); paused ? resume() : pause(); }
    }

    if (waitBtn) waitBtn.onclick = () => { paused ? resume() : pause(); };
    nextBtn.onclick = () => fire();

    if (auto) timer = setInterval(tick, 1000);
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', destroy);

    advance._destroy = destroy;
    return destroy;
  }

  return { render, escapeHTML, gloss, advance, finishScreen };
})();
