// Hard-coded spoken sets, extracted so audio can be pre-generated.
// Each item: { fr, en } — en is the English gloss shown under the French in shadow mode.

window.SPEAK_SETS = {
  greetings: {
    title: 'Greetings & Self',
    level: 'CLB 3',
    items: [
      { fr: 'Bonjour, comment ça va ?',            en: 'Hello, how are you?' },
      { fr: "Je m'appelle Alex.",                  en: "My name is Alex." },
      { fr: 'Enchanté de te rencontrer.',          en: 'Nice to meet you.' },
      { fr: 'Merci beaucoup.',                     en: 'Thank you very much.' },
      { fr: 'Au revoir, à demain.',                en: 'Goodbye, see you tomorrow.' },
    ]
  },
  cafe: {
    title: 'Ordering at a Café',
    level: 'CLB 4',
    items: [
      { fr: "Bonjour, je voudrais un café s'il vous plaît.", en: "Hello, I'd like a coffee please." },
      { fr: 'Vous avez des croissants ?',                    en: 'Do you have croissants?' },
      { fr: "L'addition, s'il vous plaît.",                  en: "The bill, please." },
      { fr: 'Combien ça coûte ?',                            en: 'How much does it cost?' },
      { fr: 'Merci, bonne journée.',                         en: 'Thanks, have a good day.' },
    ]
  },
  day: {
    title: 'Describe Your Day',
    level: 'CLB 4-5',
    items: [
      { fr: "Aujourd'hui, je suis allé au parc.",            en: "Today, I went to the park." },
      { fr: "J'ai mangé une salade au déjeuner.",            en: "I had a salad for lunch." },
      { fr: 'Je travaille de neuf heures à dix-sept heures.', en: 'I work from 9 am to 5 pm.' },
      { fr: "Le soir, j'ai regardé un film.",                en: "In the evening, I watched a movie." },
      { fr: "Demain, je vais visiter mes amis.",             en: "Tomorrow, I'm going to visit my friends." },
    ]
  },
  directions: {
    title: 'Asking for Directions',
    level: 'CLB 5',
    items: [
      { fr: 'Excusez-moi, où se trouve la station de métro ?', en: 'Excuse me, where is the metro station?' },
      { fr: 'Pouvez-vous me dire où est la gare ?',            en: 'Can you tell me where the train station is?' },
      { fr: 'Continuez tout droit, puis tournez à gauche.',    en: 'Go straight, then turn left.' },
      { fr: "C'est loin d'ici à pied ?",                       en: "Is it far from here on foot?" },
      { fr: 'Merci beaucoup pour votre aide.',                 en: 'Thank you very much for your help.' },
    ]
  },
  appointment: {
    title: 'Making an Appointment',
    level: 'CLB 5',
    items: [
      { fr: "Bonjour, je voudrais prendre un rendez-vous.",       en: "Hello, I'd like to make an appointment." },
      { fr: 'Est-ce que vous êtes disponible mardi matin ?',      en: 'Are you available Tuesday morning?' },
      { fr: "À quelle heure le médecin peut-il me voir ?",        en: "What time can the doctor see me?" },
      { fr: 'Je dois annuler mon rendez-vous de demain.',         en: 'I need to cancel my appointment for tomorrow.' },
      { fr: 'Merci, à mardi prochain.',                           en: 'Thanks, see you next Tuesday.' },
    ]
  },
  past: {
    title: 'Talking About the Past',
    level: 'CLB 5-6',
    items: [
      { fr: "Hier soir, j'ai dîné avec ma famille.",                  en: "Last night, I had dinner with my family." },
      { fr: "Quand j'étais petit, j'aimais beaucoup le sport.",       en: "When I was little, I loved sports." },
      { fr: "L'année dernière, nous sommes allés au Mexique.",        en: "Last year, we went to Mexico." },
      { fr: "Avant d'arriver au Canada, je vivais en France.",        en: "Before coming to Canada, I lived in France." },
      { fr: "J'ai commencé à apprendre le français il y a six mois.", en: "I started learning French six months ago." },
    ]
  },
  future: {
    title: 'Plans & Future',
    level: 'CLB 5-6',
    items: [
      { fr: "La semaine prochaine, je vais commencer un nouveau travail.", en: "Next week, I'm going to start a new job." },
      { fr: "Si j'ai le temps, je voyagerai en Europe cet été.",           en: "If I have time, I'll travel to Europe this summer." },
      { fr: "Quand je parlerai mieux français, je chercherai un meilleur emploi.", en: "When I speak French better, I'll look for a better job." },
      { fr: "J'espère obtenir mon diplôme dans deux ans.",                 en: "I hope to get my degree in two years." },
      { fr: "Dans cinq ans, je voudrais avoir ma propre entreprise.",      en: "In five years, I'd like to have my own company." },
    ]
  },
  mock: {
    title: 'CLB 6 Mock Speaking',
    level: 'CLB 6',
    items: [
      { fr: 'Pouvez-vous me dire où se trouve la gare la plus proche ?',          en: 'Can you tell me where the nearest train station is?' },
      { fr: "Quand j'étais petit, je passais mes étés chez ma grand-mère.",       en: "When I was little, I spent my summers at my grandmother's." },
      { fr: 'Si je gagne à la loterie, je voyagerai partout dans le monde.',       en: "If I win the lottery, I'll travel all around the world." },
      { fr: 'Je voudrais réserver une table pour deux personnes vendredi soir.',  en: "I'd like to reserve a table for two on Friday evening." },
      { fr: 'Merci de votre temps. Je vous recontacterai la semaine prochaine.',  en: "Thank you for your time. I'll get back to you next week." },
      { fr: "Pourriez-vous m'expliquer comment fonctionne ce système, s'il vous plaît ?", en: "Could you explain how this system works, please?" },
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
  { fr: ['Le', 'livre', 'que', 'je', 'lis', 'est', 'interessant'], en: 'The book I am reading is interesting.' },
];
