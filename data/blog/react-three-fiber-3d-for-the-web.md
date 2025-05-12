---
title: 'React three fiber - 3D for the web'
date: '2025-05-12'
tags: ['frontend', 'js', 'react']
images: ['/articles/react-three-fiber-3d-for-the-web/banner-r3f.jpg']
summary: 'The simplest way to create interactive 3d experiences'
authors: ['tim-dhoore']
theme: 'blue'
---

React three fiber is a renderer that enables the creation of 3D scenes using React by leveraging Three.js under the hood. Build interactive website with the same ease as making any other webapp.

## Why Not Just Use Three.js?

React three fiber significantly simplifies the process of building 3D experiences for the web by handling most of the complex work for you. There's no need to build animation loops or set up render engines manually. Consider this simple example comparing vanilla Three.js and React three fiber:

### Threejs

```js
    import as THREE from 'three';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild(renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render( scene, camera );
    }
```

### React fiber three

```jsx
import { createRoot } from 'react-dom/client'
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Box(props) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.x += 0.01
    meshRef.current.rotation.y += 0.01
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ff00" />
    </mesh>
  )
}

createRoot(document.getElementById('root')).render(
  <Canvas>
    <Box />
  </Canvas>
)
```

This simple cube example only scratches the surface. When you start adding interactions with 3D elements or disposing of unused content, the difference in complexity becomes even more apparent.

## Powerful Built-in Features

React three fiber comes with an extensive library of built-in components found in [Drei](https://drei.docs.pmnd.rs/getting-started/introduction). Here are a few highlights:

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
React three fiber has an integration with **Rapier** that makes adding **physics** to your scenes as simple as incorporating a couple of wrappers around your objects.  
There's no need for complex setups - simply add it and adjust the settings until it feels just right.

## When to Use It

There is a small down side of cource **bundle size**.  
React three fiber tends to be larger than a plain vanilla Three.js setup, and of course, you need to use React.

Let's take our example from a above and create a bundle for each. The vanila threejs bundle is just **462.13kb** vs the **1,035.56** kb for react three fiber. That is a difference of **573,43 kb**.

### Threejs bundlesize

![Threejs bundlesize](/articles/react-three-fiber-3d-for-the-web/r3f.jpg)

### React three fiber bundlesize

![React fiber three bundlesize](/articles/react-three-fiber-3d-for-the-web/threejs.jpg)

However, it compensates for this with its ease of use and considerable number of helpers, making it best suited for more complex projects. If you **simply** need to render a 3D object with a static camera, **Three.js** is still the best solution.

## Useful Tools

### [**GLTF to JSX**](https://github.com/pmndrs/gltfjsx)

Don't squander your valuable time manually creating components from your **GLTF models to jsx**. This tool (available as both a **website** and **terminal application**) can efficiently **build** and **compress** your GLTF files, preparing them for seamless display and manipulation.

### [**Triplex**](https://triplex.dev/)

For **visual scene building**, Triplex offers an excellent editor solution. What I appreciate about Triplex is its **independence** from your codebase, eliminating concerns about project failure if updates cease.

Triplex achieves this by leveraging the **TypeScript props configuration** in your components to write changes directly into your code. This means when you need to add something manually, everything remains accessible and properly structured.

It's worth noting that certain physics elements don't integrate seamlessly with Triplex.

### [**r3f-perf**](https://github.com/utsuboco/r3f-perf)

Monitoring the **performance** of your React three fiber application is essential for delivering smooth user experiences. The most valuable advice I can offer is to carefully track the number of **render calls** (listed as "calls" in the performance metrics). Keeping these to a minimum will significantly boost your application's performance.

You can **reduce render calls** by:

- Using instanced objects
- Combining multiple objects in your scene
- Experimenting with different optimisation techniques

I recommend exploring various approaches to see which improvements yield the best results for your specific application. The **performance gains** can be substantial when implementing these techniques properly.

## Conclusion

There's much more to see and explore with React three fiber.  
I recommend looking at the **examples** and doing some **testing yourself**. If any of your clients would benefit from **beautiful 3D elements** on their website, React three fiber is definitely worth considering.

## Sources and examples

- [React three fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Examples](https://r3f.docs.pmnd.rs/getting-started/examples)
