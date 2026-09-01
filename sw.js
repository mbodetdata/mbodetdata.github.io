/**
 * BM Data — Service Worker
 * Cache-first pour les assets statiques, network-first pour les pages HTML
 */

/* Incrémenter à chaque changement de stratégie : l'ancien cache est purgé à l'activation. */
const CACHE_NAME = 'bmdata-v2';

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

/* ─── Fetch ───
 * network-first : HTML, CSS et JS.
 *   Le CSS et le JS doivent impérativement suivre le HTML livré : en cache-first,
 *   une feuille de style périmée reste servie indéfiniment face à un HTML frais,
 *   ce qui casse la mise en page (et laisse les blocs .fade-up invisibles, car
 *   c'est main.js qui leur pose la classe .visible).
 * cache-first : images, polices, manifest — versionnés par leur nom de fichier
 *   et sans couplage au HTML.
 */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  /* Ignorer les requêtes cross-origin (analytics, fonts externes…) */
  if (url.origin !== self.location.origin) return;

  var accept = e.request.headers.get('accept') || '';
  var dest   = e.request.destination;

  var isDocument = dest === 'document' || accept.indexOf('text/html') !== -1;
  var isCode     = dest === 'style' || dest === 'script' || /\.(css|js)$/i.test(url.pathname);

  if (isDocument || isCode) {
    e.respondWith(
      fetch(e.request)
        .then(function (res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
          }
          return res;
        })
        .catch(function () {
          /* Hors ligne : on retombe sur le cache, et sur l'accueil pour une page */
          return caches.match(e.request).then(function (c) {
            if (c) return c;
            return isDocument ? caches.match('/') : Response.error();
          });
        })
    );
    return;
  }

  /* Images, polices, manifest : cache-first */
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
