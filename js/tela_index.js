if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/App-Visita-Externa/sw.js')
      .then((reg) => console.log('Service Worker registrado:', reg))
      .catch((err) => console.error('Erro ao registrar Service Worker:', err));
  });
}