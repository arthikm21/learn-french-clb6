# Bonjour — Alive French + Cheer Squad implementation plan

## Outcome

Replace the current restrained editorial home experience with the approved **Language in Motion** direction and add seven event-driven cheer characters without turning the learning experience into a mascot game.

The work remains a static, offline-capable, dependency-free HTML/CSS/JavaScript application. The cheer squad is encouragement layered onto the pedagogy; it never blocks a question, invents a score, or interrupts concentration.

## Locked design decisions

- **Typography:** SF Pro Display visual system throughout, upright only. Use the Apple system font where the OS provides it and `Inter` as the metrically compatible self-hosted fallback elsewhere. Do not redistribute Apple's proprietary font files.
  ```css
  --font-ui: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Inter", sans-serif;
  ```
- **Text:** deep ink navy (`--ink: #071630` in the final token set); never pure black and never gradient-filled text.
- **Palette:** cobalt, sky, coral, butter yellow, lavender, mint, peach, and warm off-white.
- **Materials:** mostly matte color; liquid glass is limited to navigation, phrase displays, cheerboards, and occasional small avatar details.
- **Motion:** calm and purposeful. No constant spectacle, parallax gimmicks, robotic motion, or technical-dashboard effects.
- **Character style:** abstract geometric adults-friendly forms; no animals, flags, French clichés, or imitation of existing language-learning mascots.

## Product architecture

### 1. Visual foundation

Refactor `editorial.css` into the canonical Alive French theme layer instead of adding another global override file.

- Replace `--display` and `--sans` with the locked `--font-ui` stack.
- Remove serif/italic presentation from product UI, including the current italic home headline and feature indices.
- Add semantic color tokens rather than hardcoding colors in components:
  - `--ink`, `--paper`, `--cobalt`, `--sky`, `--coral`, `--butter`, `--lavender`, `--mint`, `--peach`
  - `--glass-fill`, `--glass-line`, `--glass-shadow`, `--glass-blur`
- Add shared primitives: `.glass-surface`, `.language-block`, `.cheer-board`, `.motion-safe`.
- Preserve the existing dark theme, but make the approved light theme the primary art direction. Glass opacity and text contrast receive separate dark-theme values.

### 2. Homepage: Language in Motion

Update `renderHome()` in `app.js` with a focused hero while retaining the real progress data beneath it.

- Left column: `TODAY'S FRENCH`, “Ready for today's French?”, the daily encouragement line, one primary Continue action, and expected minutes.
- Right column: the colorful block canvas, a readable glass phrase display, and one contextually chosen cheer character.
- Generate the phrase from the next lesson or a curated daily phrase map; use the approved café phrase only as the safe fallback.
- Keep review pressure and the ordered daily plan immediately below the hero. Do not bury SRS reviews beneath decorative content.
- Retain the phase/path/progress model, but reduce the visible dashboard language to one quiet progress strip.
- On mobile: text first, phrase display second, character anchored to an unused corner; graphical blocks crop decoratively and never force horizontal scrolling.

### 3. Character rendering module

Add `modules/cheersquad.js` and a scoped section in `editorial.css`.

The module exposes a small public API:

```js
CheerSquad.render({ character, pose, message, placement })
CheerSquad.show(eventName, context)
CheerSquad.dismiss()
CheerSquad.resetRoute()
```

Implementation details:

- Characters are lightweight inline SVG templates with named groups for body, eyes, mouth, arms, legs, board, and glass highlight.
- Shared SVG helpers keep the total squad payload small; only the selected character is inserted into the DOM.
- No GIF, video, canvas loop, Lottie runtime, remote asset, or tracking request.
- All motivational copy lives in a single configuration map, not inside module renderers.
- Character selection is deterministic by event and rotates by day/session so the same character does not appear repeatedly.
- A single global host owns temporary appearances, preventing stacked characters or orphaned timers after route changes.

### 4. Character jobs and triggers

