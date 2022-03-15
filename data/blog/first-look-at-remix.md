---
title: 'First look at Remix'
date: '2021-12-08'
tags: ['frontend', 'react', 'remix']
image: '/blog/first-look-at-remix/remix.jpeg'
summary: 'There has been a lot of buzz around the open-source release of Remix. I took a first look by following the deep-dive tutorial and this is what I found.'
authors: ['dave-bitter']
---

[Remix](https://remix.run) is a full-stack web framework that lets you focus on the user interface and work back through web fundamentals to deliver a fast, slick, and resilient user experience. This is what excited me when I first read about Remix. I'm a big advocate for progressively enhancing web applications and this framework seems to take this approach by simply using web fundamentals.

This is not a step-by-step guide on how to make a web application with Remix, but rather some features I noticed and wanted to highlight. That might come later. If you are looking for that, [Remix.run](http://Remix.run) is an amazing landing page and contains very well written documentation that will take you through all the reasons why they build this framework, what it offers and how it works. Seriously, one of the best landing pages I've seen in the past few years. Please, have a read there and come back for my view as a [Next.js](https://nextjs.org/) fanboy.

## Routing mechanism

Like Next.js, Remix uses a file-based routing system. In `/app` (where your app will live) you can create a folder called `routes`. Every file you add (e.g. `/app/routes/example` will create a route and page under `http://website.com/example`. If you're unfamiliar with this concept, please read my article [A simple, yet detailed introduction to Next.js](https://www.davebitter.com/articles/a-simple-yet-detailled-introduction-to-next-js). Next.js and Remix work nearly the same with some exceptions like creating a dynamic page (`[slug]` vs. `$slug`. If this is not the way you want to work, you can also define your routes in an object for both of these frameworks.

### Nested routes

Remix seems to heavily rely on the usage of nested routes as "partials". Let's say you are building an admin view. You might have multiple routes for several admin pages:

```

- app
  - routes
      - admin.tsx
      - admin
          - new.tsx
          - edit.tsx
              $user.tsx

```

All these admin pages might share a special navigation bar for logged in admins. Naturally, you could load a reusable component in the markup of all these pages, but that sounds more like a partial that you used to use back when building websites with templating languages like Pug or Handlebars. Remix allows you to just load the partial in `app/routes/admin.tsx` and add a Remix component called `<Outlet />` . This component serves as a placeholder where a child route can be rendered. In this case, that would be the new and edit route. I really like this approach of templating out pages.

### Scoped JS and CSS per nested route

These nested routes are not just useful as partials, but will allow Remix to also easily chunck-up your nested routes for JS and CSS bundles. Naturally, it knows what pieces to load as you load them per nested route. This makes these nested routes true small little routes and optimises the loading of resources.


This concept is fundamental to how Remix works. You can read more about nested routes [here](https://remix.run/docs/en/v1/guides/routing) and CSS scoping with `<Links />` [here](https://remix.run/docs/en/v1/guides/styling).

## Server- and client-side code

We've seen great strides by Next.js to make it easy for developers to expose server-side functions right next to client-side code. You can read more about that in my article [Next.js page generation](https://www.davebitter.com/articles/next-js-page-generation). At a first glance, Remix has an evenly convenient, if not better solution. I feel like Remix takes it to the next level by fully focussing on not having to use client-side JS as a standard, but rather an afterthought.

### Loaders

Many web applications need to fetch data. You can use `loader` functions in combination with a `useLoaderData` hook to set this up.

```jsx

import type { LoaderFunction } from "remix";

import type { User } from "@prisma/client";

import { db } from "~/utils/db.server";


type LoaderData = { users: Array<User> };

export let loader: LoaderFunction = async () => {
const data: LoaderData = {
  users: await db.user.findMany()
};

return { data };
};


export default function Users() {
const data = useLoaderData<LoaderData>();

return (
  <ul>
    {data.map(user => (
      <li>{user.name}</li>
    ))}
  </ul>
);
}

```

There is quite some Typescript-specific code here, but in its essence there is an async function exported called `loader`. This function fetches some data and returns an object with data. Note that you can return multiple pieces of data from various sources here. You can now access all this data using the `useLoaderData` hook. An important aspect of this is that no client-side JS is needed here. You just want some data from your server-side function and then use it to render a list on the server to serve to the client.

### Actions

So what about handling things like forms? I need to handle that on the client right? Well, not necessarily. Forms can easily be handled with a `method` attribute on the form element. Sure, you might want to make a fancy multi-step form, but this is where progressive enhancement pops up again. Just make a form with a `method` and let it post using the web standards. You then export an `action` function that will handle the posting of the form. Take a look at this code snippet of the [Jokes app tutorial](https://remix.run/docs/en/v1/tutorials/jokes) I followed in preparation for this article. You can find my full end result in [this repository](https://github.com/DaveBitter/remix-jokes).

```jsx

import type { ActionFunction } from "remix";

import { redirect } from "remix";

import { db } from "~/utils/db.server";


export const action: ActionFunction = async ({
request
}) => {
const form = await request.formData();
const name = form.get("name");
const content = form.get("content");
// we do this type check to be extra sure and to make TypeScript happy
// we'll explore validation next!
if (
  typeof name !== "string" ||
  typeof content !== "string"
) {
  throw new Error(`Form not submitted correctly.`);
}


const fields = { name, content };


const joke = await db.joke.create({ data: fields });
return redirect(`/jokes/${joke.id}`);
};


export default function NewJokeRoute() {
return (
  <div>
    <p>Add your own hilarious joke</p>
    <form method="post">
      <div>
        <label>
          Name: <input type="text" name="name" />
        </label>
      </div>
      <div>
        <label>
          Content: <textarea name="content" />
        </label>
      </div>
      <div>
        <button type="submit" className="button">
          Add
        </button>
      </div>
    </form>
  </div>
);
}

```

There is a basic form (with no client-side JS) that just posts on submit. The `action` function is then called where we can then get the form data and handle it like normal. But what about validation? Naturally, you want to do this on the server, but it's considered good practice to do this on the client as well. The nice thing about having everything in this file is that we can reuse the same validation function in both places. Here's another snippet with just server-side validation implemented.

```jsx

import type { ActionFunction, LoaderFunction } from "remix";

import {
  useActionData,
  redirect,
  Form
} from "remix";

import { JokeDisplay } from "~/components/joke";

import { db } from "~/utils/db.server";

import {
  requireUserId,
  getUserId
} from "~/utils/session.server";


export const loader: LoaderFunction = async ({
  request
}) => {
  const userId = await getUserId(request);
  if (!userId) {
      throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};


function validateJokeContent(content: string) {
  if (content.length < 10) {
      return `That joke is too short`;
  }
}


function validateJokeName(name: string) {
  if (name.length < 2) {
      return `That joke's name is too short`;
  }
}


type ActionData = {
  formError?: string;
  fieldErrors?: {
      name: string | undefined;
      content: string | undefined;
  };
  fields?: {
      name: string;
      content: string;
  };
};


export const action: ActionFunction = async ({
  request
}): Promise<Response | ActionData> => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (
      typeof name !== "string" ||
      typeof content !== "string"
  ) {
      return { formError: `Form not submitted correctly.` };
  }


  const fieldErrors = {
      name: validateJokeName(name),
      content: validateJokeContent(content)
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
      return { fieldErrors, fields };
  }


  const joke = await db.joke.create({
      data: { ...fields, jokesterId: userId }
  });
  return redirect(`/jokes/${joke.id}`);
};


export default function NewJokeRoute() {
  const actionData = useActionData<
      ActionData | undefined
  >();


  return (
      <div>
          <p>Add your own hilarious joke</p>
          <Form method="post">
              <div>
                  <label>
                      Name:{" "}
                      <input
                          type="text"
                          defaultValue={actionData?.fields?.name}
                          name="name"
                          aria-invalid={
                              Boolean(actionData?.fieldErrors?.name) ||
                              undefined
                          }
                          aria-describedby={
                              actionData?.fieldErrors?.name
                                  ? "name-error"
                                  : undefined
                          }
                      />
                  </label>
                  {actionData?.fieldErrors?.name ? (
                      <p
                          className="form-validation-error"
                          role="alert"
                          id="name-error"
                      >
                          {actionData.fieldErrors.name}
                      </p>
                  ) : null}
              </div>
              <div>
                  <label>
                      Content:{" "}
                      <textarea
                          defaultValue={actionData?.fields?.content}
                          name="content"
                          aria-invalid={
                              Boolean(actionData?.fieldErrors?.content) ||
                              undefined
                          }
                          aria-describedby={
                              actionData?.fieldErrors?.content
                                  ? "content-error"
                                  : undefined
                          }
                      />
                  </label>
                  {actionData?.fieldErrors?.content ? (
                      <p
                          className="form-validation-error"
                          role="alert"
                          id="content-error"
                      >
                          {actionData.fieldErrors.content}
                      </p>
                  ) : null}
              </div>
              <div>
                  <button type="submit" className="button">
                      Add
                  </button>
              </div>
          </Form>
      </div>
  );
}

```

Note that we return the validation messages if there is something wrong and render the page again accessing them with the `useActionData` hook. If the form validates fine, we can redirect to the overview page.

> This is a great example of how easy it can be to create an interactive part of your web application without the need for client-side JS for something that has web standards. Sure you can, but Remix is built in a way where you take this approach first.


## Resource routes

If I would've build the previous form without any client-side JS in Next.js, I would've had to build a Next.js API route. These are incredibly powerful. You can read more about these API routes in my article [Next.js API routes](https://www.davebitter.com/articles/next-js-api-routes). With Remix, you can do exactly the same, but even more. Remix doesn't just offer this for, for instance, JSON responses, but for any kind of response really. You can create a file with a special naming pattern like `/app/routes/jokes[.]rss.tsx`. The `[.]rss` part tells Remix that you will return a `.rss` file. In this code snippet, you can see how something like this could work.

```jsx

import type { LoaderFunction } from "remix";

import { db } from "~/utils/db.server";


export const loader: LoaderFunction = async ({
  request
}) => {
  const jokes = await db.joke.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: { jokester: { select: { username: true } } }
  });


  const host =
      request.headers.get("X-Forwarded-Host") ??
      request.headers.get("host");
  if (!host) {
      throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost")
      ? "http"
      : "https";
  const domain = `${protocol}://${host}`;
  const jokesUrl = `${domain}/jokes`;


  const rssString = `
  <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
    <channel>
      <title>Remix Jokes</title>
      <link>${jokesUrl}</link>
      <description>Some funny jokes</description>
      <language>en-us</language>
      <generator>Kody the Koala</generator>
      <ttl>40</ttl>
      ${jokes
          .map(joke =>
              `
          <item>
            <title>${joke.name}</title>
            <description>A funny joke called ${joke.name}</description>
            <author>${joke.jokester.username}</author>
            <pubDate>${joke.createdAt}</pubDate>
            <link>${jokesUrl}/${joke.id}</link>
            <guid>${jokesUrl}/${joke.id}</guid>
          </item>
        `.trim()
          )
          .join("\n")}
    </channel>
  </rss>
`.trim();


  return new Response(rssString, {
      headers: {
          "Cache-Control": `public, max-age=${60 * 10
              }, s-maxage=${60 * 60 * 24}`,
          "Content-Type": "application/xml",
          "Content-Length": String(Buffer.byteLength(rssString))
      }
  });
};

```

How cool is that! The routes folder is not just for HTML pages, but you can create routes for any resource you need, hence the name resource routes.

## Nested route utility exports

I found the utility exports that Remix offers on nested routes incredibly nice to use. Previously, I mentioned you could import CSS on nested routes and have it scoped and chuncked to just that nested route. There are a variety of other Remix utilities you can use scoped to a nested route.

### SEO

You probably want to add some meta-tags to your pages. You can do this easily by exporting a `MetaFunction` on (nested) routes. Let's say you have some basic meta-tags on the root of the pages under `app/root.tsx`. You can export that function there like so:

```jsx
export const meta: MetaFunction = () => {

const description = `Learn Remix and laugh at the same time!`;
return {
  description,
  keywords: "Remix,jokes",
  "twitter:image": "https://remix-jokes.lol/social.png",
  "twitter:card": "summary_large_image",
  "twitter:creator": "@remix_run",
  "twitter:site": "@remix_run",
  "twitter:title": "Remix Jokes",
  "twitter:description": description
};
};

```

But you might want to update the title or description for a specific nested route. You guessed it, you can export the same function with different values there to extend this base set of meta tags. I think that's pretty sweet.

### Error handling

You can export a `CatchBoundary` and `ErrorBoundary` function for every (nested) route.

```jsx

export function CatchBoundary() {
  const caught = useCatch();


  if (caught.status === 404) {
      return (
          <div className="error-container">
              There are no jokes to display.
          </div>
      );
  }
  throw new Error(
      `Unexpected caught response with status: ${caught.status}`
  );
}


export function ErrorBoundary() {
  return (
      <div className="error-container">
          I did a whoopsies.
      </div>
  );
}

```

This will help you with two things. You can notify the user with some custom message on the page, but more importantly, you can isolate this error to just the nested route. The rest of you're application will run fine. This helps you think about how you want to handle your not so optimal flow.

## Finally, loading some client-side JS for the first time

During the Jokes app tutorial, I didn't even realize that hadn't written any client-side JS yet. I think it's really cool that Remix doesn't load any client-side JS by default. Naturally, you might need some client-side JS so you can load the `<Scripts />` component. This is the first time you will see JS files in your network tab. These optimised and chuncked files will be loaded and "hydrate" your application on the client.

## Verdict.

I'm a big advocate of Progressive Enhancement to make web applications simple, accessible and resilient. You can read some of my articles on this [here](https://www.davebitter.com/tags/progressive-enhancement). I usually put this to practice for just components. Seeing Remix take this approach to the entire application gives me hope for a future of building great web applications using web standards and progressive enhancement.


For the first time in years, I felt like a "web developer" again instead of a JS engineer. It's incredible fun to start thinking about how to leverage these standards smartly. I'm very excited about what Remix will offer and will definitely continue researching Remix and sharing it with all of you. Thanks for reading!
