(function () {
  const locationText = document.querySelector('.request-url .location');
  const locationInput = document.querySelector('#location-input');
  const sendRequestBtn = document.querySelector('#send-request');
  const responseLocation = document.querySelector('#response-location');
  const responseTemperature = document.querySelector('#response-temperature');

  sendRequestBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const location = locationInput.value;
    if (!location || !location.trim()) return;
    locationText.textContent = location;

    // Send request to get the weather
    getWeather(location).then(weatherData => {
      console.log('Get weather data');
      responseLocation.textContent = weatherData.location;
      responseTemperature.textContent = weatherData.temperature + weatherData.unit;
    }).catch(error => {
      console.error('Error occured while request weather');
      console.error(error);
    });
  });
  
  // Mandatory ServiceWorker registration 
  // in order for this demo to work
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(function (registration) {
        console.log('ServiceWorker has registered');
      })
      .catch(function (error) {
        console.error('error occured while registrering a service worker');
      });
  }

  function getWeather(location) {
    const baseUrl = 'https://fabulousweather.online/?location=' + location;
    return fetch(baseUrl, {
      headers: { 'X-Mock-Response': 'yes'},
      method: 'GET',
    }).then(response => response.json());
  }
}())
