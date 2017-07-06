(function () {
  // Button controls to interact with the images caches
  const submitImageBtn = document.querySelector('button#submit-image');
  const deleteImageBtn = document.querySelector('button#delete-image');
  const listImagesBtn = document.querySelector('button#list-images');
  const imageInput = document.querySelector('input#image-input');
  const swStatus = document.querySelector('#service-worker-status');
  const swDemo = document.querySelector('.demo');
  let activeSw;

  submitImageBtn.addEventListener('click', function (clickEvent) {
    const url = inputVal();
    sendMessage({ command: 'submit', url })
      .then(function (data) {
        logger.logAdd(url);
      })
      .catch(function (error) {
        logger.logError(error);
      });
  });

  deleteImageBtn.addEventListener('click', function (deleteEvent) {
    const url = inputVal();
    sendMessage({ command: 'delete', url: inputVal() })
      .then(function (data) {
        logger.logDelete(url);
      })
      .catch(function (error) {
        logger.logError(error);
      });
  });

  listImagesBtn.addEventListener('click', function (listEvent) {
    sendMessage({ command: 'list' })
      .then(function (data) {
        if (data.success && data.list) {
          const list = data.list;
          imagesList.renderList(list);
        }
      })
      .catch(function (error) {
        console.error(error);
        logger.logError(error);
      });
  });

  /**
   * Send a message to service worker with the given data
   * @param {Object} data data to be sent to the user
   */
  function sendMessage(data) {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const port1 = channel.port1;
      activeSw.postMessage(data, [ channel.port2 ]);
      port1.onmessage = function messageHandler(event) {
        const data = event.data;
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
          // Doing this so garbage collector can collect this function
          port1.onmessage = null;
        }
      }
    });
  }

  const logger = {
    logElement: document.querySelector('.status #log'),
    logAdd: function log(url) {
      this.logElement.innerHTML = `<p><a href="${url}">${url}</a> has been added to the cache</p>`
    },
    logDelete: function logDelete(url) {
      this.logElement.innerHTML = (
        `<p><a href="${url}">${url}</a> has been deleted from the cache</p>`
      );
    },
    logError: function logError(error) {
      // TODO Log the Error as needed
      this.logElement.innerHTML = `<p style="color: red;">${error.toString()}</p>`
    },
    logList: function logList() {
      // TODO Update the log method as needed
      this.logElement.innerHtml = 'List updated!'
    },
  };

  const imagesList = {
    listElement: document.getElementById('images-list'),
    
    emptyList: function () {
      this.listElement.innerHTML = '';
    },

    addImage: function (url) {
      const elem = document.createElement('img');
      elem.src = url;
      elem.className = 'image-thumb'
      elem.alt = 'Thumbnail for a cached image';
      this.listElement.appendChild(elem);
    },

    noItemsRender: function () {
      this.listElement.innerHTML = `
        <div class="no-images">There are no images in the cache</div>
      `
    },

    // Renders the List of images with it's thumbnails
    renderList: function (urlList) {
      this.emptyList();
      if (urlList.length === 0) {
        this.noItemsRender();
      } else {
        urlList.forEach(this.addImage.bind(this));
      }

    }
  }

  function inputVal() {
    return imageInput.value;
  }

  function displayDemo() {
    swDemo.style.display = '';
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.onmessage = function (event) {
      console.log('Message received from the service worker');
      console.log('Date received: ' + event.data);
    };

    navigator.serviceWorker.register('./service-worker.js')
      .then(function () {
        console.log('ServiceWorker has registered');
        if (navigator.serviceWorker.controller) {
          activeSw = navigator.serviceWorker.controller;
          displayDemo();
        } else {
          navigator.serviceWorker.ready.then((reg) => {
            activeSw = reg.active;
            swStatus.innerHTML = 'ServiceWorker has registered and is ready';
            displayDemo();
          });
        }
      })
      .catch(function () {
        swStatus.innerHTML = '<p style="color: red;">ServiceWorker failed to register</p>'
      })
  }
}());