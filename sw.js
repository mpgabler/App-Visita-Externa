// service-worker.js
const CACHE_NAME = 'pwa-notes-v13';

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

// Instalar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Ativar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const request = event.request;

// HTML → Network First
if (request.mode === 'navigate' || request.destination === 'document') {
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clona antes de usar
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, resClone);
        });
        return response; // retorna o original
      })
      .catch(() =>
        caches.match(request).then((resp) => resp || caches.match('./index.html'))
      )
  );
  return;
}

  // JS/CSS/Imagens → Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => null);

      // retorna cache imediatamente, mas atualiza em paralelo
      return cachedResponse || fetchPromise;
    })
  );
});
