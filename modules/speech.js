// Shared helpers for the browser SpeechRecognition API.
//
// Why this exists: every speaking module used to write its own onerror/onend
// pair, with two bugs in every copy — (1) onerror swallowed the real error
// code and showed a generic "no speech" message, and (2) onend blindly
// restarted recognition, which silently busy-loops when the service is
// blocked (the classic Brave-without-Google-services failure mode, or when
// the user denies mic access). The helpers below give every call site a
// uniform user-facing message and a fatal-flag pattern that stops the loop.
window.Speech = (function () {

  // True if the page is running inside Brave. Brave disables the Web Speech
  // API by default and shows nothing — we surface a specific hint for it.
  function isBrave() {
    return !!(navigator.brave && typeof navigator.brave.isBrave === 'function');
  }

  // Map a SpeechRecognitionErrorEvent.error code to a user-facing message.
  // Returning '' means "do not show anything" (e.g. for the normal `aborted`
  // event that fires when we stop recognition ourselves).
  function errorMessage(code) {
    switch (code) {
      case 'not-allowed':
        return 'Microphone blocked. Click the lock icon in the address bar, allow microphone access, then reload.';
      case 'service-not-allowed':
        return isBrave()
          ? 'Brave blocks Google speech recognition by default. Open brave://settings/privacy and enable "Use Google services for push messaging" — or open this page in Chrome / Edge.'
          : 'Browser speech service unavailable. Try Chrome or Edge — Brave and Firefox block it by default.';
      case 'audio-capture':
        return 'No microphone detected. Check that one is connected and selected in your system sound settings.';
      case 'language-not-supported':
        return 'Your browser doesn\'t support French speech recognition. Try Chrome or Edge.';
      case 'network':
        return 'Network error reaching the speech service. Check your connection and try again.';
      case 'no-speech':
        return 'Didn\'t hear anything. Speak closer to the mic and a bit louder.';
      case 'aborted':
        return '';
      default:
        return code ? `Speech error: ${code}.` : 'Speech recognition error.';
    }
  }

  // True if the error means recognition can't succeed on retry — the onend
  // handler must NOT call start() again, or it busy-loops invisibly.
  function isFatal(code) {
    return code === 'not-allowed'
        || code === 'service-not-allowed'
        || code === 'audio-capture'
        || code === 'language-not-supported';
  }

  return { isBrave, errorMessage, isFatal };
})();
