---
title: 'Project Fugu'
date: '2023-04-07'
tags: ['frontend', 'web-capabilities', 'project-fugu']
images: ['/articles/project-fugu/header.webp']
summary: Cross platform development is hard. Each platform as it's own implementation of an API and you end up with separate apps for each platform. Multiple frameworks try to fix this issue by creating an abstract between the platform and the application. Browser vendors are doing the same and it's called Project Fugu.
authors: ['lucien-immink']
theme: 'rouge'
---

Cross platform development is hard. Features and capabilities of an application requires you to think about how it needs to be implemented in different platforms like Android, iOS, Web, Windows, MacOS and Linux. If you, for example, need to access address details of a contact that is stored on a device you need to implement a contact picker for all the different platforms you want to support or you need to come up with a completely custom implementation. Custom implementations are probably not what you want to do. It can become quite messy quite fast.

So what can you do?

What about an abstraction layer between the OS native API and a common top-layer, which is preferably written in a well known set of languages that can handle UIs with a breeze, like HTML, CSS and JavaScript. Here we are describing a framework like Apache Cordova, previously known as PhoneGap. These _hybrid_ application combine web languages with a wrapper for the OS native APIs. Hybrid cause they use web technology packaged as apps for distribution and have access to native device APIs.

While technology like Apache Cordova enables developers to build one UI for multiple platforms they still have to build the application for all the platforms they want to support and sometimes the support for a platform is a bit flacky.

But what about the web platform itself? Progressive Web Apps (PWAs) bring offline support and _app-like_ experiences to the web. Exending the PWA principal with APIs to include more native APIs while keeping the core principals of the web (trust, privacy and security) is the core of Project Fugu 🐡.

## Project Fugu

LIT is a small library on top of _web components_ and _literals_. Created to skip some of the boilerplate that native DOM manipulation, shadow DOM, custom elements and templates bring to the table. Next to skipping the boilerplate LIT adds a few utilities for reactivity and productivity. Every feature is designed with the web platform in mind. Not fighting but embracing the platform.

At just 6KB (minified and compressed) LIT doesn't add much overhead to a bundle while it gives all the tools and features to create components for component libraries but also web sites and apps.

Rendering is handled by using a web platform standard called _literals_ which makes LIT only touch the dynamic parts of the DOM when it updates, there is no need to rebuild a (virtual) tree and diff with the DOM.

### Literals

Literals represent a value in JavaScript. fixed (no variable) value that you _literally_ provide in JavaScript. Literals include:

- Array literals (e.g.: `let list = ['cat', 'dog', 'catdog']`)
- Boolean literals (e.g.: `true`)
- Numeric literals (e.g.: `1337`)
- Object literals (e.g.: `let person = { name: 'Lucien', surname: 'Immink', gender: 'male'}`)
- RegExp literals and (e.g.: `let re = /ab+c/`)
- String literals (e.g.: `let str = 'Hello'`)

