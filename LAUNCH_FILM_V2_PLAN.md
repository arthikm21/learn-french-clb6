# Bonjour! Launch Film V2 — 45-Second Upgrade Plan

## Outcome

V2 keeps the exact 45.000-second deterministic Three.js master, but makes the learner value clearer and the pacing materially faster. The story is no longer only “look at the product.” It is:

**Next step → guided target → weak-spot review → real listening → honest speaking → real-life transfer → test-format rehearsal → useful evidence.**

The film must never promise an NCLC/CLB 6 result. It should show why Bonjour! is unusually focused on practice *toward* that target.

## What becomes better

1. **The learner benefit appears by 1.5 seconds.** The hardware-inspired reveal becomes framing, not the main event.
2. **NCLC 6 focus becomes a visible system.** A new target scene explains focused scope, weak-spot return, and timed rehearsal.
3. **Retention becomes concrete.** Mistakes visibly feed back into review instead of appearing as a generic feature.
4. **Exam practice becomes specific.** The four-skill practice structure is shown accurately: 39 listening, 39 reading, three speaking tasks, three writing tasks, approximately 2h47.
5. **Trust is part of the pitch.** The film says “practice evidence—not a certified score” and shows on-device speaking review without invented pronunciation grading.
6. **The film cuts faster.** Major ideas land on a 120 BPM half-second grid; entries settle quickly so copy still receives a clean hold.
7. **The score becomes audible.** A stronger original pad, pulse, bass, pluck motif, transition whooshes, voice duck, compressor, and resolving end chord replace the nearly subliminal bed.

## Exact 45-second storyboard

| Time | Visual beat | Locked learner-facing copy |
|---|---|---|
| 00.00–01.50 | Macro `B.` mark; cobalt light sweep; fast pullback | — |
| 01.50–03.50 | Laptop snaps open to the current homepage phrase card | **One clear next step.** / `Today · About 15 minutes` |
| 03.50–06.00 | The laptop shifts aside while today’s three actions become the rhythm of the cut | **Review. Continue. Speak.** / `A practical plan for today.` |
| 06.00–08.50 | A dimensional NCLC 6 target arrives with focused-scope, weak-spot, and timed-format benefits | **A guided path toward NCLC 6 / CLB 6.** / `8 phases · 92 milestones` |
| 08.50–11.00 | Review, continue, and speaking cards loop a weak item back | **Mistakes feed back into review.** / `Spaced practice brings hard items back.` |
| 11.00–15.50 | Readable Canadian-French phrase card and voice-derived waveform | **Hear Canadian French.** |
| 15.50–18.00 | Listening waveform compresses into listening-practice proof | **120 focused clips. Four speeds. Five drill types.** |
| 18.00–20.50 | Microphone ring, playback, and honest self-check | **Record. Listen back. Self-rate.** / `Speaking recordings stay on this device.` |
| 20.50–24.00 | Five real Canadian scenario cards move with parallax | **Practise the conversations you’ll actually have.** / `50 real-life Canadian scenarios` |
| 24.00–27.00 | Scenario unfolds into its seven learning steps | **One situation. Seven focused steps.** / `Listen → understand → repeat → speak` |
| 27.00–29.50 | Final step loops back to the weak-spot review card | **Hard items come back.** / `Review until they stick.` |
| 29.50–33.50 | Listening, speaking, reading, and writing form around the timer | **Rehearse all four TCF Canada skills.** / `≈2h47 · 39 listening · 39 reading · 3 speaking · 3 writing` |
| 33.50–36.00 | One weaker practice priority highlights; no band estimate appears | **See what to strengthen next.** / `Practice evidence—not a certified score.` |
| 36.00–38.50 | Dimensional proof slabs: 8, 92, 50, 120 | **Focused. Measurable. Honest.** |
| 38.50–41.00 | Proof slabs magnetically form the brand mark; paper background arrives | **No account. No tracking.** / `Progress and speaking recordings stay on this device.` |
| 41.00–45.00 | Fully settled final lockup | **Bonjour!** / `Structured practice toward NCLC 6 / CLB 6` / `Free · No signup · No tracking` / `frenchclb6.ca` |

## Motion system

