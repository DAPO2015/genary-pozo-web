# Web de Genary Pozo — paquete completo para GitHub Pages

## Publicar desde cero

1. Crea o abre el repositorio de GitHub Pages.
2. Descomprime este ZIP y sube **todo su contenido**, no el ZIP. `index.html` debe quedar en la raíz.
3. Conserva `assets/`, incluyendo las fotografías, logos e imágenes comprimidas.
4. Sube desde tu copia autorizada de `ferron.zip` el archivo **`Ferron-ExtraExpanded.otf`** dentro de `assets/fonts/` para activar Ferron en todos los titulares. El archivo de fuente no viene incluido en este paquete.
5. En Settings → Pages, selecciona la rama `main` y `/(root)`. Confirma los cambios.
6. Tras publicar, prueba en una pestaña privada; el caché anterior se reemplaza con `genary-shell-v7`.

## Qué se corrigió

- Portada: la fotografía, el fondo azul y la banda naranja comparten una misma anchura hasta el borde derecho del navegador.
- Titulares: Ferron original en la totalidad de los títulos, tanto en texto crema como naranja. Separación de letras moderada (`.012em`, con ajustes móviles).
- Ahorro de datos: la pregunta y la acción están dentro de **un único botón** de 52 px de alto y ancho fijo; el cambio de estado no modifica sus dimensiones.
- Conserva la presentación y las fotografías de «Mi camino» corregidas en la entrega anterior.

**No incluyas archivos privados** (`archivo-maestro.json`, transcripciones, fotografía del plan original) en GitHub. Esta carpeta contiene solo `datos-publicos.json`, que es el extracto publicable.
