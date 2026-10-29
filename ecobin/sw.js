/**
 * EcoBin Progressive Web App (PWA) Service Worker
 * Offline static caching, network-first fallback & background sync trigger
 */

const CACHE_NAME = 'ecobin-pwa-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/styles/tokens.css',
  './src/styles/main.css',
  './src/styles/components.css',
  './src/main.js',
  './src/router.js',
  './src/config.js',
  './src/store.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll skipped for some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation & static assets: cache-first with network fallback
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (!res || res.status !== 200 || res.type !== 'basic') {
            return res;
          }
          const toCache = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, toCache);
          });
          return res;
        }).catch(() => {
          // If offline and request is an HTML navigation, serve cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
  }
});

// Background sync support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-reports') {
    console.log('[SW] Background sync triggered for queued waste reports');
  }
});
