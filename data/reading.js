// Graded reading texts + comprehension. CLB 4 → 6 progression.
window.READINGS = {
  r1: {
    title: 'La journée de Marie',
    level: 'CLB 4',
    text: `Marie habite à Montréal. Elle est étudiante. Tous les matins, elle se réveille à sept heures. Elle prend son petit-déjeuner: du pain, du fromage et un café. Ensuite, elle va à l'université en métro. Elle aime ses cours, mais les mathématiques sont difficiles. Le soir, elle rentre chez elle, mange avec sa famille et lit un livre avant de dormir.`,
    questions: [
      { q: 'Où habite Marie ?', opts: ['Paris', 'Montréal', 'Lyon'], a: 1 },
      { q: 'À quelle heure se réveille-t-elle ?', opts: ['6h', '7h', '8h'], a: 1 },
      { q: 'Quel cours est difficile pour Marie ?', opts: ['Français', 'Maths', 'Histoire'], a: 1 },
      { q: 'Comment va-t-elle à l\'université ?', opts: ['à pied', 'en voiture', 'en métro'], a: 2 },
      { q: 'Que fait-elle le soir avant de dormir ?', opts: ['regarde la TV', 'lit un livre', 'cuisine'], a: 1 },
    ],
  },
  r2: {
    title: 'Météo et environnement',
    level: 'CLB 5',
    text: `Cet été a été exceptionnellement chaud au Canada. Les températures ont atteint plus de 35 degrés dans plusieurs villes. Les scientifiques affirment que ces vagues de chaleur sont plus fréquentes à cause du changement climatique. Le gouvernement encourage les citoyens à économiser l'eau et à utiliser moins la voiture. Beaucoup de personnes préfèrent maintenant le vélo ou les transports en commun pour aller au travail.`,
    questions: [
      { q: 'Comment a été l\'été au Canada ?', opts: ['froid', 'chaud', 'pluvieux'], a: 1 },
      { q: 'Quelles températures ont été atteintes ?', opts: ['plus de 25°C', 'plus de 35°C', 'plus de 45°C'], a: 1 },
      { q: 'Quelle est la cause selon les scientifiques ?', opts: ['changement climatique', 'pollution de l\'air', 'volcans'], a: 0 },
      { q: 'Que conseille le gouvernement ?', opts: ['acheter une voiture', 'économiser l\'eau', 'voyager plus'], a: 1 },
      { q: 'Comment les gens préfèrent-ils aller au travail ?', opts: ['en voiture', 'en avion', 'à vélo ou transports en commun'], a: 2 },
    ],
  },
  r3: {
    title: 'CLB 6 Mock — Une lettre d\'invitation',
    level: 'CLB 6',
    text: `Chère Sophie,

J'espère que tu vas bien. Je t'écris pour t'inviter à passer un week-end chez moi à Québec, du vendredi 18 au dimanche 20 juin. Mon mari et moi avons préparé plusieurs activités: une promenade dans le Vieux-Québec, un dîner dans un restaurant traditionnel, et une visite au musée d'art moderne dimanche matin.

Si tu peux venir, il faudra prendre le train de Montréal vendredi après-midi — il arrive à 17 h 30. Je viendrai te chercher à la gare. Apporte des vêtements chauds parce qu'il fait parfois frais le soir, même en juin. Notre maison se trouve dans un quartier calme près du fleuve.

S'il te plaît, réponds avant le 10 juin pour que je puisse réserver le restaurant. J'attends ta réponse avec impatience.

Bisous,
Catherine`,
    questions: [
      { q: 'Qui écrit la lettre ?', opts: ['Sophie', 'Catherine', 'Le mari'], a: 1 },
      { q: 'Combien de jours dure l\'invitation ?', opts: ['1', '2', '3'], a: 2 },
      { q: 'Quelle activité n\'est PAS mentionnée ?', opts: ['promenade dans Vieux-Québec', 'restaurant traditionnel', 'spectacle de théâtre'], a: 2 },
      { q: 'À quelle heure arrive le train ?', opts: ['15 h 30', '17 h 30', '18 h 30'], a: 1 },
      { q: 'Pourquoi apporter des vêtements chauds ?', opts: ['il neige', 'il fait frais le soir', 'la maison est froide'], a: 1 },
      { q: 'Avant quelle date faut-il répondre ?', opts: ['1 juin', '10 juin', '18 juin'], a: 1 },
      { q: 'Où se trouve la maison ?', opts: ['centre-ville', 'près du fleuve', 'à la montagne'], a: 1 },
    ],
  },
};
