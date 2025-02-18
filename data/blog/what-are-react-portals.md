---
title: 'What are React _Portals_?'
date: '2024-11-15'
tags: ['react', 'frontend']
images: ['/articles/what-are-react-portals/react-portal-hero.png']
summary: "Let's have a look at React Portals and how they can help you in a pinch."
authors: ['dave-bitter']
theme: 'blue'
---

Let's dive into an incredibly powerful feature in React that you might not be using yet: React Portals. If you're not familiar with them, don't worry. By the end of this article, you'll not only know what they are but also see why they can be a incredibly useful for your projects!

## What are React Portals?

In essence, React Portals provide a way to render children into a DOM node that exists outside the hierarchy of the parent component. Normally, React components are rendered within the confines of their parent components, but with portals, you can render a child component into a different part of the DOM.

![schematic showing the NotificationBanner being rendered outside of the normal direct hierarchy](/articles/what-are-react-portals/react-portal-diagram.svg)

### Why is this useful?

Imagine you have a notification banner that needs to be displayed at the top level of your application. This banner should be triggered by various components deep in your component hierarchy. Managing such a requirement can lead to CSS complications and z-index nightmares. React Portals solve this elegantly by allowing these elements to be rendered outside of the parent component's tree, making them easier to manage and style.

## **How Do React Portals Work?**

Using React Portals is quite straightforward. Here's a basic example to get you started with a notification banner.

### **Creating a Portal**

First, you need to create a component that uses a portal. In this case, we'll create a **`NotificationBanner`** component:

```jsx
import React from 'react'
import { createPortal } from 'react-dom'

const NotificationBanner = ({ message }) => {
  return createPortal(
    // component to render
    <div className="notification-banner">{message}</div>,
    // element to render into
    document.body
  )
}

export default NotificationBanner
```

In this example, we're using **`createPortal`** to render the notification banner directly into the **`document.body`**, outside of the normal React component tree.

### **Using the NotificationBanner Component**

Now you can use the **`NotificationBanner`** component in other parts of your application. Here's an example of how it can be used:

```jsx
import React from 'react'
import NotificationBanner from './NotificationBanner'

const FooBar = () => {
  return (
    <div>
      <h1>FooBar Component</h1>
      <p>This is the main content of FooBar.</p>
      <NotificationBanner message="This is a notification banner at the bottom of the page!" />
    </div>
  )
}

export default FooBar
```

In this example, the **`NotificationBanner`** is used within the **`FooBar`** component, but it will actually render at the bottom of the **`document.body`** due to the portal.

## Why Should You Use React Portals?

Now that you know how to use React Portals, let's talk about why you should use them.

### Better Control Over CSS

By rendering components outside of their parent hierarchy, you gain more control over CSS. No more fighting with z-index issues or complex CSS rules to ensure your notifications appear above other content. Portals allow you to place these elements exactly where you need them in the DOM, making styling much more straightforward.

### Improved Accessibility

Portals can help improve the accessibility of your application. By controlling where the component is rendered, you can ensure that it appears in a logical order in the DOM, making it easier for screen readers and other assistive technologies to navigate. This is particularly useful for modal dialogs and other overlay components.

### Simplified Event Handling

When components like notifications are rendered outside of the parent component, it simplifies event handling. You no longer need to worry about event propagation issues that can arise from deeply nested component structures. Events will still bubble up as expected, maintaining React's synthetic event system.

### Maintaining React Virtual DOM Hierarchy

Another important use case for React Portals is when you need a component to be a child in the React virtual DOM but not in the actual DOM. This is useful in scenarios where the component needs to maintain its logical relationship with its parent for state management or context purposes but needs to be visually or structurally placed elsewhere in the DOM.

### Flexibility in Component Design

React Portals offer great flexibility in how you structure your components. You can keep the logic for triggering a portal in one component while rendering the actual content elsewhere in the DOM. This separation of concerns can lead to cleaner, more maintainable code, especially for complex UI elements.

### Perfect for Third-Party Integrations

If you're working with third-party libraries or legacy code, Portals can be incredibly helpful. They allow you to inject React components into any part of the DOM, even outside your main React app. This makes integrating React with other technologies much smoother.

## Conclusion

React Portals are a powerful feature that elegantly solves common UI challenges, especially when dealing with elements that need to break out of their component hierarchy. They're particularly useful for creating overlays, modals, tooltips, and notification banners that need to be rendered at the root level of your DOM.

By using Portals, you can simplify your CSS management, improve accessibility, and maintain a cleaner component structure. They're not about making complex UI elements, but rather about making it easier to manage where your components render in the DOM.

Remember, Portals are a tool in your React toolkit. While they're incredibly useful in certain situations, they're not needed for every component. Use them when you need to render content outside of the normal component tree, and you'll find they can greatly simplify your code and improve your application's structure.

Now that you understand React Portals, consider where they might be useful in your current or future projects. You might be surprised at how often this simple concept can lead to cleaner, more maintainable code. Happy coding!
