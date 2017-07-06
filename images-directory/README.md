# ServiceWorker Images Directory

This demo communicates with the ServiceWorker using MessageChannel API and 
retrieves the images data cached within the ServiceWorker.

ServiceWorker images directory accepts only requests that can be accessed
using appropriate `Access-Control-Allow-Origin` header and contain a 
supported `Content-Type` header. Afterwards, beautiful thumbnails are made
available to the user, to check the directory and retrieve images, this is a very
fast procedure, as the ServiceWorker communicates with the window context, using
`MessageChannel` API.

## What will I gain from creating this contrived example?

Additional experience with MessageChannel API and how it works, cross context communicatino
which has a lot more applications, such as making time consuming tasks, like getting data from the 
gyroscopic sensor or getting the geolocation centralized to the ServiceWorker.

- Caching contents on the fly, without using the fetch event handler.
- Using the Messaging APIs that come with ServiceWorker to communicate between the client
and the worker.
- Performance Enhancements such as optimistically loading the resources that are needed in the future,
  also makes the applications a lot faster.

### Basic Idea

Images can be added to the cache by specifying their URL, these images are then fetched
and if they fullfil the criteria of being an image such as having a valid image `Content-Type`
header, they are added in the cache and the user is notified that the image has been added.

This is all this application does.

#### Additional Ideas for this

These images can then be further retrieved using a special route, designed for
retrieving the image data, in order to display thumbnails of images.