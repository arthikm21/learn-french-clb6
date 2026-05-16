// Neural French TTS. Plays pre-generated MP3s (Edge TTS / fr-CA-SylvieNeural).
// Falls back to browser SpeechSynthesis only if manifest miss + audio file 404s.
window.TTS = (function () {
  let manifest = null;
  let manifestPromise = null;
  let currentAudio = null;
  let fallbackVoice = null;

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    if (manifestPromise) return manifestPromise;
    manifestPromise = fetch('audio/manifest.json', { cache: 'force-cache' })
      .then(r => r.ok ? r.json() : {})
      .then(m => { manifest = m; return m; })
      .catch(() => { manifest = {}; return manifest; });
    return manifestPromise;
  }
  // Kick off on load
  if (typeof window !== 'undefined') loadManifest();

  // Mirror extractor normalization
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
    const m = await loadManifest();
    const src = m[key];
    if (src) {
      try {
        const a = new Audio(src);
        a.playbackRate = rate;
        currentAudio = a;
        await a.play();
        return;
      } catch (e) {
        // Audio play failed (autoplay block, network) — fall through to TTS
      }
    }
    // Slower rate for fallback because browser voices read fast
    fallbackSpeak(text, rate * 0.9);
  }

  function available() {
    return true; // always: we have MP3s, and SpeechSynthesis as fallback
  }

  return { speak, stop, available };
})();
