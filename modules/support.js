// Support / monetization nudges — shown ONLY at win moments (a section done, a
// gate passed, the mock finished), never on the front page. It rotates between
// a Preply tutor offer (50% off the first lesson) and a humble keep-it-free ask,
// and throttles itself so it lands when the learner just felt a win — and never
// twice in a row with the same message.
//
// Public API:
//   Support.preplyCard(i)   → a Preply CTA card (i picks the hookline)
//   Support.tipCard()       → a humble "keep it free" card
//   Support.winNudge(force) → throttled rotating nudge for completion screens.
//                             Returns '' when it's not this completion's turn,
//                             unless force === true (used on rare big wins:
//                             gate pass, mock result).
//   Support.preplyInline(t) → a small inline sponsored Preply link.
window.Support = (function () {
  const PREPLY = 'https://preply.sjv.io/c/7425774/1987575/24422';
  const COFFEE = 'https://buymeacoffee.com/frenchclb6';

  // Preply hooklines. All lean on the new-learner 50%-off first lesson and the
  // one thing self-study can't give: a real person correcting your French.
  const PREPLY_HOOKS = [
    {
      eyebrow: '🇫🇷 Take it to a real conversation',
      h: 'You practised it — now say it to a human',
      p: 'Shadowing builds the base, but CLB 6 speaking is won talking to a real person. New Preply learners get <b>50% off their first lesson</b> — often just a few dollars to try one.',
      cta: 'Claim 50% off a French tutor',
    },
    {
      eyebrow: '🎯 Lock in your exam score',
      h: 'One hour a week with a tutor changes the result',
      p: 'A native French tutor catches the mistakes a website never can. New learners get <b>50% off the first lesson</b> — try one before your TCF / TEF Canada date.',
      cta: 'Get 50% off your first lesson',
    },
    {
      eyebrow: '🗣️ Ready to be corrected live?',
      h: 'You just earned a real conversation',
      p: 'Bring what you practised to a Canadian-French tutor and get corrected in real time. Preply gives new learners <b>50% off the first lesson</b> — pick a time that fits you.',
      cta: 'Find a tutor — 50% off',
    },
  ];

  function preplyCard(i) {
    const hk = PREPLY_HOOKS[Math.abs(i || 0) % PREPLY_HOOKS.length];
    return `
      <div class="support-card preply-card">
        <p class="eyebrow" style="color:var(--bleu)">${hk.eyebrow}</p>
        <h3>${hk.h}</h3>
        <p>${hk.p}</p>
        <a class="btn primary big" href="${PREPLY}" target="_blank" rel="sponsored noopener">${hk.cta}<span class="arr">→</span></a>
        <p class="support-fine">Affiliate link — booking through it helps keep this site free, at no extra cost to you.</p>
      </div>`;
  }

  function tipCard() {
    return `
      <div class="support-card tip-card">
        <p class="eyebrow" style="color:var(--rouge)">💛 Nice work</p>
        <h3>Keep Bonjour! free for the next person</h3>
        <p>No ads, no paywall, no account — built by one person who sat this exam too. If it's helping your French, a small one-time gift keeps the audio playing. Only if it's earned it.</p>
        <a class="btn ghost big" href="${COFFEE}" target="_blank" rel="noopener">Help keep it free<span class="arr">→</span></a>
      </div>`;
  }

  function preplyInline(text) {
    return `<a href="${PREPLY}" target="_blank" rel="sponsored noopener" style="color:var(--bleu);font-weight:var(--fw-semi)">${text || 'a French tutor (50% off the first lesson)'}</a>`;
  }

  // Throttled, rotating nudge for completion screens. A global counter advances
  // each time a completion screen asks for a nudge; we show one on ~every second
  // completion and alternate Preply ↔ tip so it never repeats or nags. `force`
  // bypasses the throttle for rare, high-intent wins (gate pass, mock result).
  function winNudge(force) {
    let n = 0;
    try { n = parseInt(localStorage.getItem('fr_nudge_n') || '0', 10) || 0; } catch {}
    n += 1;
    try { localStorage.setItem('fr_nudge_n', String(n)); } catch {}
    if (!force && n % 2 !== 0) return '';
    const slot = Math.ceil(n / 2);   // 1, 2, 3, …
    // Mostly Preply (it's the genuine next step + the revenue), a humble tip ask
    // every third time so it never feels like a sales loop.
    return (slot % 3 === 0) ? tipCard() : preplyCard(slot);
  }

  return { PREPLY, COFFEE, preplyCard, tipCard, preplyInline, winNudge };
})();
