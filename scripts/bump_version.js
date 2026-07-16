// Stamps every local script/css URL in public HTML with ?v=<stamp> so browsers
// fetch fresh files immediately after a deploy, regardless of cache TTLs.
// Run before committing a release: node scripts/bump_version.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const stamp = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, ''); // e.g. 202606091745
const htmlFiles = [
  ...fs.readdirSync(root)
    .filter(name => name.endsWith('.html') && name !== 'og.html')
    .map(name => path.join(root, name)),
  ...['grammar', 'scenarios'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir)).filter(name => name.endsWith('.html')).map(name => path.join(root, dir, name))
  ),
];

let count = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(
    /\b(src|href)="(\/?(?:(?:data|modules|fonts)\/[^"?]+|styles\.css|editorial\.css|app\.js))(?:\?v=[^"]*)?"/g,
    (_, attr, asset) => { count++; return `${attr}="${asset}?v=${stamp}"`; }
  );
  fs.writeFileSync(file, html);
}
console.log(`Stamped ${count} URLs across ${htmlFiles.length} HTML files with ?v=${stamp}`);

// Keep the service worker in lockstep: its VERSION names the shell cache, so
// bumping it here makes every deploy drop the previous release's cached shell.
const swFile = path.join(root, 'sw.js');
let sw = fs.readFileSync(swFile, 'utf8');
sw = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${stamp}';`);
fs.writeFileSync(swFile, sw);
console.log(`Stamped sw.js VERSION = ${stamp}`);
