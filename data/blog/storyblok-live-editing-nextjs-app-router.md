---
title: 'Storyblok live editing with Next.js App Router and React Server Components'
date: '2024-06-04'
tags: ['Next.js', 'Storyblok']
images: ['/articles/storyblok-live-editing-nextjs-app-router/storyblokxnextjs.webp']
summary: "How to keep live editing support with Storyblok's full React Server Components approach for Next.js"
authors: ['daniel-krux']
theme: 'blue'
---

## The problem

When working with Storyblok there are **two** ways to set up your Next.js app if you use the app router. The first way is to wrap your entire app in a provider which then takes care of updating the app when you edit anything in the preview environment of Storyblok, thus giving you live editing. Live editing is a cool feature because an editor can directly see the changes they made without constantly saving the page.

The second approach keeps everything server-side. This is nice because we can then leverage the full power of server components. But this approach comes with a big limitation... you lose the live editing support and the editor can only see their changes after they've hit the save button.

Or is there a way...

I found this [Gist](https://gist.github.com/Ventanas95Dev/2683f50accac68369ef6bdc3fc62e392) from someone who stumbled across the same issue and solved it with a clever solution. I expanded on their solution and replaced their database (`@vercel/kv`) with something free and local. Let's dive in on how I did it!

## The solution

When you are in the live editing environment of Storyblok, they add a class to the browser's `window` object called `StoryblokBridge`. This bridge allows you to listen to live editing events happening with `on()`:

```js
const sbBridge = new window.StoryblokBridge(options)

sbBridge.on(['input', 'published', 'change  '], (event) => {
  const story = event.story
  // ...
})
```

The event returned contains the updated story with the live editing data the user entered. Awesome!
We can use this live story and save it somewhere, then revalidate the page using Next.js' `revalidatePath()` API. Let's see how:

Let's first tackle the "save it somewhere" part of the solution. I used [node-cache](https://github.com/node-cache/node-cache) for this.

Create an `instrumention.ts` file in the root or src folder of your project:

```jsx
import type NodeCache from 'node-cache'

export async function register() {
  const NodeCache = (await import('node-cache')).default
  const config = {
    stdTTL: 100,
  }

  global.storyblokCache = new NodeCache(config)
}
```

Add this to `next.config`:

```js
 experimental: {
  instrumentationHook: true,
 },
```

This setup makes sure the cache won't be reset with each request, only on server startup.

Next, let's take a look at how we get the live editing data from Storyblok and save it in this cache.
For this we first need to create a custom Storyblok bridge:

```jsx
export const registerStoryblokBridge = ({ onInput }) => {
  const isServer = typeof window === 'undefined'
  const isBridgeLoaded = !isServer && typeof window.storyblokRegisterEvent !== 'undefined'

  if (!isBridgeLoaded) {
    return
  }

  window.storyblokRegisterEvent(() => {
    const sbBridge = new window.StoryblokBridge()
    sbBridge.on(['input'], (event) => {
      if (!event?.story) return

      onInput(event.story)
    })
  })
}
```

This function listens to live editing events, as we found out above, and makes a callback with the story containing the latest live editing data.

We then use this function in a client component

```jsx
"use client";

import { previewUpdateAction } from "@/actions/previewUpdateAction";
import { registerStoryblokBridge } from "@/utils/storyblok";
import { useEffect, startTransition } from "react";

export const StoryblokPreviewSyncer = ({ pathToRevalidate }) => {
  function handleInput(story) {
    startTransition(() =>
      previewUpdateAction({
        story,
        pathToRevalidate,
      })
    );
  }

  useEffect(() => {
    registerStoryblokBridge({
      onInput: handleInput,
    );
  }, []);

  return null;
};

```

This client component makes sure the window event is fired with `useEffect`. The `handleInput` function uses React's `startTransition` to call a Next.js Server Action containing the latest data. Let's find out what this server action looks like.

```jsx
'use server'

import { revalidatePath } from 'next/cache'
import { ISbStoryData } from '@storyblok/react'

export async function previewUpdateAction({ story, pathToRevalidate }) {
  if (!story) {
    console.error('No story provided')
    return
  }

  try {
    global.storyblokCache.set(story.slug, JSON.stringify(story))

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate)
    }
  } catch (error) {
    console.log(error)
  }
}
```

This function takes the story with the live editing data and saves it to our cache. It then calls `revalidatePath` to make sure Next.js knows it needs to update the page.

We now only need one more piece to solve the puzzle and that is the function that takes care of fetching the story:

```jsx
export const getStoryblokData = async (slug) => {
  const storyblokApi = getStoryblokApi()

  try {
    const story = global.storyblokCache?.get(slug)

    if (!story) {
      const result = await storyblokApi.get(`cdn/stories/${slug}`, { version: 'draft' })

      return result.data.story
    }

    return JSON.parse(story)
  } catch (e) {
    console.log(e)
  }
}
```

This function first tries to fetch the story from the database (this would be the story with the latest live editing). If this fails it falls back to the Storyblok API.

We can then use this function on a page together with our `<StoryblokPreviewSync />` component:

```jsx
import { StoryblokComponent } from '@storyblok/react/rsc'

import { StoryblokPreviewSyncer } from '@/components/StoryblokPreviewSync'
import { getStoryblokData } from '@/utils/storyblok'

export default async function Home() {
  const story = await fetchData()

  return (
    <main>
      <StoryblokPreviewSyncer pathToRevalidate={'/'} />
      <StoryblokComponent blok={story?.content} />
    </main>
  )
}

function fetchData() {
  return getStoryblokData('home')
}
```

There you go! Now you should have live editing support, with the full power of React Server Components!
