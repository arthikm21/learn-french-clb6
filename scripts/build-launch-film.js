const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const filmPath = path.join(root, 'launch-film.html');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath));
}

function dataUrl(relativePath, mimeType) {
  return `data:${mimeType};base64,${read(relativePath).toString('base64')}`;
}

function replaceOne(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Missing launch-film marker: ${label}`);
  return html.replace(pattern, replacement);
}

function importBindings(specifiers) {
  return specifiers.split(',').map(specifier => {
    const parts = specifier.trim().split(/\s+as\s+/);
    return parts.length === 2 ? `${parts[0]}:${parts[1]}` : parts[0];
  }).join(',');
}

function exportBindings(specifiers) {
  return specifiers.split(',').map(specifier => {
    const parts = specifier.trim().split(/\s+as\s+/);
    const localName = parts[0];
    const exportName = parts[1] || localName;
    return `${JSON.stringify(exportName)}:${localName}`;
  }).join(',');
}

function classicThreeBundle() {
  const coreSource = read('vendor/three-r184/three.core.min.js').toString('utf8').trim();
  const rendererSource = read('vendor/three-r184/three.module.min.js').toString('utf8').trim();

  const coreExports = coreSource.match(/export\{([^}]*)\};\s*$/);
  if (!coreExports) throw new Error('Could not find Three.js core exports');
  const coreBody = coreSource.slice(0, coreExports.index) + `return {${exportBindings(coreExports[1])}};`;

  const rendererImport = rendererSource.match(/import\{([^}]*)\}from"\.\/three\.core\.min\.js";/);
  if (!rendererImport) throw new Error('Could not find Three.js renderer imports');
  let rendererBody = rendererSource.replace(rendererImport[0], `const {${importBindings(rendererImport[1])}}=__THREE_CORE__;`);
  rendererBody = rendererBody.replace(/export\{[^}]*\}from"\.\/three\.core\.min\.js";/, '');

  const rendererExports = rendererBody.match(/export\{([^}]*)\};\s*$/);
  if (!rendererExports) throw new Error('Could not find Three.js renderer exports');
  rendererBody = rendererBody.slice(0, rendererExports.index)
    + `return Object.assign({},__THREE_CORE__,{${exportBindings(rendererExports[1])}});`;

  return `window.__FILM_THREE__=(()=>{const __THREE_CORE__=(()=>{${coreBody}})();return(()=>{${rendererBody}})()})();`;
}

let html = fs.readFileSync(filmPath, 'utf8');

const bundleBlock = `  <script data-embedded="three-bundle">\n${classicThreeBundle()}\n  </script>`;
html = replaceOne(
  html,
  /(<\/main>)[\s\S]*?(<script data-film-runtime>)/,
  (_match, mainClose, runtimeOpen) => `${mainClose}\n\n${bundleBlock}\n\n  ${runtimeOpen}`,
  'embedded Three.js region'
);

html = replaceOne(
  html,
  /(\(async function launchStandaloneFilm\(\) \{)[\s\S]*?(?=\n\s+const EMBEDDED_ICON_URL =)/,
  `$1\n      const THREE = window.__FILM_THREE__;\n      if (!THREE?.WebGLRenderer) throw new Error('Embedded Three.js bundle is unavailable');`,
  'standalone film bootstrap'
);

html = replaceOne(
  html,
  /<link rel="icon" href="[^"]*" type="image\/svg\+xml">/,
  `<link rel="icon" href="${dataUrl('favicon.svg', 'image/svg+xml')}" type="image/svg+xml">`,
  'favicon'
);
html = replaceOne(
  html,
  /src: url\("[^"]*"\) format\("woff2"\);/,
  `src: url("${dataUrl('fonts/inter-latin.woff2', 'font/woff2')}") format("woff2");`,
  'InterFilm font'
);

const embeddedAssets = [
  ['EMBEDDED_ICON_URL', dataUrl('icon-512.png', 'image/png')],
  ['EMBEDDED_OG_URL', dataUrl('og-image.jpg', 'image/jpeg')],
  ['EMBEDDED_VOICE_URL', dataUrl('audio/5311184f258e06aa.mp3', 'audio/mpeg')]
];

for (const [name, value] of embeddedAssets) {
  html = replaceOne(
    html,
    new RegExp(`const ${name} = '[^']*';`),
    `const ${name} = '${value}';`,
    name
  );
}

const forbiddenRuntimeDependencies = [
  /location\.protocol\s*===\s*['"]file:/,
  /import\s+[^;]+from\s+['"]\.\/vendor\//,
  /fetch\(['"]audio\//,
  /loadTexture\(['"](?:icon-512\.png|og-image\.jpg)['"]\)/,
  /url\(['"]?(?:fonts\/|og-image\.jpg)/,
  /src=['"]icon-512\.png['"]/,
  /\bimport\s*\(/,
  /__(?:FILM_(?:FAVICON|FONT|ICON|OG|VOICE)_DATA|THREE_(?:CORE|RENDERER)_SOURCE)__/
];

for (const pattern of forbiddenRuntimeDependencies) {
  if (pattern.test(html)) throw new Error(`Standalone launch film still contains ${pattern}`);
}

fs.writeFileSync(filmPath, html);
console.log(`Standalone launch film built: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
