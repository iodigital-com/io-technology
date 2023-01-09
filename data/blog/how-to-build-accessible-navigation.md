---
title: 'How to build accessible navigation?'
date: '2023-01-09'
tags: ['a11y', 'accessibility', 'frontend', 'css', 'js']
images: ['/articles/how-to-build-accessible-navigation/cover.jpg']
summary: 'This article contains a guide to build an accessible main navigation of a website. The key takeaways of this guide are: HTML semantics, WAI-ARIA, CSS and JS for accessibility.'
authors: ['tim-dujardin']
theme: 'orange'
---

## Introduction

Structuring a webpage is based on using the right semantic HTML, these semantics will provide all kinds of information
necessary to process to page. Assistive technology is one of these page processing tools, so it's important to make sure
everything is communicated in the right way.

In this article we will zoom into the main navigation region of a webpage while keeping the assistive technology in
mind. An example of assistive technology through computer software is a screen reader, for more examples of assistive
technology take a look at [the AT list on atia.org](https://www.atia.org/home/at-resources/what-is-at/).

These are some terms used alternatively throughout the article:

| Acronym | Term                 |
|---------|----------------------|
| a11y    | Accessibility        |
| AT      | Assistive Technology |
| SR      | Screen reader        |

## Screen readers

Screen readers use [the accessibility tree instead of the regular DOM tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree), which is basically the DOM tree from a
(meaningful) semantic point of view. If you want to view the a11y tree yourself, you can use the ["What is an accessibility tree and how do I view it?"](https://accessibleweb.com/question-answer/what-is-an-accessibility-tree-and-how-do-i-view-it) article.

## Accessible in 4 steps

These are the steps I will guide you through:

1. Identify the navigation region
2. Communicate the list of navigation items and its size
3. Highlight the active (sub)page
4. Provide mobile support

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

As a regular user, I see that the navigation consists out of a list of 4 links, but a SR user won't hear a 'list'
announcement since the markup doesn't represent that. To create an equal experience for both users, wrap the navigation
links in a `<ul>` element.

> AT info: When SRs navigate to a list element such as `<ul>` or `<ol>`, they will announce "List # items". The same
> could be achieved through using WAI-ARIA role `list` and `listitem`, but the rule of thumb is "use ARIA as a last
> resort". More information on ["When should you use ARIA?"](https://gomakethings.com/when-should-you-use-aria/).

```HTML
<nav>
  <ul>
    <li>
      <a href="/about-us">About us</a>
    </li>
    <li>
      <a href="/products">Products</a>
    </li>
    <li>
      <a href="/insights">Insights</a>
    </li>
    <li>
      <a href="/contact">Contact</a>
    </li>
  </ul>
</nav>
```

### 3. Highlight the active (sub)page

Most websites provide an active state styling for current page links, but this will only cover the visual part of
communicating this information. On a semantic level, we need to make use of an ARIA attribute called `aria-current`.

## Tips and tricks

- focus state
- multiple `<nav>`
- animations
