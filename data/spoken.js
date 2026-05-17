// Hard-coded spoken sets, extracted so audio can be pre-generated.
window.SPEAK_SETS = {
  greetings: {
    title: 'Greetings & Self',
    level: 'CLB 3',
    items: [
      'Bonjour, comment ça va ?',
      "Je m'appelle Alex.",
      'Enchanté de te rencontrer.',
      'Merci beaucoup.',
      'Au revoir, à demain.',
    ]
  },
  cafe: {
    title: 'Ordering at a Café',
    level: 'CLB 4',
    items: [
      "Bonjour, je voudrais un café s'il vous plaît.",
      'Vous avez des croissants ?',
      "L'addition, s'il vous plaît.",
      'Combien ça coûte ?',
      'Merci, bonne journée.',
    ]
  },
  day: {
    title: 'Describe Your Day',
    level: 'CLB 4-5',
    items: [
      "Aujourd'hui, je suis allé au parc.",
      "J'ai mangé une salade au déjeuner.",
      'Je travaille de neuf heures à dix-sept heures.',
      "Le soir, j'ai regardé un film.",
      "Demain, je vais visiter mes amis.",
    ]
  },
  directions: {
    title: 'Asking for Directions',
    level: 'CLB 5',
    items: [
      'Excusez-moi, où se trouve la station de métro ?',
      'Pouvez-vous me dire où est la gare ?',
      'Continuez tout droit, puis tournez à gauche.',
      "C'est loin d'ici à pied ?",
      'Merci beaucoup pour votre aide.',
    ]
  },
  appointment: {
    title: 'Making an Appointment',
    level: 'CLB 5',
    items: [
      "Bonjour, je voudrais prendre un rendez-vous.",
      'Est-ce que vous êtes disponible mardi matin ?',
      "À quelle heure le médecin peut-il me voir ?",
      'Je dois annuler mon rendez-vous de demain.',
      'Merci, à mardi prochain.',
    ]
  },
  past: {
    title: 'Talking About the Past',
    level: 'CLB 5-6',
    items: [
      "Hier soir, j'ai dîné avec ma famille.",
      "Quand j'étais petit, j'aimais beaucoup le sport.",
      "L'année dernière, nous sommes allés au Mexique.",
      "Avant d'arriver au Canada, je vivais en France.",
      "J'ai commencé à apprendre le français il y a six mois.",
    ]
  },
  future: {
    title: 'Plans & Future',
    level: 'CLB 5-6',
    items: [
      "La semaine prochaine, je vais commencer un nouveau travail.",
      "Si j'ai le temps, je voyagerai en Europe cet été.",
      "Quand je parlerai mieux français, je chercherai un meilleur emploi.",
      "J'espère obtenir mon diplôme dans deux ans.",
      "Dans cinq ans, je voudrais avoir ma propre entreprise.",
    ]
  },
  mock: {
    title: 'CLB 6 Mock Speaking',
    level: 'CLB 6',
    items: [
      'Pouvez-vous me dire où se trouve la gare la plus proche ?',
      "Quand j'étais petit, je passais mes étés chez ma grand-mère.",
      'Si je gagne à la loterie, je voyagerai partout dans le monde.',
      'Je voudrais réserver une table pour deux personnes vendredi soir.',
      'Merci de votre temps. Je vous recontacterai la semaine prochaine.',
      "Pourriez-vous m'expliquer comment fonctionne ce système, s'il vous plaît ?",
    ]
  },
};

window.SENTENCES = [
  { fr: ['Je', 'mange', 'une', 'pomme', 'rouge'], en: 'I eat a red apple.' },
  { fr: ['Nous', 'allons', 'au', 'parc', 'demain'], en: 'We are going to the park tomorrow.' },
  { fr: ['Elle', 'a', 'deux', 'frères'], en: 'She has two brothers.' },
  { fr: ['Le', 'chat', 'noir', 'dort', 'sur', 'le', 'lit'], en: 'The black cat sleeps on the bed.' },
  { fr: ['Hier', "j'", 'ai', 'mangé', 'au', 'restaurant'], en: 'Yesterday I ate at the restaurant.' },
  { fr: ['Quand', "j'étais", 'petit', 'je', 'jouais', 'au', 'football'], en: 'When I was little I played football.' },
  { fr: ['Si', "j'avais", 'le', 'temps', 'je', 'lirais', 'plus'], en: 'If I had the time I would read more.' },
  { fr: ['Il', 'faut', 'que', 'tu', 'sois', 'patient'], en: 'You must be patient.' },
  { fr: ["J'habite", 'à', 'Montréal', 'depuis', 'trois', 'ans'], en: 'I have lived in Montréal for three years.' },
  { fr: ['Le', 'livre', 'que', 'je', 'lis', 'est', 'intéressant'], en: 'The book I am reading is interesting.' },
];
