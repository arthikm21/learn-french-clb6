// TCF Canada — Expression orale Task 3: Argumentative monologue (~5 minutes).
// User takes a position on an opinion topic, defends it with 3+ reasons + counter-argument.
// Each item carries `topicEn` + `promptEn` for the EN-gloss toggle.
window.SPEAK_TASK3 = {
  st3_telework: {
    title: 'Pour ou contre le télétravail',
    level: 'CLB 6',
    topic: 'Le télétravail est-il une bonne chose pour les employés et les entreprises ?',
    topicEn: "Is remote work a good thing for employees and companies?",
    prompt: "Donnez votre opinion sur le télétravail. Prenez position clairement, défendez-la avec au moins 3 raisons, donnez un exemple concret, et anticipez un contre-argument. Parlez pendant 3 à 5 minutes.",
    promptEn: "Give your opinion on remote work. Take a clear position, defend it with at least 3 reasons, give a concrete example, and anticipate a counter-argument. Speak for 3 to 5 minutes.",
    targetTime: 300,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'personnellement', 'je crois', 'je suis pour', 'je suis contre', 'je trouve'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'en revanche', 'd\'abord', 'ensuite', 'enfin', 'd\'une part', 'd\'autre part', 'par ailleurs', 'en outre', 'en effet', 'ainsi', 'donc'],
      examples: ['par exemple', 'comme', 'notamment', 'c\'est le cas', 'prenons'],
      counter: ['certains pensent', 'on pourrait dire', 'il est vrai que', 'bien sûr', 'certes', 'évidemment'],
    },
  },
  st3_screens: {
    title: 'Les écrans chez les enfants',
    level: 'CLB 6',
    topic: 'Faut-il interdire les écrans aux enfants de moins de 10 ans ?',
    topicEn: "Should screens be banned for children under 10?",
    prompt: "Prenez position sur cette question. Justifiez avec 3 arguments, donnez un exemple personnel ou observé, et mentionnez l'opinion contraire pour la nuancer. Cible : 3-5 minutes.",
    promptEn: "Take a position on this question. Justify with 3 arguments, give a personal or observed example, and mention the opposite opinion to nuance it. Target: 3-5 minutes.",
    targetTime: 300,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'personnellement', 'je suis pour', 'je suis contre'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'en revanche', 'd\'abord', 'ensuite', 'enfin', 'd\'une part', 'd\'autre part'],
      examples: ['par exemple', 'comme', 'notamment'],
      counter: ['certains pensent', 'il est vrai que', 'bien sûr', 'certes'],
    },
  },
  st3_immigration: {
    title: 'Apprentissage du français obligatoire',
    level: 'CLB 6',
    topic: 'Faut-il rendre l\'apprentissage du français obligatoire pour tous les nouveaux immigrants au Québec ?',
    topicEn: "Should learning French be made mandatory for all new immigrants to Quebec?",
    prompt: "Donnez votre avis avec au moins 3 raisons. Citez un exemple concret du contexte canadien. Mentionnez et réfutez une objection possible. 3-5 minutes.",
    promptEn: "Give your opinion with at least 3 reasons. Cite a concrete example from the Canadian context. Mention and rebut a possible objection. 3-5 minutes.",
    targetTime: 300,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'je suis pour', 'je suis contre'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'd\'une part', 'd\'autre part', 'par ailleurs'],
      examples: ['par exemple', 'notamment', 'comme'],
      counter: ['certes', 'bien sûr', 'on pourrait penser que', 'il est vrai que'],
    },
  },
  st3_publictransit: {
    title: 'Gratuité des transports en commun',
    level: 'CLB 5-6',
    topic: 'Les transports en commun devraient-ils être gratuits dans toutes les grandes villes ?',
    topicEn: "Should public transit be free in all big cities?",
    prompt: "Argumentez votre position avec 3 raisons (sociales, environnementales, économiques). Donnez un exemple. Réfutez l'argument inverse. 3 minutes minimum.",
    promptEn: "Argue your position with 3 reasons (social, environmental, economic). Give an example. Rebut the opposing argument. 3 minutes minimum.",
    targetTime: 240,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'je suis pour', 'je suis contre'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'en revanche', 'd\'abord', 'ensuite', 'enfin', 'par ailleurs'],
      examples: ['par exemple', 'comme', 'notamment'],
      counter: ['certains pensent', 'il est vrai que', 'bien sûr'],
    },
  },
  st3_socialmedia: {
    title: 'Réseaux sociaux : bénéfiques ou nuisibles ?',
    level: 'CLB 6',
    topic: 'Les réseaux sociaux ont-ils plus de bénéfices que de dangers pour la société ?',
    topicEn: "Do social networks have more benefits than dangers for society?",
    prompt: "Prenez position. Trois raisons solides, un exemple, un contre-argument abordé. 3-5 minutes.",
    promptEn: "Take a position. Three solid reasons, an example, a counter-argument addressed. 3-5 minutes.",
    targetTime: 300,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'personnellement', 'je crois'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'd\'une part', 'd\'autre part', 'par ailleurs', 'en outre'],
      examples: ['par exemple', 'comme', 'notamment'],
      counter: ['certains pensent', 'il est vrai que', 'bien sûr'],
    },
  },
  st3_meat: {
    title: 'Réduire la consommation de viande',
    level: 'CLB 6',
    topic: 'Faut-il que tout le monde réduise sa consommation de viande pour le bien de la planète ?',
    topicEn: "Should everyone reduce their meat consumption for the good of the planet?",
    prompt: "Donnez votre avis avec 3 arguments (santé, environnement, économie). Exemple concret. Mention du contre-argument. 3-4 minutes.",
    promptEn: "Give your opinion with 3 arguments (health, environment, economy). Concrete example. Mention the counter-argument. 3-4 minutes.",
    targetTime: 240,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'personnellement'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'en revanche'],
      examples: ['par exemple', 'comme', 'notamment'],
      counter: ['certes', 'bien sûr', 'il est vrai que'],
    },
  },
  st3_university: {
    title: 'Université ou métier ?',
    level: 'CLB 6',
    topic: 'Faut-il encourager tous les jeunes à aller à l\'université, ou valoriser autant les métiers manuels ?',
    topicEn: "Should we encourage all young people to go to university, or value skilled trades just as much?",
    prompt: "Prenez position et défendez avec 3 arguments. Exemple personnel ou observé. Considérez le point de vue opposé. 3-5 minutes.",
    promptEn: "Take a position and defend it with 3 arguments. Personal or observed example. Consider the opposing view. 3-5 minutes.",
    targetTime: 300,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'd\'une part', 'd\'autre part'],
      examples: ['par exemple', 'comme'],
      counter: ['certains pensent', 'il est vrai que'],
    },
  },
  st3_mock_clb6: {
    title: 'CLB 6 Mock — Voyager seul ou en groupe',
    level: 'CLB 6',
    topic: 'Est-il préférable de voyager seul ou en groupe ?',
    topicEn: "Is it better to travel alone or in a group?",
    prompt: "Donnez votre opinion avec 3 raisons précises. Donnez un exemple personnel d'un voyage. Mentionnez les avantages de l'option opposée. 4-5 minutes.",
    promptEn: "Give your opinion with 3 specific reasons. Give a personal example from a trip. Mention the advantages of the opposite option. 4-5 minutes.",
    targetTime: 300,
    keywords: {
      position: ['je pense', 'à mon avis', 'selon moi', 'personnellement', 'je préfère'],
      connectors: ['cependant', 'néanmoins', 'par conséquent', 'en revanche', 'd\'une part', 'd\'autre part', 'par ailleurs', 'en outre', 'ainsi'],
      examples: ['par exemple', 'comme', 'notamment', 'c\'est le cas', 'prenons'],
      counter: ['certains préfèrent', 'il est vrai que', 'bien sûr', 'certes'],
    },
  },
};

