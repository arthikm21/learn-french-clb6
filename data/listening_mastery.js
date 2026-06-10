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
//
// `audioEn` is the English translation of `audio` — shown to learners after they
// answer so they confirm what they heard. Toggled by Settings.isShowGloss().

window.LISTENING_MASTERY = [
  // ─────────────── MEDICAL ───────────────
  {
    id: 'med-1', type: 'A', category: 'Medical', level: 'Foundation',
    audio: "Le médecin peut vous voir demain matin à dix heures.",
    audioEn: "The doctor can see you tomorrow morning at ten.",
    prompt: 'When can the doctor see you?',
    opts: ['Today afternoon', 'Tomorrow morning at 10', 'Tomorrow afternoon', 'In 2 days'], a: 1,
  },
  {
    id: 'med-2', type: 'B', category: 'Medical', level: 'A1',
    audio: "J'ai mal à la tête depuis trois jours.",
    audioEn: "My head has been hurting for three days.",
    prompt: 'Fill in the blank — what part of the body hurts?',
    blank: "J'ai mal à la ___ depuis trois jours.",
    opts: ['tête', 'gorge', 'jambe', 'main'], a: 0,
  },
  {
    id: 'med-3', type: 'D', category: 'Medical', level: 'A2',
    audio: "Excusez-moi, je voudrais prendre rendez-vous avec le docteur Tremblay, s'il vous plaît.",
    audioEn: "Excuse me, I'd like to make an appointment with Dr. Tremblay, please.",
    prompt: 'What is the speaker trying to do?',
    opts: ['Cancel an appointment', 'Make an appointment', 'Complain', 'Reschedule'], a: 1,
    why: '"Je voudrais prendre rendez-vous" = "I would like to make an appointment."',
  },

  // ─────────────── HOUSING ───────────────
  {
    id: 'hou-1', type: 'A', category: 'Housing', level: 'Foundation',
    audio: "L'appartement est libre à partir du premier juillet.",
    audioEn: "The apartment is free starting July 1st.",
    prompt: 'When is the apartment available?',
    opts: ['Right now', 'Next week', 'July 1st', 'August 1st'], a: 2,
  },
  {
    id: 'hou-2', type: 'B', category: 'Housing', level: 'A1',
    audio: "Le loyer est de mille cent dollars par mois.",
    audioEn: "The rent is one thousand one hundred dollars per month.",
    prompt: 'How much is the rent?',
    blank: "Le loyer est de ___ dollars par mois.",
    opts: ['900', '1 000', '1 100', '1 300'], a: 2,
  },
  {
    id: 'hou-3', type: 'E', category: 'Housing', level: 'A2',
    audio: "Allô, je vous appelle pour l'annonce sur Kijiji. Est-ce que l'appartement est encore disponible et combien coûte le loyer ?",
    audioEn: "Hello, I'm calling about the Kijiji listing. Is the apartment still available and how much is the rent?",
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
    audioEn: "To go to McGill, take the green line, direction Angrignon.",
    prompt: 'Which line goes to McGill?',
    opts: ['Orange', 'Yellow', 'Green', 'Blue'], a: 2,
  },
  {
    id: 'tra-2', type: 'D', category: 'Transit', level: 'A1',
    audio: "Excusez-moi, je suis perdu. Je cherche la station Berri-UQAM.",
    audioEn: "Excuse me, I'm lost. I'm looking for Berri-UQAM station.",
    prompt: 'What is the speaker doing?',
    opts: ['Giving directions', 'Asking for directions', 'Complaining', 'Selling tickets'], a: 1,
    why: '"Je suis perdu" = "I am lost." Plus "je cherche…" = "I\'m looking for…"',
  },
  {
    id: 'tra-3', type: 'C', category: 'Transit', level: 'A2',
    audio: "Bonjour, excusez-moi. Je cherche la station Place-des-Arts. C'est quelle direction ? Merci beaucoup.",
    audioEn: "Hello, excuse me. I'm looking for Place-des-Arts station. Which direction is it? Thank you very much.",
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
    audioEn: "That comes to forty-seven dollars and fifty cents.",
    prompt: 'What is the total?',
    opts: ['$37.50', '$47.50', '$57.50', '$67.50'], a: 1,
  },
  {
    id: 'sho-2', type: 'B', category: 'Shopping', level: 'A1',
    audio: "Vous avez besoin d'un sac ?",
    audioEn: "Do you need a bag?",
    prompt: 'What is the cashier offering?',
    blank: "Vous avez besoin d'un ___ ?",
    opts: ['reçu', 'sac', 'café', 'panier'], a: 1,
  },
  {
    id: 'sho-3', type: 'D', category: 'Shopping', level: 'A2',
    audio: "Non merci, je n'ai pas de carte de fidélité.",
    audioEn: "No thanks, I don't have a loyalty card.",
    prompt: 'What is the customer saying?',
    opts: ['They want a loyalty card', "They don't have a loyalty card", 'They lost their card', 'They forgot their card'], a: 1,
    why: '"Je n\'ai pas de…" = "I don\'t have any…" — using en/de after negation.',
  },

  // ─────────────── WORK ───────────────
  {
    id: 'wor-1', type: 'A', category: 'Work', level: 'A1',
    audio: "Je travaille comme développeur dans une entreprise francophone.",
    audioEn: "I work as a developer in a French-speaking company.",
    prompt: 'What is the speaker\'s job?',
    opts: ['Designer', 'Developer', 'Manager', 'Translator'], a: 1,
  },
  {
    id: 'wor-2', type: 'E', category: 'Work', level: 'A2',
    audio: "Je m'appelle Marie, j'ai trente ans, je viens du Brésil et je suis au Canada depuis deux ans. Je cherche un poste en marketing.",
    audioEn: "My name is Marie, I'm thirty, I'm from Brazil and I've been in Canada for two years. I'm looking for a position in marketing.",
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
    audioEn: "Thank you for this opportunity, but after reflection, I prefer to decline.",
    prompt: 'What is the speaker doing?',
    opts: ['Accepting an offer', 'Politely declining an offer', 'Asking for more time', 'Negotiating salary'], a: 1,
    why: '"Décliner" = to politely decline. The "je vous remercie… mais" structure is the classic polite no.',
  },

  // ─────────────── BANKING ───────────────
  {
    id: 'ban-1', type: 'A', category: 'Banking', level: 'A1',
    audio: "Pour ouvrir un compte, j'ai besoin de deux pièces d'identité.",
    audioEn: "To open an account, I need two pieces of ID.",
    prompt: 'How many pieces of ID does the bank need?',
    opts: ['One', 'Two', 'Three', 'Four'], a: 1,
  },
  {
    id: 'ban-2', type: 'B', category: 'Banking', level: 'A2',
    audio: "Voulez-vous payer par débit ou par crédit ?",
    audioEn: "Would you like to pay by debit or by credit?",
    prompt: 'What two payment methods are being offered?',
    blank: "Voulez-vous payer par ___ ou par crédit ?",
    opts: ['comptant', 'débit', 'chèque', 'virement'], a: 1,
  },

  // ─────────────── EMERGENCY ───────────────
  {
    id: 'eme-1', type: 'D', category: 'Emergency', level: 'A2',
    audio: "Il y a eu un accident sur la rue Sainte-Catherine. Une personne est blessée.",
    audioEn: "There's been an accident on rue Sainte-Catherine. One person is injured.",
    prompt: 'What is the speaker reporting?',
    opts: ['A power outage', 'A car accident with an injury', 'A robbery', 'A fire'], a: 1,
    why: '"Il y a eu un accident" + "une personne est blessée" — past event + injury.',
  },

  // ─────────────── RESTAURANT ───────────────
  {
    id: 'res-1', type: 'A', category: 'Restaurant', level: 'Foundation',
    audio: "Le plat du jour est le saumon grillé avec des légumes.",
    audioEn: "Today's special is grilled salmon with vegetables.",
    prompt: "What's the dish of the day?",
    opts: ['Grilled chicken with rice', 'Grilled salmon with vegetables', 'Beef stew', 'Vegetable soup'], a: 1,
  },
  {
    id: 'res-2', type: 'B', category: 'Restaurant', level: 'A1',
    audio: "Vous voulez de l'eau plate ou pétillante ?",
    audioEn: "Would you like still or sparkling water?",
    prompt: 'Fill the blank — what type of water?',
    blank: "Vous voulez de l'eau plate ou ___ ?",
    opts: ['froide', 'pétillante', 'chaude', 'minérale'], a: 1,
  },
  {
    id: 'res-3', type: 'E', category: 'Restaurant', level: 'A2',
    audio: "Excusez-moi, mon steak est trop cuit. Est-ce que je peux en avoir un autre, s'il vous plaît ?",
    audioEn: "Excuse me, my steak is overcooked. Can I have another one, please?",
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
    audioEn: "I'm sorry, we don't have any more sugar pie tonight.",
    prompt: 'What is the server saying?',
    opts: ['Recommending the sugar pie', 'Apologizing — they\'re out of sugar pie', 'Offering free dessert', 'Asking about allergies'], a: 1,
    why: '"Nous n\'avons plus de…" = "We don\'t have any more…" Server is out of stock.',
  },

  // ─────────────── CUSTOMER SERVICE ───────────────
  {
    id: 'cs-1', type: 'A', category: 'Customer Service', level: 'A1',
    audio: "Votre commande arrivera dans cinq à sept jours ouvrables.",
    audioEn: "Your order will arrive in five to seven business days.",
    prompt: 'When will the order arrive?',
    opts: ['Tomorrow', '2-3 business days', '5-7 business days', '2 weeks'], a: 2,
  },
  {
    id: 'cs-2', type: 'B', category: 'Customer Service', level: 'A2',
    audio: "J'ai besoin de votre numéro de commande, s'il vous plaît.",
    audioEn: "I need your order number, please.",
    prompt: 'What does the agent need?',
    blank: "J'ai besoin de votre ___ de commande, s'il vous plaît.",
    opts: ['nom', 'numéro', 'adresse', 'date'], a: 1,
  },
  {
    id: 'cs-3', type: 'D', category: 'Customer Service', level: 'B1',
    audio: "Je comprends votre frustration. Laissez-moi parler à mon responsable et je vous rappelle dans dix minutes.",
    audioEn: "I understand your frustration. Let me talk to my manager and I'll call you back in ten minutes.",
    prompt: 'What is the agent doing?',
    opts: ['Refusing the request', 'Escalating + promising a callback', 'Transferring the call', 'Ending the call'], a: 1,
    why: '"Laissez-moi parler à mon responsable" + "je vous rappelle" — escalation with a callback commitment.',
  },

  // ─────────────── MEDICAL (Pharmacy) ───────────────
  {
    id: 'med-4', type: 'A', category: 'Medical', level: 'A1',
    audio: "Prenez un comprimé deux fois par jour, après les repas.",
    audioEn: "Take one tablet twice a day, after meals.",
    prompt: 'How often should the medication be taken?',
    opts: ['Once a day', 'Twice a day after meals', 'Every 4 hours', 'Only at night'], a: 1,
  },
  {
    id: 'med-5', type: 'E', category: 'Medical', level: 'A2',
    audio: "Si la douleur persiste après trois jours, revenez me voir ou appelez votre médecin de famille.",
    audioEn: "If the pain persists after three days, come back to see me or call your family doctor.",
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
    audioEn: "Your internet installation is scheduled Thursday between 9 am and noon.",
    prompt: 'When is the installation?',
    opts: ['Today afternoon', 'Tomorrow morning', 'Thursday 9am-12pm', 'Friday all day'], a: 2,
  },
  {
    id: 'tech-2', type: 'B', category: 'Technology', level: 'A2',
    audio: "Pour activer votre service, composez le code étoile-cent-vingt-deux.",
    audioEn: "To activate your service, dial the code star-one-hundred-twenty-two.",
    prompt: 'What code activates the service?',
    blank: "Pour activer votre service, composez le code ___.",
    opts: ['étoile-100', 'étoile-122', 'dièse-100', 'dièse-200'], a: 1,
  },
  {
    id: 'tech-3', type: 'D', category: 'Technology', level: 'A2',
    audio: "Je suis vraiment désolé, mais nous avons une panne dans votre secteur. Le service devrait être rétabli avant minuit.",
    audioEn: "I'm really sorry, but we have an outage in your area. Service should be restored before midnight.",
    prompt: 'What is the agent telling the customer?',
    opts: ['Service is upgraded', 'There\'s an outage; fix by midnight', 'Bill is being adjusted', 'New plan available'], a: 1,
    why: '"Une panne" = an outage. "Rétabli" = restored. Outage notification with ETA.',
  },

  // ─────────────── DAILY CONVERSATIONS ───────────────
  {
    id: 'day-1', type: 'A', category: 'Daily', level: 'Foundation',
    audio: "On se voit demain à dix heures devant le café ?",
    audioEn: "See you tomorrow at 10 in front of the café?",
    prompt: 'When and where to meet?',
    opts: ['Today at 10am at the office', 'Tomorrow at 10am in front of the café', 'Tomorrow at noon at the metro', 'Next week at the park'], a: 1,
  },
  {
    id: 'day-2', type: 'C', category: 'Daily', level: 'A1',
    audio: "Salut ! Comment ça va ? Ça fait longtemps qu'on s'est pas vus. Tu veux qu'on prenne un café ?",
    audioEn: "Hi! How are you? It's been a long time since we've seen each other. Want to grab a coffee?",
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
    audioEn: "I won't be able to come tonight, I already have something planned. Can we meet tomorrow instead?",
    prompt: 'Best summary:',
    opts: [
      'Confirming they will come tonight.',
      'Cancelling tonight, offering tomorrow instead.',
      'Inviting the person tonight.',
      'Asking what time tonight.',
    ], a: 1,
  },

  // ─────────────── GOVERNMENT ───────────────
  {
    id: 'gov-1', type: 'A', category: 'Government', level: 'A1',
    audio: "Votre demande a été acceptée. Vous recevrez votre carte par la poste dans dix jours ouvrables.",
    audioEn: "Your application has been accepted. You will receive your card by mail within ten business days.",
    prompt: 'What is the status of the application?',
    opts: ['Refused', 'Accepted', 'Under review', 'Incomplete'], a: 1,
  },
  {
    id: 'gov-2', type: 'B', category: 'Government', level: 'A2',
    audio: "N'oubliez pas d'apporter deux pièces d'identité à votre rendez-vous.",
    audioEn: "Don't forget to bring two pieces of ID to your appointment.",
    prompt: 'Fill in the blank — what must you bring?',
    blank: "N'oubliez pas d'apporter deux ___ d'identité à votre rendez-vous.",
    opts: ['pièces', 'cartes', 'photos', 'copies'], a: 0,
  },
  {
    id: 'gov-3', type: 'D', category: 'Government', level: 'A2',
    audio: "Je regrette, mais votre dossier est incomplet. Il manque votre preuve de résidence.",
    audioEn: "I'm sorry, but your file is incomplete. Your proof of residence is missing.",
    prompt: 'What is the agent doing?',
    opts: ['Approving the file', 'Explaining what document is missing', 'Asking for payment', 'Closing the office'], a: 1,
    why: '"Il manque…" = "… is missing." The agent identifies the missing document.',
  },
  {
    id: 'gov-4', type: 'E', category: 'Government', level: 'B1',
    audio: "Bonjour, je vous appelle au sujet de votre demande d'assurance maladie. Avant de continuer, nous avons besoin d'une copie de votre permis de travail. Vous pouvez la téléverser en ligne ou l'apporter à nos bureaux.",
    audioEn: "Hello, I'm calling about your health insurance application. Before continuing, we need a copy of your work permit. You can upload it online or bring it to our offices.",
    prompt: 'Best summary of the call:',
    opts: [
      'The health card is ready for pickup.',
      'A document is needed to continue the application — online or in person.',
      'The application was refused.',
      'The office is closing early today.',
    ], a: 1,
  },
  {
    id: 'gov-5', type: 'C', category: 'Government', level: 'B1',
    audio: "Bonjour, j'ai rendez-vous à dix heures. Voici ma confirmation. Est-ce que l'attente est longue ? Merci, je vais m'asseoir.",
    audioEn: "Hello, I have an appointment at ten. Here is my confirmation. Is the wait long? Thanks, I'll sit down.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonjour, j'ai rendez-vous à dix heures.",
      "Voici ma confirmation.",
      "Est-ce que l'attente est longue ?",
      "Merci, je vais m'asseoir.",
    ],
  },

  // ─────────────── SCHOOL ───────────────
  {
    id: 'sch-1', type: 'A', category: 'School', level: 'A1',
    audio: "L'école est fermée demain à cause de la tempête de neige.",
    audioEn: "School is closed tomorrow because of the snowstorm.",
    prompt: 'Why is the school closed?',
    opts: ['A holiday', 'A snowstorm', 'A strike', 'Renovations'], a: 1,
  },
  {
    id: 'sch-2', type: 'B', category: 'School', level: 'A2',
    audio: "La rencontre avec l'enseignante de votre fils aura lieu jeudi à seize heures.",
    audioEn: "The meeting with your son's teacher will take place Thursday at 4 p.m.",
    prompt: 'Fill in the blank — when is the meeting?',
    blank: "La rencontre avec l'enseignante aura lieu jeudi à ___ heures.",
    opts: ['quatorze', 'quinze', 'seize', 'dix-sept'], a: 2,
  },
  {
    id: 'sch-3', type: 'D', category: 'School', level: 'A2',
    audio: "Votre fille travaille très bien en mathématiques, mais elle devrait participer plus en classe.",
    audioEn: "Your daughter does very well in math, but she should participate more in class.",
    prompt: 'What is the teacher doing?',
    opts: ['Complaining about behaviour', 'Giving balanced feedback', 'Cancelling a class', 'Asking for homework'], a: 1,
    why: 'Compliment + "mais elle devrait…" = balanced feedback with one suggestion.',
  },
  {
    id: 'sch-4', type: 'E', category: 'School', level: 'B1',
    audio: "Chers parents, en raison de la journée pédagogique vendredi, il n'y aura pas de classe. Le service de garde reste ouvert, mais vous devez inscrire votre enfant avant mercredi.",
    audioEn: "Dear parents, due to the pedagogical day on Friday, there will be no class. The daycare service stays open, but you must register your child before Wednesday.",
    prompt: 'Best summary of the announcement:',
    opts: [
      'School is cancelled Friday; daycare is available if you register by Wednesday.',
      'School ends early on Wednesday.',
      'The daycare is closed Friday.',
      'Parents must come to school Friday.',
    ], a: 0,
  },

  // ─────────────── WEATHER ───────────────
  {
    id: 'wea-1', type: 'A', category: 'Weather', level: 'Foundation',
    audio: "Il va neiger cette nuit. On attend vingt centimètres de neige.",
    audioEn: "It's going to snow tonight. Twenty centimetres of snow are expected.",
    prompt: 'How much snow is expected?',
    opts: ['5 cm', '10 cm', '20 cm', '30 cm'], a: 2,
  },
  {
    id: 'wea-2', type: 'B', category: 'Weather', level: 'A1',
    audio: "Demain, il fera moins quinze degrés. Habillez-vous chaudement.",
    audioEn: "Tomorrow it will be minus fifteen degrees. Dress warmly.",
    prompt: 'Fill in the blank — what temperature?',
    blank: "Demain, il fera moins ___ degrés.",
    opts: ['cinq', 'dix', 'quinze', 'vingt'], a: 2,
  },
  {
    id: 'wea-3', type: 'D', category: 'Weather', level: 'A2',
    audio: "Attention, les routes sont glacées ce matin. Si possible, prenez les transports en commun.",
    audioEn: "Careful, the roads are icy this morning. If possible, take public transit.",
    prompt: 'What is the speaker doing?',
    opts: ['Giving a safety warning', 'Selling winter tires', 'Cancelling work', 'Describing a sunny day'], a: 0,
    why: '"Attention" + advice ("prenez les transports en commun") = a warning with a recommendation.',
  },
  {
    id: 'wea-4', type: 'E', category: 'Weather', level: 'B1',
    audio: "Environnement Canada a émis un avertissement de pluie verglaçante pour la région de Montréal. Les écoles restent ouvertes pour le moment, mais plusieurs vols sont retardés à l'aéroport.",
    audioEn: "Environment Canada has issued a freezing rain warning for the Montreal region. Schools remain open for now, but several flights are delayed at the airport.",
    prompt: 'Best summary of the report:',
    opts: [
      'All schools are closed because of snow.',
      'Freezing rain warning: schools open, some flights delayed.',
      'The airport is closed for the day.',
      'Sunny weather is coming to Montreal.',
    ], a: 1,
  },

  // ─────────────── PHONE / VOICEMAIL ───────────────
  {
    id: 'pho-1', type: 'A', category: 'Phone', level: 'A1',
    audio: "Vous avez rejoint le bureau du docteur Morin. Nos heures d'ouverture sont de neuf heures à dix-sept heures, du lundi au vendredi.",
    audioEn: "You have reached Dr. Morin's office. Our opening hours are 9 a.m. to 5 p.m., Monday to Friday.",
    prompt: 'What did you reach?',
    opts: ["A doctor's office voicemail", 'A pharmacy', 'A hospital emergency line', 'A dental clinic'], a: 0,
  },
  {
    id: 'pho-2', type: 'B', category: 'Phone', level: 'A2',
    audio: "Pour prendre rendez-vous, faites le un. Pour annuler, faites le deux. Pour parler à la réceptionniste, restez en ligne.",
    audioEn: "To book an appointment, press one. To cancel, press two. To speak to the receptionist, stay on the line.",
    prompt: 'Fill in the blank — to cancel:',
    blank: "Pour annuler, faites le ___.",
    opts: ['un', 'deux', 'trois', 'zéro'], a: 1,
  },
  {
    id: 'pho-3', type: 'D', category: 'Phone', level: 'B1',
    audio: "Bonjour, c'est Luc du garage Lachance. Votre voiture est prête, mais on a remarqué que les freins sont très usés. Rappelez-moi avant dix-sept heures si vous voulez qu'on les change aujourd'hui.",
    audioEn: "Hello, this is Luc from Garage Lachance. Your car is ready, but we noticed the brakes are very worn. Call me back before 5 p.m. if you want us to change them today.",
    prompt: 'Why is Luc calling?',
    opts: [
      'The car cannot be repaired',
      'The car is ready, plus a recommendation about the brakes',
      'To cancel the appointment',
      'To ask for payment',
    ], a: 1,
    why: 'Two messages: "votre voiture est prête" + a recommendation ("les freins sont très usés").',
  },
  {
    id: 'pho-4', type: 'E', category: 'Phone', level: 'B1',
    audio: "Bonjour madame Nguyen, c'est la pharmacie Jean Coutu. Votre prescription est renouvelée et prête à ramasser. Par contre, votre assurance ne couvre plus ce médicament au complet — il y aura douze dollars à payer. À bientôt.",
    audioEn: "Hello Ms. Nguyen, this is the Jean Coutu pharmacy. Your prescription is renewed and ready for pickup. However, your insurance no longer fully covers this medication — there will be twelve dollars to pay. See you soon.",
    prompt: 'Best summary of the voicemail:',
    opts: [
      'The prescription is not ready yet.',
      'The prescription is ready, but $12 is not covered by insurance.',
      'The insurance refused the prescription entirely.',
      'The pharmacy is closing.',
    ], a: 1,
  },

  // ─────────────── MEDICAL (more) ───────────────
  {
    id: 'med-6', type: 'B', category: 'Medical', level: 'A2',
    audio: "Prenez un comprimé deux fois par jour, avec de la nourriture.",
    audioEn: "Take one tablet twice a day, with food.",
    prompt: 'Fill in the blank — how often?',
    blank: "Prenez un comprimé ___ fois par jour, avec de la nourriture.",
    opts: ['une', 'deux', 'trois', 'quatre'], a: 1,
  },
  {
    id: 'med-7', type: 'C', category: 'Medical', level: 'B1',
    audio: "Bonjour, j'aimerais renouveler ma prescription. C'est pour mes médicaments contre l'asthme. Mon médecin est la docteure Roy. Merci de me rappeler.",
    audioEn: "Hello, I'd like to renew my prescription. It's for my asthma medication. My doctor is Dr. Roy. Please call me back.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonjour, j'aimerais renouveler ma prescription.",
      "C'est pour mes médicaments contre l'asthme.",
      "Mon médecin est la docteure Roy.",
      "Merci de me rappeler.",
    ],
  },
  {
    id: 'med-8', type: 'D', category: 'Medical', level: 'B1',
    audio: "Vos résultats sont normaux dans l'ensemble, mais votre taux de fer est un peu bas. Je vous conseille de manger plus de légumes verts et on refera une prise de sang dans trois mois.",
    audioEn: "Your results are normal overall, but your iron level is a bit low. I advise you to eat more green vegetables and we'll redo a blood test in three months.",
    prompt: 'What is the doctor communicating?',
    opts: [
      'Serious illness requiring hospital care',
      'Mostly good results with one minor issue and a follow-up plan',
      'The test must be redone tomorrow',
      'A prescription for iron pills',
    ], a: 1,
    why: '"Normaux dans l\'ensemble, mais…" — reassurance first, then one small concern + plan.',
  },

  // ─────────────── HOUSING (more) ───────────────
  {
    id: 'hou-4', type: 'D', category: 'Housing', level: 'A2',
    audio: "Je vous appelle parce que les voisins d'en haut font beaucoup de bruit tous les soirs après vingt-deux heures.",
    audioEn: "I'm calling because the upstairs neighbours make a lot of noise every night after 10 p.m.",
    prompt: 'What is the caller doing?',
    opts: ['Complaining about noise', 'Inviting neighbours to a party', 'Reporting a water leak', 'Asking to renew the lease'], a: 0,
    why: '"Je vous appelle parce que… font beaucoup de bruit" = a noise complaint.',
  },
  {
    id: 'hou-5', type: 'A', category: 'Housing', level: 'A2',
    audio: "Le concierge va venir réparer le robinet de la cuisine mercredi entre neuf heures et midi.",
    audioEn: "The caretaker will come to fix the kitchen tap on Wednesday between 9 a.m. and noon.",
    prompt: 'What will be repaired?',
    opts: ['The fridge', 'The kitchen tap', 'The heating', 'The front door'], a: 1,
  },
  {
    id: 'hou-6', type: 'E', category: 'Housing', level: 'B1',
    audio: "Cher locataire, veuillez noter que l'eau sera coupée lundi de huit heures à quatorze heures pour des travaux de plomberie dans l'immeuble. Nous nous excusons pour cet inconvénient.",
    audioEn: "Dear tenant, please note that the water will be cut off Monday from 8 a.m. to 2 p.m. for plumbing work in the building. We apologize for the inconvenience.",
    prompt: 'Best summary of the notice:',
    opts: [
      'Rent is increasing Monday.',
      'No water Monday 8 a.m.–2 p.m. due to plumbing work.',
      'The building is being evacuated.',
      'New tenants are moving in Monday.',
    ], a: 1,
  },

  // ─────────────── TRANSIT (more) ───────────────
  {
    id: 'tra-4', type: 'A', category: 'Transit', level: 'A2',
    audio: "En raison de travaux, la ligne orange est fermée entre Berri-UQAM et Jean-Talon ce week-end. Des navettes gratuites sont disponibles.",
    audioEn: "Due to construction, the orange line is closed between Berri-UQAM and Jean-Talon this weekend. Free shuttle buses are available.",
    prompt: 'What replaces the metro this weekend?',
    opts: ['Nothing', 'Free shuttle buses', 'Taxis', 'The green line'], a: 1,
  },
  {
    id: 'tra-5', type: 'D', category: 'Transit', level: 'B1',
    audio: "Mesdames et messieurs, le prochain train est retardé d'environ quinze minutes à cause d'une panne de signal. Nous vous remercions de votre patience.",
    audioEn: "Ladies and gentlemen, the next train is delayed by about fifteen minutes because of a signal failure. Thank you for your patience.",
    prompt: 'What is the announcement about?',
    opts: ['A station closure', 'A delay and its cause', 'A fare increase', 'A lost item'], a: 1,
    why: '"Retardé d\'environ quinze minutes à cause de…" = delay + reason.',
  },
  {
    id: 'tra-6', type: 'B', category: 'Transit', level: 'A2',
    audio: "Le passage mensuel coûte quatre-vingt-dix-sept dollars pour la zone A.",
    audioEn: "The monthly pass costs ninety-seven dollars for zone A.",
    prompt: 'Fill in the blank — the price:',
    blank: "Le passage mensuel coûte ___ dollars pour la zone A.",
    opts: ['soixante-dix-sept', 'quatre-vingt-sept', 'quatre-vingt-dix-sept', 'cent sept'], a: 2,
  },

  // ─────────────── WORK (more) ───────────────
  {
    id: 'wor-4', type: 'A', category: 'Work', level: 'A2',
    audio: "La réunion d'équipe est déplacée de lundi à mercredi, même heure, même salle.",
    audioEn: "The team meeting is moved from Monday to Wednesday, same time, same room.",
    prompt: 'What changed about the meeting?',
    opts: ['The room', 'The time', 'The day', 'It was cancelled'], a: 2,
  },
  {
    id: 'wor-5', type: 'B', category: 'Work', level: 'B1',
    audio: "Veuillez soumettre votre feuille de temps avant vendredi seize heures, sinon votre paie sera retardée.",
    audioEn: "Please submit your timesheet before Friday 4 p.m., otherwise your pay will be delayed.",
    prompt: 'Fill in the blank — what must you submit?',
    blank: "Veuillez soumettre votre ___ avant vendredi seize heures.",
    opts: ['feuille de temps', 'demande de congé', 'lettre de démission', 'adresse courriel'], a: 0,
  },
  {
    id: 'wor-6', type: 'C', category: 'Work', level: 'B1',
    audio: "Bonjour à tous. J'ai deux annonces ce matin. Premièrement, bienvenue à Fatima, notre nouvelle collègue. Deuxièmement, le stationnement sera fermé jeudi pour le déneigement.",
    audioEn: "Good morning everyone. I have two announcements this morning. First, welcome to Fatima, our new colleague. Second, the parking lot will be closed Thursday for snow removal.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonjour à tous.",
      "J'ai deux annonces ce matin.",
      "Premièrement, bienvenue à Fatima, notre nouvelle collègue.",
      "Deuxièmement, le stationnement sera fermé jeudi pour le déneigement.",
    ],
  },
  {
    id: 'wor-7', type: 'E', category: 'Work', level: 'B1',
    audio: "Bonjour Karim, c'est Julie des ressources humaines. Bonne nouvelle : votre période d'essai est terminée et nous confirmons votre poste permanent. Vous aurez aussi droit aux assurances collectives à partir du premier du mois. Félicitations !",
    audioEn: "Hello Karim, this is Julie from human resources. Good news: your probation period is over and we're confirming your permanent position. You'll also be entitled to group insurance starting the first of the month. Congratulations!",
    prompt: 'Best summary of the message:',
    opts: [
      'Karim is being let go after probation.',
      'Probation passed: permanent position confirmed + insurance starting soon.',
      'The probation period is extended.',
      'A meeting with HR is requested.',
    ], a: 1,
  },

  // ─────────────── BANKING (more) ───────────────
  {
    id: 'ban-3', type: 'A', category: 'Banking', level: 'A2',
    audio: "Votre nouvelle carte de débit arrivera par la poste d'ici cinq jours ouvrables. En attendant, vous pouvez payer avec votre téléphone.",
    audioEn: "Your new debit card will arrive by mail within five business days. In the meantime, you can pay with your phone.",
    prompt: 'How can you pay while waiting for the card?',
    opts: ['Cash only', 'With your phone', 'By cheque', 'You cannot pay'], a: 1,
  },
  {
    id: 'ban-4', type: 'D', category: 'Banking', level: 'B1',
    audio: "Nous avons remarqué une transaction inhabituelle de huit cents dollars sur votre carte hier soir. Si ce n'était pas vous, appuyez sur le neuf immédiatement.",
    audioEn: "We noticed an unusual transaction of eight hundred dollars on your card last night. If it wasn't you, press nine immediately.",
    prompt: 'What is the purpose of this call?',
    opts: ['Selling a credit card', 'A fraud alert asking you to confirm a transaction', 'A loan offer', 'Closing your account'], a: 1,
    why: '"Transaction inhabituelle" + "si ce n\'était pas vous" = a fraud verification call.',
  },
  {
    id: 'ban-5', type: 'B', category: 'Banking', level: 'B1',
    audio: "Les frais mensuels sont annulés si vous gardez un solde minimum de quatre mille dollars.",
    audioEn: "The monthly fees are waived if you keep a minimum balance of four thousand dollars.",
    prompt: 'Fill in the blank — the condition:',
    blank: "Les frais mensuels sont annulés si vous gardez un ___ minimum de quatre mille dollars.",
    opts: ['solde', 'prêt', 'dépôt', 'budget'], a: 0,
  },

  // ─────────────── SHOPPING (more) ───────────────
  {
    id: 'sho-4', type: 'A', category: 'Shopping', level: 'A2',
    audio: "Le magasin ferme dans quinze minutes. Veuillez vous diriger vers les caisses.",
    audioEn: "The store closes in fifteen minutes. Please make your way to the checkouts.",
    prompt: 'What should customers do?',
    opts: ['Leave immediately', 'Go to the checkouts', 'Wait at the entrance', 'Come back tomorrow'], a: 1,
  },
  {
    id: 'sho-5', type: 'E', category: 'Shopping', level: 'B1',
    audio: "Cette semaine seulement : deux pour un sur tous les produits laitiers, et vingt pour cent de rabais sur les fruits et légumes. Offre valable jusqu'à dimanche, avec la carte de membre.",
    audioEn: "This week only: two for one on all dairy products, and twenty percent off fruits and vegetables. Offer valid until Sunday, with the membership card.",
    prompt: 'Best summary of the ad:',
    opts: [
      'Dairy is 2-for-1 and produce 20% off until Sunday with the member card.',
      'Everything in the store is half price.',
      'The store is closing Sunday.',
      'Membership cards are on sale.',
    ], a: 0,
  },

  // ─────────────── RESTAURANT (more) ───────────────
  {
    id: 'res-5', type: 'C', category: 'Restaurant', level: 'A2',
    audio: "Bonsoir, une table pour deux, s'il vous plaît. Près de la fenêtre si possible. On a une réservation au nom de Tremblay. Merci beaucoup.",
    audioEn: "Good evening, a table for two, please. Near the window if possible. We have a reservation under the name Tremblay. Thank you very much.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonsoir, une table pour deux, s'il vous plaît.",
      "Près de la fenêtre si possible.",
      "On a une réservation au nom de Tremblay.",
      "Merci beaucoup.",
    ],
  },

  // ─────────────── DAILY (more) ───────────────
  {
    id: 'day-4', type: 'D', category: 'Daily', level: 'A2',
    audio: "Franchement, ce film m'a beaucoup déçu. L'histoire était prévisible et beaucoup trop longue.",
    audioEn: "Honestly, that movie really disappointed me. The story was predictable and way too long.",
    prompt: 'How does the speaker feel about the movie?',
    opts: ['Enthusiastic', 'Disappointed', 'Confused', 'Indifferent'], a: 1,
    why: '"M\'a beaucoup déçu" = "really disappointed me" — clear negative opinion.',
  },
  {
    id: 'day-5', type: 'B', category: 'Daily', level: 'A2',
    audio: "On se rejoint devant la bibliothèque à quatorze heures trente.",
    audioEn: "We'll meet in front of the library at 2:30 p.m.",
    prompt: 'Fill in the blank — where do you meet?',
    blank: "On se rejoint devant la ___ à quatorze heures trente.",
    opts: ['bibliothèque', 'banque', 'boulangerie', 'pharmacie'], a: 0,
  },

  // ─────────────── EMERGENCY (more) ───────────────
  {
    id: 'eme-2', type: 'A', category: 'Emergency', level: 'A2',
    audio: "En cas d'incendie, n'utilisez pas l'ascenseur. Prenez l'escalier de secours à votre droite.",
    audioEn: "In case of fire, do not use the elevator. Take the emergency stairs on your right.",
    prompt: 'What should you use in case of fire?',
    opts: ['The elevator', 'The emergency stairs', 'The window', 'The parking garage'], a: 1,
  },
  {
    id: 'eme-3', type: 'E', category: 'Emergency', level: 'B1',
    audio: "Ceci est un message de la Ville de Montréal. Un avis d'ébullition de l'eau est en vigueur pour votre secteur. Faites bouillir l'eau au moins une minute avant de la boire, jusqu'à nouvel ordre.",
    audioEn: "This is a message from the City of Montreal. A boil-water advisory is in effect for your area. Boil water for at least one minute before drinking it, until further notice.",
    prompt: 'Best summary of the alert:',
    opts: [
      'The water is cut off for repairs.',
      'Boil water before drinking until further notice.',
      'The water is safe to drink again.',
      'Water bills are increasing.',
    ], a: 1,
  },

  // ─────────────── TECHNOLOGY (more) ───────────────
  {
    id: 'tech-4', type: 'D', category: 'Technology', level: 'B1',
    audio: "Avant de raccrocher, est-ce que je peux vous demander de rester en ligne pour répondre à un court sondage sur la qualité du service ?",
    audioEn: "Before hanging up, may I ask you to stay on the line to answer a short survey about the quality of service?",
    prompt: 'What is the agent asking?',
    opts: ['To call back later', 'To stay for a satisfaction survey', 'To pay a bill', 'To confirm an address'], a: 1,
    why: '"Rester en ligne pour répondre à un court sondage" = stay on the line for a survey.',
  },
  {
    id: 'tech-5', type: 'B', category: 'Technology', level: 'A2',
    audio: "Redémarrez votre routeur et attendez deux minutes avant de le rallumer.",
    audioEn: "Restart your router and wait two minutes before turning it back on.",
    prompt: 'Fill in the blank — what should you restart?',
    blank: "Redémarrez votre ___ et attendez deux minutes.",
    opts: ['routeur', 'téléphone', 'ordinateur', 'téléviseur'], a: 0,
  },

  // ═══════════════ LONG-FORM (TCF-style, 4-6 sentences) ═══════════════
  {
    id: 'gov-6', type: 'E', category: 'Government', level: 'B1',
    audio: "Bonjour, ici le bureau d'Immigration Canada. Nous avons bien reçu votre demande de citoyenneté le quinze mars. Le délai de traitement actuel est d'environ douze mois. Vous recevrez d'abord une invitation à passer l'examen de citoyenneté, puis une convocation pour la cérémonie. Vous pouvez suivre l'état de votre dossier en ligne avec votre numéro de demande. Merci et bonne journée.",
    audioEn: "Hello, this is the Immigration Canada office. We received your citizenship application on March 15th. The current processing time is about twelve months. You will first receive an invitation to take the citizenship test, then a notice for the ceremony. You can track your file status online with your application number. Thank you and have a good day.",
    prompt: 'Best summary of this message:',
    opts: [
      'The citizenship application was refused.',
      'Application received; ~12-month wait; test first, then ceremony; track online.',
      'The citizenship test is tomorrow.',
      'A document is missing from the application.',
    ], a: 1,
  },
  {
    id: 'gov-7', type: 'D', category: 'Government', level: 'B1',
    audio: "Votre demande d'assurance emploi a été approuvée. Vous recevrez cinq cent quatre-vingts dollars par semaine pendant un maximum de trente-six semaines. Attention : vous devez déclarer vos heures toutes les deux semaines, sinon les paiements seront suspendus. La première déclaration doit être faite avant vendredi.",
    audioEn: "Your employment insurance application has been approved. You will receive five hundred and eighty dollars per week for a maximum of thirty-six weeks. Important: you must report your hours every two weeks, otherwise payments will be suspended. The first report must be made before Friday.",
    prompt: 'What must the listener do to keep receiving payments?',
    opts: ['Visit the office monthly', 'Report hours every two weeks', 'Call every Friday', 'Nothing — payments are automatic'], a: 1,
    why: '"Vous devez déclarer vos heures toutes les deux semaines, sinon… suspendus."',
  },
  {
    id: 'wea-5', type: 'E', category: 'Weather', level: 'B1',
    audio: "Voici les prévisions pour la région de Montréal. Aujourd'hui, ciel nuageux avec un maximum de moins huit degrés. En soirée, début des précipitations : de quinze à vingt centimètres de neige sont attendus pendant la nuit. Demain matin, les déplacements seront difficiles. Environnement Canada recommande d'éviter les routes secondaires et de prévoir plus de temps pour vos trajets.",
    audioEn: "Here is the forecast for the Montreal region. Today, cloudy skies with a high of minus eight. In the evening, precipitation begins: fifteen to twenty centimetres of snow are expected overnight. Tomorrow morning, travel will be difficult. Environment Canada recommends avoiding secondary roads and allowing extra time for your trips.",
    prompt: 'Best summary of the forecast:',
    opts: [
      'Sunny and mild today, rain tomorrow.',
      'Cloudy today; 15-20 cm of snow overnight; difficult travel tomorrow morning.',
      'A heat wave is coming this weekend.',
      'Snow has already ended; roads are clear.',
    ], a: 1,
  },
  {
    id: 'pho-5', type: 'E', category: 'Phone', level: 'B1',
    audio: "Bonjour monsieur Diallo, c'est Caroline de la clinique dentaire Sourire. Je vous appelle pour deux choses. Premièrement, votre rendez-vous de mardi prochain à quatorze heures est confirmé. Deuxièmement, notre dentiste vous rappelle qu'il faut arriver quinze minutes en avance pour mettre à jour votre dossier d'assurance. Si vous devez annuler, merci de nous aviser au moins vingt-quatre heures à l'avance, sinon des frais de cinquante dollars s'appliquent. À mardi !",
    audioEn: "Hello Mr. Diallo, this is Caroline from the Sourire dental clinic. I'm calling about two things. First, your appointment next Tuesday at 2 p.m. is confirmed. Second, our dentist reminds you to arrive fifteen minutes early to update your insurance file. If you need to cancel, please notify us at least twenty-four hours in advance, otherwise a fifty-dollar fee applies. See you Tuesday!",
    prompt: 'Best summary of this voicemail:',
    opts: [
      'The Tuesday appointment is cancelled.',
      'Appointment confirmed; arrive 15 min early; cancelling late costs $50.',
      'The clinic is moving to a new address.',
      'The insurance file is complete; nothing to do.',
    ], a: 1,
  },
  {
    id: 'pho-6', type: 'D', category: 'Phone', level: 'B1',
    audio: "Bonjour, c'est Marc Tremblay, le propriétaire du logement. J'ai bien reçu votre message au sujet du chauffage. Le réparateur passera jeudi entre neuf heures et midi. Si personne n'est à la maison, je peux ouvrir avec ma clé, mais j'ai besoin de votre autorisation écrite — un simple texto suffit. Rappelez-moi ou écrivez-moi avant mercredi soir, s'il vous plaît.",
    audioEn: "Hello, this is Marc Tremblay, the landlord. I got your message about the heating. The repairman will come Thursday between 9 and noon. If nobody is home, I can open with my key, but I need your written authorization — a simple text is enough. Call me back or write to me before Wednesday evening, please.",
    prompt: 'Why does the landlord need a reply before Wednesday evening?',
    opts: [
      'To cancel the repair',
      'To get written permission to enter if the tenant is absent',
      'To collect the rent',
      'To schedule a second visit',
    ], a: 1,
    why: '"J\'ai besoin de votre autorisation écrite… avant mercredi soir."',
  },
  {
    id: 'wor-8', type: 'E', category: 'Work', level: 'B1',
    audio: "Bonjour à toute l'équipe. Trois points rapides avant de commencer la semaine. D'abord, la réunion mensuelle est déplacée au jeudi à dix heures, parce que la salle est réservée mardi. Ensuite, n'oubliez pas de soumettre vos demandes de vacances d'été avant le premier mai. Enfin, bienvenue à Carlos, notre nouveau technicien — il commence aujourd'hui. Bonne semaine à tous !",
    audioEn: "Hello team. Three quick points before starting the week. First, the monthly meeting is moved to Thursday at 10, because the room is booked Tuesday. Next, don't forget to submit your summer vacation requests before May 1st. Finally, welcome to Carlos, our new technician — he starts today. Have a good week everyone!",
    prompt: 'Which is NOT one of the three announcements?',
    opts: [
      'The monthly meeting moved to Thursday',
      'Vacation requests due before May 1st',
      'A new technician starts today',
      'The office closes early Friday',
    ], a: 3,
  },
  {
    id: 'med-9', type: 'E', category: 'Medical', level: 'B1',
    audio: "Bonjour, ici la clinique sans rendez-vous du quartier Rosemont. Veuillez noter nos consignes. La clinique ouvre à huit heures, mais la file commence souvent avant sept heures. Apportez votre carte d'assurance maladie — sans elle, la consultation coûte cent vingt-cinq dollars. Les enfants de moins de cinq ans et les personnes âgées passent en priorité. Si vos symptômes sont graves, comme une douleur à la poitrine, rendez-vous directement à l'urgence.",
    audioEn: "Hello, this is the Rosemont walk-in clinic. Please note our guidelines. The clinic opens at 8, but the line often starts before 7. Bring your health insurance card — without it, the visit costs $125. Children under five and seniors get priority. If your symptoms are serious, like chest pain, go directly to the emergency room.",
    prompt: 'Best summary of the message:',
    opts: [
      'The clinic is closed today.',
      'Walk-in rules: opens at 8, bring health card ($125 without), kids/seniors priority, serious cases go to ER.',
      'Appointments are mandatory at this clinic.',
      'The clinic moved to a new neighbourhood.',
    ], a: 1,
  },
  {
    id: 'ban-6', type: 'D', category: 'Banking', level: 'B1',
    audio: "Bonjour, je vous appelle de votre caisse Desjardins. Rien d'urgent, mais nous avons remarqué que vous payez des frais mensuels de quinze dollars sur votre compte actuel. Avec votre profil, vous seriez admissible à un forfait étudiant gratuit jusqu'à la fin de vos études. Si ça vous intéresse, passez en succursale avec une preuve d'inscription à l'université, et le changement se fait en dix minutes.",
    audioEn: "Hello, I'm calling from your Desjardins branch. Nothing urgent, but we noticed you pay fifteen dollars in monthly fees on your current account. With your profile, you would be eligible for a free student plan until the end of your studies. If you're interested, come to the branch with proof of university enrollment, and the change takes ten minutes.",
    prompt: 'What is the purpose of this call?',
    opts: [
      'To warn about fraud',
      'To offer a free student plan that would remove the $15 monthly fee',
      'To close the account',
      'To collect an overdue payment',
    ], a: 1,
    why: 'The agent proposes a switch: "vous seriez admissible à un forfait étudiant gratuit".',
  },
  {
    id: 'tra-7', type: 'E', category: 'Transit', level: 'B1',
    audio: "Votre attention s'il vous plaît. En raison d'une intervention des services d'urgence à la station Lionel-Groulx, le service est interrompu sur la ligne verte entre Angrignon et Atwater. La reprise du service est prévue dans environ quarante-cinq minutes. Des autobus spéciaux sont en route, mais nous recommandons aux clients pressés d'utiliser la ligne orange. Merci de votre compréhension.",
    audioEn: "Your attention please. Due to an emergency services intervention at Lionel-Groulx station, service is interrupted on the green line between Angrignon and Atwater. Service is expected to resume in about forty-five minutes. Special buses are on the way, but we recommend that customers in a hurry use the orange line. Thank you for your understanding.",
    prompt: 'Best summary of the announcement:',
    opts: [
      'The whole metro network is closed for the day.',
      'Green line partly stopped ~45 min; shuttle buses coming; use orange line if in a hurry.',
      'The orange line is interrupted at Lionel-Groulx.',
      'Free rides are offered all day.',
    ], a: 1,
  },
  {
    id: 'sch-5', type: 'E', category: 'School', level: 'B1',
    audio: "Chers parents, voici trois rappels pour la semaine. Lundi, c'est la photo de classe — les élèves peuvent porter leurs vêtements préférés au lieu de l'uniforme. Mercredi, le cours d'éducation physique aura lieu dehors : prévoyez des vêtements chauds. Et vendredi, l'école termine à midi pour la formation des enseignants ; le service de garde reste ouvert jusqu'à dix-huit heures pour les enfants inscrits.",
    audioEn: "Dear parents, here are three reminders for the week. Monday is class photo day — students can wear their favourite clothes instead of the uniform. Wednesday, gym class will be outside: plan for warm clothes. And Friday, school ends at noon for teacher training; daycare stays open until 6 p.m. for registered children.",
    prompt: 'What happens Friday?',
    opts: [
      'School is fully closed',
      'School ends at noon; daycare open until 6 p.m. for registered kids',
      'The class photo is taken',
      'Gym class is outside',
    ], a: 1,
  },
  {
    id: 'cs-4', type: 'E', category: 'Customer Service', level: 'B1',
    audio: "Merci d'avoir appelé Vidéotron. Suite à votre plainte du trois novembre concernant les pannes répétées d'Internet, nous avons effectué une vérification de votre ligne. Un technicien a identifié un câble endommagé dans votre secteur, et la réparation est planifiée pour lundi prochain. En compensation, un crédit de quarante dollars sera appliqué à votre prochaine facture. Aucune action n'est requise de votre part.",
    audioEn: "Thank you for calling Videotron. Following your complaint of November 3rd about repeated internet outages, we checked your line. A technician identified a damaged cable in your area, and the repair is scheduled for next Monday. As compensation, a forty-dollar credit will be applied to your next bill. No action is required on your part.",
    prompt: 'Best summary:',
    opts: [
      'The customer must call back Monday.',
      'Cause found (damaged cable); repair Monday; $40 credit; nothing to do.',
      'The complaint was rejected.',
      'Internet service is being cancelled.',
    ], a: 1,
  },
  {
    id: 'day-6', type: 'E', category: 'Daily', level: 'B1',
    audio: "Salut Amina, c'est Sophie ! Je t'appelle pour samedi. Finalement, le pique-nique au parc est annulé parce qu'on annonce de la pluie toute la journée. À la place, on se retrouve chez Karim à treize heures pour un dîner-partage — chacun apporte un plat. Moi, j'apporte le dessert. Est-ce que tu peux apporter une salade ? Confirme-moi par texto. Bisous !",
    audioEn: "Hi Amina, it's Sophie! I'm calling about Saturday. In the end, the picnic at the park is cancelled because rain is forecast all day. Instead, we're meeting at Karim's at 1 p.m. for a potluck — everyone brings a dish. I'm bringing dessert. Can you bring a salad? Confirm by text. Kisses!",
    prompt: 'Best summary of the plan change:',
    opts: [
      'Picnic moved to Sunday at the park.',
      'Picnic cancelled (rain); potluck at Karim\'s at 1 p.m.; Amina asked to bring a salad.',
      'Sophie cancels everything for Saturday.',
      'Karim is bringing the dessert.',
    ], a: 1,
  },

  // ═══════════════ STANDARD CLIPS (Batch 3) ═══════════════
  {
    id: 'gov-8', type: 'B', category: 'Government', level: 'A2',
    audio: "Le bureau des passeports est ouvert du lundi au vendredi, de huit heures trente à seize heures.",
    audioEn: "The passport office is open Monday to Friday, from 8:30 a.m. to 4 p.m.",
    prompt: 'Fill in the blank — closing time:',
    blank: "Le bureau des passeports est ouvert de huit heures trente à ___ heures.",
    opts: ['quatorze', 'quinze', 'seize', 'dix-sept'], a: 2,
  },
  {
    id: 'gov-9', type: 'A', category: 'Government', level: 'A2',
    audio: "Pour renouveler votre carte d'assurance maladie, vous pouvez le faire en ligne si votre photo a moins de quatre ans.",
    audioEn: "To renew your health insurance card, you can do it online if your photo is less than four years old.",
    prompt: 'When can you renew online?',
    opts: ['Always', 'If the photo is less than 4 years old', 'Only in person', 'If you are under 40'], a: 1,
  },
  {
    id: 'sch-6', type: 'B', category: 'School', level: 'A2',
    audio: "Les cours de francisation commencent le sept janvier et ont lieu trois soirs par semaine.",
    audioEn: "The French-integration classes start January 7th and take place three evenings a week.",
    prompt: 'Fill in the blank — how often?',
    blank: "Les cours ont lieu ___ soirs par semaine.",
    opts: ['deux', 'trois', 'quatre', 'cinq'], a: 1,
  },
  {
    id: 'sch-7', type: 'D', category: 'School', level: 'B1',
    audio: "Je vous félicite — votre fils a fait d'énormes progrès en lecture ce trimestre. Continuez la lecture à la maison, ça donne des résultats.",
    audioEn: "Congratulations — your son has made huge progress in reading this term. Keep up the reading at home, it's producing results.",
    prompt: 'What is the teacher\'s message?',
    opts: ['A complaint about behaviour', 'Praise + encouragement to continue', 'A request for a meeting', 'A warning about grades'], a: 1,
    why: '"Je vous félicite… d\'énormes progrès" — positive feedback.',
  },
  {
    id: 'wea-6', type: 'A', category: 'Weather', level: 'A2',
    audio: "L'avertissement de chaleur est en vigueur jusqu'à jeudi. Buvez beaucoup d'eau et évitez le soleil entre midi et seize heures.",
    audioEn: "The heat warning is in effect until Thursday. Drink plenty of water and avoid the sun between noon and 4 p.m.",
    prompt: 'How long is the heat warning in effect?',
    opts: ['Until tonight', 'Until Tuesday', 'Until Thursday', 'All summer'], a: 2,
  },
  {
    id: 'pho-7', type: 'A', category: 'Phone', level: 'A1',
    audio: "Le bureau est actuellement fermé. Laissez un message après le bip avec votre nom et votre numéro.",
    audioEn: "The office is currently closed. Leave a message after the beep with your name and number.",
    prompt: 'What should you do?',
    opts: ['Call back at 9', 'Leave a message with name and number', 'Press zero', 'Send an email'], a: 1,
  },
  {
    id: 'pho-8', type: 'C', category: 'Phone', level: 'A2',
    audio: "Bonjour, c'est Léa Fortin. Je vous rappelle au sujet de l'entrevue. Je suis disponible jeudi après-midi. Merci de me confirmer l'heure.",
    audioEn: "Hello, this is Léa Fortin. I'm calling you back about the interview. I'm available Thursday afternoon. Please confirm the time.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonjour, c'est Léa Fortin.",
      "Je vous rappelle au sujet de l'entrevue.",
      "Je suis disponible jeudi après-midi.",
      "Merci de me confirmer l'heure.",
    ],
  },
  {
    id: 'med-10', type: 'A', category: 'Medical', level: 'A2',
    audio: "Votre rendez-vous avec la physiothérapeute est le douze février à neuf heures quinze.",
    audioEn: "Your appointment with the physiotherapist is February 12th at 9:15 a.m.",
    prompt: 'Who is the appointment with?',
    opts: ['A dentist', 'A physiotherapist', 'A pharmacist', 'An optometrist'], a: 1,
  },
  {
    id: 'med-11', type: 'B', category: 'Medical', level: 'B1',
    audio: "Ce médicament peut causer de la somnolence. Évitez de conduire après l'avoir pris.",
    audioEn: "This medication can cause drowsiness. Avoid driving after taking it.",
    prompt: 'Fill in the blank — the warning:',
    blank: "Ce médicament peut causer de la ___.",
    opts: ['somnolence', 'fièvre', 'toux', 'douleur'], a: 0,
  },
  {
    id: 'med-12', type: 'C', category: 'Medical', level: 'A2',
    audio: "Bonjour, je voudrais annuler mon rendez-vous de demain. J'ai un empêchement au travail. Est-ce qu'on peut le reporter à la semaine prochaine ? Merci beaucoup.",
    audioEn: "Hello, I'd like to cancel my appointment tomorrow. Something came up at work. Can we postpone it to next week? Thank you very much.",
    prompt: 'Reorder these lines so they match what you heard:',
    ordered: [
      "Bonjour, je voudrais annuler mon rendez-vous de demain.",
      "J'ai un empêchement au travail.",
      "Est-ce qu'on peut le reporter à la semaine prochaine ?",
      "Merci beaucoup.",
    ],
  },
  {
    id: 'hou-7', type: 'A', category: 'Housing', level: 'A2',
    audio: "Le déneigement du stationnement aura lieu cette nuit. Veuillez déplacer votre voiture avant vingt-trois heures.",
    audioEn: "Snow removal in the parking lot will happen tonight. Please move your car before 11 p.m.",
    prompt: 'What must residents do?',
    opts: ['Shovel their balcony', 'Move their car before 11 p.m.', 'Park in the street after midnight', 'Stay home tonight'], a: 1,
  },
  {
    id: 'hou-8', type: 'B', category: 'Housing', level: 'B1',
    audio: "L'augmentation de loyer proposée est de trois pour cent à partir du premier juillet.",
    audioEn: "The proposed rent increase is three percent starting July 1st.",
    prompt: 'Fill in the blank — the increase:',
    blank: "L'augmentation de loyer proposée est de ___ pour cent.",
    opts: ['deux', 'trois', 'cinq', 'dix'], a: 1,
  },
  {
    id: 'hou-9', type: 'D', category: 'Housing', level: 'B1',
    audio: "Je comprends votre frustration, mais le concierge était malade cette semaine. Je vous promets que la poubelle du sous-sol sera vidée demain matin au plus tard.",
    audioEn: "I understand your frustration, but the caretaker was sick this week. I promise the basement garbage will be emptied by tomorrow morning at the latest.",
    prompt: 'What is the speaker doing?',
    opts: ['Refusing to help', 'Apologizing, explaining, and promising a fix', 'Blaming the tenant', 'Raising the rent'], a: 1,
    why: 'Empathy + explanation + "je vous promets que…" = de-escalating a complaint.',
  },
  {
    id: 'tra-8', type: 'B', category: 'Transit', level: 'A1',
    audio: "Le prochain autobus passe dans sept minutes.",
    audioEn: "The next bus comes in seven minutes.",
    prompt: 'Fill in the blank:',
    blank: "Le prochain autobus passe dans ___ minutes.",
    opts: ['cinq', 'sept', 'dix', 'douze'], a: 1,
  },
  {
    id: 'tra-9', type: 'D', category: 'Transit', level: 'A2',
    audio: "Monsieur, votre titre de transport n'est plus valide. Il a expiré hier. Vous devez en acheter un nouveau à la borne.",
    audioEn: "Sir, your transit fare is no longer valid. It expired yesterday. You have to buy a new one at the terminal.",
    prompt: 'What is the inspector telling the passenger?',
    opts: ['He is on the wrong bus', 'His fare expired and he must buy a new one', 'The terminal is broken', 'He gets a free ride today'], a: 1,
  },
  {
    id: 'wor-9', type: 'A', category: 'Work', level: 'A2',
    audio: "La paie est déposée tous les deux jeudis, directement dans votre compte bancaire.",
    audioEn: "Pay is deposited every other Thursday, directly into your bank account.",
    prompt: 'When is payday?',
    opts: ['Every Friday', 'Every other Thursday', 'Monthly', 'Every Monday'], a: 1,
  },
  {
    id: 'wor-10', type: 'B', category: 'Work', level: 'B1',
    audio: "N'oubliez pas la réunion d'équipe obligatoire demain à neuf heures dans la grande salle de conférence.",
    audioEn: "Don't forget the mandatory team meeting tomorrow at 9 a.m. in the big conference room.",
    prompt: 'Fill in the blank — where?',
    blank: "La réunion aura lieu dans la grande ___ de conférence.",
    opts: ['salle', 'table', 'porte', 'tour'], a: 0,
  },
  {
    id: 'wor-11', type: 'D', category: 'Work', level: 'B1',
    audio: "Écoute, ton rapport est solide, mais il manque les chiffres du dernier trimestre. Tu peux les ajouter avant la présentation de vendredi ?",
    audioEn: "Listen, your report is solid, but it's missing last quarter's numbers. Can you add them before Friday's presentation?",
    prompt: 'What is the manager doing?',
    opts: ['Rejecting the report entirely', 'Praising it and requesting one addition', 'Cancelling the presentation', 'Asking for a new report'], a: 1,
    why: '"Solide, mais il manque…" — positive + one fix requested.',
  },
  {
    id: 'ban-7', type: 'A', category: 'Banking', level: 'A2',
    audio: "Votre virement de trois cents dollars a été envoyé. Le destinataire le recevra d'ici trente minutes.",
    audioEn: "Your three-hundred-dollar transfer has been sent. The recipient will receive it within thirty minutes.",
    prompt: 'How much was transferred?',
    opts: ['$30', '$130', '$300', '$330'], a: 2,
  },
  {
    id: 'ban-8', type: 'B', category: 'Banking', level: 'B1',
    audio: "Le taux d'intérêt de votre marge de crédit passe de huit à neuf pour cent le mois prochain.",
    audioEn: "The interest rate on your line of credit goes from eight to nine percent next month.",
    prompt: 'Fill in the blank — the new rate:',
    blank: "Le taux passe de huit à ___ pour cent.",
    opts: ['neuf', 'dix', 'sept', 'douze'], a: 0,
  },
  {
    id: 'sho-6', type: 'A', category: 'Shopping', level: 'A1',
    audio: "Les caisses libre-service sont à votre droite, près de la sortie.",
    audioEn: "The self-checkouts are on your right, near the exit.",
    prompt: 'Where are the self-checkouts?',
    opts: ['On the left, near the entrance', 'On the right, near the exit', 'Upstairs', 'At the back of the store'], a: 1,
  },
  {
    id: 'sho-7', type: 'D', category: 'Shopping', level: 'A2',
    audio: "Désolé, il ne nous en reste plus en magasin, mais je peux vous le commander. Vous l'aurez mercredi.",
    audioEn: "Sorry, we don't have any left in store, but I can order it for you. You'll have it Wednesday.",
    prompt: 'What is the employee offering?',
    opts: ['A refund', 'To order the item for Wednesday', 'A discount on another item', 'To check another store'], a: 1,
  },
  {
    id: 'sho-8', type: 'B', category: 'Shopping', level: 'A2',
    audio: "Avec votre carte de points, vous économisez douze dollars sur cet achat.",
    audioEn: "With your points card, you save twelve dollars on this purchase.",
    prompt: 'Fill in the blank:',
    blank: "Vous économisez ___ dollars sur cet achat.",
    opts: ['deux', 'dix', 'douze', 'vingt'], a: 2,
  },
  {
    id: 'res-6', type: 'A', category: 'Restaurant', level: 'A2',
    audio: "Le spécial du jour est la soupe à l'oignon avec un sandwich au poulet, pour quatorze dollars.",
    audioEn: "Today's special is onion soup with a chicken sandwich, for fourteen dollars.",
    prompt: 'What is today\'s special?',
    opts: ['Onion soup + chicken sandwich', 'Tomato soup + salad', 'Poutine + drink', 'Pasta + dessert'], a: 0,
  },
  {
    id: 'res-7', type: 'D', category: 'Restaurant', level: 'B1',
    audio: "Tout était délicieux, mais je pense qu'il y a une erreur sur la facture — on n'a pas commandé de deuxième bouteille d'eau.",
    audioEn: "Everything was delicious, but I think there's a mistake on the bill — we didn't order a second bottle of water.",
    prompt: 'What is the customer doing?',
    opts: ['Complaining about the food', 'Politely flagging a billing error', 'Asking for the menu', 'Leaving without paying'], a: 1,
    why: 'Compliment first, then "il y a une erreur sur la facture".',
  },
  {
    id: 'cs-5', type: 'A', category: 'Customer Service', level: 'A2',
    audio: "Votre temps d'attente est d'environ dix minutes. Vous pouvez aussi demander un rappel automatique sans perdre votre place.",
    audioEn: "Your wait time is about ten minutes. You can also request an automatic callback without losing your place.",
    prompt: 'What option avoids waiting on the line?',
    opts: ['Calling back tomorrow', 'An automatic callback', 'Pressing zero', 'Sending a letter'], a: 1,
  },
  {
    id: 'cs-6', type: 'B', category: 'Customer Service', level: 'B1',
    audio: "Votre numéro de dossier est le R comme Robert, deux, quatre, sept, neuf. Notez-le pour le suivi.",
    audioEn: "Your file number is R as in Robert, two, four, seven, nine. Write it down for follow-up.",
    prompt: 'Fill in the blank — the file number:',
    blank: "Votre numéro de dossier est le R-___.",
    opts: ['2479', '2497', '4279', '7942'], a: 0,
  },
  {
    id: 'tech-6', type: 'A', category: 'Technology', level: 'A2',
    audio: "Une mise à jour est disponible pour votre application. Elle corrige plusieurs problèmes de sécurité.",
    audioEn: "An update is available for your app. It fixes several security issues.",
    prompt: 'What does the update do?',
    opts: ['Adds new games', 'Fixes security issues', 'Changes the design', 'Deletes old files'], a: 1,
  },
  {
    id: 'tech-7', type: 'D', category: 'Technology', level: 'B1',
    audio: "Avant de remplacer votre appareil, essayons une dernière chose : sauvegardez vos données, puis faites une réinitialisation complète.",
    audioEn: "Before replacing your device, let's try one last thing: back up your data, then do a full reset.",
    prompt: 'What does the technician propose?',
    opts: ['An immediate replacement', 'A backup then a full reset as a last attempt', 'Buying a new device', 'Ignoring the problem'], a: 1,
  },
  {
    id: 'day-7', type: 'B', category: 'Daily', level: 'A1',
    audio: "La piscine municipale est gratuite le dimanche matin pour les familles.",
    audioEn: "The municipal pool is free on Sunday mornings for families.",
    prompt: 'Fill in the blank — when is it free?',
    blank: "La piscine est gratuite le ___ matin.",
    opts: ['samedi', 'dimanche', 'lundi', 'vendredi'], a: 1,
  },
  {
    id: 'day-8', type: 'D', category: 'Daily', level: 'A2',
    audio: "Franchement, je te recommande ce coiffeur. C'est un peu cher, mais le résultat vaut vraiment la peine.",
    audioEn: "Honestly, I recommend this hairdresser. It's a bit expensive, but the result is really worth it.",
    prompt: 'What is the speaker\'s opinion?',
    opts: ['Too expensive, avoid it', 'Expensive but worth it — recommended', 'Cheap but bad', 'No opinion'], a: 1,
  },
  {
    id: 'eme-4', type: 'A', category: 'Emergency', level: 'A2',
    audio: "Restez calme et donnez-moi votre adresse. Les ambulanciers sont déjà en route.",
    audioEn: "Stay calm and give me your address. The paramedics are already on the way.",
    prompt: 'What does the operator need?',
    opts: ['Your name only', 'Your address', 'Your insurance number', 'Your doctor\'s name'], a: 1,
  },
  {
    id: 'eme-5', type: 'B', category: 'Emergency', level: 'B1',
    audio: "En cas d'urgence, composez le neuf, un, un. Pour les services municipaux non urgents, composez le trois, un, un.",
    audioEn: "In an emergency, dial nine-one-one. For non-urgent municipal services, dial three-one-one.",
    prompt: 'Fill in the blank — non-urgent services:',
    blank: "Pour les services non urgents, composez le ___.",
    opts: ['211', '311', '411', '511'], a: 1,
  },
];

// Speed defaults per level — matches the masterplan progression
window.LISTENING_LEVEL_SPEED = {
  Foundation: 0.7,
  A1: 0.85,
  A2: 1.0,
  B1: 1.1,
};
