// TCF EO Task 3 — Argumentative monologue.
// User defends an opinion for 3-5 min. Scoring: word count, connector density,
// position phrases, counter-argument acknowledgement, examples.
window.SpeakTask3Module = (function () {

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
      <div class="grid" id="t3-grid"></div>`;
    const grid = container.querySelector('#t3-grid');
    for (const k of Object.keys(tasks)) {
      const t = tasks[k];
      const done = App.state.lessons[`st3:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">🎤</div>
        <h3>${t.title}</h3>
        <p><span class="tag">${t.level}</span>${done ? ' <span class="tag" style="color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px;font-size:13px;color:var(--mute)">${t.topic}</p>`;
      card.onclick = () => App.go('speaktask3', { id: k });
      grid.appendChild(card);
    }
  }

  function renderTask(container, id) {
    const t = window.SPEAK_TASK3[id];
    if (!t) { App.go('speaktask3'); return; }
    let recording = false;
    let recordedText = '';
    let timer = null;
    let timeLeft = t.targetTime;

    container.innerHTML = `
      <div class="lesson">
        <h2>🎤 ${t.title} <span class="tag">${t.level}</span></h2>
        <div class="grammar-box" style="border-left-color:var(--warn)">
          <h3>📜 Topic</h3>
          <p style="font-size:17px;font-weight:600">${t.topic}</p>
          ${Chrome.gloss(t.topicEn)}
        </div>
        <div class="grammar-box">
          <h3>📋 Your task</h3>
          <p>${t.prompt}</p>
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
        <div class="center">
          <button class="mic-btn" id="st3-mic" title="Press to record">🎙️</button>
          <p style="color:var(--mute);margin-top:10px;font-size:14px" id="st3-status">Press mic when ready to speak.</p>
          <p style="font-family:'Fredoka',sans-serif;font-size:32px;color:var(--bleu)" id="st3-timer">${formatTime(timeLeft)}</p>
          <div class="transcript" id="st3-trans">—</div>
        </div>
        <div id="st3-report"></div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('speaktask3')">← Tasks</button>
          <button class="btn" id="st3-grade" disabled>📊 Grade my speech</button>
        </div>
      </div>`;

    const mic = container.querySelector('#st3-mic');
    const status = container.querySelector('#st3-status');
    const trans = container.querySelector('#st3-trans');
    const timerEl = container.querySelector('#st3-timer');
    const gradeBtn = container.querySelector('#st3-grade');

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
      status.textContent = 'Recording stopped. Press "Grade my speech".';
      gradeBtn.disabled = false;
    }
    mic.onclick = () => {
      if (recording) { stopRec(); return; }
      recording = true;
      recordedText = '';
      mic.classList.add('listening');
      status.textContent = '🎤 Recording... defend your position with reasons.';
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
    const lower = text.toLowerCase();
    const words = (text.match(/\b\w+\b/g) || []).length;

    // Detect categories
    const hitCount = (arr) => arr.filter(kw => lower.includes(kw)).length;

    const positionHits = hitCount(t.keywords.position);
    const connectorHits = hitCount(t.keywords.connectors);
    const exampleHits = hitCount(t.keywords.examples);
    const counterHits = hitCount(t.keywords.counter);

    // Distinct words count → variety
    const distinctWords = new Set((lower.match(/\b[a-zà-ÿ']+\b/g) || []).filter(w => w.length > 3)).size;

    const rubric = [
      { label: 'Position clearly taken', pass: positionHits >= 1 },
      { label: '3+ discourse connectors', pass: connectorHits >= 3 },
      { label: '1+ concrete example', pass: exampleHits >= 1 },
      { label: '1+ counter-argument acknowledged', pass: counterHits >= 1 },
      { label: 'Word count 200+', pass: words >= 200 },
      { label: 'Word count 250+ (CLB 6 target)', pass: words >= 250 },
      { label: 'Lexical variety (60+ distinct meaningful words)', pass: distinctWords >= 60 },
    ];
    const rubricPassed = rubric.filter(r => r.pass).length;
    const total = Math.min(100, Math.round((rubricPassed / rubric.length) * 100));

    const tcfScore = Math.round((total / 100) * 20);
    let clb = '<4';
    if (tcfScore >= 16) clb = '10';
    else if (tcfScore >= 14) clb = '9';
    else if (tcfScore >= 12) clb = '8';
    else if (tcfScore >= 10) clb = '7';
    else if (tcfScore >= 7) clb = '6';
    else if (tcfScore >= 6) clb = '5';
    else if (tcfScore >= 4) clb = '4';

    if (total >= 65) App.markLessonDone(`st3:${id}`);

    const passColor = tcfScore >= 7 ? 'var(--good)' : 'var(--warn)';
    const passBg = tcfScore >= 7 ? 'rgba(52,199,89,.12)' : 'rgba(255,159,10,.12)';

    container.querySelector('#st3-report').innerHTML = `
      <div class="grammar-box" style="background:${passBg};border-left-color:${passColor};margin-top:14px">
        <h3>📊 TCF EO Task 3 estimated: ${tcfScore}/20 · CLB ${clb}</h3>
        <p>Overall: <b>${total}/100</b></p>
        <div class="row" style="margin-top:8px;flex-wrap:wrap">
          <span class="tag">Words: ${words}</span>
          <span class="tag">Distinct words: ${distinctWords}</span>
          <span class="tag">Position phrases: ${positionHits}</span>
          <span class="tag">Connectors: ${connectorHits}</span>
          <span class="tag">Examples: ${exampleHits}</span>
          <span class="tag">Counter-args: ${counterHits}</span>
        </div>
      </div>
      <div class="grammar-box">
        <h3>✅ TCF Task 3 rubric</h3>
        <ul style="margin-left:20px;line-height:1.9">${rubric.map(r => `<li>${r.pass ? '✅' : '⬜'} ${r.label}</li>`).join('')}</ul>
      </div>
      <div class="grammar-box" style="background:rgba(0,85,164,.08)">
        <h3>💬 Your transcript</h3>
        <p style="font-style:italic">"${text || '<i>no recording</i>'}"</p>
      </div>
      <div class="grammar-box" style="background:var(--surface-2)">
        <h3>💡 Power phrases for Task 3</h3>
        <p><b>Take position</b>: "Je pense fermement que…", "À mon avis…", "Personnellement, je suis convaincu(e) que…"</p>
        <p style="margin-top:6px"><b>Argue</b>: "D'une part… d'autre part…", "Tout d'abord… ensuite… enfin…", "Par conséquent…", "C'est pourquoi…"</p>
        <p style="margin-top:6px"><b>Example</b>: "Par exemple…", "Prenons le cas de…", "C'est notamment vrai pour…"</p>
        <p style="margin-top:6px"><b>Counter</b>: "Certes, certains pensent que… cependant…", "Il est vrai que… mais…", "Bien sûr… toutefois…"</p>
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
