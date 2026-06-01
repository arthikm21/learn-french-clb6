// User-facing UX settings. Per-device (not per-user) — persists across profile
// switches. Defaults: both ON. Stored in localStorage as '1' / '0' strings.
//
// Reads are cached in memory after first hit. Profile renders + per-click
// handlers call the getters many times per session; localStorage is fast
// but not free, and the cache makes the call cost ≈ zero.

window.Settings = (function () {
  const KEY_CLICK_SOUND = 'fr_setting_clicks_v1';
  const KEY_PRONOUNCE   = 'fr_setting_pronounce_v1';
  const KEY_SHOW_GLOSS  = 'fr_setting_gloss_v1';

  const cache = {}; // key → boolean

  function read(key, def) {
    if (key in cache) return cache[key];
    const v = localStorage.getItem(key);
    return (cache[key] = v === null ? def : v === '1');
  }
  function write(key, on) {
    cache[key] = !!on;
    localStorage.setItem(key, on ? '1' : '0');
  }

  // Apply the body.no-gloss class so the CSS hides all .gloss elements
  // instantly without each module re-rendering. Called on init + on toggle.
  function applyGlossClass() {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('no-gloss', !read(KEY_SHOW_GLOSS, true));
    }
  }
  if (typeof document !== 'undefined') {
    if (document.body) applyGlossClass();
    else document.addEventListener('DOMContentLoaded', applyGlossClass);
  }

  return {
    isClickSoundOn() { return read(KEY_CLICK_SOUND, true); },
    setClickSound(on) { write(KEY_CLICK_SOUND, !!on); },

    isPronounceOn()  { return read(KEY_PRONOUNCE, true); },
    setPronounce(on) { write(KEY_PRONOUNCE, !!on); },

    isShowGloss()    { return read(KEY_SHOW_GLOSS, true); },
    setShowGloss(on) { write(KEY_SHOW_GLOSS, !!on); applyGlossClass(); },
  };
})();
