/**
 * BM Data — Service Worker
 * Cache-first pour les assets statiques, network-first pour les pages HTML
 */

const CACHE_NAME = 'bmdata-v1';

const STATIC_ASSETS = [
  '/',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/img/logo_192.png',
  '/assets/img/logo_512.png',
  '/manifest.json'
];

/* ─── Install : mise en cache des assets statiques ─── */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(STATIC_ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

/* ─── Activate : suppression des anciens caches ─── */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

/* ─── Fetch : cache-first assets, network-first HTML ─── */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  /* Ignorer les requêtes cross-origin (analytics, fonts externes…) */
  if (url.origin !== self.location.origin) return;

  /* Pages HTML : network-first (contenu toujours frais) */
  if (e.request.destination === 'document' || e.request.headers.get('accept').includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then(function (res) {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
          return res;
        })
        .catch(function () { return caches.match(e.request).then(function (c) { return c || caches.match('/'); }); })
    );
    return;
  }

  /* Assets (CSS, JS, images) : cache-first */
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});
