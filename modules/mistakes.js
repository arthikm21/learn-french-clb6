// Mistakes / Weak Spots — items the learner got wrong, re-surfaced for spaced review.
window.MistakesModule = (function () {
  function load() { try { return JSON.parse(window.Storage.getItem('mistakes')) || []; } catch { return []; } }
  function save(m) { window.Storage.setItem('mistakes', JSON.stringify(m)); }

  // Public: record an error. Auto-deduplicates by signature.
  function record(item) {
    // item: { type: 'grammar'|'reading'|'listen', sig, prompt, correct, your, when }
    const m = load();
    item.when = Date.now();
    // de-dupe same signature within last 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const idx = m.findIndex(x => x.sig === item.sig && (Date.now() - x.when) < sevenDays);
    if (idx >= 0) m[idx] = item;
    else m.push(item);
    // Cap total at 200
    if (m.length > 200) m.splice(0, m.length - 200);
    save(m);
  }

  // Public: remove an item (when learner gets it right in review).
  function dismiss(sig) {
    const m = load().filter(x => x.sig !== sig);
    save(m);
  }

  function render(container) {
    const mistakes = load().sort((a, b) => b.when - a.when);
    if (mistakes.length === 0) {
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
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎯 Weak Spots — ${mistakes.length} item${mistakes.length === 1 ? '' : 's'}</h1>
        <p>Your top mistakes. Click <b>Review all</b> to retry — getting one right removes it.</p>
      </div>
      <div class="row" style="margin-bottom:14px">
        <button class="btn big" id="review-all">🔁 Review all (${mistakes.length})</button>
        <button class="btn ghost" id="clear-all">🗑️ Clear all</button>
      </div>
      <div id="list"></div>`;
    const list = container.querySelector('#list');
    mistakes.forEach((mk, i) => {
      const ago = timeAgo(mk.when);
      const div = document.createElement('div');
      div.className = 'card';
      div.style.cursor = 'default';
      div.innerHTML = `
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <span class="tag">${mk.type}</span>
            <span style="color:var(--mute);font-size:13px"> · ${ago}</span>
            <p style="margin-top:8px"><b>${escapeHTML(mk.prompt)}</b></p>
            <p style="color:var(--bad);font-size:14px;margin-top:4px">Your answer: ${escapeHTML(mk.your)}</p>
            <p style="color:var(--good);font-size:14px">Correct: ${escapeHTML(mk.correct)}</p>
          </div>
          <button class="btn secondary" data-i="${i}">Dismiss</button>
        </div>`;
      list.appendChild(div);
    });
    list.querySelectorAll('[data-i]').forEach(b => {
      b.onclick = () => {
        const i = parseInt(b.dataset.i);
        dismiss(mistakes[i].sig);
        render(container);
      };
    });
    container.querySelector('#review-all').onclick = () => reviewAll(container, mistakes);
    container.querySelector('#clear-all').onclick = () => {
      if (confirm('Clear all weak-spot records?')) { save([]); render(container); }
    };
  }

  function reviewAll(container, mistakes) {
    let i = 0, score = 0;
    function show() {
      if (i >= mistakes.length) {
        container.innerHTML = `
          <div class="lesson center">
            <div class="empty">
              <div class="big-icon">🏁</div>
              <h2>Review done</h2>
              <p>Score: <b>${score}/${mistakes.length}</b></p>
              <p style="color:var(--mute)">Mistakes you got right are removed from your weak spots.</p>
              <div class="spacer"></div>
              <button class="btn big" onclick="App.go('mistakes')">Back to Weak Spots</button>
            </div>
          </div>`;
        return;
      }
      const mk = mistakes[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🎯 Weak Spot Review</h2>
          <div class="progress"><div style="width:${(i / mistakes.length) * 100}%"></div></div>
          <p style="color:var(--mute)"><span class="tag">${mk.type}</span> ${i+1} / ${mistakes.length}</p>
          <div class="q-prompt">${mk.prompt}</div>
          <input class="input" id="ans" placeholder="Type the correct answer..." autocomplete="off" autocapitalize="off"/>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('mistakes')">← Quit</button>
            <button class="btn" id="submit">Check</button>
          </div>
        </div>`;
      const inp = container.querySelector('#ans');
      inp.focus();
      const check = () => {
        const v = inp.value.trim().toLowerCase().replace(/[.,!?;]/g,'');
        const c = String(mk.correct).trim().toLowerCase().replace(/[.,!?;]/g,'');
        if (v === c || v === c.replace(/\([^)]*\)/g,'').trim()) {
          score++;
          dismiss(mk.sig);
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! Removed from weak spots.</div>`;
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Correct: <b>${escapeHTML(mk.correct)}</b></div>`;
        }
        setTimeout(() => { i++; show(); }, 1500);
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

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  return { render, record, dismiss };
})();
