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
const { execFileSync } = require('child_process');

global.window = global;
const ROOT = path.join(__dirname, '..');
['grammar', 'grammar_extra', 'grammar_more', 'connectors_mastery', 'scenarios']
  .forEach(n => require(path.join(ROOT, 'data', n + '.js')));

const SITE = 'https://frenchclb6.ca';
const TODAY = (() => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Halifax', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
})();
const SEO_PUBLISHED = '2026-08-01';
const indexSource = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const ASSET_VERSION = (indexSource.match(/styles\.css\?v=([0-9]+)/) || [])[1] || TODAY.replace(/-/g, '');

// Hand-made landing pages (kept in the repo root). Add new ones here so they stay
// in the sitemap. [path, priority]
const LANDING = [
  ['/', '1.0'],
  ['/how-to-score-clb6', '0.9'],
  ['/clb6-french-course', '0.9'],
  ['/free-french-course-canada', '0.9'],
  ['/tcf-canada', '0.9'],
  ['/tcf-canada-mock-test', '0.8'],
  ['/tcf-canada-listening', '0.8'],
  ['/tcf-canada-reading', '0.8'],
  ['/tcf-canada-score-chart', '0.8'],
  ['/tef-vs-tcf-canada', '0.8'],
  ['/clb-6-vs-clb-7-french', '0.8'],
  ['/learn-french-express-entry', '0.8'],
  ['/clb-7-french', '0.8'],
  ['/tcf-canada-speaking', '0.8'],
  ['/tcf-canada-writing', '0.8'],
  ['/tef-canada', '0.8'],
  ['/about', '0.5'],
];

const OFFICIAL = {
  tcf: 'https://www.france-education-international.fr/test/tcf-canada',
  ircc: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-test.html',
};

