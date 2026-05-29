// Path — 8 phases, each ending in a gate. Phase ladder + collapsible item lists.
// Uses PHASES + Path helpers from data/lessons.js.

window.PathModule = (function () {
  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function render(container) {
    const totalDone = LESSON_PATH.filter(Path.isItemDone).length;
    const totalPct = Math.round((totalDone / LESSON_PATH.length) * 100);
    const nextItem = LESSON_PATH.find(n => !Path.isItemDone(n));
    const currentPhaseId = nextItem ? nextItem.phase : PHASES[PHASES.length - 1].id;

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Path'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Your Path to CLB 6</p>
        <h1>Eight phases.<br/>Seven gates.<br/>One goal.</h1>
        <p style="margin-top:var(--sp-4)">${totalDone} of ${LESSON_PATH.length} milestones · ${totalPct}%. Each phase ends in a mini-mock gate. Pass it to unlock the next phase.</p>
        <div class="progress" style="height:6px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden;margin-top:var(--sp-5);max-width:520px">
          <div style="height:100%;width:${totalPct}%;background:var(--ink);border-radius:var(--r-pill);transition:width var(--t-slow) var(--ease-out)"></div>
        </div>
      </section>

      <div id="phases"></div>
    `;

    const host = container.querySelector('#phases');

    PHASES.forEach(ph => {
      const items = Path.itemsInPhase(ph.id);
      if (items.length === 0) return;

      const prog = Path.phaseProgress(ph.id);
      const unlocked = Path.phaseUnlocked(ph.id);
      const passed = Path.gatePassed(ph.id);
      const eligible = Path.gateEligible(ph.id);
      const isCurrent = ph.id === currentPhaseId;
      const allDone = prog.done === prog.total;

      // Auto-collapse fully-completed phases that are NOT current.
      const collapsed = passed && !isCurrent;

      const statusGlyph = passed ? '✓' : !unlocked ? '🔒' : isCurrent ? '▶' : ph.id;
      const statusColor = passed ? 'var(--good)' : !unlocked ? 'var(--mute)' : isCurrent ? 'var(--accent)' : 'var(--ink-2)';
      const statusBg    = passed ? 'rgba(52,199,89,.12)' : !unlocked ? 'var(--surface-2)' : isCurrent ? 'rgba(94,92,230,.12)' : 'var(--surface-2)';

      const sec = document.createElement('details');
      sec.style.marginBottom = '12px';
      if (!collapsed) sec.open = true;
      sec.style.opacity = unlocked ? '1' : '.65';

      sec.innerHTML = `
        <summary style="cursor:pointer;list-style:none;padding:var(--sp-4) var(--sp-5);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);display:flex;justify-content:space-between;align-items:center;box-shadow:var(--e1);user-select:none;gap:var(--sp-3)">
          <span style="display:flex;align-items:center;gap:var(--sp-3);min-width:0">
            <span style="flex-shrink:0;width:36px;height:36px;border-radius:var(--r-pill);background:${statusBg};color:${statusColor};display:grid;place-items:center;font-weight:var(--fw-bold);font-size:var(--fs-14);font-variant-numeric:tabular-nums">${statusGlyph}</span>
            <span style="min-width:0">
              <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-11);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:2px">Phase ${ph.id} · ${escapeHTML(ph.clb)}</p>
              <span style="font-weight:var(--fw-semi);font-size:var(--fs-17);color:var(--ink);letter-spacing:var(--ls-snug)">${ph.icon} ${escapeHTML(ph.name)}</span>
            </span>
          </span>
          <span style="font-weight:var(--fw-semi);font-size:var(--fs-13);color:var(--mute);flex-shrink:0;font-variant-numeric:tabular-nums">${prog.done}/${prog.total}</span>
        </summary>
        <div style="padding:var(--sp-3) 0 0 0">
          <p style="color:var(--ink-2);font-size:var(--fs-14);padding:0 var(--sp-3);margin-bottom:var(--sp-3)">${escapeHTML(ph.desc)}</p>
          <div class="path-list" data-list></div>
          <div data-gate-host></div>
        </div>
      `;

      // Lessons
      const list = sec.querySelector('[data-list]');
      items.forEach(n => {
        const done = Path.isItemDone(n);
        const isNext = !!(nextItem && nextItem.id === n.id);
        const node = document.createElement('div');
        node.className = `path-node ${done ? 'done' : (isNext ? 'unlocked' : '')}`;
        if (isNext) node.style.boxShadow = '0 0 0 2px var(--accent), var(--e2)';

        const nextTag = isNext ? '<span class="tag" style="background:var(--accent);color:white">Next</span>' : '';

        node.innerHTML = `
          <div class="num">${done ? '✓' : n.id}</div>
          <div class="info">
            <h4>${escapeHTML(n.title)} ${nextTag}</h4>
            <p>${escapeHTML(n.desc)}</p>
          </div>`;
        node.onclick = () => {
          const params = {};
          if (n.deck) params.deck = n.deck;
          if (n.unit) params.unit = n.unit;
          if (n.game) params.game = n.game;
          if (n.set) params.set = n.set;
          if (n.text) params.text = n.text;
          if (n.prompt) params.prompt = n.prompt;
          App.go(n.route, params);
        };
        list.appendChild(node);
      });

      // Gate card at the end of the phase
      const gateHost = sec.querySelector('[data-gate-host]');
      const gateLabel = passed
        ? `<span class="tag" style="background:rgba(52,199,89,.12);color:var(--good)">✓ Gate passed</span>`
        : eligible
          ? `<span class="tag" style="background:rgba(94,92,230,.12);color:var(--accent)">Ready to take</span>`
          : `<span class="tag">Complete 80% of the phase</span>`;

      const gateCard = document.createElement('div');
      gateCard.className = 'card';
      gateCard.style.marginTop = 'var(--sp-3)';
      gateCard.style.cursor = unlocked ? 'pointer' : 'not-allowed';
      gateCard.style.opacity = unlocked ? '1' : '.5';
      gateCard.style.borderColor = passed ? 'var(--good)' : eligible ? 'var(--accent)' : 'var(--line)';
      gateCard.innerHTML = `
        <div class="row" style="justify-content:space-between;align-items:flex-start;gap:var(--sp-3)">
          <div style="flex:1;min-width:0">
            <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-11);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:6px">Phase ${ph.id} · Gate</p>
            <h3>${ph.final ? '🎯' : '🛡️'} ${escapeHTML(ph.gateTitle)}</h3>
            <p style="margin-top:4px;color:var(--ink-2);font-size:var(--fs-14)">${escapeHTML(ph.gateDesc)}</p>
          </div>
          ${gateLabel}
        </div>`;
      gateCard.onclick = () => {
        if (!unlocked) { Toast.info(`Pass Phase ${ph.id - 1}'s gate first.`); return; }
        App.go('gate', { phase: String(ph.id) });
      };
      gateHost.appendChild(gateCard);

      host.appendChild(sec);
    });
  }

  return { render };
})();
