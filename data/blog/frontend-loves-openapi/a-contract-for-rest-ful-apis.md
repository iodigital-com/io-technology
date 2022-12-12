---
title: 'A contract for RESTFul APIs'
date: '2022-12-15'
tags: ['frontend', 'API', 'Architecture']
summary: ''
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

We start off with a small interactive segment by exploring ways Front-end developers can communicate with services to consume data. We segue into the model of communication. Just like in the basic definition of communication, we have a transmitter, a receiver and a contract on how both parties should communicate. And these models of communication are easily translatable towards modern front-end development.

In the olden days, we had everything in one place. Back- and front-end intertwined with each other in one single project. But with the advent of more mature front-end development workflows and more complex front-end requirements, front- and backend diverged towards separate projects. Those projects need to communicate with each other.

## Contracts

The types of communication between software parties that I experienced and still experience to this day are RESTful APIs using HTTP and JSON, GraphQL and, more recently, tRPC. All of these technologies have one thing in common at their core. They all have a concept of a contract to inform us which data the provider provides and which data the consumer can consume. GraphQL has the schema, and tRPC uses TypeScript. Expect RESTful APIs. See, the concept of RESTful APIs is more of a pattern than an actual specification. It is a combination of the HTTP spec. and the JSON spec. A contract isn't a requirement for utilising RESTful APIs. However, seeing the RESTful APIs, in my company at least, is a technology pattern with a low entry barrier. We can quickly test APIs in our browser's console or run a cURL command in our terminal. A contract should be mandatory to ensure team efficiency.

And this is where the OpenAPI specification comes in.

## OpenAPI specification

The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs, allowing humans and computers to discover and understand the service's capabilities without access to source code, documentation, or through network traffic inspection. When properly defined, a consumer can understand and interact with the remote service with a minimal amount of implementation logic.

The OpenAPI specification, formerly known as the Swagger specification, introduces itself as a solution for defining ways of communicating over RESTful APIs, easily understandable by humans and computers, without anyone having to check out the API provider or consumer source code. It's one or more files describing how and what data a RESTful API provides and consumes.
