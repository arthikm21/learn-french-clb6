// Writing: guided prompt, pattern-based feedback. Saves drafts in localStorage.
window.WriteModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>✍️ Writing Workshop</h1>
        <p>Structured prompts with rubric checks. Builds CLB Writing skill from short paragraphs to formal emails.</p>
      </div>
      <div class="grid" id="w-grid"></div>`;
    const grid = container.querySelector('#w-grid');
    for (const k of Object.keys(WRITING)) {
      const t = WRITING[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">✍️</div><h3>${t.title}</h3><p><span class="tag">${t.level}</span></p>`;
      card.onclick = () => renderPrompt(container, k);
      grid.appendChild(card);
    }
  }

  function renderPrompt(container, key) {
    const t = WRITING[key];
    const draftKey = 'fr_draft_' + key;
    const saved = localStorage.getItem(draftKey) || '';

    container.innerHTML = `
      <div class="lesson">
        <h2>✍️ ${t.title} <span class="tag">${t.level}</span></h2>
        <div class="grammar-box">
          <h3>📝 Prompt</h3>
          <p>${t.prompt}</p>
        </div>
        <div class="grammar-box" style="background:#f0fdf4;border-left-color:var(--good)">
          <h3>💡 Hints</h3>
          <ul style="margin-left:20px;line-height:1.7">${t.hints.map(h => `<li>${h}</li>`).join('')}</ul>
        </div>
        <textarea class="input" id="essay" placeholder="Écris ici en français...">${saved}</textarea>
        <div class="spacer"></div>
        <div id="report"></div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('write')">← Prompts</button>
          <div class="row">
            <button class="btn secondary" id="save">💾 Save Draft</button>
            <button class="btn big" id="check">Check My Work</button>
          </div>
        </div>
      </div>`;

    const ta = container.querySelector('#essay');
    container.querySelector('#save').onclick = () => {
      localStorage.setItem(draftKey, ta.value);
      alert('Draft saved.');
    };
    container.querySelector('#check').onclick = () => {
      const txt = ta.value;
      const wordCount = (txt.match(/\b\w+\b/g) || []).length;
      let passed = 0;
      const rows = t.checks.map(c => {
        const matches = txt.match(c.pattern);
        const ok = c.min ? (matches && matches.length >= c.min) : !!matches;
        if (ok) passed++;
        return `<li>${ok ? '✅' : '⬜'} ${c.label}${c.min ? ' (' + ((matches && matches.length) || 0) + '/' + c.min + ')' : ''}</li>`;
      }).join('');
      const pct = Math.round((passed / t.checks.length) * 100);
      if (pct >= 70 && wordCount >= 25) App.markLessonDone(`write:${key}`);
      App.addXP(20 + passed * 5);
      container.querySelector('#report').innerHTML = `
        <div class="grammar-box" style="background:${pct >= 70 ? '#dcfce7' : '#fef3c7'};border-left-color:${pct >= 70 ? 'var(--good)' : 'var(--warn)'}">
          <h3>📊 Feedback</h3>
          <p><b>Words:</b> ${wordCount} · <b>Rubric:</b> ${passed}/${t.checks.length} (${pct}%)</p>
          <ul style="margin-left:20px;margin-top:8px">${rows}</ul>
          <p style="margin-top:10px;font-style:italic;color:var(--mute)">Self-edit: read aloud, check each verb's ending, check article gender, check accents.</p>
        </div>`;
    };
  }

  return {
    render(container, params) {
      if (params && params.prompt) renderPrompt(container, params.prompt);
      else renderList(container);
    }
  };
})();
