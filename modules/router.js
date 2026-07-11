// Pure hash-routing helpers. Keeping parsing/building outside app.js makes
// malformed shared links recoverable and the navigation contract testable.
window.Router = (function () {
  const SAFE_ROUTE = /^[a-z0-9-]+$/;

  function normalizeRoute(route) {
    const value = String(route || '').trim().toLowerCase();
    return SAFE_ROUTE.test(value) ? value : 'home';
  }

  function parse(hash) {
    const raw = String(hash || '').replace(/^#/, '');
    const separator = raw.indexOf('?');
    const routePart = separator < 0 ? raw : raw.slice(0, separator);
    const query = separator < 0 ? '' : raw.slice(separator + 1);
    const params = Object.create(null);
    // URLSearchParams tolerates malformed percent sequences instead of
    // throwing and stranding the app on a blank route.
    for (const [key, value] of new URLSearchParams(query)) {
      if (key) params[key] = value;
    }
    return { route: normalizeRoute(routePart || 'home'), params };
  }

  function build(route, params) {
    const safeRoute = normalizeRoute(route);
    const query = new URLSearchParams();
    if (params && typeof params === 'object') {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) query.set(key, String(value));
      }
    }
    const suffix = query.toString();
    return `#${safeRoute}${suffix ? `?${suffix}` : ''}`;
  }

  return { parse, build };
})();
