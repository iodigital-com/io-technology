---
title: 'How to build accessible main navigation?'
date: '2023-01-09'
tags: ['a11y', 'accessibility', 'frontend', 'css', 'js', 'voiceover']
images: ['/articles/how-to-build-accessible-navigation/cover.jpg', Photo by <a href="https://unsplash.com/@ruben_christen">Ruben Christen</a> on <a href="https://unsplash.com/photos/bjUU99NhR08">Unsplash</a>]
summary: 'This article contains a guide to build an accessible main navigation of a website. The key takeaways of this guide are: HTML semantics, WAI-ARIA, CSS and JS for accessibility.'
authors: ['tim-dujardin']
theme: 'orange'
---

## Introduction

Structuring a webpage is based on using the right semantic HTML, these semantics will provide all kinds of information
necessary to process to page. Assistive technology is one of these page processing tools, so it's important to make sure
everything is communicated in the right way.

In this article I will zoom into the main navigation region of a webpage while keeping the assistive technology in
mind. An example of assistive technology through computer software is a screen reader, for more examples of assistive technology take a look at [the AT list on atia.org](https://www.atia.org/home/at-resources/what-is-at/).

For this article, I will be using the [VoiceOver](https://support.apple.com/en-gb/guide/voiceover/vo2682/mac) screen reader on Mac to illustrate examples.

These are some terms used alternatively throughout the article:

| Abbreviation | Term                 |
|--------------|----------------------|
| a11y         | Accessibility        |
| AT           | Assistive Technology |
| SR           | Screen reader        |

## Screen readers

Screen readers use [the accessibility tree instead of the regular DOM tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree), which is basically the DOM tree from a
(meaningful) semantic point of view. If you want to view the a11y tree yourself, you can take a look at the ["What is an accessibility tree and how do I view it?"](https://accessibleweb.com/question-answer/what-is-an-accessibility-tree-and-how-do-i-view-it) article.

## Accessible in 5 steps

These are the steps I will guide you through:

1. Identify the navigation region(s)
2. Communicate the list of navigation items and its size
3. Add multiple levels
4. Highlight the active (sub)page
5. Provide mobile support

### 1. Identify the navigation region(s)

To identify the navigation region on a webpage, I use the `<nav>` element.

> AT info: SRs have [shortcuts and gestures](https://dequeuniversity.com/screenreaders/) to navigate by landmarks, so they don't need to go through the whole webpage over and over again when discovering a website.

```HTML
<nav>
  <a href="/about-us">About us</a>
  <a href="/products">Products</a>
  <a href="/insights">Insights</a>
  <a href="/contact">Contact</a>
</nav>
```

### 2. Communicate the list of navigation items and its size

As a regular user, I see that the navigation consists out of a list of 4 links, but a SR user won't hear a *"List"*
announcement since the markup doesn't represent that. To create an equal experience for both users, wrap the navigation
links in a `<ul>` element.

> AT info: When SRs navigate to a list element such as `<ul>` or `<ol>`, they will announce *"List # items"*. The same
> could be achieved through using WAI-ARIA role `list` and `listitem`, but the rule of thumb is "use ARIA as a last
> resort". More information on ["When should you use ARIA?"](https://gomakethings.com/when-should-you-use-aria/).

```HTML
<nav>
  <ul>
    <li><a href="/about-us">About us</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/insights">Insights</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

### 3. Add multiple levels

Multi-level support can be provided through 5 changes:

1. Replace the `<a>` by a `<button>` since the purpose of 'Products' is no longer navigation, but toggling the submenu. More info in the ["Buttons vs links"](https://css-tricks.com/buttons-vs-links/) article.
2. Add `aria-expanded="false"` to the `<button>` element to let the SR know that interacting with the button will expand
   another element. The visual representation is the arrow icon (`<svg>`) in this scenario, since it's only visual I
   hide it for AT through `aria-hidden="true"`.
3. The element expanding through interaction with the button is referenced by the `aria-controls` attribute.
4. This is the first time JavaScript comes into play, to toggle the right `aria-expanded` value and to move the focus to the
   first actionable element within the referenced element.
5. Closing the referenced element must be done via the `ESC` key, which is the industry standard.

> AT info: The SR will now announce *"Products, collapsed, button"* on focusing the initial state of the button. When
> you click the button, it will announce *"Products, expanded, button"*

```HTML
  <nav>
    <ul>
      <li><a href="/about-us">About us</a></li>
      <li>
        <button aria-expanded="false" aria-controls="products-level-2">
          Products
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="12" height="9" viewBox="0 0 12 9">
           <polygon points="1 0, 11 0, 6 8"></polygon>
          </svg>
        </button>
        <ul id="products-level-2" class="hidden">
          <li><a href="/products/product1">Product 1</a></li>
          <li><a href="/products/product2">Product 2</a></li>
        </ul>
      </li>
      <li><a href="/insights">Insights</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
```

```JavaScript
[...document.querySelectorAll('nav button[aria-expanded]')].forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    const isExpanded = button.getAttribute('aria-expanded') === 'true'
    const controls = document.getElementById(button.getAttribute('aria-controls'))
    
    // toggle expanded state on the button
    button.setAttribute('aria-expanded', !isExpanded)
    // show the ref element
    controls.classList.toggle('hidden')
    // focus on first actionable element within the ref element
    controls.querySelector('a:first-child, button:first-child').focus();
  })
})

