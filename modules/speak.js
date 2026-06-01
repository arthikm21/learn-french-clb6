// Repeat-After-Me / shadowing module.
//
// User listens → reads aloud → self-rates. No microphone, no speech recognition.
// This is the deliberate-practice loop that polyglots use: hear native audio, mimic
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
        <p style="margin-top:var(--sp-4)">Native Canadian French plays. You repeat it aloud — at your own pace, in your own voice. Rate how it felt. The hard ones come back.</p>
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
    const items = s.items.map(t => ({ fr: t }));
    let queue = SRS.dueCards(setKey, items);
    if (queue.length === 0) queue = items.slice();

    let i = 0;
    let revealed = false;  // Did the user choose to see the translation hint?

    function show() {
      if (i >= queue.length) return finish();
      const target = queue[i].fr;
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
            <p style="font-size:var(--fs-34);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);color:var(--ink);line-height:var(--lh-snug);max-width:680px;margin:0 auto var(--sp-6)">${escapeHTML(target)}</p>

            <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
              <button class="btn secondary" data-rate="0.7">🐢 Slow</button>
              <button class="btn primary big" data-rate="1.0">🔊 Hear it</button>
              <button class="btn secondary" data-rate="1.2">🐇 Fast</button>
              <button class="btn ghost" data-rate="1.0" data-again="1">🔁 Again</button>
            </div>
            <p style="color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-3)">Now repeat it aloud yourself. Your mouth must move.</p>
          </div>

          <div class="spacer lg"></div>

          <p class="center" style="color:var(--mute);font-size:var(--fs-13);text-transform:uppercase;letter-spacing:var(--ls-wide);font-weight:var(--fw-semi);margin-bottom:var(--sp-3)">How did it feel?</p>
          <div class="row" style="justify-content:center;gap:var(--sp-2);flex-wrap:wrap">
            <button class="btn danger" data-rate-self="0">Hard, again</button>
            <button class="btn" data-rate-self="3">Got it</button>
            <button class="btn success" data-rate-self="5">Easy</button>
          </div>

          <div class="spacer"></div>
          <div class="row" style="justify-content:center">
            <button class="btn ghost sm" id="skip">Skip — don't grade</button>
          </div>
        </div>`;

      // Auto-play on first appear, then bind buttons.
      setTimeout(() => TTS.speak(target, 1.0), 250);

      container.querySelectorAll('[data-rate]').forEach(b => {
        b.onclick = () => TTS.speak(target, parseFloat(b.dataset.rate));
      });

      container.querySelectorAll('[data-rate-self]').forEach(b => {
        b.onclick = () => {
          const q = parseInt(b.dataset.rateSelf, 10);
          SRS.review(setKey, target, q);
          // Hard = surface as a weak spot to come back to
          if (q === 0) {
            MistakesModule.record({
              type: 'speak',
              sig: `speak:${setKey}:${i}`,
              prompt: `Repeat: <b>${escapeHTML(target)}</b>`,
              correct: target,
              your: '(rated hard — needs more practice)',
            });
          }
          i++; show();
        };
      });

      container.querySelector('#skip').onclick = () => { i++; show(); };
    }

    function finish() {
      App.markLessonDone(`speak:${setKey}`);
      container.innerHTML = `
        ${Chrome.render({ back: 'speak', crumbs: ['Speak', s.title, 'Complete'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🗣️</div>
            <h2>Session done</h2>
            <p>You shadowed <b>${queue.length}</b> sentence${queue.length === 1 ? '' : 's'}. The "Hard" ones come back tomorrow on a tighter schedule.</p>
            <p style="color:var(--mute);margin-top:var(--sp-2)">Speaking is the only skill the site cannot grade for you. Your reps are your reps. Do them aloud.</p>
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
