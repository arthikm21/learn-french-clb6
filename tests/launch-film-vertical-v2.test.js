const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const v2 = fs.readFileSync('launch-film-vertical-v2.html', 'utf8');
const source = fs.readFileSync('launch-film-vertical-v2.source.html', 'utf8');
const v1 = fs.readFileSync('launch-film-vertical.html', 'utf8');
const master = fs.readFileSync('launch-film.html', 'utf8');
const audioManifest = JSON.parse(fs.readFileSync('audio/manifest.json', 'utf8'));

test('vertical V2 is a standalone 29.5-second 9:16 campaign asset', () => {
  assert.match(v2, /aspect-ratio:\s*9\s*\/\s*16/);
  assert.match(v2, /const DURATION = 29\.5;/);
  assert.match(v2, /window\.__BONJOUR_VERTICAL_AD_V2__/);
  assert.match(v2, /href="data:image\/svg\+xml;base64,/);
  assert.match(v2, /url\("data:font\/woff2;base64,/);
  assert.match(v2, /src="data:image\/png;base64,/);
  assert.match(v2, /src="data:audio\/mpeg;base64,/);
  assert.doesNotMatch(v2, /href="favicon\.svg"|url\("fonts\/|src="icon-512\.png"|src="audio\//);
  assert.doesNotMatch(v2, /https?:\/\//);
});

test('vertical V2 uses the Bonjour brand palette and communicates concrete product depth', () => {
  for (const color of ['#fbf8f3', '#071630', '#1457e6', '#6d3fd4', '#ff735f', '#ffc94e', '#a8e3cc']) {
    assert.match(source, new RegExp(color));
  }
  for (const claim of ['8 phases', '92 milestones', '50 Canadian scenarios', '39 Q', '3 tasks', '2 h 47 min', 'No signup', 'No tracking']) {
    assert.match(source, new RegExp(claim));
  }
  assert.equal((source.match(/<section class="scene /g) || []).length, 9);
});

test('the Canadian-French voice clip is truthful, complete, and contained by its scene', () => {
  assert.equal(
    audioManifest['fr-CA-JeanNeural|Bonjour, je voudrais ouvrir un compte chèque.'],
    'audio/5311184f258e06aa.mp3'
  );
  assert.match(source, /const VOICE_START = 7\.7;/);
  assert.match(source, /const VOICE_DURATION = 4\.392;/);
  assert.match(source, /const VOICE_END = VOICE_START \+ VOICE_DURATION;/);
  assert.match(source, /\{ name: "voice", start: 7\.58, end: 12\.3 \}/);
  assert.ok(7.7 + 4.392 < 12.3, 'voice clip must end before the voice scene cuts');
  assert.match(source, /smooth\(\(DURATION - seconds\) \/ 1\.45\)/);
  assert.match(source, /if \(time >= VOICE_END\) return;/);
  assert.match(source, /Bonjour, je voudrais ouvrir un compte chèque/);
  assert.doesNotMatch(source, /J'aimerais prendre rendez-vous/);
});

test('vertical V2 runtime is valid and never stretches campaign content', () => {
  const runtime = v2.match(/<script data-vertical-v2-runtime>([\s\S]*?)<\/script>/);
  assert.ok(runtime, 'V2 runtime should exist');
  assert.doesNotThrow(() => new vm.Script(runtime[1], { filename: 'launch-film-vertical-v2.runtime.js' }));
  assert.doesNotMatch(source, /scaleX\(|scaleY\(|object-fit:\s*cover|<svg\b|data:image\/svg\+xml/);
  assert.match(source, /object-fit:\s*contain/g);
  assert.match(source, /width:\s*min\(100vw, calc\(100svh \* 9 \/ 16\)\)/);
});

test('the master and vertical V1 remain separate and intact', () => {
  assert.match(master, /const DURATION = 45;/);
  assert.match(master, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(v1, /const DURATION = 28;/);
  assert.match(v1, /window\.__BONJOUR_VERTICAL_AD__/);
  assert.doesNotMatch(master, /__BONJOUR_VERTICAL_AD_V2__/);
  assert.doesNotMatch(v1, /__BONJOUR_VERTICAL_AD_V2__/);
});
