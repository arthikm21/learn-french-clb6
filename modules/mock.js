// Mock test orchestrator. Times each section, collects scores, produces CLB band report.
window.MockModule = (function () {
  let session = null;

  function startSession() {
    session = {
      startTime: Date.now(),
      sectionIdx: 0,
      results: { listen: null, read: null, write: null, speak: null },
    };
    return session;
  }

  function render(container) {
    if (!session) return renderIntro(container);
    const sec = MOCK_TEST.sections[session.sectionIdx];
    if (!sec) return renderReport(container);
    return renderSection(container, sec);
  }

  function renderIntro(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Mock Test'] })}
      <section class="hero accent">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h" style="color:rgba(255,255,255,.7)">CLB 6 Mock Test</p>
        <h1>${MOCK_TEST.title.replace(/^🎯\s*/, '')}</h1>
        <p style="margin-top:var(--sp-4)">${MOCK_TEST.subtitle}</p>
      </section>
      <div class="grammar-box">
        <h3>📋 What to expect</h3>
        <ol style="margin-left:20px;line-height:1.9">
          <li><b>🎧 Listening</b> — 25 min. 3 dialogues, multi-choice questions.</li>
          <li><b>📖 Reading</b> — 25 min. 3 texts (CLB 4 to CLB 6), comprehension questions.</li>
          <li><b>✍️ Writing</b> — 25 min. Formal email task, ~100 words.</li>
          <li><b>🎙️ Speaking</b> — 15 min. Picture description + role-play.</li>
        </ol>
        <p style="margin-top:10px"><b>Total: ~90 minutes.</b> Don't pause mid-section — simulate exam conditions. You can quit any time but progress within a section is lost.</p>
      </div>
      <div class="grammar-box" style="border-left-color:var(--warn)">
        <h3>⚠️ Before you start</h3>
        <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
          <li>Find a quiet 90-minute window.</li>
          <li>Have water + paper for notes.</li>
          <li>Use headphones for listening if possible.</li>
          <li>Allow microphone access when prompted (Speaking).</li>
        </ul>
      </div>
      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" id="start-mock" style="padding:16px 32px;font-size:var(--fs-17)">Begin Mock Test<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('home')">Maybe later</button>
      </div>`;
    container.querySelector('#start-mock').onclick = () => {
      if (!confirm('Begin the CLB 6 Mock Test? Allow ~90 minutes.')) return;
      startSession();
      App.go('mock');
    };
  }

  function renderSection(container, sec) {
    const elapsedSec = Math.floor((Date.now() - session.startTime) / 1000);
    const sectionStart = Date.now();
    let timeLeft = sec.duration;
    let timerInterval = null;

    container.innerHTML = `
      <section class="hero accent">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h" style="color:rgba(255,255,255,.7)">Mock Test · Section ${session.sectionIdx + 1} of ${MOCK_TEST.sections.length}</p>
        <h1>${sec.icon} ${sec.title}</h1>
        <p style="margin-top:var(--sp-4)">${sec.desc}</p>
        <div style="margin-top:var(--sp-4);display:flex;gap:var(--sp-4);font-size:var(--fs-22);font-weight:var(--fw-bold);font-variant-numeric:tabular-nums">⏱ <b id="mock-timer">${formatTime(timeLeft)}</b></div>
      </section>
      <div id="mock-body"></div>
      <div class="row" style="justify-content:center;margin-top:var(--sp-5);gap:var(--sp-3)">
        <button class="btn primary big" id="finish-section">Finish ${sec.title}</button>
        <button class="btn ghost" id="abort">Abort mock test</button>
      </div>`;

    // Render section-specific content
    const body = container.querySelector('#mock-body');
    let sectionData = {};

    if (sec.id === 'listen') {
      sectionData = renderListenSection(body, sec);
    } else if (sec.id === 'read') {
      sectionData = renderReadSection(body, sec);
    } else if (sec.id === 'write') {
      sectionData = renderWriteSection(body, sec);
    } else if (sec.id === 'speak') {
      sectionData = renderSpeakSection(body, sec);
    }

    timerInterval = setInterval(() => {
      timeLeft--;
      const el = container.querySelector('#mock-timer');
      if (el) el.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) { clearInterval(timerInterval); finishSection(); }
    }, 1000);

    function finishSection() {
      if (timerInterval) clearInterval(timerInterval);
      const result = sectionData.collect ? sectionData.collect() : { score: 0 };
      result.timeSpent = Math.floor((Date.now() - sectionStart) / 1000);
      session.results[sec.id] = result;
      session.sectionIdx++;
      Toast.good(`${sec.title} done. Moving on…`);
      App.go('mock');
    }
    container.querySelector('#finish-section').onclick = finishSection;
    container.querySelector('#abort').onclick = () => {
      if (confirm('Abort the mock test? Your progress will be lost.')) {
        if (timerInterval) clearInterval(timerInterval);
        session = null;
        App.go('mock');
      }
    };
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  // ---------- Listening section (TCF mode: single-play, no transcript) ----------
  function renderListenSection(body, sec) {
    // Build queue: dialogues first, then TCF segments
    const queue = [];
    for (const id of (sec.dialogueIds || [])) queue.push({ kind: 'dialogue', id });
    for (const id of (sec.tcfSegmentIds || [])) queue.push({ kind: 'tcf', id });
    let dlgIdx = 0;
    const totalDialogues = queue.length;
    const answers = {};
    function showDialogue() {
      if (dlgIdx >= totalDialogues) {
        body.innerHTML = `<div class="grammar-box" style="border-left-color:var(--good)"><h3>✓ Listening section complete</h3><p>Click "Finish ${sec.title} section" to proceed.</p></div>`;
        return;
      }
      const item = queue[dlgIdx];
      const id = item.id;
      // Unify: get title, level, lines (or synthesized from transcript), questions
      let d;
      if (item.kind === 'dialogue') {
        d = DIALOGUES[id];
      } else {
        const seg = LISTENING_TCF[id];
        if (!seg) { dlgIdx++; showDialogue(); return; }
        // Wrap transcript as single narrator line
        d = {
          title: seg.title,
          level: seg.level,
          intro: 'Section ' + seg.section + ' · listen once',
          lines: [{ speaker: 'NARR', text: seg.transcript, voice: 'sylvie' }],
          questions: seg.questions,
        };
      }
      let hasPlayed = false;
      body.innerHTML = `
        <div class="lesson">
          <h2>${dlgIdx + 1}. ${d.title} <span class="tag">${d.level}</span> <span class="tag" style="background:var(--rouge);color:white">🎯 single play</span></h2>
          <p style="color:var(--mute);font-style:italic;margin-bottom:14px">${d.intro}</p>
          <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
            <button class="btn big" id="play-dlg">▶ Play (you have ONE chance)</button>
          </div>
          <p style="text-align:center;color:var(--mute);font-size:13px;margin-top:8px">⚠️ TCF mode: audio plays once. Listen carefully. Questions appear after.</p>
          <div class="spacer"></div>
          <div id="dlg-questions"></div>
          <div class="spacer"></div>
          <div class="center"><button class="btn" id="next-dlg" disabled>Next dialogue →</button></div>
        </div>`;
      const playBtn = body.querySelector('#play-dlg');
      function playOnce() {
        if (hasPlayed) return;
        hasPlayed = true;
        playBtn.disabled = true;
        playBtn.textContent = '🔊 Playing...';
        let playIdx = 0;
        function next() {
          if (playIdx >= d.lines.length) {
            playBtn.textContent = '✓ Audio finished';
            renderQuestions();
            return;
          }
          const line = d.lines[playIdx];
          const voice = line.voice === 'jean' ? 'fr-CA-JeanNeural' : 'fr-CA-SylvieNeural';
          TTS.speakLine(line.text, voice, () => { playIdx++; setTimeout(next, 280); });
        }
        next();
      }
      function renderQuestions() {
        const qContainer = body.querySelector('#dlg-questions');
        qContainer.innerHTML = `
          <h3 style="margin-top:14px">Questions</h3>
          ${d.questions.map((q, i) => `
            <div class="grammar-box">
              <p><b>${i + 1}.</b> ${q.q}</p>
              <div class="options" style="grid-template-columns:1fr;margin-top:8px">
                ${q.opts.map((o, k) => `<label class="option" style="cursor:pointer;text-align:left"><input type="radio" name="q-${dlgIdx}-${i}" value="${k}" style="margin-right:8px">${o}</label>`).join('')}
              </div>
            </div>`).join('')}`;
        body.querySelector('#next-dlg').disabled = false;
      }
      playBtn.onclick = playOnce;
      body.querySelector('#next-dlg').onclick = () => {
        const checked = body.querySelectorAll(`input[type=radio]:checked`);
        const userAnswers = [];
        checked.forEach(c => userAnswers.push({ q: parseInt(c.name.split('-')[2], 10), a: parseInt(c.value, 10) }));
        answers[item.id] = userAnswers;
        dlgIdx++;
        showDialogue();
      };
    }
    showDialogue();
    return {
      collect: () => {
        let correct = 0, total = 0;
        for (const item of queue) {
          const d = item.kind === 'dialogue' ? DIALOGUES[item.id] : LISTENING_TCF[item.id];
          if (!d) continue;
          total += d.questions.length;
          const userAns = answers[item.id] || [];
          for (const a of userAns) {
            if (d.questions[a.q] && d.questions[a.q].a === a.a) correct++;
          }
        }
        return { correct, total, pct: total ? Math.round(correct / total * 100) : 0 };
      },
    };
  }

  // ---------- Reading section ----------
  function renderReadSection(body, sec) {
    let txtIdx = 0;
    const answers = {};
    function showText() {
      if (txtIdx >= sec.textIds.length) {
        body.innerHTML = `<div class="grammar-box" style="border-left-color:var(--good)"><h3>✓ Reading section complete</h3></div>`;
        return;
      }
      const id = sec.textIds[txtIdx];
      const t = READINGS[id];
      body.innerHTML = `
        <div class="lesson">
          <h2>${txtIdx + 1}. ${t.title} <span class="tag">${t.level}</span></h2>
          <div style="border:1px solid var(--line);padding:18px;border-radius:12px;line-height:1.8;white-space:pre-wrap">${t.text}</div>
          <div class="spacer"></div>
          <h3>Questions</h3>
          ${t.questions.map((q, i) => `
            <div class="grammar-box">
              <p><b>${i + 1}.</b> ${q.q}</p>
              <div class="options" style="grid-template-columns:1fr;margin-top:8px">
                ${q.opts.map((o, k) => `<label class="option" style="cursor:pointer;text-align:left"><input type="radio" name="r-${txtIdx}-${i}" value="${k}" style="margin-right:8px">${o}</label>`).join('')}
              </div>
            </div>`).join('')}
          <div class="center"><button class="btn big" id="next-text">Next text →</button></div>
        </div>`;
      body.querySelector('#next-text').onclick = () => {
        const checked = body.querySelectorAll(`input[type=radio]:checked`);
        const userAnswers = [];
        checked.forEach(c => userAnswers.push({ q: parseInt(c.name.split('-')[2], 10), a: parseInt(c.value, 10) }));
        answers[id] = userAnswers;
        txtIdx++; showText();
      };
    }
    showText();
    return {
      collect: () => {
        let correct = 0, total = 0;
        for (const id of sec.textIds) {
          const t = READINGS[id];
          total += t.questions.length;
          const userAns = answers[id] || [];
          for (const a of userAns) {
            if (t.questions[a.q] && t.questions[a.q].a === a.a) correct++;
          }
        }
        return { correct, total, pct: total ? Math.round(correct / total * 100) : 0 };
      },
    };
  }

  // ---------- Writing section (3 tasks: 2 standard + 1 task3 compare-opinions) ----------
  function renderWriteSection(body, sec) {
    let taskIdx = 0;
    const results = [];
    function showTask() {
      if (taskIdx >= sec.writeTasks.length) {
        body.innerHTML = `<div class="grammar-box" style="border-left-color:var(--good)"><h3>✓ Writing section complete</h3></div>`;
        return;
      }
      const wt = sec.writeTasks[taskIdx];
      if (wt.type === 'standard') {
        const w = WRITING[wt.promptId];
        body.innerHTML = `
          <div class="lesson">
            <h2>✍️ ${wt.label}</h2>
            <div class="grammar-box"><h3>📝 Prompt</h3><p>${w.prompt}</p></div>
            <textarea class="input" id="mock-essay" placeholder="Écrivez ici..." style="font-size:16px;min-height:280px"></textarea>
            <div class="row" style="margin-top:8px;color:var(--mute);font-size:13px"><span id="mock-wc">0 words</span></div>
            <div class="spacer"></div>
            <div class="center"><button class="btn big" id="next-wtask">Next writing task →</button></div>
          </div>`;
        const ta = body.querySelector('#mock-essay');
        const wc = body.querySelector('#mock-wc');
        ta.addEventListener('input', () => {
          const n = (ta.value.match(/\b\w+\b/g) || []).length;
          wc.textContent = `${n} words`;
        });
        body.querySelector('#next-wtask').onclick = () => {
          const txt = ta.value;
          const wordCount = (txt.match(/\b\w+\b/g) || []).length;
          const errs = (window.GrammarCheck ? GrammarCheck.check(txt) : []);
          const rubric = (w.checks || []).filter(c => {
            const m = txt.match(c.pattern);
            return c.min ? (m && m.length >= c.min) : !!m;
          }).length;
          const minWords = w.minWords || 50;
          const wScore = Math.min(35, Math.round((wordCount / minWords) * 35));
          const rScore = w.checks && w.checks.length ? Math.round((rubric / w.checks.length) * 45) : 0;
          const ePenalty = Math.min(25, errs.length * 4);
          const score = Math.max(0, Math.min(100, wScore + rScore - ePenalty + 20));
          results.push({ label: wt.label, wordCount, errors: errs.length, score });
          taskIdx++; showTask();
        };
      } else if (wt.type === 'task3') {
        const t3 = WRITE_TASK3[wt.promptId];
        body.innerHTML = `
          <div class="lesson">
            <h2>✍️ ${wt.label}</h2>
            <div class="grammar-box"><h3>Question</h3><p style="font-style:italic">${t3.topic}</p></div>
            <div class="grammar-box" style="border-left-color:var(--bleu)"><h3>👤 ${t3.opinionA.author}</h3><p>${t3.opinionA.text}</p></div>
            <div class="grammar-box" style="border-left-color:var(--rouge)"><h3>👥 ${t3.opinionB.author}</h3><p>${t3.opinionB.text}</p></div>
            <div class="grammar-box" style="border-left-color:var(--warn)"><h3>Task</h3><p>${t3.promptInstructions}</p></div>
            <textarea class="input" id="mock-essay-t3" placeholder="Comparez les deux opinions et donnez la vôtre (~150 mots)..." style="font-size:16px;min-height:280px"></textarea>
            <div class="row" style="margin-top:8px;color:var(--mute);font-size:13px"><span id="mock-wc-t3">0 words</span></div>
            <div class="spacer"></div>
            <div class="center"><button class="btn big" id="next-wtask">Next writing task →</button></div>
          </div>`;
        const ta = body.querySelector('#mock-essay-t3');
        const wc = body.querySelector('#mock-wc-t3');
        ta.addEventListener('input', () => {
          const n = (ta.value.match(/\b\w+\b/g) || []).length;
          wc.textContent = `${n} words`;
        });
        body.querySelector('#next-wtask').onclick = () => {
          const txt = ta.value;
          const wordCount = (txt.match(/\b\w+\b/g) || []).length;
          const errs = (window.GrammarCheck ? GrammarCheck.check(txt) : []);
          // Task 3 rubric checks
          const lower = txt.toLowerCase();
          const checks = [
            /(je pense|à mon avis|selon moi|personnellement|je crois)/i.test(txt),
            /\b(cependant|néanmoins|en revanche|par contre|d'une part|d'autre part|alors que)\b/i.test(txt) ? (txt.match(/\b(cependant|néanmoins|en revanche|par contre|d'une part|d'autre part|alors que)\b/gi) || []).length >= 2 : false,
            /\b(parce que|car|puisque|donc|par conséquent)\b/i.test(txt),
            /\b(par exemple|comme|notamment)\b/i.test(txt),
            wordCount >= 120 && wordCount <= 200,
            (txt.split(/[.!?]+/).filter(s => s.trim()).length) >= 6,
          ];
          const rubricPassed = checks.filter(Boolean).length;
          const score = Math.max(0, Math.min(100, Math.round((rubricPassed / checks.length) * 70) + Math.min(20, Math.round(wordCount / 8)) - Math.min(15, errs.length * 3) + 10));
          results.push({ label: wt.label, wordCount, errors: errs.length, score });
          taskIdx++; showTask();
        };
      }
    }
    showTask();
    return {
      collect: () => {
        if (results.length === 0) return { pct: 0, wordCount: 0, rubric: '0/0', errors: 0 };
        const avg = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
        const totalWords = results.reduce((s, r) => s + r.wordCount, 0);
        const totalErrors = results.reduce((s, r) => s + r.errors, 0);
        return { pct: avg, wordCount: totalWords, rubric: `${results.length}/${sec.writeTasks.length}`, errors: totalErrors, tasks: results };
      },
    };
  }

  // ---------- Speaking section (3 TCF tasks) ----------
  function renderSpeakSection(body, sec) {
    let taskIdx = 0;
    const results = [];
    function showTask() {
      if (taskIdx >= sec.speakTasks.length) {
        body.innerHTML = `<div class="grammar-box" style="border-left-color:var(--good)"><h3>✓ Speaking section complete</h3></div>`;
        return;
      }
      const wt = sec.speakTasks[taskIdx];
      let recordedText = '';
      let recording = false;

      let promptHTML = '';
      let targetWords = 60;
      if (wt.type === 'qa') {
        const t = SPEAK_TASKS[wt.taskId];
        const firstQ = t.questions && t.questions[0] ? t.questions[0].q : t.prompt;
        promptHTML = `<div class="grammar-box"><h3>${wt.label}</h3><p>Introduce yourself, then answer: <i>"${firstQ}"</i></p></div>`;
        targetWords = 60;
      } else if (wt.type === 'task2') {
        const t = SPEAK_TASK2[wt.taskId];
        promptHTML = `
          <div class="grammar-box"><h3>${wt.label}</h3><p>${t.scenario}</p></div>
          <div class="grammar-box" style="background:rgba(0,85,164,.08)"><h3>Ask about:</h3><ul style="margin-left:20px;line-height:1.7">${t.requiredInfo.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
        targetWords = 100;
      } else if (wt.type === 'task3') {
        const t = SPEAK_TASK3[wt.taskId];
        promptHTML = `
          <div class="grammar-box" style="border-left-color:var(--warn)"><h3>${wt.label}</h3><p style="font-weight:600">${t.topic}</p><p style="margin-top:8px">${t.prompt}</p></div>`;
        targetWords = 200;
      }

      body.innerHTML = `
        <div class="lesson">
          ${promptHTML}
          <div class="center">
            <button class="mic-btn" id="m-mic">🎙️</button>
            <p style="color:var(--mute);margin-top:10px" id="m-status">Press mic, then speak.</p>
            <div class="transcript" id="m-trans">—</div>
          </div>
          <div class="center"><button class="btn big" id="next-task" disabled>Next task →</button></div>
        </div>`;
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const mic = body.querySelector('#m-mic');
      const status = body.querySelector('#m-status');
      const trans = body.querySelector('#m-trans');
      const nextBtn = body.querySelector('#next-task');
      if (!SR) { status.textContent = 'Speech recognition not supported.'; mic.disabled = true; nextBtn.disabled = false; }
      const rec = SR ? new SR() : null;
      if (rec) {
        rec.lang = 'fr-CA'; rec.interimResults = true; rec.continuous = true;
        rec.onresult = (e) => {
          let interim = '', finalT = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) finalT += r[0].transcript + ' '; else interim += r[0].transcript;
          }
          if (finalT) recordedText += finalT;
          trans.textContent = (recordedText + interim).trim() || '—';
        };
      }
      mic.onclick = () => {
        if (recording) { recording = false; mic.classList.remove('listening'); try { rec && rec.stop(); } catch {}; nextBtn.disabled = false; return; }
        recording = true; recordedText = ''; mic.classList.add('listening');
        try { rec && rec.start(); } catch {}
      };
      nextBtn.onclick = () => {
        results.push({ taskType: wt.type, transcript: recordedText, targetWords });
        taskIdx++; showTask();
      };
    }
    showTask();
    return {
      collect: () => {
        let totalWords = 0, totalTarget = 0;
        for (const r of results) {
          totalWords += (r.transcript.match(/\b\w+\b/g) || []).length;
          totalTarget += r.targetWords;
        }
        const pct = totalTarget ? Math.min(100, Math.round(totalWords / totalTarget * 100)) : 0;
        return { results, totalWords, pct };
      },
    };
  }

  // TCF Canada → CLB conversion (official IRCC bands)
  // CO/CE: 0-699 scale, calibrated for progressive-difficulty MC
  function tcfCOCE(pct) {
    let score;
    if (pct >= 90) score = 580 + Math.round((pct - 90) * 10);
    else if (pct >= 75) score = 475 + Math.round((pct - 75) * 7);
    else if (pct >= 65) score = 425 + Math.round((pct - 65) * 5);
    else if (pct >= 50) score = 360 + Math.round((pct - 50) * 4.3);
    else score = 200 + Math.round(pct * 3.2);
    score = Math.max(0, Math.min(699, score));
    return { score, clb: clbForCOCE(score) };
  }
  function clbForCOCE(s) {
    if (s >= 549) return '10';
    if (s >= 523) return '9';
    if (s >= 503) return '8';
    if (s >= 458) return '7';
    if (s >= 398) return '6';
    if (s >= 369) return '5';
    if (s >= 331) return '4';
    return '<4';
  }
  // EE/EO: 0-20 scale per IRCC
  function tcfEEEO(pct) {
    const score = Math.max(0, Math.min(20, Math.round((pct / 100) * 20)));
    return { score, clb: clbForEEEO(score) };
  }
  function clbForEEEO(s) {
    if (s >= 16) return '10';
    if (s >= 14) return '9';
    if (s >= 12) return '8';
    if (s >= 10) return '7';
    if (s >= 7) return '6';
    if (s >= 6) return '5';
    if (s >= 4) return '4';
    return '<4';
  }
  function clbGoodEnough(clb) {
    // CLB 6+ is the target
    const n = parseInt(clb, 10);
    return !isNaN(n) && n >= 6;
  }

  // Persist last mock result for history (Sprint 3 chart)
  function saveMockHistory(skills) {
    try {
      const history = JSON.parse(window.Storage.getItem('mockHistory') || '[]');
      history.push({ when: Date.now(), skills });
      if (history.length > 30) history.shift();
      window.Storage.setItem('mockHistory', JSON.stringify(history));
    } catch {}
  }

  // ---------- Report ----------
  function renderReport(container) {
    const r = session.results;
    const skills = [
      { id: 'listen', icon: '🎧', label: 'Compréhension orale (CO)', conv: tcfCOCE, scale: '0-699' },
      { id: 'read',   icon: '📖', label: 'Compréhension écrite (CE)', conv: tcfCOCE, scale: '0-699' },
      { id: 'write',  icon: '✍️', label: 'Expression écrite (EE)', conv: tcfEEEO, scale: '0-20' },
      { id: 'speak',  icon: '🎙️', label: 'Expression orale (EO)', conv: tcfEEEO, scale: '0-20' },
    ];
    const totalMin = Math.floor((Date.now() - session.startTime) / 60000);

    // Compute scores
    const scored = skills.map(s => {
      const sr = r[s.id];
      if (!sr) return { ...s, missing: true };
      const c = s.conv(sr.pct);
      return { ...s, sr, score: c.score, clb: c.clb, good: clbGoodEnough(c.clb) };
    });
    // Save to history for Sprint 3
    saveMockHistory(scored.filter(s => !s.missing).map(s => ({ skill: s.id, score: s.score, clb: s.clb, pct: s.sr.pct })));

    // Overall CLB (min of 4 skills)
    const completed = scored.filter(s => !s.missing);
    const minClb = completed.length === 4
      ? completed.reduce((min, s) => {
          const n = parseInt(s.clb, 10);
          if (isNaN(n)) return min;
          return Math.min(min, n);
        }, 10)
      : null;
    const overallPass = minClb !== null && minClb >= 6;

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Mock Test', 'Report'] })}
      <section class="hero accent">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h" style="color:rgba(255,255,255,.7)">TCF Canada Mock Report</p>
        <h1>${overallPass ? 'CLB 6 reached.' : minClb !== null ? 'Below CLB 6.' : 'Incomplete.'}</h1>
        <p style="margin-top:var(--sp-4)">Completed in ${totalMin} minutes. ${minClb !== null ? `Overall CLB: <b>${minClb}</b> (minimum across 4 skills).` : 'Some sections not completed.'}</p>
        ${overallPass ? '<p style="margin-top:var(--sp-3);font-size:var(--fs-19);font-weight:var(--fw-bold)">🏆 You meet CLB 6 in all 4 skills.</p>' : minClb !== null ? '<p style="margin-top:var(--sp-3);font-size:var(--fs-17)">Below CLB 6 in at least one skill. See breakdown below.</p>' : ''}
      </section>
      ${scored.map(s => {
        if (s.missing) return `<div class="grammar-box"><h3>${s.icon} ${s.label}</h3><p style="color:var(--mute)">Not completed.</p></div>`;
        const bg = s.good ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)';
        const bc = s.good ? 'var(--good)' : 'var(--warn)';
        return `
          <div class="grammar-box" style="background:${bg};border-left-color:${bc}">
            <div class="row" style="justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
              <div>
                <h3>${s.icon} ${s.label}</h3>
                <p style="margin-top:4px"><b>TCF score: ${s.score}</b> / ${s.scale} · estimated <b>CLB ${s.clb}</b></p>
              </div>
              <span class="tag" style="background:${bc};color:white;font-size:14px;padding:6px 12px">${s.good ? '✓ CLB 6+' : 'Below CLB 6'}</span>
            </div>
            <p style="margin-top:8px;color:var(--mute);font-size:13px">${s.sr.correct !== undefined ? `Raw: ${s.sr.correct}/${s.sr.total} correct (${s.sr.pct}%)` : `Raw: ${s.sr.pct}%`}${s.sr.wordCount !== undefined ? ` · Words: ${s.sr.wordCount}, Rubric: ${s.sr.rubric}, Errors: ${s.sr.errors}` : ''}${s.sr.totalWords !== undefined ? ` · Words spoken: ${s.sr.totalWords}` : ''}</p>
          </div>`;
      }).join('')}
      <div class="grammar-box" style="background:rgba(0,85,164,.08)">
        <h3>📊 What these scores mean (TCF Canada → CLB)</h3>
        <table class="conj-table"><thead><tr><th>CLB</th><th>CO score</th><th>CE score</th><th>EE / EO</th></tr></thead><tbody>
          <tr><td>10</td><td>549+</td><td>549+</td><td>16+</td></tr>
          <tr><td>9</td><td>523-548</td><td>524-548</td><td>14-15</td></tr>
          <tr><td>8</td><td>503-522</td><td>500-523</td><td>12-13</td></tr>
          <tr><td>7</td><td>458-502</td><td>453-499</td><td>10-11</td></tr>
          <tr><td><b>6</b></td><td><b>398-457</b></td><td><b>406-452</b></td><td><b>7-9</b></td></tr>
          <tr><td>5</td><td>369-397</td><td>375-405</td><td>6</td></tr>
          <tr><td>4</td><td>331-368</td><td>342-374</td><td>4-5</td></tr>
        </tbody></table>
        <p style="margin-top:8px;color:var(--mute);font-size:13px">Source: IRCC official equivalency chart (canada.ca). CLB 6 is the threshold for most Express Entry French language points and federal job competitions.</p>
      </div>
      <div class="grammar-box" style="border-left-color:var(--warn)">
        <h3>📝 Caveats</h3>
        <p>The mock uses <b>heuristic scoring</b>. A real TCF Canada exam is graded by certified raters for writing/speaking and machine-graded for listening/reading. Use this score as a directional indicator, not a guaranteed band.</p>
        <p style="margin-top:8px"><b>Below CLB 6 anywhere?</b> Drill that skill's modules. Re-attempt in 2 weeks.</p>
        <p><b>CLB 6+ across all 4?</b> You are likely exam-ready. Buy the official TCF Canada sample paper and rehearse under timed conditions one more time before booking.</p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" id="restart">↻ Take mock test again</button>
        <button class="btn ghost big" onclick="App.go('home')">← Home</button>
      </div>`;
    container.querySelector('#restart').onclick = () => { session = null; App.go('mock'); };
  }

  return {
    render,
    reset() { session = null; },
  };
})();
