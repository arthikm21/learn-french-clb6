# Bonjour! — Session Handoff

**Updated:** 2026-06-21
**Project:** Free, open-source French learning platform for TCF/TEF Canada immigrant prep.
**Repo:** `/Users/arthikmarasini/Desktop/french learning website` (GitHub: `arthikm21/learn-french-clb6`)
**Live:** https://frenchclb6.ca — custom domain on **Cloudflare Pages**, auto-deploys from `main`.
**Stack:** Vanilla HTML/CSS/JS. No build step. No backend. No paywall. No tracking. State in localStorage.

---

## Mission (the constitution)

A complete beginner (0 French) should reach: **Listening CLB 6+ · Speaking CLB 6+ · Reading CLB 4-5 · Writing CLB 4-5**, using only this site, no paid resources.

Oral skills get **80%** of investment. Effort target: **40% Listen · 40% Speak · 10% Read · 10% Write**.

---

## Current state (live + working end-to-end)

Infrastructure ~95% complete. Content at strong scale:
- **50 scenarios** · **120 listening clips** · **22 connectors** · **29 grammar units** · **8 phase gates** (40–49 Q pools, 20 drawn) · **100-Q placement diagnostic**
- English glosses everywhere French appears (toggleable in Profile)
- Full **sound + motion + celebration** system (synth Web Audio, ~26 sounds, nav xylophone, confetti/sparkles/speed-lines, mascot 🐓)
- Neural Canadian French TTS (Edge-TTS MP3s, ~5670-entry manifest) + SpeechSynthesis fallback
- **Real favicon/logo live** ("B." mark, 48px-multiple compliant for Google) + `site.webmanifest`
- **Monetization v1 live** — Preply affiliate (50%-off win-moment cards via `modules/support.js`) + Buy Me a Coffee (humble, at win moments only). Still no ads, no tracking. Auth/accounts: user-rejected.
- **SEO layer:** 11 hand-written landing pages + 82 prerendered pages, **94-URL sitemap** — but **not yet indexed by Google** (see Open Items #1)

---

## What shipped recently (most recent first)

| Commit | What |
|---|---|
| `4d43855` | **SEO round 2** — 4 exam-intent landing pages + 7 landing footers modernized; sitemap 90→94 (2026-06-21) |
| `b47158c` | 96×96 favicon `<link>` so Google uses a 48px-multiple icon in search (2026-06-21) |
| `687476a` | **Favicon/logo + humbler support tone + win-moment Preply 50%-off cards + bigger footer + on-page SEO** (2026-06-21) |
| `bb9d254` | Buy Me a Coffee more prominent (superseded by `687476a`) |
| `9ea7327` | **Monetization v1** — Preply affiliate + Buy Me a Coffee + Impact site verification |
| `cf3d13d` | Audio stops on navigation — no background playback |
| `dd99ac2` | SEO Phase 1-3 — 7 hand-written landing pages + 82 prerendered pages |

### 2026-06-21 session in detail (favicon + monetization tone + SEO rounds)

**1 — Real favicon/logo (`687476a`, `b47158c`) — the trust fix.** Google was showing a blank globe because **no favicon existed**. Minted a brand mark: hand-authored `favicon.svg` ("B." monogram on a French blue→red gradient, matching `og.html`) → rasterized with **macOS `qlmanage -t -s 1024` (WebKit) → `sips`** into `favicon-16/32/48/96.png`, `apple-touch-icon.png` (180), `icon-192/512.png`; `favicon.ico` built by a **stdlib-Python PNG-in-ICO wrap** (no PIL/ImageMagick on this box — only `sips`+`qlmanage`). `site.webmanifest` added. Icon `<link>`s + the **96×96** (Google needs a ≥48px multiple) wired into `index.html`, all landing pages, `404.html`, and the `prerender.js` shell. Org JSON-LD `logo` → `icon-512.png`. **Note: a favicon in Google results lags the deploy by days–weeks (Google caches it, refreshes on recrawl) — not a bug.**

**2 — Humbler support tone (`687476a`).** Dropped the literal "Buy me a coffee" phrase everywhere; deleted the home-page coffee spotlight (per user: support belongs at *win* moments, not the front page). Footer + About reworded humble ("💛 Keep Bonjour! free" / "If Bonjour! helped you"). BMC URL kept.

**3 — Win-moment nudges → new `modules/support.js`.** `Support.preplyCard(i)` (3 rotating 50%-off Preply hooks), `tipCard()`, and `winNudge(force)` — throttled via `localStorage fr_nudge_n` (~every 2nd completion, alternates Preply↔tip; `force` for rare big wins). Injected at completion screens **above Back-to-Path**: `vocab` / `grammar`(pass) / `listen`(≥70) / `read`(≥70), the `phasegate` pass screen (force), and the `mock` CLB report (`preplyCard(1)`). Loaded after `chrome.js`. Preply 50%-off hooks also strengthened in `speak.js` + `scenario.js`. All Preply links `rel="sponsored noopener"`.

**4 — Footer + on-page SEO (`687476a`).** Footer tiny `<small>` → `.footer-links` 44px pill buttons; removed the visible `Impact-Site-Verification:` footer line (the invisible `<meta>` in `<head>` stays — that's the real verification). SEO: `<html lang="en-CA">`, keyword/author meta, a crawlable static `<h1>` in `seo-content`, richer `Course` schema (keywords/educationalLevel/audience/hasCourseInstance), icon-as-org-logo, `_headers` cache rules for icons.

**5 — SEO round 2 (`4d43855`): 4 new exam-intent landing pages.** Strategy = chase **winnable long-tail** (Canada/CLB/TCF-TEF/Express-Entry intent), NOT head terms. New hand-written pages: **`/clb-7-french`** (NCLC 7 = 50 CRS points + French draws), **`/tcf-canada-speaking`** (Expression Orale, 3 tasks), **`/tcf-canada-writing`** (Expression Écrite, 3 tasks + Task-3 structure), **`/tef-canada`** (exam guide). Full schema, cross-linked, `footer-links` footer, exam numbers **hedged** ("verify IRCC chart"). Added to the `prerender.js` `LANDING` array (now 11 → **sitemap 94 URLs**), linked from homepage guides hub, and the **7 existing landing footers** modernized to `footer-links`.

> **Earlier (`9ea7327`) monetization v1:** first Preply + BMC + Impact verification. Auth/signup was explored and **USER REJECTED** (no accounts — guest-only localStorage stays). Do not re-propose.

---

## Open / pending items (start here next session)

### 1. 🔴 SEO indexing — USER action, PARTIALLY done (the unlock)
`site:frenchclb6.ca` still returns **0 Google results** → not indexed yet; nothing ranks until it is.
- ✅ **GSC domain property added + DNS-TXT verified** (user, 2026-06-21).
- ⬜ **Remaining (user):** GSC → Sitemaps → submit `sitemap.xml` (94 URLs); then URL-Inspect → **Request Indexing** on the homepage + top landing pages (incl. the 4 new `/clb-7-french`, `/tcf-canada-speaking`, `/tcf-canada-writing`, `/tef-canada`). Bing Webmaster → "Import from Google Search Console" (1 click).
- The **favicon in Google results** will appear only after Google recrawls the home page (days–weeks) — it's already correct/live, just cached. No action needed beyond the recrawl.

### 2. SEO Phase 4 — off-page authority (drafts WRITTEN, not posted)
Backlink post drafts exist (in chat history): r/ImmigrationCanada + r/French, **CanadaVisa forum** (often dofollow), **GitHub "awesome" lists** (dofollow, topical) + directory blurbs (AlternativeTo/SaaSHub/Product Hunt). **User to post** — pace ~1/day, reword each, reply to comments. The 4 new exam pages are ideal link targets. Backlinks are the top ranking lever after indexing.

### 3. SEO round 3 — more pages (roadmap, not built)
Next winnable long-tail clusters: `/quebec-french-immigration` (francisation / TEFAQ / TCFQ / CSQ — different audience), `/learn-french-for-canada` (true-beginner intent), `/clb-levels-french` (CLB↔NCLC↔CEFR explainer), and TCF **listening + reading** skill pages to complete the skill set. Add each to the `LANDING` array + homepage guides hub + cross-links.

### 4. Mic-recorder leak (known, not yet fixed)
Legacy mic recorders (MediaRecorder in `modules/speaktasks.js`, `speaktask2.js`, `speaktask3.js`, `connectors.js`, and `mock.js` speak section) call `rec.stop()` on their own Stop button but **NOT on navigation** — leaving a TCF speak task mid-recording leaves the mic active. No central registry exists; would need one (or per-module `hashchange` teardown). User was offered this fix; awaiting go-ahead.

### 5. Older deferred items
- Legacy mic modules could be rebuilt as shadow-only (typed fallback already exists).
- `data/dialogues.js` + `data/connectors.js` are legacy (superseded by scenarios / connectors_mastery) — could delete.
- PWA + offline — **`site.webmanifest` now exists** (icons + theme, installable metadata); still **no service worker** → no offline. Add a SW to finish PWA.
- Progress export/import as JSON · Resume button on home · Cmd-K palette · daily review nudge.
- C4 perf: ~70 unbundled `<script>` tags (no bundler — intentional, but a perf cost).

---

## Repo file map

```
*.html (root)        index.html (SPA shell + crawlable seo-content) + 11 SEO landing pages
                     (incl. clb-7-french, tcf-canada-speaking, tcf-canada-writing, tef-canada)
                     404.html, og.html (og.html is deploy-excluded)
french-connectors.html   generated SEO page
scenarios/, grammar/     generated SEO pages (by scripts/prerender.js)
sitemap.xml          94 URLs — OWNED by scripts/prerender.js (LANDING array), do not hand-edit
favicon.svg/.ico, favicon-16/32/48/96.png, apple-touch-icon.png, icon-192/512.png, site.webmanifest
robots.txt, _headers, .cloudflare-ignore

app.js (root)        router (hash routes) + state + theme + nav + credit modal + mascot
styles.css           all CSS (token-driven, var(--token); body[data-anim] tiers)

data/                all French content (each registers on window.*)
  lessons.js gates.js scenarios.js listening_mastery.js connectors_mastery.js
  vocab*.js grammar*.js reading*.js writing.js spoken.js phonics.js minpairs.js
  speaktasks.js/2/3 writetask3.js pcvsimp.js diagnostic.js mock.js
  dialogues.js connectors.js  (LEGACY)

modules/             vanilla JS, register on window
  tts.js             ★ Neural TTS player — epoch system, speak/speakLine/speakSoon/stop
  chrome.js          Back + breadcrumb + progress + gloss + advance()
  support.js         ★ win-moment Preply(50%-off)/tip nudges — preplyCard/tipCard/winNudge (throttled)
  sounds.js celebrate.js toast.js srs.js wordpop.js settings.js profile.js
  path.js phasegate.js progress.js scenario.js listenmastery.js connectormastery.js
  deepdive.js speak.js speaktasks.js/2/3 writetask3.js vocab.js grammar.js
  listen.js read.js write.js games.js phonics.js dialogue.js mock.js tcfguide.js
  pcvsimp.js diagnostic.js mistakes.js

scripts/             (deploy-excluded)
  prerender.js       ★ generates SEO pages + sitemap from data/*.js
  extract.js         data → strings.json/strings_voiced.json
  generate_audio.py  edge-tts → audio MP3s + manifest.json (generate_jean.py = Jean voice)
  bump_version.js    stamps ?v= on all JS/CSS URLs in index.html
  serve.js           local dev server (hardcoded port 8765)

audio/               manifest.json (~5670 entries) + <sha1>.mp3 clips
```

---

## Critical conventions (DO NOT VIOLATE)

1. **No microphone for new work.** Speaking modules are shadow-based (play → repeat aloud → self-rate). Legacy mic TCF tasks have typed fallback.
2. **No backend, no build step.** Vanilla `<script>` tags; new modules register on `window`. Load order in `index.html` matters (data → modules → app.js).
3. **Token CSS only.** No hardcoded hex — use `var(--token)`. Glosses use `.gloss` / `.gloss-lg`.
4. **`Chrome.render()` on every module page** (Back + breadcrumb + optional progress).
5. **`Chrome.advance({host, onNext, seconds, result})`** for feedback → next flow (auto sound + sparkle + streak speed-lines).
6. **`App.markLessonDone(key)`** for completion (writes log + plays sound + confetti + mascot flap). Never set state directly.
7. **Audio:** all French audio goes through **`TTS.speak` / `TTS.speakLine` / `TTS.speakSoon`** — never `new Audio()` in a module. **For auto-play, ALWAYS use `TTS.speakSoon(text, rate, delay)` — never `setTimeout(() => TTS.speak(...))`** (the latter reintroduces the background-playback bug). `TTS.stop()` is called centrally on navigation; intra-module sub-view dispatchers that re-render in place must call it too (see `scenario.js render()`).
8. **Adding French content → audio pipeline:** `node scripts/extract.js` → `.venv-tts/bin/python scripts/generate_audio.py`.
9. **Adding/editing scenarios, grammar, or connectors → regenerate SEO:** `node scripts/prerender.js` (refreshes `/scenarios/`, `/grammar/`, `/french-connectors`, and `sitemap.xml`).
10. **Before every release commit:** `node scripts/bump_version.js` (cache-busts JS/CSS). Required whenever you change any `.js`/`.css`. New static `.html` pages don't strictly need it.
11. **Commit hygiene:** stage specific files (not `git add -A`). **Never commit `HANDOFF.md`** (session doc only). Cloudflare auto-deploys on push to `main`; deploy = push.
12. **Win-moment monetization via `modules/support.js`.** Don't hardcode Preply/BMC CTAs in new completion screens — call `${Support.winNudge()}` (throttled, rotates) above the Back-to-Path / Continue button, gated on the pass/score condition. Preply links carry `rel="sponsored noopener"`. **Support asks go at WIN moments, never the front page.** Avoid the literal phrase "buy me a coffee".
13. **Favicons** are minted from `favicon.svg` via `qlmanage -t -s 1024 → sips` (+ stdlib-Python PNG-in-ICO). If the logo changes, regenerate ALL sizes and keep a **≥48px-multiple PNG** linked (Google requirement). New static pages need the icon `<link>` block — the `prerender.js` shell already emits it; hand-written landing pages must include it manually.

---

## Data shapes for content needing English gloss

```js
// Scenario dialogue line:   { speaker, voice:'sylvie'|'jean', text, en }
// Scenario shadow line:     { fr, en }
// Scenario speak task:      { prompt, model, modelEn, checklist }
// Scenario comprehension:   { q, opts:[...], a:index }
// Listening Mastery clip:   { id, type, category, level, audio:"FR", audioEn:"EN", prompt, opts, a, why }
// Connector:                { word, gloss, category, when, examples:[{fr,en}], complete:{context,contextEn}, recognize, recognizeEn, shadow:{...} }
// Grammar unit:             { id, title, icon, level, intro, rules:[{title,body,examples:[],table:[[a,b]]}], quiz:[{q,opts,a,why}] }
// Speak Q&A / role / task:  { q/scenario/topic, ...En counterpart, hint, minWords }
// Write Task 3:             { topic, topicEn, opinionA:{text}, opinionB:{text}, promptInstructions, promptInstructionsEn }
```
Renderers accept BOTH old (plain string) and new (object) shapes: `typeof x === 'string' ? x : x.fr`.

---

## How to start the next session

```bash
cd "/Users/arthikmarasini/Desktop/french learning website"
git status
git log --oneline -8

# Local preview: a `bonjour-static` config (python3 http.server :8790) is in
# .claude/launch.json — use the preview tooling, or:  python3 -m http.server 8790
# (serve.js hardcodes 8765, taken by the AI Clip Editor — a DIFFERENT project)
# The app gates behind a welcome screen — create a user in the UI, or via console:
#   Storage.addUser('Test'); Storage.setCurrentUser('Test'); App.reloadForUser();
# Static landing pages (clb-7-french.html etc.) render standalone — no app.js/theme.
```

---

## Things to be careful about

1. **Hashchange triggers re-render** → don't `location.reload()` for nav; use `App.go(route, params)`.
2. **Script load order in `index.html`** matters (data → modules → app.js; `celebrate.js` after `sounds.js`).
3. **`TTS.stop()` is the audio kill-switch.** It bumps an epoch that no-ops in-flight/scheduled/sequenced audio. If you add intra-module sub-views that re-render in place AND play audio, call `TTS.stop()` in that view's dispatcher (pattern: `scenario.js render()`).
4. **`sitemap.xml` is generated** — edit `scripts/prerender.js` (its `LANDING` array for hand-made pages), then re-run it. Don't hand-edit the XML.
5. **Visibility hidden suppresses UI sounds** (`sounds.js allowed()`), incl. iframe previews — programmatic tests may need to force `document.visibilityState`.
6. **`body[data-anim]`** gates CSS animations (off/subtle/full); scope new animations under `body[data-anim="full"]`.
7. **Known minor bug (unfixed):** `#grammar?unit=<bad-id>` crashes `renderUnit` (grammar.js, `GRAMMAR.find` → undefined); the app.js error boundary catches it and shows a recovery page.
8. **Favicon in Google results lags days–weeks** — Google caches the SERP favicon and only refreshes on a home-page recrawl. A correct, live favicon won't show immediately; not a bug. (The set is 48px-multiple compliant as of `b47158c`.)
9. **`Support.winNudge()` advances a global `localStorage` counter (`fr_nudge_n`) on every call** — so it shows on ~every 2nd completion and re-renders can shift the rotation. Always gate it on the win condition (`${pass ? Support.winNudge() : ''}`) so it never nags after a failed quiz; `force` only on rare wins (gate pass, mock result).
10. **Hand-written landing pages now use the `footer-links` footer + `lang="en-CA"`** — match that (not the old `<small>` footer) when adding new ones.

---

## Final acceptance criteria (when "done")

A motivated learner studying 45–60 min/day for 8–12 months passes Listening CLB 6+, Speaking CLB 6+, Reading CLB 4-5, Writing CLB 4-5 using only this site. Infrastructure ~95%; content at strong scale. Remaining = content authoring + the SEO-indexing unlock (user action) + occasional UX polish.

---

**End of handoff.** Live: https://frenchclb6.ca · Repo: https://github.com/arthikm21/learn-french-clb6
