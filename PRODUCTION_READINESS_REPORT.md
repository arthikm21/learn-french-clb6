# Bonjour! production-readiness audit

Audit completed: 2026-07-15 (America/Halifax)
Release asset stamp: `202607160126`

## Verdict

The local release candidate is clean enough for a controlled production deployment. No reproducible functional, rendering, content-validation, duplicate-ID, mobile-overflow, or browser-console failures remain in the tested matrix.

This is not a claim that software can be guaranteed to contain zero undiscovered defects. Production should be treated as ready for a staged deploy, followed by the post-deploy checks below. No deployment or push was performed during this audit.

## Final evidence

| Gate | Result |
|---|---:|
| JavaScript syntax | 97 files clean |
| Automated tests | 26 passed, 0 failed |
| Content validator | 0 errors, 0 warnings |
| SPA base routes | 30/30 clean |
| Data-driven learning states | 343/343 clean |
| Public sitemap URLs | 94/94 clean |
| Representative mobile screens at 390×844 | 12/12 clean |
| Browser console errors | 0 |
| Duplicate ID failures | 0 |
| Heading/landmark failures | 0 |
| Broken image or stylesheet failures | 0 |
| Production-style custom 404 | Correct HTML body and HTTP 404 |
| Manifest MIME type | `application/manifest+json` |
| Diff whitespace check | Clean |

The public-page sweep verified a non-empty title and description, canonical URL, `en-CA`, one main `h1`, main content, loaded stylesheets, working images, and unique IDs on every sitemap URL.

## Inconsistencies found and corrected

### Runtime and learning flow

- Fixed the dictation game crash caused by mismatched listening-data fields.
- Removed double rendering and duplicate celebration behavior.
- Normalized unknown hashes to Home instead of leaving stale content visible.
- Added guarded render failure recovery and cleaned up audio/recording timers on navigation.
- Fixed mock-test deadlines, denominators, submission locks, and result accounting.
- Corrected SRS routing and isolated SRS records by learner.
- Added writing-draft autosave with failure and memory-only feedback.
- Prevented repeated submissions and race conditions in games and timed tasks.

### Persistence and privacy

- Made backup restore atomic and schema-limited; malformed or oversized imports are rejected.
- Added storage fallbacks for browsers where persistence is unavailable.
- Prevented profile/reset/delete operations from leaking across similar usernames.
- Hardened settings and profile input validation.
- Kept microphone recordings and learner state local; no upload path was introduced.

### Accessibility and mobile

- Upgraded clickable cards for keyboard use and removed nested interactive controls.
- Added proper radio-group semantics, visible focus behavior, skip links, landmarks, language attributes, semantic tables, and one page-level heading per state.
- Fixed mobile focus trapping and Escape dismissal.
- Made the closed mobile drawer inert and `aria-hidden`, and restored focus to the menu trigger after closing.
- Removed live-region noise from countdown timers.
- Verified 12 high-risk screens at 390×844 with no horizontal overflow.

### Visual-system consistency

- Locked the UI to the Apple system/SF Pro stack with Inter and standard sans-serif fallbacks; the old serif/italic presentation no longer appears in learning content.
- Consolidated warm ivory, navy, cobalt, coral, mint, butter, lavender, and selective liquid-glass tokens across light and dark themes.
- Structured the home illustration and cheer squad on a bounded grid instead of arbitrary offsets.
- Replaced the social card with the current colorful character-led art direction.

### Content trust and exam accuracy

- Replaced CLB wording with NCLC where French-language results are discussed.
- Corrected current TCF Canada and TEF Canada section counts and timings.
- Removed fabricated score estimates, guaranteed outcomes, fake audio claims, and unverified tutor discounts.
- Corrected Express Entry French-language bonus-point and category-selection wording.
- Added official-source links and clearer “practice, not an official exam” disclaimers.

Primary references used: France Éducation international’s TCF Canada page, Le français des affaires’ TEF Canada page, and IRCC’s language-test, CRS, and category-based-selection pages.

### SEO, offline behavior, and server hardening

- Regenerated 94 sitemap pages with consistent metadata, canonicals, social tags, `en-CA`, semantic tables, and current asset stamps.
- Fixed service-worker cache versioning, navigation caching, first-install shell discovery, and audio range responses.
- Added deployment parity for CSP, frame protection, permissions policy, referrer policy, MIME sniffing protection, and HSTS.
- Added a real 404 response and correct web-manifest MIME handling to the local production-style server.
- Excluded tests, design artifacts, old OG sources, obsolete font files, and internal documents from Cloudflare direct uploads.

## Items that must be handled with the deployment

1. **Include required new files.** `editorial.css`, `modules/cheersquad.js`, and `tests/cheersquad.test.js` are currently untracked. The first two are production-critical and must be included in the release commit.
2. **Do not include obsolete assets.** The untracked Instrument Sans, Newsreader, and `og-image 2.jpg` files are unused and are now excluded from direct uploads; omit them from the release commit.
3. **Deploy the audited version.** The live apex currently serves the older `app.js?v=202607121753`; the audited local release is `202607160126`.
4. **Fix the `www` hostname.** `www.frenchclb6.ca` currently does not resolve. Add DNS and redirect it permanently to the canonical apex, or explicitly remove it from all intended entry points.
5. **Verify HSTS after deployment.** The header is present in local deployment configuration but absent from the current live response.
6. **Plan performance bundling separately.** The app currently loads 84 script tags and about 1.61 MB of JavaScript. It works, but bundling/code-splitting is the main remaining performance opportunity and should be measured in a dedicated release rather than mixed into this stabilization pass.

## Post-deploy acceptance checklist

1. Purge the CDN and confirm the HTML, `app.js`, `editorial.css`, cheer-squad module, and service worker all use stamp `202607160126`.
2. Confirm apex HTTPS returns 200 and `www` returns a permanent redirect to the apex.
3. Confirm CSP, HSTS, frame, permissions, referrer, and MIME-sniffing headers on HTML and 404 responses.
4. Smoke-test Home, Path, one scenario, one grammar lesson, dictation, writing autosave, profile backup/restore, and the mock test on desktop and mobile.
5. Test one online-to-offline reload and one upgrade from the previous service worker.
6. Watch real browser errors and failed requests during the initial rollout; roll back if a release-specific regression appears.
