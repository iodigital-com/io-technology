---
title: 'Project Fugu'
date: '2023-04-14'
tags: ['frontend', 'web-capabilities', 'project-fugu']
images: ['/articles/project-fugu/header.webp']
summary: Cross-platform development is hard. Each platform has its specific implementation of an API and you end up with separate apps for each platform. Multiple frameworks try to fix this issue by creating an abstract between the platform and the application. Browser vendors are doing the same and it's called Project Fugu.
authors: ['lucien-immink']
theme: 'rouge'
---

Cross-platform development is hard. Features and capabilities of an application require you to think about how it needs to be implemented in different platforms like Android, iOS, Web, Windows, MacOS and Linux. If you, for example, need to access the address details of a contact that is stored on a device you need to implement a contact picker for all the different platforms you want to support or you need to come up with a completely custom implementation. Custom implementations are probably not what you want to do. It can become quite messy quite fast.

So what can you do?

What about an abstraction layer between the OS native API and a common top layer, which is preferably written in a well-known set of languages that can handle UIs with a breeze, like HTML, CSS and JavaScript? Here we are describing a framework like Apache Cordova, previously known as PhoneGap. These _hybrid_ applications combine web languages with a wrapper for the OS native APIs. Hybrid cause they use web technology packaged as apps for distribution and have access to native device APIs.

While technology like Apache Cordova enables developers to build one UI for multiple platforms they still have to build the application for all the platforms they want to support and sometimes the support for a platform or specific feature is a bit flaky.

But what about the web platform itself? Progressive Web Apps (PWAs) bring offline support and _app-like_ experiences to the web. Extending the PWA principle with APIs to include more native APIs while keeping the principles of the web (trust, privacy and security) is the core of Project Fugu 🐡.

## Project Fugu

Project Fugu 🐡 is an effort to close gaps in the web's capabilities enabling new classes of applications to run on the web. APIs that Project Fugu is delivering enable new experiences on the web while preserving the web's core benefits of security, low friction, and cross-platform delivery. All Project Fugu API proposals are made in the open and on the standards track.

![Schema of the elements of a URL](/articles/project-fugu/api-call-abstraction.webp)

Fugu is organized as a Chromium project, open to all Chromium contributors and organizations. Today, that includes Microsoft, Intel, Samsung, Electron and Google (among others). Fugu Leads triage incoming requests from partners, determine demand, prioritize them, find champions, track development, and help organize the release and documentation for the capability.

![Schema of the elements of a URL](/articles/project-fugu/adding-apis.webp)

Let's take a look at some of the features that have already been released:

### Async Clipboard access

The original clipboard API is synchronized, meaning that it blocks access to the JavaScript thread as long as it is active. This is ok for handling small amounts of data like a single line of plain text but it would be a bad user experience for larger chunks of data like an image or a video. Another downside is that it could only read and write to the DOM. Project Fugu introduced async clipboard access. The async clipboard API is based on a well-defined permission model that doesn't block the page.

#### Writing text to the clipboard

To copy text to the clipboard call `writeText()`. Since this API is asynchronous, the `writeText()` function returns a Promise that resolves or rejects depending on whether the passed text is copied successfully:

```javascript
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
```

Support for `writeText()` clipboard has been added since Chrome 66, Firefox 63, Edge 79 and Safari 13.1 and thus is widely available on all platforms and browsers.

#### Writing data to the clipboard

To copy raw data to the clipboard the data needs to be a `blob` meaning that all forms of data that are available as a `blob` can be copied to the clipboard, including canvas and images/video (using fetch).

```javascript
try {
  const imgURL = '/images/generic/file.png'
  await navigator.clipboard.write([
    new ClipboardItem({
      // Set the mimetype beforehand and write a promise as the value.
      'image/png': await fetch(imgUrl)?.blob(),
    }),
  ])
  console.log('Image copied.')
} catch (err) {
  console.error(err.name, err.message)
}
```

Support for `write()` clipboard has been added since Chrome 66, Firefox 63 (only desktop), Edge 79 and Safari 13.1 and thus is widely available on most platforms and browsers.

#### Reading from the clipboard

The `navigator.clipboard.read()` method is also asynchronous and returns a promise. To read an image from the clipboard, obtain a list of `ClipboardItem` objects, then iterate over them.

