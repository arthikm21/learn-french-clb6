const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const html = fs.readFileSync('launch-film.html', 'utf8');

test('launch film is a self-contained double-clickable HTML file', () => {
  assert.doesNotMatch(html, /One quick launch step|Serve the folder first|location\.protocol\s*===\s*['"]file:/);
  assert.doesNotMatch(html, /fetch\(['"]audio\//);
  assert.doesNotMatch(html, /loadTexture\(['"](?:icon-512\.png|og-image\.jpg)['"]\)/);
  assert.doesNotMatch(html, /url\(['"]?(?:fonts\/|og-image\.jpg)/);
  assert.doesNotMatch(html, /src=['"]icon-512\.png['"]/);

  assert.match(html, /href="data:image\/svg\+xml;base64,/);
  assert.match(html, /src: url\("data:font\/woff2;base64,/);
  assert.match(html, /const EMBEDDED_ICON_URL = 'data:image\/png;base64,/);
  assert.match(html, /const EMBEDDED_OG_URL = 'data:image\/jpeg;base64,/);
  assert.match(html, /const EMBEDDED_VOICE_URL = 'data:audio\/mpeg;base64,/);
  assert.match(html, /data-embedded="three-bundle"/);
  assert.match(html, /window\.__FILM_THREE__=/);
  assert.doesNotMatch(html, /<script[^>]+type="module"|\bimport\s*\(/);
});

test('standalone film runtime has valid JavaScript syntax', () => {
  const threeBundle = html.match(/<script data-embedded="three-bundle">([\s\S]*?)<\/script>/);
  const runtime = html.match(/<script data-film-runtime>([\s\S]*?)<\/script>/);
  assert.ok(threeBundle, 'embedded Three.js bundle should exist');
  assert.ok(runtime, 'film runtime script should exist');
  assert.doesNotThrow(() => new vm.Script(threeBundle[1], { filename: 'three-r184.embedded.js' }));
  assert.doesNotThrow(() => new vm.Script(runtime[1], { filename: 'launch-film.runtime.js' }));
});

test('campaign frames preserve source aspect ratios and use one hero surface per beat', () => {
  assert.equal((html.match(/<section class="stage" id="stage"/g) || []).length, 1);
  assert.match(html, /function getTextureAspect\(texture\)/);
  assert.match(html, /fitDimensionsToAspect\(panelWidth - \.16, panelHeight - \.16, textureAspect\)/);
  assert.match(html, /new THREE\.PlaneGeometry\(screenHeight \* SCREEN_ASPECT, screenHeight\)/);
  assert.doesNotMatch(html, /userData\.cards/);
  assert.match(html, /target: makeCanvasTexture\(2048, 1152, paintTargetHero\)/);
  assert.match(html, /scenario: makeCanvasTexture\(2048, 1152, paintScenarioHero\)/);
  assert.match(html, /proof: makeCanvasTexture\(2048, 1152, paintProofHero\)/);
});
