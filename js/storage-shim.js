/* ---------------------------------------------------------------
   storage-shim.js

   app.js guarda todo con window.storage.get/set(clave, valor, compartido),
   una API que solo existe dentro del entorno de Claude. Fuera de ahí
   (VS Code, Live Server, un hosting) window.storage no existe, y como
   app.js envuelve esas llamadas en try/catch, la app no avisa nada:
   simplemente no guarda.

   Este archivo define window.storage usando localStorage del navegador
   (que es estándar), pero SOLO si todavía no existe una implementación.
   Se carga en index.html antes de app.js.

   Limitación: localStorage guarda los datos en ese navegador y ese
   dispositivo. No se comparten entre celulares.
------------------------------------------------------------------ */
(function () {
  if (window.storage) return;

  function claveCompleta(clave, compartido) {
    return (compartido ? 'acordate:shared:' : 'acordate:local:') + clave;
  }

  window.storage = {
    async get(clave, compartido) {
      const raw = localStorage.getItem(claveCompleta(clave, compartido));
      if (raw === null) throw new Error('storage: clave no encontrada: ' + clave);
      return { key: clave, value: raw, shared: !!compartido };
    },
    async set(clave, valor, compartido) {
      localStorage.setItem(claveCompleta(clave, compartido), valor);
      return { key: clave, value: valor, shared: !!compartido };
    },
    async delete(clave, compartido) {
      const k = claveCompleta(clave, compartido);
      const existia = localStorage.getItem(k) !== null;
      localStorage.removeItem(k);
      return { key: clave, deleted: existia, shared: !!compartido };
    },
    async list(prefijo, compartido) {
      const base = compartido ? 'acordate:shared:' : 'acordate:local:';
      const completo = base + (prefijo || '');
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(completo)) keys.push(k.slice(base.length));
      }
      return { keys, prefix: prefijo, shared: !!compartido };
    }
  };
})();
