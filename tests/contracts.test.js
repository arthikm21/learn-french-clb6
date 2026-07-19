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
  assert.ok(html.indexOf('modules/cheersquad.js') < html.indexOf('modules/chrome.js'));
  assert.ok(html.indexOf('src="modules/mastery.js') < html.indexOf('src="app.js'));
  assert.ok(html.indexOf('src="modules/router.js') < html.indexOf('src="app.js'));
  assert.match(html, /class="skip-link" href="#app"/);
  assert.match(html, /<button class="brand"[^>]+data-route="home"/);
  assert.match(html, /<button class="stat" id="user-chip"/);
});

test('the initial app shell stays small and route assets remain lazy', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const app = fs.readFileSync('app.js', 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)]
    .map(match => match[1].replace(/^\//, '').replace(/\?.*$/, ''));
  const initialBytes = scripts.reduce((sum, file) => sum + fs.statSync(file).size, 0);

  assert.ok(scripts.length <= 25, `initial shell has ${scripts.length} scripts; budget is 25`);
  assert.ok(initialBytes <= 350 * 1024, `initial JS is ${Math.ceil(initialBytes / 1024)} KiB; budget is 350 KiB`);

  const manifestStart = app.indexOf('const ROUTE_ASSETS = {');
  const manifestEnd = app.indexOf('const assetLoads', manifestStart);
  const manifest = app.slice(manifestStart, manifestEnd);
  const lazyAssets = [...manifest.matchAll(/["']((?:data|modules)\/[^"']+\.js)["']/g)]
    .map(match => match[1]);
  assert.ok(lazyAssets.length >= 40, 'route manifest should contain the feature banks and renderers');
  assert.deepEqual([...new Set(lazyAssets)].filter(file => !fs.existsSync(file)), []);
  assert.match(app, /script\.dataset\.routeAsset = path/);
  assert.doesNotMatch(app, /startViewTransition/);
});

test('dynamic DOM and Path rendering avoid whole-page rescans and eager phase construction', () => {
  const keyboard = fs.readFileSync('modules/keyboard.js', 'utf8');
  const path = fs.readFileSync('modules/path.js', 'utf8');

  assert.match(keyboard, /new MutationObserver\(records =>/);
  assert.match(keyboard, /record\.addedNodes\.forEach/);
  assert.doesNotMatch(keyboard, /new MutationObserver\(scan\)/);

  assert.match(path, /if \(isCurrent\) sec\.open = true/);
  assert.match(path, /function populateItems\(\)/);
  assert.match(path, /sec\.addEventListener\('toggle'/);
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

test('closed mobile navigation is inert and Escape restores focus', () => {
  const app = fs.readFileSync('app.js', 'utf8');
  assert.match(app, /nav\.inert\s*=\s*!exposed/);
  assert.match(app, /nav\.setAttribute\('aria-hidden',\s*'true'\)/);
  assert.match(app, /ham\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  assert.match(app, /e\.key\s*===\s*'Escape'[\s\S]*close\(true\)/);
});

test('home artwork uses a bounded semantic grid instead of scattered offsets', () => {
  const app = fs.readFileSync('app.js', 'utf8');
  const css = fs.readFileSync('editorial.css', 'utf8');

  assert.match(app, /class="language-block" data-shape="primary" aria-hidden="true"/);
  assert.match(app, /<ol class="today-steps">/);
  assert.match(app, /role="progressbar"/);
  assert.doesNotMatch(app, /language-block-(?:one|two|three|four|five|six|seven|glass)/);
  assert.match(css, /grid-template-columns: repeat\(12, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.home-cheer \{[\s\S]{0,260}grid-area: 6 \/ 10 \/ 11 \/ 13/);
  assert.doesNotMatch(css, /\.home-cheer[^}]*right:\s*-/);
});

test('writing evidence cannot be completed without a full draft', () => {
  const source = fs.readFileSync('modules/write.js', 'utf8');
  assert.match(source, /id="compare" disabled/);
  assert.match(source, /compareBtn\.disabled = n < g\.words\[0\]/);
  assert.match(source, /doneBtn\.disabled = n < g\.words\[0\] \|\| !boxes\.every/);
});

test('same-hash re-renders broadcast a teardown signal and timer modules honour it', () => {
  const app = fs.readFileSync('app.js', 'utf8');
  // go() must announce a same-hash repaint before rendering, because no
  // hashchange event will fire to tear down running lesson/game timers.
  assert.match(app, /dispatchEvent\(new CustomEvent\('app:navigate'\)\);\s*\n\s*renderActive\(\)/);

  // Every module that arms a view-owning countdown must subscribe its
  // hashchange teardown to app:navigate too, and unsubscribe both.
  for (const file of ['modules/games.js', 'modules/connectors.js', 'modules/mock.js', 'modules/chrome.js']) {
    const source = fs.readFileSync(file, 'utf8');
    const adds = source.match(/addEventListener\('app:navigate'/g) || [];
    const removes = source.match(/removeEventListener\('app:navigate'/g) || [];
    assert.ok(adds.length > 0, `${file} must listen for app:navigate`);
    assert.ok(removes.length >= adds.length, `${file} must remove every app:navigate listener`);
  }
});

test('filled accent/warn surfaces use -fill tokens so dark-mode pastels never carry white text', () => {
  // Dark mode maps --accent/--warn to pastels (#7C9CFF / #E8BC72). White text
  // on those fails WCAG; filled surfaces must use the -fill variants instead.
  // Scoped to module inline styles — stylesheet rules can be (and are)
  // re-themed by editorial.css, but inline styles always win the cascade.
  const sources = fs.readdirSync('modules').filter(f => f.endsWith('.js')).map(f => `modules/${f}`).concat(['app.js']);
  for (const file of sources) {
    const text = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /background:\s*var\(--accent\)\s*;\s*color:\s*(?:white|#fff)/i, `${file}: white text on raw --accent`);
    assert.doesNotMatch(text, /background:\s*var\(--warn\)\s*;\s*color:\s*(?:white|#fff|var\(--gray-900\))/i, `${file}: unreadable text on raw --warn`);
  }
});

test('profile creation rejects rather than silently rewrites invalid names', () => {
  const source = fs.readFileSync('modules/profile.js', 'utf8');
  assert.match(source, /if \(name !== raw\)/);
  assert.match(source, /hyphens, or underscores/);
  assert.match(source, /maxlength="24"/);
});
