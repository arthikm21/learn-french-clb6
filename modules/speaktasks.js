// Speaking Tasks — open-ended speaking practice.
// Types: picture description, Q&A, role-play. Uses SpeechRecognition + grader.
window.SpeakTasksModule = (function () {

  function renderList(container) {
    const tasks = window.SPEAK_TASKS;
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎤 Speaking Tasks</h1>
        <p>Beyond repeat-the-sentence. Practice <b>open-ended speaking</b>: describe scenes, answer questions, play roles. This is what CLB Speaking actually tests.</p>
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
        <h3>${t.title}</h3>
        <p><span class="tag">${t.level}</span> <span class="tag" style="background:#f3e8ff;color:var(--accent)">${t.type}</span>${done ? ' <span class="tag" style="background:#dcfce7;color:var(--good)">✓ Done</span>' : ''}</p>`;
      card.onclick = () => App.go('speaktasks', { id: k });
      grid.appendChild(card);
    }
  }

  // ---------- Picture description ----------
  function renderPicture(container, t, id) {
    let recording = false;
    let recordedText = '';
    let timer = null;
    let timeLeft = t.targetTime || 60;

    container.innerHTML = `
      <div class="lesson">
        <h2>${t.emoji} ${t.title} <span class="tag">${t.level}</span></h2>
        <div class="grammar-box">
          <h3>🖼️ Scene to describe</h3>
          <p><i>${t.sceneDesc}</i></p>
          <p style="margin-top:10px;color:var(--mute);font-size:14px">(This site uses verbal scene descriptions — a real CLB exam shows you the photo.)</p>
        </div>
        <div class="grammar-box" style="background:#fffdf7;border-left-color:var(--warn)">
          <h3>📋 Task</h3>
          <p>${t.prompt}</p>
          <p style="margin-top:8px;color:var(--mute);font-size:14px">Target: <b>${t.targetWords}+ words</b> in <b>${t.targetTime} seconds</b>.</p>
        </div>
        <div class="center">
          <button class="mic-btn" id="mic" title="Press and speak">🎙️</button>
          <p style="color:var(--mute);margin-top:10px;font-size:14px" id="status">Press mic and start speaking.</p>
          <p style="font-family:'Fredoka',sans-serif;font-size:32px;color:var(--bleu)" id="timer">${timeLeft}s</p>
          <div class="transcript" id="trans">—</div>
        </div>
        <div id="report"></div>
        <div class="spacer"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" onclick="App.go('speaktasks')">← Quit</button>
          <button class="btn" id="grade-btn" disabled>📊 Grade my answer</button>
        </div>
      </div>`;
    const mic = container.querySelector('#mic');
    const status = container.querySelector('#status');
    const trans = container.querySelector('#trans');
    const timerEl = container.querySelector('#timer');
    const gradeBtn = container.querySelector('#grade-btn');

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
        timerEl.textContent = timeLeft + 's';
        if (timeLeft <= 0) {
          stopRec();
        }
      }, 1000);
    }
    function stopRec() {
      recording = false;
      if (timer) { clearInterval(timer); timer = null; }
      try { rec.stop(); } catch {}
      mic.classList.remove('listening');
      status.textContent = 'Recording stopped. Press "Grade my answer".';
      gradeBtn.disabled = false;
    }
    mic.onclick = () => {
      if (recording) { stopRec(); return; }
      recording = true;
      recordedText = '';
      mic.classList.add('listening');
      status.textContent = '🎤 Recording... speak in French.';
      timeLeft = t.targetTime || 60;
      timerEl.textContent = timeLeft + 's';
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

    gradeBtn.onclick = () => gradePicture(container, t, id, recordedText);
  }

  function gradePicture(container, t, id, text) {
    const words = (text.match(/\b\w+\b/g) || []).length;
    const lower = text.toLowerCase();
    const keywordsHit = (t.keywords || []).filter(kw => lower.includes(kw.toLowerCase()));
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    // Score blend
    const wordScore = Math.min(40, Math.round((words / t.targetWords) * 40));
    const keywordScore = Math.min(40, Math.round((keywordsHit.length / Math.min(8, t.keywords.length)) * 40));
    const sentenceScore = Math.min(20, sentences * 3);
    const total = Math.min(100, wordScore + keywordScore + sentenceScore);
    const clb = total >= 75 ? (t.level.includes('6') ? 'CLB 6' : 'CLB 5') : total >= 55 ? 'CLB 4' : 'CLB 3';
    if (total >= 65) App.markLessonDone(`speaktask:${id}`);
    container.querySelector('#report').innerHTML = `
      <div class="grammar-box" style="background:${total >= 70 ? '#dcfce7' : '#fef3c7'};border-left-color:${total >= 70 ? 'var(--good)' : 'var(--warn)'};margin-top:14px">
        <h3>📊 Grade: ${total}/100 · ${clb}</h3>
        <div class="row" style="margin-top:8px"><span class="tag">Words: ${words}/${t.targetWords}</span><span class="tag">Keywords: ${keywordsHit.length}/${Math.min(8, t.keywords.length)}</span><span class="tag">Sentences: ${sentences}</span></div>
        <p style="margin-top:10px"><b>Keywords found:</b> ${keywordsHit.length ? keywordsHit.join(', ') : '<i>none</i>'}</p>
        ${keywordsHit.length < 4 ? `<p style="margin-top:6px;color:var(--mute);font-size:14px"><b>Missed expected words:</b> ${t.keywords.filter(k => !keywordsHit.includes(k)).slice(0, 6).join(', ')}</p>` : ''}
        <p style="margin-top:10px;color:var(--mute);font-size:14px">CLB Speaking rubric also evaluates pronunciation, intonation, hesitation, and grammatical accuracy. A real grader would assess those separately.</p>
      </div>`;
  }

  // ---------- Q&A ----------
  function renderQA(container, t, id) {
    let qi = 0;
    let answers = [];
    let recording = false;
    let recordedText = '';

    function show() {
      if (qi >= t.questions.length) return finishQA(container, t, id, answers);
      const q = t.questions[qi];
      recordedText = '';
      container.innerHTML = `
        <div class="lesson">
          <h2>❓ ${t.title} <span class="tag">${t.level}</span></h2>
          <div class="progress"><div style="width:${(qi / t.questions.length) * 100}%"></div></div>
          <div class="grammar-box">
            <h3>Question ${qi + 1} of ${t.questions.length}</h3>
            <p style="font-size:18px;line-height:1.5">${q.q}</p>
            <button class="btn secondary" id="hear-q" style="margin-top:10px">🔊 Hear question</button>
            ${q.hint ? `<p style="margin-top:10px;color:var(--mute);font-size:13px"><b>Hint:</b> ${q.hint}</p>` : ''}
            <p style="color:var(--mute);font-size:13px">Target: ${q.minWords}+ words.</p>
          </div>
          <div class="center">
            <button class="mic-btn" id="mic">🎙️</button>
            <p style="color:var(--mute);margin-top:10px;font-size:14px" id="status">Press mic, then answer aloud.</p>
            <div class="transcript" id="trans">—</div>
          </div>
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
      setTimeout(() => TTS.speak(q.q), 200);
      const mic = container.querySelector('#mic');
      const status = container.querySelector('#status');
      const trans = container.querySelector('#trans');
      const submitBtn = container.querySelector('#submit-q');
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { status.textContent = 'Speech recognition not supported.'; mic.disabled = true; submitBtn.disabled = false; }
      const rec = SR ? new SR() : null;
      if (rec) {
        rec.lang = 'fr-CA';
        rec.interimResults = true;
        rec.continuous = true;
        rec.onresult = (e) => {
          let interim = '', finalT = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) finalT += r[0].transcript + ' ';
            else interim += r[0].transcript;
          }
          if (finalT) recordedText += finalT;
          trans.textContent = (recordedText + interim).trim() || '—';
        };
        rec.onerror = () => { status.textContent = 'No speech. Try again.'; };
      }
      mic.onclick = () => {
        if (recording) {
          recording = false; mic.classList.remove('listening'); try { rec && rec.stop(); } catch {}
          status.textContent = 'Stopped. Press "Next question".'; submitBtn.disabled = false;
          return;
        }
        recording = true;
        recordedText = '';
        mic.classList.add('listening');
        status.textContent = '🎤 Recording...';
        try { rec && rec.start(); } catch {}
      };
      submitBtn.onclick = () => {
        answers.push({ q: q.q, transcript: recordedText, minWords: q.minWords });
        qi++; show();
      };
      container.querySelector('#skip').onclick = () => {
        answers.push({ q: q.q, transcript: '', minWords: q.minWords, skipped: true });
        qi++; show();
      };
    }
    show();
  }
  function finishQA(container, t, id, answers) {
    let totalWords = 0, totalTarget = 0;
    answers.forEach(a => {
      totalWords += (a.transcript.match(/\b\w+\b/g) || []).length;
      totalTarget += a.minWords;
    });
    const score = Math.min(100, Math.round((totalWords / totalTarget) * 100));
    if (score >= 65) App.markLessonDone(`speaktask:${id}`);
    container.innerHTML = `
      <div class="lesson">
        <h2>📊 ${t.title} — Results</h2>
        <div class="grammar-box" style="background:${score >= 70 ? '#dcfce7' : '#fef3c7'};border-left-color:${score >= 70 ? 'var(--good)' : 'var(--warn)'}">
          <h3>Overall: ${score}/100</h3>
          <p>Words spoken: <b>${totalWords}</b> / target <b>${totalTarget}</b></p>
        </div>
        ${answers.map((a, i) => `
          <div class="grammar-box">
            <h3>Q${i + 1}: ${a.q}</h3>
            <p style="color:var(--mute);font-size:13px">Words: ${(a.transcript.match(/\b\w+\b/g) || []).length} / ${a.minWords}${a.skipped ? ' (skipped)' : ''}</p>
            <p style="font-style:italic;margin-top:6px">"${a.transcript || '<i>no answer</i>'}"</p>
          </div>`).join('')}
        <div class="center">
          <button class="btn big" onclick="App.go('speaktasks')">More tasks</button>
        </div>
      </div>`;
  }

  // ---------- Role-play ----------
  function renderRole(container, t, id) {
    let turnIdx = 0;
    let answers = [];
    let recording = false;
    let recordedText = '';

    function show() {
      if (turnIdx >= t.turns.length) return finishRole(container, t, id, answers);
      const turn = t.turns[turnIdx];
      recordedText = '';
      container.innerHTML = `
        <div class="lesson">
          <h2>🎭 ${t.title} <span class="tag">${t.level}</span></h2>
          <div class="progress"><div style="width:${(turnIdx / t.turns.length) * 100}%"></div></div>
          <div class="grammar-box" style="background:#fffdf7;border-left-color:var(--warn)">
            <h3>📋 Scenario</h3>
            <p>${t.scenario}</p>
          </div>
          <div class="grammar-box">
            <h3>👤 Other person says:</h3>
            <p style="font-size:18px;line-height:1.5;font-family:'Fredoka',sans-serif;color:var(--bleu)">"${turn.other}"</p>
            <button class="btn secondary" id="hear" style="margin-top:8px">🔊 Hear them</button>
          </div>
          <p style="text-align:center;color:var(--mute)"><b>Your turn.</b> ${turn.hint ? '<br>' + turn.hint : ''} Target: ${turn.minWords}+ words.</p>
          <div class="center">
            <button class="mic-btn" id="mic">🎙️</button>
            <div class="transcript" id="trans">—</div>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('speaktasks')">← Quit</button>
            <button class="btn" id="next-turn" disabled>Continue →</button>
          </div>
        </div>`;
      container.querySelector('#hear').onclick = () => TTS.speak(turn.other);
      setTimeout(() => TTS.speak(turn.other), 200);
      const mic = container.querySelector('#mic');
      const trans = container.querySelector('#trans');
      const nextBtn = container.querySelector('#next-turn');
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { trans.textContent = 'Speech recognition not supported.'; mic.disabled = true; nextBtn.disabled = false; }
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
        answers.push({ other: turn.other, transcript: recordedText, minWords: turn.minWords });
        turnIdx++; show();
      };
    }
    show();
  }
  function finishRole(container, t, id, answers) {
    let totalWords = 0, totalTarget = 0;
    answers.forEach(a => {
      totalWords += (a.transcript.match(/\b\w+\b/g) || []).length;
      totalTarget += a.minWords;
    });
    const score = Math.min(100, Math.round((totalWords / totalTarget) * 100));
    if (score >= 65) App.markLessonDone(`speaktask:${id}`);
    container.innerHTML = `
      <div class="lesson">
        <h2>🎭 ${t.title} — Complete</h2>
        <div class="grammar-box" style="background:${score >= 70 ? '#dcfce7' : '#fef3c7'};border-left-color:${score >= 70 ? 'var(--good)' : 'var(--warn)'}">
          <h3>Score: ${score}/100</h3>
          <p>Words spoken: <b>${totalWords}</b> / target <b>${totalTarget}</b></p>
          <p style="margin-top:8px;color:var(--mute);font-size:14px">Role-plays are graded by completeness in this site. A real CLB rater would also score fluency, accuracy, pronunciation, and appropriate register.</p>
        </div>
        <h3 style="font-family:'Fredoka',sans-serif;color:var(--bleu);margin:18px 0 8px">Conversation transcript</h3>
        ${answers.map((a, i) => `
          <div class="dialogue-line">
            <div class="dl-speaker dl-A">👤 Other</div>
            <div class="dl-text">${a.other}</div>
          </div>
          <div class="dialogue-line">
            <div class="dl-speaker dl-B">🎤 You</div>
            <div class="dl-text">${a.transcript || '<i>(no answer)</i>'}</div>
          </div>`).join('')}
        <div class="center"><button class="btn big" onclick="App.go('speaktasks')">More tasks</button></div>
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
