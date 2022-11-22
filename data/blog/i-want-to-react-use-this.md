---
title: 'I want to _React.use()_ this!'
date: '2022-11-22'
tags: ['react', 'frontend']
images: ['/articles/i-want-to-react-use-this/i-want-to-react-use-this.jpg']
summary: 'A big part of working with React.js is fetching data and displaying the results. Let’s see how the new React.use() hook can can help you!'
authors: ['dave-bitter']
theme: 'blue'
---

There’s quite a bit of chatter lately about an experimental hook called `React.use()`. This will fundamentally change the way you work with [React.js](https://reactjs.org/). Let’s have a look at what it is, why you would want to `React.use()` it and how it works!

## What is `React.use()`?

`React.use()` is an experimental hook that offers first-class support for promises and async/await. In essence, it means that you can await asynchronous code in the root of your components.

Couldn’t you already do that? Nope! Sure you could have promises in React.js for, for instance, data fetching, but you always used something like `useEffect` for this. The component, or rather function that returns some JSX, always just ran. There was no way to pause it to await some asynchronous code. Until now.

## Why would I want to `React.use()` this?

The ability to now await some asynchronous code will for instance have a big impact on how you load data into your component. Previously, you would have to resort to `useEffect` to fetch data. You would then have to add some state where you store the data and potentially show a spinner while the data is being fetched. This could look something like this:

```jsx
import React, { useEffect, useState } from 'react'

const YourComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    setIsLoading(true)

    fetch('api.com/data')
      .then((res) => res.json())
      .then((result) => {
        setData(result)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return 'Loading...'
  }

  if (!data) {
    return 'No data'
  }

  return (
    <ul>
      {data.map((datum) => (
        <li key={datum.id}>{datum.name}</li>
      ))}
    </ul>
  )
}

export default YourComponent
```

Note that all the data fetching happens on the client-side. Because of this, the first time the component renders on the client you start fetching data and you need to show some feedback to the user. In this simplified example that is the string ‘Loading…’, but more than likely you display a spinner.

This isn’t great as the component is rather useless if the data is not fetched yet. So, even though you might have server-side rendering, you won’t really get any benefits. You have to do it this way as you couldn’t run the fetching logic on the server before due to the need of `useEffect`. As the JavaScript function (or often named “component”) is just a function that will run on the server, why can’t I pause that function, fetch the data on the server and then have the first render already use that fetched data on the server? This is why you want `React.use()`.

## How do I `React.use()` it?

You can simply import the `use` hook from the React.js package. Next, you pass it a fetching function, or rather, a Promise. Finally, you assign the response to a variable. The updated example would look a bit like this:

```jsx
import React, { use } from 'react'

const getData = fetch('api.com/data').then((res) => res.json())

const YourComponent = () => {
  const data = use(getData)

  if (!data) {
    return 'No data'
  }

  return (
    <ul>
      {data.map((datum) => (
        <li key={datum.id}>{datum.name}</li>
      ))}
    </ul>
  )
}

export default YourComponent
```

It looks like a minor change, but let’s see what you gained.

Firstly, you got rid of the `useEffect` and `useState` hooks. Even better, you got rid of any client-side code! This is now a server component which, when server-side rendering, the function will pause on the server, fetch some data and then return the “filled JSX”.

Secondly, you simplified the logic. As you don’t need the before-mentioned hooks and callbacks, the code is drastically simplified. Now, this is a simple demo component, but you can imagine more complex components really benefitting from this.

Finally, you could remove any of the loading state. Because of the `use` hook waited on, the rest of the code will never be executed before it’s done. Of course, you still have to handle the state where there's no data returned from the endpoint, but you can forget about any loading feedback.

### So, no more data fetching in the `useEffect` hook?

Not necessarily, you now have two options which both have their benefits. `use` is great to fetch the data on the server when the component isn’t very useful without the data. Fetching data in a `useEffect` hook is useful when you do want to show the UI while it is fetching the data.

## Closing thoughts

I’m very excited for `React.use()` and the move to server side-first. With frameworks like [Remix](https://remix.run/) and [Next.js](https://nextjs.org/) creating solutions for this problem, it’s good to see a standard coming to React.js that can be utilised by both. It will drastically simplify data fetching and help you create robust server-first components!
