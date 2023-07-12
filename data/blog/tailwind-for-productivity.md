---
title: 'Tailwind for productivity'
date: '2023-07-10'
tags: ['Tailwind', 'CSS', 'Frontend', 'Productivity', 'DX']
summary: "In general, developers don't find writing CSS the most fun part of software development. Although, in my opinion, Tailwind CSS makes it fun and efficient!"
authors: ['ronny-rook']
theme: 'blue'
---

_Using Tailwind is already a highly debated topic, I would like to emphasize that the following statements are just my and based on my experience. I hope you'll learn something_

There has been, and probably always will be, a lot of discussion about using Tailwind for styling. Some people will say it’s bad, simply because it makes your code look ugly and messy, resulting in code that’s harder to read. Also ignoring principles like separation of concerns is a big downside for people arguing against Tailwind.

And honestly, I get it. When I saw Tailwind for the first time, I hated it as well. Next to the above concerns, I also felt like I had to learn a new language, and found myself revisiting their documentation to find specific classes that weren't as intuitive as I hoped. Regardless I gave it a try and fell in love with my increased productivity and the overall increase in developer experience (DX) Tailwind brought to my workflows.

### Separation of concerns

What most of us used to do was decouple HTML and CSS by using semantic classes, whereas writing Atomic CSS is focused on encapsulation with utility classes. So instead of creating a `.button` or `.nav` class or improving your classes with for example [Block Element Modifiers](https://getbem.com/introduction/) (BEM for short) `.button—prev` or `.nav__button`, you'd rather write something like `<button class="bg-black text-white font-bold" />`. This means worrying about accidentally breaking something because you removed a rule in your `.button` class can be considered history. Every element has its own classes that only apply to that specific element, one of the basic principles of Atomic CSS.

Whether you use Angular, React, Svelte or Vue, because of the encapsulated styling Tailwind goes very well with every components-based framework. Consider using React, where JSX is the way to use an XML-like syntax within your Javascript. Separation of concerns already is not the top priority because of mixing JSX with your business logic. As Adam Wathan (creator of Tailwind) also mentioned in his blog post ["CSS Utility Classes and 'Separation of Concerns'"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/), you might end up with a CSS file similar to the following, making your CSS represent a big part of your HTML structure:

```css
.author-bio {
  background-color: white;
  border: 1px solid hsl(0, 0%, 85%);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  > img {
    display: block;
    width: 100%;
    height: auto;
  }

  > div {
    padding: 1rem;

    > h2 {
      font-size: 1.25rem;
      color: rgba(0, 0, 0, 0.8);
    }

    > p {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.75);
      line-height: 1.5;
    }
  }
}
```

> My markup wasn't concerned with styling decisions, but my CSS was very concerned with my markup structure. Adam Wathan

Of course above CSS code doesn't take any semantic improvements (like BEM) into account. But recently I've found myself reaching for quick easy-to-implement styling notations like this quite often. In both CSS/SASS as well as using CSS-in-JS libraries like Styled Components or Emotion CSS I was rewriting parts of my HTML markup in CSS. Adam's blog post ["CSS Utility Classes and 'Separation of Concerns'"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/) addresses more possible hurdles with separation of concerns and is worth reading.

### Writing less code

Developers are known for taking the path of less resistance. Whether it used to be something like LESS, Sass or Stylus, preprocessors have tried to decrease the CSS code written by developers and make our lives easier. But although we could use nesting, create variables or remove every semicolon we had to write, at the end of the day you’d still write CSS. With any Atomic CSS framework, you’re able to reduce everything to only writing utility classes.

Consider for example this div changing from a flex to a grid layout relative to the viewport size.

```css
div.layout {
  display: flex;
  flex-direction: column;
}

@media (min-width: 996px) {
  div.layout {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

Using Tailwind this implementation can be reduced to only writing a few classes, where a media query can be easily prefixed with for example `md:` or `lg:`.

```html
<div class="flex grid-cols-3 flex-col md:grid"></div>
```

First of all, we have less code to write, and secondly, we do not even need to worry for even a second about coming up with unique class names for our elements. Also in teams, over time class names can become inconsistent with changing developers. Where `layout` is still an easy class, every developer knows that in growing applications naming stuff can grow into one of the hardest parts of software development.. 😉 Never worrying about coming up with a class name anymore, is a big upside for me.

![Ryan Florence, creator of React Router and Remix about Tailwind benefits](/articles/tailwind-for-productivity/twitter-ryan-florence.png)

Besides simplifying the class names and media queries, it often bundles multiple CSS rules into one class name or provides an easy-to-use prefix. Take the `nth` selectors as another example.

```css
div.item {
  text-align: center;
}

div.item:first-child {
  text-align: left;
}

div.item:last-child {
  text-align: right;
}

div.item:nth-child(odd) {
  background-color: red;
}

div.item:nth-child(even) {
  background-color: green;
}
```

```html
<span class="odd:bg-green even:bg-green text-center first:text-left last:text-right"></span>
```

Truncating text is something I simply Google every time I had to use it:

```css
span.text-overflow-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Within Tailwind the same effect can be achieved by applying just one simple class:

```html
<span class="truncate"></span>
```

Tailwind also offers support for selecting elements based on a parent or sibling state. The so-called `group` and `peer` selectors make it easy to apply classes based on certain states:

```html
<div class="is-published group">
  <!-- Will add the `block` class based on .is-published being applied to the parent -->
  <div class="group-[.is-published]:block hidden">Published</div>
</div>
```

```html
<form>
  <label for="email">Email:</label>
  <input id="email" name="email" type="email" class="is-dirty peer" required />
  <!-- Will add the `block` class based the peer element being HTML required and having the class .is-dirty -->
  <div class="peer-[.is-dirty]:peer-required:block hidden">This field is required.</div>
</form>
```

> This makes it possible to do all sorts of neat tricks, like floating labels for example without any JS.
> This pattern works with every pseudo-class modifier, for example peer-focus, peer-required, and peer-disabled **- Tailwind documentation**

It even already shipped support for the upcoming [Container Queries](https://tailwindcss.com/blog/tailwindcss-v3-2#container-queries), which are simply said media queries for elements based on the size of their container/parent.

- [See **“Responsive Design”**](https://tailwindcss.com/docs/responsive-design)
- [See **“Handling Hover, Focus, and Other States”**](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [See **“Styling based on parent state”**](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state)

### Increasing performance

In general Tailwind, or rather every Atomic CSS framework, tends to have better performance than writing vanilla CSS. Within Atomic CSS classes are reused many times, with every reuse it is only a few more bytes of HTML instead of shipping an extra CSS class with partly the same functionality as others.

> Tailwind CSS is incredibly performance focused and aims to produce the smallest CSS file possible by only generating the CSS you are *actually using* in your project.
> **- Tailwind documentation**

- [See **“Optimizing for Production”**](https://tailwindcss.com/docs/optimizing-for-production)

### Benefits for teams

Besides not having to argue with your colleagues about naming stuff, I do think Tailwind can provide the following extra benefits for teams within larger projects:

1. I’ve come across unused classes more than once. Except for double-checking whether a class is still used throughout the rest of the project, the implementation of the class itself might be deleted from the HTML element, but the CSS code remains in the codebase. Sometimes this is a form of laziness, but it can also be uncertainty about the usage of the class. Unused code, or so-called dead code, won’t happen with Atomic CSS/Tailwind will and thus we never ship unused code to the client.

2. Reusing classes can introduce more fear for some developers to change a class. Manual regression testing might be the only available way to acknowledge if certain style changes still apply as expected throughout the whole application. Instead of adjusting the initial class and checking if all the elements containing the class, are still working, they write and apply a new class. Just as with dead code, this makes you ship more CSS over time and makes your code less maintainable.

3. Growing codebases without a framework like Tailwind CSS tend to, over time, introduce their own utility classes and helper functions. Since they're probably quite specific for your particular project, these utility classes mostly keep being undocumented, unmaintained and unoptimised. Supporting a project, in the long run, might introduce unnecessary hurdles easing back into the project after a couple of weeks/months.

4. The example from above might be covered in code reviews, but quite often slip through as well. In my opinion, Tailwind makes code reviews easier to understand as well. Sometimes adjusting a class is included in the review, but none of the instances where it's applied are. Instead of switching between multiple files within the review, or keeping the related HTML/CSS file open next to your currently reviewed code, you instantly see which CSS properties apply to the elements being reviewed.

![Cory House, ReactJS teacher, consultant and tech influencer](/articles/tailwind-for-productivity/twitter-cory-house.png)

Although it's still completely fine to write CSS in any way you prefer. I think it's worth considering Tailwind as an alternative for both teams with big projects as well as quickly prototyping your side projects. I only want to encourage people to give Tailwind an honest thought and compare it to your current approach on some of these measures:

- Do you have resources to understand the CSS approach taken?
- How do I assure I’m not duplicating styles?
- Can I easily see the CSS applied per class (in Tailwind hovering a class shows the applied CSS)

### Downsides

All tooling and techniques have different tradeoffs. Use Java over C and you lose the topnotch memory management. Choose Python over Java and you lose compile-time type checking. For Tailwind it's also not only a bed of roses.

- The learning curve is relatively high. You have to learn a new abstraction and all the classes provided by Tailwind.
- Tailwind is not a native API, so a build step is required. This means that there’s some extra overhead while creating a web page.
- The "ugly" class name problem. Even Tailwind themselves state in the docs that it might not be the best solution at first sight. Messy HTML isn't just aesthetics. But it can be seen as technical debt that will make your styles harder to read and maintain.
  > Now I know what you’re thinking, **“this is an atrocity, what a horrible mess!”** and you’re right, it’s kind of ugly. In fact it’s just about impossible to think this is a good idea the first time you see it — you have to actually try it. **- Tailwind documentation**
- Tailwind can’t do everything. This means that from time to time, you may have to add some inline styles or create some custom classes alongside Tailwind to get things done. With arbitrary values, you can use values that are not built into Tailwind like `border-b-[1px]` (a 1px border is not a default Tailwind value). Or with a custom theme, you can also extend or overwrite the default behaviour. You can even use CSS or SASS/LESS files alongside Tailwind. Is this terrible? Not really, but it does mean that Tailwind isn’t the silver bullet, yet.

### Quick tips

#### Auto sorting

If you use Prettier, [pretter-plugin-tailwind](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) delivers an auto sorting of class names. Besides not having to worry about the order, it makes the chosen order consistent as well. Besides it reducing the amount of CSS bugs (because order matters in CSS) and it will make scanning code during code reviews easier.

If you do not use Prettier, this [VSCode plugin Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind) delivers the same benefits.

#### Auto completion

Editors like [WebStorm do Tailwind autocompletion by default](https://www.jetbrains.com/help/webstorm/tailwind-css.html). But when you're using VSCode you're making your life a lot easier by installing [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) to autocomplete your Tailwind classes.

#### Cheatsheet

Although you're using Tailwind autocompletion within your favourite editor, you might find yourself searching through the documentation - looking for the corresponding Tailwind class to your desired CSS property - regularly. In my opinion, the docs are really good but focus on the why more than the how. When you Google [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet) you will find more than one great overview to quickly find what you need.
