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
const VERSION = '202607182006';
const SHELL_CACHE = 'shell-' + VERSION;
const AUDIO_CACHE = 'audio-v1';

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const page = await fetch('/', { cache: 'reload' });
  if (!page || !page.ok) throw new Error('Could not fetch app shell');
  await cache.put('/', page.clone());
  const html = await page.text();
  const urls = new Set([
    '/site.webmanifest', '/favicon.svg', '/favicon.ico',
    '/favicon-96x96.png', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png',
  ]);
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const raw = match[1];
    if (!raw || raw.startsWith('#') || raw.startsWith('data:')) continue;
    const url = new URL(raw, self.location.origin);
    if (url.origin !== self.location.origin || url.pathname.startsWith('/audio/')) continue;
    if (/\.(?:js|css|woff2?|webmanifest|svg|png|ico)$/.test(url.pathname) || url.searchParams.has('v')) {
      urls.add(url.pathname + url.search);
    }
  }
  // Keep install work from competing with the newly opened app. A release used
  // to start every shell request at once; batching caps network, decode, and
  // Cache API pressure while preserving the same offline shell guarantee.
  const pending = Array.from(urls);
  const BATCH_SIZE = 6;
  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    await Promise.allSettled(pending.slice(i, i + BATCH_SIZE).map(url => cache.add(url)));
  }
}

self.addEventListener('install', (e) => {
  e.waitUntil(precacheShell().then(() => self.skipWaiting()));
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
  // Cache API rejects partial (206) media responses. Await successful writes so
  // the worker cannot be terminated before the asset reaches the cache.
  if (res && res.ok && res.status === 200) {
    try { await cache.put(req, res.clone()); } catch {}
  }
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const refresh = fetch(req).then(res => {
    if (!res || !res.ok || res.status !== 200) return res;
    return cache.put(req, res.clone()).catch(() => {}).then(() => res);
  }).catch(() => hit);
  return hit || refresh;
}

async function cacheFullAudio(url) {
  const cache = await caches.open(AUDIO_CACHE);
  if (await cache.match(url)) return;
  try {
    const res = await fetch(new Request(url, { method: 'GET', credentials: 'same-origin' }));
    if (res && res.ok && res.status === 200) await cache.put(url, res.clone());
  } catch {}
}

async function audioRangeResponse(req) {
  const cache = await caches.open(AUDIO_CACHE);
  const full = await cache.match(req.url);
  if (!full) return fetch(req);
  const bytes = await full.arrayBuffer();
  const size = bytes.byteLength;
  const range = req.headers.get('range') || '';
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range);
  if (!match) return full;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!match[1] && match[2]) { start = Math.max(0, size - end); end = size - 1; }
  end = Math.min(end, size - 1);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= size) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  const headers = new Headers(full.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(bytes.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
}

async function pageNetworkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req);
    // Cache the page under its own URL. The old implementation stored every
    // successful navigation under '/', so visiting an SEO lesson could replace
    // the offline app shell with that standalone page.
    if (res && res.ok && res.status === 200) {
      try { await cache.put(req, res.clone()); } catch {}
    }
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
    if (req.headers.has('range')) {
      e.respondWith(audioRangeResponse(req));
      e.waitUntil(cacheFullAudio(req.url));
    } else {
      e.respondWith(cacheFirst(req, AUDIO_CACHE));
    }
    return;
  }
  if (url.pathname.startsWith('/fonts/')) {
    e.respondWith(cacheFirst(req, SHELL_CACHE));
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
