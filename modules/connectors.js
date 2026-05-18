// Discourse Connector Drill — timed production exercise.
// User reads prompt, must continue with target connector + sentence within ~30s.
window.ConnectorsModule = (function () {

  function render(container) {
    let i = 0, correct = 0;
    let queue = [...window.CONNECTOR_DRILLS].sort(() => Math.random() - 0.5).slice(0, 10);
    let timer = null;
    let timeLeft = 30;
    let recordedText = '';
    let recording = false;
    let aborted = false;

    const onHash = () => { if (!location.hash.startsWith('#connectors')) { aborted = true; clearInterval(timer); window.removeEventListener('hashchange', onHash); } };
    window.addEventListener('hashchange', onHash);

    function show() {
      if (aborted) return;
      if (i >= queue.length) return finish();
      const d = queue[i];
      recordedText = '';
      recording = false;
      timeLeft = 30;

      container.innerHTML = `
        <div class="lesson">
          <h2>🔗 Discourse Connector Drill <span class="tag">CLB 5-6</span></h2>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${i + 1}/${queue.length}</span></div>
          <div class="grammar-box">
            <h3>📜 Prompt</h3>
            <p style="font-size:18px;line-height:1.5;font-style:italic">"${d.prompt}"</p>
          </div>
          <div class="grammar-box" style="background:#fef3c7;border-left-color:var(--warn)">
            <h3>🎯 Use this connector to continue (verbal or typed)</h3>
            <p style="font-family:'Fredoka',sans-serif;font-size:30px;color:var(--bleu)">${d.target}</p>
            <p style="margin-top:6px;color:var(--mute);font-size:13px">${d.targetExplain}</p>
            <p style="margin-top:4px;font-size:13px"><span class="tag" style="background:#f3e8ff;color:var(--accent)">${d.category}</span></p>
          </div>
          <p style="text-align:center;color:var(--mute)">Continue the idea using <b>${d.target}</b>. 30s timer.</p>
          <div class="center">
            <p style="font-family:'Fredoka',sans-serif;font-size:32px;color:var(--bleu)" id="c-timer">${timeLeft}s</p>
            <button class="mic-btn" id="c-mic">🎙️</button>
            <p style="color:var(--mute);margin-top:8px;font-size:14px" id="c-status">Press mic to speak OR type in the box below.</p>
            <div class="transcript" id="c-trans">—</div>
          </div>
          <div class="spacer"></div>
          <input class="input" id="c-typed" placeholder="Or type your continuation here..."/>
          <div id="c-fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('home')">← Quit</button>
            <div class="row">
              <button class="btn secondary" id="c-show">💡 Show sample</button>
              <button class="btn" id="c-check">Check (Enter)</button>
            </div>
          </div>
        </div>`;

      const mic = container.querySelector('#c-mic');
      const status = container.querySelector('#c-status');
      const trans = container.querySelector('#c-trans');
      const typed = container.querySelector('#c-typed');
      const timerEl = container.querySelector('#c-timer');

      // Start countdown
      timer = setInterval(() => {
        if (aborted) return;
        timeLeft--;
        if (timerEl) timerEl.textContent = timeLeft + 's';
        if (timeLeft <= 0) { clearInterval(timer); check(true); }
      }, 1000);

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = SR ? new SR() : null;
      if (rec) {
        rec.lang = 'fr-CA'; rec.interimResults = true; rec.continuous = true;
        rec.onresult = (e) => {
          let interim = '', finalT = '';
          for (let k = e.resultIndex; k < e.results.length; k++) {
            const r = e.results[k];
            if (r.isFinal) finalT += r[0].transcript + ' '; else interim += r[0].transcript;
          }
          if (finalT) recordedText += finalT;
          trans.textContent = (recordedText + interim).trim() || '—';
        };
      }
      mic.onclick = () => {
        if (recording) { recording = false; mic.classList.remove('listening'); try { rec && rec.stop(); } catch {}; return; }
        recording = true; recordedText = ''; mic.classList.add('listening');
        try { rec && rec.start(); } catch {}
      };

      function check(timedOut) {
        clearInterval(timer);
        const userResponse = (typed.value.trim() || recordedText.trim());
        if (!userResponse && !timedOut) {
          Toast.warn('Type or speak a continuation first.');
          // Restart timer briefly
          timer = setInterval(() => { timeLeft--; if (timerEl) timerEl.textContent = timeLeft + 's'; if (timeLeft <= 0) { clearInterval(timer); check(true); } }, 1000);
          return;
        }
        const lower = userResponse.toLowerCase();
        const usedConnector = lower.includes(d.target.toLowerCase());
        const wordCount = (userResponse.match(/\b\w+\b/g) || []).length;
        const longEnough = wordCount >= 6;
        const pass = usedConnector && longEnough;
        if (pass) {
          correct++;
          container.querySelector('#c-fb').innerHTML = `<div class="feedback good">✓ Good! You used <b>${d.target}</b> in a ${wordCount}-word continuation.</div>`;
        } else if (timedOut && !userResponse) {
          container.querySelector('#c-fb').innerHTML = `<div class="feedback bad">⏱ Time's up. Sample answer: <i>"${d.sampleContinuations[0]}"</i></div>`;
        } else {
          const why = !usedConnector ? `You didn't use "${d.target}".` : `Continuation too short (need 6+ words).`;
          container.querySelector('#c-fb').innerHTML = `<div class="feedback bad">✗ ${why}<br><i>Sample: "${d.sampleContinuations[0]}"</i></div>`;
          MistakesModule.record({ type: 'connector', sig: `connector:${d.target}:${i}`, prompt: `Continue with "${d.target}": "${d.prompt}"`, correct: d.sampleContinuations[0], your: userResponse || '(empty)' });
        }
        setTimeout(() => { i++; show(); }, 2400);
      }

      container.querySelector('#c-check').onclick = () => check(false);
      typed.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); check(false); } };
      container.querySelector('#c-show').onclick = () => {
        Toast.info('Sample: ' + d.sampleContinuations[0], 5000);
      };
    }

    function finish() {
      clearInterval(timer);
      window.removeEventListener('hashchange', onHash);
      if (aborted) return;
      const pct = Math.round((correct / queue.length) * 100);
      if (pct >= 70) App.markLessonDone('connectors:drill');
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🔗</div>
            <h2>${pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep practicing'}</h2>
            <p>Score: <b>${correct}/${queue.length}</b> (${pct}%)</p>
            <p style="color:var(--mute);margin-top:8px">${pct >= 80 ? 'You handle TCF-level discourse connectors with confidence.' : pct >= 60 ? 'Solid. Re-run the drill — random sample varies each time.' : 'Review the connector list in the Grammar Connectors unit, then drill again.'}</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('connectors')">↻ Drill again</button>
            <button class="btn ghost big" onclick="App.go('home')">← Home</button>
          </div>
        </div>`;
    }

    show();
  }

  return { render };
})();
