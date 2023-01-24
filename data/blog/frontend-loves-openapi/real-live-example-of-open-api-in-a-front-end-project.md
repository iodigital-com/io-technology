---
title: 'Real live example of OpenAPI in a front-end project'
date: '2023-01-12'
tags: ['frontend', 'API', 'Architecture']
summary: ''
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

I've created a [demo repository](https://github.com/vanhoofmaarten/openapi-monorepo-demo) showing the power of OpenAPI and automation in a front-end project.

[vanhoofmaarten/openapi-monorepo-demo](https://github.com/vanhoofmaarten/openapi-monorepo-demo) (github.com)

The project is set up as a monorepo. Each domain lives as a separate entity in the packages folder, but because they are very much interdependent, they are within the same repository.

The OpenAPI document is fetched from a different repository using [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules). It contains its own linting rules and own automation. We include it in our project to refer to the OpenAPI document itself.

The `sdk` folder only contains the configuration and scripts for generating a TypeScript-based API client by [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen/). Git ignores generated files.

The `mocks` folder contains the configuration and scripts to run the [Prism](https://github.com/stoplightio/prism) mocking server.

The `front-end` folder contains a Vite application dependent on the SDK folder. In the main.ts file, we import the `PetsService`, set the SDK base URL, and fetch data with the `listPets` method. The retrieved data will be outputted in the HTML element with the id `preview`.

With the help of Lerna, a tool to orchestrate monorepo tasks, when running `npm run dev`, our entire development will start with just one command. First, it will generate the SDK. Then it will start the Vite dev environment and the mocking server in parallel.

When we visit the front-end development server on the provided address, typically at `http://localhost:3000`, we see our list of mocked data, verifying that our solution works.
