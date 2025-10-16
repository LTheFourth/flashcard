const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/flashcard.js',
    '/index.html',
    '/android/android-launchericon-192-192.png',
    '/android/android-launchericon-512-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});