window.WRITING = {
  w1: {
    title: 'My Day Yesterday',
    level: 'CLB 4-5',
    prompt: 'Write 5 sentences in French about what you did yesterday. Use the <b>passé composé</b>. Try to mention: a meal, a place, a person, and a feeling.',
    hints: [
      'Start with "Hier, ..."',
      'Use j\'ai + past participle for most verbs.',
      'Use je suis + past participle for: aller, venir, partir, arriver, sortir, rester.',
      'Example: "Hier, je suis allé au parc avec mon ami."',
    ],
    checks: [
      { pattern: /hier/i, label: 'Mentions "hier" (yesterday)' },
      { pattern: /j['e]\s*ai|je\s*suis/i, label: 'Uses past auxiliary (j\'ai / je suis)' },
      { pattern: /[a-zà-ÿ]+(é|i|u)\b/i, label: 'Has past participle (-é, -i, -u)' },
      { pattern: /\./g, label: 'Multiple sentences (looks for 3+ periods)', min: 3 },
    ],
  },
  w2: {
    title: 'Future Plans',
    level: 'CLB 5',
    prompt: 'Describe what you will do next weekend in 5+ sentences. Use <b>futur proche</b> (aller + infinitif) AND <b>futur simple</b> at least once each.',
    hints: [
      'Futur proche: Je vais + infinitif.',
      'Futur simple: Je verrai, j\'irai, j\'aurai...',
      'Try connectors: d\'abord, ensuite, puis, enfin.',
    ],
    checks: [
      { pattern: /vais|vas|va|allons|allez|vont/i, label: 'Uses aller (futur proche)' },
      { pattern: /(rai|ras|ra|rons|rez|ront)\b/i, label: 'Uses futur simple ending (-rai, -ra...)' },
      { pattern: /\./g, label: 'Multiple sentences', min: 3 },
    ],
  },
  w3: {
    title: 'CLB 6 Mock — Formal Email',
    level: 'CLB 6',
    prompt: 'Write a formal email (8-12 sentences) to a French-speaking landlord. Topics to cover: introduce yourself, explain you are looking for an apartment, mention your budget (~$1200/month), ask if pets are allowed, request a viewing this weekend.',
    hints: [
      'Formal greeting: "Madame, Monsieur,"',
      'Use <b>vous</b> form, not tu.',
      'Closing: "Cordialement," or "Je vous prie d\'agréer mes salutations distinguées,"',
      'Useful: "Je vous écris pour..." / "Je souhaiterais..." / "Pourriez-vous..."',
    ],
    checks: [
      { pattern: /madame|monsieur/i, label: 'Formal greeting' },
      { pattern: /\bvous\b/i, label: 'Uses formal "vous"' },
      { pattern: /1200|mille deux cents|budget/i, label: 'Mentions budget' },
      { pattern: /animal|animaux|chien|chat/i, label: 'Asks about pets' },
      { pattern: /visite|rendez-vous|voir|visiter/i, label: 'Requests viewing' },
      { pattern: /cordialement|salutations|sincèrement/i, label: 'Formal closing' },
      { pattern: /\./g, label: '8+ sentences', min: 8 },
    ],
  },
};
