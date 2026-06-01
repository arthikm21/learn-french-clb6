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
//   recognizeEn    — English translation of recognize (revealed after answer)
//   shadow         — "continue this sentence with X" — model + leadEn + modelEn for gloss
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
    recognizeEn: "I took a taxi because I was in a hurry.",
    shadow: { prompt: "Continue this sentence with «parce que»:", lead: "Je veux apprendre le français…", leadEn: "I want to learn French…", model: "Je veux apprendre le français parce que je vais déménager au Canada.", modelEn: "I want to learn French because I'm going to move to Canada." },
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
    recognizeEn: "Since everyone agrees, we can start.",
    shadow: { prompt: "Use «puisque» to continue:", lead: "Puisque tu connais déjà la ville…", leadEn: "Since you already know the city…", model: "Puisque tu connais déjà la ville, tu peux nous guider.", modelEn: "Since you already know the city, you can guide us." },
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
    recognizeEn: "My son is sick, so I'm staying home today.",
    shadow: { prompt: "Use «donc» to conclude:", lead: "Le restaurant est fermé le lundi…", leadEn: "The restaurant is closed on Mondays…", model: "Le restaurant est fermé le lundi, donc on ira mardi.", modelEn: "The restaurant is closed on Mondays, so we'll go on Tuesday." },
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
    recognizeEn: "The factory closed. Consequently, two hundred people lost their jobs.",
    shadow: { prompt: "Use «par conséquent» to formally state a consequence:", lead: "Les prix du logement augmentent rapidement…", leadEn: "Housing prices are rising rapidly…", model: "Les prix du logement augmentent rapidement. Par conséquent, beaucoup de familles quittent le centre-ville.", modelEn: "Housing prices are rising rapidly. Consequently, many families are leaving the city centre." },
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
    recognizeEn: "They automated the process. Thus, production time has been cut in half.",
    shadow: { prompt: "Use «ainsi» to show the resulting situation:", lead: "Nous avons réduit nos dépenses…", leadEn: "We reduced our spending…", model: "Nous avons réduit nos dépenses. Ainsi, nous pouvons épargner pour l'avenir.", modelEn: "We reduced our spending. Thus, we can save for the future." },
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
    recognizeEn: "Marie wants to travel, but she doesn't have money yet.",
    shadow: { prompt: "Use «mais» to add a contrasting idea:", lead: "J'adore Montréal…", leadEn: "I love Montreal…", model: "J'adore Montréal, mais les hivers sont très froids.", modelEn: "I love Montreal, but the winters are very cold." },
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
    recognizeEn: "Remote work offers flexibility. However, it sometimes isolates employees.",
    shadow: { prompt: "Use «cependant» to introduce a formal contrast:", lead: "Le télétravail a beaucoup d'avantages…", leadEn: "Remote work has many advantages…", model: "Le télétravail a beaucoup d'avantages. Cependant, il demande de la discipline.", modelEn: "Remote work has many advantages. However, it requires discipline." },
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
    recognizeEn: "The investment is significant. However, the return will be slow.",
    shadow: { prompt: "Use «toutefois» for written-register contrast:", lead: "Cette solution réduit les coûts…", leadEn: "This solution reduces costs…", model: "Cette solution réduit les coûts. Toutefois, elle exige une formation supplémentaire.", modelEn: "This solution reduces costs. However, it requires additional training." },
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
    recognizeEn: "Marie speaks four languages, yet she says she's shy.",
    shadow: { prompt: "Use «pourtant» for an unexpected contrast:", lead: "Il pleut depuis ce matin…", leadEn: "It's been raining since this morning…", model: "Il pleut depuis ce matin, pourtant il a quand même fait son jogging.", modelEn: "It's been raining since this morning, yet he still went jogging." },
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
    recognizeEn: "Pierre loves sports. On the other hand, his brother prefers reading.",
    shadow: { prompt: "Use «en revanche» to contrast two facts:", lead: "Les villes offrent beaucoup d'opportunités…", leadEn: "Cities offer many opportunities…", model: "Les villes offrent beaucoup d'opportunités. En revanche, la qualité de vie y est souvent moindre.", modelEn: "Cities offer many opportunities. On the other hand, the quality of life is often lower there." },
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
    recognizeEn: "He travels every month, whereas his sister always stays home.",
    shadow: { prompt: "Use «alors que» to contrast two people or facts:", lead: "Au Canada il faut payer pour la pharmacie…", leadEn: "In Canada you have to pay for pharmacy…", model: "Au Canada il faut payer pour la pharmacie, alors qu'en France elle est remboursée.", modelEn: "In Canada you have to pay for pharmacy, whereas in France it's reimbursed." },
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
    recognizeEn: "Rich countries consume a lot, whereas poor countries pollute little.",
    shadow: { prompt: "Use «tandis que» in a formal contrast:", lead: "Certains pays misent sur l'énergie nucléaire…", leadEn: "Some countries bet on nuclear energy…", model: "Certains pays misent sur l'énergie nucléaire, tandis que d'autres préfèrent les énergies renouvelables.", modelEn: "Some countries bet on nuclear energy, whereas others prefer renewable energy." },
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
    recognizeEn: "The neighbourhood is very pleasant. In fact, many artists live there.",
    shadow: { prompt: "Use «d'ailleurs» to reinforce with a related fact:", lead: "Cette université est très réputée…", leadEn: "This university is very renowned…", model: "Cette université est très réputée. D'ailleurs, plusieurs prix Nobel y ont enseigné.", modelEn: "This university is very renowned. In fact, several Nobel laureates have taught there." },
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
    recognizeEn: "This city attracts tourists. Indeed, it receives ten million visitors per year.",
    shadow: { prompt: "Use «en effet» to back up your claim with evidence:", lead: "Le marché du travail est tendu…", leadEn: "The job market is tight…", model: "Le marché du travail est tendu. En effet, beaucoup d'entreprises peinent à recruter.", modelEn: "The job market is tight. Indeed, many companies are struggling to recruit." },
  },
];
