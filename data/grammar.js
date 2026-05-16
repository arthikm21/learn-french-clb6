// Grammar units — child-style: pattern first, then explicit rule. CLB 6 scope.
window.GRAMMAR = [
  {
    id: 'g1-articles',
    title: 'Articles: le, la, les, un, une, des',
    icon: '📚',
    level: 'A1',
    intro: `In French, every noun has a gender — <b>masculine</b> (le, un) or <b>feminine</b> (la, une). Plural is always <b>les</b> / <b>des</b>. There is no neutral. You learn gender with the word, like a sticker on the noun.`,
    rules: [
      { title: 'Definite (the)', body: '<b>le</b> + masc · <b>la</b> + fem · <b>l\'</b> + vowel · <b>les</b> + plural', examples: ['<em>le</em> chien (the dog)', '<em>la</em> maison (the house)', '<em>l\'</em>arbre (the tree)', '<em>les</em> enfants (the children)'] },
      { title: 'Indefinite (a/an/some)', body: '<b>un</b> + masc · <b>une</b> + fem · <b>des</b> + plural', examples: ['<em>un</em> livre', '<em>une</em> pomme', '<em>des</em> amis'] },
      { title: 'Trick: gender hints', body: 'Most nouns ending in <b>-e</b> are feminine (la table). Most ending in consonant are masculine (le chat). Many exceptions — always learn the article WITH the noun.', examples: [] },
    ],
    quiz: [
      { q: 'Choose: ___ pomme', opts: ['le', 'la', 'les'], a: 1, why: 'Pomme is feminine.' },
      { q: 'Choose: ___ chien', opts: ['un', 'une', 'des'], a: 0, why: 'Chien is masculine.' },
      { q: 'Choose: ___ arbre', opts: ['le', 'la', "l'"], a: 2, why: 'Vowel start → l\'.' },
      { q: 'Choose: ___ enfants', opts: ['le', 'la', 'les'], a: 2, why: 'Plural → les.' },
      { q: 'Choose: ___ maison', opts: ['le', 'la', "l'"], a: 1, why: 'Maison feminine, starts with consonant.' },
      { q: 'Choose: ___ amis', opts: ['un', 'une', 'des'], a: 2, why: 'Plural indefinite → des.' },
    ],
  },
  {
    id: 'g2-etre',
    title: 'Verb: être (to be) — Present',
    icon: '🧍',
    level: 'A1',
    intro: 'Être is the most important verb. It links you to a state, identity, place. Irregular — memorize the song.',
    rules: [
      { title: 'Conjugation', body: 'Sing it 3 times.', examples: [], table: [
        ['je','suis'],['tu','es'],['il/elle/on','est'],
        ['nous','sommes'],['vous','êtes'],['ils/elles','sont']
      ]},
      { title: 'Uses', body: 'Identity, profession, state, origin, location.', examples: ['Je <em>suis</em> Canadien.', 'Elle <em>est</em> médecin.', 'Nous <em>sommes</em> fatigués.', 'Le livre <em>est</em> sur la table.'] },
    ],
    quiz: [
      { q: 'Je ___ étudiant.', opts: ['suis', 'es', 'est'], a: 0 },
      { q: 'Nous ___ Canadiens.', opts: ['êtes', 'sommes', 'sont'], a: 1 },
      { q: 'Tu ___ gentil.', opts: ['est', 'es', 'suis'], a: 1 },
      { q: 'Ils ___ contents.', opts: ['sont', 'êtes', 'est'], a: 0 },
      { q: 'Vous ___ professeur ?', opts: ['êtes', 'est', 'sommes'], a: 0 },
    ],
  },
  {
    id: 'g3-avoir',
    title: 'Verb: avoir (to have) — Present',
    icon: '🤲',
    level: 'A1',
    intro: 'Avoir = to have. Also used for age, hunger, thirst (J\'ai 25 ans = I am 25). Critical helper for past tense.',
    rules: [
      { title: 'Conjugation', body: '', examples: [], table: [
        ['j\'','ai'],['tu','as'],['il/elle/on','a'],
        ['nous','avons'],['vous','avez'],['ils/elles','ont']
      ]},
      { title: 'Idiomatic uses', body: 'French uses avoir where English uses to be.', examples: ["J'<em>ai</em> faim. (I'm hungry)", 'Tu <em>as</em> soif. (You\'re thirsty)', 'Elle <em>a</em> 30 ans. (She is 30)', "Il <em>a</em> peur. (He is afraid)"] },
    ],
    quiz: [
      { q: 'J\' ___ un chat.', opts: ['as', 'ai', 'a'], a: 1 },
      { q: 'Elle ___ deux frères.', opts: ['a', 'as', 'ont'], a: 0 },
      { q: 'Nous ___ faim.', opts: ['avez', 'avons', 'ont'], a: 1 },
      { q: 'Ils ___ une voiture.', opts: ['ont', 'avons', 'avez'], a: 0 },
      { q: 'Quel âge ___-tu ?', opts: ['as', 'es', 'ai'], a: 0 },
    ],
  },
  {
    id: 'g4-er-verbs',
    title: 'Regular -er Verbs (Present)',
    icon: '⚡',
    level: 'A1',
    intro: '80% of French verbs end in -er. They follow ONE pattern. Master this and you can conjugate hundreds.',
    rules: [
      { title: 'Pattern with parler (to speak)', body: 'Remove -er, add: -e, -es, -e, -ons, -ez, -ent (last one silent).', examples: [], table: [
        ['je','parl<em>e</em>'],['tu','parl<em>es</em>'],['il/elle','parl<em>e</em>'],
        ['nous','parl<em>ons</em>'],['vous','parl<em>ez</em>'],['ils/elles','parl<em>ent</em>']
      ]},
      { title: 'Apply to other verbs', body: 'manger, écouter, regarder, aimer, travailler, habiter...', examples: ['Je <em>mange</em> du pain.', 'Nous <em>écoutons</em> la musique.', 'Ils <em>aiment</em> Paris.'] },
    ],
    quiz: [
      { q: 'Je ___ français. (parler)', opts: ['parle', 'parles', 'parlons'], a: 0 },
      { q: 'Nous ___ la radio. (écouter)', opts: ['écoutez', 'écoutons', 'écoutent'], a: 1 },
      { q: 'Tu ___ Paris ? (aimer)', opts: ['aimes', 'aime', 'aiment'], a: 0 },
      { q: 'Ils ___ ici. (habiter)', opts: ['habitez', 'habite', 'habitent'], a: 2 },
      { q: 'Vous ___ beaucoup. (travailler)', opts: ['travaillez', 'travaillons', 'travaille'], a: 0 },
    ],
  },
  {
    id: 'g5-negation',
    title: 'Negation: ne ... pas',
    icon: '❌',
    level: 'A1',
    intro: 'To say NOT, wrap the verb with <b>ne ... pas</b>. Like bread on both sides of the verb.',
    rules: [
      { title: 'Basic pattern', body: 'subject + <b>ne</b> + verb + <b>pas</b> + rest', examples: ['Je <em>ne</em> mange <em>pas</em> de viande.', 'Il <em>n\'</em>aime <em>pas</em> le café.', 'Nous <em>ne</em> sommes <em>pas</em> fatigués.'] },
      { title: 'Other negatives', body: '<b>ne ... jamais</b> (never), <b>ne ... rien</b> (nothing), <b>ne ... personne</b> (nobody), <b>ne ... plus</b> (no more)', examples: ['Je <em>ne</em> fume <em>jamais</em>.', "Il <em>ne</em> dit <em>rien</em>.", 'Elle <em>ne</em> mange <em>plus</em> de sucre.'] },
    ],
    quiz: [
      { q: 'Je ne ___ pas. (parler)', opts: ['parle', 'parles', 'parlons'], a: 0 },
      { q: 'Il ___ aime pas le thé.', opts: ['ne', 'n\'', 'pas'], a: 1, why: 'Vowel start → n\'.' },
      { q: 'Elle ne mange ___ de viande.', opts: ['pas', 'jamais', 'plus'], a: 0 },
      { q: 'Nous ne fumons ___.', opts: ['rien', 'jamais', 'personne'], a: 1, why: 'Never.' },
    ],
  },
  {
    id: 'g6-questions',
    title: 'Asking Questions',
    icon: '❓',
    level: 'A1-A2',
    intro: 'Three ways: intonation, est-ce que, inversion. Use the easiest in speech.',
    rules: [
      { title: '1. Intonation (easiest)', body: 'Just raise your voice at the end.', examples: ['Tu parles français ?', 'Il est ici ?'] },
      { title: '2. Est-ce que (safe formal)', body: 'Add <b>Est-ce que</b> at the start.', examples: ['<em>Est-ce que</em> tu parles français ?', '<em>Est-ce qu\'</em>il est ici ?'] },
      { title: '3. Inversion (formal writing)', body: 'Flip verb + subject with a hyphen.', examples: ['<em>Parles-tu</em> français ?', '<em>Est-il</em> ici ?'] },
      { title: 'Question words', body: 'qui (who), que/quoi (what), où (where), quand (when), pourquoi (why), comment (how), combien (how much).', examples: ['<em>Où</em> habites-tu ?', '<em>Pourquoi</em> tu pleures ?', '<em>Combien</em> ça coûte ?'] },
    ],
    quiz: [
      { q: '"Where do you live?" Choose: ___ habites-tu ?', opts: ['Quand', 'Où', 'Pourquoi'], a: 1 },
      { q: '"How much?" → ___ ?', opts: ['Comment', 'Combien', 'Que'], a: 1 },
      { q: 'Polite question form: ___ tu parles français ?', opts: ['Est-ce que', 'Pourquoi', 'Combien'], a: 0 },
      { q: '"What time is it?" Quelle heure ___-il ?', opts: ['est', 'a', 'es'], a: 0 },
    ],
  },
  {
    id: 'g7-adjectives',
    title: 'Adjective Agreement',
    icon: '🎨',
    level: 'A2',
    intro: 'Adjectives agree with the noun in gender AND number. Like a chameleon matching its surroundings.',
    rules: [
      { title: 'Basic agreement', body: 'masc + <b>e</b> = fem · add <b>s</b> for plural', examples: ['un chat <em>noir</em> · une chatte <em>noire</em>', 'des chats <em>noirs</em> · des chattes <em>noires</em>'] },
      { title: 'Position', body: 'Most adjectives go AFTER the noun. Short common ones (BAGS: Beauty, Age, Good/bad, Size) go BEFORE.', examples: ['une voiture <em>rouge</em> (after)', 'une <em>belle</em> voiture (before, beauty)', 'un <em>petit</em> chat (before, size)', 'un <em>jeune</em> homme (before, age)'] },
      { title: 'Irregulars', body: 'beau→belle, vieux→vieille, nouveau→nouvelle, blanc→blanche, gros→grosse', examples: ['un <em>beau</em> garçon · une <em>belle</em> fille', 'un <em>vieux</em> chien · une <em>vieille</em> dame'] },
    ],
    quiz: [
      { q: 'Une voiture ___ (red)', opts: ['rouge', 'rouges', 'rougee'], a: 0, why: 'Rouge already ends in -e, no change.' },
      { q: 'Des chats ___ (black)', opts: ['noir', 'noire', 'noirs'], a: 2 },
      { q: 'Une ___ fille (pretty)', opts: ['belle', 'beau', 'bel'], a: 0 },
      { q: 'Des ___ maisons (small)', opts: ['petits', 'petites', 'petite'], a: 1 },
    ],
  },
  {
    id: 'g8-passe-compose',
    title: 'Past Tense: Passé Composé',
    icon: '⏪',
    level: 'A2',
    intro: 'The most-used past tense. Two parts: <b>helper</b> (avoir or être) + <b>past participle</b>.',
    rules: [
      { title: 'Formula', body: '<b>avoir</b> (or <b>être</b>) in present + past participle', examples: ["J'<em>ai mangé</em> une pomme.", 'Nous <em>avons parlé</em> français.', 'Elle <em>a fini</em> son travail.'] },
      { title: 'Past participles', body: '-er → -é · -ir → -i · -re → -u', examples: ['parler → <em>parlé</em>', 'finir → <em>fini</em>', 'vendre → <em>vendu</em>'] },
      { title: 'When to use être (DR & MRS VANDERTRAMP verbs)', body: 'Movement & state-change verbs use <b>être</b>. Past participle agrees with subject.', examples: ['Je <em>suis allé(e)</em>. (I went)', 'Elle <em>est partie</em>. (She left)', 'Nous <em>sommes venus</em>. (We came)'] },
      { title: 'Common irregulars', body: 'être → été · avoir → eu · faire → fait · voir → vu · prendre → pris · mettre → mis', examples: ["J'<em>ai eu</em> peur.", "Il <em>a fait</em> ses devoirs.", "Nous <em>avons vu</em> un film."] },
    ],
    quiz: [
      { q: 'J\'___ mangé une pomme.', opts: ['ai', 'suis', 'as'], a: 0 },
      { q: 'Elle ___ allée au marché.', opts: ['a', 'est', 'as'], a: 1, why: 'Aller uses être.' },
      { q: 'Passé composé of "finir" with je: J\'___ fini.', opts: ['suis', 'ai', 'a'], a: 1 },
      { q: 'Past participle of "faire" is...', opts: ['fait', 'faisé', 'fé'], a: 0 },
      { q: 'Past participle of "voir"?', opts: ['voyé', 'vu', 'voit'], a: 1 },
    ],
  },
  {
    id: 'g9-futur-proche',
    title: 'Near Future: aller + infinitive',
    icon: '➡️',
    level: 'A2',
    intro: 'Easiest future tense. Like English "going to". Use aller in present + verb in infinitive.',
    rules: [
      { title: 'Formula', body: '<b>aller (present)</b> + infinitive', examples: ['Je <em>vais manger</em>. (I am going to eat)', 'Nous <em>allons partir</em> demain.', 'Ils <em>vont arriver</em> bientôt.'] },
      { title: 'Negation', body: 'Wrap the conjugated aller: ne + aller + pas + infinitive', examples: ['Je <em>ne vais pas</em> sortir.', 'Il <em>ne va pas</em> pleuvoir.'] },
    ],
    quiz: [
      { q: 'Je ___ manger. (going to)', opts: ['vais', 'vas', 'va'], a: 0 },
      { q: 'Nous ___ partir.', opts: ['allez', 'allons', 'vont'], a: 1 },
      { q: 'Tomorrow: Demain je vais ___.', opts: ['mangé', 'manger', 'mange'], a: 1, why: 'Infinitive after aller.' },
      { q: 'Ils ___ arriver.', opts: ['va', 'vont', 'allons'], a: 1 },
    ],
  },
  {
    id: 'g10-imparfait',
    title: 'Imperfect: Imparfait',
    icon: '🌀',
    level: 'B1',
    intro: 'For habits in the past, descriptions, ongoing actions. "I used to..." / "I was..."',
    rules: [
      { title: 'Formation', body: 'Take <b>nous</b> form of present, drop -ons, add: -ais, -ais, -ait, -ions, -iez, -aient', examples: ['parler → nous parlons → parl- + -ais...', 'finir → nous finissons → finiss- + -ais...'] },
      { title: 'Conjugation: parler', body: '', examples: [], table: [
        ['je','parl<em>ais</em>'],['tu','parl<em>ais</em>'],['il/elle','parl<em>ait</em>'],
        ['nous','parl<em>ions</em>'],['vous','parl<em>iez</em>'],['ils','parl<em>aient</em>']
      ]},
      { title: 'Uses', body: 'Habits (used to), descriptions (was), interrupted actions.', examples: ['Quand j\'<em>étais</em> petit, je <em>jouais</em> au parc.', 'Il <em>faisait</em> beau hier.', 'Je <em>lisais</em> quand tu as appelé.'] },
      { title: 'Être (irregular)', body: 'Stem is ét-', examples: ['j\'<em>étais</em>, tu <em>étais</em>, il <em>était</em>, nous <em>étions</em>, vous <em>étiez</em>, ils <em>étaient</em>'] },
    ],
    quiz: [
      { q: 'Quand j\'étais petit, je ___ au foot. (jouer)', opts: ['joue', 'jouais', 'ai joué'], a: 1 },
      { q: 'Imparfait: nous ___ (parler)', opts: ['parlons', 'parlions', 'parlerons'], a: 1 },
      { q: 'Il ___ beau hier. (faire)', opts: ['fait', 'faisait', 'a fait'], a: 1, why: 'Description.' },
      { q: 'Imparfait of être for "tu":', opts: ['étais', 'es', 'étiez'], a: 0 },
    ],
  },
  {
    id: 'g11-pronouns',
    title: 'Object Pronouns: le, la, les, lui, leur',
    icon: '🔁',
    level: 'B1',
    intro: 'Replace nouns to avoid repetition. Pronouns go BEFORE the verb.',
    rules: [
      { title: 'Direct (le, la, les)', body: 'Replace direct object (no preposition).', examples: ['Je vois <em>le chien</em>. → Je <em>le</em> vois.', 'Tu manges <em>la pomme</em>. → Tu <em>la</em> manges.', 'Elle aime <em>les enfants</em>. → Elle <em>les</em> aime.'] },
      { title: 'Indirect (lui, leur)', body: 'Replace à + person.', examples: ['Je parle <em>à Marie</em>. → Je <em>lui</em> parle.', 'Il donne un livre <em>à ses amis</em>. → Il <em>leur</em> donne un livre.'] },
      { title: 'Order in past tense', body: 'Pronoun goes before the helper.', examples: ['Je <em>l\'ai</em> vu.', 'Nous <em>leur avons</em> parlé.'] },
    ],
    quiz: [
      { q: '"Je vois le film" → Je ___ vois.', opts: ['le', 'la', 'lui'], a: 0 },
      { q: '"Tu parles à Marie" → Tu ___ parles.', opts: ['la', 'lui', 'leur'], a: 1 },
      { q: '"Il aime les chats" → Il ___ aime.', opts: ['leur', 'les', 'lui'], a: 1 },
      { q: '"Nous parlons à nos parents" → Nous ___ parlons.', opts: ['les', 'leur', 'lui'], a: 1 },
    ],
  },
  {
    id: 'g12-futur-simple',
    title: 'Future Simple: Futur Simple',
    icon: '🔮',
    level: 'B1',
    intro: 'For more distant or formal future. "I will...". Add endings to infinitive.',
    rules: [
      { title: 'Formation', body: 'infinitive + -ai, -as, -a, -ons, -ez, -ont (for -re verbs, drop the final e first)', examples: ['parler → parler<em>ai</em>...', 'finir → finir<em>ai</em>...', 'vendre → vendr<em>ai</em>...'] },
      { title: 'Conjugation: parler', body: '', examples: [], table: [
        ['je','parler<em>ai</em>'],['tu','parler<em>as</em>'],['il','parler<em>a</em>'],
        ['nous','parler<em>ons</em>'],['vous','parler<em>ez</em>'],['ils','parler<em>ont</em>']
      ]},
      { title: 'Irregular stems', body: 'être→ser-, avoir→aur-, aller→ir-, faire→fer-, pouvoir→pourr-, vouloir→voudr-, voir→verr-, venir→viendr-', examples: ['Je <em>serai</em> là.', "J'<em>aurai</em> 30 ans.", 'Nous <em>irons</em> à Paris.'] },
    ],
    quiz: [
      { q: 'Je ___ français un jour. (parler)', opts: ['parle', 'parlerai', 'parlais'], a: 1 },
      { q: 'Futur of être: je ___', opts: ['serai', 'aurai', 'ferai'], a: 0 },
      { q: 'Nous ___ à Paris. (aller)', opts: ['allons', 'irons', 'allerons'], a: 1 },
      { q: '"They will have" → Ils ___', opts: ['auront', 'avoiront', 'seront'], a: 0 },
    ],
  },
];
