// User-facing UX settings. Per-device (not per-user) — persists across profile
// switches. Defaults: both ON. Stored in localStorage as '1' / '0' strings.
//
// Reads are cached in memory after first hit. Profile renders + per-click
// handlers call the getters many times per session; localStorage is fast
// but not free, and the cache makes the call cost ≈ zero.

window.Settings = (function () {
  const KEY_CLICK_SOUND = 'fr_setting_clicks_v1';
  const KEY_PRONOUNCE   = 'fr_setting_pronounce_v1';

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

  return {
    isClickSoundOn() { return read(KEY_CLICK_SOUND, true); },
    setClickSound(on) { write(KEY_CLICK_SOUND, !!on); },

    isPronounceOn()  { return read(KEY_PRONOUNCE, true); },
    setPronounce(on) { write(KEY_PRONOUNCE, !!on); },
  };
})();
