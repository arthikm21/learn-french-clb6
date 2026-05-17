// Global search: vocab words, grammar units, reading texts, dialogues, speak sets, listen sets.
window.SearchModule = (function () {
  let index = null;

  function buildIndex() {
    if (index) return index;
    index = [];
    // VOCAB cards
    if (window.VOCAB) {
      for (const dk of Object.keys(window.VOCAB)) {
        const deck = window.VOCAB[dk];
        for (const c of deck.cards) {
          index.push({
            type: 'vocab',
            label: c.fr,
            sublabel: c.en + ' · ' + deck.name,
            terms: [c.fr, c.en, deck.name],
            route: 'vocab',
            params: { deck: dk },
          });
        }
      }
    }
    // GRAMMAR units
    if (window.GRAMMAR) {
      for (const u of window.GRAMMAR) {
        index.push({
          type: 'grammar',
          label: u.title,
          sublabel: u.level + ' · grammar',
          terms: [u.title, u.intro || '', u.id],
          route: 'grammar',
          params: { unit: u.id },
        });
      }
    }
    if (window.PC_VS_IMP) {
      index.push({
        type: 'grammar',
        label: window.PC_VS_IMP.title,
        sublabel: window.PC_VS_IMP.level + ' · grammar',
        terms: [window.PC_VS_IMP.title, 'passé composé', 'imparfait'],
        route: 'pcvsimp',
        params: {},
      });
    }
    // PHONICS
    if (window.PHONICS) {
      for (const u of window.PHONICS) {
        index.push({
          type: 'phonics',
          label: u.title,
          sublabel: 'phonics · ' + u.id,
          terms: [u.title, u.intro || '', ...(u.sounds || []).map(s => s.word + ' ' + s.spell)],
          route: 'phonics',
          params: { unit: u.id },
        });
      }
    }
    // READINGS
    if (window.READINGS) {
      for (const k of Object.keys(window.READINGS)) {
        const t = window.READINGS[k];
        index.push({
          type: 'reading',
          label: t.title,
          sublabel: t.level + ' · reading',
          terms: [t.title, t.text.slice(0, 200)],
          route: 'read',
          params: { text: k },
        });
      }
    }
    // DIALOGUES
    if (window.DIALOGUES) {
      for (const k of Object.keys(window.DIALOGUES)) {
        const d = window.DIALOGUES[k];
        index.push({
          type: 'dialogue',
          label: d.title,
          sublabel: d.level + ' · dialogue',
          terms: [d.title, d.intro || ''],
          route: 'dialogue',
          params: { id: k },
        });
      }
    }
    // LISTENING
    if (window.LISTENING) {
      for (const k of Object.keys(window.LISTENING)) {
        const s = window.LISTENING[k];
        index.push({
          type: 'listen',
          label: s.title,
          sublabel: s.level + ' · listening',
          terms: [s.title, ...(s.items || []).slice(0, 2).map(i => i.audio)],
          route: 'listen',
          params: { set: k },
        });
      }
    }
    // SPEAK_SETS
    if (window.SPEAK_SETS) {
      for (const k of Object.keys(window.SPEAK_SETS)) {
        const s = window.SPEAK_SETS[k];
        index.push({
          type: 'speak',
          label: s.title,
          sublabel: (s.level || '') + ' · speaking',
          terms: [s.title, ...(s.items || []).slice(0, 2)],
          route: 'speak',
          params: { set: k },
        });
      }
    }
    // SPEAK_TASKS
    if (window.SPEAK_TASKS) {
      for (const k of Object.keys(window.SPEAK_TASKS)) {
        const t = window.SPEAK_TASKS[k];
        index.push({
          type: 'task',
          label: t.title,
          sublabel: t.level + ' · speak task (' + t.type + ')',
          terms: [t.title, t.scenario || t.prompt || ''],
          route: 'speaktasks',
          params: { id: k },
        });
      }
    }
    // WRITING prompts
    if (window.WRITING) {
      for (const k of Object.keys(window.WRITING)) {
        const w = window.WRITING[k];
        index.push({
          type: 'write',
          label: w.title,
          sublabel: w.level + ' · writing prompt',
          terms: [w.title, w.prompt || ''],
          route: 'write',
          params: { prompt: k },
        });
      }
    }
    return index;
  }

  function score(item, q) {
    const lq = q.toLowerCase();
    let s = 0;
    if (item.label.toLowerCase().includes(lq)) s += 10;
    if (item.label.toLowerCase().startsWith(lq)) s += 5;
    for (const t of item.terms) {
      if (t && t.toLowerCase().includes(lq)) s += 2;
    }
    return s;
  }

  function search(q) {
    if (!q || q.length < 2) return [];
    const idx = buildIndex();
    const scored = idx.map(it => ({ ...it, s: score(it, q) })).filter(it => it.s > 0);
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 25);
  }

  let box = null;
  function openOverlay() {
    if (box && document.body.contains(box)) {
      box.style.display = 'flex';
      box.querySelector('input').focus();
      return;
    }
    box = document.createElement('div');
    box.id = 'search-overlay';
    box.innerHTML = `
      <div class="search-modal">
        <div class="search-head">
          <input type="search" placeholder="Search vocab, grammar, reading, dialogues..." autocomplete="off" />
          <button class="search-close" aria-label="Close">×</button>
        </div>
        <div class="search-results">
          <p style="color:var(--mute);text-align:center;padding:24px">Type 2+ characters to search.</p>
        </div>
      </div>`;
    document.body.appendChild(box);
    const input = box.querySelector('input');
    const results = box.querySelector('.search-results');
    const close = () => { box.style.display = 'none'; };
    box.querySelector('.search-close').onclick = close;
    box.onclick = (e) => { if (e.target === box) close(); };
    document.addEventListener('keydown', (e) => {
      if (box.style.display === 'none') return;
      if (e.key === 'Escape') { close(); e.preventDefault(); }
    });
    input.addEventListener('input', () => {
      const q = input.value.trim();
      const hits = search(q);
      if (hits.length === 0) {
        results.innerHTML = q.length < 2
          ? `<p style="color:var(--mute);text-align:center;padding:24px">Type 2+ characters to search.</p>`
          : `<p style="color:var(--mute);text-align:center;padding:24px">No matches for "${escapeHTML(q)}".</p>`;
        return;
      }
      results.innerHTML = hits.map((h, i) => `
        <div class="search-hit" data-i="${i}">
          <span class="tag" style="font-size:11px">${h.type}</span>
          <div class="search-hit-body">
            <div class="search-hit-label">${escapeHTML(h.label)}</div>
            <div class="search-hit-sub">${escapeHTML(h.sublabel)}</div>
          </div>
          <span class="search-hit-arrow">→</span>
        </div>`).join('');
      results.querySelectorAll('.search-hit').forEach(el => {
        el.onclick = () => {
          const i = parseInt(el.dataset.i, 10);
          const h = hits[i];
          close();
          App.go(h.route, h.params);
        };
      });
    });
    input.focus();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  return { open: openOverlay, search };
})();

// Keyboard shortcut: / or Ctrl/Cmd+K opens search
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      window.SearchModule.open();
    }
  });
}
