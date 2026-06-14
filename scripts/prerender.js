// Pre-render generator — turns the app's in-browser content (scenarios, grammar,
// connectors) into static, crawlable HTML pages so Google can index the site's
// real depth, not just the landing pages.
//
// The SPA itself is untouched: these are separate static files that READ the same
// data/*.js files (single source of truth) and link back into the app to practise
// with audio. Run:  node scripts/prerender.js
//
// Output (all served at clean extensionless URLs by Cloudflare Pages):
//   /scenarios/            index of all 50 real-life dialogues
//   /scenarios/<id>        one page per scenario (bilingual dialogue + vocab + grammar)
//   /grammar/              index of all grammar units
//   /grammar/<slug>        one page per grammar unit (rules + tables + examples)
//   /french-connectors     single reference page for all 22 connectors
//   /sitemap.xml           regenerated to include everything (this file OWNS the sitemap)
//
// NOTE: this script is the single source for sitemap.xml. Hand-made landing pages
// are listed in LANDING below — add new ones there.

const fs = require('fs');
const path = require('path');

global.window = global;
const ROOT = path.join(__dirname, '..');
['grammar', 'grammar_extra', 'grammar_more', 'connectors_mastery', 'scenarios']
  .forEach(n => require(path.join(ROOT, 'data', n + '.js')));

const SITE = 'https://frenchclb6.ca';
const TODAY = new Date().toISOString().slice(0, 10);

// Hand-made landing pages (kept in the repo root). Add new ones here so they stay
// in the sitemap. [path, priority]
const LANDING = [
  ['/', '1.0'],
  ['/how-to-score-clb6', '0.9'],
  ['/clb6-french-course', '0.9'],
  ['/free-french-course-canada', '0.9'],
  ['/tcf-canada-mock-test', '0.8'],
  ['/tef-vs-tcf-canada', '0.8'],
  ['/clb-6-vs-clb-7-french', '0.8'],
  ['/learn-french-express-entry', '0.8'],
];

// ── helpers ──────────────────────────────────────────────────────────────────
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const attr = esc;
const stripTags = s => String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const truncate = (s, n = 158) => { s = String(s); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'; };
const frEn = x => (typeof x === 'string' ? { fr: x, en: '' } : x);

function jsonLd(graph) {
  return '<script type="application/ld+json">\n' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2) +
    '\n</' + 'script>';
}

function breadcrumbJson(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, item: SITE + t.href,
    })),
  };
}

function articleJson(title, description, urlPath) {
  return {
    '@type': 'Article',
    headline: stripTags(title),
    description: stripTags(description),
    inLanguage: 'en-CA',
    image: SITE + '/og-image.jpg',
    mainEntityOfPage: SITE + urlPath,
    publisher: { '@type': 'Organization', name: 'Bonjour!', url: SITE + '/' },
  };
}

function crumbsHtml(trail) {
  return '<nav class="chrome-crumbs" aria-label="Breadcrumb" style="margin-bottom:var(--sp-4)">' +
    trail.map((t, i) => {
      const last = i === trail.length - 1;
      const link = last ? `<b>${esc(t.name)}</b>` : `<a href="${t.href}" style="color:var(--bleu)">${esc(t.name)}</a>`;
      return link + (last ? '' : '<span class="sep">›</span>');
    }).join('') + '</nav>';
}

