---
title: 'OpenAPI, a contract for RESTFul APIs'
date: '2022-12-15'
tags: ['frontend', 'API', 'Architecture']
summary: 'To optimize project effeciency and to ensure a good communication between teams, we need contracts for our APIs. In this article, I will explain what the OpenAPI specification is and how it can help us to create contracts for our RESTful APIs.'
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

Dag beste lezer, bonne journée, cher lecteur or Good day, dear reader.

The medium we choose to communicate with each other is one of the critical parts of the most basic communication definition. In that definition, we have a transmitter, a receiver, and a contract. That contract can be a language like Dutch, French, English, like the first sentence of this article, sign language, body language, braille, the beacons of Gondor, you name it. The same goes for software. Application Programming Interfaces are the medium we use to communicate with each piece of software.

In the 2020's we are seeing more and more web projects move to a composable architecture. For example, from a monolith CMS setup, where one single part is responsible for both the front- and backend, to a headless setup where the front- and backend are separate projects with often more and more separate teams, each master of their domain. Or even a microservices architecture where each application part is an independent project. Each of these projects, whether that be between internal or external teams, needs to know how to communicate with each other. That's why we need contracts for our APIs.

## Contracts

The types of communication between software parties that I experienced and still experience to this day are RESTful APIs using HTTP and JSON, [GraphQL](https://graphql.org/) and, more recently, [tRPC](https://trpc.io/). All of these technologies have one thing in common at their core. They all have a concept of a contract to inform us which data the provider provides and which data the consumer can consume. GraphQL has the schema, and tRPC uses TypeScript. Expect RESTful APIs.

See, the concept of RESTful APIs is more of a pattern than an actual specification. It is a combination of the HTTP spec. and the JSON spec. A contract isn't a requirement for utilising RESTful APIs. However, seeing the RESTful APIs, in my company at least, is a technology pattern with a low entry barrier. We can quickly test APIs in our browser's console or run a cURL command in our terminal. A contract should be mandatory to ensure team efficiency.

And this is where the OpenAPI specification comes in.

## OpenAPI specification

> The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs, allowing humans and computers to discover and understand the service's capabilities without access to source code, documentation, or through network traffic inspection. When properly defined, a consumer can understand and interact with the remote service with a minimal amount of implementation logic.

— [Introduction of the OpenAPI specification v3.0.3](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#introduction)

The OpenAPI specification, formerly known as the Swagger specification, introduces itself as a solution for defining ways of communicating over RESTful APIs, easily understandable by humans and computers, without anyone having to check out the API provider or consumer source code. It's one or more files describing how and what data a RESTful API provides and consumes.

At it's basis, it's a YAML or JSON file, structured in a specific way to describe how and which types of data can be entered and will be outputted by a RESTful API provider.

How such a file looks like, I will explain in the next part of this series.
