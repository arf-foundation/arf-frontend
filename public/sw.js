// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Optional: basic fetch handler (all network, no caching)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
