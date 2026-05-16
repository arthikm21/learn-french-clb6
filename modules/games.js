// Interactive mini-games: gender sort, conjugation race, sentence builder, memory match.
window.GamesModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎮 Games</h1>
        <p>Drill the patterns through play. Faster, stickier, more fun than rote review.</p>
      </div>
      <div class="grid">
        <div class="card" onclick="App.go('games', { game: 'gender' })"><div class="icon">⚖️</div><h3>Gender Sort</h3><p>Drag nouns to masculine or feminine. Fastest gender-mastery drill.</p></div>
        <div class="card" onclick="App.go('games', { game: 'conjrace' })"><div class="icon">🏁</div><h3>Conjugation Race</h3><p>Type the right verb form before time runs out.</p></div>
        <div class="card" onclick="App.go('games', { game: 'sentence' })"><div class="icon">🧩</div><h3>Sentence Builder</h3><p>Arrange words into correct French sentences.</p></div>
        <div class="card" onclick="App.go('games', { game: 'memory' })"><div class="icon">🧠</div><h3>Memory Match</h3><p>Match French to English. Builds recognition speed.</p></div>
      </div>`;
  }

  // -------- Gender Sort --------
  function genderSort(container) {
    const pool = [];
    for (const k of ['family', 'food', 'home', 'body', 'time', 'places']) {
      VOCAB[k].cards.forEach(c => { if (c.g) pool.push({ ...c, deck: k }); });
    }
    let round = pool.sort(() => Math.random() - 0.5).slice(0, 10);
    let placed = 0, correct = 0;

    function render() {
      container.innerHTML = `
        <div class="lesson">
          <h2>⚖️ Gender Sort</h2>
          <p style="color:var(--mute);margin-bottom:14px">Drag each noun into the correct gender bucket. ${placed}/${round.length} placed.</p>
          <div class="row" style="gap:14px;align-items:stretch">
            <div class="dnd-zone" data-g="m" style="flex:1"><h4>🔵 Masculin (le / un)</h4></div>
            <div class="dnd-zone" data-g="f" style="flex:1"><h4>🔴 Féminin (la / une)</h4></div>
          </div>
          <div class="spacer"></div>
          <div class="dnd-zone" id="pool"><h4>Drag from here</h4>
            ${round.map((c, i) => `<div class="token ${c.g === 'f' ? 'fem' : ''}" draggable="true" data-i="${i}">${c.fr.replace(/^(le |la |l'|les )/, '')}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Games</button>
            <button class="btn" id="reset">Reset</button>
          </div>
        </div>`;
      container.querySelector('#reset').onclick = () => { placed = 0; correct = 0; round = pool.sort(() => Math.random() - 0.5).slice(0, 10); render(); };

      let dragging = null;
      container.querySelectorAll('.token').forEach(t => {
        t.ondragstart = (e) => { dragging = t; e.dataTransfer.effectAllowed = 'move'; };
      });
      container.querySelectorAll('.dnd-zone').forEach(z => {
        z.ondragover = (e) => { e.preventDefault(); z.classList.add('over'); };
        z.ondragleave = () => z.classList.remove('over');
        z.ondrop = (e) => {
          e.preventDefault();
          z.classList.remove('over');
          if (!dragging || !z.dataset.g) return;
          const i = parseInt(dragging.dataset.i);
          const c = round[i];
          if (z.dataset.g === c.g) {
            z.appendChild(dragging);
            dragging.style.borderColor = 'var(--good)';
            correct++;
            App.addXP(3);
          } else {
            dragging.style.borderColor = 'var(--bad)';
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">❌ "${c.fr}" is ${c.g === 'f' ? 'féminin' : 'masculin'} — ${c.en}</div>`;
            setTimeout(() => { container.querySelector('#fb').innerHTML = ''; }, 1800);
          }
          placed++;
          if (placed >= round.length) {
            setTimeout(() => {
              container.querySelector('#fb').innerHTML = `<div class="feedback good">🎉 Round done! ${correct}/${round.length} correct.</div>`;
              if (correct / round.length >= 0.7) App.markLessonDone('games:gender');
            }, 300);
          }
          dragging = null;
        };
      });
    }
    render();
  }

  // -------- Conjugation Race --------
  function conjRace(container) {
    const drills = [
      { inf: 'parler', subj: 'je', a: 'parle' }, { inf: 'parler', subj: 'nous', a: 'parlons' },
      { inf: 'manger', subj: 'tu', a: 'manges' }, { inf: 'manger', subj: 'ils', a: 'mangent' },
      { inf: 'aimer', subj: 'elle', a: 'aime' }, { inf: 'aimer', subj: 'vous', a: 'aimez' },
      { inf: 'être', subj: 'je', a: 'suis' }, { inf: 'être', subj: 'nous', a: 'sommes' },
      { inf: 'être', subj: 'ils', a: 'sont' }, { inf: 'avoir', subj: 'j\'', a: 'ai' },
      { inf: 'avoir', subj: 'vous', a: 'avez' }, { inf: 'avoir', subj: 'elles', a: 'ont' },
      { inf: 'aller', subj: 'je', a: 'vais' }, { inf: 'aller', subj: 'nous', a: 'allons' },
      { inf: 'aller', subj: 'tu', a: 'vas' }, { inf: 'faire', subj: 'je', a: 'fais' },
      { inf: 'faire', subj: 'nous', a: 'faisons' }, { inf: 'faire', subj: 'ils', a: 'font' },
    ];
    let queue = drills.sort(() => Math.random() - 0.5);
    let i = 0, correct = 0, time = 60, timer = null;

    function tick() {
      time--;
      const el = container.querySelector('#time');
      if (el) el.textContent = time;
      if (time <= 0) { clearInterval(timer); finish(); }
    }

    function show() {
      if (i >= queue.length) return finish();
      const d = queue[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🏁 Conjugation Race</h2>
          <div class="row" style="justify-content:space-between;margin-bottom:14px">
            <span>Score: <b>${correct}</b></span>
            <span>⏱ <b id="time">${time}</b>s</span>
            <span>${i + 1} / ${queue.length}</span>
          </div>
          <div class="q-prompt center" style="font-size:28px"><b>${d.subj}</b> ___ <i>(${d.inf})</i></div>
          <input class="input" id="ans" placeholder="Type the verb..." autocomplete="off" autocapitalize="off" />
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Quit</button>
            <button class="btn" id="submit">Submit (Enter)</button>
          </div>
        </div>`;
      const inp = container.querySelector('#ans');
      inp.focus();
      const submit = () => {
        const v = inp.value.trim().toLowerCase();
        if (v === d.a.toLowerCase()) {
          correct++;
          App.addXP(4);
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓</div>`;
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ ${d.subj} <b>${d.a}</b></div>`;
        }
        setTimeout(() => { i++; show(); }, 700);
      };
      container.querySelector('#submit').onclick = submit;
      inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    }
    function finish() {
      clearInterval(timer);
      if (correct >= 8) App.markLessonDone('games:conjrace');
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🏆</div>
            <h2>Race Done!</h2>
            <p>Correct: <b>${correct}</b> / ${i || queue.length}</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('games', { game: 'conjrace' })">Race Again</button>
            <button class="btn ghost big" onclick="App.go('games')">Other Games</button>
          </div>
        </div>`;
    }
    show();
    timer = setInterval(tick, 1000);
  }

  // -------- Sentence Builder --------
  function sentenceBuilder(container) {
    const sentences = [
      { fr: ['Je', 'mange', 'une', 'pomme', 'rouge'], en: 'I eat a red apple.' },
      { fr: ['Nous', 'allons', 'au', 'parc', 'demain'], en: 'We are going to the park tomorrow.' },
      { fr: ['Elle', 'a', 'deux', 'frères'], en: 'She has two brothers.' },
      { fr: ['Le', 'chat', 'noir', 'dort', 'sur', 'le', 'lit'], en: 'The black cat sleeps on the bed.' },
      { fr: ['Hier', "j'", 'ai', 'mangé', 'au', 'restaurant'], en: 'Yesterday I ate at the restaurant.' },
      { fr: ['Quand', 'j\'étais', 'petit', 'je', 'jouais', 'au', 'football'], en: 'When I was little I played football.' },
    ];
    let i = 0, correct = 0;
    function show() {
      if (i >= sentences.length) return finish();
      const s = sentences[i];
      const shuffled = [...s.fr].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="lesson">
          <h2>🧩 Sentence Builder</h2>
          <div class="progress"><div style="width:${(i / sentences.length) * 100}%"></div></div>
          <p><b>Translate:</b> "${s.en}"</p>
          <div class="spacer"></div>
          <div class="dnd-zone" id="answer"><h4>Your sentence</h4></div>
          <div class="spacer"></div>
          <div class="dnd-zone" id="pool"><h4>Word bank</h4>
            ${shuffled.map((w, k) => `<div class="token" data-w="${w}" data-k="${k}">${w}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Quit</button>
            <button class="btn" id="check">Check</button>
          </div>
        </div>`;
      const pool = container.querySelector('#pool');
      const answer = container.querySelector('#answer');
      container.querySelectorAll('.token').forEach(t => {
        t.onclick = () => {
          if (t.parentElement === pool) answer.appendChild(t);
          else pool.appendChild(t);
        };
      });
      container.querySelector('#check').onclick = () => {
        const built = Array.from(answer.querySelectorAll('.token')).map(t => t.dataset.w).join(' ');
        const target = s.fr.join(' ');
        if (built.toLowerCase() === target.toLowerCase()) {
          correct++;
          App.addXP(10);
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Parfait! "${target}"</div>`;
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ You: "${built}"<br>Correct: "${target}"</div>`;
        }
        setTimeout(() => { i++; show(); }, 1800);
      };
    }
    function finish() {
      if (correct >= sentences.length * 0.7) App.markLessonDone('games:sentence');
      container.innerHTML = `<div class="lesson center"><div class="empty"><div class="big-icon">🧩</div><h2>Done!</h2><p>Score: <b>${correct}/${sentences.length}</b></p><div class="spacer"></div><button class="btn big" onclick="App.go('games')">More Games</button></div></div>`;
    }
    show();
  }

  // -------- Memory Match --------
  function memoryMatch(container) {
    const pool = VOCAB.food.cards.concat(VOCAB.body.cards).concat(VOCAB.colors.cards);
    const pairs = pool.sort(() => Math.random() - 0.5).slice(0, 8);
    const tiles = [];
    pairs.forEach((c, idx) => {
      tiles.push({ id: idx, side: 'fr', text: c.fr, match: idx });
      tiles.push({ id: idx, side: 'en', text: c.en, match: idx });
    });
    tiles.sort(() => Math.random() - 0.5);
    let flipped = [], matched = 0, attempts = 0;

    function render() {
      container.innerHTML = `
        <div class="lesson">
          <h2>🧠 Memory Match</h2>
          <p style="color:var(--mute)">Match French to English. Attempts: <b id="att">${attempts}</b></p>
          <div class="spacer"></div>
          <div class="memory-grid" id="grid"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Games</button>
          </div>
        </div>`;
      const grid = container.querySelector('#grid');
      tiles.forEach((t, k) => {
        const el = document.createElement('div');
        el.className = 'mem-card';
        el.textContent = '?';
        el.dataset.k = k;
        el.onclick = () => flip(k, el);
        grid.appendChild(el);
      });
    }
    function flip(k, el) {
      if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
      if (flipped.length === 2) return;
      el.classList.add('flipped');
      el.textContent = tiles[k].text;
      flipped.push({ k, el });
      if (flipped.length === 2) {
        attempts++;
        container.querySelector('#att').textContent = attempts;
        const [a, b] = flipped;
        if (tiles[a.k].match === tiles[b.k].match && tiles[a.k].side !== tiles[b.k].side) {
          setTimeout(() => {
            a.el.classList.add('matched'); b.el.classList.add('matched');
            flipped = []; matched++;
            App.addXP(4);
            if (matched === tiles.length / 2) {
              App.markLessonDone('games:memory');
              setTimeout(() => alert(`🎉 Done in ${attempts} attempts!`), 400);
            }
          }, 350);
        } else {
          setTimeout(() => {
            a.el.classList.remove('flipped'); a.el.textContent = '?';
            b.el.classList.remove('flipped'); b.el.textContent = '?';
            flipped = [];
          }, 900);
        }
      }
    }
    render();
  }

  return {
    render(container, params) {
      const g = params && params.game;
      if (g === 'gender') return genderSort(container);
      if (g === 'conjrace') return conjRace(container);
      if (g === 'sentence') return sentenceBuilder(container);
      if (g === 'memory') return memoryMatch(container);
      return renderList(container);
    }
  };
})();
