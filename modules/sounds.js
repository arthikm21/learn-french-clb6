// UI sound effects. Zero asset bytes — every sound synthesized via Web Audio.
//
// Palette (call via Sounds.play('<name>')):
//   click         layered clack — main button/option/card press
//   clickBack     softer woody tap — Back / icon / hamburger / drawer close
//   clickOption   slightly higher-pitched click — distinguish MCQ selection
//   correct       3-note major arpeggio (C-E-G) — right answer
//   wrong         soft descending bonk — wrong answer (not harsh)
//   complete      5-note fanfare — lesson done
//   gate          bigger fanfare + sparkle — phase gate passed
//   streak        bell + ascending tone — streak milestone
//   swoosh        wind sweep — page transition / drawer open
//   pop           tactile pop — modal open
//   tickCountdown subtle metronome — countdown tick on Wait/Next
//   warn          soft warning blip — error / load failure
//
// Style options for the primary click (Settings.getClickStyle()):
//   'soft'       — original thin tick (legacy)
//   'default'    — layered clack with low-end thump + crisp top (new default)
//   'mechanical' — brighter, ringier, faster attack — MX-blue-ish
//
// Master volume + per-category throttling. Ducks to 25% while TTS is speaking.
// Respects Settings.isClickSoundOn() AND Settings.isCelebrationsOn() flags.
// AudioContext lazy-created on first interaction (browser autoplay rules).

