// Change this to your repository name
var GHPATH = '/flashcard';

// Choose a different app prefix name
var APP_PREFIX = 'gppwa_';

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_00';

// The files to make available for offline use. make sure to add 
// others to this list
var URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/styles.css`,
    `${GHPATH}/flashcard.js`,
    `${GHPATH}/android/android-launchericon-192-192.png`,
    `${GHPATH}/android/android-launchericon-512-512.png`,
]

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