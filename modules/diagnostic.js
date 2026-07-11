// Diagnostic placement test — draws a stratified random 20 from the
// 100-question bank in data/diagnostic.js, so every attempt is different.
// It suggests focus areas but never awards official levels or silently marks
// full lessons complete from one sampled multiple-choice item.
window.DiagnosticModule = (function () {

  // Stratified random draw: N questions per level (DIAGNOSTIC_DRAW),
  // shuffled within each stratum, then ordered easy → hard.
  function drawQuestions() {
    const order = ['F', 'A1', 'A2', 'B1', 'B2'];
    const out = [];
    for (const lvl of order) {
      const pool = DIAGNOSTIC_BANK.filter(q => q.level === lvl)
        .sort(() => Math.random() - 0.5)
        .slice(0, DIAGNOSTIC_DRAW[lvl] || 0);
      out.push(...pool);
    }
    return out;
  }

  function render(container) {
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>📍 Placement Test</h1>
        <p>20 questions drawn at random from a bank of ${DIAGNOSTIC_BANK.length} — every attempt is different. Use the result to identify focus areas before beginning the ordered path. Takes ~5 minutes.</p>
      </div>
      <div class="grammar-box">
        <h3>What this does</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Samples vocabulary and grammar from foundation through upper-intermediate course material.</li>
          <li>Questions are drawn fresh from a ${DIAGNOSTIC_BANK.length}-question bank, balanced across 5 difficulty levels.</li>
          <li>You get one shot per question — pick the answer you'd give without checking.</li>
          <li>It does not test all four abilities, estimate an official NCLC/CLB level, or complete lessons for you.</li>
          <li>Re-take it anytime to sample different questions and compare focus areas.</li>
        </ul>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn big" id="start">▶ Start placement test</button>
        <button class="btn ghost big" onclick="App.go('home')">Maybe later</button>
      </div>`;
    container.querySelector('#start').onclick = () => startTest(container);
  }

  function startTest(container) {
    const Q = drawQuestions();
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
      const correctTopics = [];
      const wrongTopics = [];
      for (const a of answers) {
        if (a.correct) {
          correctTopics.push(a.q.topic);
        } else {
          wrongTopics.push(a.q.topic);
        }
      }
      const score = correctTopics.length;
      const pct = Math.round(score / Q.length * 100);
      let focus = 'Start with foundations';
      if (score >= 18) focus = 'Advanced grammar review';
      else if (score >= 15) focus = 'Range and nuance';
      else if (score >= 11) focus = 'Everyday communication';
      else if (score >= 7) focus = 'Core sentence building';
      if (window.Mastery) Mastery.recordAttempt('diagnostic:knowledge-sample', { score: pct, threshold: 80, kind: 'placement-sample' });

      container.innerHTML = `
        <div class="lesson">
          <h2>📊 Your placement</h2>
          <div class="grammar-box" style="border-left-color:var(--good)">
            <h3>${score} / ${Q.length} correct · focus: <b>${focus}</b></h3>
            <p>This is a sampled knowledge result, not a language level. Your ordered path remains intact so every capability is demonstrated before it is counted.</p>
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
