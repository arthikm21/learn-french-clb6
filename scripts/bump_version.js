// Stamps every local script/css URL in index.html with ?v=<stamp> so browsers
// fetch fresh files immediately after a deploy, regardless of cache TTLs.
// Run before committing a release: node scripts/bump_version.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const stamp = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, ''); // e.g. 202606091745

let html = fs.readFileSync(file, 'utf8');
let count = 0;
html = html.replace(
  /\b(src|href)="((?:data|modules|fonts)\/[^"?]+|styles\.css|app\.js)(?:\?v=[^"]*)?"/g,
  (_, attr, p) => { count++; return `${attr}="${p}?v=${stamp}"`; }
);
fs.writeFileSync(file, html);
console.log(`Stamped ${count} URLs with ?v=${stamp}`);
