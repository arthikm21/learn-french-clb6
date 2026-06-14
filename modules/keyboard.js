// Global keyboard shortcuts + quiz-option accessibility.
//
// Two responsibilities:
//   1. Global shortcuts (Space=play, 1-4=pick option, Enter=submit/next, Esc=close, ?=help)
//   2. Upgrading every `.options` group into a real, keyboard-operable radiogroup
//      (roles, roving tabindex, arrow keys, Enter-to-commit, number keycaps).
//      Done centrally via a MutationObserver so the 12+ modules that render
//      `.options` need no per-module changes.
window.Keyboard = (function () {
  function isTyping(e) {
    const el = e.target;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  // ───────────────────────── Global shortcuts ─────────────────────────
  document.addEventListener('keydown', (e) => {
    if (isTyping(e)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Space → play audio. EXCEPT while a post-answer countdown is showing —
    // there the advance row owns Space (pause/resume), so we bail to avoid the
    // old double-bind (replay audio AND toggle countdown on one keypress).
    if (e.key === ' ' || e.code === 'Space') {
      if (document.querySelector('.advance-row')) return; // countdown owns Space
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
    // Enter → submit / next / start. Arrow-focused options handle their own
    // Enter (see the radiogroup handler), so this only fires for page actions.
    if (e.key === 'Enter') {
      const submit = document.getElementById('submit') || document.getElementById('check')
        || document.getElementById('next') || document.getElementById('start')
        || document.getElementById('start-quiz') || document.getElementById('start-gate');
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
      Toast.info('Shortcuts: Space=play · 1-4 or ↑↓=choose · Enter=confirm · Esc=close', 4500);
    }
  });

  // ─────────────────── Quiz options → radiogroup a11y ───────────────────
  function focusOption(opts, i) {
    if (i < 0 || i >= opts.length) return;
    opts.forEach((o, j) => o.setAttribute('tabindex', j === i ? '0' : '-1'));
    opts[i].focus();
  }

  function moveFocus(opts, from, dir) {
    if (!opts.length) return;
    let i = from < 0 ? 0 : from;
    for (let step = 0; step < opts.length; step++) {
      i = (i + dir + opts.length) % opts.length;
      if (!opts[i].classList.contains('disabled')) { focusOption(opts, i); return; }
    }
  }

  function enhanceOptions(group) {
    if (group.__a11yDone) return;
    group.__a11yDone = true;

    group.setAttribute('role', 'radiogroup');
    if (!group.getAttribute('aria-label')) group.setAttribute('aria-label', 'Answer choices');

    const opts = Array.from(group.querySelectorAll('.option'));
    opts.forEach((opt, i) => {
      opt.setAttribute('role', 'radio');
      opt.setAttribute('aria-checked', 'false');
      opt.setAttribute('tabindex', i === 0 ? '0' : '-1');
      if (!opt.hasAttribute('data-key') && i < 9) opt.setAttribute('data-key', String(i + 1));
    });

    // Make the feedback box a polite live region so screen readers announce
    // the result the module injects after an answer.
    const fb = document.getElementById('fb');
    if (fb && !fb.hasAttribute('aria-live')) {
      fb.setAttribute('role', 'status');
      fb.setAttribute('aria-live', 'polite');
      fb.setAttribute('aria-atomic', 'true');
    }

    // Reflect the user's choice for assistive tech, and lock the group once
    // answered (modules disable the options visually; mirror that in ARIA).
    // NOTE: this fires in the bubble phase, AFTER the module's own option
    // onclick has already added `.disabled` to every option — so we must not
    // bail on `.disabled` here, or aria-checked would never get set.
    group.addEventListener('click', (e) => {
      const picked = e.target.closest('.option');
      if (!picked) return;
      opts.forEach(o => {
        o.setAttribute('aria-checked', o === picked ? 'true' : 'false');
        o.setAttribute('aria-disabled', 'true');
      });
    });

    group.addEventListener('keydown', (e) => {
      const cur = document.activeElement;
      const from = opts.indexOf(cur);
      switch (e.key) {
        case 'ArrowDown': case 'ArrowRight':
          e.preventDefault(); moveFocus(opts, from, +1); break;
        case 'ArrowUp': case 'ArrowLeft':
          e.preventDefault(); moveFocus(opts, from, -1); break;
        case 'Home':
          e.preventDefault(); moveFocus(opts, -1, +1); break;
        case 'End':
          e.preventDefault(); moveFocus(opts, 0, -1); break;
        case 'Enter':
          // Commit the focused choice. (Space is reserved for audio playback.)
          // stopPropagation is essential: committing mounts the advance row's
          // own document-level Enter handler, and without stopping here the
          // SAME Enter keydown would bubble to it and instantly skip to the
          // next question — burying the feedback the user just earned.
          if (from >= 0 && !opts[from].classList.contains('disabled')) {
            e.preventDefault();
            e.stopPropagation();
            opts[from].click();
          }
          break;
      }
    });
  }

  function scanForOptions() {
    document.querySelectorAll('.options').forEach(enhanceOptions);
  }

  function init() {
    scanForOptions();
    const root = document.getElementById('app') || document.body;
    const mo = new MutationObserver(scanForOptions);
    mo.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { enhanceOptions };
})();
