# Mock Responses

Mock Responses will use a ServiceWorker to mock responses to several API calls, 
and will return mocked response for them. For this purpose, I am going to use a particular
header that should be used in order to mock the API Response Calls.

In this demo, mock api returns fake weather information for a given location Not a lot of validation, 
is done on the service worker side, so it's always going to return the weather information,
without validating. `Celsius` is used as a unit for all the requests.

Here's the sample request for the Weather

```
https://fabulousweather.online/temperature/?location="Cambridge, MA"
```

This will return a response along these lines

```json
{
    "temperature": 32,
    "unit": "C",
    "location": "Cambridge, MA"
}
```