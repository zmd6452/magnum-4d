self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("4d-cache").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./js/data.js",
        "./js/logic.js",
        "./js/analytics.js",
        "./js/app.js"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
