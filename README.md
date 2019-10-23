# JSON-based REST API service which resizes images into 100x100px thumbnails.
---

This application is fully built in Node JS. 

**How to run and test your service**
* To run and test the service
    * Run `docker-compose up` inside root folder.

**Available API Endpoints**

1. **THUMBAIL API** :
Requires a valid `filename` parameter.
**Example** : `http://localhost:3000/thumbnail?filename=pikachu.png`
**API Type** : GET
**Return value**: A json containing status and a id/error message. 
**Sample Valid filenames**: butterfly.jpg, car.jpg, minion.png, nodejs.png, pikachu.png

2. **STATUS API** :
Requires a valid `id` parameter.
**Example** : `http://localhost:3000/status?id=1`
**API Type** : GET
**Return value**: A thumbnail in 100X100px(for valid id after processing in finished). 
Else, a json containing current status and message.

**Following libraries are used:**

`express` : To provide a server and actual REST APIs for generating the thumbnails.
*Express JS integrated pretty well with Node JS to establish routes for serving REST APIS endpoints. It can furthur integrate with Angular/React Client Application for following a server-client architecture.*

`worker-farm` : To facilitate worker threads for I/O intensive tasks.
*Image processing can be an I/O intensive task. Worker farm enables worker threads to carry the image processing required for thumbnails in a asyncronous way by spinning up multiple JVMs to be controlled by Node. An important feature of Worker Farm is call durability. If a child process dies for any reason during the execution of call(s), those calls will be re-queued and taken care of by other child processes.*

`fs`: Node JS file streaming library.
*Node.js file system module to enable working with the file system on the computer. Can be used asyncronously with the pipe() method for streaming large files avoiding large memory consumption.*

`sharp`: Image processing library to resize the image into 100X100px thumbnails.
*High performance Node.js image processing. The fastest module to resize JPEG, PNG, WebP and TIFF images. Resizing an image is typically 4x-5x faster than using the quickest ImageMagick and GraphicsMagick settings. Easy to setup is a brownie point.*

`jest`: To make testcases for the Node JS application.
*Jest is a JavaScript Testing Framework with a focus on simplicity. Jest is maintained by a community of open source contributors and Facebook employees.*

**Future Improvements**

* The ID status management is currently managed in memory. It can be further made stable and robust by maintaining in a persistent DB. NodeJS has a good integration support with MongoDB.
* Currently the worker threads are not limited. To scale up the application, worker queues can be maintained where the workers are set to a limit value and they can consume tasks from the queue when idle. https://www.npmjs.com/package/queue is a great library for asynchronous function queue with adjustable concurrency.
* Current test cases perform the basic unit testing. Integration tests (with thumbnail and status API) can be written along with stress testcases to check the limits of application.
Also, the file extensions are limited to few supported formats such as PNG, JPG etc. The user should get understandable error message if image format is not recognized by image processing library.
* Monitoring tool can be setup with open source tools such as Prometheus to gain real time metrics in time series database.
* The sample images are stored in the /asset folder. In future, the client could be able to specify external links or change external image files dynamically.
* The application could support webhooks to notify client when the image is finished processing.
* The application could be deployed in production environment. One of the way is to use the AWS cloud for production environment. AWS Lambda has good support for NodeJS applications. Additionally, AWS API Gateway can be used to configure the REST API endpoints, AWS Cognito to manage the users and Amazon CloudWatch Logs to monitor the logs.