// ServiceWorker 
// Mocks responses to the requests that match a certain
// criteria and include the header needed to mock the requests

// Requests without the Mock related header are sent to the network
// and aren't mocked
self.addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  console.log('Request To Service Worker')

  if (
    request.url.match(/fabulousweather.online/ig) &&
    request.headers.has('x-mock-response')
  ) {
    return fetchEvent.respondWith(mockWeatherResponse(request));
  }

  return fetchEvent.respondWith(fetch(request));
});


function mockWeatherResponse(request) {
  let weatherLocation = request.url.match(/location=(.*)&?/i)

  // Default location is Omaha, NE (Omaha, Nebraska)
  // City of Warren Buffet
  if (!weatherLocation || !weatherLocation[1]) {
    weatherLocation = 'Omaha, NE';
  } else {
    weatherLocation = decodeURIComponent(weatherLocation[1]);
  }

  const tempResponse = {
    unit: '°C',
    temperature: randomNumberInRange(0, 44),
    location: weatherLocation,
  }

  const headers = addMockHeader({});
  const initOptions = addMockHeader({ status: 200, statusText: 'OK', headers });

  return new Response(JSON.stringify(tempResponse), initOptions);
}

function addMockHeader(headers) {
  headers['X-Mock-Response'] = 'yes';
}

/**
 * Responds with a random number within a given range
 */
function randomNumberInRange(minVal, maxVal) {
  const randomVariation = Math.ceil(Math.random() * (maxVal - minVal));
  return minVal + randomVariation;
}
