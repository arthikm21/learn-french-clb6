// Repeat-After-Me / shadowing module.
//
// User listens → reads aloud → self-rates. No microphone, no speech recognition.
// This is the deliberate-practice loop: hear Canadian French neural audio, mimic
// it immediately, judge the gap yourself. The site provides the audio; the learner
// provides the effort.
//
// Each rating ("Easy" / "Got it" / "Hard, again") feeds SRS for spaced replay of
// the trickier sentences.

window.SpeakModule = (function () {
  const SETS = window.SPEAK_SETS;
  const escapeHTML = Chrome.escapeHTML;

  function renderList(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Speak'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Speaking · Repeat after me</p>
        <h1>Hear it.<br/>Say it out loud.</h1>
        <p style="margin-top:var(--sp-4)">Canadian French neural audio plays. You repeat it aloud—at your own pace, in your own voice. Rate how it felt. The hard ones come back.</p>
      </section>

      <div class="grammar-box">
        <h3>How it works</h3>
        <ul style="margin-left:20px;line-height:var(--lh-loose);color:var(--ink-2)">
          <li><b>Listen</b> at full speed first. Then slow it down (🐢) if needed.</li>
          <li><b>Repeat aloud</b> right after. Don't read silently — your mouth must move.</li>
          <li><b>Rate honestly</b>: Easy / Got it / Hard. Hard sentences return sooner.</li>
          <li>No microphone needed. No recording. No judgment but your own.</li>
        </ul>
      </div>

      <div class="grid" id="s-grid"></div>`;
    const grid = container.querySelector('#s-grid');
    for (const k of Object.keys(SETS)) {
      const s = SETS[k];
      const done = App.state.lessons[`speak:${k}`] || false;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">🎙️</div>
        <h3>${escapeHTML(s.title)}</h3>
        <p><span class="tag">${escapeHTML(s.level || '')}</span>${done ? ' <span class="tag" style="background:rgba(52,199,89,.12);color:var(--good)">✓ Done</span>' : ''}</p>
        <p style="margin-top:var(--sp-2)">${s.items.length} sentences</p>`;
      card.onclick = () => App.go('speak', { set: k });
      grid.appendChild(card);
    }
  }

  function renderSet(container, setKey) {
    const s = SETS[setKey];
    if (!s) { App.go('speak'); return; }

    // Pull due cards from SRS first, then fall back to fresh sentences.
    // Accept both "string" and { fr, en } shapes so old + new content render.
    const items = s.items.map(t => (typeof t === 'string' ? { fr: t } : t));
    let queue = SRS.dueCards(setKey, items);
    if (queue.length === 0) queue = items.slice();

    let i = 0;
    let revealed = false;  // Did the user choose to see the translation hint?
    const ratedTargets = new Set();
    let skipped = 0;
    let hardRatings = 0;
    // Same-session relearning: a line you rate "Hard, again" comes back later in
    // this session, not just tomorrow. Capped per line.
    const requeues = new Map();

    function show() {
      if (i >= queue.length) return finish();
      const target = queue[i].fr;
      const targetEn = queue[i].en;
      const heard = false;
      revealed = false;

      container.innerHTML = `
        ${Chrome.render({
          back: 'speak',
          crumbs: ['Speak', s.title],
          progress: { current: i, total: queue.length }
        })}
        <div class="lesson">
          <h2>🎙️ ${escapeHTML(s.title)}</h2>

          <div class="center" style="margin-top:var(--sp-7)">
            <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">Repeat after me</p>
            <p style="font-size:var(--fs-34);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);color:var(--ink);line-height:var(--lh-snug);max-width:680px;margin:0 auto var(--sp-3)">${escapeHTML(target)}</p>
            ${targetEn ? `<p class="gloss-lg" style="text-align:center;max-width:680px;margin:0 auto var(--sp-6)">${escapeHTML(targetEn)}</p>` : '<div style="margin-bottom:var(--sp-6)"></div>'}

            <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
              <button class="btn secondary" data-rate="0.7">🐢 Slow</button>
              <button class="btn primary big" data-rate="1.0">🔊 Hear it</button>
              <button class="btn secondary" data-rate="1.2">🐇 Fast</button>
              <button class="btn ghost" data-rate="1.0" data-again="1">🔁 Again</button>
            </div>
            <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-3)">Now repeat it aloud yourself. Your mouth must move.</p>
            <label style="display:inline-flex;align-items:center;gap:10px;margin-top:var(--sp-4);font-weight:var(--fw-semi);cursor:pointer">
              <input type="checkbox" id="said-aloud" /> I said the full line aloud
            </label>
          </div>

          <div class="spacer lg"></div>

          <p class="center" style="color:var(--mute);font-size:var(--fs-13);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-3)">How did it feel?</p>
          <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
            <button class="btn danger" data-rate-self="0" disabled>Hard, again</button>
            <button class="btn" data-rate-self="3" disabled>Got it</button>
            <button class="btn success" data-rate-self="5" disabled>Easy</button>
          </div>

          <div class="spacer"></div>
          <div class="row" style="justify-content:center">
            <button class="btn ghost sm" id="skip">Skip — don't grade</button>
          </div>
        </div>`;

      // Auto-play on first appear, then bind buttons.
      TTS.speakSoon(target, 1.0, 250);

      container.querySelectorAll('[data-rate]').forEach(b => {
        b.onclick = () => TTS.speak(target, parseFloat(b.dataset.rate));
      });

      container.querySelector('#said-aloud').onchange = event => {
        container.querySelectorAll('[data-rate-self]').forEach(button => { button.disabled = !event.target.checked; });
      };

      container.querySelectorAll('[data-rate-self]').forEach(b => {
        b.onclick = () => {
          const q = parseInt(b.dataset.rateSelf, 10);
          ratedTargets.add(target);
          SRS.review(setKey, target, q);
          // Hard = surface as a weak spot to come back to, AND replay it later in
          // this same session (max twice) so the rep lands now, not just tomorrow.
          if (q === 0) {
            hardRatings++;
            MistakesModule.record({
              type: 'speak',
              sig: `speak:${setKey}:${i}`,
              prompt: `Repeat: <b>${escapeHTML(target)}</b>`,
              correct: target,
              your: '(rated hard — needs more practice)',
            });
            const n = requeues.get(target) || 0;
            if (n < 2) {
              requeues.set(target, n + 1);
              queue.splice(Math.min(i + 3, queue.length), 0, queue[i]);
            }
          }
          i++; show();
        };
      });

      container.querySelector('#skip').onclick = () => { skipped++; i++; show(); };
    }

    function finish() {
      const coverage = Math.round(ratedTargets.size / items.length * 100);
      const complete = coverage >= 80;
      if (complete) App.markLessonDone(`speak:${setKey}`);
      else if (window.Mastery) Mastery.recordPractice(`speak:${setKey}`, { kind: 'partial-shadowing' });
      try { if (window.Sounds) Sounds.play(complete ? 'complete' : 'warn'); } catch {}
      container.innerHTML = `
        ${Chrome.render({ back: 'speak', crumbs: ['Speak', s.title, 'Complete'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🗣️</div>
            <p style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:${complete ? 'var(--good)' : 'var(--warn)'};margin-bottom:var(--sp-2)">${complete ? '✓ Practice target met' : 'Practice recorded'}</p>
            <h2>${complete ? 'Shadowing session finished' : 'Finish the spoken reps'}</h2>
            <p>You confirmed <b>${ratedTargets.size}/${items.length}</b> original lines aloud (${coverage}%). ${hardRatings} hard rating${hardRatings === 1 ? '' : 's'} · ${skipped} skip${skipped === 1 ? '' : 's'}.</p>
            <p style="color:var(--mute);margin-top:var(--sp-2)">${complete ? 'Hard lines return sooner through spaced review.' : 'Confirm at least 80% aloud for this path milestone. Skipped lines do not count.'}</p>
            <p style="color:var(--mute);margin-top:var(--sp-2)">Speaking is the only skill the site cannot grade for you. Your reps are your reps. Do them aloud.</p>
            <div class="grammar-box" style="border-left-color:var(--accent);text-align:left;max-width:560px;margin:var(--sp-6) auto 0">
              <h3>🗣️ Want your speaking actually graded?</h3>
              <p>The site can't hear you — a real tutor can. Live pronunciation feedback is the one thing self-study can't replace. <b>New Preply learners get 50% off their first lesson</b>, so trying one costs next to nothing.</p>
              <div class="row" style="justify-content:center;margin-top:var(--sp-3)">
                <a class="btn primary" href="https://preply.sjv.io/c/7425774/1987575/24422" target="_blank" rel="sponsored noopener">Get 50% off a French tutor<span class="arr">→</span></a>
              </div>
              <p style="color:var(--mute);font-size:var(--fs-12);text-align:center;margin-top:var(--sp-3)">Affiliate link · we may earn a commission, at no cost to you.</p>
            </div>
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('speak')">More speaking</button>
              <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
            </div>
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
