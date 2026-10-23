# Acordate

App web para que adultos mayores lleven el control de su medicación de forma simple: botones grandes, mucho contraste, fotos de cada remedio y lectura en voz alta. Pensada para usarse sin tutorial.

> **Estado:** prototipo en desarrollo para un piloto cerrado. Es una **PWA** (se instala desde el navegador). Los datos se guardan en la nube con **Supabase**, así que se pueden ver desde más de un celular. Sin internet se puede abrir y *mirar* lo último que se vio, pero no cambiar nada.

## Qué hace hoy

**Cuentas**
- Se crean con **mail y contraseña** (puede ser el mail de quien ayuda a crear la cuenta). La sesión **queda abierta en el celular** hasta tocar "Cerrar sesión" (botón al final del inicio).
- Hay **dos roles**, que se eligen una sola vez al registrarse: la **persona que toma remedios** y el **referente** que acompaña a alguien. Una cuenta no puede ser las dos cosas.
- Al crear la cuenta se acepta que los datos de salud se guardan en la nube (queda la fecha).
- La persona tiene un **código de 6 caracteres**. El referente lo ingresa y genera una **solicitud**: la persona la ve en su inicio y decide si **acepta o no**. Puede **dejar de compartir** cuando quiera desde "Mis datos".
- El referente ve "Mis personas" (solo las que aceptaron), con cuánto tomó cada una hoy, y entra a gestionar su medicación. Una franja fija indica "Viendo a …".
- Recuperación de contraseña por mail.

**Medicación**
- Alta con foto de la caja (se achica antes de guardar), nombre, para qué es, médico, clínica, dosis, hora de la primera toma y frecuencia. La app calcula los horarios del día.
- **Inicio con "Te toca ahora"**: la toma pendiente más reciente, o la próxima.
- **Tu día**: tomas ordenadas por hora, "Ya tomé" (se reinicia cada día), aviso de las que quedaron sin marcar y lectura en voz alta.
- **Mis remedios**: pestañas "Tomando / Ya no". Cada remedio tiene su **detalle con la historia de decisiones**.
- **Historial** que solo se agrega (no se edita ni se borra): cada alta, cambio, baja y reactivación guarda quién lo hizo (la persona, el médico con su clínica, o el referente) y el motivo. También queda quién cargó cada remedio.
- **Hoy tengo médico**: resumen para mostrar en consulta, copiable. Desde ahí se editan dosis y frecuencia o se da de baja un remedio.

**Otros**
- **Necesito ayuda**: llama al contacto de emergencia y, si hay referentes vinculados, ofrece llamarlos.
- Franja fija con día y hora.
- **Validación**: nombre solo con letras, celular argentino de 10 cifras (acepta 0, 15 y +54), dosis numérica, código de 6 caracteres, motivos con mínimo. El campo con error se marca y recibe el foco.
- **Accesibilidad**: zoom habilitado, contraste mínimo 4,5:1, etiquetas asociadas a los campos, un encabezado por pantalla, botones que anuncian su estado y avisos para lector de pantalla.

## Cómo probarla

**En vivo:** https://maiaajr.github.io/probando-acordateapp/ (se actualiza unos minutos después de cada cambio en `main`).

Siempre hace falta internet, porque los datos están en Supabase. En la computadora también se puede abrir la carpeta con **Live Server** de VS Code.

**Recorrido sugerido** (hacen falta dos mails distintos; sirve usar un navegador normal y otro privado, o dos celulares):
1. Registrarse como **persona**, cargar un remedio y marcar "Ya tomé".
2. En el otro navegador, registrarse como **referente** e ingresar el código de la persona.
3. En la persona, aceptar la solicitud desde el inicio.
4. En el referente, entrar a "Mis personas", cargar un remedio y dar de baja otro con un motivo.
5. En la persona, abrir ese remedio y ver en su historia quién decidió qué.
6. En "Mis datos", dejar de compartir y comprobar que el referente ya no ve a la persona.

### Para que otra persona la pruebe

- **Solo usar la app**: alcanza con el link de arriba y dos mails. Funciona con el proyecto de Supabase que ya está configurado.
- **Trabajar sobre el código con su propio Supabase**: hacer lo de la sección siguiente con su proyecto y cambiar `js/config.js`.

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
css/styles.css          Estilos (sistema "Classical": papel claro, dorado, Cormorant Garamond y Lora)
js/config.js            Dirección y clave pública de Supabase
js/nube.js              Todo lo que habla con Supabase (cuentas, datos, vínculos)
js/vendor/supabase.js   Biblioteca de Supabase (copia local, para que funcione sin depender de otro sitio)
supabase/schema.sql     Tablas y reglas de seguridad de la base de datos
js/app.js               Pantallas, cuentas, lógica de medicación y eventos
js/pwa.js               Registra el service worker
```

## Limitaciones conocidas

- **No hay alarmas ni notificaciones.** La app muestra qué toca cuando se abre, pero no avisa sola. En iPhone las notificaciones solo funcionan con la app instalada y no son exactas.
- **Sin internet solo se puede mirar** lo último que se vio. Las fotos no se ven.
- Los textos legales (privacidad, consentimiento) son provisorios y **hay que revisarlos con un/a abogado/a** antes del piloto: son datos de salud (Ley 25.326, registro ante la AAIP).
- Al editar un remedio ya cargado solo se cambian dosis y frecuencia, no el nombre, la foto ni la categoría.
- El rediseño todavía no se revisó en todas las pantallas: agregar y editar remedio conservan algunos estilos en línea.

## Próximos pasos

1. **Alarmas**: notificaciones push de la PWA, enviadas desde el servidor, y **aviso al referente** si no se marcó "Ya tomé".
2. Revisión legal de los textos y registro de la base de datos.
3. Editar todos los datos de un remedio (nombre, foto, categoría).
4. Pantalla de historial de tomas (no solo de decisiones).
5. Cambiar la contraseña de la base de datos y revisar los permisos antes de abrir el piloto.
6. Aviso por WhatsApp al contacto de emergencia.
