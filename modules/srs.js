// Simple SM-2 spaced repetition. Persists per-card state in localStorage.
window.SRS = (function () {
  function load() { try { return JSON.parse(window.Storage.getItem('srs')) || {}; } catch { return {}; } }
  function save(s) { window.Storage.setItem('srs', JSON.stringify(s)); }

  function cardId(deck, fr) { return deck + ':' + fr; }

  function getCard(deck, fr) {
    const s = load();
    return s[cardId(deck, fr)] || { ef: 2.5, interval: 0, reps: 0, due: 0 };
  }

  // quality: 0=again, 3=hard, 4=good, 5=easy
  function review(deck, fr, quality) {
    const s = load();
    const id = cardId(deck, fr);
    const c = s[id] || { ef: 2.5, interval: 0, reps: 0, due: 0 };
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
    save(s);
    return c;
  }

  function dueCards(deck, cards) {
    const now = Date.now();
    const s = load();
    return cards.filter(c => {
      const rec = s[cardId(deck, c.fr)];
      return !rec || rec.due <= now;
    });
  }

  function progress(deck, cards) {
    const s = load();
    let learned = 0;
    for (const c of cards) {
      const rec = s[cardId(deck, c.fr)];
      if (rec && rec.reps >= 2) learned++;
    }
    return { learned, total: cards.length, pct: Math.round((learned / cards.length) * 100) };
  }

  return { review, getCard, dueCards, progress };
})();
