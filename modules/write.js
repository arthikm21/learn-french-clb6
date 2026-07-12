// Writing Workshop — teach-by-model. No auto-grading.
//
// The old workshop pretended to grade free text with regexes and handed out
// fake scores. This one teaches the way exam candidates actually learn:
// study an annotated CLB-5 model for the real TCF/TEF task types, learn HOW
// MUCH to write and how to structure it, write your own, then compare
// honestly against the model with a self-check list.
//
// Routes:
//   #write                    → workshop home (method + guides + sample library)
//   #write?guide=tcf-t1       → task-type guide ("how to write this")
//   #write?sample=tcf-t1-01   → sample workspace (study / write / compare)
//   #write?prompt=w1          → legacy Path practice prompts (kept — no grading)
window.WriteModule = (function () {
  const esc = Chrome.escapeHTML;

  // Legacy Path prompts (w1-w8) → related exam models worth studying first.
  const RELATED = {
    w1: ['tcf-t2-05', 'tcf-t2-06'],
    w2: ['tcf-t2-06'],
    w3: ['tcf-t1-04'],
    w4: ['tcf-t3-10'],
    w5: ['tcf-t2-05', 'tcf-t2-08'],
    w6: ['tcf-t1-02', 'tcf-t1-04'],
    w7: ['tef-b-18'],
    w8: ['tcf-t1-02', 'tef-b-16'],
  };

  function words(txt) { return (String(txt).match(/[\p{L}\p{N}]+/gu) || []).length; }
  function sampleById(id) { return (window.WRITING_SAMPLES || []).find(s => s.id === id); }
  function guideOf(s) { return (window.WRITING_GUIDES || {})[s.guide] || {}; }
  function modelText(s) { return s.model.map(b => b.fr).join('\n\n'); }
  function frHTML(txt) { return esc(txt).replace(/\n/g, '<br>'); }
  function isDone(key) { return !!(App.state.lessons && App.state.lessons[key]); }
  const doneTag = '<span class="tag" style="background:rgba(52,199,89,.12);color:var(--good)">✓ Done</span>';

  // Word-count meter — the "how much to write" teacher.
  // openEnded = true for legacy "X+ words" prompts: no upper penalty, just a
  // floor. Exam samples pass a real [min,max] window (length is scored there).
  function meterHTML(n, min, max, openEnded) {
    const pct = Math.min(100, Math.round((n / max) * 100));
    let color, msg;
    if (n === 0)               { color = 'var(--mute)'; msg = openEnded ? `Target: ${min}+ words` : `Target: ${min}–${max} words`; }
    else if (n < min)          { color = 'var(--warn)'; msg = `${min - n} more word${min - n === 1 ? '' : 's'} to reach ${min}`; }
    else if (openEnded)        { color = 'var(--good)'; msg = 'Good length ✓'; }
    else if (n <= max)         { color = 'var(--good)'; msg = 'In the target zone ✓'; }
    else                       { color = 'var(--warn)'; msg = `${n - max} over ${max} — examiners stop reading, trim it`; }
    return `
      <div class="progress" style="height:6px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:var(--r-pill);transition:width .2s"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:var(--fs-13);color:var(--mute);font-variant-numeric:tabular-nums">
        <span style="color:${color}">${msg}</span>
        <span><b>${n}</b> words</span>
      </div>`;
  }

  // Common-slip scan — explicitly NOT a grade. Reuses GrammarCheck patterns
  // to flag obvious mechanical slips (elision, gender, si-clauses) only.
  function slipsHTML(txt) {
    const found = (window.GrammarCheck ? GrammarCheck.check(txt) : []).slice(0, 8);
    if (!found.length) {
      return `<div class="grammar-box" style="border-left-color:var(--good)">
        <h3>🔎 Common-slip scan</h3>
        <p>No obvious mechanical slips found. <span style="color:var(--mute)">This scan only catches common patterns (elision, gender, si-clauses) — it is not a grade. Compare with the model for the real check.</span></p>
      </div>`;
    }
    return `<div class="grammar-box" style="border-left-color:var(--warn)">
      <h3>🔎 Common-slip scan <span class="tag">not a grade</span></h3>
      <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
        ${found.map(e => `<li><code>${esc(e.span)}</code> — ${e.message}${e.suggestion ? ` → try <b>${esc(e.suggestion)}</b>` : ''}</li>`).join('')}
      </ul>
    </div>`;
  }

  // ─────────────────────────── HOME ───────────────────────────
  function renderHome(container) {
    const guides = window.WRITING_GUIDES || {};
    const samples = window.WRITING_SAMPLES || [];
    const gids = Object.keys(guides);

    const guideCards = gids.map(gid => {
      const g = guides[gid];
      const n = samples.filter(s => s.guide === gid).length;
      return `
        <div class="card" data-guide="${gid}">
          <div class="icon">${g.icon}</div>
          <h3>${esc(g.exam)} · ${esc(g.task)}</h3>
          <p style="color:var(--ink-2);font-size:var(--fs-14);margin-top:4px">${esc(g.label)}</p>
          <p style="margin-top:var(--sp-3)"><span class="tag">${g.words[0]}–${g.words[1]} words</span> <span class="tag">${n} models</span></p>
        </div>`;
    }).join('');

    const sampleSections = gids.map(gid => {
      const g = guides[gid];
      const cards = samples.filter(s => s.guide === gid).map(s => `
        <div class="card" data-sample="${s.id}">
          <div class="icon">${g.icon}</div>
          <h3>${esc(s.title)}</h3>
          <p><span class="tag">${esc(g.exam)} ${esc(g.task)}</span> <span class="tag">CLB 5</span> ${isDone('writesample:' + s.id) ? doneTag : ''}</p>
        </div>`).join('');
      return `<h2 class="section-h">${esc(g.exam)} — ${esc(g.task)} · ${esc(g.label)}</h2><div class="grid">${cards}</div>`;
    }).join('');

    const practiceCards = Object.keys(window.WRITING || {}).map(k => {
      const t = WRITING[k];
      return `
        <div class="card" data-prompt="${k}">
          <div class="icon">✍️</div>
          <h3>${esc(t.title)}</h3>
          <p><span class="tag">${esc(t.level)}</span> ${isDone('write:' + k) ? doneTag : ''}</p>
        </div>`;
    }).join('');

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Write'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Writing Workshop</p>
        <h1>Learn from real<br/>exam models.</h1>
        <p style="margin-top:var(--sp-4)">18 annotated CLB-5 model answers for the exact TCF Canada and TEF Canada writing tasks. See how much to write, steal the structures, then write your own.</p>
      </section>

      <div class="grammar-box" style="border-left-color:var(--accent)">
        <h3>The method — 3 steps, no robot grades</h3>
        <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
          <li><b>1 · Study a model.</b> Every sample is dissected: structure, key phrases, and how it addresses the task.</li>
          <li><b>2 · Write yours.</b> Same prompt, live word-count target — length discipline is half the exam.</li>
          <li><b>3 · Compare & self-check.</b> Your text beside the model, with the examiner's checklist. Honest beats automatic.</li>
        </ul>
      </div>

      <h2 class="section-h">How to write each task</h2>
      <div class="grid">${guideCards}</div>

      ${sampleSections}

      <h2 class="section-h">Path practice prompts</h2>
      <div class="grid">${practiceCards}</div>
    `;

    container.querySelectorAll('[data-guide]').forEach(el => { el.onclick = () => App.go('write', { guide: el.dataset.guide }); });
    container.querySelectorAll('[data-sample]').forEach(el => { el.onclick = () => App.go('write', { sample: el.dataset.sample }); });
    container.querySelectorAll('[data-prompt]').forEach(el => { el.onclick = () => App.go('write', { prompt: el.dataset.prompt }); });
  }

  // ─────────────────────────── GUIDE ───────────────────────────
  function renderGuide(container, gid) {
    const g = (window.WRITING_GUIDES || {})[gid];
    if (!g) { App.go('write'); return; }
    const samples = (window.WRITING_SAMPLES || []).filter(s => s.guide === gid);

    container.innerHTML = `
      ${Chrome.render({ back: 'write', crumbs: ['Write', `${g.exam} ${g.task}`] })}
      <div class="lesson">
        <h2>${g.icon} ${esc(g.exam)} · ${esc(g.task)} — ${esc(g.label)}</h2>
        <p style="font-size:var(--fs-17);color:var(--ink-2);margin:var(--sp-3) 0 var(--sp-5)">${esc(g.tagline)}</p>

        <div class="grammar-box" style="border-left-color:var(--accent)">
          <h3>📏 How much to write</h3>
          <p><b>${g.words[0]} to ${g.words[1]} words</b> · ${esc(g.time)}.</p>
          <p style="margin-top:var(--sp-2);color:var(--ink-2)">${g.clbNote}</p>
        </div>

        <div class="grammar-box">
          <h3>🧱 The structure that scores</h3>
          <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
            ${g.structure.map((s, i) => `<li><b>${i + 1}.</b> ${s}</li>`).join('')}
          </ul>
        </div>

        <div class="grammar-box">
          <h3>🎙️ Register</h3>
          <p>${g.register}</p>
        </div>

        <div class="grammar-box">
          <h3>🔗 Connectors & tenses to show</h3>
          <p>${g.connectors.map(c => `<span class="tag">${esc(c)}</span>`).join(' ')}</p>
          <ul style="margin:var(--sp-3) 0 0 20px;line-height:var(--lh-loose);color:var(--ink-2)">
            ${g.tenses.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>

        <div class="grammar-box" style="border-left-color:var(--bad)">
          <h3>⚠️ Where candidates lose points</h3>
          <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
            ${g.pointLosers.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>

        <h2 class="section-h" style="margin-top:var(--sp-7)">Models for this task</h2>
        <div class="grid">
          ${samples.map(s => `
            <div class="card" data-sample="${s.id}">
              <div class="icon">${g.icon}</div>
              <h3>${esc(s.title)}</h3>
              <p><span class="tag">CLB 5</span> ${isDone('writesample:' + s.id) ? doneTag : ''}</p>
            </div>`).join('')}
        </div>
      </div>`;
    container.querySelectorAll('[data-sample]').forEach(el => { el.onclick = () => App.go('write', { sample: el.dataset.sample }); });
  }

  // ─────────────────────────── SAMPLE WORKSPACE ───────────────────────────
  function renderSample(container, sid) {
    const s = sampleById(sid);
    if (!s) { App.go('write'); return; }
    const g = guideOf(s);
    const draftKey = 'draft_sample_' + s.id;
    let view = 'menu'; // menu | study | write | compare

    function header(crumb) {
      return Chrome.render({
        back: () => `App.go('write', { guide: '${s.guide}' })`,
        crumbs: ['Write', `${g.exam} ${g.task}`, crumb || s.title],
      });
    }

    function promptBox() {
      return `
        <div class="grammar-box" style="border-left-color:var(--accent)">
          <h3>📝 The task</h3>
          <p style="font-weight:var(--fw-semi)">${esc(s.prompt)}</p>
          ${Chrome.gloss(s.promptEn)}
          <p style="margin-top:var(--sp-2);color:var(--mute)"><b>Target:</b> ${g.words[0]}–${g.words[1]} words · <a style="color:var(--accent);cursor:pointer" data-nav-guide>How to write a ${esc(g.task)} →</a></p>
        </div>`;
    }

    function bindCommon() {
      const gl = container.querySelector('[data-nav-guide]');
      if (gl) gl.onclick = () => App.go('write', { guide: s.guide });
    }

    // ── menu: choose your path
    function renderMenu() {
      container.innerHTML = `
        ${header()}
        <div class="lesson">
          <h2>${g.icon} ${esc(s.title)} <span class="tag">${esc(g.exam)} ${esc(g.task)}</span> <span class="tag">CLB 5</span></h2>
          ${promptBox()}
          <div class="row" style="margin-top:var(--sp-5);gap:var(--sp-3);flex-wrap:wrap">
            <button class="btn primary big" id="go-write">✍️ Write mine first<span class="arr">→</span></button>
            <button class="btn secondary big" id="go-study">📖 Study the model first</button>
          </div>
          <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-3)">Strongest learning: try writing first, then compare. But studying first is fine when the task type is new to you.</p>
        </div>`;
      bindCommon();
      container.querySelector('#go-write').onclick = () => { view = 'write'; render(); };
      container.querySelector('#go-study').onclick = () => { view = 'study'; render(); };
    }

    // ── study: the annotated model
    function studyBlocks() {
      const n = words(modelText(s));
      return `
        <div class="grammar-box" style="border-left-color:var(--good)">
          <h3>📄 Model answer <span class="tag">${n} words</span></h3>
          <p style="color:var(--mute);font-size:var(--fs-13);margin-bottom:var(--sp-3)">Each block is labeled so you can see the skeleton. Together they read as one text.</p>
          ${s.model.map(b => `
            <div style="margin-top:var(--sp-3);padding:var(--sp-3);background:var(--surface-2);border-radius:var(--r-md)">
              <p style="font-size:var(--fs-12);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);color:var(--accent);margin-bottom:6px">${esc(b.label)}</p>
              <p lang="fr" style="color:var(--ink);font-family:var(--serif);font-size:var(--fs-17);line-height:var(--lh-loose)">${frHTML(b.fr)}</p>
            </div>`).join('')}
          ${Chrome.gloss(s.summaryEn)}
        </div>

        <div class="grammar-box">
          <h3>🗝️ Phrases to steal</h3>
          <table class="conj-table"><tbody>
            ${s.keyPhrases.map(k => `<tr><td style="width:55%"><b>${esc(k.fr)}</b></td><td>${esc(k.en)}</td></tr>`).join('')}
          </tbody></table>
        </div>

        <div class="grammar-box" style="border-left-color:var(--good)">
          <h3>✅ Why this is CLB 5</h3>
          <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
            ${s.whyClb5.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>

        <div class="grammar-box" style="border-left-color:var(--bleu)">
          <h3>🚀 What CLB 6 would add</h3>
          <p>${s.toClb6}</p>
        </div>`;
    }

    function renderStudy() {
      container.innerHTML = `
        ${header('Study')}
        <div class="lesson">
          <h2>${g.icon} ${esc(s.title)} <span class="tag">Model</span></h2>
          ${promptBox()}
          ${studyBlocks()}
          <div class="row" style="justify-content:flex-end;margin-top:var(--sp-5)">
            <button class="btn primary big" id="go-write">Now write yours<span class="arr">→</span></button>
          </div>
        </div>`;
      bindCommon();
      container.querySelector('#go-write').onclick = () => { view = 'write'; render(); };
    }

    // ── write: textarea + live length target
    function renderWrite() {
      const saved = window.Storage.getItem(draftKey) || '';
      container.innerHTML = `
        ${header('Write')}
        <div class="lesson">
          <h2>${g.icon} ${esc(s.title)} <span class="tag">Your turn</span></h2>
          ${promptBox()}
          <textarea class="input" id="essay" placeholder="Écris ici en français...">${esc(saved)}</textarea>
          <div id="meter" style="margin-top:var(--sp-2)"></div>
          <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-2)">Auto-saved as you type.</p>
          <div id="slips"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:var(--sp-3)">
            <div class="row" style="gap:var(--sp-2)">
              <button class="btn secondary" id="scan">🔎 Slip scan</button>
              <button class="btn ghost" id="peek">📖 Peek at model</button>
            </div>
            <button class="btn primary big" id="compare" disabled>Compare with model<span class="arr">→</span></button>
          </div>
        </div>`;
      bindCommon();
      const ta = container.querySelector('#essay');
      const meter = container.querySelector('#meter');
      const compareBtn = container.querySelector('#compare');
      const paint = () => {
        const n = words(ta.value);
        meter.innerHTML = meterHTML(n, g.words[0], g.words[1]);
        compareBtn.disabled = n < g.words[0];
        window.Storage.setItem(draftKey, ta.value);
      };
      ta.addEventListener('input', paint);
      paint();
      container.querySelector('#scan').onclick = () => { container.querySelector('#slips').innerHTML = slipsHTML(ta.value); };
      container.querySelector('#peek').onclick = () => { view = 'study'; render(); };
      compareBtn.onclick = () => { if (!compareBtn.disabled) { view = 'compare'; render(); } };
    }

    // ── compare: yours vs model + self-check → mark complete
    function renderCompare() {
      const mine = window.Storage.getItem(draftKey) || '';
      const n = words(mine);
      const checks = g.selfCheck || [];
      container.innerHTML = `
        ${header('Compare')}
        <div class="lesson">
          <h2>${g.icon} ${esc(s.title)} <span class="tag">Compare</span></h2>

          <div class="grammar-box" ${n ? '' : 'style="border-left-color:var(--warn)"'}>
            <h3>✍️ Your text <span class="tag">${n} words · target ${g.words[0]}–${g.words[1]}</span></h3>
            <p style="color:var(--ink)">${mine ? frHTML(mine) : '<i style="color:var(--mute)">Nothing written yet — go back and try. Comparing an empty page teaches nothing.</i>'}</p>
          </div>

          ${studyBlocks()}

          <div class="grammar-box" style="border-left-color:var(--accent)">
            <h3>🧾 Self-check — be honest, that's the whole point</h3>
            <div id="checks">
              ${checks.map((c, i) => `
                <label style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;cursor:pointer">
                  <input type="checkbox" data-chk="${i}" style="margin-top:4px;accent-color:var(--accent)"/>
                  <span style="color:var(--ink-2);line-height:var(--lh-loose)">${c}</span>
                </label>`).join('')}
            </div>
          </div>

          ${Support.kitCard('writing')}

          <div class="row" style="justify-content:space-between;margin-top:var(--sp-5);flex-wrap:wrap;gap:var(--sp-3)">
            <button class="btn ghost" id="back-write">← Edit my text</button>
            <button class="btn primary big" id="done" disabled>Mark complete</button>
          </div>
          <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-2);text-align:right">Tick every box you honestly meet — then complete.</p>
        </div>`;
      bindCommon();
      container.querySelector('#back-write').onclick = () => { view = 'write'; render(); };
      const boxes = [...container.querySelectorAll('[data-chk]')];
      const doneBtn = container.querySelector('#done');
      const gate = () => { doneBtn.disabled = n < g.words[0] || !boxes.every(b => b.checked); };
      boxes.forEach(b => b.addEventListener('change', gate));
      gate();
      doneBtn.onclick = () => {
        App.markLessonDone(`writesample:${s.id}`);
        App.addXP(25);
        const all = window.WRITING_SAMPLES || [];
        const idx = all.findIndex(x => x.id === s.id);
        const next = all[idx + 1];
        container.innerHTML = Chrome.finishScreen({
          back: 'write', crumbs: ['Write', s.title, 'Complete'],
          icon: '✍️',
          title: 'Model mastered',
          scoreLine: `<b>${esc(s.title)}</b> — studied, written, self-checked.`,
          sub: 'Re-write the same task from memory in a few days. That\'s when it sticks.',
          actions: [
            ...(next ? [{ label: 'Next model', onclick: `App.go('write', { sample: '${next.id}' })`, primary: true, arrow: true }] : []),
            { label: 'All models', onclick: "App.go('write')", primary: !next },
          ],
        });
      };
    }

    function render() {
      if (view === 'study') return renderStudy();
      if (view === 'write') return renderWrite();
      if (view === 'compare') return renderCompare();
      return renderMenu();
    }
    render();
  }

  // ─────────────────────────── LEGACY PATH PROMPTS ───────────────────────────
  function renderPractice(container, key) {
    const t = (window.WRITING || {})[key];
    if (!t) { App.go('write'); return; }
    const draftKey = 'draft_' + key; // same key as the old grader — drafts survive
    const saved = window.Storage.getItem(draftKey) || '';
    const minWords = t.minWords || 30;
    const related = (RELATED[key] || []).map(sampleById).filter(Boolean);

    container.innerHTML = `
      ${Chrome.render({ back: 'write', crumbs: ['Write', t.title] })}
      <div class="lesson">
        <h2>✍️ ${esc(t.title)} <span class="tag">${esc(t.level)}</span></h2>
        <div class="grammar-box">
          <h3>📝 Prompt</h3>
          <p>${t.prompt}</p>
          <p style="margin-top:var(--sp-2);color:var(--mute)"><b>Target:</b> ${minWords}+ words.</p>
        </div>
        ${related.length ? `
        <div class="grammar-box" style="border-left-color:var(--accent)">
          <h3>📖 Study a model like this first</h3>
          <div class="row" style="flex-wrap:wrap;gap:var(--sp-2);margin-top:var(--sp-2)">
            ${related.map(r => `<button class="btn secondary sm" data-rel="${r.id}">${esc(r.title)} →</button>`).join('')}
          </div>
        </div>` : ''}
        <div class="grammar-box" style="border-left-color:var(--good)">
          <h3>💡 Hints</h3>
          <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">${t.hints.map(h => `<li>${h}</li>`).join('')}</ul>
        </div>
        <textarea class="input" id="essay" placeholder="Écris ici en français...">${esc(saved)}</textarea>
        <div id="meter" style="margin-top:var(--sp-2)"></div>
        <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-2)">Auto-saved as you type.</p>
        <div id="slips"></div>
        <div class="grammar-box" style="margin-top:var(--sp-4)">
          <h3>Final self-review</h3>
          <label style="display:flex;gap:10px;align-items:flex-start;margin-top:var(--sp-3)"><input type="checkbox" data-review /> <span>I answered every part of the prompt.</span></label>
          <label style="display:flex;gap:10px;align-items:flex-start;margin-top:var(--sp-2)"><input type="checkbox" data-review /> <span>I connected ideas with at least two linking words.</span></label>
          <label style="display:flex;gap:10px;align-items:flex-start;margin-top:var(--sp-2)"><input type="checkbox" data-review /> <span>I read the response aloud and corrected anything that sounded wrong.</span></label>
        </div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:var(--sp-3)">
          <div class="row" style="gap:var(--sp-2)">
            <button class="btn secondary" id="scan">🔎 Slip scan</button>
            <button class="btn ghost" id="clear">Clear</button>
          </div>
          <button class="btn primary big" id="done" disabled>Mark as practiced</button>
        </div>
        <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-2);text-align:right">Reach ${minWords} words, run the slip scan, and complete the self-review.</p>
      </div>`;

    const ta = container.querySelector('#essay');
    const meter = container.querySelector('#meter');
    const doneBtn = container.querySelector('#done');
    let scanned = false;
    const paint = () => {
      const n = words(ta.value);
      meter.innerHTML = meterHTML(n, minWords, Math.max(minWords * 2, minWords + 40), true);
      const reviewed = [...container.querySelectorAll('[data-review]')].every(box => box.checked);
      doneBtn.disabled = n < minWords || !scanned || !reviewed;
      window.Storage.setItem(draftKey, ta.value);
    };
    ta.addEventListener('input', paint);
    paint();

    container.querySelectorAll('[data-rel]').forEach(b => { b.onclick = () => App.go('write', { sample: b.dataset.rel }); });
    container.querySelector('#scan').onclick = () => {
      scanned = true;
      container.querySelector('#slips').innerHTML = slipsHTML(ta.value);
      paint();
    };
    container.querySelectorAll('[data-review]').forEach(box => box.addEventListener('change', paint));
    container.querySelector('#clear').onclick = () => {
      if (confirm('Clear your draft?')) { ta.value = ''; scanned = false; container.querySelectorAll('[data-review]').forEach(box => { box.checked = false; }); paint(); container.querySelector('#slips').innerHTML = ''; }
    };
    doneBtn.onclick = () => {
      App.markLessonDone(`write:${key}`);
      App.addXP(20);
      container.innerHTML = Chrome.finishScreen({
        back: 'write', crumbs: ['Write', t.title, 'Complete'],
        icon: '✍️',
        title: 'Writing practiced',
        scoreLine: `<b>${words(window.Storage.getItem(draftKey) || '')}</b> words on "${esc(t.title)}".`,
        sub: 'Want a real check? Compare against an exam model — structure and length are what score.',
        extra: Support.winNudge(),
        actions: [
          ...(related.length ? [{ label: 'Study the matching model', onclick: `App.go('write', { sample: '${related[0].id}' })`, primary: true, arrow: true }] : []),
          { label: 'Back to Path', onclick: "App.go('path')", primary: !related.length },
        ],
      });
    };
  }

  return {
    render(container, params) {
      if (params && params.sample) return renderSample(container, params.sample);
      if (params && params.guide) return renderGuide(container, params.guide);
      if (params && params.prompt) return renderPractice(container, params.prompt);
      renderHome(container);
    }
  };
})();
