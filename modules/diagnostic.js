// Diagnostic placement test — 20 questions, marks early lessons as done if learner already knows them.
window.DiagnosticModule = (function () {

  const Q = [
    // Foundation (CLB 2-3)
    { id: 'q1', topic: 'greeting', skipIfPass: ['vocab:greetings'], q: 'How do you say "hello" in French?', opts: ['adieu', 'bonjour', 'aurevoir'], a: 1 },
    { id: 'q2', topic: 'numbers', skipIfPass: ['vocab:numbers'], q: 'What is "quinze" in English?', opts: ['5', '15', '50'], a: 1 },
    { id: 'q3', topic: 'gender', skipIfPass: ['grammar:g1-articles'], q: 'Which is correct?', opts: ['un femme', 'une femme', 'la homme'], a: 1 },
    { id: 'q4', topic: 'colors', skipIfPass: ['vocab:colors'], q: '"Bleu" means...', opts: ['red', 'green', 'blue'], a: 2 },
    // A1
    { id: 'q5', topic: 'etre', skipIfPass: ['grammar:g2-etre'], q: 'Choose: Nous ___ Canadiens.', opts: ['êtes', 'sommes', 'sont'], a: 1 },
    { id: 'q6', topic: 'avoir', skipIfPass: ['grammar:g3-avoir'], q: 'Choose: Elle ___ deux frères.', opts: ['a', 'as', 'est'], a: 0 },
    { id: 'q7', topic: 'er-verbs', skipIfPass: ['grammar:g4-er-verbs'], q: 'Conjugate "parler" for "vous":', opts: ['parlez', 'parlons', 'parlent'], a: 0 },
    { id: 'q8', topic: 'negation', skipIfPass: ['grammar:g5-negation'], q: 'How do you say "I do not eat meat"?', opts: ['Je mange pas viande', 'Je ne mange pas de viande', 'Je ne pas mange viande'], a: 1 },
    // A2
    { id: 'q9', topic: 'family', skipIfPass: ['vocab:family'], q: '"Ma sœur" means...', opts: ['my brother', 'my sister', 'my mother'], a: 1 },
    { id: 'q10', topic: 'time', skipIfPass: ['vocab:time'], q: '"Demain" means...', opts: ['yesterday', 'today', 'tomorrow'], a: 2 },
    { id: 'q11', topic: 'passe-compose', skipIfPass: ['grammar:g8-passe-compose'], q: 'Choose: Hier, je ___ au marché.', opts: ['vais', 'suis allé', 'allais'], a: 1 },
    { id: 'q12', topic: 'futur-proche', skipIfPass: ['grammar:g9-futur-proche'], q: '"I am going to eat" =', opts: ['Je mange', 'Je vais manger', 'Je mangerai'], a: 1 },
    // B1
    { id: 'q13', topic: 'imparfait', skipIfPass: ['grammar:g10-imparfait'], q: 'Choose: Quand j\'étais petit, je ___ au foot.', opts: ['joue', 'jouais', 'ai joué'], a: 1 },
    { id: 'q14', topic: 'pronouns', skipIfPass: ['grammar:g11-pronouns'], q: '"Je vois le film" → Je ___ vois.', opts: ['le', 'la', 'lui'], a: 0 },
    { id: 'q15', topic: 'y-en', skipIfPass: ['grammar:g14-y-en'], q: '"Je mange du pain" → J\'___ mange.', opts: ['y', 'en', 'le'], a: 1 },
    { id: 'q16', topic: 'relative', skipIfPass: ['grammar:g15-relative'], q: 'Choose: Le livre ___ je lis est intéressant.', opts: ['qui', 'que', 'dont'], a: 1 },
    { id: 'q17', topic: 'conditional', skipIfPass: ['grammar:g17-conditional'], q: 'Choose: Je ___ un café, s\'il vous plaît. (polite request)', opts: ['veux', 'voudrais', 'voudrai'], a: 1 },
    { id: 'q18', topic: 'si-clauses', skipIfPass: ['grammar:g18-si'], q: 'Choose: Si j\'avais de l\'argent, je ___ voyager.', opts: ['vais', 'voudrais', 'voudrai'], a: 1 },
    // CLB 6 grammar
    { id: 'q19', topic: 'subjunctive', skipIfPass: ['grammar:g20-subjunctive'], q: 'Choose: Il faut que tu ___ patient. (être)', opts: ['es', 'soit', 'sois'], a: 2 },
    { id: 'q20', topic: 'pcvsimp', skipIfPass: ['grammar:g30-pc-vs-imp'], q: 'Choose: Hier, il pleuvait quand je ___ au bureau. (arriver)', opts: ['arrivais', 'suis arrivé', 'arriverai'], a: 1 },
  ];

  function render(container) {
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>📍 Placement Test</h1>
        <p>20 quick questions to find your level. Lessons you clearly know will be marked done so you can skip ahead. Takes ~5 minutes.</p>
      </div>
      <div class="grammar-box">
        <h3>What this does</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Tests vocabulary, grammar (present → conditional), past tense, and the hardest CLB 6 grammar point.</li>
          <li>You get one shot per question — pick the answer you'd give without checking.</li>
          <li>If you pass a question, the corresponding lesson is auto-marked done.</li>
          <li>You can re-take the test anytime; passes are additive, never subtractive.</li>
        </ul>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" id="start">▶ Start placement test</button>
        <button class="btn ghost big" onclick="App.go('home')">Maybe later</button>
      </div>`;
    container.querySelector('#start').onclick = () => startTest(container);
  }

  function startTest(container) {
    let i = 0;
    const answers = [];
    function show() {
      if (i >= Q.length) return finish();
      const q = Q[i];
      container.innerHTML = `
        <div class="lesson">
          <h2>📍 Placement Test</h2>
          <div class="progress"><div style="width:${(i / Q.length) * 100}%"></div></div>
          <p style="color:var(--mute);font-size:13px">Question ${i + 1} of ${Q.length}</p>
          <div class="q-prompt">${q.q}</div>
          <div class="options" style="grid-template-columns:1fr">
            ${q.opts.map((o, k) => `<div class="option" data-i="${k}">${o}</div>`).join('')}
          </div>
          <div class="spacer"></div>
          <div class="row"><button class="btn ghost" onclick="App.go('diagnostic')">← Quit</button></div>
        </div>`;
      container.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const pick = parseInt(el.dataset.i, 10);
          answers.push({ q, pick, correct: pick === q.a });
          i++;
          show();
        };
      });
    }

    function finish() {
      // Apply results: mark lessons done for correct answers
      let lessonsMarkedDone = 0;
      const correctTopics = [];
      const wrongTopics = [];
      for (const a of answers) {
        if (a.correct) {
          correctTopics.push(a.q.topic);
          for (const key of (a.q.skipIfPass || [])) {
            if (!App.state.lessons[key]) {
              App.markLessonDone(key);
              lessonsMarkedDone++;
            }
          }
        } else {
          wrongTopics.push(a.q.topic);
        }
      }
      // Estimated CLB level
      const score = correctTopics.length;
      let estimatedLevel = 'CLB 2 or below';
      if (score >= 18) estimatedLevel = 'CLB 6+';
      else if (score >= 15) estimatedLevel = 'CLB 5';
      else if (score >= 11) estimatedLevel = 'CLB 4';
      else if (score >= 7) estimatedLevel = 'CLB 3';

      container.innerHTML = `
        <div class="lesson">
          <h2>📊 Your placement</h2>
          <div class="grammar-box" style="border-left-color:var(--good)">
            <h3>${score} / ${Q.length} correct · estimated <b>${estimatedLevel}</b></h3>
            <p>${lessonsMarkedDone} lesson${lessonsMarkedDone === 1 ? '' : 's'} marked done. Path adjusted to your level.</p>
          </div>
          ${wrongTopics.length ? `
          <div class="grammar-box">
            <h3>🎯 Focus areas (you got these wrong)</h3>
            <p>${wrongTopics.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
            <p style="margin-top:10px;color:var(--mute);font-size:14px">Start with the Path — your "▶ NEXT" recommendation will guide you through these weak areas first.</p>
          </div>` : ''}
          ${correctTopics.length ? `
          <div class="grammar-box">
            <h3>✅ Already strong</h3>
            <p>${correctTopics.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
          </div>` : ''}
          <div class="center" style="margin-top:20px">
            <button class="btn big" onclick="App.go('path')">▶ Go to my Path</button>
            <button class="btn ghost big" onclick="App.go('home')">← Home</button>
          </div>
        </div>`;
    }

    show();
  }

  return { render };
})();
