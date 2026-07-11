const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function resolveLocal(ref) {
  const clean = ref.replace(/^\//, '').replace(/\?.*$/, '');
  if (!clean) return 'index.html';
  return [clean, `${clean}.html`, `${clean}/index.html`].find(path => fs.existsSync(path)) || null;
}

test('index local assets resolve and persistence loads before profile UI', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const refs = [...html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)]
    .map(match => match[1])
    .filter(ref => !/^(?:https?:|mailto:|tel:|data:)/.test(ref));
  const missing = [...new Set(refs)].filter(ref => !resolveLocal(ref));
  assert.deepEqual(missing, []);
  assert.ok(html.indexOf('modules/storage.js') < html.indexOf('modules/profile.js'));
  assert.ok(html.indexOf('modules/storage.js') < html.indexOf('modules/mastery.js'));
  assert.ok(html.indexOf('modules/mastery.js') < html.indexOf('app.js'));
  assert.ok(html.indexOf('modules/router.js') < html.indexOf('app.js'));
  assert.match(html, /class="skip-link" href="#app"/);
  assert.match(html, /<button class="brand"[^>]+data-route="home"/);
  assert.match(html, /<button class="stat" id="user-chip"/);
});

test('every sitemap URL has a local clean-URL target', () => {
  const xml = fs.readFileSync('sitemap.xml', 'utf8');
  const targets = [...xml.matchAll(/<loc>https?:\/\/[^/]+\/(.*?)<\/loc>/g)]
    .map(match => decodeURIComponent(match[1]));
  assert.ok(targets.length > 0);
  assert.deepEqual(targets.filter(target => !resolveLocal(target)), []);
});

test('clickable cards are keyboard upgraded and do not nest buttons', () => {
  const keyboard = fs.readFileSync('modules/keyboard.js', 'utf8');
  const app = fs.readFileSync('app.js', 'utf8');
  const grammar = fs.readFileSync('modules/grammar.js', 'utf8');
  const listening = fs.readFileSync('modules/listenmastery.js', 'utf8');

  assert.match(keyboard, /typeof el\.onclick === 'function'/);
  assert.match(keyboard, /setAttribute\('role', 'button'\)/);
  for (const source of [app, grammar, listening]) {
    assert.doesNotMatch(source, /class="spotlight"[^>]*onclick[\s\S]{0,650}<button/);
  }
});

test('writing evidence cannot be completed without a full draft', () => {
  const source = fs.readFileSync('modules/write.js', 'utf8');
  assert.match(source, /id="compare" disabled/);
  assert.match(source, /compareBtn\.disabled = n < g\.words\[0\]/);
  assert.match(source, /doneBtn\.disabled = n < g\.words\[0\] \|\| !boxes\.every/);
});

test('profile creation rejects rather than silently rewrites invalid names', () => {
  const source = fs.readFileSync('modules/profile.js', 'utf8');
  assert.match(source, /if \(name !== raw\)/);
  assert.match(source, /hyphens, or underscores/);
  assert.match(source, /maxlength="24"/);
});
