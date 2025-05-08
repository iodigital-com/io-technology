---
title: 'React Fiber Three - 3D for the web'
date: '2025-05-8'
tags: ['frontend', 'js', 'react']
images: ['/articles/react-fiber-three-3d-for-the-web/banner-r3f.jpg']
summary: 'The simplest way to create interactive 3d experiences'
authors: ['tim-dhoore']
theme: 'blue'
---

React Fiber Three is a renderer that enables the creation of 3D scenes using React by leveraging Three.js under the hood. Build interactive website with the same ease as making any other webapp.

## Why Not Just Use Three.js?

React Fiber Three significantly simplifies the process of building 3D experiences for the web by handling most of the complex work for you. There's no need to build animation loops or set up render engines manually. Consider this simple example comparing vanilla Three.js and React Fiber Three:

![Code example for threejs and react fiber three to compaire the differences](/articles/react-fiber-three-3d-for-the-web/threejs-reactfiber-three-comparison.jpg)

This simple cube example only scratches the surface. When you start adding interactions with 3D elements or disposing of unused content, the difference in complexity becomes even more apparent.

## Powerful Built-in Features

React Fiber Three comes with an extensive library of built-in components found in [Drei](https://drei.docs.pmnd.rs/getting-started/introduction). Here are a few highlights:

### [Performance optimisation tools](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

The PerformanceMonitor component helps set DPR, disable effects, or update frame rates to ensure smooth experiences on lower-end devices.

### [HTML integration](https://drei.docs.pmnd.rs/misc/html#html)

The built-in HTML components enable placement of **HTML** in 3D space without requiring special workarounds. Multiple interaction options are available for selection. By default, the CSS layer appears above the 3D layer.

If you'd like the 3D elements to have the ability to move over the HTML elements, the **occlude** option provides this functionality. However, I should note that the occlude option doesn't work well with certain CSS features such as filters.

### [Gausion splatting](https://drei.docs.pmnd.rs/abstractions/splat)

Gaussian splatting employs a point cloud where each point is represented as a 3D Gaussian to depict scenes. This method is particularly useful for creating photorealistic scenes and enables real-time rendering. **Rendering 3D photographs** in the browser has never been easier.

It's worth noting that this technique isn't perfect at the moment, as there are still numerous artefacts. It won't fool anybody, but I find it's still a brilliant effect nonetheless.

### [AR and VR with XR](https://pmndrs.github.io/xr/docs/getting-started/introduction)

Create interactive 3D scenes for use with **AR experiences** on your mobile phone or **VR headset**. I find it particularly useful that you can even test these scenes directly in your browser with the help of [facebooks WebXR](https://developers.facebook.com/m/meta-connect-developer-sessions/webxr-immersive-xr-experiences/).

### [Filters and effects](https://drei.docs.pmnd.rs/misc/html#html)

A comprehensive selection of **filters** and **effects** is available to use immediately. All existing Three.js filters are included, and if you possess some knowledge of GLSL, you can develop your own custom effects.

### [Physics](https://github.com/pmndrs/react-three-rapier)

Creating interactive experiences with **moving objects, particles or drivable cars** is just a few components away.  
React Fiber Three has an integration with **Rapier** that makes adding **physics** to your scenes as simple as incorporating a couple of wrappers around your objects.  
There's no need for complex setups - simply add it and adjust the settings until it feels just right.

## When to Use It

There is a small down side of cource **bundle size**.  
React Fiber Three tends to be larger than a plain vanilla Three.js setup, and of course, you need to use React. animate-pulse-slowly

However, it compensates for this with its ease of use and considerable number of helpers, making it best suited for more complex projects. If you **simply** need to render a 3D object with a static camera, **Three.js** is still the best solution.

## Useful Tools

### [**GLTF to JSX**](https://github.com/pmndrs/gltfjsx)

Don't squander your valuable time manually creating components from your **GLTF models to jsx**. This tool (available as both a **website** and **terminal application**) can efficiently **build** and **compress** your GLTF files, preparing them for seamless display and manipulation.

### [**Triplex**](https://triplex.dev/)

For **visual scene building**, Triplex offers an excellent editor solution. What I appreciate about Triplex is its **independence** from your codebase, eliminating concerns about project failure if updates cease.

Triplex achieves this by leveraging the **TypeScript props configuration** in your components to write changes directly into your code. This means when you need to add something manually, everything remains accessible and properly structured.

It's worth noting that certain physics elements don't integrate seamlessly with Triplex.

### [**r3f-perf**](https://github.com/utsuboco/r3f-perf)

Monitoring the **performance** of your React Three Fiber application is essential for delivering smooth user experiences. The most valuable advice I can offer is to carefully track the number of **render calls** (listed as "calls" in the performance metrics). Keeping these to a minimum will significantly boost your application's performance.

You can **reduce render calls** by:

- Using instanced objects
- Combining multiple objects in your scene
- Experimenting with different optimisation techniques

I recommend exploring various approaches to see which improvements yield the best results for your specific application. The **performance gains** can be substantial when implementing these techniques properly.

## Conclusion

There's much more to see and explore with React Fiber Three.  
I recommend looking at the **examples** and doing some **testing yourself**. If any of your clients would benefit from beautiful 3D elements on their website, React Fiber Three is definitely worth considering.

## Sources and examples

- [React fiber three](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Examples](https://r3f.docs.pmnd.rs/getting-started/examples)
