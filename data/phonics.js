// Phonics: French sounds for English-speaking learners. The most foreign sounds first.
window.PHONICS = [
  {
    id: 'p1-vowels',
    title: 'The 6 Basic Vowels',
    icon: '🔤',
    intro: 'French vowels are PURE — held steady, no glide. English vowels often glide (the "o" in "go" is really "ow"). Hold every French vowel flat like a long musical note.',
    sounds: [
      { ipa: '/a/', spell: 'a, à', word: 'chat', mean: 'cat', tip: 'Open, like English "ah" in "father".' },
      { ipa: '/e/', spell: 'é, er, ez', word: 'café', mean: 'coffee', tip: 'Tense, like "ay" in "say" but WITHOUT the glide.' },
      { ipa: '/ɛ/', spell: 'è, ê, ai, e+cons', word: 'fête', mean: 'party', tip: 'Open, like "e" in "bed".' },
      { ipa: '/i/', spell: 'i, î, y', word: 'lit', mean: 'bed', tip: 'Tense, like "ee" in "see" — lips spread.' },
      { ipa: '/o/', spell: 'o (closed), ô, au, eau', word: 'mot', mean: 'word', tip: 'Like "o" in "bone" — but without the "w" glide at the end.' },
      { ipa: '/u/', spell: 'ou, où', word: 'vous', mean: 'you', tip: 'Like "oo" in "food" — lips rounded firmly.' },
    ],
  },
  {
    id: 'p2-special-vowels',
    title: 'The "Lips Forward" Vowels: u, eu, œu',
    icon: '👄',
    intro: 'Three sounds English does not have. Mouth position is the key. Practice in front of a mirror.',
    sounds: [
      { ipa: '/y/', spell: 'u, û', word: 'tu', mean: 'you', tip: 'Say "ee" (/i/), THEN round your lips like saying "oo". Hold tongue still. That\'s /y/.' },
      { ipa: '/ø/', spell: 'eu (closed)', word: 'peu', mean: 'few', tip: 'Say "ay" (/e/), THEN round your lips. Tongue stays high.' },
      { ipa: '/œ/', spell: 'eu (open), œu', word: 'cœur', mean: 'heart', tip: 'Say "eh" (/ɛ/), THEN round your lips. Tongue lower.' },
      { ipa: '/ə/', spell: 'e (unstressed)', word: 'le', mean: 'the', tip: 'Schwa — very short, neutral. Like the "a" in "about". Often dropped in fast speech: "j(e) sais pas".' },
    ],
  },
  {
    id: 'p3-nasals',
    title: 'The 3 Nasal Vowels: an, in, on',
    icon: '👃',
    intro: 'Air comes through your NOSE, not your mouth. The "n" or "m" letter is silent — it just signals to nasalize. NEVER say the n/m as a consonant when nasalizing.',
    sounds: [
      { ipa: '/ɑ̃/', spell: 'an, am, en, em', word: 'enfant', mean: 'child', tip: 'Open mouth, soft palate down, push air through nose. Like a French "ahn" with NO N sound.' },
      { ipa: '/ɛ̃/', spell: 'in, im, ain, ein, un, um', word: 'pain', mean: 'bread', tip: 'Like "aN" with the N silent — sound resonates in nose.' },
      { ipa: '/ɔ̃/', spell: 'on, om', word: 'bon', mean: 'good', tip: 'Round lips like "o", push air through nose. NO N.' },
    ],
    warn: '⚠️ Trap: if the next letter is a VOWEL (e.g., "une, ami, bonne"), the n/m sound IS pronounced and the vowel is NOT nasalized. Examples: <b>bon</b> (nasal /bɔ̃/) vs <b>bonne</b> (non-nasal /bɔn/).',
  },
  {
    id: 'p4-r',
    title: 'The French R (the hardest sound)',
    icon: '🐉',
    intro: 'French R is at the BACK of the throat, like a soft gargle. NOT a rolled Spanish R, NOT an English R. The tongue tip stays DOWN behind the lower teeth.',
    sounds: [
      { ipa: '/ʁ/', spell: 'r, rr', word: 'rouge', mean: 'red', tip: '1) Gargle water without water. 2) Make that sound DRY. 3) Soften it. Practice: "Paris", "rouge", "trois".' },
    ],
    warn: 'Drill words: <b>rouge, Paris, France, mère, père, frère, restaurant, regarder, rendez-vous</b>. Listen to each, then shadow.',
  },
  {
    id: 'p5-silent-letters',
    title: 'Silent Letters',
    icon: '🤫',
    intro: 'French writes letters it does NOT pronounce. Rules:',
    sounds: [
      { ipa: '—', spell: 'Final consonant', word: 'petit', mean: 'small', tip: 'Final -t, -s, -d, -p, -x, -z are SILENT 95% of the time. "petit" = /pə.ti/, "vous" = /vu/, "grand" = /ɡʁɑ̃/.' },
      { ipa: '—', spell: 'Exception: CaReFuL', word: 'avec', mean: 'with', tip: 'Final c, r, f, l ARE usually pronounced. Memory: "CaReFuL". "avec" = /a.vɛk/, "hiver" = /i.vɛʁ/, "neuf" = /nœf/, "ciel" = /sjɛl/. But -er verbs and many -er nouns are EXCEPTIONS: "parler" = /paʁ.le/.' },
      { ipa: '—', spell: 'Final -e', word: 'tasse', mean: 'cup', tip: 'Final -e (no accent) is silent. "tasse" = /tas/. (It does cause the preceding consonant to be heard.)' },
      { ipa: '—', spell: 'h', word: 'homme', mean: 'man', tip: 'H is ALWAYS silent in French. "homme" = /ɔm/, "hôtel" = /o.tɛl/.' },
      { ipa: '—', spell: 'Final -s in plurals', word: 'les chats', mean: 'the cats', tip: 'Plural -s is silent. "les chats" sounds exactly like "le chat" except for the article.' },
    ],
  },
  {
    id: 'p6-liaison',
    title: 'Liaison: Joining Words',
    icon: '🔗',
    intro: 'A normally-silent final consonant becomes PRONOUNCED when the next word starts with a vowel. This is liaison. It glues French together and is the #1 source of "I can\'t parse spoken French".',
    sounds: [
      { ipa: '/le.z‿ɑ̃.fɑ̃/', spell: 'les enfants', word: 'les enfants', mean: 'the children', tip: 'Silent S becomes /z/: les‿enfants. Same for "des amis" → /de.z‿a.mi/.' },
      { ipa: '/nu.z‿a.vɔ̃/', spell: 'nous avons', word: 'nous avons', mean: 'we have', tip: 'Silent S in "nous" → /z/ before vowel. Same with "vous avez" /vu.z‿a.ve/.' },
      { ipa: '/œ̃.n‿a.mi/', spell: 'un ami', word: 'un ami', mean: 'a friend', tip: 'Silent N now sounds. "un ami" = /œ̃.n‿a.mi/, NOT /œ̃.a.mi/.' },
      { ipa: '/il.z‿ɔ̃/', spell: 'ils ont', word: 'ils ont', mean: 'they have', tip: 'Watch out: "ils ont" (they have) sounds /il.z‿ɔ̃/, but "ils sont" (they are) sounds /il.sɔ̃/ — no liaison because S is already pronounced from "sont".' },
    ],
    warn: 'Forbidden liaison: never after "et" (and). "et il" stays /e.il/, never /e.t‿il/.',
  },
  {
    id: 'p7-elision',
    title: 'Elision: Dropping Vowels',
    icon: '✂️',
    intro: 'When a short word ending in -e or -a meets a word starting with a vowel, the -e/-a is REPLACED by an apostrophe. Required, not optional.',
    sounds: [
      { ipa: '—', spell: "je → j'", word: "j'ai", mean: 'I have', tip: '"je ai" → "j\'ai". Never "je ai".' },
      { ipa: '—', spell: "le/la → l'", word: "l'école", mean: 'the school', tip: '"la école" → "l\'école". "le ami" → "l\'ami".' },
      { ipa: '—', spell: "ne → n'", word: "n'est pas", mean: 'is not', tip: '"ne est pas" → "n\'est pas".' },
      { ipa: '—', spell: "de → d'", word: "d'eau", mean: 'of water', tip: '"de eau" → "d\'eau". Also: "que" → "qu\'", "se" → "s\'", "me/te" → "m\'/t\'".' },
    ],
  },
];
