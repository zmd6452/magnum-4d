const CACHE_NAME = 'malaysia-4d-v3';
const CORE_CACHE = 'core-v1';

// ✅ USE SHEET INDEX, NOT NAME
const API_URL = 'https://opensheet.elk.sh/16NJ3an81qlkX7HWcLOXnxQc-x4GXvpk_KbHXgVEVSn0/1';

const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* ================= INSTALL ================= */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      // Clean old caches
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => {
          if (![CACHE_NAME, CORE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      );

      // Cache core files
      const cache = await caches.open(CORE_CACHE);
      await cache.addAll(CORE_FILES);
    })()
  );

  self.skipWaiting();
});

/* ================= ACTIVATE ================= */
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

/* ================= FETCH ================= */
self.addEventListener('fetch', event => {
  const { request } = event;

  // 🔹 API: Network-first with cache fallback
  if (request.url.startsWith(API_URL)) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
          return response;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(request);
        }
      })()
    );
    return;
  }

  // 🔹 HTML: cache-first with network fallback
  if (request.destination === 'document') {
    event.respondWith(
      caches.match('./index.html').then(res => res || fetch(request))
    );
    return;
  }

  // 🔹 Other assets
  event.respondWith(
    caches.match(request).then(res => res || fetch(request))
  );
});
