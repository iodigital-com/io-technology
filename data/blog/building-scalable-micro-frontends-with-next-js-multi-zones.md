---
title: 'Building Scalable _Micro-Frontends_ with Next.js Multi Zones'
date: '2024-12-10'
tags: ['next', 'react', 'frontend', 'micro frontends']
images:
  ['/articles/building-scalable-micro-frontends-with-next-js-multi-zones/next-multi-zones-hero.png']
summary: "Let's see how Next.js Multi Zones can make building micro frontends a breeze."
authors: ['dave-bitter']
theme: 'blue'
---

As our web applications grow in complexity, we often find ourselves needing to split them into smaller, more manageable pieces. This is where Next.js Multi Zones comes in - a powerful feature that allows us to create micro-frontends that work together seamlessly. Let's look at how we can use Multi Zones to build scalable and maintainable web applications.

## The challenge of growing applications

When a web application scales, we often need multiple teams working on different parts of the site. This can lead to:

- Merge conflicts: With multiple teams working on the same codebase, merge conflicts become more frequent, slowing down development and increasing the risk of errors.
- Differing scopes and business rules: Different parts of an application may have distinct requirements, making it challenging to maintain consistency across the entire codebase.
- Slower development and deployment cycles: As the application grows, building, testing, and deploying the entire application becomes more time-consuming and risky.

The traditional solution? Splitting the application into separate projects and/or setting up a mono-repo. But this often results in a inconsistend user experience and complex deployment processes. What if you want to have completely separate Next.js projects but combine them into a single experience?

## How can Next.js Multi Zones help?

Next.js Multi Zones allows us to have multiple Next.js applications work together as if they were a single application. This means:

- Independent development and deployment: Teams can work on different parts of the site without interfering with each other, and deploy their sections independently.
- Seamless navigation for users: Despite being separate applications, users experience smooth, client-side navigation between zones.

Let's explore how to set this up with a concrete example:

## Setting up a Multi Zones

We'll create a project with two zones: 'home' and 'blog'. Here's how to set it up step-by-step:

Create a new directory for your Multi Zones project:

```bash
mkdir next-js-multi-zones
cd next-js-multi-zones
```

Create two Next.js applications, one for 'home' and one for 'blog':

```bash
npx create-next-app@latest home --typescript --eslint
npx create-next-app@latest blog --typescript --eslint
```

Navigate to the 'home' directory and update **`next.config.js`**:

```jsx:home/next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'http://localhost:3001/blog',
      },
      {
        source: '/blog/:path*',
        destination: 'http://localhost:3001/blog/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

Navigate to the 'blog' directory and update **`next.config.js`**:

```jsx:blog/next.config.js
const nextConfig = {
  basePath: '/blog',
}

module.exports = nextConfig
```

Navigate back to the 'home' directory and edit `home/app/page.tsx`:

```jsx:home/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Welcome to Home</h1>
      <Link href="/blog">Go to Blog</Link>
    </div>
  )
}
```

Navigate to the 'blog' directory and edit `blog/app/page.tsx`:

```jsx:blog/app/page.tsx
import Link from 'next/link'

export default function Blog() {
  return (
    <div>
      <h1>Welcome to Blog</h1>
      <Link href="/">Go to Home</Link>
    </div>
  )
}
```

Open two terminal windows. In the first, start the 'home' application:

```bash
cd home
npm run dev -- -p 3000
```

In the second, start the 'blog' application on a different port:

```bash
cd blog
npm run dev -- -p 3001
```

Now, you can visit **`http://localhost:3000`** to see the 'home' application, and navigate seamlessly to the 'blog' application using the link.

## The reality of Multi Zones

With this setup, you can now:

- Develop and deploy the 'home' and 'blog' applications independently: Each team can work on their respective applications without affecting others, leading to faster development cycles and reduced risk of conflicts.
- Navigate between them as if they were a single application: Thanks to Next.js's client-side routing, users can move between zones without full page reloads, providing a smooth, SPA-like experience.

However, it's important to understand how resources are managed in a Multi Zones setup:

1. Separate Bundles: Each zone (application) has its own JavaScript bundle, CSS, and other assets. They are not automatically shared or optimized across zones.
2. Independent Loading: When a user navigates from one zone to another, the resources for the new zone are loaded independently. This means that common libraries (like React) might be downloaded again if they're used in both zones.
3. No Automatic Deduplication: Unlike a single Next.js application, Multi Zones doesn't automatically deduplicate shared dependencies across zones. Each zone loads its resources independently.
4. Zone-Specific Optimization: Performance optimization happens within each zone independently. This includes features like code splitting and lazy loading, but these optimizations don't extend across zone boundaries.

## Progressive Enhancement

One of the key benefits of Multi Zones is that it works with progressive enhancement. Even if JavaScript fails to load, users can still navigate between zones using standard HTML links. This is because:

1. Server-side rendering: Each zone can render its content on the server, ensuring that users see content even without JavaScript.
2. HTML-based routing: The rewrite rules we set up work at the server level, allowing for navigation between zones even without client-side JavaScript.
3. Graceful degradation: While features like client-side navigation enhance the experience, the basic functionality of moving between zones remains intact without them.

## Conclusion

Next.js Multi Zones offers a powerful solution for building scalable micro-frontends. It allows teams to work independently while maintaining a seamless user experience for end-users. By enabling separate development and deployment and supporting progressive enhancement, Multi Zones provides a robust foundation for large-scale web applications.

However, it's important to understand that Multi Zones involves managing separate applications, each with its own resources. This requires careful planning and consideration of performance implications, especially when it comes to shared dependencies and overall user experience.

As your application grows, consider leveraging Multi Zones to keep your development process efficient and your user experience smooth. Remember, the web is a platform. Multi Zones helps us work with it, not against it, providing a solid foundation for large-scale web applications that can evolve and scale with your needs, while requiring thoughtful architecture and resource management.