// ── helpers ──────────────────────────────────────────────────────────────────
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const attr = esc;
const stripTags = s => String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const truncate = (s, n = 158) => { s = String(s); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'; };
const stripTerminal = s => String(s == null ? '' : s).trim().replace(/[.!?…]+$/, '');
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

function authoredArticleJson(title, description, urlPath, citations = []) {
  return {
    ...articleJson(title, description, urlPath),
    '@id': SITE + urlPath + '#article',
    author: { '@type': 'Person', name: 'Arthik Marasini', url: SITE + '/about' },
    datePublished: SEO_PUBLISHED,
    dateModified: SEO_PUBLISHED,
    citation: citations,
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
<html lang="en-CA">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#FBF8F3" />

  <title>${esc(title)}</title>
  <meta name="description" content="${attr(description)}" />
  <link rel="canonical" href="${url}" />

  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Bonjour!" />
  <meta property="og:title" content="${attr(title)}" />
  <meta property="og:description" content="${attr(description)}" />
  <meta property="og:image" content="${SITE}/og-image.jpg" />
  <meta property="og:image:alt" content="Bonjour! French practice for Canada" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="en_CA" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${attr(title)}" />
  <meta name="twitter:description" content="${attr(description)}" />
  <meta name="twitter:image" content="${SITE}/og-image.jpg" />

  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css?v=${ASSET_VERSION}" />
  <link rel="stylesheet" href="/fonts/fonts.css?v=${ASSET_VERSION}" />
  <link rel="stylesheet" href="/editorial.css?v=${ASSET_VERSION}" />

  ${jsonLd(graph)}
</head>
<body>
  <script>
    /* Pre-paint theme so standalone pages match the app (saved pref or system
       dark) before first render — no flash, parity with index.html. */
    try {
      var t = localStorage.getItem('fr_theme_v1');
      var dark = t === 'dark' || (!t && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      if (dark) document.body.classList.add('dark');
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      if (dark) { var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', '#07080B'); }
    } catch (e) {}
  </script>
  <a class="skip-link" href="#main-content">Skip to lesson content</a>
  <header class="topbar">
    <a class="brand" href="/" style="text-decoration:none">
      <span class="brand-mark" aria-hidden="true">B<span>.</span></span>
      <span class="brand-lockup"><span class="brand-name">Bonjour</span><small>French for Canada</small></span>
    </a>
    <nav class="nav" aria-label="Primary" style="position:static;display:flex;transform:none;box-shadow:none;background:transparent">
      <a href="/">Home</a>
      ${navExtra}
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
${bodyHtml}
  </main>

  <footer class="footer">
    <nav class="footer-links" aria-label="Footer">
      <a href="/">Home</a>
      <a href="/clb6-french-course">The course</a>
      <a href="/scenarios/">Scenarios</a>
      <a href="/grammar/">Grammar</a>
      <a href="/tcf-canada">TCF guide</a>
      <a href="/tcf-canada-mock-test">Mock test</a>
      <a href="/about">About</a>
    </nav>
    <p class="footer-fine">Free CLB 6 / TCF Canada prep · No accounts · No tracking · Canadian French neural audio · <a href="/">frenchclb6.ca</a></p>
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

function tcfTopicNav(current) {
  const links = [
    ['/tcf-canada', 'Overview'],
    ['/tcf-canada-listening', 'Listening'],
    ['/tcf-canada-reading', 'Reading'],
    ['/tcf-canada-speaking', 'Speaking'],
    ['/tcf-canada-writing', 'Writing'],
    ['/tcf-canada-score-chart', 'Score chart'],
    ['/tcf-canada-mock-test', 'Mock test'],
  ];
  return `    <nav class="topic-nav" aria-label="TCF Canada preparation topics">
      ${links.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ')}
    </nav>`;
}

function reviewBox(sources) {
  return box(`      <p class="source-kicker">Reviewed against official sources · Updated August 1, 2026</p>
      <p>Exam formats and immigration equivalencies can change. Verify before booking or submitting results: ${sources.map(source => `<a href="${source.href}" target="_blank" rel="noopener">${esc(source.label)}</a>`).join(' · ')}.</p>`, true);
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
  const scenarioTitle = `${sc.title} — French Dialogue`;
  const title = scenarioTitle.length <= 49 ? `${scenarioTitle} | Bonjour!` : truncate(scenarioTitle, 60);
  const description = `${stripTerminal(sc.subtitle)}. Practise with a bilingual dialogue, key vocabulary, grammar notes and Canadian French audio.`;

  const dialogue = sc.dialogue.map(l =>
    `      <p style="margin:0 0 12px"><b lang="fr-CA">${esc(l.text)}</b><br><span lang="en" style="color:var(--ink-2)">${esc(l.en)}</span></p>`).join('\n');

  const vocab = `      <table class="conj-table"><caption class="sr-only">French vocabulary and English meanings</caption><thead><tr><th scope="col">French</th><th scope="col">English</th></tr></thead><tbody>\n` +
    sc.vocab.map(v => `        <tr><th scope="row" lang="fr-CA">${esc(v.fr)}</th><td lang="en">${esc(v.en)}</td></tr>`).join('\n') +
    `\n      </tbody></table>`;

  const gf = sc.grammarFocus;
  const gfExamples = (gf.examples && gf.examples.length)
    ? `\n      <ul lang="fr-CA" style="margin-left:20px;line-height:1.9;margin-top:6px">${gf.examples.map(e => `<li>${e}</li>`).join('')}</ul>` : '';

  const shadow = sc.shadowLines.map(frEn).map(s =>
    `      <p style="margin:0 0 10px"><b lang="fr-CA">${esc(s.fr)}</b>${s.en ? ` — <span lang="en" style="color:var(--ink-2)">${esc(s.en)}</span>` : ''}</p>`).join('\n');

  const comp = (sc.comprehension && sc.comprehension.length)
    ? sc.comprehension.map((c, i) =>
      `      <p style="margin:0 0 10px"><b>${i + 1}. ${esc(c.q)}</b><br><span style="color:var(--ink-2)">Answer: ${esc(c.opts[c.a])}</span></p>`).join('\n') : '';

  const st = sc.speakingTask;
  const speak = st ? `      <p>${esc(st.prompt)}</p>
      <p style="margin-top:8px"><b lang="fr-CA">${esc(st.model)}</b><br><span lang="en" style="color:var(--ink-2)">${esc(st.modelEn)}</span></p>` : '';

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
    box(`      <h2>Learning note</h2>
      <p>This is a fictional practice dialogue, not personal, legal, medical, financial, immigration, or government-service advice. Eligibility, documents, fees, timelines, and rules can change; verify important details with the official service.</p>`, true),
    box(`      <h2>The conversation (French &amp; English)</h2>\n${dialogue}`),
    box(`      <h2>Key vocabulary</h2>\n${vocab}`),
    box(`      <h3>Grammar in this conversation — ${esc(gf.title)}</h3>\n      <p>${gf.note}</p>${gfExamples}`, true),
    box(`      <h2>Phrases to practise aloud</h2>\n${shadow}`),
    comp ? box(`      <h2>Check your understanding</h2>\n${comp}`) : '',
    speak ? box(`      <h2>Your speaking challenge</h2>\n${speak}`) : '',
    ctaSpotlight('Practise with audio', 'Run this scenario in the app',
      'Hear every line in Canadian French neural audio, shadow it aloud, and self-check — free, no signup, all in your browser.',
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
      'Open the app to hear each dialogue in Canadian French neural audio, shadow it aloud, and track your progress — all in your browser.',
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
  const grammarTitle = `${unit.title} — French Grammar`;
  const title = grammarTitle.length <= 49 ? `${grammarTitle} | Bonjour!` : truncate(grammarTitle, 60);
  const intro = stripTerminal(stripTags(unit.intro));
  const description = truncate(intro
    ? `${intro}. Learn the rule with clear French examples and free CLB 6 / TCF Canada practice.`
    : `${unit.title}: a clear, example-first French grammar explanation with free practice for CLB 6 / TCF Canada learners.`);

  const rules = unit.rules.map(r => {
    const table = (r.table && r.table.length)
      ? `\n      <table class="conj-table"><caption class="sr-only">${esc(r.title)} forms and examples</caption><thead><tr><th scope="col">Form</th><th scope="col">Meaning or example</th></tr></thead><tbody>${r.table.map(row => `<tr><th scope="row" lang="fr-CA">${esc(row[0])}</th><td lang="fr-CA">${esc(row[1])}</td></tr>`).join('')}</tbody></table>` : '';
    const examples = (r.examples && r.examples.length)
      ? `\n      <ul lang="fr-CA" style="margin-left:20px;line-height:1.9;margin-top:6px">${r.examples.map(e => `<li>${e}</li>`).join('')}</ul>` : '';
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
        `<li><span lang="fr-CA">${esc(e.fr)}</span>${e.en ? ` <span lang="en" style="color:var(--ink-2)">— ${esc(e.en)}</span>` : ''}</li>`).join('');
      return `      <h3><span lang="fr-CA">${esc(c.word)}</span> <span style="color:var(--ink-2);font-weight:500">— ${esc(c.gloss)}</span></h3>
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

// ── search-intent editorial pages ───────────────────────────────────────────
// These pages turn the app's strongest interactive features into a coherent
// TCF Canada topic cluster. Each page answers one distinct search intent and
// points to the relevant free practice instead of duplicating generic copy.
function tcfHubPage() {
  const url = '/tcf-canada';
  const title = 'TCF Canada Preparation — Free Course & Practice Guide';
  const description = 'Prepare for TCF Canada free with the current four-part format, an NCLC score chart, skill-by-skill practice, a 12-week plan and a full mock test. No signup.';
  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: url }]),
    hero('TCF Canada · Free preparation hub', 'TCF Canada preparation: start here',
      'Understand the current test, choose your target NCLC level, practise each of the four abilities, and finish with a full-duration simulation—free, with no signup.'),
    tcfTopicNav(url),
    box(`      <h2>TCF Canada in one minute</h2>
      <p>The <b>Test de connaissance du français pour le Canada</b> is an official French test accepted by Immigration, Refugees and Citizenship Canada (IRCC) for specified immigration and citizenship applications. The immigration version has <b>four mandatory tests</b>. France Éducation international reports a result for each ability; IRCC then maps each result to an <b>NCLC</b> level.</p>
      <p style="margin-top:var(--sp-3)"><b>NCLC is the French scale.</b> CLB is the parallel English scale. People often search for “CLB 7 French,” but the official French-language term is NCLC 7.</p>`),
    box(`      <h2>Current TCF Canada format</h2>
      <table class="conj-table"><caption class="sr-only">Current TCF Canada format by ability</caption><thead><tr><th scope="col">Ability</th><th scope="col">Official format</th><th scope="col">Free practice</th></tr></thead><tbody>
        <tr><th scope="row">Listening</th><td>39 multiple-choice questions · 35 minutes</td><td><a href="/tcf-canada-listening">Listening guide</a></td></tr>
        <tr><th scope="row">Reading</th><td>39 multiple-choice questions · 60 minutes</td><td><a href="/tcf-canada-reading">Reading guide</a></td></tr>
        <tr><th scope="row">Writing</th><td>3 tasks · 60 minutes</td><td><a href="/tcf-canada-writing">Writing guide</a></td></tr>
        <tr><th scope="row">Speaking</th><td>3 tasks · 12 minutes, including 2 minutes of preparation</td><td><a href="/tcf-canada-speaking">Speaking guide</a></td></tr>
      </tbody></table>
      <p style="margin-top:var(--sp-3)">The four tests total approximately <b>2 hours 47 minutes</b>. Listening and reading become progressively harder. Speaking is face-to-face with an examiner; speaking and writing are assessed by trained raters.</p>`),
    box(`      <h2>Choose the right target before you study</h2>
      <p>Do not prepare toward a vague idea of “passing.” TCF Canada has no single pass mark: your required NCLC level depends on the immigration or citizenship pathway. For many Express Entry candidates, <b>NCLC 7 in all four abilities</b> is an important threshold, but it is not the requirement for every program.</p>
      <p style="margin-top:var(--sp-3)">Use the <a href="/tcf-canada-score-chart">TCF Canada score chart</a> to turn your target NCLC level into four concrete score ranges. A strong ability does not compensate for another ability below a program's minimum.</p>`),
    box(`      <h2>A preparation loop that produces useful evidence</h2>
      <ol style="margin-left:20px;line-height:1.9;margin-top:6px">
        <li><b>Diagnose:</b> take one timed listening and reading set; record one speaking response and write one timed task.</li>
        <li><b>Classify errors:</b> separate language gaps from timing, misunderstood instructions, distractors, and incomplete task delivery.</li>
        <li><b>Train the weakest ability:</b> spend half of each week on the lowest result and split the rest across the other three.</li>
        <li><b>Re-test:</b> repeat a comparable task weekly and track raw accuracy, completion, and recurring errors.</li>
        <li><b>Calibrate:</b> use official samples for format and qualified human feedback for speaking and writing.</li>
      </ol>`),
    box(`      <h2>A practical 12-week TCF Canada plan</h2>
      <table class="conj-table"><caption class="sr-only">Twelve-week TCF Canada preparation plan</caption><thead><tr><th scope="col">Weeks</th><th scope="col">Focus</th><th scope="col">Evidence to keep</th></tr></thead><tbody>
        <tr><th scope="row">1–2</th><td>Diagnostic, exam format, core grammar and sound gaps</td><td>Baseline by ability</td></tr>
        <tr><th scope="row">3–6</th><td>Daily listening/reading plus two speaking and writing tasks weekly</td><td>Error log and timed samples</td></tr>
        <tr><th scope="row">7–9</th><td>Task strategy, natural-speed audio, opinion structure and connectors</td><td>Weekly comparable results</td></tr>
        <tr><th scope="row">10–12</th><td>Full sections, recovery work, then complete simulations</td><td>Stable results under time</td></tr>
      </tbody></table>
      <p style="margin-top:var(--sp-3)">Twelve weeks is a preparation cycle, not a promise to move from beginner to NCLC 7. Your starting level and access to feedback determine the real timeline.</p>`),
    box(`      <h2>What is free on Bonjour!</h2>
      <p>The course includes an eight-phase A1-to-B1 path, Canadian French neural audio, 120 focused listening clips, 60 graded reading texts, 50 real-life conversation scenarios, TCF speaking and writing task practice, connector drills, recording and self-review, and a <a href="/tcf-canada-mock-test">full-duration TCF-format simulation</a>. Practice results are evidence for planning; they are not official scores or certified NCLC levels.</p>`),
    reviewBox([
      { href: OFFICIAL.tcf, label: 'France Éducation international — TCF Canada' },
      { href: OFFICIAL.ircc, label: 'IRCC — language test results and equivalencies' },
    ]),
    ctaSpotlight('Free · no signup', 'Start your TCF Canada preparation',
      'Follow one ordered path, practise all four skills, and keep your progress privately in your browser.',
      '/#path', 'Open the free learning path'),
    backRow(),
  ].join('\n\n');
  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: url }]),
    authoredArticleJson(title, description, url, [OFFICIAL.tcf, OFFICIAL.ircc]),
    {
      '@type': 'ItemList',
      name: 'TCF Canada preparation guides',
      itemListElement: [
        '/tcf-canada-listening', '/tcf-canada-reading', '/tcf-canada-speaking',
        '/tcf-canada-writing', '/tcf-canada-score-chart', '/tcf-canada-mock-test',
      ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + item })),
    },
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/tcf-canada-mock-test">Mock test</a>', bodyHtml: body, graph });
}

function tcfListeningPage() {
  const url = '/tcf-canada-listening';
  const title = 'TCF Canada Listening Practice — Free Guide & Mock Test';
  const description = 'Free TCF Canada listening practice: learn the 39-question, 35-minute format, audio rules, NCLC 7 target, error-review method and open a timed mock test.';
  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: '/tcf-canada' }, { name: 'Listening', href: url }]),
    hero('TCF Canada · Compréhension orale', 'TCF Canada listening practice',
      'Train for the 39-question listening section with the real time pressure in mind: one play, progressive difficulty, and decisions made from meaning—not isolated words.'),
    tcfTopicNav(url),
    box(`      <h2>Listening format at a glance</h2>
      <p>TCF Canada <b>Compréhension orale</b> contains <b>39 multiple-choice questions in 35 minutes</b>. Each recording is played once. On the official test, the question is presented after the audio, so passive listening and answer-key scanning are weak preparation strategies. The items progress from simple everyday exchanges toward longer, more abstract speech.</p>
      <p style="margin-top:var(--sp-3)">The official result uses a 0–699 scale. IRCC currently maps <b>458–502 to NCLC 7</b>; always verify the current table for your application.</p>`),
    box(`      <h2>What the section actually tests</h2>
      <ul style="margin-left:20px;line-height:1.9;margin-top:6px">
        <li>Identifying a setting, relationship, purpose, or requested action in a short exchange.</li>
        <li>Following announcements, instructions, interviews, reports, and everyday conversations.</li>
        <li>Separating a speaker's main point from examples, corrections, and distractors.</li>
        <li>Recognizing attitude, agreement, hesitation, contrast, and implied meaning.</li>
        <li>Holding the important details in working memory before seeing the answer choices.</li>
      </ul>`),
    box(`      <h2>The review method that makes practice compound</h2>
      <p>After every set, label each miss before replaying it:</p>
      <table class="conj-table"><caption class="sr-only">TCF listening error review categories</caption><thead><tr><th scope="col">Error</th><th scope="col">What to do next</th></tr></thead><tbody>
        <tr><th scope="row">Sound gap</th><td>Transcribe the short phrase; compare liaison, vowel, or reduced speech.</td></tr>
        <tr><th scope="row">Vocabulary gap</th><td>Save the whole phrase, not a single translated word.</td></tr>
        <tr><th scope="row">Meaning gap</th><td>State the speaker's purpose in one plain sentence.</td></tr>
        <tr><th scope="row">Distractor</th><td>Write why the tempting option was mentioned but did not answer the question.</td></tr>
        <tr><th scope="row">Memory/timing</th><td>Practise summarizing each clip aloud before looking at choices.</td></tr>
      </tbody></table>`),
    box(`      <h2>A weekly listening routine</h2>
      <ol style="margin-left:20px;line-height:1.9;margin-top:6px">
        <li><b>Three focused days:</b> 15–20 minutes of short clips, dictation, and error review.</li>
        <li><b>Two immersion days:</b> Radio-Canada, interviews, or podcasts at natural speed; summarize the message aloud.</li>
        <li><b>One timed section:</b> no transcript, no pause, no replay.</li>
        <li><b>One repair session:</b> revisit only the clips missed for language reasons.</li>
      </ol>
      <p style="margin-top:var(--sp-3)">The site offers 120 focused clips across five exercise types plus 39 original listening questions in the full simulation. Use official FEI samples for final format calibration.</p>`),
    reviewBox([
      { href: OFFICIAL.tcf, label: 'France Éducation international — official format' },
      { href: OFFICIAL.ircc, label: 'IRCC — TCF to NCLC equivalencies' },
    ]),
    ctaSpotlight('39 questions · timed', 'Run the free listening simulation',
      'Hear each original practice recording once, answer without a transcript, and review your raw accuracy afterward.',
      '/#mock', 'Start the free mock test'),
    `    <p class="related-guides"><b>Next:</b> <a href="/tcf-canada-reading">Reading practice</a> · <a href="/tcf-canada-score-chart">Score chart</a> · <a href="/tcf-canada-speaking">Speaking practice</a></p>`,
    backRow(),
  ].join('\n\n');
  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: '/tcf-canada' }, { name: 'Listening', href: url }]),
    authoredArticleJson(title, description, url, [OFFICIAL.tcf, OFFICIAL.ircc]),
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/tcf-canada">TCF guide</a>', bodyHtml: body, graph });
}

