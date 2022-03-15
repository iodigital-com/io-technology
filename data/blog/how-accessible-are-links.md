---
title: 'How accessible are links?'
date: '2021-12-10'
tags: ['a11y']
image: '/blog/how-accessibile-are-links/a11y-links.jpg'
summary: 'Links are one of the main basic elements that you’ll find on any website. Yet, a lot of them are not as accessible as we would like.'
authors: ['frank-van-eldijk']
---

In this short article I'll focus on screen readers and voice recognition, and how they deal with links. I'll not cover every possible problem that could happen. I'm going to reserve that for a different article which I'll publish soon.

Before we continue, I want to avoid any confusion upfront. When I’m referring about links I assume that they’re used with the semantic HTML element: `<a>`.

Using a different HTML element — like a `<div>` which is styled to look like a link — might not be set up right. And this could cause a multitude of problems. If you want to read more about this this, I've written an article on why we should [prefer semantic HTML](https://beingfrankly.nl/blog/rules-on-using-aria).

## How assistive technologies understand a web page

This is possible through the use of many accessibility API’s. The platform that the browser runs on uses one of those API’s to read the content of a web page.

How this process actually works in the background would be too much for this article. If you want to learn the details behind this, I recommend you to read [Web Accessibility with Accessibility API](https://www.smashingmagazine.com/2015/03/web-accessibility-with-accessibility-api/). It’s a great article written by [Léonie Watson](https://twitter.com/leoniewatson).

The part that’s important for us to know is that those API's expose certain information. This happens for every object in the DOM. And this information is crucial for assistive technologies to understand what each object means.

There are two pieces of information I want to focus on, and those are the `role` and the `name`. The `role` of the DOM object exposes its purpose. It could be a link, a button or something else like an image. The `name` of the DOM object gives its identity. It’s also referred as the [Accessible Name](https://www.w3.org/TR/accname-1.1/#dfn-accessible-name).

<iframe height="400" width="100%" scrolling="no" title="Cards with &quot;read more&quot; links" src="https://codepen.io/beingfrankly/embed/oNGLQea?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/beingfrankly/pen/oNGLQea">
  Cards with &quot;read more&quot; links</a> by Frank van Eldijk-Smeding (<a href="https://codepen.io/beingfrankly">@beingfrankly</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

So, let’s use the example above to quickly recap what we’ve learned.

- The `<main>` element will have the `role` of “main”. The `name` is empty because we didn’t supply one.
- Each `<p>` element will have the `role` of “paragraph”. Again the `name` is empty since we didn’t supply one.
- Every `<a>` element will have the `role` of “link”. The `name` will be “Read more”. This happens because the `name` — or Accessible Name — is determined from a list of possible options. And in this case it was the value inside the `<a>` element that’s used for the Accessible Name.

I’ve picked this example on purpose because it’s quite common to see a list of cards. Each card having a title, some text and at the bottom a “Read more” link.

So, let’s see which problems could happen for screen readers & voice recognition if we leave the example above untouched.

## Potential barriers for screen readers & voice recognition

When a sighted user sees a “Read more” link that’s near other elements, they’re usually able to group them together. The context behind the “Read more” link is then related to the text and the title. It becomes clear what to expect when they press the link. This happens because of the [Law of Proximity](https://lawsofux.com/law-of-proximity/) and/or the [Law of Common Region](https://lawsofux.com/law-of-common-region/), depending on how the elements are visually styled.

Yet, people who rely on screen readers are usually not able to scan the page, and group elements based on visual proximity. So, in this case the “Read more” link doesn’t have any meaning to them.

People who use voice recognition might be able to group elements together, visually that is. However, they’ll experience a different barrier.

To interact with an element, you could say “Click”, followed by the Accessible Name of the element. This is a command from Voice Control on MacOS — . This will then press the element that matches the Accessible Name.

In our example it would be “Click, Read more”. But, this will just give each “Read more” link a number on screen. And in order to continue, you’ll have to say “Click” again followed by the number you actually meant to interact with.

This happens because all three “Read more” links share the same Accessible Name. WhichIn order to improve this experience, we need to give each link a unique Accessible Name.

So, for both our screen reader and voice recognition users, this example leads to a poor user experience. What could we do to solve this and create a more frictionless user experience?

## The solution (well, one of many)

There are a couple options available to us. But, let’s focus on one solution for now to keep this article brief. I’ll write an in-depth article on a lot more barriers (and their solutions) soon.

Let’s remove the “Read more” link first, because it’s giving everybody a hard time. And let’s implement a new link, one that wraps the entire card element. This doesn’t solve the problem for our users yet, it requires a little bit of tweaking.

When we’re wrapping an element inside a link, the Accessible Name is derived from all the elements inside of it. And in this case, it would be the title and the paragraph. Not a horrible outcome, but we can do better.

To give our new links a more accurate Accessible Name, we have to use either the `aria-label` or the `aria-labelledby` attributes. I prefer the `aria-label` myself, because in most cases I find it easier to work with. But attributes serve the same purpose. To give an Accessible Name — or in this case, override — to an element.

Let’s check it out!

<iframe height="400" width="100%" scrolling="no" title="Cards with &quot;read more&quot; links - possible fix" src="https://codepen.io/beingfrankly/embed/PoJGGyj?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/beingfrankly/pen/PoJGGyj">
  Cards with &quot;read more&quot; links - possible fix</a> by Frank van Eldijk-Smeding (<a href="https://codepen.io/beingfrankly">@beingfrankly</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

After we’ve implemented our changes, a screen reader user is able to make sense of each link. We’ve went from “Read more” to the title of the article, a context which makes more sense to our users.

The barrier that voice recognition users experienced is also gone. Since all three links have a unique Accessible Name, it’s possible to use the command “Click” followed by the name of the title.

If you’ve liked this piece of content and you want to get regular updates on other things I write about then follow me on [Twitter](https://twitter.com/frank_vaneldijk). And if you have any comments or questions then don’t hesitate to contact me
