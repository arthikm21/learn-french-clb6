// Speaking Tasks: open-ended speaking practice beyond repeat-the-sentence.
// Types: describe-picture, spontaneous Q&A, role-play.
// French prompts each have `*En` siblings — the EN gloss shown to learners when
// the "Show English translations" Profile setting is on.
window.SPEAK_TASKS = {
  picture1: {
    type: 'picture',
    title: 'Décrivez la scène',
    level: 'CLB 4',
    emoji: '🏞️',
    sceneDesc: 'A young couple having a picnic in a park. Sunny day. Trees, a blanket, sandwiches and fruit. A dog beside them.',
    prompt: 'Regardez la scène ci-dessous. Décrivez-la pendant 60 secondes en français. Mentionnez : où les personnes sont, ce qu\'elles font, comment est le temps, ce qu\'il y a autour.',
    promptEn: 'Look at the scene below. Describe it for 60 seconds in French. Mention: where the people are, what they are doing, what the weather is like, what is around them.',
    targetWords: 40,
    targetTime: 60,
    keywords: ['parc', 'pique-nique', 'couverture', 'sandwich', 'fruits', 'chien', 'soleil', 'arbre', 'mange', 'beau temps', 'famille', 'couple'],
  },
  picture2: {
    type: 'picture',
    title: 'Une journée au marché',
    level: 'CLB 5',
    emoji: '🥖',
    sceneDesc: 'A busy outdoor farmers market in autumn. People buying vegetables, fruits, bread, cheese. Vendor stalls with colorful produce. Some shoppers carrying baskets.',
    prompt: 'Décrivez ce marché pendant 60 secondes. Parlez de : qui est là, ce qu\'on y vend, l\'atmosphère, la saison.',
    promptEn: 'Describe this market for 60 seconds. Talk about: who is there, what is being sold, the atmosphere, the season.',
    targetWords: 50,
    targetTime: 60,
    keywords: ['marché', 'légumes', 'fruits', 'pain', 'fromage', 'automne', 'vendeurs', 'clients', 'panier', 'frais', 'coloré'],
  },
  qa1: {
    type: 'qa',
    title: 'Q&A — Routine quotidienne',
    level: 'CLB 4-5',
    questions: [
      { q: 'Bonjour ! À quelle heure vous réveillez-vous le matin ?', qEn: "Hello! What time do you wake up in the morning?", hint: 'Use présent. "Je me réveille à..."', minWords: 8 },
      { q: 'Que faites-vous pour le petit-déjeuner ?', qEn: "What do you have for breakfast?", hint: 'Use présent. Liste des aliments.', minWords: 10 },
      { q: 'Comment allez-vous au travail ou à l\'école ?', qEn: "How do you get to work or school?", hint: 'Mention transport: voiture, métro, à pied...', minWords: 8 },
      { q: 'Que faites-vous pour vous détendre le soir ?', qEn: "What do you do to relax in the evening?", hint: 'Use présent: regarder, lire, écouter, etc.', minWords: 10 },
    ],
  },
  qa2: {
    type: 'qa',
    title: 'Q&A — Vos vacances',
    level: 'CLB 5-6',
    questions: [
      { q: 'Décrivez vos dernières vacances. Où êtes-vous allé(e) ?', qEn: "Describe your last vacation. Where did you go?", hint: 'Use passé composé. "Je suis allé(e) à..."', minWords: 15 },
      { q: 'Qu\'avez-vous fait pendant ces vacances ?', qEn: "What did you do during the vacation?", hint: 'Liste d\'activités au passé composé.', minWords: 20 },
      { q: 'Avec qui avez-vous voyagé ?', qEn: "Who did you travel with?", hint: 'Famille, amis, seul(e)?', minWords: 8 },
      { q: 'Quel est votre meilleur souvenir ?', qEn: "What is your best memory from it?", hint: 'Use passé composé pour l\'événement.', minWords: 15 },
    ],
  },
  qa3: {
    type: 'qa',
    title: 'Q&A — Plans pour l\'avenir',
    level: 'CLB 6',
    questions: [
      { q: 'Que comptez-vous faire l\'année prochaine ?', qEn: "What do you plan to do next year?", hint: 'Use futur proche ou futur simple.', minWords: 15 },
      { q: 'Si vous pouviez vivre dans n\'importe quel pays, lequel choisiriez-vous et pourquoi ?', qEn: "If you could live in any country, which one would you choose and why?", hint: 'Use conditionnel: je vivrais, j\'aimerais.', minWords: 20 },
      { q: 'Quel métier rêvez-vous d\'exercer ?', qEn: "What profession do you dream of doing?", hint: 'Use conditionnel + raisons.', minWords: 15 },
      { q: 'Comment pensez-vous améliorer votre français ?', qEn: "How do you plan to improve your French?", hint: 'Liste de stratégies futures.', minWords: 15 },
    ],
  },
  role1: {
    type: 'role',
    title: 'Role-play — À la pharmacie',
    level: 'CLB 5',
    scenario: 'You are at a Montreal pharmacy. You have a headache and a sore throat. Ask the pharmacist for advice.',
    turns: [
      { other: 'Bonjour ! Comment puis-je vous aider ?', otherEn: "Hello! How can I help you?", hint: 'Greet, describe your symptoms', minWords: 12 },
      { other: 'Depuis combien de temps avez-vous ces symptômes ?', otherEn: "How long have you had these symptoms?", hint: 'How long?', minWords: 6 },
      { other: 'Avez-vous de la fièvre ?', otherEn: "Do you have a fever?", hint: 'Yes/no + temperature if relevant', minWords: 6 },
      { other: 'Je vous recommande cet acétaminophène et ces pastilles. Avez-vous des allergies ?', otherEn: "I'd recommend this acetaminophen and these lozenges. Do you have any allergies?", hint: 'Allergies? Ask total cost', minWords: 8 },
      { other: 'Cela fait quinze dollars cinquante. Voulez-vous payer comptant ou par carte ?', otherEn: "That's fifteen dollars fifty. Would you like to pay cash or card?", hint: 'Payment method + thank you', minWords: 5 },
    ],
  },
  role2: {
    type: 'role',
    title: 'Role-play — Annuler un rendez-vous',
    level: 'CLB 5-6',
    scenario: 'You have a dental appointment tomorrow but you must cancel and reschedule. Call the clinic.',
    turns: [
      { other: 'Clinique dentaire Belmont, bonjour.', otherEn: "Belmont Dental Clinic, hello.", hint: 'Greet, give your name, mention you have a RDV tomorrow', minWords: 12 },
      { other: 'Un instant, je trouve votre dossier... Oui, vous êtes avec docteur Roy à 10 h. Que se passe-t-il ?', otherEn: "One moment, I'm finding your file... Yes, you're with Doctor Roy at 10 a.m. What's the matter?", hint: 'Explain why you must cancel (work, illness, etc.)', minWords: 10 },
      { other: 'Pas de problème. Voulez-vous reprendre un autre rendez-vous ?', otherEn: "No problem. Would you like to book another appointment?", hint: 'Yes, propose a date or ask availability', minWords: 8 },
      { other: 'Le docteur Roy a une disponibilité jeudi prochain à 14 h. Cela vous convient ?', otherEn: "Doctor Roy has an opening next Thursday at 2 p.m. Does that work for you?", hint: 'Accept or propose another time', minWords: 6 },
      { other: 'Parfait. Je vous envoie un rappel par texto la veille. Bonne journée !', otherEn: "Perfect. I'll send you a text reminder the day before. Have a good day!", hint: 'Thank + farewell', minWords: 5 },
    ],
  },
  role3: {
    type: 'role',
    title: 'CLB 6 Mock — Plainte au service client',
    level: 'CLB 6',
    scenario: 'You ordered a product online that arrived damaged. Call customer service to complain and request a refund or replacement.',
    turns: [
      { other: 'Service à la clientèle, bonjour. Que puis-je faire pour vous ?', otherEn: "Customer service, hello. How can I help you?", hint: 'Explain problem: order, damage', minWords: 15 },
      { other: 'Je suis désolé d\'apprendre cela. Avez-vous votre numéro de commande ?', otherEn: "I'm sorry to hear that. Do you have your order number?", hint: 'Give a fake order number, e.g. "ABC-12345"', minWords: 4 },
      { other: 'Merci. Pouvez-vous décrire les dommages plus précisément ?', otherEn: "Thank you. Could you describe the damage in more detail?", hint: 'Describe damage in detail', minWords: 15 },
      { other: 'Nous pouvons vous offrir un remplacement ou un remboursement complet. Que préférez-vous ?', otherEn: "We can offer you a replacement or a full refund. Which would you prefer?", hint: 'Pick one, justify briefly', minWords: 10 },
      { other: 'Très bien. Le remboursement sera traité en cinq à sept jours ouvrables. Autre chose ?', otherEn: "Very well. The refund will be processed in five to seven business days. Anything else?", hint: 'Ask follow-up: confirmation email? Return process?', minWords: 12 },
      { other: 'Bien sûr. Vous recevrez un courriel avec les détails. Merci pour votre patience.', otherEn: "Of course. You'll receive an email with the details. Thank you for your patience.", hint: 'Thank + close politely', minWords: 8 },
    ],
  },
};