| Character | Primary learning moment | Board | Signature full-motion loop |
|---|---|---|---|
| Lumi | phase gate, major milestone, excellent result | Très bien! | bounce + wink |
| Bleu | three correct answers / recovered streak | You've got this. | thumb pop |
| Coco | lesson or scenario completion | Look at you! | small confetti toss |
| Violette | second attempt or retry after feedback | One more try. | calm wave |
| Écho | listening, phonics, and shadowing prompts | Say it out loud. | listen-and-lean |
| Mint | learner returns after a pause or continues a difficult set | Keep going. | small fist pump |
| Joie | daily return, streak, and incremental path progress | Petit à petit. | two soft claps |

Trigger policy:

- Never show a character for every correct answer.
- Streak cheer: once after the third consecutive correct answer, then a five-minute cooldown.
- Retry cheer: only after a learner has seen useful feedback; never celebrate an error itself.
- Completion cheer: one character embedded in the completion layout, not a second modal.
- Home cheer: one quiet idle character; its board appears only after user interaction or daily return.
- Maximum one temporary cheer at a time and no more than two unsolicited appearances in a 15-minute session.
- Route changes and `TTS.stop()` navigation cleanup also dismiss active cheer UI and timers.

### 5. Existing integration seams

#### `modules/chrome.js`

- Extend `Chrome.advance(opts)` with optional `cheerContext` and call `CheerSquad.show('streak', context)` when the existing internal streak reaches three.
- Extend `Chrome.finishScreen(opts)` with `cheerEvent`. Render the selected avatar inside the existing completion screen, replacing the generic emoji `big-icon` for supported modules.
- Keep existing sounds, feedback, countdown behavior, next-path strip, and pass thresholds unchanged.

#### `app.js`

- Replace the legacy `.logo` mascot flap in `markLessonDone()` with the appropriate `CheerSquad.show()` event.
- Preserve `App.markLessonDone()` as the only completion write path.
- Call `CheerSquad.resetRoute()` in the central navigation lifecycle so no animation survives a page change.
- Add the Language in Motion hero without changing path progress, SRS, mastery, or diagnostic calculations.

#### `modules/settings.js` and `modules/profile.js`

- Rename the user-facing “Mascot animations” setting to **Cheer squad**.
- Introduce `isCheerSquadOn()` / `setCheerSquad()` while retaining `isMascotOn()` / `setMascot()` as compatibility aliases.
- Reuse the existing `fr_setting_mascot_v1` value so nobody's preference is silently reset.
- Animation levels remain `off`, `subtle`, and `full`.

#### `index.html`, service worker, and release tooling

- Load `modules/cheersquad.js` after Settings/Celebrate and before Chrome/app.
- Keep all assets same-origin and offline-capable.
- Run `scripts/bump_version.js` after JS/CSS changes so the service worker receives the new release.

## Motion specification

### Full

- Character entrance: 420–650 ms translate/scale with a soft ease-out.
- Gesture: 500–900 ms, one or two repetitions only.
- Blink: irregular 5–9 second interval; stop when document is hidden.
- Hero blocks: 6–10 second low-amplitude drift, maximum 6 px translation and 1.5° rotation.
- Glass shimmer: event-triggered edge highlight only; no endless sweeping gloss.

### Subtle

- Opacity plus maximum 4 px translation.
- No rotations, limb loops, confetti, shimmer, or bouncing.

### Off / reduced motion

- Static final pose immediately.
- No autonomous block movement.
- Motivational text and all learning feedback remain fully available.

Pause full motion while a text input is focused, while the tab is hidden, or while the learner is reading feedback. Animate only `transform` and `opacity`; add `will-change` only during an active gesture.

## Placement rules

