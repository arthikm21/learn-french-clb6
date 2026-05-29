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
  let ctxResumed = false;
  let lastTickAt = 0;

  // Lazy AudioContext, with one-time resume on creation. Saves a state-check
  // on every tick. If creation happens before a user gesture, the context
  // starts suspended; `resume()` is harmless when already running, so calling
  // it once at construction covers both paths.
  function ensureCtx() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch { ctx = null; }
    return ctx;
  }
  function maybeResume() {
    if (!ctx || ctxResumed) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    ctxResumed = true;
  }

  // Synthesize one click. main = bright high tap (2200→900Hz, with noise burst).
  // back = softer low tap (1400→600Hz, no noise). Shared envelope, shared
  // throttle, shared settings check.
  function synth(opts) {
    if (window.Settings && !Settings.isClickSoundOn()) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    const now = Date.now();
    if (now - lastTickAt < 90) return;
    lastTickAt = now;

    const c = ensureCtx();
    if (!c) return;
    maybeResume();

    const t0 = c.currentTime;
    const { freqStart, freqEnd, dur, gain, attack = 0.004, noise = false } = opts;

    // Main tone — soft sine with quick decay
    const osc = c.createOscillator();
    const oGain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqStart, t0);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    oGain.gain.setValueAtTime(0, t0);
    oGain.gain.linearRampToValueAtTime(gain, t0 + attack);
    oGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(oGain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);

    // Optional noise burst — gives the bright tick a percussive edge
    if (noise) {
      const buf = c.createBuffer(1, Math.ceil(c.sampleRate * 0.012), c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const ns = c.createBufferSource();
      ns.buffer = buf;
      const nGain = c.createGain();
      nGain.gain.value = gain * 0.35;
      const hp = c.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1800;
      ns.connect(hp).connect(nGain).connect(c.destination);
      ns.start(t0);
    }
  }

  function tick()     { synth({ freqStart: 2200, freqEnd: 900, dur: 0.045, gain: 0.12, noise: true }); }
  function tickBack() { synth({ freqStart: 1400, freqEnd: 600, dur: 0.050, gain: 0.10, attack: 0.005 }); }

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
