// Walks data files, dumps unique French strings to scripts/strings.json.
const fs = require('fs');
const path = require('path');

global.window = global;

const ROOT = path.join(__dirname, '..');
// Load base + extra data files so extractor sees everything.
['vocab', 'vocab_extra', 'vocab_more', 'grammar', 'grammar_extra', 'grammar_more', 'lessons',
 'reading', 'reading_extra', 'reading_more', 'listening', 'listening_extra', 'listening_more',
 'writing', 'spoken', 'phonics', 'minpairs', 'dialogues', 'speaktasks', 'pcvsimp'].forEach(n => {
  require(path.join(ROOT, 'data', n + '.js'));
});

const stripTags = s => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// Strip trailing English-in-parens translations like "Je suis. (I am)"
const stripEnglishGloss = s => s.replace(/\s*\(\s*[A-Za-z][A-Za-z\s',.!?-]*\)\s*$/, '').trim();
const strings = new Set();
const add = s => {
  if (!s) return;
  const t = stripEnglishGloss(stripTags(s));
  if (!t || t.length < 1) return;
  // Skip strings that are obviously not French (English-only or pure numbers)
  // Heuristic: keep if has French accent, OR has spaces/multiple words, OR is in known French wordlist (skip — just include all)
  strings.add(t);
};

// VOCAB
for (const k of Object.keys(window.VOCAB)) {
  for (const c of window.VOCAB[k].cards) {
    add(c.fr);
    if (c.ex) add(c.ex);
  }
}

// GRAMMAR
for (const u of window.GRAMMAR) {
  for (const r of u.rules) {
    if (r.examples) r.examples.forEach(add);
    if (r.table) r.table.forEach(row => add(row[1]));
  }
  for (const q of u.quiz) {
    // skip quiz prompts (mostly English), include answers if French
    for (const o of q.opts) {
      // include short French options (single words or with accents) — they're useful tap-to-hear
      add(o);
    }
  }
}

// LISTENING
for (const k of Object.keys(window.LISTENING)) {
  for (const it of window.LISTENING[k].items) add(it.audio);
}

// READING — text + question options that look French
for (const k of Object.keys(window.READINGS)) {
  const t = window.READINGS[k];
  // Split text into sentences for granular replay
  add(t.text);
  t.text.split(/(?<=[.!?])\s+/).forEach(s => add(s.trim()));
  for (const q of t.questions) for (const o of q.opts) add(o);
}

// SPEAK
for (const k of Object.keys(window.SPEAK_SETS)) {
  for (const s of window.SPEAK_SETS[k].items) add(s);
}

// SENTENCES (game)
for (const s of window.SENTENCES) {
  add(s.fr.join(' '));
  s.fr.forEach(add);
}

// PHONICS — words used in phonics examples
if (window.PHONICS) for (const u of window.PHONICS) {
  for (const s of u.sounds) {
    if (s.word) add(s.word);
  }
}

// MIN_PAIRS — both words in each pair
if (window.MIN_PAIRS) for (const k of Object.keys(window.MIN_PAIRS)) {
  for (const p of window.MIN_PAIRS[k].pairs) {
    add(p.a); add(p.b);
  }
}

// DIALOGUES — every line of every dialogue
if (window.DIALOGUES) for (const k of Object.keys(window.DIALOGUES)) {
  for (const line of window.DIALOGUES[k].lines) add(line.text);
}

// SPEAK_TASKS — Q&A questions + role-play other-lines
if (window.SPEAK_TASKS) for (const k of Object.keys(window.SPEAK_TASKS)) {
  const t = window.SPEAK_TASKS[k];
  if (t.questions) for (const q of t.questions) add(q.q);
  if (t.turns) for (const turn of t.turns) add(turn.other);
}

// PC_VS_IMP — drill sentences and rule examples
if (window.PC_VS_IMP) {
  for (const d of (window.PC_VS_IMP.drills || [])) add(d.sentence);
  for (const f of (window.PC_VS_IMP.framework || [])) {
    if (f.examples) for (const e of f.examples) add(e);
  }
}

// All sources are curated French content — include everything > 0 chars.
const finalList = Array.from(strings);

finalList.sort();
fs.writeFileSync(path.join(__dirname, 'strings.json'), JSON.stringify(finalList, null, 2));
console.log(`Extracted ${finalList.length} unique French strings.`);
