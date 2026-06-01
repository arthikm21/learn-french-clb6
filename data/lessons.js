// Learning path — TCF Canada immigration-focused. 8 phases, 7 gates + final readiness battery.
//
// Mission: 0 French → CLB 6 Listening/Speaking, CLB 4-5 Reading/Writing for adult
// immigrants and federal-skilled-worker candidates. 45-60 min/day × 8-12 months.
//
// Effort allocation across the path: 40% Listening · 40% Speaking · 10% Reading · 10% Writing.
// Phonics, grammar, vocab are SUPPORT layers — they unlock oral skills, not goals in themselves.

window.PHASES = [
  {
    id: 1,
    name: 'Foundation',
    subtitle: 'Sounds & survival speaking',
    desc: 'Master the 35 French sounds. Repeat your first 30 phrases aloud until they feel natural. Hearing + speaking start here.',
    eta: '~10 days',
    clb: 'CLB 1-2',
    icon: '🌱',
    gateId: 'phase-1',
    gateTitle: 'Phonics & Greetings Gate',
    gateDesc: '15 Qs. Identify sounds, match common phrases, pick the right greeting.',
  },
  {
    id: 2,
    name: 'Core Grammar A1',
    subtitle: 'The minimum grammar to speak',
    desc: 'Just enough scaffolding to assemble sentences: articles, être, avoir, basic -er verbs, negation. Stop at sufficient. Move back to speaking.',
    eta: '~14 days',
    clb: 'CLB 2-3',
    icon: '🧱',
    gateId: 'phase-2',
    gateTitle: 'Core Grammar Gate',
    gateDesc: '20 Qs across articles, être/avoir, -er verbs, negation, basic vocab.',
  },
  {
    id: 3,
    name: 'Conversations',
    subtitle: 'Ask · answer · describe out loud',
    desc: 'First real exchanges. Café orders, asking the time, describing your home and family. Listen to native speakers, then speak with them.',
    eta: '~14 days',
    clb: 'CLB 3-4',
    icon: '💬',
    gateId: 'phase-3',
    gateTitle: 'Communication Gate',
    gateDesc: '20 Qs covering question formation, adjective agreement, café/weather/home vocab.',
  },
  {
    id: 4,
    name: 'Past Events',
    subtitle: 'Tell what happened — passé composé',
    desc: 'Narrate your day, your week, your weekend. Passé composé is the single past tense you will use 80% of the time in real speech.',
    eta: '~14 days',
    clb: 'CLB 3-4',
    icon: '⏪',
    gateId: 'phase-4',
    gateTitle: 'Past Tense Gate',
    gateDesc: '20 Qs: passé composé conjugation, reflexive verbs, time + places vocab.',
  },
  {
    id: 5,
    name: 'Practical Life',
    subtitle: 'Service interactions in French',
    desc: 'Doctor, bank, grocery store, transit, future plans. The exchanges every immigrant has weekly in Quebec. Listening + speaking dominate this phase.',
    eta: '~14 days',
    clb: 'CLB 4',
    icon: '🛠️',
    gateId: 'phase-5',
    gateTitle: 'Future & Service Gate',
    gateDesc: '20 Qs: futur proche, partitive du/de la, health + shopping + money vocab.',
  },
  {
    id: 6,
    name: 'Range & Nuance',
    subtitle: 'Imparfait + pronouns — sound less robotic',
    desc: 'Describe past habits. Replace repeated nouns with le / la / lui / leur / y / en. Native speakers do this constantly. This is the CLB 5 boundary.',
    eta: '~14 days',
    clb: 'CLB 4-5',
    icon: '🎭',
    gateId: 'phase-6',
    gateTitle: 'Imparfait & Pronouns Gate',
    gateDesc: '20 Qs: imparfait formation, object pronouns, y/en, professions vocab.',
  },
  {
    id: 7,
    name: 'CLB 5 → 6 Push',
    subtitle: 'Argue · hypothesize · connect — fluently',
    desc: 'Express opinions with reasons and examples. Use connectors (cependant, par conséquent, alors que). Conditional + subjunctive give you adult range. This is where CLB 6 speaking is won.',
    eta: '~21 days',
    clb: 'CLB 5-6',
    icon: '🚀',
    gateId: 'phase-7',
    gateTitle: 'CLB 6 Grammar Gate',
    gateDesc: '25 Qs: conditional, si-clauses, subjunctive, relative pronouns, plus-que-parfait, connectors.',
  },
  {
    id: 8,
    name: 'Readiness Battery',
    subtitle: 'CLB 6 mock test + band estimate',
    desc: 'Full TCF-format mock simulates the real exam. Get your CLB band per skill.',
    eta: '~10 days',
    clb: 'CLB 6',
    icon: '🎯',
    gateId: 'phase-8',
    gateTitle: 'Final Readiness Mock',
    gateDesc: 'Full 4-skill mock test. CLB band estimate per skill. Pass = ready for the real exam.',
    final: true,
  },
];

