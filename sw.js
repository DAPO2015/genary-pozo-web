/* GitHub Pages: caché de páginas y activos. El JSON siempre intenta red antes que caché. */
const CACHE = 'genary-shell-v22';
const SHELL = [
  './','./index.html','./propuestas.html','./eje.html','./trayectoria.html','./explorar.html','./detalle.html','./fuentes.html','./preguntas.html',
  './styles.css?v=22','./app.js?v=22','./datos-publicos.json','./config-publico.json','./assets/favicon.png','./assets/favicon-32.png','./favicon.ico','./apple-touch-icon.png','./assets/logo-alcalde.webp',
  './assets/logo-centro-democratico.webp','./assets/genary-hero.webp'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('genary-')&&key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/datos-publicos.json')||url.pathname.endsWith('/config-publico.json')){
    event.respondWith(caches.open(CACHE).then(async cache=>{
      try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok)cache.put(event.request,response.clone());return response;}
      catch{return (await cache.match(event.request))||Response.error();}
    }));return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(caches.open(CACHE).then(async cache=>{
      try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok)await cache.put(event.request,response.clone());return response;}
      catch{return (await cache.match(event.request))||(await cache.match('./'+url.pathname.split('/').pop()))||Response.error();}
    }));return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok&&(/\.(?:html|css|js|png|webp|otf|woff2)$/i.test(url.pathname)||url.pathname.endsWith('/'))){
      const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    }
    return response;
  })));
});
