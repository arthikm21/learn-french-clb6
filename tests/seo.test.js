const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const SITE = 'https://frenchclb6.ca';

function sitemapUrls() {
  const xml = fs.readFileSync('sitemap.xml', 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
}

function localFile(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return 'index.html';
  return pathname.endsWith('/')
    ? `${pathname.slice(1)}index.html`
    : `${pathname.slice(1)}.html`;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

test('sitemap contains only unique canonical pages and meaningful lastmod values', () => {
  const xml = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = sitemapUrls();
  assert.ok(urls.length >= 99, `expected at least 99 public URLs, found ${urls.length}`);
  assert.equal(new Set(urls).size, urls.length, 'sitemap URLs must be unique');
  assert.doesNotMatch(xml, /<priority>|<changefreq>/, 'Google ignores sitemap priority and changefreq');
  assert.equal((xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length, urls.length);
  for (const url of urls) {
    assert.ok(url.startsWith(`${SITE}/`));
    assert.ok(fs.existsSync(localFile(url)), `${url} must have a local clean-URL target`);
  }
});
test('every sitemap page has unique metadata, a self-canonical, and valid JSON-LD', () => {
  const titles = new Map();
  const descriptions = new Map();
  for (const url of sitemapUrls()) {
    const file = localFile(url);
    const html = fs.readFileSync(file, 'utf8');
    const title = decodeEntities((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
    const description = decodeEntities((html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || [])[1] || '').trim();
    const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i) || [])[1];
    const h1Count = (html.match(/<h1\b/gi) || []).length;

    assert.match(html, /<html lang="en-CA">/i, `${file}: language must be explicit`);
    assert.ok(title.length >= 25 && title.length <= 70, `${file}: title length ${title.length}`);
    assert.ok(description.length >= 100 && description.length <= 180, `${file}: description length ${description.length}`);
    assert.equal(canonical, url, `${file}: canonical must match sitemap URL`);
    if (file !== 'index.html') assert.equal(h1Count, 1, `${file}: expected one h1`);

    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      assert.doesNotThrow(() => JSON.parse(block[1]), `${file}: invalid JSON-LD`);
    }
    assert.ok(!titles.has(title), `${file}: duplicate title with ${titles.get(title)}`);
    assert.ok(!descriptions.has(description), `${file}: duplicate description with ${descriptions.get(description)}`);
    titles.set(title, file);
    descriptions.set(description, file);
  }
});

test('TCF intent cluster is complete, connected, and cites primary sources', () => {
  const pages = [
    'tcf-canada.html', 'tcf-canada-listening.html', 'tcf-canada-reading.html',
    'tcf-canada-speaking.html', 'tcf-canada-writing.html',
    'tcf-canada-score-chart.html', 'tcf-canada-mock-test.html',
  ];
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /href="\/tcf-canada"/, `${file}: must link to the topic hub`);
    assert.match(html, /france-education-international\.fr\/test\/tcf-canada/, `${file}: must cite the test maker`);
    assert.match(html, /canada\.ca\/en\/immigration-refugees-citizenship/, `${file}: must cite IRCC`);
  }
  const hub = fs.readFileSync('tcf-canada.html', 'utf8');
  for (const slug of ['listening', 'reading', 'speaking', 'writing', 'score-chart', 'mock-test']) {
    assert.match(hub, new RegExp(`href="/tcf-canada-${slug}"`));
  }
});
