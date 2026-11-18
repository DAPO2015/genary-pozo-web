# Genary Pozo | Ajustes de diseño y publicación

## Subir a GitHub Pages

Descomprime este ZIP y **reemplaza todos los archivos del repositorio público** por los que contiene, respetando sus rutas. Si el repositorio ya tiene un archivo con el mismo nombre, súbelo de nuevo y confirma la sustitución.

Archivos principales: `index.html`, `propuestas.html`, `trayectoria.html`, `explorar.html`, `detalle.html`, `fuentes.html`, `styles.css`, `app.js`, `sw.js`, `datos-publicos.json` y la carpeta `assets/`.

**Elimina del repositorio** `assets/plan-trabajo.webp` si lo habías subido anteriormente. Se conserva fuera del sitio como fuente documental de trabajo, pero no debe visualizarse públicamente. No elimines los demás retratos ni logos.

`archivo-maestro.json` es privado: se entrega por separado y **nunca** va al repositorio público.

## Cambios aplicados

- Ajuste de espaciado y alturas de los titulares de estilo Ferron/condensado, incluidos teléfonos y pantallas pequeñas. No se modificó el logotipo oficial, que sigue siendo una imagen.
- Nueva separación vertical en la cabecera azul de `Mi camino` para que la etiqueta y el botón no toquen los bordes.
- Eliminados los avisos editoriales visibles sobre redacción en primera persona, aprobaciones, revisiones y procedencia interna de la pieza del plan.
- Las fichas de propuestas y principios no muestran referencias innecesarias. Los hechos y citas documentales mantienen enlaces cortos a sus fuentes públicas.
- La imagen del plan deja de publicarse, también en fichas de detalle y listado de fuentes.
- La primera persona se conserva, respetando las metas del plan sin agregar plazos, importes o barrios no definidos.
- Se mantiene la misma organización con subpáginas y el funcionamiento ligero para conexiones lentas.

## Datos y mantenimiento

La web siempre lee `datos-publicos.json`. Cuando se incorpore contenido nuevo, se actualiza **el archivo maestro completo**, se revisan y aprueban los registros, se regenera `datos-publicos.json` con `validar_y_publicar.py` y se sustituye el JSON público en GitHub. También hay que reemplazar el maestro privado guardado en las fuentes del proyecto.

## Tipografías

No se incluyen ni redistribuyen archivos de tipografías de uso restringido. Se comprobó que **Cormorant Garamond** y **Allura** son alternativas libres (SIL OFL 1.1) para futuros acentos editoriales y de firma. Se conservaron en esta entrega los estilos que ya te gustaban: al tratarse de acentos decorativos, incorporar descargas adicionales no se justificaba en una web diseñada para conexiones limitadas. El logotipo y la firma gráfica oficiales conservan su diseño original.
