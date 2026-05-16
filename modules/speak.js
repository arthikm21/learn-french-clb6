// Speaking: Web Speech recognition. User repeats target sentence, score by similarity.
window.SpeakModule = (function () {
  const SETS = {
    greetings: { title: 'Greetings', items: ['Bonjour, comment ça va ?', 'Je m\'appelle Alex.', 'Enchanté de te rencontrer.', 'Merci beaucoup.', 'Au revoir, à demain.'] },
    day: { title: 'Describe Your Day', items: ['Aujourd\'hui, je suis allé au parc.', 'J\'ai mangé une salade au déjeuner.', 'Je travaille de neuf heures à dix-sept heures.', 'Le soir, j\'ai regardé un film.'] },
    mock: { title: 'CLB 6 Mock Speaking', items: [
      'Pouvez-vous me dire où se trouve la gare la plus proche ?',
      'Quand j\'étais petit, je passais mes étés chez ma grand-mère.',
      'Si je gagne à la loterie, je voyagerai partout dans le monde.',
      'Je voudrais réserver une table pour deux personnes vendredi soir.',
      'Merci de votre temps. Je vous recontacterai la semaine prochaine.',
    ] },
  };

  function lev(a, b) {
    a = a.toLowerCase().replace(/[^a-zà-ÿ ]/gi, '').trim();
    b = b.toLowerCase().replace(/[^a-zà-ÿ ]/gi, '').trim();
    const m = [];
    for (let i = 0; i <= b.length; i++) m[i] = [i];
    for (let j = 0; j <= a.length; j++) m[0][j] = j;
    for (let i = 1; i <= b.length; i++)
      for (let j = 1; j <= a.length; j++)
        m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : 1 + Math.min(m[i-1][j-1], m[i][j-1], m[i-1][j]);
    return m[b.length][a.length];
  }
  function score(spoken, target) {
    const d = lev(spoken, target);
    const max = Math.max(target.length, 1);
    return Math.max(0, Math.round((1 - d / max) * 100));
  }

  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>🎙️ Speaking Mirror</h1>
        <p>Press the mic. Repeat the sentence aloud. Get scored. (Needs microphone permission + Chrome/Edge for best results.)</p>
      </div>
      <div class="grid" id="s-grid"></div>`;
    const grid = container.querySelector('#s-grid');
    for (const k of Object.keys(SETS)) {
      const s = SETS[k];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon">🎙️</div><h3>${s.title}</h3><p>${s.items.length} sentences</p>`;
      card.onclick = () => renderSet(container, k);
      grid.appendChild(card);
    }
  }

  function renderSet(container, setKey) {
    const s = SETS[setKey];
    let i = 0, total = 0;
    function show() {
      if (i >= s.items.length) return finish();
      const target = s.items[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>🎙️ ${s.title}</h2>
          <div class="progress"><div style="width:${(i / s.items.length) * 100}%"></div></div>
          <div class="center">
            <p style="font-size:20px;font-family:'Fredoka';color:var(--bleu);margin:18px 0">${target}</p>
            <button class="btn secondary" id="hear">🔊 Hear it</button>
          </div>
          <div class="spacer"></div>
          <div class="center">
            <button class="mic-btn" id="mic" title="Press and speak">🎙️</button>
            <p style="color:var(--mute);margin-top:10px;font-size:14px">Click mic, then speak.</p>
            <div class="transcript" id="trans">—</div>
            <div id="fb"></div>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('speak')">← Quit</button>
            <button class="btn" id="next">Skip / Next →</button>
          </div>
        </div>`;
      container.querySelector('#hear').onclick = () => TTS.speak(target);
      const mic = container.querySelector('#mic');
      const trans = container.querySelector('#trans');
      const fb = container.querySelector('#fb');
      const next = container.querySelector('#next');
      next.onclick = () => { i++; show(); };

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        fb.innerHTML = `<div class="feedback bad">Your browser doesn't support speech recognition. Try Chrome / Edge.</div>`;
        return;
      }
      const rec = new SR();
      rec.lang = 'fr-FR';
      rec.interimResults = false;
      rec.continuous = false;
      mic.onclick = () => {
        mic.classList.add('listening');
        trans.textContent = '🎤 Listening...';
        try { rec.start(); } catch {}
      };
      rec.onresult = (e) => {
        mic.classList.remove('listening');
        const heard = e.results[0][0].transcript;
        trans.textContent = '"' + heard + '"';
        const sc = score(heard, target);
        total += sc;
        if (sc >= 80) {
          App.addXP(10);
          fb.innerHTML = `<div class="feedback good">⭐ ${sc}% match — excellent!</div>`;
        } else if (sc >= 60) {
          App.addXP(5);
          fb.innerHTML = `<div class="feedback good">✓ ${sc}% — good, try once more for clarity.</div>`;
        } else {
          fb.innerHTML = `<div class="feedback bad">${sc}% — listen again and try.</div>`;
        }
      };
      rec.onerror = () => { mic.classList.remove('listening'); trans.textContent = 'No speech detected. Try again.'; };
      rec.onend = () => mic.classList.remove('listening');
    }
    function finish() {
      App.markLessonDone(`speak:${setKey}`);
      const avg = Math.round(total / s.items.length);
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🗣️</div>
            <h2>Speaking Session Complete</h2>
            <p>Avg pronunciation score: <b>${avg}%</b></p>
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