A string literal is everything between a single (`'`) or double (`"`) quotation mark. With the introduction of ECMAScript 2015 (ES6) another literal was added: the _template literal_ which provide an easy way to create multiline strings and perform string interpolation. Template literals are string literals and allow embedded expressions. Template literals use the backtick (`` ` ``) as delimiter. Some examples of the template literal:

```js
const str = `Hello`
const multi = `Hello
wonderful
world`
const expression = `Hello ${type} world`
taggedFunction`Hello ${type} world`
```

The _tagged_ template literal calls the function with that name (in this case `taggedFunction()`) with the template as the first argument and the substitution values as the subsequent arguments.

The browser has support for template literals built in. This includes optimizations such as only updating the dynamic part of a template literal instead of the whole literal. What if literals are used for creating UIs?

### Web Components

Since LIT extends web components it inherits all the positive effects web components have: LIT works everywhere you use HTML, with any framework or none at all. This also means that migrating from a specific framework to LIT can be done one component at a time, no need to rewrite everything from the start. What if web components are used for creating components?

## What is interesting about LIT?

Take template literals for rendering templates and combine them with web components for lifecycle management, event handling and encapsulation of style and function you get LIT.

<sub>⚠️ Note that all examples in this article will use TypeScript but LIT can also be written using pure JavaScript. ⚠️</sub>

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
<!DOCTYPE html>
<html lang="en">
  <body>
    <hello-world type="amazing">Light DOM fallback</hello-world>
  </body>
</html>
```

This `<hello-world>` example comes in at _235 bytes_ with _6KB_ for LIT (minified and compressed).

![Schema of the elements of a URL](/articles/why-lit-is-🔥/hello-world-bundle-size.png)

Start saying hello to the world by cloning the [source code](https://github.com/lucienimmink/lit-hello-world).

### Decorators

If you are unfamiliar with `@customElement(...)` and `@property`; they are called _decorators_ and a decorator wraps a piece of code with another. A concept also known as _functional composition_ or _higher-order functions_. Classes and their properties are not the same as functions and cannot simply be wrapped using functional composition. The decorator adds support for wrapping classes and properties. The example wraps `HelloWorld` with the functionality from `LitElement`, transforming the `HelloWorld` class to a LIT element. By applying the `@property` decorator to the `type` property it's functionality is extended so it can be used as a reactive custom element property.

Should you want a reactive property that is purely internal (so not available as property or attribute on the custom element) but still reactive to change you can decorate the property with the `@state` decorator.

Decorators are (for now) only available in TypeScript.

### Advanced templating

All is fine and well if only `Hello wonderful world` needs to be printed; but most of the time more complex templating is needed. Template literals can be nested and contain logic. Combined with the tagged template literal more complex templates can be achieved

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

But why stop there? Well one reason is readability of course! And reusability could be another reason. Split this template up in 3 separate components will improve both the readability and reusability. Let's take a look at the `my-header` first.

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

The same applies for `my-footer`. Both are now a web component, usable in other LIT elements or directly on a HTML page or imported into a React, angular, vue... HTML based web application.

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

Handling events with LIT is quite straightforward. The following example adds a `click` handler to a button and the result is automatically updated in the `counter`:

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

Add the `@eventOptions` decorator on the `addCount()` function to add any of the options passable by [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters=). LIT uses and embraces the web platform. No need to learn a new API here.

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

`:host` is the selector for the shadow-DOM root, CSS variables are part of the web platform and can be used in LIT as well. CSS variables make it easy to create themes but also to better adept to the styling of the page that includes the LIT component.

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

## That sounds too good to be true

...and perhaps it is. LIT is relatively new, as are web components. A certain widely used framework that uses a virtual DOM implementation has had a bumpy ride when it comes to [web component interoperability](https://www.npmjs.com/package/@lit-labs/react).

The eco system for LIT dwarfs compared to today's big three. Having the ability to export both Vue and Angular components as web components and having both playing nice with web components might just change things in the future. LIT can use _any_ web component and can provide web components for _any_ other framework as long as it uses HTML and the web platform.

LIT is working on making server side renderable components part of the new major version release but they have released a [package](https://www.npmjs.com/package/@lit-labs/ssr) with LIT components can already be tested server-side.

LIT is not a replacement for everything web related, but what has ever been? Since it sticks close to the platform it evolves with the platform and new features, APIs and functionalities work the day they become available in the browser.

## Closing thought

LIT is a small library on top of _web components_ and _literals_. Created to skip some of the boilerplate that native DOM manipulation, shadow DOM, custom elements and templates bring to the table. Next to skipping the boilerplate LIT adds a few utilities for reactivity and productivity. Every feature is designed with the web platform in mind. Not fighting but embracing the platform.

At just 6KB (minified and compressed) LIT doesn't add much overhead to a bundle while it gives all the tools and features to create components for component libraries but also web sites and apps.
