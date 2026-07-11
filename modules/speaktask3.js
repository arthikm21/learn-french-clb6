// TCF EO Task 3 — Argumentative monologue (defend an opinion for 3-5 min).
//
// Replaced the browser-SpeechRecognition flow (unreliable / blocked in Brave)
// with a local MediaRecorder + self-rubric + optional type-back. The existing
// connector / position / counter-argument detector still runs — but on the
// typed transcript, where text analysis actually works.
window.SpeakTask3Module = (function () {

  const PREPLY = 'https://preply.sjv.io/c/7425774/1987575/24422';

  const RUBRIC = [
    'I stated my position clearly at the start (Je pense que… / À mon avis…)',
    'I gave at least 3 distinct reasons or arguments',
    'I gave at least 1 concrete example',
    'I used discourse connectors (cependant, par conséquent, d\'une part…)',
    'I addressed a counter-argument (Certes… / Il est vrai que…)',
    'I spoke for the full time without long pauses',
  ];

  function renderList(container) {
    const tasks = window.SPEAK_TASK3;
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>🎤 Speaking Task 3 — Argumentative Monologue</h1>
        <p>TCF EO Task 3. Take a position on a topic, defend it with reasoning for 3-5 minutes. This is the most weighted speaking task.</p>
      </div>
      <div class="grammar-box">
        <h3>📋 What TCF EO Task 3 expects</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Clear position taken: "Je pense que…", "À mon avis…", "Selon moi…"</li>
          <li>At least 3 distinct reasons</li>
          <li>Use of discourse connectors: <code>cependant, néanmoins, par conséquent, d'une part / d'autre part, en revanche, en effet, par ailleurs</code></li>
          <li>1+ concrete example</li>
          <li>1 counter-argument addressed: "Certes…", "Il est vrai que…", "Certains pensent que…"</li>
          <li>Speaking time: 3-5 minutes (~250-400 words)</li>
        </ul>
      </div>
      <div class="grammar-box" style="border-left-color:var(--accent)">
        <h3>How this task runs now</h3>
        <p>Record yourself for the full time. Listen back. Self-rate, then optionally type out what you argued — the connector and counter-argument detectors score the typed text. Nothing uploads.</p>
      </div>
      <div class="grid" id="t3-grid"></div>`;
    const grid = container.querySelector('#t3-grid');
    for (const k of Object.keys(tasks)) {
      const t = tasks[k];
      const done = App.state.lessons[`st3:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">🎤</div>
        <h3>${Chrome.escapeHTML(t.title)}</h3>
        <p><span class="tag">${Chrome.escapeHTML(t.level)}</span>${done ? ' <span class="tag" style="color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px;font-size:13px;color:var(--mute)">${Chrome.escapeHTML(t.topic)}</p>`;
      card.onclick = () => App.go('speaktask3', { id: k });
      grid.appendChild(card);
    }
  }

  function renderTask(container, id) {
    const t = window.SPEAK_TASK3[id];
    if (!t) { App.go('speaktask3'); return; }

    container.innerHTML = `
      <div class="lesson">
        <h2>🎤 ${Chrome.escapeHTML(t.title)} <span class="tag">${Chrome.escapeHTML(t.level)}</span></h2>
        <div class="grammar-box" style="border-left-color:var(--warn)">
          <h3>📜 Topic</h3>
          <p style="font-size:17px;font-weight:600">${Chrome.escapeHTML(t.topic)}</p>
          ${Chrome.gloss(t.topicEn)}
        </div>
        <div class="grammar-box">
          <h3>📋 Your task</h3>
          <p>${Chrome.escapeHTML(t.prompt)}</p>
          ${Chrome.gloss(t.promptEn)}
        </div>
        <div class="grammar-box" style="background:rgba(0,85,164,.08)">
          <h3>🎯 Build your argument before speaking</h3>
          <p>Spend 30 seconds preparing in your head:</p>
          <ul style="margin-left:20px;line-height:1.7">
            <li><b>Position</b>: Pour ou contre ?</li>
            <li><b>Reason 1</b>:</li>
            <li><b>Reason 2</b>:</li>
            <li><b>Reason 3</b>:</li>
            <li><b>Example</b>:</li>
            <li><b>Counter-argument you'll address</b>:</li>
          </ul>
        </div>

        <div class="grammar-box" id="rec-panel">
          <h3>Step 1 — Record yourself</h3>
          <p style="color:var(--mute);font-size:13px;margin-bottom:14px">Stays on your device. Press the mic when ready.</p>
          <div class="center">
            <button class="mic-btn" id="rec-btn" title="Press to record" aria-label="Start recording">🎙️</button>
            <p style="font-family:'Fredoka',sans-serif;font-size:32px;color:var(--bleu);margin-top:10px" id="rec-timer" aria-live="polite">${formatTime(t.targetTime)}</p>
            <p id="rec-status" style="color:var(--mute);margin-top:4px;font-size:14px;max-width:500px;margin-left:auto;margin-right:auto" aria-live="polite">Press the mic when ready to speak.</p>
            <div id="rec-result" style="margin-top:14px"></div>
          </div>
        </div>

        <div class="grammar-box" id="model-panel" style="display:none;border-left-color:var(--bleu)">
          <h3>Step 2 — Power phrases to borrow</h3>
          <p><b>Take position</b>: "Je pense fermement que…", "À mon avis…", "Personnellement, je suis convaincu(e) que…"</p>
          <p style="margin-top:6px"><b>Argue</b>: "D'une part… d'autre part…", "Tout d'abord… ensuite… enfin…", "Par conséquent…", "C'est pourquoi…"</p>
          <p style="margin-top:6px"><b>Example</b>: "Par exemple…", "Prenons le cas de…", "C'est notamment vrai pour…"</p>
          <p style="margin-top:6px"><b>Counter</b>: "Certes, certains pensent que… cependant…", "Il est vrai que… mais…", "Bien sûr… toutefois…"</p>
        </div>

        <div id="rate-panel" style="display:none"></div>
        <div id="st3-report"></div>

        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('speaktask3')">← Tasks</button>
        </div>
      </div>`;

    let rubricMounted = false;
    attachRecorder(container.querySelector('#rec-panel'), {
      maxSeconds: t.targetTime || 240,
      timerFormatter: formatTime,
      onComplete: () => {
        container.querySelector('#model-panel').style.display = '';
        // Stale grade no longer matches the current take.
        const report = container.querySelector('#st3-report');
        if (report) report.innerHTML = '';
        const ratePanel = container.querySelector('#rate-panel');
        ratePanel.style.display = '';
        if (rubricMounted) return; // Preserve user's existing checks + typed text.
        rubricMounted = true;
        attachRubric(ratePanel, {
          items: RUBRIC,
          typebackPlaceholder: 'Type your argument as you said it. Aim for 250+ words for CLB 6.',
          onGrade: ({ rubricHits, typedText }) => grade(container, t, id, rubricHits, typedText),
        });
      },
    });
  }

  function grade(container, t, id, rubricHits, typedText) {
    const text = (typedText || '').trim();
    const lower = text.toLowerCase();
    const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;

    const hitCount = (arr) => arr.filter(kw => lower.includes(kw)).length;
    const positionHits = hitCount(t.keywords.position);
    const connectorHits = hitCount(t.keywords.connectors);
    const exampleHits = hitCount(t.keywords.examples);
    const counterHits = hitCount(t.keywords.counter);
    const distinctWords = new Set((lower.match(/\b[a-zà-ÿ']+\b/g) || []).filter(w => w.length > 3)).size;

    const textRubric = [
      { label: 'Position clearly taken (in typed transcript)', pass: positionHits >= 1 },
      { label: '3+ discourse connectors (typed)', pass: connectorHits >= 3 },
      { label: '1+ concrete example (typed)', pass: exampleHits >= 1 },
      { label: '1+ counter-argument acknowledged (typed)', pass: counterHits >= 1 },
      { label: 'Word count 200+ (typed)', pass: words >= 200 },
      { label: 'Word count 250+ (CLB 6 target)', pass: words >= 250 },
      { label: 'Lexical variety (60+ distinct meaningful words)', pass: distinctWords >= 60 },
    ];

    const rubricPct = Math.round((rubricHits.length / RUBRIC.length) * 100);
    let typedPct = null;
    if (text.length > 50) {
      const passed = textRubric.filter(r => r.pass).length;
      typedPct = Math.round((passed / textRubric.length) * 100);
    }
    const total = typedPct != null ? Math.round((rubricPct + typedPct) / 2) : rubricPct;

    const tcfScore = Math.round((total / 100) * 20);
    let clb = '<4';
    if (tcfScore >= 16) clb = '10';
    else if (tcfScore >= 14) clb = '9';
    else if (tcfScore >= 12) clb = '8';
    else if (tcfScore >= 10) clb = '7';
    else if (tcfScore >= 7) clb = '6';
    else if (tcfScore >= 6) clb = '5';
    else if (tcfScore >= 4) clb = '4';

    App.recordAttempt(`st3:${id}`, total, 65, 'automated-speaking-self-check');

    const passColor = tcfScore >= 7 ? 'var(--good)' : 'var(--warn)';
    const passBg = tcfScore >= 7 ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)';

    container.querySelector('#st3-report').innerHTML = `
      <div class="grammar-box" style="background:${passBg};border-left-color:${passColor};margin-top:14px">
        <h3>📊 TCF EO Task 3 estimated: ${tcfScore}/20 · CLB ${clb}</h3>
        <p>Overall: <b>${total}/100</b></p>
        <div class="row" style="margin-top:8px;flex-wrap:wrap">
          <span class="tag">Self-rubric: ${rubricHits.length}/${RUBRIC.length}</span>
          ${typedPct != null ? `<span class="tag">Typed transcript: ${typedPct}/100</span>` : '<span class="tag" style="color:var(--mute)">No typed transcript</span>'}
          ${typedPct != null ? `<span class="tag">Words: ${words}</span>` : ''}
          ${typedPct != null ? `<span class="tag">Distinct words: ${distinctWords}</span>` : ''}
        </div>
      </div>
      ${typedPct != null ? `
        <div class="grammar-box">
          <h3>✅ Text-grade rubric (typed transcript)</h3>
          <ul style="margin-left:20px;line-height:1.9">${textRubric.map(r => `<li>${r.pass ? '✅' : '⬜'} ${r.label}</li>`).join('')}</ul>
          <div class="row" style="margin-top:6px;flex-wrap:wrap">
            <span class="tag">Position phrases: ${positionHits}</span>
            <span class="tag">Connectors: ${connectorHits}</span>
            <span class="tag">Examples: ${exampleHits}</span>
            <span class="tag">Counter-args: ${counterHits}</span>
          </div>
        </div>` : ''}
      ${Support.kitCard('speaking')}
      ${preplyCTA(t.title)}`;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  // ---- Shared helpers (inline) ----

  function attachRecorder(panel, { maxSeconds, timerFormatter, onComplete }) {
    const btn = panel.querySelector('#rec-btn');
    const timerEl = panel.querySelector('#rec-timer');
    const status = panel.querySelector('#rec-status');
    const resultEl = panel.querySelector('#rec-result');
    const fmt = timerFormatter || ((s) => s + 's');
    let secLeft = maxSeconds;
    timerEl.textContent = fmt(secLeft);

    if (!Record.supported()) {
      status.textContent = 'Audio recording not supported in this browser. Try Chrome, Edge, Brave, Safari, or Firefox.';
      btn.disabled = true;
      return;
    }

    let rec = null;
    let timer = null;
    let stopping = false;

    async function start() {
      const oldAudio = resultEl.querySelector('audio');
      if (oldAudio) { try { oldAudio.pause(); } catch {} }
      btn.disabled = true;
      status.textContent = 'Asking for microphone…';
      try {
        rec = await Record.create();
      } catch (e) {
        status.textContent = e.message || 'Could not access microphone.';
        btn.disabled = false;
        return;
      }
      rec.start();
      btn.disabled = false;
      btn.classList.add('listening');
      btn.textContent = '⏹';
      btn.title = 'Stop recording';
      status.innerHTML = '🎤 <b>Recording…</b> press the square when done.';
      timer = setInterval(() => {
        secLeft--;
        timerEl.textContent = fmt(secLeft);
        if (secLeft <= 0) stop();
      }, 1000);
    }

    async function stop() {
      if (stopping || !rec) return;
      stopping = true;
      if (timer) { clearInterval(timer); timer = null; }
      btn.disabled = true;
      btn.classList.remove('listening');
      status.textContent = 'Saving recording…';
      let out;
      try {
        out = await rec.stop();
      } catch (e) {
        status.textContent = 'Recording failed: ' + (e.message || 'unknown error');
        btn.disabled = false;
        stopping = false;
        return;
      }
      btn.textContent = '🎙️';
      btn.title = 'Record again';
      btn.disabled = false;
      stopping = false;
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = out.url;
      audio.style.cssText = 'width:100%;max-width:480px;margin-top:8px';
      resultEl.innerHTML = '';
      resultEl.appendChild(audio);
      status.innerHTML = '✓ Recorded. <b>Play it back.</b> Press the mic for another take.';
      onComplete && onComplete(out);
    }

    btn.onclick = () => {
      if (btn.classList.contains('listening')) stop();
      else {
        secLeft = maxSeconds;
        timerEl.textContent = fmt(secLeft);
        start();
      }
    };
  }

  function attachRubric(panel, { items, typebackPlaceholder, onGrade }) {
    panel.innerHTML = `
      <div class="grammar-box">
        <h3>Self-rate (honest)</h3>
        <p style="color:var(--mute);font-size:13px;margin-bottom:10px">After listening back, check what's true.</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${items.map((label, i) => `
            <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;line-height:1.5">
              <input type="checkbox" data-rub="${i}" style="margin-top:4px;flex-shrink:0" />
              <span>${label}</span>
            </label>`).join('')}
        </div>
      </div>
      <div class="grammar-box" style="border-left-color:var(--bleu)">
        <h3>Type what you actually said <span class="tag" style="background:rgba(0,85,164,.12);color:var(--bleu)">Optional</span></h3>
        <p style="color:var(--mute);font-size:13px;margin-bottom:10px">Play your recording and write it out. The text-grader scores position, connectors, examples, and counter-arguments — work the structure even when the audio is messy.</p>
        <textarea id="typeback" rows="10" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink);font-family:inherit;font-size:15px;line-height:1.5" placeholder="${typebackPlaceholder || ''}"></textarea>
      </div>
      <div class="center" style="margin-top:16px">
        <button class="btn primary big" id="grade-final">📊 Grade my session</button>
      </div>
    `;
    panel.querySelector('#grade-final').onclick = () => {
      const rubricHits = Array.from(panel.querySelectorAll('input[data-rub]'))
        .filter(c => c.checked)
        .map(c => parseInt(c.dataset.rub, 10));
      const typedText = panel.querySelector('#typeback').value || '';
      onGrade({ rubricHits, typedText });
    };
  }

  function preplyCTA(taskTitle) {
    const safeTitle = Chrome.escapeHTML(taskTitle || '');
    return `
      <div class="grammar-box" style="border-left-color:var(--accent);margin-top:14px">
        <h3>🎯 Want a native grader on this exact task?</h3>
        <p>Self-rating builds the muscle. The other half is hearing a native speaker react — which arguments landed, where you sounded uncertain, what to fix. <b>New Preply learners get 50% off their first lesson.</b></p>
        <p style="margin-top:8px;color:var(--mute);font-size:13px">Paste this in the tutor chat: <i>"${safeTitle}"</i></p>
        <div class="row" style="justify-content:center;margin-top:10px">
          <a class="btn primary" href="${PREPLY}" target="_blank" rel="sponsored noopener">Get 50% off a tutor<span class="arr">→</span></a>
        </div>
        <p style="color:var(--mute);font-size:12px;text-align:center;margin-top:8px">Affiliate link — booking through it helps keep this site free.</p>
      </div>`;
  }

  return {
    render(container, params) {
      if (params && params.id) renderTask(container, params.id);
      else renderList(container);
    }
  };
})();
