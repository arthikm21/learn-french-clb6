// Interactive games — all click/tap-based for mobile compatibility.
window.GamesModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Games'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Games</p>
        <h1>Drill it.<br/>Through play.</h1>
        <p style="margin-top:var(--sp-4)">Nine games. Pattern recognition through repetition without grinding.</p>
      </section>
      <div class="grid">
        <div class="card" onclick="App.go('games', { game: 'gender' })"><div class="icon">⚖️</div><h3>Gender Sort</h3><p>Tap noun, tap masculin or féminin. Fastest gender-mastery drill.</p></div>
        <div class="card" onclick="App.go('games', { game: 'conjrace' })"><div class="icon">🏁</div><h3>Conjugation Race</h3><p>Type the right verb form before time runs out.</p></div>
        <div class="card" onclick="App.go('games', { game: 'sentence' })"><div class="icon">🧩</div><h3>Sentence Builder</h3><p>Arrange words into correct French sentences.</p></div>
        <div class="card" onclick="App.go('games', { game: 'memory' })"><div class="icon">🧠</div><h3>Memory Match</h3><p>Match French to English. Builds recognition speed.</p></div>
        <div class="card" onclick="App.go('games', { game: 'translate' })"><div class="icon">🌐</div><h3>Quick Translate</h3><p>See French → pick English meaning. Speed-builds vocab.</p></div>
        <div class="card" onclick="App.go('games', { game: 'verb' })"><div class="icon">⚡</div><h3>Tense Picker</h3><p>Which tense fits? Pick passé composé, imparfait, futur...</p></div>
        <div class="card" onclick="App.go('games', { game: 'dictation' })"><div class="icon">📝</div><h3>Dictation Race</h3><p>Hear a sentence, type it within the time limit. Builds ear+spelling.</p></div>
        <div class="card" onclick="App.go('games', { game: 'errorspot' })"><div class="icon">🔍</div><h3>Spot the Error</h3><p>See a sentence with one mistake — find and fix it.</p></div>
        <div class="card" onclick="App.go('games', { game: 'anagram' })"><div class="icon">🔤</div><h3>Verb Anagram</h3><p>Scrambled letters → spell the correct verb conjugation.</p></div>
      </div>`;
  }

  // -------- Gender Sort (click-to-place) --------
  function genderSort(container) {
    const pool = [];
    for (const k of Object.keys(VOCAB)) {
      (VOCAB[k].cards || []).forEach(c => { if (c.g) pool.push({ ...c, deck: k }); });
    }
    let round = pool.sort(() => Math.random() - 0.5).slice(0, 12);
    let i = 0, correct = 0;

    function show() {
      if (i >= round.length) return finish();
      const c = round[i];
      const noun = c.fr.replace(/^(le |la |l'|les |un |une |des )/, '');
      container.innerHTML = `
        <div class="lesson">
          <h2>⚖️ Gender Sort</h2>
          <div class="progress"><div style="width:${(i / round.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between;margin-bottom:10px">
            <span>Score: <b>${correct}</b></span>
            <span>${i + 1} / ${round.length}</span>
          </div>
          <div class="center">
            <p style="color:var(--mute);font-size:14px">Is this noun masculine or feminine?</p>
            <div style="font-family:'Fredoka';font-size:48px;margin:20px 0;color:var(--ink)">${c.emoji || '🇫🇷'} ${noun}</div>
            <button class="btn secondary" id="hear">🔊 Hear pronunciation</button>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:center;gap:14px">
            <button class="btn big" data-g="m" style="background:var(--bleu);min-width:180px;font-size:18px">🔵 Le / un (masc)</button>
            <button class="btn big" data-g="f" style="background:var(--rouge);min-width:180px;font-size:18px">🔴 La / une (fém)</button>
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Quit</button>
            <span style="color:var(--mute)">${c.en}</span>
          </div>
        </div>`;
      container.querySelector('#hear').onclick = () => TTS.speak(c.fr);
      setTimeout(() => TTS.speak(c.fr), 300);
      container.querySelectorAll('[data-g]').forEach(b => {
        b.onclick = () => {
          container.querySelectorAll('[data-g]').forEach(x => x.disabled = true);
          if (b.dataset.g === c.g) {
            correct++;
            App.addXP(3);
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! <b>${c.g === 'f' ? 'la' : 'le'} ${noun}</b> — ${c.en}</div>`;
          } else {
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ It's ${c.g === 'f' ? '<b>féminin</b>: la' : '<b>masculin</b>: le'} ${noun}</div>`;
            MistakesModule.record({
              type: 'gender',
              sig: `gender:${c.fr}`,
              prompt: `Gender of <b>${noun}</b>?`,
              correct: c.g === 'f' ? `la ${noun} (féminin)` : `le ${noun} (masculin)`,
              your: c.g === 'f' ? `le ${noun}` : `la ${noun}`,
            });
          }
          setTimeout(() => { i++; show(); }, 1500);
        };
      });
    }
    function finish() {
      if (correct / round.length >= 0.7) App.markLessonDone('games:gender');
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">⚖️</div>
            <h2>Round Complete</h2>
            <p>Correct: <b>${correct}/${round.length}</b></p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('games', { game: 'gender' })">Play Again</button>
            <button class="btn ghost big" onclick="App.go('games')">Other Games</button>
          </div>
        </div>`;
    }
    show();
  }

  // -------- Conjugation Race --------
  function conjRace(container) {
    const drills = [
      { inf: 'parler', subj: 'je', a: 'parle' }, { inf: 'parler', subj: 'nous', a: 'parlons' },
      { inf: 'manger', subj: 'tu', a: 'manges' }, { inf: 'manger', subj: 'ils', a: 'mangent' },
      { inf: 'aimer', subj: 'elle', a: 'aime' }, { inf: 'aimer', subj: 'vous', a: 'aimez' },
      { inf: 'être', subj: 'je', a: 'suis' }, { inf: 'être', subj: 'nous', a: 'sommes' },
      { inf: 'être', subj: 'ils', a: 'sont' }, { inf: 'avoir', subj: "j'", a: 'ai' },
      { inf: 'avoir', subj: 'vous', a: 'avez' }, { inf: 'avoir', subj: 'elles', a: 'ont' },
      { inf: 'aller', subj: 'je', a: 'vais' }, { inf: 'aller', subj: 'nous', a: 'allons' },
      { inf: 'aller', subj: 'tu', a: 'vas' }, { inf: 'faire', subj: 'je', a: 'fais' },
      { inf: 'faire', subj: 'nous', a: 'faisons' }, { inf: 'faire', subj: 'ils', a: 'font' },
      { inf: 'pouvoir', subj: 'je', a: 'peux' }, { inf: 'pouvoir', subj: 'nous', a: 'pouvons' },
      { inf: 'vouloir', subj: 'tu', a: 'veux' }, { inf: 'vouloir', subj: 'ils', a: 'veulent' },
      { inf: 'venir', subj: 'je', a: 'viens' }, { inf: 'venir', subj: 'nous', a: 'venons' },
    ];
    let queue = drills.sort(() => Math.random() - 0.5);
    let i = 0, correct = 0, time = 75, timer = null, aborted = false;

    // Stop timer if user navigates away mid-race.
    const onHash = () => {
      if (!location.hash.startsWith('#games')) {
        aborted = true;
        clearInterval(timer);
        window.removeEventListener('hashchange', onHash);
      }
    };
    window.addEventListener('hashchange', onHash);

    function tick() {
      if (aborted) return;
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
          <div class="q-prompt center" style="font-size:32px"><b>${d.subj}</b> ___ <i style="color:var(--mute);font-size:20px">(${d.inf})</i></div>
          <input class="input" id="ans" placeholder="Type the verb form..." autocomplete="off" autocapitalize="off" />
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
          MistakesModule.record({
            type: 'verb',
            sig: `conj:${d.inf}:${d.subj}`,
            prompt: `${d.subj} ___ (${d.inf})`,
            correct: d.a,
            your: v || '(blank)',
          });
        }
        setTimeout(() => { i++; show(); }, 700);
      };
      container.querySelector('#submit').onclick = submit;
      inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    }
    function finish() {
      clearInterval(timer);
      window.removeEventListener('hashchange', onHash);
      if (aborted) return; // user navigated away — don't overwrite their current view
      if (correct >= 10) App.markLessonDone('games:conjrace');
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🏆</div>
            <h2>Race Done!</h2>
            <p>Correct: <b>${correct}</b> in ${75 - time}s</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('games', { game: 'conjrace' })">Race Again</button>
            <button class="btn ghost big" onclick="App.go('games')">Other Games</button>
          </div>
        </div>`;
    }
    show();
    timer = setInterval(tick, 1000);
  }

  // -------- Sentence Builder (click-to-move, no drag) --------
  function sentenceBuilder(container) {
    const sentences = window.SENTENCES;
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
          <div class="dnd-zone" id="answer"><h4>Your sentence (tap word to remove)</h4></div>
          <div class="spacer"></div>
          <div class="dnd-zone" id="pool"><h4>Word bank (tap to add)</h4>
            ${shuffled.map((w, k) => `<div class="token" data-w="${escapeAttr(w)}" data-k="${k}">${w}</div>`).join('')}
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
        const built = Array.from(answer.querySelectorAll('.token')).map(t => t.dataset.w).join(' ').replace(/\s+/g, ' ').trim();
        const target = s.fr.join(' ');
        if (built.toLowerCase().replace(/\s+/g, ' ') === target.toLowerCase().replace(/\s+/g, ' ')) {
          correct++;
          App.addXP(10);
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Parfait!</div>`;
          TTS.speak(target);
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Correct: <b>${target}</b></div>`;
          MistakesModule.record({
            type: 'sentence',
            sig: `sent:${i}`,
            prompt: `Translate: ${s.en}`,
            correct: target,
            your: built || '(empty)',
          });
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
    const pool = [];
    for (const k of Object.keys(VOCAB)) (VOCAB[k].cards || []).forEach(c => pool.push(c));
    const pairs = pool.sort(() => Math.random() - 0.5).slice(0, 8);
    const tiles = [];
    pairs.forEach((c, idx) => {
      tiles.push({ id: idx, side: 'fr', text: c.fr, match: idx, audio: c.fr });
      tiles.push({ id: idx, side: 'en', text: c.en, match: idx, audio: null });
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
      if (tiles[k].audio) TTS.speak(tiles[k].audio);
      flipped.push({ k, el });
      if (flipped.length === 2) {
        attempts++;
        const att = container.querySelector('#att'); if (att) att.textContent = attempts;
        const [a, b] = flipped;
        if (tiles[a.k].match === tiles[b.k].match && tiles[a.k].side !== tiles[b.k].side) {
          setTimeout(() => {
            a.el.classList.add('matched'); b.el.classList.add('matched');
            flipped = []; matched++;
            App.addXP(4);
            if (matched === tiles.length / 2) {
              App.markLessonDone('games:memory');
              setTimeout(() => Toast.good(`🎉 Done in ${attempts} attempts!`, 3500), 400);
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

  // -------- Quick Translate --------
  function quickTranslate(container) {
    const pool = [];
    for (const k of Object.keys(VOCAB)) (VOCAB[k].cards || []).forEach(c => pool.push(c));
    let queue = pool.sort(() => Math.random() - 0.5).slice(0, 15);
    let i = 0, correct = 0;
    function show() {
      if (i >= queue.length) return finish();
      const c = queue[i];
      // 3 wrong distractors
      const others = pool.filter(p => p.en !== c.en).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [...others.map(o => o.en), c.en].sort(() => Math.random() - 0.5);
      const correctIdx = opts.indexOf(c.en);
      container.innerHTML = `
        <div class="lesson">
          <h2>🌐 Quick Translate</h2>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>${correct} / ${queue.length}</span><span>${i + 1}</span></div>
          <div class="center"><div style="font-family:'Fredoka';font-size:40px;margin:20px 0;color:var(--bleu)">${c.fr}</div><button class="btn secondary" id="hear">🔊</button></div>
          <div class="spacer"></div>
          <div class="options">${opts.map((o, k) => `<div class="option" data-i="${k}">${o}</div>`).join('')}</div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row"><button class="btn ghost" onclick="App.go('games')">← Quit</button></div>
        </div>`;
      container.querySelector('#hear').onclick = () => TTS.speak(c.fr);
      setTimeout(() => TTS.speak(c.fr), 200);
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const sel = parseInt(el.dataset.i);
          if (sel === correctIdx) {
            el.classList.add('correct'); correct++; App.addXP(4);
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓</div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[correctIdx].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ ${c.fr} = <b>${c.en}</b></div>`;
            MistakesModule.record({ type: 'vocab', sig: `vocab:${c.fr}`, prompt: `What does <b>${c.fr}</b> mean?`, correct: c.en, your: opts[sel] });
          }
          setTimeout(() => { i++; show(); }, 1100);
        };
      });
    }
    function finish() {
      if (correct >= queue.length * 0.7) App.markLessonDone('games:translate');
      container.innerHTML = `<div class="lesson center"><div class="empty"><div class="big-icon">🌐</div><h2>Round Done</h2><p>${correct}/${queue.length} correct</p><div class="spacer"></div><button class="btn big" onclick="App.go('games', { game: 'translate' })">Play Again</button><button class="btn ghost big" onclick="App.go('games')">Other Games</button></div></div>`;
    }
    show();
  }

  // -------- Tense Picker --------
  function tensePicker(container) {
    const drills = [
      { fr: 'Hier, je ___ au parc.', opts: ['vais', 'suis allé', 'irai'], a: 1, why: 'Hier → passé composé.' },
      { fr: 'Demain je ___ mes parents.', opts: ['visite', 'visitais', 'vais visiter'], a: 2, why: 'Demain → futur proche.' },
      { fr: 'Quand j\'étais petit, je ___ au foot.', opts: ['joue', 'jouais', 'ai joué'], a: 1, why: 'Habit in past → imparfait.' },
      { fr: 'Si j\'avais le temps, je ___ plus.', opts: ['lirai', 'lirais', 'lis'], a: 1, why: 'Si + imparfait → conditionnel.' },
      { fr: 'Il faut que je ___ tôt.', opts: ['pars', 'parte', 'partirai'], a: 1, why: 'Il faut que → subjonctif.' },
      { fr: 'Quand je suis arrivé, le film ___ commencé.', opts: ['a', 'avait', 'aura'], a: 1, why: 'Earlier-past → plus-que-parfait.' },
      { fr: 'En ce moment, je ___ la télé.', opts: ['regarde', 'regardais', 'ai regardé'], a: 0, why: 'En ce moment → présent.' },
      { fr: 'L\'année prochaine, je ___ français couramment.', opts: ['parle', 'parlerai', 'parlerais'], a: 1, why: 'L\'année prochaine → futur simple.' },
      { fr: 'Il ___ tous les soirs avant 2020.', opts: ['lit', 'lisait', 'a lu'], a: 1, why: 'Tous les soirs (past) → imparfait.' },
      { fr: 'Si tu étudies, tu ___.', opts: ['réussis', 'réussiras', 'réussirais'], a: 1, why: 'Si + présent → futur simple.' },
    ];
    let queue = drills.sort(() => Math.random() - 0.5);
    let i = 0, correct = 0;
    function show() {
      if (i >= queue.length) return finish();
      const d = queue[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>⚡ Tense Picker</h2>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${i+1}/${queue.length}</span></div>
          <div class="q-prompt">${d.fr}</div>
          <div class="options">${d.opts.map((o, k) => `<div class="option" data-i="${k}">${o}</div>`).join('')}</div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row"><button class="btn ghost" onclick="App.go('games')">← Quit</button></div>
        </div>`;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const sel = parseInt(el.dataset.i);
          if (sel === d.a) {
            el.classList.add('correct'); correct++; App.addXP(5);
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ ${d.why}</div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[d.a].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ ${d.why}</div>`;
            MistakesModule.record({ type: 'tense', sig: `tense:${i}`, prompt: d.fr, correct: d.opts[d.a], your: d.opts[sel] });
          }
          setTimeout(() => { i++; show(); }, 1800);
        };
      });
    }
    function finish() {
      if (correct >= queue.length * 0.7) App.markLessonDone('games:verb');
      container.innerHTML = `<div class="lesson center"><div class="empty"><div class="big-icon">⚡</div><h2>Done</h2><p>${correct}/${queue.length}</p><div class="spacer"></div><button class="btn big" onclick="App.go('games', { game: 'verb' })">Again</button><button class="btn ghost big" onclick="App.go('games')">Other</button></div></div>`;
    }
    show();
  }

  function escapeAttr(s) {
    return String(s).replace(/[&"<>']/g, c => ({'&':'&amp;','"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'}[c]));
  }

  // -------- Dictation Race --------
  function dictationRace(container) {
    // Pull sentences from listening + dialogue
    const pool = [];
    if (window.LISTENING) for (const k of Object.keys(window.LISTENING)) {
      for (const it of window.LISTENING[k].items) pool.push(it.audio);
    }
    if (pool.length === 0) { container.innerHTML = '<div class="lesson"><p>No sentences available.</p></div>'; return; }
    let queue = pool.sort(() => Math.random() - 0.5).slice(0, 10);
    let i = 0, correct = 0, time = 120, timer = null, aborted = false;
    const onHash = () => { if (!location.hash.startsWith('#games')) { aborted = true; clearInterval(timer); window.removeEventListener('hashchange', onHash); } };
    window.addEventListener('hashchange', onHash);

    function tick() {
      if (aborted) return;
      time--;
      const el = container.querySelector('#dtime');
      if (el) el.textContent = time;
      if (time <= 0) { clearInterval(timer); finish(); }
    }
    function show() {
      if (i >= queue.length) return finish();
      const target = queue[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>📝 Dictation Race</h2>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>⏱ <b id="dtime">${time}</b>s</span><span>${i+1}/${queue.length}</span></div>
          <div class="spacer"></div>
          <div class="center">
            <button class="btn big" id="play">🔊 Play (again)</button>
            <button class="btn secondary" id="slow">🐢 Slow</button>
          </div>
          <div class="spacer"></div>
          <input class="input" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type what you hear..."/>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Quit</button>
            <button class="btn" id="submit">Check (Enter)</button>
          </div>
        </div>`;
      container.querySelector('#play').onclick = () => TTS.speak(target, 0.95);
      container.querySelector('#slow').onclick = () => TTS.speak(target, 0.65);
      setTimeout(() => TTS.speak(target, 0.9), 200);
      const inp = container.querySelector('#ans');
      inp.focus();
      const submit = () => {
        const ans = inp.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
        const targ = target.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
        if (ans === targ) {
          correct++;
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! <small>${target}</small></div>`;
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Was: <b>${target}</b></div>`;
        }
        setTimeout(() => { i++; show(); }, 1600);
      };
      container.querySelector('#submit').onclick = submit;
      inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    }
    function finish() {
      clearInterval(timer);
      window.removeEventListener('hashchange', onHash);
      if (aborted) return;
      if (correct >= 7) App.markLessonDone('games:dictation');
      container.innerHTML = `<div class="lesson center"><div class="empty"><div class="big-icon">📝</div><h2>Dictation Done</h2><p>Correct: <b>${correct}/${queue.length}</b> in ${120 - time}s</p><div class="spacer"></div><button class="btn big" onclick="App.go('games', { game: 'dictation' })">Race Again</button><button class="btn ghost big" onclick="App.go('games')">Other Games</button></div></div>`;
    }
    show();
    timer = setInterval(tick, 1000);
  }

  // -------- Spot the Error --------
  function errorSpot(container) {
    const drills = [
      { wrong: 'Je ai un livre rouge.', correct: "J'ai un livre rouge.", hint: 'Elision required: je + vowel → j\'.' },
      { wrong: 'Hier, j\'ai allé au parc.', correct: 'Hier, je suis allé au parc.', hint: 'Aller uses être in passé composé.' },
      { wrong: 'Si je serai riche, je voyagerai.', correct: 'Si je suis riche, je voyagerai.', hint: 'Never use futur after si of condition — use present.' },
      { wrong: 'Je suis 25 ans.', correct: "J'ai 25 ans.", hint: 'For age, French uses AVOIR.' },
      { wrong: 'Elle est venu hier.', correct: 'Elle est venue hier.', hint: 'Past participle agrees with subject for être verbs.' },
      { wrong: 'Un femme habite ici.', correct: 'Une femme habite ici.', hint: 'Femme is feminine — use "une".' },
      { wrong: 'Le école est fermée.', correct: "L'école est fermée.", hint: 'Elision before vowel: le + é → l\'.' },
      { wrong: 'Je ne mange.', correct: 'Je ne mange pas.', hint: 'Negation needs both ne AND pas (or jamais/rien/plus).' },
      { wrong: 'Des chats noir dorment.', correct: 'Des chats noirs dorment.', hint: 'Adjective must agree with plural noun.' },
      { wrong: 'Quand j\'étais petit, j\'ai joué au foot tous les jours.', correct: 'Quand j\'étais petit, je jouais au foot tous les jours.', hint: 'Tous les jours = habit → imparfait, not passé composé.' },
      { wrong: 'C\'est meilleur que l\'autre.', correct: 'Il est meilleur que l\'autre.', hint: 'Comparing two things → il/elle est, not c\'est.' },
      { wrong: 'Il y a un homme qui je connais.', correct: 'Il y a un homme que je connais.', hint: 'Relative pronoun as direct object → que (not qui).' },
    ];
    let queue = drills.sort(() => Math.random() - 0.5).slice(0, 8);
    let i = 0, correct = 0;
    function show() {
      if (i >= queue.length) return finish();
      const d = queue[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🔍 Spot the Error</h2>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${i+1}/${queue.length}</span></div>
          <p style="color:var(--mute);margin:14px 0">This sentence has ONE error. Type the corrected sentence below.</p>
          <div class="grammar-box" style="border-left-color:var(--bad)">
            <p style="font-size:19px;font-family:'Fredoka',sans-serif;color:var(--bad)">${d.wrong}</p>
          </div>
          <input class="input" id="ans" placeholder="Type the corrected version..." autocomplete="off"/>
          <div class="row" style="margin-top:8px"><button class="btn secondary" id="hint">💡 Hint</button></div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Quit</button>
            <button class="btn" id="submit">Check</button>
          </div>
        </div>`;
      const inp = container.querySelector('#ans');
      inp.focus();
      container.querySelector('#hint').onclick = () => { Toast.info(d.hint, 5000); };
      const submit = () => {
        const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
        if (norm(inp.value) === norm(d.correct)) {
          correct++;
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ ${d.correct} <br><small>${d.hint}</small></div>`;
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Correct: <b>${d.correct}</b><br><small>${d.hint}</small></div>`;
          MistakesModule.record({ type: 'error-spot', sig: `errspot:${i}`, prompt: d.wrong, correct: d.correct, your: inp.value || '(empty)' });
        }
        setTimeout(() => { i++; show(); }, 2400);
      };
      container.querySelector('#submit').onclick = submit;
      inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    }
    function finish() {
      if (correct >= queue.length * 0.6) App.markLessonDone('games:errorspot');
      container.innerHTML = `<div class="lesson center"><div class="empty"><div class="big-icon">🔍</div><h2>Done</h2><p>${correct}/${queue.length} fixed correctly.</p><div class="spacer"></div><button class="btn big" onclick="App.go('games', { game: 'errorspot' })">Play Again</button><button class="btn ghost big" onclick="App.go('games')">Other Games</button></div></div>`;
    }
    show();
  }

  // -------- Verb Anagram --------
  function verbAnagram(container) {
    const drills = [
      { subj: 'je', inf: 'être', target: 'suis' },
      { subj: 'tu', inf: 'avoir', target: 'as' },
      { subj: 'nous', inf: 'aller', target: 'allons' },
      { subj: 'ils', inf: 'faire', target: 'font' },
      { subj: 'elle', inf: 'prendre', target: 'prend' },
      { subj: 'vous', inf: 'venir', target: 'venez' },
      { subj: 'je', inf: 'pouvoir', target: 'peux' },
      { subj: 'nous', inf: 'vouloir', target: 'voulons' },
      { subj: 'il', inf: 'savoir', target: 'sait' },
      { subj: 'tu', inf: 'voir', target: 'vois' },
      { subj: 'ils', inf: 'parler', target: 'parlent' },
      { subj: 'elle', inf: 'finir', target: 'finit' },
    ];
    let queue = drills.sort(() => Math.random() - 0.5).slice(0, 8);
    let i = 0, correct = 0;
    function show() {
      if (i >= queue.length) return finish();
      const d = queue[i];
      const letters = d.target.split('').sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="lesson">
          <h2>🔤 Verb Anagram</h2>
          <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${i+1}/${queue.length}</span></div>
          <div class="center" style="margin:18px 0">
            <p style="font-size:18px;color:var(--mute)">Conjugate:</p>
            <p style="font-family:'Fredoka',sans-serif;font-size:30px;color:var(--bleu)">${d.subj} ___ <i style="color:var(--mute);font-size:20px">(${d.inf})</i></p>
          </div>
          <div class="dnd-zone" id="answer" style="min-height:60px;justify-content:center"><h4 style="text-align:center">Your answer (tap letter to remove)</h4></div>
          <div class="spacer"></div>
          <div class="dnd-zone" id="pool" style="justify-content:center"><h4 style="text-align:center">Letters (tap to add)</h4>
            ${letters.map((l, k) => `<div class="token" data-l="${l}" data-k="${k}" style="min-width:44px;justify-content:center;font-family:'Fredoka';font-size:20px">${l}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('games')">← Quit</button>
            <div class="row">
              <button class="btn secondary" id="reset">↺ Reset</button>
              <button class="btn" id="check">Check</button>
            </div>
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
      container.querySelector('#reset').onclick = () => {
        container.querySelectorAll('#answer .token').forEach(t => pool.appendChild(t));
      };
      container.querySelector('#check').onclick = () => {
        const built = Array.from(answer.querySelectorAll('.token')).map(t => t.dataset.l).join('');
        if (built === d.target) {
          correct++;
          container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ ${d.subj} ${d.target}</div>`;
          TTS.speak(d.subj + ' ' + d.target);
        } else {
          container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Should be <b>${d.target}</b>. (You: ${built || '(empty)'})</div>`;
          MistakesModule.record({ type: 'verb', sig: `anagram:${d.inf}:${d.subj}`, prompt: `${d.subj} ___ (${d.inf})`, correct: d.target, your: built || '(empty)' });
        }
        setTimeout(() => { i++; show(); }, 1700);
      };
    }
    function finish() {
      if (correct >= queue.length * 0.7) App.markLessonDone('games:anagram');
      container.innerHTML = `<div class="lesson center"><div class="empty"><div class="big-icon">🔤</div><h2>Done</h2><p>${correct}/${queue.length} correct.</p><div class="spacer"></div><button class="btn big" onclick="App.go('games', { game: 'anagram' })">Play Again</button><button class="btn ghost big" onclick="App.go('games')">Other Games</button></div></div>`;
    }
    show();
  }

  return {
    render(container, params) {
      const g = params && params.game;
      if (g === 'gender') return genderSort(container);
      if (g === 'conjrace') return conjRace(container);
      if (g === 'sentence') return sentenceBuilder(container);
      if (g === 'memory') return memoryMatch(container);
      if (g === 'translate') return quickTranslate(container);
      if (g === 'verb') return tensePicker(container);
      if (g === 'dictation') return dictationRace(container);
      if (g === 'errorspot') return errorSpot(container);
      if (g === 'anagram') return verbAnagram(container);
      return renderList(container);
    }
  };
})();
