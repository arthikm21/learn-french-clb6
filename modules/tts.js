// Neural French TTS. Plays pre-generated MP3s (Edge TTS / fr-CA-SylvieNeural).
// Falls back to browser SpeechSynthesis if audio unavailable.
// iOS Safari requires a user gesture to start audio playback — we unlock on first tap.
window.TTS = (function () {
  let manifest = null;
  let manifestPromise = null;
  let currentAudio = null;
  let fallbackVoice = null;
  let audioUnlocked = false;
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    if (manifestPromise) return manifestPromise;
    manifestPromise = fetch('audio/manifest.json', { cache: 'force-cache' })
      .then(r => r.ok ? r.json() : {})
      .then(m => { manifest = m; return m; })
      .catch(() => { manifest = {}; return manifest; });
    return manifestPromise;
  }
  // Manifest is lazy: only fetched on first speak() call.

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

  function normalize(text) {
    if (!text) return '';
    let t = String(text).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    t = t.replace(/\s*\(\s*[A-Za-z][A-Za-z\s',.!?\-]*\)\s*$/, '').trim();
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

  function fallbackSpeak(text, rate) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-CA';
    u.rate = rate;
    if (fallbackVoice) u.voice = fallbackVoice;
    speechSynthesis.speak(u);
  }

  function stop() {
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.currentTime = 0; } catch {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  async function speak(text, rate = 1.0) {
    stop();
    const key = normalize(text);
    if (!key) return;
    // On iOS, if audio not yet unlocked by user gesture, skip silent auto-plays.
    if (IS_IOS && !audioUnlocked) return;
    const m = await loadManifest();
    const src = m[key];
    if (src) {
      try {
        const a = new Audio(src);
        a.playbackRate = rate;
        a.preload = 'auto';
        currentAudio = a;
        // Duck the UI sound bus while pronunciation plays — so the click
        // tick + countdown beep don't fight the French audio for attention.
        if (window.Sounds && typeof Sounds.duck === 'function') {
          try { Sounds.duck(1200); } catch {}
        }
        await a.play();
        return;
      } catch (e) {
        // Autoplay block, network, or codec — fall through.
      }
    }
    fallbackSpeak(text, rate * 0.9);
  }

  // Sequential playback with onDone callback. Voice = 'fr-CA-SylvieNeural' (default) or 'fr-CA-JeanNeural'.
  async function speakLine(text, voice, onDone) {
    stop();
    const key = normalize(text);
    if (!key) { onDone && onDone(); return; }
    if (IS_IOS && !audioUnlocked) { onDone && onDone(); return; }
    const m = await loadManifest();
    // Look up voice-tagged first, then default (Sylvie)
    const voiceKey = voice && voice !== 'fr-CA-SylvieNeural' ? (voice + '|' + key) : null;
    const src = (voiceKey && m[voiceKey]) || m[key];
    if (src) {
      try {
        const a = new Audio(src);
        a.playbackRate = 1.0;
        a.preload = 'auto';
        currentAudio = a;
        a.onended = () => { onDone && onDone(); };
        a.onerror = () => { onDone && onDone(); };
        await a.play();
        return;
      } catch (e) {
        // fall through to SpeechSynthesis
      }
    }
    // Fallback: SpeechSynthesis with different voice
    if (!('speechSynthesis' in window)) { onDone && onDone(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-CA';
    if (voice === 'fr-CA-JeanNeural') {
      u.pitch = 0.7; // male-ish
    }
    u.rate = 0.9;
    if (fallbackVoice) u.voice = fallbackVoice;
    u.onend = () => { onDone && onDone(); };
    speechSynthesis.speak(u);
  }

  function available() { return true; }

  return { speak, speakLine, stop, available, isIOS: () => IS_IOS };
})();
