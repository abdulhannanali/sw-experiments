const CACHE_VERSION = 3;
const MAIN_CACHE = 'main-cache-' + CACHE_VERSION;

// Name of the Cache that contains images
const IMAGES_DIRECTORY_CACHE = 'images-directory-cache-v' + CACHE_VERSION;
const mainFiles = ['/', '/styles.css', '/main.js', '/favicon.ico'];

self.addEventListener('install', function (installEvent) {
  const cachedResources = self.caches.open(MAIN_CACHE).then(cache => {
    return cache.addAll(mainFiles);
  }).then(function () {
    // Caching complete message sent to all the ServiceWorkers
    // including uncontrolled and of all types
    self.clients.matchAll({
      includeUncontrolled: true,
      type: 'all',
    }).then(matchedClients => {
      return Promise.all(
        matchedClients.map(client => {
          return client.postMessage('Installation for the Cache Complete');
        })
      );
    });
  });

  installEvent.waitUntil(cachedResources);
})

self.addEventListener('activate', function (activateEvent) {
  const deletedCaches = self.caches.keys().then(cacheKeys => {
    return Promise.all(cacheKeys.map(key => {
      return key !== MAIN_CACHE ? caches.delete(key) : Promise.resolve();
    }));
  });

  activateEvent.waitUntil(deletedCaches);
});

self.addEventListener('fetch', function (fetchEvent) {
  const request = fetchEvent.request;
  fetchEvent.respondWith(
    self.caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      } else {
        return fetch(request);
      }
    })
  )
});

self.addEventListener('message', function (messageEvent) {
  const data = messageEvent.data;
  const mPort = messageEvent.ports[0];
  let request;

  if (data.url) {
    request = new Request(data.url);
  }

  if (data.hasOwnProperty('command')) {
    self.caches.open(IMAGES_DIRECTORY_CACHE).then(cache => {
      switch (data.command) {
        case 'submit':
          fetchImage(request).then(response => (
            cache.put(request, response)
          )).then(function () {
            mPort.postMessage({ success: true, error: null });
          })
          .catch(function (error) {
            if (error instanceof TypeError) {
              mPort.postMessage({ success: false, error: 'Requested `url` is not an image'});
            } else {
              mPort.postMessage({ success: false, error: 'Failed to cache the image'});
            }
          });
          break;
        case 'delete':
          cache.delete(request).then(function (success) {
            mPort.postMessage({ success, error: success ? null : 'Item does not exist in the cache' })
          });
          break;
        case 'list':
          cache.keys().then(cacheKeys => {
            const urls = cacheKeys.map(request => request.url);
            mPort.postMessage({ list: urls, error: null, success: true });
          });
          break;
        default:
          throw new Error('Failed to handle the given `command`')
          break;
      }
    }).catch(error => {
      console.error('Failed to handle the command');
      mPort.postMessage({ error: error.toString(), success: false });
    })
  }
});


/**
 * Caches only the Request along with the Repsonse 
 * if the Content-Type is of an image
 */
function fetchImage(url) {
  return fetch(url).then(response => {
    const imageHeader = response.headers.get('Content-Type');
    if (imageHeader && imageHeader.match(/image\/.*/ig)) {
      return response;
    } else {
      throw new TypeError('Image is not of the expected type');
    }
  });
}

function cachingComplete() {
  self.clients.matchAll().then(matchedClients => {
    const sentMessages = matchedClients.map(client => {
      return client.postMessage('ServiceWorker has cached the resources required to run the application');
    });

    return Promise.all(sentMessages);
  })
}