function tcfReadingPage() {
  const url = '/tcf-canada-reading';
  const title = 'TCF Canada Reading Practice — Free Guide & Mock Test';
  const description = 'Free TCF Canada reading practice: learn the 39-question, 60-minute format, NCLC 7 target, pacing and review strategies, then open a timed mock test.';
  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: '/tcf-canada' }, { name: 'Reading', href: url }]),
    hero('TCF Canada · Compréhension écrite', 'TCF Canada reading practice',
      'Build the speed to answer 39 progressively harder questions in 60 minutes without trading away careful inference and document-purpose reading.'),
    tcfTopicNav(url),
    box(`      <h2>Reading format at a glance</h2>
      <p>TCF Canada <b>Compréhension écrite</b> contains <b>39 multiple-choice questions in 60 minutes</b>. The difficulty rises across the section, from familiar notices and messages to longer texts, opinions, and abstract arguments. The official result uses a 0–699 scale; IRCC currently maps <b>453–498 to NCLC 7</b>.</p>
      <p style="margin-top:var(--sp-3)">There is no benefit in spending equal time on every item. Protect enough time for the later passages while banking the shorter early questions accurately.</p>`),
    box(`      <h2>Read the document before chasing details</h2>
      <p>For each text, identify four things first: <b>who wrote it, who it is for, why it exists, and what action or conclusion it supports</b>. This prevents a common mistake: choosing an option that repeats a true detail but misses the author's purpose.</p>
      <ul style="margin-left:20px;line-height:1.9;margin-top:6px">
        <li>Notices and advertisements: locate conditions, exclusions, dates, and required action.</li>
        <li>Emails and letters: track relationship, register, problem, and next step.</li>
        <li>News and informational texts: separate the main claim from supporting examples.</li>
        <li>Opinion texts: map position, concession, contrast, cause, and consequence.</li>
      </ul>`),
    box(`      <h2>A safe pacing plan</h2>
      <table class="conj-table"><caption class="sr-only">Suggested TCF Canada reading pacing plan</caption><thead><tr><th scope="col">Checkpoint</th><th scope="col">Target</th><th scope="col">Rule</th></tr></thead><tbody>
        <tr><th scope="row">First third</th><td>Move quickly through short practical texts</td><td>Do not over-interpret a direct question.</td></tr>
        <tr><th scope="row">Middle third</th><td>Confirm reference words and paragraph purpose</td><td>Return to the exact sentence that supports the answer.</td></tr>
        <tr><th scope="row">Final third</th><td>Reserve the largest block for dense texts</td><td>Eliminate by contradiction and scope, not vocabulary alone.</td></tr>
        <tr><th scope="row">Final minutes</th><td>Answer every remaining item</td><td>Do not leave a question unanswered.</td></tr>
      </tbody></table>
      <p style="margin-top:var(--sp-3)">Adjust checkpoints from your own timed results; this is a practice framework, not an official allocation.</p>`),
    box(`      <h2>How to review a wrong reading answer</h2>
      <ol style="margin-left:20px;line-height:1.9;margin-top:6px">
        <li>Underline the smallest passage that proves the correct answer.</li>
        <li>Name the distractor: copied phrase, reversed meaning, true-but-irrelevant detail, overstatement, or unsupported inference.</li>
        <li>Rewrite the question in simpler French or English.</li>
        <li>Save one reusable phrase or connector from the passage.</li>
        <li>Re-answer the item two days later without looking at the key.</li>
      </ol>
      <p style="margin-top:var(--sp-3)">Bonjour! includes 60 graded reading texts across emails, ads, news, brochures, and stories, plus a 39-question timed simulation.</p>`),
    reviewBox([
      { href: OFFICIAL.tcf, label: 'France Éducation international — official format' },
      { href: OFFICIAL.ircc, label: 'IRCC — TCF to NCLC equivalencies' },
    ]),
    ctaSpotlight('39 questions · timed', 'Run the free reading simulation',
      'Practise progressive reading questions under the official section time and keep a transparent raw result.',
      '/#mock', 'Start the free mock test'),
    `    <p class="related-guides"><b>Next:</b> <a href="/tcf-canada-listening">Listening practice</a> · <a href="/tcf-canada-score-chart">Score chart</a> · <a href="/tcf-canada-writing">Writing practice</a></p>`,
    backRow(),
  ].join('\n\n');
  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: '/tcf-canada' }, { name: 'Reading', href: url }]),
    authoredArticleJson(title, description, url, [OFFICIAL.tcf, OFFICIAL.ircc]),
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/tcf-canada">TCF guide</a>', bodyHtml: body, graph });
}

