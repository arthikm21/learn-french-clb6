# Bonjour! — Masterplan: UI overhaul, userflow, pathway, CLB 6 content depth

**Date:** 2026-07-05 · **Goal:** a motivated 0-French learner reaches Listening CLB 6+ / Speaking CLB 6+ / Reading 4–5 / Writing 4–5 on TCF Canada using only this site.

---

## Part 0 — What was just shipped (this session, in `styles.css`)

The "liquid glass" treatment was keeping the app at a low visual standard in two places: buttons and dark mode. Both were rebuilt in place; no markup changes were needed.

**Dark mode — rebuilt as a cinematic elevation ladder**
- New dark tokens: near-black stage `#08080A` → card `#17171B` → nested `#212127` → control `#2B2B33`. Separation now comes from the ladder + hairline borders (`rgba(255,255,255,.09)`), not shadows or mud.
- The 5-blob indigo ambience is gone. Dark keeps two quiet indigo washes (key light top-left, floor glow bottom); the second "counter-drift" layer is now one faint cyan whisper.
- Glass surfaces are far more opaque in dark (`--glass-bg` .55 → .78, chrome-strong .68 → .88) so text never fights the backdrop.
- Text contrast raised: `--ink-2` #C7C7CC → #C9C9D1, `--mute` #8E8E93 → #95959F.
- Locked phase/path cards got explicit dark styling (`#121216` + visible border + `#8E8E98` titles) — they were near-invisible.
- Quiz options in dark are solid ladder steps now, not translucent glass that melted into the lesson shell.

**Buttons — solid, confident, one loud element per screen**
- All gradient "lit glass" caps deleted. The hover sheen-sweep animation deleted.
- `.btn` default: solid ink in light; **solid elevated tonal in dark** (was an inverted white slab — the single worst offender).
- `.btn.primary`: flat `--accent-fill` (still route-reactive) + soft ground glow; hover mixes 12% white; active darkens + scales .97.
- `.btn.secondary` tonal surface, `.btn.ghost` outline-only, `.success`/`.danger` solid semantic fills. Added `:focus-visible` ring.
- Nav active pill, nav-section active, mic orb, path numbers: same solid accent language.
- Light-mode dropdown menus were semi-transparent enough to let page text bleed through — `--glass-chrome-strong` raised to .90.

**Verified in browser (light + dark):** home, grammar unit, quiz with graded answers, nav dropdown, 22-route smoke walk with zero console errors. Bonus: the live theme toggle no longer leaves a washed-out frame (the heavy ambience layers were implicated).

**Bugs checked:** the two "known" HANDOFF bugs are already fixed in the codebase (grammar bad-id guards at `modules/grammar.js:41`; mic teardown via `Record.stopAll()` called from the router at `app.js:160`). `scripts/validate.js` passes with 0 errors.

---

## Part 1 — UI/UX debt still open (visual)

| Priority | Item | Why |
|---|---|---|
| P0 | **Emoji as icons** in phase cards, grammar tiles, section eyebrows (🌱📚💬💳📮) | Font-dependent, inconsistent with the SVG stroke-icon system already used on practice cards. Extend the `data-cat` SVG tile system to phase chips + grammar index + home eyebrows. |
| P1 | **Reduce blur surface count** | Backdrop-filter on hero/lesson/flashcard/modal/topbar is fine, but audit mobile: each is a compositor layer. The dark redesign made surfaces opaque enough that some blurs can simply be dropped. |
| P1 | **Progress ring** on hero: 1% state reads as an empty circle | Give the track more presence and show a minimum arc sliver; consider count-up label. |
| P2 | Dead vertical air on short lesson pages (content ends, footer 1200px later) | `main` min-height pushing footer; cap filler or pull the About collapse up. |
| P2 | Typography: hero gradient-clip headline is the last "glass era" flourish | Keep or simplify to solid ink + accent word — decide once icons are unified. |

## Part 2 — Userflow review (what a learner actually experiences)

**Onboarding.** Welcome → create profile → land on Home. The 100-Q diagnostic exists but is not pushed. A 0-French user should skip it (start Phase 1); anyone else should be *offered* it once: "Already know some French? Place yourself (10 min)." One dismissible card on first Home visit, result maps to a phase unlock suggestion. Right now placement is discoverable only via Exam menu — most learners will never take it.

**Daily loop.** Home currently stacks: hero → Continue → SRS due → scenarios pitch → mock pitch → phases → all practice areas. That's a menu, not a plan. The daily loop should be a single ordered strip: **1) Review due (SRS) → 2) Continue lesson → 3) One speaking rep**. Everything else is secondary. Concretely: merge the "Continue" and "Review due" cards into one "Today" card with 2–3 ordered steps and time estimate (~15 min). The 40/40/10/10 effort split should be *enforced by what Today suggests*, not just documented.

**Completion → next.** `Chrome.finishScreen` unification (last sprint) is good. Remaining friction: after a completion you return to Path and must re-find your place. "Next lesson" on the finish screen should deep-link straight to the next path item (one click, no Path detour).

**Gates.** 7 gates with 20-Q draws are the best pacing device in the app. But a failed gate currently just says retry — it should list *which* skills failed and link the 2–3 specific lessons to redo (the data exists: each question maps to a unit).

