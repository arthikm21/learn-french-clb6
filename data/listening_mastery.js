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
];

// Speed defaults per level — matches the masterplan progression
window.LISTENING_LEVEL_SPEED = {
  Foundation: 0.7,
  A1: 0.85,
  A2: 1.0,
  B1: 1.1,
};
