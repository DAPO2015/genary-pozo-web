# Genary Pozo · Web completa con preguntas y redes (v11)

Este ZIP contiene únicamente la web pública: 7 páginas HTML, `app.js`, `styles.css`, `sw.js`, imágenes, `datos-publicos.json` y `config-publico.json`. **No contiene el archivo maestro privado**.

## Subir a GitHub Pages
1. Descomprime el ZIP. En GitHub carga los archivos y la carpeta `assets` en la raíz del repositorio (con `index.html` en la raíz).
2. Si ya tenías `assets/fonts/Ferron-ExtraExpanded.otf`, consérvalo. Si recreas el repositorio, sube tu copia autorizada de esa fuente a `assets/fonts/`.
3. Comprueba que Pages use `main` y `/(root)`; espera al despliegue. Prueba navegación y comparte una ficha de `detalle.html?id=reg-0016`.

## Activar el formulario de Tally (sin servidor)
1. Crea una cuenta gratuita en https://tally.so y un formulario con **Nombre o apodo**, **Tu pregunta** y los consentimientos (ver guía de configuración aparte). Activa avisos de nuevas respuestas si los quieres.
2. Publica el formulario. Copia su **enlace público** con forma `https://tally.so/r/ABC123` (no el enlace de edición).
3. En GitHub abre `config-publico.json` y cambia **solo** estos campos:

```json
{ "formulario_preguntas": { "habilitado": true, "url_tally": "https://tally.so/r/ABC123" } }
```

4. Sustituye `ABC123` por el ID real y pulsa **Commit changes**. La página `preguntas.html` mostrará el formulario de Tally; en ahorro de datos ofrecerá abrirlo directamente para evitar el iframe.
5. **Sin enlace de Tally o con `habilitado:false` el botón de envío no funciona y así se informa en pantalla. No se guarda ni se envía una pregunta falsa.**

## Preguntas contestadas y aprobadas
- Los envíos llegan a la cuenta privada de Tally. No se publican automáticamente.
- Extrae las preguntas seleccionadas, retira datos personales no autorizados, pide a Genary su respuesta y actualiza el **archivo maestro privado** con un registro `respuesta_ciudadana` revisado.
- Publica únicamente el nuevo `datos-publicos.json` **generado desde el maestro**. La sección de respuestas aparecerá sin tocar HTML/JS.

## Compartir y redes
- Redes: Instagram, Facebook y TikTok aparecen en los pies de página.
- Las fichas tienen botón Compartir. En móviles compatibles se usa el menú del sistema; como alternativa: WhatsApp, Facebook o copiar enlace.
- El enlace compartido apunta a la ficha `detalle.html?id=reg-XXXX`. La vista previa en algunas redes puede mostrar la imagen general de la web porque GitHub Pages no genera metadatos individuales para URLs con parámetros.

## Privacidad y rendimiento
Tally solo se carga en `preguntas.html` cuando el formulario está activado. No pongas contraseñas, claves ni envíos recibidos dentro de `config-publico.json` o del repositorio público. Revisa la información de privacidad, accesibilidad y permisos antes de abrir la recepción de preguntas.