function shell({ urlPath, title, description, ogType = 'article', navExtra = '', bodyHtml, graph }) {
  const url = SITE + urlPath;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#0055A4" />

  <title>${esc(title)}</title>
  <meta name="description" content="${attr(description)}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Bonjour!" />
  <meta property="og:title" content="${attr(title)}" />
  <meta property="og:description" content="${attr(description)}" />
  <meta property="og:image" content="${SITE}/og-image.jpg" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="en_CA" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" /></noscript>
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/fonts/fonts.css" />

  ${jsonLd(graph)}
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/" style="text-decoration:none">
      <span class="logo">🐓</span>
      <span class="brand-name">Bonjour!</span>
    </a>
    <nav class="nav" style="position:static;display:flex;transform:none;box-shadow:none;background:transparent">
      <a href="/">Home</a>
      ${navExtra}
    </nav>
  </header>

  <main>
${bodyHtml}
  </main>

  <footer class="footer">
    <small>Free CLB 6 / TCF Canada prep · No accounts · No tracking · <a href="/">frenchclb6.ca</a></small>
  </footer>
</body>
</html>
`;
}

function box(inner, accent) {
  return `    <div class="grammar-box"${accent ? ' style="border-left-color:var(--accent)"' : ''}>\n${inner}\n    </div>`;
}
function hero(eyebrow, h1, lede) {
  return `    <section class="hero">
      <div class="flag-stripes"></div>
      <p class="eyebrow-h">${esc(eyebrow)}</p>
      <h1>${esc(h1)}</h1>
      <p style="margin-top:var(--sp-4)">${esc(lede)}</p>
    </section>`;
}
function ctaSpotlight(eyebrow, h2, p, href, label) {
  return `    <div class="spotlight" style="grid-template-columns:1fr;border:1px solid var(--accent)">
      <div>
        <p class="eyebrow" style="color:var(--accent)">${esc(eyebrow)}</p>
        <h2>${esc(h2)}</h2>
        <p>${esc(p)}</p>
        <div class="spacer"></div>
        <a class="btn primary big" href="${href}">${esc(label)}<span class="arr">→</span></a>
      </div>
    </div>`;
}
function backRow() {
  return `    <div class="center" style="margin-top:var(--sp-6)">
      <a class="btn big" href="/">← Back to Bonjour!</a>
    </div>`;
}

// ── slugs ────────────────────────────────────────────────────────────────────
const grammarSlug = (() => {
  const seen = new Set();
  return unit => {
    let s = unit.id.replace(/^g\d+-/, '');
    if (!s || seen.has(s)) s = unit.id; // guard against collisions / empties
    seen.add(s);
    return s;
  };
})();
const gSlugMap = new Map(window.GRAMMAR.map(u => [u.id, grammarSlug(u)]));

// ── scenario pages ───────────────────────────────────────────────────────────
function scenarioPage(sc, all) {
  const url = `/scenarios/${sc.id}`;
  const title = `${sc.title} — French Dialogue & Key Phrases | Bonjour!`;
  const description = truncate(`${sc.subtitle}. A bilingual French–English dialogue with key vocabulary, grammar notes and phrases to practise for CLB 6 / TCF Canada. Free, with native Canadian audio.`);

  const dialogue = sc.dialogue.map(l =>
    `      <p style="margin:0 0 12px"><b>${esc(l.text)}</b><br><span style="color:var(--ink-2)">${esc(l.en)}</span></p>`).join('\n');

  const vocab = `      <table class="conj-table"><tbody>\n` +
    sc.vocab.map(v => `        <tr><td><b>${esc(v.fr)}</b></td><td>${esc(v.en)}</td></tr>`).join('\n') +
    `\n      </tbody></table>`;

  const gf = sc.grammarFocus;
  const gfExamples = (gf.examples && gf.examples.length)
    ? `\n      <ul style="margin-left:20px;line-height:1.9;margin-top:6px">${gf.examples.map(e => `<li>${e}</li>`).join('')}</ul>` : '';

  const shadow = sc.shadowLines.map(frEn).map(s =>
    `      <p style="margin:0 0 10px"><b>${esc(s.fr)}</b>${s.en ? ` — <span style="color:var(--ink-2)">${esc(s.en)}</span>` : ''}</p>`).join('\n');

  const comp = (sc.comprehension && sc.comprehension.length)
    ? sc.comprehension.map((c, i) =>
      `      <p style="margin:0 0 10px"><b>${i + 1}. ${esc(c.q)}</b><br><span style="color:var(--ink-2)">Answer: ${esc(c.opts[c.a])}</span></p>`).join('\n') : '';

  const st = sc.speakingTask;
  const speak = st ? `      <p>${esc(st.prompt)}</p>
      <p style="margin-top:8px"><b>${esc(st.model)}</b><br><span style="color:var(--ink-2)">${esc(st.modelEn)}</span></p>` : '';

  // related: same category first, then others
  const others = all.filter(s => s.id !== sc.id);
  const related = [...others.filter(s => s.category === sc.category), ...others.filter(s => s.category !== sc.category)]
    .slice(0, 4)
    .map(s => `<a href="/scenarios/${s.id}" style="color:var(--bleu)">${esc(s.title)}</a>`).join(' · ');

  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'Scenarios', href: '/scenarios/' }, { name: sc.title, href: url }]),
    hero(`${sc.categoryIcon} ${sc.category} · ${sc.level} · ${sc.duration}`, sc.title, sc.subtitle),
    box(`      <h2>The situation</h2>
      <p><b>You:</b> ${esc(sc.situation.you)}</p>
      <p style="margin-top:6px"><b>Them:</b> ${esc(sc.situation.them)}</p>
      <p style="margin-top:6px"><b>Goal:</b> ${esc(sc.situation.goal)}</p>`),
    box(`      <h2>The conversation (French &amp; English)</h2>\n${dialogue}`),
    box(`      <h2>Key vocabulary</h2>\n${vocab}`),
    box(`      <h3>Grammar in this conversation — ${esc(gf.title)}</h3>\n      <p>${gf.note}</p>${gfExamples}`, true),
    box(`      <h2>Phrases to practise aloud</h2>\n${shadow}`),
    comp ? box(`      <h2>Check your understanding</h2>\n${comp}`) : '',
    speak ? box(`      <h2>Your speaking challenge</h2>\n${speak}`) : '',
    ctaSpotlight('Practise with audio', 'Run this scenario in the app',
      'Hear every line in native Canadian French, shadow it aloud, and self-check — free, no signup, all in your browser.',
      '/#scenario', 'Open the scenarios'),
    `    <h2 class="section-h">More scenarios</h2>
    <p>${related}</p>
    <p style="margin-top:var(--sp-3)"><a href="/scenarios/" style="color:var(--bleu)"><b>See all 50 scenarios →</b></a></p>`,
    backRow(),
  ].filter(Boolean).join('\n\n');

  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'Scenarios', href: '/scenarios/' }, { name: sc.title, href: url }]),
    articleJson(sc.title + ' — French dialogue', description, url),
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/scenarios/">All scenarios</a>', bodyHtml: body, graph });
}

function scenarioIndex(all) {
  const url = '/scenarios/';
  const title = 'French Conversation Scenarios for Canada — 50 Real-Life Dialogues';
  const description = 'Fifty real-life French conversation scenarios for life in Canada: renting, banking, the doctor, work, government and more — each a bilingual dialogue with vocabulary. Free.';

  // group by category in first-appearance order
  const order = [];
  const byCat = {};
  for (const s of all) {
    if (!byCat[s.category]) { byCat[s.category] = []; order.push(s.category); }
    byCat[s.category].push(s);
  }
  const groups = order.map(cat => {
    const icon = byCat[cat][0].categoryIcon || '';
    const items = byCat[cat].map(s =>
      `        <li><a href="/scenarios/${s.id}" style="color:var(--bleu)"><b>${esc(s.title)}</b></a> — ${esc(s.subtitle)} <span style="color:var(--ink-2)">(${esc(s.level)})</span></li>`).join('\n');
    return box(`      <h2>${esc(icon)} ${esc(cat)}</h2>\n      <ul style="margin-left:20px;line-height:1.9">\n${items}\n      </ul>`);
  }).join('\n\n');

  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'Scenarios', href: url }]),
    hero('Real-life French · CLB 6 / TCF Canada', 'French conversation scenarios for Canada',
      `${all.length} real-life situations you'll actually face in Canada — each a bilingual French–English dialogue with key vocabulary, a grammar focus, and phrases to practise aloud.`),
    groups,
    ctaSpotlight('Free · no signup', 'Practise every scenario with audio',
      'Open the app to hear each dialogue in native Canadian French, shadow it aloud, and track your progress — all in your browser.',
      '/#scenario', 'Open the scenarios'),
    backRow(),
  ].join('\n\n');

  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'Scenarios', href: url }]),
    articleJson(title, description, url),
    {
      '@type': 'ItemList',
      itemListElement: all.map((s, i) => ({
        '@type': 'ListItem', position: i + 1, url: SITE + '/scenarios/' + s.id, name: s.title,
      })),
    },
  ];
  return shell({ urlPath: url, title, description, ogType: 'website', navExtra: '<a href="/grammar/">Grammar</a>', bodyHtml: body, graph });
}

