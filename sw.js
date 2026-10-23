/* ---------------------------------------------------------------
   sw.js — service worker de Acordate

   Qué hace:
   - Guarda los archivos de la app para que abra aunque no haya internet.
   - Para los archivos propios usa "red primero": si hay internet baja la
     versión nueva, y si no, usa la guardada. Así una actualización
     llega sola, sin que nadie tenga que borrar nada.
   - Para las fuentes de Google usa "guardada primero y actualiza detrás":
     la primera vez hace falta internet; después se ven sin conexión.

   IMPORTANTE: cuando cambies un archivo de la app, subí el número de
   VERSION. Eso hace que los celulares descarten la copia vieja.
------------------------------------------------------------------ */
const VERSION = 'v4';
const CACHE_APP = 'acordate-app-' + VERSION;
const CACHE_FUENTES = 'acordate-fuentes';

const ARCHIVOS_APP = [
  './',
  'index.html',
  'css/styles.css',
  'js/vendor/supabase.js',
  'js/config.js',
  'js/nube.js',
  'js/app.js',
  'js/pwa.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_APP).then((cache) => cache.addAll(ARCHIVOS_APP))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nombres) => Promise.all(
        nombres
          .filter((n) => n.startsWith('acordate-app-') && n !== CACHE_APP)
          .map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

function esFuente(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request;
  if (pedido.method !== 'GET') return;
  const url = new URL(pedido.url);

  // Fuentes: guardada primero, y se refresca por detrás.
  if (esFuente(url)) {
    evento.respondWith(
      caches.open(CACHE_FUENTES).then(async (cache) => {
        const guardada = await cache.match(pedido);
        const desdeRed = fetch(pedido)
          .then((resp) => { if (resp && resp.ok) cache.put(pedido, resp.clone()); return resp; })
          .catch(() => guardada || Response.error());
        return guardada || desdeRed;
      })
    );
    return;
  }

  // Solo manejamos lo que es de nuestro propio sitio.
  if (url.origin !== self.location.origin) return;

  // Archivos propios: red primero, con respaldo en lo guardado.
  evento.respondWith(
    fetch(pedido)
      .then((resp) => {
        if (resp && resp.ok) {
          const copia = resp.clone();
          caches.open(CACHE_APP).then((cache) => cache.put(pedido, copia));
        }
        return resp;
      })
      .catch(async () => {
        const guardada = await caches.match(pedido);
        if (guardada) return guardada;
        if (pedido.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      })
  );
});
