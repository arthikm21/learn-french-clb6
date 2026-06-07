// User-facing UX settings. Per-device (not per-user) — persists across profile
// switches. Defaults documented in the getters. Boolean flags stored as '1'/'0';
// string + number values stored as their string form.
//
// Reads are cached in memory after first hit. Profile renders + per-click
// handlers call the getters many times per session; localStorage is fast
// but not free, and the cache makes the call cost ≈ zero.

window.Settings = (function () {
  // Booleans
  const KEY_CLICK_SOUND     = 'fr_setting_clicks_v1';
  const KEY_PRONOUNCE       = 'fr_setting_pronounce_v1';
  const KEY_SHOW_GLOSS      = 'fr_setting_gloss_v1';
  const KEY_CELEBRATIONS    = 'fr_setting_celebrations_v1';
  const KEY_MASCOT          = 'fr_setting_mascot_v1';
  const KEY_CONFETTI        = 'fr_setting_confetti_v1';

  // Strings / numbers
  const KEY_CLICK_STYLE     = 'fr_setting_click_style_v1';   // 'soft' | 'default' | 'mechanical'
  const KEY_MASTER_VOLUME   = 'fr_setting_master_volume_v1'; // '0' to '1'
  const KEY_ANIM_LEVEL      = 'fr_setting_anim_level_v1';    // 'off' | 'subtle' | 'full'

  const cache = {};

  function readBool(key, def) {
    if (key in cache) return cache[key];
    const v = localStorage.getItem(key);
    return (cache[key] = v === null ? def : v === '1');
  }
  function writeBool(key, on) {
    cache[key] = !!on;
    localStorage.setItem(key, on ? '1' : '0');
  }
  function readStr(key, def) {
    if (key in cache) return cache[key];
    const v = localStorage.getItem(key);
    return (cache[key] = v === null ? def : v);
  }
  function writeStr(key, val) {
    cache[key] = String(val);
    localStorage.setItem(key, String(val));
  }
  function readNum(key, def) {
    if (key in cache) return cache[key];
    const v = localStorage.getItem(key);
    const n = v === null ? def : parseFloat(v);
    return (cache[key] = isNaN(n) ? def : n);
  }
  function writeNum(key, val) {
    const n = Math.max(0, Math.min(1, parseFloat(val) || 0));
    cache[key] = n;
    localStorage.setItem(key, String(n));
  }

  // Apply body.no-gloss → instantly hides .gloss everywhere via CSS.
  function applyGlossClass() {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('no-gloss', !readBool(KEY_SHOW_GLOSS, true));
    }
  }
  // Apply body[data-anim] so CSS can scope animations by level.
  // - 'off'    → no animations at all (instant)
  // - 'subtle' → opacity-only, no springs/shake/particles
  // - 'full'   → everything on
  function applyAnimClass() {
    if (typeof document === 'undefined' || !document.body) return;
    let level = readStr(KEY_ANIM_LEVEL, '');
    if (!level) {
      // First load default: respect OS-level "Reduce motion" preference.
      const prefersReduce = typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      level = prefersReduce ? 'subtle' : 'full';
    }
    document.body.dataset.anim = level;
  }
  if (typeof document !== 'undefined') {
    const apply = () => { applyGlossClass(); applyAnimClass(); };
    if (document.body) apply();
    else document.addEventListener('DOMContentLoaded', apply);
  }

  return {
    // Click sound (master enable)
    isClickSoundOn()  { return readBool(KEY_CLICK_SOUND, true); },
    setClickSound(on) { writeBool(KEY_CLICK_SOUND, !!on); },

    // Tap-to-pronounce on French words
    isPronounceOn()   { return readBool(KEY_PRONOUNCE, true); },
    setPronounce(on)  { writeBool(KEY_PRONOUNCE, !!on); },

    // English gloss visibility
    isShowGloss()     { return readBool(KEY_SHOW_GLOSS, true); },
    setShowGloss(on)  { writeBool(KEY_SHOW_GLOSS, !!on); applyGlossClass(); },

    // Celebration sounds (correct / wrong / complete / gate)
    isCelebrationsOn()  { return readBool(KEY_CELEBRATIONS, true); },
    setCelebrations(on) { writeBool(KEY_CELEBRATIONS, !!on); },

    // Mascot animations
    isMascotOn()      { return readBool(KEY_MASCOT, true); },
    setMascot(on)     { writeBool(KEY_MASCOT, !!on); },

    // Confetti on milestones
    isConfettiOn()    { return readBool(KEY_CONFETTI, true); },
    setConfetti(on)   { writeBool(KEY_CONFETTI, !!on); },

    // Click style: 'soft' | 'default' | 'mechanical'
    getClickStyle()   { return readStr(KEY_CLICK_STYLE, 'default'); },
    setClickStyle(s)  { writeStr(KEY_CLICK_STYLE, s); },

    // Master volume 0..1
    getMasterVolume() { return readNum(KEY_MASTER_VOLUME, 0.7); },
    setMasterVolume(v) {
      writeNum(KEY_MASTER_VOLUME, v);
      if (window.Sounds && typeof Sounds.setMasterVolume === 'function') {
        Sounds.setMasterVolume(readNum(KEY_MASTER_VOLUME, 0.7));
      }
    },

    // Animation level: 'off' | 'subtle' | 'full'
    getAnimLevel()    { return readStr(KEY_ANIM_LEVEL, '') || (
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'subtle' : 'full'
    ); },
    setAnimLevel(level) {
      const v = ['off', 'subtle', 'full'].includes(level) ? level : 'full';
      writeStr(KEY_ANIM_LEVEL, v);
      applyAnimClass();
    },
  };
})();