**Navigation.** Desktop IA (5 top items + grouped dropdowns) is solid post-sprint. Mobile drawer is flat and long; group it with the same section headers. Breadcrumbs work.

## Part 3 — Learning pathway (92 lessons, 8 phases)

- **Phase design is right** (Foundation → Core Grammar → Conversations → Past → Practical → Range → CLB5→6 Push → Readiness). The CLB 5→6 push phase carrying 23 lessons is heavy; consider splitting into "Argue & hypothesize" + "Connect & flow" so the last stretch shows progress.
- **SRS is under-leveraged.** It catches vocab + mistakes, good. Add: listening clips answered wrong become SRS audio cards (replay + re-answer); connectors get scheduled recall (they're the highest-yield CLB6 lever).
- **Speaking cadence.** Path should interleave a 5-min shadow rep every 2–3 lessons in phases 3+, not leave speaking to practice-area initiative. Oral is 50% of the outcome and the path under-schedules it.
- **Mock cadence.** Lock full mock behind Phase 6+ suggestion (avoid demoralizing early attempts) but auto-suggest section-mocks (listening-only) from Phase 4.

## Part 4 — Content depth vs CLB 6 (inventory → gaps)

Current: 50 scenarios · 120 listening clips · 35 vocab decks · 29 grammar units · 117 readings · 18 writing samples · 12 write-T3 · speak T2/T3 30 each · 22 connectors · 7 gates · 100-Q diagnostic · 3-section mock.

**Listening (target CLB 6 — the make-or-break skill)**
- 120 clips is a strong base but skews short-form. TCF Canada listening ends with longer monologues/interviews. Add a **"long listen" tier: 20–30 clips of 60–120s** (news brief, voicemail, workplace announcement, radio interview) with 2–3 questions each.
- Add **distractor-style questions** (TCF loves near-miss options: numbers, negation, opinion vs fact). The `why` field already exists — lean into it.
- Speed ramp exists (0.7–1.2×); make 1.0× the *pass* condition in gates from Phase 5 on.

**Speaking (target CLB 6)**
- Shadow + self-rate architecture is right (no mic-grading pretence). Gap: **fluency pressure**. Add timed responses (TCF EO Task 2 = 2 min prep-free). A countdown + "keep talking" meter on speak tasks 2/3 would simulate exam pressure at zero backend cost.
- Add 10–15 more T2 role-plays drawn from the scenario pool (reuse content, new task frame).

**Reading (target CLB 4–5)** — 117 readings is already above target. No action beyond gate coverage.

**Writing (target CLB 4–5)**
- Teach-by-model (18 CLB5 samples) is the right pivot. Gap: **error-fix drills** — show a CLB4 text with 5 planted errors (gender, accord, connector misuse), learner finds them. `WRITING_ERRORS` data already exists; build the drill UI around it.
- 12 T3 topics → 20 (opinion topics recycle well from scenario themes).

**Grammar (29 units)**
- CLB6-relevant gaps: *depuis/pendant/il y a*, *venir de + inf*, passive recognition, *en + gérondif*, indirect questions. Five small units close the set.

**Vocab (35 decks, ~680 cards)**
- CLB 6 passive vocabulary needs ~1,500–2,000 items. Grow toward ~1,200 cards prioritizing exam-frequency domains: workplace, housing, health, government services, opinions/feelings. Rate: 2 decks/week authoring is sustainable.

**Connectors (22)** — highest-yield CLB5→6 lever, already has mastery drills. Add the last ~8 (par conséquent, en revanche, d'ailleurs, quant à, à condition que…) to reach ~30.

## Part 5 — Prioritized roadmap

| # | Work | Effort | Impact |
|---|---|---|---|
| P0 | "Today" card (SRS → continue → speak rep, ordered) | S | Daily retention + enforces 40/40/10/10 |
| P0 | Finish-screen → next-lesson deep link | XS | Removes loop friction everywhere |
| P0 | Emoji → SVG icon unification | S | Perceived quality jump, cheap |
| P1 | Long-listen tier (20–30 clips, 60–120s) + gate 1.0× speed rule | M | Directly moves listening CLB |
| P1 | Gate fail → targeted lesson links | S | Turns failure into a plan |
| P1 | Timed speaking pressure mode (T2/T3 countdown) | S | Exam realism for EO |
| P1 | Writing error-fix drill on `WRITING_ERRORS` | M | Cheapest writing CLB gain |
| P1 | Diagnostic offer card on first Home visit | XS | Placement for non-zero starters |
| P2 | +5 grammar micro-units, +8 connectors, vocab → 1,200 cards | M/ongoing | Content depth to spec |
| P2 | Listening-wrong → SRS audio cards | M | Compounds the strongest system |
| P2 | Phase 7 split; mobile drawer grouping; blur audit | S | Polish |

**Sequencing:** P0s are one short session together. P1s are one session each. P2 content authoring runs continuously (each data edit: `node scripts/validate.js` → `node scripts/extract.js` → TTS gen → `node scripts/prerender.js` when scenario/grammar/connector shapes change).

**Release checklist for the shipped UI work:** `node scripts/bump_version.js` → stage `styles.css` + `index.html` → commit → push (Cloudflare auto-deploys). Do not commit `HANDOFF.md` or `MASTERPLAN.md` unless wanted public.
