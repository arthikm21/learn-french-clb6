// Global keyboard shortcuts. Skip when typing in inputs.
window.Keyboard = (function () {
  function isTyping(e) {
    const el = e.target;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    if (isTyping(e)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Space → play audio (any current speakable)
    if (e.key === ' ') {
      const hearBtn = document.querySelector('#hear, #play, [data-rate="1.0"], [data-rate="0.85"]');
      if (hearBtn) {
        e.preventDefault();
        hearBtn.click();
      }
      return;
    }
    // 1-4 → select quiz option
    if (/^[1-4]$/.test(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const opts = document.querySelectorAll('.option:not(.disabled)');
      if (opts[idx]) {
        e.preventDefault();
        opts[idx].click();
      }
      return;
    }
    // Enter → submit / next
    if (e.key === 'Enter') {
      const submit = document.getElementById('submit') || document.getElementById('check') || document.getElementById('next') || document.getElementById('start') || document.getElementById('start-quiz');
      if (submit && submit.offsetParent !== null) {
        e.preventDefault();
        submit.click();
      }
      return;
    }
    // Esc → close drawer/popup
    if (e.key === 'Escape') {
      const popup = document.getElementById('wordpop');
      if (popup && popup.classList.contains('open')) { popup.classList.remove('open'); e.preventDefault(); return; }
      const nav = document.getElementById('nav');
      if (nav && nav.classList.contains('open')) { document.getElementById('hamburger').click(); e.preventDefault(); return; }
    }
    // ? → show keyboard help
    if (e.key === '?') {
      e.preventDefault();
      Toast.info('Shortcuts: Space=play · 1-4=options · Enter=submit · Esc=close', 4000);
    }
  });
})();
