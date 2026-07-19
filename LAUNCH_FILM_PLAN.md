# Bonjour! launch film — production blueprint

## Creative thesis

**Working title:** *French, in motion.*

The website becomes a physical object: an ultra-thin, floating “learning window” in a midnight studio. Its real interface separates into precise dimensional layers—today’s lesson, the guided path, a live Canadian-French waveform, real-life scenarios, and four-skill exam practice—before resolving into the Bonjour! mark on warm paper.

The visual language borrows the discipline of premium hardware advertising: macro photography, sparse copy, exact lighting, controlled camera motion, and sound-synchronised transitions. It does not use Apple logos, proprietary sounds, recognisable Apple copy, or an exact MacBook replica.

The emotional arc is:

1. Curiosity
2. One clear next step
3. Hear it
4. Repeat it
5. Use it in real Canadian life
6. Rehearse all four exam skills
7. Start freely

## Locked 45-second edit

| Time | Picture and motion | Copy and sound |
|---|---|---|
| **00.00–02.50** | Near-black studio. Extreme macro of the polished edge of the Bonjour `B.` tile. A cobalt highlight finds the dot. | No copy. Dry tick, low pulse, rising air. |
| **02.50–05.00** | Camera arcs around a generic ultra-thin learning window. The current `og-image.jpg` appears softly on its reverse; it turns toward camera. | First glass chord. |
| **05.00–10.00** | The current homepage assembles on the screen: brand chrome, “Ready for today’s French?”, six colourful language blocks, then the glass phrase card. | Genuine UI copy only. Beat begins at 96 BPM. |
| **10.00–15.00** | The daily plan rises out of the screen. Three steps separate in depth and eight phase markers draw across the studio. A progress dot becomes a line. | **A clear path toward NCLC 6.** Supporting proof: **8 phases · 92 milestones**. |
| **15.00–20.00** | The stage drops to black except for a glass dialogue card and cobalt/violet waveform. The waveform reacts to the real Canadian-French clip. | **Listen.** Play `audio/5311184f258e06aa.mp3`: “Bonjour, je voudrais ouvrir un compte chèque.” Music ducks beneath the voice. |
| **20.00–22.50** | The waveform folds flat into the seven scenario steps: Situation · Listen · Vocab · Grammar · Shadow · Check · Your turn. | Seven precise magnetic snaps. |
| **22.50–27.50** | Phrase card becomes a shadowing surface with Slow / Hear it / Fast. It transforms into a speaking pulse and a mint self-rating confirmation. | **Repeat.** then **Speak it.** Never imply automated grading. |
| **27.50–32.50** | Camera travels through exact scenario cards: Calling about an apartment; Opening a bank account; Booking a clinic appointment; Job interview — introduction. | **French for real life in Canada.** Supporting proof: **50 real-life scenarios.** |
| **32.50–37.50** | Cards compress into four quadrants: Listening, Speaking, Reading, Writing. A central TCF Canada practice surface shows `2h47`, with `39` for listening and reading. | **Rehearse all four skills.** Four notes, then a stopped timer tick. |
| **37.50–40.00** | Three large proof points settle in space and begin forming the brand mark. | **8 phases · 50 scenarios · 120 listening clips**. |
| **40.00–45.00** | Objects collapse into the real `B.` icon. Midnight becomes warm paper. End lockup holds cleanly for more than two seconds. | **Bonjour!** · French practice for Canada · **Free · No signup · No tracking** · `frenchclb6.ca`. Original two-note sign-off. |

## Brand and asset rules

- **Palette:** midnight `#07080B`, paper `#FBF8F3`, surface `#FFFEFC`, ink `#071630`, cobalt `#1457E6`, violet `#6D3FD4`, coral `#FF735F`, sky `#A9D8FF`, mint `#A8E3CC`, butter `#FFC94E`, lavender `#C9B6F4`.
- **Typography:** bundled Inter variable font with system sans fallback.
- **Signature motif:** rebuild the homepage’s six-tile language stage and floating phrase card as glossy Three.js forms.
- **Logo:** use `icon-512.png` and `favicon.svg` at modest display size; never upscale either as a full-frame texture.
- **Artwork:** use `og-image.jpg` only as an oblique reverse-panel or end-card accent; do not stretch the 1200×630 raster to full-screen 4K.
- **Voice:** use the verified same-origin Canadian-French MP3. The soundtrack itself is original and generated in-browser.
- **Claims:** only use counts verified from project data. Phrase the target as a path *toward* NCLC 6, never a guaranteed result.

