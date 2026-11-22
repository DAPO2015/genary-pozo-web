# Genary Pozo · Web completa v18

**Fecha:** 22 de noviembre de 2026  
**Origen:** web v17 + archivo público exportado del archivo maestro privado, revisión 7.  
**Objetivo:** que todas las propuestas se encuentren desde el inicio y que cada visita aporte información nueva, sin repetir una misma introducción en otra página.

## Qué cambió

- **El inicio presenta las 19 propuestas publicadas**, con enlaces directos, agrupadas en seis áreas editoriales:
  1. Vías, movilidad y espacio público (4).
  2. Economía, producción y turismo (5).
  3. Agua, servicios y ambiente (5).
  4. Seguridad y prevención (1).
  5. Cultura, deporte y patrimonio (1).
  6. Gestión municipal y cooperación (3).
- **Nueva página `eje.html`**, cuyo contenido varía mediante `?area=...`. Muestra cada propuesta, las acciones desglosadas disponibles y las fuentes públicas; los enlaces `#reg-...` van a un planteamiento específico.
- **Se acabaron las fichas con el mismo texto tres veces.** Si el contenido aprobado solo tiene un resumen general, la web lo explica y deja a la vista las demás propuestas relacionadas; **no inventa** ubicación, presupuesto, calendario ni método.
- **«Mis propuestas» ofrece el índice completo**, no únicamente cuatro metas. Las cuatro metas iniciales continúan en la banda de cifras del inicio.
- **«Explorar temas» sigue siendo un buscador** con palabra clave, filtro por tipo y tema. Acepta enlaces con `?q=agua&tipo=propuesta`.
- Se distingue entre **material de preparación**, **plan de trabajo difundido** y **entrevistas**. Los textos de guiones preparatorios no se presentan como citas ni compromisos personales confirmados.
- **El icono de pestaña es el archivo «Pestaña web.png»** subido en esta conversación, escalado y comprimido para 16, 32, 64 y 256 píxeles, junto con `favicon.ico` e icono para iPhone/iPad.
- Conserva fotografía, colores, estructura visual, páginas de trayectoria, preguntas, fuentes, botón flotante, redes sociales, formulario Tally y modo ahorro de datos de la v17.
- Identificador de caché actualizado a `genary-shell-v18`.

## Publicación en GitHub Pages (sin terminal)

1. Descarga y descomprime el ZIP.
2. Abre el repositorio de GitHub Pages en el navegador. Ve a **Add file → Upload files** (o usa el editor de archivos del repositorio).
3. Sube **el contenido de este ZIP a la raíz del sitio**, sobrescribiendo los archivos anteriores. `index.html` debe permanecer en la raíz, al igual que `eje.html`, `app.js`, `styles.css`, `datos-publicos.json`, etc. Conserva los nombres y las carpetas.
4. **No borres ningún archivo de fuente tipográfica que ya estuviera instalado con licencia**, como `assets/fonts/Ferron-ExtraExpanded.otf`. No se distribuyen archivos tipográficos en este paquete.
5. Confirma los cambios. Si es necesario, comprueba en `Settings → Pages` que se publica desde `main` y `/(root)`.
6. Prueba el inicio, **Mis propuestas**, al menos una sección (por ejemplo, vías) y **Explorar temas**. Si el navegador muestra una versión antigua, fuerza la recarga o abre una pestaña privada. El cambio de caché favorece la actualización.

**Importante:** si GitHub no mantiene automáticamente carpetas al seleccionar múltiples archivos en el navegador, carga el contenido de `assets/` también en la carpeta `assets` del repositorio; no subas el ZIP como un único archivo, porque GitHub Pages no lo desempaqueta.

## Mantenimiento editorial

- El único archivo de información publicado es `datos-publicos.json`, idéntico a la exportación autorizada del **archivo maestro privado v7**. El maestro privado, las transcripciones y los pendientes **no están dentro del ZIP**.
- No se ha alterado el archivo maestro ni cambiado ningún ID, estado editorial, aprobación o contenido sustantivo.
- Las seis áreas son **categorías de navegación de la web**, no seis nuevos ejes programáticos oficiales. Están definidas en `app.js` mediante IDs y temas del esquema existente; los títulos y detalles de las propuestas siempre salen del JSON público.
- Si se aprueba una nueva propuesta más adelante, se exporta un nuevo `datos-publicos.json` desde el maestro. Si sus temas no permiten clasificarla automáticamente, aparecerá en «Otras propuestas» para que no quede escondida. Se podrá revisar después su categorización.
- Nunca publiques `Genary_Pozo_ARCHIVO_MAESTRO_..._PRIVADO.json` ni `archivo-maestro.json` en GitHub Pages. Mantén el archivo maestro vigente en las fuentes privadas del proyecto.

## Comprobaciones

- `datos-publicos.json` regenerado desde el maestro v7 con `validar_y_publicar.py`: **31 registros públicos, 19 de tipo propuesta; comparación idéntica**.
- Agrupación: **4 + 5 + 5 + 1 + 1 + 3 = 19**, sin duplicados ni propuestas omitidas.
- `app.js`: análisis sintáctico válido con Node.js.
- Pruebas de ejecución del código de la web en un entorno DOM simulado: inicio, índice, seis áreas, ficha individual y búsqueda sin errores en los casos probados.
- La captura automatizada en navegador completo no pudo ejecutarse por restricciones del entorno; se recomienda hacer la revisión visual final desde el sitio GitHub Pages publicado.
