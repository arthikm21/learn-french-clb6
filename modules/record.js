// Local audio recording — MediaRecorder API.
//
// Why this exists: the browser SpeechRecognition API is blocked in Brave by
// default and is unreliable for non-native French in any browser, so the site
// no longer pretends to auto-grade speech. Instead, the speaking tasks now
// record the learner locally, let them play it back, self-rate, and
// optionally type-back what they said for a text-grade. Nothing leaves the
// device — no upload, no Google service, no API cost.
//
// API:
//   Record.supported()                → boolean
//   Record.create()                   → Promise<{ start, stop, cleanup }>
//     start()                         → begins recording
//     stop()                          → Promise<{ blob, url, mimeType, durationMs }>
//     cleanup()                       → releases mic tracks + revokes object URLs
window.Record = (function () {

  function supported() {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && typeof window.MediaRecorder === 'function');
  }

  // Pick the best mimeType the current browser actually supports. Chromium
  // (Chrome/Edge/Brave) prefers webm/opus; Safari only does mp4. Empty string
  // means "let the browser pick its default."
  function pickMimeType() {
    if (typeof MediaRecorder.isTypeSupported !== 'function') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/ogg;codecs=opus',
    ];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) return c;
    }
    return '';
  }

  // Map a getUserMedia error to a user-facing message. These are the only
  // failure modes the learner can act on — generic errors get a fallback.
  function describeError(err) {
    const name = err && err.name;
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return 'Microphone access blocked. Click the lock icon in the address bar, allow microphone, then try again.';
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return 'No microphone detected. Connect one and try again.';
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return 'Microphone is in use by another app. Close that app (Zoom, Teams, etc.) and try again.';
    }
    if (name === 'OverconstrainedError') {
      return 'Selected microphone does not support the required settings.';
    }
    return 'Could not start recording: ' + (name || 'unknown error');
  }

  // Every active recorder registers here so stopAll() can release them on
  // navigation. Without this, navigating away mid-recording leaves the mic
  // capture light on indefinitely and leaks the MediaStream + blob URLs.
  const active = new Set();

  async function create() {
    if (!supported()) {
      throw new Error('Audio recording is not supported in this browser. Open this page in Chrome, Edge, Brave, Safari, or Firefox.');
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      throw new Error(describeError(err));
    }
    const mimeType = pickMimeType();
    const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];
    let startedAt = 0;
    let lastUrl = null;
    let disposed = false;

    rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };

    const handle = {
      mimeType: rec.mimeType || mimeType || 'audio/webm',

      start() {
        startedAt = Date.now();
        // 500ms timeslice keeps chunks small and works around a Safari bug
        // where a single huge chunk can drop on .stop().
        rec.start(500);
      },

      stop() {
        return new Promise((resolve, reject) => {
          if (rec.state === 'inactive') {
            return reject(new Error('Recorder is not active.'));
          }
          rec.onstop = () => {
            try { stream.getTracks().forEach(t => t.stop()); } catch {}
            const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
            if (lastUrl) { try { URL.revokeObjectURL(lastUrl); } catch {} }
            lastUrl = URL.createObjectURL(blob);
            resolve({ blob, url: lastUrl, mimeType: blob.type, durationMs: Date.now() - startedAt });
          };
          try { rec.stop(); } catch (e) { reject(e); }
        });
      },

      cleanup() {
        if (disposed) return;
        disposed = true;
        try { if (rec.state !== 'inactive') rec.stop(); } catch {}
        try { stream.getTracks().forEach(t => t.stop()); } catch {}
        if (lastUrl) { try { URL.revokeObjectURL(lastUrl); } catch {} lastUrl = null; }
        active.delete(handle);
      },
    };
    active.add(handle);
    return handle;
  }

  // Called by the router on every navigation so mid-recording streams don't
  // outlive the page they were created on.
  function stopAll() {
    for (const h of Array.from(active)) {
      try { h.cleanup(); } catch {}
    }
    active.clear();
  }

  return { supported, create, describeError, stopAll };
})();
