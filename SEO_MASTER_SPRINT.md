# Bonjour! SEO master sprint — 2026

## Objective

Grow qualified, non-branded discovery for free TCF Canada preparation and French-for-Canada learning without weakening the product's trust, privacy, or pedagogical focus.

The strategy is to own a narrow topic before competing for broad “learn French” terms:

1. Become the best free, no-signup English-language TCF Canada preparation hub for Canada-bound learners.
2. Turn the existing interactive depth—39-question sections, 120 listening clips, 60 readings, 50 scenarios, four-skill practice—into pages search engines can understand.
3. Build trust with primary sources, transparent limitations, visible authorship, and honest practice results.
4. Use Search Console evidence to expand only the topics that earn impressions and help learners.

## Research method and limits

Research completed August 1, 2026:

- Audited all public code, 94 pre-sprint sitemap URLs, metadata, canonicals, structured data, internal links, server headers, generated pages, and live host behaviour.
- Checked current Canadian Google autocomplete patterns for 18 seed topics across TCF, TEF, Express Entry, NCLC/CLB, Canadian French, grammar, and conversation practice.
- Reviewed live SERPs and the landing-page structure of current TCF competitors.
- Verified exam facts against France Éducation international, CCI Paris Île-de-France, and IRCC.
- Checked current Google Search Central and Cloudflare Pages guidance.

Exact monthly search counts are not available from the repository or a public SERP. Do not invent them. Google Ads Keyword Planner, a paid keyword database, or the site's own Search Console account is required for defensible Canada-specific volume. The priorities below use repeated autocomplete presence, search-result density, intent strength, product fit, and ranking difficulty. Add Search Console impressions and Keyword Planner volume to this document when account access is available.

## Baseline audit

### What is already strong

- Static, dependency-free delivery with clean extensionless URLs on Cloudflare Pages.
- Crawlable editorial layer: 50 scenario pages, 29 grammar pages, a connector guide, and 11 pre-existing landing pages.
- Unique titles, descriptions, self-canonicals, `en-CA`, social cards, breadcrumbs, and JSON-LD on public pages.
- A root sitemap and permissive robots file; non-search-value audio and internal modules are excluded from crawling.
- Gzip delivery, local fonts, lazy-loaded feature banks, and an initial-JavaScript size budget in tests.
- Real product differentiation: free, no account, no behavioural tracking, Canadian French audio, all four abilities, and honest non-official practice reporting.
- The domain is now indexed. Live search results surfaced the homepage, several grammar pages, a scenario, and core landing pages; the older handoff note saying zero pages were indexed is obsolete.

### Highest-impact gaps found

| Priority | Finding | SEO impact | Resolution |
|---|---|---|---|
| P0 | No dedicated `/tcf-canada` pillar for the category's central query | Search engines had no definitive hub connecting the four skills, score target, and mock test | Implemented |
| P0 | Missing static pages for TCF listening, reading, and score-chart intent | Competitors had one page per strong intent; Bonjour! had the product but no matching entry pages | Implemented |
| P0 | `frenchclb6.pages.dev` returns `200`, relying on a browser-side redirect; `www.frenchclb6.ca` does not resolve | Duplicate-host crawl waste and failed hostname variants | Cloudflare account action required |
| P0 | Search Console submission/coverage is not available in the repo | No reliable baseline for impressions, indexed URLs, queries, CTR, or cannibalization | Account action required |
| P1 | Exam pages lacked visible primary-source links and review dates | Weak trust signals in a topic adjacent to immigration decisions | Implemented on the TCF cluster; continue across legacy immigration pages |
| P1 | The author/methodology information existed only inside the app | Search visitors could not inspect who built the resource or how claims are checked | Implemented as `/about` |
| P1 | Many generated grammar meta descriptions were too short | Lower control over snippets and weaker query relevance | Implemented in the generator |
| P1 | Internal-link equity was concentrated in indexes and a small repeated related set | Deep pages receive limited contextual reinforcement | TCF cluster fixed; grammar/scenario contextual links remain a follow-up |
| P2 | Sitemap generation stamped every URL with the run date and emitted ignored `priority`/`changefreq` fields | Unreliable freshness signal and unnecessary sitemap noise | Implemented Git-aware `lastmod`; ignored fields removed |
| P2 | FAQ schema is present on legacy pages even though Google limits FAQ rich results mainly to government and health authorities | Maintenance cost with little visible-result value | Keep while valid, but do not expand it; prefer visible answers and Article/Breadcrumb markup |

