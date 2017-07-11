self.addEventListener('push', function pushFunction(event) {
  console.log('[ServiceWorker] Push Received.');
  console.log('[ServiceWorker] Push had this data: ' + event.data.text());

  const title = 'Push Codelab';
  const options = { 
    body: event.data.text(),
    icon: 'no-camera.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  console.log('ServiceWorker Notification click Received');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://hannan.world')
  );
});