/* Sukkiri offline service worker.
 *
 * Bump VERSION with every build (it should match BUILD in Sukkiri.dc.html): a new value
 * makes browsers install this worker again, re-download the app shell and drop old caches.
 *
 * Strategy
 * - App files (same origin): network first, cache fallback. Online you always get the
 *   latest build; offline you get the last one you opened.
 * - Libraries and fonts (unpkg, jsdelivr, Google Fonts, the Akatsuki broadcast script):
 *   served from cache, refreshed in the background. Fetched in CORS mode so the
 *   integrity (SRI) checks support.js does on React still pass from cache.
 * - Live data (Supabase, Open-Meteo) and anything that is not a GET: never touched,
 *   straight to the network. The app already falls back to localStorage for those.
 */
const VERSION = 'sk-20261104-r023';
const CACHE = 'sukkiri-' + VERSION;

const SHELL = [
  './',
  'index.html',
  'Sukkiri.dc.html',
  'support.js',
  'manifest.webmanifest',
  'js/akatsuki-client.js?v=s4b2',
  'js/adapters/sukkiri-adapter.js?v=s4b2',
  'js/data.js',
  'js/print.js',
  'js/weather.js',
  '_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/tokens/colors.css',
  '_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/tokens/typography.css',
  '_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/tokens/shape.css',
  '_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/tokens/themes.css',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

const LIBS = [
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://celeritas7.github.io/Akatsuki/js/akatsuki-broadcast.js',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Zen+Maru+Gothic:wght@500;700;900&family=Nunito:wght@400;600;700;800&display=swap'
];

const STATIC_HOSTS = ['unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com', 'celeritas7.github.io'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // One missing file must not abort the whole install, so add them one by one.
    await Promise.all(SHELL.map(u => cache.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await Promise.all(LIBS.map(async u => {
      try {
        const res = await fetch(new Request(u, { mode: 'cors', credentials: 'omit' }));
        if (res.ok) await cache.put(u, res);
      } catch (e) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('sukkiri-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) { event.respondWith(networkFirst(req)); return; }
  if (STATIC_HOSTS.includes(url.hostname)) { event.respondWith(staleWhileRevalidate(req, event)); return; }
  // Everything else (Supabase, Open-Meteo, …) goes straight to the network.
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(req) || await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const page = await cache.match('Sukkiri.dc.html');
      if (page) return page;
    }
    throw e;
  }
}

async function staleWhileRevalidate(req, event) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const refresh = fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  if (hit) { event.waitUntil(refresh); return hit; }
  const res = await refresh;
  return res || Response.error();
}
