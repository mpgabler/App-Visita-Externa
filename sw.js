// service-worker.js
const urlsToCache = [
  '/App-Visita-Externa/',
  '/App-Visita-Externa/index.html',
  '/App-Visita-Externa/tela_cadastro.html',
  '/App-Visita-Externa/tela_busca.html',
  '/App-Visita-Externa/tela_relatorios.html',
  '/App-Visita-Externa/estilos/style_tela_index.css',
  '/App-Visita-Externa/estilos/style_tela_cadastro.css',
  '/App-Visita-Externa/estilos/style_tela_buscar.css',
  '/App-Visita-Externa/estilos/style_tela_relatorios.css',
  '/App-Visita-Externa/js/tela_index.js',
  '/App-Visita-Externa/js/main.js',
  '/App-Visita-Externa/js/database.js',
  '/App-Visita-Externa/js/tela_buscar.js',
  '/App-Visita-Externa/js/tela_cadastro.js',
  '/App-Visita-Externa/js/tela_relatorios.js',
  '/App-Visita-Externa/js/lib/dexie.mjs',
  '/App-Visita-Externa/assets/icon.png',
  '/App-Visita-Externa/assets/icon-512.png',
  '/App-Visita-Externa/assets/favicon-32x32.png',
  '/App-Visita-Externa/assets/favicon-16x16.png',
  '/App-Visita-Externa/assets/favicon.ico',
  '/App-Visita-Externa/manifest.json'
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