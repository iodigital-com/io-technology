---
title: 'Why lit is 🔥'
date: '2022-06-01'
tags: ['frontend']
images: ['/articles/why-lit-is-🔥/header-image.png']
summary: 'Every day a new JavaScript library is born, every week a new framework arrives and every month a front-end developer needs to rewrite a datepicker 😢 LIT is a modern library for creating component libraries, design systems but also sites and apps. LIT components are web components and as such work anywhere you use HTML.'
authors: ['lucien-immink']
---

In the fast changing world of front-end development it's hard to keep up with all the new libraries and frameworks out there that promise to be the next big thing. Frameworks tend to do a lot of heavy lifting but also tend to not agree with each other. As a developer this means that you might have to rewrite code in order to swap out the old framework for the new. It becomes more of an issue if you have to rewrite nearly _all_ of your code if the frameworks can't live together.

![Schema of the elements of a URL](/articles/why-lit-is-🔥/standards.png)

Luckily things are changing (again). With architectual choices like [micro frontends](https://www.isaac.nl/nl/developer-blog/micro-frontends/) it is possible to break up a complex and large code base in logical smaller parts. What if those parts share a few components? Which framework should you use? It should be something that is interoperable and future ready. This is one example where _web components_ shine as you can use those [anywhere](https://caniuse.com/custom-elementsv1) where you use HTML.

## What is LIT?

LIT is a small library on top of _web components_ and _literals_. Created to skip some of the boilerplate that native dom manipulation, shadow dom, custom elements and templates bring to the table. Next to skipping the boilerplate LIT adds a few utilities for reactivity and productivity. Every feature is designed with the web platform in mind. Not fighting but embracing the platform.

At just 5KB (minified and compressed) LIT doesn't add much overhead to a bundle while it gives all the tools and features to create components for component libraries but also web sites and apps.

Rendering is handled by using a web platform standard called _literals_ which makes LIT only touch the dynamic parts of the DOM when it updaes, there is no need to rebuild a (virtual) tree and diff with the DOM.

### Literals

Literals represent a value in JavaScript. fixed (no variable) value that you _literally_ provide in JavaScript. Literals include:

- Array literals (eg: `let list = ['cat', 'dog', 'catdog']`)
- Boolean literals (eg: `true`)
- Numberic literals (eg: `1337`)
- Object literals (eg: `let person = { name: 'Lucien', surname: 'Immink', gender: 'male'}`)
- RegExp literals and (eg: `let re = /ab+c/`)
- String literals (eg: `let str = 'Hello'`)

A string literal is everything between a single (`'`) or double (`"`) quotation mark. With the introduction of ECMAScript 2015 (ES6) another literal was added: the _template literal_ which provide an easy way to create multiline strings and perform string interpolation. Template literals are string literals and allow embedded expressions. Template literals use the backtick (`` ` ``) as delimiter. Some examples of the template literal:

```js
const str = `Hello`
const multi = `Hello
wonderful
world`
const expression = `Hello ${type} world`
taggedFunction`Hello ${type} world`
```

The _tagged_ template literal calles the function with that name (in this case `taggedFunction()`) with the template as the first argument and the substitution values as the subsequent arguments

### Web Components

Since LIT extends web components it inherits all the positive effects web components have: LIT works everywhere you use HTML, with any framework or none at all. This also means that migrating from a specific framework to LIT can be done one component at a time, no need to rewrite everything from the start.

## What is interesting about LIT?

If we take template litarals for our rendering templates and combine them with web components for lifecycle management, event handling and encapulation of style and function you get LIT.

_Note that all examples in this article will use TypeScript, but LIT can also be written using pure JavaScript._

```ts
import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('hello-world')
export class HelloWorld extends LitElement {
  static styles = css`
    p {
      color: green;
    }
  `

  @property()
  type = 'wonderful'

  render() {
    return html`<p>Hello ${this.type} world</p>`
  }
}
```

```html
<html>
  <body>
    <hello-world type="amazing"></hello-world>
  </body>
</html>
```

This `<hello-world>` eample comes in at _3kb_ uncompressed

### Decorators

If you are unfamiliar with `@customElement(...)` and `@property`; they are called _decorators_ and a decorator wraps a piece of code with another. A concept also known as _functional composition_ or _higher-order functions_. Classes and their properties are not the same as functions and cannot simply be wrapped using functional composition. The decorator adds support for wrapping classes and properties. In the example we wrap `HelloWorld` with the functionality from `LitElement`, transforming the `HelloWorld` class to a LIT element. By Applying the `@property` decorator to the `type` property we extend it's functionality so it can be used as a custom element property.

Should you want a reactive property that is purely internal (so not available as property or attribute on the custom element) you can decorate the proerty with the `@state` decorator.

Decorators are (for now) only available in TypeScript.

### Advanced templating

All is fine and well if we only need to print `Hello wonderful world`; but most of the time more complex templating is needed. Template literals can be nested and contain logic. Combined with the tagged template literal more complex templates can be achieved

```ts
renderHeader() {
    return html`<div>Some fancy header</div>`
}
renderFooter() {
    return html`<div>Some fancy footer</div>`
}

render() {
    return html`
        ${this.renderHeader()}
        <p>What a nice ${new Date().getHours() < 12 ? html`morning` : html`day`} </p>
        ${this.renderFooter()}
    `
}
```

But why stop there? Well one reason is readability of course! And reuseability could be another reason. We can split this up in 3 separate components. Let's take a look at the `my-header` first.

```ts
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-header')
export class MyHeader extends LitElement {
  render() {
    return html`<div>Some fancy header</div>`
  }
}
```

Do the same for `my-footer`. Both are now a web component, usuable in other LIT elements or directly on a HTML page or imported into a React or vue app.

```ts
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import './my-header.js'
import './my-footer.js'

@customElement('my-page')
class MyPage extends LitElement {
  render() {
    return html`
      <my-header></my-header>
      <p>What a nice ${new Date().getHours() < 12 ? html`morning` : html`day`}</p>
      <my-footer></my-footer>
    `
  }
}
```

### Event handling

Hadling events with LIT is quite straightforward. To following example add a `click` handler to a button and the result is automatically updated in the `counter`:

```ts
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('my-counter')
export class HelloWorld extends LitElement {
  @property()
  counter: number = 0

  addCount() {
    this.counter += 1
  }

  render() {
    return html`
      <button @click=${this.addCount}>Add more</button>
      <p>counter is now at: ${this.counter}</p>
    `
  }
}
```

You can use the `@eventOptions` decorator on the `addCount()` function if you want to add any of the options passable by [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters=)

```ts
@eventOptions({ passive: true })
addCount()
```

### Styling

Styling in LIT uses template literals as well. Lit components use a shadow DOM making styling straightforward.

```ts
import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      font-size: 2em;
      padding: 1em;
      border: 0.25em solid var(--blue, blue);
    }
    p {
      color: var(--blue, blue);
    }
  `
  render() {
    return html`<p>I am blue da ba dee! ®eiffel 65</p>`
  }
}
```

`:host` is the selector for the shadow-dom root, CSS variables are part of the web platform and can be used in LIT as well. CSS variables make it easy to create themes but also to better adept to the styling of the page that includes the LIT component.

Sharing styles between components can easily be achieved by creating a separate file that exports the shareable style

```ts
// file: button-styles.ts
import { css } from 'lit'

export const buttonStyles = css`
  .primary-button {
    color: var(--text-colour);
    color: var(--primary-colour);
  }
  .primary-button:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`
```

```ts
import { css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { buttonStyles } from './button-styles.ts'

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
        border: 1px solid black;
      }
    `,
  ]
}
```

## That sounds to goo to be true

...and perhaps it is. LIT is relativly new, as are web components. A certain widely used framework that uses a virtual dom implementation has had a bumpy ride when it comes to [web component interoperability](https://www.npmjs.com/package/@lit-labs/react).

The eco system for LIT dwarfs compared to todays big three. Having the ability to export both Vue and Angular components as web components and having both playing nice with web components might just change things in the future. LIT can use _any_ web component and can provide web components for _any_ other framework as long as it uses HTML and the web platform.

LIT is working on making server side renderable components part of the new major version release but they have released a [package](https://www.npmjs.com/package/@lit-labs/ssr) with with LIT components can already be tested server-side.

LIT is not a replacement for everything web related, but what has ever been? Since it sticks close to the platform it evolves with the platform and new features, APIs and functionalities work the day they become available in the browser.

## Closing thought

LIT is a small library on top of _web components_ and _literals_. Created to skip some of the boilerplate that native dom manipulation, shadow dom, custom elements and templates bring to the table. Next to skipping the boilerplate LIT adds a few utilities for reactivity and productivity. Every feature is designed with the web platform in mind. Not fighting but embracing the platform.

At just 5KB (minified and compressed) LIT doesn't add much overhead to a bundle while it gives all the tools and features to create components for component libraries but also web sites and apps.