Each `ClipboardItem` can hold its contents in different types, so you'll need to iterate over the list of types, again using a `for...of` loop. For each type, call the `getType()` method with the current type as an argument to obtain the corresponding blob. As before, this code is not tied to images and will work with other future file types.

```javascript
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type)
        console.log(URL.createObjectURL(blob))
      }
    }
  } catch (err) {
    console.error(err.name, err.message)
  }
}
```

Support for `read()` clipboard has been added since Chrome 86, Firefox 90 (only desktop), Edge 79 and Safari 13.1 and thus is widely available on most platforms and browsers.

### Badging API

The Badging API gives web developers a method of setting a badge on a document or application, to act as a notification that the state has changed without displaying a more distracting notification. A common use case for this would be an application with a messaging feature displaying a badge on the app icon to show that new messages have arrived.

#### Types of badges

There are two types of badges:

- Document badges are typically shown in the browser tab near or on the page icon.
- App badges, which are associated with the icon of an installed web app. These may display on the app icon in the dock, shelf, or home screen depending on the device in use.

#### Badge states

- `nothing`: Indicating that no badge is currently set. A badge can be in this state due to it being cleared by the application, or being reset by the user agent.
- `flag`: Indicating that the badge is set, but has no specific data to display. A badge will be in this state if the application has set a badge, but has not passed any value to the method.
- `<int>`: A value passed when setting the badge. This value will never be 0, passing a value of 0 when setting a badge will cause the user agent to clear the badge by setting it to `nothing`.

```javascript
navigator.setClientBadge() // set a badge
navigator.clearClientBadge() // clear the badge
navigator.setAppBadge(12) // set 12 as app badge
```

### WebOTP API

These days, most people in the world own a mobile device and developers are commonly using phone numbers as an identifier for users of their services.

There are a variety of ways to verify phone numbers, but a randomly generated one-time password (OTP) sent by SMS is one of the most common. Sending this code back to the developer's server demonstrates control of the phone number.

The WebOTP API lets your app receive specially-formatted messages bound to your app's domain. From this, you can programmatically obtain an OTP from an SMS message and verify a phone number for the user more easily.

```html
<form>
  <input autocomplete="one-time-code" required />
  <input type="submit" />
</form>
```

```javascript
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    ...
    const ac = new AbortController();
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
    }).catch(err => { /* ... */ });
  });
}
```

Learn more about how to implement webOTP: [https://developer.chrome.com/articles/web-otp/](https://developer.chrome.com/articles/web-otp/).

Support for webOTP has been added since Chrome 93, Edge 93. Firefox and Safari have no support, meaning that webOTP is not readily available yet.

### File System Access

[Dave Bitter](https://techhub.iodigital.com/authors/dave-bitter) has written an excellent article about [File system access](https://techhub.iodigital.com/articles/the-file-system-access-api)

## Features in the pipeline

Some of the features that are being developed or considered at the moment

- Changing system settings API
- Geofencing
- Splash screen
- Remote desktop control
- Call dialer/answering/control

## ...but what about the other one?

Project Fugu can offer a great experience, but only if the browser supports these APIs. Safari (and thus iOS and iPad OS) are not actively part of project fugu and have been slow with implementing APIs that extend the functionality of the web, like service worker and push notifications. Perhaps that will change, but it might not. Who knows if Apple will ever allow (is forced to) other browser engines on iOS and iPadOS. Having APIs fully specced and tested has a positive effect on browsers without an implementation since they can follow what has been laid out before them.

## Closing thoughts

Cross-platform development is hard. Features and capabilities of an application require you to think about how it needs to be implemented in different platforms like Android, iOS, Web, Windows, MacOS and Linux. If you, for example, need to access the address details of a contact that is stored on a device you need to implement a contact picker for all the different platforms you want to support or you need to come up with a completely custom implementation. Custom implementations are probably not what you want to do. It can become quite messy quite fast.

So what can you do?

Progressive Web Apps (PWAs) bring offline support and _app-like_ experiences to the web. Extending the PWA principle with APIs to include more native APIs while keeping the principles of the web (trust, privacy and security) is the core of Project Fugu 🐡.

Some of these APIs are readily available and should be considered when that feature is needed, like for example the async clipboard API. Other APIs though are only available in certain browsers, like the webOTP API so handle them with care and consult the online references.

Who knows if Apple will ever allow (is forced to) other browser engines on iOS and iPadOS. Having APIs fully specced and tested has a positive effect on browsers without an implementation since they can follow what has been laid out before them.
