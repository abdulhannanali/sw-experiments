const CACHE_VERSION = 4;
const MAIN_CACHE = 'cache-main-v' + CACHE_VERSION;
const precachedPages = [
  '/offline',
  '/',
  '/index.html',
  '/index',
  '/styles.css',
  '/worldwideweb.jpg',
  '/main.js'
]

self.addEventListener('install', function (installEvent) {
  console.log('ServiceWorker: Installing ServiceWorker')
  installEvent.waitUntil(self.caches.open(MAIN_CACHE).then(cache => (
    cache.addAll(precachedPages)
  )));
});

self.addEventListener('activate', function (activateEvent) {
  activateEvent.waitUntil(self.caches.keys().then(cacheKeys => (
    Promise.all(cacheKeys.map(key => (
      key !== MAIN_CACHE ? self.caches.delete(key) : undefined
    )))
  )));
});

self.addEventListener('fetch', function (fetchEvent) {
  const request = fetchEvent.request;
  console.log('ServiceWorker: Fetch Event');
  fetchEvent.respondWith(self.caches.match(request).then(cachedResponse => {
    if (cachedResponse) {
      return cachedResponse;
    } else {
      return fetch(request).then(response => {
        // if request is successful return the response as it is
        return response;
      }).catch(error => {
        // In case of any error to the request we are going to present an offline page
        return self.caches.match('/offline');
      });
    }
  }));
})