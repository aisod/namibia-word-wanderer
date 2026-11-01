const CACHE = 'namqula-offline-__VERSION__';
const FILES = __FILES__;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try { await cache.addAll(FILES.map(url => new Request(url, { cache: 'reload' }))); }
    catch (error) { await caches.delete(CACHE); throw error; }
  })());
});
// Updates wait until existing app windows close, keeping lazy chunks consistent.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('namqula-offline-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'ACTIVATE_UPDATE') { event.waitUntil(self.skipWaiting()); return; }
  if (event.data === 'OFFLINE_STATUS') event.ports[0]?.postMessage({ ready: true });
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never cache API responses, account pages or community submissions.
  if (event.request.mode === 'navigate') {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/community')) return;
    event.respondWith(caches.open(CACHE).then(cache => cache.match('/index.html')));
  } else if (FILES.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(url.pathname)) || fetch(event.request)));
  }
});
