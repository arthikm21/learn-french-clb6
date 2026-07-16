// Support / monetization nudges — shown ONLY at win moments (a section done, a
// gate passed, the mock finished), never on the front page. It rotates between
// an optional Preply tutor link and a humble keep-it-free ask,
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

  // Preply hooklines lean on the one thing self-study cannot provide:
  // a real person correcting the learner's French.
  const PREPLY_HOOKS = [
    {
      eyebrow: '🇫🇷 Take it to a real conversation',
      h: 'You practised it — now say it to a human',
      p: 'Shadowing builds the base, but speaking improves faster with specific feedback from a real person. Tutor availability and pricing vary.',
      cta: 'Browse French tutors',
    },
    {
      eyebrow: '🎯 Lock in your exam score',
      h: 'One hour a week with a tutor changes the result',
      p: 'A fluent French tutor can catch the mistakes a website cannot hear. Consider one feedback session before your TCF / TEF Canada date.',
      cta: 'Browse French tutors',
    },
    {
      eyebrow: '🗣️ Ready to be corrected live?',
      h: 'You just earned a real conversation',
      p: 'Bring what you practised to a French tutor and get corrected in real time. Choose a tutor, schedule, and price that fit you.',
      cta: 'Find a French tutor',
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
        <p>No third-party display ads, no paywall, no account — built by one person. If it's helping your French, a small one-time gift keeps the audio playing. Only if it's earned it.</p>
        <a class="btn ghost big" href="${COFFEE}" target="_blank" rel="noopener">Help keep it free<span class="arr">→</span></a>
      </div>`;
  }

  function preplyInline(text) {
    return `<a href="${PREPLY}" target="_blank" rel="sponsored noopener" style="color:var(--bleu);font-weight:var(--fw-semi)">${text || 'a French tutor'}</a>`;
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

  // ---- Exam Kit: first-party $0.99 PDFs sold on Gumroad ----
  // The webapp stays 100% free; the kit is the printable, offline companion.
  // Slugs must match the Gumroad product permalinks.
  const KIT = {
    speaking: {
      icon: '🎙️',
      name: 'TCF Speaking — Complete Answer Pack',
      what: '10 full Task-3 opinion monologues, 6 ask-the-examiner scenarios (60 questions), 10 interview answers — every French sentence with its English underneath — plus the connector bank and a 10-day practice plan.',
      pages: '25-page bilingual PDF',
      price: 'CA$1.99',
      cover: 'kit/tcf-speaking-pack.jpg',
      url: 'https://frenchclb6.gumroad.com/l/tcf-speaking-pack',
    },
    writing: {
      icon: '✍️',
      name: 'TCF Writing — Templates & Model Answers',
      what: 'Fill-in templates for all 3 tasks and 15 model answers (invitations, stories, compare-two-opinions essays) — each with its complete English translation and grader notes — plus the 8-point error checklist and a 7-day plan.',
      pages: '14-page bilingual PDF',
      price: 'CA$1.99',
      cover: 'kit/tcf-writing-pack.jpg',
      url: 'https://frenchclb6.gumroad.com/l/tcf-writing-pack',
    },
    sheets: {
      icon: '📄',
      name: 'CLB 6 Cheat Sheet Pack',
      what: '10 printable one-page references — the 22 connectors, PC vs imparfait, opinion phrases, 12 verbs × 4 tenses, false friends, numbers, exam-day plan — every example sentence translated.',
      pages: '15-page bilingual PDF',
      price: 'CA$1.99',
      cover: 'kit/clb6-cheat-sheets.jpg',
      url: 'https://frenchclb6.gumroad.com/l/clb6-cheat-sheets',
    },
  };

  // One product, one card — for the completion screen that matches it.
  function kitCard(which) {
    const p = KIT[which];
    if (!p) return '';
    return `
      <div class="kit-card">
        <div class="kit-card-head">
          <img class="kit-cover" src="${p.cover}" alt="" loading="lazy" width="46" height="60"
               onerror="this.outerHTML='<span class=&quot;kit-card-icon&quot;>${p.icon}</span>'"/>
          <div>
            <p class="eyebrow" style="color:var(--bleu);margin:0 0 2px">Bonjour! Exam Kit · ${p.pages}</p>
            <h3>${p.name}</h3>
          </div>
          <span class="kit-price">${p.price}</span>
        </div>
        <p>${p.what}</p>
        <a class="btn primary big" href="${p.url}" target="_blank" rel="noopener">Get the PDF — less than a coffee<span class="arr">→</span></a>
        <p class="support-fine">Instant download · yours forever · the site itself stays 100% free — the kit is what funds it.</p>
      </div>`;
  }

  // All three products in one compact strip — for high-intent prep pages
  // (TCF guide, mock report).
  function kitStrip() {
    return `
      <div class="kit-strip">
        <div class="kit-strip-head">
          <p class="eyebrow" style="color:var(--bleu)">📦 The Bonjour! Exam Kit — bilingual printable PDFs</p>
          <p>Every lesson here is free, forever. The kit is the paper companion: model answers and cheat sheets — every French sentence translated — to print, annotate, and reread in the exam waiting room.</p>
        </div>
        ${Object.entries(KIT).map(([k, p]) => `
          <a class="kit-item" href="${p.url}" target="_blank" rel="noopener">
            <img class="kit-cover" src="${p.cover}" alt="" loading="lazy" width="42" height="54"
                 onerror="this.outerHTML='<span class=&quot;kit-card-icon&quot;>${p.icon}</span>'"/>
            <span class="kit-item-body">
              <b>${p.name}</b>
              <small>${p.pages}</small>
            </span>
            <span class="kit-price">${p.price}</span>
          </a>`).join('')}
        <p class="support-fine">Instant downloads via Gumroad · buying one keeps the audio servers running for everyone.</p>
      </div>`;
  }

  return { PREPLY, COFFEE, preplyCard, tipCard, preplyInline, winNudge, kitCard, kitStrip };
})();
