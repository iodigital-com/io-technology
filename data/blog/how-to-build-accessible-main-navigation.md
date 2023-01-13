---
title: 'How to build accessible main navigation?'
date: '2023-01-09'
tags: ['frontend', 'a11y', 'accessibility']
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
| ------------ | -------------------- |
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

As a visual user, I see that the navigation consists out of a list of 4 links, but a SR user won't hear a _"List"_
announcement since the markup doesn't represent that. To create an equal experience for both users, wrap the navigation
links in a `<ul>` element.

> AT info: When SRs navigate to a list element such as `<ul>` or `<ol>`, they will announce _"List # items"_. The same
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
4. Now is the first time JavaScript comes into play: I use it to toggle the right `aria-expanded` value and to move the focus to the
   first actionable element within the referenced element.
5. Closing the referenced element must be done via the `ESC` key, which is the industry standard.

> AT info: The SR will now announce _"Products, collapsed, button"_ on focusing the initial state of the button. When
> you click the button, it will announce _"Products, expanded, button"_ and move the focus dynamically to the referenced
> content.

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
class ExpandButtonFactory {
  public static instances: ExpandButton[] = []

  static create(selector: string, customHiddenClass?: string) {
    this.instances = [
      ...this.instances,
      ...Array.from(document.querySelectorAll(selector)).map((el: Element) => {
        if (!(el instanceof Element)) {
          throw new Error('No element found.')
        }

        return new ExpandButton(el, customHiddenClass)
      }),
    ]
  }
}

class ExpandButton {
  el: Element

  private isAriaExpanded: boolean
  private ariaControlsElement: Element | null
  private firstActionElement: Element | null
  private hiddenClass: string = 'hidden'

  constructor(el: Element, customHiddenClass?: string) {
    this.el = el

    this.isAriaExpanded = this.el.getAttribute('aria-expanded') === 'true'
    this.ariaControlsElement = document.getElementById(this.el.getAttribute('aria-controls') || '')

    if (!(this.ariaControlsElement instanceof HTMLElement)) {
      throw new Error('No referenced element found.')
    }

    this.firstActionElement = Array.from(
      this.ariaControlsElement.querySelectorAll('a[href]:not([disabled]), button:not([disabled])')
    )[0] as HTMLElement

    if (customHiddenClass) {
      this.hiddenClass = customHiddenClass
    }

    this.initListeners()
    this.collapseOnBlur()
  }

  initListeners(): void {
    this.el.addEventListener('click', (e) => {
      e.preventDefault()
      this.toggle()
    })
  }

  toggle(): void {
    this.isAriaExpanded = !this.isAriaExpanded
    this.el.setAttribute('aria-expanded', this.isAriaExpanded.toString())
    this.ariaControlsElement?.classList.toggle(this.hiddenClass)

    if (this.isAriaExpanded) {
      setTimeout(() => {
        // focus on first actionable element within the ref element
        ;(this.firstActionElement as HTMLElement)?.focus()
      }, 30)
    }
  }

  collapse(): void {
    this.isAriaExpanded = false
    this.el.setAttribute('aria-expanded', 'false')
    this.ariaControlsElement?.classList.add(this.hiddenClass)
  }

  collapseOnBlur(): void {
    ;(this.ariaControlsElement as HTMLElement).addEventListener('focusout', (e: Event) => {
      const currentTarget = e.currentTarget as HTMLElement

      requestAnimationFrame(() => {
        if (!currentTarget.contains(document.activeElement)) {
          this.collapse()
        }
      })
    })
  }
}

const mobileMenuButton = ExpandButtonFactory.create('.mobile-menu-button', 'hidden-mobile')
const menuItemButtons = ExpandButtonFactory.create('.expand-button')

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ExpandButtonFactory.instances.forEach((expandButton: ExpandButton) => {
      if (document.activeElement?.closest('ul')?.closest('li')?.contains(expandButton.el)) {
        expandButton.collapse()
        ;(expandButton.el as HTMLElement).focus()
      }
    })
  }
})
```

### 4. Highlight the active (sub)page

#### 4.1 Active page

Most websites provide an active state styling for current page links, but this will only cover the visual part of
communicating this information. On a semantic level, I need to make use of an ARIA attribute called `aria-current`.

> AT info: The anchor element with attribute `aria-current="page"` will be announced as _"Current page, link, About us"_ by the
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

> AT info: Now, when I navigate to the 'Products' link via my screen reader, I will hear _"Products, link, Contains
> current page link"_ to indicate that the current page is inside its submenu.

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

> Important: Be careful with the usage of the `title` though, more info in the ["Title attribute use and
> abuse"](https://www.tpgi.com/html5-accessibility-chops-title-attribute-use-and-abuse/) article.

### 5. Provide mobile support

The mobile navigation has a burger button to trigger the `<nav>`, so I used the same approach as with the multi-level
navigation in step 3.

```HTML
<header>
  <button class="mobile-menu-button" aria-expanded="false" aria-controls="main-nav">Mobile menu</button>
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

The easy part of using the `ExpandButton` class is that I can reuse it for the mobile menu button which triggers the
visibility of the mobile navigation.

```JavaScript
const mobileMenuButton = new ExpandButton(document.querySelector('.mobile-menu-button'), "hidden-mobile");
```

Finally I add some styling to make it look more like usual website navigation.

```SCSS
header {
  font-family: Arial;

  .mobile-menu-button {
    @media (min-width: 48em) {
      display: none;
    }
  }

  nav {
    transition: opacity 0.3s, visibility 0.3s;

    &:not(.hidden-mobile) {
      opacity: 1;
    }

    ul {
      list-style: none;
      padding-left: 0;

      > li {
        margin-left: 0;

        > button {
          appearance: none;
          background: none;
          border: 0;

          + ul {
            transition: opacity 0.3s, visibility 0.3s;
          }

          &[aria-expanded="true"] {
            > svg {
              transform: rotate(180deg);
            }

            + ul {
              opacity: 1;
            }
          }

          &[aria-expanded="false"] + ul {
            opacity: 0;
            height: 0;
          }
        }
      }
    }

    > ul {
      margin-right: -0.5rem;
      margin-left: -0.5rem;
      flex-wrap: wrap;
      display: flex;

      > li {
        margin-right: 0.5rem;
        margin-left: 0.5rem;

        @media (max-width: 48em) {
          width: 100%;
        }

        > a,
        > button {
          font-size: 1.25rem;
        }

        a,
        button {
          display: inline-block;
          padding: 0.25rem;
          color: inherit;

          &[aria-current="page"] {
            color: blue;
          }

          &[aria-current="true"] {
            background-color: lightgrey;
          }

          &:hover,
          &:focus-visible {
            text-decoration: underline;
            cursor: pointer;
          }
        }

        a {
          &:not(:hover):not(:focus-visible) {
            text-decoration: none;
          }
        }
      }
    }
  }
}

.hidden {
  visibility: hidden;
}

.hidden-mobile {
  @media (max-width: 48em) {
    visibility: hidden;
    opacity: 0;
    height: 0;
  }
}
```

## CodePen

You can find the full code example on CodePen: [Accessible main navigation](https://codepen.io/timdujardin/pen/bGjWNNo).

## Tips and tricks

- focus state: Mathias Sot -> focus visible is here
- multiple `<nav>`
- skip link
- animations
