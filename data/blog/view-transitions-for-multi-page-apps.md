---
title: '_View Transitions_ for Multi-page Apps'
date: '2024-08-16'
tags: ['frontend']
images:
  ['/articles/view-transitions-for-multi-page-apps/view-transitions-for-multi-page-apps-demo.webp']
summary: 'We finally have (experimental) View Transitions for Multi-page Apps (MPA)! Let’s explore why this is cool and how we can use it.'
authors: ['dave-bitter']
theme: 'green'
---

Time to look at an, at the time of writing, experimental feature on the web! It might be a bit early to write about it, but View Transitions, proven by this being my third article about them, really excites me!

## What are View Transitions again?

The View Transition API is an effort to bring a smoother user experience to the web much like our users are familiar with in native applications. In essence, it lets you animate elements from one view to the next one with ease.

### Between “pages”

Consider this transition below:

<div style={{display: 'flex', justifyContent: 'center'}}>
<img src='/articles/view-transitions-for-multi-page-apps/view-transitions-for-multi-page-apps-demo.gif' alt='Screen recording of the demo showing an overview with sneakers and a transition to a detailed view of a pair of sneakers'  />
</div>

Before, you had to load the markup for the next page, put it on top of the card, make the animation, make sure to clean up the old view and finally update the URL. Quite a bit of effort for relatively simple transitions. Luckily, the View Transition API makes this incredibly easy.

Read more on how this exactly is done technically in my article [_The View Transitions API: Enhancing the feel of the web_](/articles/the-view-transitions-api). This, however, only works with client-side navigation in a Single Page App (SPA)

### Between “views”

But of course, this doesn’t just apply to transitioning between two “pages”. You can also use this powerful API to transition between two “views” on the page. For example, when adding or deleting an item in a grid:

<div style={{display: 'flex', justifyContent: 'center'}}>
<img src='/articles/view-transitions-for-multi-page-apps/view-transitions-for-multi-page-apps-adding-animated.gif' alt='Screen recording showing an item being added and the grid of cards animate into place'  />
</div>

If you want to read more on how this is done, head over to my article [_Make awesome animated interactions with two lines of code_](/articles/view-transitions-api-animated-interactions).

## So why the excitement for MPAs?

Well, the previous examples rely solely on having client-side JavaScript. If you don’t have an SPA, you don’t get to use it for transitioning pages. We want to be able to transition two completely separate pages, or documents to be precise.

### Ease-of-use

Now, you could’ve made something yourself where you intercept the request for a page, fetch the content yourself, update the DOM and make sure that the client-side View Transition is taking care of making an animation. This, just like in the past, requires a lot of effort and introduces a whole new list of potential issues. No, we just want to easily animate between two views, they’re just two documents.

## How do I use it?

Making this work for an MPA is fortunately quite similar to the approach for an SPA. If you've followed my previous articles, you'll remember that we used to call `document.startViewTransition`. However, that is no longer necessary. Now, all you need are the `view-transition-name` CSS properties as before, plus one additional piece of CSS:

```css
@view-transition {
  navigation: auto;
}
```

That’s it! Adding this CSS does a couple of things. First, it creates a default "fade" transition between pages. Additionally, it ensures that any elements with the `view-transition-name` property (along with any other relevant CSS) will behave just as they did when using `document.startViewTransition`:

<div style={{display: 'flex', justifyContent: 'center'}}>
<img src='/articles/view-transitions-for-multi-page-apps/view-transitions-for-multi-page-apps-demo.gif' alt='Screen recording of the demo showing an overview with sneakers and a transition to a detailed view of a pair of sneakers'  />
</div>

### Experimental

Yeah, so of course my demo GIF above works really well, but in practice I saw it sometimes not work at all and other times it did. Luckily, this is an enhancement and nothing breaks if it doesn’t transition. I feel like this is because of the experimental state of this API. Do however check it out and try to see if you can make a cool transition. If you want to see all the demo code, you can [view the project on GitHub](https://github.com/DaveBitter/view-transitions-api-demo). If you’d like to see the demo in action, head over [here](https://view-transitions-api-demo.davebitter.com/mpa.html). Keep in mind that at the time of writing, only Chrome has experimental support for this and you need to turn the feature flags on:

```
chrome://flags#view-transition
chrome://flags#view-transition-on-navigation
```

That’s all! See you next time when I inevitably talk about the View Transitions API again!