// ── grammar pages ────────────────────────────────────────────────────────────
function grammarPage(unit, all) {
  const slug = gSlugMap.get(unit.id);
  const url = `/grammar/${slug}`;
  const title = `${unit.title} — French Grammar Explained (${unit.level}) | Bonjour!`;
  const description = truncate(stripTags(unit.intro) || `${unit.title}: a clear, example-first French grammar explanation for CLB 6 / B1 learners.`);

  const rules = unit.rules.map(r => {
    const table = (r.table && r.table.length)
      ? `\n      <table class="conj-table"><tbody>${r.table.map(row => `<tr><td><b>${esc(row[0])}</b></td><td>${esc(row[1])}</td></tr>`).join('')}</tbody></table>` : '';
    const examples = (r.examples && r.examples.length)
      ? `\n      <ul style="margin-left:20px;line-height:1.9;margin-top:6px">${r.examples.map(e => `<li>${e}</li>`).join('')}</ul>` : '';
    const bodyP = r.body ? `\n      <p>${r.body}</p>` : '';
    return box(`      <h3>${esc(r.title)}</h3>${bodyP}${table}${examples}`);
  }).join('\n\n');

  const related = all.filter(u => u.id !== unit.id).slice(0, 6)
    .map(u => `<a href="/grammar/${gSlugMap.get(u.id)}" style="color:var(--bleu)">${esc(u.title)}</a>`).join(' · ');

  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'Grammar', href: '/grammar/' }, { name: unit.title, href: url }]),
    hero(`French grammar · ${unit.level}`, unit.title, 'A clear, example-first explanation built for CLB 6 / B1 — the level you need for TCF / TEF Canada.'),
    box(`      <h2>Overview</h2>\n      <p>${unit.intro}</p>`),
    rules,
    ctaSpotlight('Free practice', 'Drill this in the app',
      'Open the grammar trainer to practise this point with instant feedback and spaced review — free, no signup.',
      '/#grammar', 'Open the grammar trainer'),
    `    <h2 class="section-h">More grammar</h2>
    <p>${related}</p>
    <p style="margin-top:var(--sp-3)"><a href="/grammar/" style="color:var(--bleu)"><b>See the full grammar guide →</b></a></p>`,
    backRow(),
  ].join('\n\n');

  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'Grammar', href: '/grammar/' }, { name: unit.title, href: url }]),
    articleJson(unit.title + ' — French grammar', description, url),
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/grammar/">All grammar</a>', bodyHtml: body, graph });
}

