---
title: "Convention over Configuration with RedwoodJS"
date: '2023-04-27'
tags: ['JavaScript', 'RedwoodJS']
images: ['/articles/convention-over-configuration-with-redwoodjs/convention-over-configuration-with-redwoodjs.jpg']
summary: 'We have seen how the industry has continuously raised the level of abstraction to allow developers to spend more time
delivering functionality and less time writing low-level infrastructure. Even though JavaScript is the most versatile
programming language on the planet, we still have a long way to go.'
authors: ['lee-ravenberg']
theme: 'rouge'
---

## Javascript all the things

My career started off as a back-end developer, I wrote PHP and built apps with Symfony and Laravel.
But I was quick to ditch all of that once I discovered React and Webpack. This was back in 2017 when worked at a startup
that built online TV channels. Their stack was web-based and their client app had build targets for all of these
platforms; iOS, Android, Samsung Tizen OS, LG WebOS, Apple TV, Roku, and Amazon Fire Stick. All of that from an
extensive webpack build config.

Aren't we just blessed to be JS developers? We craft amazing user experiences using an unparalleled ecosystem and NPM
installing our way to glory. We pick and choose which tools fit our use cases and glue all bits and pieces together to
craft the right experiences for our users.

## The problem with our ecosystem

In all that flexibility and modularity lies this situation where you have to make lots of decisions about which tools to
use and how you use them. You evaluate how reliable they are, how the TypeScript support is, and how well-maintained they
are. You usually also take into consideration how they are regarded by peers, how probable it is that this tool will be
a good fit for your project right now, but also in the long run when your app and your team needs to scale. But maybe
most important: how fun it is to work with. Remember; We went to great lengths just so we don't have to write jQuery anymore.

All these decisions are not trivial! They affect real people, so it is worth it. This ceremony of setting up a new project can take weeks. Sure, some of us work smart and create starter templates as a base for our projects. But
take into consideration that with that hundreds, potentially thousands of developers have built a bunch of similar React starter boilerplate projects.

By standing on the shoulders of giants we are able to build great things. However, in JS-land we somehow too often feel the need to
construct our own giants first.

## Convention over Configuration

According to Wikipedia:

> Convention over configuration (also known as coding by convention) is a software design paradigm used by software
> frameworks that attempts to decrease the number of decisions that a developer using the framework is required to make
> without necessarily losing flexibility and don't repeat yourself (DRY) principles.

