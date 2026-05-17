// Minimal pair drills — train ear to distinguish similar French sounds.
// Per phonics unit, a set of paired-words audio quizzes.
window.MIN_PAIRS = {
  // /y/ vs /u/ — the classic English-speaker challenge
  'p2-special-vowels': {
    title: 'u (/y/) vs ou (/u/)',
    desc: 'These two vowels sound similar to English ears but mean totally different words. Train your ear.',
    pairs: [
      { a: 'tu', b: 'tout', meanA: 'you (sing.)', meanB: 'all' },
      { a: 'pu', b: 'pou', meanA: 'past part. of pouvoir', meanB: 'louse' },
      { a: 'dessus', b: 'dessous', meanA: 'on top', meanB: 'underneath' },
      { a: 'rue', b: 'roue', meanA: 'street', meanB: 'wheel' },
      { a: 'su', b: 'sous', meanA: 'past part. of savoir', meanB: 'under' },
      { a: 'bu', b: 'bout', meanA: 'past part. of boire', meanB: 'end / piece' },
      { a: 'vu', b: 'vous', meanA: 'past part. of voir', meanB: 'you (formal/pl)' },
      { a: 'jus', b: 'joue', meanA: 'juice', meanB: 'cheek' },
    ],
  },
  // Nasal contrasts
  'p3-nasals': {
    title: 'an (/ɑ̃/) vs on (/ɔ̃/) vs in (/ɛ̃/)',
    desc: 'Three nasal vowels that English-speakers blur. Each is a separate sound.',
    pairs: [
      { a: 'banc', b: 'bon', meanA: 'bench', meanB: 'good' },
      { a: 'sans', b: 'son', meanA: 'without', meanB: 'sound / his' },
      { a: 'dans', b: 'don', meanA: 'in', meanB: 'donation' },
      { a: 'gens', b: 'jeun', meanA: 'people', meanB: 'fasting' },
      { a: 'pain', b: 'pan', meanA: 'bread', meanB: 'part / panel' },
      { a: 'pain', b: 'pont', meanA: 'bread', meanB: 'bridge' },
      { a: 'plein', b: 'plant', meanA: 'full', meanB: 'plant' },
      { a: 'lien', b: 'long', meanA: 'link', meanB: 'long' },
    ],
  },
  // Liaison vs no-liaison
  'p6-liaison': {
    title: 'Liaison hits vs misses',
    desc: 'When does the silent consonant come alive? Train your ear to notice.',
    pairs: [
      { a: 'les amis', b: 'les copains', meanA: 'liaison: /le.z‿a.mi/', meanB: 'no liaison: /le.kɔ.pɛ̃/' },
      { a: 'un homme', b: 'un garçon', meanA: 'liaison: /œ̃.n‿ɔm/', meanB: 'no liaison: /œ̃.ɡaʁ.sɔ̃/' },
      { a: 'ils ont', b: 'ils sont', meanA: 'liaison: /il.z‿ɔ̃/', meanB: 'no liaison: /il.sɔ̃/' },
      { a: 'nous avons', b: 'nous parlons', meanA: 'liaison: /nu.z‿a.vɔ̃/', meanB: 'no liaison: /nu.paʁ.lɔ̃/' },
      { a: 'petit ami', b: 'petit copain', meanA: 'liaison: /pə.ti.t‿a.mi/', meanB: 'no liaison: /pə.ti.kɔ.pɛ̃/' },
    ],
  },
  // Closed vs open e
  'p1-vowels': {
    title: 'é (/e/) vs è (/ɛ/)',
    desc: 'Tense vs open mid-vowels. Hear the mouth-opening difference.',
    pairs: [
      { a: 'fée', b: 'fait', meanA: 'fairy', meanB: 'done / fact' },
      { a: 'des', b: 'dès', meanA: 'some (plural indef)', meanB: 'from / as soon as' },
      { a: 'thé', b: 'taie', meanA: 'tea', meanB: 'pillowcase' },
      { a: 'pré', b: 'près', meanA: 'meadow', meanB: 'near' },
      { a: 'mes', b: 'mais', meanA: 'my (plural)', meanB: 'but' },
      { a: 'ses', b: 'cesse', meanA: 'his/her (plural)', meanB: 'stop (3rd sing)' },
    ],
  },
};