window.LESSON_PATH = [
  // ───────────────── PHASE 1 — Foundation ─────────────────
  { id: 1,  phase: 1, title: 'Sounds: 6 Basic Vowels',     desc: 'Pure French vowels. No glide.',                        route: 'phonics', unit: 'p1-vowels',         xp: 25 },
  { id: 2,  phase: 1, title: 'Sounds: u, eu, œu',          desc: 'The "lips forward" vowels.',                           route: 'phonics', unit: 'p2-special-vowels', xp: 25 },
  { id: 3,  phase: 1, title: 'Sounds: Nasal vowels',       desc: 'an, in, on — air through nose.',                       route: 'phonics', unit: 'p3-nasals',         xp: 25 },
  { id: 4,  phase: 1, title: 'Sounds: French R',           desc: 'Back-of-throat gargle R.',                             route: 'phonics', unit: 'p4-r',              xp: 25 },
  { id: 5,  phase: 1, title: 'Sounds: Silent letters',     desc: 'Final consonants, h, -e.',                             route: 'phonics', unit: 'p5-silent-letters', xp: 25 },
  { id: 6,  phase: 1, title: 'Sounds: Liaison',            desc: 'Why "les amis" sounds /le-z-ami/.',                    route: 'phonics', unit: 'p6-liaison',        xp: 25 },
  { id: 7,  phase: 1, title: 'Sounds: Elision',            desc: "j', l', n', d' before vowels.",                        route: 'phonics', unit: 'p7-elision',        xp: 25 },
  { id: 8,  phase: 1, title: 'Greetings & Self',           desc: 'Hello, name, where from.',                             route: 'vocab',   deck: 'greetings',         xp: 30 },

  // ───────────────── PHASE 2 — Core Grammar A1 ─────────────────
  { id: 9,  phase: 2, title: 'Articles le/la/un/une',      desc: 'French gender system.',                                route: 'grammar', unit: 'g1-articles',       xp: 40 },
  { id: 10, phase: 2, title: 'Numbers 1-20',               desc: 'Count, age, prices.',                                  route: 'vocab',   deck: 'numbers',           xp: 30 },
  { id: 11, phase: 2, title: 'Être (to be)',               desc: 'Identity & state.',                                    route: 'grammar', unit: 'g2-etre',           xp: 50 },
  { id: 12, phase: 2, title: 'Family vocabulary',          desc: 'Talk about family.',                                   route: 'vocab',   deck: 'family',            xp: 30 },
  { id: 13, phase: 2, title: 'Avoir (to have)',            desc: 'Possessions, age, idioms.',                            route: 'grammar', unit: 'g3-avoir',          xp: 50 },
  { id: 14, phase: 2, title: 'Game: Gender Sort',          desc: 'Drill gender on common nouns.',                        route: 'games',   game: 'gender',            xp: 40 },
  { id: 15, phase: 2, title: 'Regular -er verbs',          desc: '80% of French verbs.',                                 route: 'grammar', unit: 'g4-er-verbs',       xp: 60 },
  { id: 16, phase: 2, title: 'Food & Drink',               desc: 'Order in a café.',                                     route: 'vocab',   deck: 'food',              xp: 30 },
  { id: 17, phase: 2, title: 'Colors',                     desc: 'Describe things visually.',                            route: 'vocab',   deck: 'colors',            xp: 25 },
  { id: 18, phase: 2, title: 'Negation: ne...pas',         desc: "Say what you don't do.",                               route: 'grammar', unit: 'g5-negation',       xp: 40 },
  { id: 19, phase: 2, title: 'Game: Quick Translate',      desc: 'Speed-build vocab.',                                   route: 'games',   game: 'translate',         xp: 40 },

  // ───────────────── PHASE 3 — Communication ─────────────────
  { id: 20, phase: 3, title: 'Listen: numbers dictation',  desc: 'Hear and type numbers.',                               route: 'listen',  set: 'numbers',            xp: 50 },
  { id: 21, phase: 3, title: 'Speak: greetings',           desc: 'Mic check — greetings aloud.',                         route: 'speak',   set: 'greetings',          xp: 50 },
  { id: 22, phase: 3, title: 'Asking Questions',           desc: 'Who, what, where, when, why.',                         route: 'grammar', unit: 'g6-questions',      xp: 50 },
  { id: 23, phase: 3, title: 'Body parts',                 desc: 'Describe pain & body.',                                route: 'vocab',   deck: 'body',              xp: 30 },
  { id: 24, phase: 3, title: 'Home & rooms',               desc: 'Describe your space.',                                 route: 'vocab',   deck: 'home',              xp: 30 },
  { id: 25, phase: 3, title: 'Clothing',                   desc: 'Daily clothing words.',                                route: 'vocab',   deck: 'clothing',          xp: 30 },
  { id: 26, phase: 3, title: 'Weather & Seasons',          desc: 'Talk about weather.',                                  route: 'vocab',   deck: 'weather',           xp: 30 },
  { id: 27, phase: 3, title: 'Adjective agreement',        desc: 'Adjectives morph with nouns.',                         route: 'grammar', unit: 'g7-adjectives',     xp: 50 },
  { id: 28, phase: 3, title: 'Read: La météo',             desc: 'Weather forecast text.',                               route: 'read',    text: 'r4',                xp: 60 },
  { id: 29, phase: 3, title: 'Speak: ordering at café',    desc: 'Real-life café phrases.',                              route: 'speak',   set: 'cafe',               xp: 60 },
  { id: 30, phase: 3, title: 'Common Verbs',               desc: '15 most-used verbs.',                                  route: 'vocab',   deck: 'verbs',             xp: 40 },

  // ───────────────── PHASE 4 — Past Tense ─────────────────
  { id: 31, phase: 4, title: 'Reflexive verbs',            desc: 'Se laver, se lever.',                                  route: 'grammar', unit: 'g21-reflexive',     xp: 60 },
  { id: 32, phase: 4, title: 'Listen: daily life',         desc: 'Everyday phrases dictation.',                          route: 'listen',  set: 'daily',              xp: 60 },
  { id: 33, phase: 4, title: 'Read: short routine',        desc: "Marie's day.",                                         route: 'read',    text: 'r1',                xp: 60 },
  { id: 34, phase: 4, title: 'Passé Composé',              desc: 'The most-used past tense.',                            route: 'grammar', unit: 'g8-passe-compose',  xp: 70 },
  { id: 35, phase: 4, title: 'Time & Days',                desc: 'When things happen.',                                  route: 'vocab',   deck: 'time',              xp: 30 },
  { id: 36, phase: 4, title: 'Game: Conjugation Race',     desc: 'Fast verb drill.',                                     route: 'games',   game: 'conjrace',          xp: 50 },
  { id: 37, phase: 4, title: 'Write: My Day Yesterday',    desc: 'Use passé composé.',                                   route: 'write',   prompt: 'w1',              xp: 60 },
  { id: 38, phase: 4, title: 'Read: short note',           desc: 'CLB 3 reading.',                                       route: 'read',    text: 'r5',                xp: 50 },
  { id: 39, phase: 4, title: 'Places in town',             desc: 'Navigate a French city.',                              route: 'vocab',   deck: 'places',            xp: 30 },
  { id: 40, phase: 4, title: 'Transport',                  desc: 'Bus, metro, taxi vocab.',                              route: 'vocab',   deck: 'transport',         xp: 30 },

  // ───────────────── PHASE 5 — Future & Intermediate ─────────────────
  { id: 41, phase: 5, title: 'Futur Proche',               desc: 'Going to + verb.',                                     route: 'grammar', unit: 'g9-futur-proche',   xp: 50 },
  { id: 42, phase: 5, title: 'Listen: directions/transit', desc: 'Public transit dialogue.',                             route: 'listen',  set: 'transport',          xp: 70 },
  { id: 43, phase: 5, title: 'Speak: directions',          desc: 'Ask where things are.',                                route: 'speak',   set: 'directions',         xp: 70 },
  { id: 44, phase: 5, title: 'Game: Sentence Builder',     desc: 'Arrange words to sentence.',                           route: 'games',   game: 'sentence',          xp: 60 },
  { id: 45, phase: 5, title: 'Shopping vocab',             desc: 'Buy, return, ask price.',                              route: 'vocab',   deck: 'shopping',          xp: 30 },
  { id: 46, phase: 5, title: 'Money & Banking',            desc: 'Talk about cost & finance.',                           route: 'vocab',   deck: 'money',             xp: 30 },
  { id: 47, phase: 5, title: 'Partitive: du, de la',       desc: 'How to say "some".',                                   route: 'grammar', unit: 'g13-partitive',     xp: 60 },
  { id: 48, phase: 5, title: 'Write: Future Plans',        desc: 'Futur proche + simple.',                               route: 'write',   prompt: 'w2',              xp: 60 },
  { id: 49, phase: 5, title: 'Health & body pain',         desc: 'Talk to a doctor.',                                    route: 'vocab',   deck: 'health',            xp: 30 },
  { id: 50, phase: 5, title: 'Listen: doctor visit',       desc: 'Medical appointment.',                                 route: 'listen',  set: 'doctor',             xp: 70 },
  { id: 51, phase: 5, title: 'Speak: appointment',         desc: 'Schedule a meeting.',                                  route: 'speak',   set: 'appointment',        xp: 70 },

  // ───────────────── PHASE 6 — Imparfait ─────────────────
  { id: 52, phase: 6, title: 'Imparfait',                  desc: 'Past habits, descriptions.',                           route: 'grammar', unit: 'g10-imparfait',     xp: 70 },
  { id: 53, phase: 6, title: 'Emotions & Feelings',        desc: 'Describe how you feel.',                               route: 'vocab',   deck: 'emotions',          xp: 30 },
  { id: 54, phase: 6, title: 'Read: weather/climate',      desc: 'CLB 5 news brief.',                                    route: 'read',    text: 'r2',                xp: 70 },
  { id: 55, phase: 6, title: 'Object pronouns',            desc: 'le, la, lui, leur.',                                   route: 'grammar', unit: 'g11-pronouns',      xp: 60 },
  { id: 56, phase: 6, title: 'y and en',                   desc: 'Two key tiny pronouns.',                               route: 'grammar', unit: 'g14-y-en',          xp: 60 },
  { id: 57, phase: 6, title: 'Write: Family',              desc: 'Describe your family.',                                route: 'write',   prompt: 'w3',              xp: 60 },
  { id: 58, phase: 6, title: 'Speak: describe your day',   desc: 'Tell your day aloud.',                                 route: 'speak',   set: 'day',                xp: 70 },
  { id: 59, phase: 6, title: 'Listen: at work',            desc: 'Work-related phrases.',                                route: 'listen',  set: 'work',               xp: 70 },
  { id: 60, phase: 6, title: 'Professions & Work',         desc: 'Jobs vocabulary.',                                     route: 'vocab',   deck: 'professions',       xp: 30 },
  { id: 61, phase: 6, title: 'Education & School',         desc: 'School & study vocab.',                                route: 'vocab',   deck: 'education',         xp: 30 },

  // ───────────────── PHASE 7 — CLB 5 → 6 Push ─────────────────
  { id: 62, phase: 7, title: 'Game: Tense Picker',         desc: 'Pick the right tense.',                                route: 'games',   game: 'verb',              xp: 60 },
  { id: 63, phase: 7, title: 'Comparatives & Superlatives',desc: 'plus / moins / meilleur.',                             route: 'grammar', unit: 'g16-comparative',   xp: 60 },
  { id: 64, phase: 7, title: 'Hobbies & Sports',           desc: 'Talk about pastimes.',                                 route: 'vocab',   deck: 'hobbies',           xp: 30 },
  { id: 65, phase: 7, title: 'Write: A Place You Love',    desc: 'Adjectives + reason.',                                 route: 'write',   prompt: 'w4',              xp: 70 },
  { id: 66, phase: 7, title: 'Relative pronouns',          desc: 'qui, que, dont, où.',                                  route: 'grammar', unit: 'g15-relative',      xp: 70 },
  { id: 67, phase: 7, title: 'Read: classified ad',        desc: 'Job/housing ad.',                                      route: 'read',    text: 'r6',                xp: 70 },
  { id: 68, phase: 7, title: 'Listen: banking',            desc: 'At the bank.',                                         route: 'listen',  set: 'banking',            xp: 70 },
  { id: 69, phase: 7, title: 'Speak: past events',         desc: "Hier, l'année dernière...",                            route: 'speak',   set: 'past',               xp: 80 },
  { id: 70, phase: 7, title: 'Futur Simple',               desc: 'Formal future.',                                       route: 'grammar', unit: 'g12-futur-simple',  xp: 70 },
  { id: 71, phase: 7, title: 'Time markers',               desc: 'depuis, pendant, il y a, dans.',                       route: 'grammar', unit: 'g22-time',          xp: 70 },
  { id: 72, phase: 7, title: 'Write: A Bad Day',           desc: 'Mix passé composé + imparfait.',                       route: 'write',   prompt: 'w5',              xp: 80 },
  { id: 73, phase: 7, title: 'Game: Memory Match',         desc: 'French ↔ English speed match.',                        route: 'games',   game: 'memory',            xp: 40 },
  { id: 74, phase: 7, title: 'Read: instructions',         desc: 'How-to / recipe.',                                     route: 'read',    text: 'r7',                xp: 70 },
  { id: 75, phase: 7, title: 'Listen: weather forecast',   desc: 'Météo bulletin.',                                      route: 'listen',  set: 'weather',            xp: 80 },
  { id: 76, phase: 7, title: 'Conditional present',        desc: "je voudrais, j'aimerais...",                           route: 'grammar', unit: 'g17-conditional',   xp: 80 },
  { id: 77, phase: 7, title: 'Si clauses',                 desc: 'Si + imparfait → conditionnel.',                       route: 'grammar', unit: 'g18-si',            xp: 80 },
  { id: 78, phase: 7, title: 'Plus-que-parfait',           desc: '"Had done" — earlier past.',                           route: 'grammar', unit: 'g19-pqp',           xp: 70 },
  { id: 79, phase: 7, title: 'Speak: future plans',        desc: 'Si je gagne...',                                       route: 'speak',   set: 'future',             xp: 80 },
  { id: 80, phase: 7, title: 'Write: Email asking info',   desc: 'Formal email basics.',                                 route: 'write',   prompt: 'w6',              xp: 80 },
  { id: 81, phase: 7, title: 'Subjunctive intro',          desc: 'Il faut que je parte.',                                route: 'grammar', unit: 'g20-subjunctive',   xp: 80 },
  { id: 82, phase: 7, title: 'Read: brochure',             desc: 'Information brochure.',                                route: 'read',    text: 'r8',                xp: 80 },
  { id: 83, phase: 7, title: 'Write: If I won lottery',    desc: 'Conditional × 3+ times.',                              route: 'write',   prompt: 'w7',              xp: 90 },
  { id: 84, phase: 7, title: 'Listen: news brief',         desc: 'Short news in French.',                                route: 'listen',  set: 'news',               xp: 90 },

  // ───────────────── PHASE 8 — Readiness Battery ─────────────────
  { id: 85, phase: 8, title: 'Read CLB 5 — La journée',    desc: 'Reading CLB 5.',                                       route: 'read',    text: 'r9',                xp: 90 },
  { id: 86, phase: 8, title: 'Read CLB 5 — Activities',    desc: 'Reading CLB 5.',                                       route: 'read',    text: 'r10',               xp: 90 },
  { id: 87, phase: 8, title: 'Read CLB 5 — Letter',        desc: 'Reading CLB 5.',                                       route: 'read',    text: 'r11',               xp: 90 },
  { id: 88, phase: 8, title: 'Read CLB 6 — Immigration',   desc: 'Reading CLB 6.',                                       route: 'read',    text: 'r12',               xp: 100 },
  { id: 89, phase: 8, title: 'Read CLB 6 — Invitation',    desc: 'CLB 6 letter.',                                        route: 'read',    text: 'r3',                xp: 100 },
  { id: 90, phase: 8, title: 'CLB 6 Mock — Listen',        desc: 'Full listening test.',                                 route: 'listen',  set: 'mock',               xp: 120 },
  { id: 91, phase: 8, title: 'CLB 6 Mock — Speak',         desc: 'Full speaking test.',                                  route: 'speak',   set: 'mock',               xp: 120 },
  { id: 92, phase: 8, title: 'CLB 6 Mock — Write',         desc: 'Formal email task.',                                   route: 'write',   prompt: 'w8',              xp: 120 },
];

