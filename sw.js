// service-worker.js
const CACHE_NAME = 'pwa-notes-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/estilos/style.css',
  '/js/main.js',
  '/js/database.js',
  '/js/ui.js',
  '/js/state.js',
  '/js/lib/dexie.mjs',
  '/assets/icon.png',
  '/assets/icon-512.png',
  '/assets/favicon-32x32.png',
  '/assets/favicon-16x16.png',
  '/assets/favicon.ico',
  '/manifest.json'
];

// Instalar o Service Worker e cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ativar o Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});