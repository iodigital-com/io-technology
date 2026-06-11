---
title: "Web Animations: WAAPI vs Motion"
date: "2026-06-09"
tags: ["frontend", "javascript", "react", "animations"]
images:
  [
    "/articles/web-animations-waapi-vs-motion/web-animations-waapi-vs-motion-hero.png",
  ]
summary: "A practical guide to choosing between the native Web Animations API and the Motion library. When does the browser give you everything you need, and when should you reach for a library?"
authors: ["luca-vandenweghe"]
theme: "purple"
---

Animations are not decoration. They guide attention, provide feedback, and reduce cognitive load. Studies show that smooth transitions improve perceived performance and make interfaces feel more responsive. But when it comes to implementing them on the web, you have a choice to make: do you use what the browser gives you natively, or do you reach for a library?

In this article, I compare two tools that sit at different ends of the spectrum: the **Web Animations API** (WAAPI) and the **Motion** library. I will walk through what each offers, show code examples, and give you a clear decision framework for when to use which.

## What is the Web Animations API?

The Web Animations API is a native browser API that lets you create and control animations directly from JavaScript. It shipped in all evergreen browsers around 2020 and now has [96.4% global support](https://caniuse.com/web-animation). No install, no bundle cost.

Think of it as the programmatic equivalent of CSS transitions and `@keyframes`, but with full JavaScript control over playback.

### The basics: `element.animate()`

The core API is straightforward. You call `.animate()` on any DOM element with an array of keyframes and an options object:

```js
const box = document.querySelector(".box");

box.animate(
  [
    { opacity: 0, transform: "translateX(-60px)" },
    { opacity: 1, transform: "translateX(0)" },
  ],
  {
    duration: 600,
    easing: "ease-out",
    fill: "forwards",
  },
);
```

It returns an `Animation` object, which is where WAAPI gets interesting.

### Playback control

Unlike CSS animations, WAAPI gives you an `Animation` object back. You can pause, play, reverse, and change the playback rate:

```js
const anim = box.animate(keyframes, {
  duration: 2000,
  iterations: Infinity,
});

anim.pause();
anim.play();
anim.reverse();
anim.playbackRate = 3;
```

This makes it ideal for interactive UIs where the user controls playback, or for orchestrating animations programmatically.

### Scroll-driven animations

One of the most exciting recent additions is `ScrollTimeline`. It lets you tie animations directly to scroll position, running entirely on the compositor thread for guaranteed 60fps:

```js
bar.animate([{ width: "0%" }, { width: "100%" }], {
  fill: "forwards",
  timeline: new ScrollTimeline({
    source: scrollContainer,
    axis: "block",
  }),
});
```

No JavaScript scroll listeners, no `requestAnimationFrame` loops. Chrome 115+, Firefox 110+, with Safari working on support.

### Staggering (the manual way)

WAAPI has no built-in stagger. You loop over elements and add incremental delay:

```js
bars.forEach((bar, i) => {
  bar.animate(
    [
      { transform: "scaleX(0)", opacity: 0 },
      { transform: "scaleX(1)", opacity: 1 },
    ],
    {
      duration: 400,
      delay: i * 100,
      easing: "ease-out",
      fill: "forwards",
    },
  );
});
```

It works, but it is verbose. Keep this in mind for the comparison later.

### Limitations

WAAPI is powerful for what it does, but it has clear gaps:

- **No spring physics** - only CSS easing functions (cubic-bezier, steps)
- **No gesture system** - no built-in hover, tap, or drag handling
- **No layout animations** - cannot animate elements between layout positions
- **No exit animations** - elements disappear from the DOM instantly
- **No declarative API** - imperative `.animate()` calls only
- **Manual sequencing** - you chain with promises yourself

These gaps are exactly what Motion fills.

## What is Motion?

[Motion](https://motion.dev) (formerly Framer Motion) is a production-grade animation library for the web. It is fully open-source under the MIT licence, currently at version 12. It has 31.6k GitHub stars, around 30 million monthly npm downloads, and weighs approximately 18kb tree-shaken. The library describes itself as a "hybrid engine" combining JavaScript animation with hardware-accelerated browser APIs.

It supports React, Vue, and vanilla JavaScript. Under the hood, Motion actually uses WAAPI for transforms and opacity, layering higher-level abstractions on top.

There is also a paid add-on called [Motion+](https://motion.dev) (one-time purchase, not a subscription) that includes premium components, 380+ copy-paste examples, an AI Kit with agent-compatible documentation, and a visual transition editor for IDEs. The core library itself remains completely free and open-source.

### The declarative API

Where WAAPI needed 13 lines for a fade-in, Motion needs three:

```tsx
<motion.div
  initial={{ opacity: 0, x: -60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
/>
```

No refs, no `useEffect`, no imperative calls. You declare what the animation should look like, and Motion handles the rest.

### Spring physics

This is Motion's superpower. Real physics simulation with mass, stiffness, and damping. No duration needed; the spring determines when to stop naturally:

```tsx
<motion.div
  animate={{ y: 0 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 12,
  }}
/>
```

No CSS easing curve can replicate the feel of a real spring. This matters for UI interactions where natural motion makes the difference between "polished" and "good enough".

### Gestures

Declarative gesture handling with one prop each:

```tsx
<motion.div
  whileHover={{ scale: 1.15 }}
  whileTap={{ scale: 0.9 }}
  drag
  dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
/>
```

No `addEventListener`, no cleanup, no pointer capture math. Drag even has elastic constraints built in.

### Layout animations

Add the `layout` prop and Motion auto-animates any layout change using the FLIP technique:

```tsx
<motion.div layout>
  {items.map((item) => (
    <motion.div key={item.id} layout transition={{ type: "spring" }}>
      {item.label}
    </motion.div>
  ))}
</motion.div>
```

Position, size, even moves between different parents. No manual measurement or delta calculation needed.

### AnimatePresence (exit animations)

In React, when you conditionally render an element, it disappears from the DOM instantly. WAAPI cannot animate what no longer exists. `AnimatePresence` solves this by keeping the element alive until its exit animation completes:

```tsx
<AnimatePresence>
  {items.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60 }}
    >
      {item.label}
    </motion.div>
  ))}
</AnimatePresence>
```

This is impossible with WAAPI alone in a React context.

### Variants and stagger

Remember the WAAPI `forEach` loop? Motion reduces stagger to a single configuration line:

```tsx
const parent = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const child = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

<motion.ul variants={parent} animate="visible">
  {items.map(item => (
    <motion.li key={item} variants={child} />
  ))}
</motion.ul>
```

Variants propagate through the component tree. The parent coordinates its children automatically.

## Head-to-head comparison

| Feature | WAAPI | Motion |
|---------|-------|--------|
| Spring physics | No | Yes |
| Gestures (hover/tap/drag) | No | Yes |
| Layout animations | No | Yes |
| Exit animations | No | Yes |
| Scroll-driven | Yes | Yes |
| Playback control | Yes | Yes |
| Bundle size | 0kb | ~18kb |
| Performance | Native (compositor) | Near-native |
| Declarative API | No | Yes |

For a simple hover effect, WAAPI needs five lines of imperative JavaScript. Motion needs one prop: `whileHover={{ scale: 1.15 }}`. The visual result is the same, but the developer experience is dramatically different.

The performance story is worth noting: for simple transforms and opacity, both perform identically because Motion delegates to WAAPI under the hood. For springs and complex gestures, Motion does additional JavaScript work but stays smooth for typical use cases.

## When to use what

**Use WAAPI when:**

- You need simple transitions (fade, slide, scale)
- You need fine-grained playback control
- You have a zero-bundle-size constraint
- You want framework-agnostic code
- You are building scroll-driven animations

**Use Motion when:**

- You need spring physics for natural motion
- You need gestures (hover, tap, drag)
- You need layout animations
- You need exit animations (AnimatePresence)
- You are working in a React or Vue project

### The key insight

Motion is not a replacement for WAAPI. It is built on top of it. They are complementary tools, not competing ones.

Start with WAAPI. Reach for Motion when you need more.

In practice, most animations in a typical web application are simple enough for WAAPI: a fade-in on mount, a slide transition between views, a progress bar tracking scroll. Reach for Motion when you need gesture-heavy interactions, layout animations, or when you want the polish that spring physics brings to interactive components.

## Resources

- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Motion documentation](https://motion.dev)
- [Motion React Quick Start](https://motion.dev/docs/react-quick-start)
- [MotionScore](https://motion.dev) - free performance audit tool that grades animation performance S through F
