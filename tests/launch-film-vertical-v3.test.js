const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const v3 = fs.readFileSync('launch-film-vertical-v3.html', 'utf8');
const source = fs.readFileSync('launch-film-vertical-v3.source.html', 'utf8');
const v2 = fs.readFileSync('launch-film-vertical-v2.html', 'utf8');
const v1 = fs.readFileSync('launch-film-vertical.html', 'utf8');
const master = fs.readFileSync('launch-film.html', 'utf8');
const audioManifest = JSON.parse(fs.readFileSync('audio/manifest.json', 'utf8'));
const normalizedCopy = source.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

function pngSize(path) {
  const bytes = fs.readFileSync(path).subarray(0, 24);
  assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a', `${path} should be a PNG`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test('vertical V3 is a standalone 24-second 9:16 campaign asset', () => {
  assert.match(v3, /aspect-ratio:\s*9\s*\/\s*16/);
  assert.match(v3, /const DURATION = 24;/);
  assert.match(v3, /window\.__BONJOUR_VERTICAL_AD_V3__/);
  assert.match(v3, /href="data:image\/svg\+xml;base64,/);
  assert.match(v3, /url\("data:font\/woff2;base64,/);
  assert.equal((v3.match(/src="data:image\/png;base64,/g) || []).length, 5);
  assert.match(v3, /src="data:audio\/mpeg;base64,/);
  assert.doesNotMatch(v3, /href="favicon\.svg"|url\("fonts\/|src="(?:icon-512|assets\/|audio\/)/);
  assert.doesNotMatch(v3, /https?:\/\//);
});

test('V3 uses real product proof and generated human plates at native proportions', () => {
  assert.deepEqual(pngSize('assets/film-v3/bank-hesitation.png'), { width: 941, height: 1672 });
  assert.deepEqual(pngSize('assets/film-v3/bank-confidence.png'), { width: 941, height: 1672 });
  assert.deepEqual(pngSize('assets/film-v3/product-bank-dialogue-crop.png'), { width: 528, height: 790 });
  assert.match(source, /\.photo-plate[\s\S]*?width:\s*100%;[\s\S]*?height:\s*auto;/);
  assert.match(source, /\.product-window img \{[^}]*width:\s*100%;[^}]*height:\s*auto;[^}]*object-fit:\s*contain;/);
  assert.doesNotMatch(source, /scaleX\(|scaleY\(|object-fit:\s*cover|<svg\b/);
});

test('V3 tells one concise human story with concrete campaign proof', () => {
  assert.equal((source.match(/<section class="scene /g) || []).length, 7);
  for (const claim of [
    'The question comes',
    'Practise the moment before it happens',
    'The actual lesson',
    '50 real Canadian scenarios',
    'Complete TCF Canada practice',
    'Now the moment feels familiar',
    'frenchclb6.ca',
    'No signup',
    'No tracking'
  ]) {
    assert.match(normalizedCopy, new RegExp(claim));
  }
});

test('the only soundtrack is the complete Canadian-French learner line', () => {
  assert.equal(
    audioManifest['fr-CA-JeanNeural|Bonjour, je voudrais ouvrir un compte chèque.'],
    'audio/5311184f258e06aa.mp3'
  );
  assert.match(source, /const VOICE_START = 6\.35;/);
  assert.match(source, /const VOICE_DURATION = 4\.392;/);
  assert.match(source, /\{ name: "product", start: 5\.68, end: 11\.35 \}/);
  assert.ok(6.35 + 4.392 < 11.35, 'voice clip must finish before the product scene cuts');
  assert.match(source, /Bonjour, je voudrais ouvrir un compte chèque/);
  assert.doesNotMatch(source, /AudioContext|createOscillator|createScoreBuffer|beatPhase|kickEnvelope|musicGain/);
});

test('vertical V3 runtime is valid and prior cuts remain intact', () => {
  const runtime = v3.match(/<script data-vertical-v3-runtime>([\s\S]*?)<\/script>/);
  assert.ok(runtime, 'V3 runtime should exist');
  assert.doesNotThrow(() => new vm.Script(runtime[1], { filename: 'launch-film-vertical-v3.runtime.js' }));

  assert.match(master, /const DURATION = 45;/);
  assert.match(master, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(v1, /const DURATION = 28;/);
  assert.match(v2, /const DURATION = 29\.5;/);
  assert.doesNotMatch(master, /__BONJOUR_VERTICAL_AD_V3__/);
  assert.doesNotMatch(v1, /__BONJOUR_VERTICAL_AD_V3__/);
  assert.doesNotMatch(v2, /__BONJOUR_VERTICAL_AD_V3__/);
});
