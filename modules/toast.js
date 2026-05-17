// Non-blocking toast notifications. Replaces alert(). Mobile-friendly.
window.Toast = (function () {
  let host = null;
  function ensureHost() {
    if (host && document.body.contains(host)) return host;
    host = document.createElement('div');
    host.id = 'toast-host';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
    return host;
  }
  function show(message, opts = {}) {
    const { type = 'info', duration = 2500 } = opts;
    const h = ensureHost();
    const t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.textContent = message;
    h.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-in'));
    setTimeout(() => {
      t.classList.remove('toast-in');
      t.classList.add('toast-out');
      setTimeout(() => t.remove(), 250);
    }, duration);
  }
  return {
    info: (m, d) => show(m, { type: 'info', duration: d }),
    good: (m, d) => show(m, { type: 'good', duration: d }),
    bad: (m, d) => show(m, { type: 'bad', duration: d }),
    warn: (m, d) => show(m, { type: 'warn', duration: d }),
  };
})();