## Keyword and intent map

### Highest observed demand, highest competition

These are category-defining queries. They can bring reach, but a new/small domain should not expect fast top rankings:

- `learn french`
- `learn french free`
- `french course online`
- `tcf canada`
- `tcf canada preparation`
- `tef canada`
- `canadian french`

Primary targets: homepage for the product/category; `/tcf-canada` for TCF preparation; `/tef-canada` for the TEF exam guide. Broad “learn French” terms are long-term authority goals, not the first-quarter success criterion.

### Highest-opportunity TCF cluster

These queries repeat in Canadian autocomplete, have clear task intent, and align directly with working features:

| Query family | Intent | Canonical page |
|---|---|---|
| `tcf canada preparation`, `how to prepare for tcf canada`, `tcf canada format` | Understand and plan | `/tcf-canada` |
| `tcf canada practice test`, `tcf canada practice test free`, `tcf canada mock test`, `tcf canada sample test` | Do a representative test | `/tcf-canada-mock-test` |
| `tcf canada listening practice`, `listening test`, `listening mock test`, `listening tips` | Improve Compréhension orale | `/tcf-canada-listening` |
| `tcf canada reading practice`, `reading sample`, `reading mock test`, `reading time` | Improve Compréhension écrite | `/tcf-canada-reading` |
| `tcf canada speaking format`, `speaking topics`, `task 1/2/3`, `speaking practice` | Prepare Expression orale | `/tcf-canada-speaking` |
| `tcf canada writing format`, `writing sample`, `writing template`, `task 1/2/3`, `word limit` | Prepare Expression écrite | `/tcf-canada-writing` |
| `tcf canada score chart`, `tcf canada score`, `tcf to clb`, `tcf to nclc`, `nclc 7 tcf score` | Convert an official result | `/tcf-canada-score-chart` |

### Express Entry and level cluster

- `french for express entry`
- `learn french for express entry`
- `french score for express entry`
- `french points for express entry`
- `french requirement for express entry`
- `clb 7 french score`
- `nclc 7 french score`
- `clb 7 french tcf`
- `clb 7 french tef`
- `clb 7 french is b1 or b2`

Existing canonical pages are `/learn-french-express-entry`, `/clb-7-french`, `/clb-6-vs-clb-7-french`, and the new `/tcf-canada-score-chart`. Avoid making another page for every wording variation; improve the appropriate canonical page instead.

### TEF cluster to earn next

- `tef canada preparation`
- `tef canada practice test free`
- `tef canada sample test`
- `tef canada speaking topics / format / practice`
- `tef canada writing topics / sample / format`
- `tef canada score chart`

Do not clone the TCF pages and swap acronyms. The app's full simulation follows TCF, while current TEF Canada has 40-question comprehension sections and two-part speaking/writing tasks. Expand this cluster only with genuinely TEF-specific practice or a strong comparison/reference experience.

### Supporting learning cluster

- `free french course canada`
- `learn french canada free`
- `french conversation practice free`
- `french conversation practice for beginners`
- `french grammar practice online free`
- `canadian french vs france french`

The scenario and grammar libraries already support these topics. Future work should improve category introductions and internal links before adding more near-duplicate pages.

## Competitive research: what the winners do

Current TCF competitors consistently use:

- A dedicated page for each ability and for scoring/conversion.
- Large visible practice inventories and no ambiguity about what is free.
- Current-year format references, author/reviewer labels, update dates, and official sources.
- Timed full-section entry points, corrections, progress history, and calculators.
- Strong hub navigation that links every skill from every skill page.

