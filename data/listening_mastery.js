// Listening Mastery — short, focused clips with 5 exercise types.
//
// Built for TCF Canada immigrant prep. Categories mirror real Canadian life
// situations the masterplan calls out. Speed progression (0.7/0.85/1.0/1.1)
// is in the UI; level here just sets the default playback rate.
//
// Exercise types:
//   A — Listen + choose         : MC on what was said / what happens next
//   B — Fill missing word       : same sentence with one blank, pick the missing word
//   C — Reorder lines           : 3-4 jumbled lines from a mini-conversation
//   D — Identify speaker intent : MC on the speaker's purpose / tone
//   E — Best summary            : MC of 4 short summary options
//
// Speed defaults per level (masterplan):
//   Foundation 0.7  ·  A1 0.85  ·  A2 1.0  ·  B1 1.1

window.LISTENING_MASTERY = [
  // ─────────────── MEDICAL ───────────────
  {
    id: 'med-1', type: 'A', category: 'Medical', level: 'Foundation',
    audio: "Le médecin peut vous voir demain matin à dix heures.",
    prompt: 'When can the doctor see you?',
    opts: ['Today afternoon', 'Tomorrow morning at 10', 'Tomorrow afternoon', 'In 2 days'], a: 1,
  },
  {
    id: 'med-2', type: 'B', category: 'Medical', level: 'A1',
    audio: "J'ai mal à la tête depuis trois jours.",
    prompt: 'Fill in the blank — what part of the body hurts?',
    blank: "J'ai mal à la ___ depuis trois jours.",
    opts: ['tête', 'gorge', 'jambe', 'main'], a: 0,
  },
  {
    id: 'med-3', type: 'D', category: 'Medical', level: 'A2',
    audio: "Excusez-moi, je voudrais prendre rendez-vous avec le docteur Tremblay, s'il vous plaît.",
    prompt: 'What is the speaker trying to do?',
    opts: ['Cancel an appointment', 'Make an appointment', 'Complain', 'Reschedule'], a: 1,
    why: '"Je voudrais prendre rendez-vous" = "I would like to make an appointment."',
  },

  // ─────────────── HOUSING ───────────────
  {
    id: 'hou-1', type: 'A', category: 'Housing', level: 'Foundation',
    audio: "L'appartement est libre à partir du premier juillet.",
    prompt: 'When is the apartment available?',
    opts: ['Right now', 'Next week', 'July 1st', 'August 1st'], a: 2,
  },
  {
    id: 'hou-2', type: 'B', category: 'Housing', level: 'A1',
    audio: "Le loyer est de mille cent dollars par mois.",
    prompt: 'How much is the rent?',
    blank: "Le loyer est de ___ dollars par mois.",
    opts: ['900', '1 000', '1 100', '1 300'], a: 2,
  },
  {
    id: 'hou-3', type: 'E', category: 'Housing', level: 'A2',
    audio: "Allô, je vous appelle pour l'annonce sur Kijiji. Est-ce que l'appartement est encore disponible et combien coûte le loyer ?",
    prompt: 'Best summary of what the caller wants:',
    opts: [
      'They want to cancel an apartment viewing.',
      'They want to know if the apartment is available and the rent.',
      'They are complaining about the rent.',
      'They want to renew their lease.',
    ], a: 1,
  },

  // ─────────────── TRANSIT ───────────────
  {
    id: 'tra-1', type: 'A', category: 'Transit', level: 'Foundation',
    audio: "Pour aller à McGill, prenez la ligne verte direction Angrignon.",
    prompt: 'Which line goes to McGill?',
    opts: ['Orange', 'Yellow', 'Green', 'Blue'], a: 2,
  },
  {
    id: 'tra-2', type: 'D', category: 'Transit', level: 'A1',
    audio: "Excusez-moi, je suis perdu. Je cherche la station Berri-UQAM.",
    prompt: 'What is the speaker doing?',
    opts: ['Giving directions', 'Asking for directions', 'Complaining', 'Selling tickets'], a: 1,
    why: '"Je suis perdu" = "I am lost." Plus "je cherche…" = "I\'m looking for…"',
  },
  {
    id: 'tra-3', type: 'C', category: 'Transit', level: 'A2',
    audio: "Bonjour, excusez-moi. Je cherche la station Place-des-Arts. C'est quelle direction ? Merci beaucoup.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonjour, excusez-moi.",
      "Je cherche la station Place-des-Arts.",
      "C'est quelle direction ?",
      "Merci beaucoup.",
    ],
  },

  // ─────────────── SHOPPING ───────────────
  {
    id: 'sho-1', type: 'A', category: 'Shopping', level: 'Foundation',
    audio: "Ça fait quarante-sept dollars et cinquante.",
    prompt: 'What is the total?',
    opts: ['$37.50', '$47.50', '$57.50', '$67.50'], a: 1,
  },
  {
    id: 'sho-2', type: 'B', category: 'Shopping', level: 'A1',
    audio: "Vous avez besoin d'un sac ?",
    prompt: 'What is the cashier offering?',
    blank: "Vous avez besoin d'un ___ ?",
    opts: ['reçu', 'sac', 'café', 'panier'], a: 1,
  },
  {
    id: 'sho-3', type: 'D', category: 'Shopping', level: 'A2',
    audio: "Non merci, je n'ai pas de carte de fidélité.",
    prompt: 'What is the customer saying?',
    opts: ['They want a loyalty card', "They don't have a loyalty card", 'They lost their card', 'They forgot their card'], a: 1,
    why: '"Je n\'ai pas de…" = "I don\'t have any…" — using en/de after negation.',
  },

  // ─────────────── WORK ───────────────
  {
    id: 'wor-1', type: 'A', category: 'Work', level: 'A1',
    audio: "Je travaille comme développeur dans une entreprise francophone.",
    prompt: 'What is the speaker\'s job?',
    opts: ['Designer', 'Developer', 'Manager', 'Translator'], a: 1,
  },
  {
    id: 'wor-2', type: 'E', category: 'Work', level: 'A2',
    audio: "Je m'appelle Marie, j'ai trente ans, je viens du Brésil et je suis au Canada depuis deux ans. Je cherche un poste en marketing.",
    prompt: 'Best summary:',
    opts: [
      'Marie is offering a marketing job.',
      'Marie is a Brazilian who has been in Canada 2 years and is job-hunting in marketing.',
      'Marie is asking for help with her marketing class.',
      'Marie has worked at this company for 2 years.',
    ], a: 1,
  },
  {
    id: 'wor-3', type: 'D', category: 'Work', level: 'B1',
    audio: "Je vous remercie pour cette opportunité, mais après réflexion, je préfère décliner.",
    prompt: 'What is the speaker doing?',
    opts: ['Accepting an offer', 'Politely declining an offer', 'Asking for more time', 'Negotiating salary'], a: 1,
    why: '"Décliner" = to politely decline. The "je vous remercie… mais" structure is the classic polite no.',
  },

  // ─────────────── BANKING ───────────────
  {
    id: 'ban-1', type: 'A', category: 'Banking', level: 'A1',
    audio: "Pour ouvrir un compte, j'ai besoin de deux pièces d'identité.",
    prompt: 'How many pieces of ID does the bank need?',
    opts: ['One', 'Two', 'Three', 'Four'], a: 1,
  },
  {
    id: 'ban-2', type: 'B', category: 'Banking', level: 'A2',
    audio: "Voulez-vous payer par débit ou par crédit ?",
    prompt: 'What two payment methods are being offered?',
    blank: "Voulez-vous payer par ___ ou par crédit ?",
    opts: ['comptant', 'débit', 'chèque', 'virement'], a: 1,
  },

  // ─────────────── EMERGENCY ───────────────
  {
    id: 'eme-1', type: 'D', category: 'Emergency', level: 'A2',
    audio: "Il y a eu un accident sur la rue Sainte-Catherine. Une personne est blessée.",
    prompt: 'What is the speaker reporting?',
    opts: ['A power outage', 'A car accident with an injury', 'A robbery', 'A fire'], a: 1,
    why: '"Il y a eu un accident" + "une personne est blessée" — past event + injury.',
  },

  // ─────────────── RESTAURANT ───────────────
  {
    id: 'res-1', type: 'A', category: 'Restaurant', level: 'Foundation',
    audio: "Le plat du jour est le saumon grillé avec des légumes.",
    prompt: "What's the dish of the day?",
    opts: ['Grilled chicken with rice', 'Grilled salmon with vegetables', 'Beef stew', 'Vegetable soup'], a: 1,
  },
  {
    id: 'res-2', type: 'B', category: 'Restaurant', level: 'A1',
    audio: "Vous voulez de l'eau plate ou pétillante ?",
    prompt: 'Fill the blank — what type of water?',
    blank: "Vous voulez de l'eau plate ou ___ ?",
    opts: ['froide', 'pétillante', 'chaude', 'minérale'], a: 1,
  },
  {
    id: 'res-3', type: 'E', category: 'Restaurant', level: 'A2',
    audio: "Excusez-moi, mon steak est trop cuit. Est-ce que je peux en avoir un autre, s'il vous plaît ?",
    prompt: 'Best summary:',
    opts: [
      'The customer is asking for the bill.',
      'The customer is sending back overcooked steak.',
      'The customer is ordering a steak.',
      'The customer is complaining about the wait time.',
    ], a: 1,
  },
  {
    id: 'res-4', type: 'D', category: 'Restaurant', level: 'A2',
    audio: "Je suis désolée, nous n'avons plus de tarte au sucre ce soir.",
    prompt: 'What is the server saying?',
    opts: ['Recommending the sugar pie', 'Apologizing — they\'re out of sugar pie', 'Offering free dessert', 'Asking about allergies'], a: 1,
    why: '"Nous n\'avons plus de…" = "We don\'t have any more…" Server is out of stock.',
  },

  // ─────────────── CUSTOMER SERVICE ───────────────
  {
    id: 'cs-1', type: 'A', category: 'Customer Service', level: 'A1',
    audio: "Votre commande arrivera dans cinq à sept jours ouvrables.",
    prompt: 'When will the order arrive?',
    opts: ['Tomorrow', '2-3 business days', '5-7 business days', '2 weeks'], a: 2,
  },
  {
    id: 'cs-2', type: 'B', category: 'Customer Service', level: 'A2',
    audio: "J'ai besoin de votre numéro de commande, s'il vous plaît.",
    prompt: 'What does the agent need?',
    blank: "J'ai besoin de votre ___ de commande, s'il vous plaît.",
    opts: ['nom', 'numéro', 'adresse', 'date'], a: 1,
  },
  {
    id: 'cs-3', type: 'D', category: 'Customer Service', level: 'B1',
    audio: "Je comprends votre frustration. Laissez-moi parler à mon responsable et je vous rappelle dans dix minutes.",
    prompt: 'What is the agent doing?',
    opts: ['Refusing the request', 'Escalating + promising a callback', 'Transferring the call', 'Ending the call'], a: 1,
    why: '"Laissez-moi parler à mon responsable" + "je vous rappelle" — escalation with a callback commitment.',
  },

  // ─────────────── MEDICAL (Pharmacy) ───────────────
  {
    id: 'med-4', type: 'A', category: 'Medical', level: 'A1',
    audio: "Prenez un comprimé deux fois par jour, après les repas.",
    prompt: 'How often should the medication be taken?',
    opts: ['Once a day', 'Twice a day after meals', 'Every 4 hours', 'Only at night'], a: 1,
  },
  {
    id: 'med-5', type: 'E', category: 'Medical', level: 'A2',
    audio: "Si la douleur persiste après trois jours, revenez me voir ou appelez votre médecin de famille.",
    prompt: 'Best summary:',
    opts: [
      'Take the medication for 3 days minimum.',
      'If pain continues after 3 days, return or call your doctor.',
      'The treatment will last 3 weeks.',
      'Avoid pharmacies — see a doctor directly.',
    ], a: 1,
  },

  // ─────────────── TECHNOLOGY / PHONE ───────────────
  {
    id: 'tech-1', type: 'A', category: 'Technology', level: 'A1',
    audio: "Votre installation Internet est prévue jeudi entre neuf heures et midi.",
    prompt: 'When is the installation?',
    opts: ['Today afternoon', 'Tomorrow morning', 'Thursday 9am-12pm', 'Friday all day'], a: 2,
  },
  {
    id: 'tech-2', type: 'B', category: 'Technology', level: 'A2',
    audio: "Pour activer votre service, composez le code étoile-cent-vingt-deux.",
    prompt: 'What code activates the service?',
    blank: "Pour activer votre service, composez le code ___.",
    opts: ['étoile-100', 'étoile-122', 'dièse-100', 'dièse-200'], a: 1,
  },
  {
    id: 'tech-3', type: 'D', category: 'Technology', level: 'A2',
    audio: "Je suis vraiment désolé, mais nous avons une panne dans votre secteur. Le service devrait être rétabli avant minuit.",
    prompt: 'What is the agent telling the customer?',
    opts: ['Service is upgraded', 'There\'s an outage; fix by midnight', 'Bill is being adjusted', 'New plan available'], a: 1,
    why: '"Une panne" = an outage. "Rétabli" = restored. Outage notification with ETA.',
  },

  // ─────────────── DAILY CONVERSATIONS ───────────────
  {
    id: 'day-1', type: 'A', category: 'Daily', level: 'Foundation',
    audio: "On se voit demain à dix heures devant le café ?",
    prompt: 'When and where to meet?',
    opts: ['Today at 10am at the office', 'Tomorrow at 10am in front of the café', 'Tomorrow at noon at the metro', 'Next week at the park'], a: 1,
  },
  {
    id: 'day-2', type: 'C', category: 'Daily', level: 'A1',
    audio: "Salut ! Comment ça va ? Ça fait longtemps qu'on s'est pas vus. Tu veux qu'on prenne un café ?",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Salut !",
      "Comment ça va ?",
      "Ça fait longtemps qu'on s'est pas vus.",
      "Tu veux qu'on prenne un café ?",
    ],
  },
  {
    id: 'day-3', type: 'E', category: 'Daily', level: 'A2',
    audio: "Je ne pourrai pas venir ce soir, j'ai déjà quelque chose de prévu. On peut se voir demain à la place ?",
    prompt: 'Best summary:',
    opts: [
      'Confirming they will come tonight.',
      'Cancelling tonight, offering tomorrow instead.',
      'Inviting the person tonight.',
      'Asking what time tonight.',
    ], a: 1,
  },
];

// Speed defaults per level — matches the masterplan progression
window.LISTENING_LEVEL_SPEED = {
  Foundation: 0.7,
  A1: 0.85,
  A2: 1.0,
  B1: 1.1,
};
