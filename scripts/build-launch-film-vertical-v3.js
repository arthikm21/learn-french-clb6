const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'launch-film-vertical-v3.source.html');
const outputPath = path.join(root, 'launch-film-vertical-v3.html');

function dataUrl(relativePath, mimeType) {
  return `data:${mimeType};base64,${fs.readFileSync(path.join(root, relativePath)).toString('base64')}`;
}

let html = fs.readFileSync(sourcePath, 'utf8');
const replacements = [
  ['href="favicon.svg"', `href="${dataUrl('favicon.svg', 'image/svg+xml')}"`],
  ['url("fonts/inter-latin.woff2")', `url("${dataUrl('fonts/inter-latin.woff2', 'font/woff2')}")`],
  ['src="icon-512.png"', `src="${dataUrl('icon-512.png', 'image/png')}"`],
  ['src="assets/film-v3/bank-hesitation.png"', `src="${dataUrl('assets/film-v3/bank-hesitation.png', 'image/png')}"`],
  ['src="assets/film-v3/bank-confidence.png"', `src="${dataUrl('assets/film-v3/bank-confidence.png', 'image/png')}"`],
  ['src="assets/film-v3/product-bank-dialogue-crop.png"', `src="${dataUrl('assets/film-v3/product-bank-dialogue-crop.png', 'image/png')}"`],
  ['src="audio/5311184f258e06aa.mp3"', `src="${dataUrl('audio/5311184f258e06aa.mp3', 'audio/mpeg')}"`]
];

for (const [marker, replacement] of replacements) {
  if (!html.includes(marker)) throw new Error(`Missing V3 asset marker: ${marker}`);
  html = html.replaceAll(marker, replacement);
}

for (const pattern of [/href="favicon\.svg"/, /url\("fonts\//, /src="(?:icon-512|assets\/|audio\/)/, /https?:\/\//]) {
  if (pattern.test(html)) throw new Error(`Vertical V3 is not standalone: ${pattern}`);
}

fs.writeFileSync(outputPath, html);
console.log(`Standalone vertical V3 built: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