function tcfScorePage() {
  const url = '/tcf-canada-score-chart';
  const title = 'TCF Canada Score Chart — NCLC 4–10 Conversion (2026)';
  const description = 'Use the current TCF Canada score chart to convert listening, reading, speaking and writing results to NCLC 4–10, including the NCLC 7 target.';
  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: '/tcf-canada' }, { name: 'Score chart', href: url }]),
    hero('TCF Canada · IRCC equivalencies', 'TCF Canada score chart: TCF to NCLC',
      'Convert each TCF Canada ability separately. This reference reproduces the current IRCC equivalency bands for NCLC 4 through 10+.'),
    tcfTopicNav(url),
    box(`      <h2>TCF Canada to NCLC conversion table</h2>
      <div class="table-scroll"><table class="conj-table"><caption>Current IRCC TCF Canada result equivalencies</caption><thead><tr><th scope="col">NCLC</th><th scope="col">Listening /699</th><th scope="col">Reading /699</th><th scope="col">Speaking /20</th><th scope="col">Writing /20</th></tr></thead><tbody>
        <tr><th scope="row">10+</th><td>549–699</td><td>549–699</td><td>16–20</td><td>16–20</td></tr>
        <tr><th scope="row">9</th><td>523–548</td><td>524–548</td><td>14–15</td><td>14–15</td></tr>
        <tr><th scope="row">8</th><td>503–522</td><td>499–523</td><td>12–13</td><td>12–13</td></tr>
        <tr class="target-row"><th scope="row">7</th><td><b>458–502</b></td><td><b>453–498</b></td><td><b>10–11</b></td><td><b>10–11</b></td></tr>
        <tr><th scope="row">6</th><td>398–457</td><td>406–452</td><td>7–9</td><td>7–9</td></tr>
        <tr><th scope="row">5</th><td>369–397</td><td>375–405</td><td>6</td><td>6</td></tr>
        <tr><th scope="row">4</th><td>331–368</td><td>342–374</td><td>4–5</td><td>4–5</td></tr>
      </tbody></table></div>`),
    box(`      <h2>How to read your result correctly</h2>
      <p>Find each ability in its own column. For example, listening 470, reading 460, speaking 11, and writing 9 convert to NCLC 7, 7, 7, and 6. Your French is therefore <b>not NCLC 7 across all four abilities</b>; writing remains NCLC 6.</p>
      <p style="margin-top:var(--sp-3)">TCF Canada has no averaged all-skills result for IRCC requirements. Whether you need NCLC 4, 5, 7, or another threshold depends on the program and how French is counted in your profile.</p>`),
    box(`      <h2>Why NCLC 7 is highlighted</h2>
      <p>NCLC 7 is a high-intent target because it is relevant to the additional French-language points in Express Entry and to French-language category eligibility, subject to the current IRCC rules. It is not a universal pass mark and it does not guarantee an invitation. Confirm both the score conversion and the immigration rule that applies to you.</p>
      <p style="margin-top:var(--sp-3)"><a href="/clb-7-french">See what NCLC 7 French ability looks like</a> or compare <a href="/clb-6-vs-clb-7-french">NCLC 6 vs NCLC 7</a>.</p>`),
    box(`      <h2>Do not convert mock-test percentages into TCF scores</h2>
      <p>Official listening and reading results are not a simple “correct answers × points” calculation; item difficulty is part of the scoring process. Speaking and writing are rated by trained evaluators. A practice percentage can show a trend, but it cannot certify a TCF result or NCLC band.</p>`),
    reviewBox([
      { href: OFFICIAL.ircc, label: 'IRCC — official language-test equivalencies' },
      { href: OFFICIAL.tcf, label: 'France Éducation international — TCF Canada' },
    ]),
    ctaSpotlight('Target one ability at a time', 'Practise toward your weakest score',
      'Use the free path and full-duration simulation to collect honest practice evidence without inventing an official conversion.',
      '/#tcfguide', 'Open the score guide'),
    `    <p class="related-guides"><b>Prepare:</b> <a href="/tcf-canada-listening">Listening</a> · <a href="/tcf-canada-reading">Reading</a> · <a href="/tcf-canada-speaking">Speaking</a> · <a href="/tcf-canada-writing">Writing</a></p>`,
    backRow(),
  ].join('\n\n');
  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'TCF Canada', href: '/tcf-canada' }, { name: 'Score chart', href: url }]),
    authoredArticleJson(title, description, url, [OFFICIAL.ircc, OFFICIAL.tcf]),
    {
      '@type': 'Dataset',
      name: 'TCF Canada to NCLC score equivalencies',
      description: 'IRCC equivalency bands for TCF Canada listening, reading, speaking, and writing results.',
      url: SITE + url,
      isBasedOn: OFFICIAL.ircc,
      dateModified: SEO_PUBLISHED,
      creator: { '@type': 'Organization', name: 'Immigration, Refugees and Citizenship Canada' },
    },
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/tcf-canada">TCF guide</a>', bodyHtml: body, graph });
}

