// Writing Task 3 — TCF EE compare-2-opinions task.
// Renders the 2 opinion texts, prompt, textarea, then auto-grades by rubric + grammar check.
window.WriteTask3Module = (function () {
  function renderList(container) {
    const tasks = window.WRITE_TASK3;
    container.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,#7c3aed,#0055A4)">
        <div class="flag-stripes"></div>
        <h1>✍️ Writing Task 3 — Compare 2 opinions</h1>
        <p>The hardest TCF EE task: read 2 short opposing views, write ~150 words summarizing both and giving your own opinion with reasons.</p>
      </div>
      <div class="grammar-box">
        <h3>📋 What TCF EE Task 3 expects</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Brief comparison of both opinions (1-2 sentences each)</li>
          <li>Your own position, taken clearly</li>
          <li>2 reasons supporting your view</li>
          <li>At least 1 concrete example</li>
          <li>Logical structure with discourse connectors (cependant, par conséquent, d'une part / d'autre part, néanmoins, par ailleurs)</li>
          <li>Word target: 120-180 words</li>
        </ul>
      </div>
      <div class="grid" id="t3-grid"></div>`;
    const grid = container.querySelector('#t3-grid');
    for (const k of Object.keys(tasks)) {
      const t = tasks[k];
      const done = App.state.lessons[`wt3:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">✍️</div>
        <h3>${t.title}</h3>
        <p><span class="tag">${t.level}</span>${done ? ' <span class="tag" style="background:#dcfce7;color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px;font-size:13px;color:var(--mute)">${t.topic}</p>`;
      card.onclick = () => App.go('writetask3', { id: k });
      grid.appendChild(card);
    }
  }

  function renderTask(container, id) {
    const t = window.WRITE_TASK3[id];
    if (!t) { App.go('writetask3'); return; }
    const draftKey = 'wt3_draft_' + id;
    const saved = window.Storage.getItem(draftKey) || '';

    container.innerHTML = `
      <div class="lesson">
        <h2>✍️ ${t.title} <span class="tag">${t.level}</span></h2>
        <div class="grammar-box">
          <h3>📜 Question</h3>
          <p style="font-style:italic">${t.topic}</p>
        </div>
        <div class="grammar-box" style="background:#eff6ff;border-left-color:var(--bleu)">
          <h3>👤 Opinion A — ${t.opinionA.author}</h3>
          <p>${t.opinionA.text}</p>
        </div>
        <div class="grammar-box" style="background:#fef2f2;border-left-color:var(--rouge)">
          <h3>👥 Opinion B — ${t.opinionB.author}</h3>
          <p>${t.opinionB.text}</p>
        </div>
        <div class="grammar-box" style="background:#fffdf7;border-left-color:var(--warn)">
          <h3>✍️ Your task</h3>
          <p>${t.promptInstructions}</p>
        </div>
        <textarea class="input" id="wt3-essay" placeholder="Écrivez ici en français (~150 mots)..." style="font-size:16px;min-height:280px">${saved}</textarea>
        <div class="row" style="margin-top:8px;justify-content:space-between;color:var(--mute);font-size:13px">
          <span id="wt3-wc">0 words</span>
          <span>💾 Auto-saved as you type</span>
        </div>
        <div class="spacer"></div>
        <div id="wt3-report"></div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('writetask3')">← Prompts</button>
          <div class="row">
            <button class="btn secondary" id="wt3-clear">🗑️ Clear</button>
            <button class="btn big" id="wt3-check">📊 Grade my work</button>
          </div>
        </div>
      </div>`;

    const ta = container.querySelector('#wt3-essay');
    const wc = container.querySelector('#wt3-wc');
    const updateWC = () => {
      const n = (ta.value.match(/\b\w+\b/g) || []).length;
      wc.textContent = `${n} word${n === 1 ? '' : 's'}`;
      window.Storage.setItem(draftKey, ta.value);
    };
    ta.addEventListener('input', updateWC);
    updateWC();
    container.querySelector('#wt3-clear').onclick = () => {
      if (confirm('Clear your draft?')) { ta.value = ''; updateWC(); container.querySelector('#wt3-report').innerHTML = ''; }
    };
    container.querySelector('#wt3-check').onclick = () => grade(container, t, id, ta.value);
  }

  function grade(container, t, id, txt) {
    const words = (txt.match(/\b\w+\b/g) || []).length;
    const sentences = txt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const lower = txt.toLowerCase();

    // Rubric checks
    const rubricChecks = [
      { label: 'Mentions opinion A (author name or key word)', pass: lower.includes(t.opinionA.author.split(',')[0].toLowerCase()) || rubricKeywordMatch(lower, t.opinionA.text) },
      { label: 'Mentions opinion B (author name or key word)', pass: lower.includes(t.opinionB.author.split(',')[0].toLowerCase()) || rubricKeywordMatch(lower, t.opinionB.text) },
      { label: 'Position-taking phrase ("je pense que", "à mon avis", "selon moi", "personnellement")', pass: /\b(je pense|à mon avis|selon moi|personnellement|je crois|je trouve|d'après moi|je suis convaincu)/i.test(txt) },
      { label: '2+ comparison/contrast connectors', pass: countMatches(txt, /\b(cependant|néanmoins|en revanche|par contre|toutefois|d'une part|d'autre part|alors que|tandis que|au contraire)\b/gi) >= 2 },
      { label: '1+ cause/consequence connector', pass: /\b(parce que|car|puisque|en effet|donc|par conséquent|c'est pourquoi|ainsi)\b/i.test(txt) },
      { label: 'Concrete example (par exemple / comme / notamment)', pass: /\b(par exemple|comme|notamment|prenons|c'est le cas|en effet)\b/i.test(txt) },
      { label: 'Word count 120-180', pass: words >= 120 && words <= 200 },
      { label: 'At least 6 sentences', pass: sentences >= 6 },
    ];
    const rubricPassed = rubricChecks.filter(r => r.pass).length;
    const rubricPct = Math.round((rubricPassed / rubricChecks.length) * 100);

    // Grammar errors
    const grammarErrors = (window.GrammarCheck ? GrammarCheck.check(txt) : []);

    // Score blend
    let score = 0;
    score += Math.min(40, Math.round(rubricPct * 0.40));
    score += words >= 120 ? 25 : Math.round((words / 120) * 25);
    score += sentences >= 6 ? 10 : Math.round((sentences / 6) * 10);
    // Lexical variety (rough): unique non-common words / total
    const uniqueRatio = uniqueWordRatio(txt);
    score += Math.round(uniqueRatio * 15);
    score -= Math.min(20, grammarErrors.length * 4);
    score = Math.max(0, Math.min(100, score + 10));

    // TCF EE 0-20 + CLB
    const tcfScore = Math.round((score / 100) * 20);
    let clb = '<4';
    if (tcfScore >= 16) clb = '10';
    else if (tcfScore >= 14) clb = '9';
    else if (tcfScore >= 12) clb = '8';
    else if (tcfScore >= 10) clb = '7';
    else if (tcfScore >= 7) clb = '6';
    else if (tcfScore >= 6) clb = '5';
    else if (tcfScore >= 4) clb = '4';

    if (score >= 65 && words >= 120) App.markLessonDone(`wt3:${id}`);

    // Record errors as weak spots
    for (const err of grammarErrors.slice(0, 3)) {
      MistakesModule.record({
        type: 'write',
        sig: `wt3:${id}:${err.span || ''}`,
        prompt: `Task 3 error: <code>${escapeHTML(err.span || '')}</code>`,
        correct: err.message,
        your: err.span || '',
      });
    }

    const passColor = tcfScore >= 7 ? 'var(--good)' : 'var(--warn)';
    const passBg = tcfScore >= 7 ? '#dcfce7' : '#fef3c7';
    container.querySelector('#wt3-report').innerHTML = `
      <div class="grammar-box" style="background:${passBg};border-left-color:${passColor}">
        <h3>📊 TCF EE estimated: ${tcfScore}/20 · CLB ${clb}</h3>
        <p>Overall: <b>${score}/100</b></p>
        <div class="row" style="margin-top:8px;flex-wrap:wrap">
          <span class="tag">Words: ${words}</span>
          <span class="tag">Sentences: ${sentences}</span>
          <span class="tag">Rubric: ${rubricPassed}/${rubricChecks.length}</span>
          <span class="tag">Lexical variety: ${Math.round(uniqueRatio * 100)}%</span>
          ${grammarErrors.length ? `<span class="tag" style="background:#fee2e2;color:var(--bad)">Errors: ${grammarErrors.length}</span>` : '<span class="tag" style="background:#dcfce7;color:var(--good)">No grammar errors</span>'}
        </div>
      </div>
      <div class="grammar-box">
        <h3>✅ Task 3 rubric (TCF expects all 8)</h3>
        <ul style="margin-left:20px;line-height:1.9">${rubricChecks.map(r => `<li>${r.pass ? '✅' : '⬜'} ${r.label}</li>`).join('')}</ul>
      </div>
      ${grammarErrors.length ? `
      <div class="grammar-box" style="background:#fee2e2;border-left-color:var(--bad)">
        <h3>⚠️ Grammar errors detected</h3>
        <ul style="margin-left:20px;line-height:1.8">${grammarErrors.map(e => {
          const sug = e.suggestion ? ` → try <b>${escapeHTML(e.suggestion)}</b>` : '';
          return `<li><code>${escapeHTML(e.span || '')}</code> — ${e.message}${sug}</li>`;
        }).join('')}</ul>
      </div>` : ''}
      <div class="grammar-box" style="background:#f9fafb">
        <h3>💡 TCF Task 3 strategy</h3>
        <p>If you scored below 7/20: re-read both opinions, write a single sentence summary of each, then choose your side and list 2 reasons before composing your paragraph. Read aloud to catch flow errors.</p>
      </div>`;
  }

  function rubricKeywordMatch(lower, opinionText) {
    const keywords = opinionText.toLowerCase().split(/\W+/).filter(w => w.length > 5).slice(0, 8);
    return keywords.some(k => lower.includes(k));
  }
  function countMatches(text, re) {
    const m = text.match(re);
    return m ? m.length : 0;
  }
  function uniqueWordRatio(txt) {
    const words = (txt.toLowerCase().match(/\b[a-zà-ÿ']+\b/g) || []).filter(w => w.length > 3);
    if (words.length === 0) return 0;
    const unique = new Set(words).size;
    return unique / words.length;
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  return {
    render(container, params) {
      if (params && params.id) renderTask(container, params.id);
      else renderList(container);
    }
  };
})();
