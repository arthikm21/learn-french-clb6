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
];

// Speed defaults per level — matches the masterplan progression
window.LISTENING_LEVEL_SPEED = {
  Foundation: 0.7,
  A1: 0.85,
  A2: 1.0,
  B1: 1.1,
};
