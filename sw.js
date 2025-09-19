// service-worker.js
const CACHE_NAME = 'pwa-notes-v6';
const urlsToCache = [
  'App-Visita-Externa/',
  'App-Visita-Externa/index.html',
  'App-Visita-Externa/tela_cadastro.html',
  'App-Visita-Externa/tela_busca.html',
  'App-Visita-Externa/tela_relatorios.html',
  'App-Visita-Externa/tela_relatorio_produtor.html',
  'App-Visita-Externa/tela_relatorio_visita.html',
  'App-Visita-Externa/tela_relatorio_producao.html',
  'App-Visita-Externa/tela_relatorio_economico.html',
  'App-Visita-Externa/tela_relatorio_geografico.html',
  'App-Visita-Externa/tela_relatorio_gerencial.html',
  'App-Visita-Externa/estilos/style_tela_index.css',
  'App-Visita-Externa/estilos/style_tela_cadastro.css',
  'App-Visita-Externa/estilos/style_tela_buscar.css',
  'App-Visita-Externa/estilos/style_tela_relatorios.css',
  'App-Visita-Externa/js/tela_index.js',
  'App-Visita-Externa/js/main.js',
  'App-Visita-Externa/js/database.js',
  'App-Visita-Externa/js/tela_buscar.js',
  'App-Visita-Externa/js/tela_cadastro.js',
  'App-Visita-Externa/js/tela_relatorios.js',
  'App-Visita-Externa/js/lib/dexie.mjs',
  'App-Visita-Externa/assets/icon.png',
  'App-Visita-Externa/assets/icon-512.png',
  'App-Visita-Externa/assets/favicon-32x32.png',
  'App-Visita-Externa/assets/favicon-16x16.png',
  'App-Visita-Externa/assets/favicon.ico',
  'App-Visita-Externa/manifest.json'
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

caches.open(CACHE_NAME).then((cache) => {
  return cache.addAll(urlsToCache).catch((error) => {
    console.error('Erro ao adicionar ao cache:', error);
  });
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});