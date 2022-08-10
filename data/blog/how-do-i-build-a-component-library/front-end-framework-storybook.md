---
title: 'How do I set up a _front-end framework_ & showcase it with _Storybook_?'
date: '2022-08-24'
tags: ['frontend']
images:
  [
    '/articles/how-do-i-build-a-component-library/front-end-framework-storybook/front-end-framework-storybook.png',
  ]
summary: 'How to build a component library Part 2: Picking a front-end framework and setting up Storybook.'
authors: ['dave-bitter']
theme: 'orange'
serie: 'how-do-i-build-a-component-library'
---

I’ve already stated that this series would be opinionated. Now, it doesn’t get more opinionated than picking a front-end framework. Which one did I pick and why?

## Picking a framework

There is a plethora of front-end frameworks available to use. Some swear by [React.js](https://reactjs.org/), some put their money on [Vue.js](https://vuejs.org/) while others don’t want to use a framework at all. The internet is full of opinions, comparisons and advice on which to pick. For this series, it doesn’t really matter which one I pick as the setup will most likely be the same. I do however have a strong recommendation based on the past few years working on large projects at large companies.

### Why not support all?

My personal preference for building robust web applications is React.js. React.js has the features, backing and support I’m looking for in a front-end framework. You might, however, be surprised to learn that I don’t actually like React.js to build component libraries.

The downside with picking a framework like React.js/Vue.js/[Svelte](https://svelte.dev/)/[insert framework here] for a component library is that it’s hard to introduce it in a large company. While a company might use React.js for their newly chosen tech stack, they most likely still have a few [Angular.js](https://angularjs.org/) or vanilla applications that you want to support too. Even if they don’t, in a few years the company might decide to move to the new latest and greatest framework. Migrating your component library to this new framework is very costly and will most likely not happen. Because of this, your component library will most likely be labelled as ‘legacy’. I go more in-depth into this phenomenon in my article [The infinite legacy cycle in front-end](https://techhub.iodigital.com/articles/the-infinite-legacy-cycle-in-front-end).

So how do you best prevent this from happening? For me, the perfect solutions are [Web Components](https://www.webcomponents.org/). Web Components is a suite of different technologies allowing you to create reusable custom elements — with their functionality encapsulated away from the rest of your code — and utilize them in your web apps. At least, that’s what [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components) says. Simplified, Web Components are browser-native components that offer similar functionality as many front-end framework. An interesting concept, however, is the usage of the Shadow DOM. To learn more, head over to the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

### So native Web Components?

I mean, you could! It might, however, be wise to look for a bit of an abstraction. There are quite a few front-end frameworks built on Web Components (go figure right). Some notable ones are:

- [Lit](https://github.com/lit/lit)
- [Stencil](https://stenciljs.com/)

Like any set of frameworks, they both have their up- and downsides. There are many comparison articles online comparing them. Feel free to look it up after you finish this article. So which one did I choose? I decided to go for Lit. I told you this was going to be an opinionated series. The reason is that I’ve got experience using Lit already. Next to that, I like that it seems to be a bit more low-level and closer to the core which I always look out for. If you want to learn a bit more about Lit, head over to the article [Why lit is 🔥](https://techhub.iodigital.com/articles/why-lit-is-%F0%9F%94%A5) by my colleague Lucien Immink. To be fair, going with any of the mentioned options would be good.

### How do Web Components help me?

As Lit compiles to browser-native Web Components, you can load them in any front-end framework or even vanilla web application. Let’s say you have a button component written as a Web Component. You can now use this button in your React.js application, while also using it in a legacy Angular.js project from years ago. In a year you’re migrating to a fancy new framework? You guessed it, you can load your Web Component in that project.

This is such an incredibly needed feature for any component library. It ensures that you can roll out your component library company-wide and offers future-proof support.

## How do I set up Lit?

To get started with Lit, head over to their [getting started guide](https://lit.dev/docs/getting-started/) which will help you set it up. To quickly glance over it, however, this is what I did for the demo repository:

- Install lit: `yarn add lit`
- Add a Typescript file in one of the packages
- Start building

This low footprint is exactly the reason I like Lit so much. Let’s have a look at a standard component from the docs:

```jsx
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      color: blue;
    }
  `;

  // Declare reactive properties
  @property()
  name?: string = 'World';

  // Render the UI as a function of component state
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
```

This gives you a basic idea of how to make a simple component. Naturally, you are going to need more functionality (e.g. event handling, lifecycle methods etc.). Please refer to the docs on how to do that with Lit.

## Why should I showcase my components (with Storybook)?

Once you have chosen your front-end framework, you want to be able to view each component during and after development. During development, you need a place to see the actual component you are working on and document different configurations. After development, you want to showcase all the components in different configurations for consumers of your component library. By far, one of the most popular tools to do this is [Storybook](https://storybook.js.org/). Storybook makes it easy to create multiple “stories” for all your components where you can view the result in the browser. Next to that, you can make any properties you can pass to a component editable from the Storybook UI. Finally, there is a vast number of [addons](https://storybook.js.org/addons/) to add to Storybook. Here are a few to give you an idea:

- [addon-a11y](https://storybook.js.org/addons/@storybook/addon-a11y) to test for accessibility
- [storybook-addon-pseudo-states](https://storybook.js.org/addons/storybook-addon-pseudo-states) to show different states like hover, hover and active
- [storybook-dark-mode](https://storybook.js.org/addons/storybook-dark-mode) to toggle dark-mode for your UI

There are many more addons so you can pick and choose for your perfect setup.

## How do I set up Storybook?

Storybook has great docs to help you get started. Please head over to [the docs](https://storybook.js.org/docs/react/get-started/introduction) when setting it up for your component library. For the demo repository, I ran `npx storybook init` . This starts an interactive CLI that will take care of most things for you. It asks you for the framework you want to use. As we are using Web Components, I selected that option. This option uses Lit which is a nice bonus.

Storybook then sets up everything you need to start developing. There are some things I updated, however. Firstly, as we are using a mono-repo setup, you have to tell Storybook where to find the `.stories` files. In `.storybook/main.js` I’ve updated the stories array to look for `.stories` files in the packages folders:

```jsx
module.exports = {
  stories: [
    './Introduction.stories.mdx',
    '../packages/**/*.stories.mdx',
    '../packages/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-docs',
      options: { transcludeMarkdown: true },
    },
  ],
  staticDirs: ['../public'],
  framework: '@storybook/web-components',
}
```

Secondly, I’ve updated the root `package.json` with two scripts:

```jsx
"dev": "start-storybook -p 6006",
"build": "build-storybook --quiet -o dist",
```

You can now run `yarn dev` to start the development environment of Storybook. You can run `yarn build` to have a production build outputted to the `dist` folder.

Finally, I like to show the project README file as a separate story which is shown when someone visits the Storybook. Luckily, we can do this quite easily due to the [MDX](https://mdxjs.com/) support. I created `.storybook/Introduction.stories.mdx` and added the following content:

```jsx
import { Meta } from "@storybook/addon-docs";

import README from "../README.md";

<Meta title="README (skip-storyshot)" />

<README />
```

Now, when we open Storybook, we are greeted with the contents of the README file.

## Next steps

In the next article, we’re going to use Storybook for quite a bit more. We’re going to use the stories we create to use snapshot and visual regression testing.