function grammarIndex(all) {
  const url = '/grammar/';
  const title = 'French Grammar Guide for CLB 6 — A1 to B1, Explained Simply';
  const description = 'A free French grammar guide for CLB 6 / TCF Canada: articles, verbs, tenses, pronouns and the B1 points that decide the exam — each explained with clear examples.';

  const levelOrder = ['A1', 'A1-A2', 'A2', 'A2-B1', 'B1', 'B1-B2'];
  const byLevel = {};
  for (const u of all) (byLevel[u.level] = byLevel[u.level] || []).push(u);
  const levels = [...new Set([...levelOrder, ...Object.keys(byLevel)])].filter(l => byLevel[l]);

  const groups = levels.map(lvl => {
    const items = byLevel[lvl].map(u =>
      `        <li><a href="/grammar/${gSlugMap.get(u.id)}" style="color:var(--bleu)"><b>${esc(u.title)}</b></a></li>`).join('\n');
    return box(`      <h2>Level ${esc(lvl)}</h2>\n      <ul style="margin-left:20px;line-height:1.9">\n${items}\n      </ul>`);
  }).join('\n\n');

  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'Grammar', href: url }]),
    hero('French grammar · A1 → B1', 'French grammar guide for CLB 6',
      `${all.length} grammar units from absolute beginner (A1) to the B1 ceiling you need for CLB 6 — every one explained with examples first, then the rule.`),
    groups,
    ctaSpotlight('Free · no signup', 'Practise grammar with feedback',
      'Open the app to drill every point with instant feedback and spaced repetition — all in your browser.',
      '/#grammar', 'Open the grammar trainer'),
    backRow(),
  ].join('\n\n');

  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'Grammar', href: url }]),
    articleJson(title, description, url),
    {
      '@type': 'ItemList',
      itemListElement: all.map((u, i) => ({
        '@type': 'ListItem', position: i + 1, url: SITE + '/grammar/' + gSlugMap.get(u.id), name: u.title,
      })),
    },
  ];
  return shell({ urlPath: url, title, description, ogType: 'website', navExtra: '<a href="/scenarios/">Scenarios</a>', bodyHtml: body, graph });
}