// ───────────── Batch 4 expansion (22 new topics) ─────────────
// All use the standard prompt structure + the same scoring keyword set as
// the originals — only the topic changes, exactly like the real exam.
(function () {
  const KW = {
    position: ['je pense', 'à mon avis', 'selon moi', 'personnellement', 'je crois', 'je suis pour', 'je suis contre', 'je trouve'],
    connectors: ['cependant', 'néanmoins', 'par conséquent', 'en revanche', "d'abord", 'ensuite', 'enfin', "d'une part", "d'autre part", 'par ailleurs', 'en outre', 'en effet', 'ainsi', 'donc', 'de plus'],
    examples: ['par exemple', 'comme', 'notamment', "c'est le cas", 'prenons'],
    counter: ['certains pensent', 'on pourrait dire', 'il est vrai que', 'bien sûr', 'certes', 'évidemment'],
  };
  const PROMPT = "Prenez position clairement, défendez-la avec au moins 3 raisons, donnez un exemple concret, et anticipez un contre-argument. Parlez pendant 3 à 5 minutes.";
  const PROMPT_EN = "Take a clear position, defend it with at least 3 reasons, give a concrete example, and anticipate a counter-argument. Speak for 3 to 5 minutes.";
  const TOPICS = [
    ['st3_cars_city', 'Les voitures au centre-ville', 'Faut-il interdire les voitures dans les centres-villes ?', 'Should cars be banned from city centres?'],
    ['st3_fastfood', 'La taxe sur la malbouffe', 'Faut-il taxer davantage la malbouffe pour financer la santé publique ?', 'Should junk food be taxed more to fund public health?'],
    ['st3_uniform', "L'uniforme à l'école", "L'uniforme scolaire devrait-il être obligatoire ?", 'Should school uniforms be mandatory?'],
    ['st3_pets_apartments', 'Les animaux en logement', 'Les propriétaires devraient-ils avoir le droit de refuser les animaux ?', 'Should landlords have the right to refuse pets?'],
    ['st3_retirement', "L'âge de la retraite", "Faut-il repousser l'âge de la retraite ?", 'Should the retirement age be raised?'],
    ['st3_bilingual_kids', 'Les enfants bilingues', 'Élever ses enfants dans deux langues : avantage ou source de confusion ?', 'Raising children in two languages: advantage or source of confusion?'],
    ['st3_online_shopping', "L'achat en ligne", "L'achat en ligne menace-t-il les commerces de quartier ?", 'Does online shopping threaten local businesses?'],
    ['st3_fourday_week', 'La semaine de quatre jours', 'La semaine de travail de quatre jours devrait-elle devenir la norme ?', 'Should the four-day work week become the norm?'],
    ['st3_phones_school', "Les téléphones à l'école", 'Faut-il interdire les téléphones cellulaires dans les écoles secondaires ?', 'Should cell phones be banned in high schools?'],
    ['st3_public_daycare', 'Les garderies universelles', 'Les garderies subventionnées devraient-elles être accessibles à toutes les familles ?', 'Should subsidized daycare be accessible to all families?'],
    ['st3_mass_tourism', 'Le tourisme de masse', 'Le tourisme de masse fait-il plus de mal que de bien ?', 'Does mass tourism do more harm than good?'],
    ['st3_composting', 'Le compostage obligatoire', 'Le compostage devrait-il être obligatoire pour tous les ménages ?', 'Should composting be mandatory for all households?'],
    ['st3_multigen', 'Vivre avec ses parents âgés', 'Devrait-on vivre avec ses parents âgés plutôt que de les placer en résidence ?', 'Should we live with our elderly parents rather than placing them in a home?'],
    ['st3_minwage', 'Le salaire minimum', 'Faut-il augmenter fortement le salaire minimum ?', 'Should the minimum wage be raised significantly?'],
    ['st3_ai_jobs', "L'intelligence artificielle au travail", "L'intelligence artificielle menace-t-elle nos emplois ?", 'Does artificial intelligence threaten our jobs?'],
    ['st3_kids_sports', 'La compétition chez les jeunes', 'Le sport de compétition est-il bon pour les enfants ?', 'Are competitive sports good for children?'],
    ['st3_homework', 'Les devoirs à la maison', 'Faut-il abolir les devoirs au primaire ?', 'Should homework be abolished in elementary school?'],
    ['st3_youth_service', 'Le bénévolat obligatoire', 'Les jeunes devraient-ils faire du bénévolat obligatoire avant 18 ans ?', 'Should young people do mandatory volunteer work before 18?'],
    ['st3_bike_lanes', 'Les pistes cyclables', 'Faut-il construire plus de pistes cyclables, même au détriment du stationnement ?', 'Should more bike lanes be built, even at the expense of parking?'],
    ['st3_tipping', 'La culture du pourboire', "Faut-il abolir le pourboire et augmenter les salaires des serveurs ?", "Should tipping be abolished and servers' wages raised?"],
    ['st3_regions', "S'installer en région", "Les nouveaux arrivants devraient-ils s'installer en région plutôt que dans les grandes villes ?", 'Should newcomers settle in smaller regions rather than big cities?'],
    ['st3_socialmedia_age', "L'âge minimum pour les réseaux sociaux", 'Faut-il imposer un âge minimum de seize ans pour les réseaux sociaux ?', 'Should a minimum age of 16 be imposed for social media?'],
  ];
  for (const [id, title, topic, topicEn] of TOPICS) {
    window.SPEAK_TASK3[id] = {
      title, level: 'CLB 6', topic, topicEn,
      prompt: PROMPT, promptEn: PROMPT_EN,
      targetTime: 300, keywords: KW,
    };
  }
})();
