// Reading: graded text + multiple-choice comprehension.
window.ReadModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Read'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Reading Quests</p>
        <h1>Read it.<br/>Understand it.</h1>
        <p style="margin-top:var(--sp-4)">Short authentic-style texts with comprehension questions, CLB 4 to 6.</p>
      </section>
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
        ${Chrome.render({ back: 'read', crumbs: ['Read', t.title] })}
        <div class="lesson">
          <h2>📖 ${t.title} <span class="tag">${t.level}</span></h2>
          <div class="reading-text" id="r-text" style="background:var(--surface-2);border:1px solid var(--line);padding:var(--sp-5);border-radius:var(--r-md);line-height:var(--lh-loose);font-size:var(--fs-17);white-space:pre-wrap;color:var(--ink)">${sentenceHTML}</div>
          <div class="reading-player" id="r-player">
            <button class="btn primary" id="r-play">▶ Listen to text</button>
            <button class="btn secondary" id="r-stop" disabled>⏸</button>
            <span style="color:var(--mute);font-size:var(--fs-13);margin-left:var(--sp-2);font-variant-numeric:tabular-nums" id="r-progress">— / ${sentences.length}</span>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:flex-end">
            <button class="btn primary big" id="start">Comprehension<span class="arr">→</span></button>
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
        ${Chrome.render({
          back: () => `App.go('read', { text: '${key}' })`,
          crumbs: ['Read', t.title, 'Questions'],
          progress: { current: qi, total: t.questions.length }
        })}
        <div class="lesson">
          <h2>📖 ${t.title}</h2>
          <details style="margin-bottom:var(--sp-4)"><summary style="cursor:pointer;color:var(--accent);font-weight:var(--fw-semi)">Show text again</summary>
            <div style="background:var(--surface-2);padding:var(--sp-4);border-radius:var(--r-md);margin-top:var(--sp-2);white-space:pre-wrap;font-size:var(--fs-15);line-height:var(--lh-base);color:var(--ink)">${t.text}</div>
          </details>
          <div class="q-prompt">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${o}</div>`).join('')}
          </div>
          <div id="fb"></div>
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
        ${Chrome.render({ back: 'read', crumbs: ['Read', t.title, 'Result'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 70 ? '📜' : '📖'}</div>
            <h2>${pct >= 70 ? 'Read & understood' : 'Re-read & retry'}</h2>
            <p>Score: <b>${correct}/${t.questions.length}</b> (${pct}%)</p>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('read')">More texts</button>
              <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
            </div>
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