- **Tempo:** 120 BPM, giving one beat every 0.5 seconds and exactly 90 beats in 45 seconds.
- **Move, settle, read:** 35–40% of a shot is motion; the remainder is a stable composition.
- **Copy transitions:** 0.18–0.24 second entry; 0.12–0.18 second exit.
- **Three recurring transition families:**
  - circular match cuts: logo dot → play → mic → review loop;
  - line transformations: clock → path → waveform → four-skill rails;
  - panel folds: Today card → scenarios → seven steps → evidence → stats.
- **Determinism:** every transform remains an absolute function of the 45-second playhead. Seeking cannot change the result.
- **Reduced motion:** camera travel is blended toward a stable viewpoint, particles are removed, and CSS transitions are suppressed.

## New visual system

### NCLC 6 focus group

A physical target object contains a central `NCLC 6` card and three orbiting benefit cards:

- **Focused scope** — no literary detours;
- **Weak spots** — hard items return;
- **Test format** — rehearse under the clock.

It appears once as the target is introduced, then returns before proof points to close the argument.

### Faster evidence moments

- Daily action cards settle on successive half-beats.
- The path markers fire in a quick eight-node sequence.
- Scenario cards advance every 0.7–0.8 seconds.
- Four test skills enter on separate musical hits; the central `≈2h47` panel lands last.
- Stats do not count up slowly; each exact number is immediately readable.

### Transition layer

A deterministic cobalt/paper flash and moving light rule fires only at canonical cut points. This adds perceived speed without making every object continuously float.

## Audio plan

- Original in-browser score only; no licensed or third-party music dependency.
- Pad chords and a recurring four-note Bonjour motif establish identity.
- Sub pulse and restrained kick create the 120 BPM drive.
- Short plucks land card entries; filtered noise whooshes land major cuts.
- Music ducks approximately 8–9 dB for the 4.392-second Canadian-French voice line.
- A compressor/limiter controls the denser mix and prevents clipping.
- The music resolves into a sustained warm chord from roughly 40 to 45 seconds instead of disappearing before the end card.
- AudioContext time anchors normal playback; manual `renderAt(t)` and frame export remain independent and deterministic.

## Verified claims and guardrails

Safe local claims:

- 8 phases;
- 92 milestones;
- 50 real-life Canadian scenarios;
- 120 focused listening clips;
- seven scenario steps;
- Canadian French audio;
- 39 listening questions / 35 minutes;
- 39 reading questions / 60 minutes;
- three writing tasks / 60 minutes;
- three speaking tasks / 12 minutes;
- approximately 2h47 across four skills;
- free course, no signup, no site analytics/tracking;
- progress and speaking recordings remain on the learner’s device.

Do not use: “guaranteed,” “pass NCLC 6,” “official mock,” “score predictor,” “certified score,” “AI pronunciation grade,” “native Canadian French audio,” fixed preparation timelines, or claims of institutional endorsement.

## Technical changes

- Introduce canonical shot and cut maps, then align visuals, copy, camera keys, transition flashes, sound cues, and scene reporting to those boundaries.
- Add a `createTargetGroup()` scene and reuse existing branded geometry/material helpers.
- Retune the existing camera keys into quick cut/settle/hold pairs.
- Skip hidden card and waveform updates to reduce 2K/4K work.
- Use `preserveDrawingBuffer` only for `?capture=1` export mode.
- Keep the public API, exact 2K/4K modes, scrubber, replay, mute, fullscreen, transcript, poster, file warning, and WebGL fallback.

## Acceptance criteria

- Duration clamps at exactly 45.000 seconds.
- 2K is exactly 2560×1440; 4K is exactly 3840×2160 when supported.
- Each major scene settles within 0.9 seconds.
- The local French voice remains intelligible above the score.
- Music remains audible through the final frame without clipping.
- Play, pause, replay, pointer scrubbing, and keyboard scrubbing remain synchronized.
- Arbitrary seeking produces the same visual state as uninterrupted playback.
- No NCLC/CLB 6 result is guaranteed or predicted.
- Portrait, reduced-motion, WebGL fallback, and the accessible transcript remain complete.
- The full repository test and content-validation suite passes.
