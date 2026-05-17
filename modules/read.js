// Reading: graded text + multiple-choice comprehension.
window.ReadModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>📖 Reading Quests</h1>
        <p>Short authentic-style French texts with comprehension questions. CLB 4 → 6.</p>
      </div>
      <div class="grid" id="r-grid"></div>`;
    const grid = container.querySelector('#r-grid');
    for (const k of Object.keys(READINGS)) {
      const t = READINGS[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">📖</div><h3>${t.title}</h3><p><span class="tag">${t.level}</span></p><p style="margin-top:8px">${t.questions.length} questions</p>`;
      card.onclick = () => App.go('read', { text: k });
      grid.appendChild(card);
    }
  }

  function renderText(container, key) {
    const t = READINGS[key];
    let phase = 'read', qi = 0, correct = 0;

    function showText() {
      // Split into sentences for highlight playback
      const sentences = t.text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
      const sentenceHTML = sentences.map((s, i) => `<span class="r-sent" data-i="${i}">${s}</span>`).join(' ');
      container.innerHTML = `
        <div class="lesson">
          <h2>📖 ${t.title} <span class="tag">${t.level}</span></h2>
          <div class="reading-text" id="r-text" style="background:#fffdf7;border:2px solid #fcd34d;padding:20px;border-radius:12px;line-height:1.9;font-size:17px;white-space:pre-wrap">${sentenceHTML}</div>
          <div class="reading-player" id="r-player">
            <button class="btn" id="r-play">▶ Listen to text</button>
            <button class="btn secondary" id="r-stop" disabled>⏸</button>
            <span style="color:var(--mute);font-size:13px;margin-left:8px" id="r-progress">— / ${sentences.length}</span>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('read')">← Texts</button>
            <button class="btn big" id="start">Comprehension →</button>
          </div>
        </div>`;
      container.querySelector('#start').onclick = () => { phase = 'quiz'; showQ(); };

      // Audio player
      let idx = 0;
      let stopped = false;
      const playBtn = container.querySelector('#r-play');
      const stopBtn = container.querySelector('#r-stop');
      const progress = container.querySelector('#r-progress');
      function highlight(i) {
        container.querySelectorAll('.r-sent').forEach(el => el.classList.remove('active'));
        const el = container.querySelector(`.r-sent[data-i="${i}"]`);
        if (el) {
          el.classList.add('active');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        progress.textContent = `${i + 1} / ${sentences.length}`;
      }
      function play() {
        stopped = false;
        playBtn.disabled = true;
        stopBtn.disabled = false;
        function next() {
          if (stopped || idx >= sentences.length) {
            playBtn.disabled = false;
            stopBtn.disabled = true;
            playBtn.textContent = '▶ Listen again';
            container.querySelectorAll('.r-sent').forEach(el => el.classList.remove('active'));
            idx = 0;
            return;
          }
          highlight(idx);
          TTS.speakLine(sentences[idx].trim(), 'fr-CA-SylvieNeural', () => { idx++; setTimeout(next, 200); });
        }
        next();
      }
      function stop() {
        stopped = true;
        TTS.stop();
        playBtn.disabled = false;
        stopBtn.disabled = true;
      }
      playBtn.onclick = play;
      stopBtn.onclick = stop;

      // Click any sentence to play just that one
      container.querySelectorAll('.r-sent').forEach((el, i) => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('a, button')) return;
          // Only if user didn't trigger wordpop
          if (e.detail === 2) return; // double-click
        });
      });
    }

    function showQ() {
      const q = t.questions[qi];
      container.innerHTML = `
        <div class="lesson">
          <h2>📖 ${t.title}</h2>
          <div class="progress"><div style="width:${(qi / t.questions.length) * 100}%"></div></div>
          <details style="margin-bottom:14px"><summary style="cursor:pointer;color:var(--bleu);font-weight:700">Show text again</summary>
            <div style="background:#fffdf7;padding:14px;border-radius:10px;margin-top:8px;white-space:pre-wrap;font-size:15px;line-height:1.6">${t.text}</div>
          </details>
          <div class="q-prompt">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${o}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('read')">← Quit</button>
            <span style="color:var(--mute)">Q ${qi + 1} / ${t.questions.length}</span>
          </div>
        </div>`;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const i = parseInt(el.dataset.i);
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          if (i === q.a) {
            el.classList.add('correct');
            correct++;
            App.addXP(8);
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct!</div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[q.a].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Right answer: <b>${q.opts[q.a]}</b></div>`;
            MistakesModule.record({
              type: 'reading',
              sig: `read:${key}:${qi}`,
              prompt: `[${t.title}] ${q.q}`,
              correct: q.opts[q.a],
              your: q.opts[i],
            });
          }
          setTimeout(() => { qi++; qi >= t.questions.length ? finish() : showQ(); }, 1300);
        };
      });
    }

    function finish() {
      const pct = Math.round((correct / t.questions.length) * 100);
      if (pct >= 70) App.markLessonDone(`read:${key}`);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 70 ? '📜' : '📖'}</div>
            <h2>${pct >= 70 ? 'Read & Understood!' : 'Re-read & Retry'}</h2>
            <p>Score: <b>${correct}/${t.questions.length}</b> (${pct}%)</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('read')">More Texts</button>
            <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
          </div>
        </div>`;
    }

    showText();
  }

  return {
    render(container, params) {
      if (params && params.text) renderText(container, params.text);
      else renderList(container);
    }
  };
})();
