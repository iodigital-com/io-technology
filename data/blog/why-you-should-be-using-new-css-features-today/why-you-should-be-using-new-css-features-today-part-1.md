---
title: 'Why you should be using new CSS features today - part 1'
date: '2022-11-30'
tags: ['frontend', 'css']
images: ['/articles/why-you-should-be-using-new-css-features-today/new-css-features-1.png']
summary: 'Unless you have no affinity with CSS at all or have been living under a rock for the last year, you should have noticed that new CSS features are skyrocketing like never before. Although this is a good thing, it might get frustrating to get a grasp on all these new playthings because every time you add something new in your styling toolbox, the next best thing is just around the corner.'
authors: ['brecht-de-ruyte']
theme: 'beige'
serie: 'why-you-should-be-using-new-css-features-today'
---

## The main benefits of using the latest CSS features

Is it because they are cool, new and shiny? No, there is a lot more going on than that. Some of the latest things happening in CSS solve some of the biggest frustrations in web development. Just imagine some of the recent features that are starting to see the light of day, such as [container queries](https://techhub.iodigital.com/articles/container-queries-the-next-step-towards-a-truly-modular-css), [:has()](https://techhub.iodigital.com/articles/practical-uses-of-the-has-relational-pseudo-class), [cascade layers](https://techhub.iodigital.com/articles/you-need-css-cascade-layers), logical properties, masonry and scroll animations. Although some are more supported than others, they can really reduce the usage of client side JavaScript in your projects and speed up your performance.

A lot of JS frameworks have become real powerhouses of the last years and it’s time you should be using them for what they do best and keep everything “layout” in CSS. Remove the hacky “useEffect” hooks from your React applications and start using things that a browser knows as the browser is your friend, never forget that.

### Bonus: you get some free study time if you start using them now

This is a personal opinion but in my experience, I noticed that when you just read about a new feature, you start to forget about it when it gets released and you won’t be picking it up. Thus, you might be writing outdated code and actually doing more work than you should. Being lazy can be a good trait for a developer, so write less code that does more. If you’ve experimented with it, chances are that you mastered it by the time it’s a fully evergreen browser feature.

But I hear you, you will be doing some more work while learning these new features. You will have to write some support flags in your CSS, you might need to set up some extra packages in your PostCSS config, but believe me, your future self will be grateful!

## Where we are today

Before I get into all the real future of things, it’s good to define where we’re at today. We still get stuck in a lot of old habits. Some things are just hard to let go of, they aren’t necessarily bad things as these have been working for years and feel like a safe zone. But technology keeps evolving and so should we as “masters of the cascade”.

### Where we are today: So… you’re still not using custom properties?

Let me be the bad guy here for a second and fire some shots… If you’re still not using custom properties (a.k.a css variables) in your CSS you are starting to fall behind. Don’t argue with me about the 1% of users that still use an outdated browser that doesn’t support them. Sadly enough, people don’t see the benefits of custom properties and if you’re one of those people, I completely understand. Sass variables are nice, even today they solve a lot of problems in CSS.

For most cases, it actually seems like more work. Take this simple styling of some alerts as an example:

```scss
$color-default: #555;
/* and all the other variables over here */

$alert-colors: (
  'success': (
    'background': $color-success,
  ),
  'warning': (
    'background': $color-warning,
  ),
  'error': (
    'background': $color-error,
  ),
  'info': (
    'background': $color-info,
  ),
);

.alert {
  background: $color-default;
}

@each $color, $value in $alert-colors {
  .alert-#{$color} {
    background: map-get($value, background);
  }
}
```

Pretty standard stuff and this works great, let’s create the same thing with custom properties and still use Sass to make a better reference.

```scss
:root {
  --color-default: #555;
  /* and all the other variables over here */
}

$status-colors: (
  'success': (
    'background': var(--color-success),
  ),
  'warning': (
    'background': var(--color-warning),
  ),
  'error': (
    'background': var(--color-error),
  ),
  'info': (
    'background': var(--color-info),
  ),
);

.alert {
  background: var(--alert-bg, var(--color-default));
}

@each $color, $value in $status-colors {
  .alert-#{$color} {
    --alert-bg: map-get($value, background);
  }
}
```

If you are paying attention, you might notice that my code just got larger and you’re right. Even the output of my code will be larger by a small margin. But I just received a newsflash from the client:

**Hey, we were thinking about adding a dark theme for our website, the alerts should have a light variant background in that case. Also, we would like them to be black and white for people who prefer high contrast in the browser.**

If you were using Sass variables, you’d probably have to re-declare all your alerts scoped into media queries. But, because I used custom properties I can re-declare my custom properties:

```scss
:root {
  --color-default: #555;
  /* and all the other variables over here */
  @media (prefers-color-scheme: dark) {
    --color-default: #efefef;
    /* and all the other dark theme variants over here */
  }
  @media (prefers-contrast: more) {
    --alert-bg: black;
  }
}
/* same Sass map and default alert here */

@media (prefers-contrast: no-preference) {
  @each $color, $value in $status-colors {
    .alert-#{$color} {
      --alert-bg: map-get($value, background);
    }
  }
}
```

My output CSS is now significantly smaller as I didn't have to redo all the alert selectors based on the dark theme. It also keeps my CSS modular and flexible for future updates. My future self is now a happy camper. I know making all your alerts black and white isn’t good A11Y practice, it was just to prove my point when it comes to custom properties with this very simple example.

Also, CSS custom properties can be set by using JS, it makes playing around with CSS so much easier and doesn’t require you to set a whole bunch of inline styles on your dom. Just [take a look at this very simple example on CodePen](https://codepen.io/utilitybend/pen/JjvoYGj).

It’s really nice to have the ability to overwrite your variables, and you can really go crazy with that, but just try to keep things a bit clean, ok ;)

### Where we are today: Designers should just “respect the grid”

A lot of people (including myself) have been using a 12-column Bootstrap flexbox grid for so long that it became second nature. Although design consistency is important when it comes to time management of front-end development and creating a good design system, a 12 column grid seems to be a bit of an outdated idea. Especially now that CSS-grid has such great support with “subgrid” just around the corner, we really should give designers more freedom when it comes to creating their layouts.

Here are some tips on how to get started with that:

- Think less in column amount and window widths
- Think about max and min width of grid items as CSS can handle that
- Think more about returning grid patterns than “one grid to rule them all” to build a design system

Even [simple grids can be made powerful by using the auto-fill](https://codepen.io/utilitybend/pen/vYjePzw) value in CSS.

```css
.articles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 1fr;
  gap: 24px;
}
```

You might wonder why we should make things harder than they used to be by declaring multiple grids on a website. \
With some careful CSS planning in your design system you can easily define your common patterns, so in the end, it’s only a small effort to create a front-end design system that’s a bit more unique and “designy”. You can also easily scope these grids based on your component to make it bulletproof for other tweaks on the design system. Especially combined with custom properties you can make something dynamic as well. It removes the overkill of classes that we see by using Tailwind or Bootstrap since all of these things are nicely contained in the component.

In theory, the output CSS shouldn’t be bigger than using a full Bootstrap grid. In fact, if you use a lot of recurring patterns, it might actually be smaller. When you start to notice how fun it is to work with some clean markup, I'm sure you’ll never want to work with an overkill of helper classes again.

But the most important part is that using CSS-grid like this is a strong basis for the future when we will fully start using container queries and subgrid. A very basic and important step to a truly fluid web.

### Where we are today: not a CSS purist yet

There is still a lot missing at the moment before we can truly step away from Sass, especially when it comes to using variables in things such as media queries. But that doesn’t mean we can’t combine these two technologies. I love the idea behind Bootstrap and Tailwind as well, both of them are fantastic tools to get something done quickly, but as someone who likes a challenge when it comes to design, I mostly get the feeling I’m fighting against these libraries instead of them helping me out when a design gets a bit more tricky.

I’m also a strong believer that clients will ask for more unique designs in the future because at the moment there are a lot of webshops out there and a lot of them look more and less the same. Design is emotion and emotion sells, and if every emotion looks the same, it’s a pale world (wide web).

## That’s it for part one

Yes, no real tips and tricks here yet, but stay tuned for part 2! I wrote this bit mostly to tickle your brain a bit. I’m absolutely sure there will be some people who absolutely hate the idea of writing custom CSS from scratch and that’s ok. By reading this you should be thinking things like:

- Maybe the framework I’m using won’t keep up with CSS releases?
- Maybe I should start reading a bit more about all this new CSS stuff?
- Maybe I should style my buttons by using custom properties for my next project?
- Maybe I should comment on Slack that Brecht is a diluted idiot who lives in a fantasy where time and money doesn’t matter?
- “CSS IS AWESOME!” (no, _YOU_ are awesome!)

In no case, am I assaulting any use of frameworks, libraries and maybe tools that can purge your CSS from unneeded selectors. It’s about reflecting on how we can take our CSS game to the next level by evolving as a developer and maybe even becoming a fully-fledged CSS-developer.

In the next part, I will be showing some ideas on how to use new CSS, today without it affecting our workload too much and slowly learning the tools for the CSS future.
