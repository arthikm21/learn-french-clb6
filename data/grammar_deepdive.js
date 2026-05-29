// Grammar deep-dive overlays. Merges into existing GRAMMAR units by id.
// Adds optional fields: pattern (5+ examples), why (logical/historical reason),
// enBridge (English equivalent callout), contrast (look-alike forms).
//
// The grammar render module already checks for these fields and shows them
// as Pattern → Why → English bridge → Rule → Contrast → Drill sections.

(function () {
  const DEEP_DIVE = {
    // ─────────────────── Passé Composé ───────────────────
    'g8-passe-compose': {
      pattern: [
        "Hier, j'<em>ai mangé</em> une pizza. (Yesterday I ate a pizza.)",
        "Marie <em>a fini</em> son travail. (Marie finished her work.)",
        "Nous <em>avons vu</em> le film. (We saw the film.)",
        "Tu <em>es parti</em> tôt. (You left early.)",
        "Elle <em>est arrivée</em> à 8h. (She arrived at 8.)",
      ],
      why: `Passé composé literally means "composed past" — built from two pieces: an <b>auxiliary</b> (avoir or être, present tense) + a <b>past participle</b>. Why two parts? Because in old French (and modern English: "I have eaten"), the past participle started as an adjective describing the result. "I have a pizza eaten" → over time → "I ate a pizza." The structure stuck.`,
      enBridge: `English collapsed this same construction over centuries: "I have eaten" → "I ate." French kept the two-part form everywhere in everyday speech. Whenever you want to say "I did X" or "I have done X" in casual French, use passé composé. (Literary French uses passé simple, but you won't hear it.)`,
      contrast: [
        { form: "J'ai mangé.", gloss: "Action completed, finished. (Passé composé)" },
        { form: "Je mangeais.", gloss: "Ongoing past habit or description. (Imparfait — different unit)" },
        { form: "J'ai été malade.", gloss: "Was sick (and recovered). One-time state." },
        { form: "J'étais malade.", gloss: "Used to be sick. Ongoing past condition." },
      ],
    },

    // ─────────────────── Imparfait ───────────────────
    'g10-imparfait': {
      pattern: [
        "Quand j'<em>étais</em> petit, j'<em>aimais</em> le chocolat.",
        "Tous les étés, nous <em>allions</em> à la mer.",
        "Il <em>pleuvait</em>, j'<em>étais</em> fatigué.",
        "Elle <em>parlait</em> doucement.",
        "Nous <em>habitions</em> à Lyon à l'époque.",
      ],
      why: `Imparfait paints the past as a film that's still rolling — not a snapshot. The name itself, "imparfait" = "unfinished," signals an action without a clear endpoint. Use it for backdrops, habits, descriptions, mental/physical states. The endings (-ais, -ait, -ions, -iez, -aient) all come from Latin imperfect tense and have been remarkably stable for 1500 years.`,
      enBridge: `English signals imparfait three ways: "used to do" (Je jouais = I used to play), "was doing" (Il pleuvait = It was raining), or simple past + context (Quand j'étais petit = When I was little). The key test: does the sentence describe how things were, OR does it report a specific event that happened? If it's a movie still rolling, use imparfait. If it's a snapshot of "and then X happened," use passé composé.`,
      contrast: [
        { form: "Je mangeais quand il est arrivé.", gloss: "I was eating (backdrop) when he arrived (event)." },
        { form: "J'ai mangé puis il est arrivé.", gloss: "I ate, then he arrived. Two completed events in sequence." },
        { form: "Il faisait beau hier.", gloss: "It was nice yesterday (describing). Imparfait." },
        { form: "Il a fait beau hier.", gloss: "It was nice yesterday (the day, as a closed event). Passé composé." },
      ],
    },

    // ─────────────────── Object Pronouns ───────────────────
    'g11-pronouns': {
      pattern: [
        "Je vois Marie. → Je <em>la</em> vois.",
        "Tu manges les pommes. → Tu <em>les</em> manges.",
        "Il parle à Paul. → Il <em>lui</em> parle.",
        "Elle écrit à ses parents. → Elle <em>leur</em> écrit.",
        "Vous m'aidez. (You help me.)",
      ],
      why: `In French, pronouns come <b>before</b> the verb — not after, like in English. This is a leftover from Latin word order, where unstressed pronouns "clitic-attached" to the verb. The form depends on the pronoun's job: <b>direct object</b> (me, te, le, la, nous, vous, les) replaces the thing acted on; <b>indirect object</b> (me, te, lui, nous, vous, leur) replaces a person reached "à" something — to, for.`,
      enBridge: `English keeps subject and object in the same simple line: "I see her." French flips it: "Je la vois" — literally "I her see." This trips up every English speaker initially. Drill: after you know what you want to say, pause, find the object, drop the pronoun BEFORE the verb. Two seconds of pause beats a wrong sentence.`,
      contrast: [
        { form: "Je <b>la</b> vois. (direct)", gloss: "I see her. la = the woman/thing being seen." },
        { form: "Je <b>lui</b> parle. (indirect)", gloss: "I talk TO her. lui = the person reached." },
        { form: "Je <b>les</b> aime. (direct plural)", gloss: "I love them." },
        { form: "Je <b>leur</b> donne. (indirect plural)", gloss: "I give TO them." },
      ],
    },

    // ─────────────────── y and en ───────────────────
    'g14-y-en': {
      pattern: [
        "Tu vas à Paris ? — Oui, j'<em>y</em> vais.",
        "Il habite à Lyon. → Il <em>y</em> habite.",
        "Tu veux du café ? — Oui, j'<em>en</em> veux.",
        "Elle parle de ses vacances. → Elle <em>en</em> parle.",
        "Nous avons trois enfants. → Nous <em>en</em> avons trois.",
      ],
      why: `These two tiny pronouns are workhorses. <b>Y</b> replaces a place introduced by <b>à</b>, <b>en</b>, <b>dans</b>, etc. — "there." <b>En</b> replaces something introduced by <b>de</b> — "some," "of it," "of them." Both come from Latin <i>ibi</i> ("there") and <i>inde</i> ("from there"). They survived because they're short, fast, and avoid repetition.`,
      enBridge: `English uses "there" and "of it" / "some" — usually shoved at the end: "I want some" or "I'm going there." French jams them right before the verb: "J'en veux" / "J'y vais." The decision tree: is the thing introduced by <b>à</b> or a location? → use <b>y</b>. Introduced by <b>de</b> or a quantity? → use <b>en</b>. See the <a onclick="App.go('deepdive',{topic:'yen'})" style="color:var(--accent);cursor:pointer">y vs en decision tree</a>.`,
      contrast: [
        { form: "J'y vais. (à Paris)", gloss: "I go there. Place with à." },
        { form: "J'en viens. (de Paris)", gloss: "I come from there. Place with de." },
        { form: "J'y pense. (à mon travail)", gloss: "I think about it. penser à." },
        { form: "J'en parle. (de mon travail)", gloss: "I talk about it. parler de." },
      ],
    },

    // ─────────────────── Relative pronouns ───────────────────
    'g15-relative': {
      pattern: [
        "La femme <em>qui</em> parle est ma sœur. (subject)",
        "Le livre <em>que</em> je lis. (object)",
        "L'homme <em>dont</em> je parle. (de + person)",
        "La ville <em>où</em> j'habite. (place / time)",
        "L'ami <em>à qui</em> j'écris. (à + person)",
      ],
      why: `Relative pronouns link two ideas into one sentence. The choice depends on the pronoun's job inside the relative clause: <b>qui</b> for the subject, <b>que</b> for the direct object, <b>dont</b> for anything tied to <b>de</b>, <b>où</b> for places and times. They're not interchangeable — using the wrong one is one of the fastest tells of a non-native speaker.`,
      enBridge: `English collapses all of these into "who" / "that" / "which" — and often even drops them: "The book I'm reading." French requires the pronoun ALWAYS, and you must pick the right one. Trick: cover the relative pronoun, then complete the second clause and ask "what's the missing role?" If the missing thing is the subject → qui. Object → que. Linked by "of" → dont. Place/time → où.`,
      contrast: [
        { form: "La femme qui parle…", gloss: "qui = SUBJECT of parle." },
        { form: "La femme que je connais…", gloss: "que = direct OBJECT of connais." },
        { form: "La femme dont je parle…", gloss: "dont = parler DE quelqu'un." },
        { form: "La ville où je travaille.", gloss: "où = LOCATION." },
      ],
    },

    // ─────────────────── Conditional ───────────────────
    'g17-conditional': {
      pattern: [
        "Je <em>voudrais</em> un café, s'il vous plaît.",
        "Tu <em>devrais</em> dormir plus.",
        "Nous <em>aimerions</em> visiter Paris.",
        "Si j'avais le temps, je <em>lirais</em>.",
        "Pourriez-<em>vous</em> m'aider ?",
      ],
      why: `Conditionnel = futur stem + imparfait endings. The futur stem carries the "what if" weight; the imparfait endings soften it into hypothetical. Born in late Latin to express politeness and unreality, it's used today as French's <b>polite mood</b> — "I would like" beats "I want" every time you talk to a stranger.`,
      enBridge: `English uses "would" + verb for the same job: "I would like" = Je voudrais. Two rules: (1) any polite request — voudrais, pourriez, aimeriez. (2) Si + imparfait, conditionnel in the result — "If I had time, I would read." This is the formula. Memorize it.`,
      contrast: [
        { form: "Je veux un café.", gloss: "I want a coffee. Blunt." },
        { form: "Je voudrais un café.", gloss: "I would like a coffee. Polite." },
        { form: "Si j'avais le temps, je lirais.", gloss: "Hypothetical present (imaginary now)." },
        { form: "Si j'avais eu le temps, j'aurais lu.", gloss: "Hypothetical past (regret about the past)." },
      ],
    },

    // ─────────────────── Si-clauses ───────────────────
    'g18-si': {
      pattern: [
        "Si tu <em>veux</em>, on peut sortir. (real)",
        "Si j'<em>avais</em> de l'argent, je <em>voyagerais</em>. (unreal present)",
        "Si j'<em>avais eu</em> de l'argent, j'<em>aurais voyagé</em>. (unreal past)",
        "S'il <em>pleut</em>, je reste à la maison.",
        "Si j'<em>étais</em> toi, je <em>partirais</em> maintenant.",
      ],
      why: `Si-clauses come in three flavors based on how likely the condition is. Type 1: real, possible — si + présent, présent/futur. Type 2: hypothetical now — si + imparfait, conditionnel. Type 3: regret about the past — si + plus-que-parfait, conditionnel passé. The tense rule is rigid: <b>never</b> conditionnel after si. Don't write "si je voudrais" — write "si je voulais."`,
      enBridge: `English mirrors all three:<br>Type 1: "If you want, we can go out." (present + present/will)<br>Type 2: "If I had money, I would travel." (past + would)<br>Type 3: "If I had had money, I would have traveled." (past perfect + would have)<br>French is the same, but the tense pairing is mandatory. Drill until automatic. See the <a onclick="App.go('deepdive',{topic:'si'})" style="color:var(--accent);cursor:pointer">si-clauses side-by-side page</a>.`,
      contrast: [
        { form: "Si tu veux, on sort.", gloss: "Type 1 — real possibility." },
        { form: "Si tu voulais, on sortirait.", gloss: "Type 2 — hypothetical now." },
        { form: "Si tu avais voulu, on serait sortis.", gloss: "Type 3 — past regret." },
        { form: "Si je <s>voudrais</s> → si je voulais", gloss: "NEVER conditionnel after si. Never." },
      ],
    },

    // ─────────────────── Subjunctive ───────────────────
    'g20-subjunctive': {
      pattern: [
        "Il faut que je <em>parte</em>.",
        "Je veux que tu <em>viennes</em>.",
        "Bien qu'il <em>soit</em> fatigué, il travaille.",
        "Je suis content que tu <em>sois</em> là.",
        "Avant que tu <em>partes</em>, mange.",
      ],
      why: `The subjunctive (subjonctif) marks <b>uncertainty, emotion, will, doubt, necessity</b>. It comes from Latin subjunctive, which marked everything non-factual. While English mostly lost it ("I suggest he go" is a faded survivor), French kept it alive — and you must use it after specific triggers, not by feel. Memorize the triggers.`,
      enBridge: `English speakers don't say "I suggest that he goes" — we'd say "go." That's the subjunctive surviving. French uses it dozens of times more often than English. The rule is mechanical: <b>after specific trigger phrases</b>, you MUST use subjunctive. Triggers include: il faut que, je veux que, bien que, avant que, jusqu'à ce que, pour que, je suis content/heureux/triste que.<br><br>Pro tip: most subjunctive forms look like present tense for je/tu/il/nous/vous/ils. Only être, avoir, aller, faire, savoir, pouvoir, vouloir have weird stems. Learn those 7 cold.`,
      contrast: [
        { form: "Je sais que tu viens.", gloss: "Indicatif — certainty." },
        { form: "Je veux que tu viennes.", gloss: "Subjonctif — will/desire." },
        { form: "J'espère que tu viens.", gloss: "Indicatif — espérer takes indicative (a French oddity)." },
        { form: "Bien qu'il soit fatigué…", gloss: "Subjonctif — bien que always triggers it." },
      ],
    },
  };

  // Merge into GRAMMAR after the array loads.
  function apply() {
    if (!window.GRAMMAR) return;
    let merged = 0;
    for (const u of window.GRAMMAR) {
      const overlay = DEEP_DIVE[u.id];
      if (overlay) {
        Object.assign(u, overlay);
        merged++;
      }
    }
    // console.debug(`[deep-dive] merged ${merged} grammar units`);
  }

  apply();
})();
