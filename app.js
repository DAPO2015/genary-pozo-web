(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const state = { data: null, topic: '', type: '', query: '', saver: false, manualSaver: null };
  const page = document.body.dataset.page || 'inicio';
  const natureLabels = {
    hecho_comprobado:'Hecho documentado', hecho_por_verificar:'Dato en revisión',
    declaracion:'Declaración', opinion:'Opinión', aspiracion:'Propuesta', compromiso:'Compromiso'
  };
  const collator = new Intl.Collator('es-EC',{sensitivity:'base',numeric:true});
  const entries = x => Object.entries(x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  const normalize = text => String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const el = (tag, className='', text) => {const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=String(text);return e;};
  const add = (parent,...nodes) => {nodes.filter(Boolean).forEach(n=>parent.append(n));return parent;};
  const t = id => state.data.temas?.[id]?.nombre || '';
  const reg = id => state.data.registros?.[id] || null;
  const validUrl = value => {try{const x=new URL(value);return x.protocol==='https:'&&!x.username&&!x.password?x.href:null;}catch{return null;}};
  const validAsset = value => typeof value==='string' && /^assets\/[A-Za-z0-9/_-]+\.(?:webp|png|jpe?g)$/i.test(value) && !value.includes('..');
  const detailHref = id => `detalle.html?id=${encodeURIComponent(id)}`;
  const publicRecord = ([id,item]) => item && typeof item==='object' && /^reg-\d{4,}$/.test(id);
  const allRecords = () => entries(state.data.registros).filter(publicRecord).map(([id,item])=>({id,...item}));
  const planRecords = () => allRecords().filter(r=>r.tipo==='propuesta'&&r.tema_ids?.includes('tem-0008')).sort((a,b)=>(a.campos?.orden_plan||999)-(b.campos?.orden_plan||999));
  const dateLabel = value => {
    if(!value?.valor) return '';
    if(value.precision==='anio')return value.valor;
    if(value.precision==='mes'){const [y,m]=value.valor.split('-').map(Number);return new Intl.DateTimeFormat('es-EC',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,1)));}
    if(value.precision==='dia'){return new Intl.DateTimeFormat('es-EC',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${value.valor}T12:00:00Z`));}
    return value.valor;
  };
  const sourceName = src => {
    if(!src) return 'Fuente';
    const url = src.url_publica || '';
    if(url.includes('archivo.asambleanacional.gob.ec'))return 'Archivo de la Asamblea';
    if(url.includes('asambleanacional.gob.ec'))return 'Asamblea Nacional';
    if(url.includes('lahora.com.ec'))return 'La Hora';
    if(url.includes('gobernacioncarchi.gob.ec'))return 'Resolución judicial';
    return 'Documento';
  };
  const sourceHref = src => src ? validUrl(src.url_publica) : null;
  const recordSourceIds = r => [...new Set([...(r.fuente_ids||[]),...(r.bloques||[]).flatMap(b=>b.fuente_ids||[])])];

  function sourceSnippet(target,r) {
    const sources=recordSourceIds(r).filter(id=>state.data.fuentes?.[id] && sourceHref(state.data.fuentes[id]));
    for(const id of sources) {
      const src=state.data.fuentes[id];
      const line=el('div','source-line');
      const prefix=(src.url_publica||'').includes('lahora.com.ec') ? 'Genary Pozo en ' : '';
      if(prefix)line.append(el('span','',prefix));
      const a=el('a','',sourceName(src));
      a.href=sourceHref(src);a.target='_blank';a.rel='noopener noreferrer';
      line.append(a);
      target.append(line);
    }
    return target;
  }
  const needsSource = r => r.naturaleza==='hecho_comprobado' || r.tipo==='trayectoria' || r.tipo==='biografia' || r.tipo==='cita' || (r.bloques||[]).some(b=>b.tipo==='cita');

  function quickCard(r, className='small-card', linkText='Ver detalle') {
    const card=el('article',className);
    card.append(el('h3','',r.titulo));
    card.append(el('p','',r.resumen));
    const a=el('a','',linkText+' ↗');a.href=detailHref(r.id);card.append(a);
    return card;
  }

  function applySaver(){
    const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    const recommended=Boolean(connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType));
    state.saver=state.manualSaver===null?recommended:state.manualSaver==='on';
    document.body.dataset.save=state.saver?'on':'off';
    const btn=$('data-toggle');
    if(btn){btn.setAttribute('aria-pressed',String(state.saver));const label=btn.querySelector('.data-label');if(label)label.textContent=state.saver?'Mostrar imágenes':'Ahorro de datos';btn.title=state.saver?'Mostrar imágenes decorativas':'Reducir imágenes decorativas';}
    if(!state.saver)loadOptionalImages();
  }
  let imageObserver=null;
  function assignImage(img){if(!img.getAttribute('src')&&validAsset(img.dataset.src))img.src=img.dataset.src;}
  function loadOptionalImages(){
    const items=[...document.querySelectorAll('img.optional-img[data-src]')];
    if(!('IntersectionObserver' in window)){items.forEach(assignImage);return;}
    if(!imageObserver){imageObserver=new IntersectionObserver(ents=>{for(const ent of ents)if(ent.isIntersecting){assignImage(ent.target);imageObserver.unobserve(ent.target);}}, {rootMargin:'200px'});}
    items.forEach(img=>imageObserver.observe(img));
  }
  function setupUI(){
    const toggle=$('nav-toggle');const nav=$('nav-links');
    if(toggle&&nav){toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',opened?'Cerrar menú':'Abrir menú');});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});}
    const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    try{const value=localStorage.getItem('genary_data_mode');if(value==='on'||value==='off')state.manualSaver=value;}catch{}
    $('data-toggle')?.addEventListener('click',()=>{state.manualSaver=state.saver?'off':'on';try{localStorage.setItem('genary_data_mode',state.manualSaver);}catch{}applySaver();});
    connection?.addEventListener?.('change',()=>{if(state.manualSaver===null)applySaver();});
    applySaver();
  }

  function renderHome(){
    const bio=reg('reg-0001');if(bio)$('hero-intro').textContent=bio.resumen;
    const plan=planRecords();
    const nums=$('number-list');nums.replaceChildren();
    for(const r of plan){
      const item=el('div','number-item');
      const num=r.campos?.cifra_destacada;
      item.append(el('strong','',typeof num==='number'?num:'↗'));
      item.append(el('span','',r.campos?.cifra_etiqueta || 'cooperación externa'));
      nums.append(item);
    }
    const featured=$('featured-plan');featured.replaceChildren();
    plan.forEach((r,i)=>{
      const card=el('article','featured-card');
      card.append(el('span','number',String(i+1).padStart(2,'0')));
      card.append(el('h3','',r.titulo.replace(/:.+$/,'')));
      card.append(el('p','',r.resumen));
      const link=el('a','','Conocer propuesta ↗');link.href=detailHref(r.id);card.append(link);featured.append(card);
    });
    const quote=reg('reg-0010');const quoteBlock=quote?.bloques?.find(b=>b.tipo==='cita');
    if(quoteBlock){$('home-quote').textContent='«'+quoteBlock.texto+'»';sourceSnippet($('home-quote-source'),quote);}
    const timeline=allRecords().filter(r=>r.tipo==='trayectoria').sort((a,b)=>(a.fecha_referencia?.valor||'').localeCompare(b.fecha_referencia?.valor||'')).slice(0,3);
    $('home-timeline').replaceChildren(...timeline.map(r=>{
      const card=el('article','moment');card.append(el('time','date',dateLabel(r.fecha_referencia)));card.append(el('h3','',r.titulo));card.append(el('p','',r.resumen));const a=el('a','','Ver historia ↗');a.href=detailHref(r.id);card.append(a);return card;
    }));
  }

  function renderProposals(){
    const list=planRecords();
    if($('plan-count'))$('plan-count').textContent=String(list.length).padStart(2,'0');
    $('all-plan').replaceChildren(...list.map((r,i)=>{
      const card=el('article','plan-card');const head=el('div','plan-card-head');head.append(el('span','plan-index',String(i+1).padStart(2,'0')));const num=r.campos?.cifra_destacada;
      if(typeof num==='number')head.append(el('span','plan-meta',`${num} ${r.campos?.cifra_etiqueta||''}`));
      else head.append(el('span','plan-meta','Cooperación externa'));
      const body=el('div','plan-card-body');body.append(el('h3','',r.titulo));body.append(el('p','',r.resumen));const a=el('a','','Conoce la propuesta ↗');a.href=detailHref(r.id);body.append(a);add(card,head,body);return card;
    }));
    const principles=allRecords().filter(r=>r.tipo==='principio'&&r.tema_ids?.includes('tem-0009')).sort((a,b)=>collator.compare(a.id,b.id));
    $('principles').replaceChildren(...principles.map(r=>{
      const card=el('article','principle-card');card.append(el('span','squiggle','✳'));card.append(el('h3','',r.titulo));card.append(el('p','',r.resumen));return card;
    }));
    const older=allRecords().filter(r=>r.tipo==='propuesta'&&!r.tema_ids?.includes('tem-0008'));
    $('other-proposals').replaceChildren(...older.map(r=>quickCard(r)));
  }

  function renderTrajectory(){
    const bio=reg('reg-0001');if(bio)$('bio-text').textContent=bio.resumen;
    const events=allRecords().filter(r=>r.tipo==='trayectoria'||r.id==='reg-0006').sort((a,b)=>(a.fecha_referencia?.valor||'').localeCompare(b.fecha_referencia?.valor||''));
    $('full-timeline').replaceChildren(...events.map(r=>{
      const card=el('article','timeline-card');card.append(el('time','',dateLabel(r.fecha_referencia)));card.append(el('h3','',r.titulo));card.append(el('p','',r.resumen));const a=el('a','','Conoce este momento ↗');a.href=detailHref(r.id);card.append(a);return card;
    }));
    const causes=[reg('reg-0003'),reg('reg-0006'),reg('reg-0010')].filter(Boolean);
    $('cause-grid').replaceChildren(...causes.map(r=>{
      const card=el('article','cause-card');card.append(el('h3','',r.titulo));card.append(el('p','',r.resumen));const a=el('a','','Conoce más ↗');a.href=detailHref(r.id);card.append(a);return card;
    }));
  }

  function recordSearchText(r){
    const fields=entries(r.campos).flatMap(([k,v])=>[state.data.campos?.[k]?.etiqueta||k,Array.isArray(v)?v.join(' '):(typeof v==='object'?v?.valor||'':String(v??''))]);
    const blocks=(r.bloques||[]).flatMap(b=>[b.texto||'',...(b.items||[])]);
    return normalize([r.titulo,r.resumen,...fields,...blocks,...(r.tema_ids||[]).map(t)].join(' '));
  }
  function renderFilters(){
    const topicItems=[['',{nombre:'Todos los temas'}],...entries(state.data.temas).sort((a,b)=>(a[1].orden||0)-(b[1].orden||0)||collator.compare(a[1].nombre,b[1].nombre))];
    const holder=$('topic-chips');holder.replaceChildren();
    for(const [id,topic] of topicItems){const b=el('button','chip',topic.nombre);b.type='button';b.setAttribute('aria-pressed',String(state.topic===id));b.addEventListener('click',()=>{state.topic=id;renderFilters();renderResults();});holder.append(b);}
    const kind=$('type-filter');kind.replaceChildren();const all=el('option','','Todos');all.value='';kind.append(all);
    entries(state.data.tipos).sort((a,b)=>collator.compare(a[1].nombre,b[1].nombre)).forEach(([id,data])=>{const opt=el('option','',data.nombre);opt.value=id;kind.append(opt);});kind.value=state.type;
  }
  function renderResults(){
    let filtered=allRecords().filter(r=>!state.topic||r.tema_ids?.includes(state.topic)).filter(r=>!state.type||r.tipo===state.type);
    const words=normalize(state.query).trim().split(/\s+/).filter(Boolean);
    if(words.length)filtered=filtered.filter(r=>{const text=recordSearchText(r);return words.every(w=>text.includes(w));});
    filtered.sort((a,b)=>(b.fecha_referencia?.valor||'').localeCompare(a.fecha_referencia?.valor||'')||collator.compare(a.titulo,b.titulo));
    $('results-count').textContent=`${filtered.length} resultado${filtered.length===1?'':'s'}`;
    if(!filtered.length){$('results').replaceChildren(el('p','empty','No encuentro registros con esos filtros. Prueba otro tema.'));return;}
    $('results').replaceChildren(...filtered.map(r=>{
      const card=el('article','result-card');const type=state.data.tipos?.[r.tipo]?.nombre||r.tipo;card.append(el('span','pill',type));card.append(el('h2','',r.titulo));card.append(el('p','',r.resumen));const a=el('a','','Leer detalle ↗');a.href=detailHref(r.id);card.append(a);return card;
    }));
  }
  function renderExplore(){
    const p=new URLSearchParams(location.search);const topic=p.get('tema');if(topic&&state.data.temas[topic])state.topic=topic;
    renderFilters();renderResults();
    $('search')?.addEventListener('input',e=>{state.query=e.target.value;renderResults();});
    $('type-filter')?.addEventListener('change',e=>{state.type=e.target.value;renderResults();});
  }

  function renderDetail(){
    const id=new URLSearchParams(location.search).get('id')||'';
    const r=/^reg-\d{4,}$/.test(id)?reg(id):null;
    const holder=$('detail-article');holder.replaceChildren();
    if(!r){holder.append(el('p','empty','No encuentro ese contenido. Puedes volver a explorar los temas.'));return;}
    document.title=`${r.titulo} | Genary Pozo`;
    const article=el('article','detail-card');
    const cover=el('header','detail-cover');
    const type=state.data.tipos?.[r.tipo]?.nombre||r.tipo;
    const nature=natureLabels[r.naturaleza]||'';
    const kicker=type===nature?type:`${type} · ${nature}`;
    const date=dateLabel(r.fecha_referencia);
    const headline=r.tema_ids?.includes('tem-0008') ? r.titulo.split(':')[0] : r.titulo;
    add(cover,el('span','mini-index light-index',kicker),el('h1','',headline),el('p','',r.resumen));
    if(date)cover.append(el('p','detail-attribute',date));
    const body=el('div','detail-body');
    for(const b of r.bloques||[]){
      if(b.tipo==='texto')body.append(el('p','detail-block',b.texto));
      if(b.tipo==='lista'){const ul=el('ul','detail-block detail-list');for(const item of b.items||[])ul.append(el('li','',item));body.append(ul);}
      if(b.tipo==='cita'){const quote=el('blockquote','detail-quote');quote.append(document.createTextNode('«'+b.texto+'»'));quote.append(el('cite','',b.atribucion||''));body.append(quote);}
      if(b.tipo==='imagen' && b.medio_id!=='med-0004'){
        const medium=state.data.medios?.[b.medio_id];
        if(medium&&validAsset(medium.ruta_publica)){
          const figure=el('figure','');const img=el('img','detail-image optional-img');img.dataset.src=medium.ruta_publica;img.alt=medium.texto_alternativo||medium.titulo||'Imagen relacionada';img.loading='lazy';figure.append(img);if(b.pie && !/archivo|pieza de campaña|retrato público/i.test(b.pie))figure.append(el('figcaption','detail-figcaption',b.pie));body.append(figure);
        }
      }
    }
    const fields=entries(r.campos).filter(([k])=>!['cifra_destacada','cifra_etiqueta','orden_plan'].includes(k) && !(r.tema_ids?.includes('tem-0008') && k==='accion'));
    if(fields.length){const area=el('div','detail-fields');for(const [key,val] of fields){const item=el('div','detail-field');item.append(el('strong','',state.data.campos?.[key]?.etiqueta||key));if(Array.isArray(val)){const list=el('ul','');val.forEach(v=>list.append(el('li','',v)));item.append(list);}else{item.append(el('p','',typeof val==='object'?val?.valor||'':val));}area.append(item);}body.append(area);}
    if(needsSource(r) && recordSourceIds(r).some(id=>state.data.fuentes?.[id] && sourceHref(state.data.fuentes[id]))) {
      const sources=el('div','detail-sources');
      sourceSnippet(sources,r);
      body.append(sources);
    }
    add(article,cover,body);holder.append(article);
    const related=$('related');related.replaceChildren();
    const relevant=(r.relaciones||[]).map(x=>({id:x.destino_id,record:reg(x.destino_id)})).filter(x=>x.record);
    if(relevant.length){related.append(el('h2','','También puede interesarte'));const box=el('div','related-links');for(const item of relevant){const a=el('a','',item.record.titulo+' ↗');a.href=detailHref(item.id);box.append(a);}related.append(box);}
    loadOptionalImages();
  }
  function renderSources(){
    const list=entries(state.data.fuentes).filter(([,src])=>sourceHref(src)).sort((a,b)=>collator.compare(sourceName(a[1]),sourceName(b[1])));
    $('sources-grid').replaceChildren(...list.map(([id,src])=>{
      const card=el('article','source-card');
      const name=sourceName(src);
      card.append(el('span','pill',name));
      card.append(el('h2','',src.cita_publica || name));
      const a=el('a','','Ver publicación ↗');
      a.href=sourceHref(src);a.rel='noopener noreferrer';a.target='_blank';
      card.append(a);
      return card;
    }));
  }

  async function init(){
    try{
      const response=await fetch('./datos-publicos.json',{cache:'no-store'});
      if(!response.ok)throw new Error(`Error HTTP ${response.status}`);
      const data=await response.json();
      if(data?.meta?.formato!=='genary-datos-publicos'||!data?.registros||!data?.temas||!data?.fuentes)throw new Error('Formato de datos no reconocido');
      state.data=data;
      if(page==='inicio')renderHome();
      else if(page==='propuestas')renderProposals();
      else if(page==='trayectoria')renderTrajectory();
      else if(page==='explorar')renderExplore();
      else if(page==='detalle')renderDetail();
      else if(page==='fuentes')renderSources();
      applySaver();
    }catch(err){
      const target=$('results')||$('all-plan')||$('full-timeline')||$('featured-plan')||$('sources-grid')||$('detail-article');
      if(target)target.replaceChildren(el('p','empty',`No pude cargar los datos: ${err.message}. Comprueba la conexión o vuelve a intentarlo.`));
    }
  }
  setupUI();
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
  init();
})();
