const CACHE_NAME = 'malaysia-4d-v2';
const OFFLINE_CACHE = '4d-offline-v1';

// Core app files for initial cache
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Runtime caching for API responses
const API_URL = 'https://opensheet.elk.sh/16NJ3an81qlkX7HWcLOXnxQc-x4GXvpk_KbHXgVEVSn0/Responses';

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Delete old caches
  self.caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
          return caches.delete(cacheName);
        }
      })
    );
  });
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core files');
        return cache.addAll(CORE_FILES);
      })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then(cache => {
      // Cache a fallback offline page
      return cache.addAll([
        './index.html'
      ]);
    })
  );
  
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Cache API responses
  if (requestUrl.origin === location.origin || requestUrl.href.includes(API_URL)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request)
          .then(cachedResponse => {
            // Return cached data if available (stale-while-revalidate)
            if (cachedResponse) {
              // Update cache in background
              fetch(event.request)
                .then(fetchResponse => {
                  cache.put(event.request, fetchResponse.clone());
                })
                .catch(() => {
                  // Network failed but we have cached data
                });
              return cachedResponse;
            }
            
            // No cache, fetch from network
            return fetch(event.request).then(fetchResponse => {
              // Cache successful response
              if (fetchResponse && fetchResponse.status === 200) {
                cache.put(event.request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          });
      })
    );
  } else {
    // Default cache-first strategy for other requests
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          return response || fetch(event.request).catch(() => {
            // Network failed - return offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
        })
    );
  }
});

// Background sync for data refresh (optional)
self.addEventListener('sync', event => {
  if (event.tag === 'refresh-4d-data') {
    event.waitUntil(refreshData());
  }
});

async function refreshData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // Update cache with fresh data
    const cache = await caches.open(CACHE_NAME);
    await cache.put(API_URL, response.clone());
    
    console.log('Background sync: Data refreshed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
