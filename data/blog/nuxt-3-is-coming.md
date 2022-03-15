---
title: 'Nuxt 3 is coming, this is why you should be excited!'
date: '2022-01-01'
tags: ['frontend', 'vue', 'nuxt']
summary: 'Nuxt 3 beta is out and ready to play with. While not production ready yet, most important features can be experimented with and, as we’ll discuss later, it will bring about an easy way to upgrade at your own pace.'
authors: ['vlad-pintea']
---

Nuxt 3 beta is out and ready to play with. While not production ready yet, most important features can be experimented with and, as we’ll discuss later, it will bring about an easy way to upgrade at your own pace.

# So what’s new anyway?


1. Vue3 support
2. General optimizations of performance and bundle size
3. Native typescript support
4. Improved developer experience and debugging
5. True hybrid rendering
6. The new Nitro engine
7. Cross platform support
8. Nuxt Bridge

That’s quite the list, and some might be obvious. Let’s jump into them and see what’s so cool about these upcoming features.


# 1. Vue3 support

Unlike its older brother that still uses Vue 2.15.x (as of feb 2021), Nuxt 3 will come with support for Vue3 and all of its goodies. To read more in depth about the differences https://javascript.plainenglish.io/differences-between-vue-2-and-vue-3-ee627e2c83a8 but lets see a few things that that means for Nuxt:  
Improved routing with Vue router 4.
New utilities for the Composition API, a superset of vue-composition API, with better SSR support and an easy migration path.
Integration of Suspense API, which allows your components to wait for API calls before loading up and rendering, allowing you to load a fallback component in the meanwhile, something React fans will feel familiar with.

# 2. General optimizations of performance and bundle size
A new version without improvements across the board would be a weird sight, nuxt very much delivers as expected. With nuxt 3 you get a 20% reduction in core bundle size over its predecessor, and all the performance improvements that come with Vue 3.

The core bundle isn’t the only size reduction we see however. When built the entire project goes into a highly optimized ./output folder, thanks to better dependency tracking using @nft/vercel. Further adding to that, nuxt 3 comes with improved code splitting further reducing our bundle sizes.

# 3. Native typescript support
Typescript is a superset of Javascript, offering many additional features out of the box, such as decorators, typing, interfaces, etc. While in the past additional configuration was required to use Typescript with Nuxt, with the new version TS becomes a first-class citizen, ready to use after installation.

# 4. Improved developer experience and improved debugging
Performance improvements are great, and TS is a gift, but there’s more to improve your experience working with Nuxt 3.

The new framework comes with a new Nuxt CLI tool to enable easier bootstrapping of project and scaffolding.

**Nuxt Devtools** can be enabled from the project’s configurations, enabling fast and reliable debugging straight in the browser.

With the goal of offering good maintenance and long term stability, **Nuxt Kit** can be used. Nuxt Kit can be thought of as a sort of Nuxt SDK, offering access to core functionalities to module developers so future changes will not negatively impact your solution and require a massive code change. It comes with access to various configurations and utilities to make using it, and Nuxt, feel like a breeze.

In your project, you can now count on Nuxt to auto-import necessary global utilities and composable components for you, speeding up development and offering some protection against errors.

# 5. True hybrid rendering
Commonly with Nuxt we can serve up our site with server-side rendering or client-side rendering. Nuxt 3 will enable us to use many more strategies alongside those, like pre-rendering, preview mode, distributed persistent rendering, HTTP caching strategies and others. Nuxt Nitro uses a vendor-independent caching layer, allowing you to easily customise the desired solution, globally at app level, or per page, allowing you to best manage the performance of your application in a granular way.


# 6. The new Nitro engine
I’ve mentioned the new Nitro engine, but what is it? It is the new foundational element of Nuxt. Written from the ground up to ensure Nuxt is platform independent and easy to deploy anywhere, with any rendering and caching strategy we see fit. Cleaner base code, with no runtime dependencies, that is fast and lightweight. Nitro enables a lot of the improvements we’ve discussed before now.

# 7. Cross platform support
   Enabled by the new Nitro engine, cross platform support makes working with the evolving Javascript ecosystem accessible. Whether you are working with NodeJs, Deno, Cloudflare workers or event Browser service worker, all supported out of the box, with an auto-detect feature that removes the hassle on your end, freeing you to use Nuxt in any solution that matches your project.

# 8. Nuxt Bridge
Last but not least on our list of major Nuxt 3 features is Nuxt Bridge. A tool that offers basically 2 major functionalities, which I am personally excited about.

Nuxt Bridge will help you use Nuxt 3 by ensuring compatibility with older dependencies and configurations from your Nuxt 2 project, making it easier to upgrade without worrying too much that all will break.

If, however, the above does not sound like a safe approach to you, you can Bridge Nuxt 3 functionality into your Nuxt 2 project, allowing you to upgrade iteratively, and giving you granular control over which features you want to implement first. This one is particularly exciting on a large project where stability is key, as you can slowly move towards the contemporary solution while maintaining control and stability, and being able to allocate time in a way fitting your project priorities. This is what you will be able to import into your Nuxt 2 project at your own pace:
- Nitro engine
- ESM and built-in TypeScript support
- Composition API with Nuxt 3 composables and auto-imports
- Nuxt CLI and Devtools
- Vite integration

# Conclusion
With the new release of Nuxt still being in Beta, details are scarce, but I hope you’ve read enough to get your appetite running. We, and the Nuxt developers themselves, of course do not recommend this on production code, but most of all the goodies are there for you, some barely glossed over like ESM modules and Vite integration.

We hope your exploration of Nuxt 3 is enjoyable and cannot wait for the first production-ready release to see what you come up with.
