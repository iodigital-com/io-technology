---
title: 'Minimal state management tools'
date: '2025-03-05'
tags: ['JavaScript']
images: ['/articles/minimal-state-management-tools/coding.jpg']
summary: "Modern web applications require effective state management solutions, but choosing between Redux, Zustand, Nano Stores, Context API, Recoil, Jotai, and other options can be overwhelming. Let's compare some of these state management tools based on complexity, performance, developer experience, and use cases to help you select the right one for your specific project needs"
authors: ['audrey-behiels']
theme: 'blue'
---

In this article, I will talk about four state management tools: Zustand, Nano Stores, Jotai, and MobX. Before diving into these specific tools, it's crucial to understand two fundamental state management concepts: the pull-based and push-based models.
The pull-bassed model is used when the application "pulls" the data when needed. This is the traditional approach of many developers. Examples of pull-based patterns include: Functions, promises, callbacks, and event-listeners. Whereas in a push-based model, the data updates get automatically "pushed" to the components that use the state. Examples of push-based patterns include: Observables and streams.

Now that we've clarified these foundational concepts, let's explore the state management tools I've selected for discussion, starting with Zustand.

## Zustand

[Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction), which fittingly means "state" in German, is a small, fast, and scalable state management library designed for React, but can be used in any Javascript environment. Created six years ago, and is now on their fifth version, Zustand offers developers a lightweight alternative to more complex state management solutions.

At its core, Zustand is designed with simplicity in mind. It provides a comfortable API based on hooks, leveraging React's own hook system.
This library's ease of learning and minimal setup makes it an attractive option for developers looking to integrate it into their projects.
The tool is excellent for small to medium-sized projects but can be used in larger applications with good architecture.

It runs on Node.js and supports TypeScript, enabling developers to define types for their state and actions, which enhances code reliability and maintainability.

Unlike some other state management tools, Zustand doesn't require wrapping your entire application in a provider. This simplifies the setup process and makes it easier to introduce state management incrementally into existing projects.

Zustand uses a pull-based model. It allows for efficient state management through the use of selectors, enabling components to subscribe only to the state they need.
In Zustand, a state can be updated without the use of dispatched actions and reducers. Actions can be added to the store. This has a few advantages: it doesn't require a hook to call an action and it facilitates code splitting.

The library supports middleware as well and can handle asynchronous operations without the need for additional middleware or complex setups.
Zustand is often used with [React Query](https://tanstack.com/query/v3/) or [SWR](https://swr.vercel.app/) for data fetching, providing a comprehensive solution for both state management and data fetching needs.

### Code examples

Defining a store, with values and actions that update the store:

```js
import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

Rendering data from your store, this is the same for the actions:

```js
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}
```

## Nanostores

[Nano Stores](https://github.com/nanostores/nanostores) is a tiny state management tool that can be used with React, React Native, Preact, Vue, Svelte, Solid, Lit, Angular, and vanilla JS. Four years ago Nano Stores was created. The library is designed to move logic from components to stores. It's known for its lightweight nature and good performance in various scenarios and well-suited for projects of medium size.

The library uses many atomic stores and direct manipulation. Nano Stores has a straightforward API, resulting in a low learning curve for developers. Unlike some more complex state management solutions, Nano Stores doesn't require extensive boilerplate code, allowing developers to get up and running quickly.

The library adopts a push-based model for state updates. This approach ensures that components are immediately notified of relevant state changes, leading to more efficient updates.

Server-side rendering is supported, making it suitable for applications that require this capability. TypeScipt is supported as well, enabling type-safe state management out of the box.

While Nano Stores lacks a formal middleware system, it offers alternative features and patterns that enable developers to achieve similar results.

### Code example

Defining an atom, updating the value:

```js
import { atom } from 'nanostores'

const counter = atom(0)
counter.get()
counter.set(counter.get() + 1)
```

Defining a map, updating it:

```js
import { map } from 'nanostores'

