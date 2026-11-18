/* Genary Pozo · lector de datos-publicos.json v1 · sin bibliotecas externas */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const root = document.documentElement;
  const state = { data: null, search: '', tipo: '', tema: '', saver: false, manualSaver: null };
  const collator = new Intl.Collator('es-EC', { sensitivity: 'base', numeric: true });
  const byId = id => document.getElementById(id);
  const node = (tag, className = '', content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined && content !== null) element.textContent = String(content);
    return element;
  };
  const append = (parent, ...children) => { children.filter(Boolean).forEach(child => parent.append(child)); return parent; };
  const getEntries = obj => Object.entries(obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {});
  const normalized = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const readableDate = date => {
    if (!date?.valor || !date?.precision) return '';
    if (date.precision === 'anio') return date.valor;
    if (date.precision === 'mes') {
      const [y,m] = date.valor.split('-').map(Number);
      if (y && m >= 1 && m <= 12) return new Intl.DateTimeFormat('es-EC', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m-1, 1)));
    }
    if (date.precision === 'dia' && /^\d{4}-\d{2}-\d{2}$/.test(date.valor)) {
      return new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date.valor}T12:00:00Z`));
    }
    return '';
  };
  const natureLabels = { hecho_comprobado:'Hecho documentado', hecho_por_verificar:'Hecho por verificar', declaracion:'Declaración', opinion:'Opinión', aspiracion:'Aspiración', compromiso:'Compromiso' };
  const validLink = text => { try { const u = new URL(text); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; } catch { return null; } };
  const validAsset = path => typeof path === 'string' && /^assets\/[\w.\-/]+\.(?:webp|png|jpe?g|gif)$/i.test(path) && !path.split('/').includes('..');

  // Preferir siempre una web pequeña; la detección de conexión es solo una ayuda.
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const recommendedSaver = () => Boolean(connection?.saveData || ['slow-2g','2g'].includes(connection?.effectiveType));
  try { const saved = localStorage.getItem('genary_saver'); if (saved === 'on' || saved === 'off') state.manualSaver = saved; } catch {}
  function applySaver() {
    state.saver = state.manualSaver === null ? recommendedSaver() : state.manualSaver === 'on';
    document.body.dataset.saver = state.saver ? 'on' : 'off';
    const button = byId('data-mode');
    button.setAttribute('aria-pressed', String(state.saver));
    button.setAttribute('aria-label', state.saver ? 'Desactivar ahorro de datos y mostrar fotografías' : 'Activar ahorro de datos');
    byId('data-mode-text').textContent = state.saver ? 'Mostrar imágenes' : 'Ahorro de datos';
    if (!state.saver) {
      loadOptionalImages();
      document.querySelectorAll('img[data-public-image]').forEach(img => {
        img.src = img.dataset.publicImage;
        img.style.display = '';
        img.parentElement.querySelector('.record-image-load')?.remove();
      });
    }
  }
  let photoObserver;
  function loadOptionalImages() {
    const images = [...document.querySelectorAll('img[data-src]')];
    if (!('IntersectionObserver' in window)) {
      images.forEach(assignImage);
      return;
    }
    if (!photoObserver) photoObserver = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {assignImage(e.target); photoObserver.unobserve(e.target);}
    }, { rootMargin: '220px' });
    images.forEach(img => {
      if (img.classList.contains('belowfold-image') || img.closest('.editorial-signature') || img.closest('.party-identity')) photoObserver.observe(img);
      else assignImage(img);
    });
  }
  function assignImage(img) {
    if (!img.getAttribute('src') && validAsset(img.dataset.src)) img.src = img.dataset.src;
  }
  byId('data-mode').addEventListener('click', () => {
    state.manualSaver = state.saver ? 'off' : 'on';
    try { localStorage.setItem('genary_saver', state.manualSaver); } catch {}
    applySaver();
  });
  if (connection?.addEventListener) connection.addEventListener('change', () => {if (state.manualSaver === null) applySaver();});
  applySaver();

  // Menú móvil navegable con teclado.
  const navToggle = byId('nav-toggle');
  const nav = byId('nav-principal');
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); navToggle.setAttribute('aria-label','Abrir menú'); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); navToggle.focus(); }
  });
  byId('year').textContent = String(new Date().getFullYear());

  function checkPublicData(data) {
    return data && data.meta?.formato === 'genary-datos-publicos' && /^1\.\d+\.\d+$/.test(data.meta.version_esquema || '')
      && ['registros','tipos','temas','campos','actores','fuentes','medios','tipos_relacion'].every(key => data[key] && typeof data[key] === 'object' && !Array.isArray(data[key]));
  }
  async function loadData() {
    byId('archive-error').hidden = true;
    byId('results-count').textContent = 'Consultando el archivo…';
    try {
      const response = await fetch('./datos-publicos.json', { cache:'no-store' });
      if (!response.ok) throw new Error(`El archivo público respondió con un error (${response.status}).`);
      const data = await response.json();
      if (!checkPublicData(data)) throw new Error('El formato del archivo público no es compatible con esta versión de la web.');
      state.data = data;
      fillFilters(); render();
      const total = getEntries(data.registros).length;
      byId('hero-record-count').textContent = String(total);
      byId('data-revision').textContent = `Archivo público · revisión ${data.meta.revision_origen ?? '—'} · actualizado ${data.meta.generado_en ?? 'sin fecha'}`;
      setTimeout(() => handleHash(), 0);
    } catch (err) {
      state.data = null;
      byId('results').replaceChildren();
      byId('empty-state').hidden = true;
      byId('archive-error').hidden = false;
      byId('archive-error-text').textContent = err.message || 'Revisa tu conexión e inténtalo de nuevo.';
      byId('results-count').textContent = 'Archivo no disponible';
    }
  }
  byId('reload-data').addEventListener('click', loadData);

  function fillFilters() {
    const data = state.data;
    const type = byId('type-filter');
    type.replaceChildren(node('option','', 'Todos'));
    type.firstElementChild.value = '';
    for (const [id,item] of getEntries(data.tipos).sort((a,b) => collator.compare(a[1].nombre, b[1].nombre))) {
      const opt = node('option','', item.nombre || id); opt.value = id; type.append(opt);
    }
    type.value = state.tipo;
    if (type.value !== state.tipo) state.tipo = '';
    const chips = byId('topic-chips');
    chips.replaceChildren();
    const topics = [['', {nombre: 'Todos los temas'}], ...getEntries(data.temas).sort((a,b)=>(a[1].orden??0)-(b[1].orden??0) || collator.compare(a[1].nombre,b[1].nombre))];
    if (!topics.some(([id])=>id===state.tema)) state.tema = '';
    for (const [id,topic] of topics) {
      const btn = node('button','chip'+(state.tema===id?' active':''),topic.nombre || id);
      btn.type = 'button'; btn.dataset.topic = id; btn.setAttribute('aria-pressed',String(state.tema===id));
      btn.addEventListener('click',()=>{state.tema=id;fillFilters();render();});
      chips.append(btn);
    }
  }
  byId('search').addEventListener('input', e => { state.search = e.target.value.trim(); render(); });
  byId('type-filter').addEventListener('change', e => { state.tipo = e.target.value; render(); });

  function searchText(reg, data) {
    const topicNames = (reg.tema_ids || []).map(id => data.temas[id]?.nombre || '');
    const blocks = (reg.bloques || []).flatMap(block => [block.texto || '', ...(block.items || []), block.pie || '']);
    const fields = Object.entries(reg.campos || {}).flatMap(([k,v]) => [data.campos[k]?.etiqueta || '',Array.isArray(v) ? v.join(' ') : typeof v === 'object' ? v.valor || '' : String(v)]);
    return normalized([reg.titulo,reg.resumen,...blocks,...fields,...topicNames,data.tipos[reg.tipo]?.nombre, data.actores[reg.actor_id]?.nombre].join(' '));
  }
  function filteredEntries() {
    return getEntries(state.data.registros).filter(([,reg]) => {
      if (!reg || typeof reg !== 'object') return false;
      if (state.tipo && reg.tipo !== state.tipo) return false;
      if (state.tema && !(reg.tema_ids || []).includes(state.tema)) return false;
      if (state.search && !normalized(state.search).split(/\s+/).every(word => searchText(reg,state.data).includes(word))) return false;
      return true;
    }).sort((a,b) => {
      const aDate=a[1].fecha_referencia?.valor || '', bDate=b[1].fecha_referencia?.valor || '';
      return bDate.localeCompare(aDate) || collator.compare(a[1].titulo || '', b[1].titulo || '');
    });
  }
  function render() {
    if (!state.data) return;
    const all = getEntries(state.data.registros).length;
    const list = filteredEntries();
    byId('results-count').textContent = `${list.length} de ${all} ${all===1?'registro publicado':'registros publicados'}`;
    const container = byId('results');
    const frag = document.createDocumentFragment();
    list.forEach(([id,reg]) => frag.append(createRecord(id,reg,state.data)));
    container.replaceChildren(frag);
    const empty = byId('empty-state');
    empty.hidden = list.length > 0;
    if (list.length === 0) {
      byId('empty-title').textContent = all === 0 ? 'Esta historia se está documentando.' : 'No hay resultados con esos filtros.';
      byId('empty-description').textContent = all === 0 ? 'Todavía no hay registros aprobados para publicar. Aquí aparecerá el contenido a medida que sea revisado.' : 'Prueba con otras palabras o selecciona «Todos» para volver a explorar el archivo.';
    }
  }

  function createRecord(id,reg,data) {
    const article=node('article','record-card'); article.id=id;
    const details=node('details');
    const summary=node('summary');
    const top=node('div','record-top');
    append(top,node('span','record-type',data.tipos[reg.tipo]?.nombre || 'Registro'),node('span','record-id',id.toUpperCase()));
    append(summary,top,node('h3','',reg.titulo||'Sin título'),node('p','record-summary',reg.resumen||''),node('span','record-open','Ver detalles +'));
    const body=node('div','record-body');
    if (reg.actor_id && data.actores[reg.actor_id]) {
      body.append(node('p','record-nature',`Atribución: ${data.actores[reg.actor_id].nombre}`));
    }
    if (reg.fecha_referencia) {
      const date=readableDate(reg.fecha_referencia);
      if (date) body.append(node('p','record-nature',`Fecha de referencia: ${date}`));
    }
    for (const block of (reg.bloques || [])) body.append(renderBlock(block,data));
    renderFields(body,reg.campos,data);
    renderSources(body,reg,data);
    renderRelations(body,reg,data);
    const foot=node('div','record-foot');
    append(foot,node('span','record-nature',natureLabels[reg.naturaleza] || 'Información documentada'));
    const linkBtn=node('button','','Copiar enlace ↗'); linkBtn.type='button';
    linkBtn.addEventListener('click',async () => {
      const url=`${location.href.split('#')[0]}#${encodeURIComponent(id)}`;
      try {await navigator.clipboard.writeText(url);linkBtn.textContent='Enlace copiado ✓';}
      catch {location.hash = id;linkBtn.textContent='Enlace en la dirección ↗';}
    });
    foot.append(linkBtn); body.append(foot);
    details.addEventListener('toggle', () => {const action=$('.record-open',details);if(action) action.textContent=details.open?'Cerrar detalles −':'Ver detalles +';});
    append(details,summary,body);article.append(details);return article;
  }
  function renderBlock(block,data) {
    const wrap=node('div','record-block');
    if (block.tipo==='texto') wrap.append(node('p','',block.texto||''));
    if (block.tipo==='lista') {
      const ul=node('ul');(block.items||[]).forEach(item=>ul.append(node('li','',item)));wrap.append(ul);
    }
    if (block.tipo==='cita') {
      const quote=node('blockquote');append(quote,node('p','',block.texto||''),node('footer','record-nature',block.atribucion||''));wrap.append(quote);
    }
    if (block.tipo==='imagen') {
      const media=data.medios[block.medio_id];
      if (media && validAsset(media.ruta_publica) && media.tipo==='imagen') {
        const fig=node('figure');const img=node('img');img.loading='lazy';img.decoding='async';img.alt=media.texto_alternativo||'';
        img.dataset.publicImage = media.ruta_publica;
        if (!state.saver) img.src=media.ruta_publica;
        else {
          img.style.display = 'none';
          const loadBtn=node('button','record-image-load',`Mostrar imagen: ${media.texto_alternativo || media.titulo || 'imagen del registro'}`);
          loadBtn.type='button';
          loadBtn.addEventListener('click',() => { img.src=media.ruta_publica;img.style.display='';loadBtn.remove(); });
          fig.append(loadBtn);
        }
        fig.append(img);if(block.pie)fig.append(node('figcaption','',block.pie));wrap.append(fig);
      }
    }
    return wrap;
  }
  function renderFields(parent,fields,data) {
    const entries=getEntries(fields);
    if (!entries.length) return;
    parent.append(node('h4','','Datos y detalles'));
    const dl=node('dl');
    for (const [key,value] of entries) {
      const container=node('div');const label=data.campos[key]?.etiqueta || key;
      append(container,node('dt','',label));const dd=node('dd');
      if (Array.isArray(value)) { const ul=node('ul');value.forEach(v=>ul.append(node('li','',v)));dd.append(ul); }
      else if (typeof value==='object' && value?.precision) dd.textContent=readableDate(value);
      else if (data.campos[key]?.formato==='enlace' && validLink(value)) {const a=node('a','',value);a.href=validLink(value);a.target='_blank';a.rel='noopener noreferrer';dd.append(a);}
      else dd.textContent=typeof value==='boolean'?(value?'Sí':'No'):String(value??'');
      container.append(dd);dl.append(container);
    }
    parent.append(dl);
  }
  function renderSources(parent,reg,data) {
    const sources=new Set(reg.fuente_ids||[]);
    (reg.bloques||[]).forEach(b=>(b.fuente_ids||[]).forEach(id=>sources.add(id)));
    const listed=[...sources].filter(id=>data.fuentes[id]);
    if (!listed.length) return;
    parent.append(node('h4','','Fuentes y referencias'));
    const ul=node('ul');
    for (const id of listed) {
      const item=node('li'); const src=data.fuentes[id];
      append(item,node('span','',src.cita_publica||id));
      const url=validLink(src.url_publica);
      if(url){const link=node('a','','Consultar fuente ↗');link.href=url;link.rel='noopener noreferrer';link.target='_blank';append(item,document.createTextNode(' · '),link);}
      ul.append(item);
    }
    parent.append(ul);
  }
  function renderRelations(parent,reg,data) {
    const rel=(reg.relaciones||[]).filter(r=>r.destino_id in data.registros);
    if (!rel.length) return;
    parent.append(node('h4','','Contenidos relacionados'));
    const ul=node('ul');
    for (const r of rel) {
      const li=node('li'),a=node('a','',data.registros[r.destino_id].titulo);
      a.href='#'+encodeURIComponent(r.destino_id);li.append(node('span','',`${data.tipos_relacion[r.tipo]||'Relacionado'}: `),a);ul.append(li);
    }
    parent.append(ul);
  }
  function handleHash() {
    const id=decodeURIComponent(location.hash.slice(1));
    if (!/^reg-\d{4,}$/.test(id)) return;
    const card=byId(id);
    if (card) {const details=$('details',card);if(details) details.open=true;card.classList.add('hash-target');card.scrollIntoView({block:'center',behavior:'smooth'});}
  }
  window.addEventListener('hashchange',handleHash);
  loadData();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load',() => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
