const VERSION = 'genary-shell-v2';
const CORE = [
  './', './index.html', './styles.css', './app.js', './datos-publicos.json',
  './assets/logo-alcalde.webp', './assets/genary-hero.webp', './assets/genary-cercano.webp', './assets/favicon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('genary-') && key !== VERSION).map(key => caches.delete(key)))),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('/datos-publicos.json')) {
    event.respondWith(
      caches.open(VERSION).then(async cache => {
        try {
          const response = await fetch(event.request);
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        } catch {
          return (await cache.match(event.request)) || Response.error();
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok && (/\.(?:css|js|png|webp|jpg|jpeg)$/i.test(url.pathname) || url.pathname.endsWith('/index.html'))) {
        const copy = response.clone();
        caches.open(VERSION).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
