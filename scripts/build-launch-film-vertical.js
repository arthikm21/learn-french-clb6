const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'launch-film-vertical.source.html');
const outputPath = path.join(root, 'launch-film-vertical.html');

function dataUrl(relativePath, mimeType) {
  const payload = fs.readFileSync(path.join(root, relativePath)).toString('base64');
  return `data:${mimeType};base64,${payload}`;
}

let html = fs.readFileSync(sourcePath, 'utf8');

const replacements = [
  ['href="favicon.svg"', `href="${dataUrl('favicon.svg', 'image/svg+xml')}"`],
  ['url("fonts/inter-latin.woff2")', `url("${dataUrl('fonts/inter-latin.woff2', 'font/woff2')}")`],
  ['src="icon-512.png"', `src="${dataUrl('icon-512.png', 'image/png')}"`],
  ['src="audio/5311184f258e06aa.mp3"', `src="${dataUrl('audio/5311184f258e06aa.mp3', 'audio/mpeg')}"`]
];

for (const [marker, replacement] of replacements) {
  if (!html.includes(marker)) throw new Error(`Missing vertical film asset marker: ${marker}`);
  html = html.replaceAll(marker, replacement);
}

const forbiddenDependencies = [
  /href="favicon\.svg"/,
  /url\("fonts\//,
  /src="icon-512\.png"/,
  /src="audio\//,
  /https?:\/\//
];

for (const pattern of forbiddenDependencies) {
  if (pattern.test(html)) throw new Error(`Vertical film is not standalone: ${pattern}`);
}

fs.writeFileSync(outputPath, html);
console.log(`Standalone vertical film built: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