## Technical architecture

- One standalone `launch-film.html` owns markup, styles, timeline, UI painters, sound, controls, and scene code.
- Three.js r184 is pinned in `vendor/three-r184/` with its MIT license. The film makes zero runtime requests to third-party CDNs.
- The existing `npm start` server remains the only development/runtime requirement. No build system is added.
- A single absolute playhead is the source of truth. `renderAt(seconds)` samples every camera, object, screen, shader, copy, and audio state from time; transforms never accumulate frame-to-frame.
- A fixed 16:9 stage is letterboxed inside arbitrary viewports.
- UI surfaces are painted into two reusable 2560×1600 canvases and cross-faded on the 16:10 device screen.
- The generic device is procedurally modelled with rounded `Shape`/`ExtrudeGeometry`, an aluminium physical material, instanced keys, a black bezel, and a thin glass display.
- ACES tone mapping, sRGB output, a restrained light rig, and no heavy post-processing keep 2K/4K performance predictable.
- A seeded random generator makes decorative placement deterministic.

### Quality modes

- **Auto:** bounded native stage resolution.
- **2K:** exact 2560×1440 drawing buffer.
- **4K:** exact 3840×2160 drawing buffer when GPU limits allow; capability limits visibly downgrade to 2K or Auto, while context loss uses the accessible fallback.

### Playback and accessibility

- User-initiated Play prevents surprise audio and satisfies browser autoplay rules.
- Controls: play/pause, replay, scrubber, mute, fullscreen, elapsed time, and quality.
- Keyboard: Space/K, arrows, Home/End, M, F, R.
- All meaningful film copy remains real DOM for crisp rendering and an accessible transcript; the WebGL canvas is decorative.
- Reduced-motion mode starts paused, reduces camera displacement, removes particles, and suppresses CSS transition effects.
- WebGL failure falls back to a polished poster using the current artwork and the full transcript.

### Audio

- An `OfflineAudioContext` renders one original 45-second stereo soundtrack buffer.
- The Canadian-French MP3 is decoded and mixed into that single buffer at the listening cue.
- Play, pause, replay, and seek recreate one buffer source at the absolute playhead, preventing overlap and drift.
- If audio decoding fails, the visual film and visible translation still work.

### Debug and later export API

`window.__BONJOUR_FILM__` exposes:

- `ready`
- `duration` (exactly `45`)
- `seek(seconds)`
- `play()` / `pause()` / `replay()`
- `setQuality('auto'|'2k'|'4k')`
- `renderFrame(frame, fps)`
- `state()`

This makes keyframe QA and a later deterministic frame-sequence export possible without changing the film.

## Acceptance criteria

- The film clamps and renders its final state at exactly **45.000 seconds**.
- Replay, pause, seek, mute, and repeated timeline crossing never duplicate sound or mutate scene state.
- `renderAt(t)` produces the same scene state regardless of the previously viewed shot.
- Exact 2560×1440 and 3840×2160 drawing buffers can be verified from the public debug API.
- All current assets load from the repository; optional image/audio failures have graceful visual or captioned fallbacks.
- The film remains composed at portrait mobile, desktop, 2K, and 4K viewports.
- The end card holds for at least two seconds and remains inside a five-percent title-safe boundary.
- Controls are keyboard accessible; reduced-motion and WebGL-fallback modes remain understandable.
- Console errors, missing resources, false product claims, and changes to existing dirty files are release blockers.

## Primary Three.js references

- Installation: https://threejs.org/manual/en/installation.html
- r184 release: https://github.com/mrdoob/three.js/releases
- License: https://github.com/mrdoob/three.js/blob/dev/LICENSE
