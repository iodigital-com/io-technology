---
title: '_Progressively Enhance_ Handling Your Forms With React.js _Server Actions_'
date: '2024-03-07'
tags: ['frontend', 'react', 'javascript']
images: ['/articles/progressively-enhance-handling-your-forms-with-react-server-actions/hero.png']
summary: 'A large part of adding interactivity to your applications is through forms. Single Page Applications SPAs have not always handled this part the best. Let’s have a look at how we can use React server actions to handle your forms progressively enhanced.'
authors: ['dave-bitter']
theme: 'blue'
---

## The issue with the rise of SPAs in the past

When we moved to SPAs in the past we introduced a big issue to our web applications. It didn’t work without JavaScript. Whilst this has been disregarded by many as “our users run the JavaScript on their device”, there is a serious fault in this view.

![Tweet by Jake Archibald saying: "We don't have any non-JavaScript users". No, all your users are non-JS while they're loading your JS](/articles/progressively-enhance-handling-your-forms-with-react-server-actions/jake-archibald-tweet.png)

As Jake Archibald pointed out (back in 2012!), there is a variety of situations where your JavaScript is not available to the user. It may not have been downloaded yet, your CDN might be down and more.

Frameworks like Next.js render your React.js web applications on the server so it will at least render the HTML. Regardless of whether your client-side JavaScript loads, the user will still be able to view the information on the page. This is a must-have feature as before, you would simply see a white page if the React bundle did not load.

For some reason, developers seem to think that now we use server-side rendering, our applications are good enough. For static pages without much user interaction, this may be true, but as soon as there is input required from the user, these pages fully rely on the client-side JavasScript. Why is this?

As with SPAs, we just had an empty static HTML file where a JavaScript bundle would inject the whole web application, there was no way of handling a form request. There was no server to handle it. So what did we do? We created a separate API where we would be able to receive and handle requests made from our front end. The added benefit is the performance of not having a full page reload as well. In our front-end, we would intercept the submit event of the form element, gather the data, create the request and finally submit it to our API. In practice, I even saw that developers stopped using the form element altogether as they had no real use for it anymore. Instead, we ended up with a bunch of client-side state to hold the latest data the user inputted and even more to sanitize, validate and send over this data. What a shame!

## Using the web platform instead of fighting against it

The big issue I noticed was how much we were fighting against the web as a platform. The web has a standardized way to work with sending over data to a server. Forms! So why would we so actively prevent the default behaviour and implement our own way?

Well, we kind of had to. SPA frameworks were designed to just be a thing static layer that makes requests to APIs. Remember the term [Jamstack](https://jamstack.org/)? Whilst this had advantages like, for instance, making it easier to deploy and work on, it also brought the downsides I mentioned before.

As frameworks like Next.js got popular, we’ve solved the server-side rendering issue of our web applications, but never really focused on the form handling issues. The first time I used a real solution for this was [back when I looked into Remix](https://techhub.iodigital.com/articles/first-look-at-remix). They provided an elegant way for developers to not just handle forms, but handle them progressively enhanced.

In essence, this approach is simple. Start with making sure you offer a solution that will work for every user. Next, when more functionality is available for the users, enhance the user experience. In the case of forms, being able to submit them to a back-end without the need for any client-side JavaScript. Then, when it is available, handle the request client-side and update the UI.

In my opinion, [Remix action functions](https://www.davebitter.com/articles/remix-loaderfunction-vs-actionfunction#actionfunction) handle this very well. It offers developers the tools to make it easy to work with the platform and it will make sure to optimize the user experience once client-side JavaScript is available. But providing developers with the tools to work with the web platform shouldn’t be up to Remix, this should already be possible in React.js itself.

## React.js Server Actions

The React team has been working hard on server-side React for the past years. Next to being able to render your components server side using [React Server Components](https://www.patterns.dev/react/react-server-components/), we are finally getting a way in React to handle forms on the server properly!

Imagine this form in your React web application:

![Untitled](/articles/progressively-enhance-handling-your-forms-with-react-server-actions/form.png)

With just the HTML and CSS for this form, the browser will try to submit this to the back-end where no server is handling this POST request. The browser will reload the page and the submitted form data will be in the URL as query parameters:

![The form does not get properly handled resulting in a full-page reload with all the form data in the URL bar as query parmaters](/articles/progressively-enhance-handling-your-forms-with-react-server-actions/client-side-form.gif)

So what do you do as a developer? You listen for the handle submit event and call `preventDefault` on the submit event to handle it yourself:

```jsx
// page.js
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    // Do something with data. Most likely, send it to the server using fetch

    // Redirect the user to the new page
    router.push('/thank-you')
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

Oh no! Our page is now fully reliant on client-side JavaScript. This is how quickly these things sneak in. So what if we can pass a server-side React.js function to the form to handle the actual form POST request? First we create an `action.js` file with the `"use server"` directive where we export our server side function that handles the form submission.

```jsx
// actions.js
'use server'
import { redirect } from 'next/navigation'

export async function handleSubmit(formData) {
  const data = Object.fromEntries(formData)

  // Do something with data. Most likely, store it in your database

  // Redirect the user to the new page
  redirect('/thank-you')
}
```

Oh no! Our page is now fully reliant on client-side JavaScript. This is how quickly these things sneak in. So what if we can pass a server side React function to the form to handle the actual form POST request? First we crea

```jsx
// page.js
import { handleSubmit } from './submit.js'

export default function Page() {
  return <form action={handleSubmit}>...</form>
}
```

That’s it, by slightly altering the way we handle the form, we can now make use of React server actions and provide Progressive Enhancement out of the box!

![A form gets handled appropriately by a React.js Server Action](/articles/progressively-enhance-handling-your-forms-with-react-server-actions/server-side-form.gif)

## Once stable, make this the standard

React Server Actions are coming with the upcoming release of React 19. You can already use it from Next.js 14. We finally have a solid solution to handling forms in React.js. Make sure to spend an afternoon learning how to use this. Besides handling basic form requests, there are a few other features to improve the user experience surrounding forms. Make sure to read up on these resources to get an overview of what is possible:

- React.js Server Actions: https://react.dev/reference/react/use-server
- Next.js Server Actions: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions
