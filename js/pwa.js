/* Registra el service worker (lo que permite instalar la app y usarla sin internet).
   Solo funciona con https:// o con localhost; con file:// no se registra y no pasa nada. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((error) => {
      console.warn('Acordate: no se pudo registrar el service worker', error);
    });
  });
}
