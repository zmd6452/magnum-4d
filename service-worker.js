const CACHE='4d-v1';
const API='https://opensheet.elk.sh/16NJ3an81qlkX7HWcLOXnxQc-x4GXvpk_KbHXgVEVSn0/1';

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])));
 self.skipWaiting();
});

self.addEventListener('fetch',e=>{
 if(e.request.url.startsWith(API)){
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
