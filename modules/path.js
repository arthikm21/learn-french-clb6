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
    const nextItem = LESSON_PATH.find(n => !Path.isItemDone(n) && Path.phaseUnlocked(n.phase));
    const nextGate = PHASES.find(ph => Path.phaseUnlocked(ph.id) && !Path.gatePassed(ph.id) && Path.gateEligible(ph.id));
    const currentPhaseId = nextItem ? nextItem.phase : nextGate ? nextGate.id : PHASES[PHASES.length - 1].id;
    const courseCovered = totalDone === LESSON_PATH.length;

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Path'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Your Path toward NCLC 6</p>
        <h1>Eight phases.<br /> One clear next step.</h1>
        <p style="margin-top:var(--sp-4)">${totalDone} of ${LESSON_PATH.length} learning milestones · ${totalPct}% course coverage. Seven knowledge checks unlock the path; Phase 8 ends in timed four-skill practice.</p>
        <div class="progress" style="height:6px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden;margin-top:var(--sp-5);max-width:520px">
          <div style="height:100%;width:${totalPct}%;background:var(--ink);border-radius:var(--r-pill);transition:width var(--t-slow) var(--ease-out)"></div>
        </div>
      </section>

      ${nextItem ? `
        <section class="spotlight" style="border-color:var(--accent)">
          <div>
            <p class="eyebrow">Continue · Phase ${nextItem.phase}</p>
            <h2>${escapeHTML(nextItem.title)}</h2>
            <p>${escapeHTML(nextItem.desc)}</p>
            <div class="spacer"></div>
            <button class="btn primary big" id="path-continue">Continue learning<span class="arr">→</span></button>
          </div>
        </section>` : nextGate ? `
        <section class="spotlight" style="border-color:var(--accent)">
          <div>
            <p class="eyebrow">Phase ${nextGate.id} checkpoint ready</p>
            <h2>${escapeHTML(nextGate.gateTitle)}</h2>
            <p>Use the knowledge check to confirm this phase before continuing.</p>
            <div class="spacer"></div>
            <button class="btn primary big" id="path-gate">Take knowledge check<span class="arr">→</span></button>
          </div>
        </section>` : courseCovered ? `
        <section class="spotlight"><div><p class="eyebrow">Path covered</p><h2>Every course milestone is complete.</h2><p>Review weak spots and use timed practice to build stronger evidence.</p></div></section>` : ''}

      <div id="phases"></div>
    `;

    const continueBtn = container.querySelector('#path-continue');
    if (continueBtn && nextItem) continueBtn.onclick = () => openItem(nextItem);
    const gateBtn = container.querySelector('#path-gate');
    if (gateBtn && nextGate) gateBtn.onclick = () => App.go('gate', { phase: String(nextGate.id) });

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

      const statusGlyph = passed ? App.svgIcon('check') : !unlocked ? App.svgIcon('lock') : isCurrent ? App.svgIcon('play') : ph.id;
      const statusColor = passed ? 'var(--good)' : !unlocked ? 'var(--mute)' : isCurrent ? 'var(--accent)' : 'var(--ink-2)';
      const statusBg    = passed ? 'color-mix(in srgb, var(--good) 14%, transparent)' : !unlocked ? 'var(--surface-2)' : isCurrent ? 'color-mix(in srgb, var(--accent-fill) 14%, transparent)' : 'var(--surface-2)';

      const sec = document.createElement('details');
      sec.style.marginBottom = '12px';
      // Keep one phase expanded. Rendering every locked phase made the Path
      // more than 12,000px tall and eagerly created all 92 lesson rows even
      // though most learners only need the current phase.
      if (isCurrent) sec.open = true;
      sec.style.opacity = unlocked ? '1' : '.65';

      const mix = Path.skillMix(items);
      const mixTotal = items.length;
      // Segmented bar showing how much of this phase is each skill — visualizes
      // the 40/40/10/10 oral-first emphasis without needing a separate page.
      const SKILL_META = {
        L: { color: 'var(--sk-listen)', label: 'Listen' },
        S: { color: 'var(--sk-speak)', label: 'Speak' },
        R: { color: 'var(--sk-read)', label: 'Read' },
        W: { color: 'var(--sk-write)', label: 'Write' },
        F: { color: 'var(--mute)', label: 'Foundation' },
      };
      const mixSegs = ['L','S','R','W','F']
        .filter(k => mix[k] > 0)
        .map(k => `<span title="${SKILL_META[k].label}: ${mix[k]}" style="flex:${mix[k]};background:${SKILL_META[k].color};min-width:2px;height:100%"></span>`)
        .join('');
      const mixLegend = ['L','S','R','W']
        .filter(k => mix[k] > 0)
        .map(k => `<span style="display:inline-flex;align-items:center;gap:4px;font-size:var(--fs-11);color:var(--mute);font-weight:var(--fw-semi)"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${SKILL_META[k].color}"></span>${SKILL_META[k].label.slice(0,1)} ${Math.round(mix[k]/mixTotal*100)}%</span>`)
        .join('');

      sec.innerHTML = `
        <summary style="cursor:pointer;list-style:none;padding:var(--sp-4) var(--sp-5);background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);display:flex;justify-content:space-between;align-items:center;box-shadow:var(--e1);user-select:none;gap:var(--sp-3)">
          <span style="display:flex;align-items:center;gap:var(--sp-3);min-width:0">
            <span class="ph-status" style="flex-shrink:0;width:36px;height:36px;border-radius:var(--r-pill);background:${statusBg};color:${statusColor};display:grid;place-items:center;font-weight:var(--fw-bold);font-size:var(--fs-14);font-variant-numeric:tabular-nums">${statusGlyph}</span>
            <span style="min-width:0">
              <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-11);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:2px">Phase ${ph.id} · ${escapeHTML(ph.clb)}</p>
              <span style="font-weight:var(--fw-semi);font-size:var(--fs-17);color:var(--ink);letter-spacing:var(--ls-snug);display:inline-flex;align-items:center;gap:7px"><span class="phase-glyph">${App.phaseIcon(ph.id)}</span>${escapeHTML(ph.name)}</span>
              ${ph.subtitle ? `<p style="font-size:var(--fs-13);color:var(--ink-2);margin-top:2px">${escapeHTML(ph.subtitle)}</p>` : ''}
            </span>
          </span>
          <span style="font-weight:var(--fw-semi);font-size:var(--fs-13);color:var(--mute);flex-shrink:0;font-variant-numeric:tabular-nums">${prog.done}/${prog.total}</span>
        </summary>
        <div style="padding:var(--sp-3) 0 0 0">
          <p style="color:var(--ink-2);font-size:var(--fs-14);padding:0 var(--sp-3);margin-bottom:var(--sp-3)">${escapeHTML(ph.desc)}</p>
          ${Array.isArray(ph.canDo) ? `<div class="grammar-box" style="margin:0 var(--sp-3) var(--sp-4);padding:var(--sp-4)">
            <p class="eyebrow" style="margin-bottom:var(--sp-2)">${passed ? 'Demonstrated in course checks' : 'By the end of this phase'}</p>
            <ul style="margin-left:20px;color:var(--ink-2)">${ph.canDo.map(outcome => `<li>${escapeHTML(outcome)}</li>`).join('')}</ul>
          </div>` : ''}
          <div style="padding:0 var(--sp-3);margin-bottom:var(--sp-4)">
            <div style="display:flex;height:6px;border-radius:var(--r-pill);overflow:hidden;background:var(--surface-2)">${mixSegs}</div>
            <div style="display:flex;gap:var(--sp-3);margin-top:6px;flex-wrap:wrap">${mixLegend}</div>
          </div>
          <div class="path-list" data-list></div>
          <div data-gate-host></div>
        </div>
      `;

      // Lessons
      const list = sec.querySelector('[data-list]');
      let itemsPopulated = false;
      function populateItems() {
        if (itemsPopulated) return;
        itemsPopulated = true;
        items.forEach(n => {
        const done = Path.isItemDone(n);
        const locked = !unlocked;
        const isNext = !!(nextItem && nextItem.id === n.id);
        const evidence = window.Mastery ? Mastery.get(Path.doneKey(n)) : null;
        const node = document.createElement('div');
        node.className = `path-node ${locked ? 'locked' : done ? 'done' : (isNext ? 'unlocked' : '')}`;
        node.setAttribute('role', 'button');
        node.setAttribute('tabindex', locked ? '-1' : '0');
        node.setAttribute('aria-disabled', String(locked));
        if (isNext) node.style.boxShadow = '0 0 0 2px var(--accent), var(--e2)';

        const nextTag = isNext ? '<span class="tag" style="background:var(--accent-fill, var(--accent));color:#fff">Next</span>' : '';
        const evidenceTag = evidence && typeof evidence.best === 'number'
          ? `<span class="tag" style="background:${evidence.status === 'mastered' ? 'color-mix(in srgb, var(--good) 14%, transparent)' : 'color-mix(in srgb, var(--warn) 16%, transparent)'};color:${evidence.status === 'mastered' ? 'var(--good)' : 'var(--warn)'}">${evidence.status === 'mastered' ? 'Mastered' : 'Building'} · best ${evidence.best}%</span>`
          : evidence && evidence.status === 'practiced'
            ? '<span class="tag">Practiced</span>'
            : '';

        node.innerHTML = `
          <div class="num">${done ? '✓' : n.id}</div>
          <div class="info">
            <h4>${escapeHTML(n.title)} ${nextTag} ${evidenceTag}</h4>
            <p>${escapeHTML(n.desc)}</p>
          </div>`;
        node.onclick = () => locked ? Toast.info(`Pass Phase ${ph.id - 1}'s knowledge check first.`) : openItem(n);
        node.onkeydown = event => {
          if (!locked && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openItem(n);
          }
        };
          list.appendChild(node);
        });

        // Gate card at the end of the phase
        const gateHost = sec.querySelector('[data-gate-host]');
        const gateLabel = passed
          ? `<span class="tag" style="background:color-mix(in srgb, var(--good) 14%, transparent);color:var(--good)">✓ Gate passed</span>`
          : eligible
            ? `<span class="tag" style="background:color-mix(in srgb, var(--accent-fill) 14%, transparent);color:var(--accent-fill)">Ready to take</span>`
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
              <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-11);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:6px">Phase ${ph.id} · ${ph.final ? 'Practice simulation' : 'Knowledge check'}</p>
              <h3><span class="gate-glyph">${App.svgIcon(ph.final ? 'target' : 'shield')}</span>${escapeHTML(ph.gateTitle)}</h3>
              <p style="margin-top:4px;color:var(--ink-2);font-size:var(--fs-14)">${escapeHTML(ph.gateDesc)}</p>
            </div>
            ${gateLabel}
          </div>`;
        gateCard.onclick = () => {
          if (!unlocked) { Toast.info(`Pass Phase ${ph.id - 1}'s gate first.`); return; }
          App.go('gate', { phase: String(ph.id) });
        };
        gateHost.appendChild(gateCard);
      }

      if (sec.open) populateItems();
      sec.addEventListener('toggle', () => { if (sec.open) populateItems(); });

      host.appendChild(sec);
    });
  }

  function openItem(item) {
    const params = {};
    if (item.deck) params.deck = item.deck;
    if (item.unit) params.unit = item.unit;
    if (item.game) params.game = item.game;
    if (item.set) params.set = item.set;
    if (item.text) params.text = item.text;
    if (item.prompt) params.prompt = item.prompt;
    App.go(item.route, params);
  }

  return { render };
})();
