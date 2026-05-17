// Speaking Mirror: target sentence + mic. Word-level diff feedback.
window.SpeakModule = (function () {
  const SETS = window.SPEAK_SETS;

  // Normalize for comparison: lowercase, strip accents+punctuation, collapse spaces.
  function norm(s) {
    return s.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Word-level diff via LCS (longest common subsequence).
  function wordDiff(spoken, target) {
    const a = norm(spoken).split(' ');
    const b = norm(target).split(' ');
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);

    // Trace target words, marking which were "hit" by the spoken sequence
    const hits = new Array(n).fill(false);
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (a[i-1] === b[j-1]) { hits[j-1] = true; i--; j--; }
      else if (dp[i-1][j] >= dp[i][j-1]) i--;
      else j--;
    }
    return { hits, lcs: dp[m][n], targetWords: b, spokenWords: a };
  }

  function score(spoken, target) {
    const d = wordDiff(spoken, target);
    if (d.targetWords.length === 0) return 0;
    return Math.round((d.lcs / d.targetWords.length) * 100);
  }

  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎙️ Speaking Mirror</h1>
        <p>Press mic. Repeat the sentence aloud. Get word-by-word feedback. Best in Chrome/Edge/Brave.</p>
      </div>
      <div class="grid" id="s-grid"></div>`;
    const grid = container.querySelector('#s-grid');
    for (const k of Object.keys(SETS)) {
      const s = SETS[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">🎙️</div><h3>${s.title}</h3><p><span class="tag">${s.level || ''}</span></p><p style="margin-top:8px">${s.items.length} sentences</p>`;
      card.onclick = () => renderSet(container, k);
      grid.appendChild(card);
    }
  }

  function renderSet(container, setKey) {
    const s = SETS[setKey];
    let i = 0, totalScore = 0;
    function show() {
      if (i >= s.items.length) return finish();
      const target = s.items[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🎙️ ${s.title}</h2>
          <div class="progress"><div style="width:${(i / s.items.length) * 100}%"></div></div>
          <div class="center">
            <p style="font-size:22px;font-family:'Fredoka';color:var(--bleu);margin:18px 0;line-height:1.4">${target}</p>
            <div class="row" style="justify-content:center;gap:8px">
              <button class="btn secondary" data-rate="0.7">🐢 Slow</button>
              <button class="btn secondary" data-rate="1.0">🔊 Hear</button>
              <button class="btn secondary" data-rate="1.2">🐇 Fast</button>
            </div>
          </div>
          <div class="spacer"></div>
          <div class="center">
            <button class="mic-btn" id="mic" title="Press and speak">🎙️</button>
            <p style="color:var(--mute);margin-top:10px;font-size:14px">Click mic, then speak the sentence.</p>
            <div class="transcript" id="trans">—</div>
            <div id="diff"></div>
            <div id="fb"></div>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('speak')">← Quit</button>
            <button class="btn" id="next">Skip / Next →</button>
          </div>
        </div>`;
      container.querySelectorAll('[data-rate]').forEach(b => {
        b.onclick = () => TTS.speak(target, parseFloat(b.dataset.rate));
      });
      // Auto-play once at normal speed
      setTimeout(() => TTS.speak(target, 1.0), 300);

      const mic = container.querySelector('#mic');
      const trans = container.querySelector('#trans');
      const fb = container.querySelector('#fb');
      const diff = container.querySelector('#diff');
      const next = container.querySelector('#next');
      next.onclick = () => { i++; show(); };

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        fb.innerHTML = `<div class="feedback bad">Speech recognition not supported in this browser. Try Chrome, Edge, or Brave with Google services enabled.</div>`;
        return;
      }
      const rec = new SR();
      rec.lang = 'fr-CA';
      rec.interimResults = false;
      rec.continuous = false;
      mic.onclick = () => {
        mic.classList.add('listening');
        trans.textContent = '🎤 Listening...';
        diff.innerHTML = '';
        fb.innerHTML = '';
        try { rec.start(); } catch {}
      };
      rec.onresult = (e) => {
        mic.classList.remove('listening');
        const heard = e.results[0][0].transcript;
        trans.textContent = '"' + heard + '"';
        const d = wordDiff(heard, target);
        const sc = score(heard, target);
        totalScore += sc;

        // Render word-level diff with target words colored
        const targetTokens = target.split(/\s+/);
        const tNorm = d.targetWords;
        diff.innerHTML = `<div style="font-size:18px;line-height:2;margin-top:10px">` +
          targetTokens.map((tok, idx) => {
            const hit = d.hits[idx];
            return `<span style="display:inline-block;padding:4px 8px;margin:2px;border-radius:6px;background:${hit ? '#dcfce7' : '#fee2e2'};color:${hit ? 'var(--good)' : 'var(--bad)'};font-weight:600">${tok}${hit ? ' ✓' : ' ✗'}</span>`;
          }).join('') +
          `</div>`;

        if (sc >= 80) {
          App.addXP(12);
          fb.innerHTML = `<div class="feedback good">⭐ ${sc}% — excellent pronunciation!</div>`;
        } else if (sc >= 60) {
          App.addXP(6);
          fb.innerHTML = `<div class="feedback good">✓ ${sc}% — good. Replay the slow version and shadow the red words.</div>`;
        } else {
          fb.innerHTML = `<div class="feedback bad">${sc}% — listen slowly and try again. Focus on the red words.</div>`;
          // Record as mistake
          MistakesModule.record({
            type: 'speak',
            sig: `speak:${setKey}:${i}`,
            prompt: `Speak: <b>${target}</b>`,
            correct: target,
            your: heard,
          });
        }
      };
      rec.onerror = () => { mic.classList.remove('listening'); trans.textContent = 'No speech detected. Try again — speak after the beep.'; };
      rec.onend = () => mic.classList.remove('listening');
    }
    function finish() {
      App.markLessonDone(`speak:${setKey}`);
      const avg = Math.round(totalScore / s.items.length);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🗣️</div>
            <h2>Speaking Session Complete</h2>
            <p>Average word-match score: <b>${avg}%</b></p>
            <p style="color:var(--mute);margin-top:8px">${avg >= 80 ? 'Native-like rhythm. Keep going.' : avg >= 60 ? 'Solid. Replay the red words from your weak spots.' : 'Build up by shadowing the slow audio repeatedly. Quality beats speed.'}</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('speak')">More Practice</button>
            <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
          </div>
        </div>`;
    }
    show();
  }

  return {
    render(container, params) {
      if (params && params.set) renderSet(container, params.set);
      else renderList(container);
    }
  };
})();
