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
      <div class="hero" style="background:linear-gradient(135deg,#7c3aed,#0055A4,#EF4135)">
        <div class="flag-stripes"></div>
        <h1>🎯 ${MOCK_TEST.title}</h1>
        <p>${MOCK_TEST.subtitle}</p>
      </div>
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
      <div class="grammar-box" style="background:#fef3c7;border-left-color:var(--warn)">
        <h3>⚠️ Before you start</h3>
        <ul style="margin-left:20px;line-height:1.7">
          <li>Find a quiet 90-minute window.</li>
          <li>Have water + paper for notes.</li>
          <li>Use headphones for listening if possible.</li>
          <li>Allow microphone access when prompted (Speaking).</li>
        </ul>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" id="start-mock" style="padding:16px 32px;font-size:18px">▶ Begin Mock Test</button>
        <button class="btn ghost big" onclick="App.go('home')" style="margin-left:8px">Maybe later</button>
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
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>${sec.icon} ${sec.title} — Mock Test</h1>
        <p>${sec.desc}</p>
        <div style="margin-top:12px;display:flex;gap:12px;font-family:'Fredoka',sans-serif;font-size:24px"><span>⏱ <b id="mock-timer">${formatTime(timeLeft)}</b></span><span>Section ${session.sectionIdx + 1} / ${MOCK_TEST.sections.length}</span></div>
      </div>
      <div id="mock-body"></div>
      <div class="center" style="margin-top:18px">
        <button class="btn" id="finish-section">✓ Finish ${sec.title} section</button>
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

  // ---------- Listening section ----------
  function renderListenSection(body, sec) {
    let dlgIdx = 0;
    const totalDialogues = sec.dialogueIds.length;
    const answers = {};
    function showDialogue() {
      if (dlgIdx >= totalDialogues) {
        body.innerHTML = `<div class="grammar-box" style="background:#dcfce7;border-left-color:var(--good)"><h3>✓ Listening section complete</h3><p>Click "Finish ${sec.title} section" to proceed.</p></div>`;
        return;
      }
      const id = sec.dialogueIds[dlgIdx];
      const d = DIALOGUES[id];
      let playCount = 0;
      let playIdx = 0;
      let stopped = false;
      body.innerHTML = `
        <div class="lesson">
          <h2>${dlgIdx + 1}. ${d.title} <span class="tag">${d.level}</span></h2>
          <p style="color:var(--mute);font-style:italic;margin-bottom:14px">${d.intro}</p>
          <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
            <button class="btn big" id="play-dlg">▶ Play (${sec.replayLimit - playCount} plays left)</button>
          </div>
          <div class="spacer"></div>
          <div id="dlg-questions"></div>
          <div class="spacer"></div>
          <div class="center"><button class="btn" id="next-dlg" disabled>Next dialogue →</button></div>
        </div>`;
      const playBtn = body.querySelector('#play-dlg');
      function playAll() {
        if (playCount >= sec.replayLimit) return;
        playCount++;
        playBtn.disabled = playCount >= sec.replayLimit;
        playBtn.textContent = `▶ Play (${sec.replayLimit - playCount} plays left)`;
        playIdx = 0;
        stopped = false;
        function next() {
          if (stopped || playIdx >= d.lines.length) {
            if (playCount >= sec.replayLimit) {
              renderQuestions();
            }
            return;
          }
          const line = d.lines[playIdx];
          const voice = line.voice === 'jean' ? 'fr-CA-JeanNeural' : 'fr-CA-SylvieNeural';
          TTS.speakLine(line.text, voice, () => { playIdx++; setTimeout(next, 250); });
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
      playBtn.onclick = playAll;
      // Allow questions to appear after first listen
      // Actually show on any play
      const orig = playAll;
      playBtn.onclick = () => { orig(); setTimeout(renderQuestions, 1000); };

      body.querySelector('#next-dlg').onclick = () => {
        // Save answers
        const checked = body.querySelectorAll(`input[type=radio]:checked`);
        const userAnswers = [];
        checked.forEach(c => userAnswers.push({ q: parseInt(c.name.split('-')[2], 10), a: parseInt(c.value, 10) }));
        answers[id] = userAnswers;
        dlgIdx++;
        showDialogue();
      };
    }
    showDialogue();
    return {
      collect: () => {
        let correct = 0, total = 0;
        for (const id of sec.dialogueIds) {
          const d = DIALOGUES[id];
          total += d.questions.length;
          const userAns = answers[id] || [];
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
        body.innerHTML = `<div class="grammar-box" style="background:#dcfce7;border-left-color:var(--good)"><h3>✓ Reading section complete</h3></div>`;
        return;
      }
      const id = sec.textIds[txtIdx];
      const t = READINGS[id];
      body.innerHTML = `
        <div class="lesson">
          <h2>${txtIdx + 1}. ${t.title} <span class="tag">${t.level}</span></h2>
          <div style="background:#fffdf7;border:2px solid #fcd34d;padding:18px;border-radius:12px;line-height:1.8;white-space:pre-wrap">${t.text}</div>
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

  // ---------- Writing section ----------
  function renderWriteSection(body, sec) {
    const w = WRITING[sec.promptId];
    body.innerHTML = `
      <div class="lesson">
        <h2>✍️ ${w.title} <span class="tag">${w.level}</span></h2>
        <div class="grammar-box">
          <h3>📝 Prompt</h3>
          <p>${w.prompt}</p>
        </div>
        <textarea class="input" id="mock-essay" placeholder="Écrivez ici..." style="font-size:16px;min-height:300px"></textarea>
        <div class="row" style="margin-top:8px;color:var(--mute);font-size:13px"><span id="mock-wc">0 words</span></div>
      </div>`;
    const ta = body.querySelector('#mock-essay');
    const wc = body.querySelector('#mock-wc');
    ta.addEventListener('input', () => {
      const n = (ta.value.match(/\b\w+\b/g) || []).length;
      wc.textContent = `${n} words`;
    });
    return {
      collect: () => {
        const txt = ta.value;
        const wordCount = (txt.match(/\b\w+\b/g) || []).length;
        const errs = (window.GrammarCheck ? GrammarCheck.check(txt) : []);
        const rubric = w.checks.filter(c => {
          const m = txt.match(c.pattern);
          return c.min ? (m && m.length >= c.min) : !!m;
        }).length;
        const minWords = w.minWords || 50;
        // Score = blend of word count, rubric, error count
        const wScore = Math.min(35, Math.round((wordCount / minWords) * 35));
        const rScore = Math.round((rubric / w.checks.length) * 50);
        const ePenalty = Math.min(25, errs.length * 4);
        const score = Math.max(0, Math.min(100, wScore + rScore - ePenalty + 15));
        return { wordCount, rubric: `${rubric}/${w.checks.length}`, errors: errs.length, text: txt, pct: score };
      },
    };
  }

  // ---------- Speaking section ----------
  function renderSpeakSection(body, sec) {
    let taskIdx = 0;
    const results = [];
    function showTask() {
      if (taskIdx >= sec.taskIds.length) {
        body.innerHTML = `<div class="grammar-box" style="background:#dcfce7;border-left-color:var(--good)"><h3>✓ Speaking section complete</h3></div>`;
        return;
      }
      const id = sec.taskIds[taskIdx];
      const t = SPEAK_TASKS[id];
      let recordedText = '';
      let recording = false;
      body.innerHTML = `
        <div class="lesson">
          <h2>${taskIdx + 1}. ${t.title} <span class="tag">${t.level}</span></h2>
          ${t.type === 'picture' ? `
            <div class="grammar-box"><h3>Scene</h3><p><i>${t.sceneDesc}</i></p></div>
            <div class="grammar-box"><h3>Task</h3><p>${t.prompt}</p></div>
          ` : ''}
          ${t.type === 'role' ? `
            <div class="grammar-box"><h3>Scenario</h3><p>${t.scenario}</p></div>
            <div class="grammar-box"><h3>You'll be playing your part. Speak when prompted.</h3><p>${t.turns[0].other}</p></div>
          ` : ''}
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
        results.push({ taskId: id, transcript: recordedText });
        taskIdx++; showTask();
      };
    }
    showTask();
    return {
      collect: () => {
        let totalWords = 0;
        for (const r of results) totalWords += (r.transcript.match(/\b\w+\b/g) || []).length;
        const target = sec.taskIds.length * 50;
        const pct = Math.min(100, Math.round(totalWords / target * 100));
        return { results, totalWords, pct };
      },
    };
  }

  // ---------- Report ----------
  function renderReport(container) {
    const r = session.results;
    // CLB band per skill
    function bandFor(pct) {
      if (pct >= 80) return { band: 'CLB 6+', good: true };
      if (pct >= 65) return { band: 'CLB 5-6', good: true };
      if (pct >= 50) return { band: 'CLB 4', good: false };
      return { band: 'CLB 3 or below', good: false };
    }
    const skills = [
      { id: 'listen', icon: '🎧', label: 'Listening' },
      { id: 'read', icon: '📖', label: 'Reading' },
      { id: 'write', icon: '✍️', label: 'Writing' },
      { id: 'speak', icon: '🎙️', label: 'Speaking' },
    ];
    const totalMin = Math.floor((Date.now() - session.startTime) / 60000);
    container.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,#7c3aed,#0055A4,#16a34a)">
        <div class="flag-stripes"></div>
        <h1>📊 Mock Test Report</h1>
        <p>Completed in ${totalMin} minutes. Below are estimated CLB bands per skill.</p>
      </div>
      ${skills.map(s => {
        const sr = r[s.id];
        if (!sr) return `<div class="grammar-box"><h3>${s.icon} ${s.label}</h3><p>Not completed.</p></div>`;
        const b = bandFor(sr.pct);
        return `
          <div class="grammar-box" style="background:${b.good ? '#dcfce7' : '#fef3c7'};border-left-color:${b.good ? 'var(--good)' : 'var(--warn)'}">
            <h3>${s.icon} ${s.label} — <b>${b.band}</b></h3>
            <p>Score: <b>${sr.pct}%</b>${sr.correct !== undefined ? ` (${sr.correct}/${sr.total})` : ''}</p>
            ${sr.wordCount !== undefined ? `<p>Words: ${sr.wordCount}, Rubric: ${sr.rubric}, Errors: ${sr.errors}</p>` : ''}
            ${sr.totalWords !== undefined ? `<p>Words spoken: ${sr.totalWords}</p>` : ''}
          </div>`;
      }).join('')}
      <div class="grammar-box" style="background:#eff6ff">
        <h3>📝 Notes</h3>
        <p>This mock test uses heuristic scoring. A real TEF Canada exam evaluates pronunciation, fluency, register, and writing accuracy by certified raters. Use this score as a directional guide, not a guaranteed band.</p>
        <p style="margin-top:8px"><b>If you scored CLB 5 or below in any skill:</b> focus on that module's units. Re-attempt this mock in 2 weeks.</p>
        <p><b>If you scored CLB 6+ across all skills:</b> you're likely exam-ready. Practice with the official TEF Canada sample paper for final polish.</p>
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
