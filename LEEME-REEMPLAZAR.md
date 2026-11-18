# Genary Pozo · Nueva web (versión interna 3)

## Para publicar en GitHub Pages

Descomprime el ZIP **SITIO WEB**. En el repositorio público, reemplaza los archivos `index.html`, `styles.css`, `app.js`, `sw.js` y `datos-publicos.json`, y añade estas páginas nuevas:

- `propuestas.html`
- `trayectoria.html`
- `explorar.html`
- `detalle.html`
- `fuentes.html`

Sube o reemplaza los archivos de la carpeta `assets/` en la carpeta `assets` de GitHub, sin alterar su ruta. Los nuevos son `assets/genary-perfil.webp` y `assets/plan-trabajo.webp`; los demás son los logos y retratos ya optimizados.

Mantén `.nojekyll` en la raíz (el ZIP lo incluye).

Tras confirmar el cambio en GitHub, abre la web; si vieras una versión antigua, recarga sin caché una vez o cierra y vuelve a abrir la pestaña. El service worker usa una versión nueva de caché y consulta `datos-publicos.json` primero en red para cargar actualizaciones.

## Nunca subir al repositorio público

`archivo-maestro.json` **es privado** y se entrega fuera de este ZIP. Conserva ese archivo completo en las fuentes del proyecto y como copia de seguridad. La web solo necesita `datos-publicos.json`, que contiene registros exportados y autorizados.

## Distribución de la información

- `index.html`: portada breve, cuatro ejes, cita comprobable y tres hitos.
- `propuestas.html`: cuatro ejes programáticos, tres principios, propuestas de entrevistas y la imagen aportada.
- `trayectoria.html`: perfil, cronología y causas documentadas.
- `explorar.html`: búsqueda por palabras, tipos y temas.
- `detalle.html?id=reg-0016`: detalles para cualquier registro publicado; el mismo archivo sirve para nuevos registros.
- `fuentes.html`: lista legible con acceso a documentos, noticias y pieza de campaña.

No hay base de datos, backend, servicios externos de pago ni bibliotecas JavaScript.

## Contenido editorial y revisión

Las frases en primera persona son paráfrasis editoriales basadas en declaraciones o el documento compartido: no representan nuevas citas literales. Se distinguen las citas textuales entre comillas y se enlaza cada fuente. Las metas del plan son propuestas, no obras ya realizadas.

La imagen del plan proporcionada por la familia **no se ha identificado aquí como la versión oficial registrada ante el CNE**; se presenta como pieza gráfica de campaña. El maestro conserva preguntas sobre vías, barrios, recursos, fechas y ubicación de proyectos. No se inventaron esos datos.

Antes de una publicación pública, el responsable del proyecto debe revisar el texto del maestro y confirmar que autoriza cada registro publicado. La solicitud de incorporación en esta conversación se trató como autorización de preparación; la web sigue siendo editable.

## Para actualizar después

1. Genary responde preguntas o se incorporan materiales nuevos.
2. Se actualiza **el archivo maestro completo** conservando los IDs anteriores.
3. El usuario revisa la versión y aprueba qué registros se publican.
4. Se genera de nuevo `datos-publicos.json` mediante `validar_y_publicar.py` y se reemplaza en GitHub.
5. Sustituye también el maestro privado en las fuentes del proyecto.
