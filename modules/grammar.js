// Grammar lesson + integrated quiz.
window.GrammarModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Grammar'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Grammar Quests</p>
        <h1>Pattern first.<br/>Rule second.</h1>
        <p style="margin-top:var(--sp-4)">Like a child. Then like a student. Then like an athlete.</p>
      </section>

      <div class="spotlight" onclick="App.go('deepdive')" style="cursor:pointer;border:1px solid var(--accent)">
        <div>
          <p class="eyebrow">CLB 6 traps</p>
          <h2>Deep dives — the four hardest grammar concepts, solved visually</h2>
          <p>y vs en · pronoun order · si-clauses · qui/que/dont/où. Decision trees, not memorization.</p>
        </div>
        <button class="btn primary" onclick="event.stopPropagation();App.go('deepdive')">Open<span class="arr">→</span></button>
      </div>

      <h2 class="section-h">All units</h2>
      <div class="grid" id="g-grid"></div>`;
    const grid = container.querySelector('#g-grid');
    for (const u of GRAMMAR) {
      const done = App.state.lessons[`grammar:${u.id}`] || false;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${u.icon}</div>
        <h3>${u.title}</h3>
        <p><span class="tag">${u.level}</span> ${done ? '<span class="tag" style="background:rgba(52,199,89,.12);color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px">${u.rules.length} rules · ${u.quiz.length} questions</p>`;
      card.onclick = () => App.go('grammar', { unit: u.id });
      grid.appendChild(card);
    }
  }

  function renderUnit(container, id) {
    const u = GRAMMAR.find(x => x.id === id);
    let phase = 'intro'; // intro -> quiz
    let qi = 0, correct = 0;

    function rulesHTML() {
      return u.rules.map(r => {
        let html = `<div class="grammar-box"><h3>${r.title}</h3><p>${r.body}</p>`;
        if (r.examples && r.examples.length) html += r.examples.map(e => `<div class="example">${e}</div>`).join('');
        if (r.table) {
          html += `<table class="conj-table"><tbody>` +
            r.table.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('') +
            `</tbody></table>`;
        }
        return html + '</div>';
      }).join('');
    }

    // ---------- Deep-dive sections (declarative) ----------
    // Each entry: required field on the unit, heading, border color, and a
    // body-builder that turns the field's value into HTML inside the box.
    const DEEP_SECTIONS = [
      { field: 'pattern', heading: '1 · Spot the pattern', color: 'var(--accent)',
        body: v => `
          <p style="color:var(--ink-2);font-size:var(--fs-14)">Read these aloud. Notice what changes. Don't try to memorize a rule yet.</p>
          ${v.map(ex => `<div class="example">${ex}</div>`).join('')}` },
      { field: 'why', heading: '2 · Why it works this way', color: 'var(--accent)',
        body: v => `<p>${v}</p>` },
      { field: 'enBridge', heading: '🇬🇧 ↔ 🇫🇷 English bridge', color: 'var(--bleu)',
        body: v => `<p>${v}</p>` },
      // (rules section is rendered between bridge and contrast — see renderIntro)
      { field: 'contrast', heading: "4 · Don't confuse with…", color: 'var(--warn)', position: 'after-rules',
        body: v => `
          <p style="color:var(--ink-2);font-size:var(--fs-14)">Nearest look-alike forms. Read both, feel the difference.</p>
          <table class="conj-table" style="margin-top:var(--sp-3)"><tbody>
            ${v.map(c => `<tr><td style="width:50%">${c.form || c[0]}</td><td>${c.gloss || c[1]}</td></tr>`).join('')}
          </tbody></table>` },
    ];

    function renderSection(s) {
      const v = u[s.field];
      if (!v || (Array.isArray(v) && !v.length)) return '';
      return `
        <div class="grammar-box" style="border-left-color:${s.color}">
          <h3>${s.heading}</h3>
          ${s.body(v)}
        </div>`;
    }

    function renderIntro() {
      const before = DEEP_SECTIONS.filter(s => s.position !== 'after-rules').map(renderSection).join('');
      const after  = DEEP_SECTIONS.filter(s => s.position === 'after-rules').map(renderSection).join('');
      const hasDeepDive = !!(before || after);
      const ruleHeader = hasDeepDive
        ? `<h3 style="font-size:var(--fs-19);color:var(--ink);margin:var(--sp-6) 0 var(--sp-3);letter-spacing:var(--ls-snug)">3 · The rule</h3>`
        : '';

      container.innerHTML = `
        ${Chrome.render({ back: 'grammar', crumbs: ['Grammar', u.title] })}
        <div class="lesson">
          <h2>${u.icon} ${u.title} <span class="tag">${u.level}</span></h2>
          <p style="font-size:var(--fs-17);line-height:var(--lh-loose);margin:var(--sp-3) 0 var(--sp-5);color:var(--ink-2)">${u.intro}</p>
          ${before}
          ${ruleHeader}
          ${rulesHTML()}
          ${after}
          <div class="spacer"></div>
          <div class="row" style="justify-content:flex-end">
            <button class="btn primary big" id="start-quiz">${hasDeepDive ? '5 · Practice' : 'Practice'}<span class="arr">→</span></button>
          </div>
        </div>`;
      container.querySelector('#start-quiz').onclick = () => { phase = 'quiz'; renderQuiz(); };
    }

    function renderQuiz() {
      const q = u.quiz[qi];
      container.innerHTML = `
        ${Chrome.render({
          back: () => `App.go('grammar', { unit: '${u.id}' })`,
          crumbs: ['Grammar', u.title, 'Practice'],
          progress: { current: qi, total: u.quiz.length }
        })}
        <div class="lesson">
          <h2>${u.icon} Practice — ${u.title}</h2>
          <div class="q-prompt">${q.q}</div>
          <div class="options" id="opts">
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
            App.addXP(5);
            container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct! ${q.why ? '<small>' + q.why + '</small>' : ''}</div>`;
          } else {
            el.classList.add('wrong');
            container.querySelectorAll('.option')[q.a].classList.add('correct');
            container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Not quite. Right answer: <b>${q.opts[q.a]}</b>. ${q.why ? '<small>' + q.why + '</small>' : ''}</div>`;
            MistakesModule.record({
              type: 'grammar',
              sig: `grammar:${u.id}:${qi}`,
              prompt: `[${u.title}] ${q.q}`,
              correct: q.opts[q.a],
              your: q.opts[i],
            });
          }
          setTimeout(() => {
            qi++;
            if (qi >= u.quiz.length) finish();
            else renderQuiz();
          }, 1400);
        };
      });
    }

    function finish() {
      const pct = Math.round((correct / u.quiz.length) * 100);
      const pass = pct >= 70;
      if (pass) App.markLessonDone(`grammar:${u.id}`);
      container.innerHTML = `
        ${Chrome.render({ back: 'grammar', crumbs: ['Grammar', u.title, 'Result'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pass ? '🏅' : '💪'}</div>
            <h2>${pass ? 'Quest Complete' : 'Almost There'}</h2>
            <p>Score: <b>${correct}/${u.quiz.length}</b> (${pct}%)</p>
            <p style="margin-top:var(--sp-2)">${pass ? 'Unit unlocked. The next step is highlighted on your path.' : 'Review the rules and try again — 70% to pass.'}</p>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('grammar', { unit: '${u.id}' })">Review rules</button>
              <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
            </div>
          </div>
        </div>`;
    }

    renderIntro();
  }

  return {
    render(container, params) {
      if (params && params.unit) renderUnit(container, params.unit);
      else renderList(container);
    }
  };
})();
