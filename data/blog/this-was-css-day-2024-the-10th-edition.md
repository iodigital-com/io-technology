---
title: 'This was CSS Day 2024 - the 10th edition'
date: '2024-06-27'
tags: ['frontend', 'css', 'events', 'conference']
images: ['/articles/this-was-css-day-2024-the-10th-edition/css-day.jpg']
summary: 'Another year, another CSS Day. I’m always happy to return to Amsterdam for this occasion, It’s one of the things I look forward to every year. So naturally, I’m happy that iO still allowed me to go there with my training budget, and the least I could do, is write a summary of this event on the tech_hub.'
authors: ['brecht-de-ruyte']
theme: 'beige'
---

## CSS Day 10th edition starts with a bang

CSS Day started for me on Wednesday evening instead of Thursday. Once again, I attended the pre-event at Kohnstammhuis, Amsterdam. This started with a brief introduction of the students' work by Sanne t’Hooft.

Sanne showed some of the awesome stuff that students created during a hackathon. The CSS knowledge was through the roof, and I was amazed, to say the least.

- [https://aliahmed205.github.io/hackathon2324/](https://aliahmed205.github.io/hackathon2324/)
- [https://cssdayta.vercel.app/](https://cssdayta.vercel.app/)
- [https://jopmolenaar.github.io/css-day-ta-JJJM/](https://jopmolenaar.github.io/css-day-ta-JJJM/)
- [https://kitch41.github.io/Hackathon-css-day/](https://kitch41.github.io/Hackathon-css-day/)
- [https://larsvv99.github.io/hackathon_cssday/](https://larsvv99.github.io/hackathon_cssday/)
- [https://lynnwolters.github.io/css-day-hackathon/](https://lynnwolters.github.io/css-day-hackathon/)
- [https://n13l5a97.github.io/CSS-Dayta/](https://n13l5a97.github.io/CSS-Dayta/)
- [https://xiaonanpols21.github.io/css-day-hackaton/](https://xiaonanpols21.github.io/css-day-hackaton/)

This followed up with a talk about Multi-page view transition by Bramus and Container queries by Miriam Suzanne.

![Bramus on stage at the pre css day event in front of a slide explaining multi page view transitions](/articles/this-was-css-day-2024-the-10th-edition/bramus.jpg)

This year I had the pleasure to join the speakers dinner as a celebration for the 10th anniversary. I am so bad on boats (motion sickness)… but, I made it! I would be lying that it was easy, but good conversations helped (looking at people instead of outdoors as well).

Thank you CSS Day for this! It ended with a lovely view as well.

![Picture of 3 buildings in focus during the blue hour, one large white building shaped as trapezoid and a large building that has a tower on it with three x, the amsterdam logo](/articles/this-was-css-day-2024-the-10th-edition/boat-trip-view.jpg)

## Start of CSS Day

This CSS Day was hosted on day 1 by Jeremy Keith and the second day by Miriam Suzanne. Two fantastic speakers, and once again a great choice by the organization. Both of them have a great sense of humor that made every presentation start with a smile and every Q&A entertaining to watch.

## The Future of CSS is Now

Mathias Ott opened the conference with a bang, highlighting the incredible power of modern CSS and urging us to move beyond static design. We can now "sculpt" the web with features like custom properties, subgrid, and animation. We need to start understanding that CSS is the best design tool for the web. Let developers design and let designers write CSS. A fantastic opener for the presentations to come and a lovely person.

![Mathias Ott in front of a slide with text: The New CSS](/articles/this-was-css-day-2024-the-10th-edition/the-new-css.jpg)

## CSS layout and Accessibility

The second talk by Rachel Andrew focused on masonry layouts and a proposed solution for accessibility concerns.

### The Masonry Layout Debate:

Two main proposals for pure CSS masonry layouts are currently on the table, one [by Chrome](https://developer.chrome.com/blog/masonry) and another [by Webkit](https://webkit.org/blog/15269/help-us-invent-masonry-layouts-for-css-grid-level-3/). Rachel delves into the benefits of the Chrome approach, highlighting its intuitive logic, but at the same time not shying away from giving the pros and cons of both approaches.

After a decent intro on both methods, she raises a crucial point: implementing masonry right now might not be the best idea at all. The first thing we might need to address is some concerns based on reading order:

![Rachel Andrew in front of a slide with text: Here is a cool thing, please don't use it](/articles/this-was-css-day-2024-the-10th-edition/rachel-andrew.jpg)

### Accessibility Concerns with Masonry:

Masonry layouts can disrupt the visual tabbing order, creating accessibility issues for users navigating with keyboards. To address this, Rachel showed us the concept of "reading order" in CSS.

The CSSWG is developing a level 4 Display spec that includes a property called `reading-order-items`. This property aims to establish a clear distinction between the visual order of elements and the order in which they should be read and interacted with using a keyboard. That’s the idea behind it because it goes a bit further than a simple "follow the visual" flag. No, this needs more, so the proposal suggests scoping reading order to specific layout methods like Flexbox and Grid.

Here's a glimpse into the proposed syntax for Flexbox and Grid:

**Flexbox:**

```css
.flex {
  reading-order-items: normal; /* default */
  reading-order-items: flex-visual; /* considers visual order */
  reading-order-items: flex-flow; /* considers normal flow and visual order, from a personal standpoint, I find this helpful for right-to-left writing modes */
}
```

**Grid:**

```css
.grid {
  reading-order-items: grid-rows;
  reading-order-items: grid-columns;
}
```

### Open Questions and Next Steps:

There are still some questions about naming conventions as well. `reading-order-items` is currently the idea, reserving a shorter property name `reading-order` for the future, if we ever need it. Rachel invites the audience to participate in the discussion and share their thoughts on the proposed naming scheme. I like the idea of reserving the shorter name, you never know what the future brings.

While there's some friction between Webkit and Chrome regarding masonry layouts, the focus on accessibility paves the way for a more inclusive future for web design and I can only applaud that idea.

## Utility first? Or Tailwind?

It’s brave to advocate something like Tailwind in a room full of CSS nerds. I think Sarah Dayan did great on that part. Although I think this talk was important as we should think about these things, I can’t help to have the feeling that every “extreme” direction is probably not the best one. I think it was going a bit too much in the direction of utility-all instead of utility-first and that’s where I got lost a little.

I believe that creating your utilities can challenge existing frameworks and that there is some sort of middle ground that we need to achieve. And even though I’ll probably never become the greatest Tailwind fanboy (not a hater as well), this talk opened up that conversation, and that’s just as important.

## The Magic of Pure CSS - Character modeling

Julia Miocene's inspirational talk showcased the power of pure CSS for creating complex animations and characters. It might not be practical for everyday web design, but it serves as a reminder of the incredible things achievable with just CSS. She started with basic shapes showcasing some emotion of a character.

- Circle = happy character
- Rectangle = strong or angry character
- Triangle = unstable character

She went on to show some of the steps in creating 3d characters:

![Julia in front of a slide showing a cat-like character create in CSS with blocks, showing a light source ball above it with lines to illustrate where light should fall](/articles/this-was-css-day-2024-the-10th-edition/julia.jpg)

1. Perspective and rotation
2. Light source
3. Skeleton
4. Animation
5. Sculpture
6. Bonus: add a bit of noise with an SVG filter to make it look more like an image

I took a bunch of notes from this talk which I will share with colleagues and use to further fine-tune my animation skills. One thing that I loved is how the “skeleton step” actually resembled a skeleton made in HTML. It looks so simple that it’s scary (then again… skeletons tend to be that)

```html
<div class="man__leg">
  <div class="man__knee">
    <div class="man__feet">
      <div></div>
      <div></div>
    </div>
  </div>
</div>
```

Also, check out [Julia's awesome CodePen](https://codepen.io/miocene)

## Beyond Google Fonts

Roel Nieskens advocated the exploration of indie fonts and the possibilities unlocked by OpenType features like variable fonts and color fonts. We should experiment and embrace the power of typography to elevate our designs.

Fonts have intelligent things they can do, which good typeface designers take care of:

- **Kerning**: the manual adjustment of the spacing between two specific glyphs
- **Ligatures**: a ligature occurs where two or more graphemes or letters are joined to form a single glyph for example f+i can sometimes come together and the dot of the i gets removed
- **Change character choice**: alternate, changing "swashes" in handwritten fonts is a good example of this

And that’s just the start of it, with variable and color fonts available to us, we can fine-tune typography like never before.

I will not completely write the talk of Roel down in this article, but from speaking with him a bit after the conference, I thought I’d do him the honor of adding some of the cool indie fonts he used on his slides:

![Roel Nieskens live coding some fonts on stage, a typographic newspaper like website is on the screen with font related code next to it](/articles/this-was-css-day-2024-the-10th-edition/roel.jpg)

- [djr.com](https://djr.com/)
- [https://ohnotype.co](https://ohnotype.co/)
- [https://typotheque.com](https://typotheque.com/)
- [https://arrowtype.com](https://arrowtype.com/)
- [https://liebefonts.com](https://liebefonts.com/)
- [https://letterror.com](https://letterror.com/)
- [https://www.typearture.com](https://www.typearture.com/)
- [https://www.sansbullshitsans.com/](https://www.sansbullshitsans.com/)
- [https://www.schick-toikka.com/noe-display](https://www.schick-toikka.com/noe-display)

And some cool extra links for you to check out:

- [wakamaifondue.com](http://wakamaifondue.com/) (what can my font do... get it?)
- [https://pixelambacht.nl/](https://pixelambacht.nl/)

## Standardisation Stories

Elika Etemad's talk delved into the core principles behind CSS, emphasizing its role in translating design intent into a functional, accessible, and performant website. These principles are valuable for both designers and developers.

### What is standardization?

Specifications, implementations, web content, and test suites make up the basics of standardization, but a lot has to do with consensus and documentation as well. As we can not break the web, it is important to note that there always is some form of technical debt as well. This is constantly being thought of. How to not create the technical debt of tomorrow.

So what exactly is CSS? What is the definition and the goal?

CSS allows the intent of the designer to be communicated to a browser that executes on it

For this, there are a lot of design principles that need to be taken into consideration:

- **flexible**
- **robust**
- **avoiding data loss**: make errors clear vs making CSS work it out (in an unwanted manner)
- **compatibility**: forwards and backward, don't break the web
- **powerful**
- **understandable**
- **performant**
- **International**
- **integrated**: every part of CSS integrates with every part of CSS
- **Getting to awesome**: being thorough, helpful, curious, persistent, being for the greater good, collaborative, being excellent

An example of being thorough: did you know that everything in `border-radius` is specced to detail, including how the corners are cut? CFR: [https://www.w3.org/TR/css-backgrounds-3/#corner-shaping](https://www.w3.org/TR/css-backgrounds-3/#corner-shaping)

## The Garden and The Treadmill

Remember the [CSS Zen Garden](https://www.csszengarden.com/) days? Amazing designs were made with limited tools. We used background images to fake rounded corners (no `border-radius` yet) and positioning hacks.

Today, we have tons of CSS tools, but sometimes we get stuck in our old ways and write hacky CSS when there are better solutions. We have container queries and logical properties, but we are not even using grid properly yet. Building a "holy grail" grid used to be tough, now it's a single line.

This presentation is a bit harder to put into words, but I think it delivered a nice bit of reflection to end the first day of CSS Day

## Over-engineering your CSS

"Hi there, my frontend-friends". With this opener, we were ready to kick off CSS Day 10.2 with Kevin Powell. Kevin Powell is a YouTuber who teaches CSS with more than 900k subscribers.

It is considered best practice to avoid over-engineered solutions as they can result in added complexity, less readability, and maintenance issues. But in this presentation, Kevin showed us that when using CSS this can be a good thing to do as it can create some robust solutions.

It started as a simple example. How to set a max width on the whole container:

```css
.container {
  max-width: min(100% - 4rem, 60ch);
  margin-inline: auto;
}
```

This sets the container full width - a `4rem` padding when `60ch` doesn't fit.

For me, this talk was more about confirmation. I tend to write about some over-engineered things for grids and sliders and a lot of the things Kevin was showing reflect these kinds of solutions. He also added an emphasis on using Logical properties and that when overengineering items we should expose specific controls by using custom properties scoped to the selector:

A simplified example is the following:

```css
.fluid-grid {
  --fluid-grid-min: 30ch;
  --fluid-grid-gap: 1rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(var(--fluid-grid-min), 100%), 1fr));
  gap: var(--fluid-grid-gap);
}
```

But he went a whole step further in creating a complete breakout grid system by using `grid-template-columns`.

![Kevin Powell showing some over-engineered grid-template-columns in CSS on a slide](/articles/this-was-css-day-2024-the-10th-edition/over-engineering-kevin-powell.jpg)

Creating these kinds of things can increase your CSS understanding. If you just want a builder for that, here it is: [https://layout-breakouts-builder.vercel.app/](https://layout-breakouts-builder.vercel.app/)

From a personal standpoint, I love playing around with custom properties and overengineer these kinds of things. As an attendee, I was amazed at the creation of his version of the breakout grid. And as for simply creating controls and over-engineering, I learned that I’m probably doing something right. I’m not going to shamelessly plug in some article I created in the past on this matter. Instead, I’m just going to be grateful for this presentation. So, thank you, Kevin, I needed this talk!

## CSS and Accessibility

When Sara Soueidan gives a presentation, you better just drank a cup of coffee, there is no way to take notes as fast as she throws information at you unless you are a very skilled steno typist. Knowing this beforehand I know I had to write some keywords of the most important pieces of information and I'll just sum those up here in separate lists. **Do watch this talk when it enters YouTube**! It was her first talk in 4 years, and she did deliver. She started with some basic information about the A11Y tree, following up with some more detailed info.

Understanding the A11Y tree is crucial. Each element needs four key pieces of information:

- **Role**: This tells assistive technologies what the element is (e.g., button, list, etc.).
- **Name**: This identifies the element clearly for screen readers.
- **Description**: This provides additional context, especially for complex elements.
- **State** (optional): This indicates the element's current status (e.g., checked, selected).

It's important to be aware that CSS can sometimes affect an element's `role`. For example, using `list-style: none;` on an unordered list (`<ul>`) might remove the visual bullet points, but it could also hide the list's role from screen readers. To avoid this confusion, you can either explicitly set the role using `role="list"` or use `list-style-type: ""` in CSS; which preserves the list role while removing the bullets.

For checkboxes and radio buttons, it's tempting to completely hide the original input element. However, this creates problems for visually impaired users who rely on swiping gestures to find form controls. The best practice here is to create a styled element that overlays the real input and set its `opacity` to `0`. Sara has a great example of this approach in her [CodePen](https://codepen.io/SaraSoueidan/pen/Jowwde)

Screen readers announce information in a specific order. They prioritize `aria-labelledby` and `aria-label` attributes first (in that order), followed by `alt` or `title` attributes, then any associated `<label>` or `<legend>` element, and finally the element's content itself. Knowing this order helps ensure your content is presented clearly to assistive technology users.

You can see that order in DevTools

![DevTools Example showing the order of information: aria-labelledby, aria-label, alt / title, label / fieldset, content iself](/articles/this-was-css-day-2024-the-10th-edition/devtools-example.png)

Pseudo-elements can be powerful tools, but be mindful of the content property. It can affect how screen readers announce the element. If you're using content with an image, consider adding alternative text using the `/` character. This allows you to describe the screen reader, even if the image itself isn't visible.

```css
.btn::before {
  content: url('some info icon') / 'info';
}
```

She also talked a bit about Popovers (shoutout to Open-UI!) And a whole bunch of other things.

I can not give the full information here, but let me at least give a shout-out to her course: [Practical accessibility](https://practical-accessibility.today/)

## Anchor positioning… finally!

Tab Atkins-Bittner's talk on CSS Anchoring showcases something I have been looking forward to for a long time. The CSS Anchoring API allows elements to be "tethered" together, eliminating the need to nest them within non-static positioning contexts. However, a word of caution: syntax might be updated a bit more in the near future.

Before diving into anchoring, we got a quick refresher on positioning and layout flow. This is essential because Anchoring will have some effect on it. Relative and sticky positioning keep elements within the layout flow, while absolute and fixed positioning takes them out of it. Absolute positioning uses the nearest ancestor with non-static positioning as the containing block (usually the Initial Containing Block or ICB). Fixed positioning, on the other hand, is relative to the viewport.

This and a bunch of gotchas when it comes to grid positioning and we were ready to tackle Anchoring Positioning

Here are some key things to remember about anchoring:

- **"Auto" insets**: In anchoring, "auto" insets are resolved to 0.
- **Language-specific considerations**: There's a property called x-start that accounts for language directionality (e.g., Cyrillic vs. Western).
- **Compositor placement**: Anchor positioning leverages the compositor but with limitations in layout capabilities.

![Tab Atkins-Bittner showing some live coding with CSS anchoring](/articles/this-was-css-day-2024-the-10th-edition/tab-atkins.jpg)

This talk covered a lot of ground, and mastering anchor positioning before full browser support might be a wise move and is something that I’ll be working on this year. The possibilities for anchoring elements to each other, combined with alignment properties, were a joy I want to check out even more.

Some resources:

- [Basics of anchor positioning](https://utilitybend.com/blog/lets-hang-an-intro-to-css-anchor-positioning-with-basic-examples)
- [Chrome developers on anchor positioning](https://developer.chrome.com/blog/anchor-positioning-api)
- [Anchor tool by Una Kravets](https://anchor-tool.com/)

## Scroll-enhanced experiences

Carmen Ansio is a Google Developer Expert and works at t [LottieFiles](https://lottiefiles.com/). In this demo-packed presentation, she showcased some of the awesome capabilities of scroll-driven animations. Showering her love of Zelda games and creating a moving Link figure on the screen. Best to be watched as this was mostly demo based, but if you wan to go deeper in scroll driven animations, I can hardly recommend [Carmen Ansios CodePen](https://codepen.io/carmenansio/pens/showcase) and this [scroll-driven animations course by Bramus](https://www.youtube.com/watch?v=5noL_qFobm0).

## Experimentation with Roman Komarov

I have spoken with Roman a few times in the past, and all I can say is: the CSS knowledge in the head of Roman is impressive, to say the least. I think I do know my fair share of CSS, but he can make me get lost in about a few minutes (and I need a few hours to decipher some of his experiments). Never have I met someone who thinks outside the box so much when it comes to CSS. A new feature becomes experimental, ok… how can we abuse this new feature to fix some other common problem? Such as fit-to-width text while using scroll-driven-animation (link in resources)

Most of the experiments can be found on his blog [kizu.dev](kizu.dev), but still this presentation packed a lot of information on how to experiment with new features. A great tip on advice was that when experimenting, always make sure that users know that this is an experiment and by no means something to be used on production as there might be some implications (performance, accessibility, etc). He also talked a bit about Ponyfilling, A polyfill is almost the same as a polyfill, but not quite. Instead of patching functionality for older browsers, a ponyfill provides that functionality as a standalone module you can use. [An example of ponyfilling can be found here](http://youtube.com/watch?v=f5felHJiACE).

Don't be afraid to do pony filling and only add certain features for browsers that can handle them. As long as content is reachable, it can be good to work towards the future.

I **highly recommend reading some of the things Roman writes **and watch the video later on.

**Interesting resources:**

- [kizu.dev](https://kizu.dev/)
- [Cyclic toggles](https://kizu.dev/cyclic-toggles/)
- [So, you want to encapsulate your styles?](https://knowler.dev/blog/so-you-want-to-encapsulate-your-styles)
- [Some cases for revert-layer](https://www.mayank.co/blog/revert-layer/)
- [Layered toggles (hacking mixins with CSS)](https://kizu.dev/layered-toggles/)
- [Fit to width text (using SDA)](https://kizu.dev/fit-to-width-text/)
- [Scroll driven animations](https://kizu.dev/scroll-driven-animations/)

## Teaching CSS

Josh Comeau’s presentation was very inspiring but hard to write about. Josh Comeau shows how he handles teaching CSS, because let's face it, CSS has a simple syntax, but is very hard to understand.

How do you teach CSS? How about leaving the box modal aside for a second? How about looking at it as a constellation of layout modes? This is how Josh tackles this, looking at every layout mode as a single micro-language, being it flex, grid, or flow and I loved where he went from there.

I love how he simplified some examples because that’s important. Explaining the relations of absolute potioning by referencing a teenager to “go to his room” was great. Many more examples that I’ve been thinking hard on and will try to apply myself when helping someone out.

## A closing keynote by Nicole Sulivan

I need to be a bit honest here. After 2 days of CSS Day, closing off with more calls to action on the two masonry proposals wasn’t necessary for me. I think the talk was just as important as the others, maybe the timing was a bit off. Unfortunately, Nicole also didn’t have time for a Q&A.

That being said, I believe that if the Masonry Debacle is still on while the videos are released, you definitely should watch this one as well.

## The end of CSS Day and onwards to CSS Café

After some drinks, some chats, and goodbye to Krijn Hoetmer one of the organisers of CSS day, It was time to get some rest, because there was a post-event “CSS Café”.

But first, this lovely picture:

![PPK and krijn standing back to back, ppk with arms wide open and krijn making pistol hands](/articles/this-was-css-day-2024-the-10th-edition/ppk-and-krijn.jpg)

Thank you Krijn, for all that you have done!

On the Saturday after CSS Day, we have CSS Café, for those who just can't get enough. I guess I'm one of them...

After an interesting talk by Rachel-Lee Nabors on web animations, It was time for me to do a bit of a last-minute presentation. To give a bit of background: I'm part of two W3C community groups and one of them is the[ CSS4 / CSS Next community group](https://www.w3.org/community/css4/).

We were with a few people from that group at CSS Day: Adam Argyle, Una Kravets, Amit Sheen, Quentin Albert, and myself.

We were asked to give a short introduction to this community group and do a request for comments during CSS Cafe. I was happy to give the intro and we had a lot of valuable input from a bunch of people there.

![Me giving the intro on CSS Next at CSS cafe](/articles/this-was-css-day-2024-the-10th-edition/css-cafe.jpg)

I will do a full write-up about this RFC later on, but you can read [the CSS-Next RFC here](https://github.com/CSS-Next/css-next/discussions/92).

One again, a fantastic CSS Day, action packed and a head chockful of inspiration to build on to in the upcoming year! See you next year?
