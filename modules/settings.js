// User-facing UX settings. Per-device (not per-user) so they persist across profile switches.
// Defaults: both ON. Stored in localStorage as '1' / '0' strings.

window.Settings = (function () {
  const KEY_CLICK_SOUND = 'fr_setting_clicks_v1';
  const KEY_PRONOUNCE   = 'fr_setting_pronounce_v1';

  function read(key, def) {
    const v = localStorage.getItem(key);
    if (v === null) return def;
    return v === '1';
  }
  function write(key, on) {
    localStorage.setItem(key, on ? '1' : '0');
  }

  return {
    isClickSoundOn() { return read(KEY_CLICK_SOUND, true); },
    setClickSound(on) { write(KEY_CLICK_SOUND, !!on); },

    isPronounceOn()  { return read(KEY_PRONOUNCE, true); },
    setPronounce(on) { write(KEY_PRONOUNCE, !!on); },
  };
})();
