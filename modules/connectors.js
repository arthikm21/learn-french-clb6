// Discourse Connector Drill — timed production exercise.
// User reads prompt, must continue with target connector + sentence within ~30s.
window.ConnectorsModule = (function () {

  function render(container) {
    let i = 0, correct = 0;
    let queue = [...window.CONNECTOR_DRILLS].sort(() => Math.random() - 0.5).slice(0, 10);
    let timer = null;
    let timeLeft = 30;
    let aborted = false;

    const onHash = () => { if (!location.hash.startsWith('#connectors')) { aborted = true; clearInterval(timer); window.removeEventListener('hashchange', onHash); } };
    window.addEventListener('hashchange', onHash);

    function show() {
      if (aborted) return;
      if (i >= queue.length) return finish();
      const d = queue[i];
      timeLeft = 30;

      container.innerHTML = `
        ${Chrome.render({ back: 'connectormastery', crumbs: ['Practice', 'Connector drill'] })}
        <div class="lesson">
          <h1>🔗 Discourse Connector Drill <span class="tag">NCLC 5–6 practice</span></h1>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${i + 1}/${queue.length}</span></div>
          <div class="grammar-box">
            <h3>📜 Prompt</h3>
            <p style="font-size:18px;line-height:1.5;font-style:italic">"${d.prompt}"</p>
          </div>
          <div class="grammar-box" style="border-left-color:var(--warn)">
            <h3>🎯 Use this connector to continue</h3>
            <p style="font-variant-numeric:tabular-nums;font-size:30px;color:var(--bleu)">${d.target}</p>
            <p style="margin-top:6px;color:var(--mute);font-size:13px">${d.targetExplain}</p>
            <p style="margin-top:4px;font-size:13px"><span class="tag" style="background:rgba(94,92,230,.12);color:var(--accent)">${d.category}</span></p>
          </div>
          <p style="text-align:center;color:var(--mute)">Say your continuation aloud, then type what you said using <b>${d.target}</b>. 30s timer.</p>
          <div class="center">
            <p role="timer" aria-label="Time remaining" style="font-variant-numeric:tabular-nums;font-size:32px;color:var(--bleu)" id="c-timer">${timeLeft}s</p>
            <p style="color:var(--mute);margin-top:8px;font-size:14px">Your voice is never sent to a recognition service. This drill checks the typed continuation only.</p>
          </div>
          <div class="spacer"></div>
          <input class="input" id="c-typed" lang="fr-CA" autocomplete="off" placeholder="Type your French continuation here..."/>
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

      const typed = container.querySelector('#c-typed');
      const timerEl = container.querySelector('#c-timer');

      // Start countdown
      timer = setInterval(() => {
        if (aborted) return;
        timeLeft--;
        if (timerEl) timerEl.textContent = timeLeft + 's';
        if (timeLeft <= 0) { clearInterval(timer); check(true); }
      }, 1000);

      let answered = false; // Enter re-press stacked timeouts → skipped questions
      function check(timedOut) {
        if (answered) return;
        clearInterval(timer);
        const userResponse = typed.value.trim();
        if (!userResponse && !timedOut) {
          Toast.warn('Type or speak a continuation first.');
          // Restart timer briefly
          timer = setInterval(() => { timeLeft--; if (timerEl) timerEl.textContent = timeLeft + 's'; if (timeLeft <= 0) { clearInterval(timer); check(true); } }, 1000);
          return;
        }
        answered = true;
        const lower = userResponse.toLowerCase();
        const usedConnector = lower.includes(d.target.toLowerCase());
        const wordCount = (userResponse.match(/[\p{L}\p{N}]+/gu) || []).length;
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
      App.recordAttempt('connectors:drill', pct, 70, 'connector-drill');
      container.innerHTML = Chrome.finishScreen({
        icon: '🔗',
        title: pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep practicing',
        score: { correct, total: queue.length },
        sub: pct >= 80 ? 'You used advanced discourse connectors consistently in this practice set.' : pct >= 60 ? 'Solid. Re-run the drill — random sample varies each time.' : 'Review the connector list in the Grammar Connectors unit, then drill again.',
        actions: [
          { label: '↻ Drill again', onclick: "App.go('connectors')", primary: true },
          { label: 'Home', onclick: "App.go('home')" },
        ],
      });
    }

    show();
  }

  return { render };
})();
