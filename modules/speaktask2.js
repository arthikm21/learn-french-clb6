// TCF EO Task 2 — Ask the examiner questions.
// User records speech, system detects question structures, counts distinct Q-types.
window.SpeakTask2Module = (function () {

  function renderList(container) {
    const tasks = window.SPEAK_TASK2;
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>🗣️ Speaking Task 2 — Ask Questions</h1>
        <p>Unique to TCF Canada. Given a scenario, you must <b>ask questions</b> to gather information. This is the task most candidates fail because it's never practiced.</p>
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
      <div class="grid" id="t2-grid"></div>`;
    const grid = container.querySelector('#t2-grid');
    for (const k of Object.keys(tasks)) {
      const t = tasks[k];
      const done = App.state.lessons[`st2:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">❓</div>
        <h3>${t.title}</h3>
        <p><span class="tag">${t.level}</span>${done ? ' <span class="tag" style="color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px;font-size:13px;color:var(--mute)">${t.requiredInfo.length} info areas to ask about</p>`;
      card.onclick = () => App.go('speaktask2', { id: k });
      grid.appendChild(card);
    }
  }

  function renderTask(container, id) {
    const t = window.SPEAK_TASK2[id];
    if (!t) { App.go('speaktask2'); return; }
    let recording = false;
    let recordedText = '';
    let timer = null;
    let timeLeft = t.targetTime;

    container.innerHTML = `
      <div class="lesson">
        <h2>❓ ${t.title} <span class="tag">${t.level}</span></h2>
        <div class="grammar-box" style="border-left-color:var(--warn)">
          <h3>📋 Scenario</h3>
          <p>${t.scenario}</p>
        </div>
        <div class="grammar-box">
          <h3>📊 Topics you must ask about</h3>
          <ul style="margin-left:20px;line-height:1.8">
            ${t.requiredInfo.map(info => `<li>${info}</li>`).join('')}
          </ul>
          <p style="margin-top:8px;color:var(--mute);font-size:13px">Hit all of these for full marks. Vary your question structures.</p>
        </div>
        <div class="center">
          <button class="mic-btn" id="st2-mic" title="Press to record">🎙️</button>
          <p style="color:var(--mute);margin-top:10px;font-size:14px" id="st2-status">Press mic and start asking your questions in French.</p>
          <p style="font-family:'Fredoka',sans-serif;font-size:32px;color:var(--bleu)" id="st2-timer">${formatTime(timeLeft)}</p>
          <div class="transcript" id="st2-trans">—</div>
        </div>
        <div id="st2-report"></div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('speaktask2')">← Tasks</button>
          <button class="btn" id="st2-grade" disabled>📊 Grade my answers</button>
        </div>
      </div>`;

    const mic = container.querySelector('#st2-mic');
    const status = container.querySelector('#st2-status');
    const trans = container.querySelector('#st2-trans');
    const timerEl = container.querySelector('#st2-timer');
    const gradeBtn = container.querySelector('#st2-grade');

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      status.textContent = 'Speech recognition not supported. Use Chrome, Edge, or Brave.';
      mic.disabled = true;
      return;
    }
    const rec = new SR();
    rec.lang = 'fr-CA';
    rec.interimResults = true;
    rec.continuous = true;

    function startTimer() {
      timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) stopRec();
      }, 1000);
    }
    function stopRec() {
      recording = false;
      if (timer) { clearInterval(timer); timer = null; }
      try { rec.stop(); } catch {}
      mic.classList.remove('listening');
      status.textContent = 'Recording stopped. Press "Grade my answers".';
      gradeBtn.disabled = false;
    }
    mic.onclick = () => {
      if (recording) { stopRec(); return; }
      recording = true;
      recordedText = '';
      mic.classList.add('listening');
      status.textContent = '🎤 Recording... ask your questions one after another.';
      timeLeft = t.targetTime;
      timerEl.textContent = formatTime(timeLeft);
      try { rec.start(); } catch {}
      startTimer();
    };
    rec.onresult = (e) => {
      let interim = '';
      let finalT = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalT += r[0].transcript + ' ';
        else interim += r[0].transcript;
      }
      if (finalT) recordedText += finalT;
      trans.textContent = (recordedText + interim).trim() || '—';
    };
    rec.onerror = () => { status.textContent = 'No speech detected. Try again.'; };
    rec.onend = () => { if (recording) { try { rec.start(); } catch {} } };

    gradeBtn.onclick = () => grade(container, t, id, recordedText);
  }

  function grade(container, t, id, text) {
    // Count distinct Q-structures
    const sentences = text.split(/[.?!]+/).filter(s => s.trim().length > 0);
    const lower = text.toLowerCase();

    // Detect question types
    const qPatterns = {
      'est-ce que': /\best[- ]ce qu[e']/i,
      'inversion (Verb-Subject)': /\b(avez|êtes|pouvez|voulez|allez|faites|donnez|dites|connaissez|savez|aimez|trouvez|combien|où|quand|pourquoi|comment|quel|quelle)[- ](vous|tu|il|elle|on|nous|ils|elles)\b/i,
      'où / quand / pourquoi / comment': /\b(où|quand|pourquoi|comment|combien)\b/i,
      'quel / quelle / quels / quelles': /\b(quel|quelle|quels|quelles)\b/i,
      'qu\'est-ce que / qui est-ce que': /\bqu['e]?\s*est[- ]ce qu[e']/i,
      'rising intonation (vous/tu + verb + ?)': sentences.filter(s => /\b(vous|tu)\b/i.test(s) && !/\bavez-vous|êtes-vous\b/i.test(s)).length > 0,
    };
    const distinctQStructures = Object.keys(qPatterns).filter(k => qPatterns[k]).length;
    const totalQuestions = (text.match(/\?/g) || []).length + sentences.filter(s => /^(est-ce que|quel|où|quand|comment|pourquoi|combien|qu'est-ce|qui|avez|êtes|pouvez|voulez|allez|faites)/i.test(s.trim())).length;
    const actualQs = Math.max(totalQuestions, sentences.length);

    // Match required info areas
    const infoMatched = t.requiredInfo.filter(info => {
      const key = info.toLowerCase().split('(')[0].trim();
      // Simple heuristic: check if any keyword from the info area appears
      const keywords = key.split(' ').filter(w => w.length > 3);
      return keywords.some(kw => lower.includes(kw));
    });

    // Word count
    const words = (text.match(/\b\w+\b/g) || []).length;

    // Score blend
    const qStructScore = Math.round((distinctQStructures / 6) * 25);
    const qCountScore = Math.min(25, Math.round((actualQs / 6) * 25));
    const infoScore = Math.round((infoMatched.length / t.requiredInfo.length) * 35);
    const lengthScore = Math.min(15, Math.round((words / 80) * 15));
    const total = Math.min(100, qStructScore + qCountScore + infoScore + lengthScore);

    // TCF EO 0-20
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
          <span class="tag">Questions asked: ~${actualQs}</span>
          <span class="tag">Distinct Q-types: ${distinctQStructures}/6</span>
          <span class="tag">Info areas covered: ${infoMatched.length}/${t.requiredInfo.length}</span>
          <span class="tag">Words: ${words}</span>
        </div>
      </div>
      <div class="grammar-box">
        <h3>✅ Topics you covered</h3>
        <ul style="margin-left:20px;line-height:1.8">
          ${t.requiredInfo.map(info => `<li>${infoMatched.includes(info) ? '✅' : '⬜'} ${info}</li>`).join('')}
        </ul>
      </div>
      <div class="grammar-box" style="background:rgba(0,85,164,.08)">
        <h3>📜 Sample questions (study these)</h3>
        <ul style="margin-left:20px;line-height:1.9">${t.sampleQuestions.map(q => `<li><b>${q}</b></li>`).join('')}</ul>
      </div>
      <div class="grammar-box" style="background:var(--surface-2)">
        <h3>💬 Your transcript</h3>
        <p style="font-style:italic">"${text || '<i>no recording</i>'}"</p>
      </div>`;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  return {
    render(container, params) {
      if (params && params.id) renderTask(container, params.id);
      else renderList(container);
    }
  };
})();
