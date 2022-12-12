---
title: 'Why you should be using new CSS features today - part 2'
date: '2022-12-05'
tags: ['frontend', 'css']
images: ['/articles/why-you-should-be-using-new-css-features-today/new-css-features-2.png']
summary: "In the previous part of this article, I tried to tickle your brain a bit to unleash your curiosity and drive your determination to try some new CSS features today. That's exactly what I'll be doing in this part, writing some new stuff today so you can slowly polish new CSS skills very sneaky and hidden in the code, like a ninja."
authors: ['brecht-de-ruyte']
theme: 'rouge'
serie: 'why-you-should-be-using-new-css-features-today'
---

## Let’s talk browsers

Because of [interop 2022/2023](https://web.dev/interop-2022/) browsers are working together to make our life easier. They have a list of new CSS features they want to release by the end of the year. Although some browsers favor one over the other. Safari for instance is very far ahead when it comes to the CSS color module level 5, while Firefox is implementing subgrid and Chrome is a step ahead on new pseudo selectors and scroll timelines.

When using new CSS features, it’s all about knowing which browsers you want to support, especially, which versions. For the sake of this article (and the world), I won’t be mentioning Internet Explorer as its lifecycle ended on June 15, 2022.

As Safari is now considered an evergreen browser as well (with auto-updates). We will consider most fallbacks based on the latest releases of browsers.

## Some of the easy things we can do today

Sometimes, the easiest thing to do is to polyfill something for older browsers. I will mostly be referring to [PostCSS](https://postcss.org/) when talking about polyfills, as I believe this to be one of the best tools out there at the moment for using new CSS features.

Here are a few of my favorite ones that you can use today:

### CSS cascade layers

CSS cascade layers really released with a bang. Currently it has [full support in all the major browsers](https://caniuse.com/css-cascade-layers), so you shouldn’t have any issues with them if you only support those.

However... When it comes to cascade layers there is a problem, and it’s quite a big one. When using them to full extent they are completely style-breaking for browsers that don’t support them. There is no graceful downgrade here and that could potentially be a big issue. Thankfully, we can use [this polyfill for PostCSS](https://www.npmjs.com/package/@csstools/postcss-cascade-layers) in case we need to support older browsers. Later on when more people have updated to versions that support these layers, we can just remove the polyfill and see our full layers in action in our built CSS.

The polyfill will of course just rebuild your CSS to a version without cascade layers and this is how it works: It looks for any layer @-rules and records the order in which the layer is defined. The most specific selector gets remembered as well and with those two elements in place it will determine the specificity adjustments for each layer before it transforms the CSS. It will create some “fake extra specificity” by adding meaningless :not() pseudos to make it all work. Not the prettiest output, but it works perfectly.

```css
div {
  background: green;
}
@layer somelayer {
  div {
    background: red;
  }
}

@layer someotherlayer {
  div {
    background: blue;
  }
}

/* output css */

div:not(#\#):not(#\#) {
  background: green; /* none layered has the highest specificity */
}

div {
  background: red;
}

div:not(#\#) {
  background: blue;
}
```

Not sure what cascade layers are? You can check out [this article by Dave Bitter](https://techhub.iodigital.com/articles/you-need-css-cascade-layers) or view [this video by Bram.us on CSS-day](https://www.youtube.com/watch?v=zEPXyqj7pEA)

### Container queries

This is in my opinion one of the harder things to polyfill at the moment. There isn’t any [support for this in Firefox and Opera](https://caniuse.com/?search=container%20queries) for now, which means we **have** to use a polyfill if we want to use it.

There is a [polyfill by Chromelabs which can be found here](https://github.com/GoogleChromeLabs/container-query-polyfill) but there are some issues with it that can’t go unnoticed.

The author of the polyfill states: “For the best user experience, it's recommended that you initially only use the polyfill for content below-the-fold” and that comes with a reason.

The polyfill only triggers after the DOM has loaded and when the browser loads the javascript based on the support flag. You will notice a layout shift when this happens and I’m not really happy to see things like that happen on an evergreen browser. Sure, when firefox has support and you only use it to target older versions, it might be a good idea. But for now, maybe it’s best to use this when implementing something extra for browsers that support it? I’ll leave that up to you. You can always use a feature query in CSS for this:

```css
@supports (container-type: inline-size) {
  /* container queries stuff here */
}
```

Or if you really want to go with a polyfill, you could temporarily show a loader while the plugin is being loaded like so:

```css
@supports not (container-type: inline-size) {
  .container {
    display: none;
  }
  .loader {
    display: flex;
  }
}
```

There is a bit of good news though: Since November 2022, container queries are available in Firefox Nightly behind a flag.

Want to read more about this feature? Check out [this article about everything container queries by Maarten Van Hoof](https://techhub.iodigital.com/articles/container-queries-the-next-step-towards-a-truly-modular-css)

### The :has() relational pseudo class

This is currently supported in all browsers besides Firefox and in simple use-cases it can be easily fixed by your own hand. I actually have done this before when toggling a pane with Javascript.

The CSS looked something like this:

```css
body.panel-open {
  overflow-y: hidden;
}

@supports (selector(:has(*))) {
  body:has(.info-pane.is--open) {
    overflow-y: hidden;
  }
}
```

Inside the JS, I added the following when triggering the panel to open:

```js
if (!CSS.supports('selector(:has(*))')) {
  document.body.classList.toggle('panel-open')
}
```

Is this an unnecessary step? Absolutely! I could have just used the body class for both cases. But I did gain a bit more experience with using this relational pseudo class in practice and that’s what matters here. In case you missed out on what this pseudo class has to offer. [I wrote about it on the tech_hub before](https://techhub.iodigital.com/articles/practical-uses-of-the-has-relational-pseudo-class).

### Logical properties

[Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) already have great support in all browsers, but I wanted to mention it anyway. The biggest flaw that they have is that they don’t downgrade very well. I’m mostly thinking about all the old iPads floating around. I had this problem before where we found out that we need to polyfill this for older devices as there were just too many of those floating around.

Luckily, fixing this this is easy by adding [postcss-logical](https://www.npmjs.com/package/postcss-logical) to our PostCSS config which will convert margin-block to a margin-top and bottom, with a direction pseudo attached to it (if needed). There is a small trade-off as there won’t be any shorthand created. Nevertheless, if you’re working on a project with multiple writing modes that has to support older browsers, this is the way to go.

### CSS nesting

It’s only been recently since this became available in Chrome Canary and the spec is still changing, so I would not use this in your day-to-day projects. But it’s worth to take a look at it as this is something people have been asking for.

But maybe if you need to create a little one-pager or something internal for your coworkers that won’t see the light of day for long, you can always try using [this postCSS plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting) when building your files. It’s not perfect, but it works pretty great and it’s good practice.

Why should you play with CSS nesting if you’ve been using Sass for years? Well, [take a look at the spec](https://www.w3.org/TR/css-nesting-1/), there are quite a few differences.

A bit of trivia: Currently they are experimenting to remove the use of an ampersand (&) when the selector doesn’t start with an alphabetical character, how cool is that?! You can test this in [Chrome Canary](https://codepen.io/utilitybend/pen/eYKBYVV) with the web experiments flag on.

### Honorable mention: Masonry

I keep on mentioning masonry as one of the things I look the most forward to in new CSS features. Maybe that’s because I’ve hacked more Javascript (and even jQuery) libraries in the past than I can remember. It’s currently only available in Firefox Nightly behind a flag but if you need a simple masonry in the future, why not use a feature query? That way you can easily remove that big JS library later on.

```css
@supports (grid-template-rows: masonry) {
  .masonry-grid {
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: masonry;
  }
}
```

```js
const supportMasonry = CSS.supports('grid-template-rows', 'masonry')

if (!supportMasonry) {
  /* 
    dont't support masonry in CSS? 
    init your masonry here in JS
     */
}
```

I do hope we see some progress in this feature soon as it has been [over a year since I first played around with it](https://utilitybend.com/blog/masonry-with-css-grid-finally-a-solution-without-javascript).

## As a final conclusion

So why should we be using new CSS features today?

- Because we can
- Because we can learn and be a step ahead
- Because it helps us to write better code in the future / for the future

And last, but not least. You can get involved by filing issues and commenting at the [CSS working group Github](https://github.com/w3c/csswg-drafts/issues). Everything CSS and HTML is very open.

If there is one thing I want people to keep an eye on in 2023, then it must be [open-ui.org](https://open-ui.org/). Which will make us finally be able to style things such as tooltips, select menus and more without the use of JS. They do this with an eye on accessibility and it looks very promising. Currently available in Chrome Canary behind a flag (but still quite buggy). I’ve taken a commitment to help them more in the future by joining meetings and [creating demos](https://codepen.io/utilitybend/pen/poKewPJ).

So are you excited about all this new stuff in CSS? Feel free to have a chat! I love to geek out on these things.

And as this might be my last article on the tech_hub of the year, I Wish you all a Merry Christmas and a happy New Year.

```css
.christmas:has(.snow) {
  list-style: '❄️';
  list-style-position: outside;
}
```
