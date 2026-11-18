(() => {
  'use strict';

  const state = { data: null, search: '', topic: '' };
  const $ = (sel, root = document) => root.querySelector(sel);
  const byId = id => document.getElementById(id);
  const entries = obj => Object.entries(obj || {});
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const collator = new Intl.Collator('es-EC', { sensitivity: 'base', numeric: true });
  const typeLabels = {
    biografia: 'Perfil',
    trayectoria: 'Trayectoria',
    hecho: 'Hecho',
    principio: 'Principio',
    diagnostico: 'Diagnóstico',
    propuesta: 'Propuesta'
  };

  function formatApproxDate(date) {
    if (!date || !date.valor || !date.precision) return 'Sin fecha';
    if (date.precision === 'anio') return date.valor;
    if (date.precision === 'mes') {
      const [y, m] = date.valor.split('-').map(Number);
      return new Intl.DateTimeFormat('es-EC', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1)));
    }
    if (date.precision === 'dia') {
      return new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date.valor}T12:00:00Z`));
    }
    return date.valor;
  }

  function validPublicData(data) {
    return data && data.meta?.formato === 'genary-datos-publicos' && data.registros && data.temas && data.fuentes;
  }

  function collectSearchText(record) {
    const topicNames = (record.tema_ids || []).map(id => state.data.temas[id]?.nombre || '');
    const blocks = (record.bloques || []).flatMap(block => [block.texto || '', block.pie || '', ...(block.items || [])]);
    const fields = Object.entries(record.campos || {}).flatMap(([key, value]) => {
      const label = state.data.campos[key]?.etiqueta || key;
      if (Array.isArray(value)) return [label, value.join(' ')];
      if (value && typeof value === 'object') return [label, value.valor || ''];
      return [label, String(value || '')];
    });
    return normalize([record.titulo, record.resumen, ...blocks, ...topicNames, ...fields].join(' '));
  }

  function getRecords() {
    const list = entries(state.data.registros).map(([id, record]) => ({ id, ...record }));
    const searchWords = normalize(state.search).split(/\s+/).filter(Boolean);
    return list.filter(record => {
      if (state.topic && !(record.tema_ids || []).includes(state.topic)) return false;
      if (!searchWords.length) return true;
      const haystack = collectSearchText(record);
      return searchWords.every(word => haystack.includes(word));
    }).sort((a, b) => {
      const av = a.fecha_referencia?.valor || '';
      const bv = b.fecha_referencia?.valor || '';
      return bv.localeCompare(av) || collator.compare(a.titulo, b.titulo);
    });
  }

  function renderHero() {
    byId('kpi-records').textContent = entries(state.data.registros).length;
    byId('kpi-sources').textContent = entries(state.data.fuentes).length;
    byId('kpi-topics').textContent = entries(state.data.temas).length;
    const revision = state.data.meta.revision_origen ?? '—';
    const generated = state.data.meta.generado_en ?? '—';
    byId('revision-line').textContent = `Revisión ${revision} · actualizada ${generated}`;
    byId('footer-revision').textContent = `Revisión ${revision} · datos públicos generados el ${generated}.`;
  }

  function renderSignals() {
    const cards = [
      {
        label: 'Perfil',
        title: 'Candidato a la Alcaldía de Tulcán',
        text: 'La ficha pública lo ubica como candidato en 2026 y como presidente del Comité Cívico del Carchi.'
      },
      {
        label: 'Frontera',
        title: 'Ha empujado el tema de los vehículos retenidos',
        text: 'Su nombre aparece en comparecencias y reuniones institucionales sobre la situación en Colombia.'
      },
      {
        label: 'Gestión cívica',
        title: 'También hay rastro sobre GLP y pedidos de información',
        text: 'Una resolución judicial enumera oficios del Comité Cívico sobre gas y gobernabilidad en Carchi.'
      },
      {
        label: 'Campaña',
        title: 'Sus propuestas iniciales ya se pueden leer',
        text: 'Esta versión recoge diagnósticos y aspiraciones públicas para Tulcán, sin vender humo ni texto de relleno.'
      }
    ];

    const grid = byId('signal-grid');
    grid.replaceChildren(...cards.map(card => {
      const article = document.createElement('article');
      article.className = 'signal-card';
      article.innerHTML = `<p class="signal-label">${card.label}</p><h3>${card.title}</h3><p>${card.text}</p>`;
      return article;
    }));
  }

  function renderQuote() {
    const quoteRecord = state.data.registros['reg-0002'] || state.data.registros['reg-0010'];
    const quoteBlock = (quoteRecord?.bloques || []).find(block => block.tipo === 'cita');
    byId('main-quote').textContent = quoteBlock?.texto || 'Sin cita destacada en esta versión.';
    byId('main-quote-source').textContent = quoteBlock?.atribucion || '';
  }

  function renderTimeline() {
    const container = byId('timeline');
    const list = entries(state.data.registros)
      .filter(([, record]) => ['biografia', 'trayectoria', 'hecho'].includes(record.tipo))
      .map(([id, record]) => ({ id, ...record }))
      .sort((a, b) => (a.fecha_referencia?.valor || '').localeCompare(b.fecha_referencia?.valor || ''));

    if (!list.length) {
      container.innerHTML = '<div class="empty">No hay hitos publicados todavía.</div>';
      return;
    }

    container.replaceChildren(...list.map(record => {
      const item = document.createElement('article');
      item.className = 'timeline-item';
      const tags = (record.tema_ids || []).map(id => `<span>${state.data.temas[id]?.nombre || id}</span>`).join('');
      item.innerHTML = `
        <div class="timeline-date">${formatApproxDate(record.fecha_referencia)}</div>
        <div>
          <h3>${record.titulo}</h3>
          <p>${record.resumen}</p>
          <div class="timeline-tags">${tags}</div>
        </div>
      `;
      return item;
    }));
  }

  function renderProposals() {
    const container = byId('proposal-cards');
    const list = entries(state.data.registros)
      .filter(([, record]) => ['diagnostico', 'propuesta'].includes(record.tipo))
      .map(([id, record]) => ({ id, ...record }))
      .sort((a, b) => collator.compare(a.titulo, b.titulo));

    if (!list.length) {
      container.innerHTML = '<div class="empty">No hay propuestas publicadas todavía.</div>';
      return;
    }

    container.replaceChildren(...list.map(record => {
      const article = document.createElement('article');
      article.className = 'proposal-card';
      const fieldEntries = Object.entries(record.campos || {});
      const points = fieldEntries.slice(0, 3).map(([key, value]) => {
        const label = state.data.campos[key]?.etiqueta || key;
        const text = Array.isArray(value) ? value.join(', ') : (value?.valor || value);
        return `<li><strong>${label}:</strong> ${text}</li>`;
      }).join('');
      article.innerHTML = `
        <span class="type">${typeLabels[record.tipo] || record.tipo}</span>
        <h3>${record.titulo}</h3>
        <p>${record.resumen}</p>
        ${points ? `<ul class="proposal-points">${points}</ul>` : ''}
      `;
      return article;
    }));
  }

  function renderTopicChips() {
    const chips = byId('topic-chips');
    const items = [['', { nombre: 'Todos' }], ...entries(state.data.temas).sort((a, b) => (a[1].orden || 0) - (b[1].orden || 0) || collator.compare(a[1].nombre, b[1].nombre))];
    chips.replaceChildren(...items.map(([id, topic]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chip${state.topic === id ? ' active' : ''}`;
      button.textContent = topic.nombre;
      button.addEventListener('click', () => {
        state.topic = id;
        renderTopicChips();
        renderRecords();
      });
      return button;
    }));
  }

  function renderRecords() {
    const container = byId('record-grid');
    const list = getRecords();
    byId('results-count').textContent = `${list.length} registro${list.length === 1 ? '' : 's'} visible${list.length === 1 ? '' : 's'}.`;

    if (!list.length) {
      container.innerHTML = '<div class="empty">No hay resultados para esa búsqueda o combinación de temas.</div>';
      return;
    }

    container.replaceChildren(...list.map(record => {
      const article = document.createElement('article');
      article.className = 'record-card';
      const tags = (record.tema_ids || []).map(id => `<span>${state.data.temas[id]?.nombre || id}</span>`).join('');
      const detailsHtml = (record.bloques || []).map(block => {
        if (block.tipo === 'texto') return `<p>${block.texto}</p>`;
        if (block.tipo === 'cita') return `<p><strong>“${block.texto}”</strong><br><small>${block.atribucion}</small></p>`;
        if (block.tipo === 'lista') return `<ul>${(block.items || []).map(item => `<li>${item}</li>`).join('')}</ul>`;
        return '';
      }).join('');
      const fieldsHtml = Object.entries(record.campos || {}).map(([key, value]) => {
        const label = state.data.campos[key]?.etiqueta || key;
        const text = Array.isArray(value) ? value.join(', ') : (value?.valor || value);
        return `<div class="field-item"><strong>${label}</strong><span>${text}</span></div>`;
      }).join('');
      const sourcesHtml = (record.fuente_ids || []).map(id => {
        const source = state.data.fuentes[id];
        if (!source) return '';
        const href = source.url_publica ? ` href="${source.url_publica}" target="_blank" rel="noopener noreferrer"` : '';
        return `<a${href}>${source.cita_publica}</a>`;
      }).join('');
      article.innerHTML = `
        <div class="record-top">
          <span class="record-type">${typeLabels[record.tipo] || record.tipo}</span>
          <span class="record-date">${formatApproxDate(record.fecha_referencia)}</span>
        </div>
        <h3>${record.titulo}</h3>
        <p>${record.resumen}</p>
        <div class="record-tags">${tags}</div>
        <details>
          <summary>Ver detalle</summary>
          <div class="record-details">
            ${detailsHtml}
            ${fieldsHtml ? `<div class="field-list">${fieldsHtml}</div>` : ''}
            ${sourcesHtml ? `<div class="source-links">${sourcesHtml}</div>` : ''}
          </div>
        </details>
      `;
      return article;
    }));
  }

  function renderSources() {
    const container = byId('sources-list');
    const list = entries(state.data.fuentes).sort((a, b) => collator.compare(a[1].cita_publica, b[1].cita_publica));
    container.replaceChildren(...list.map(([, source]) => {
      const article = document.createElement('article');
      article.className = 'source-card';
      article.innerHTML = `
        <h3>${source.cita_publica}</h3>
        <p>${source.url_publica ? new URL(source.url_publica).hostname.replace('www.', '') : 'Sin enlace público'}</p>
        ${source.url_publica ? `<a href="${source.url_publica}" target="_blank" rel="noopener noreferrer">Abrir fuente</a>` : ''}
      `;
      return article;
    }));
  }

  function renderAll() {
    renderHero();
    renderSignals();
    renderQuote();
    renderTimeline();
    renderProposals();
    renderTopicChips();
    renderRecords();
    renderSources();
  }

  async function loadData() {
    try {
      const response = await fetch('./datos-publicos.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      if (!validPublicData(data)) throw new Error('Formato incompatible');
      state.data = data;
      renderAll();
    } catch (error) {
      byId('results-count').textContent = 'No se pudo cargar el archivo público.';
      byId('record-grid').innerHTML = `<div class="empty">${error.message || 'Error al cargar datos.'}</div>`;
    }
  }

  byId('search-input').addEventListener('input', event => {
    state.search = event.target.value;
    if (state.data) renderRecords();
  });

  const navToggle = byId('nav-toggle');
  const nav = byId('main-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  loadData();
})();
