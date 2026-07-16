// Speaking Tasks — open-ended speaking practice for CLB 4-6.
//
// The site no longer pretends to auto-grade speech (the browser
// SpeechRecognition API was unreliable for non-native French and outright
// blocked in Brave / Firefox). The flow is now:
//
//   1. Record yourself locally with MediaRecorder (no upload, no Google).
//   2. Listen back. That's the most useful thing a learner can do.
//   3. Hear the model phrasing (neural Canadian voice via TTS).
//   4. Honest self-rubric — 3-5 checkboxes per task type.
//   5. Optional type-back: write down what you actually said. The existing
//      keyword grader scores the typed text — text grading is fine, it was
//      only the speech-to-text step that was broken.
//   6. Hand-off CTA to a real tutor with this exact task in the message.
window.SpeakTasksModule = (function () {

  const PREPLY = 'https://preply.sjv.io/c/7425774/1987575/24422';

  // Rubric checkboxes per task type. These are short, honest yes/no items the
  // learner can judge from their playback alone — no AI needed.
  const RUBRIC = {
    picture: [
      'I described where the scene is set',
      'I said who is in the scene and what they\'re doing',
      'I mentioned the weather or what\'s around them',
      'I used at least one connector (et, mais, parce que, donc)',
      'I kept talking for the full time without long pauses',
    ],
    qa: [
      'I answered the question directly',
      'I gave at least one detail or example',
      'I used a complete sentence (subject + verb + more)',
    ],
    role: [
      'I responded to what the other person actually said',
      'I used a polite register (vous, s\'il vous plaît, merci)',
      'I gave or asked for the info this turn needed',
    ],
  };

  function renderList(container) {
    const tasks = window.SPEAK_TASKS;
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Speaking Practice'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Speaking practice</p>
        <h1>Record. Listen.<br /> Self-rate.</h1>
        <p style="margin-top:var(--sp-4)">Describe scenes. Answer questions. Play roles. Your recording stays on this device — nothing uploads. Built for the TCF / TEF Canada speaking format.</p>
      </section>
      <div class="grammar-box" style="border-left-color:var(--accent)">
        <h3>How this works now</h3>
        <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
          <li><b>Record</b> yourself in French — the mic stays local, no upload.</li>
          <li><b>Listen back.</b> Hearing yourself is where the gains are.</li>
          <li><b>Compare</b> to the model phrasing in a Canadian French neural voice.</li>
          <li><b>Self-rate</b> with a short honest rubric — no fake AI grade.</li>
          <li><b>Type what you said</b> (optional) for a keyword + structure grade.</li>
        </ul>
      </div>
      <div class="grid" id="t-grid"></div>`;
    const grid = container.querySelector('#t-grid');
    const typeIcons = { picture: '🖼️', qa: '❓', role: '🎭' };
    for (const k of Object.keys(tasks)) {
      const t = tasks[k];
      const done = App.state.lessons[`speaktask:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${t.emoji || typeIcons[t.type] || '🎤'}</div>
        <h3>${Chrome.escapeHTML(t.title)}</h3>
        <p><span class="tag">${Chrome.escapeHTML(t.level)}</span> <span class="tag" style="background:rgba(94,92,230,.12);color:var(--accent)">${t.type}</span>${done ? ' <span class="tag" style="color:var(--good)">✓ Done</span>' : ''}</p>`;
      card.onclick = () => App.go('speaktasks', { id: k });
      grid.appendChild(card);
    }
  }

  // Shared helper: attach record/stop wiring to a panel. Fires `onComplete`
  // with `{ url, blob, mimeType, durationMs }` each time a recording ends
  // (user-stopped or timer-stopped). Permission / hardware failures are
  // surfaced inline in #rec-status and onComplete does NOT fire.
  //
  // Required elements inside `panel`:
  //   #rec-btn       — the big record/stop button
  //   #rec-timer     — text node for countdown
  //   #rec-status    — text node for status messages
  //   #rec-result    — empty container; filled with <audio> after stop
  function attachRecorder(panel, { maxSeconds, onComplete }) {
    if (window.Record) Record.stopAll();
    const btn = panel.querySelector('#rec-btn');
    const timerEl = panel.querySelector('#rec-timer');
    const status = panel.querySelector('#rec-status');
    const resultEl = panel.querySelector('#rec-result');
    let secLeft = maxSeconds;
    timerEl.textContent = secLeft + 's';

    if (!Record.supported()) {
      status.textContent = 'Audio recording not supported in this browser. Try Chrome, Edge, Brave, Safari, or Firefox.';
      btn.disabled = true;
      return;
    }

    let rec = null;
    let timer = null;
    let stopping = false;

    async function start() {
      if (rec) { try { rec.cleanup(); } catch {} rec = null; }
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
      status.innerHTML = '🎤 <b>Recording…</b> when you finish, press the square to stop.';
      timer = setInterval(() => {
        secLeft--;
        timerEl.textContent = secLeft + 's';
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
      status.innerHTML = '✓ Recorded. <b>Play it back</b> — hearing yourself is the point. Want another take? Press the mic.';
      onComplete && onComplete(out);
    }

    btn.onclick = () => {
      if (btn.classList.contains('listening')) stop();
      else {
        secLeft = maxSeconds;
        timerEl.textContent = secLeft + 's';
        start();
      }
    };
  }

  // Render the rubric checkboxes + optional type-back textarea + grade button
  // inside `panel`. Calls `onGrade({ rubricHits, typedText })` when the user
  // presses the grade button.
  function attachRubric(panel, { type, onGrade, typebackPlaceholder, typebackEnabled }) {
    const items = RUBRIC[type] || [];
    panel.innerHTML = `
      <div class="grammar-box">
        <h3>Self-rate (honest)</h3>
        <p style="color:var(--mute);font-size:13px;margin-bottom:10px">After listening back, check what's true. The site can't hear you — you can.</p>
        <div class="rubric-list" style="display:flex;flex-direction:column;gap:8px">
          ${items.map((label, i) => `
            <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;line-height:1.5">
              <input type="checkbox" data-rub="${i}" style="margin-top:4px;flex-shrink:0" />
              <span>${label}</span>
            </label>`).join('')}
        </div>
      </div>
      ${typebackEnabled ? `
      <div class="grammar-box" style="border-left-color:var(--bleu)">
        <h3>Type what you actually said <span class="tag" style="background:rgba(0,85,164,.12);color:var(--bleu)">Optional</span></h3>
        <p style="color:var(--mute);font-size:13px;margin-bottom:10px">This is where the real growth happens — the gap between what you meant to say and what came out. Play your recording and write it out word for word.</p>
        <textarea id="typeback" rows="6" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink);font-family:inherit;font-size:15px;line-height:1.5" placeholder="${typebackPlaceholder || 'Tape ce que tu as dit...'}"></textarea>
      </div>` : ''}
      <div class="center" style="margin-top:16px">
        <button class="btn primary big" id="grade-final">📊 Grade my session</button>
      </div>
    `;
    panel.querySelector('#grade-final').onclick = () => {
      const rubricHits = Array.from(panel.querySelectorAll('input[data-rub]'))
        .filter(c => c.checked)
        .map(c => parseInt(c.dataset.rub, 10));
      const typedText = typebackEnabled ? (panel.querySelector('#typeback').value || '') : '';
      onGrade({ rubricHits, typedText });
    };
  }

  function preplyCTA(taskTitle) {
    const safeTitle = Chrome.escapeHTML(taskTitle || '');
    return `
      <div class="grammar-box" style="border-left-color:var(--accent);margin-top:14px">
        <h3>🎯 Want human feedback on this exact task?</h3>
        <p>Recording yourself and self-rating builds the muscle. The other half is hearing a fluent speaker react — which words landed, where you sounded hesitant, and what to fix next. Tutor availability and pricing vary.</p>
        <p style="margin-top:8px;color:var(--mute);font-size:13px">Open the link and paste this in your tutor's chat: <i>"${safeTitle}"</i></p>
        <div class="row" style="justify-content:center;margin-top:10px">
          <a class="btn primary" href="${PREPLY}" target="_blank" rel="sponsored noopener">Browse French tutors<span class="arr">→</span></a>
        </div>
        <p style="color:var(--mute);font-size:12px;text-align:center;margin-top:8px">Affiliate link — booking through it helps keep this site free, at no cost to you.</p>
      </div>`;
  }

  // ---------- Picture description ----------
  function renderPicture(container, t, id) {
    const keywordList = (t.keywords || []).slice(0, 8).map(Chrome.escapeHTML).join(', ');
    container.innerHTML = `
      <div class="lesson">
        <h1>${t.emoji || '🖼️'} ${Chrome.escapeHTML(t.title)} <span class="tag">${Chrome.escapeHTML(t.level)}</span></h1>
        <div class="grammar-box">
          <h3>🖼️ Scene to describe</h3>
          <p><i>${Chrome.escapeHTML(t.sceneDesc)}</i></p>
          <p style="margin-top:10px;color:var(--mute);font-size:14px">(This site uses verbal scene descriptions — a real CLB exam shows you the photo.)</p>
        </div>
        <div class="grammar-box" style="border-left-color:var(--warn)">
          <h3>📋 Task</h3>
          <p>${Chrome.escapeHTML(t.prompt)}</p>
          ${Chrome.gloss(t.promptEn)}
          <p style="margin-top:8px;color:var(--mute);font-size:14px">Target: <b>${t.targetWords}+ words</b> in <b>${t.targetTime} seconds</b>.</p>
        </div>

        <div class="grammar-box" id="rec-panel">
          <h3>Step 1 — Record yourself</h3>
          <p style="color:var(--mute);font-size:13px;margin-bottom:14px">Press the mic, describe the scene in French until the timer runs out. The recording stays on this device.</p>
          <div class="center">
            <button class="mic-btn" id="rec-btn" title="Press to record" aria-label="Start recording">🎙️</button>
            <p role="timer" aria-label="Recording time remaining" style="font-variant-numeric:tabular-nums;font-size:32px;color:var(--bleu);margin-top:10px" id="rec-timer">${t.targetTime}s</p>
            <p id="rec-status" style="color:var(--mute);margin-top:4px;font-size:14px;max-width:500px;margin-left:auto;margin-right:auto" aria-live="polite">Press the mic to start. Your recording stays on this device — nothing uploads.</p>
            <div id="rec-result" style="margin-top:14px"></div>
          </div>
        </div>

        <div class="grammar-box" id="model-panel" style="display:none;border-left-color:var(--bleu)">
          <h3>Step 2 — Words you can borrow</h3>
          <p style="color:var(--mute);font-size:13px;margin-bottom:10px">After your take, see which of these you used (and which you missed).</p>
          <p style="font-style:italic"><b>${keywordList}</b></p>
          <div class="row" style="margin-top:10px;justify-content:center">
            <button class="btn secondary" id="hear-prompt">🔊 Hear the task in French</button>
          </div>
        </div>

        <div id="rate-panel" style="display:none"></div>
        <div id="report"></div>

        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('speaktasks')">← Quit</button>
        </div>
      </div>`;

    container.querySelector('#hear-prompt').onclick = () => TTS.speak(t.prompt, 0.95);

    let rubricMounted = false;
    attachRecorder(container.querySelector('#rec-panel'), {
      maxSeconds: t.targetTime || 60,
      onComplete: () => {
        container.querySelector('#model-panel').style.display = '';
        // Stale grade no longer reflects the current recording.
        container.querySelector('#report').innerHTML = '';
        const ratePanel = container.querySelector('#rate-panel');
        ratePanel.style.display = '';
        if (rubricMounted) return; // Preserve user's existing checks + typed text.
        rubricMounted = true;
        attachRubric(ratePanel, {
          type: 'picture',
          typebackEnabled: true,
          typebackPlaceholder: 'e.g. Sur cette image, on voit un couple dans un parc...',
          onGrade: ({ rubricHits, typedText }) => gradePicture(container, t, id, rubricHits, typedText),
        });
      },
    });
  }

  function gradePicture(container, t, id, rubricHits, typedText) {
    const rubricMax = RUBRIC.picture.length;
    const rubricScore = Math.round((rubricHits.length / rubricMax) * 100);

    const text = (typedText || '').trim();
    const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
    const lower = text.toLowerCase();
    const keywordsHit = (t.keywords || []).filter(kw => lower.includes(kw.toLowerCase()));
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    let typedScore = null;
    let total = rubricScore;
    if (text.length > 20) {
      const wordScore = Math.min(40, Math.round((words / t.targetWords) * 40));
      const keywordScore = Math.min(40, Math.round((keywordsHit.length / Math.min(8, t.keywords.length)) * 40));
      const sentenceScore = Math.min(20, sentences * 3);
      typedScore = Math.min(100, wordScore + keywordScore + sentenceScore);
      total = Math.round((rubricScore + typedScore) / 2);
    }

    App.recordAttempt(`speaktask:${id}`, total, 65, 'speaking-structure-self-check');

    const passColor = total >= 70 ? 'var(--good)' : 'var(--warn)';
    const passBg = total >= 70 ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)';

    container.querySelector('#report').innerHTML = `
      <div class="grammar-box" style="background:${passBg};border-left-color:${passColor};margin-top:14px">
        <h3>📊 Practice structure check: ${total}/100</h3>
        <div class="row" style="margin-top:8px;flex-wrap:wrap">
          <span class="tag">Self-rubric: ${rubricHits.length}/${rubricMax}</span>
          ${typedScore != null ? `<span class="tag">Typed transcript: ${typedScore}/100</span>` : '<span class="tag" style="color:var(--mute)">No typed transcript</span>'}
          ${typedScore != null ? `<span class="tag">Words: ${words}/${t.targetWords}</span>` : ''}
          ${typedScore != null ? `<span class="tag">Keywords: ${keywordsHit.length}/${Math.min(8, t.keywords.length)}</span>` : ''}
        </div>
        ${typedScore != null && keywordsHit.length ? `<p style="margin-top:10px"><b>Keywords found:</b> ${keywordsHit.join(', ')}</p>` : ''}
        ${typedScore != null && keywordsHit.length < 4 ? `<p style="margin-top:6px;color:var(--mute);font-size:14px"><b>Missed expected words:</b> ${t.keywords.filter(k => !keywordsHit.includes(k)).slice(0, 6).join(', ')}</p>` : ''}
        <p style="margin-top:10px;color:var(--mute);font-size:13px">This cannot estimate a TCF or NCLC level. A trained evaluator also considers pronunciation, intonation, hesitation, grammatical accuracy, range, and task fulfilment from the actual recording.</p>
      </div>
      ${preplyCTA(t.title)}`;
  }

  // ---------- Q&A ----------
  function renderQA(container, t, id) {
    let qi = 0;
    const answers = [];

    function show() {
      if (qi >= t.questions.length) return finishQA(container, t, id, answers);
      const q = t.questions[qi];
      container.innerHTML = `
        <div class="lesson">
          <h1>❓ ${Chrome.escapeHTML(t.title)} <span class="tag">${Chrome.escapeHTML(t.level)}</span></h1>
          <div class="progress"><div style="width:${(qi / t.questions.length) * 100}%"></div></div>
          <div class="grammar-box">
            <h3>Question ${qi + 1} of ${t.questions.length}</h3>
            <p style="font-size:18px;line-height:1.5">${Chrome.escapeHTML(q.q)}</p>
            ${Chrome.gloss(q.qEn)}
            <button class="btn secondary" id="hear-q" style="margin-top:10px">🔊 Hear question</button>
            ${q.hint ? `<p style="margin-top:10px;color:var(--mute);font-size:13px"><b>Hint:</b> ${Chrome.escapeHTML(q.hint)}</p>` : ''}
            <p style="color:var(--mute);font-size:13px">Target: ${q.minWords}+ words.</p>
          </div>

          <div class="grammar-box" id="rec-panel">
            <h3>Record your answer</h3>
            <p style="color:var(--mute);font-size:13px;margin-bottom:14px">Press the mic, answer aloud in French. Stays on this device.</p>
            <div class="center">
              <button class="mic-btn" id="rec-btn" title="Press to record" aria-label="Start recording">🎙️</button>
              <p role="timer" aria-label="Recording time remaining" style="font-variant-numeric:tabular-nums;font-size:28px;color:var(--bleu);margin-top:10px" id="rec-timer">30s</p>
              <p id="rec-status" style="color:var(--mute);margin-top:4px;font-size:14px" aria-live="polite">Press the mic to start.</p>
              <div id="rec-result" style="margin-top:14px"></div>
            </div>
          </div>

          <div id="rate-panel" style="display:none"></div>

          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('speaktasks')">← Quit</button>
            <div class="row">
              <button class="btn secondary" id="skip">Skip</button>
              <button class="btn" id="submit-q" disabled>Next question →</button>
            </div>
          </div>
        </div>`;
      container.querySelector('#hear-q').onclick = () => TTS.speak(q.q);
      TTS.speakSoon(q.q, 1.0, 200);

      const submitBtn = container.querySelector('#submit-q');
      const skipBtn = container.querySelector('#skip');
      let lastAnswer = { q: q.q, minWords: q.minWords };
      let rubricMounted = false;

      attachRecorder(container.querySelector('#rec-panel'), {
        maxSeconds: 30,
        onComplete: () => {
          // Once they've recorded something, Skip would discard it on a stray
          // click — disable it so Next is the only way forward.
          skipBtn.disabled = true;
          skipBtn.title = 'Disabled — you have a recording. Press Next to keep it.';
          const ratePanel = container.querySelector('#rate-panel');
          ratePanel.style.display = '';
          submitBtn.disabled = false; // Allow advancing even without rubric.
          if (rubricMounted) return;  // Preserve user's existing checks + typed text on re-record.
          rubricMounted = true;
          attachRubric(ratePanel, {
            type: 'qa',
            typebackEnabled: true,
            typebackPlaceholder: 'Type your answer word-for-word (optional)',
            onGrade: ({ rubricHits, typedText }) => {
              lastAnswer = { q: q.q, minWords: q.minWords, rubricHits, typedText };
              submitBtn.disabled = false;
              submitBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
            },
          });
        },
      });

      submitBtn.onclick = () => {
        // If the user pressed Grade, lastAnswer has rubric/typed data already.
        // If they pressed Next without grading but DID record + check boxes,
        // pull the latest checkbox/textarea state straight from the panel so
        // their work isn't lost.
        if (rubricMounted && !lastAnswer.rubricHits) {
          const ratePanel = container.querySelector('#rate-panel');
          const hits = Array.from(ratePanel.querySelectorAll('input[data-rub]'))
            .filter(c => c.checked)
            .map(c => parseInt(c.dataset.rub, 10));
          const typed = ratePanel.querySelector('#typeback')?.value || '';
          lastAnswer = { q: q.q, minWords: q.minWords, rubricHits: hits, typedText: typed };
        }
        answers.push(lastAnswer);
        qi++; show();
      };
      skipBtn.onclick = () => {
        answers.push({ q: q.q, minWords: q.minWords, skipped: true });
        qi++; show();
      };
    }
    show();
  }

  function finishQA(container, t, id, answers) {
    let rubricTotal = 0, rubricMaxTotal = 0;
    let typedWords = 0, typedTarget = 0;
    answers.forEach(a => {
      if (a.rubricHits) {
        rubricTotal += a.rubricHits.length;
        rubricMaxTotal += RUBRIC.qa.length;
      } else if (!a.skipped) {
        // Recorded but didn't self-rate — count as a half-credit
        rubricTotal += 1;
        rubricMaxTotal += RUBRIC.qa.length;
      } else {
        rubricMaxTotal += RUBRIC.qa.length;
      }
      const t2 = (a.typedText || '').trim();
      if (t2) {
        typedWords += (t2.match(/[\p{L}\p{N}]+/gu) || []).length;
        typedTarget += a.minWords;
      }
    });
    const rubricPct = rubricMaxTotal ? Math.round((rubricTotal / rubricMaxTotal) * 100) : 0;
    const typedPct = typedTarget ? Math.min(100, Math.round((typedWords / typedTarget) * 100)) : null;
    const total = typedPct != null ? Math.round((rubricPct + typedPct) / 2) : rubricPct;
    App.recordAttempt(`speaktask:${id}`, total, 65, 'speaking-structure-self-check');

    container.innerHTML = `
      <div class="lesson">
        <h1>📊 ${Chrome.escapeHTML(t.title)} — Results</h1>
        <div class="grammar-box" style="background:${total >= 70 ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)'};border-left-color:${total >= 70 ? 'var(--good)' : 'var(--warn)'}">
          <h3>Overall: ${total}/100</h3>
          <div class="row" style="margin-top:8px;flex-wrap:wrap">
            <span class="tag">Self-rubric: ${rubricTotal}/${rubricMaxTotal}</span>
            ${typedPct != null ? `<span class="tag">Typed transcripts: ${typedPct}/100</span>` : ''}
            ${typedPct != null ? `<span class="tag">Words typed: ${typedWords} / target ${typedTarget}</span>` : ''}
          </div>
        </div>
        ${answers.map((a, i) => `
          <div class="grammar-box">
            <h3>Q${i + 1}: ${Chrome.escapeHTML(a.q)}</h3>
            ${a.skipped ? '<p><i>Skipped.</i></p>' : ''}
            ${a.rubricHits ? `<p style="color:var(--mute);font-size:13px">Self-rated ${a.rubricHits.length}/${RUBRIC.qa.length}</p>` : ''}
            ${a.typedText ? `<p style="font-style:italic;margin-top:6px">"${Chrome.escapeHTML(a.typedText)}"</p>` : ''}
          </div>`).join('')}
        ${preplyCTA(t.title)}
        <div class="center" style="margin-top:14px">
          <button class="btn big" onclick="App.go('speaktasks')">More tasks</button>
        </div>
      </div>`;
  }

  // ---------- Role-play ----------
  function renderRole(container, t, id) {
    let turnIdx = 0;
    const answers = [];

    function show() {
      if (turnIdx >= t.turns.length) return finishRole(container, t, id, answers);
      const turn = t.turns[turnIdx];
      container.innerHTML = `
        <div class="lesson">
          <h1>🎭 ${Chrome.escapeHTML(t.title)} <span class="tag">${Chrome.escapeHTML(t.level)}</span></h1>
          <div class="progress"><div style="width:${(turnIdx / t.turns.length) * 100}%"></div></div>
          <div class="grammar-box" style="border-left-color:var(--warn)">
            <h3>📋 Scenario</h3>
            <p>${Chrome.escapeHTML(t.scenario)}</p>
          </div>
          <div class="grammar-box">
            <h3>👤 Other person says:</h3>
            <p style="font-size:18px;line-height:1.5;font-variant-numeric:tabular-nums;color:var(--bleu)">"${Chrome.escapeHTML(turn.other)}"</p>
            ${Chrome.gloss(turn.otherEn)}
            <button class="btn secondary" id="hear" style="margin-top:8px">🔊 Hear them</button>
          </div>
          <p style="text-align:center;color:var(--mute)"><b>Your turn.</b> ${turn.hint ? '<br>' + Chrome.escapeHTML(turn.hint) : ''} Target: ${turn.minWords}+ words.</p>

          <div class="grammar-box" id="rec-panel">
            <h3>Record your reply</h3>
            <div class="center">
              <button class="mic-btn" id="rec-btn" title="Press to record" aria-label="Start recording">🎙️</button>
              <p role="timer" aria-label="Recording time remaining" style="font-variant-numeric:tabular-nums;font-size:28px;color:var(--bleu);margin-top:10px" id="rec-timer">25s</p>
              <p id="rec-status" style="color:var(--mute);margin-top:4px;font-size:14px" aria-live="polite">Press the mic to start.</p>
              <div id="rec-result" style="margin-top:14px"></div>
            </div>
          </div>

          <div id="rate-panel" style="display:none"></div>

          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('speaktasks')">← Quit</button>
            <button class="btn" id="next-turn" disabled>Continue →</button>
          </div>
        </div>`;
      container.querySelector('#hear').onclick = () => TTS.speak(turn.other);
      TTS.speakSoon(turn.other, 1.0, 200);

      const nextBtn = container.querySelector('#next-turn');
      let lastTurn = { other: turn.other, minWords: turn.minWords };
      let rubricMounted = false;

      attachRecorder(container.querySelector('#rec-panel'), {
        maxSeconds: 25,
        onComplete: () => {
          const ratePanel = container.querySelector('#rate-panel');
          ratePanel.style.display = '';
          nextBtn.disabled = false;
          if (rubricMounted) return;
          rubricMounted = true;
          attachRubric(ratePanel, {
            type: 'role',
            typebackEnabled: true,
            typebackPlaceholder: 'Type your reply (optional)',
            onGrade: ({ rubricHits, typedText }) => {
              lastTurn = { other: turn.other, minWords: turn.minWords, rubricHits, typedText };
              nextBtn.disabled = false;
              nextBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
            },
          });
        },
      });

      nextBtn.onclick = () => {
        // Pull the latest rubric/typed state even if the user skipped Grade.
        if (rubricMounted && !lastTurn.rubricHits) {
          const ratePanel = container.querySelector('#rate-panel');
          const hits = Array.from(ratePanel.querySelectorAll('input[data-rub]'))
            .filter(c => c.checked)
            .map(c => parseInt(c.dataset.rub, 10));
          const typed = ratePanel.querySelector('#typeback')?.value || '';
          lastTurn = { other: turn.other, minWords: turn.minWords, rubricHits: hits, typedText: typed };
        }
        answers.push(lastTurn);
        turnIdx++; show();
      };
    }
    show();
  }

  function finishRole(container, t, id, answers) {
    let rubricTotal = 0, rubricMaxTotal = 0;
    let typedWords = 0, typedTarget = 0;
    answers.forEach(a => {
      if (a.rubricHits) {
        rubricTotal += a.rubricHits.length;
        rubricMaxTotal += RUBRIC.role.length;
      } else {
        rubricTotal += 1;
        rubricMaxTotal += RUBRIC.role.length;
      }
      const t2 = (a.typedText || '').trim();
      if (t2) {
        typedWords += (t2.match(/[\p{L}\p{N}]+/gu) || []).length;
        typedTarget += a.minWords;
      }
    });
    const rubricPct = rubricMaxTotal ? Math.round((rubricTotal / rubricMaxTotal) * 100) : 0;
    const typedPct = typedTarget ? Math.min(100, Math.round((typedWords / typedTarget) * 100)) : null;
    const total = typedPct != null ? Math.round((rubricPct + typedPct) / 2) : rubricPct;
    App.recordAttempt(`speaktask:${id}`, total, 65, 'speaking-structure-self-check');

    container.innerHTML = `
      <div class="lesson">
        <h1>🎭 ${Chrome.escapeHTML(t.title)} — Complete</h1>
        <div class="grammar-box" style="background:${total >= 70 ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)'};border-left-color:${total >= 70 ? 'var(--good)' : 'var(--warn)'}">
          <h3>Session score: ${total}/100</h3>
          <div class="row" style="margin-top:8px;flex-wrap:wrap">
            <span class="tag">Self-rubric: ${rubricTotal}/${rubricMaxTotal}</span>
            ${typedPct != null ? `<span class="tag">Typed: ${typedPct}/100</span>` : ''}
          </div>
          <p style="margin-top:8px;color:var(--mute);font-size:13px">This is a completeness self-check, not a TCF or NCLC estimate. A trained rater also evaluates fluency, accuracy, pronunciation, range, and appropriate register.</p>
        </div>
        <h3 style="font-variant-numeric:tabular-nums;color:var(--bleu);margin:18px 0 8px">Conversation transcript</h3>
        ${answers.map((a) => `
          <div class="dialogue-line">
            <div class="dl-speaker dl-A">👤 Other</div>
            <div class="dl-text">${Chrome.escapeHTML(a.other)}</div>
          </div>
          <div class="dialogue-line">
            <div class="dl-speaker dl-B">🎤 You</div>
            <div class="dl-text">${a.typedText ? Chrome.escapeHTML(a.typedText) : '<i>(audio recorded — not typed)</i>'}</div>
          </div>`).join('')}
        ${preplyCTA(t.title)}
        <div class="center" style="margin-top:14px"><button class="btn big" onclick="App.go('speaktasks')">More tasks</button></div>
      </div>`;
  }

  // ---------- Router ----------
  return {
    render(container, params) {
      if (params && params.id) {
        const t = window.SPEAK_TASKS[params.id];
        if (!t) { App.go('speaktasks'); return; }
        if (t.type === 'picture') return renderPicture(container, t, params.id);
        if (t.type === 'qa') return renderQA(container, t, params.id);
        if (t.type === 'role') return renderRole(container, t, params.id);
      }
      return renderList(container);
    }
  };
})();