window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') {
    const button = document.querySelector('button[aria-expanded="true"]')
    const controls = document.getElementById(button.getAttribute('aria-controls'))
    
    controls.classList.add('hidden')
    button.setAttribute('aria-expanded', false)
    button.focus();
  }
})
```

### 4. Highlight the active (sub)page

#### 4.1 Active page

Most websites provide an active state styling for current page links, but this will only cover the visual part of
communicating this information. On a semantic level, I need to make use of an ARIA attribute called `aria-current`.

> AT info: The anchor element with attribute `aria-current="page"` will be announced as *"Current page, link, About us"* by the
> VoiceOver screen reader.

```HTML
  <nav>
    <ul>
      <li><a href="/about-us" aria-current="page">About us</a></li>
      <li>
        <button aria-expanded="false" aria-controls="products-level-2">
          Products
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="12" height="9" viewBox="0 0 12 9">
           <polygon points="1 0, 11 0, 6 8"></polygon>
          </svg>
        </button>
        <ul id="products-level-2" class="hidden">
          <li><a href="/products/product1">Product 1</a></li>
          <li><a href="/products/product2">Product 2</a></li>
        </ul>
      </li>
      <li><a href="/insights">Insights</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
```

#### 4.2 Active subpage

When the webpage contains a multi-level main navigation, you can use the `title` attribute on the parent link to
announce that a sublevel item is the current page.

> AT info: Now, when I navigate to the 'Products' link via my screen reader, I will hear *"Products, link, Contains
> current page link"* to indicate that the current page is inside its submenu.

```HTML
  <nav>
    <ul>
      <li><a href="/about-us">About us</a></li>
      <li>
        <button aria-expanded="true" aria-controls="products-level-2" title="Contains current page link">
          Products
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="12" height="9" viewBox="0 0 12 9">
           <polygon points="1 0, 11 0, 6 8"></polygon>
          </svg>
        </button>
        <ul id="products-level-2">
          <li><a href="/products/product1" aria-current="page">Product 1</a></li>
          <li><a href="/products/product2">Product 2</a></li>
        </ul>
      </li>
      <li><a href="/insights">Insights</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
```

>Important: Be careful with the usage of the `title` though, more info in the ["Title attribute use and
>abuse"](https://www.tpgi.com/html5-accessibility-chops-title-attribute-use-and-abuse/) article.

### 5. Provide mobile support

The mobile navigation has a burger button to trigger the `<nav>`, so I used the same approach as with the multi-level
navigation in step 3.

```HTML
<header>
  <button class="mobile-menu-button" aria-expanded="false" aria-controls="main-nav">Menu</button>
  <nav id="main-nav" class="hidden-mobile">
    <ul>
      <li><a href="/about-us" aria-current="page">About us</a></li>
      <li>
        <button aria-expanded="false" aria-controls="products-level-2">
          Products
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="12" height="9" viewBox="0 0 12 9">
           <polygon points="1 0, 11 0, 6 8"></polygon>
          </svg>
        </button>
        <ul id="products-level-2" class="hidden">
          <li><a href="/products/product1">Product 1</a></li>
          <li><a href="/products/product2">Product 2</a></li>
        </ul>
      </li>
      <li><a href="/insights">Insights</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>    
```

## Tips and tricks

- focus state: <https://matthiasott.com/notes/focus-visible-is-here>
- multiple `<nav>`
- skip link
- animations
