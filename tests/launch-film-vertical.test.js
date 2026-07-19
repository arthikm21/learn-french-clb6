const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const vertical = fs.readFileSync('launch-film-vertical.html', 'utf8');
const source = fs.readFileSync('launch-film-vertical.source.html', 'utf8');
const master = fs.readFileSync('launch-film.html', 'utf8');

test('vertical campaign film is a self-contained 28-second 9:16 asset', () => {
  assert.match(vertical, /aspect-ratio:\s*9\s*\/\s*16/);
  assert.match(vertical, /const DURATION = 28;/);
  assert.match(vertical, /window\.__BONJOUR_VERTICAL_AD__/);
  assert.match(vertical, /href="data:image\/svg\+xml;base64,/);
  assert.match(vertical, /url\("data:font\/woff2;base64,/);
  assert.match(vertical, /src="data:image\/png;base64,/);
  assert.match(vertical, /src="data:audio\/mpeg;base64,/);
  assert.doesNotMatch(vertical, /href="favicon\.svg"|url\("fonts\/|src="icon-512\.png"|src="audio\//);
  assert.doesNotMatch(vertical, /https?:\/\//);
});

test('vertical film runtime has valid JavaScript syntax and deterministic capture controls', () => {
  const runtime = vertical.match(/<script data-vertical-runtime>([\s\S]*?)<\/script>/);
  assert.ok(runtime, 'vertical runtime script should exist');
  assert.doesNotThrow(() => new vm.Script(runtime[1], { filename: 'launch-film-vertical.runtime.js' }));
  assert.match(runtime[1], /captureTimeFromLocation/);
  assert.match(runtime[1], /renderFrame: renderAt/);
  assert.match(runtime[1], /duration: DURATION/);
});

test('vertical layouts preserve proportions and keep one dominant surface per beat', () => {
  assert.equal((source.match(/<section class="scene /g) || []).length, 9);
  assert.doesNotMatch(source, /scaleX\(|scaleY\(|object-fit:\s*cover/);
  assert.doesNotMatch(source, /<svg\b|data:image\/svg\+xml/);
  assert.match(source, /object-fit:\s*contain/g);
  assert.match(source, /width:\s*min\(100vw, calc\(100svh \* 9 \/ 16\)\)/);
  assert.match(source, /Structured practice toward NCLC 6 \/ CLB 6/);
});

test('the existing 45-second 16:9 master remains a separate campaign asset', () => {
  assert.match(master, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(master, /const DURATION = 45;/);
  assert.match(master, /window\.__BONJOUR_FILM__/);
  assert.doesNotMatch(master, /__BONJOUR_VERTICAL_AD__/);
});
