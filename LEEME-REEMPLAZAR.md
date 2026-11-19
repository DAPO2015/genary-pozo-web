# Genary Pozo · actualización de tipografía y composición

## Instalar en GitHub Pages

1. Abre tu repositorio en GitHub.
2. Reemplaza todos los archivos y carpetas de este ZIP conservando su estructura (incluida `assets/`). Los archivos HTML van en la raíz.
3. Confirma con **Commit changes**. GitHub Pages publicará la nueva versión.
4. Si ves estilos antiguos, actualiza de nuevo o abre la página en una pestaña privada. El nuevo Service Worker `genary-shell-v5` reemplaza la caché anterior.

## Cambios

- Mayor separación visual y respiración vertical en el encabezado azul de «Mi camino», especialmente sobre «MI CAMINO / TULCÁN» y bajo «Ver mi recorrido».
- Diseño geométrico con monograma cuando se activa «Ahorrar datos» y se oculta la foto de «Mi camino».
- El control indica «¿Conexión limitada?» y diferencia claramente el modo normal del modo ahorro en escritorio y móvil.
- Fuentes abiertas enlazadas desde Google Fonts: Anton (titulares), Qwigley (firma manuscrita «Soy»), Cormorant Garamond (acentos editoriales), Manrope (lectura). Así pueden mantenerse consistentes entre plataformas siempre que se carguen los recursos; en modo ahorro se mantienen las mismas fuentes.
- Se conserva la fotografía y el logotipo originales; no se ha cambiado el contenido del archivo maestro.

## Fuentes y licencias

Las fuentes enlazadas están publicadas bajo licencias abiertas en Google Fonts. Se cargan desde su CDN, sin copiar ni distribuir binarios en este ZIP. Los primeros accesos necesitan conexión; con internet desconectado y sin caché, el navegador utiliza fuentes de reserva.

Ferron se mantiene en las imágenes oficiales del proyecto, pero **no se incrusta** en la web: el paquete de origen indica uso comercial limitado, mientras que la distribución como webfont requiere comprobar una autorización independiente. Chopin-Trial y Retro Signature tampoco se redistribuyen porque sus paquetes indican uso personal.

## Qué no se debe subir

- `archivo-maestro.json`: es privado.
- `PLAN DE TRABAJO 1.png` ni la pieza del plan de trabajo como archivo público.

`datos-publicos.json` está incluido y no se alteró su contenido. El archivo maestro se conserva sin cambios en las fuentes privadas del proyecto.