- **Home hero:** one character within the right-side block canvas; never between the headline and CTA.
- **Listening/phonics/speaking:** Écho may sit beside the instruction/phrase card, outside the tap and recording zones.
- **Correct streak:** compact lower-corner toast, 3.5 seconds, dismissible, never covering Next.
- **Retry:** inline beside feedback, not over the wrong option or explanation.
- **Completion:** character becomes part of the completion composition and shares the visual hierarchy with score and next action.
- **Mobile:** avatar width 88–120 px; boards shorten or wrap to two lines; temporary cheers sit above safe-area bottom and above sticky controls.

## Accessibility and learner control

- Decorative character art is `aria-hidden="true"`; the board's message is rendered separately as real text.
- Announce only meaningful milestone/retry messages through one polite live region. Idle animation is never announced.
- Cheerboards meet WCAG AA contrast and never rely on color alone.
- Provide a visible close control on temporary cheers and support Escape.
- Respect `prefers-reduced-motion`, the existing app animation level, the Cheer squad toggle, page visibility, and keyboard focus.
- No character appears during timed exam simulation unless it is the final result screen.

## Performance budget

- `cheersquad.js` + related CSS: target under 45 KB raw / 15 KB gzip.
- Individual inline character markup: target under 5 KB before compression.
- No added third-party dependency and no added runtime network request.
- Only one character mounted outside the home hero; remove its DOM and timers after dismissal.
- Test animation smoothness at 4× CPU throttling and low-end mobile width.

## Implementation sequence

### Phase 1 — foundation

1. Capture baseline screenshots at 1440, 768, 390, and 320 px.
2. Lock the new font stack and color/glass/motion tokens in `editorial.css`.
3. Remove serif and italic UI overrides.
4. Build shared matte block and liquid-glass primitives.

### Phase 2 — cheer engine

1. Add the seven inline SVG templates and shared renderer in `modules/cheersquad.js`.
2. Add deterministic event selection, frequency caps, route cleanup, and settings gates.
3. Implement full/subtle/off pose classes.
4. Add unit tests for event mapping, cooldowns, preference aliases, and reduced-motion decisions.

### Phase 3 — approved homepage

1. Rebuild the topbar and home hero to match the approved prototype.
2. Connect the Continue CTA and path progress to existing real data.
3. Add phrase selection with a safe fallback.
4. Add one home character and validate mobile cropping/stacking.

### Phase 4 — learning moments

1. Integrate completion characters through `Chrome.finishScreen()`.
2. Integrate streak cheers through `Chrome.advance()`.
3. Add Écho to phonics/listening/shadow instructions.
4. Add Violette retry only where feedback is already visible.
5. Replace the old logo flap and update Profile wording.

### Phase 5 — QA and release

1. Run `npm run check` and add squad contract tests.
2. Keyboard-test every appearance, close action, and route transition.
3. Verify full/subtle/off and OS reduced-motion behavior.
4. Verify no overlap at 320/390/768/1440 px and no layout shift.
5. Verify light/dark contrast and offline loading.
6. Run `node scripts/bump_version.js` only after final approval.
7. Stage only the reviewed files; do not include unrelated existing worktree changes.

## Acceptance criteria

- The approved homepage hierarchy and SF Pro visual character are recognizable at every target width.
- The page feels colorful before any animation runs; animation is enhancement, not the source of legibility.
- The squad appears at the right pedagogical moments and never blocks the learner's next action.
- No more than two unsolicited cheers occur in a normal 15-minute session.
- Every character has a distinct silhouette, message, gesture, and module role.
- The entire experience works with animations off, sound off, dark mode, keyboard-only navigation, and offline.
- Existing progress, completion, TTS, SRS, mastery, exam, and service-worker contracts remain intact.

## Planned file set

- Modify: `editorial.css`
- Modify: `app.js`
- Modify: `modules/chrome.js`
- Modify: `modules/settings.js`
- Modify: `modules/profile.js`
- Modify: `index.html`
- Add: `modules/cheersquad.js`
- Add: `tests/cheersquad.test.js`
- Modify via release script: `sw.js` and versioned asset references

No production implementation has been made as part of this planning/prototype pass.
