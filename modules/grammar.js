// Grammar lesson + integrated quiz.
window.GrammarModule = (function () {
  function renderList(container) {
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>📐 Grammar Quests</h1>
        <p>Patterns first — like a child. Then explicit rules — like a student. Then practice — like an athlete.</p>
      </div>
      <div class="grid" id="g-grid"></div>`;
    const grid = container.querySelector('#g-grid');
    for (const u of GRAMMAR) {
      const done = App.state.lessons[`grammar:${u.id}`] || false;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${u.icon}</div>
        <h3>${u.title}</h3>
        <p><span class="tag">${u.level}</span> ${done ? '<span class="tag" style="background:#dcfce7;color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:8px">${u.rules.length} rules · ${u.quiz.length} questions</p>`;
      card.onclick = () => renderUnit(container, u.id);
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

    function renderIntro() {
      container.innerHTML = `
        <div class="lesson">
          <h2>${u.icon} ${u.title} <span class="tag">${u.level}</span></h2>
          <p style="font-size:16px;line-height:1.6;margin:10px 0 16px">${u.intro}</p>
          ${rulesHTML()}
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('grammar')">← Grammar</button>
            <button class="btn big" id="start-quiz">Practice →</button>
          </div>
        </div>`;
      container.querySelector('#start-quiz').onclick = () => { phase = 'quiz'; renderQuiz(); };
    }

    function renderQuiz() {
      const q = u.quiz[qi];
      container.innerHTML = `
        <div class="lesson">
          <h2>${u.icon} Practice — ${u.title}</h2>
          <div class="progress"><div style="width:${(qi / u.quiz.length) * 100}%"></div></div>
          <div class="q-prompt">${q.q}</div>
          <div class="options" id="opts">
            ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${o}</div>`).join('')}
          </div>
          <div id="fb"></div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" onclick="App.go('grammar')">← Quit</button>
            <span style="color:var(--mute)">Q ${qi + 1} / ${u.quiz.length}</span>
          </div>
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
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">${pass ? '🏅' : '💪'}</div>
            <h2>${pass ? 'Quest Complete!' : 'Almost There'}</h2>
            <p>Score: <b>${correct}/${u.quiz.length}</b> (${pct}%)</p>
            <p style="margin-top:8px">${pass ? 'You earned XP and unlocked the next step.' : 'Review the rules and try again — 70% to pass.'}</p>
            <div class="spacer"></div>
            <button class="btn big" onclick="App.go('grammar', { unit: '${u.id}' })">Review Rules</button>
            <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
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