const profile = map({ name: 'anonymous' })
profile.setKey('name', 'Kazimir Malevich')
```

Defining a deep map and updating this:

```js
import { deepMap } from 'nanostores'

const profile = deepMap({
  hobbies: [
    {
      name: 'woodworking',
      friends: [{ id: 123, name: 'Ron Swanson' }],
    },
  ],
})
profile.setKey('hobbies[0].name', 'Scrapbooking')
```

## Jotai

[Jotai](https://jotai.org/), meaning "atomic" in Japanese, is a state management library for React, inspired by Recoil. Launched five years ago and now is on its second major version. The library takes an atomic approach to global React state management.

While primarily designed for React, Jotai is compatible with various frameworks including Next.js, Waku, Remix, and React Native. The library stands out for its minimal boilerplate and moderate learning curve, making it scalable in a project of different sizes.

Jotai makes use of hooks and allows atoms to be created and used without wrapping your application in a provider. The library uses a pull-based model for state updates and comes with built-in utilities. It has excellent TypesScript support. The library has extensions so you can use others, like React query for data fetching and XState for complex state management. Jotai also offers server-side rendering support when used with frameworks like Next.js and Waku.

### Code examples

Defining an primitive atom:

```js
import { atom } from 'jotai'

// single value
const countAtom = atom(0)

const [count, setCount] = useAtom(countAtom)
// Array
const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka'])
// Object
const productAtom = atom({ id: 12, name: 'good stuff' })
```

Defining an Derived atom:

```js
import { atom } from 'jotai'

const progressAtom = atom((get) => {
  const anime = get(animeAtom)
  return anime.filter((item) => item.watched).length / anime.length
})
```

## MobX

[MobX](https://mobx.js.org/README.html) is a signal-based, battle-tested library that makes state management simple and scalable by transparently applying functional reactive programming. Their strategy is "Anything that can be derived from the application state, should be. Automatically.".

The library uses a virtual dependency tree to track which parts of the state are used by which reactions, ensuring that only relevant parts of an application update when state changes occur.

Built around the concept of observables, MobX works well with object-oriented programming, allowing developers to work with classes and objects in a way that's natural to OOP principles. It employs a push-based model where changes in observables automatically trigger reactions and computations. The library's main concepts include observables for representing the state, actions for modifying the state, reactions for synchronizing state changes with effects like UI updates, and computed values for automatically deriving values from the state, also called derivations.

Created nine years ago and is currently on version 6.13.6. MobX works in any ES5 environment, which includes browsers and NodeJS. It has excellent TypeScript support.
While MobX can be used as a standalone library, most people use it with React. However, its flexibility allows for seamless integration with other popular frameworks such as Vue and Angular as well as plain vanilla JavaScript applications.

There is a higher learning curve compared to other libraries, especially for developers new to reactive programming concepts.

### Code examples

Class component:

```js
import { makeAutoObservable } from 'mobx'

class TodoStore {
  todos = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(text) {
    this.todos.push({ id: Date.now(), text, completed: false })
  }

  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  get incompleteTodosCount() {
    return this.todos.filter((todo) => !todo.completed).length
  }
}

export const todoStore = new TodoStore()
```

Functional component:

```js
import { makeAutoObservable } from 'mobx'

