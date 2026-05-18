window.LISTENING_TCF = {
  ltcf_01: {
    title: "Annonce dans le métro",
    level: "CLB 4",
    section: 1,
    transcript: "Mesdames et messieurs, en raison de travaux sur la ligne orange, le service est interrompu entre Berri-UQAM et Côte-Vertu. Empruntez les autobus de remplacement à la sortie sud. Le service reprendra demain matin à six heures.",
    questions: [
      { q: "Pourquoi le service est-il interrompu ?", opts: ["une panne", "des travaux", "un incendie", "la météo"], a: 1 },
      { q: "Quand le service reprendra-t-il ?", opts: ["ce soir", "demain à 6 h", "dans 2 jours", "lundi matin"], a: 1 },
      { q: "Quelle ligne est touchée ?", opts: ["la ligne verte", "la ligne orange", "la ligne bleue", "la ligne jaune"], a: 1 },
      { q: "Que doivent faire les voyageurs ?", opts: ["attendre", "rentrer chez eux", "prendre les autobus de remplacement", "appeler un taxi"], a: 2 },
    ],
  },

  ltcf_02: {
    title: "Message vocal d'un ami",
    level: "CLB 4",
    section: 1,
    transcript: "Salut Marc, c'est Julie. On se voit toujours samedi soir ? J'ai réservé une table au restaurant italien sur la rue Saint-Denis à 19 h. Rappelle-moi avant vendredi. Merci, à bientôt !",
    questions: [
      { q: "Qui laisse le message ?", opts: ["Marc", "Julie", "le restaurant", "un collègue"], a: 1 },
      { q: "Quel jour est prévue la sortie ?", opts: ["vendredi", "samedi", "dimanche", "lundi"], a: 1 },
      { q: "À quelle heure est la réservation ?", opts: ["18 h", "19 h", "20 h", "21 h"], a: 1 },
      { q: "Quel type de restaurant ?", opts: ["français", "chinois", "italien", "mexicain"], a: 2 },
    ],
  },

  ltcf_03: {
    title: "Commande au café",
    level: "CLB 4",
    section: 1,
    transcript: "Bonjour, je voudrais un café au lait moyen et un croissant aux amandes, s'il vous plaît. Pour emporter. Ça fait sept dollars cinquante. Vous payez comment ? Par carte, merci.",
    questions: [
      { q: "Que commande le client ?", opts: ["un thé et un muffin", "un café au lait et un croissant", "un chocolat chaud", "un jus d'orange"], a: 1 },
      { q: "Le client mange-t-il sur place ?", opts: ["oui", "non, pour emporter", "il hésite", "ce n'est pas dit"], a: 1 },
      { q: "Combien coûte la commande ?", opts: ["5,50 $", "6,50 $", "7,50 $", "8,50 $"], a: 2 },
      { q: "Comment paie-t-il ?", opts: ["en argent comptant", "par carte", "par chèque", "par téléphone"], a: 1 },
    ],
  },

  ltcf_04: {
    title: "Rendez-vous chez le médecin",
    level: "CLB 4",
    section: 1,
    transcript: "Bonjour, c'est la clinique Saint-Louis. Je confirme votre rendez-vous avec le docteur Tremblay mardi prochain à 10 h 30. N'oubliez pas votre carte d'assurance maladie. En cas d'empêchement, appelez-nous au 514-555-0143.",
    questions: [
      { q: "Quel jour est le rendez-vous ?", opts: ["lundi", "mardi", "mercredi", "jeudi"], a: 1 },
      { q: "À quelle heure ?", opts: ["10 h", "10 h 30", "11 h", "11 h 30"], a: 1 },
      { q: "Que faut-il apporter ?", opts: ["un passeport", "la carte d'assurance maladie", "un chèque", "une ordonnance"], a: 1 },
      { q: "Comment annuler ?", opts: ["par courriel", "par téléphone", "par texto", "en personne"], a: 1 },
    ],
  },

  ltcf_05: {
    title: "Bulletin météo",
    level: "CLB 4",
    section: 1,
    transcript: "Voici la météo pour Montréal. Ce matin, le ciel sera nuageux avec une température de moins cinq degrés. Cet après-midi, des averses de neige sont prévues. Ce soir, le mercure descendra jusqu'à moins douze.",
    questions: [
      { q: "Quelle est la ville mentionnée ?", opts: ["Québec", "Montréal", "Ottawa", "Toronto"], a: 1 },
      { q: "Quelle est la température du matin ?", opts: ["-2 °C", "-5 °C", "-8 °C", "-12 °C"], a: 1 },
      { q: "Que prévoit-on l'après-midi ?", opts: ["du soleil", "de la pluie", "des averses de neige", "du verglas"], a: 2 },
      { q: "Quelle température ce soir ?", opts: ["-5 °C", "-10 °C", "-12 °C", "-15 °C"], a: 2 },
    ],
  },

  ltcf_06: {
    title: "Annonce à l'école",
    level: "CLB 4",
    section: 1,
    transcript: "Chers élèves, en raison d'une tempête de neige, les cours sont annulés demain. L'école rouvrira mercredi. Consultez le site Web pour les détails. Bonne journée et soyez prudents.",
    questions: [
      { q: "Pourquoi les cours sont-ils annulés ?", opts: ["grève", "tempête de neige", "panne d'électricité", "fête nationale"], a: 1 },
      { q: "Quand l'école rouvre-t-elle ?", opts: ["mardi", "mercredi", "jeudi", "vendredi"], a: 1 },
      { q: "Où trouver les détails ?", opts: ["à la radio", "sur le site Web", "par téléphone", "à l'école"], a: 1 },
      { q: "À qui s'adresse l'annonce ?", opts: ["aux parents", "aux élèves", "aux profs", "au public"], a: 1 },
    ],
  },

  ltcf_07: {
    title: "Au dépanneur",
    level: "CLB 4",
    section: 1,
    transcript: "Bonjour, je cherche du lait deux pour cent et du pain tranché. Le lait est au fond à droite, le pain juste à côté. Merci. Voulez-vous un sac ? Non merci, j'ai le mien.",
    questions: [
      { q: "Où se passe la scène ?", opts: ["à la pharmacie", "au dépanneur", "à la banque", "au cinéma"], a: 1 },
      { q: "Que cherche le client ?", opts: ["du jus et du fromage", "du lait et du pain", "des œufs et du beurre", "du café et du sucre"], a: 1 },
      { q: "Où se trouve le lait ?", opts: ["à l'entrée", "au fond à droite", "à la caisse", "au comptoir"], a: 1 },
      { q: "Prend-il un sac ?", opts: ["oui", "non", "il hésite", "il en achète un"], a: 1 },
    ],
  },

  ltcf_08: {
    title: "Réservation par téléphone",
    level: "CLB 4",
    section: 1,
    transcript: "Bonjour, je voudrais réserver une chambre pour deux personnes du quinze au dix-sept juin. Avec petit-déjeuner inclus, s'il vous plaît. C'est au nom de Dubois. Vous avez une carte de crédit ? Oui, Visa.",
    questions: [
      { q: "Pour combien de personnes ?", opts: ["une", "deux", "trois", "quatre"], a: 1 },
      { q: "Combien de nuits ?", opts: ["une", "deux", "trois", "quatre"], a: 1 },
      { q: "Que demande le client en plus ?", opts: ["un parking", "un petit-déjeuner", "une vue", "un lit bébé"], a: 1 },
      { q: "Quel mode de paiement ?", opts: ["argent", "chèque", "Visa", "Interac"], a: 2 },
    ],
  },

  ltcf_09: {
    title: "Annonce à l'aéroport",
    level: "CLB 4",
    section: 1,
    transcript: "Les passagers du vol Air Canada 856 à destination de Vancouver sont priés de se présenter à la porte vingt-trois. L'embarquement commencera dans quinze minutes. N'oubliez pas votre carte d'embarquement et votre pièce d'identité.",
    questions: [
      { q: "Quel est le numéro de vol ?", opts: ["586", "856", "865", "568"], a: 1 },
      { q: "Quelle est la destination ?", opts: ["Toronto", "Vancouver", "Calgary", "Halifax"], a: 1 },
      { q: "Quelle porte d'embarquement ?", opts: ["13", "23", "32", "33"], a: 1 },
      { q: "Dans combien de temps l'embarquement ?", opts: ["5 min", "10 min", "15 min", "20 min"], a: 2 },
    ],
  },

  ltcf_10: {
    title: "Invitation entre amis",
    level: "CLB 4",
    section: 1,
    transcript: "Allô Sophie ! Veux-tu venir au parc La Fontaine dimanche pour un pique-nique ? On sera six. Apporte une salade si tu veux. On se rejoint à midi près de l'étang. Confirme-moi par texto.",
    questions: [
      { q: "Quelle activité est proposée ?", opts: ["un cinéma", "un pique-nique", "un concert", "un souper"], a: 1 },
      { q: "Où aura lieu l'activité ?", opts: ["au mont Royal", "au parc La Fontaine", "au Vieux-Port", "à l'île Sainte-Hélène"], a: 1 },
      { q: "À quelle heure ?", opts: ["10 h", "11 h", "midi", "13 h"], a: 2 },
      { q: "Comment doit-elle répondre ?", opts: ["par appel", "par texto", "par courriel", "en personne"], a: 1 },
    ],
  },

  ltcf_11: {
    title: "Annonce sur le REM",
    level: "CLB 5",
    section: 2,
    transcript: "Bonjour, nous vous informons que la nouvelle station du REM à Brossard ouvrira ses portes lundi prochain. Le service fonctionnera de cinq heures du matin à une heure du matin, sept jours sur sept. Les billets sont disponibles en ligne ou aux distributeurs des stations. Une réduction de vingt pour cent sera offerte la première semaine.",
    questions: [
      { q: "Quand ouvre la nouvelle station ?", opts: ["ce week-end", "lundi prochain", "dans un mois", "demain"], a: 1 },
      { q: "Quelles sont les heures de service ?", opts: ["6 h à minuit", "5 h à 1 h", "5 h à 23 h", "24 h sur 24"], a: 1 },
      { q: "Où acheter des billets ?", opts: ["seulement en ligne", "seulement en station", "en ligne ou aux distributeurs", "à la mairie"], a: 2 },
      { q: "Quelle réduction est offerte ?", opts: ["10 %", "15 %", "20 %", "25 %"], a: 2 },
    ],
  },

  ltcf_12: {
    title: "Réunion au bureau",
    level: "CLB 5",
    section: 2,
    transcript: "Bonjour à tous. La réunion du département marketing aura lieu jeudi après-midi à quatorze heures, dans la salle de conférence du troisième étage. Veuillez préparer un court rapport sur vos projets actuels. Anne ne pourra pas être présente, elle est en congé. Merci de m'envoyer vos questions par courriel avant mercredi soir.",
    questions: [
      { q: "Quand a lieu la réunion ?", opts: ["mardi matin", "mercredi soir", "jeudi après-midi", "vendredi matin"], a: 2 },
      { q: "Où se tient la réunion ?", opts: ["au 2e étage", "au 3e étage", "au 4e étage", "en ligne"], a: 1 },
      { q: "Pourquoi Anne est-elle absente ?", opts: ["malade", "en congé", "en voyage d'affaires", "en formation"], a: 1 },
      { q: "Que faut-il préparer ?", opts: ["un budget", "un court rapport", "une présentation", "un sondage"], a: 1 },
    ],
  },

  ltcf_13: {
    title: "Nouvelles de la radio",
    level: "CLB 5",
    section: 2,
    transcript: "Et maintenant l'actualité. Le gouvernement du Québec annonce un investissement de cinquante millions de dollars dans la rénovation des écoles primaires. Les travaux commenceront cet été et devraient être terminés en deux ans. Le ministre de l'Éducation précise que la priorité sera donnée aux établissements les plus anciens.",
    questions: [
      { q: "Quel est le montant annoncé ?", opts: ["15 millions", "25 millions", "50 millions", "100 millions"], a: 2 },
      { q: "Quel secteur est concerné ?", opts: ["les hôpitaux", "les écoles primaires", "les routes", "le transport"], a: 1 },
      { q: "Quand commencent les travaux ?", opts: ["au printemps", "cet été", "à l'automne", "l'hiver prochain"], a: 1 },
      { q: "Quelle est la priorité ?", opts: ["les nouvelles écoles", "les écoles rurales", "les établissements les plus anciens", "les écoles secondaires"], a: 2 },
    ],
  },

  ltcf_14: {
    title: "Plainte au service client",
    level: "CLB 5",
    section: 2,
    transcript: "Bonjour, j'ai commandé un ordinateur portable il y a deux semaines et je n'ai toujours rien reçu. Mon numéro de commande est le 47892. On m'avait promis une livraison en cinq jours ouvrables. Je voudrais soit un remboursement, soit une explication. Pouvez-vous m'aider, s'il vous plaît ?",
    questions: [
      { q: "Quel produit a été commandé ?", opts: ["un téléphone", "une tablette", "un ordinateur portable", "une imprimante"], a: 2 },
      { q: "Quand la commande a-t-elle été passée ?", opts: ["il y a une semaine", "il y a deux semaines", "il y a un mois", "hier"], a: 1 },
      { q: "Quel était le délai promis ?", opts: ["2 jours", "5 jours ouvrables", "10 jours", "2 semaines"], a: 1 },
      { q: "Que veut le client ?", opts: ["un échange seulement", "un remboursement ou une explication", "porter plainte", "un nouveau produit"], a: 1 },
    ],
  },

  ltcf_15: {
    title: "Conversation entre collègues",
    level: "CLB 5",
    section: 2,
    transcript: "Tu as vu le nouveau projet ? Oui, ça a l'air intéressant, mais les délais sont serrés. Le patron veut tout finir avant la fin du mois. Je pense qu'on devrait demander de l'aide à l'équipe de Québec. Bonne idée. Je vais en parler à Martin cet après-midi.",
    questions: [
      { q: "De quoi parlent les collègues ?", opts: ["d'un nouveau projet", "d'une promotion", "d'une fête", "d'un départ"], a: 0 },
      { q: "Quel est le problème principal ?", opts: ["le budget", "les délais serrés", "le client", "le patron"], a: 1 },
      { q: "Que suggère un des collègues ?", opts: ["d'embaucher quelqu'un", "de demander de l'aide à Québec", "de reporter le projet", "de refuser le travail"], a: 1 },
      { q: "Quand sera contacté Martin ?", opts: ["demain", "cet après-midi", "ce soir", "la semaine prochaine"], a: 1 },
    ],
  },

  ltcf_16: {
    title: "Annonce à la bibliothèque",
    level: "CLB 5",
    section: 2,
    transcript: "Chers usagers, nous vous rappelons que la bibliothèque fermera ses portes à dix-sept heures aujourd'hui, en raison d'une formation du personnel. Le retour des livres est possible par la chute extérieure. Demain, l'ouverture se fera comme d'habitude à neuf heures. Merci de votre compréhension.",
    questions: [
      { q: "À quelle heure ferme la bibliothèque ?", opts: ["15 h", "16 h", "17 h", "18 h"], a: 2 },
      { q: "Pourquoi cette fermeture anticipée ?", opts: ["un déménagement", "une formation", "des travaux", "une fête"], a: 1 },
      { q: "Comment retourner les livres ?", opts: ["par courrier", "par la chute extérieure", "il faut attendre demain", "auprès d'un employé"], a: 1 },
      { q: "À quelle heure ouvre demain ?", opts: ["8 h", "9 h", "10 h", "11 h"], a: 1 },
    ],
  },

  ltcf_17: {
    title: "Entrevue radio courte",
    level: "CLB 5",
    section: 2,
    transcript: "Madame Lavoie, vous êtes propriétaire d'une boulangerie depuis dix ans. Quel est votre secret ? Je crois que c'est la qualité des ingrédients et le contact avec les clients. Je connais la plupart d'entre eux par leur prénom. C'est ce qui fait la différence dans un quartier comme le Plateau-Mont-Royal.",
    questions: [
      { q: "Quel est le métier de Madame Lavoie ?", opts: ["pâtissière", "boulangère", "chef cuisinière", "épicière"], a: 1 },
      { q: "Depuis combien de temps ?", opts: ["5 ans", "10 ans", "15 ans", "20 ans"], a: 1 },
      { q: "Quel est son secret ?", opts: ["les prix bas", "la qualité et le contact", "la publicité", "l'emplacement"], a: 1 },
      { q: "Dans quel quartier travaille-t-elle ?", opts: ["Mile-End", "Plateau-Mont-Royal", "Outremont", "Verdun"], a: 1 },
    ],
  },

  ltcf_18: {
    title: "Message de la SAAQ",
    level: "CLB 5",
    section: 2,
    transcript: "Bonjour, ici la Société de l'assurance automobile du Québec. Nous vous rappelons que votre permis de conduire doit être renouvelé avant le trente juin. Vous pouvez le faire en ligne sur notre site, ou en personne dans un point de service. Prévoyez vingt à trente minutes. Apportez une pièce d'identité valide.",
    questions: [
      { q: "Quel organisme téléphone ?", opts: ["la STM", "la SAAQ", "Revenu Québec", "Service Canada"], a: 1 },
      { q: "Quelle est la date limite ?", opts: ["30 mai", "30 juin", "30 juillet", "30 août"], a: 1 },
      { q: "Comment renouveler ?", opts: ["par téléphone", "par courrier", "en ligne ou en personne", "uniquement en ligne"], a: 2 },
      { q: "Quelle durée prévoir ?", opts: ["10 à 15 min", "20 à 30 min", "45 min", "1 h"], a: 1 },
    ],
  },

  ltcf_19: {
    title: "Appel d'un parent à l'école",
    level: "CLB 5",
    section: 2,
    transcript: "Bonjour, c'est la mère de Léa Bouchard, en troisième année. Ma fille est malade aujourd'hui, elle a beaucoup de fièvre. Elle ne pourra pas aller à l'école ni demain. Pouvez-vous prévenir son enseignante, madame Dubé ? Je lui apporterai un billet à son retour. Merci beaucoup.",
    questions: [
      { q: "Qui appelle ?", opts: ["le père de Léa", "la mère de Léa", "le médecin", "la directrice"], a: 1 },
      { q: "Quel est le problème ?", opts: ["un accident", "elle a la fièvre", "elle est en retard", "elle est blessée"], a: 1 },
      { q: "Combien de jours d'absence ?", opts: ["1 jour", "2 jours", "3 jours", "une semaine"], a: 1 },
      { q: "Que promet la mère ?", opts: ["d'appeler demain", "d'apporter un billet", "de venir à l'école", "de payer une amende"], a: 1 },
    ],
  },

  ltcf_20: {
    title: "Annonce dans un centre commercial",
    level: "CLB 5",
    section: 2,
    transcript: "Mesdames et messieurs, bienvenue au Carrefour Laval. Nous vous informons que les soldes d'hiver commencent aujourd'hui dans toutes les boutiques. Des rabais allant jusqu'à soixante-dix pour cent sont offerts. La cour alimentaire se trouve au deuxième étage. Le stationnement est gratuit jusqu'à dix-huit heures.",
    questions: [
      { q: "Où se passe l'annonce ?", opts: ["au Quartier Dix30", "au Carrefour Laval", "au Marché Central", "au Centre Eaton"], a: 1 },
      { q: "Quel est le rabais maximum ?", opts: ["50 %", "60 %", "70 %", "80 %"], a: 2 },
      { q: "Où est la cour alimentaire ?", opts: ["au 1er étage", "au 2e étage", "au 3e étage", "au sous-sol"], a: 1 },
      { q: "Jusqu'à quelle heure le stationnement est gratuit ?", opts: ["17 h", "18 h", "19 h", "20 h"], a: 1 },
    ],
  },

  ltcf_21: {
    title: "Conférence sur l'environnement",
    level: "CLB 6",
    section: 3,
    transcript: "Mesdames et messieurs, je vous remercie d'être présents ce soir. Le réchauffement climatique n'est plus un sujet abstrait : il affecte déjà nos vies. Au Québec, les hivers sont plus courts, les étés plus chauds, et les épisodes de pluies intenses se multiplient. Nous devons agir collectivement, en réduisant notre consommation d'énergie et en favorisant le transport en commun. Chaque geste compte, peu importe sa taille.",
    questions: [
      { q: "Quel est le sujet principal ?", opts: ["la pollution de l'air", "le réchauffement climatique", "la gestion des déchets", "les énergies vertes"], a: 1 },
      { q: "Quel changement est mentionné au Québec ?", opts: ["des hivers plus longs", "des hivers plus courts", "moins de pluie", "plus de tempêtes de neige"], a: 1 },
      { q: "Quelle action est suggérée ?", opts: ["acheter une voiture électrique", "réduire la consommation d'énergie", "déménager", "planter des arbres"], a: 1 },
      { q: "Quel est le ton du conférencier ?", opts: ["pessimiste", "engageant et urgent", "humoristique", "neutre"], a: 1 },
    ],
  },

  ltcf_22: {
    title: "Opinion radio sur le télétravail",
    level: "CLB 6",
    section: 3,
    transcript: "Personnellement, je crois que le télétravail a transformé notre rapport au bureau de manière irréversible. Beaucoup d'employés apprécient la flexibilité, mais les jeunes professionnels perdent les contacts informels qui favorisent l'apprentissage. Les entreprises doivent trouver un équilibre. Imposer cinq jours au bureau serait un recul, mais tout faire à distance crée de l'isolement. Le modèle hybride me semble la meilleure solution.",
    questions: [
      { q: "Quel est le point de vue de l'auteur ?", opts: ["contre le télétravail", "pour le tout-virtuel", "favorable au modèle hybride", "indifférent"], a: 2 },
      { q: "Qui perdrait avec le tout-virtuel ?", opts: ["les patrons", "les jeunes professionnels", "les retraités", "les clients"], a: 1 },
      { q: "Quelle critique fait-il au présentiel total ?", opts: ["trop cher", "ce serait un recul", "trop d'embouteillages", "moins productif"], a: 1 },
      { q: "Quel mot décrit le mieux son message ?", opts: ["catégorique", "nuancé", "humoristique", "agressif"], a: 1 },
    ],
  },

  ltcf_23: {
    title: "Reportage sur le logement",
    level: "CLB 6",
    section: 3,
    transcript: "La crise du logement continue de frapper Montréal. Selon les dernières données, le loyer moyen d'un quatre et demi a augmenté de douze pour cent en un an, atteignant désormais mille six cents dollars. Les jeunes familles peinent à trouver un logement abordable près de leur travail. Plusieurs choisissent maintenant de s'installer en banlieue, où les prix restent plus accessibles, malgré les longs trajets quotidiens.",
    questions: [
      { q: "De quel sujet traite le reportage ?", opts: ["du chômage", "de la crise du logement", "du transport", "de l'immigration"], a: 1 },
      { q: "Quelle est la hausse du loyer ?", opts: ["5 %", "8 %", "12 %", "20 %"], a: 2 },
      { q: "Quel est le loyer moyen d'un 4½ ?", opts: ["1 200 $", "1 400 $", "1 600 $", "1 800 $"], a: 2 },
      { q: "Pourquoi les familles vont-elles en banlieue ?", opts: ["pour les écoles", "pour des loyers plus accessibles", "pour la tranquillité", "pour les parcs"], a: 1 },
    ],
  },

  ltcf_24: {
    title: "Extrait d'un cours universitaire",
    level: "CLB 6",
    section: 3,
    transcript: "Aujourd'hui, nous allons examiner les origines du système de santé canadien. Mis en place dans les années soixante, il repose sur cinq principes fondamentaux : l'universalité, l'accessibilité, l'intégralité, la transférabilité et la gestion publique. Bien qu'il soit souvent cité en exemple, il fait face à des défis importants : le vieillissement de la population, les pénuries de personnel et les délais d'attente. Nous étudierons chacun de ces enjeux dans les prochaines semaines.",
    questions: [
      { q: "Quel est le sujet du cours ?", opts: ["la pharmacologie", "le système de santé canadien", "l'histoire du Canada", "la sociologie"], a: 1 },
      { q: "Combien de principes fondamentaux ?", opts: ["trois", "quatre", "cinq", "six"], a: 2 },
      { q: "Quand le système a-t-il été créé ?", opts: ["années 50", "années 60", "années 70", "années 80"], a: 1 },
      { q: "Quel défi N'est PAS mentionné ?", opts: ["le vieillissement", "les pénuries de personnel", "le financement", "les délais d'attente"], a: 2 },
    ],
  },

  ltcf_25: {
    title: "Témoignage d'un immigrant",
    level: "CLB 6",
    section: 3,
    transcript: "Je suis arrivé à Montréal il y a quatre ans, après avoir quitté le Maroc. Au début, le plus difficile n'était pas le froid, mais la solitude. Je ne connaissais personne et je n'avais pas encore d'emploi dans mon domaine. Petit à petit, j'ai suivi des cours de francisation, rencontré d'autres nouveaux arrivants, et trouvé un poste d'ingénieur. Aujourd'hui, je me sens chez moi ici, même si ma famille me manque toujours.",
    questions: [
      { q: "D'où vient le narrateur ?", opts: ["d'Algérie", "du Maroc", "de Tunisie", "du Sénégal"], a: 1 },
      { q: "Quelle a été sa première difficulté ?", opts: ["le froid", "la solitude", "la langue", "la nourriture"], a: 1 },
      { q: "Quel cours a-t-il suivi ?", opts: ["d'anglais", "de francisation", "d'informatique", "de cuisine"], a: 1 },
      { q: "Quel est son sentiment actuel ?", opts: ["nostalgique mais intégré", "déçu", "indifférent", "pressé de repartir"], a: 0 },
    ],
  },

  ltcf_26: {
    title: "Reportage culturel",
    level: "CLB 6",
    section: 3,
    transcript: "Le Festival international de jazz de Montréal célèbre cette année son quarante-cinquième anniversaire. Pendant onze jours, plus de trois mille musiciens venus du monde entier se produiront sur une trentaine de scènes, dont la plupart sont en plein air et gratuites. Le festival attire chaque année près de deux millions de visiteurs, ce qui en fait l'un des événements culturels les plus importants en Amérique du Nord. Cette édition mettra l'accent sur les jeunes talents canadiens.",
    questions: [
      { q: "Quel anniversaire célèbre le festival ?", opts: ["40e", "45e", "50e", "55e"], a: 1 },
      { q: "Combien de musiciens participent ?", opts: ["plus de 1 000", "plus de 2 000", "plus de 3 000", "plus de 5 000"], a: 2 },
      { q: "Combien de visiteurs attire-t-il ?", opts: ["500 000", "1 million", "près de 2 millions", "3 millions"], a: 2 },
      { q: "Quel est l'accent de cette édition ?", opts: ["les artistes européens", "les jeunes talents canadiens", "le jazz classique", "les artistes africains"], a: 1 },
    ],
  },

  ltcf_27: {
    title: "Débat sur les transports",
    level: "CLB 6",
    section: 3,
    transcript: "On entend souvent dire que Montréal devrait investir davantage dans les pistes cyclables. Je suis d'accord en théorie, mais il faut être réaliste : pendant cinq mois par année, la neige rend ces pistes inutilisables. Avant de multiplier les infrastructures, la ville devrait améliorer le déneigement et la sécurité. Sinon, on dépense des millions pour des aménagements vides la moitié de l'année. C'est une question de priorités, pas d'idéologie.",
    questions: [
      { q: "Quel est l'argument principal ?", opts: ["interdire les vélos", "construire plus de pistes", "améliorer le déneigement avant d'élargir", "augmenter les taxes"], a: 2 },
      { q: "Combien de mois de neige mentionnés ?", opts: ["trois", "quatre", "cinq", "six"], a: 2 },
      { q: "Quel ton adopte l'auteur ?", opts: ["pragmatique", "agressif", "idéologique", "indifférent"], a: 0 },
      { q: "Qu'est-ce qu'il critique ?", opts: ["les cyclistes", "l'absence de débat", "des dépenses mal ciblées", "le maire"], a: 2 },
    ],
  },

  ltcf_28: {
    title: "Annonce de Revenu Québec",
    level: "CLB 6",
    section: 3,
    transcript: "Bonjour, ceci est un message important de Revenu Québec. La date limite pour produire votre déclaration de revenus est le trente avril. Vous pouvez soumettre votre déclaration en ligne, par la poste, ou avec l'aide d'un professionnel. Si vous prévoyez un remboursement, la transmission électronique est plus rapide. Toute déclaration tardive entraîne des pénalités et des intérêts. Pour plus d'informations, visitez notre site Web ou composez le service à la clientèle.",
    questions: [
      { q: "Quelle est la date limite ?", opts: ["15 avril", "30 avril", "15 mai", "30 mai"], a: 1 },
      { q: "Quelle méthode est la plus rapide pour un remboursement ?", opts: ["la poste", "en personne", "par téléphone", "la transmission électronique"], a: 3 },
      { q: "Qu'entraîne une déclaration tardive ?", opts: ["rien de grave", "des pénalités et des intérêts", "une amende fixe", "un avertissement"], a: 1 },
      { q: "Que conseille-t-on pour plus d'infos ?", opts: ["aller à un bureau", "visiter le site ou appeler", "écrire une lettre", "envoyer un courriel"], a: 1 },
    ],
  },

  ltcf_29: {
    title: "Extrait d'une entrevue d'embauche",
    level: "CLB 6",
    section: 3,
    transcript: "Parlez-moi d'un défi professionnel que vous avez surmonté. Eh bien, dans mon précédent emploi, j'ai dû diriger un projet alors que la moitié de mon équipe venait de démissionner. J'ai dû recruter rapidement, former de nouvelles personnes, et respecter quand même l'échéance. Cela m'a appris l'importance de la communication transparente et de la délégation. Aujourd'hui, je suis beaucoup plus à l'aise dans des situations imprévues.",
    questions: [
      { q: "Quel était le problème principal ?", opts: ["un budget coupé", "une équipe partie", "un client difficile", "un produit défectueux"], a: 1 },
      { q: "Qu'a-t-il dû faire d'urgence ?", opts: ["démissionner", "recruter et former", "annuler le projet", "demander un report"], a: 1 },
      { q: "Quelle leçon a-t-il tirée ?", opts: ["éviter les risques", "communication et délégation", "travailler seul", "changer de domaine"], a: 1 },
      { q: "Comment se sent-il aujourd'hui ?", opts: ["stressé", "plus à l'aise dans l'imprévu", "découragé", "incertain"], a: 1 },
    ],
  },

  ltcf_30: {
    title: "Chronique sur l'alimentation",
    level: "CLB 6",
    section: 3,
    transcript: "Manger local n'est plus seulement une tendance, c'est devenu une nécessité économique et écologique. Au Québec, des centaines de petits producteurs offrent des produits de qualité dans les marchés publics et par des paniers hebdomadaires. Acheter local soutient l'économie régionale, réduit les émissions liées au transport, et offre des aliments souvent plus frais. Évidemment, cela peut coûter un peu plus cher, mais c'est un investissement dans notre santé et dans l'avenir de nos communautés.",
    questions: [
      { q: "Quel est le sujet de la chronique ?", opts: ["la cuisine québécoise", "manger local", "le végétarisme", "les restaurants"], a: 1 },
      { q: "Comment peut-on acheter local ?", opts: ["seulement en épicerie", "marchés publics et paniers", "uniquement en ligne", "directement à la ferme"], a: 1 },
      { q: "Quel inconvénient mentionné ?", opts: ["la qualité", "la fraîcheur", "le prix un peu plus élevé", "la variété limitée"], a: 2 },
      { q: "Quel est le message principal ?", opts: ["acheter local est un investissement", "il faut bannir l'importation", "la nourriture est trop chère", "il faut tout cultiver soi-même"], a: 0 },
    ],
  },
};

Object.assign(window.LISTENING, window.LISTENING_TCF);
