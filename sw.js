const CACHE_NAME = 'psb-calendar-v1';
const URLS_TO_CACHE = [
    'index.html',
    'admin.html',
    'style.css',
    'admin.css',
    'script.js',
    'admin.js',
    'responsive.css',
    'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                // Return cached, but also update cache in background
                const fetchPromise = fetch(event.request).then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => {});
                return cached;
            }
            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200) return response;
                if (response.type === 'basic' || event.request.url.startsWith('https://fonts.')) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