Bonjour!'s defensible angle is different: a complete foundational course plus exam practice, Canadian French audio, no signup, privacy-first local progress, and transparent limitations. Do not compete with unverifiable “real exam question,” “guaranteed pass,” or invented success-rate claims.

## Implementation shipped in this sprint

- Added `/tcf-canada`, a source-backed preparation pillar and 12-week practice framework.
- Added `/tcf-canada-listening`, targeting 39-question listening-practice intent with a concrete error-review system.
- Added `/tcf-canada-reading`, targeting reading-practice intent with pacing and distractor analysis.
- Added `/tcf-canada-score-chart`, reproducing the current IRCC NCLC 4–10 bands and explaining how to read mixed-skill results.
- Added `/about`, covering authorship, editorial method, independence, practice limitations, and privacy.
- Connected all seven TCF pages with a visible topic navigation and contextual related links.
- Added official FEI and IRCC citations and visible review dates to the new pages plus existing TCF speaking, writing, and mock-test pages.
- Added Person/author relationships to homepage structured data.
- Expanded the homepage's crawlable guide hub with the new cluster.
- Improved generated grammar descriptions while keeping them unique.
- Grew the sitemap from 94 to 99 canonical URLs.
- Replaced blanket sitemap dates with Git-aware meaningful `lastmod` values and removed fields Google ignores.
- Added automated SEO contracts for sitemap validity, metadata uniqueness/length, canonicals, JSON-LD, headings, topic-cluster completeness, and primary-source citations.

## Six-week execution plan

### Week 0 — deployment and indexing unlock (P0)

- Deploy this sprint.
- In Cloudflare Bulk Redirects, add `frenchclb6.pages.dev` → `https://frenchclb6.ca` with 301, query preservation, subpath matching, and path-suffix preservation.
- Add a proxied `www` DNS record and a Bulk Redirect from `www.frenchclb6.ca` → apex, preserving path and query.
- In Google Search Console, submit `/sitemap.xml`; inspect and request indexing for `/`, `/tcf-canada`, the three new TCF child pages, `/tcf-canada-mock-test`, `/learn-french-express-entry`, and `/clb-7-french`.
- Import the verified property into Bing Webmaster Tools.

Exit criterion: both alternate hosts return a single-hop 301 to the apex; sitemap is fetched successfully; no canonical/noindex/robots conflicts.

### Week 1 — baseline and snippet control (P0)

- Export GSC query/page data for the prior 28 days and preserve it as the baseline.
- Track brand vs non-brand, country, device, and page cluster.
- Record indexed URL count, pages with impressions, total non-brand impressions/clicks, CTR, and average position.
- Inspect Google's chosen canonical and rendered HTML for the TCF hub and three child pages.
- Rewrite only titles/descriptions with impressions but weak CTR; do not change pages before data exists.

Exit criterion: a dated baseline dashboard and an issue list tied to actual queries.

### Week 2 — content depth and conversion (P1)

- Expand existing TCF speaking and writing pages around the queries already receiving impressions: topics, task format, word limits, samples, or scoring criteria.
- Add a clear “start this exact practice” CTA above the fold if behaviour data shows search visitors missing the interactive module.
- Create one printable original checklist only if it materially improves the page; avoid generic lead magnets or email gates.

Exit criterion: each high-impression TCF page answers its dominant query without requiring another search.

### Week 3 — internal-link graph and library quality (P1)

- Replace the grammar generator's repeated “first six units” related list with prerequisite/next-step links.
- Give every scenario contextual links based on category, skill, and next difficulty, not only first appearance.
- Add TCF skill links from relevant grammar concepts: question formation → speaking Task 2; connectors → speaking/writing; tense contrast → writing.
- Audit orphan depth so every indexable page receives at least two contextual internal links beyond its index.

Exit criterion: no public page depends only on sitemap discovery and a single category-index link.

### Week 4 — authority and distribution (P1)

