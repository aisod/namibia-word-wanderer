const CACHE = 'namqula-offline-__VERSION__';
const FILES = __FILES__;
let preparing;
function prepareOffline() {
  if (preparing) return preparing;
  preparing = (async () => {
    try {
      const cache = await caches.open(CACHE);
      await cache.addAll(FILES.map(url => new Request(url, { cache: 'reload' })));
      return true;
    } catch {
      await caches.delete(CACHE);
      return false;
    } finally { preparing = undefined; }
  })();
  return preparing;
}
async function ready() { return !!(await (await caches.open(CACHE)).match('/index.html')); }
self.addEventListener('install', event => {
  // Activate immediately: slow offline downloads must never hold an update hostage.
  // The app requests PREPARE_OFFLINE once this worker controls the page.
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (await ready()) {
      const previous = (await caches.keys()).filter(key => key.startsWith('namqula-offline-') && key !== CACHE);
      // Retain previous hashed chunks for games already open in another tab.
      for (const key of previous.slice(0, -2)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'ACTIVATE_UPDATE') { event.waitUntil(self.skipWaiting()); return; }
  if (event.data === 'OFFLINE_STATUS' || event.data === 'PREPARE_OFFLINE') {
    event.waitUntil((async () => {
      const saved = event.data === 'PREPARE_OFFLINE' ? await prepareOffline() : await ready();
      event.ports[0]?.postMessage({ ready: saved });
    })());
  }
});
async function cached(path) {
  const previous = (await caches.keys()).filter(key => key.startsWith('namqula-offline-') && key !== CACHE).reverse();
  for (const key of [CACHE, ...previous]) {
    const response = await (await caches.open(key)).match(path);
    if (response) return response;
  }
}
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never cache API responses, account pages or community submissions.
  if (event.request.mode === 'navigate') {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/community')) return;
    event.respondWith((async () => {
      if (await ready()) return (await caches.open(CACHE)).match('/index.html');
      try { return await fetch(event.request, { cache: 'reload' }); }
      catch (error) { const fallback = await cached('/index.html'); if (fallback) return fallback; throw error; }
    })());
  } else if (FILES.includes(url.pathname) || url.pathname.startsWith('/assets/')) {
    event.respondWith((async () => {
      const current = await (await caches.open(CACHE)).match(url.pathname);
      if (current) return current;
      if (url.pathname.startsWith('/assets/')) {
        const previousChunk = await cached(url.pathname);
        if (previousChunk) return previousChunk;
      }
      // Unversioned packs must prefer the current server over an old offline copy.
      try { return await fetch(event.request, { cache: 'reload' }); }
      catch (error) { const fallback = await cached(url.pathname); if (fallback) return fallback; throw error; }
    })());
  }
});
