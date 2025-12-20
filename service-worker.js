const CACHE_NAME = 'malaysia-4d-v3';
const OFFLINE_CACHE = '4d-offline-v1';

// Core files to cache
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Fetch handler
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // If fetching Google Sheet API
  if (requestUrl.href.includes('opensheet.elk.sh')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => 
        fetch(event.request)
          .then(response => {
            if (response.status === 200) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
    return;
  }

  // If fetching a local uploaded CSV
  if (requestUrl.pathname.endsWith('.csv')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        fetch(event.request)
          .then(response => {
            if (response.status === 200) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
    return;
  }

  // Default cache-first strategy
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request).catch(() => {
      if (event.request.destination === 'document') return caches.match('./index.html');
    }))
  );
});

// Background sync (optional)
self.addEventListener('sync', event => {
  if (event.tag === 'refresh-4d-data') {
    event.waitUntil(refreshData());
  }
});

async function refreshData() {
  try {
    const response = await fetch('https://opensheet.elk.sh/16NJ3an81qlkX7HWcLOXnxQc-x4GXvpk_KbHXgVEVSn0/1');
    const data = await response.json();
    const cache = await caches.open(CACHE_NAME);
    await cache.put('https://opensheet.elk.sh/16NJ3an81qlkX7HWcLOXnxQc-x4GXvpk_KbHXgVEVSn0/1', response.clone());
    console.log('Background sync: Data refreshed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
