---
title: 'Particle Background Effect with HTML Canvas'
date: '2025-08-07'
tags: ['frontend', 'animation']
images: ['/articles/particle-background-effect-with-react-and-canvas/particles.jpg']
summary: 'Create a dynamic animated particle background using the HTML5 Canvas API'
authors: ['steve-jonk']
theme: 'blue'
canonicalUrl: https://stevejonk.com/fiddles/particle-background-effect-with-react-and-canvas'
---

I always wanted to create a subtle, animated background effect, without relying on any external libraries. This React component uses only the HTML5 Canvas API to render a particle system with animated lines, making it lightweight, customizable, and easy to integrate into any modern UI.

## What it looks like

Before I dive into the code, here’s a quick preview of what the effect looks like in action.
Or you can view my personal site to see it in your browser: [stevejonk.com](https://stevejonk.com).

<div style={{display: 'flex', justifyContent: 'center'}}>
    <img src='/articles/particle-background-effect-with-react-and-canvas/result.gif' alt='Screen recording of the end result'  />
</div>

## The Component

The core of the effect is a React component (`Background.tsx`) that draws and animates particles on a `<canvas>`. Each particle moves independently, and lines are drawn between particles that are close to each other.

Key features:

- **Responsive:** The canvas resizes with the window.
- **Customizable:** Particle count, speed, color, and link radius are easy to tweak.
- **Efficient:** Uses `requestAnimationFrame` for smooth animation.

## How it Works

- **Particles:** Each particle has a position, speed, direction, and color. They bounce off the canvas edges.
- **Lines:** When two particles are within a certain distance, a line is drawn between them with opacity based on distance.
- **Animation Loop:** The component uses `requestAnimationFrame` to update and redraw the scene.

## Code Walkthrough

The main logic lives inside a `useEffect` hook, which sets up the canvas, particles, animation loop, and handles cleanup.

### Canvas Setup

A `ref` is used to access the canvas, and its size is set to match the window. The canvas resizes responsively:

```jsx
const canvasRef = (useRef < HTMLCanvasElement) | (null > null)

const resizeReset = () => {
  w = canvas.width = window.innerWidth
  h = canvas.height = window.innerHeight
}
window.addEventListener('resize', resizeReset)
```

### Particle Class

Each particle is an instance of a class with position, speed, direction, and color. The update method moves the particle and bounces it off the edges:

```jsx
class Particle {
  // ...
  update() {
    this.border()
    this.x += this.vector.x
    this.y += this.vector.y
  }
  border() {
    if (this.x >= w || this.x <= 0) this.vector.x *= -1
    if (this.y >= h || this.y <= 0) this.vector.y *= -1
    if (this.x >= w) this.x = w
    if (this.y >= h) this.y = h
    if (this.x < 0) this.x = 0
    if (this.y < 0) this.y = 0
  }
}
```

### Initialization

Particles are initialized with random positions and speeds. The amount and link radius scale with the window size:

```jsx
const initializeParticles = () => {
  options.particleAmount = (w + h) / 50
  options.linkRadius = w / 10 + h / 5
  particles = []
  for (let i = 0; i < options.particleAmount; i++) {
    particles.push(new Particle())
  }
}
```

### Drawing and Animation

Each frame, the canvas is cleared, particles are updated and drawn, and lines are drawn between close particles with opacity based on distance:

```jsx
const drawParticles = () => {
  particles.forEach((p) => {
    p.update()
    p.draw()
  })
}

const linkPoints = (point, hubs) => {
  hubs.forEach((hub) => {
    const distance = checkDistance(point.x, point.y, hub.x, hub.y)
    const opacity = 1 - distance / options.linkRadius
    if (opacity > 0) {
      ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(hub.x, hub.y)
      ctx.stroke()
    }
  })
}

const loop = () => {
  ctx.clearRect(0, 0, w, h)
  drawLines()
  drawParticles()
  loopId = requestAnimationFrame(loop)
}
```

## Source Code

See the full code in `components/Background.tsx` in [this repo](https://github.com/SteveJonk/stef-site/blob/main/components/Background.tsx).

---

This effect is a great way to add a modern, interactive touch to your site’s background without heavy dependencies.
