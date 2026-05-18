// Multi-speaker listening dialogue + comprehension questions.
// User listens (twice if needed), then answers MC questions.
window.DialogueModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>💬 Listening Dialogues</h1>
        <p>Multi-speaker conversations at CLB 4-6 level. Listen all the way through, then answer comprehension questions. Builds real-world listening competence — the kind that CLB exams test.</p>
      </div>
      <div class="grid" id="d-grid"></div>`;
    const grid = container.querySelector('#d-grid');
    for (const k of Object.keys(DIALOGUES)) {
      const d = DIALOGUES[k];
      const done = App.state.lessons[`dialogue:${k}`];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">💬</div>
        <h3>${d.title}</h3>
        <p><span class="tag">${d.level}</span>${done ? ' <span class="tag" style="background:#dcfce7;color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px">${d.lines.length} lines · ${d.questions.length} questions</p>`;
      card.onclick = () => App.go('dialogue', { id: k });
      grid.appendChild(card);
    }
  }

  function renderDialogue(container, id, opts) {
    const d = DIALOGUES[id];
    if (!d) { App.go('dialogue'); return; }
    let phase = 'listen'; // listen → quiz
    let qi = 0, correct = 0;
    let playIdx = 0;
    let stopped = false;
    const tcfMode = !!(opts && opts.tcf); // single-play, no transcript, no replay
    let hasPlayed = false;

    function play() {
      stopped = false;
      playIdx = 0;
      const btn = container.querySelector('#play');
      const idxEl = container.querySelector('#line-idx');
      const toQuiz = container.querySelector('#to-quiz');
      if (!tcfMode && btn) btn.textContent = '⏸ Stop';
      function next() {
        if (stopped || playIdx >= d.lines.length) {
          if (tcfMode) {
            if (btn) { btn.textContent = '✓ Audio finished'; btn.disabled = true; }
            if (toQuiz) toQuiz.disabled = false;
          } else {
            if (btn) btn.textContent = '▶ Play again';
          }
          return;
        }
        const line = d.lines[playIdx];
        const voice = line.voice === 'jean' ? 'fr-CA-JeanNeural' : 'fr-CA-SylvieNeural';
        if (!tcfMode) {
          const lineEls = container.querySelectorAll('.dialogue-line');
          lineEls.forEach((el, i) => el.classList.toggle('active', i === playIdx));
        }
        if (idxEl) idxEl.textContent = (playIdx + 1) + ' / ' + d.lines.length;
        TTS.speakLine(line.text, voice, () => { playIdx++; setTimeout(next, 300); });
      }
      next();
    }
    function stop() {
      stopped = true;
      TTS.stop();
      const btn = container.querySelector('#play');
      if (btn) btn.textContent = '▶ Play';
      const lineEls = container.querySelectorAll('.dialogue-line');
      lineEls.forEach(el => el.classList.remove('active'));
    }

    function showListen() {
      container.innerHTML = `
        <div class="lesson">
          <h2>💬 ${d.title} <span class="tag">${d.level}</span>${tcfMode ? ' <span class="tag" style="background:var(--rouge);color:white">🎯 TCF mode</span>' : ''}</h2>
          <p style="color:var(--mute);font-style:italic;margin-bottom:14px">${d.intro}</p>
          ${tcfMode ? `<div class="grammar-box" style="background:#fee2e2;border-left-color:var(--bad)"><h3>⚠️ TCF Exam Mode</h3><p>Audio plays <b>ONCE</b>. No replay. No transcript. Listen carefully, then answer the questions.</p></div>` : ''}
          <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
            <button class="btn big" id="play">▶ ${tcfMode ? 'Play (one chance)' : 'Play'}</button>
            ${tcfMode ? '' : `<button class="btn ghost" id="show-text">👁️ Show transcript</button>`}
            <span style="display:inline-flex;align-items:center;color:var(--mute);font-size:14px">Line <b id="line-idx">— / ${d.lines.length}</b></span>
          </div>
          <div class="spacer"></div>
          ${tcfMode ? '' : `<div id="transcript" style="display:none">
            ${d.lines.map((l, i) => `
              <div class="dialogue-line" data-i="${i}">
                <div class="dl-speaker dl-${l.speaker}">${l.speaker === 'A' ? '👩' : l.speaker === 'B' ? '👨' : '📢'} ${l.speaker}</div>
                <div class="dl-text">${l.text}</div>
              </div>`).join('')}
          </div>`}
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('dialogue')">← Dialogues</button>
            <button class="btn big" id="to-quiz" ${tcfMode ? 'disabled' : ''}>Comprehension Questions →</button>
          </div>
        </div>`;
      const btn = container.querySelector('#play');
      btn.onclick = () => {
        if (tcfMode) {
          if (hasPlayed) return;       // single-play enforced
          hasPlayed = true;
          btn.disabled = true;
          btn.textContent = '🔊 Playing...';
          play();
          // Enable "to-quiz" after playback finishes (handled in play())
        } else {
          if (stopped === false && playIdx > 0 && playIdx < d.lines.length) stop();
          else play();
        }
      };
      if (!tcfMode) {
        container.querySelector('#show-text').onclick = (e) => {
          const t = container.querySelector('#transcript');
          const hidden = t.style.display === 'none';
          t.style.display = hidden ? 'block' : 'none';
          e.target.textContent = hidden ? '🙈 Hide transcript' : '👁️ Show transcript';
        };
      }
      container.querySelector('#to-quiz').onclick = () => { stop(); phase = 'quiz'; showQuiz(); };
    }

    function showQuiz() {
      const q = d.questions[qi];
      container.innerHTML = `
        <div class="lesson">
          <h2>💬 ${d.title}${tcfMode ? ' <span class="tag" style="background:var(--rouge);color:white">🎯 TCF mode</span>' : ''}</h2>
          <div class="progress"><div style="width:${(qi / d.questions.length) * 100}%"></div></div>
          <p style="color:var(--mute);font-size:14px">Question ${qi + 1} of ${d.questions.length}</p>
          ${tcfMode ? '' : `<div class="row" style="margin-bottom:10px"><button class="btn secondary" id="replay">🔊 Replay dialogue</button></div>`}
          <div class="q-prompt">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${o}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('dialogue')">← Quit</button>
          </div>
        </div>`;
      const replay = container.querySelector('#replay');
      if (replay) replay.onclick = play;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const i = parseInt(el.dataset.i, 10);
          if (i === q.a) {
            el.classList.add('correct');
            correct++;
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct!</div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[q.a].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Correct: <b>${q.opts[q.a]}</b></div>`;
            MistakesModule.record({
              type: 'dialogue',
              sig: `dialogue:${id}:${qi}`,
              prompt: `[${d.title}] ${q.q}`,
              correct: q.opts[q.a],
              your: q.opts[i],
            });
          }
          setTimeout(() => { qi++; qi >= d.questions.length ? finish() : showQuiz(); }, 1500);
        };
      });
    }

    function finish() {
      const pct = Math.round((correct / d.questions.length) * 100);
      if (pct >= 70) App.markLessonDone(`dialogue:${id}`);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 70 ? '🎯' : '👂'}</div>
            <h2>${pct >= 70 ? 'Excellent !' : 'Re-listen and Retry'}</h2>
            <p>Score: <b>${correct}/${d.questions.length}</b> (${pct}%)</p>
            <p style="color:var(--mute);margin-top:6px">${pct >= 80 ? 'You understood the dialogue clearly.' : pct >= 50 ? 'Replay the dialogue and re-attempt missed questions.' : 'Listen with the transcript open, then re-try.'}</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('dialogue')">More dialogues</button>
            <button class="btn ghost big" onclick="App.go('path')">Path</button>
          </div>
        </div>`;
    }

    showListen();
  }

  return {
    render(container, params) {
      if (params && params.id) renderDialogue(container, params.id, { tcf: params.tcf === '1' });
      else renderList(container);
    }
  };
})();
