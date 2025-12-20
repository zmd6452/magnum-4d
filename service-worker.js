const CORE_CACHE = 'core-v2';
const DATA_CACHE = 'data-v2';

// ✅ USE SHEET INDEX (stable)
const API_URL = 'https://opensheet.elk.sh/16NJ3an81qlkX7HWcLOXnxQc-x4GXvpk_KbHXgVEVSn0/1';

const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* ========== INSTALL ========== */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));

      const cache = await caches.open(CORE_CACHE);
      await cache.addAll(CORE_FILES);
    })()
  );
  self.skipWaiting();
});

/* ========== ACTIVATE ========== */
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

/* ========== FETCH ========== */
self.addEventListener('fetch', event => {
  const req = event.request;

  // 🔹 API: network-first, cache fallback
  if (req.url.startsWith(API_URL)) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const clone = res.clone();
          const cache = await caches.open(DATA_CACHE);
          await cache.put(req, clone);
          return res;
        } catch {
          const cache = await caches.open(DATA_CACHE);
          return cache.match(req);
        }
      })()
    );
    return;
  }

  // 🔹 HTML
  if (req.destination === 'document') {
    event.respondWith(
      caches.match('./index.html').then(r => r || fetch(req))
    );
    return;
  }

  // 🔹 Assets
  event.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );
});

/* ========== BACKGROUND SYNC ========== */
self.addEventListener('sync', event => {
  if (event.tag === 'refresh-4d') {
    event.waitUntil(refreshData());
  }
});

async function refreshData() {
  const res = await fetch(API_URL);
  const cache = await caches.open(DATA_CACHE);
  await cache.put(API_URL, res.clone());
}
