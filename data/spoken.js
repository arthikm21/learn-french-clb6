// Hard-coded spoken sets, extracted so audio can be pre-generated.
window.SPEAK_SETS = {
  greetings: { title: 'Greetings', items: ['Bonjour, comment ça va ?', "Je m'appelle Alex.", 'Enchanté de te rencontrer.', 'Merci beaucoup.', 'Au revoir, à demain.'] },
  day: { title: 'Describe Your Day', items: ["Aujourd'hui, je suis allé au parc.", "J'ai mangé une salade au déjeuner.", 'Je travaille de neuf heures à dix-sept heures.', "Le soir, j'ai regardé un film."] },
  mock: { title: 'CLB 6 Mock Speaking', items: [
    'Pouvez-vous me dire où se trouve la gare la plus proche ?',
    "Quand j'étais petit, je passais mes étés chez ma grand-mère.",
    'Si je gagne à la loterie, je voyagerai partout dans le monde.',
    'Je voudrais réserver une table pour deux personnes vendredi soir.',
    'Merci de votre temps. Je vous recontacterai la semaine prochaine.',
  ] },
};

window.SENTENCES = [
  { fr: ['Je', 'mange', 'une', 'pomme', 'rouge'], en: 'I eat a red apple.' },
  { fr: ['Nous', 'allons', 'au', 'parc', 'demain'], en: 'We are going to the park tomorrow.' },
  { fr: ['Elle', 'a', 'deux', 'frères'], en: 'She has two brothers.' },
  { fr: ['Le', 'chat', 'noir', 'dort', 'sur', 'le', 'lit'], en: 'The black cat sleeps on the bed.' },
  { fr: ['Hier', "j'", 'ai', 'mangé', 'au', 'restaurant'], en: 'Yesterday I ate at the restaurant.' },
  { fr: ['Quand', "j'étais", 'petit', 'je', 'jouais', 'au', 'football'], en: 'When I was little I played football.' },
];
