// TCF EO Task 2 — Ask the examiner questions to gather information.
//
// Replaced the old browser-SpeechRecognition flow (which silently failed in
// Brave and mis-transcribed non-native French in Chrome) with a local
// MediaRecorder + self-rubric + optional type-back flow. The question-pattern
// detector still runs — but on the typed transcript, not on a SR guess.
window.SpeakTask2Module = (function () {

  const PREPLY = 'https://preply.sjv.io/c/7425774/1987575/24422';

  const RUBRIC = [
    'I asked at least 6 different questions',
    'I used at least 2 different question structures (est-ce que / inversion / où-quand-comment / quel)',
    'I touched all the info areas in the scenario',
    'I used the polite "vous" form throughout',
    'I kept speaking and finished within the time',
  ];

  function renderList(container) {
    const tasks = window.SPEAK_TASK2;
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>🗣️ Speaking Task 2 — Ask Questions</h1>
        <p>Unique to TCF Canada. Given a scenario, you must <b>ask questions</b> to gather information. This is the task most candidates fail because it's never practised.</p>
      </div>
      <div class="grammar-box">
        <h3>📋 What TCF EO Task 2 expects</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Ask 6-8 different questions in 3-4 minutes</li>
          <li>Use varied question structures: <code>est-ce que</code>, inversion (<code>Avez-vous?</code>), interrogative words (<code>où, quand, combien, comment, pourquoi, quel(le)</code>)</li>
          <li>Address ALL the information areas listed in the scenario</li>
          <li>Polite register: vous form for strangers/professionals</li>
        </ul>
      </div>
      <div class="grammar-box" style="border-left-color:var(--accent)">
        <h3>How this task runs now</h3>
        <p>Record yourself for the full time. Listen back. Self-rate, then optionally type out the questions you asked so the keyword grader can score structure and coverage. Nothing uploads — the audio stays on this device.</p>
      </div>
      <div class="grid" id="t2-grid"></div>`;
    const grid = container.querySelector('#t2-grid');
    for (const k of Object.keys(tasks)) {
      const t = tasks[k];
      const done = App.state.lessons[`st2:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">❓</div>
        <h3>${Chrome.escapeHTML(t.title)}</h3>
        <p><span class="tag">${Chrome.escapeHTML(t.level)}</span>${done ? ' <span class="tag" style="color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px;font-size:13px;color:var(--mute)">${t.requiredInfo.length} info areas to ask about</p>`;
      card.onclick = () => App.go('speaktask2', { id: k });
      grid.appendChild(card);
    }
  }

  function renderTask(container, id) {
    const t = window.SPEAK_TASK2[id];
    if (!t) { App.go('speaktask2'); return; }

    container.innerHTML = `
      <div class="lesson">
        <h2>❓ ${Chrome.escapeHTML(t.title)} <span class="tag">${Chrome.escapeHTML(t.level)}</span></h2>
        <div class="grammar-box" style="border-left-color:var(--warn)">
          <h3>📋 Scenario</h3>
          <p>${Chrome.escapeHTML(t.scenario)}</p>
          ${Chrome.gloss(t.scenarioEn)}
        </div>
        <div class="grammar-box">
          <h3>📊 Topics you must ask about</h3>
          <ul style="margin-left:20px;line-height:1.8">
            ${t.requiredInfo.map(info => `<li>${Chrome.escapeHTML(info)}</li>`).join('')}
          </ul>
          <p style="margin-top:8px;color:var(--mute);font-size:13px">Hit all of these for full marks. Vary your question structures.</p>
        </div>

        <div class="grammar-box" id="rec-panel">
          <h3>Step 1 — Record yourself for the full time</h3>
          <p style="color:var(--mute);font-size:13px;margin-bottom:14px">Stays on your device. Press the mic to start.</p>
          <div class="center">
            <button class="mic-btn" id="rec-btn" title="Press to record" aria-label="Start recording">🎙️</button>
            <p style="font-family:'Fredoka',sans-serif;font-size:32px;color:var(--bleu);margin-top:10px" id="rec-timer" aria-live="polite">${formatTime(t.targetTime)}</p>
            <p id="rec-status" style="color:var(--mute);margin-top:4px;font-size:14px;max-width:500px;margin-left:auto;margin-right:auto" aria-live="polite">Press the mic to start asking your questions in French.</p>
            <div id="rec-result" style="margin-top:14px"></div>
          </div>
        </div>

        <div class="grammar-box" id="model-panel" style="display:none;border-left-color:var(--bleu)">
          <h3>Step 2 — Steal from the samples</h3>
          <p style="color:var(--mute);font-size:13px;margin-bottom:10px">After your take, study these question shapes:</p>
          <ul style="margin-left:20px;line-height:1.9">${t.sampleQuestions.map(q => `<li><b>${Chrome.escapeHTML(q)}</b></li>`).join('')}</ul>
        </div>

        <div id="rate-panel" style="display:none"></div>
        <div id="st2-report"></div>

        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('speaktask2')">← Tasks</button>
        </div>
      </div>`;

    let rubricMounted = false;
    attachRecorder(container.querySelector('#rec-panel'), {
      maxSeconds: t.targetTime || 180,
      timerFormatter: formatTime,
      onComplete: () => {
        container.querySelector('#model-panel').style.display = '';
        // Stale grade no longer matches the current take.
        const report = container.querySelector('#st2-report');
        if (report) report.innerHTML = '';
        const ratePanel = container.querySelector('#rate-panel');
        ratePanel.style.display = '';
        if (rubricMounted) return; // Preserve user's existing checks + typed text.
        rubricMounted = true;
        attachRubric(ratePanel, {
          items: RUBRIC,
          typebackPlaceholder: 'Type the questions you asked, one per line. e.g.\nBonjour, est-ce que vous avez...?\nÀ quelle heure ouvrez-vous?',
          onGrade: ({ rubricHits, typedText }) => grade(container, t, id, rubricHits, typedText),
        });
      },
    });
  }

  function grade(container, t, id, rubricHits, typedText) {
    const text = (typedText || '').trim();
    const lower = text.toLowerCase();
    const sentences = text.split(/[.?!]+/).filter(s => s.trim().length > 0);
    const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;

    const qPatterns = {
      'est-ce que': /\best[- ]ce qu[e']/i.test(text),
      'inversion (Verb-Subject)': /\b(avez|êtes|pouvez|voulez|allez|faites|donnez|dites|connaissez|savez|aimez|trouvez|combien|où|quand|pourquoi|comment|quel|quelle)[- ](vous|tu|il|elle|on|nous|ils|elles)\b/i.test(text),
      'où / quand / pourquoi / comment / combien': /\b(où|quand|pourquoi|comment|combien)\b/i.test(text),
      'quel / quelle / quels / quelles': /\b(quel|quelle|quels|quelles)\b/i.test(text),
      'qu\'est-ce que / qui est-ce que': /\bqu['e]?\s*est[- ]ce qu[e']/i.test(text),
      'rising intonation (vous/tu + verb + ?)': sentences.some(s => /\b(vous|tu)\b/i.test(s) && !/\bavez-vous|êtes-vous\b/i.test(s)),
    };
    const distinctQStructures = Object.values(qPatterns).filter(Boolean).length;
    const totalQuestions = (text.match(/\?/g) || []).length + sentences.filter(s => /^(est-ce que|quel|où|quand|comment|pourquoi|combien|qu'est-ce|qui|avez|êtes|pouvez|voulez|allez|faites)/i.test(s.trim())).length;
    const actualQs = Math.max(totalQuestions, sentences.length);

    const infoMatched = t.requiredInfo.filter(info => {
      const key = info.toLowerCase().split('(')[0].trim();
      const keywords = key.split(' ').filter(w => w.length > 3);
      return keywords.some(kw => lower.includes(kw));
    });

    const rubricPct = Math.round((rubricHits.length / RUBRIC.length) * 100);

    let typedPct = null;
    if (text.length > 30) {
      const qStructScore = Math.round((distinctQStructures / 6) * 25);
      const qCountScore = Math.min(25, Math.round((actualQs / 6) * 25));
      const infoScore = Math.round((infoMatched.length / t.requiredInfo.length) * 35);
      const lengthScore = Math.min(15, Math.round((words / 80) * 15));
      typedPct = Math.min(100, qStructScore + qCountScore + infoScore + lengthScore);
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

    if (total >= 65) App.markLessonDone(`st2:${id}`);

    const passColor = tcfScore >= 7 ? 'var(--good)' : 'var(--warn)';
    const passBg = tcfScore >= 7 ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)';

    container.querySelector('#st2-report').innerHTML = `
      <div class="grammar-box" style="background:${passBg};border-left-color:${passColor};margin-top:14px">
        <h3>📊 TCF EO Task 2 estimated: ${tcfScore}/20 · CLB ${clb}</h3>
        <p>Overall: <b>${total}/100</b></p>
        <div class="row" style="margin-top:8px;flex-wrap:wrap">
          <span class="tag">Self-rubric: ${rubricHits.length}/${RUBRIC.length}</span>
          ${typedPct != null ? `<span class="tag">Typed questions: ${typedPct}/100</span>` : '<span class="tag" style="color:var(--mute)">No typed transcript</span>'}
          ${typedPct != null ? `<span class="tag">Questions counted: ~${actualQs}</span>` : ''}
          ${typedPct != null ? `<span class="tag">Distinct Q-types: ${distinctQStructures}/6</span>` : ''}
          ${typedPct != null ? `<span class="tag">Info areas: ${infoMatched.length}/${t.requiredInfo.length}</span>` : ''}
        </div>
      </div>
      ${typedPct != null ? `
        <div class="grammar-box">
          <h3>✅ Topics covered in your typed transcript</h3>
          <ul style="margin-left:20px;line-height:1.8">
            ${t.requiredInfo.map(info => `<li>${infoMatched.includes(info) ? '✅' : '⬜'} ${Chrome.escapeHTML(info)}</li>`).join('')}
          </ul>
        </div>` : ''}
      ${preplyCTA(t.title)}`;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  // ---- Shared helpers (kept inline to avoid a new module for two callers) ----

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
        <p style="color:var(--mute);font-size:13px;margin-bottom:10px">Play your recording and write it out. This is where the real growth happens — the gap between what you meant to say and what came out.</p>
        <textarea id="typeback" rows="8" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink);font-family:inherit;font-size:15px;line-height:1.5" placeholder="${typebackPlaceholder || ''}"></textarea>
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
        <p>Self-rating builds the muscle. The other half is hearing a native speaker react — which words landed, where you hesitated, what to fix. <b>New Preply learners get 50% off their first lesson.</b></p>
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
