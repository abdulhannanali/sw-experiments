if ('serviceWorker' in navigator) {
  const SERVICE_WORKER_SCOPE = './';
  navigator.serviceWorker.register('./serviceworker.js').then(registration => {
    console.log('ServiceWorker has registered successfully');
  }).catch(error => {
    console.error('Failed to register ServiceWorker, some syntax or other unexpected error might have occured in the script')
  });
}