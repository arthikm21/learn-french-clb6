// Content integrity checker. Loads every data file and validates:
//   1. Every MC question ({opts, a}) has a valid answer index, ≥2 options,
//      and no duplicate options (a duplicate can make the right answer ambiguous).
//   2. Listening Mastery clips have unique ids + audio + why explanations.
//   3. Diagnostic skipIfPass keys actually exist in LESSON_PATH's doneKey space.
//   4. Every French string the app will speak has a pre-generated MP3 in
//      audio/manifest.json (mirrors tts.js normalize()); missing ones fall
//      back to robotic SpeechSynthesis — flag them so the audio pipeline runs.
//
// Run: node scripts/validate.js   (exit 1 on errors, 0 on warnings-only)
const fs = require('fs');
const path = require('path');

global.window = global;
const ROOT = path.join(__dirname, '..');

// grammar_deepdive.js merges overlays into GRAMMAR at load; index.html loads
// it after all grammar files, so mirror that order here.
const dataFiles = fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.js'));
for (const f of dataFiles.filter(f => f !== 'grammar_deepdive.js')) require(path.join(ROOT, 'data', f));
require(path.join(ROOT, 'data', 'grammar_deepdive.js'));

const errors = [];
const warnings = [];

// ---------- 1. Generic MC-question walk ----------
// Any object carrying {opts: Array, a} anywhere in any data structure.
const seen = new Set();
function walk(node, trail) {
  if (!node || typeof node !== 'object') return;
  if (seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${trail}[${i}]`));
    return;
  }
  if (Array.isArray(node.opts)) {
    const label = `${trail} ${JSON.stringify(node.q || node.prompt || '').slice(0, 60)}`;
    if (node.opts.length < 2) errors.push(`${label}: only ${node.opts.length} option(s)`);
    if (!Number.isInteger(node.a) || node.a < 0 || node.a >= node.opts.length) {
      errors.push(`${label}: answer index a=${node.a} out of range for ${node.opts.length} opts`);
    }
    const norm = node.opts.map(o => String(o).trim().toLowerCase());
    const dupes = norm.filter((o, i) => norm.indexOf(o) !== i);
    if (dupes.length) warnings.push(`${label}: duplicate option(s) ${JSON.stringify([...new Set(dupes)])}`);
  }
  for (const [k, v] of Object.entries(node)) walk(v, `${trail}.${k}`);
}

const GLOBALS = ['VOCAB','VOCAB_EXTRA','VOCAB_MORE','VOCAB_TCF','GRAMMAR','GRAMMAR_EXTRA','GRAMMAR_MORE',
  'READINGS','READINGS_EXTRA','READINGS_MORE','READINGS_TCF','LISTENING','LISTENING_EXTRA','LISTENING_MORE',
  'LISTENING_TCF','LISTENING_MASTERY','WRITING','SENTENCES','SPEAK_SETS','PHONICS','MIN_PAIRS','DIALOGUES',
  'SPEAK_TASKS','WRITE_TASK3','SPEAK_TASK2','SPEAK_TASK3','CONNECTOR_DRILLS','CONNECTORS','MOCK_TEST',
  'PC_VS_IMP','GATES','SCENARIOS','DIAGNOSTIC_BANK','LESSON_PATH','PHASES'];
for (const g of GLOBALS) {
  if (window[g] === undefined) { warnings.push(`global ${g} not defined by any data file`); continue; }
  walk(window[g], g);
}

// ---------- 2. Listening Mastery specifics ----------
{
  const ids = new Set();
  for (const clip of window.LISTENING_MASTERY || []) {
    if (ids.has(clip.id)) errors.push(`LISTENING_MASTERY duplicate id ${clip.id}`);
    ids.add(clip.id);
    if (!clip.audio) errors.push(`LISTENING_MASTERY ${clip.id}: missing audio`);
    if (!clip.why && clip.type !== 'C') warnings.push(`LISTENING_MASTERY ${clip.id}: missing why explanation`);
    if (!clip.audioEn) warnings.push(`LISTENING_MASTERY ${clip.id}: missing audioEn gloss`);
  }
}

// ---------- 3. Diagnostic skipIfPass keys exist on the path ----------
{
  const doneKeys = new Set((window.LESSON_PATH || []).map(n => ({
    vocab: `vocab:${n.deck}`, grammar: `grammar:${n.unit}`, phonics: `phonics:${n.unit}`,
    games: `games:${n.game}`, listen: `listen:${n.set}`, speak: `speak:${n.set}`,
    read: `read:${n.text}`, write: `write:${n.prompt}`,
  })[n.route]).filter(Boolean));
  for (const q of window.DIAGNOSTIC_BANK || []) {
    for (const k of q.skipIfPass || []) {
      if (!doneKeys.has(k)) errors.push(`DIAGNOSTIC ${q.id}: skipIfPass key "${k}" not on LESSON_PATH`);
    }
  }
}

// ---------- 4. Audio manifest coverage ----------
// Mirror tts.js normalize(): strip tags, collapse whitespace, drop trailing "(English)".
function ttsNormalize(text) {
  if (!text) return '';
  let t = String(text).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  t = t.replace(/\s*\(\s*[A-Za-z][A-Za-z\s',.!?\-]*\)\s*$/, '').trim();
  return t;
}
{
  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'audio', 'manifest.json'), 'utf8')); } catch (e) {
    warnings.push('audio/manifest.json unreadable — skipping coverage check');
  }
  let strings = [];
  try { strings = JSON.parse(fs.readFileSync(path.join(__dirname, 'strings.json'), 'utf8')); } catch (e) {
    warnings.push('scripts/strings.json missing — run node scripts/extract.js first');
  }
  const missing = strings.map(ttsNormalize).filter(s => s && !manifest[s]);
  if (missing.length) {
    warnings.push(`${missing.length} French string(s) have no MP3 in the manifest (SpeechSynthesis fallback):`);
    missing.slice(0, 25).forEach(s => warnings.push(`  · ${s.slice(0, 90)}`));
    if (missing.length > 25) warnings.push(`  … and ${missing.length - 25} more`);
  }
}

// ---------- Report ----------
for (const w of warnings) console.log('WARN  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
