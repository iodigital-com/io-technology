---
title: 'Firebase Functions in a nutshell'
date: '2023-02-01'
tags: ['Web Development', 'cloud functions', 'firebase functions']
authors: ['mohsen-mahabadi']
summary: 'Firebase Functions is a powerful tool that allows developers to build and run backend code for their applications.'
theme: 'blue'
---

Before we begin, it should be noted that if you are not familiar with Firebase Functions, this article will get you right up to speed! If you are experienced with them, there might be some interesting pieces that you are unaware of.

Let's look at the Firebase Functions definition provided by Google:

> Cloud Functions for Firebase is a serverless framework that lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests. Your JavaScript or TypeScript code is stored in Google's cloud and runs in a managed environment. There's no need to manage and scale your own servers.

## Why do we need Firebase Functions

We no longer need to create, distribute, and maintain backend APIs thanks to Firebase Functions. For instance, when a new user signs up with Firebase Authentication and we want to store a record in our database, we also don't want to allow write access to our database from the front end, so we write and deploy a cloud function to handle that task instead. More use cases can be found [here](https://firebase.google.com/docs/functions/use-cases) if you're interested.

![The image shows a simple flow of using firebase functions.](/articles/firebase-functions/overview.png)

## Setup your project

Make sure [`Node.js`](https://nodejs.org/en/) and [`firebase-tools`](https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli) are set up on your computer before moving on because Firebase Functions run in a Node.js environment.

### Initialize your project

Open the terminal and navigate to the folder where you want to create the project.

1. Run `firebase login`
2. Run `firebase init firestore`
3. Run `firebase init functions`

After these commands complete successfully, your project structure looks like this:

```
myproject
+- .firebaserc    # Hidden file that helps you quickly switch between
|                 # projects with `firebase use`
|
+- firebase.json  # Describes properties for your project
|
+- functions/     # Directory containing all your functions code
     |
     +- .eslintrc.json  # Optional file containing rules for JavaScript linting.
     |
     +- package.json  # npm package file describing your Cloud Functions code
     |
     +- index.js      # main source file for your Cloud Functions code
     |
     +- node_modules/ # directory where your dependencies (declared in
                      # package.json) are installed
```

4. After completing the setup, you can open the source directory in your favorite IDE and copy the following code on the `index.js` file.

```javascript
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers
import * as functions from 'firebase-functions'
// the Firebase Admin SDK to access Firestore.
import * as admin from 'firebase-admin'

admin.initializeApp()
```

## Trigger Firebase Functions

There are two methods for calling Firebase Functions. The functions can be called directly by the **HTTP Triggers** method or as part of an event called **Background Triggers**.

![The image shows methods for calling firebase functions](/articles/firebase-functions/triggers.png)

We can trigger some functions when a user signs up, or trigger a function by adding, updating, or deleting a record from the database. It can be run when the database event occurs.

### HTTP Triggers

There are two ways to invoke a cloud function through the HTTP protocol: **Endpoint requests** and **Callable functions**.

#### Endpoint request

Endpoint requests allow you to trigger a function by making an HTTP request to a specific URL. This is useful for integrating with other services, or for triggering a function from a web or mobile app.

##### 1. Request functions

Add the following code to the index file we previously created:

```javascript
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send(“Hello World!”);
});
```

To publish the function to Firebase, use the following command:

```
Firebase deploy --only functions
```

Then, in Firebase's functions section, you can see the function.

![The image displays Firebase Functions' section on Firebase console](/articles/firebase-functions/firebase-functions-section.png)

After you deploy an HTTP function, you can invoke it using its own unique URL. The URL can be found by going to the functions section.

![The image shows where you can find function's URL](/articles/firebase-functions/function-url.png)

The URL includes the following, in order:

- The region (or regions) to which you deployed your function. Some production functions may need to explicitly set the location to minimize network latency.
- Your Firebase project ID
- cloudfunctions.net
- The name of your function

For example, the URL to invoke helloWorld() looks like this:

`https://us-central1-<project-id>.cloudfunctions.net/helloWorld`

##### 2. Redirecting

```javascript
exports.toGoogle = functions.https.onRequest((req, res) => {
  return res.redirect('https://www.google.com')
})
```

You will be redirected to `google.com` whenever you access this URL, such as `www.mydomain.com/toGoogle`.

#### Callable Functions

Callable functions provide a simple, secure way to invoke a function from a client app. They handle authentication and data serialization and allow you to return a response to the client directly, without the need for additional client-side code.

```javascript
exports.greeting = functions.https.onCall((data, context) => {
  const { name } = data
  return `Hello, ${name}`
})
```

Assume that a button (called callBtn) exists and that we want to call our function by clicking on it. Our greeting function will be called each time you click the button.

```javascript
const button = document.getElementById('callBtn')

button.addEventListener('click', (e) => {
  const greeting = firebase.functions().httpsCallable('greeting')
  greeting({ name: 'Rodney' }).then((res: { data: string }) => {
    console.log(res.data)
  })
})
```

##### Checking user authentication:

If in callable function we need to check whether the user is logged in or not, we can use following code:

```javascript
exports.doSomething = functions.https.onCall((data, context) => {
  if (!context.auth) {
    //user hasn't logged in
    throw new functions.https.HttpsError('unauthenticated', 'you must login.')
  }
  //do something
})
```

### Background Triggers

Background triggers refer to events that trigger a Firebase Function without an explicit request from a client. These triggers can be triggered by events such as changes to a Firebase Realtime Database, or the creation of a new user, and so on.

#### Auth Events

These triggers allow you to respond to events related to user authentication, such as the creation of a new user account, the deletion of an existing user account, or a user signing in or signing out.

##### 1. User onCreate:

This function will be triggered after adding a user.
**Note that you must return a value or promise for background triggers.**

```javascript
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  // ...
})
```

##### 2. User onDelete:

This function is triggered when a user is deleted.

```javascript
exports.deleteUser = functions.auth.user().onDelete((user) => {
  console.log('user deleted', user.email)
  return admin.firestore().collection('users').doc(user.uid).delete()
})
```

##### 3. onAuthStateChanged:

When the user's state changes, this observer is triggered. For instance, the onAuthStateChanged observer is called when the user logs in.

```javascript filename
//Auth listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // user logged in
    // do some tasks like closing modal and so
  } else {
    // user didn't log in
  }
})
```

#### Storge Events

With regard to specific Cloud Firestore events, you can create callback functions for

- **onCreate**: triggered when a document is written for the first time.
- **onUpdate**: triggered when a document already exists and has any value changed.
- **onDelete**: triggered when a document with data is deleted.
- **onWrite**: triggered when onCreate, onUpdate, or onDelete is triggered.

For instance, we'd like to know when the user collection was last updated:

```javascript
exports.updateLastUpdated = functions.firestore
  .document(`documents/{id}`)
  .onUpdate((snap, context) => {
    const previousData = snap.before.data()
    const newData = snap.after.data()
    const docId = context.params.id

    const shouldUpdateLastUpdated = previousData.lastUpdated === newData.lastUpdated

    if (shouldUpdateLastUpdated) {
      return admin.firestore().collection('documents').doc(docId).update({
        lastUpdated: Date.now(),
      })
    }

    return null
  })
```

**Firestore onSnapshot**

This method allows you to listen to a document. A document snapshot will be created after calling the callback function. Then, another call updates the document snapshot each time the contents change. You can use this function, for example, to display an exchange list and the changes over time without refreshing the page.

```javascript
firebase.firestore().collection("exchanges")
 .onSnapshot(snapshot => {
     const list = snapshot.map(item => {...item.data, id: item.id});
     console.log(list);
 });
```

#### Database Events

When events occur in your Firebase Realtime Database, you can use Firebase Functions to trigger other functions. As an example, you can use a function to automatically send a push notification to all users whenever a new message is added to a specific chat room in your database. These events include when data is written, updated, or deleted:

- **onWrite**: which triggers when data is created, updated, or deleted in Realtime Database.
- **onCreate**: which triggers when new data is created in Realtime Database.
- **onUpdate**: which triggers when data is updated in Realtime Database.
- **onDelete**: which triggers when data is deleted from Realtime Database.

```javascript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

exports.sendPushNotification = functions.database
  .ref('/chat_rooms/{chatRoomId}/messages/{messageId}')
  .onCreate((snapshot, context) => {
    const message = snapshot.val()
    const chatRoomId = context.params.chatRoomId
    const messageId = context.params.messageId

    const payload = {
      notification: {
        title: `New message in chat room ${chatRoomId}`,
        body: message.text,
        badge: '1',
        sound: 'default',
      },
    }
    return admin.messaging().sendToTopic(chatRoomId, payload)
  })
```

This function listens to the path `/chat_rooms/{chatRoomId}/messages/{messageId}` and when it detects a new message,
it gets the message value from the snapshot `snapshot.val()`, and the chatRoomId and messageId from the context. Then it creates a notification payload with the message title, body and badge, sound and sends the payload to the topic chatRoomId using the `admin.messaging().sendToTopic()` method.

Please be aware that you need to set up the Firebase Cloud Messaging service to be able to send push notifications.

#### Analytics Events

For mobile and web apps, Firebase Analytics is a free, unlimited analytics tool that offers information on user engagement and app usage. Firebase Functions can be triggered in response to events in Firebase Analytics, allowing you to automate tasks based on user behavior. For instance, you can use a function to send a push notification to users who haven't opened your app in a certain amount of time.

Here's an example of a Firebase Function that triggers when a user logs an event in Firebase Analytics, and logs the event name and parameters to the console:

```javascript
/**
 * After a user has completed a purchase, send them a coupon via FCM valid on their next purchase.
 */
exports.sendCouponOnPurchase = functions.analytics.event('in_app_purchase').onLog((event) => {
  const user = event.user
  const uid = user.userId // The user ID set via the setUserId API.
  const purchaseValue = event.valueInUSD // Amount of the purchase in USD.
  const userLanguage = user.deviceInfo.userDefaultLanguage // The user language in language-country format.

  // For purchases above 500 USD, we send a coupon of higher value.
  if (purchaseValue > 500) {
    return sendHighValueCouponViaFCM(uid, userLanguage)
  }
  return sendCouponViaFCM(uid, userLanguage)
})
```

You might want to access user attributes like the user's language and the event's value (valueInUSD) for a purchase-triggered function, as shown in this sample. This second attribute allows the sample function to test whether this is a high-value conversion event, in order to send a higher-value coupon to valuable customers.

## Conclusion

In conclusion, Firebase Functions is a powerful and flexible tool that allows developers to build and run backend code for their applications. With its integration with other Firebase services, such as Realtime Database and Firebase Analytics, it provides a seamless way to automate tasks and respond to events in real-time. Whether it's sending push notifications, logging new data, or tracking user behavior, Firebase Functions provide a simple and efficient way to add custom logic to your application.

With its serverless architecture, it eliminates the need for managing infrastructure and allows developers to focus on building great apps. Whether you're a seasoned developer or just starting out, Firebase Functions is a valuable tool to add to your toolkit.

<hr/>
**Resources**

- [Firebase Functions Tutorial](https://youtu.be/udHm7I_OvJs) by The Net Ninja
- [Cloud functions documentation](https://firebase.google.com/docs/functions) by Firebase