The concept was introduced by David Heinemeier Hansson to describe the philosophy behind the Ruby on Rails framework. It is related to
earlier ideas such as sensible defaults. This philosophy has somewhat been missing in the JS ecosystem. We have seen some projects that do carry this forward,
notably [AdonisJS](https://adonisjs.com/), [BlitzJS](https://blitzjs.com/), and of course [MeteorJS](https://www.meteor.com/).

Redwood feels like the one I have been longing for. They started development in 2020
and released their 1.0 around April 2022. To me, they hit the right balance of being opinionated, yet remaining flexible
enough. This full-stack framework is built on top of React, GraphQL, Fastify and Prisma. It is a batteries-included framework
that comes with a lot of features out of the box. Nothing to fancy, new or cutting edge. But mature and proven tools to build
quality applications that are still considered modern.

Besides that, the community is really great! They have an active Discord, a community forum and organize online events
regularly. The core maintainers are a team of mature, experienced engineers who are not shy of listening to feedback
and providing support.

### Mono repo

Once you initialise a new Redwood project, you get a mono repo with Yarn Workspaces. The client and server are decoupled through their respective **_api_** and **_web_** folders.

![File structure](/articles/convention-over-configuration-with-redwoodjs/filestructure.png)

### Mapping

Within the api directory you find a **_db_** folder in which Prisma ORM related files reside. The subdirectories within the **_src_** directory:

- _**directives**_ - GraphQL directives
- _**functions**_ - serverless functions
- _**graphql**_ - GraphQL SDL files
- _**lib**_ - miscellaneous files
- _**service**_ - your GraphQL resolvers

Redwood conveniently takes care of the mapping of GraphQL resolvers to queries and mutations.

![Api](/articles/convention-over-configuration-with-redwoodjs/api.png)

### Front-end

In the web directory you find a structure that is similar to probably most React applications. Redwood is a little less opinionated here.
The only convention it imposes are the defining of routes in **_Routes.js_**, making your page root component reside in the **_pages_** directory and handling data fetching using [Cells](https://redwoodjs.com/docs/cells), which typically reside in the _**components**_ directory.

Other than that it is up to you to decide how you want to structure your application. Redwood provides a useful way to handle forms using a wrapper around React Hook Form, but that is totally optional. You can use any state management library you want, any styling library, any component library, and so on.

![Front-end](/articles/convention-over-configuration-with-redwoodjs/front-end.png)

### Auth

Redwood comes with a built-in authentication system. Initializing it is as simple as running the following command:

```bash
yarn redwood setup dbAuth
```

The `dbAuth` argument is the argument used to indicate the auth provider you want to use (self-hosted in the dbAuth case).
Redwood supports a number of auth providers out of the box, including Auth0, Firebase, Supabase and SuperTokens.
But the framework also exposes interfaces for integrating a custom auth provider.

The generator commands are vey useful. If you want, you can quickly generate login, registration and password-reset pages with:

```bash
yarn redwood generate dbAuth
```

Checking authorization is done with roles. To protect sections of your app for admin-only access you can wrap the `<Private>` component around routes:

```jsx
<Router>
  <Route path="/" page={HomePage} name="home" />
  <Route path="/article/{id:Int}" page={ArticlePage} name="article" />

  <Private unauthenticated="home" roles="admin">
    <Route path="/admin/posts/new" page={PostNewPostPage} name="newPost" />
    <Route path="/admin/posts/{id:Int}/edit" page={PostEditPostPage} name="editPost" />
    <Route path="/admin/posts/{id:Int}" page={PostPostPage} name="post" />
    <Route path="/admin/posts" page={PostPostsPage} name="posts" />
  </Private>
</Router>
```

To control access to GraphQL queries and mutations you pass the roles as an argument to the `requireAuth()` directive:

```graphql
type Mutation {
  createPost(input: CreatePostInput!): Post! @requireAuth(roles: ["admin"])
  updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth(roles: ["admin"])
  deletePost(id: Int!): Post! @requireAuth(roles: ["admin"])
}
```

Redwood secures its GraphQL api by default. When you omit the `requireAuth()` directive, it will still apply it to queries
and mutations in the background for you. They are not accessible, unless you deliberately annotate them with the
`skipAuth()` directive.

## Tradeoffs

Redwood has been my go-to framework for my side projects for the past months. And I have not looked back. It provides
a batteries included developer experience with baked in routing, auth, data fetching (with Cells), Prisma as an ORM, a powerful CLI,
a Storybook setup, a Jest-based testing suite, and much more.

But by no means Redwood is making everything simple. In fact, it is quite an investment to learn it and get used to some
of the conventions. But it's packed with the right decisions and tools for the majority of apps. Equipping Redwood as
your toolbelt is likely to pay off in the long run.

It's also worth mentioning that while building CRUD apps with Redwood is a breeze, you might want to evaluate whether the
prerender feature is sufficient for your use case when server side rendering is your primary concern. There might be
better options out there.

Finally, while I think their docs are great, there are not that many resources out there that are suitable for complete
beginners to programming. You can get pretty far without knowing much about React, GraphQL, or Prisma. But there comes
a point where you need to dive deeper into these technologies which carry their own learning curve.

## Getting started

Interested in getting started with Redwood? The [tutorial](https://redwoodjs.com/docs/tutorial/foreword) is the best
starting point for getting familiar with this full-stack framework. It is by far the best written framework tutorial
that I have read. After that, build something cool with it. You can pretty easily deploy Redwood applications
with hosting services like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

While I do not miss working with my former PHP-based tech stack, I do feel that I have been missing out on a lot of the
benefits that a fully featured full-stack framework can provide. The facets that are essential for building high-quality
software, but are not particularly related to the essence of the applications that I am working on. Therefore, I am
thrilled to see what the future holds for Redwood.
