# Acordate

App web para que adultos mayores lleven el control de su medicación de forma simple: botones grandes, mucho contraste, fotos de cada remedio y lectura en voz alta. Pensada para usarse sin tutorial.

> **Estado:** prototipo en desarrollo para un piloto cerrado. Es una **PWA** (se instala desde el navegador). Los datos se guardan en la nube con **Supabase**, así que se pueden ver desde más de un celular. Sin internet se puede abrir y *mirar* lo último que se vio, pero no cambiar nada.

## Qué hace hoy

**Cuentas**
- Se crean con **mail y contraseña** (puede ser el mail de quien ayuda a crear la cuenta). Después la sesión **queda abierta en el celular** hasta que la persona toque "Cerrar sesión".
- Al empezar se elige entre **cuenta personal** (la persona que toma la medicación) y **cuenta Referente** (alguien que la acompaña).
- Al crear la cuenta se acepta que los datos de salud se guardan en la nube (queda registrada la fecha).
- La cuenta personal tiene un **código de 6 caracteres**. El referente lo ingresa y genera una **solicitud**: la persona la ve en su inicio y decide si **acepta o no**. Puede **dejar de compartir** cuando quiera, desde "Mis datos".
- El referente ve "Mis personas" (solo las que aceptaron) y entra a gestionar su medicación. Una franja fija arriba indica "Viendo a …".
- Hay pantalla para recuperar la contraseña por mail.

**Medicación**
- Alta de remedio con foto de la caja (se achica antes de guardar), nombre, para qué es, médico, clínica, dosis (comprimidos, mg, ml, UI, mcg o gotas), hora de la primera toma y frecuencia (cada 4, 6, 8, 12 horas o una vez al día).
- La app calcula sola los horarios del día a partir de la primera toma y la frecuencia.
- **Mi medicación de hoy**: lista por horario con la foto de cada remedio, botón "Ya tomé" (se reinicia cada día) y lectura en voz alta.
- Listados **Estoy tomando** y **Ya no tomo**, con fecha de inicio y fin y el motivo.
- **Hoy tengo médico**: resumen para mostrar en consulta, con opción de copiarlo. Desde ahí se pueden editar dosis y frecuencia o dejar de tomar un remedio.
- **Registro de decisiones**: cada alta, cambio, baja y reactivación queda en un historial que solo se agrega (no se edita ni se borra) con quién lo hizo (la persona, el médico con su clínica, o el referente) y el motivo. También queda quién cargó cada remedio.

**Otros**
- **Necesito ayuda**: llama al contacto de emergencia y, si hay referentes vinculados, también ofrece llamarlos.
- Franja fija con día y hora ("Hoy es lunes 19 de octubre, 9:41 de la noche").
- **Validación:** nombre solo con letras, celular argentino de 10 cifras (acepta 0, 15 y +54), cantidad de dosis numérica, código de 6 caracteres y motivos con un mínimo. El campo con error se marca y recibe el foco.
- Accesibilidad: zoom habilitado, colores con contraste mínimo 4,5:1, etiquetas asociadas a los campos, encabezados por pantalla, botones que anuncian su estado y avisos que lee el lector de pantalla.

## Cómo probarla

**En vivo:** https://maiaajr.github.io/probando-acordateapp/ (se actualiza solo unos minutos después de cada cambio en `main`).

En la computadora también se puede abrir la carpeta en VS Code con **Live Server**. Siempre hace falta internet, porque los datos están en Supabase.

Para probar la vinculación hacen falta dos cuentas con mails distintos: una personal y una referente. Lo más fácil es usar dos navegadores (o uno normal y uno privado), o dos celulares.

## Configurar Supabase (una sola vez)

1. Crear un proyecto en supabase.com.
2. **SQL Editor → New query**: pegar `supabase/schema.sql` y apretar **Run**. Se puede volver a correr sin romper nada.
3. **Authentication → URL Configuration**: en *Site URL* poner la dirección de la app (la de GitHub Pages) y agregarla también en *Redirect URLs*. Sin esto, los enlaces de los mails (confirmar cuenta, cambiar contraseña) no llevan a la app.
4. Opcional para el piloto: **Authentication → Sign In / Providers → Email**, desactivar *Confirm email*. Así la gente entra apenas se registra. La app funciona con la confirmación activada o desactivada.
5. Poner la *Project URL* y la clave *anon public* en `js/config.js`. La clave `anon` es pública por diseño. **Nunca** poner la `service_role`.

La seguridad no depende del código de la app: las reglas (RLS) están en la base de datos. Cada persona ve solo lo suyo, y un referente solo ve a quien le aceptó el vínculo.

## Instalarla como app (PWA)

Hace falta publicarla con **https** (por ejemplo con GitHub Pages). Después, desde el celular:

- **Android (Chrome):** menú ⋮ → *Instalar app* / *Agregar a la pantalla principal*.
- **iPhone (Safari):** botón Compartir → *Agregar a inicio*.

Con `localhost` (Live Server) también registra el service worker, así se puede probar en la computadora.

**Al cambiar archivos de la app, subí el número `VERSION` en `sw.js`.** Así los celulares descartan la copia vieja y bajan la nueva.

## Estructura

```
index.html              Estructura de la página
manifest.webmanifest    Datos de la app instalable (nombre, colores, íconos)
sw.js                   Service worker: abrir sin internet y recibir actualizaciones
icons/                  Íconos de la app
css/styles.css          Estilos (paleta hueso, verde salvia y terracota)
js/config.js            Dirección y clave pública de Supabase
js/nube.js              Todo lo que habla con Supabase (cuentas, datos, vínculos)
js/vendor/supabase.js   Biblioteca de Supabase (copia local, para que funcione sin depender de otro sitio)
supabase/schema.sql     Tablas y reglas de seguridad de la base de datos
js/app.js               Pantallas, cuentas, lógica de medicación y eventos
js/pwa.js               Registra el service worker
```

## Limitaciones conocidas

- **No hay alarmas ni notificaciones.** La app muestra qué toca cuando se abre, pero no avisa sola. Plan: notificaciones push de la PWA (con el servidor) y aviso al referente si no se marcó "Ya tomé". En iPhone solo funcionan con la app instalada y no son exactas.
- **Sin internet solo se puede mirar** lo último que se vio. Las fotos no se ven sin internet.
- Los textos legales (privacidad, consentimiento) son provisorios y **hay que revisarlos con un/a abogado/a** antes de abrir el piloto: son datos de salud (Ley 25.326, registro ante la AAIP).
- Al editar un remedio ya cargado solo se cambian dosis y frecuencia, no el nombre, la foto ni la categoría.

## Próximos pasos posibles

- Notificaciones push y aviso al referente.
- Pantalla de historial de decisiones y de tomas.
- "Qué toca ahora" / toma atrasada.
- Editar todos los datos de un remedio.
- Aviso por WhatsApp al contacto de emergencia.
