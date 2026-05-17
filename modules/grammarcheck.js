// Heuristic French grammar checker for writing.
// Detects real errors using VOCAB gender data + pattern rules.
// Returns array of { span, type, message, suggestion }.
window.GrammarCheck = (function () {
  let genderMap = null;

  function buildGenderMap() {
    if (genderMap) return genderMap;
    genderMap = { m: new Set(), f: new Set() };
    if (window.VOCAB) {
      for (const k of Object.keys(window.VOCAB)) {
        for (const c of (window.VOCAB[k].cards || [])) {
          if (!c.g) continue;
          let noun = String(c.fr).toLowerCase()
            .replace(/^(le |la |l'|les |un |une |des |de la |du |de l')/, '')
            .trim();
          if (noun) genderMap[c.g].add(noun);
        }
      }
    }
    // Hard-coded common nouns that learners get wrong
    const F_EXTRA = ['femme','fille','sœur','mère','grand-mère','tante','cousine','amie','maison','école','table','chaise','voiture','fenêtre','porte','salle','semaine','minute','heure','journée','soirée','année','vie','famille','décision','question','réponse','idée','histoire','musique','église','plage','cuisine','chambre','salade','pomme','pluie','neige','santé','main','jambe','tête','bouche','oreille','peau','dent','jupe','robe','chaussure','église','liberté','beauté','université','bibliothèque'];
    const M_EXTRA = ['homme','garçon','frère','père','grand-père','oncle','cousin','ami','livre','chien','chat','bureau','téléphone','ordinateur','jardin','parc','restaurant','magasin','hôpital','musée','train','avion','vélo','jour','soir','matin','mois','an','siècle','temps','travail','emploi','bonheur','problème','sujet','exemple','message','texte','film','sport','pied','nez','dos','bras','cou','genou','doigt','pantalon','chapeau','manteau','soleil','vent','ciel','nuage'];
    F_EXTRA.forEach(n => genderMap.f.add(n));
    M_EXTRA.forEach(n => genderMap.m.add(n));
    return genderMap;
  }

  function findGender(word) {
    const m = buildGenderMap();
    const w = String(word).toLowerCase().replace(/[.,!?;:]/g, '').trim();
    if (m.f.has(w)) return 'f';
    if (m.m.has(w)) return 'm';
    return null;
  }

  // Être-verb past participles (DR & MRS VANDERTRAMP). For passé composé checker.
  const ETRE_VERBS = new Set([
    'allé','allée','allés','allées',
    'arrivé','arrivée','arrivés','arrivées',
    'venu','venue','venus','venues',
    'parti','partie','partis','parties',
    'sorti','sortie','sortis','sorties',
    'rentré','rentrée','rentrés','rentrées',
    'tombé','tombée','tombés','tombées',
    'monté','montée','montés','montées',
    'descendu','descendue','descendus','descendues',
    'resté','restée','restés','restées',
    'né','née','nés','nées',
    'mort','morte','morts','mortes',
    'devenu','devenue','devenus','devenues',
    'retourné','retournée','retournés','retournées',
    'entré','entrée','entrés','entrées',
  ]);
  // Avoir-verb past participles (common ones — to catch "je suis mangé")
  const AVOIR_VERBS = new Set([
    'mangé','bu','vu','lu','écrit','fait','pris','mis','dit','eu','été','su','pu','voulu','dû','reçu','tenu','vécu','connu','appris','compris','attendu','vendu','perdu','rendu','répondu','entendu','ouvert','offert','souffert','découvert','peint','craint','éteint','plu','écouté','regardé','aimé','parlé','travaillé','étudié','joué','dansé','chanté','marché','téléphoné','demandé','cherché','trouvé','acheté','vendu','choisi','fini','réussi','dormi','sorti'/* sortir can be avoir if transitive — edge case */,
  ]);

  function check(text) {
    const errors = [];
    const add = (span, type, message, suggestion = '') => errors.push({ span, type, message, suggestion });

    // 1. Missing elision: "je ai", "je habite", "ne est", "le école", "la enfant"...
    const elisionPatterns = [
      { re: /\bje\s+(ai|as|aime|aimes|écoute|écris|écoutes|écris|étudie|habite|habites|écoutais|aimais|adore)\b/gi, msg: 'Missing elision. "je" + vowel → "j\'"', fix: m => `j'${m.split(/\s+/)[1]}` },
      { re: /\bne\s+(a|as|est|était|étaient|aime|aimes|écoute|étudie|ouvre|ouvres)\b/gi, msg: 'Missing elision. "ne" + vowel → "n\'"' },
      { re: /\b(le|la)\s+(école|enfant|homme|hôtel|orange|ami|amie|étudiant|étudiante|argent|eau|air|exemple|histoire|idée|île|île|université|hôpital|arbre)\b/gi, msg: 'Missing elision. "le/la" + vowel → "l\'"' },
      { re: /\bme\s+appelle\b/gi, msg: 'Missing elision. "me appelle" → "m\'appelle"' },
      { re: /\bque\s+est\b/gi, msg: 'Missing elision. "que est" → "qu\'est"' },
      { re: /\bse\s+appelle\b/gi, msg: 'Missing elision. "se appelle" → "s\'appelle"' },
      { re: /\bde\s+(eau|air|argent|aujourd'hui|hier)\b/gi, msg: 'Missing elision. "de" + vowel → "d\'"' },
    ];
    for (const p of elisionPatterns) {
      let m;
      while ((m = p.re.exec(text)) !== null) add(m[0], 'elision', p.msg);
    }

    // 2. Gender mismatch with articles
    const articleRE = /\b(le|la|un|une|du|de la|au|à la|ce|cette)\s+([a-zà-ÿ]+)/gi;
    let m;
    while ((m = articleRE.exec(text)) !== null) {
      const article = m[1].toLowerCase();
      const noun = m[2].toLowerCase();
      const g = findGender(noun);
      if (!g) continue;
      const isMascArt = ['le','un','du','au','ce'].includes(article);
      const isFemArt = ['la','une','de la','à la','cette'].includes(article);
      if (g === 'f' && isMascArt) {
        const fix = { le: 'la', un: 'une', du: 'de la', au: 'à la', ce: 'cette' }[article];
        add(m[0], 'gender', `"${noun}" is feminine. Use "${fix}" instead of "${article}".`, `${fix} ${noun}`);
      } else if (g === 'm' && isFemArt) {
        const fix = { la: 'le', une: 'un', 'de la': 'du', 'à la': 'au', cette: 'ce' }[article];
        add(m[0], 'gender', `"${noun}" is masculine. Use "${fix}" instead of "${article}".`, `${fix} ${noun}`);
      }
    }

    // 3. Wrong auxiliary in passé composé: "je suis mangé" / "j'ai allé"
    // Pattern: [subject pronoun] [être/avoir form] [past participle]
    const pcRE = /\b(j['e]\s*ai|tu\s+as|il\s+a|elle\s+a|on\s+a|nous\s+avons|vous\s+avez|ils\s+ont|elles\s+ont|je\s+suis|tu\s+es|il\s+est|elle\s+est|on\s+est|nous\s+sommes|vous\s+êtes|ils\s+sont|elles\s+sont)\s+([a-zà-ÿ]+)/gi;
    while ((m = pcRE.exec(text)) !== null) {
      const aux = m[1].toLowerCase().replace(/\s+/g, ' ');
      const pp = m[2].toLowerCase();
      const isEtreAux = /(je\s+suis|tu\s+es|il\s+est|elle\s+est|on\s+est|nous\s+sommes|vous\s+êtes|ils\s+sont|elles\s+sont)/.test(aux);
      const isAvoirAux = !isEtreAux;
      if (isAvoirAux && ETRE_VERBS.has(pp)) {
        // j'ai allé → je suis allé
        const subjMap = { "j'ai": 'je suis', 'tu as': 'tu es', 'il a': 'il est', 'elle a': 'elle est', 'on a': 'on est', 'nous avons': 'nous sommes', 'vous avez': 'vous êtes', 'ils ont': 'ils sont', 'elles ont': 'elles sont' };
        const fix = subjMap[aux] || subjMap[aux.replace(/\s/g, ' ')];
        add(m[0], 'auxiliary', `"${pp}" is a movement/state verb — uses être, not avoir. Use "${fix}".`, fix ? `${fix} ${pp}` : '');
      } else if (isEtreAux && AVOIR_VERBS.has(pp)) {
        const subjMap = { 'je suis': "j'ai", 'tu es': 'tu as', 'il est': 'il a', 'elle est': 'elle a', 'on est': 'on a', 'nous sommes': 'nous avons', 'vous êtes': 'vous avez', 'ils sont': 'ils ont', 'elles sont': 'elles ont' };
        const fix = subjMap[aux];
        add(m[0], 'auxiliary', `"${pp}" uses avoir, not être. Use "${fix}".`, fix ? `${fix} ${pp}` : '');
      }
    }

    // 4. Wrong tense after "si" of condition
    const siFutur = /\bsi\s+(je|j['e]|tu|il|elle|on|nous|vous|ils|elles)\s+([a-zà-ÿ]+(?:rai|ras|ra|rons|rez|ront))\b/gi;
    while ((m = siFutur.exec(text)) !== null) {
      add(m[0], 'si-tense', `Never use futur after "si" of condition. Use present tense instead.`);
    }
    const siCond = /\bsi\s+(je|j['e]|tu|il|elle|on|nous|vous|ils|elles)\s+([a-zà-ÿ]+(?:rais|rait|rions|riez|raient))\b/gi;
    while ((m = siCond.exec(text)) !== null) {
      add(m[0], 'si-tense', `Never use conditional after "si". Use imparfait instead.`);
    }

    // 5. AVOIR idioms used with être incorrectly
    const avoirIdioms = /\bje\s+suis\s+(\d+\s*ans?|faim|soif|chaud|froid|peur|sommeil|raison|tort|envie|besoin)\b/gi;
    while ((m = avoirIdioms.exec(text)) !== null) {
      add(m[0], 'idiom', `Use AVOIR for "${m[1]}", not être. (j'ai faim, j'ai 25 ans, etc.)`);
    }

    // 6. Incomplete negation: "ne X" without pas/jamais/rien/plus/personne
    const negRE = /\b(je|tu|il|elle|on|nous|vous|ils|elles)\s+ne\s+([a-zà-ÿ]+(?:e|es|ons|ez|ent|is|it|us|ut))\b(?!\s+(pas|jamais|rien|plus|personne|que|guère|aucun))/gi;
    while ((m = negRE.exec(text)) !== null) {
      // Heuristic — also need to make sure "pas" doesn't come within 2-3 words. Already in lookahead.
      add(m[0], 'negation', 'Negation is incomplete. Add "pas" (or "jamais/rien/plus/personne") after the verb.');
    }

    // 7. Plural adjective agreement: "des chats noir" or "des chiennes noir"
    const pluralAdj = /\b(des|les)\s+([a-zà-ÿ]+s)\s+([a-zà-ÿ]+)(?![a-zà-ÿ])/gi;
    while ((m = pluralAdj.exec(text)) !== null) {
      const adj = m[3].toLowerCase();
      // Common short adjectives that should agree
      const shortAdjs = ['noir','blanc','rouge','vert','bleu','jaune','grand','petit','beau','joli','bon','gentil','gros','fort','jeune','vieux','vrai','faux','simple','difficile','facile','propre','sale','vide','plein'];
      if (shortAdjs.includes(adj)) {
        add(m[0], 'agreement', `Adjective should agree with plural noun. Try "${adj}s".`);
      }
    }

    // 8. Common Anglicisms / direct translations
    const anglicisms = [
      { re: /\bje\s+suis\s+d['e]?accord/gi, msg: '', ok: true },
      { re: /\bj['e]\s*aime\s+(beaucoup|bien)\s+vous\b/gi, msg: 'Awkward: try "Je vous aime beaucoup."' },
      { re: /\bregarde\s+pour\b/gi, msg: '"Regarder pour" is Anglicism. Use "chercher".' },
      { re: /\bje\s+suis\s+ennuyé\b/gi, msg: '"je suis ennuyé" sounds wrong. For "I am bored" use "je m\'ennuie".' },
      { re: /\bdes\s+temps\s+en\s+temps\b/gi, msg: '"de temps en temps" (no s on des).' },
    ];
    for (const a of anglicisms) {
      if (a.ok) continue;
      while ((m = a.re.exec(text)) !== null) add(m[0], 'anglicism', a.msg);
    }

    // De-duplicate by span text
    const seen = new Set();
    return errors.filter(e => {
      const k = e.span + '|' + e.type;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  return { check };
})();
