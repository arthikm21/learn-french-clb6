// Neural French TTS. Plays pre-generated MP3s (Edge TTS / fr-CA-SylvieNeural).
// Falls back to browser SpeechSynthesis if audio unavailable.
// iOS Safari requires a user gesture to start audio playback — we unlock on first tap.
window.TTS = (function () {
  let manifest = null;
  let manifestPromise = null;
  let currentAudio = null;
  // Playback epoch: bumped by stop() (navigation / explicit Stop). Any in-flight
  // async speak()/speakLine(), scheduled auto-play, or sequence continuation that
  // captured an older epoch becomes a no-op. This is what kills the "audio keeps
  // playing after you leave the screen" bug.
  let epoch = 0;
  const pendingTimers = new Set();
  let fallbackVoice = null;
  let audioUnlocked = false;
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    if (manifestPromise) return manifestPromise;
    // Let HTTP and the service worker revalidate this mapping after releases.
    manifestPromise = fetch('audio/manifest.json', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : {})
      .then(m => { manifest = m; return m; })
      .catch(() => { manifest = {}; return manifest; });
    return manifestPromise;
  }
  // Manifest is lazy: fetched on first speak() call, but also warmed in the
  // background once the page is idle — so the first tap-to-pronounce doesn't
  // pay the ~370KB fetch latency.
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const warm = () => { loadManifest(); };
      if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 4000 });
      else setTimeout(warm, 2500);
    });
  }

  // Unlock audio context on first user interaction (iOS Safari requirement).
  function unlock() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    try {
      const a = new Audio();
      a.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAnEpr8htAAAAAAAAAAAAAAAAAAAA//sQwAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQwCgAAAAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQwFVH/8QAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQwP/H/8QAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      a.play().then(() => { a.pause(); }).catch(() => {});
    } catch {}
    // Also unlock SpeechSynthesis on iOS (no-op but registers gesture).
    if ('speechSynthesis' in window) {
      try {
        const u = new SpeechSynthesisUtterance('');
        speechSynthesis.speak(u);
        speechSynthesis.cancel();
      } catch {}
    }
  }
  // Attach gesture listener to unlock audio.
  if (typeof window !== 'undefined') {
    const unlockOnce = () => {
      unlock();
      window.removeEventListener('touchstart', unlockOnce);
      window.removeEventListener('mousedown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
    window.addEventListener('touchstart', unlockOnce, { once: false, passive: true });
    window.addEventListener('mousedown', unlockOnce, { once: false, passive: true });
    window.addEventListener('keydown', unlockOnce, { once: false, passive: true });
  }

  // normalize — the manifest key for a display string: what the neural voice
  // actually says. MUST stay byte-identical to cleanForSpeech() in
  // scripts/extract.js (which builds strings.json + the manifest), or lookups
  // miss and we fall back to (worse) browser speech. It strips teaching
  // scaffolding the voice would otherwise read literally: HTML tags, [slot
  // placeholders], trailing (English/grammar glosses), transformation arrows
  // (-> spoken pause), and ___ fill-in blanks (-> gap).
  function normalize(input) {
    let t = String(input == null ? '' : input);
    t = t.replace(/<[^>]+>/g, '');                        // HTML tags (inline: no space)
    t = t.replace(/\s+/g, ' ');                           // normalize whitespace
    t = t.replace(/\[[^\]\[]*\]/g, ' ');                  // [slot placeholders]
    for (let i = 0; i < 4; i++) {                          // trailing (gloss/label)
      const n = t.replace(/\s*\([^()]*\)\s*$/, '').replace(/\s+$/, '');
      if (n === t) break;
      t = n;
    }
    t = t.replace(/\s*[→⟶➜⇒←⟵]\s*/g, '. ');   // arrows -> spoken pause
    t = t.replace(/_{2,}/g, ' … ');                       // long blank -> gap
    t = t.replace(/(^|[\s([])_(?=[\s)\].,;:!?]|$)/g, '$1 … '); // lone blank
    t = t.replace(/\s+([,.])/g, '$1');                    // space before , or .
    t = t.replace(/([.!?»])\s*\.(\s|$)/g, '$1$2');   // extra period after .!?»
    t = t.replace(/([.!?»])\s*\.(\s|$)/g, '$1$2');
    t = t.replace(/,(?:\s*,)+/g, ',');                    // collapse commas
    t = t.replace(/\(\s*\)/g, ' ');                       // empty parens
    t = t.replace(/\s{2,}/g, ' ').trim();
    t = t.replace(/^[\s,.;:…»]+\s*/, '').trim();          // leading junk
    return t;
  }

  function pickFallbackVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    fallbackVoice =
      voices.find(v => v.lang === 'fr-CA') ||
      voices.find(v => v.lang === 'fr-FR') ||
      voices.find(v => v.lang.startsWith('fr')) ||
      null;
    return fallbackVoice;
  }
  if (typeof speechSynthesis !== 'undefined') {
    pickFallbackVoice();
    speechSynthesis.onvoiceschanged = pickFallbackVoice;
  }

  // True when speaking French aloud is possible: either a French voice is
  // installed, or the voice list hasn't loaded yet (Chrome populates it
  // async — trust the lang hint in that window). If the list is loaded and
  // has NO French voice, the browser would read French text with its default
  // (usually English) voice — teaching wrong sounds. Silence is better.
  function canSpeakFrench() {
    if (fallbackVoice || pickFallbackVoice()) return true;
    return speechSynthesis.getVoices().length === 0;
  }

  function fallbackSpeak(text, rate) {
    if (!('speechSynthesis' in window)) return;
    if (!canSpeakFrench()) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-CA';
    u.rate = rate;
    if (fallbackVoice) u.voice = fallbackVoice;
    speechSynthesis.speak(u);
  }

  // Internal: halt whatever is currently sounding WITHOUT invalidating the epoch.
  // Used by speak()/speakLine() to interrupt the previous clip before starting
  // the next one within the same screen.
  function haltCurrent() {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.onended = null;
        currentAudio.onerror = null;
      } catch {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try { speechSynthesis.cancel(); } catch {}
    }
  }

  // Public hard stop: halt audio AND invalidate every in-flight / scheduled /
  // sequenced playback. Called on every navigation (app.js renderActive, scenario
  // step changes) and by explicit Stop buttons.
  function stop() {
    epoch++;
    pendingTimers.forEach(id => clearTimeout(id));
    pendingTimers.clear();
    haltCurrent();
  }

  async function speak(text, rate = 1.0) {
    haltCurrent();
    const myEpoch = epoch;
    const key = normalize(text);
    if (!key) return;
    // On iOS, if audio not yet unlocked by user gesture, skip silent auto-plays.
    if (IS_IOS && !audioUnlocked) return;
    const m = await loadManifest();
    if (myEpoch !== epoch) return; // navigated/stopped while the manifest loaded
    const src = m[key];
    if (src) {
      try {
        const a = new Audio(src);
        a.playbackRate = rate;
        a.preload = 'auto';
        if (myEpoch !== epoch) return; // a stop() slipped in just before we play
        currentAudio = a;
        // Duck the UI sound bus while pronunciation plays — so the click
        // tick + countdown beep don't fight the French audio for attention.
        if (window.Sounds && typeof Sounds.duck === 'function') {
          try { Sounds.duck(1200); } catch {}
        }
        await a.play();
        // play() resolves once playback STARTS; if a stop() landed during that
        // window, halt the clip we just started.
        if (myEpoch !== epoch) { try { a.pause(); a.currentTime = 0; } catch {} }
        return;
      } catch (e) {
        // Autoplay block, network, codec, or interrupted-by-stop — fall through.
      }
    }
    if (myEpoch !== epoch) return; // don't fall back to speech-synth after a stop
    fallbackSpeak(key, rate * 0.9);
  }

  // Sequential playback with onDone callback. Voice = 'fr-CA-SylvieNeural' (default) or 'fr-CA-JeanNeural'.
  async function speakLine(text, voice, onDone) {
    haltCurrent();
    const myEpoch = epoch;
    // onDone advances sequence loops (mock/scenario/read/dialogue). Only fire it
    // while our epoch is still current — otherwise a navigation mid-sequence
    // would keep marching through the remaining lines.
    const done = () => { if (myEpoch === epoch && onDone) onDone(); };
    const key = normalize(text);
    if (!key) { done(); return; }
    if (IS_IOS && !audioUnlocked) { done(); return; }
    const m = await loadManifest();
    if (myEpoch !== epoch) return; // navigated/stopped: kill the chain (no onDone)
    // Look up voice-tagged first, then default (Sylvie)
    const voiceKey = voice && voice !== 'fr-CA-SylvieNeural' ? (voice + '|' + key) : null;
    const src = (voiceKey && m[voiceKey]) || m[key];
    if (src) {
      try {
        const a = new Audio(src);
        a.playbackRate = 1.0;
        a.preload = 'auto';
        if (myEpoch !== epoch) return;
        currentAudio = a;
        a.onended = done;
        a.onerror = done;
        await a.play();
        if (myEpoch !== epoch) { try { a.pause(); a.currentTime = 0; } catch {} }
        return;
      } catch (e) {
        // fall through to SpeechSynthesis
      }
    }
    if (myEpoch !== epoch) return;
    // Fallback: SpeechSynthesis with different voice. Speak the normalized
    // key (not the raw display text) so scaffolding like [slots] and
    // (glosses) is never read literally; and only with a French voice.
    if (!('speechSynthesis' in window) || !canSpeakFrench()) { done(); return; }
    const u = new SpeechSynthesisUtterance(key);
    u.lang = 'fr-CA';
    if (voice === 'fr-CA-JeanNeural') {
      u.pitch = 0.7; // male-ish
    }
    u.rate = 0.9;
    if (fallbackVoice) u.voice = fallbackVoice;
    u.onend = done;
    speechSynthesis.speak(u);
  }

  // Auto-play after a short delay, cancelling cleanly if the user navigates away
  // before it fires. Drop-in replacement for `setTimeout(() => TTS.speak(...))`.
  function speakSoon(text, rate = 1.0, delay = 250) {
    const myEpoch = epoch;
    const id = setTimeout(() => {
      pendingTimers.delete(id);
      if (myEpoch !== epoch) return; // navigated/stopped before it fired
      speak(text, rate);
    }, delay);
    pendingTimers.add(id);
    return id;
  }

  function available() { return true; }

  return { speak, speakSoon, speakLine, stop, epoch: () => epoch, available, isIOS: () => IS_IOS };
})();
