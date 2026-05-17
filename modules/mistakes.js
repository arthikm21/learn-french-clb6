// Mistakes / Weak Spots — items the learner got wrong, re-surfaced for spaced review.
// Spaced schedule: due now → reviewed → due in 1d → 3d → 7d → 14d → removed at level 4.
window.MistakesModule = (function () {
  function load() { try { return JSON.parse(window.Storage.getItem('mistakes')) || []; } catch { return []; } }
  function save(m) { window.Storage.setItem('mistakes', JSON.stringify(m)); }

  // Spacing intervals (ms). Level 0 = due now, level 1 = 1d, etc.
  const INTERVALS = [0, 1, 3, 7, 14].map(d => d * 24 * 60 * 60 * 1000);

  function record(item) {
    const m = load();
    item.when = Date.now();
    item.level = 0;       // spaced-rep level (graduates at 4)
    item.due = Date.now();
    item.correctStreak = 0;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const idx = m.findIndex(x => x.sig === item.sig && (Date.now() - x.when) < sevenDays);
    if (idx >= 0) {
      // Reset level when same mistake recurs
      item.level = 0;
      item.due = Date.now();
      m[idx] = item;
    } else {
      m.push(item);
    }
    if (m.length > 200) m.splice(0, m.length - 200);
    save(m);
  }

  function dismiss(sig) {
    const m = load().filter(x => x.sig !== sig);
    save(m);
  }

  // Bump up a level when answered correctly. Graduates and is removed at level 4.
  function promote(sig) {
    const m = load();
    const item = m.find(x => x.sig === sig);
    if (!item) return;
    item.correctStreak = (item.correctStreak || 0) + 1;
    item.level = Math.min(4, (item.level || 0) + 1);
    if (item.level >= 4) {
      // Graduated — remove
      save(m.filter(x => x.sig !== sig));
    } else {
      item.due = Date.now() + INTERVALS[item.level];
      save(m);
    }
  }
  function demote(sig) {
    const m = load();
    const item = m.find(x => x.sig === sig);
    if (!item) return;
    item.correctStreak = 0;
    item.level = 0;
    item.due = Date.now();
    save(m);
  }

  function getDue() {
    return load().filter(x => (x.due || 0) <= Date.now());
  }
  function getAll() { return load(); }
  function getByType(type) { return load().filter(x => x.type === type); }

  function render(container) {
    const all = load();
    const due = all.filter(x => (x.due || 0) <= Date.now());
    if (all.length === 0) {
      container.innerHTML = `
        <div class="hero"><div class="flag-stripes"></div>
          <h1>🎯 Weak Spots</h1>
          <p>Items you got wrong show up here. Review and dismiss when mastered.</p>
        </div>
        <div class="empty">
          <div class="big-icon">✨</div>
          <h2>No mistakes recorded yet!</h2>
          <p>Get some questions wrong and they'll appear here for spaced review.</p>
          <div class="spacer"></div>
          <button class="btn big" onclick="App.go('path')">Back to Path</button>
        </div>`;
      return;
    }
    // Group by type for filter buttons
    const typeCounts = {};
    for (const m of all) typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎯 Weak Spots — ${all.length} item${all.length === 1 ? '' : 's'}</h1>
        <p><b>${due.length} due now.</b> Spaced schedule: review correctly → 1d → 3d → 7d → 14d → graduated.</p>
      </div>
      <div class="row" style="margin-bottom:14px;flex-wrap:wrap">
        <button class="btn big" id="review-due">🔁 Review ${due.length} due</button>
        <button class="btn secondary" id="review-all">All ${all.length}</button>
        <button class="btn ghost" id="clear-all">🗑️ Clear all</button>
      </div>
      <div class="row" style="margin-bottom:14px;flex-wrap:wrap;gap:6px">
        ${Object.entries(typeCounts).map(([t, n]) => `<button class="btn ghost" data-filter="${t}" style="font-size:13px;padding:6px 12px;min-height:auto">${t} (${n})</button>`).join('')}
        <button class="btn ghost" data-filter="" style="font-size:13px;padding:6px 12px;min-height:auto">all</button>
      </div>
      <div id="list"></div>`;
    let currentFilter = '';
    function renderList() {
      const list = container.querySelector('#list');
      const filtered = currentFilter ? all.filter(x => x.type === currentFilter) : all;
      const sorted = [...filtered].sort((a, b) => (a.due || 0) - (b.due || 0));
      list.innerHTML = '';
      sorted.forEach((mk, i) => {
        const ago = timeAgo(mk.when);
        const dueSoon = (mk.due || 0) <= Date.now();
        const dueLabel = dueSoon ? 'DUE' : 'in ' + dueIn(mk.due);
        const div = document.createElement('div');
        div.className = 'card';
        div.style.cursor = 'default';
        div.innerHTML = `
          <div class="row" style="justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap">
            <div style="flex:1;min-width:0">
              <span class="tag">${mk.type}</span>
              <span class="tag" style="background:${dueSoon ? '#fee2e2' : '#dcfce7'};color:${dueSoon ? 'var(--bad)' : 'var(--good)'}">${dueLabel}</span>
              <span class="tag">L${mk.level || 0}/4</span>
              <span style="color:var(--mute);font-size:13px"> · ${ago}</span>
              <p style="margin-top:8px">${mk.prompt}</p>
              <p style="color:var(--bad);font-size:14px;margin-top:4px">You: ${escapeHTML(mk.your)}</p>
              <p style="color:var(--good);font-size:14px">Correct: ${escapeHTML(mk.correct)}</p>
            </div>
            <button class="btn secondary" data-sig="${escapeAttr(mk.sig)}">Dismiss</button>
          </div>`;
        list.appendChild(div);
      });
      list.querySelectorAll('[data-sig]').forEach(b => {
        b.onclick = () => {
          dismiss(b.dataset.sig);
          render(container);
        };
      });
    }
    renderList();
    container.querySelectorAll('[data-filter]').forEach(b => {
      b.onclick = () => {
        currentFilter = b.dataset.filter;
        container.querySelectorAll('[data-filter]').forEach(x => x.style.background = '');
        b.style.background = 'var(--cream)';
        renderList();
      };
    });
    container.querySelector('#review-due').onclick = () => reviewBatch(container, due);
    container.querySelector('#review-all').onclick = () => reviewBatch(container, all);
    container.querySelector('#clear-all').onclick = () => {
      if (confirm('Clear all weak-spot records?')) { save([]); render(container); }
    };
  }

  function reviewBatch(container, items) {
    if (items.length === 0) { Toast.info('Nothing to review now.'); return; }
    let i = 0, correctCount = 0;
    const queue = [...items].sort(() => Math.random() - 0.5);
    function show() {
      if (i >= queue.length) {
        container.innerHTML = `
          <div class="lesson center">
            <div class="empty">
              <div class="big-icon">🏁</div>
              <h2>Review done</h2>
              <p>Got <b>${correctCount}/${queue.length}</b> right.</p>
              <p style="color:var(--mute);margin-top:8px">Correct items moved to the next review level (longer interval). Wrong items reset to level 0 (due immediately).</p>
              <div class="spacer"></div>
              <button class="btn big" onclick="App.go('mistakes')">Back to Weak Spots</button>
            </div>
          </div>`;
        return;
      }
      const mk = queue[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🎯 Weak Spot Review</h2>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <p style="color:var(--mute)"><span class="tag">${mk.type}</span> <span class="tag">L${mk.level || 0}/4</span> ${i+1} / ${queue.length}</p>
          <div class="q-prompt">${mk.prompt}</div>
          <input class="input" id="ans" placeholder="Type the correct answer..." autocomplete="off" autocapitalize="off"/>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('mistakes')">← Quit</button>
            <button class="btn" id="submit">Check (Enter)</button>
          </div>
        </div>`;
      const inp = container.querySelector('#ans');
      inp.focus();
      const norm = s => String(s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[.,!?;:"]/g,'').replace(/\s+/g,' ').trim();
      const check = () => {
        const v = norm(inp.value);
        const c = norm(mk.correct).replace(/\([^)]*\)/g, '').trim();
        const c2 = norm(mk.correct); // alternate exact
        if (!v) return;
        if (v === c || v === c2 || (c && v.includes(c))) {
          correctCount++;
          promote(mk.sig);
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! ${mk.level >= 3 ? 'Graduated! Removed from weak spots.' : 'Moved to L' + Math.min(4, (mk.level || 0) + 1) + ' (next review in ' + ['1 day','3 days','7 days','14 days'][mk.level || 0] + ').'}</div>`;
        } else {
          demote(mk.sig);
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Correct: <b>${escapeHTML(mk.correct)}</b><br><small>Reset to L0 — due immediately next time.</small></div>`;
        }
        setTimeout(() => { i++; show(); }, 2200);
      };
      container.querySelector('#submit').onclick = check;
      inp.onkeydown = e => { if (e.key === 'Enter') check(); };
    }
    show();
  }

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  }
  function dueIn(ts) {
    const s = Math.floor((ts - Date.now()) / 1000);
    if (s < 3600) return `${Math.floor(s/60)}m`;
    if (s < 86400) return `${Math.floor(s/3600)}h`;
    return `${Math.floor(s/86400)}d`;
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) {
    return String(s).replace(/["'<>&]/g, c => ({'&':'&amp;','"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'}[c]));
  }

  return { render, record, dismiss, promote, demote, getDue, getAll, getByType };
})();
