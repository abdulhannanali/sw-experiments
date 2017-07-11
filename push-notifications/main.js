(function () {
  const pushButton = document.querySelector('button#push');
  const appServerPublicKey = 'BEM7pwJF4cHITj3zjCLHd-JQ4rflCy4sZYOVM6okzrpj_iw0xjwFXuZ6pB0psilz7o6sEwaq4ETKXLCy8YD1ckA'
  const subscriptionServer = 'http://f06250f6.ngrok.io'
  
  let isSubscribed;
  let swRegistration;

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('ServiceWorker and Push is supported');
    navigator.serviceWorker.register('./service-worker.js')
      .then(function (swReg) {
        console.log('ServiceWorker is registered');
        swRegistration = swReg;
        initialiseUI();
      })
      .catch(function (error) {
        console.error(error);
        pushButton.innerHTML = 'ServiceWorker failed to register';
      });
  } else {
    pushButton.innerHTML = 'Push Messaging is not supported';
  }

  /**
   * Initializes the UI
   */
  function initialiseUI() {
    pushButton.addEventListener('click', function clickEvent(event) {
      pushButton.disabled = true;
      if (isSubscribed) {
        // TODO Unsubscribe the user from push notification
        unsubscribeUser();
      } else {
        // Subscribe the user
        subscribeUser();
      }
    });

    // Initialization of Service Worker Subscription status
    // and what happens with this
    swRegistration.pushManager.getSubscription()
      .then(function (subscription) {
        isSubscribed = subscription !== null;
        if (isSubscribed) {
          updateSubscriptionUI(subscription);
          updateSubscriptionOnServer(subscription);
          updateBtn();
          console.log('User is subscribed');
        } else {
          console.log('User is not subscribed');
        }

        updateBtn();
      })
  }

  /**
   * Updates the Button to represent the subscription status
   */
  function updateBtn() {
    // Checking if the Permissions for the Notifications are denied
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked.';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }

    pushButton.textContent = isSubscribed ? 'Disable Push Messaging' : 'Enable Push Messaging';
    pushButton.disabled = false;
  }

  /**
   * Subscribes the User to PushManager in order to get push notifications
   */
  function subscribeUser() {
    const appServerKey = urlB64ToUint8Array(appServerPublicKey);
    return swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appServerKey,
    })
    .then(function (subscription) {
      console.log('User is subscribed.')
      updateSubscriptionOnServer(subscription);
      updateSubscriptionUI(subscription);
      isSubscribed = true;
      updateBtn();
    })
    .catch(function (error) {
      console.log('Failed to subscribe the user: ', error);
      updateBtn();
    });
  }

  function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
      .then(function (subscription) {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(function (error) {
        console.error('Error unsubscribing: ', error);
        throw error;
      })
      .then(() => {
        updateSubscriptionOnServer(null);
        updateSubscriptionUI();
        console.log('User is unsubscribed');
        isSubscribed = false;
        updateBtn();
      });
  }
  
  // Updates the Subscription on Server
  function updateSubscriptionOnServer(subscription) {
    // TODO: Make a Request to Server in order to update subscription
    //       in future.
    console.log('Updating Subscription on Server');
    console.log(subscription);
  }

  /**
   * Updates the UI of Subscription
   */
  function updateSubscriptionUI(subscription) {
    const pushSubscription = document.querySelector('.push-subscription');
    const pushSubscriptionDetails = document.querySelector('.push-subscription .details');

    if (subscription) {
      pushSubscriptionDetails.innerHTML = JSON.stringify(subscription);
      pushSubscription.classList.remove('is-invisible');
    } else {
      pushSubscription.classList.add('is-invisible');
    }
  }


  /*
   * The given public server key is safe url encoded base64 key
   * and needs to be decoded
   * 
   * This code is copied as it is from the completed demo
   * https://github.com/GoogleChrome/push-notifications/blob/master/completed/08-push-subscription-change/scripts/main.js#L32-L45
   */
  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function safeUrlToBase64 () {

  }
})();
