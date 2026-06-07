// Visual celebration effects — confetti burst, option sparkles, streak speed lines.
//
//   Celebrate.confetti({ intensity: 'small' | 'large' })  // milestone burst
//   Celebrate.sparkle(element)                            // emit ✨ from element
//   Celebrate.speedLines(element)                         // hot-streak flash
//
// All effects:
//   • Respect Settings.isConfettiOn() / getAnimLevel()
//   • Cap particle count on mobile (≤ 600px width)
//   • Auto-clean their DOM nodes after the animation completes
//   • No-op silently if Settings indicates animations are off

window.Celebrate = (function () {

  // French flag palette + the brand accent for variety
  const COLORS = [
    '#0055A4', // bleu
    '#FFFFFF', // blanc
    '#EF4135', // rouge
    '#5E5CE6', // accent
    '#FFD60A', // bonus gold
  ];

  function animOff() {
    if (window.Settings && typeof Settings.getAnimLevel === 'function') {
      return Settings.getAnimLevel() === 'off';
    }
    return false;
  }
  function confettiAllowed() {
    if (animOff()) return false;
    if (window.Settings && typeof Settings.isConfettiOn === 'function') {
      return Settings.isConfettiOn();
    }
    return true;
  }
  function isMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 600;
  }

  // ────────────────────────── CONFETTI BURST ──────────────────────────

  function confetti(opts) {
    if (!confettiAllowed()) return;
    const intensity = (opts && opts.intensity) || 'small';
    // Smaller bursts on mobile; cap big bursts to keep paint cheap.
    let count;
    if (intensity === 'large') count = isMobile() ? 30 : 80;
    else                       count = isMobile() ? 18 : 40;

    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    document.body.appendChild(layer);

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      // Random emission angle + force → polar to cartesian
      const angle = Math.random() * Math.PI * 2;
      const dist = 180 + Math.random() * (intensity === 'large' ? 420 : 260);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist + 200; // bias downward (gravity feel)
      const rz = (Math.random() - 0.5) * 1200;
      piece.style.setProperty('--dx', dx + 'px');
      piece.style.setProperty('--dy', dy + 'px');
      piece.style.setProperty('--rz', rz + 'deg');
      piece.style.background = COLORS[i % COLORS.length];
      // Stagger emission slightly so it looks like a real burst, not a freeze-frame
      piece.style.animationDelay = (Math.random() * 80) + 'ms';
      layer.appendChild(piece);
      // Kick off the animation on next frame
      requestAnimationFrame(() => piece.classList.add('go'));
    }

    setTimeout(() => layer.remove(), 1700);
  }

  // ────────────────────────── OPTION SPARKLES ──────────────────────────

  function sparkle(target) {
    if (animOff() || !target) return;
    // Sparkles are tied to celebrations conceptually, but they're cheap —
    // gate them on the bigger "celebrations" sound switch so a user who
    // muted reward chimes also gets a quieter visual.
    if (window.Settings && typeof Settings.isCelebrationsOn === 'function'
        && !Settings.isCelebrationsOn()) return;

    // Anchor the sparkle layer to the option element
    const rect = target.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    layer.style.position = 'fixed';
    layer.style.left = rect.left + 'px';
    layer.style.top  = rect.top  + 'px';
    layer.style.width  = rect.width  + 'px';
    layer.style.height = rect.height + 'px';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = 250;
    document.body.appendChild(layer);

    const glyphs = ['✨', '⭐', '✦'];
    const n = isMobile() ? 4 : 6;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = glyphs[i % glyphs.length];
      // Random horizontal start within the option
      const startX = 8 + Math.random() * Math.max(0, rect.width - 16);
      const startY = rect.height * 0.4 + Math.random() * (rect.height * 0.4);
      s.style.left = startX + 'px';
      s.style.top  = startY + 'px';
      // Float up + slightly outward
      s.style.setProperty('--dx', ((Math.random() - 0.5) * 40) + 'px');
      s.style.setProperty('--dy', (-50 - Math.random() * 30) + 'px');
      s.style.animationDelay = (Math.random() * 120) + 'ms';
      layer.appendChild(s);
    }
    setTimeout(() => layer.remove(), 1000);
  }

  // ────────────────────────── STREAK SPEED LINES ──────────────────────

  function speedLines(target) {
    if (animOff() || !target) return;
    if (window.Settings && typeof Settings.isCelebrationsOn === 'function'
        && !Settings.isCelebrationsOn()) return;
    // Speed lines = radial spokes — pure CSS via a single element with
    // repeating-conic-gradient. Cheap.
    const rect = target.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'speed-lines';
    el.style.position = 'fixed';
    el.style.left = rect.left + 'px';
    el.style.top  = rect.top  + 'px';
    el.style.width  = rect.width  + 'px';
    el.style.height = rect.height + 'px';
    el.style.background = 'repeating-conic-gradient(from 0deg, rgba(255,214,10,.35) 0deg, transparent 6deg, transparent 24deg)';
    el.style.borderRadius = getComputedStyle(target).borderRadius;
    el.style.zIndex = 240;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 420);
  }

  return { confetti, sparkle, speedLines };
})();
