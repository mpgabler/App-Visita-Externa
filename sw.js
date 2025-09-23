// service-worker.js
const CACHE_NAME = 'pwa-notes-v11'; // Atualize a versão para forçar atualização do cache

// Lista de arquivos para cache estático
const urlsToCache = [
  './',
  './index.html',
  './tela_cadastro.html',
  './tela_busca.html',
  './tela_relatorios.html',
  './tela_relatorio_produtor.html',
  './tela_relatorio_visita.html',
  './tela_relatorio_producao.html',
  './tela_relatorio_economico.html',
  './tela_relatorio_geografico.html',
  './tela_relatorio_gerencial.html',
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

// Instalar o Service Worker e cachear os arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).catch((err) => {
      console.error('Falha ao cachear durante instalação:', err);
    })
  );
  self.skipWaiting();
});

// Ativar e limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requisições (Cache First + Fallback)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se já existe no cache → retorna
      if (response) return response;

      // Se não, busca online e armazena no cache dinâmico
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }

        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });

        return res;
      });
    }).catch(() => {
      // Fallback se offline e recurso não existe no cache
      return caches.match('./index.html');
    })
  );
});
// Fim do service-worker.js