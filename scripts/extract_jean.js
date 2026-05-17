// Extract only the dialogue lines tagged with voice='jean'.
// Output a separate jean_strings.json for the generator to make Jean-voice variants.
const fs = require('fs');
const path = require('path');
global.window = global;
const ROOT = path.join(__dirname, '..');
require(path.join(ROOT, 'data', 'dialogues.js'));

const strings = new Set();
const stripEnglishGloss = s => s.replace(/\s*\(\s*[A-Za-z][A-Za-z\s',.!?-]*\)\s*$/, '').trim();
const stripTags = s => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const norm = s => stripEnglishGloss(stripTags(s));

for (const k of Object.keys(window.DIALOGUES)) {
  for (const line of window.DIALOGUES[k].lines) {
    if (line.voice === 'jean') {
      const t = norm(line.text);
      if (t) strings.add(t);
    }
  }
}

const arr = Array.from(strings).sort();
fs.writeFileSync(path.join(__dirname, 'jean_strings.json'), JSON.stringify(arr, null, 2));
console.log(`Extracted ${arr.length} Jean-voice strings.`);
