// Vocab flashcards with SRS + audio + quiz follow-up.
window.VocabModule = (function () {
  function renderDeckPicker(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Vocab'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Vocabulary</p>
        <h1>Hear it.<br /> Then know it.</h1>
        <p style="margin-top:var(--sp-4)">Your first finished session saves the ✓ Complete badge. The review bar fills when every card has been reviewed twice in total: your first study plus one revision. We recommend filling it before moving to the next deck.</p>
        <p style="margin-top:var(--sp-3);color:var(--mute)">For stronger recall, revise on another day and aim for Good or Easy. Rate honestly: choosing Again restarts that card's review count.</p>
      </section>
      <p id="vocab-count" style="color:var(--mute);margin-bottom:var(--sp-4)"></p>
      <div class="grid" id="deck-grid"></div>`;
    const grid = container.querySelector('#deck-grid');
    const dueByDeck = (SRS.dueSummary ? SRS.dueSummary().byDeck : {});
    const keys = Object.keys(VOCAB);
    let doneCount = 0;
    for (const key of keys) {
      const d = VOCAB[key];
      const p = SRS.progress(`vocab:${key}`, d.cards);
      const done = !!App.state.lessons[`vocab:${key}`];
      if (done) doneCount++;
      const due = dueByDeck[`vocab:${key}`] || 0;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${d.icon}</div>
        <h3>${d.name} ${done ? '<span class="tag" style="color:var(--good)">✓ Complete</span>' : ''} ${due > 0 ? `<span class="tag" style="background:rgba(0,85,164,.12);color:var(--bleu)">${due} due</span>` : ''}</h3>
        <p>${d.cards.length} cards · ${p.learned}/${p.total} cards reviewed at least twice</p>
        <div class="meter" role="progressbar" aria-label="${d.name}: cards reviewed at least twice" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.pct}"><div style="width:${p.pct}%"></div></div>
        <p style="margin-top:var(--sp-3);color:${p.pct === 100 ? 'var(--good)' : 'var(--mute)'}">${p.pct === 100 ? 'Review bar full — ready to move to the next deck.' : done ? 'First session complete. Fill the review bar before moving on.' : 'Study once, then revise to fill the review bar.'}</p>`;
      card.onclick = () => App.go('vocab', { deck: key });
      grid.appendChild(card);
    }
    container.querySelector('#vocab-count').textContent = `${doneCount} of ${keys.length} decks complete. Reviews remain available after completion.`;
  }

  function renderStudy(container, deckKey) {
    const deck = VOCAB[deckKey];
    if (!deck) { App.go('vocab'); return; }
    let cards = SRS.dueCards(`vocab:${deckKey}`, deck.cards);
    if (cards.length === 0) cards = deck.cards.slice();
    // shuffle
    cards = cards.sort(() => Math.random() - 0.5);
    let i = 0;
    // Same-session relearning: a card you rate Again/Hard reappears later in THIS
    // session (Anki's "learning step"), not just a day from now — that second
    // in-session rep is the biggest driver of retention. Capped per card so a
    // word you keep missing doesn't loop forever.
    const requeues = new Map();

    function show() {
      if (i >= cards.length) return finish();
      const c = cards[i];
      let rated = false;
      const genderTag = c.g ? `<span class="tag ${c.g === 'f' ? 'fem' : 'masc'}">${c.g === 'f' ? 'feminine' : 'masculine'}</span>` : '';
      container.innerHTML = `
        ${Chrome.render({
          back: 'vocab',
          crumbs: ['Vocab', deck.name],
          progress: { current: i, total: cards.length }
        })}
        <div class="lesson">
          <h1>${deck.icon} ${deck.name}</h1>
          <div class="flashcard" id="fc" role="button" tabindex="0" aria-label="French flashcard. Press Enter or Space to flip">
            <div class="inner">
              <div class="face front">
                <div>
                  <div class="emoji">${c.emoji || '🇫🇷'}</div>
                  <div class="word">${c.fr}</div>
                  <div class="ipa">${c.ipa || ''}</div>
                  <div class="row" style="justify-content:center;margin-top:14px"><button class="btn secondary" id="play">🔊 Hear</button></div>
                </div>
              </div>
              <div class="face back">
                <div>
                  ${genderTag}
                  <div class="translation">${c.en}</div>
                  ${c.ex ? `<div class="example">${c.ex}</div>` : ''}
                </div>
              </div>
            </div>
          </div>
          <p class="center" style="color:var(--mute);font-size:14px">Click card to flip. Then rate how easy it was.</p>
          <div class="srs-controls" id="srs-ctrl" style="display:none">
            <button class="btn danger" data-q="0">Again</button>
            <button class="btn secondary" data-q="3">Hard</button>
            <button class="btn" data-q="4">Good</button>
            <button class="btn success" data-q="5">Easy</button>
          </div>
          <div class="spacer"></div>
          <div class="row" style="justify-content:space-between">
            <button class="btn ghost" id="back">← Decks</button>
            <span style="color:var(--mute)">${i + 1} / ${cards.length}</span>
          </div>
        </div>`;
      const fc = container.querySelector('#fc');
      fc.onclick = (e) => {
        if (e.target.id === 'play') return;
        fc.classList.toggle('flipped');
        if (fc.classList.contains('flipped')) container.querySelector('#srs-ctrl').style.display = 'flex';
      };
      fc.onkeydown = (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest('button')) return;
        e.preventDefault();
        fc.click();
      };
      container.querySelector('#play').onclick = (e) => { e.stopPropagation(); TTS.speak(c.fr); };
      // auto-play on appear
      TTS.speakSoon(c.fr, 1.0, 250);
      container.querySelector('#back').onclick = () => App.go('vocab');
      container.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
        if (rated) return;
        rated = true;
        const q = parseInt(b.dataset.q);
        SRS.review(`vocab:${deckKey}`, c.fr, q);
        App.addXP(q >= 4 ? 5 : 2);
        // Reinsert weak cards (Again / Hard) a few positions ahead so they come
        // back before the session ends. Max 2 requeues per card.
        if (q < 4) {
          const n = requeues.get(c.fr) || 0;
          if (n < 2) {
            requeues.set(c.fr, n + 1);
            cards.splice(Math.min(i + 3, cards.length), 0, c);
          }
        }
        i++; show();
      });
    }
    function finish() {
      App.markLessonDone(`vocab:${deckKey}`);
      const progress = SRS.progress(`vocab:${deckKey}`, deck.cards);
      const ready = progress.pct === 100;
      container.innerHTML = Chrome.finishScreen({
        back: 'vocab', crumbs: ['Vocab', deck.name, 'Complete'],
        icon: '🎉',
        title: 'Bravo !',
        scoreLine: `You reviewed <b>${new Set(cards.map(x => x.fr)).size}</b> cards. This deck is marked complete.`,
        sub: ready
          ? 'Review bar full: every card has been reviewed at least twice. You are ready to move to the next deck. Keep revisiting these words when reviews are due.'
          : `Your completion is saved. ${progress.learned} of ${progress.total} cards have been reviewed at least twice. We recommend filling the review bar before moving to the next deck; come back for a revision, ideally on another day.`,
        extra: Support.winNudge(),
        actions: [
          { label: ready ? 'Next deck' : 'Review this deck', onclick: ready ? "App.go('vocab')" : `App.go('vocab', { deck: '${deckKey}' })`, primary: true, arrow: true },
          ...(!ready ? [{ label: 'All decks', onclick: "App.go('vocab')" }] : []),
          { label: 'Back to Path', onclick: "App.go('path')" },
        ],
      });
    }
    show();
  }

  return {
    render(container, params) {
      if (params && params.deck) renderStudy(container, params.deck);
      else renderDeckPicker(container);
    }
  };
})();
