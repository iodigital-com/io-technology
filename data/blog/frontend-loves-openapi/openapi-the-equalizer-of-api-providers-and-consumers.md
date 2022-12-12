---
title: 'OpenAPI, the equalizer of API providers and consumers'
date: '2022-12-29'
tags: ['frontend', 'API', 'Architecture']
summary: 'How would you incorporate OpenAPI within your project? In this chapter, we'll explore the two main approaches to using OpenAPI and the benefits of each workflow.'
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

## Code First

The Code First workflow is where the API provider is the Source Of Truth of your API definition. In cases where an API provider is built using a well-maintained framework, chances are that there is a plugin available to automatically generate an OpenAPI document from the API endpoints and data models.

This workflow is useful when you have an existing RESTful API provider with plans to document it.

## Design First

With the Design First approach, we start with the OpenAPI document. The OpenAPI document is the Single Source of Truth for your API definitions. This workflow allows for more collaboration between teams within a project. The document will be the neutral common ground for teams to discuss data flows and formats.

By placing a Design First OpenAPI document in a Git repository, teams can collaborate using the power over version control and propose changes via Pull or Merge requests.

It is great for new projects that need to build RESTful API providers and/or API consumers.
