# Genary Pozo | Web pública (versión inicial)

Sitio web estático, adaptable a móvil y pensado para GitHub Pages. No usa servidor, base de datos, compilación, cuentas, bibliotecas externas ni servicios de pago. Se conecta directamente a `datos-publicos.json` (contrato **genary-datos-publicos 1.x**).

**Estado del contenido, 18 de noviembre de 2026:** el JSON adjunto contiene **cero registros publicados**. La presentación visual y los textos que explican el funcionamiento del archivo **no son propuestas ni declaraciones atribuidas a Genary**. La web no inventa datos para completar espacios.

## 1. Publicar gratis en GitHub Pages, sin terminal

1. Entra a [github.com](https://github.com) y accede a tu cuenta (o crea una).
2. Crea un repositorio nuevo, por ejemplo `genary-pozo-web`. Para usar el servicio gratuito de Pages de una cuenta personal, elige **Public**. No marques la opción de crear un README adicional; el ZIP ya contiene los archivos.
3. Descarga el ZIP entregado en este chat y **descomprímelo** en tu computadora.
4. Abre el repositorio nuevo y elige **Add file → Upload files**. Arrastra el **contenido** de la carpeta extraída, incluido el directorio `assets`, no la carpeta contenedora. Asegúrate de que `index.html` quede en la **raíz del repositorio** (sin subcarpeta anterior). Confirma los cambios con **Commit changes**.
5. En el repositorio, abre **Settings → Pages**. En **Build and deployment**, selecciona **Deploy from a branch**; elige la rama `main` y la carpeta `/(root)` y pulsa **Save**.
6. Abre la dirección mostrada por GitHub Pages. Habitualmente tendrá la forma `https://TU-USUARIO.github.io/genary-pozo-web/`, pero usa el enlace que GitHub muestre en la configuración.

Guía oficial de GitHub: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

**Si la interfaz no acepta una carpeta completa:** crea primero `assets` con un archivo dentro desde el editor web de GitHub y luego sube los recursos a esa carpeta, respetando la estructura indicada abajo.

## 2. Cómo actualizar la información

El archivo maestro **NO está incluido en este ZIP**, porque es privado y podría contener información no aprobada.

Flujo habitual:

1. Mantén el `archivo-maestro.json` vigente en las fuentes **privadas** del proyecto.
2. Entrega a ChatGPT el archivo completo y nuevos materiales de Genary. ChatGPT añade registros en el mismo esquema, marcándolos como borrador o pendiente.
3. Revisa las incorporaciones y **aprueba expresamente** lo publicable.
4. ChatGPT valida y genera un nuevo **`datos-publicos.json`** a partir del maestro aprobado, sin material privado.
5. En GitHub, **sustituye `datos-publicos.json`** por el nuevo archivo y confirma los cambios; GitHub Pages publicará la actualización. No necesitas tocar el código para agregar registros, temas, relaciones o campos compatibles con la versión 1.x.
6. Sustituye también `archivo-maestro.json` en las **fuentes privadas del proyecto**, conserva un respaldo y verifica la web.

**IMPORTANTE:** nunca subas a GitHub `archivo-maestro.json`, transcripciones, notas privadas, el esquema con datos privados ni respaldos. Un repositorio público hace accesibles sus archivos aunque la web no los muestre. `datos-publicos.json` debe generarse con la herramienta de validación, no editarse a mano.

Para actualizar un solo archivo sin terminal: abre `datos-publicos.json` en GitHub, pulsa editar (icono de lápiz), reemplaza el contenido con el JSON validado y confirma; o sube el archivo como reemplazo por el flujo de carga del repositorio. Revisa que el nombre no cambie.

## 3. Recursos gráficos

El ZIP incluye **copias optimizadas para web** de recursos proporcionados en la carpeta Drive del proyecto. Los originales no están incluidos.

| Archivo | Uso | Tamaño aproximado |
|---|---|---:|
| `assets/logo-alcalde.webp` | Marca gráfica en cabecera | 20 KB |
| `assets/logo-centro-democratico.webp` | Logotipo institucional en pie de página | 17 KB |
| `assets/firma-genary.webp` | Firma gráfica decorativa | 13 KB |
| `assets/genary-hero.webp` | Retrato principal | 39 KB |
| `assets/genary-cercano.webp` | Retrato secundario, carga diferida | 45 KB |
| `assets/favicon.png` | Ícono del sitio | 7 KB |

Se usaron fotografías y logos auténticos sin recrearlos. Antes de la publicación pública confirma que tienes **derecho a publicar los retratos, logotipos y firmas**, incluidos créditos o permisos de sus creadores cuando correspondan.

### Tipografías

Se revisaron los paquetes originales de Drive. Sus textos de licencia dicen:

- **Ferron**: versión gratuita de uso comercial limitado; el archivo `readme.txt` restringe su uso a una anchura/peso y a mayúsculas. No se pudo verificar que esa licencia permita incrustar las tipografías en una web de campaña.
- **Chopin-Trial**: licencia `Personal Use Only`.
- **Retro Signature**: licencia de uso personal únicamente.

Por ello la web **no distribuye ni incrusta esos archivos de fuente**. Usa letras del sistema para la interfaz; los logos oficiales y la firma gráfica permanecen como imágenes, respetando su diseño visual. Si se obtienen licencias válidas para web/campaña, podrá integrarse Ferron (idealmente ExtraExpanded) y las demás según la autorización.

## 4. Ahorro de datos y lectura sin conexión

**Sí es viable adaptar la página a conexiones lentas**, pero no existe una detección de velocidad universal y precisa en todos los navegadores. Esta implementación combina:

- CSS y JavaScript locales, sin cargas de terceros;
- fotos WEBP muy comprimidas y secundarias que se descargan cuando entran en pantalla;
- detección orientativa con `navigator.connection.saveData` / `effectiveType` cuando el navegador la permite;
- botón **Ahorro de datos** para desactivar manualmente fotografías decorativas (funciona aunque la detección automática no exista);
- almacenamiento de esa preferencia en el navegador, sin cuenta ni servidor;
- *service worker* que guarda una copia de la interfaz y el JSON visitado para intentar consultar contenido **sin conexión después de una primera visita en línea**. Al volver la conexión, el JSON se consulta primero por red para mostrar los cambios más recientes.

Las imágenes que formen parte de un registro documental aprobado también pueden verse bajo demanda en el modo ahorro de datos. El sitio sigue siendo útil sin descargar todas las imágenes.

La página **no incorpora Google Analytics, cookies publicitarias ni fuentes de servidores externos**.

## 5. Estructura

```text
(index del repositorio)
├── .nojekyll
├── index.html
├── styles.css
├── app.js
├── sw.js
├── datos-publicos.json        ← ÚNICA fuente de contenido público
├── LEEME-PUBLICAR.md
└── assets/
    ├── favicon.png
    ├── logo-alcalde.webp
    ├── logo-centro-democratico.webp
    ├── firma-genary.webp
    ├── genary-hero.webp
    └── genary-cercano.webp
```

No abras `index.html` por doble clic para probar la carga JSON: algunos navegadores bloquean `fetch()` para URLs `file://`. Compruébalo desde GitHub Pages o un servidor local de archivos HTTP.

## 6. Opciones para el futuro

- Podrás agregar temas, categorías y registros sin modificar la maqueta: se leen del JSON exportado.
- Los campos especiales de un registro se muestran con las etiquetas declaradas en `datos-publicos.json`.
- Si incorporas medios aprobados, sube imágenes optimizadas bajo `assets/` y haz que `medios.<id>.ruta_publica` apunte allí, desde el archivo maestro y su exportación.
- Si un día se cambia la versión **mayor** del contrato JSON (v2, v3...), habrá que adaptar el lector web. La v1 está diseñada para ampliaciones compatibles.
- Si modificas CSS o JS de la página, actualiza el nombre de caché `VERSION` de `sw.js` para que los navegadores descarguen la nueva interfaz.

**No se ha publicado ningún sitio en GitHub desde este chat.** Este paquete está preparado para subir y revisar por el responsable del proyecto.