window.Sounds = (function () {
  let ctx = null;
  let master = null;          // master GainNode (for volume + ducking)
  let ctxResumed = false;
  let ttsDuckUntil = 0;       // timestamp; while > now, sounds duck to 25%

  // Per-category throttle window in ms — fast-tapping a button doesn't
  // machine-gun the SAME sound, but different categories can overlap.
  const throttleMs = {
    click: 70, clickBack: 70, clickOption: 70,
    correct: 250, wrong: 250, complete: 600, gate: 800, streak: 400,
    swoosh: 150, pop: 100, tickCountdown: 0, warn: 200,
  };
  const lastAt = {};

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = readMasterVolume();
      master.connect(ctx.destination);
    } catch { ctx = null; master = null; }
    return ctx;
  }
  function maybeResume() {
    if (!ctx || ctxResumed) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    ctxResumed = true;
  }

  function readMasterVolume() {
    if (window.Settings && typeof Settings.getMasterVolume === 'function') {
      const v = Settings.getMasterVolume();
      if (typeof v === 'number' && v >= 0 && v <= 1) return v;
    }
    return 0.7;
  }
  function setMasterVolume(v) {
    if (!master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(v, ctx.currentTime);
  }

  // Duck UI sounds while TTS plays so they don't fight for attention.
  function duck(ms = 800) {
    ttsDuckUntil = Date.now() + ms;
  }
  function currentGainMult() {
    return Date.now() < ttsDuckUntil ? 0.25 : 1.0;
  }

  function allowed(category) {
    if (window.Settings) {
      // Clicks gated by isClickSoundOn; celebrations gated by isCelebrationsOn.
      const isClickCat = category === 'click' || category === 'clickBack' || category === 'clickOption' || category === 'tickCountdown' || category === 'pop' || category === 'swoosh';
      if (isClickCat && !Settings.isClickSoundOn()) return false;
      const isCelebrationCat = category === 'correct' || category === 'wrong' || category === 'complete' || category === 'gate' || category === 'streak' || category === 'warn';
      if (isCelebrationCat && typeof Settings.isCelebrationsOn === 'function' && !Settings.isCelebrationsOn()) return false;
    }
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return false;
    const now = Date.now();
    if ((now - (lastAt[category] || 0)) < (throttleMs[category] || 0)) return false;
    lastAt[category] = now;
    return true;
  }

  // ───────────────────────────── PRIMITIVES ─────────────────────────────

  // One pitched body tone — sine/triangle/square, ADSR via gain envelope.
  function tone(opts) {
    const c = ctx; if (!c) return;
    const t0 = c.currentTime;
    const { type = 'sine', f0, f1 = f0, dur, gain, attack = 0.003, delay = 0 } = opts;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t0 + delay);
    if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + delay + dur);
    g.gain.setValueAtTime(0, t0 + delay);
    g.gain.linearRampToValueAtTime(gain * currentGainMult(), t0 + delay + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + delay + dur);
    osc.connect(g).connect(master);
    osc.start(t0 + delay);
    osc.stop(t0 + delay + dur + 0.02);
  }

  // Filtered noise burst — adds attack texture / "tactile" feel to clicks.
  function noiseBurst(opts) {
    const c = ctx; if (!c) return;
    const t0 = c.currentTime;
    const { dur = 0.012, gain = 0.1, hp = 1800, delay = 0 } = opts || {};
    const buf = c.createBuffer(1, Math.max(1, Math.ceil(c.sampleRate * dur)), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // Linear decay shapes the burst — sharp attack, quick fade
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const ns = c.createBufferSource();
    ns.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = hp;
    const g = c.createGain();
    g.gain.value = gain * currentGainMult();
    ns.connect(filter).connect(g).connect(master);
    ns.start(t0 + delay);
  }

  // ───────────────────────────── SOUNDS ─────────────────────────────

  function getClickStyle() {
    if (window.Settings && typeof Settings.getClickStyle === 'function') {
      return Settings.getClickStyle();
    }
    return 'default';
  }

  function playClick() {
    if (!allowed('click') || !ensureCtx()) return;
    maybeResume();
    const style = getClickStyle();
    if (style === 'soft') {
      // Legacy thin tick
      tone({ type: 'sine', f0: 2200, f1: 900, dur: 0.045, gain: 0.12 });
      noiseBurst({ dur: 0.008, gain: 0.04, hp: 1800 });
    } else if (style === 'mechanical') {
      // Brighter body + bigger noise — MX-blue-ish
      tone({ type: 'square', f0: 2400, f1: 1100, dur: 0.028, gain: 0.10, attack: 0.001 });
      tone({ type: 'sine',   f0: 120,  f1: 90,   dur: 0.025, gain: 0.20, attack: 0.001 });
      noiseBurst({ dur: 0.010, gain: 0.18, hp: 4000 });
    } else {
      // Default — layered clack: body + low thump + bright noise
      tone({ type: 'sine',   f0: 1800, f1: 700, dur: 0.032, gain: 0.13, attack: 0.001 });
      tone({ type: 'sine',   f0: 110,  f1: 80,  dur: 0.020, gain: 0.18, attack: 0.001 });
      noiseBurst({ dur: 0.006, gain: 0.10, hp: 3500 });
    }
  }

  function playClickBack() {
    if (!allowed('clickBack') || !ensureCtx()) return;
    maybeResume();
    // Softer, woodier — for back / icon / hamburger
    tone({ type: 'sine', f0: 1400, f1: 600, dur: 0.050, gain: 0.10, attack: 0.004 });
    tone({ type: 'sine', f0: 95,   f1: 70,  dur: 0.025, gain: 0.10 });
  }

  function playClickOption() {
    if (!allowed('clickOption') || !ensureCtx()) return;
    maybeResume();
    // Slightly higher-pitched click to distinguish from primary
    tone({ type: 'sine', f0: 2400, f1: 1200, dur: 0.040, gain: 0.12, attack: 0.001 });
    tone({ type: 'sine', f0: 130,  f1: 100,  dur: 0.022, gain: 0.14 });
    noiseBurst({ dur: 0.005, gain: 0.07, hp: 4000 });
  }

  function playCorrect() {
    if (!allowed('correct') || !ensureCtx()) return;
    maybeResume();
    // C5, E5, G5 — bright major arpeggio
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((f, i) => {
      tone({ type: 'sine',     f0: f, dur: 0.18, gain: 0.16, attack: 0.005, delay: i * 0.07 });
      tone({ type: 'triangle', f0: f * 2, dur: 0.16, gain: 0.05, attack: 0.005, delay: i * 0.07 });
    });
  }

  function playWrong() {
    if (!allowed('wrong') || !ensureCtx()) return;
    maybeResume();
    // Soft descending bonk — not harsh
    tone({ type: 'triangle', f0: 380, f1: 200, dur: 0.18, gain: 0.18, attack: 0.005 });
    tone({ type: 'sine',     f0: 190, f1: 100, dur: 0.18, gain: 0.10, attack: 0.005 });
  }

  function playComplete() {
    if (!allowed('complete') || !ensureCtx()) return;
    maybeResume();
    // C-E-G-C5-E5 fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((f, i) => {
      tone({ type: 'sine',     f0: f, dur: 0.30 - i * 0.02, gain: 0.18, attack: 0.005, delay: i * 0.09 });
      tone({ type: 'triangle', f0: f * 1.5, dur: 0.20, gain: 0.05, delay: i * 0.09 });
    });
  }

  function playGate() {
    if (!allowed('gate') || !ensureCtx()) return;
    maybeResume();
    // Bigger fanfare with bell-like overtones
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      tone({ type: 'sine',     f0: f,        dur: 0.45,  gain: 0.20, attack: 0.005, delay: i * 0.10 });
      tone({ type: 'triangle', f0: f * 2,    dur: 0.40,  gain: 0.08, delay: i * 0.10 });
      tone({ type: 'sine',     f0: f * 3.01, dur: 0.35,  gain: 0.04, delay: i * 0.10 + 0.02 });
    });
    // Sparkle on top
    setTimeout(() => {
      [2000, 2400, 2800, 3200].forEach((f, i) => {
        tone({ type: 'sine', f0: f, dur: 0.08, gain: 0.05, delay: i * 0.05 });
      });
    }, 350);
  }

  function playStreak() {
    if (!allowed('streak') || !ensureCtx()) return;
    maybeResume();
    // Bell + ascending tone
    tone({ type: 'sine', f0: 800,  f1: 1200, dur: 0.30, gain: 0.15, attack: 0.005 });
    tone({ type: 'sine', f0: 1600, dur: 0.25, gain: 0.08, delay: 0.10 });
    tone({ type: 'sine', f0: 2400, dur: 0.20, gain: 0.05, delay: 0.18 });
  }

  function playSwoosh() {
    if (!allowed('swoosh') || !ensureCtx()) return;
    maybeResume();
    // Filtered noise sweep — soft wind
    const c = ctx;
    const t0 = c.currentTime;
    const dur = 0.18;
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    const ns = c.createBufferSource();
    ns.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(400, t0);
    bp.frequency.exponentialRampToValueAtTime(2200, t0 + dur);
    const g = c.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.06 * currentGainMult(), t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    ns.connect(bp).connect(g).connect(master);
    ns.start(t0);
  }

  function playPop() {
    if (!allowed('pop') || !ensureCtx()) return;
    maybeResume();
    tone({ type: 'sine', f0: 1200, f1: 600, dur: 0.10, gain: 0.13, attack: 0.002 });
    tone({ type: 'sine', f0: 200,  dur: 0.08, gain: 0.10 });
  }

  function playTickCountdown() {
    if (!allowed('tickCountdown') || !ensureCtx()) return;
    maybeResume();
    tone({ type: 'sine', f0: 1500, dur: 0.025, gain: 0.06, attack: 0.001 });
  }

  function playWarn() {
    if (!allowed('warn') || !ensureCtx()) return;
    maybeResume();
    tone({ type: 'triangle', f0: 450, dur: 0.10, gain: 0.14, attack: 0.003 });
    tone({ type: 'triangle', f0: 350, dur: 0.10, gain: 0.10, delay: 0.10 });
  }

  // Single dispatch entrypoint — modules call Sounds.play('correct') etc.
  function play(name) {
    switch (name) {
      case 'click':         return playClick();
      case 'clickBack':     return playClickBack();
      case 'clickOption':   return playClickOption();
      case 'correct':       return playCorrect();
      case 'wrong':         return playWrong();
      case 'complete':      return playComplete();
      case 'gate':          return playGate();
      case 'streak':        return playStreak();
      case 'swoosh':        return playSwoosh();
      case 'pop':           return playPop();
      case 'tickCountdown': return playTickCountdown();
      case 'warn':          return playWarn();
    }
  }

  // ─────────────────────── GLOBAL CLICK DELEGATION ───────────────────────

  function shouldTick(target) {
    if (!target || target.nodeType !== 1) return null;
    if (target.closest('input, textarea, [data-no-tick]')) return null;
    if (target.closest('.mic-btn, .wp-play, [data-play], [data-rate], #r-play, #r-stop, #play, #replay, #hear, .wp-close')) return null;
    const btn = target.closest('button, .btn');
    if (btn && btn.disabled) return null;
    if (target.closest('.chrome-back, .icon-btn, .hamburger, #nav-close, .credit-modal-close')) return 'back';
    if (target.closest('.option, [data-pick], [data-i], [data-g]')) return 'option';
    if (target.closest('.btn, .token, .mem-card, .nav a, [data-route], [data-phase], [data-ph], [data-q], [data-switch], [data-u], [data-filter], [data-sig]')) return 'main';
    if (target.closest('.card, .path-node, .phase-chip, .spotlight[onclick]')) {
      const card = target.closest('.card, .path-node, .phase-chip, .spotlight');
      if (card && card.style.cursor === 'default') return null;
      return 'main';
    }
    return null;
  }

  function setup() {
    const handler = (e) => {
      if (e.button != null && e.button !== 0) return;
      const kind = shouldTick(e.target);
      if (!kind) return;
      if (kind === 'back')   playClickBack();
      else if (kind === 'option') playClickOption();
      else playClick();
    };
    document.addEventListener('pointerdown', handler, true);
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  // Back-compat: keep old API surface so any external callers don't break.
  function tick()     { playClick(); }
  function tickBack() { playClickBack(); }

  return {
    play, tick, tickBack,
    duck, setMasterVolume,
  };
})();
