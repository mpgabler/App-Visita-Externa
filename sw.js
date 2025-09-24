// service-worker.js
const CACHE_NAME = 'pwa-notes-v14';

// Lista de assets estáticos (não inclui HTML)
const urlsToCache = [
  './estilos/style_tela_index.css',
  './estilos/style_tela_cadastro.css',
  './estilos/style_tela_buscar.css',
  './estilos/style_tela_relatorios.css',
  './js/tela_index.js',
  './js/main.js',
  './js/database.js',
  './js/tela_buscar.js',
  './js/tela_cadastro.js',
  './js/tela_relatorios.js',
  './js/lib/dexie.mjs',
  './js/lib/xlsx.full.min.js',
  './assets/icon.png',
  './assets/icon-512.png',
  './assets/favicon-32x32.png',
  './assets/favicon-16x16.png',
  './assets/favicon.ico',
  './assets/gato.png',
  './manifest.json'
];

// Instalação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // HTML → Network First
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Clonar ANTES de usar em mais de um lugar
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse; // retorna a original
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Assets (CSS, JS, imagens) → Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone(); // CLONAR
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => null);

      // entrega o cache primeiro, mas atualiza em paralelo
      return cachedResponse || fetchPromise;
    })
  );
});
// Fim do service-worker.js