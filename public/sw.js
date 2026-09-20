const CACHE_NAME = 'bloqescolar-cache-v2';

// Activación inmediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación: limpia todas las caches viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-First: Siempre intenta buscar la versión más fresca de la red
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
