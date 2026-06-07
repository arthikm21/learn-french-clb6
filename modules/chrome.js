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
    if (!host || typeof onNext !== 'function') return () => {};

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

    host.innerHTML = `
      <div class="advance-row" role="group" aria-label="Continue or wait">
        <button type="button" class="btn ghost advance-wait" data-act="wait">Wait</button>
        <button type="button" class="btn primary advance-next" data-act="next" aria-live="polite">
          Next <span class="advance-arrow">→</span> <span class="advance-cd">(${remaining})</span>
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
    }

    function onKey(e) {
      // Don't hijack typing — only act when focus isn't in a form field
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'Enter') { e.preventDefault(); fire(); }
      else if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); paused ? resume() : pause(); }
    }

    waitBtn.onclick = () => { paused ? resume() : pause(); };
    nextBtn.onclick = () => fire();

    timer = setInterval(tick, 1000);
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', destroy);

    return destroy;
  }

  return { render, escapeHTML, gloss, advance };
})();