// ── connectors reference (single page) ───────────────────────────────────────
function connectorsPage(all) {
  const url = '/french-connectors';
  const title = 'French Connectors List — 22 Linking Words for CLB 6 (with Examples)';
  const description = 'The 22 most-tested French connectors for CLB 6 — parce que, donc, cependant, ensuite and more — grouped by function, each with meaning and example sentences. Free.';

  const order = [];
  const byCat = {};
  for (const c of all) {
    if (!byCat[c.category]) { byCat[c.category] = []; order.push(c.category); }
    byCat[c.category].push(c);
  }
  const groups = order.map(cat => {
    const items = byCat[cat].map(c => {
      const ex = (c.examples || []).map(frEn).map(e =>
        `<li>${e.fr}${e.en ? ` <span style="color:var(--ink-2)">— ${esc(e.en)}</span>` : ''}</li>`).join('');
      return `      <h3>${esc(c.word)} <span style="color:var(--ink-2);font-weight:500">— ${esc(c.gloss)}</span></h3>
      ${c.when ? `<p>${c.when}</p>` : ''}
      <ul style="margin-left:20px;line-height:1.9;margin-top:6px">${ex}</ul>`;
    }).join('\n');
    return box(`      <h2>${esc(cat)}</h2>\n${items}`);
  }).join('\n\n');

  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'French connectors', href: url }]),
    hero('Connectors · CLB 6 speaking & writing', 'French connectors: the 22 that matter for CLB 6',
      'Linking words are one of the strongest predictors of a CLB 6 speaking and writing score. Here are the 22 most-tested, grouped by function, with examples.'),
    groups,
    ctaSpotlight('Free practice', 'Drill connectors to automaticity',
      'Open the app to practise each connector across four exercise types until they appear in your French without thinking — free, no signup.',
      '/#connectormastery', 'Open connector mastery'),
    backRow(),
  ].join('\n\n');

  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'French connectors', href: url }]),
    articleJson(title, description, url),
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/grammar/">Grammar</a>', bodyHtml: body, graph });
}

// ── sitemap ──────────────────────────────────────────────────────────────────
function sitemap(entries) {
  const urls = entries.map(([loc, priority, freq]) =>
    `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${freq || 'monthly'}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// ── write ────────────────────────────────────────────────────────────────────
function write(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}

const scenarios = window.SCENARIOS;
const grammar = window.GRAMMAR;
const connectors = window.CONNECTORS;

write('scenarios/index.html', scenarioIndex(scenarios));
scenarios.forEach(sc => write(`scenarios/${sc.id}.html`, scenarioPage(sc, scenarios)));
write('grammar/index.html', grammarIndex(grammar));
grammar.forEach(u => write(`grammar/${gSlugMap.get(u.id)}.html`, grammarPage(u, grammar)));
write('french-connectors.html', connectorsPage(connectors));

// sitemap = landing pages + section indexes + every generated page
const sitemapEntries = [
  ...LANDING.map(([p, pr]) => [p, pr, p === '/' ? 'weekly' : 'monthly']),
  ['/scenarios/', '0.8', 'monthly'],
  ['/grammar/', '0.8', 'monthly'],
  ['/french-connectors', '0.7', 'monthly'],
  ...scenarios.map(s => [`/scenarios/${s.id}`, '0.6', 'monthly']),
  ...grammar.map(u => [`/grammar/${gSlugMap.get(u.id)}`, '0.6', 'monthly']),
];
write('sitemap.xml', sitemap(sitemapEntries));

console.log(`Pre-rendered:
  ${scenarios.length} scenario pages + index   → /scenarios/
  ${grammar.length} grammar pages + index      → /grammar/
  1 connectors reference                       → /french-connectors
  sitemap.xml                                  → ${sitemapEntries.length} URLs`);
