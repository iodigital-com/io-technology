---
title: 'The future of page transitions with Shared Element Transitions'
date: '2022-06-22'
tags: ['frontend', 'css', 'js']
images: ['/articles/the-future-of-page-transitions-with-shared-element-transitions/header.jpg']
summary: 'The Shared Element Transitions API allows creating page transitions using a browser API that can provide users with a better visual connection between page-a and page-b by transitioning shared elements on both pages.'
authors: ['milan-vogels']
theme: 'orange'
---

In native mobile app development transitioning from one page/state to another is something that has been supported for a long time. For example, you can do this using [Activity transitions](https://developer.android.com/training/transitions/start-activity) for Android. For the web, however, things aren't all that easy.

Yes, we can create transitions between pages using libraries like [BarbaJs](https://barba.js.org/). But these don't provide any visual connection between page-a and page-b to the user. So to close the gap, a new browser API is in the works: Shared Element Transition API.

The [Shared Element Transition](https://github.com/WICG/shared-element-transitions/) is a proposal for a new Web API. It allows for creating transition animations between page navigation and transitioning elements that are present on both pages.

---

<div className="p-4 bg-io_orange-100 font-serif">[Shared Element Transition](https://github.com/WICG/shared-element-transitions/) is under active development and the specification is likely to change during its development.</div>

---

## Getting started

To get started with the Shared Element Transition API the following flags have to be enabled in Chrome:

- `chrome://flags/#document-transition`
- `chrome://flags/#enable-experimental-web-platform-features`

First of all, we need to check if the browser supports the API, and add a fallback if they don't.

```JavaScript
async function navigate() {
    if (!document.createDocumentTransition) {
        updateDOM(); // update the DOM
        return;
    }
}
```

If it does support the new API, we can use the `createDocumentTransition` function to create a new transition.

```JavaScript
async function navigate() {
    if (!document.createDocumentTransition) {
        updateDOM(); // update the DOM
        return;
    }

    const transition = document.createDocumentTransition();
    await transition.start(() => updateDOM());
}
```

The default transition the API creates is a simple fade. I created a small CodePen example that just toggles between a card view and a detail view by toggling the display style.

![An example of a basic root transition](/articles/the-future-of-page-transitions-with-shared-element-transitions/codepen-1.gif)

<small>Source available on https://codepen.io/milanvogels/pen/ZErNQdr</small>

## Changing the animation

The animation is using CSS. The default browser UA styles will animate `::page-transition-incoming-image` _from_ `opacity: 0;` and `::page-transition-outgoing-image` _to_ `opacity: 0;`.

We can add our own animations by using the following pseudo-element selectors

```CSS
::page-transition
::page-transition-container(root)
::page-transition-image-wrapper(root)
::page-transition-outgoing-image(root)
::page-transition-incoming-image(root)
```

For example, we can change the animation to a _slide out_:

```CSS
@keyframes slide-to-top {
  to {
    transform: translateY(-100%);
  }
}

::page-transition-outgoing-image(root) {
  animation: 400ms ease-out both slide-to-top;
}

::page-transition-incoming-image(root) {
  animation: none; /* disable default animation */
}
```

![An example of a slide out root transition](/articles/the-future-of-page-transitions-with-shared-element-transitions/codepen-2.gif)

<small>Source available on https://codepen.io/milanvogels/pen/wvybGOy</small>

To animate separate elements, instead of the whole page, we can replace `root` with a `page-transition-tag` property value you can add to another css selector. The default animation transitions the `width` and `height` attributes from the 'before' state to the 'after' state. Also, it animates the `transform` to update to the position of the targeted element.

In the following example, we add a `page-transition-tag: article-img` to an image tag.

```CSS
.foo img {
    page-transition-tag: article-img;
}

::page-transition-outgoing-image(article-image) {}
::page-transition-incoming-image(article-image) {}

```

This gives us an already pretty cool effect.

![An example of a shared element transition, animating a small card-image into a large article-image](/articles/the-future-of-page-transitions-with-shared-element-transitions/codepen-3.gif)

<small>Source available on https://codepen.io/milanvogels/pen/ZErNOBz</small>

If we want specific elements of our site to stay in place during the transition, we have to add a `page-transition-tag` and `contain: paint`. Assuming the element won't change between page-a and page-b, the element will now remain in the same place.

```CSS
.header {
  page-transition-tag: header;
  contain: paint;
}

```

We can't have the same `page-transition-tag` being used multiple times on the same page. We'll get an error in the console when starting the transition:

> Unexpected duplicate page transition tag: tag-name

So instead of defining it in CSS, we can add it with JavaScript, for example on a click event.

```JavaScript
async function navigate() {
    if (!document.createDocumentTransition) {
        updateDOM(); // update the DOM
        return;
    }

    const foo = GetElementYouClickedOn();

    foo.style.pageTransitionTag = 'article-img';

    const transition = document.createDocumentTransition();
    await transition.start(() => updateDOM());

    foo.style.pageTransitionTag = '';
}
```

Here's an example of a full grid of cards animating each card's image to the full article image. It still shows the singular article detail view we created, hence the detail image doesn't reflect the card's image.

![An example of a shared element transition, animating multiple small card-images in a grid into a large article-image](/articles/the-future-of-page-transitions-with-shared-element-transitions/codepen-4.gif)

<small>Source available on https://codepen.io/milanvogels/pen/PoQvdEM</small>

### Multi-page applications

The current iteration of the Shared Element Transition API only supports Single-page applications (SPAs). Support for Multi-page applications (MPAs) is on the roadmap to be added in the future. The use of the API for SPAs or MPAs should work similarly.

## Start experimenting!

I'm really excited about this API myself, it allows us to create page transitions that can add context to the user in a non-complicated way without the use of any 3rd party libraries. The Shared Element Transition API is still in an early phase and it will take some time until it's ready for shipping and implemented by other browsers, but we can already experiment a lot with it.

I would like to encourage you to do the same and share your opinions in the [Github repository](https://github.com/WICG/shared-element-transitions). Can't wait to see what others can create with this new API.

Bright times ahead for page transitions!
