// Offline service worker.
//
// Strategy per resource type:
//   · Audio clips (/audio/<sha1>.mp3) — content-addressed and immutable →
//     cache-first, cached on demand as the learner plays them. The audio set
//     is ~150MB total so it is NEVER precached; you keep offline access to
//     exactly the clips you've already heard.
//   · Fonts — immutable → cache-first.
//   · Versioned assets (?v= from bump_version.js) — a new release changes the
//     URL → cache-first is safe; the whole shell cache is dropped on version
//     bump anyway.
//   · audio/manifest.json + unversioned files — stale-while-revalidate.
//   · Navigations — network-first, falling back to the cached shell so the
//     app still opens with no connection.
//
// VERSION is stamped by scripts/bump_version.js on every release; activating
// a new version deletes the previous shell cache (audio cache persists).
const VERSION = '202607051423';
const SHELL_CACHE = 'shell-' + VERSION;
const AUDIO_CACHE = 'audio-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then(c => c.add('/').catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== SHELL_CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const refresh = fetch(req).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => hit);
  return hit || refresh;
}

async function pageNetworkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put('/', res.clone());
    return res;
  } catch {
    return (await cache.match(req)) || (await cache.match('/')) ||
      new Response('Offline — reconnect to load Bonjour! the first time.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // fonts.googleapis etc. — leave alone

  if (req.mode === 'navigate') {
    e.respondWith(pageNetworkFirst(req));
    return;
  }
  if (url.pathname.startsWith('/audio/') && url.pathname.endsWith('.mp3')) {
    e.respondWith(cacheFirst(req, AUDIO_CACHE));
    return;
  }
  if (url.pathname.startsWith('/fonts/')) {
    e.respondWith(cacheFirst(req, AUDIO_CACHE));
    return;
  }
  // Versioned release assets: URL changes on every deploy, safe to pin.
  if (url.searchParams.has('v')) {
    e.respondWith(cacheFirst(req, SHELL_CACHE));
    return;
  }
  // manifest.json, icons, unversioned odds and ends.
  e.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
});