function createDoubler(value) {
  return makeAutoObservable({
    value,
    get double() {
      return this.value * 2
    },
    increment() {
      this.value++
    },
  })
}
```

## Comparison

<div class="table-wrapper" markdown="block" style={{ overflowX: 'auto' }}>

|                                 | Zustand                                                                                                    | Nano stores                                                                                                          | Jotai                                             | MobX                                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Complexity & learning curve     | Easy to learn, low learning curve. <br/>Straightforward api<br/>Hook based                                 | Low learning curve.<br />Straightforward API<br/>Atomic based                                                        | Medium learning curve.<br/> Atomic based          | Has a higher learning curve.                                                                 |
| Set-up & boilerplate            | Minimal setup, less boilerplate                                                                            | No complex boilerplate                                                                                               | Minimal boilerplate                               | Boilerplate-free. More verbose set-up.                                                       |
| Performance                     | It's designed to be fast and lightweight                                                                   | Known for its lightweight nature and good performance in various scenarios                                           | Very good performance                             | Excellent for complex, frequently updating state due to its fine-grained reactivity system   |
| Tooling                         | React focused. Integrates well with existing React tools and libraries.                                    | Multi framework                                                                                                      | React focused                                     | Multi framework, you can use MobX with other frameworks like Flutter/dart, lit, Anguar, vue. |
| Scalability                     | Excellent for small to medium-sized projects, but can be used in lager applications with good architecture | Suited for medium projects                                                                                           | Good, suitable for small to medium-sized projects | Works good for larger application with more complexity                                       |
| Middleware                      | It supports middleware. Often used with React Query or SWR for data fetching                               | No formal middleware, it provides several feature to achieve similar functionality to middleware, like store events. | Has it own set of utilities and integrations      | It is supported.                                                                             |
| Server-side rendering support   | Yes                                                                                                        | Yes                                                                                                                  | Yes                                               | Yes                                                                                          |
| Pull-based vs. Push-based model | Pull-based model                                                                                           | Push-based model                                                                                                     | Pull-based model                                  | Push-based model                                                                             |
| Typescript support              | Yes, good                                                                                                  | Yes, good                                                                                                            | Yes, excellent                                    | Yes, excellent                                                                               |
| Bundle size                     | Small, install size 87.1 kB                                                                                | Install size 42.6 kB                                                                                                 | Install size is 486 kB                            | Install size is 4.13 MB                                                                      |
| Community & support             | Smaller but growing. Almost daily commits on the repo                                                      | Small ecosystem                                                                                                      | Growing                                           | Large ecosystem and active community                                                         |

</div>

## Conclusion

Each library has its strengths and is suited for different scenarios. Zustand and Jotai are gaining popularity in the React ecosystem for their simplicity and effectiveness. MobX remains a powerful choice for complex applications. Nano Stores offers a unique, lightweight approach that can be particularly useful in multi-framework environments or when bundle size is a critical concern.

For simple, lightweight state management in React, consider Zustand or Nanostores.
Jotai is a great choice for flexible, atom-based state management in React.
For complex applications with intricate state interactions, especially in OOP style, MobX is very powerful.

The choice between these libraries often depends on the specific needs of the project, the team's familiarity with state management tools, and the desired balance between simplicity, power, and performance.

I'd be interested to collaborate on a project that uses Zustand for state management. Its comprehensive documentation includes practical examples, making implementation straightforward. The library offers excellent tutorials for newcomers, and having React experience is definitely beneficial when working with Zustand, as it's designed specifically for React applications.
My thoughts on Jotai are quit similar, I appreciate the readable documentation. I particularly like their interactive playground where you can experiment with the code directly without needing to set up a project from scratch.
What impresses me about Nano Stores is its cross-framework compatibility and significantly smaller footprint compared to other state management solutions.
The documentation for MobX gives the impression of being more technically demanding to understand compared to other libraries.

## Links

[Zustand, When, how and why](https://dev.to/ricardogesteves/zustand-when-how-and-why-1kpi) <br/>
[State Management in Astro: A Deep Dive into Nanostores](https://meirjc.hashnode.dev/state-management-in-astro-a-deep-dive-into-nanostores)<br />
[State Management with Jotai — React and TypeScript ready library](https://medium.com/@maciejpoppek/state-management-with-jotai-react-and-typescript-ready-library-a40ac967ac3e) <br/>
[MobX adoption guide: Overview, examples, and alternatives](https://blog.logrocket.com/mobx-adoption-guide/#what-is-mobx)
