// Vocab flashcards with SRS + audio + quiz follow-up.
window.VocabModule = (function () {
  function renderDeckPicker(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Vocab'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Vocabulary</p>
        <h1>Hear it.<br/>Then know it.</h1>
        <p style="margin-top:var(--sp-4)">Pick a deck. Flip the card. Rate how easy. SRS schedules your next review automatically.</p>
      </section>
      <div class="grid" id="deck-grid"></div>`;
    const grid = container.querySelector('#deck-grid');
    const dueByDeck = (SRS.dueSummary ? SRS.dueSummary().byDeck : {});
    for (const key of Object.keys(VOCAB)) {
      const d = VOCAB[key];
      const p = SRS.progress(key, d.cards);
      const due = dueByDeck[key] || 0;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon">${d.icon}</div>
        <h3>${d.name} ${due > 0 ? `<span class="tag" style="background:rgba(0,85,164,.12);color:var(--bleu)">${due} due</span>` : ''}</h3>
        <p>${d.cards.length} cards · ${p.learned}/${p.total} learned</p>
        <div class="meter"><div style="width:${p.pct}%"></div></div>`;
      card.onclick = () => App.go('vocab', { deck: key });
      grid.appendChild(card);
    }
  }

  function renderStudy(container, deckKey) {
    const deck = VOCAB[deckKey];
    if (!deck) { App.go('vocab'); return; }
    let cards = SRS.dueCards(deckKey, deck.cards);
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
      const genderTag = c.g ? `<span class="tag ${c.g === 'f' ? 'fem' : 'masc'}">${c.g === 'f' ? 'feminine' : 'masculine'}</span>` : '';
      container.innerHTML = `
        ${Chrome.render({
          back: 'vocab',
          crumbs: ['Vocab', deck.name],
          progress: { current: i, total: cards.length }
        })}
        <div class="lesson">
          <h2>${deck.icon} ${deck.name}</h2>
          <div class="flashcard" id="fc">
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
      container.querySelector('#play').onclick = (e) => { e.stopPropagation(); TTS.speak(c.fr); };
      // auto-play on appear
      TTS.speakSoon(c.fr, 1.0, 250);
      container.querySelector('#back').onclick = () => App.go('vocab');
      container.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
        const q = parseInt(b.dataset.q);
        SRS.review(deckKey, c.fr, q);
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
      container.innerHTML = `
        ${Chrome.render({ back: 'vocab', crumbs: ['Vocab', deck.name, 'Complete'] })}
        <div class="lesson center">
          <div class="empty">
            <div class="big-icon">🎉</div>
            <h2>Bravo !</h2>
            <p>You reviewed ${new Set(cards.map(x => x.fr)).size} cards. Come back tomorrow — the system surfaces the cards you need.</p>
            ${Support.winNudge()}
            <div class="spacer"></div>
            <div class="row" style="justify-content:center">
              <button class="btn primary big" onclick="App.go('vocab')">More vocab<span class="arr">→</span></button>
              <button class="btn ghost big" onclick="App.go('path')">Back to Path</button>
            </div>
          </div>
        </div>`;
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
