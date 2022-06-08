---
title: 'VueJS conference Amsterdam 2022'
date: '2022-06-07'
tags: ['frontend', 'vue', 'conference']
images: ['/articles/vue-js-conference-amsterdam-2022/group.jpeg']
summary: "Together with some colleagues I’ve attended the VueJS conference in Amsterdam. It was nice to meet colleagues from other campuses and having a chance to get to know them in a different setting. The conference itself was a little underwhelming, but that doesn't mean I went home without some valuable takeaways."
authors: ['thijs-busser']
theme: 'black'
---

I didn't take extensive notes during the conference so by no means do I pretend this will be an exhaustive list of everything presented during the conference. For instance there were a lot of talks focussing on Nuxt.js but this is not something I have a lot of interest in. With that being said, these are my main takeaways from the two days.

### Vue roadmap

Evan You gave the keynote presentation on the roadmap for Vue. At the end of the month the Vue team hopes to release Vue 2.7. It will be the last minor release for the version 2 branch. It will bring a number of changes which might help with your upgrade path to version 3. The composition API package will be integrated in v2.7 which will be coupled with performance upgrades. In addition the `script setup` syntactic sugar will be incorporated in v2.7. Once Vue 2.7 is shipped the focus will be on Vue 3.3.

Another important message from Evan was that Vue 2.x will be end of life 18 months after the release of v2.7. Extended support will be available but this is probably a paid service.

### Vite

One thing all speakers seemed to agree on is that Webpack is slow and a pain to configure and that Vite is the way to go. They were tumbling over superlatives to describe the performance so it is either “really fast”, “super fast”, “blazing fast” or “super duper mega fast”. In any case expect to win a few seconds per day having to wait on HMR and your dev server spinning up

### Histoire

Histoire was the biggest surprise of the conference for me. It is brand new and aims to replace Storybook as the default way to showcase your components. It’s biggest claim to fame is the way stories are written, it pretty much mimics how you write your components. Of course it uses Vite under the hood so expect it to be faster than Storybook. The only missing feature, for me, is it doesn’t automatically display your props comments as documentation like Storybook does. All in all it looks very promising.

Links:

- See [here](https://slides.com/akryum/vue-amsterdam-histoire) for the presentation slides
- [The project homepage](https://histoire.dev/)
- [Example output](https://vue3.examples.histoire.dev/)

### Cypress 10

A few days before the conference Cypress 10 has been released. We got treated to a demo and it looks very good! In addition to end-to-end testing Cypress is now also able to do component testing. As the presentator stressed a few times, unit tests are nice but nothing beats testing your component in the same environment as your users will be using. The Vuetify team has had early access and has written tests for their components, a great place to turn to for inspiration.

See [here](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test) for the Cypress documentation

### Nuxt.js

I think about half, or maybe even more, of the talks were about Nuxt.js. Version 3 should be released and brings along many changes. One of the talks touched on how they now support Edge Rendering. If your initial thought was the same as mine, “why wouldn’t they, it is a Chromium based browser?“, you might want to read up on this. Edge Side Rendering (ESR) is best thought of as Server Side Rendering (SSR) in CDN nodes instead of actual servers.

See the [Nuxt.js presentation highlights](https://twitter.com/Atinux/status/1532405883929608197?cxt=HHwWioC-tYnCmcQqAAAA) here.

### Pinia

VueX is out, Pinia is in as everyone’s favorite state management library. It’s smaller, requires less boilerplate code and has a pineapple as a logo. While there was also a talk on using composables as lightweight stores, Pinia offers more features and is probably worth a look.

### Vitepress

A new project brought to you by Evan You. Vitepress is a static site generator build on top of Vue and Vite. Because it uses Vite it is lightning fast (as according to their homepage) and offers a great developer experience. It comes with a default theme that is slightly reminiscent of the Vue docs but with enough changes to make it stand out as its own thing.

See [here](https://vitepress.vuejs.org/) for the homepage.

### VueUse

Although not a dedicated topic a lot of speakers mentioned VueUse and spoke highly of it. It's a library of composables which you can use in your project. It covers all sorts of use cases from composables for dealing with elements, sensors, animations and lots more. Certainly worth checking out!

See [here](https://vueuse.org/) for the project homepage.

## In closing

The conference itself was a bit of a disappointment. Lots of talks on VueJS adjacent topics but very little in-depth Vue talks. The talks which were in-depth tended to have a lot of overlap with other talks making the whole thing feel very redundant. The organisation had a lot of trouble keeping to the schedule with talks running long and at one point being 45 minutes behind schedule. Overall it was a rather underwhelming conference and I’d advice to check the line-up in case you are considering going next year.
