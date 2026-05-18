// Discourse connector drills. TCF rewards these heavily in EE/EO.
// Each drill: a prompt sentence + target connector + acceptable example continuations.
window.CONNECTOR_DRILLS = [
  {
    category: 'Contrast / opposition',
    prompt: 'Le télétravail permet de gagner du temps en évitant les transports.',
    target: 'cependant',
    targetExplain: 'Use "cependant" to introduce a strong contrast or qualification.',
    sampleContinuations: [
      'Cependant, il peut aussi isoler les employés.',
      'Cependant, certaines personnes manquent de discipline à la maison.',
      'Cependant, les conversations spontanées au bureau créent de la créativité.',
    ],
  },
  {
    category: 'Contrast / opposition',
    prompt: 'Les jeunes adultes préfèrent vivre en ville pour les opportunités professionnelles.',
    target: 'en revanche',
    targetExplain: '"En revanche" presents a direct counterpoint.',
    sampleContinuations: [
      'En revanche, les familles avec enfants choisissent souvent la banlieue.',
      'En revanche, beaucoup de retraités quittent les grandes villes.',
    ],
  },
  {
    category: 'Contrast / opposition',
    prompt: "L'apprentissage en ligne offre une grande flexibilité aux étudiants.",
    target: 'néanmoins',
    targetExplain: '"Néanmoins" = however (slightly formal). Connects despite-style.',
    sampleContinuations: [
      "Néanmoins, il demande beaucoup d'autodiscipline.",
      "Néanmoins, l'interaction humaine y est limitée.",
    ],
  },
  {
    category: 'Cause',
    prompt: 'Les jeunes passent de plus en plus de temps sur les écrans.',
    target: 'parce que',
    targetExplain: '"Parce que" = because. Introduces a direct cause.',
    sampleContinuations: [
      'Parce que les plateformes sont conçues pour capter leur attention.',
      'Parce que leurs amis y sont actifs.',
    ],
  },
  {
    category: 'Consequence',
    prompt: "L'usage des écrans avant de dormir réduit la qualité du sommeil.",
    target: 'par conséquent',
    targetExplain: '"Par conséquent" = consequently / as a result. Formal.',
    sampleContinuations: [
      "Par conséquent, on recommande d'éteindre les téléphones une heure avant de se coucher.",
      'Par conséquent, beaucoup de jeunes se sentent fatigués le matin.',
    ],
  },
  {
    category: 'Consequence',
    prompt: 'La population vieillit dans la plupart des pays développés.',
    target: 'ainsi',
    targetExplain: '"Ainsi" = thus / so. Introduces a logical result.',
    sampleContinuations: [
      'Ainsi, les besoins en soins de santé augmentent.',
      'Ainsi, le système de retraite doit être repensé.',
    ],
  },
  {
    category: 'Addition',
    prompt: 'Apprendre une langue étrangère ouvre des perspectives professionnelles.',
    target: 'par ailleurs',
    targetExplain: '"Par ailleurs" = moreover / on top of that. Adds a complementary point.',
    sampleContinuations: [
      'Par ailleurs, cela enrichit la culture personnelle.',
      'Par ailleurs, on découvre une nouvelle façon de penser.',
    ],
  },
  {
    category: 'Addition',
    prompt: 'Le vélo est un moyen de transport économique.',
    target: 'de plus',
    targetExplain: '"De plus" = furthermore. Adds another argument.',
    sampleContinuations: [
      'De plus, il est bon pour la santé.',
      "De plus, il ne pollue pas.",
    ],
  },
  {
    category: 'Example',
    prompt: 'Beaucoup de pays développent les énergies renouvelables.',
    target: 'par exemple',
    targetExplain: '"Par exemple" = for example. Introduces a concrete case.',
    sampleContinuations: [
      'Par exemple, le Danemark produit plus de 50% de son électricité par éolienne.',
      'Par exemple, la Norvège vend des voitures presque exclusivement électriques.',
    ],
  },
  {
    category: 'Reinforcement',
    prompt: 'Le tabac cause de graves problèmes de santé.',
    target: 'en effet',
    targetExplain: '"En effet" = indeed. Reinforces what was just said.',
    sampleContinuations: [
      'En effet, il est responsable de millions de décès chaque année.',
      "En effet, c'est la première cause de cancer évitable.",
    ],
  },
  {
    category: 'Concession',
    prompt: 'Les médias sociaux permettent à chacun de partager ses idées.',
    target: 'certes',
    targetExplain: '"Certes" = admittedly / it is true. Concedes before contrasting.',
    sampleContinuations: [
      'Certes, ils favorisent la liberté d\'expression, mais ils propagent aussi la désinformation.',
      "Certes, ils nous connectent, mais ils peuvent aussi nous isoler.",
    ],
  },
  {
    category: 'Sequencing',
    prompt: 'Pour réussir un projet, il faut le planifier.',
    target: 'd\'abord',
    targetExplain: '"D\'abord" = first. Starts an ordered list.',
    sampleContinuations: [
      "D'abord, il faut définir des objectifs clairs.",
      "D'abord, on doit identifier les ressources nécessaires.",
    ],
  },
  {
    category: 'Sequencing',
    prompt: 'Étudier une langue demande des étapes claires.',
    target: 'ensuite',
    targetExplain: '"Ensuite" = then / next. Continues a sequence.',
    sampleContinuations: [
      'Ensuite, il faut pratiquer chaque jour.',
      "Ensuite, on doit s'exposer à des contenus authentiques.",
    ],
  },
  {
    category: 'Conclusion',
    prompt: 'Le réchauffement climatique menace nos écosystèmes.',
    target: 'en conclusion',
    targetExplain: '"En conclusion" = in conclusion. Wraps up an argument.',
    sampleContinuations: [
      "En conclusion, agir maintenant est crucial pour les générations futures.",
      "En conclusion, chaque pays doit contribuer à la solution.",
    ],
  },
  {
    category: 'Contrast / opposition',
    prompt: "L'IA peut remplacer certaines tâches répétitives.",
    target: 'toutefois',
    targetExplain: '"Toutefois" = however (formal/written). Synonym of cependant.',
    sampleContinuations: [
      "Toutefois, elle ne remplace pas la créativité humaine.",
      'Toutefois, son adoption demande beaucoup de formation.',
    ],
  },
];
