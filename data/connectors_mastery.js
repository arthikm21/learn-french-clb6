// Connector Mastery — the 22 most-tested CLB 6 connectors, each with rich
// teaching content + drill items across 4 exercise types.
//
// Per masterplan: connector usage is one of the strongest predictors of CLB 6
// speaking/writing. The goal is automaticity — connectors should appear in the
// learner's output without conscious effort.
//
// Categories follow standard French discourse-marker taxonomy:
//   cause · consequence · contrast · addition · time · reinforcement
//
// Each entry has:
//   examples       — 3 short sentences { fr, en }, audio-ready
//   complete       — fill-the-blank item: { context, contextEn } (EN revealed after answer)
//   recognize      — listen item sentence + recognizeEn (revealed after answer)
//   shadow         — "continue this sentence with X" — lead + leadEn + model + modelEn
//
// The module renders ALL types in one drill session, drawing from any subset.

window.CONNECTORS = [
  // ─────────── CAUSE ───────────
  {
    id: 'parce-que', word: 'parce que', category: 'Cause',
    gloss: 'because',
    when: "The everyday because. Answers <i>pourquoi</i>. Used in speech and writing both.",
    examples: [
      { fr: "Je suis fatigué <b>parce que</b> j'ai mal dormi.", en: "I'm tired because I slept badly." },
      { fr: "Elle est en retard <b>parce que</b> le métro est en panne.", en: "She is late because the metro is broken down." },
      { fr: "Nous restons à la maison <b>parce qu'</b>il pleut.", en: "We're staying home because it's raining." },
    ],
    complete: { context: "Je n'ai pas mangé depuis ce matin ___ j'étais en réunion toute la journée.", contextEn: "I haven't eaten since this morning ___ I was in a meeting all day." },
    recognize: "J'ai pris un taxi parce que j'étais pressé.",
    recognizeEn: "I took a taxi because I was in a hurry.",
    shadow: { prompt: "Continue this sentence with «parce que»:", lead: "Je veux apprendre le français…", leadEn: "I want to learn French…", model: "Je veux apprendre le français parce que je vais déménager au Canada.", modelEn: "I want to learn French because I'm going to move to Canada." },
  },
  {
    id: 'puisque', word: 'puisque', category: 'Cause',
    gloss: 'given that / since (known to both)',
    when: "Use when the reason is already known or obvious to the listener. More formal than parce que.",
    examples: [
      { fr: "<b>Puisque</b> tu es là, aide-moi.", en: "Since you're here, help me." },
      { fr: "<b>Puisque</b> le magasin est fermé, on revient demain.", en: "Since the store is closed, we'll come back tomorrow." },
      { fr: "<b>Puisqu'</b>il fait beau, sortons.", en: "Since the weather is nice, let's go out." },
    ],
    complete: { context: "___ vous parlez français, l'entrevue se fera en français.", contextEn: "___ you speak French, the interview will be in French." },
    recognize: "Puisque tout le monde est d'accord, nous pouvons commencer.",
    recognizeEn: "Since everyone agrees, we can start.",
    shadow: { prompt: "Use «puisque» to continue:", lead: "Puisque tu connais déjà la ville…", leadEn: "Since you already know the city…", model: "Puisque tu connais déjà la ville, tu peux nous guider.", modelEn: "Since you already know the city, you can guide us." },
  },

  // ─────────── CONSEQUENCE ───────────
  {
    id: 'donc', word: 'donc', category: 'Consequence',
    gloss: 'so / therefore',
    when: "Everyday consequence marker. Used constantly in conversation. Works for any cause→effect.",
    examples: [
      { fr: "Il pleut, <b>donc</b> je prends le parapluie.", en: "It's raining, so I'm taking the umbrella." },
      { fr: "Tu es fatiguée, <b>donc</b> repose-toi.", en: "You're tired, so rest." },
      { fr: "Je n'ai pas d'argent, <b>donc</b> je ne peux pas venir.", en: "I don't have money, so I can't come." },
    ],
    complete: { context: "Le bus est en retard, ___ je vais arriver après vous.", contextEn: "The bus is late, ___ I'll arrive after you." },
    recognize: "Mon fils est malade, donc je reste à la maison aujourd'hui.",
    recognizeEn: "My son is sick, so I'm staying home today.",
    shadow: { prompt: "Use «donc» to conclude:", lead: "Le restaurant est fermé le lundi…", leadEn: "The restaurant is closed on Mondays…", model: "Le restaurant est fermé le lundi, donc on ira mardi.", modelEn: "The restaurant is closed on Mondays, so we'll go on Tuesday." },
  },
  {
    id: 'par-consequent', word: 'par conséquent', category: 'Consequence',
    gloss: 'consequently / as a result',
    when: "Formal version of donc. Use in writing and exam speaking when you want to sound CLB 6.",
    examples: [
      { fr: "Le marché a changé. <b>Par conséquent</b>, nous devons adapter notre stratégie.", en: "The market has changed. Consequently, we must adapt our strategy." },
      { fr: "Les vols sont annulés. <b>Par conséquent</b>, nous reportons le voyage.", en: "The flights are cancelled. Consequently, we are postponing the trip." },
      { fr: "Il a réussi son examen. <b>Par conséquent</b>, il est admis à l'université.", en: "He passed his exam. Consequently, he is admitted to the university." },
    ],
    complete: { context: "Les frais de scolarité ont augmenté. ___, beaucoup d'étudiants travaillent à temps partiel.", contextEn: "Tuition fees have gone up. ___, many students work part-time." },
    recognize: "L'usine a fermé. Par conséquent, deux cents personnes ont perdu leur emploi.",
    recognizeEn: "The factory closed. Consequently, two hundred people lost their jobs.",
    shadow: { prompt: "Use «par conséquent» to formally state a consequence:", lead: "Les prix du logement augmentent rapidement…", leadEn: "Housing prices are rising rapidly…", model: "Les prix du logement augmentent rapidement. Par conséquent, beaucoup de familles quittent le centre-ville.", modelEn: "Housing prices are rising rapidly. Consequently, many families are leaving the city centre." },
  },
  {
    id: 'ainsi', word: 'ainsi', category: 'Consequence',
    gloss: 'thus / in this way',
    when: "Formal consequence marker. Often shows the resulting STATE or arrangement, not just the next event.",
    examples: [
      { fr: "Il faut bien dormir. <b>Ainsi</b>, on travaille mieux le lendemain.", en: "You have to sleep well. That way, you work better the next day." },
      { fr: "Elle a beaucoup étudié. <b>Ainsi</b>, elle a réussi.", en: "She studied a lot. Thus, she succeeded." },
      { fr: "Nous avons réorganisé les bureaux. <b>Ainsi</b>, l'équipe communique mieux.", en: "We reorganized the offices. As a result, the team communicates better." },
    ],
    complete: { context: "L'entreprise a investi dans la formation. ___, les employés sont devenus plus compétents.", contextEn: "The company invested in training. ___, the employees became more competent." },
    recognize: "Ils ont automatisé le processus. Ainsi, le temps de production a diminué de moitié.",
    recognizeEn: "They automated the process. Thus, production time has been cut in half.",
    shadow: { prompt: "Use «ainsi» to show the resulting situation:", lead: "Nous avons réduit nos dépenses…", leadEn: "We reduced our spending…", model: "Nous avons réduit nos dépenses. Ainsi, nous pouvons épargner pour l'avenir.", modelEn: "We reduced our spending. Thus, we can save for the future." },
  },

  // ─────────── CONTRAST ───────────
  {
    id: 'mais', word: 'mais', category: 'Contrast',
    gloss: 'but',
    when: "The everyday but. Connects opposing ideas in one sentence. Spoken constantly.",
    examples: [
      { fr: "J'aime le café, <b>mais</b> pas le matin.", en: "I like coffee, but not in the morning." },
      { fr: "Il est intelligent, <b>mais</b> très timide.", en: "He is intelligent, but very shy." },
      { fr: "Je voudrais venir, <b>mais</b> je suis occupé.", en: "I would like to come, but I'm busy." },
    ],
    complete: { context: "Le film était long, ___ vraiment intéressant.", contextEn: "The movie was long, ___ really interesting." },
    recognize: "Marie veut voyager, mais elle n'a pas encore d'argent.",
    recognizeEn: "Marie wants to travel, but she doesn't have money yet.",
    shadow: { prompt: "Use «mais» to add a contrasting idea:", lead: "J'adore Montréal…", leadEn: "I love Montreal…", model: "J'adore Montréal, mais les hivers sont très froids.", modelEn: "I love Montreal, but the winters are very cold." },
  },
  {
    id: 'cependant', word: 'cependant', category: 'Contrast',
    gloss: 'however',
    when: "Formal version of mais. Use at the start of a sentence for a clean break. CLB 6 marker.",
    examples: [
      { fr: "Le projet est ambitieux. <b>Cependant</b>, le budget est limité.", en: "The project is ambitious. However, the budget is limited." },
      { fr: "Elle a beaucoup d'expérience. <b>Cependant</b>, elle manque de leadership.", en: "She has a lot of experience. However, she lacks leadership." },
      { fr: "Le rapport est bien écrit. <b>Cependant</b>, certaines données sont obsolètes.", en: "The report is well written. However, some data is outdated." },
    ],
    complete: { context: "Les ventes ont augmenté ce trimestre. ___, les profits ont diminué.", contextEn: "Sales have increased this quarter. ___, profits have decreased." },
    recognize: "Le travail à distance offre de la flexibilité. Cependant, il isole parfois les employés.",
    recognizeEn: "Remote work offers flexibility. However, it sometimes isolates employees.",
    shadow: { prompt: "Use «cependant» to introduce a formal contrast:", lead: "Le télétravail a beaucoup d'avantages…", leadEn: "Remote work has many advantages…", model: "Le télétravail a beaucoup d'avantages. Cependant, il demande de la discipline.", modelEn: "Remote work has many advantages. However, it requires discipline." },
  },
  {
    id: 'toutefois', word: 'toutefois', category: 'Contrast',
    gloss: 'however / nevertheless',
    when: "Synonym of cependant. Slightly more formal/written. Use to vary your discourse markers in writing.",
    examples: [
      { fr: "Les résultats sont positifs. <b>Toutefois</b>, nous devons rester prudents.", en: "The results are positive. However, we must remain cautious." },
      { fr: "Il faut agir vite. <b>Toutefois</b>, sans précipitation.", en: "We must act fast. However, without rushing." },
      { fr: "Le plan est solide. <b>Toutefois</b>, plusieurs imprévus sont possibles.", en: "The plan is solid. However, several unexpected events are possible." },
    ],
    complete: { context: "La nouvelle loi vise à protéger l'environnement. ___, son application reste difficile.", contextEn: "The new law aims to protect the environment. ___, its application remains difficult." },
    recognize: "L'investissement est important. Toutefois, le retour sera lent.",
    recognizeEn: "The investment is significant. However, the return will be slow.",
    shadow: { prompt: "Use «toutefois» for written-register contrast:", lead: "Cette solution réduit les coûts…", leadEn: "This solution reduces costs…", model: "Cette solution réduit les coûts. Toutefois, elle exige une formation supplémentaire.", modelEn: "This solution reduces costs. However, it requires additional training." },
  },
  {
    id: 'pourtant', word: 'pourtant', category: 'Contrast',
    gloss: 'yet / and yet',
    when: "Use when something is UNEXPECTED or surprising given the previous fact. Stronger emotional weight than cependant.",
    examples: [
      { fr: "Il a étudié toute la nuit, <b>pourtant</b> il a échoué.", en: "He studied all night, yet he failed." },
      { fr: "Elle est très qualifiée, <b>pourtant</b> elle n'a pas trouvé de travail.", en: "She is very qualified, yet she hasn't found a job." },
      { fr: "Je l'ai prévenu plusieurs fois, <b>pourtant</b> il continue.", en: "I warned him several times, yet he keeps going." },
    ],
    complete: { context: "Le restaurant a d'excellentes critiques, ___ il est presque vide ce soir.", contextEn: "The restaurant has excellent reviews, ___ it's almost empty tonight." },
    recognize: "Marie parle quatre langues, pourtant elle se dit timide.",
    recognizeEn: "Marie speaks four languages, yet she says she's shy.",
    shadow: { prompt: "Use «pourtant» for an unexpected contrast:", lead: "Il pleut depuis ce matin…", leadEn: "It's been raining since this morning…", model: "Il pleut depuis ce matin, pourtant il a quand même fait son jogging.", modelEn: "It's been raining since this morning, yet he still went jogging." },
  },
  {
    id: 'en-revanche', word: 'en revanche', category: 'Contrast',
    gloss: 'on the other hand',
    when: "Direct counterpoint — A is X, B in contrast is Y. Use when both halves are factual statements.",
    examples: [
      { fr: "Les jeunes utilisent beaucoup TikTok. <b>En revanche</b>, ils délaissent Facebook.", en: "Young people use TikTok a lot. On the other hand, they're leaving Facebook." },
      { fr: "L'été a été chaud. <b>En revanche</b>, l'hiver s'annonce doux.", en: "Summer was hot. On the other hand, winter looks like it'll be mild." },
      { fr: "Le centre-ville est cher. <b>En revanche</b>, les banlieues offrent plus d'espace.", en: "Downtown is expensive. On the other hand, the suburbs offer more space." },
    ],
    complete: { context: "Le matin, le café est calme. ___, l'après-midi il est bondé.", contextEn: "In the morning, the café is quiet. ___, in the afternoon it's crowded." },
    recognize: "Pierre adore le sport. En revanche, son frère préfère la lecture.",
    recognizeEn: "Pierre loves sports. On the other hand, his brother prefers reading.",
    shadow: { prompt: "Use «en revanche» to contrast two facts:", lead: "Les villes offrent beaucoup d'opportunités…", leadEn: "Cities offer many opportunities…", model: "Les villes offrent beaucoup d'opportunités. En revanche, la qualité de vie y est souvent moindre.", modelEn: "Cities offer many opportunities. On the other hand, the quality of life is often lower there." },
  },
  {
    id: 'alors-que', word: 'alors que', category: 'Contrast',
    gloss: 'whereas / while',
    when: "Contrast within ONE sentence (both halves attached). Often used to highlight inequality or simultaneity.",
    examples: [
      { fr: "Il dort huit heures par nuit, <b>alors que</b> moi je dors cinq.", en: "He sleeps eight hours a night, whereas I sleep five." },
      { fr: "Mon frère adore le sport, <b>alors que</b> je préfère la lecture.", en: "My brother loves sports, whereas I prefer reading." },
      { fr: "Les uns travaillent beaucoup, <b>alors que</b> d'autres profitent.", en: "Some work a lot, whereas others enjoy themselves." },
    ],
    complete: { context: "Marie parle français couramment, ___ son frère apprend encore.", contextEn: "Marie speaks French fluently, ___ her brother is still learning." },
    recognize: "Lui voyage chaque mois, alors que sa sœur reste toujours chez elle.",
    recognizeEn: "He travels every month, whereas his sister always stays home.",
    shadow: { prompt: "Use «alors que» to contrast two people or facts:", lead: "Au Canada il faut payer pour la pharmacie…", leadEn: "In Canada you have to pay for pharmacy…", model: "Au Canada il faut payer pour la pharmacie, alors qu'en France elle est remboursée.", modelEn: "In Canada you have to pay for pharmacy, whereas in France it's reimbursed." },
  },
  {
    id: 'tandis-que', word: 'tandis que', category: 'Contrast',
    gloss: 'while / whereas (formal)',
    when: "Formal synonym of alors que. Slightly more written. Often used in essays and reports.",
    examples: [
      { fr: "Les anciens travaillaient en usine, <b>tandis que</b> les jeunes préfèrent les bureaux.", en: "Older people used to work in factories, whereas young people prefer offices." },
      { fr: "Les uns économisent, <b>tandis que</b> d'autres dépensent.", en: "Some save, whereas others spend." },
      { fr: "Elle écoute, <b>tandis qu'</b>il n'arrête pas de parler.", en: "She listens, whereas he doesn't stop talking." },
    ],
    complete: { context: "Les grandes villes attirent les jeunes diplômés, ___ les régions rurales se vident.", contextEn: "Big cities attract young graduates, ___ rural regions are emptying out." },
    recognize: "Les pays riches consomment beaucoup, tandis que les pays pauvres polluent peu.",
    recognizeEn: "Rich countries consume a lot, whereas poor countries pollute little.",
    shadow: { prompt: "Use «tandis que» in a formal contrast:", lead: "Certains pays misent sur l'énergie nucléaire…", leadEn: "Some countries bet on nuclear energy…", model: "Certains pays misent sur l'énergie nucléaire, tandis que d'autres préfèrent les énergies renouvelables.", modelEn: "Some countries bet on nuclear energy, whereas others prefer renewable energy." },
  },

  // ─────────── ADDITION ───────────
  {
    id: 'd-ailleurs', word: "d'ailleurs", category: 'Addition',
    gloss: 'moreover / besides (which)',
    when: "Adds a supporting point that reinforces what you just said. Has a slight 'and now that I think about it' feel.",
    examples: [
      { fr: "Ce livre est excellent. <b>D'ailleurs</b>, il a gagné un prix.", en: "This book is excellent. In fact, it won an award." },
      { fr: "Il connaît bien la région. <b>D'ailleurs</b>, il y est né.", en: "He knows the region well. In fact, he was born there." },
      { fr: "Le projet avance bien. <b>D'ailleurs</b>, nous avons reçu un nouveau client.", en: "The project is going well. In fact, we got a new client." },
    ],
    complete: { context: "Marie parle couramment français. ___, elle a étudié à Paris pendant deux ans.", contextEn: "Marie speaks French fluently. ___, she studied in Paris for two years." },
    recognize: "Le quartier est très agréable. D'ailleurs, beaucoup d'artistes y vivent.",
    recognizeEn: "The neighbourhood is very pleasant. In fact, many artists live there.",
    shadow: { prompt: "Use «d'ailleurs» to reinforce with a related fact:", lead: "Cette université est très réputée…", leadEn: "This university is very renowned…", model: "Cette université est très réputée. D'ailleurs, plusieurs prix Nobel y ont enseigné.", modelEn: "This university is very renowned. In fact, several Nobel laureates have taught there." },
  },

  // ─────────── REINFORCEMENT ───────────
  {
    id: 'en-effet', word: 'en effet', category: 'Reinforcement',
    gloss: 'indeed',
    when: "Confirms or backs up what was just said with EVIDENCE or explanation. Different from 'pourtant' — same direction, not opposing.",
    examples: [
      { fr: "Le climat change rapidement. <b>En effet</b>, les températures battent des records chaque année.", en: "The climate is changing fast. Indeed, temperatures are breaking records every year." },
      { fr: "Cette région est dangereuse. <b>En effet</b>, plusieurs accidents y sont arrivés.", en: "This region is dangerous. Indeed, several accidents have happened there." },
      { fr: "Il est très compétent. <b>En effet</b>, il a quinze ans d'expérience.", en: "He is very competent. Indeed, he has fifteen years of experience." },
    ],
    complete: { context: "Le tabac nuit à la santé. ___, c'est la première cause de cancer évitable.", contextEn: "Tobacco harms health. ___, it's the leading cause of preventable cancer." },
    recognize: "Cette ville attire les touristes. En effet, elle reçoit dix millions de visiteurs par an.",
    recognizeEn: "This city attracts tourists. Indeed, it receives ten million visitors per year.",
    shadow: { prompt: "Use «en effet» to back up your claim with evidence:", lead: "Le marché du travail est tendu…", leadEn: "The job market is tight…", model: "Le marché du travail est tendu. En effet, beaucoup d'entreprises peinent à recruter.", modelEn: "The job market is tight. Indeed, many companies are struggling to recruit." },
  },

  // ─────────── SEQUENCE ───────────
  {
    id: 'd-abord', word: "d'abord", category: 'Sequence',
    gloss: 'first / first of all',
    when: "Opens a list of steps or arguments. THE way to start a structured answer in the TCF speaking tasks: d'abord… ensuite… enfin.",
    examples: [
      { fr: "<b>D'abord</b>, je vais présenter le problème.", en: "First, I will present the problem." },
      { fr: "<b>D'abord</b>, faites bouillir l'eau.", en: "First, boil the water." },
      { fr: "<b>D'abord</b>, il faut remplir le formulaire en ligne.", en: "First, you have to fill out the form online." },
    ],
    complete: { context: "___, nous allons visiter l'appartement ; ensuite, nous signerons le bail.", contextEn: "___, we will visit the apartment; then we will sign the lease." },
    recognize: "D'abord, je voudrais vous remercier d'être venus.",
    recognizeEn: "First of all, I would like to thank you for coming.",
    shadow: { prompt: "Start a structured answer with «d'abord»:", lead: "Pourquoi voulez-vous immigrer au Canada ?", leadEn: "Why do you want to immigrate to Canada?", model: "D'abord, je veux offrir une meilleure éducation à mes enfants.", modelEn: "First, I want to offer a better education to my children." },
  },
  {
    id: 'ensuite', word: 'ensuite', category: 'Sequence',
    gloss: 'then / next',
    when: "The middle step. Chains actions or arguments after d'abord. Interchangeable with 'puis' in most contexts.",
    examples: [
      { fr: "<b>Ensuite</b>, ajoutez le sel et le poivre.", en: "Next, add the salt and pepper." },
      { fr: "Nous avons visité le musée, <b>ensuite</b> nous avons mangé au restaurant.", en: "We visited the museum, then we ate at the restaurant." },
      { fr: "<b>Ensuite</b>, vous recevrez une confirmation par courriel.", en: "Then you will receive a confirmation by email." },
    ],
    complete: { context: "D'abord, remplissez le formulaire ; ___, envoyez-le avec vos documents.", contextEn: "First, fill out the form; ___, send it with your documents." },
    recognize: "Ensuite, le médecin m'a prescrit des antibiotiques.",
    recognizeEn: "Then the doctor prescribed me antibiotics.",
    shadow: { prompt: "Continue the steps with «ensuite»:", lead: "D'abord, j'ai cherché un logement…", leadEn: "First, I looked for housing…", model: "D'abord, j'ai cherché un logement, ensuite j'ai ouvert un compte bancaire.", modelEn: "First I looked for housing, then I opened a bank account." },
  },
  {
    id: 'enfin', word: 'enfin', category: 'Sequence',
    gloss: 'finally / lastly',
    when: "Closes the list — the last step or final argument. In speech it can also mean relief: Enfin ! (At last!)",
    examples: [
      { fr: "<b>Enfin</b>, n'oubliez pas de signer le document.", en: "Finally, don't forget to sign the document." },
      { fr: "<b>Enfin</b>, je voudrais parler du coût de la vie.", en: "Lastly, I would like to talk about the cost of living." },
      { fr: "Après six mois d'attente, le visa est <b>enfin</b> arrivé !", en: "After six months of waiting, the visa finally arrived!" },
    ],
    complete: { context: "D'abord le passeport, ensuite les photos, et ___ le paiement des frais.", contextEn: "First the passport, then the photos, and ___ the payment of fees." },
    recognize: "Enfin, je recommande de réserver à l'avance.",
    recognizeEn: "Finally, I recommend booking in advance.",
    shadow: { prompt: "Close your argument with «enfin»:", lead: "D'abord le climat, ensuite le travail…", leadEn: "First the climate, then work…", model: "D'abord le climat, ensuite le travail, et enfin la qualité de vie : voilà pourquoi j'ai choisi le Canada.", modelEn: "First the climate, then work, and finally quality of life: that's why I chose Canada." },
  },

  // ─────────── ADDITION (more) ───────────
  {
    id: 'de-plus', word: 'de plus', category: 'Addition',
    gloss: 'in addition / furthermore',
    when: "Stacks a second argument on top of the first. More formal than 'aussi' — perfect for TCF writing and the opinion monologue.",
    examples: [
      { fr: "Le vélo est économique. <b>De plus</b>, il est bon pour la santé.", en: "Cycling is economical. In addition, it is good for your health." },
      { fr: "Cet appartement est bien situé. <b>De plus</b>, le loyer est raisonnable.", en: "This apartment is well located. Furthermore, the rent is reasonable." },
      { fr: "Le télétravail fait gagner du temps. <b>De plus</b>, il réduit le stress.", en: "Remote work saves time. In addition, it reduces stress." },
    ],
    complete: { context: "Apprendre le français ouvre des portes au travail. ___, c'est essentiel pour la vie quotidienne au Québec.", contextEn: "Learning French opens doors at work. ___, it's essential for daily life in Quebec." },
    recognize: "Ce quartier est sécuritaire. De plus, il y a une école à deux minutes.",
    recognizeEn: "This neighbourhood is safe. In addition, there is a school two minutes away.",
    shadow: { prompt: "Add a second argument with «de plus»:", lead: "Les transports en commun sont pratiques…", leadEn: "Public transit is convenient…", model: "Les transports en commun sont pratiques. De plus, ils sont meilleurs pour l'environnement.", modelEn: "Public transit is convenient. In addition, it is better for the environment." },
  },

  // ─────────── ILLUSTRATION ───────────
  {
    id: 'par-exemple', word: 'par exemple', category: 'Illustration',
    gloss: 'for example',
    when: "Backs an argument with a concrete case. Examiners reward speakers who illustrate every claim — make this automatic.",
    examples: [
      { fr: "J'aime les sports d'hiver, <b>par exemple</b> le ski et le patinage.", en: "I like winter sports, for example skiing and skating." },
      { fr: "Certains services sont gratuits, <b>par exemple</b> la bibliothèque.", en: "Some services are free, for example the library." },
      { fr: "Il y a plusieurs solutions. <b>Par exemple</b>, on pourrait covoiturer.", en: "There are several solutions. For example, we could carpool." },
    ],
    complete: { context: "La ville offre beaucoup d'activités gratuites, ___ les festivals d'été.", contextEn: "The city offers many free activities, ___ the summer festivals." },
    recognize: "Plusieurs langues sont parlées ici, par exemple l'arabe et l'espagnol.",
    recognizeEn: "Several languages are spoken here, for example Arabic and Spanish.",
    shadow: { prompt: "Illustrate your claim with «par exemple»:", lead: "La vie au Canada a des avantages…", leadEn: "Life in Canada has advantages…", model: "La vie au Canada a des avantages, par exemple la sécurité et les services publics.", modelEn: "Life in Canada has advantages, for example safety and public services." },
  },

  // ─────────── CAUSE (more) ───────────
  {
    id: 'grace-a', word: 'grâce à', category: 'Cause',
    gloss: 'thanks to (positive cause)',
    when: "Positive causes ONLY — something good happened because of it. Followed by a NOUN, not a clause.",
    examples: [
      { fr: "<b>Grâce à</b> mes cours, je parle mieux français.", en: "Thanks to my classes, I speak French better." },
      { fr: "<b>Grâce au</b> métro, j'arrive toujours à l'heure.", en: "Thanks to the metro, I always arrive on time." },
      { fr: "Elle a trouvé un emploi <b>grâce à</b> son réseau.", en: "She found a job thanks to her network." },
    ],
    complete: { context: "J'ai réussi mon examen ___ l'aide de mon professeur.", contextEn: "I passed my exam ___ the help of my teacher." },
    recognize: "Grâce à l'application, je pratique mon français tous les jours.",
    recognizeEn: "Thanks to the app, I practise my French every day.",
    shadow: { prompt: "Credit a positive cause with «grâce à»:", lead: "J'ai trouvé mon appartement…", leadEn: "I found my apartment…", model: "J'ai trouvé mon appartement grâce à un ami qui connaissait le propriétaire.", modelEn: "I found my apartment thanks to a friend who knew the landlord." },
  },
  {
    id: 'a-cause-de', word: 'à cause de', category: 'Cause',
    gloss: 'because of (negative cause)',
    when: "Negative or neutral causes — problems, delays, bad weather. Followed by a NOUN. The evil twin of grâce à.",
    examples: [
      { fr: "Le vol est annulé <b>à cause de</b> la tempête.", en: "The flight is cancelled because of the storm." },
      { fr: "Je suis en retard <b>à cause du</b> trafic.", en: "I am late because of the traffic." },
      { fr: "<b>À cause des</b> travaux, la rue est fermée.", en: "Because of the construction, the street is closed." },
    ],
    complete: { context: "L'école est fermée aujourd'hui ___ la tempête de neige.", contextEn: "School is closed today ___ the snowstorm." },
    recognize: "À cause de la grève, les autobus ne circulent pas.",
    recognizeEn: "Because of the strike, the buses are not running.",
    shadow: { prompt: "Explain a problem with «à cause de»:", lead: "Je n'ai pas pu venir à la réunion…", leadEn: "I couldn't come to the meeting…", model: "Je n'ai pas pu venir à la réunion à cause d'un rendez-vous chez le médecin.", modelEn: "I couldn't come to the meeting because of a doctor's appointment." },
  },

  // ─────────── CONCESSION ───────────
  {
    id: 'quand-meme', word: 'quand même', category: 'Contrast',
    gloss: 'still / anyway / all the same',
    when: "Spoken French's favourite concession: despite the obstacle, the thing happens anyway. Usually placed AFTER the verb.",
    examples: [
      { fr: "Il pleuvait, mais on est sortis <b>quand même</b>.", en: "It was raining, but we went out anyway." },
      { fr: "C'est cher, mais je vais le prendre <b>quand même</b>.", en: "It's expensive, but I'll take it anyway." },
      { fr: "Je suis fatigué, mais je vais <b>quand même</b> finir le travail.", en: "I'm tired, but I'll still finish the work." },
    ],
    complete: { context: "Le restaurant était complet, mais on a ___ trouvé une petite table.", contextEn: "The restaurant was full, but we ___ found a small table." },
    recognize: "C'était difficile, mais j'ai quand même réussi l'examen.",
    recognizeEn: "It was hard, but I still passed the exam.",
    shadow: { prompt: "Concede the obstacle, then push through with «quand même»:", lead: "Le français est difficile…", leadEn: "French is difficult…", model: "Le français est difficile, mais je pratique quand même tous les jours.", modelEn: "French is difficult, but I still practise every day." },
  },
];