- Prepare a transparent resource blurb for newcomer organizations, FSL teachers, libraries, immigrant-serving agencies, and Canadian French resource lists.
- Pitch the most useful page, not the homepage: score chart for advisers, scenarios for settlement educators, mock test for candidates.
- Publish helpful community answers only where relevant; disclose ownership and avoid repeated promotional copy.
- Build a small public methodology or data note when original aggregate learning insights exist; original data is more linkable than another study-tips article.

Exit criterion: 10 highly relevant outreach contacts, 3 live editorial mentions or resource-list links, no paid/link-scheme placements.

### Week 5 — TEF decision gate (P1)

- Use GSC and Keyword Planner to compare TEF vs TCF opportunity.
- If TEF impressions are material, expand `/tef-canada` first and build a TEF score chart from IRCC's current “Équivalence ancien score” rules.
- Build TEF speaking/writing pages only when the site can offer genuinely TEF-specific two-section practice.
- If TEF demand is weak, invest instead in the TCF pages already approaching page two.

Exit criterion: data-backed go/no-go, not a predetermined page count.

### Week 6 — review and next sprint (P0)

- Compare 28-day non-brand impressions, clicks, CTR, position, indexed pages, and conversions to practice starts.
- Consolidate cannibalizing pages rather than changing keywords randomly.
- Refresh facts only when official sources changed; keep `lastmod` honest.
- Select the next three deliverables by expected qualified clicks × product fit × achievable position.

## 30/60/90-day targets

These are operating targets, not ranking guarantees. Replace relative targets with absolute values after the Week 1 baseline.

| Window | Target |
|---|---|
| 30 days | 99/99 sitemap URLs technically valid; all seven TCF cluster pages discovered; alternate-host redirects fixed; zero metadata/canonical/schema test failures |
| 60 days | At least 25% more non-brand impressions than the first full post-deploy 28-day baseline; TCF hub or one child page reaches top 30 for a target query in Canada |
| 90 days | 75–100% more non-brand impressions; at least five target queries in the top 20 and fifteen in the top 50; ≥3% CTR on queries already in the top 20 |

Primary KPI: qualified organic practice starts. Supporting KPIs: non-brand impressions/clicks, indexed pages with impressions, query coverage per cluster, CTR by position, and links from relevant domains. Page count is not a KPI.

## Measurement specification

Keep the site's no-behavioural-tracking promise. Use:

- Google Search Console for organic query/page/country/device performance.
- Bing Webmaster Tools for Bing coverage and IndexNow options.
- Cloudflare's aggregate privacy-friendly analytics for requests and referrers, if enabled without changing the privacy claim.
- A first-party, cookieless practice-start event only if the privacy page is updated accurately; otherwise use landing-page clicks and server-side aggregate routes.

Suggested weekly sheet columns:

`date | cluster | page | query | country | device | impressions | clicks | CTR | position | indexed | practice starts | referring domains | action`

## Guardrails

- No fake volume, score, pass-rate, testimonial, author qualification, or “official question” claim.
- No mass-generated pages for every autocomplete variation.
- No changing dates when the main content did not materially change.
- No duplicate TEF pages until the interactive product supports the TEF-specific format.
- No backlinks bought for ranking or placed through spammy directories.
- No hiding SEO text from users; crawlable content must be useful in the visible experience.
- Keep official-source links and review notes near facts that can change.

## Primary research sources

- France Éducation international, TCF Canada: https://www.france-education-international.fr/test/tcf-canada
- IRCC, Express Entry language test results: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-test.html
- CCI Paris Île-de-France, TEF Canada: https://www.lefrancaisdesaffaires.fr/en/candidate/test-evaluation-francais/tef-canada/presentation/
- Google Search Central, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central, sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central, FAQ rich-result change: https://developers.google.com/search/blog/2023/08/howto-faq-changes
- Cloudflare Pages, redirecting `pages.dev` to a custom domain: https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/
- Cloudflare Pages, redirecting `www` to apex: https://developers.cloudflare.com/pages/how-to/www-redirect/
