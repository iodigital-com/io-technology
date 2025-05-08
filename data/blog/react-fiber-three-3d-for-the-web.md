---
title: 'React Fiber Three - 3D for the web'
date: '2025-05-8'
tags: ['frontend', 'js', 'react']
images: ['/articles/react-fiber-three-3d-for-the-web/banner-r3f.jpg']
summary: 'The simplest way to create interactive 3d experiences'
authors: ['tim-dhoore']
theme: 'blue'
---

React Fiber Three is a renderer that enables the creation of 3D scenes using React by leveraging Three.js under the hood.

## Why Not Just Use Three.js?

React Fiber Three significantly simplifies the process of building 3D experiences for the web by handling most of the complex work for you. There's no need to build animation loops or set up render engines manually. Consider this simple example comparing vanilla Three.js and React Fiber Three:

![Code example for threejs and react fiber three to compaire the differences](/articles/react-fiber-three-3d-for-the-web/threejs-reactfiber-three-comparison.jpg)

This simple cube example only scratches the surface. When you start adding interactions with 3D elements or disposing of unused content, the difference in complexity becomes even more apparent.

## Powerful Built-in Features

React Fiber Three comes with an extensive library of built-in components found in [Drei](https://drei.docs.pmnd.rs/getting-started/introduction). Here are a few highlights:

- [**Performance optimisation tools**](https://r3f.docs.pmnd.rs/advanced/scaling-performance): The PerformanceMonitor component helps set DPR, disable effects, or update frame rates to ensure smooth experiences on lower-end devices.
- [**HTML integration**](https://drei.docs.pmnd.rs/misc/html#html): The built-in HTML components allow you to place HTML in 3D space without special workarounds.
- [**Gausion splat**](https://drei.docs.pmnd.rs/abstractions/splat): Rendering 3D photographs in the browser has never been easier.
- [**AR and VR with XR**](https://pmndrs.github.io/xr/docs/getting-started/introduction): Create interactive 3D scenes for use with AR experiences on your mobile phone or VR headset. I find it particularly useful that you can even test these scenes directly in your browser.
- [**Filters and effects**](https://drei.docs.pmnd.rs/misc/html#html): A wide range of filters and effects are ready to use out of the box.

## When to Use It

There is a small down side of cource **bundle size**.  
React Fiber Three tends to be larger than a plain vanilla Three.js setup, and of course, you need to use React. However, it compensates for this with its ease of use and considerable number of helpers, making it best suited for more complex projects.

## Useful Tools

- [**GLTF to JSX**](https://github.com/pmndrs/gltfjsx): Both website and terminal tools to convert your models directly to JSX, saving you extra work.
- [**Triplex**](https://triplex.dev/): For when you need a visual editor to build out your scenes. Triplex writes its code in your project, though you'll need to use TypeScript to use it.

## Conclusion

There's much more to see and explore with React Fiber Three. I recommend looking at the examples and doing some testing yourself. If any of your clients would benefit from beautiful 3D elements on their website, React Fiber Three is definitely worth considering.

## Sources and examples

- [React fiber three](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Examples](https://r3f.docs.pmnd.rs/getting-started/examples)
