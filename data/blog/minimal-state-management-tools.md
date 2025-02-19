---
title: 'Minimal state management tools'
date: '2025-02-17'
tags: ['JavaScript']
images: ['/articles/minimal-state-management-tools/coding.jpg']
summary: "Let's talks about some state managament tools"
authors: ['audrey-behiels']
theme: 'blue'
---

In this article I will talk about four state management tools: Zustand, Nano Stores, Jotai and MobX. Before diving into these specific tools, it's crucial to understand two fundamental concepts in state management: the pull-based model and the push-based model.
The pull-bassed model is used when the application "pulls" the data when they need it. This is the traditional approach by many developers. Examples of pull-based patters include: Functions, promises, callbacks and event-listener. Where by a push-based model the data updates get automatically "pushed" to the components that use the sate. Examples of push-based patterns include: Observables and streams.

Now that we've clarified these foundational concepts, let's explore the state management tools I've selected for discussion, starting with Zustand.

## Zustand

Zustand, which fittingly means "state" in German, is a small, fast, and scalable state management library designed for React, but can be used in any Javascript environment. Created six years ago, and is now on their fifth version, Zustand offers developers a lightweight alternative to more complex state management solutions.

At its core, Zustand is designed with simplicity in mind. It provides a comfortable API based on hooks, leveraging React's own hook system.
By having a low learning curve and a minimal set-up the library is attractive for developers to implement this in their project.
The tool is excellent for small to medium-sized projects, but can be used in larger applications with good architecture.

It runs on Node.js and supports TypeScript, enabling developers to define types for their state and actions, which enhances code reliability and maintainability.

Unlike some other state management tools, Zustand doesn't require wrapping your entire application in a provider. This simplifies the setup process and make it easier to introduce state management incrementally into existing projects.

Zustland uses a pull-based model. It allows for efficient state management through the use of selectors, enabling components to subscribe only to the state they need.
In Zustand, state can be updated without the use of dispatched actions and reducers. Actions can be added to the store. This has a few advantages: it doesn't require a hook to call an action and it facilitates code splitting.

The library supports middleware as well and can handle asynchronous operations without the need for additional middleware or complex setups.
Zustand is often used with React Query or SWR for data fetching, providing a comprehensive solution for both state management and data fetching needs.

## Nanostores

Nano Stores is a tiny state management tool that can be used with React, React Native, Preact, Vue, Svelte, Solid, Lit, Angular, and vanilla JS. Four years ago Nano Stores was created. The library is designed to move logic from components to stores. It's known for its lightweight nature and good performance in various scenarios and well suited for project of medium size.

The library uses many atomic stores and direct manipulation. Nano Stores has a straightforward API, resulting in a low learning curve for developers. Unlike some more complex state management solutions, Nano Stores doesn't require extensive boilerplate code, allowing developers to get up and running quickly.

The library adopts a push-based model for state updates. This approach ensures that components are immediately notified of relevant state changes, leading to more efficient updates.

Server side rendering is supported, making it suitable for applications that require this capability. TypeScipt is supported as well, enabling type-safe state management out of the box.

Nano Stores does not include a formal middleware system like some other libraries does. However, it provides several features and patterns that can be used to achieve similar functionality to middleware.

## Jotai

Jotai, meaning "atomic" in Japanese, is a state management library for React, inspired by Recoil. Launched five years ago and now is on its second major version. The library takes an atomic approach to global React state management.

While primarily designed for React, Jotai is compatible with various frameworks including Next.js, Waku, Remix, and React Native. The library stands out for its minimal boilerplate and moderate learning curve, making it scalable in a project of different sizes.

Jotai makes use of hooks and allows atoms to be created and used without wrapping your application in a provider. The library uses a pull-based model for state updated and comes with built-in in utilities. The library has extensions so you can use others, like React query for data fetching and XState for complex state management. Jotai also offers server-side rendering support when used with frameworks like Next.js and Waku.

## MobX

MobX is a signal based, battle-tested library that makes state management simple and scalable by transparently applying functional reactive programming. Their strategy is "Anything that can be derived from the application state, should be. Automatically.".

The library uses a virtual dependency tree to track which parts of the state are used by which reactions, ensuring that only relevant parts of an application update when state changes occur.

Built around the concept of observables, MobX works well with object-oriented programming, allowing developers to work with classes and objects in a way that's natural to OOP principles. It employs a push-based model where changes in observables automatically trigger reactions and computations. The library's main concepts include observables for representing the state, actions for modifying the state, reactions for synchronizing state changes with effect like UI updates, and computed values for automatically deriving values from the state, also called derivations.

Created nine years ago and is currently on version 6.13.6. MobX works in any ES5 environment, which includes browsers and NodeJS.
While MobX can be used as a standalone library, most people use it with React. However its flexibility allows for seamless integration with other popular frameworks such as Vue and Angular as well as plain vanilla JavaScript applications.

There is a higher learning curve then the other libraries, especially for developers new to reactive programming concepts.

## Conclusion

Each library has its strengths and is suited for different scenarios. Zustand and Jotai are gaining popularity in the React ecosystem for their simplicity and effectiveness. MobX remains a powerful choice for complex applications. Nano Stores offers a unique, lightweight approach that can be particularly useful in multi-framework environments or when bundle size is a critical concern.

For simple, lightweight state management in React, consider Zustand or Nanostores.
Jotai is a great choice for flexible, atom-based state management in React.
For complex applications with intricate state interactions, especially in OOP style, MobX is very powerful.

The choice between these libraries often depends on the specific needs of the project, the team's familiarity with state managament tools, and the desired balance between simplicity, power, and performance.
