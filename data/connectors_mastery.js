// Connector Mastery — the 14 most-tested CLB 6 connectors, each with rich
// teaching content + drill items across 4 exercise types.
//
// Per masterplan: connector usage is one of the strongest predictors of CLB 6
// speaking/writing. The goal is automaticity — connectors should appear in the
// learner's output without conscious effort.
//
// Categories follow standard French discourse-marker taxonomy:
//   cause · consequence · contrast · addition · time · reinforcement
//
// Each entry has:
//   examples       — 3 short sentences using the connector (audio-ready)
//   complete       — fill-the-blank items: short context, learner picks the connector
//   recognize      — listen items: sentence with the connector embedded, identify which one
//   shadow         — "continue this sentence with X" — repeat-after-me prompt + model
//
// The module renders ALL types in one drill session, drawing from any subset.

window.CONNECTORS = [
  // ─────────── CAUSE ───────────
  {
    id: 'parce-que', word: 'parce que', category: 'Cause',
    gloss: 'because',
    when: "The everyday because. Answers <i>pourquoi</i>. Used in speech and writing both.",
    examples: [
      "Je suis fatigué <b>parce que</b> j'ai mal dormi.",
      "Elle est en retard <b>parce que</b> le métro est en panne.",
      "Nous restons à la maison <b>parce qu'</b>il pleut.",
    ],
    complete: { context: "Je n'ai pas mangé depuis ce matin ___ j'étais en réunion toute la journée." },
    recognize: "J'ai pris un taxi parce que j'étais pressé.",
    shadow: { prompt: "Continue this sentence with «parce que»:", lead: "Je veux apprendre le français…", model: "Je veux apprendre le français parce que je vais déménager au Canada." },
  },
  {
    id: 'puisque', word: 'puisque', category: 'Cause',
    gloss: 'given that / since (known to both)',
    when: "Use when the reason is already known or obvious to the listener. More formal than parce que.",
    examples: [
      "<b>Puisque</b> tu es là, aide-moi.",
      "<b>Puisque</b> le magasin est fermé, on revient demain.",
      "<b>Puisqu'</b>il fait beau, sortons.",
    ],
    complete: { context: "___ vous parlez français, l'entrevue se fera en français." },
    recognize: "Puisque tout le monde est d'accord, nous pouvons commencer.",
    shadow: { prompt: "Use «puisque» to continue:", lead: "Puisque tu connais déjà la ville…", model: "Puisque tu connais déjà la ville, tu peux nous guider." },
  },

  // ─────────── CONSEQUENCE ───────────
  {
    id: 'donc', word: 'donc', category: 'Consequence',
    gloss: 'so / therefore',
    when: "Everyday consequence marker. Used constantly in conversation. Works for any cause→effect.",
    examples: [
      "Il pleut, <b>donc</b> je prends le parapluie.",
      "Tu es fatiguée, <b>donc</b> repose-toi.",
      "Je n'ai pas d'argent, <b>donc</b> je ne peux pas venir.",
    ],
    complete: { context: "Le bus est en retard, ___ je vais arriver après vous." },
    recognize: "Mon fils est malade, donc je reste à la maison aujourd'hui.",
    shadow: { prompt: "Use «donc» to conclude:", lead: "Le restaurant est fermé le lundi…", model: "Le restaurant est fermé le lundi, donc on ira mardi." },
  },
  {
    id: 'par-consequent', word: 'par conséquent', category: 'Consequence',
    gloss: 'consequently / as a result',
    when: "Formal version of donc. Use in writing and exam speaking when you want to sound CLB 6.",
    examples: [
      "Le marché a changé. <b>Par conséquent</b>, nous devons adapter notre stratégie.",
      "Les vols sont annulés. <b>Par conséquent</b>, nous reportons le voyage.",
      "Il a réussi son examen. <b>Par conséquent</b>, il est admis à l'université.",
    ],
    complete: { context: "Les frais de scolarité ont augmenté. ___, beaucoup d'étudiants travaillent à temps partiel." },
    recognize: "L'usine a fermé. Par conséquent, deux cents personnes ont perdu leur emploi.",
    shadow: { prompt: "Use «par conséquent» to formally state a consequence:", lead: "Les prix du logement augmentent rapidement…", model: "Les prix du logement augmentent rapidement. Par conséquent, beaucoup de familles quittent le centre-ville." },
  },
  {
    id: 'ainsi', word: 'ainsi', category: 'Consequence',
    gloss: 'thus / in this way',
    when: "Formal consequence marker. Often shows the resulting STATE or arrangement, not just the next event.",
    examples: [
      "Il faut bien dormir. <b>Ainsi</b>, on travaille mieux le lendemain.",
      "Elle a beaucoup étudié. <b>Ainsi</b>, elle a réussi.",
      "Nous avons réorganisé les bureaux. <b>Ainsi</b>, l'équipe communique mieux.",
    ],
    complete: { context: "L'entreprise a investi dans la formation. ___, les employés sont devenus plus compétents." },
    recognize: "Ils ont automatisé le processus. Ainsi, le temps de production a diminué de moitié.",
    shadow: { prompt: "Use «ainsi» to show the resulting situation:", lead: "Nous avons réduit nos dépenses…", model: "Nous avons réduit nos dépenses. Ainsi, nous pouvons épargner pour l'avenir." },
  },

  // ─────────── CONTRAST ───────────
  {
    id: 'mais', word: 'mais', category: 'Contrast',
    gloss: 'but',
    when: "The everyday but. Connects opposing ideas in one sentence. Spoken constantly.",
    examples: [
      "J'aime le café, <b>mais</b> pas le matin.",
      "Il est intelligent, <b>mais</b> très timide.",
      "Je voudrais venir, <b>mais</b> je suis occupé.",
    ],
    complete: { context: "Le film était long, ___ vraiment intéressant." },
    recognize: "Marie veut voyager, mais elle n'a pas encore d'argent.",
    shadow: { prompt: "Use «mais» to add a contrasting idea:", lead: "J'adore Montréal…", model: "J'adore Montréal, mais les hivers sont très froids." },
  },
  {
    id: 'cependant', word: 'cependant', category: 'Contrast',
    gloss: 'however',
    when: "Formal version of mais. Use at the start of a sentence for a clean break. CLB 6 marker.",
    examples: [
      "Le projet est ambitieux. <b>Cependant</b>, le budget est limité.",
      "Elle a beaucoup d'expérience. <b>Cependant</b>, elle manque de leadership.",
      "Le rapport est bien écrit. <b>Cependant</b>, certaines données sont obsolètes.",
    ],
    complete: { context: "Les ventes ont augmenté ce trimestre. ___, les profits ont diminué." },
    recognize: "Le travail à distance offre de la flexibilité. Cependant, il isole parfois les employés.",
    shadow: { prompt: "Use «cependant» to introduce a formal contrast:", lead: "Le télétravail a beaucoup d'avantages…", model: "Le télétravail a beaucoup d'avantages. Cependant, il demande de la discipline." },
  },
  {
    id: 'toutefois', word: 'toutefois', category: 'Contrast',
    gloss: 'however / nevertheless',
    when: "Synonym of cependant. Slightly more formal/written. Use to vary your discourse markers in writing.",
    examples: [
      "Les résultats sont positifs. <b>Toutefois</b>, nous devons rester prudents.",
      "Il faut agir vite. <b>Toutefois</b>, sans précipitation.",
      "Le plan est solide. <b>Toutefois</b>, plusieurs imprévus sont possibles.",
    ],
    complete: { context: "La nouvelle loi vise à protéger l'environnement. ___, son application reste difficile." },
    recognize: "L'investissement est important. Toutefois, le retour sera lent.",
    shadow: { prompt: "Use «toutefois» for written-register contrast:", lead: "Cette solution réduit les coûts…", model: "Cette solution réduit les coûts. Toutefois, elle exige une formation supplémentaire." },
  },
  {
    id: 'pourtant', word: 'pourtant', category: 'Contrast',
    gloss: 'yet / and yet',
    when: "Use when something is UNEXPECTED or surprising given the previous fact. Stronger emotional weight than cependant.",
    examples: [
      "Il a étudié toute la nuit, <b>pourtant</b> il a échoué.",
      "Elle est très qualifiée, <b>pourtant</b> elle n'a pas trouvé de travail.",
      "Je l'ai prévenu plusieurs fois, <b>pourtant</b> il continue.",
    ],
    complete: { context: "Le restaurant a d'excellentes critiques, ___ il est presque vide ce soir." },
    recognize: "Marie parle quatre langues, pourtant elle se dit timide.",
    shadow: { prompt: "Use «pourtant» for an unexpected contrast:", lead: "Il pleut depuis ce matin…", model: "Il pleut depuis ce matin, pourtant il a quand même fait son jogging." },
  },
  {
    id: 'en-revanche', word: 'en revanche', category: 'Contrast',
    gloss: 'on the other hand',
    when: "Direct counterpoint — A is X, B in contrast is Y. Use when both halves are factual statements.",
    examples: [
      "Les jeunes utilisent beaucoup TikTok. <b>En revanche</b>, ils délaissent Facebook.",
      "L'été a été chaud. <b>En revanche</b>, l'hiver s'annonce doux.",
      "Le centre-ville est cher. <b>En revanche</b>, les banlieues offrent plus d'espace.",
    ],
    complete: { context: "Le matin, le café est calme. ___, l'après-midi il est bondé." },
    recognize: "Pierre adore le sport. En revanche, son frère préfère la lecture.",
    shadow: { prompt: "Use «en revanche» to contrast two facts:", lead: "Les villes offrent beaucoup d'opportunités…", model: "Les villes offrent beaucoup d'opportunités. En revanche, la qualité de vie y est souvent moindre." },
  },
  {
    id: 'alors-que', word: 'alors que', category: 'Contrast',
    gloss: 'whereas / while',
    when: "Contrast within ONE sentence (both halves attached). Often used to highlight inequality or simultaneity.",
    examples: [
      "Il dort huit heures par nuit, <b>alors que</b> moi je dors cinq.",
      "Mon frère adore le sport, <b>alors que</b> je préfère la lecture.",
      "Les uns travaillent beaucoup, <b>alors que</b> d'autres profitent.",
    ],
    complete: { context: "Marie parle français couramment, ___ son frère apprend encore." },
    recognize: "Lui voyage chaque mois, alors que sa sœur reste toujours chez elle.",
    shadow: { prompt: "Use «alors que» to contrast two people or facts:", lead: "Au Canada il faut payer pour la pharmacie…", model: "Au Canada il faut payer pour la pharmacie, alors qu'en France elle est remboursée." },
  },
  {
    id: 'tandis-que', word: 'tandis que', category: 'Contrast',
    gloss: 'while / whereas (formal)',
    when: "Formal synonym of alors que. Slightly more written. Often used in essays and reports.",
    examples: [
      "Les anciens travaillaient en usine, <b>tandis que</b> les jeunes préfèrent les bureaux.",
      "Les uns économisent, <b>tandis que</b> d'autres dépensent.",
      "Elle écoute, <b>tandis qu'</b>il n'arrête pas de parler.",
    ],
    complete: { context: "Les grandes villes attirent les jeunes diplômés, ___ les régions rurales se vident." },
    recognize: "Les pays riches consomment beaucoup, tandis que les pays pauvres polluent peu.",
    shadow: { prompt: "Use «tandis que» in a formal contrast:", lead: "Certains pays misent sur l'énergie nucléaire…", model: "Certains pays misent sur l'énergie nucléaire, tandis que d'autres préfèrent les énergies renouvelables." },
  },

  // ─────────── ADDITION ───────────
  {
    id: 'd-ailleurs', word: "d'ailleurs", category: 'Addition',
    gloss: 'moreover / besides (which)',
    when: "Adds a supporting point that reinforces what you just said. Has a slight 'and now that I think about it' feel.",
    examples: [
      "Ce livre est excellent. <b>D'ailleurs</b>, il a gagné un prix.",
      "Il connaît bien la région. <b>D'ailleurs</b>, il y est né.",
      "Le projet avance bien. <b>D'ailleurs</b>, nous avons reçu un nouveau client.",
    ],
    complete: { context: "Marie parle couramment français. ___, elle a étudié à Paris pendant deux ans." },
    recognize: "Le quartier est très agréable. D'ailleurs, beaucoup d'artistes y vivent.",
    shadow: { prompt: "Use «d'ailleurs» to reinforce with a related fact:", lead: "Cette université est très réputée…", model: "Cette université est très réputée. D'ailleurs, plusieurs prix Nobel y ont enseigné." },
  },

  // ─────────── REINFORCEMENT ───────────
  {
    id: 'en-effet', word: 'en effet', category: 'Reinforcement',
    gloss: 'indeed',
    when: "Confirms or backs up what was just said with EVIDENCE or explanation. Different from 'pourtant' — same direction, not opposing.",
    examples: [
      "Le climat change rapidement. <b>En effet</b>, les températures battent des records chaque année.",
      "Cette région est dangereuse. <b>En effet</b>, plusieurs accidents y sont arrivés.",
      "Il est très compétent. <b>En effet</b>, il a quinze ans d'expérience.",
    ],
    complete: { context: "Le tabac nuit à la santé. ___, c'est la première cause de cancer évitable." },
    recognize: "Cette ville attire les touristes. En effet, elle reçoit dix millions de visiteurs par an.",
    shadow: { prompt: "Use «en effet» to back up your claim with evidence:", lead: "Le marché du travail est tendu…", model: "Le marché du travail est tendu. En effet, beaucoup d'entreprises peinent à recruter." },
  },
];
