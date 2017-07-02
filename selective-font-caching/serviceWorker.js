const CACHE_PREFIX = 'cache';
const CACHE_VERSION = 1;
const CACHE_NAMES = ['main', 'font', 'images', 'styles'];
const CURRENT_CACHES = {};

const EXPECTED_CACHE_NAMES = CACHE_NAMES.map(c => `${CACHE_PREFIX}-${c}-${CACHE_VERSION}`);
CACHE_NAMES.forEach((c, i) => CURRENT_CACHES[c] = EXPECTED_CACHE_NAMES[i]);

self.addEventListener('install', function (installEvent) {
  installEvent.waitUntil(
    self.caches.open(CURRENT_CACHES['main']).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './main.js',
        './styles.css'
      ]);
    })
  )
});

self.addEventListener('activate', function(activateEvent) {
  activateEvent.waitUntil(
    deleteCaches(EXPECTED_CACHE_NAMES)
  );
});

self.addEventListener('fetch', function(fetchEvent) {
  const request = fetchEvent.request;
  let finalResponse;
  
  // Check for the request in every cache that is there
  finalResponse = caches.match(request).then(cachedResponse => {
    if (cachedResponse) {
      return cachedResponse;
    } else {
      return fetchRequest(request);
    }
  });

  fetchEvent.respondWith(finalResponse);
});

/**
 * Delete the Caches that are stale or are unnecessary,
 * in order to keep the storage of the browser to a low level
 */
function deleteCaches(expectedCacheNames) {
  return self.caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => {
      if (expectedCacheNames.indexOf(cacheName) === -1) {
        return self.caches.delete(cacheName);
      }

      return Promise.resolve();
    }));
  })
}

function fetchRequest(request) {
  if (request.url.match(/fonts./ig)) {
    return caches.open(CURRENT_CACHES['font']).then(cache => {
      return fetch(request).then(response => {
        console.log('Response for %s is received from the network %O', request.url, response);
        if (response.status < 400) {
              console.log('Caching the response to ', request.url);
              cache.put(request, response.clone());
        }

        return response;
      });
    });
  }

  return fetch(request);
}