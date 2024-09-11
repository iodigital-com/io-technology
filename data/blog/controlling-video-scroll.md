---
title: 'Controlling your video animations with _scroll-timeline_ and _animation-timeline_'
date: '2024-09-11'
tags: ['frontend']
images: ['/articles/animations-scroll-timeline/airpods.jpg']
summary: "Step into a (very near) future where you can control animations with pure CSS and without the need for any JavaScript? In this article, I'll show you how to control your animations with the new CSS properties scroll-timeline and animation-timeline."
authors: ['steve-jonk']
theme: 'green'
---

Our browsers are always evolving and cool new features are added with almost every update. I played around with one of these new features and I love it! I’m talking about the new CSS properties called [scroll-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline) and [animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline).

MDN explains these properties as:

- _The_ `scroll-timeline` _CSS shorthand property is used to define a named scroll progress timeline, which is progressed through by scrolling a scrollable element_.
- _The_ `animation-timeline` _CSS property specifies the timeline that is used to control the progress of a CSS animation._

In other words, the combination of these two properties makes it possible to control CSS animations with pure CSS and without the need for any JavaScript. This makes a lot of creative ideas possible, without the need for JavaScript.

Think of things like:

- Parallax Scrolling Effects
- Scroll-based Animations
- Sticky Elements with Animated Transitions
- Scroll-triggered Video and Media Playback

I’ve been wanting to do something like the second idea for some time already, so during our Google Day (a nice team hackathon) I created a small demo project where an animation is controlled by scrolling. In this article I’ll explain this project in more detail and how it’s done!

_Short sidenote_ : Since this property is fresh off the press, at the time of writing it is not supported by every major browser yet. As always, an up-to-date report can be found at [CanIUse](https://caniuse.com/mdn-css_properties_scroll-timeline). I’ve tried this [polyfill](https://github.com/flackr/scroll-timeline) for it, but didn’t test it very extensively, so I can’t say too much about it.

## Why is this so cool, compared to existing methods?

I can understand you might think something like ‘There are several libraries which do this already, why is this so special’. Of course, there are nice libraries like GSAP, which provide all sorts of controls for animations, but in my opinion, it’s always best to use browser native methods. Besides, all these libraries use JavaScript to achieve this, whereas pure CSS has several advantages, like:

- Lesser JavaScript means less Total Blocking Time
- CSS is faster to parse and execute
- With JavaScript, the layout will be re-rendered, which doesn’t happen with pure CSS

## The project: scroll-based animations

So my big idea was to create an animation that can be controlled by scrolling. That is cool and all, but what animation am I going to control and how do I create it? I really like the aesthetics of the [Airpod Pro 3 Landing Page](https://www.apple.com/airpods-3rd-generation/), so I rebuilt a part of the animation that is displayed on that page. This is what the result looks like:

<div style={{display: 'flex', justifyContent: 'center'}}>
<img src='/articles/animations-scroll-timeline/result.gif' alt='Screen recording of the end result'  />
</div>

### How is it done?

The gist of it is actually:

1. Split a video into separate frames and store them as jpg’s. There are a bunch of tools for this, but I used [https://ezgif.com/video-to-jpg](https://ezgif.com/video-to-jpg).
2. Create a CSS animation to change the background image of an element to the next frame jpg file at every step
3. The new and fun part: control that CSS animation with a scroll-timeline.

I’ll explain steps 2 and 3 of this short summary with code examples. Don’t worry, the full repo of this demo is shared at the bottom of the article.

#### Create the CSS animation\*\*

It might sound like video creation with extra steps (I hope you like this Rick & Morty reference), but to create the CSS animation we will recreate the original video sequence by changing the background-image of an element to the next frame (jpg file) for every step of the animation.

That will look something like:

```css
@keyframes videoAnimation {
  25% {
    background-image: url('frame-1.jpg');
  }
  50% {
    background-image: url('frame-2.jpg');
  }
  75% {
    background-image: url('frame-3.jpg');
  }
  100% {
    background-image: url('frame-4.jpg');
  }
}
```

A video of 4 frames is very short, even for our Vine generation. The video used in this demo project has 147 frames and writing a new line of CSS for all of these frames doesn’t feel like the most efficient way of working. Luckily, with the power of SCSS, we don’t have to. We create a function that generates this for us, like so (where `$frameCount` is the amount of frames we have):

```scss
@keyframes videoAnimation {
  @for $i from 1 through $frameCount {
    #{math.div($i, $frameCount)*100}% {
      background-image: url('frame-#{$i}.jpg');
    }
  }
}
```

**Control animation with a scroll-timeline**

Now that we have the animation, we can start controlling it. We start with this HTML markup:

```html
<div class="container">
  <div class="inner">
    <div class="video"></div>
  </div>
</div>
```

And the CSS:

```css {5,26}
.container {
  width: 100vw;
  max-height: 100vh;
  overflow-y: auto;
  scroll-timeline: --videoTimeline y;
}

.inner {
  width: 100%;
  height: 800vh;
}

.video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('frame-1.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: black;
  background-position: center;
  animation-name: videoAnimation;
  animation-duration: 1ms;
  animation-timeline: --videoTimeline;
}

@keyframes videoAnimation {
  25% {
    background-image: url('frame-1.jpg');
  }
  50% {
    background-image: url('frame-2.jpg');
  }
  75% {
    background-image: url('frame-3.jpg');
  }
  100% {
    background-image: url('frame-4.jpg');
  }
}
```

The magic all happens in the two CSS properties that this whole article is about:

- `scroll-timeline` - with this, we mark the scroll position as a control for other elements
- `animation-timeline` - with this, we tell our CSS that this animation can be controlled by another element’s scroll position, where we refer to the aforementioned scroll-timeline name.

Some other notable points are:

- Both`.container` and `.video` fill the entire screen
- The `.container` has an overflow-y of auto, to ensure it is scrollable
- The height of `.inner` determines how fast the animation will play when scrolling
- The initial `background-image` of `.video` is set to the first frame of the video
- To keep things CSS, I didn't use the SCSS function for the @keyframes

### A possible improvement

A small issue with this approach was that at initial pageload, the images still needed to load when the user scrolled, causing flickering in the video. The solution I implemented probably isn’t the best for production environments. To prevent this from happening, I added a script that preloads all the images. This might need some improvement, but that was not in scope for this demo.

## Final Remarks

I really really love this css feature. It performs very well, I dare to say even a lot better than most JavaScript implementations I have seen. I can’t wait for it to be widely supported!

You can find the repo of this demo project [here](https://github.com/SteveJonk/scroll-timeline-try).
Feel free to play around, fork, improve and create pr’s! Because ❤️ open source

Because the end result is so nice, thought I'd share it once more here:

<div style={{display: 'flex', justifyContent: 'center'}}>
<img src='/articles/animations-scroll-timeline/result.gif' alt='Screen recording of the end result'  />
</div>
