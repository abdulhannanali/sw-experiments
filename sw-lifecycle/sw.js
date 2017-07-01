// A very basic service worker to just complete the installation
// process, does nothing useful really

self.addEventListener('install', function(installEvent) {
  console.log('ServiceWorker: Install Event');
  console.log('Slight change to service worker');
  console.log('change');
  console.log('another change');
  installEvent.waitUntil(caches.open('v1').then(cache => {
    return cache.addAll([
      'https://avatars2.githubusercontent.com/u/1342004?v=3',
      'https://avatars2.githubusercontent.com/u/1342004?v=3',
    ]);
  }));
});

self.addEventListener('activate', function activateEvent(activateEvent) {
  console.log('ServiceWorker: Activate Event');

  self.clients.claim();
  console.log(activateEvent);
});