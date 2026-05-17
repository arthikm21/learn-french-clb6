// Additional graded reading texts (r13-r30). CLB 3 → 6 progression.
window.READINGS_MORE = {
  r13: {
    title: 'Petite annonce : appartement à louer',
    level: 'CLB 4',
    text: `À LOUER — Beau 4 et demi à Montréal, quartier Villeray. Disponible le 1er juillet. Loyer de 1 250 $ par mois, chauffage et eau chaude inclus. L'électricité n'est pas comprise. L'appartement est au deuxième étage d'un immeuble tranquille. Il y a deux chambres, un salon double, une cuisine rénovée et un balcon arrière. Les planchers sont en bois franc. Le métro Jean-Talon est à dix minutes à pied. Il y a aussi une école primaire et un parc tout près. Les animaux ne sont pas acceptés. Non-fumeurs seulement. Stationnement dans la rue. Pour visiter, appelez Madame Lemieux au 514-555-0198 après 18 h. Premier mois et bonne référence exigés.`,
    questions: [
      { q: "Dans quel quartier se trouve l'appartement ?", opts: ['Villeray', 'Plateau', 'Verdun'], a: 0 },
      { q: 'Quel est le loyer mensuel ?', opts: ['1 050 $', '1 250 $', '1 450 $'], a: 1 },
      { q: 'Est-ce que les animaux sont acceptés ?', opts: ['oui, sans condition', 'non', 'seulement les chats'], a: 1 },
      { q: "À quelle distance se trouve le métro ?", opts: ['cinq minutes en auto', 'dix minutes à pied', 'vingt minutes en autobus'], a: 1 },
      { q: 'Quand peut-on appeler pour visiter ?', opts: ['le matin', "l'après-midi", 'après 18 h'], a: 2 },
    ],
  },
  r14: {
    title: "Offre d'emploi : préposé(e) à l'entretien",
    level: 'CLB 5',
    text: `L'hôpital Sainte-Anne, situé à Laval, cherche deux préposés ou préposées à l'entretien ménager. Le poste est à temps plein, à raison de 37,5 heures par semaine. L'horaire est de soir, de 15 h à 23 h, du lundi au vendredi. Le salaire de départ est de 22,50 $ de l'heure, avec une prime de soir de 1,25 $ supplémentaire. Nous offrons aussi des avantages sociaux complets, incluant l'assurance dentaire et un régime de retraite.

Les tâches comprennent le nettoyage des chambres des patients, des corridors et des salles communes. Le candidat idéal est ponctuel, fiable et capable de travailler debout pendant de longues heures. Une expérience en milieu hospitalier est un atout, mais une formation sera offerte sur place.

Pour postuler, envoyez votre curriculum vitæ avant le 15 juin à emplois@hsa-laval.ca ou présentez-vous au service des ressources humaines. Nous remercions tous les candidats, mais seules les personnes retenues seront contactées.`,
    questions: [
      { q: 'Combien de postes sont offerts ?', opts: ['un', 'deux', 'trois'], a: 1 },
      { q: "Quel est l'horaire de travail ?", opts: ['de jour', 'de soir', 'de nuit'], a: 1 },
      { q: 'Quel est le salaire de base ?', opts: ['18,75 $', '22,50 $', '25,00 $'], a: 1 },
      { q: "Dans le texte, le mot « atout » signifie :", opts: ['une obligation', 'un avantage', 'un problème'], a: 1 },
      { q: 'Comment peut-on postuler ?', opts: ['par téléphone seulement', 'par courriel ou en personne', 'par la poste'], a: 1 },
      { q: 'Qui sera contacté après la sélection ?', opts: ['tous les candidats', 'seulement les personnes retenues', 'personne'], a: 1 },
    ],
  },
  r15: {
    title: 'Avis de la SAAQ : renouvellement du permis de conduire',
    level: 'CLB 5',
    text: `Cher conducteur, votre permis de conduire expire le 30 septembre 2026. Pour éviter toute interruption, la Société de l'assurance automobile du Québec (SAAQ) vous invite à le renouveler avant cette date. Vous pouvez payer vos droits en ligne sur le site saaq.gouv.qc.ca, par téléphone au 1-800-361-7620, ou en personne dans n'importe quel point de service.

Le coût du renouvellement est de 92,40 $ pour deux ans. Si vous avez des points d'inaptitude à votre dossier, des frais supplémentaires peuvent s'appliquer. Vous devrez aussi fournir une nouvelle photo si la dernière a été prise il y a plus de huit ans.

Important : si vous avez changé d'adresse depuis votre dernier renouvellement, vous devez mettre à jour votre dossier avant de payer. Conduire avec un permis expiré est une infraction qui peut entraîner une amende de 60 $ à 100 $. Si vous ne recevez pas votre nouveau permis dans les vingt jours ouvrables suivant le paiement, veuillez communiquer avec nous. Merci de votre collaboration.`,
    questions: [
      { q: "Quand le permis expire-t-il ?", opts: ['30 août 2026', '30 septembre 2026', '30 octobre 2026'], a: 1 },
      { q: 'Combien coûte le renouvellement ?', opts: ['72,40 $', '92,40 $', '112,40 $'], a: 1 },
      { q: "Quand faut-il fournir une nouvelle photo ?", opts: ['toujours', 'si la dernière a plus de huit ans', 'jamais'], a: 1 },
      { q: 'Que faut-il faire si on a déménagé ?', opts: ['rien', "mettre à jour son dossier avant de payer", 'recommencer la photo'], a: 1 },
      { q: 'Quelle est la conséquence de conduire avec un permis expiré ?', opts: ['rien', 'une amende de 60 $ à 100 $', 'la prison'], a: 1 },
      { q: "Dans le texte, « infraction » veut dire :", opts: ['une récompense', "une violation de la loi", 'un examen'], a: 1 },
    ],
  },
  r16: {
    title: 'Article : un nouveau parc à Trois-Rivières',
    level: 'CLB 5',
    text: `La Ville de Trois-Rivières a inauguré dimanche dernier un nouveau parc public au bord du fleuve Saint-Laurent. Le projet, qui a coûté environ 4 millions de dollars, a duré près de trois ans. La mairesse, Madame Boucher, a coupé le ruban devant plusieurs centaines de citoyens enthousiastes.

Le parc s'étend sur huit hectares et offre une longue piste cyclable, des aires de pique-nique, un module de jeux pour les enfants et un petit amphithéâtre extérieur. Des spectacles gratuits y seront présentés tout l'été. Les organisateurs prévoient aussi un marché public les samedis matins.

Plusieurs résidents du quartier disent qu'ils sont très contents. « Avant, c'était un terrain vague. Maintenant, mes enfants ont enfin un endroit sécuritaire pour jouer », a déclaré Monsieur Gagnon, père de famille. La Ville espère que ce nouvel espace attirera aussi des touristes pendant la belle saison. Le parc est ouvert tous les jours, de 6 h à 23 h, et l'accès est entièrement gratuit.`,
    questions: [
      { q: "Quand le parc a-t-il été inauguré ?", opts: ['samedi', 'dimanche', 'lundi'], a: 1 },
      { q: 'Combien a coûté le projet ?', opts: ['2 millions', '4 millions', '6 millions'], a: 1 },
      { q: 'Que trouvera-t-on au parc le samedi matin ?', opts: ['un concert', 'un marché public', 'une course'], a: 1 },
      { q: "Avant le parc, qu'y avait-il à cet endroit ?", opts: ['une école', 'un terrain vague', 'un stationnement'], a: 1 },
      { q: 'Quelles sont les heures d\'ouverture ?', opts: ['6 h à 23 h', '8 h à 20 h', '24 heures sur 24'], a: 0 },
      { q: "Le but de l'article est de :", opts: ['vendre des billets', "informer sur l'ouverture d'un nouveau parc", "critiquer la mairesse"], a: 1 },
    ],
  },
  r17: {
    title: 'Brochure : Musée des beaux-arts de Montréal',
    level: 'CLB 4',
    text: `Bienvenue au Musée des beaux-arts de Montréal ! Le musée est ouvert du mardi au dimanche, de 10 h à 17 h. Le mercredi soir, nous restons ouverts jusqu'à 21 h. Nous sommes fermés le lundi et le 25 décembre.

Les billets coûtent 24 $ pour les adultes, 16 $ pour les étudiants avec carte, et c'est gratuit pour les enfants de moins de 13 ans. Tous les premiers dimanches du mois, l'entrée à la collection permanente est gratuite pour tout le monde.

En ce moment, vous pouvez voir trois expositions spéciales : « Couleurs du Nord », une exposition de peintures inuites, « Photographies de Montréal 1950 » au deuxième étage, et « Sculpture moderne du Québec » dans la grande galerie. Le café du musée sert des repas légers et des desserts. La boutique offre des livres d'art, des affiches et des cadeaux. Des visites guidées en français sont offertes à 11 h et à 14 h.`,
    questions: [
      { q: 'Quel jour le musée est-il fermé ?', opts: ['dimanche', 'lundi', 'mercredi'], a: 1 },
      { q: "Combien coûte l'entrée pour un adulte ?", opts: ['16 $', '24 $', '30 $'], a: 1 },
      { q: 'Quand est-ce gratuit pour tout le monde ?', opts: ['chaque mercredi', 'le premier dimanche du mois', 'le samedi matin'], a: 1 },
      { q: "Combien y a-t-il d'expositions spéciales ?", opts: ['deux', 'trois', 'quatre'], a: 1 },
      { q: 'À quelle heure ont lieu les visites guidées en français ?', opts: ['9 h et 12 h', '11 h et 14 h', '15 h et 18 h'], a: 1 },
    ],
  },
  r18: {
    title: 'Recette : pâté chinois traditionnel',
    level: 'CLB 4',
    text: `Le pâté chinois est un plat très populaire au Québec. Il est facile à préparer et idéal pour les soirées d'hiver. Pour quatre personnes, vous aurez besoin de 500 grammes de bœuf haché, un oignon, une boîte de maïs en grains, une boîte de maïs en crème, six pommes de terre, du beurre, du lait, du sel et du poivre.

D'abord, faites bouillir les pommes de terre dans une grande casserole d'eau salée pendant vingt minutes. Pendant ce temps, faites cuire le bœuf haché avec l'oignon dans une poêle. Salez et poivrez selon votre goût.

Ensuite, écrasez les pommes de terre avec du beurre et un peu de lait pour faire une purée onctueuse. Dans un plat allant au four, déposez d'abord la viande, puis le maïs, et finalement la purée de pommes de terre sur le dessus. Faites cuire au four à 180 degrés pendant trente minutes. Servez chaud avec du ketchup ou des marinades.`,
    questions: [
      { q: 'Pour combien de personnes est la recette ?', opts: ['deux', 'quatre', 'six'], a: 1 },
      { q: 'Combien de temps faut-il faire bouillir les pommes de terre ?', opts: ['10 minutes', '20 minutes', '30 minutes'], a: 1 },
      { q: 'Quel est l\'ordre des couches dans le plat ?', opts: ['purée, maïs, viande', 'viande, maïs, purée', 'maïs, viande, purée'], a: 1 },
      { q: 'À quelle température faut-il cuire le pâté ?', opts: ['150°C', '180°C', '220°C'], a: 1 },
      { q: 'Avec quoi sert-on traditionnellement ce plat ?', opts: ['du fromage', 'du ketchup ou des marinades', 'de la sauce blanche'], a: 1 },
    ],
  },
  r19: {
    title: 'Feuillet d\'information : votre médicament',
    level: 'CLB 5',
    text: `AMOXIDOL 500 mg — comprimés. Lisez attentivement ces instructions avant de prendre votre médicament.

Posologie : adultes et enfants de plus de douze ans, prenez un comprimé trois fois par jour, soit le matin, le midi et le soir. Avalez le comprimé entier avec un grand verre d'eau, de préférence pendant les repas. Ne croquez pas le comprimé.

Durée du traitement : sept jours complets. Il est très important de finir tous les comprimés, même si vous vous sentez mieux après quelques jours. Si vous arrêtez trop tôt, votre infection pourrait revenir.

Effets secondaires possibles : nausées, maux de tête, diarrhée légère. Si vous remarquez une éruption sur la peau, de la difficulté à respirer ou un gonflement du visage, arrêtez immédiatement le médicament et appelez le 911.

Précautions : ne consommez pas d'alcool pendant le traitement. Conservez les comprimés à température ambiante, à l'abri de la lumière et hors de la portée des enfants. Si vous oubliez une dose, prenez-la dès que possible, sauf si l'heure de la dose suivante approche. Ne doublez jamais la dose.`,
    questions: [
      { q: 'Combien de comprimés par jour faut-il prendre ?', opts: ['un', 'deux', 'trois'], a: 2 },
      { q: 'Combien de jours dure le traitement ?', opts: ['cinq', 'sept', 'dix'], a: 1 },
      { q: 'Que faut-il faire si on se sent mieux après trois jours ?', opts: ['arrêter le traitement', 'finir tous les comprimés', 'doubler la dose'], a: 1 },
      { q: "Que faire en cas de difficulté à respirer ?", opts: ['attendre', 'appeler le 911', 'prendre un autre comprimé'], a: 1 },
      { q: 'Peut-on boire de l\'alcool pendant le traitement ?', opts: ['oui', 'non', 'seulement le soir'], a: 1 },
      { q: 'Que faire si on oublie une dose ?', opts: ['la prendre dès que possible', 'doubler la prochaine', 'sauter une journée'], a: 0 },
    ],
  },
  r20: {
    title: 'Horaire des trains : Montréal-Québec',
    level: 'CLB 5',
    text: `VIA Rail offre plusieurs départs chaque jour entre Montréal et la ville de Québec. Le voyage dure environ trois heures et quart. Tous les trains partent de la gare Centrale de Montréal et arrivent à la gare du Palais à Québec.

En semaine, le premier train part à 6 h 30 et arrive à 9 h 50. C'est un choix populaire pour les voyageurs d'affaires. Un deuxième départ a lieu à 12 h 15, et un troisième à 17 h 40 pour ceux qui terminent leur journée de travail. La fin de semaine, l'horaire est plus court : seulement deux départs par jour, à 9 h et à 16 h 30.

Le tarif de base aller simple est de 59 $ en classe Économie. La classe Affaires coûte 129 $ et comprend un repas chaud et des boissons. Les enfants de moins de deux ans voyagent gratuitement sur les genoux d'un adulte. Les billets sont moins chers si vous réservez au moins quatorze jours à l'avance. Il est recommandé d'arriver à la gare au moins trente minutes avant le départ.`,
    questions: [
      { q: "Combien de temps dure le voyage ?", opts: ['environ 2 h', 'environ 3 h 15', 'environ 4 h'], a: 1 },
      { q: 'À quelle heure est le premier train en semaine ?', opts: ['5 h 30', '6 h 30', '7 h 30'], a: 1 },
      { q: 'Combien de départs y a-t-il la fin de semaine ?', opts: ['un', 'deux', 'trois'], a: 1 },
      { q: 'Combien coûte un billet aller simple en classe Économie ?', opts: ['39 $', '59 $', '99 $'], a: 1 },
      { q: "Qu'est-ce qui est compris en classe Affaires ?", opts: ['rien de spécial', 'un repas chaud et des boissons', 'un lit'], a: 1 },
      { q: 'Combien de temps avant le départ faut-il arriver à la gare ?', opts: ['10 minutes', '30 minutes', 'une heure'], a: 1 },
    ],
  },
  r21: {
    title: 'Menu du restaurant Chez Léon',
    level: 'CLB 4',
    text: `Bienvenue chez Léon, votre bistro de quartier à Gatineau. Notre menu du midi est offert du lundi au vendredi, de 11 h 30 à 14 h. Tous les plats principaux sont accompagnés d'une soupe ou d'une salade, et d'un café.

Pour commencer, essayez notre soupe à l'oignon gratinée à 7 $, ou une assiette de fromages québécois à 12 $. Comme plat principal, nous proposons un saumon grillé avec légumes du jardin à 22 $, une tourtière maison servie avec du ketchup aux fruits à 18 $, ou un burger de bœuf de l'Estrie avec frites à 16 $. Les végétariens apprécieront notre lasagne aux légumes à 17 $.

Pour terminer le repas, nos desserts sont préparés sur place : tarte au sucre à 8 $, pouding chômeur à 7 $, ou crème glacée à l'érable à 6 $. Les enfants de moins de dix ans ont un menu spécial à 10 $. Réservations recommandées le week-end au 819-555-0144.`,
    questions: [
      { q: 'Où se trouve le restaurant ?', opts: ['à Montréal', 'à Gatineau', 'à Québec'], a: 1 },
      { q: "Quand le menu du midi est-il offert ?", opts: ['tous les jours', 'du lundi au vendredi', 'la fin de semaine'], a: 1 },
      { q: 'Combien coûte la tourtière ?', opts: ['16 $', '18 $', '22 $'], a: 1 },
      { q: "Quel plat convient à un végétarien ?", opts: ['le saumon', 'la lasagne aux légumes', 'le burger'], a: 1 },
      { q: 'Quel dessert est le moins cher ?', opts: ['la tarte au sucre', 'le pouding chômeur', 'la crème glacée à l\'érable'], a: 2 },
    ],
  },
  r22: {
    title: 'Souvenirs d\'enfance',
    level: 'CLB 6',
    text: `Quand j'étais petite, je passais tous mes étés chez ma grand-mère à Trois-Pistoles. Sa maison était une vieille maison blanche avec une grande galerie en bois et un jardin plein de fleurs. Chaque matin, je me levais tôt pour aller chercher des œufs frais dans le poulailler. Les poules me regardaient avec curiosité, mais elles n'avaient pas peur de moi.

L'été de mes dix ans, quelque chose d'inoubliable est arrivé. Un matin de juillet, ma grand-mère m'a réveillée très tôt. « Habille-toi vite », a-t-elle dit avec un sourire mystérieux. Nous sommes sorties dans la brume du matin. Près de la rivière, il y avait un petit chevreuil. Il était seul et il semblait perdu. Ma grand-mère m'a expliqué que sa maman l'avait probablement laissé là pour la journée. Nous l'avons observé pendant une heure sans bouger.

Le soir, j'ai écrit cette journée dans mon petit cahier rouge. Aujourd'hui, ma grand-mère n'est plus là, mais je garde toujours ce cahier. Quand je l'ouvre, je sens encore l'odeur des fleurs du jardin et j'entends sa voix douce. Ces souvenirs sont devenus mon trésor le plus précieux.`,
    questions: [
      { q: 'Où la narratrice passait-elle ses étés ?', opts: ['à Trois-Rivières', 'à Trois-Pistoles', 'à Montréal'], a: 1 },
      { q: "Qu'allait-elle chercher chaque matin ?", opts: ['du lait', 'des œufs', 'des fleurs'], a: 1 },
      { q: "Quel âge avait-elle lors de l'événement spécial ?", opts: ['huit ans', 'dix ans', 'douze ans'], a: 1 },
      { q: "Qu'ont-elles vu près de la rivière ?", opts: ['un ours', 'un chevreuil', 'un renard'], a: 1 },
      { q: "Dans le texte, « inoubliable » signifie :", opts: ['ennuyeux', "qu'on ne peut pas oublier", 'rapide'], a: 1 },
      { q: 'Pourquoi la narratrice garde-t-elle le cahier rouge ?', opts: ['parce qu\'il est neuf', "parce qu'il contient des souvenirs précieux", 'parce qu\'il était cher'], a: 1 },
      { q: "On peut déduire que la grand-mère :", opts: ['est encore vivante', "est décédée", 'habite maintenant en ville'], a: 1 },
    ],
  },
  r23: {
    title: 'Opinion : le télétravail, est-ce vraiment positif ?',
    level: 'CLB 6',
    text: `Depuis la pandémie, le télétravail est devenu une réalité pour des milliers de Canadiens. Certains employeurs veulent maintenant que tout le monde retourne au bureau cinq jours par semaine. À mon avis, c'est une grave erreur.

Premièrement, le télétravail offre une meilleure qualité de vie. Au lieu de perdre deux heures par jour dans le trafic, les employés peuvent passer plus de temps avec leur famille, faire de l'exercice ou simplement mieux dormir. Une personne reposée travaille mieux qu'une personne épuisée. Les études le confirment.

Deuxièmement, le télétravail est bon pour l'environnement. Moins de voitures sur les routes signifie moins de pollution. C'est aussi positif pour les régions éloignées du Québec, qui peuvent attirer de nouveaux résidents qualifiés.

Bien sûr, certains diront que les jeunes employés ont besoin du bureau pour apprendre des collègues plus expérimentés. C'est vrai, mais la solution n'est pas le retour complet. Un modèle hybride, avec deux ou trois jours au bureau, serait beaucoup plus raisonnable.

Forcer les gens à revenir cinq jours sur cinq, c'est ignorer ce que nous avons appris pendant la pandémie. Les employeurs intelligents écoutent leurs employés. Les autres risquent simplement de perdre leurs meilleurs talents.`,
    questions: [
      { q: "Quelle est l'opinion principale de l'auteur ?", opts: ["le télétravail est négatif", "le télétravail à temps plein est positif", "le modèle hybride est préférable au retour complet"], a: 2 },
      { q: "Quel premier avantage du télétravail est mentionné ?", opts: ['un meilleur salaire', "une meilleure qualité de vie", 'plus de promotions'], a: 1 },
      { q: 'Combien de temps les gens perdraient-ils dans le trafic ?', opts: ['une heure par jour', 'deux heures par jour', 'trois heures par jour'], a: 1 },
      { q: "Pourquoi le télétravail aide-t-il l'environnement ?", opts: ['moins de voitures sur les routes', 'moins de papier au bureau', 'moins de chauffage'], a: 0 },
      { q: "Dans le texte, « épuisée » veut dire :", opts: ['très fatiguée', 'très contente', 'très occupée'], a: 0 },
      { q: 'Quel argument contre le télétravail est reconnu par l\'auteur ?', opts: ['la productivité baisse', "les jeunes ont besoin d'apprendre des collègues", "les patrons ne peuvent pas surveiller"], a: 1 },
      { q: "On peut déduire que l'auteur pense que les employeurs :", opts: ['ont toujours raison', 'doivent écouter leurs employés', 'doivent payer plus'], a: 1 },
    ],
  },
  r24: {
    title: "Mode d'emploi : bibliothèque BORGEN",
    level: 'CLB 5',
    text: `Félicitations pour l'achat de votre nouvelle bibliothèque BORGEN. Avant de commencer, vérifiez le contenu de la boîte. Vous devez trouver quatre planches verticales, cinq tablettes horizontales, un panneau arrière, seize chevilles en bois, trente-deux vis et une petite clé hexagonale. Si une pièce manque, communiquez avec notre service à la clientèle au 1-800-555-0173.

Étape 1 : placez les deux grandes planches verticales sur une surface plate et propre, comme un tapis. Insérez les chevilles en bois dans les petits trous prévus.

Étape 2 : fixez la tablette du bas et celle du haut à l'aide des vis. Utilisez la clé hexagonale fournie. Ne serrez pas trop fort pour le moment.

Étape 3 : ajoutez les trois tablettes du milieu une par une. Vérifiez que chaque tablette est bien droite avant de continuer.

Étape 4 : clouez le panneau arrière avec les petits clous fournis dans un sachet séparé.

Étape 5 : redressez la bibliothèque et serrez fermement toutes les vis. Pour votre sécurité, fixez le meuble au mur avec l'attache murale incluse, surtout si vous avez de jeunes enfants à la maison. Le montage prend environ quarante-cinq minutes.`,
    questions: [
      { q: 'Combien de tablettes y a-t-il en tout ?', opts: ['quatre', 'cinq', 'six'], a: 1 },
      { q: "Que faire si une pièce manque ?", opts: ['continuer quand même', "appeler le service à la clientèle", "retourner la boîte au magasin"], a: 1 },
      { q: 'À quelle étape ajoute-t-on le panneau arrière ?', opts: ['étape 2', 'étape 3', 'étape 4'], a: 2 },
      { q: "Pourquoi faut-il fixer le meuble au mur ?", opts: ['pour la décoration', 'pour la sécurité', 'pour économiser l\'espace'], a: 1 },
      { q: "Combien de temps prend le montage ?", opts: ['15 minutes', '45 minutes', '2 heures'], a: 1 },
      { q: "Dans le texte, « serrez » veut dire :", opts: ['rendre plus solide en tournant', 'décorer', 'mesurer'], a: 0 },
    ],
  },
  r25: {
    title: 'Brochure de santé publique : la vaccination contre la grippe',
    level: 'CLB 5',
    text: `Chaque année, des milliers de Canadiens attrapent la grippe. La meilleure façon de se protéger est de se faire vacciner avant le début de la saison froide, soit en octobre ou en novembre. Le vaccin contre la grippe est gratuit pour toutes les personnes qui vivent au Québec et qui ont une carte d'assurance maladie valide.

Qui devrait se faire vacciner en priorité ? Les enfants de six mois à cinq ans, les personnes de soixante ans et plus, les femmes enceintes et les personnes ayant une maladie chronique comme le diabète ou l'asthme. Les travailleurs de la santé sont aussi fortement encouragés à le faire.

Où se faire vacciner ? Vous pouvez prendre rendez-vous en ligne sur Clic Santé. La vaccination est offerte dans plusieurs endroits : les CLSC, les pharmacies de quartier et certaines cliniques médicales. Apportez votre carte d'assurance maladie le jour du rendez-vous.

Le vaccin est très sécuritaire. Quelques personnes ressentent un peu de douleur au bras ou une légère fièvre pendant un ou deux jours. C'est tout à fait normal et ces effets disparaissent rapidement. N'oubliez pas que la vaccination ne protège pas seulement vous, mais aussi vos proches.`,
    questions: [
      { q: 'Quand faut-il se faire vacciner ?', opts: ['en été', 'en octobre ou novembre', 'en mars'], a: 1 },
      { q: "Combien coûte le vaccin pour les Québécois ?", opts: ['25 $', '50 $', "rien, il est gratuit"], a: 2 },
      { q: 'Qui doit se faire vacciner en priorité ?', opts: ['seulement les adultes', 'les personnes de 60 ans et plus, entre autres', 'seulement les enfants'], a: 1 },
      { q: "Comment prend-on rendez-vous ?", opts: ['par la poste', "en ligne sur Clic Santé", 'on ne peut pas'], a: 1 },
      { q: 'Quels sont les effets secondaires possibles ?', opts: ['aucun', 'douleur au bras ou légère fièvre', 'maladie grave'], a: 1 },
      { q: "Quel est le but principal de cette brochure ?", opts: ['vendre des médicaments', "encourager la vaccination", "critiquer les pharmacies"], a: 1 },
    ],
  },
  r26: {
    title: "Avis d'IRCC : demande de résidence permanente",
    level: 'CLB 6',
    text: `Immigration, Réfugiés et Citoyenneté Canada (IRCC) vous informe que votre demande de résidence permanente a été reçue le 12 mars 2026. Votre numéro de dossier est R-2026-487329. Veuillez le mentionner dans toute correspondance future avec notre bureau.

Prochaines étapes : un agent examinera votre dossier au cours des huit à douze prochains mois. Pendant ce délai, vous devez nous informer immédiatement de tout changement important, comme une nouvelle adresse, un changement d'état civil, une naissance dans la famille ou un changement d'emploi. Pour cela, utilisez votre compte sécurisé sur notre site Web.

Examen médical : vous devrez probablement passer un examen médical chez un médecin désigné par IRCC. Nous vous enverrons une lettre avec la liste des médecins autorisés dans votre région. Cet examen est valide pour douze mois seulement, alors attendez nos instructions avant de prendre rendez-vous.

Documents supplémentaires : si nous avons besoin de renseignements ou de documents additionnels, nous communiquerons avec vous par courriel ou par la poste. Vous aurez normalement trente jours pour répondre. Le défaut de répondre dans les délais peut entraîner le refus de votre demande.

Pour vérifier l'état de votre dossier en tout temps, connectez-vous à votre compte. N'appelez notre ligne téléphonique que pour des questions urgentes, car les délais d'attente sont parfois longs. Nous vous remercions de votre patience.`,
    questions: [
      { q: 'Quand la demande a-t-elle été reçue ?', opts: ['le 12 février 2026', 'le 12 mars 2026', 'le 12 avril 2026'], a: 1 },
      { q: 'Combien de temps prendra l\'examen du dossier ?', opts: ['8 à 12 mois', '2 à 3 mois', '2 à 3 ans'], a: 0 },
      { q: 'Que faut-il faire si on déménage ?', opts: ['rien', 'informer IRCC immédiatement', "attendre la décision finale"], a: 1 },
      { q: 'Combien de temps est valide l\'examen médical ?', opts: ['six mois', 'douze mois', 'vingt-quatre mois'], a: 1 },
      { q: 'Combien de temps a-t-on pour fournir des documents supplémentaires ?', opts: ['10 jours', '30 jours', '60 jours'], a: 1 },
      { q: "Dans le texte, « entraîner » veut dire :", opts: ['causer', 'éviter', 'préparer'], a: 0 },
      { q: "On peut déduire que IRCC préfère que les gens :", opts: ['appellent souvent', 'utilisent leur compte en ligne', 'écrivent par la poste'], a: 1 },
    ],
  },
  r27: {
    title: 'Courriel : réunion d\'équipe reportée',
    level: 'CLB 5',
    text: `De : Sophie Tremblay
À : Équipe Marketing
Objet : Réunion de lundi reportée

Bonjour à toutes et à tous,

J'espère que vous avez passé une belle fin de semaine. Je vous écris pour vous informer que notre réunion d'équipe prévue lundi le 18 mai à 10 h sera reportée. Madame Bouchard, notre directrice, doit assister à une rencontre imprévue avec un client important à Ottawa toute la journée.

La réunion aura maintenant lieu mardi le 19 mai, à la même heure, dans la salle de conférence du quatrième étage. L'ordre du jour reste le même : le budget du troisième trimestre, la campagne publicitaire d'automne et les nouvelles embauches.

Si vous êtes absents mardi pour une raison valable, merci de me prévenir avant midi lundi. J'enverrai le compte rendu de la réunion par courriel à toutes les personnes absentes.

N'oubliez pas d'apporter vos rapports mensuels. Si vous avez des questions ou un sujet à ajouter à l'ordre du jour, faites-le-moi savoir d'ici demain après-midi.

Bonne journée,
Sophie Tremblay
Coordonnatrice, équipe Marketing
Poste : 4521`,
    questions: [
      { q: 'Pourquoi la réunion est-elle reportée ?', opts: ['la salle n\'est pas disponible', 'la directrice doit voir un client à Ottawa', 'trop d\'employés sont malades'], a: 1 },
      { q: 'À quelle nouvelle date aura lieu la réunion ?', opts: ['lundi 18 mai', 'mardi 19 mai', 'mercredi 20 mai'], a: 1 },
      { q: 'Où aura lieu la réunion ?', opts: ['au deuxième étage', 'au quatrième étage', 'en ligne'], a: 1 },
      { q: "Que doivent apporter les employés ?", opts: ['leur portable', 'leurs rapports mensuels', 'un café'], a: 1 },
      { q: "Que faut-il faire si on ne peut pas être présent ?", opts: ['rien', 'prévenir Sophie avant midi lundi', 'envoyer un remplaçant'], a: 1 },
      { q: 'À quel poste téléphonique peut-on joindre Sophie ?', opts: ['4521', '5421', '2154'], a: 0 },
    ],
  },
  r28: {
    title: "Lettre de plainte : service à la clientèle",
    level: 'CLB 6',
    text: `Montréal, le 15 avril 2026

Service à la clientèle
Magasin ÉlectroPro
2500, boulevard Saint-Laurent
Montréal (Québec) H2X 1Y4

Madame, Monsieur,

Je vous écris pour exprimer ma grande insatisfaction concernant un achat récent effectué dans votre magasin. Le 3 avril dernier, j'ai acheté un réfrigérateur de marque Norglace, modèle FR-450, au prix de 1 899 $. La livraison était promise dans un délai maximum de cinq jours ouvrables.

Or, le réfrigérateur n'est arrivé que le 14 avril, soit presque deux semaines plus tard. De plus, à la livraison, j'ai constaté que la porte était égratignée et que le tiroir à légumes était fissuré. Les deux livreurs m'ont dit que ce n'était pas leur problème et qu'il fallait communiquer avec le magasin.

J'ai ensuite appelé votre service à la clientèle à trois reprises. La première fois, on m'a demandé de rappeler le lendemain. La deuxième fois, on m'a mise en attente pendant quarante-cinq minutes avant de couper la ligne. La troisième fois, une employée polie m'a finalement promis qu'un gérant me rappellerait, mais cela fait maintenant cinq jours et je n'ai aucune nouvelle.

Je demande donc soit un remboursement complet, soit le remplacement immédiat du réfrigérateur par un appareil neuf et en parfait état. J'attends votre réponse écrite dans les dix prochains jours, après quoi je devrai malheureusement déposer une plainte officielle auprès de l'Office de la protection du consommateur.

Veuillez agréer, Madame, Monsieur, mes salutations distinguées.

Caroline Dubois
418-555-0167`,
    questions: [
      { q: "Quand l'achat a-t-il été effectué ?", opts: ['le 3 mars', 'le 3 avril', 'le 14 avril'], a: 1 },
      { q: 'Combien a coûté le réfrigérateur ?', opts: ['899 $', '1 899 $', '2 899 $'], a: 1 },
      { q: "Quels sont les problèmes avec l'appareil livré ?", opts: ['il ne fonctionne pas', 'porte égratignée et tiroir fissuré', 'mauvaise couleur'], a: 1 },
      { q: 'Combien de fois Madame Dubois a-t-elle appelé le service ?', opts: ['une fois', 'deux fois', 'trois fois'], a: 2 },
      { q: 'Que demande-t-elle dans sa lettre ?', opts: ['un rabais', 'un remboursement ou un remplacement', "des excuses seulement"], a: 1 },
      { q: "Dans le texte, « insatisfaction » signifie :", opts: ['joie', 'mécontentement', 'surprise'], a: 1 },
      { q: 'Que fera-t-elle si elle n\'a pas de réponse en dix jours ?', opts: ['écrire une autre lettre', "déposer une plainte officielle", 'rien'], a: 1 },
    ],
  },
  r29: {
    title: "Dépliant : école de langues Bonjour Canada",
    level: 'CLB 5',
    text: `L'école de langues Bonjour Canada, située au cœur de Longueuil, offre des cours de français pour adultes depuis plus de vingt ans. Nos programmes sont conçus spécialement pour les nouveaux arrivants au Québec.

Nous offrons quatre niveaux : débutant, intermédiaire, avancé et perfectionnement. Avant l'inscription, une évaluation gratuite vous est offerte pour déterminer votre niveau exact. Chaque session dure douze semaines et comprend des cours du lundi au jeudi, soit le matin (9 h à midi), soit le soir (18 h à 21 h).

Les classes sont petites — un maximum de quinze élèves — afin de favoriser la participation et l'attention personnalisée. Nos enseignants sont tous certifiés et plusieurs sont eux-mêmes des immigrants. Ils comprennent donc très bien les défis que vous vivez.

En plus des cours réguliers, nous offrons gratuitement chaque semaine un café-rencontre le vendredi après-midi, où les élèves peuvent pratiquer le français dans une ambiance détendue. Des sorties culturelles sont aussi organisées une fois par mois : visite de musées, spectacles ou cabane à sucre au printemps.

Le coût de la session est de 350 $, mais elle est gratuite pour les résidents permanents grâce à un programme du gouvernement. L'inscription se fait en ligne ou directement au bureau, du lundi au vendredi, de 9 h à 17 h. Pour plus d'information, appelez le 450-555-0192.`,
    questions: [
      { q: 'Où est située l\'école ?', opts: ['à Montréal', 'à Longueuil', 'à Laval'], a: 1 },
      { q: "Combien de niveaux sont offerts ?", opts: ['trois', 'quatre', 'cinq'], a: 1 },
      { q: 'Quelle est la durée d\'une session ?', opts: ['8 semaines', '12 semaines', '16 semaines'], a: 1 },
      { q: "Combien d'élèves maximum par classe ?", opts: ['10', '15', '20'], a: 1 },
      { q: 'Combien coûte la session pour un résident permanent ?', opts: ['350 $', '175 $', 'rien, c\'est gratuit'], a: 2 },
      { q: "Dans le texte, « détendue » veut dire :", opts: ['stressante', 'relaxante', 'sérieuse'], a: 1 },
    ],
  },
  r30: {
    title: "L'hiver canadien : bien plus qu'une saison",
    level: 'CLB 6',
    text: `Pour les nouveaux arrivants, l'hiver canadien peut sembler effrayant. Les températures descendent parfois sous les moins trente degrés, la neige tombe pendant des mois et les journées sont courtes. Pourtant, pour la plupart des Canadiens, l'hiver n'est pas seulement une épreuve à endurer : c'est une saison à célébrer.

Dès les premières neiges, en novembre ou en décembre, les paysages deviennent magiques. Les villes sortent leurs lumières et leurs décorations. Au Québec en particulier, les traditions hivernales sont nombreuses. Le Carnaval de Québec, qui a lieu chaque février, attire des visiteurs du monde entier. On peut y voir des sculptures de glace, des courses de canots sur le fleuve Saint-Laurent et le célèbre Bonhomme Carnaval.

Les sports d'hiver occupent aussi une place importante dans la culture canadienne. Le hockey, bien sûr, est une véritable passion nationale. Mais les Canadiens pratiquent également le ski, la raquette, le patin et la motoneige. Dans plusieurs quartiers de Montréal et de Toronto, les patinoires extérieures sont gratuites et accessibles à tous, même aux débutants.

Au printemps, une autre tradition unique commence : la saison des sucres. Les familles vont à la cabane à sucre pour déguster de la tire d'érable sur la neige, du jambon à l'érable et des œufs dans le sirop. C'est un moment chaleureux où l'on chante et danse ensemble.

Bien sûr, l'hiver demande de la préparation : il faut un bon manteau, des bottes chaudes, des gants et de la patience. Mais avec le temps, beaucoup d'immigrants finissent par aimer cette saison difficile, parce qu'elle représente l'esprit du Canada : la résilience, la chaleur humaine et le plaisir de profiter de chaque moment, même quand il fait froid dehors.`,
    questions: [
      { q: "À quelle température peut descendre l'hiver ?", opts: ['-10°C', '-20°C', 'sous -30°C'], a: 2 },
      { q: 'Quand a lieu le Carnaval de Québec ?', opts: ['en décembre', 'en février', 'en avril'], a: 1 },
      { q: 'Quel sport est une « passion nationale » ?', opts: ['le ski', 'le hockey', 'le patin'], a: 1 },
      { q: "Que peut-on faire gratuitement en ville ?", opts: ['skier', 'faire du patin sur les patinoires extérieures', "monter en motoneige"], a: 1 },
      { q: 'Que mange-t-on à la cabane à sucre ?', opts: ['de la pizza', 'de la tire d\'érable et du jambon à l\'érable', "des fruits de mer"], a: 1 },
      { q: "Dans le texte, « résilience » veut dire :", opts: ['la faiblesse', "la capacité de surmonter les difficultés", 'la timidité'], a: 1 },
      { q: "Quel est le message principal du texte ?", opts: ["l'hiver canadien est insupportable", "l'hiver canadien est une saison difficile mais à célébrer", "il faut quitter le Canada en hiver"], a: 1 },
    ],
  },
};

Object.assign(window.READINGS, window.READINGS_MORE);
