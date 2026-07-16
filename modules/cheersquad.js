// Bonjour Cheer Squad — one lightweight, event-driven encouragement system.
//
// Characters are rendered from semantic HTML + CSS shapes. No image requests,
// animation library, canvas loop, or network dependency. Temporary cheers are
// frequency-capped; inline cheers are composed into existing learning screens.

window.CheerSquad = (function () {
  const CHARACTERS = {
    lumi:     { name: 'Lumi',     message: 'Très bien!',       pose: 'bounce' },
    bleu:     { name: 'Bleu',     message: "You've got this.", pose: 'thumb' },
    coco:     { name: 'Coco',     message: 'Look at you!',     pose: 'confetti' },
    violette: { name: 'Violette', message: 'One more try.',    pose: 'wave' },
    echo:     { name: 'Écho',     message: 'Say it out loud.', pose: 'listen' },
    mint:     { name: 'Mint',     message: 'Keep going.',      pose: 'pump' },
    joie:     { name: 'Joie',     message: 'Petit à petit.',   pose: 'clap' },
  };

  const EVENTS = {
    home:          { character: 'echo',     message: 'Say it out loud.', placement: 'hero' },
    return:        { character: 'joie',     message: 'Petit à petit.',   placement: 'corner', unsolicited: true, cooldown: 300000 },
    pronunciation: { character: 'echo',     message: 'Say it out loud.', placement: 'inline' },
    streak:        { character: 'bleu',     message: "You've got this.", placement: 'corner', unsolicited: true, cooldown: 300000 },
    retry:         { character: 'violette', message: 'One more try.',    placement: 'corner', unsolicited: true, cooldown: 300000 },
    continue:      { character: 'mint',     message: 'Keep going.',      placement: 'corner', unsolicited: true, cooldown: 300000 },
    complete:      { character: 'coco',     message: 'Look at you!',     placement: 'finish' },
    milestone:     { character: 'lumi',     message: 'Très bien!',       placement: 'finish' },
    progress:      { character: 'joie',     message: 'Petit à petit.',   placement: 'inline' },
  };

  let host = null;
  let removeTimer = null;
  let unsolicitedCount = 0;
  let lastGlobalAt = 0;
  const lastEventAt = Object.create(null);

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function enabled() {
    if (!window.Settings) return true;
    if (typeof Settings.isCheerSquadOn === 'function') return Settings.isCheerSquadOn();
    if (typeof Settings.isMascotOn === 'function') return Settings.isMascotOn();
    return true;
  }

  function select(eventName, context) {
    context = context || {};
    const event = EVENTS[eventName] || EVENTS.complete;
    const id = CHARACTERS[context.character] ? context.character : event.character;
    const character = CHARACTERS[id];
    return {
      event: EVENTS[eventName] ? eventName : 'complete',
      character: id,
      name: character.name,
      message: context.message || event.message || character.message,
      pose: context.pose || character.pose,
      placement: context.placement || event.placement || 'inline',
      unsolicited: !!event.unsolicited,
      cooldown: event.cooldown || 45000,
    };
  }

  function figureMarkup(selected) {
    return `
      <div class="cheer-figure" aria-hidden="true">
        <span class="cheer-body">
          <span class="cheer-head-block"></span>
          <span class="cheer-glass-detail"></span>
          <span class="cheer-face">
            <i class="cheer-brow cheer-brow-left"></i>
            <i class="cheer-brow cheer-brow-right"></i>
            <i class="cheer-eye cheer-eye-left"></i>
            <i class="cheer-eye cheer-eye-right"></i>
            <i class="cheer-mouth"></i>
          </span>
          <i class="cheer-arm cheer-arm-left"></i>
          <i class="cheer-arm cheer-arm-right"></i>
          <i class="cheer-leg cheer-leg-left"></i>
          <i class="cheer-leg cheer-leg-right"></i>
        </span>
        <span class="cheer-board"><span>${escapeHTML(selected.message)}</span></span>
        <span class="cheer-spark cheer-spark-one"></span>
        <span class="cheer-spark cheer-spark-two"></span>
      </div>`;
  }

  function render(options) {
    options = options || {};
    const id = CHARACTERS[options.character] ? options.character : 'coco';
    const character = CHARACTERS[id];
    const selected = {
      character: id,
      name: character.name,
      message: options.message || character.message,
      pose: options.pose || character.pose,
      placement: options.placement || 'inline',
    };
    const compact = options.compact ? ' cheer-unit-compact' : '';
    const boardless = options.board === false ? ' cheer-unit-boardless' : '';
    return `
      <div class="cheer-unit cheer-${selected.character} cheer-pose-${selected.pose} cheer-place-${selected.placement}${compact}${boardless}"
        data-cheer-character="${selected.character}" role="group">
        <span class="sr-only">${escapeHTML(selected.name)} says: ${escapeHTML(selected.message)}</span>
        ${figureMarkup(selected)}
      </div>`;
  }

  function renderInline(eventName, context) {
    if (!enabled()) return '';
    const selected = select(eventName, context);
    return render({
      character: selected.character,
      message: selected.message,
      pose: selected.pose,
      placement: selected.placement,
      compact: context && context.compact,
      board: !(context && context.board === false),
    });
  }

  function policyAllows(eventName, state, context) {
    context = context || {};
    state = state || {};
    const selected = select(eventName, context);
    if (context.force) return true;
    if (selected.unsolicited && (state.unsolicitedCount || 0) >= 2) return false;
    const now = typeof context.now === 'number' ? context.now : Date.now();
    if (state.lastGlobalAt && now - state.lastGlobalAt < 45000) return false;
    const eventTimes = state.lastEventAt || {};
    if (eventTimes[selected.event] && now - eventTimes[selected.event] < selected.cooldown) return false;
    return true;
  }

  function canShow(eventName, context) {
    return policyAllows(eventName, { unsolicitedCount, lastGlobalAt, lastEventAt }, context);
  }

  function onEscape(event) {
    if (event.key === 'Escape') dismiss();
  }

  function dismiss() {
    if (removeTimer) clearTimeout(removeTimer);
    removeTimer = null;
    document.removeEventListener('keydown', onEscape);
    if (!host) return;
    const old = host;
    host = null;
    old.classList.remove('is-visible');
    const reduced = document.body && document.body.dataset.anim !== 'full';
    setTimeout(() => old.remove(), reduced ? 0 : 180);
  }

  function show(eventName, context) {
    context = context || {};
    if (!enabled() || typeof document === 'undefined' || !document.body) return false;
    const persistentCharacter = document.querySelector(
      '.cheer-place-hero, .lesson-cheer-slot .cheer-unit, .finish-cheer .cheer-unit'
    );
    if (persistentCharacter && !context.force) return false;
    const route = document.body.dataset && document.body.dataset.route;
    const timedExam = ['mock', 'speaktask2', 'speaktask3', 'writetask3'].includes(route);
    if (timedExam && eventName !== 'complete' && eventName !== 'milestone') return false;
    if (!canShow(eventName, context)) return false;
    const selected = select(eventName, context);
    const now = typeof context.now === 'number' ? context.now : Date.now();

    dismiss();
    lastGlobalAt = now;
    lastEventAt[selected.event] = now;
    if (selected.unsolicited) unsolicitedCount += 1;

    host = document.createElement('div');
    host.className = 'cheer-popover';
    host.innerHTML = `
      <button class="cheer-close" type="button" aria-label="Dismiss encouragement">×</button>
      <p class="sr-only" role="status" aria-live="polite">${escapeHTML(selected.name)} says: ${escapeHTML(selected.message)}</p>
      ${render({
        character: selected.character,
        message: selected.message,
        pose: selected.pose,
        placement: 'popover',
        compact: true,
      })}`;
    document.body.appendChild(host);
    host.querySelector('.cheer-close').onclick = dismiss;
    document.addEventListener('keydown', onEscape);
    requestAnimationFrame(() => { if (host) host.classList.add('is-visible'); });
    const duration = Math.max(2200, context.duration || 3600);
    const thisHost = host;
    const pauseDismissal = () => {
      if (removeTimer) clearTimeout(removeTimer);
      removeTimer = null;
    };
    const armDismissal = () => {
      pauseDismissal();
      removeTimer = setTimeout(() => {
        if (!thisHost.isConnected) return;
        if (thisHost.matches(':hover') || thisHost.contains(document.activeElement)) {
          armDismissal();
          return;
        }
        dismiss();
      }, duration);
    };
    thisHost.addEventListener('mouseenter', pauseDismissal);
    thisHost.addEventListener('mouseleave', armDismissal);
    thisHost.addEventListener('focusin', pauseDismissal);
    thisHost.addEventListener('focusout', armDismissal);
    armDismissal();
    return true;
  }

  function resetRoute() {
    if (typeof document !== 'undefined') dismiss();
  }

  function resetSession() {
    if (typeof document !== 'undefined') dismiss();
    unsolicitedCount = 0;
    lastGlobalAt = 0;
    Object.keys(lastEventAt).forEach(key => delete lastEventAt[key]);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) dismiss();
    });
  }

  return {
    CHARACTERS,
    EVENTS,
    select,
    render,
    renderInline,
    show,
    dismiss,
    resetRoute,
    canShow,
    _policyAllows: policyAllows,
    _resetForTests: resetSession,
  };
})();
