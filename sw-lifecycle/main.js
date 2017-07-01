(function () {
  const isAvailable = 'serviceWorker' in navigator;
  const controlledElem = document.getElementById('controlled');
  const registerElem = document.getElementById('registration');
  const scopeElem = document.getElementById('scope');
  const state = document.getElementById('state');
  const serviceWorkerStates = document.getElementById('serviceworker-states');

  showAvailablity(isAvailable);
  if (isAvailable) {
    registerServiceWorker();
  }

  // Shows if the ServiceWorker related APIs are available in the browser
  // Required for further information regarding service workers
  function showAvailablity(availablity) {
    const available = document.body.querySelector('#available');
    const parentAvailability = document.getElementById('availability');
    available.textContent = availablity ? 'available' : 'not available';
    
    if (!isAvailable) {
      const notAvailableNote = document.createElement('div');
      notAvailableNote.className = 'danger not-available-note'
      notAvailableNote.innerHTML = `
        If service worker is not available no other information can be get
      `
      
      parentAvailability.appendChild(notAvailableNote);
    }
  }

  function displayRegistration(registration = true) {
    const resultText = registration ? 'successful' : 'failed';
    registerElem.innerHTML = 'Registration was <span>' + resultText + '</span>';
  }

  /**
   * Displays the ServiceWorker required to be used
   * @param {ServiceWorker} serviceWorker
   * @returns {undefined}
   */
  function displayServiceWorker(serviceWorker) {

  }

  function registerServiceWorker () {
    const serviceWorker = navigator.serviceWorker;
    // This is the interface related to `ServiceWorkerContainer`
    // This provides an exposed interface related to serviceWorker regarding functionalities
    // We can get the status of the serviceworker status from here
    
    serviceWorker.register('./sw.js').then(function (registration) {
      let sw;
      
      displayRegistration(true);
      scopeElem.textContent = registration.scope;
      if (serviceWorker.controller) {
        controlledElem.innerText = 'ServiceWorker is currently controlled';
      } else {
        controlledElem.innerText = 'ServiceWorker is not controlled';
      }
      
      if (registration.installing) {
        sw = registration.installing;
        state.innerHTML = 'installing';
      } else if (registration.waiting) {
        sw = registration.waiting;
        state.innerHTML = 'waiting';
      } else if (registration.active) {
        sw = registration.active;
        state.innerHTML = 'active';
      }

      registration.addEventListener('updatefound', function (event) {
        console.log('Update found');
      });

      // State Changes to the Service Worker
      sw.addEventListener('statechange', function (e) {
        const stateElem = document.createElement('li');
        stateElem.textContent = e.target.state;
        serviceWorkerStates.appendChild(stateElem);
      });
    }).catch(error => {
      displayRegistration(false);
    });
  }
}());