function aboutPage() {
  const url = '/about';
  const title = 'About Bonjour! — Free French Practice for Canada';
  const description = 'Learn who built Bonjour!, how its French and TCF Canada practice is created and reviewed, what the free course can and cannot assess, and how privacy works.';
  const body = [
    crumbsHtml([{ name: 'Home', href: '/' }, { name: 'About', href: url }]),
    hero('About · Method · Trust', 'About Bonjour!',
      'An independent, free French-learning project for people building practical communication skills and preparing for Canadian language tests.'),
    box(`      <h2>Who built it</h2>
      <p>Bonjour! is built and maintained by <b>Arthik Marasini</b>. The project exists to make structured French practice available without a paywall, account, advertising profile, or email gate. You can <a href="https://www.linkedin.com/in/arthiknepal" target="_blank" rel="noopener">connect with Arthik on LinkedIn</a>.</p>
      <p style="margin-top:var(--sp-3)">Bonjour! is independent. It is not affiliated with, endorsed by, or an official product of IRCC, France Éducation international, CCI Paris Île-de-France, TCF Canada, or TEF Canada.</p>`),
    box(`      <h2>How the learning material is made</h2>
      <p>Lessons are organized around practical Canadian situations and an A1-to-B1 progression. The interactive banks include original dialogues, graded reading, listening, vocabulary, grammar, speaking prompts, and writing tasks. Exam-format pages are checked against the current test-maker documentation, while score equivalencies are checked against IRCC.</p>
      <p style="margin-top:var(--sp-3)">The practice questions are original learning material. The site does not claim to publish leaked, recalled, or official exam questions. Official provider samples should be part of every candidate's final preparation.</p>`),
    box(`      <h2>What the course can—and cannot—tell you</h2>
      <p>The course can show whether you complete representative tasks, which answers you miss, which grammar patterns recur, and whether your practice becomes more consistent under time. It cannot issue an official TCF/TEF score or certify an NCLC level.</p>
      <p style="margin-top:var(--sp-3)">Listening and reading practice results are reported transparently as raw evidence. Speaking and writing use models, checklists, recording, and limited automated checks; trained human feedback remains necessary for a defensible proficiency judgment.</p>`),
    box(`      <h2>Privacy by design</h2>
      <p>No account is required. Learning progress and speaking recordings stay in your browser; recordings are not uploaded by the site. Bonjour! does not use third-party display ads or behavioural analytics. Clearing browser storage can remove local progress, so the app includes a local backup and restore option.</p>`),
    reviewBox([
      { href: OFFICIAL.tcf, label: 'France Éducation international — TCF Canada' },
      { href: OFFICIAL.ircc, label: 'IRCC — language tests and equivalencies' },
      { href: 'https://www.lefrancaisdesaffaires.fr/en/candidate/test-evaluation-francais/tef-canada/presentation/', label: 'CCI Paris Île-de-France — TEF Canada' },
    ]),
    ctaSpotlight('Free · private · independent', 'Use the complete course',
      'Start with the diagnostic or follow the ordered eight-phase path. No signup and no payment required.',
      '/#path', 'Open the free course'),
    backRow(),
  ].join('\n\n');
  const graph = [
    breadcrumbJson([{ name: 'Home', href: '/' }, { name: 'About', href: url }]),
    {
      '@type': 'AboutPage', '@id': SITE + url + '#page', url: SITE + url,
      name: title, description, inLanguage: 'en-CA', dateModified: SEO_PUBLISHED,
      mainEntity: { '@id': SITE + '/#org' },
    },
    {
      '@type': 'Person', '@id': SITE + '/#arthik', name: 'Arthik Marasini',
      url: SITE + '/about', sameAs: ['https://www.linkedin.com/in/arthiknepal'],
      worksFor: { '@id': SITE + '/#org' },
    },
    {
      '@type': 'EducationalOrganization', '@id': SITE + '/#org', name: 'Bonjour!',
      url: SITE + '/', logo: SITE + '/icon-512.png', founder: { '@id': SITE + '/#arthik' },
    },
  ];
  return shell({ urlPath: url, title, description, navExtra: '<a href="/tcf-canada">TCF guide</a>', bodyHtml: body, graph });
}

// ── sitemap ──────────────────────────────────────────────────────────────────
function sitemap(entries) {
  const urls = entries.map(([loc]) =>
    `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmodForUrl(loc)}</lastmod>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function lastmodForUrl(urlPath) {
  const relative = urlPath === '/'
    ? 'index.html'
    : (urlPath.endsWith('/') ? `${urlPath.slice(1)}index.html` : `${urlPath.slice(1)}.html`);
  try {
    const status = execFileSync('git', ['status', '--porcelain', '--', relative], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (status) return TODAY;
    const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', relative], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return committed || TODAY;
  } catch (_) {
    return TODAY;
  }
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
write('tcf-canada.html', tcfHubPage());
write('tcf-canada-listening.html', tcfListeningPage());
write('tcf-canada-reading.html', tcfReadingPage());
write('tcf-canada-score-chart.html', tcfScorePage());
write('about.html', aboutPage());

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
  4 TCF Canada intent pages                     → /tcf-canada*
  1 about / methodology page                    → /about
  sitemap.xml                                  → ${sitemapEntries.length} URLs`);
