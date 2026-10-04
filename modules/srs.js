// Simple SM-2 spaced repetition. Persists per-card state in localStorage.
window.SRS = (function () {
  let cache = null;
  let cacheUser = null; // whose data the cache holds — profiles switch without a page reload
  function load() {
    // Profile switched since we cached? Drop the old user's data instead of
    // serving it (or worse, saving it) under the new user's namespace.
    const u = window.Storage.getCurrentUser();
    if (cache && u === cacheUser) return cache;
    cacheUser = u;
    try { cache = JSON.parse(window.Storage.getItem('srs')) || {}; } catch { cache = {}; }
    return cache;
  }
  function save(s) {
    cache = s;
    cacheUser = window.Storage.getCurrentUser();
    // A rating is learner progress: commit before advancing the card. A
    // debounce could be cancelled by a profile switch or miss an immediate
    // reload/backup, leaving a just-finished session's last ratings unsaved.
    if (!window.Storage.setItem('srs', JSON.stringify(s))) {
      if (window.Toast) Toast.info('Review progress could not be saved. Free up browser storage before leaving.');
    }
  }

  // Reset/restore can replace storage without changing the profile name.
  // App reloads invalidate this cache as well as the completion state.
  function reload() {
    cache = null;
    cacheUser = null;
  }

  const SEP = '\u001f';
  function cardId(deck, fr) { return deck + SEP + fr; }
  function legacyDeck(deck) { return String(deck).replace(/^(vocab|speak):/, ''); }
  function legacyCardId(deck, fr) { return legacyDeck(deck) + ':' + fr; }
  function findRecord(s, deck, fr) {
    return s[cardId(deck, fr)] || s[legacyCardId(deck, fr)] || null;
  }

  function getCard(deck, fr) {
    const s = load();
    return findRecord(s, deck, fr) || { ef: 2.5, interval: 0, reps: 0, due: 0 };
  }

  // quality: 0=again, 3=hard, 4=good, 5=easy
  function review(deck, fr, quality) {
    const s = load();
    const id = cardId(deck, fr);
    const legacyId = legacyCardId(deck, fr);
    const c = s[id] || s[legacyId] || { ef: 2.5, interval: 0, reps: 0, due: 0 };
    if (quality < 3) {
      c.reps = 0;
      c.interval = 1;
    } else {
      c.reps += 1;
      if (c.reps === 1) c.interval = 1;
      else if (c.reps === 2) c.interval = 3;
      else c.interval = Math.round(c.interval * c.ef);
      c.ef = Math.max(1.3, c.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    }
    c.due = Date.now() + c.interval * 24 * 60 * 60 * 1000;
    s[id] = c;
    if (legacyId !== id) delete s[legacyId];
    save(s);
    return c;
  }

  function dueCards(deck, cards) {
    const now = Date.now();
    const s = load();
    return cards.filter(c => {
      const rec = findRecord(s, deck, c.fr);
      return !rec || rec.due <= now;
    });
  }

  function progress(deck, cards) {
    const s = load();
    let learned = 0;
    for (const c of cards) {
      const rec = findRecord(s, deck, c.fr);
      if (rec && rec.reps >= 2) learned++;
    }
    return { learned, total: cards.length, pct: Math.round((learned / cards.length) * 100) };
  }

  // Reviews due right now across every deck — only cards the learner has
  // actually seen (unseen cards are "new", not "due"). Powers the home-page
  // daily-review nudge.
  function dueSummary() {
    const s = load();
    const now = Date.now();
    const byDeck = {};
    let total = 0;
    for (const [id, rec] of Object.entries(s)) {
      if (!rec || !(rec.due <= now)) continue;
      let deck = '';
      if (id.includes(SEP)) {
        deck = id.slice(0, id.indexOf(SEP));
      } else {
        // Legacy IDs used ':' for both deck and content. Resolve old records
        // against the loaded content, then surface a namespaced route.
        const split = id.indexOf(':');
        const root = split >= 0 ? id.slice(0, split) : id;
        const rest = split >= 0 ? id.slice(split + 1) : '';
        if (root === 'connector' || root === 'scenario') {
          const second = rest.indexOf(':');
          deck = second >= 0 ? `${root}:${rest.slice(0, second)}` : root;
        } else {
          const vocabMatch = window.VOCAB && VOCAB[root] && VOCAB[root].cards.some(c => c.fr === rest);
          const speakItems = window.SPEAK_SETS && SPEAK_SETS[root] && SPEAK_SETS[root].items;
          const speakMatch = Array.isArray(speakItems) && speakItems.some(item => (typeof item === 'string' ? item : item.fr) === rest);
          deck = speakMatch && !vocabMatch ? `speak:${root}` : `vocab:${root}`;
        }
      }
      if (!deck) continue;
      byDeck[deck] = (byDeck[deck] || 0) + 1;
      total++;
    }
    return { total, byDeck };
  }

  return { review, getCard, dueCards, progress, dueSummary, reload };
})();
