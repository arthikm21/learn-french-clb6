// French TTS wrapper around browser SpeechSynthesis.
window.TTS = (function () {
  let voice = null;
  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    voice = voices.find(v => v.lang === 'fr-FR') ||
            voices.find(v => v.lang === 'fr-CA') ||
            voices.find(v => v.lang.startsWith('fr')) ||
            null;
  }
  if (typeof speechSynthesis !== 'undefined') {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, rate = 0.9) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = rate;
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  function available() { return 'speechSynthesis' in window; }
  return { speak, available };
})();
