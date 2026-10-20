# Acordate

App web para que adultos mayores lleven el control de su medicación de forma simple: botones grandes, mucho contraste, fotos de cada remedio y lectura en voz alta. Pensada para usarse sin tutorial.

> **Estado:** prototipo en desarrollo. Funciona en el navegador y guarda los datos en el dispositivo.

## Qué hace hoy

**Cuentas**
- Al empezar se elige entre **cuenta personal** (la persona que toma la medicación) y **cuenta Referente** (alguien que la acompaña). Esa elección no se cambia después.
- La cuenta personal genera un **código de 6 caracteres**. El referente lo ingresa para vincularse.
- El referente ve "Mis personas" (un círculo por cada persona vinculada) y puede entrar a gestionar su medicación.
- Mientras un referente gestiona a otra persona, una franja fija arriba lo indica ("Viendo a …").

**Medicación**
- Alta de remedio con foto de la caja, nombre, para qué es, médico, clínica, dosis (comprimidos, mg o ml), hora de la primera toma y frecuencia (cada 4, 6, 8, 12 horas o una vez al día).
- La app calcula sola los horarios del día a partir de la primera toma y la frecuencia.
- **Mi medicación de hoy**: lista por horario con la foto de cada remedio, botón "Ya tomé" (se reinicia cada día) y lectura en voz alta.
- Listados **Estoy tomando** y **Ya no tomo**, con fecha de inicio y fin y el motivo.
- **Hoy tengo médico**: resumen para mostrar en consulta, con opción de copiarlo. Desde ahí se pueden editar dosis y frecuencia o dejar de tomar un remedio.
- **Registro de decisiones**: cada cambio queda con quién lo decidió (la persona, el médico con su clínica, o el referente) y el motivo.

**Otros**
- **Necesito ayuda**: llama al contacto de emergencia y, si hay referentes vinculados, también ofrece llamarlos.
- Franja fija con día y hora ("Hoy es lunes 19 de octubre, 9:41 de la noche").
- Accesibilidad: etiquetas asociadas a los campos, encabezados por pantalla, botones que anuncian su estado y avisos que lee el lector de pantalla.

## Cómo probarla

No necesita instalar nada.

1. Abrí la carpeta en VS Code.
2. Instalá la extensión **Live Server**.
3. Clic derecho sobre `index.html` → **Open with Live Server**.

También se puede abrir `index.html` directamente en el navegador.

Para probar el flujo de vinculación en un mismo dispositivo: creá una cuenta personal, anotá el código, usá **Cambiar de cuenta**, creá una cuenta referente y vinculala con ese código.

## Estructura

```
index.html            Estructura de la página
css/styles.css        Estilos (paleta hueso, verde salvia y terracota)
js/storage-shim.js    Define window.storage sobre localStorage
js/app.js             Pantallas, cuentas, lógica de medicación y eventos
```

## Limitaciones conocidas

- **Los datos viven en un solo navegador y dispositivo** (`localStorage`). Un referente no puede ver a la persona desde otro celular. Para eso hace falta un backend (por ejemplo Firebase o Supabase); todavía no está decidido.
- **No hay alarmas ni notificaciones.** La app muestra qué toca cuando se abre, pero no avisa sola. Eso requeriría una app nativa o notificaciones push.
- Al agregar un remedio no se registra si lo cargó la persona o un referente.
- No se puede editar el nombre, la foto ni la categoría de un remedio ya cargado, solo dosis y frecuencia.
- Las cuentas no tienen contraseña: el prototipo asume un dispositivo de confianza.

## Próximos pasos posibles

- Elegir un backend para vincular cuentas entre dispositivos.
- Aviso por WhatsApp al contacto de emergencia.
- Editar todos los datos de un remedio.
- Registrar quién agregó cada remedio.
