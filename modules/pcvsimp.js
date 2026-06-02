// Passé Composé vs Imparfait Decider — dedicated mixed-drill unit.
window.PCvsImpModule = (function () {

  function render(container) {
    let phase = 'study'; // study → drill → done
    let drillIdx = 0;
    let correct = 0;
    const u = window.PC_VS_IMP;
    const drills = [...u.drills].sort(() => Math.random() - 0.5).slice(0, 12);

    function showStudy() {
      container.innerHTML = `
        <div class="lesson">
          <h2>⚔️ ${u.title} <span class="tag">${u.level}</span></h2>
          <p style="font-size:16px;line-height:1.6;margin:10px 0 16px">${u.intro}</p>
          ${u.framework.map(f => `
            <div class="grammar-box">
              <h3>${f.h}</h3>
              <p><b>Use:</b> ${f.use}</p>
              ${f.cues.length ? `<p style="margin-top:8px"><b>Signal words:</b> ${f.cues.map(c => `<span class="tag">${c}</span>`).join(' ')}</p>` : ''}
              ${f.examples.map(e => `<div class="example">${e}</div>`).join('')}
            </div>`).join('')}
          <div class="grammar-box" style="border-left-color:var(--warn)">
            <h3>🎯 Now drill: 12 mixed sentences</h3>
            <p>Below are sentences with a blank verb. Pick PC (passé composé) or Imp (imparfait) — get an explanation for every answer.</p>
            <div class="spacer"></div>
            <button class="btn big" id="start-drill">Start drill →</button>
          </div>
        </div>`;
      container.querySelector('#start-drill').onclick = () => { phase = 'drill'; showDrill(); };
    }

    function showDrill() {
      if (drillIdx >= drills.length) return finish();
      const d = drills[drillIdx];
      container.innerHTML = `
        <div class="lesson">
          <h2>⚔️ ${u.title}</h2>
          <div class="progress"><div style="width:${(drillIdx / drills.length) * 100}%"></div></div>
          <div class="row" style="justify-content:space-between"><span>Score: <b>${correct}</b></span><span>${drillIdx + 1}/${drills.length}</span></div>
          <div class="q-prompt" style="font-size:22px;line-height:1.6;margin:18px 0">${d.sentence}</div>
          <div class="options" style="grid-template-columns:1fr 1fr">
            <div class="option" data-pick="pc"><b style="display:block;color:var(--rouge);font-size:13px;margin-bottom:4px">PASSÉ COMPOSÉ</b>${d.pc}</div>
            <div class="option" data-pick="imp"><b style="display:block;color:var(--bleu);font-size:13px;margin-bottom:4px">IMPARFAIT</b>${d.imp}</div>
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row"><button class="btn ghost" onclick="App.go('pcvsimp')">← Quit</button></div>
        </div>`;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
          const pick = el.dataset.pick;
          const right = pick === d.correct;
          // Reveal full filled sentence + English gloss
          const verb = d.correct === 'pc' ? d.pc : d.imp;
          const filled = d.sentence.replace('___', `<b style="color:var(--accent)">${verb}</b>`);
          const reveal = `<div style="background:var(--surface-2);padding:var(--sp-3);border-radius:var(--r-md);margin-top:var(--sp-3)"><p style="color:var(--ink);font-weight:var(--fw-semi)">${filled}</p>${Chrome.gloss(d.en)}</div>`;
          if (right) {
            el.classList.add('correct');
            correct++;
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! ${d.why}</div>${reveal}<div class="adv-host"></div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option').forEach(x => { if (x.dataset.pick === d.correct) x.classList.add('correct'); });
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Should be <b>${d.correct === 'pc' ? d.pc : d.imp}</b>. ${d.why}</div>${reveal}<div class="adv-host"></div>`;
            MistakesModule.record({
              type: 'grammar',
              sig: `pcvsimp:${drillIdx}`,
              prompt: `${d.sentence}`,
              correct: d.correct === 'pc' ? d.pc : d.imp,
              your: pick === 'pc' ? d.pc : d.imp,
            });
          }
          Chrome.advance({
            host: container.querySelector('.adv-host'),
            onNext: () => { drillIdx++; showDrill(); },
            seconds: right ? 3 : 5,
          });
        };
      });
    }

    function finish() {
      const pct = Math.round((correct / drills.length) * 100);
      if (pct >= 70) App.markLessonDone('grammar:g30-pc-vs-imp');
      container.innerHTML = `
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pct >= 80 ? '🏆' : pct >= 70 ? '🎯' : '💪'}</div>
            <h2>${pct >= 80 ? 'Mastered!' : pct >= 70 ? 'Passed!' : 'Re-study and try again'}</h2>
            <p>Score: <b>${correct}/${drills.length}</b> (${pct}%)</p>
            ${pct >= 80 ? '<p style="color:var(--mute)">This is the hardest CLB 6 grammar distinction. Well done.</p>' : pct >= 70 ? '<p style="color:var(--mute)">Solid. Review the framework boxes and run again to reach mastery.</p>' : '<p style="color:var(--mute)">Re-read the framework boxes carefully — focus on the "scene vs event" mental test.</p>'}
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('pcvsimp')">Restart</button>
            <button class="btn ghost big" onclick="App.go('grammar')">Back to Grammar</button>
          </div>
        </div>`;
    }

    showStudy();
  }

  return { render };
})();
