# Genary Pozo — web completa para GitHub Pages

## Publicar o reemplazar la web

1. Descomprime el ZIP y sube **todo su contenido** a la raíz del repositorio público. No subas el ZIP mismo.
2. Verifica que `index.html`, las otras cinco páginas, `styles.css`, `app.js`, `sw.js`, `datos-publicos.json` y la carpeta `assets` estén presentes.
3. Para Ferron, sube de tu copia autorizada el archivo **`Ferron-ExtraExpanded.otf`** a `assets/fonts/`. No está incluido en este paquete.
4. Mantén GitHub Pages configurado en `main` y `/(root)`. Confirma los cambios y abre el sitio en una pestaña privada para evitar el caché anterior.

## Detalles de esta entrega

- Se recupera la mezcla de Ferron con Cormorant Garamond en los titulares.
- Se aumenta la escritura manuscrita de «Soy» y se reduce su altura tipográfica.
- La edición gratuita de Ferron carece de acentos y Ñ: el sitio conserva la letra Ferron y dibuja el signo diacrítico mediante CSS, manteniendo el carácter original para lectores de pantalla.
- «Mi camino» mantiene el mismo fondo azul, círculo crema y trazo de contorno tanto con foto como en modo ahorro; ya no cambia de fondo al activar el ahorro.
- El botón de ahorro centra sus dos líneas, cambia a «Ahorro activado / Mostrar fotos» y conserva anchura/altura entre estados.
- La caché se renueva con la versión interna `genary-shell-v9`.

El **archivo maestro privado no se sube a GitHub**. Esta entrega no cambia las propuestas, cifras, fuentes ni registros del `datos-publicos.json`.


### Ajustes de diseño

- El retrato naranja y el de «Mi camino» usan una misma composición de círculo crema y arco azul; el fondo permanece al activar ahorro de datos.
- «Soy» usa el naranja de la identidad; se redujo la distancia entre GENARY y POZO.
- Los tramos en cursiva de Cormorant conservan todas sus tildes; en Ferron las marcas están contenidas en cada palabra y se ajustaron verticalmente.
- El contenido, los IDs y los datos públicos son idénticos a la versión anterior.
