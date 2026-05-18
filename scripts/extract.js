// Walks data files, dumps unique French strings to scripts/strings.json.
const fs = require('fs');
const path = require('path');

global.window = global;

const ROOT = path.join(__dirname, '..');
// Load base + extra data files so extractor sees everything.
['vocab', 'vocab_extra', 'vocab_more', 'vocab_tcf', 'grammar', 'grammar_extra', 'grammar_more', 'lessons',
 'reading', 'reading_extra', 'reading_more', 'reading_tcf', 'listening', 'listening_extra', 'listening_more', 'listening_tcf',
 'writing', 'spoken', 'phonics', 'minpairs', 'dialogues', 'speaktasks', 'pcvsimp',
 'writetask3', 'speaktask2', 'speaktask3', 'connectors'].forEach(n => {
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

// LISTENING (dictation sets have .items; TCF segments have .transcript handled below)
for (const k of Object.keys(window.LISTENING)) {
  const set = window.LISTENING[k];
  if (set.items) {
    for (const it of set.items) add(it.audio);
  }
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

// WRITE_TASK3 — topic, opinions A and B, prompt
if (window.WRITE_TASK3) for (const k of Object.keys(window.WRITE_TASK3)) {
  const t = window.WRITE_TASK3[k];
  add(t.topic);
  if (t.opinionA && t.opinionA.text) add(t.opinionA.text);
  if (t.opinionB && t.opinionB.text) add(t.opinionB.text);
  if (t.promptInstructions) add(t.promptInstructions);
}

// SPEAK_TASK2 — scenarios and sample questions
if (window.SPEAK_TASK2) for (const k of Object.keys(window.SPEAK_TASK2)) {
  const t = window.SPEAK_TASK2[k];
  add(t.scenario);
  if (t.sampleQuestions) for (const q of t.sampleQuestions) add(q);
}

// SPEAK_TASK3 — topics and prompts
if (window.SPEAK_TASK3) for (const k of Object.keys(window.SPEAK_TASK3)) {
  const t = window.SPEAK_TASK3[k];
  add(t.topic); add(t.prompt);
}

// LISTENING_TCF — transcripts
if (window.LISTENING_TCF) for (const k of Object.keys(window.LISTENING_TCF)) {
  add(window.LISTENING_TCF[k].transcript);
}

// READINGS_TCF — full texts + per-sentence
if (window.READINGS_TCF) for (const k of Object.keys(window.READINGS_TCF)) {
  const t = window.READINGS_TCF[k];
  add(t.text);
  if (t.text) t.text.split(/(?<=[.!?])\s+/).forEach(s => add(s.trim()));
}

// CONNECTOR_DRILLS — prompts
if (window.CONNECTOR_DRILLS) for (const d of window.CONNECTOR_DRILLS) {
  add(d.prompt);
  if (d.sampleContinuations) for (const s of d.sampleContinuations) add(s);
}

// All sources are curated French content — include everything > 0 chars.
const finalList = Array.from(strings);

finalList.sort();
fs.writeFileSync(path.join(__dirname, 'strings.json'), JSON.stringify(finalList, null, 2));
console.log(`Extracted ${finalList.length} unique French strings.`);
