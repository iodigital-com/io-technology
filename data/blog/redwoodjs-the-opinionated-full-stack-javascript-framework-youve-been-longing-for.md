---
title: "RedwoodJS: The opinionated full-stack JavaScript framework you've been longing for"
date: '2023-03-15'
tags: ['JavaScript', 'RedwoodJS']
images: ['/articles/redwoodjs-the-opinionated-full-stack-javascript-framework-youve-been-longing-for/redwoodjs-the-opinionated-full-stack-javascript-framework-youve-been-longing-for.jpg']
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
platforms; iOS, Android, Samsung’s Tizen OS, LG WebOS, Apple TV, Roku, and Amazon Fire Stick. All of that from an
extensive webpack build config.

Aren't we just blessed to be JS developers? We craft amazing user experiences using an unparalleled ecosystem and NPM
installing our way to glory. We pick and choose which tools fit our use cases and glue all bits and parts together to
craft the right experiences for our users.

## Analysis paralysis

In all that flexibility and modularity lies this situation where you have to make lots of decisions about which tools to
use and how you use them. You evaluate how reliable they are, how the TypeScript support is and how well maintained they
are. You usually also take into consideration how they are regarded by peers, how probable it is that this tool will be
a good fit for your project on the long run, but maybe most important: how fun it is to work with. Remember, we went to
great lenghts just so we don't have to write jQuery anymore.

All these decisions are not trivial! They affect real people, so it is worth it. This ceremony of setting up your
project can take weeks at best. Sure, some of us work smart and create starter templates as a base for our projects. But
have you considered that with this hundreds, potentially thousands of developers have basically built their own version
of create-react-app?

By standing on the shoulders of able to build great things. However, in JS-land we somehow too often feel the need to
construct our own giants first.

## Convention over Configuration

According to wikipedia:

> Convention over configuration (also known as coding by convention) is a software design paradigm used by software
> frameworks that attempts to decrease the number of decisions that a developer using the framework is required to make
> without necessarily losing flexibility and don't repeat yourself (DRY) principles.

The concept was introduced by DHH to describe the philosophy behind the Ruby on Rails framework. It is related to
earlier ideas such as sensible defaults.

This philosophy has somewhat been missing in the JS ecosystem. We have seen some projects that do carry this forward,
notably AdonisJS and BlitzJS. But RedwoodJS feels like the one I have been longing for. They started development in 2020
and released their 1.0 around April 2022. To me, they hit the right balance of being opinionated, yet remaining flexible
enough.

By no means RedwoodJS is making everything simple. In fact, it is quite an investment to learn it and get used to the
conventions. But it's packed with the right decisions and tools for the majority of CRUD apps. Equipping RedwoodJS as
your toolbelt is likely to pay off in the long run.

This full-stack framework is built on top of React, GraphQL, Fastify and Prisma. It is a batteries-included framework
that comes with a lot of features out of the box. It

## Getting Started with RedwoodJS

RedwoodJS has been my go-to framework for my side projects for the past months. And I have not looked back. It provides
a batteries included developer experience with baked in routing, auth, data fetching (with Cells), Prisma as an ORM,
Storybook, a Jest-based testing suite, and much more.

One of the things I like is that there is a "redwood way" for almost everything. I can simply refer to the documentation
or ask a question on forums or discord. The core maintainers seem to love engaging with everyone in the community.

The [tutorial](https://redwoodjs.com/docs/tutorial/foreword) is the best starting point for getting familiar with this
full-stack framework. It is by far the best written framework tutorial that I have read.

## Conclusion

While I have no regret for my decision to abandon my former stack, I do feel that I have been missing out on a lot of
the benefits that a batteries-included framework can provide. I am excited to see what the future holds for RedwoodJS.