// ---------- Helpers exposed for modules ----------
window.Path = (function () {
  function phaseOf(id) { return PHASES.find(p => p.id === id) || null; }
  function itemsInPhase(phaseId) { return LESSON_PATH.filter(n => n.phase === phaseId); }

  function doneKey(n) {
    return ({
      vocab:   `vocab:${n.deck}`,
      grammar: `grammar:${n.unit}`,
      phonics: `phonics:${n.unit}`,
      games:   `games:${n.game}`,
      listen:  `listen:${n.set}`,
      speak:   `speak:${n.set}`,
      read:    `read:${n.text}`,
      write:   `write:${n.prompt}`,
    })[n.route];
  }

  function isItemDone(n) {
    return !!(window.App && App.state && App.state.lessons && App.state.lessons[doneKey(n)]);
  }

  function phaseProgress(phaseId) {
    const items = itemsInPhase(phaseId);
    const done = items.filter(isItemDone).length;
    return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
  }

  // A phase is "gate-eligible" when at least 80% of its items are done.
  function gateEligible(phaseId) {
    const { done, total } = phaseProgress(phaseId);
    return total > 0 && (done / total) >= 0.8;
  }

  function gatePassed(phaseId) {
    const key = `gate:phase-${phaseId}`;
    return !!(window.App && App.state && App.state.lessons && App.state.lessons[key]);
  }

  // A phase is "unlocked" if it's the first phase OR the previous phase's gate has been passed.
  function phaseUnlocked(phaseId) {
    if (phaseId <= 1) return true;
    return gatePassed(phaseId - 1);
  }

  // Skill bucket for a given lesson — drives the 40/40/10/10 visual + Progress rings.
  // L/S/R/W are the 4 CLB-graded skills. F = foundation (phonics/grammar/vocab/games)
  // that unlocks the others without being directly graded.
  const SKILL_LABEL = {
    L: 'Listening', S: 'Speaking', R: 'Reading', W: 'Writing', F: 'Foundation',
  };
  function skillOf(n) {
    if (!n) return null;
    if (n.route === 'listen' || n.route === 'dialogue') return 'L';
    if (n.route === 'speak' || n.route === 'speaktasks' || n.route === 'speaktask2' || n.route === 'speaktask3') return 'S';
    if (n.route === 'read') return 'R';
    if (n.route === 'write' || n.route === 'writetask3') return 'W';
    return 'F'; // phonics, grammar, vocab, games — support layer
  }

  // Skill distribution across an arbitrary slice (e.g. a phase) — feeds the
  // "you're spending X% of effort on speaking" bars on the path page.
  function skillMix(items) {
    const out = { L: 0, S: 0, R: 0, W: 0, F: 0 };
    for (const n of items) out[skillOf(n)]++;
    return out;
  }

  return {
    phaseOf, itemsInPhase, doneKey, isItemDone,
    phaseProgress, gateEligible, gatePassed, phaseUnlocked,
    skillOf, skillMix, SKILL_LABEL,
  };
})();
