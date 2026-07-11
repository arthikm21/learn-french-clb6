// Durable learning evidence. Completion answers “was this path item covered?”;
// mastery answers “what happened across attempts, and did assessed work meet
// its threshold?” Both are useful, but they must never be conflated.
window.Mastery = (function () {
  const KEY = 'mastery_v1';
  const MAX_HISTORY = 12;

  function load() {
    try {
      const value = JSON.parse(window.Storage.getItem(KEY));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function save(records) {
    window.Storage.setItem(KEY, JSON.stringify(records));
  }
  function clamp(value) {
    return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  }
  function get(key) { return load()[key] || null; }

  function recordAttempt(key, options = {}) {
    const records = load();
    const previous = records[key] || { attempts: 0, history: [] };
    const score = clamp(options.score);
    const threshold = clamp(options.threshold == null ? 70 : options.threshold);
    const best = Math.max(previous.best == null ? 0 : previous.best, score);
    const attempt = {
      at: Date.now(),
      score,
      kind: String(options.kind || 'assessed'),
    };
    const history = [...(Array.isArray(previous.history) ? previous.history : []), attempt].slice(-MAX_HISTORY);
    const record = {
      attempts: (previous.attempts || 0) + 1,
      best,
      last: score,
      threshold,
      status: best >= threshold ? 'mastered' : 'building',
      updatedAt: attempt.at,
      history,
    };
    records[key] = record;
    save(records);
    return record;
  }

  function recordPractice(key, options = {}) {
    const records = load();
    const previous = records[key] || { attempts: 0, history: [] };
    const attempt = { at: Date.now(), score: null, kind: String(options.kind || 'practice') };
    const history = [...(Array.isArray(previous.history) ? previous.history : []), attempt].slice(-MAX_HISTORY);
    const record = {
      ...previous,
      attempts: (previous.attempts || 0) + 1,
      status: previous.status === 'mastered' ? 'mastered' : 'practiced',
      updatedAt: attempt.at,
      history,
    };
    records[key] = record;
    save(records);
    return record;
  }

  function all() { return load(); }

  return { get, all, recordAttempt, recordPractice };
})();
