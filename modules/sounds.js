// Subtle UI click feedback. Synthesized via Web Audio (zero asset bytes).
// Strategy:
//   - Very short (~40ms), low gain (0.12), soft envelope. Not metallic, not "ding"-y.
//   - Throttled to one tick per 90ms — rapid double-clicks stay quiet.
//   - Fires on .btn / .option / .card[clickable] / .nav a / .chrome-back / .icon-btn / .path-node / .hamburger.
//   - Skips: inputs, mic-btn (own sound), .wp-play (audio play already), already-disabled.
//   - Respects Settings.isClickSoundOn().
//   - AudioContext lazy-created on first interaction (browser autoplay rules).

window.Sounds = (function () {
  let ctx = null;
  let lastTickAt = 0;

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch { ctx = null; }
    return ctx;
  }

  // The tick: short envelope with a soft mid-frequency tone + tiny noise burst.
  // Tuned to feel like a UI feedback tap, not a chime.
  function tick(strength) {
    if (window.Settings && !Settings.isClickSoundOn()) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    const now = Date.now();
    if (now - lastTickAt < 90) return;
    lastTickAt = now;

    const c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') { c.resume().catch(() => {}); }

    const t0 = c.currentTime;
    const dur = 0.045;
    const baseGain = 0.12 * (strength || 1);

    // Main tone — soft sine with quick decay
    const osc = c.createOscillator();
    const oGain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, t0);
    osc.frequency.exponentialRampToValueAtTime(900, t0 + dur);
    oGain.gain.setValueAtTime(0, t0);
    oGain.gain.linearRampToValueAtTime(baseGain, t0 + 0.004);
    oGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(oGain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);

    // Tiny noise tap — gives it the percussive feel
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * 0.012), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const nGain = c.createGain();
    nGain.gain.value = baseGain * 0.35;
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    noise.connect(hp).connect(nGain).connect(c.destination);
    noise.start(t0);
  }

  // A second variant for "back" / "cancel" — slightly lower pitch.
  function tickBack() {
    if (window.Settings && !Settings.isClickSoundOn()) return;
    const now = Date.now();
    if (now - lastTickAt < 90) return;
    lastTickAt = now;
    const c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') { c.resume().catch(() => {}); }
    const t0 = c.currentTime;
    const dur = 0.05;
    const baseGain = 0.10;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t0);
    osc.frequency.exponentialRampToValueAtTime(600, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(baseGain, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Selectors that should produce a click sound.
  // Order matters: more-specific first.
  function shouldTick(target) {
    if (!target || target.nodeType !== 1) return null;

    // Skip if anywhere along the path is an input / textarea / explicit silent.
    if (target.closest('input, textarea, [data-no-tick]')) return null;

    // Audio-producing controls already have feedback via their own audio.
    if (target.closest('.mic-btn, .wp-play, [data-play], [data-rate], #r-play, #r-stop, #play, #replay, #hear, .wp-close')) return null;

    // Disabled buttons don't tick.
    const btn = target.closest('button, .btn');
    if (btn && btn.disabled) return null;

    // Back / icon-button → soft variant
    if (target.closest('.chrome-back, .icon-btn, .hamburger')) return 'back';

    // Primary click affordances → main tick
    if (target.closest('.btn, .option, .token, .mem-card, .nav a, [data-route], [data-phase], [data-ph], [data-pick], [data-i], [data-g], [data-q], [data-switch], [data-u], [data-filter], [data-sig], [data-play]')) return 'main';

    // Cards that are clickable (have onclick or cursor:pointer through .card class)
    if (target.closest('.card, .path-node, .phase-chip, .spotlight[onclick]')) {
      // Filter out non-clickable display cards
      const card = target.closest('.card, .path-node, .phase-chip, .spotlight');
      if (card && card.style.cursor === 'default') return null;
      return 'main';
    }

    return null;
  }

  // Global delegated listener — fires on pointer-down for snappy feel.
  function setup() {
    const handler = (e) => {
      // Left button only (or touch).
      if (e.button != null && e.button !== 0) return;
      const kind = shouldTick(e.target);
      if (!kind) return;
      if (kind === 'back') tickBack();
      else tick();
    };
    // Use pointerdown so feedback fires before the click action — feels more responsive.
    document.addEventListener('pointerdown', handler, true);
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  return { tick, tickBack };
})();
