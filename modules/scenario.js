// Scenario module — situation-first oral practice.
//
// Each scenario walks the learner through 7 steps in order:
//   1. Situation   — context: who you are, who they are, the goal
//   2. Listen      — multi-speaker dialogue (auto-played, replay any line, optional transcript)
//   3. Vocab       — extracted key terms with click-to-hear
//   4. Grammar     — one focused grammar point + examples
//   5. Shadow      — repeat-after-me on the most important lines (uses SRS rating)
//   6. Comprehension — quick MC check
//   7. Speak it    — open-ended prompt + model answer + self-grade checklist
//
// The flow is deliberately linear. Each step has a "next" button. The learner
// can navigate back via the chrome breadcrumb at any time. Completing all 7
// marks the scenario done in App.state.

window.ScenarioModule = (function () {
  const escapeHTML = Chrome.escapeHTML;

  // Speaker styling — re-use existing .dl-A / .dl-B colors but key by voice
  // for variety when more than two speakers appear.
  function speakerStyle(speaker) {
    return speaker === 'A' ? 'dl-A' : speaker === 'B' ? 'dl-B' : 'dl-NARR';
  }

  function ttsVoice(voice) {
    return voice === 'jean' ? 'fr-CA-JeanNeural' : 'fr-CA-SylvieNeural';
  }

  // ─────────────── LIST ───────────────
  function renderList(container) {
    // Group by category for an organized landing page
    const byCat = {};
    for (const sc of SCENARIOS) {
      (byCat[sc.category] = byCat[sc.category] || []).push(sc);
    }
    const catBlocks = Object.keys(byCat).map(cat => {
      const icon = byCat[cat][0].categoryIcon;
      const cards = byCat[cat].map(sc => {
        const done = App.state.lessons[`scenario:${sc.id}`];
        return `
          <div class="card" data-id="${sc.id}">
            <div class="icon">${sc.icon}</div>
            <h3>${escapeHTML(sc.title)}</h3>
            <p style="color:var(--ink-2);font-size:var(--fs-14);margin-top:4px">${escapeHTML(sc.subtitle)}</p>
            <p style="margin-top:var(--sp-3)">
              <span class="tag">${escapeHTML(sc.level)}</span>
              <span class="tag">${escapeHTML(sc.duration)}</span>
              ${done ? '<span class="tag" style="background:rgba(52,199,89,.12);color:var(--good)">✓ Done</span>' : ''}
            </p>
          </div>`;
      }).join('');
      return `
        <h2 class="section-h">${icon} ${escapeHTML(cat)}</h2>
        <div class="grid">${cards}</div>`;
    }).join('');

    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Scenarios'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Real-life Scenarios</p>
        <h1>Calling a landlord.<br/>Opening a bank account.<br/>One scenario at a time.</h1>
        <p style="margin-top:var(--sp-4)">Each scenario walks you through one Canadian life situation in 7 steps: listen → understand → repeat → speak it yourself. No textbooks. Just the conversations you'll actually have.</p>
      </section>
      ${catBlocks}
      <div class="spacer lg"></div>
      <div class="grammar-box">
        <h3>How it works</h3>
        <ol style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
          <li><b>Situation</b> — the context.</li>
          <li><b>Listen</b> to the full dialogue.</li>
          <li><b>Vocab</b> — the key terms extracted.</li>
          <li><b>Grammar</b> — one focused pattern.</li>
          <li><b>Shadow</b> — repeat the key lines aloud.</li>
          <li><b>Check</b> — comprehension questions.</li>
          <li><b>Your turn</b> — speak it yourself with a model + checklist.</li>
        </ol>
      </div>
    `;
    container.querySelectorAll('[data-id]').forEach(el => {
      el.onclick = () => App.go('scenario', { id: el.dataset.id });
    });
  }

  // ─────────────── DETAIL ───────────────
  function renderDetail(container, sc) {
    // step state lives in a local variable; navigation buttons mutate it
    const STEPS = ['situation', 'listen', 'vocab', 'grammar', 'shadow', 'comprehension', 'speak'];
    let step = 0;

    function nav(html) {
      const isLast = step === STEPS.length - 1;
      const nextLabel = isLast ? 'Mark complete' : 'Next step';
      return `
        <div class="row" style="justify-content:space-between;align-items:center;margin-top:var(--sp-7)">
          <button class="btn ghost" id="prev-step" ${step === 0 ? 'disabled' : ''}>← Back</button>
          <span style="color:var(--mute);font-size:var(--fs-13);font-variant-numeric:tabular-nums">Step ${step + 1} of ${STEPS.length}</span>
          <button class="btn primary" id="next-step">${nextLabel}<span class="arr">→</span></button>
        </div>`;
    }

    function chromeRow() {
      return Chrome.render({
        back: 'scenario',
        crumbs: ['Scenarios', sc.title],
        progress: { current: step, total: STEPS.length },
      });
    }

    function render() {
      const which = STEPS[step];
      if (which === 'situation')     return renderSituation();
      if (which === 'listen')        return renderListen();
      if (which === 'vocab')         return renderVocab();
      if (which === 'grammar')       return renderGrammar();
      if (which === 'shadow')        return renderShadow();
      if (which === 'comprehension') return renderComprehension();
      if (which === 'speak')         return renderSpeak();
    }

    function bindNav() {
      const next = container.querySelector('#next-step');
      const prev = container.querySelector('#prev-step');
      if (next) next.onclick = () => {
        if (step === STEPS.length - 1) {
          App.markLessonDone(`scenario:${sc.id}`);
          App.go('scenario');
          return;
        }
        step++; render();
      };
      if (prev) prev.onclick = () => { if (step > 0) { step--; render(); } };
    }

    // ── Step 1: Situation
    function renderSituation() {
      container.innerHTML = `
        ${chromeRow()}
        <div class="lesson">
          <h2>${sc.icon} ${escapeHTML(sc.title)}</h2>
          <p style="color:var(--ink-2);font-size:var(--fs-17);line-height:var(--lh-loose);margin-bottom:var(--sp-5)">${escapeHTML(sc.subtitle)}</p>

          <div class="grammar-box" style="border-left-color:var(--accent)">
            <h3>1 · The situation</h3>
            <p><b>You:</b> ${escapeHTML(sc.situation.you)}</p>
            <p><b>Them:</b> ${escapeHTML(sc.situation.them)}</p>
            <p style="margin-top:var(--sp-3)"><b>Your goal:</b> ${escapeHTML(sc.situation.goal)}</p>
          </div>

          <div class="grammar-box">
            <h3>Ready?</h3>
            <p>Imagine yourself in this moment. You'll hear the conversation first, then break it down piece by piece, then rebuild it yourself.</p>
          </div>
          ${nav()}
        </div>`;
      bindNav();
    }

    // ── Step 2: Listen
    function renderListen() {
      let playIdx = 0;
      let stopped = false;
      let transcriptShown = false;

      container.innerHTML = `
        ${chromeRow()}
        <div class="lesson">
          <h2>2 · Listen to the dialogue</h2>
          <p style="color:var(--ink-2);margin-bottom:var(--sp-5)">Play the full conversation. Listen all the way through once before reading the transcript. You can replay any line, or slow it down.</p>

          <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap;margin-bottom:var(--sp-5)">
            <button class="btn primary big" id="play-all">▶ Play full dialogue</button>
            <button class="btn ghost" id="stop-all">⏸ Stop</button>
            <button class="btn secondary" id="toggle-tr">👁 Show transcript</button>
          </div>

          <div id="dialogue-host" style="display:none">
            ${sc.dialogue.map((line, i) => `
              <div class="dialogue-line" data-i="${i}">
                <div class="dl-speaker ${speakerStyle(line.speaker)}">${line.speaker === 'A' ? '👩' : '👨'} ${line.speaker}</div>
                <div class="dl-text">
                  ${escapeHTML(line.text)}
                  <button class="btn sm ghost" data-replay="${i}" style="margin-left:var(--sp-2)" data-no-tick>🔊</button>
                  ${Chrome.gloss(line.en)}
                </div>
              </div>
            `).join('')}
          </div>
          ${nav()}
        </div>`;

      bindNav();

      const dialogueHost = container.querySelector('#dialogue-host');
      const toggleBtn = container.querySelector('#toggle-tr');
      const playBtn = container.querySelector('#play-all');
      const stopBtn = container.querySelector('#stop-all');

      toggleBtn.onclick = () => {
        transcriptShown = !transcriptShown;
        dialogueHost.style.display = transcriptShown ? '' : 'none';
        toggleBtn.textContent = transcriptShown ? '🙈 Hide transcript' : '👁 Show transcript';
      };

      function highlight(i) {
        container.querySelectorAll('.dialogue-line').forEach(el => el.classList.remove('active'));
        const el = container.querySelector(`.dialogue-line[data-i="${i}"]`);
        if (el && transcriptShown) el.classList.add('active');
      }

      function playFrom(idx) {
        stopped = false;
        playIdx = idx;
        function next() {
          if (stopped || playIdx >= sc.dialogue.length) {
            playBtn.textContent = '▶ Play again';
            container.querySelectorAll('.dialogue-line').forEach(el => el.classList.remove('active'));
            return;
          }
          const line = sc.dialogue[playIdx];
          highlight(playIdx);
          TTS.speakLine(line.text, ttsVoice(line.voice), () => { playIdx++; setTimeout(next, 250); });
        }
        next();
      }

      playBtn.onclick = () => { playBtn.textContent = '⏸ Playing…'; playFrom(0); };
      stopBtn.onclick = () => { stopped = true; TTS.stop(); playBtn.textContent = '▶ Play full dialogue'; };

      container.querySelectorAll('[data-replay]').forEach(b => {
        b.onclick = (e) => {
          e.stopPropagation();
          const i = parseInt(b.dataset.replay, 10);
          stopped = true; TTS.stop();
          const line = sc.dialogue[i];
          highlight(i);
          TTS.speakLine(line.text, ttsVoice(line.voice), () => {});
        };
      });
    }

    // ── Step 3: Vocab
    function renderVocab() {
      container.innerHTML = `
        ${chromeRow()}
        <div class="lesson">
          <h2>3 · Key vocabulary</h2>
          <p style="color:var(--ink-2);margin-bottom:var(--sp-5)">Click any French word to hear it. These are the terms you'll reuse in step 7 when you speak the scenario yourself.</p>

          <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--sp-3)">
            ${sc.vocab.map((v, i) => `
              <div class="card" style="cursor:pointer" data-vocab="${i}">
                <div style="font-size:var(--fs-19);font-weight:var(--fw-bold);color:var(--ink);letter-spacing:var(--ls-snug)">${escapeHTML(v.fr)}</div>
                <div style="color:var(--ink-2);font-size:var(--fs-14);margin-top:4px">${escapeHTML(v.en)}</div>
              </div>
            `).join('')}
          </div>
          ${nav()}
        </div>`;

      bindNav();
      container.querySelectorAll('[data-vocab]').forEach(el => {
        el.onclick = () => TTS.speak(sc.vocab[parseInt(el.dataset.vocab)].fr);
      });
    }

    // ── Step 4: Grammar
    function renderGrammar() {
      const g = sc.grammarFocus;
      container.innerHTML = `
        ${chromeRow()}
        <div class="lesson">
          <h2>4 · Grammar focus</h2>
          <p style="color:var(--ink-2);margin-bottom:var(--sp-5)">One pattern from this dialogue, isolated. Don't try to memorize — read aloud, hear the rhythm.</p>

          <div class="grammar-box" style="border-left-color:var(--accent)">
            <h3>${escapeHTML(g.title)}</h3>
            <p>${g.note}</p>
            ${(g.examples || []).map(ex => `<div class="example">${ex}</div>`).join('')}
          </div>
          ${nav()}
        </div>`;
      bindNav();
    }

    // ── Step 5: Shadow
    function renderShadow() {
      let i = 0;
      function show() {
        if (i >= sc.shadowLines.length) {
          step++; render(); return;
        }
        // Accept both "string" and { fr, en } shapes so old + new content render
        const raw = sc.shadowLines[i];
        const line = typeof raw === 'string' ? raw : raw.fr;
        const lineEn = typeof raw === 'string' ? null : raw.en;
        container.innerHTML = `
          ${chromeRow()}
          <div class="lesson">
            <h2>5 · Repeat after me</h2>
            <p style="color:var(--mute);text-align:center;font-size:var(--fs-13);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-3)">Line ${i + 1} of ${sc.shadowLines.length}</p>

            <div class="center" style="margin-top:var(--sp-5)">
              <p style="font-size:var(--fs-28);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);color:var(--ink);line-height:var(--lh-snug);max-width:680px;margin:0 auto var(--sp-3)">${escapeHTML(line)}</p>
              ${lineEn ? `<p class="gloss-lg" style="text-align:center;margin-bottom:var(--sp-6)">${escapeHTML(lineEn)}</p>` : '<div style="margin-bottom:var(--sp-6)"></div>'}
              <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
                <button class="btn secondary" data-rate="0.7">🐢 Slow</button>
                <button class="btn primary big" data-rate="1.0">🔊 Hear it</button>
                <button class="btn secondary" data-rate="1.2">🐇 Fast</button>
              </div>
              <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-3)">Now repeat aloud yourself.</p>
            </div>

            <div class="spacer lg"></div>
            <p style="color:var(--mute);text-align:center;font-size:var(--fs-13);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-3)">How did it feel?</p>
            <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
              <button class="btn danger" data-rate-self="0">Hard, again</button>
              <button class="btn" data-rate-self="3">Got it</button>
              <button class="btn success" data-rate-self="5">Easy</button>
            </div>
            <div class="row" style="justify-content:center;margin-top:var(--sp-4)">
              <button class="btn ghost sm" id="skip-line">Skip this line</button>
            </div>
          </div>`;

        setTimeout(() => TTS.speak(line, 1.0), 250);

        container.querySelectorAll('[data-rate]').forEach(b => {
          b.onclick = () => TTS.speak(line, parseFloat(b.dataset.rate));
        });
        container.querySelectorAll('[data-rate-self]').forEach(b => {
          b.onclick = () => {
            const q = parseInt(b.dataset.rateSelf, 10);
            SRS.review(`scenario:${sc.id}`, line, q);
            if (q === 0) {
              MistakesModule.record({
                type: 'scenario-shadow',
                sig: `scenario:${sc.id}:${i}`,
                prompt: `Repeat: <b>${escapeHTML(line)}</b>`,
                correct: line,
                your: '(rated hard)',
              });
            }
            i++; show();
          };
        });
        container.querySelector('#skip-line').onclick = () => { i++; show(); };
      }
      show();
    }

    // ── Step 6: Comprehension
    function renderComprehension() {
      let qi = 0, correct = 0;
      function show() {
        if (qi >= sc.comprehension.length) {
          // step++ on next click
          container.innerHTML = `
            ${chromeRow()}
            <div class="lesson center">
              <div class="big-icon">${correct === sc.comprehension.length ? '🎯' : '👂'}</div>
              <h2>Comprehension done</h2>
              <p>Score: <b>${correct}/${sc.comprehension.length}</b></p>
              ${nav()}
            </div>`;
          bindNav();
          return;
        }
        const q = sc.comprehension[qi];
        container.innerHTML = `
          ${chromeRow()}
          <div class="lesson">
            <h2>6 · Comprehension check</h2>
            <p style="color:var(--mute);text-align:center;font-size:var(--fs-13);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin:var(--sp-3) 0">Question ${qi + 1} of ${sc.comprehension.length}</p>
            <div class="q-prompt">${escapeHTML(q.q)}</div>
            <div class="options">
              ${q.opts.map((o, i) => `<div class="option" data-i="${i}">${escapeHTML(o)}</div>`).join('')}
            </div>
            <div id="fb"></div>
          </div>`;
        container.querySelectorAll('.option').forEach(el => {
          el.onclick = () => {
            const i = parseInt(el.dataset.i, 10);
            container.querySelectorAll('.option').forEach(x => x.classList.add('disabled'));
            const right = (i === q.a);
            if (right) {
              el.classList.add('correct');
              correct++;
              container.querySelector('#fb').innerHTML = `<div class="feedback good">✓ Correct!</div><div class="adv-host"></div>`;
            } else {
              el.classList.add('wrong');
              container.querySelectorAll('.option')[q.a].classList.add('correct');
              container.querySelector('#fb').innerHTML = `<div class="feedback bad">✗ Right answer: <b>${escapeHTML(q.opts[q.a])}</b></div><div class="adv-host"></div>`;
              MistakesModule.record({
                type: 'scenario-comprehension',
                sig: `scenario:${sc.id}:q${qi}`,
                prompt: `[${sc.title}] ${q.q}`,
                correct: q.opts[q.a],
                your: q.opts[i],
              });
            }
            Chrome.advance({
              host: container.querySelector('.adv-host'),
              onNext: () => { qi++; show(); },
              seconds: right ? 3 : 4,
            });
          };
        });
      }
      show();
    }

    // ── Step 7: Speak it
    function renderSpeak() {
      const t = sc.speakingTask;
      let revealed = false;

      function paint() {
        container.innerHTML = `
          ${chromeRow()}
          <div class="lesson">
            <h2>7 · Your turn — speak it</h2>

            <div class="grammar-box" style="border-left-color:var(--accent)">
              <h3>Prompt</h3>
              <p>${escapeHTML(t.prompt)}</p>
            </div>

            <p style="color:var(--ink-2);font-size:var(--fs-15);text-align:center;margin:var(--sp-5) 0">
              Take a breath. Speak aloud — actually move your mouth. Don't read silently. When you're done, tap below.
            </p>

            <div class="row" style="justify-content:center">
              ${revealed
                ? `<button class="btn ghost" id="hide-model">🙈 Hide model</button>`
                : `<button class="btn secondary" id="show-model">👁 Show model answer</button>`}
            </div>

            ${revealed ? `
              <div class="grammar-box" style="margin-top:var(--sp-5)">
                <h3>Model answer</h3>
                <p style="font-size:var(--fs-17);line-height:var(--lh-loose);color:var(--ink)">${escapeHTML(t.model)}</p>
                ${Chrome.gloss(t.modelEn)}
                <div class="row" style="justify-content:center;margin-top:var(--sp-3)">
                  <button class="btn primary" id="play-model">🔊 Hear the model</button>
                </div>
              </div>
              <div class="grammar-box" style="border-left-color:var(--good)">
                <h3>Self-check — did you hit these?</h3>
                <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
                  ${t.checklist.map(c => `<li>${escapeHTML(c)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${nav()}
          </div>`;
        bindNav();
        const showBtn = container.querySelector('#show-model');
        const hideBtn = container.querySelector('#hide-model');
        const playBtn = container.querySelector('#play-model');
        if (showBtn) showBtn.onclick = () => { revealed = true; paint(); };
        if (hideBtn) hideBtn.onclick = () => { revealed = false; paint(); };
        if (playBtn) playBtn.onclick = () => TTS.speak(t.model);
      }
      paint();
    }

    render();
  }

  return {
    render(container, params) {
      const id = params && params.id;
      const sc = id && SCENARIOS.find(x => x.id === id);
      if (sc) return renderDetail(container, sc);
      return renderList(container);
    }
  };
})();
