// service-worker.js
const CACHE_NAME = 'pwa-notes-v6';
const urlsToCache = [
  '/',
  'index.html',
  'tela_cadastro.html',
  'tela_busca.html',
  'tela_relatorios.html',
  'tela_relatorio_produtor.html',
  'tela_relatorio_visita.html',
  'tela_relatorio_producao.html',
  'tela_relatorio_economico.html',
  'tela_relatorio_geografico.html',
  'tela_relatorio_gerencial.html',
  'estilos/style_tela_index.css',
  'estilos/style_tela_cadastro.css',
  'estilos/style_tela_buscar.css',
  'estilos/style_tela_relatorios.css',
  'js/tela_index.js',
  'js/main.js',
  'js/database.js',
  'js/tela_buscar.js',
  'js/tela_cadastro.js',
  'js/tela_relatorios.js',
  'js/lib/dexie.mjs',
  'assets/icon.png',
  'assets/icon-512.png',
  'assets/favicon-32x32.png',
  'assets/favicon-16x16.png',
  'assets/favicon.ico',
  'manifest.json'
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

// Ativar o Service Worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});