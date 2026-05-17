// Writing: prompt + heuristic grader. Combines rubric checks with French error-pattern detection.
window.WriteModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>✍️ Writing Workshop</h1>
        <p>Structured prompts with rubric checks AND French error detection. Builds CLB Writing from paragraphs to formal emails.</p>
      </div>
      <div class="grid" id="w-grid"></div>`;
    const grid = container.querySelector('#w-grid');
    for (const k of Object.keys(WRITING)) {
      const t = WRITING[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">✍️</div><h3>${t.title}</h3><p><span class="tag">${t.level}</span></p>`;
      card.onclick = () => App.go('write', { prompt: k });
      grid.appendChild(card);
    }
  }

  function renderPrompt(container, key) {
    const t = WRITING[key];
    const draftKey = 'draft_' + key;
    const saved = window.Storage.getItem(draftKey) || '';

    container.innerHTML = `
      <div class="lesson">
        <h2>✍️ ${t.title} <span class="tag">${t.level}</span></h2>
        <div class="grammar-box">
          <h3>📝 Prompt</h3>
          <p>${t.prompt}</p>
          <p style="margin-top:8px;color:var(--mute)"><b>Target:</b> ${t.minWords || 30}+ words.</p>
        </div>
        <div class="grammar-box" style="background:#f0fdf4;border-left-color:var(--good)">
          <h3>💡 Hints</h3>
          <ul style="margin-left:20px;line-height:1.7">${t.hints.map(h => `<li>${h}</li>`).join('')}</ul>
        </div>
        <textarea class="input" id="essay" placeholder="Écris ici en français..." style="font-size:16px;line-height:1.6">${saved}</textarea>
        <div class="row" style="margin-top:8px;justify-content:space-between;color:var(--mute);font-size:13px">
          <span id="wc">0 words</span>
          <span>💾 Auto-saved as you type</span>
        </div>
        <div class="spacer"></div>
        <div id="report"></div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('write')">← Prompts</button>
          <div class="row">
            <button class="btn secondary" id="clear">🗑️ Clear</button>
            <button class="btn big" id="check">📊 Grade My Work</button>
          </div>
        </div>
      </div>`;

    const ta = container.querySelector('#essay');
    const wc = container.querySelector('#wc');
    const updateWC = () => {
      const n = (ta.value.match(/\b\w+\b/g) || []).length;
      wc.textContent = `${n} word${n === 1 ? '' : 's'}`;
      window.Storage.setItem(draftKey, ta.value);
    };
    ta.addEventListener('input', updateWC);
    updateWC();

    container.querySelector('#clear').onclick = () => {
      if (confirm('Clear your draft?')) { ta.value = ''; updateWC(); container.querySelector('#report').innerHTML = ''; }
    };
    container.querySelector('#check').onclick = () => grade(container, t, key, ta.value);
  }

  function grade(container, task, key, txt) {
    const wordCount = (txt.match(/\b\w+\b/g) || []).length;
    const sentences = txt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const minWords = task.minWords || 30;

    // 1. Rubric checks (positive)
    let rubricPassed = 0;
    const rubricRows = task.checks.map(c => {
      const matches = txt.match(c.pattern);
      const ok = c.min ? (matches && matches.length >= c.min) : !!matches;
      if (ok) rubricPassed++;
      return `<li>${ok ? '✅' : '⬜'} ${c.label}${c.min ? ' (' + ((matches && matches.length) || 0) + '/' + c.min + ')' : ''}</li>`;
    }).join('');
    const rubricPct = Math.round((rubricPassed / task.checks.length) * 100);

    // 2. Error pattern detection
    const errors = [];
    for (const e of (window.WRITING_ERRORS || [])) {
      if (e.positive) continue;
      const m = txt.match(e.pattern);
      if (m) errors.push({ message: e.message, sample: m[0] });
    }

    // 3. Word count score
    const wcPct = Math.min(100, Math.round((wordCount / minWords) * 100));
    const wcStatus = wordCount >= minWords ? 'good' : 'warn';

    // 4. Sentence variety
    const avgSentLen = sentences.length > 0 ? wordCount / sentences.length : 0;
    const variety = avgSentLen >= 5 && avgSentLen <= 18;

    // 5. Tense variety (detect tenses used)
    const tenses = {
      'Présent': /\b(suis|es|est|sommes|êtes|sont|ai|as|a|avons|avez|ont|vais|vas|va|allons|allez|vont|fais|fait|faisons|font|peux|peut|pouvons|peuvent|veux|veut|voulons|veulent)\b/i.test(txt) || /\b\w+(e|es|ons|ez|ent)\b/i.test(txt),
      'Passé composé': /\b(j['e]\s*ai|tu\s+as|il\s+a|elle\s+a|on\s+a|nous\s+avons|vous\s+avez|ils\s+ont|elles\s+ont|je\s+suis|tu\s+es|elle\s+est|nous\s+sommes|vous\s+êtes|ils\s+sont|elles\s+sont)\s+\w+(é|i|u|is|it|ert)\b/i.test(txt),
      'Imparfait': /\b\w+(ais|ait|ions|iez|aient)\b/i.test(txt),
      'Futur proche': /\b(vais|vas|va|allons|allez|vont)\s+\w+er\b/i.test(txt),
      'Futur simple': /\b\w+(erai|eras|era|erons|erez|eront|irai|irai|aurai|seron|fera|verra)\b/i.test(txt),
      'Conditionnel': /\b\w+(erais|erait|erions|eriez|eraient|aurais|serais|ferais|irais)\b/i.test(txt),
    };
    const tensesUsed = Object.keys(tenses).filter(t => tenses[t]);

    // 6. Overall score — blend
    let overall = 0;
    overall += (wcPct >= 100 ? 25 : Math.round(wcPct * 0.25));
    overall += Math.round(rubricPct * 0.40);
    overall += variety ? 10 : 0;
    overall += Math.min(15, tensesUsed.length * 5);
    overall -= Math.min(20, errors.length * 4);
    overall = Math.max(0, Math.min(100, overall));

    // CLB band estimate
    let clbBand = 'CLB 3';
    if (overall >= 80) clbBand = task.level.includes('6') ? 'CLB 6' : 'CLB 5';
    else if (overall >= 65) clbBand = 'CLB 5';
    else if (overall >= 50) clbBand = 'CLB 4';
    else if (overall >= 35) clbBand = 'CLB 3';
    else clbBand = 'CLB 2';

    if (overall >= 70 && wordCount >= minWords) App.markLessonDone(`write:${key}`);
    App.addXP(20 + Math.round(overall / 5));

    // Record errors as weak spots
    for (const err of errors.slice(0, 3)) {
      MistakesModule.record({
        type: 'write',
        sig: `write:${key}:${err.sample}`,
        prompt: `Error in your writing: <code>${err.sample}</code>`,
        correct: err.message,
        your: err.sample,
      });
    }

    container.querySelector('#report').innerHTML = `
      <div class="grammar-box" style="background:${overall >= 70 ? '#dcfce7' : (overall >= 50 ? '#fef3c7' : '#fee2e2')};border-left-color:${overall >= 70 ? 'var(--good)' : (overall >= 50 ? 'var(--warn)' : 'var(--bad)')}">
        <h3>📊 Grade: ${overall}/100 · estimated <b>${clbBand}</b></h3>
        <div class="row" style="margin-top:10px;flex-wrap:wrap">
          <span class="tag">Words: ${wordCount} / ${minWords}</span>
          <span class="tag">Rubric: ${rubricPassed}/${task.checks.length}</span>
          <span class="tag">Sentences: ${sentences.length}</span>
          <span class="tag">Tenses: ${tensesUsed.length}</span>
          ${errors.length > 0 ? `<span class="tag" style="background:#fee2e2;color:var(--bad)">Errors: ${errors.length}</span>` : '<span class="tag" style="background:#dcfce7;color:var(--good)">No errors detected</span>'}
        </div>
      </div>

      <div class="grammar-box">
        <h3>✅ Rubric checks</h3>
        <ul style="margin-left:20px;line-height:1.9">${rubricRows}</ul>
      </div>

      ${tensesUsed.length > 0 ? `
      <div class="grammar-box" style="background:#eff6ff">
        <h3>🕐 Tenses detected</h3>
        <p>${tensesUsed.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
        ${tensesUsed.length === 1 ? `<p style="margin-top:8px;color:var(--mute);font-size:14px">CLB 6 writing usually mixes 2-3 tenses. Try adding contrast (e.g., describe past + plan future).</p>` : ''}
      </div>` : ''}

      ${errors.length > 0 ? `
      <div class="grammar-box" style="background:#fee2e2;border-left-color:var(--bad)">
        <h3>⚠️ Errors detected (${errors.length})</h3>
        <ul style="margin-left:20px;line-height:1.7">${errors.map(e => `<li><code>${escapeHTML(e.sample)}</code> — ${e.message}</li>`).join('')}</ul>
        <p style="margin-top:10px;color:var(--mute);font-size:14px">These are added to your <a onclick="App.go('mistakes')" style="color:var(--bleu);cursor:pointer"><b>Weak Spots</b></a> for review.</p>
      </div>` : ''}

      <div class="grammar-box" style="background:#f9fafb">
        <h3>💡 Self-edit checklist</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Read your text ALOUD. Mistakes you'd never say in speech often appear in writing.</li>
          <li>Check every noun's article — is the gender right?</li>
          <li>Check verb agreement — does the ending match the subject?</li>
          <li>Check past tense — is the auxiliary (avoir/être) right?</li>
          <li>Check accents — é vs è vs ê, à vs a.</li>
        </ul>
      </div>`;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  return {
    render(container, params) {
      if (params && params.prompt) renderPrompt(container, params.prompt);
      else renderList(container);
    }
  };
})();
