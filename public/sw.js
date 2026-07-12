self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('supabase') || url.pathname.includes('auth')) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(r => r)
      .catch(() => caches.match(e.request).then(r => r || new Response('Offline', { status: 503 })))
  );
});
